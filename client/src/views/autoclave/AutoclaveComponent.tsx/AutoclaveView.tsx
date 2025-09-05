import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { GetAutoclaveSingle } from "src/features/Autoclave/AutoclaveSlice";
import { AppDispatch } from "src/store";
  import dayjs from "dayjs";

const AutoclaveView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [singleAutoClave, setSingleAutoclave] = useState<any>(null);
  const { id } = useParams();

const formatTime = (time: string) => {
  if (!time) return "-";

  // Ek dummy date ke saath combine karo
  const parsed = dayjs(`2000-01-01T${time}`);

  if (!parsed.isValid()) return "-";

  return parsed.format("hh:mm A"); // 02:10 PM
};



  useEffect(() => {
    const fetchSingleAutoclave = async () => {
      try {
        const result = await dispatch(GetAutoclaveSingle(id)).unwrap();
        setSingleAutoclave(result);
      } catch (error) {
        console.error("Failed to fetch Autoclave:", error);
      }
    };

    fetchSingleAutoclave();
  }, [id]);


  return (
    <div className="max-w-7xl mx-auto p-4 border border-black text-sm font-sans bg-white">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-black pb-1 mb-2">
        <h2 className="font-bold uppercase text-base">Alaska Build Block Company</h2>
        <div className="text-right">
          <span className="font-semibold">Date:</span>{" "}
          {singleAutoClave?.datetime
            }
        </div>
      </div>

      <div className="flex justify-between my-2">
        <div>
          <span className="font-semibold">Mould No:</span>{" "}
          {singleAutoClave?.mould_no}
        </div>
       
      </div>

      {/* Main Table */}
      <table className="w-full border border-black border-collapse text-[13px]">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-black px-2 py-1">Autoclave No.</th>
            <th className="border border-black px-2 py-1">Material Receipt</th>
            <th className="border border-black px-2 py-1">Door Closing</th>
            <th className="border border-black px-2 py-1">Vacuum On</th>
            <th className="border border-black px-2 py-1">Vacuum Off</th>
            <th className="border border-black px-2 py-1">Rising Pressure (Time)</th>
            <th className="border border-black px-2 py-1">Rising Pressure (Value)</th>
            <th className="border border-black px-2 py-1">Holding Pressure (Time)</th>
            <th className="border border-black px-2 py-1">Holding Pressure (Value)</th>
            <th className="border border-black px-2 py-1">Release Pressure (Time)</th>
            <th className="border border-black px-2 py-1">Release Pressure (Value)</th>
            <th className="border border-black px-2 py-1">Door Opening</th>
          </tr>
        </thead>
        <tbody>
  {singleAutoClave?.records?.map((r: any, index: number) => (
    <tr key={r.id || index}>
      <td className="border px-2 py-1 text-center">{r.autoclave_no}</td>
      <td className="border px-2 py-1 text-center">{formatTime(r.material_receipt_time)}</td>
      <td className="border px-2 py-1 text-center">{formatTime(r.door_closing_time)}</td>
      <td className="border px-2 py-1 text-center">{formatTime(r.vacuum_on_time)}</td>
      <td className="border px-2 py-1 text-center">{formatTime(r.vacuum_off_time)}</td>
      <td className="border px-2 py-1 text-center">{formatTime(r.rising_pressure_time)}</td>
      <td className="border px-2 py-1 text-center">{r.rising_pressure_value || "-"}</td>
      <td className="border px-2 py-1 text-center">{formatTime(r.holding_pressure_time)}</td>
      <td className="border px-2 py-1 text-center">{r.holding_pressure_value || "-"}</td>
      <td className="border px-2 py-1 text-center">{formatTime(r.release_pressure_time)}</td>
      <td className="border px-2 py-1 text-center">{r.release_pressure_value || "-"}</td>
      <td className="border px-2 py-1 text-center">{formatTime(r.door_opening_time)}</td>
    </tr>
  ))}
</tbody>

      </table>

      {/* Footer */}
      <div className="mt-4 font-semibold text-sm">
        Operator Name:
        <div className="mt-1 italic text-blue-600">
          ✍🏻 {singleAutoClave?.operator_name || ""}
        </div>
      </div>
    </div>
  );
};

export default AutoclaveView;
