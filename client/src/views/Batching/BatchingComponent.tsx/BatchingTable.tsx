import { Badge, Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import noData from "src/assets/images/svgs/no-data.webp";
import CommonPagination from "src/utils/CommonPagination";
import { deleteBatching, GetBatching } from "src/features/batching/BatchingSlice";
import ComonDeletemodal from "../../../utils/deletemodal/ComonDeletemodal";
import { AppDispatch } from "src/store";
import EditBatchModal from "./EditBatchModal";
import { toast } from "react-toastify";
import ViewBatchModal from "./ViewBatchModal";
import AddBatchModal from "./AddBatchModal";
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";
import CardBox from "src/components/shared/CardBox";
import { useParams } from "react-router";

const BatchingTable = ({ logindata }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {id} = useParams();
  const { batchingdata, loading } = useSelector((state: any) => state.batching);
  

  const [showmodal, setShowmodal] = useState(false);
  const [editmodal, setEditmodal] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const [viewmodal, setViewmodal] = useState(false);
  const [selectedrow, setSelectedRow] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");

  useEffect(() => {
    dispatch(GetBatching(id));
  }, [dispatch]);

  const handleEdit = (entry: any) => {
    setEditmodal(true);
    setSelectedRow(entry);
  };

  const handleDelete = async (userToDelete: any) => {
    if (!userToDelete) return;
    try {
      await dispatch(deleteBatching(userToDelete?.id)).unwrap();
      dispatch(GetBatching(id));
      toast.success("The batching was successfully deleted.");
    } catch (error: any) {
      console.error("Delete failed:", error);
      if (error?.response?.status === 404) toast.error("User not found.");
      else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
      else toast.error("Failed to delete user.");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

 const filteredItems = (batchingdata || []).filter((item: any) => {
  const searchText = searchTerm.toLowerCase();

  const matchesSearch =
    (item?.mould_no || "").toString().toLowerCase().includes(searchText) ||
    (item?.operator_name || "").toString().toLowerCase().includes(searchText) ||
    (item?.shift || "").toString().toLowerCase().includes(searchText) ||
    (item?.batch_date ? formatDate(item?.batch_date).toLowerCase() : "").includes(searchText) ||
    (item?.entry_time || "").toString().toLowerCase().includes(searchText);

  const matchesShift = shiftFilter
    ? (item?.shift || "").toString().toLowerCase() === shiftFilter.toLowerCase()
    : true;

  return matchesSearch && matchesShift;
});
  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <BreadcrumbComp    items={[{ title: "Batching ", to: "/" }]}
        title="Batching List"/>
                <CardBox>

      <div className="">
        <div className="flex items-center gap-2 mb-3 justify-end">
          <input
            type="text"
            placeholder="Search by any field..."
            className=" border rounded-md border-gray-300 "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className=" border rounded-md border-gray-300 "
          >
            <option value="">All Shifts</option>
            <option value="day">Day</option>
            <option value="night">Night</option>
          </select>
        
        <Button
          onClick={() => {
            setShowmodal(true);
            triggerGoogleTranslateRescan();
          }}
          className="w-fit rounded-sm"
          color="primary"
        >
          Create New Batching
        </Button>
        </div>
      </div>

      {/* Table */}
      
          
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Sr.No", "Mould No", "Operator", "Shift", "Batch date & Time", "Action"].map((title) => (
                <th
                  key={title}
                  className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item: any, index: number) => (
                <tr key={item.id} className="bg-white dark:bg-gray-900">
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300"> #{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">{item.mould_no}</td>
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item.operator_name.charAt(0).toUpperCase() + item.operator_name.slice(1)}
                  </td>
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    <Badge color="lightblue" className="capitalize">
                      {item.shift}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item.batch_date ? formatDate(item.batch_date) : ""} {" "}{item.entry_time
                      ? new Date(`1970-01-01T${item.entry_time}`).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "-"}
                  </td>
                  
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    <div className="flex justify-start gap-2">
                      <Tooltip content="View" placement="bottom">
                        <Button
                          size="sm"
                          color={"lightsecondary"}
                          className="p-0"
                          onClick={() => {
                            setViewmodal(true);
                            setSelectedRow(item);
                          }}
                        >
                          <Icon icon="hugeicons:view" height={18} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Edit" placement="bottom">
                        <Button
                          size="sm"
                          className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                          onClick={() => handleEdit(item)}
                        >
                          <Icon icon="solar:pen-outline" height={18} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete" placement="bottom">
                        <Button
                          size="sm"
                          color="lighterror"
                          className="p-0"
                          onClick={() => {
                            setDeletemodal(true);
                            setSelectedRow(item);
                          }}
                        >
                          <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 px-4">
                  <div className="flex flex-col items-center">
                    <img src={noData} alt="No data" height={100} width={100} className="mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No data available</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

       </CardBox>

      {/* Pagination */}
      <CommonPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
      />

      {/* Modals */}
      <ComonDeletemodal
        handleConfirmDelete={handleDelete}
        isOpen={deletemodal}
        setIsOpen={setDeletemodal}
        selectedUser={selectedrow}
        title="Are you sure you want to Delete this Batching?"
      />
      <AddBatchModal show={showmodal} setShowmodal={setShowmodal} logindata={logindata}batchingdata={batchingdata} />
      <EditBatchModal open={editmodal} setOpen={setEditmodal} batchingData={selectedrow} />
      <ViewBatchModal
        setPlaceModal={setViewmodal}
        modalPlacement={"center"}
        selectedRow={selectedrow}
        placeModal={viewmodal}
      />
    </div>
  );
};

export default BatchingTable;
