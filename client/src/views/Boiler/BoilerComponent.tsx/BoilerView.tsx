import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { GetBoilerSingle } from "src/features/Boiler/BoilerSlice";
import { AppDispatch } from "src/store";

const BoilerView = () => {
    const dispatch = useDispatch<AppDispatch>();
  const [signleAutoClave, setSignleAutoclave] = useState<any>(null); // you can type it properly if needed
  const { id } = useParams();

  useEffect(() => {
    const fetchSingleAutoclave = async () => {
        try {
            const result = await dispatch(GetBoilerSingle(id)).unwrap();
       
  setSignleAutoclave(result)
        
        } catch (error) {
          console.error("Failed to fetch Autoclave:", error);
        }
    
    };

    fetchSingleAutoclave();
  },[id]);
  return (
    < >
    <div className="border border-black text-black text-sm w-full">
      {/* Top Row: Company Name and Address */}
      <div className="flex justify-between items-start border-b border-black p-1">
        {/* Left side: Logo and tagline */}
        <div className="w-2/3 p-3">
          <h1 className="font-bold text-4xl">Dinero <span className="font-bold">FoodWorks</span></h1>
          <p className="text-sm uppercase tracking-wide">— Serving to make the right foods —</p>
        </div>
        {/* Right side: Address */}
        <div className="w-1/3 text-right text-xs leading-snug p-3">
          <p><strong>Dinero FoodWorks</strong></p>
          <p>Address: Survey No. 354/2, Gram Badiya Keema,</p>
          <p>Near BRG Logistic Park, Nemawar Road,</p>
          <p>Indore - 452016 (M.P.)</p>
        </div>
      </div>

      {/* Middle Row: Title */}
      <div className="text-center font-semibold border-b border-black p-2">
        <h2 className="text-base">Daily Log Sheet for Wood Fired Boiler</h2>
      </div>

      {/* Bottom Row: Info Table */}
      <div className="grid grid-cols-2  text-xs">
        {/* Left Table */}
        <div className="grid grid-cols-1 border-r border-black">
          <div className=" border-black p-1 font-semibold">Department</div>
          <div className="p-1 p-1 border-b border-black">Engineering</div>
          <div className=" border-black p-1 font-semibold">Implementation Area</div>
          <div className="p-1 ">Boiler Area</div>
        </div>

        {/* Right Table */}
        <div className="grid grid-cols-2">
          <div className="border-r border-b border-black p-1 font-semibold">Document ID.</div>
          <div className="p-1 border-b border-black">DFW/EN/WI-006/FRM/02</div>
          <div className="border-r border-b border-black p-1 font-semibold">Version</div>
          <div className="p-1 border-b border-black">1.00</div>
          <div className="border-r border-b border-black p-1 font-semibold">DOI</div>
          <div className="p-1 border-b border-black">01.05.2024</div>
          <div className="border-r  border-black p-1 font-semibold">Page No.</div>
          <div className="p-1 ">Page 1 of 1</div>
        </div>
      </div>
    </div>
    <div className="font-sans text-sm text-gray-900">
      <div className="border border-t-0 border-black ">
      


<div className="p-4">
       
       <div className="w-full border border-black text-black text-sm">
  {/* Header Row */}
  <div className="flex items-center justify-between border-b border-black">
    <div className="flex-1 border-r border-black px-2 py-1">
      <p><strong>Equipment ID</strong></p>
    </div>
    {/* <div className="flex-1 border-r border-black px-2 py-1">
      <p><strong>Location</strong></p>
    </div> */}
    <div className="flex-1 border-r border-black px-2 py-1">
      <p><strong>Frequency</strong></p>
    </div>
    <div className="flex-[2] px-2 py-1">
      <h2 className="text-center font-semibold">Daily Log Sheet for Wood Fired Boiler</h2>
    </div>
  </div>

  {/* Second Row */}
  <div className="flex items-center  border-black">
    <div className="flex-1 border-r border-black px-2 py-1">
      <p>#{signleAutoClave?.id}</p>
    </div>
    {/* <div className="flex-1 border-r border-black px-2 py-1">
      <p>{signleAutoClave?.location}</p>
    </div> */}
    <div className="flex-1 border-r border-black px-2 py-1">
      <p>2 Hourly</p>
    </div>
    <div className="flex-[2] px-2 py-1">
      <div className="flex justify-around">
        <p><strong>Date:</strong>  <span>{signleAutoClave?.date}</span></p>
       
        <p><strong>Shift: </strong> <span>{signleAutoClave?.shift} </span></p>
        
      </div>
    </div>
  </div>
</div>
        <div className="mt-4 overflow-auto ">
         {signleAutoClave && (
  <table className="w-full border border-black text-xs mt-4">
    <thead>
      <tr className="bg-gray-200">
        <th className="border border-black px-2 py-1">Time</th>
        {/* <th className="border border-black px-2 py-1">Feed Water Temp.</th>
        <th className="border border-black px-2 py-1">Feed Water TDS</th>
        <th className="border border-black px-2 py-1">Water meter Reading</th> */}
        <th className="border border-black px-2 py-1">Steam Pressure (bar)</th>
        <th className="border border-black px-2 py-1">Stack Temp.</th>
       
        <th className="border border-black px-2 py-1">Back inlet Temp.</th>
        <th className="border border-black px-2 py-1">FD Reading (HRS.)</th>
        <th className="border border-black px-2 py-1">Ph Booster Chemical</th>
        <th className="border border-black px-2 py-1">Antiscalant Chemical </th>
        {/* <th className="border border-black px-2 py-1">Energy Meter Reading</th> */}
        <th className="border border-black px-2 py-1">Done By</th>
      </tr>
    </thead>
    <tbody>
      {JSON.parse(signleAutoClave?.time || "[]").map((_: any, i: number) => (
        <tr key={i}>
          <td className="border border-black px-2 py-1">
           {new Date(JSON.parse(signleAutoClave?.time)[i]).toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
})}
          </td>
          {/* <td className="border border-black px-2 py-1">
            {JSON.parse(signleAutoClave?.feed_water_temp || "[]")[i] || "-"}
          </td>
          <td className="border border-black px-2 py-1">
            {JSON.parse(signleAutoClave?.feed_water_tds || "[]")[i] || "-"}
          </td>
          <td className="border border-black px-2 py-1">
            {JSON.parse(signleAutoClave?.water_meter_reading || "[]")[i] || "-"}
          </td> */}
          <td className="border border-black px-2 py-1">
            {JSON.parse(signleAutoClave?.steam_pressure || "[]")[i] || "-"}
          </td>
          <td className="border border-black px-2 py-1">
            {JSON.parse(signleAutoClave?.stack_temp || "[]")[i] || "-"}
          </td>
          <td className="border border-black px-2 py-1"> {JSON.parse(signleAutoClave?.inlet_temp || "[]")[i] || "-"}</td>
          <td className="border border-black px-2 py-1">  {JSON.parse(signleAutoClave?.fd_fan_reading || "[]")[i] || "-"} </td>
        
          <td className="border border-black px-2 py-1">
            {JSON.parse(signleAutoClave?.ph_booster || "[]")[i] || "-"}
          </td>
          <td className="border border-black px-2 py-1">     {JSON.parse(signleAutoClave?.antiscalnt_chemical || "[]")[i] || "-"}</td>
          {/* <td className="border border-black px-2 py-1">
            {JSON.parse(signleAutoClave?.energy_meter_reading || "[]")[i] || "-"}
          </td> */}
          <td className="border border-black px-2 py-1">
            {signleAutoClave?.done_by || "-"}
          </td>
        </tr>
      ))}
      {/* Total Row */}
      <tr>
        <td colSpan={8} className="border border-black px-2 py-1 font-semibold text-right">
       Wood consumption Total:
        </td>
        <td className="border border-black px-2 py-1">
          {signleAutoClave?.total_wood_consumption}
          {/* {
            JSON.parse(signleAutoClave?.wood_consumption || "[]").reduce(
              (acc: number, val: string) => acc + parseFloat(val || "0"),
              0
            )
          } */}
        </td>
        <td className="border border-black px-2 py-1" colSpan={3}></td>
      </tr>
    </tbody>
  </table>
)}

        </div>

        <div className="pt-6 grid grid-cols-3 text-sm">
          <p><strong>Prepared By FSTTL:</strong> </p>
          <p><strong>Verified By:</strong> </p>
          <p><strong>Approved By Engineering Head:</strong> </p>
        
        </div>
</div>
      </div>
    </div>
    </>
  );
}
export default BoilerView;