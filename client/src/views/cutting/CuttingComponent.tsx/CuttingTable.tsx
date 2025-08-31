import { Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import noData from "src/assets/images/svgs/no-data.webp";
import CommonPagination from "src/utils/CommonPagination";
import ComonDeletemodal from "../../../utils/deletemodal/ComonDeletemodal";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import AddCuttingModal from "./AddCuttingModal";
import EditCuttingModal from "./EditCuttingModal";
import { deleteCutting, GetCutting } from "src/features/Cutting/CuttingSlice";

const CuttingTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cuttingdata, loading } = useSelector((state: any) => state.cutting);
  const logindata = useSelector((state: any) => state.authentication?.logindata);

  const [editmodal, setEditmodal] = useState(false);
  const [addmodal, setAddmodal] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const [selectedrow, setSelectedRow] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(GetCutting());
  }, [dispatch]);

  const handleEdit = (entry: any) => {
    setEditmodal(true);
    setSelectedRow(entry);
  };

  const handleDelete = async (userToDelete: any) => {
    if (!userToDelete) return;
    try {
      await dispatch(deleteCutting(userToDelete?.cutting_info?.id)).unwrap();
      dispatch(GetCutting());
      toast.success("The cutting was successfully deleted.");
    } catch (error: any) {
      console.error("Delete failed:", error);
      if (error?.response?.status === 404) toast.error("User not found.");
      else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
      else toast.error("Failed to delete user.");
    }
  };

const filteredItems = (cuttingdata || []).filter((item: any) => {
  const search = searchTerm.toLowerCase();

  const mouldNo = String(item?.mould_no || "");
  const operator = String(item?.cutting_info?.operator_name || "");
  const broken = String(item?.cutting_info?.broken_pcs || "");
  const size = String(item?.cutting_info?.size || "");
  const time = String(item?.cutting_info?.time || "");
  const remark = String(item?.cutting_info?.remark || "");

  return (
    mouldNo.toLowerCase().includes(search) ||
    operator.toLowerCase().includes(search) ||
    broken.toLowerCase().includes(search) ||
    size.toLowerCase().includes(search) ||
    time.toLowerCase().includes(search) ||
    remark.toLowerCase().includes(search)
  );
});


  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      {/* Search Bar */}
      <div className="flex justify-end mb-3">
        <input
          type="text"
          placeholder="Search..."
            className=" border rounded-md border-gray-300 "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Sr.No", "Mould No", "Operator Name", "Broken Pcs", "Size", "Date & Time", "Time", "Remark", "Action"].map((title) => (
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
                <td colSpan={8} className="text-center py-6">Loading...</td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item: any, index: number) => (
                <tr key={item.id} className="bg-white dark:bg-gray-900">
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300"> #{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">{item?.mould_no || "-"}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    {(item?.cutting_info?.operator_name || "-").replace(/^\w/, c => c.toUpperCase())}
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
              {Array.isArray(item?.cutting_info?.broken_pcs)
  ? item?.cutting_info?.broken_pcs.map((val, idx) => <div key={idx}>{val}</div>)
  : typeof item?.cutting_info?.broken_pcs === "string" && item?.cutting_info?.broken_pcs.startsWith("[")
  ? JSON.parse(item?.cutting_info?.broken_pcs).map((val, idx) => <div key={idx}> {idx + 1}. {val}</div>)
  : <div>{item?.cutting_info?.broken_pcs}</div>}
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300"> {Array.isArray(item?.cutting_info?.size)
    ? item?.cutting_info?.size.join(", ")
    : typeof item?.cutting_info?.size === "string" && item?.cutting_info?.size.startsWith("[")
    ? JSON.parse(item?.cutting_info?.size).map((val, idx) => <div key={idx}> {idx + 1}. {val}</div>)
  : <div>{item?.cutting_info?.size}</div>}</td>

                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.cutting_info?.datetime
                      }
                  </td>

                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.cutting_info?.time
                      ? new Date(`1970-01-01T${item.cutting_info.time}`).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "-"}
                  </td>
                  
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">{item?.cutting_info?.remark || "-"}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    <div className="flex justify-start gap-2">
                      {!item?.cutting_info?.operator_name ? (
                        <Tooltip content="Add" placement="bottom">
                          <Button
                            size="sm"
                            className="p-0 bg-lightprimary text-primary hover:bg-primary hover:text-white"
                            onClick={() => {
                              setAddmodal(true);
                              setSelectedRow(item);
                            }}
                          >
                            <Icon icon="ic:baseline-plus" height={18} />
                          </Button>
                        </Tooltip>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-8 px-4">
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

      <CommonPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
      />

      <ComonDeletemodal
        handleConfirmDelete={handleDelete}
        isOpen={deletemodal}
        setIsOpen={setDeletemodal}
        selectedUser={selectedrow}
        title="Are you sure you want to Delete this Cutting?"
      />

      <AddCuttingModal
        setShowmodal={setAddmodal}
        show={addmodal}
        batchingData={selectedrow}
        logindata={logindata}
      />

      <EditCuttingModal
        show={editmodal}
        setShowmodal={setEditmodal}
        cuttingData={selectedrow}
      />
    </div>
  );
};

export default CuttingTable;
