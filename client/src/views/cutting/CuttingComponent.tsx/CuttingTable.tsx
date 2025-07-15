import {  Button, Tooltip } from "flowbite-react";
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
  console.log(cuttingdata)
  const [editmodal, setEditmodal] = useState(false);
  const [addmodal, setAddmodal] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const [selectedrow, setSelectedRow] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
  dispatch(GetCutting());
  }, [dispatch]);

  const totalPages = Math.ceil((cuttingdata?.length || 0) / pageSize);
  const currentItems = cuttingdata?.slice((currentPage - 1) * pageSize, currentPage * pageSize) || [];

  const handleEdit = async(entry) => {
         setEditmodal(true)
         setSelectedRow(entry)
  };
     const handleDelete = async(userToDelete) =>{
       if (!userToDelete) return;
          try {
            console.log
            await dispatch(deleteCutting(userToDelete?.cutting_info?.id)).unwrap();
            dispatch(GetCutting());
            toast.success("Cutting  entry Deleted ");
          } catch (error: any) {
            console.error("Delete failed:", error);
            if (error?.response?.status === 404) toast.error("User not found.");
            else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
            else toast.error("Failed to delete user.");
         }
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Sr.No","Mould No","Operator Name","Broken Pcs","Size","Time","Remark","Action"].map((title) => (
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
                <td colSpan={5} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item ,index) => (
                <tr key={item.id} className="bg-white dark:bg-gray-900">
                   <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    <h6>#{index+1} </h6>
                  </td>
                   <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.mould_no}
                  </td>
                   <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">

                    {item?.cutting_info?.operator_name.charAt(0).toUpperCase() + item?.cutting_info?.operator_name.slice(1) ||"-"}

                  </td>
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.cutting_info?.broken_pcs || "-"}
                  </td>
                   <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                   {item?.cutting_info?.size || "-"}
                  </td>
                  
                    <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                 {item?.cutting_info?.time
  ? new Date(`1970-01-01T${item.cutting_info?.time}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  : '-'}
                  </td>
                   <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.cutting_info?.remark || "-"}
                  </td>
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    <div className="flex justify-start gap-2">
                    {
                      !item?.cutting_info?.operator_name ?
                         <Tooltip content="Add" placement="bottom">
                        <Button
                          size="sm"
                          className="p-0 bg-lightprimary text-primary hover:bg-primary hover:text-white"
                          onClick={() =>{ setAddmodal(true), setSelectedRow(item)}}
                        >
                          <Icon icon="ic:baseline-plus" height={18} />
                        </Button>
                      </Tooltip>:
                      (<> <Tooltip content="Edit" placement="bottom">
                        <Button
                          size="sm"
                          className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                          onClick={() => handleEdit(item)}
                        >
                          <Icon icon="solar:pen-outline" height={18} />
                        </Button>
                      </Tooltip>
                       <Tooltip content="Delete" placement="bottom">
                        <Button size="sm" color="lighterror" className="p-0" onClick={() =>{ setDeletemodal(true), setSelectedRow(item)}}>
                          <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                        </Button>
                      </Tooltip>
                      </>
                    )
                    }
                     
                      
                     
                     
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
              title="Are you sure you want to Delete this Cutting?"
            />
        <AddCuttingModal setShowmodal={setAddmodal} show={addmodal}  batchingData={selectedrow} />
        <EditCuttingModal show={editmodal} setShowmodal={setEditmodal}   cuttingData={selectedrow} />
    </div>
  );
};

export default CuttingTable;
