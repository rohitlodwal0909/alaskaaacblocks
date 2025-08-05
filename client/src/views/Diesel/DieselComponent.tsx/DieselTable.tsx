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
import AddDieselModal from "./AddDieselModal";
import EditDieselModal from "./EditDieselModal";
import { deleteDiesel, GetDiesel } from "src/features/Diesel/DieselSlice";


const DieselTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dieseldata, loading } = useSelector((state: any) => state.diesel);
    const logindata = useSelector((state: any) => state.authentication?.logindata);
// const navigate = useNavigate()
  const [editmodal, setEditmodal] = useState(false);
  const [addmodal, setAddmodal] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const [selectedrow, setSelectedRow] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  useEffect(() => {
    dispatch(GetDiesel());
  }, [dispatch]);



  const handleEdit = async (entry) => {
    setEditmodal(true)
    setSelectedRow(entry)
  };
  // const handleView =(autoclave)=>{
  //  navigate(`/autoclave-view/${autoclave?.Diesel_entries[0]?.id}`)
  // }
  const handleDelete = async (userToDelete) => {
    if (!userToDelete) return;
    try {

      await dispatch(deleteDiesel(userToDelete?.id)).unwrap();
      dispatch(GetDiesel());
        toast.success("The diesel  was successfully deleted. ");
    } catch (error: any) {
      console.error("Delete failed:", error);
      if (error?.response?.status === 404) toast.error("User not found.");
      else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
      else toast.error("Failed to delete user.");
    }
  }


  
  const filteredItems = (dieseldata || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();
    const operator = item?.fuel_consume || "";
    const mouldNo = item?.meter_reading || "";
    const okpeac = item?.date || "";
 
const matchesSearch =  mouldNo.toString().toLowerCase().includes(searchText) ||
      operator.toString().toLowerCase().includes(searchText) ||
      okpeac.toString().toLowerCase().includes(searchText)
      const matchesShift = fuelFilter
    ? (item?.fuel_consume || "").toString().toLowerCase() === fuelFilter.toLowerCase()
    : true;

  return matchesSearch && matchesShift
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize) ||[];

  return (
    <div>
      <div className="flex justify-end gap-2 mb-3">
        <input
          placeholder="Search..."
          value={searchTerm}
            type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
           className=" border rounded-md border-gray-300 "

        />
        <select
              id="fuel_consume"
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
        
              className="rounded-md border border-gray-300"
            >
              <option value="">-- Select --</option>
              <option value="JCB">JCB</option>
              <option value="Forklift">Forklift</option>
              <option value="Generator">Generator</option>
            </select>
              <Button
                              size="sm"
                              className="p-0 bg-primary rounded-md"
                              onClick={() => { setAddmodal(true)}}
                            >
                          Add Entry  Diesel 
                            </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Sr.No", "Fuel Consume", "Meter Reading","Date","Time", "Action"].map((title) => (
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
      currentItems.map((item, index) => {
  const dateObj = item?.date ? new Date(item.date) : null;
  const formattedDate = dateObj ? dateObj.toLocaleDateString('en-IN') : '-';
  const formattedTime = dateObj
    ? dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '-';

  return (
    <tr key={item.id} className="bg-white dark:bg-gray-900">
      <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
        #{(currentPage - 1) * pageSize + index + 1}
      </td>
      <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
        {item?.fuel_consume}
      </td>
      <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
        {item?.meter_reading}
      </td>

      {/* ✅ Date column */}
      <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
        {formattedDate}
      </td>

      {/* ✅ Time column */}
      <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
        {formattedTime}
      </td>

      <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
        <div className="flex justify-start gap-2">
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
        title="Are you sure you want to Delete this Diesel ?"
      />
      <AddDieselModal setShowmodal={setAddmodal} show={addmodal}  logindata={logindata}/>
      <EditDieselModal show={editmodal} setShowmodal={setEditmodal} Dieseldata={selectedrow} logindata={logindata} />

    </div>
  );
};

export default DieselTable;
