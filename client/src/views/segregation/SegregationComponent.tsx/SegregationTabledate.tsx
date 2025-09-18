import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";

import noData from "src/assets/images/svgs/no-data.webp";
import CommonPagination from "src/utils/CommonPagination";
import { GetAutoclavedate } from "src/features/Segregation/SegregationSlice";
import { AppDispatch } from "src/store";
import AddSegregationModal from "./AddSegregationModal";

const SegregationTabledate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  const { autoclavedata, loading } = useSelector((state: any) => state.segregation);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [addmodal, setAddmodal] = useState(false);


const getSizeSummary = (SegragationInfo: any[]) => {
  if (!Array.isArray(SegragationInfo) || SegragationInfo.length === 0) return [];

  const sizeSummary: Record<
    string,
    { receiveBlocks: number; ok: number; middle: number; broken: number }
  > = {};

  SegragationInfo.forEach((item) => {
    if (!item) return;

    // Parse arrays safely (default to [])
    const sizes = JSON.parse(item.size || "[]");
    const okPcs = JSON.parse(item.no_of_ok_pcs || "[]").map(Number);
    const receiveBlocks = JSON.parse(item.receive_blocks || "[]").map(Number);
    const broken = JSON.parse(item.no_of_broken_pcs || "[]").map(Number);
    const middle = JSON.parse(item.no_of_middle_crack_pcs || "[]").map(Number);

    sizes.forEach((s: string, i: number) => {
      if (!sizeSummary[s]) {
        sizeSummary[s] = { receiveBlocks: 0, ok: 0, middle: 0, broken: 0 };
      }

      sizeSummary[s].ok += okPcs[i] || 0;
      sizeSummary[s].receiveBlocks += receiveBlocks[i] || 0;
      sizeSummary[s].middle += middle[i] || 0;
      sizeSummary[s].broken += broken[i] || 0;
    });
  });

  // return as array for easy mapping
  return Object.entries(sizeSummary).map(([size, counts]) => ({
    size,
    ok: counts.ok,
    middle: counts.middle,
    broken: counts.broken,
    receiveBlocks: counts.receiveBlocks,
    percentage: counts.ok / counts.receiveBlocks * 100,
    total: counts.ok + counts.middle + counts.broken, // total pcs
  }));
};



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


        <Button
          onClick={() => setAddmodal(true)}
          className="w-fit rounded-sm ml-2"
          color="primary"
        >
          Create Segregation
        </Button>


        
      </div>
      {/* 📊 Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Sr.No", "Date","Size","Total Receive Block","Total Broken Block","Total OK Block","Ratio Total Blocks %", "Action"].map((title) => (
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
  {getSizeSummary(item.segrication_info).map((s, i) => (
    <div key={i}>
      {s.size}
    </div>
  ))}
</td>
 <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
  {getSizeSummary(item.segrication_info).map((s, i) => (
    <div key={i}>
      {s.receiveBlocks}
    </div>
  ))}
</td> <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
  {getSizeSummary(item.segrication_info).map((s, i) => (
    <div key={i}>
      {s.broken}
    </div>
  ))}
</td>
 <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
  {getSizeSummary(item.segrication_info).map((s, i) => (
    <div key={i}>
       {s.ok}
    </div>
  ))}
</td>

                  
                  
               
                <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
  {getSizeSummary(item.segrication_info).map((s, i) => (
    <div key={i}>
       {s.percentage} {"%"}
    </div>
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
        <AddSegregationModal setShowmodal={setAddmodal} show={addmodal} logindata={logindata} />

     
    </div>
  );
};

export default SegregationTabledate;
