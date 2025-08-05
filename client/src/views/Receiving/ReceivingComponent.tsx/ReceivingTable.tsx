import { Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import noData from "src/assets/images/svgs/no-data.webp";
import CommonPagination from "src/utils/CommonPagination";
import ComonDeletemodal from "../../../utils/deletemodal/ComonDeletemodal";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router";
import AddReceivingModal from "./AddReceivingModal";
import EditReceivingModal from "./EditReceivingModal";
import { deleteReceiving, GetReceiving } from "src/features/Receiving/ReceivingSlice";
// import { formatTime } from "src/utils/Datetimeformate";
import ReceivingView from "./ReceivingView";
import AddStokeMaterialModal from "./AddStokeMaterialModal";
const ReceivingTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { receivingdata, loading } = useSelector((state: any) => state.receiving);
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  // const navigate = useNavigate()

  const [editmodal, setEditmodal] = useState(false);
  const [addmodal, setAddmodal] = useState(false);
  const [stockmodal, setStockmodal] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedrow, setSelectedRow] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    dispatch(GetReceiving());
  }, []);
  const handleEdit = async (entry) => {
    setEditmodal(true)
    setSelectedRow(entry)
  };
  // const handleView =(autoclave)=>{
  //  navigate(`/autoclave-view/${autoclave?.Receiving_entries[0]?.id}`)
  // }

  const handleView = async (row: any) => {
    setViewModal(true);
    setSelectedRow(row)
  }

  const handleDelete = async (userToDelete) => {
    if (!userToDelete) return;
    try {
      await dispatch(deleteReceiving(userToDelete?.id)).unwrap();
      dispatch(GetReceiving());
      toast.success("The Receiving  was successfully deleted. ");
    } catch (error: any) {
      console.error("Delete failed:", error);
      if (error?.response?.status === 404) toast.error("User not found.");
      else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
      else toast.error("Failed to delete user.");
    }
  }


 const filteredItems = (receivingdata?.data || []).filter((item: any) => {
  const searchText = searchTerm.toLowerCase();
  return Object.keys(item).some((key) =>
    typeof item[key] === "string" && item[key]?.toLowerCase().includes(searchText)
  );
});

console.log(receivingdata?.data)
  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize) || [];
  return (
    <div>
      <div className="flex justify-end gap-3 mb-3">
        <input
          placeholder="Search..."
          value={searchTerm}
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" border rounded-md border-gray-300"
        />
        <Button
          size="sm"
          className="p-0   bg-primary rounded-md "
          onClick={() => {
            setAddmodal(true);

          }}
        >
         Create Receiving  {/* <Icon icon="ic:baseline-plus" height={18} /> */}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
           
           <tr>
    <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Sr.No</th>
    <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Supplier Name</th>
    <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Vehicle No</th>
    <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Invoice No</th>
    <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Received By</th>
    <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Date</th>
    <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Actions</th>
  </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) :
              currentItems.length > 0 ? (
                currentItems.map((item, index) => {
                  
                  return (
                    <tr key={item.id} className="bg-white dark:bg-gray-900">
                 <td className="px-4 py-2 text-gray-900 dark:text-gray-300"> #{(currentPage - 1) * pageSize + index + 1}</td>
        <td className="px-4 py-2 text-gray-900 dark:text-gray-300">{item?.supplier_name || "-"}</td>
        <td className="px-4 py-2 text-gray-900 dark:text-gray-300">{item?.vehical_no || "-"}</td>
        <td className="px-4 py-2 text-gray-900 dark:text-gray-300">{item?.invoice_no || "-"}</td>
        <td className="px-4 py-2 text-gray-900 dark:text-gray-300">{item?.received_by || "-"}</td>
        <td className="px-4 py-2 text-gray-900 dark:text-gray-300">{item?.date || "-"}</td>
        {/* <td className="px-4 py-2">{item?.density || "-"}</td>
        <td className="px-4 py-2">{item?.flow_value || "-"}</td> */}
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        <div className="flex gap-2">

                        
                           
                          <>
                          {
                            item?.materials?.length > 0 ? 
                             <Tooltip content="View" placement="bottom" >
                              <Button size="sm" color={"lightsecondary"} className="p-0" onClick={() => handleView(item)}>
                                <Icon icon="hugeicons:view" height={18} />
                              </Button>
                            </Tooltip>:
                           <Tooltip content="Add" placement="bottom">
                                       <Button
                                         size="sm"
                                         className="p-0 bg-lightprimary text-primary hover:bg-primary hover:text-white"
                                         onClick={() => {
                                           setStockmodal(true);
                                           setSelectedRow(item);
                                         }}
                                       >
                                         <Icon icon="ic:baseline-plus" height={18} />
                                       </Button>
                         </Tooltip>
                         
                          }
                            <Tooltip content="Edit">
                              <Button
                                size="sm"
                                className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                                onClick={() => handleEdit(item)}
                              >
                                <Icon icon="solar:pen-outline" height={18} />
                              </Button>
                            </Tooltip>
                           
                           
                            <Tooltip content="Delete">
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
                            
                           
                        </div>
                      </td>
                    </tr>
                  );
                })

              ) : (
                <tr className="">
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

      {/* Pagination */}
      <CommonPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
      />

      {/* Edit modal  */}
      <ComonDeletemodal
        handleConfirmDelete={handleDelete}
        isOpen={deletemodal}
        setIsOpen={setDeletemodal}
        selectedUser={selectedrow}
        title="Are you sure you want to Delete this Receiving ?"
      />
      <AddReceivingModal setShowmodal={setAddmodal} show={addmodal} logindata={logindata} />
      <AddStokeMaterialModal setShowmodal={setStockmodal} show={stockmodal} logindata={logindata} Receiving={selectedrow} />
      <EditReceivingModal show={editmodal} setShowmodal={setEditmodal} Receiving={selectedrow} logindata={logindata} />
      <ReceivingView setPlaceModal={setViewModal} modalPlacement={"center"} selectedRow={selectedrow} placeModal={viewModal} logindata={logindata} />
    </div>
  );
};

export default ReceivingTable;
