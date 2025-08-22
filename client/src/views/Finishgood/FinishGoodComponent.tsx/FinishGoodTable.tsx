import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import noData from "src/assets/images/svgs/no-data.webp";
import { AppDispatch } from "src/store";
import { GetFinishGood,  } from "src/features/Segregation/SegregationSlice";
import { Button } from "flowbite-react";
import AddFinishGoodModal from "./AddFinishGoodModal";

const FinishGoodTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { finishgood, loading } = useSelector((state: any) => state.segregation);
  const [addmodal, setAddmodal] = useState(false);

  const sizeOptions = [
    "600x200x225",
    "600x200x200",
    "600x200x150",
    "600x200x100",
    "600x200x75",
  ];

  useEffect(() => {
    dispatch(GetFinishGood());
  }, []);

  const okPcsTotalPerSize: Record<string, number> = {};
sizeOptions.forEach((size) => (okPcsTotalPerSize[size] = 0));
// 🔁 Use all filtered items, not paginated ones
(finishgood || []).forEach((item) => {
  let sizes: string[] = [];
  let okPcs: string[] = [];

  try {
    sizes = JSON.parse(item.size || "[]");
    okPcs = JSON.parse(item.no_of_ok_pcs || "[]");
  } catch (e) {
    console.error("Parsing error", e);
  }

  sizes.forEach((sz: string, index: number) => {
    const pcs = parseInt(okPcs[index] || "0", 10);
    if (sizeOptions.includes(sz)) {
      okPcsTotalPerSize[sz] += pcs;
    }
  });
});
  const hasData = (finishgood|| []).length > 0;
  return (
    <div>

        <div className="flex justify-end">
            <Button className="p-0   bg-primary rounded-md "
                onClick={() => {
                  setAddmodal(true);
                }}
              >
               Create Entry  {/* <Icon icon="ic:baseline-plus" height={18} /> */}
              </Button>
          </div> 

      {loading ? (
        <div className="text-center py-6">Loading...</div>
      ) : hasData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {sizeOptions.map((size) => (
            <div key={size} className="bg-light dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="mt-2  text-lg font-semibold text-green-700">Size : <span className="text-gray-400">{size}</span> </h3>
              <p className="mt-2 text-lg font-semibold text-green-700">OK Pcs :<span className="text-gray-400"> {okPcsTotalPerSize[size]}</span>  </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-8">
          <img src={noData} alt="No data" height={100} width={100} className="mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      )}

      {/* Hidden Pagination Logic */}
      <AddFinishGoodModal setShowmodal={setAddmodal} show={addmodal} />
     
    </div>
  );
};

export default FinishGoodTable;
