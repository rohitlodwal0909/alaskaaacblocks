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
import AddBoilerModal from "./AddBoilerModal";
import EditBoilerModal from "./EditBoilerModal";
import { deleteBoiler, GetBoiler } from "src/features/Boiler/BoilerSlice";
import { useNavigate } from "react-router";


const BoilerTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { boilerdata, loading } = useSelector((state: any) => state.boiler);
  const navigate = useNavigate()
    const logindata = useSelector((state: any) => state.authentication?.logindata);
// const navigate = useNavigate()
  const [editmodal, setEditmodal] = useState(false);
  const [addmodal, setAddmodal] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const [selectedrow, setSelectedRow] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(GetBoiler());
  }, [dispatch]);



  const handleEdit = async (entry) => {
    setEditmodal(true)
    setSelectedRow(entry)
  };
  const handleView =(autoclave)=>{
   navigate(`/boiler-view/${autoclave?.id}`)
  }
  const handleDelete = async (userToDelete) => {
    if (!userToDelete) return;
    try {
      console.log
      await dispatch(deleteBoiler(userToDelete?.id)).unwrap();
      dispatch(GetBoiler());
        toast.success("The boiler  was successfully deleted. ");
    } catch (error: any) {
      console.error("Delete failed:", error);
      if (error?.response?.status === 404) toast.error("User not found.");
      else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
      else toast.error("Failed to delete user.");
    }
  }


  
  const filteredItems = (boilerdata || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();
    const done = item?.done_by || "";
    const shift = item?.shift || "";
    const location = item?.location || "";
    const total = item?.total_wood_consumption || "";
    const date = item?.date || "";
   
    return (
      done.toString().toLowerCase().includes(searchText) ||
      shift.toString().toLowerCase().includes(searchText) ||
      location.toString().toLowerCase().includes(searchText) ||
      total.toString().toLowerCase().includes(searchText) ||
      date.toString().toLowerCase().includes(searchText)
    
    );
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize) ||[];

  return (
    <div>
      <div className="flex justify-end gap-4 mb-3">
        <input
          placeholder="Search..."
          value={searchTerm}
            type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
           className=" border rounded-md border-gray-300 "
        />
         <Button
                              size="sm"
                              className="p-0 bg-primary rounded-md"
                              onClick={() => { setAddmodal(true)}}
                            >
                             Create Boiler
                            </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Sr.No", "Done By", "Shift", "Date", "Total Wood Consumption", "Action"].map((title) => (
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
              currentItems.map((item, index) => (
                <tr key={item.id} className="bg-white dark:bg-gray-900">
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    #{(currentPage - 1) * pageSize + index + 1} 
                  </td>
                    <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                            {item?.done_by?.charAt(0).toUpperCase() + item?.done_by?.slice(1)||"-"}
                  </td>
                
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.shift}
                  </td>
                
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.date|| '-'}
                  </td>
                    
                    {/* <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.location  || '-'}
                  </td> */}
                
                  
                   <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.total_wood_consumption || '-'}
                  </td>
                  
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    <div className="flex justify-start gap-2">
                    
                            <>
                                       <Tooltip content="View" placement="bottom" >
                                    <Button size="sm" color={"lightsecondary"} className="p-0" onClick={() =>handleView(item)}>
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
                        <Button size="sm" color="lighterror" className="p-0" onClick={() => { setDeletemodal(true), setSelectedRow(item) }}>
                          <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                        </Button>
                      </Tooltip>

                          </>
                    </div>
                  </td>
                </tr>
              ))
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
        title="Are you sure you want to Delete this Boiler ?"
      />
      <AddBoilerModal setShowmodal={setAddmodal} show={addmodal}  logindata={logindata}/>
      <EditBoilerModal show={editmodal} setShowmodal={setEditmodal} BoilerData={selectedrow} logindata={logindata}/>

    </div>
  );
};

export default BoilerTable;
