import { Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import noData from "src/assets/images/svgs/no-data.webp";
import CommonPagination from "src/utils/CommonPagination";
import { GetBatchingdate } from "src/features/batching/BatchingSlice";
import { AppDispatch } from "src/store";
import AddBatchModal from "./AddBatchModal";
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan";
import { useNavigate } from "react-router";

const BatchingdateTable = ({ logindata }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { batching, loading } = useSelector((state: any) => state.batching);

  const [showmodal, setShowmodal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");

  useEffect(() => {
    dispatch(GetBatchingdate());
  }, [dispatch]);


const handleView = (id) => {
    navigate(`/batching-list/${id}`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

 const filteredItems = (batching || []).filter((item: any) => {
  const searchText = searchTerm.toLowerCase();

  const matchesSearch =
    
    (item?.batch_date ? formatDate(item?.batch_date).toLowerCase() : "").includes(searchText) 

  const matchesShift = shiftFilter
    ? (item?.shift || "").toString().toLowerCase() === shiftFilter.toLowerCase()
    : true;

  return matchesSearch && matchesShift;
});

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  return (
    <div>

      <div className="">
        <div className="flex items-center gap-2 mb-3 justify-end">
          <input
            type="text"
            placeholder="Search by any field..."
            className=" border rounded-md border-gray-300 "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
         
        
        <Button
          onClick={() => {
            setShowmodal(true);
            triggerGoogleTranslateRescan();
          }}
          className="w-fit rounded-sm"
          color="primary"
        >
          Create New Batching
        </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Sr.No",  "Batch Date", "Action"].map((title) => (
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
                <td colSpan={7} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item: any, index: number) => (
                <tr key={item.id} className="bg-white dark:bg-gray-900">
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300"> #{(currentPage - 1) * pageSize + index + 1}</td>
                 
                 
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item.batch_date ? formatDate(item.batch_date) : ""}
                  </td>
                  
                  <td className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300">
                    <div className="flex justify-start gap-2">
                      <Tooltip content="View" placement="bottom">
                        <Button
                          size="sm"
                          color={"lightsecondary"}
                          className="p-0"
                          onClick={() => {
                            handleView(item?.sample_id);
                          }}
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

      <AddBatchModal show={showmodal} setShowmodal={setShowmodal} logindata={logindata}batchingdata={batching} />

    </div>
  );
};

export default BatchingdateTable;
