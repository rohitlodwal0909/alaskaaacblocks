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
import AddSegregationModal from "./AddSegregationModal";
import EditSegregationModal from "./EditSegregationModal";
import { deleteSegregation, GetSegregation } from "src/features/Segregation/SegregationSlice";


const SegregationTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { segregationdata, loading } = useSelector((state: any) => state.segregation);
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
    dispatch(GetSegregation());
  }, [dispatch]);



  const handleEdit = async (entry) => {
    setEditmodal(true)
    setSelectedRow(entry)
  };
  // const handleView =(autoclave)=>{
  //  navigate(`/autoclave-view/${autoclave?.segregation_entries[0]?.id}`)
  // }
  const handleDelete = async (userToDelete) => {
    if (!userToDelete) return;
    try {
      console.log
      await dispatch(deleteSegregation(userToDelete?.segregation_entries[0]?.id)).unwrap();
      dispatch(GetSegregation());
      toast.success("The segregation  was successfully deleted. ");
    } catch (error: any) {
      console.error("Delete failed:", error);
      if (error?.response?.status === 404) toast.error("User not found.");
      else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
      else toast.error("Failed to delete user.");
    }
  }



  const filteredItems = (segregationdata || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();
    const operator = item?.segregation_entries?.[0]?.operator_name || "";
    const mouldNo = item?.mould_no || "";
    const okpeac = item?.segregation_entries?.[0]?.no_of_ok_pcs || "";
    const brokenpeac = item?.segregation_entries?.[0]?.no_of_broken_pcs || "";
    const size = item?.segregation_entries?.[0]?.size || "";
    const date = item?.segregation_entries?.[0]?.date || "";
    const remark = item?.segregation_entries?.[0]?.remark || "";

    return (
      mouldNo.toString().toLowerCase().includes(searchText) ||
      operator.toString().toLowerCase().includes(searchText) ||
      okpeac.toString().toLowerCase().includes(searchText) ||
      brokenpeac.toString().toLowerCase().includes(searchText) ||
      size.toString().toLowerCase().includes(searchText) ||
      date.toString().toLowerCase().includes(searchText) ||
      remark.toString().toLowerCase().includes(searchText)
    );
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize) || [];

  return (
    <div>
      <div className="flex justify-end mb-3">
        <input
          placeholder="Search..."
          value={searchTerm}
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" border rounded-md border-gray-300 "

        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Sr.No", "Mould No", "Operator Name", , "Ok Pcs", "Broken Pcs", "Size", "Plate No.", "Date", "Remark", "Action"].map((title) => (
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
                    {item?.mould_no}
                  </td>
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.segregation_entries[0]?.operator_name.charAt(0).toUpperCase() + item?.segregation_entries[0]?.operator_name.slice(1) || "-"}
                  </td>


                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">

                    {item?.segregation_entries?.[0]?.no_of_ok_pcs ? (
                      Array.isArray(item.segregation_entries[0].no_of_ok_pcs) ? (
                        item.segregation_entries[0].no_of_ok_pcs.map((val, idx) => <div key={idx}>{val}</div>)
                      ) : typeof item.segregation_entries[0].no_of_ok_pcs === "string" &&
                        item.segregation_entries[0].no_of_ok_pcs.startsWith("[") ? (
                        JSON.parse(item.segregation_entries[0].no_of_ok_pcs).map((val, idx) => <div key={idx}>{idx + 1}. {val}</div>)
                      ) : (
                        <div>{item.segregation_entries[0].no_of_ok_pcs}</div>
                      )
                    ) : (
                      <div>-</div> // fallback if no data
                    )}
                  </td>
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">

                    {Array.isArray(item?.segregation_entries[0]?.no_of_broken_pcs)
                      ? item?.segregation_entries[0]?.no_of_broken_pcs.join(", ")
                      : typeof item?.segregation_entries[0]?.no_of_broken_pcs === "string" && item?.segregation_entries[0].no_of_broken_pcs.startsWith("[")
                        ? JSON.parse(item?.segregation_entries[0]?.no_of_broken_pcs).map((val, idx) => <div key={idx}> {idx + 1}. {val}</div>)
                        : <div>{item?.segregation_entries[0]?.no_of_broken_pcs}</div>}
                  </td>
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">

                    {Array.isArray(item?.segregation_entries[0]?.size)
                      ? item?.segregation_entries[0]?.size.join(", ")
                      : typeof item?.segregation_entries[0]?.size === "string" && item?.segregation_entries[0]?.size.startsWith("[")
                        ? JSON.parse(item?.segregation_entries[0]?.size).map((val, idx) => <div key={idx}> {idx + 1}. {val}</div>)
                        : <div>{item?.segregation_entries[0]?.size} </div>}
                  </td>
                   <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">

                    {Array.isArray(item?.segregation_entries[0]?.plate_no)
                      ? item?.segregation_entries[0]?.plate_no.join(", ")
                      : typeof item?.segregation_entries[0]?.plate_no === "string" && item?.segregation_entries[0]?.plate_no.startsWith("[")
                        ? JSON.parse(item?.segregation_entries[0]?.plate_no).map((val, idx) => <div key={idx}> {idx + 1}. {val}</div>)
                        : <div>{item?.segregation_entries[0]?.plate_no} </div>}
                  </td>
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.segregation_entries[0]?.date || '-'}

                  </td>
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.segregation_entries[0]?.remark || '-'}
                  </td>
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    <div className="flex justify-start gap-2">
                      {
                        item?.segregation_entries?.length === 0 ?
                          <Tooltip content="Add" placement="bottom">
                            <Button
                              size="sm"
                              className="p-0 bg-lightprimary text-primary hover:bg-primary hover:text-white"
                              onClick={() => { setAddmodal(true), setSelectedRow(item) }}
                            >
                              <Icon icon="ic:baseline-plus" height={18} />
                            </Button>
                          </Tooltip> : (
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
                                <Button size="sm" color="lighterror" className="p-0" onClick={() => { setDeletemodal(true), setSelectedRow(item) }}>
                                  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                                </Button>
                              </Tooltip>
                            </>
                          )}
                      {/* <Tooltip content="View" placement="bottom" >
                                    <Button size="sm" color={"lightsecondary"} className="p-0" onClick={() =>handleView(item)}>
                                      <Icon icon="hugeicons:view" height={18} />
                                    </Button>
                                  </Tooltip> */}



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
        title="Are you sure you want to Delete this Segregation ?"
      />
      <AddSegregationModal setShowmodal={setAddmodal} show={addmodal} segregationdata={selectedrow} logindata={logindata} />
      <EditSegregationModal show={editmodal} setShowmodal={setEditmodal} autoclave={selectedrow} />

    </div>
  );
};

export default SegregationTable;
