import {
  flexRender, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import { Badge, Button, Dropdown, DropdownItem, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import s1 from "../../../../src/assets/images/profile/user-1.jpg";
import EditLeadmodal from "./EditLeadmodal";
import { useDispatch, useSelector } from "react-redux";
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan";
import { toast } from "react-toastify";
import PaginationComponent from "src/utils/PaginationComponent";
import ComonDeletemodal from "../../../utils/deletemodal/ComonDeletemodal";
import { DeleteLeads, GetFollowupLeads, GetLeads, UpdateLeads } from "src/features/leadmanagment/LeadmanagmentSlice";
import noData from "../../../../src/assets/images/svgs/no-data.webp"
import type { AppDispatch } from "src/store";
import Select from 'react-select';
import ViewLeadmodal from "./ViewLeadmodal";
import FollowUpmodal from "./FollowUpmodal";

export interface PaginationTableType {
  id?: string;
  avatar?: string | any;
  name?: string;
  email?: string;
  status?: any;
  phone?: string;
  source?: any;
  material?: string;
  quantity?: string;
  unit?: string;
  size?: string;
  state?: string;
  district?: string;
  tehsil?: string;
  address?: string;
  created_at:any;
  actions:any
}


const columnHelper = createColumnHelper<PaginationTableType>();
const leadStatuses = ["New", "Contacted", "Interested", "Converted", "Lost"];

function LeadsTable({searchText ,toDate ,fromDate}) {
  const [isOpen, setIsOpen] = useState(false);
  const users = useSelector((state: any) => state.leadmanagement.leadsdata);
  const notesLeads = useSelector((state: any) => state.leadmanagement.getnotesData);
  const [data, setData] = useState<PaginationTableType[]>(users);
  const [selectedRow, setSelectedRow] = useState<PaginationTableType | null>(null);
    const [followupdata, setFollowupData] = useState<any>(notesLeads);
  const [filters, setFilters] = useState<{ [key: string]: string }>({ qa_qc_status: '' });
  const dispatch = useDispatch<AppDispatch>()
  const [editModal, setEditModal] = useState(false);
  const modalPlacement = "center";

  const [viewModal, setViewModal] = useState(false);
  const [followUpModal, setFollowupModal] = useState(false);
 const uniqueDistricts = Array.from(
  new Set(data?.map((item) => item?.district))
);

const uniquetehsile = Array.from(
  new Set(data?.map((item) => item?.tehsil))
);


const options = uniqueDistricts?.map((district) => ({
  value: district,
  label: district,
}));

const tehsileoptions = uniquetehsile?.map((tehsil) => ({
  value: tehsil,
  label: tehsil,
}));

  const handleEdit = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
    setEditModal(true);
  };

  useEffect(() => { setData(users) ,setFollowupData(notesLeads)  }, [users,notesLeads]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        await dispatch(GetLeads()).unwrap(); // unwrap makes it throw on error
      } catch (error) {

        console.error("Error fetching leads:", error);
      }
    };

   
    fetchLeads();
  }, []);

  const handleupdateuser = (updatedata) => {
    dispatch(UpdateLeads(updatedata)).unwrap().then(() => {
      toast.success("Lead updated successfully!");
      dispatch(GetLeads());
    }).catch((err) => {
      toast.error(err || "Failed to update lead.");
      console.error("Update error:", err);
    });
  };

  const handleDelete = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
    setIsOpen(true);
  };

  const handleConfirmDelete = async (userToDelete: PaginationTableType | null) => {
    if (!userToDelete) return;
    try {
      await dispatch(DeleteLeads(userToDelete?.id)).unwrap();
      setData(data.filter((user) => user.id !== userToDelete.id));
      toast.success("Lead Deleted Successfully");
    } catch (error: any) {
      console.error("Delete failed:", error);
      if (error?.response?.status === 404) toast.error("User not found.");
      else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
      else toast.error("Failed to delete user.");
    }
  };

  const handleStatuschange = (status:any, id:any) => {
    dispatch(UpdateLeads({ status, id })).unwrap().then(() => {
      toast.success("Lead Status Change successfully!");
      dispatch(GetLeads());
    }).catch((err) => {
      toast.error(err || "Failed to update lead.");
      console.error("Update error:", err);
    });
  };

  const handleView = async (row: PaginationTableType) => {
    setViewModal(true);
    setSelectedRow(row)
      if(row){
      try {
         await dispatch(GetFollowupLeads(row?.id)).unwrap(); // unwrap makes it throw on error
       } catch (error) {
         toast.error(error || "Failed to fetch leads"); // or use alert or console
         console.error("Error fetching leads:", error);
       }
    }
  };
  const handleNotes = async (row: PaginationTableType) => {
    setFollowupModal(true);
    setSelectedRow(row)
  };
const filteredData = useMemo(() => {
  if (!data) return [];

  return data.filter((item) => {

    const bySearch =
      !searchText ||
      Object.values(item).some((v) =>
        String(v).toLowerCase().includes(searchText.toLowerCase())
      );
    const byFilters = !filters || Object.keys(filters).every((key) => {
      const filterValue = filters[key]?.toLowerCase();
      if (!filterValue) return true;
      const value = item[key as keyof typeof item];

      if (typeof value === "string") {
        return value.toLowerCase().includes(filterValue);
      }
      if (Array.isArray(value)) {
        return value.some(
          (v) => typeof v === "string" && v.toLowerCase().includes(filterValue)
        );
      }
      return false;
    });
    const byDate = (() => {
      if (!fromDate && !toDate) return true;

const itemDate = new Date(item?.created_at);
itemDate.setHours(0, 0, 0, 0);

const from = fromDate ? new Date(fromDate) : null;
from?.setHours(0, 0, 0, 0);

const to = toDate ? new Date(toDate) : null;
to?.setHours(0, 0, 0, 0);

if (from && to) return itemDate >= from && itemDate <= to;
if (from) return itemDate >= from;
if (to) return itemDate <= to;
return true;
    })();
    return bySearch && byFilters && byDate;
  });
}, [data, filters, searchText,fromDate,toDate]);

  const columns = [
    columnHelper.accessor("name", {
      cell: (info) => (
        <div className="flex gap-3 items-center">
          <img src={s1} width={50} height={50} alt="icon" className="h-10 w-10 rounded-md" />
          <div className="truncate line-clamp-2 max-w-56">
            <h6 className="text-base">{info.row.original.name}</h6>
            <p className="text-sm text-darklink dark:text-bodytext">{info.row.original.email}</p>
          </div>
        </div>
      ),
      header: () => <span>Name</span>,
    }),
    columnHelper.accessor("phone", {
      cell: (info) => (
        <div className="truncate line-clamp-2 max-w-56">
          <p className="text-sm text-darklink dark:text-bodytext">{info.row.original.phone || "87328979"}</p>
        </div>
      ),
      header: () => <span>Phone</span>,
    }),
    columnHelper.accessor("status", {
      cell: (info) => {
        const status = info.row.original.status;
        const statusColorMap = {
          New: "info", Contacted: "secondary", Interested: "warning",
          Converted: "success", Lost: "failure"
        };
        return (
          <Badge color={statusColorMap[status] || "lightprimary"} className="capitalize">
            {status}
          </Badge>
        );
      },
      header: () => <span>Status</span>,
    }),
    columnHelper.accessor("source", {
      cell: (info) => {
        const source = info.getValue() as string;;
        const roleMap = {
          "India mart": "India mart",
          "Justdial": "Justdial",
          "Instagram": "Instagram",
          "Youtube": "Youtube",
          "FaceBook" :"FaceBook" ,
          "google": "google",
          "Refrence":"Refrence",
          "Other": "Other",
        };
        return <p className="text-darklink dark:text-bodytext text-sm">{roleMap[source] || ""}</p>;
      },
      header: () => <span>Source</span>,
    }),
    columnHelper.accessor("district", {
      cell: (info) => <span>{info.getValue() || "—"}</span>,
      header: () => <span>District</span>,
    }),
    // columnHelper.accessor("tehsil", {
    //   cell: (info) => <span>{info.getValue() || "—"}</span>,
    //   header: () => <span>Tehsil</span>,
    // }),
    columnHelper.accessor("actions", {
      cell: (info) => {
        const rowData = info.row.original;
        return (
          <div className="flex justify-start items-center gap-2">
          

            <Dropdown label=" Status" dismissOnClick={true} className="flex-wrap " color="primary" size="xs">
              {leadStatuses.map((status) => (
                <DropdownItem key={status} onClick={() => handleStatuschange(status, rowData.id)}>
                  {status}
                </DropdownItem>
              ))}
            </Dropdown>
          {info.row.original.status !== "Interested" && info.row.original.status !== "Lost" && (
  <Tooltip content="Follow up" placement="bottom">
    <Button
      size="sm"
      color={"lightinfo"}
      className="p-0"
      onClick={() => handleNotes(rowData)}
    >
      <Icon icon="simple-line-icons:user-follow" height={18} />
    </Button>
  </Tooltip>
)}
            <Tooltip content="View" placement="bottom" >
              <Button size="sm" color={"lightsecondary"} className="p-0" onClick={() => handleView(rowData)}>
                <Icon icon="hugeicons:view" height={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Edit" placement="bottom">
              <Button size="sm" className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white" onClick={() => handleEdit(rowData)}>
                <Icon icon="solar:pen-outline" height={18} />
              </Button>
            </Tooltip>

            <Tooltip content="Delete" placement="bottom">
              <Button size="sm" color="lighterror" className="p-0" onClick={() => handleDelete(rowData)}>
                <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
              </Button>
            </Tooltip>
          </div>
        );
      },
      header: () => <span>Action</span>,
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="overflow-auto">
        <div className="p-4">
          <div className="flex sm:flex-row flex-col gap-6 mb-4">
            <select id="source" value={filters.source} className="w-full border border-pink-200 focus:border-gray-300 focus:ring-0 rounded"
              onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}>
              <option value="">Filter Source</option>
              {["India mart", "Justdial", "Instagram", "Youtube", "FaceBook", "google", "Refrence","Other"].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <select id="status" value={filters.status} className="w-full border border-pink-200 focus:border-gray-300 focus:ring-0 rounded"
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}>
              <option value="">Filter Status</option>
              {leadStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <Select
              id="status"
              className="w-full"
              classNamePrefix="react-select"
              placeholder="Filter District"
              options={options}
              isClearable
              onChange={(selectedOption) =>
                setFilters(prev => ({ ...prev, district: selectedOption ? selectedOption.value : "" }))
              }
            />
            <Select
              id="status"
              className="w-full"
              classNamePrefix="react-select"
              placeholder="Filter Tehsil"
              options={tehsileoptions}
              isClearable
              onChange={(selectedOption) =>
                setFilters(prev => ({ ...prev, tehsil: selectedOption ? selectedOption.value : "" }))
              }
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => (
                    <th key={header.id} className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="bg-white dark:bg-gray-900">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8 px-4">
                    <div className="flex flex-col items-center">
                      <img
                        src={noData}
                        alt="No data"
                        height={100}
                        width={100}
                        className="mb-4"
                      />
                      <p className="text-gray-500 dark:text-gray-400">No data available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationComponent table={table} />
      </div>
      <FollowUpmodal  setPlaceModal={setFollowupModal} modalPlacement={modalPlacement} selectedRow={selectedRow} placeModal={followUpModal}  setFollowupData={setFollowupData} />
      <ViewLeadmodal setPlaceModal={setViewModal} modalPlacement={modalPlacement} selectedRow={selectedRow} placeModal={viewModal} followupdata={followupdata} />
      <ComonDeletemodal
        handleConfirmDelete={handleConfirmDelete}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedUser={selectedRow}
        title="Are you sure you want to Delete this Leads?"
      />
      <EditLeadmodal
        setEditModal={setEditModal}
        editModal={editModal}
        selectedUser={selectedRow}
        modalPlacement={modalPlacement}
        onUpdateUser={handleupdateuser}
      />
    </>
  );
}

export default LeadsTable;
