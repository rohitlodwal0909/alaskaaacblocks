import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";

import noData from "src/assets/images/svgs/no-data.webp";
import CommonPagination from "src/utils/CommonPagination";
import { GetAutoclavedate } from "src/features/Segregation/SegregationSlice";
import { AppDispatch } from "src/store";

const SegregationTabledate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { autoclavedata, loading } = useSelector((state: any) => state.segregation);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    dispatch(GetAutoclavedate());
  }, [dispatch]);

  const handleView = (id: string) => {
    navigate(`/segregation-list/${id}`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  // 🔎 Filtered & Paginated data
  const filteredItems = (autoclavedata || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();
    return (item?.Date ? formatDate(item?.Date).toLowerCase() : "").includes(searchText);
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      {/* 🔎 Search Bar */}
      <div className="flex justify-end mb-3">
        <input
          type="text"
          placeholder="Search by date..."
          className="border rounded-md border-gray-300 px-2 py-1"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page when searching
          }}
        />
      </div>

      {/* 📊 Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Sr.No", "Date", "Action"].map((title) => (
                <th
                  key={title}
                  className="text-base font-semibold py-3 px-4 text-left border-b text-gray-700 dark:text-gray-200"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item: any, index: number) => (
                <tr key={item.id} className="bg-white dark:bg-gray-900">
                  {/* Sr.No */}
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    #{(currentPage - 1) * pageSize + index + 1}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item.Date ? formatDate(item.Date) : "-"}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Tooltip content="View" placement="bottom">
                        <Button
                          size="sm"
                          className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                          onClick={() => handleView(item?.sample_id)}
                        >
                          <Icon icon="hugeicons:view" height={18} />
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-8 px-4">
                  <div className="flex flex-col items-center">
                    <img src={noData} alt="No data" className="mb-4 h-24 w-24" />
                    <p className="text-gray-500 dark:text-gray-400">No data available</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <CommonPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
      />

     
    </div>
  );
};

export default SegregationTabledate;
