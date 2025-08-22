// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useParams } from "react-router";
// import { GetAutoclaveSingle } from "src/features/Autoclave/AutoclaveSlice";
// import { AppDispatch } from "src/store";

// const FinishGoodView = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [signleAutoClave, setSignleAutoclave] = useState<any>(null); // you can type it properly if needed
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchSingleAutoclave = async () => {
//         try {
//             const result = await dispatch(GetAutoclaveSingle(id)).unwrap();
       
//   setSignleAutoclave(result)
        
//         } catch (error) {
//           console.error("Failed to fetch Autoclave:", error);
//         }
    
//     };

//     fetchSingleAutoclave();
//   },[id]);
//   return (
//     <div className="max-w-5xl mx-auto p-4 border border-black text-sm font-sans bg-white">
//       <div className="flex justify-between items-start border-b border-black pb-1">
//         <h2 className="font-bold uppercase text-base">Build Block Company</h2>
//         <div className="text-right">
//           <span className="font-semibold text-dark">Date:</span> {new Date(signleAutoClave?.created_at).toLocaleDateString("en-GB", {
//   day: "2-digit",
//   month: "long",
//   year: "numeric",
// })}
//         </div>
//       </div>

//       <div className="flex justify-between my-2">
//         <div>
//           <span className="font-semibold text-dark">Autoclave No.:</span> {signleAutoClave?.mould_no}
//         </div>
//         <div>
//           <span className="font-semibold text-dark">ON TIME :-</span>{signleAutoClave?.on_time ? new Date(`1970-01-01T${signleAutoClave?.
//                       on_time}`).toLocaleTimeString("en-IN", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: true,
//                       }) : "-"}
//         </div>
//       </div>

//       <table className="w-full border border-black border-collapse text-[13px]">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-black text-dark px-1 py-1 w-[5%]">Sr.no.</th>
//             <th className="border border-black text-dark px-1 py-1 w-[35%]">Process</th>
//             <th className="border border-black text-dark px-1 py-1 w-[15%]">Time (min)</th>
//             <th className="border border-black text-dark px-1 py-1 w-[15%]">Actual</th>
//             <th className="border border-black text-dark px-1 py-1 w-[30%]">Remarks/TIME</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td className="border border-black px-1  text-dark py-1 text-center">1</td>
//             <td className="border border-black px-1  text-dark py-1">Door steam</td>
//             <td className="border border-black px-1 py-1 text-center">15</td>
//             <td className="border border-black px-1 py-1 text-center">{signleAutoClave?.door_steam_time ? new Date(`1970-01-01T${signleAutoClave?.
//                       door_steam_time}`).toLocaleTimeString("en-IN", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: true,
//                       }) : "-"}</td>
//             <td className=" text-center px-1 py-1 align-top"> {signleAutoClave?.remark|| ""}</td>
//           </tr>
//           <tr>
//             <td className="border border-black text-dark px-1 py-1 text-center">2</td>
//             <td className="border border-black text-dark px-1 py-1">vanccum steam</td>
//             <td className="border border-black px-1 py-1 text-center">15-20</td>
//             <td className="border border-black px-1 py-1 text-center"> {signleAutoClave?.vacuum_steam_time ? new Date(`1970-01-01T${signleAutoClave?.
//                       vacuum_steam_time}`).toLocaleTimeString("en-IN", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: true,
//                       }) : "-"}</td>
           
//           </tr>
//   <tr>
//   <td className="border border-black px-1 py-1 text-dark text-center align-top">3</td>
//   <td className="border border-black px-0 py-0" colSpan={3}>
//     <div className="text-center font-semibold text-dark py-1 border-b border-black">
//       Steam pressure 11(kg/cm2)
//     </div>
//     <table className="w-full table-fixed border-collapse">
//     <tbody>
//   {signleAutoClave?.steam_pressure
//     ?.split(",")
//     .map((val: string, index: number, arr: string[]) => {
//       const isFirst = index === 0;
//       const isLast = index === arr.length - 1;

//       return (
//         <tr key={index}>
//           <td
//             className={`border border-black px-1 text-dark py-1 text-center ${
//               isFirst ? "border-t-0" : ""
//             } ${isLast ? "border-b-0" : ""} border-l-0`}
//           >
//             {index + 1} hour
//           </td>
//           <td
//             className={`border border-black px-1 py-1 text-center ${
//               isFirst ? "border-t-0" : ""
//             } ${isLast ? "border-b-0" : ""}`}
//           >
          
//           </td>
//           <td
//             className={`border border-black px-1 py-1 text-center ${
//               isFirst ? "border-t-0" : ""
//             } ${isLast ? "border-b-0" : ""} border-e-0`}
//           >
//             {val.trim()}
//           </td>
        
//         </tr>
//       );
//     })}
// </tbody>
//     </table>
//   </td>
//   <td className=" px-1 py-1"></td>
// </tr>

//           <tr>
//             <td className="border border-black px-1 py-1 text-dark text-center">4</td>
//             <td className="border border-black  border-b-0 text-center px-1 py-1" colSpan={3}>
//               Hold steam pressure time <b>6HRS</b> Transfer/release of steam
//               pressure for 3 hour
//             </td>
           
//           </tr>
//           <tr>
//             <td className="border border-black px-1 py-1 text-dark text-center">5</td>
//             <td className="border border-black border-t-0 px-1 py-1" colSpan={3}></td>
        
//           </tr>
//         </tbody>
//       </table>

//       <div className="mt-4 font-semibold text-dark text-sm">
//         OPERATOR NAME
//         <div className="mt-1 italic text-blue-600">
//           ✍🏻 {signleAutoClave?.operator_name}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FinishGoodView;
