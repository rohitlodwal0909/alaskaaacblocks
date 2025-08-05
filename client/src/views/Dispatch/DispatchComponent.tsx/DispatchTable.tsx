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
import AddDispatchModal from "./AddDispatchModal";
import EditDispatchModal from "./EditDispatchModal";
import { deleteDispatch, GetDispatch } from "src/features/Dispatch/DispatchSlice";
// import { formatTime } from "src/utils/Datetimeformate";
import DispatchView from "./DispatchView";
import { imageurl } from "src/constants/contant";


const DispatchTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dispatchdata, loading } = useSelector((state: any) => state.dispatch);
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  // const navigate = useNavigate()
  const [editmodal, setEditmodal] = useState(false);
  const [addmodal, setAddmodal] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedrow, setSelectedRow] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    dispatch(GetDispatch());
  }, [dispatch]);
  const handleEdit = async (entry) => {
    setEditmodal(true)
    setSelectedRow(entry)
  };
  // const handleView =(autoclave)=>{
  //  navigate(`/autoclave-view/${autoclave?.Dispatch_entries[0]?.id}`)
  // }

  const handleView = async (row: any) => {
    setViewModal(true);
    setSelectedRow(row)
  }

  const handleDelete = async (userToDelete) => {
    if (!userToDelete) return;
    try {
      await dispatch(deleteDispatch(userToDelete?.id)).unwrap();
      dispatch(GetDispatch());
      toast.success("The dispatch  was successfully deleted. ");
    } catch (error: any) {
      console.error("Delete failed:", error);
      if (error?.response?.status === 404) toast.error("User not found.");
      else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
      else toast.error("Failed to delete user.");
    }
  }


  const filteredItems = (dispatchdata?.data || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();
    const searched =
      item?.vehicle_number?.toLowerCase().includes(searchText) ||
      item?.transport_name?.toLowerCase().includes(searchText) ||
      item?.driver_name?.toLowerCase().includes(searchText) ||
      item?.driver_number?.toLowerCase().includes(searchText) ||
      item?.delivery_area?.toLowerCase().includes(searchText) ||
      item?.invoice_number?.toLowerCase().includes(searchText) ||
      item?.eway_bill_number?.toLowerCase().includes(searchText) ||
      item?.material_details?.toLowerCase().includes(searchText) ||
      item?.quantity?.toString().toLowerCase().includes(searchText) ||
      item?.size?.toString().toLowerCase().includes(searchText) ||
      item?.quality_check?.toLowerCase().includes(searchText) ||
      item?.person_responsible?.toLowerCase().includes(searchText);
    return searched
  });


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
         Create Dispatch  {/* <Icon icon="ic:baseline-plus" height={18} /> */}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Sr.No</th>
              <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Vehicle No.</th>
              <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Transport Name</th>
              <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Driver Name</th>
              <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Delivery Area</th>
              <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Material</th>
              <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Quantity</th>
              <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Loading Picture</th>
              <th className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200">Action</th>
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
                  // You could also sort by date if needed
                  return (
                    <tr key={item.id} className="bg-white dark:bg-gray-900">
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-300"> #{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-300">{item?.vehicle_number || "-"}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-300">{item?.transport_name || "-"}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-300">{item?.driver_name || "-"}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-300">{item?.delivery_area || "-"}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-300" >{item?.material_details || "-"}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-300">{item?.quantity || "-"}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-300">
                        {item?.loading_picture ? (
                          <img
                            src={imageurl +item.loading_picture}
                            alt="Loading"
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        <div className="flex gap-2">
                          <>
                            <Tooltip content="Edit">
                              <Button
                                size="sm"
                                className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                                onClick={() => handleEdit(item)}
                              >
                                <Icon icon="solar:pen-outline" height={18} />
                              </Button>
                            </Tooltip>
                            <Tooltip content="View" placement="bottom" >
                              <Button size="sm" color={"lightsecondary"} className="p-0" onClick={() => handleView(item)}>
                                <Icon icon="hugeicons:view" height={18} />
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
        title="Are you sure you want to Delete this Dispatch ?"
      />
      <AddDispatchModal setShowmodal={setAddmodal} show={addmodal} logindata={logindata} />
      <EditDispatchModal show={editmodal} setShowmodal={setEditmodal} Dispatch={selectedrow} logindata={logindata} />
      <DispatchView setPlaceModal={setViewModal} modalPlacement={"center"} selectedRow={selectedrow} placeModal={viewModal}  />
    </div>
  );
};

export default DispatchTable;
