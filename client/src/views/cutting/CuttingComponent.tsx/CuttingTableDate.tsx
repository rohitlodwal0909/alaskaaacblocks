import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";

import noData from "src/assets/images/svgs/no-data.webp";
import CommonPagination from "src/utils/CommonPagination";
import { GetRisingdate } from "src/features/Cutting/CuttingSlice";
import { AppDispatch } from "src/store";

const CuttingTableDate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { risingdata, loading } = useSelector((state: any) => state.cutting);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(GetRisingdate());
  }, [dispatch]);

  const handleView = (id: string) => {
    navigate(`/cutting-list/${id}`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const safeParse = (value: any) => {
  if (!value || typeof value !== "string") return []; // return empty array if no data
  try {
    return JSON.parse(value);
  } catch (err) {
    return []; // return empty array if parse fails
  }
};


const getSizeSummary = (risingInfo: any) => {
  if (!Array.isArray(risingInfo) || risingInfo.length === 0) return [];

  const sizeSummary: Record<string, { ok: number; middle: number; broken: number }> = {};

  risingInfo.forEach((r) => {
    const c = r.cutting_info;
    if (!c) return;

    const sizes = safeParse(c.size);
    const okPcs = safeParse(c.ok_pcs).map(Number);
    const middle = safeParse(c.middle_crack).map(Number);
    const broken = safeParse(c.broken_pcs).map(Number);

    sizes.forEach((s: string, i: number) => {
      if (!sizeSummary[s]) {
        sizeSummary[s] = { ok: 0, middle: 0, broken: 0 };
      }
      sizeSummary[s].ok += okPcs[i] || 0;
      sizeSummary[s].middle += middle[i] || 0;
      sizeSummary[s].broken += broken[i] || 0;
    });
  });

  return Object.entries(sizeSummary).map(([size, counts]) => ({
    size,
    ok: counts.ok,
    middle: counts.middle,
    broken: counts.broken,
    total: counts.ok + counts.middle + counts.broken,
  }));
};






  // 🔎 Filtered & Paginated data
  const filteredItems = (risingdata || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();
    return (item?.date ? formatDate(item?.date).toLowerCase() : "").includes(searchText);
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
              {["Sr.No", "Date","Size","No.of Broken Block","No.of Middle Crack","Total Ok Pcs", "Action"].map((title) => (
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
                    {item.date ? formatDate(item.date) : "-"}
                  </td>
                   <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                  {getSizeSummary(item?.rising_info || []).map((s, i) => (
                  <div key={i}>{s.size}</div>
                ))}               
                    
                    </td> <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    {getSizeSummary(item?.rising_info || []).map((s, i) => (
                        <div key={i}>{s.broken}</div>
                      ))}                 
                                        
                                        </td> <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    {getSizeSummary(item?.rising_info || []).map((s, i) => (
                        <div key={i}>{s.middle}</div>
                      ))}                  
                                        
                                        </td> <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                      {getSizeSummary(item?.rising_info || []).map((s, i) => (
                        <div key={i}>{s.ok}</div>
                      ))}                  
                    
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

export default CuttingTableDate;
