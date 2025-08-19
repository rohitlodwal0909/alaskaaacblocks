// import { Button, Tooltip } from "flowbite-react";
// import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import noData from "src/assets/images/svgs/no-data.webp";
import CommonPagination from "src/utils/CommonPagination";
import ComonDeletemodal from "../../../utils/deletemodal/ComonDeletemodal";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router";
import AddMaterialModal from "./AddMaterialModal";
// import EditMaterialModal from "./EditMaterialModal";
import { deleteMaterial, GetMaterial } from "src/features/Material/MaterialSlice";
// import { formatTime } from "src/utils/Datetimeformate";
import MaterialView from "./MaterialView";
const MaterialTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { materialdata, loading } = useSelector((state: any) => state.material);
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  // const navigate = useNavigate()

  // const [editmodal, setEditmodal] = useState(false);s
  const [addmodal, setAddmodal] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedrow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    dispatch(GetMaterial());
    setSelectedRow("")
    setSearchTerm("")
  }, []);
  // const handleEdit = async (entry) => {
  //   setEditmodal(true)
  //   setSelectedRow(entry)
  // };
  // const handleView =(autoclave)=>{
  //  navigate(`/autoclave-view/${autoclave?.Material_entries[0]?.id}`)
  // }

  // const handleView = async (row: any) => {
  //   setViewModal(true);
  //   setSelectedRow(row)
  // }

  const handleDelete = async (userToDelete) => {
    if (!userToDelete) return;
    try {
      await dispatch(deleteMaterial(userToDelete?.id)).unwrap();
      dispatch(GetMaterial());
      toast.success("The material  was successfully deleted. ");
    } catch (error: any) {
      console.error("Delete failed:", error);
      if (error?.response?.status === 404) toast.error("User not found.");
      else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
      else toast.error("Failed to delete user.");
    }
  }


  const filteredItems = (materialdata?.data || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();
    return Object.keys(item).some((key) =>
      typeof item[key] === "string" && item[key]?.toLowerCase().includes(searchText)
    );
  });


  const total = {
    mould_oil: 0,
    hardner: 0,
    ph_booster: 0,
    cement: 0,
    lime: 0,
    gypsum: 0,
    soluble_oil: 0,
    aluminium: 0,
    antiscalnt_chemical: 0,
    dicromate: 0,
      wood:0,
     diesel:0,
       adhesive_bag:0,
       fly_ash:0
  };
  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize) || [];
  currentItems.forEach((item) => {
    total.mould_oil += parseFloat(item.mould_oil) || 0;
    total.hardner += parseFloat(item.hardner) || 0;
    total.ph_booster += parseFloat(item.ph_booster) || 0;
    total.cement += parseFloat(item.cement) || 0;
    total.lime += parseFloat(item.lime) || 0;
    total.gypsum += parseFloat(item.gypsum) || 0;
    total.soluble_oil += parseFloat(item.soluble_oil) || 0;
    total.aluminium += parseFloat(item.aluminium) || 0;
    total.antiscalnt_chemical += parseFloat(item.antiscalnt_chemical) || 0;
    total.dicromate += parseFloat(item.dicromate) || 0;

      total.wood += parseFloat(item.wood) || 0;
    total.diesel += parseFloat(item.diesel) || 0;
    total.adhesive_bag += parseFloat(item.adhesive_bag) || 0;
    total.fly_ash += parseFloat(item.fly_ash) || 0;
  });
  return (
    <div>
      <div className="flex justify-end gap-3 mb-3">
        {/* <input
          placeholder="Search..."
          value={searchTerm}
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" border rounded-md border-gray-300"
        /> */}
        {/* <Button
          size="sm"
          className="p-0   bg-primary rounded-md "
          onClick={() => {
            setAddmodal(true);

          }}
        >
         Create Material  
        </Button> */}
      </div>
      {loading ? (
  <div className="text-center py-6">Loading...</div>
) : currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {[
    { label: "Mould Oil (ltr)", value: total.mould_oil },
    { label: "Cement (kg)", value: total.cement },
    { label: "Lime (kg)", value: total.lime },
    { label: "Gypsum (kg)", value: total.gypsum },
    { label: "Soluble Oil (ltr)", value: total.soluble_oil },
    { label: "Aluminium (grm)", value: total.aluminium },
    { label: "Hardner (ltr)", value: total.hardner },
    { label: "Ph Booster (ltr) " , value: total.ph_booster },
    { label: "Antiscalant Chemical (ltr)", value: total.antiscalnt_chemical || "-" },
    { label: "Dicromate (grm)", value: total.dicromate || "-" },
        { label: "Wood (tonne)", value: total.wood },
    { label: "Diesel (ltr) " , value: total.diesel },
    { label: "Adhesive Bag", value: total.adhesive_bag || "-" },
    { label: "Fly Ash (kg)", value: total.fly_ash || "-" },
  ].map((item, index) => (
    <div key={index} className="bg-light dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className=" font-medium  text-md  text-gray-600 dark:text-gray-300">{item.label}</h3>
      <p className="mt-2 text-lg font-semibold text-blue-900">{item.value}</p>
    </div>
  ))}
</div>
): (
  <div className="flex flex-col items-center py-8">
    <img src={noData} alt="No data" height={100} width={100} className="mb-4" />
    <p className="text-gray-500 dark:text-gray-400">No data available</p>
  </div>
)}

      {/* Pagination */}
      <div style={{display:"none"}}>

      <CommonPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
      />
      </div>

      {/* Edit modal  */}
      <ComonDeletemodal
        handleConfirmDelete={handleDelete}
        isOpen={deletemodal}
        setIsOpen={setDeletemodal}
        selectedUser={selectedrow}
        title="Are you sure you want to Delete this Material ?"
      />
      <AddMaterialModal setShowmodal={setAddmodal} show={addmodal} logindata={logindata} />
      {/* <EditMaterialModal show={editmodal} setShowmodal={setEditmodal} Material={selectedrow} logindata={logindata}  /> */}
      <MaterialView setPlaceModal={setViewModal} modalPlacement={"center"} selectedRow={selectedrow} placeModal={viewModal} />
    </div>
  );
};

export default MaterialTable;
