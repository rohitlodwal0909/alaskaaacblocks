import { Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import noData from "src/assets/images/svgs/no-data.webp";
import CommonPagination from "src/utils/CommonPagination";
import { AppDispatch } from "src/store";
import {  GetSecuritydate  } from "src/features/Security/SecuritySlice";
import AddSecurityModal from "./AddSecurityModal";
import { useNavigate } from "react-router";

const SecurityTableDate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { securitydatewise, loading } = useSelector((state: any) => state.security);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);


  useEffect(() => {
    dispatch(GetSecuritydate());
  }, [dispatch]);

   const handleView = (id: string) => {
    navigate(`/security-list/${id}`);
  };


  const filteredItems = (securitydatewise || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();
    return (
 
      item.date?.toLowerCase().includes(searchText) 
     
    );
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      {/* 🔎 Search Bar */}
      <div className="flex justify-end mb-3">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-md border-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          onClick={() => setShowAddModal(true)}
          className="w-fit rounded-sm ml-2"
          color="primary"
        >
          Create Security
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["#", "Date", "Action"].map(
                (title) => (
                  <th
                    key={title}
                    className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200"
                  >
                    {title}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={11} className="text-center py-6">Loading...</td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item: any, index: number) => (
                <tr key={item.id} className="bg-white dark:bg-gray-900">
                  <td className="py-3 px-4">{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="py-3 px-4">{item.date || "-"}</td>
                  
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Tooltip content="Edit" placement="bottom">
                        <Button
                          size="sm"
                          className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                          onClick={() => handleView(item.id)}
                        >
                          <Icon icon="solar:pen-outline" height={18} />
                        </Button>
                      </Tooltip>

                     
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center py-8 px-4">
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

      {/* Add Modal */}
      <AddSecurityModal show={showAddModal} setShowmodal={setShowAddModal} />

      {/* Edit Modal */}
      
    </div>
  );
};

export default SecurityTableDate;
