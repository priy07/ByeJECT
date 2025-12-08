// // // // // // // import React from "react";

// // // // // // // const LogsTable = ({ logs }) => {
// // // // // // //   return (
// // // // // // //     <div className="bg-white p-4 rounded-xl shadow">
// // // // // // //       <h2 className="text-xl mb-4 font-semibold">Recent Logs</h2>

// // // // // // //       <table className="w-full border-collapse">
// // // // // // //         <thead>
// // // // // // //           <tr className="border-b text-left">
// // // // // // //             <th className="p-2">Timestamp</th>
// // // // // // //             <th className="p-2">User</th>
// // // // // // //             <th className="p-2">Prompt</th>
// // // // // // //             <th className="p-2">Action</th>
// // // // // // //           </tr>
// // // // // // //         </thead>
// // // // // // //         <tbody>
// // // // // // //           {logs.map((log) => (
// // // // // // //             <tr key={log.id} className="border-b text-sm">
// // // // // // //               <td className="p-2">{log.timestamp}</td>
// // // // // // //               <td className="p-2">{log.userId}</td>
// // // // // // //               <td className="p-2">{log.prompt}</td>
// // // // // // //               <td className="p-2 font-bold text-blue-600">{log.action}</td>
// // // // // // //             </tr>
// // // // // // //           ))}
// // // // // // //         </tbody>
// // // // // // //       </table>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default LogsTable;
// // // // // // import React from "react";

// // // // // // const actionColors = {
// // // // // //   accept: "text-green-500 bg-green-100 border-green-300",
// // // // // //   alter: "text-orange-500 bg-orange-100 border-orange-300",
// // // // // //   warning: "text-yellow-600 bg-yellow-100 border-yellow-300",
// // // // // //   reject: "text-red-500 bg-red-100 border-red-300",
// // // // // // };

// // // // // // const LogsTable = ({ logs = [] }) => {
// // // // // //   return (
// // // // // //     <div className="bg-white rounded-xl shadow p-6 overflow-auto">
// // // // // //       <h2 className="text-xl font-semibold mb-4">Moderation Logs</h2>

// // // // // //       <table className="min-w-full border-collapse">
// // // // // //         <thead>
// // // // // //           <tr className="border-b bg-gray-50">
// // // // // //             <th className="p-3 text-left">Action</th>
// // // // // //             <th className="p-3 text-left">Reason</th>
// // // // // //             <th className="p-3 text-left">Prompt</th>
// // // // // //             <th className="p-3 text-left">Altered?</th>
// // // // // //             <th className="p-3 text-left">Timestamp</th>
// // // // // //           </tr>
// // // // // //         </thead>

// // // // // //         <tbody>
// // // // // //           {logs.map((log, idx) => (
// // // // // //             <tr
// // // // // //               key={idx}
// // // // // //               className="border-b hover:bg-gray-50 transition select-none"
// // // // // //             >
// // // // // //               <td className="p-3">
// // // // // //                 <span
// // // // // //                   className={`px-3 py-1 rounded-full text-sm border ${actionColors[log.action]}`}
// // // // // //                 >
// // // // // //                   {log.action}
// // // // // //                 </span>
// // // // // //               </td>

// // // // // //               <td className="p-3 w-64">
// // // // // //                 <div className="text-gray-700 text-sm line-clamp-3">
// // // // // //                   {log.reason || "—"}
// // // // // //                 </div>
// // // // // //               </td>

// // // // // //               <td className="p-3 w-80">
// // // // // //                 <div className="text-gray-600 text-sm line-clamp-2">
// // // // // //                   {log.prompt}
// // // // // //                 </div>
// // // // // //               </td>

// // // // // //               <td className="p-3">
// // // // // //                 <span
// // // // // //                   className={`px-2 py-1 rounded text-sm ${
// // // // // //                     log.altered
// // // // // //                       ? "bg-purple-100 text-purple-600"
// // // // // //                       : "bg-gray-200 text-gray-700"
// // // // // //                   }`}
// // // // // //                 >
// // // // // //                   {log.altered ? "Yes" : "No"}
// // // // // //                 </span>
// // // // // //               </td>

// // // // // //               <td className="p-3 text-sm text-gray-500">
// // // // // //                 {new Date(log.timestamp).toLocaleString()}
// // // // // //               </td>
// // // // // //             </tr>
// // // // // //           ))}

// // // // // //           {logs.length === 0 && (
// // // // // //             <tr>
// // // // // //               <td colSpan="5" className="p-6 text-center text-gray-500">
// // // // // //                 No logs available.
// // // // // //               </td>
// // // // // //             </tr>
// // // // // //           )}
// // // // // //         </tbody>
// // // // // //       </table>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default LogsTable;
// // // // // import React from "react";

// // // // // const actionColors = {
// // // // //   accept: "text-green-500 bg-green-100 border-green-300",
// // // // //   alter: "text-orange-500 bg-orange-100 border-orange-300",
// // // // //   warning: "text-yellow-600 bg-yellow-100 border-yellow-300",
// // // // //   reject: "text-red-500 bg-red-100 border-red-300",
// // // // // };

// // // // // const LogsTable = ({ logs = [], onAction }) => {
// // // // //   return (
// // // // //     <div className="bg-white rounded-xl shadow p-6 overflow-auto">
// // // // //       <h2 className="text-xl font-semibold mb-4" style={{ color: '#000' }}>Moderation Logs</h2>

// // // // //       <table className="min-w-full border-collapse">
// // // // //         <thead>
// // // // //           <tr className="border-b bg-black">
// // // // //             <th className="p-3 text-left">Action</th>
// // // // //             <th className="p-3 text-left">Reason</th>
// // // // //             <th className="p-3 text-left">Prompt</th>
// // // // //             <th className="p-3 text-left">Altered?</th>
// // // // //             <th className="p-3 text-left">Timestamp</th>
            
// // // // //           </tr>
// // // // //         </thead>

// // // // //         <tbody>
// // // // //           {logs.map((log, idx) => (
// // // // //             <tr
// // // // //               key={idx}
// // // // //               className="border-b hover:bg-gray-50 transition select-none"
// // // // //             >
// // // // //               <td className="p-3">
// // // // //                 <span
// // // // //                   className={`px-3 py-1 rounded-full text-sm border ${actionColors[log.action]}`}
// // // // //                 >
// // // // //                   {log.action}
// // // // //                 </span>
// // // // //               </td>

// // // // //               <td className="p-3 w-64">
// // // // //                 <div className="text-gray-700 text-sm line-clamp-3">
// // // // //                   {log.reason || "—"}
// // // // //                 </div>
// // // // //               </td>

// // // // //               <td className="p-3 w-80">
// // // // //                 <div className="text-gray-600 text-sm line-clamp-2">
// // // // //                   {log.prompt}
// // // // //                 </div>
// // // // //               </td>

// // // // //               <td className="p-3">
// // // // //                 <span
// // // // //                   className={`px-2 py-1 rounded text-sm ${
// // // // //                     log.altered
// // // // //                       ? "bg-purple-100 text-purple-600"
// // // // //                       : "bg-gray-200 text-gray-700"
// // // // //                   }`}
// // // // //                 >
// // // // //                   {log.altered ? "Yes" : "No"}
// // // // //                 </span>
// // // // //               </td>

// // // // //               <td className="p-3 text-sm text-gray-500">
// // // // //                 {log.timestamp ? new Date(log.timestamp).toLocaleString() : "Invalid Date"}
// // // // //               </td>

              
// // // // //             </tr>
// // // // //           ))}

// // // // //           {logs.length === 0 && (
// // // // //             <tr>
// // // // //               <td colSpan="6" className="p-6 text-center text-gray-500">
// // // // //                 No logs available.
// // // // //               </td>
// // // // //             </tr>
// // // // //           )}
// // // // //         </tbody>
// // // // //       </table>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default LogsTable;
// // // // import React from "react";

// // // // // Keep keys lowercase here for consistency
// // // // const actionColors = {
// // // //   accept: "text-green-500 bg-green-100 border-green-300",
// // // //   alter: "text-orange-500 bg-orange-100 border-orange-300",
// // // //   warning: "text-yellow-600 bg-yellow-100 border-yellow-300",
// // // //   reject: "text-red-500 bg-red-100 border-red-300",
// // // //   block: "text-red-600 bg-red-200 border-red-400", // Added BLOCK just in case
// // // // };

// // // // const LogsTable = ({ logs = [], onAction }) => {
// // // //   return (
// // // //     <div className="bg-white rounded-xl shadow p-6 overflow-auto">
// // // //       <h2 className="text-xl font-semibold mb-4" style={{ color: '#000' }}>Moderation Logs</h2>

// // // //       <table className="min-w-full border-collapse">
// // // //         <thead>
// // // //           <tr className="border-b bg-black">
// // // //             <th className="p-3 text-left">Action</th>
// // // //             <th className="p-3 text-left">Reason</th>
// // // //             <th className="p-3 text-left">Prompt</th>
// // // //             <th className="p-3 text-left">Altered?</th>
// // // //             <th className="p-3 text-left">Timestamp</th>
// // // //           </tr>
// // // //         </thead>

// // // //         <tbody>
// // // //           {logs.map((log, idx) => {
// // // //             // FIX: Force action to lowercase to match keys
// // // //             const actionKey = (log.action || "accept").toLowerCase();
// // // //             const colorClass = actionColors[actionKey] || actionColors.accept;

// // // //             return (
// // // //               <tr
// // // //                 key={log.id || log.request_id ||idx}
// // // //                 className="border-b hover:bg-gray-50 transition select-none"
// // // //               >
// // // //                 <td className="p-3">
// // // //                   <span
// // // //                     className={`px-3 py-1 rounded-full text-sm border ${colorClass}`}
// // // //                   >
// // // //                     {log.action}
// // // //                   </span>
// // // //                 </td>

// // // //                 <td className="p-3 w-64">
// // // //                   <div className="text-gray-700 text-sm line-clamp-3">
// // // //                     {log.reason || "—"}
// // // //                   </div>
// // // //                 </td>

// // // //                 <td className="p-3 w-80">
// // // //                   <div className="text-gray-600 text-sm line-clamp-2">
// // // //                     {log.prompt}
// // // //                   </div>
// // // //                 </td>

// // // //                 <td className="p-3">
// // // //                   <span
// // // //                     className={`px-2 py-1 rounded text-sm ${
// // // //                       log.altered
// // // //                         ? "bg-purple-100 text-purple-600"
// // // //                         : "bg-gray-200 text-gray-700"
// // // //                     }`}
// // // //                   >
// // // //                     {log.altered ? "Yes" : "No"}
// // // //                   </span>
// // // //                 </td>

// // // //                 <td className="p-3 text-sm text-gray-500">
// // // //                   {log.timestamp ? new Date(log.timestamp).toLocaleString() : "Invalid Date"}
// // // //                 </td>
// // // //               </tr>
// // // //             );
// // // //           })}

// // // //           {logs.length === 0 && (
// // // //             <tr>
// // // //               <td colSpan="6" className="p-6 text-center text-gray-500">
// // // //                 No logs available.
// // // //               </td>
// // // //             </tr>
// // // //           )}
// // // //         </tbody>
// // // //       </table>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default LogsTable;

// // // import React from "react";

// // // // Keep keys lowercase here for consistency
// // // const actionColors = {
// // //   accept: "text-green-500 bg-green-100 border-green-300",
// // //   alter: "text-orange-500 bg-orange-100 border-orange-300",
// // //   warning: "text-yellow-600 bg-yellow-100 border-yellow-300",
// // //   reject: "text-red-500 bg-red-100 border-red-300",
// // //   block: "text-red-600 bg-red-200 border-red-400", // Added BLOCK just in case
// // // };

// // // const LogsTable = ({ logs = [], onAction }) => {
// // //   return (
// // //     <div className="bg-white rounded-xl shadow p-6 overflow-auto">
// // //       <h2 className="text-xl font-semibold mb-4" style={{ color: '#000' }}>Moderation Logs</h2>

// // //       <table className="min-w-full border-collapse">
// // //         <thead>
// // //           <tr className="border-b bg-black">
// // //             <th className="p-3 text-left">Action</th>
// // //             <th className="p-3 text-left">Reason</th>
// // //             <th className="p-3 text-left">Prompt</th>
// // //             <th className="p-3 text-left">Altered?</th>
// // //             <th className="p-3 text-left">Timestamp</th>
// // //           </tr>
// // //         </thead>

// // //         <tbody>
// // //           {logs.map((log, idx) => {
// // //             // FIX: Force action to lowercase to match keys
// // //             const actionKey = (log.action || "accept").toLowerCase();
// // //             const colorClass = actionColors[actionKey] || actionColors.accept;

// // //             return (
// // //               <tr
// // //                 // 💡 UPDATED HERE: Prefers unique ID, falls back to index
// // //                 key={log.id || log.request_id || idx} 
// // //                 className="border-b hover:bg-gray-50 transition select-none"
// // //               >
// // //                 <td className="p-3">
// // //                   <span
// // //                     className={`px-3 py-1 rounded-full text-sm border ${colorClass}`}
// // //                   >
// // //                     {log.action}
// // //                   </span>
// // //                 </td>

// // //                 <td className="p-3 w-64">
// // //                   <div className="text-gray-700 text-sm line-clamp-3">
// // //                     {log.reason || "—"}
// // //                   </div>
// // //                 </td>

// // //                 <td className="p-3 w-80">
// // //                   <div className="text-gray-600 text-sm line-clamp-2">
// // //                     {log.prompt}
// // //                   </div>
// // //                 </td>

// // //                 <td className="p-3">
// // //                   <span
// // //                     className={`px-2 py-1 rounded text-sm ${
// // //                       log.altered
// // //                         ? "bg-purple-100 text-purple-600"
// // //                         : "bg-gray-200 text-gray-700"
// // //                     }`}
// // //                   >
// // //                     {log.altered ? "Yes" : "No"}
// // //                   </span>
// // //                 </td>

// // //                 <td className="p-3 text-sm text-gray-500">
// // //                   {log.timestamp ? new Date(log.timestamp).toLocaleString() : "Invalid Date"}
// // //                 </td>
// // //               </tr>
// // //             );
// // //           })}

// // //           {logs.length === 0 && (
// // //             <tr>
// // //               <td colSpan="6" className="p-6 text-center text-gray-500">
// // //                 No logs available.
// // //               </td>
// // //             </tr>
// // //           )}
// // //         </tbody>
// // //       </table>
// // //     </div>
// // //   );
// // // };

// // // export default LogsTable;
// // import React from "react";

// // // Keep keys lowercase for consistency
// // const actionColors = {
// //   accept: "text-green-500 bg-green-100 border-green-300",
// //   alter: "text-orange-500 bg-orange-100 border-orange-300",
// //   warning: "text-yellow-600 bg-yellow-100 border-yellow-300",
// //   reject: "text-red-500 bg-red-100 border-red-300",
// //   block: "text-red-600 bg-red-200 border-red-400",
// // };

// // const LogsTable = ({ logs = [] }) => {
// //   return (
// //     <div className="bg-white rounded-xl shadow p-6 overflow-auto">
// //       <h2 className="text-xl font-semibold mb-4" style={{ color: "#000" }}>
// //         Moderation Logs
// //       </h2>

// //       <table className="min-w-full border-collapse">
// //         <thead>
// //           <tr className="border-b bg-black text-white">
// //             <th className="p-3 text-left">Action</th>
// //             <th className="p-3 text-left">Reason</th>
// //             <th className="p-3 text-left">Prompt</th>
// //             <th className="p-3 text-left">Altered?</th>
// //             <th className="p-3 text-left">Timestamp</th>
// //           </tr>
// //         </thead>

// //         <tbody>
// //           {logs.length > 0 ? (
// //             logs.map((log, idx) => {
// //               const actionKey = (log.action || "accept").toLowerCase();
// //               const colorClass = actionColors[actionKey] || actionColors.accept;

// //               return (
// //                 <tr
// //                   key={log.id || log.request_id || idx}
// //                   className="border-b hover:bg-gray-50 transition select-none"
// //                 >
// //                   <td className="p-3">
// //                     <span
// //                       className={`px-3 py-1 rounded-full text-sm border ${colorClass}`}
// //                     >
// //                       {log.action || "accept"}
// //                     </span>
// //                   </td>

// //                   <td className="p-3 w-64">
// //                     <div className="text-gray-700 text-sm line-clamp-3">
// //                       {log.reason || "—"}
// //                     </div>
// //                   </td>

// //                   <td className="p-3 w-80">
// //                     <div className="text-gray-600 text-sm line-clamp-2">
// //                       {log.prompt || "—"}
// //                     </div>
// //                   </td>

// //                   <td className="p-3">
// //                     <span
// //                       className={`px-2 py-1 rounded text-sm ${
// //                         log.altered
// //                           ? "bg-purple-100 text-purple-600"
// //                           : "bg-gray-200 text-gray-700"
// //                       }`}
// //                     >
// //                       {log.altered ? "Yes" : "No"}
// //                     </span>
// //                   </td>

// //                   <td className="p-3 text-sm text-gray-500">
// //                     {log.timestamp
// //                       ? new Date(log.timestamp).toLocaleString()
// //                       : "Invalid Date"}
// //                   </td>
// //                 </tr>
// //               );
// //             })
// //           ) : (
// //             <tr>
// //               <td colSpan="5" className="p-6 text-center text-gray-500">
// //                 No logs available.
// //               </td>
// //             </tr>
// //           )}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default LogsTable;
// import React from "react";

// const actionColors = {
//   accept: "text-green-600 bg-green-100 border-green-300",
//   alter: "text-orange-600 bg-orange-100 border-orange-300",
//   warning: "text-yellow-700 bg-yellow-100 border-yellow-300",
//   reject: "text-red-600 bg-red-100 border-red-300",
//   block: "text-red-700 bg-red-200 border-red-400",
// };

// const LogsTable = ({ logs = [] }) => {
//   return (
//     <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow p-6 overflow-auto border dark:border-white/20">
//       <h2 className="text-xl font-semibold mb-4 dark:text-white">
//         Moderation Logs
//       </h2>

//       <table className="min-w-full border-collapse text-sm">
//         <thead className="bg-black dark:bg-white/10 text-white">
//           <tr>
//             <th className="p-3 text-left">Action</th>
//             <th className="p-3 text-left">Reason</th>
//             <th className="p-3 text-left">Prompt</th>
//             <th className="p-3 text-left">Altered</th>
//             <th className="p-3 text-left">Timestamp</th>
//           </tr>
//         </thead>

//         <tbody className="dark:text-white">
//           {logs.map((log, idx) => {
//             const actionKey = (log.action || "accept").toLowerCase();
//             const colorClass = actionColors[actionKey] || actionColors.accept;

//             return (
//               <tr
//                 key={log.id || log.request_id || idx}
//                 className="border-b hover:dark:bg-white/5 hover:bg-gray-50 transition"
//               >
//                 <td className="p-3">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs border ${colorClass}`}
//                   >
//                     {log.action || "Accept"}
//                   </span>
//                 </td>

//                 <td className="p-3 w-64">
//                   <p className="line-clamp-3 text-gray-700 dark:text-gray-300">
//                     {log.reason || "—"}
//                   </p>
//                 </td>

//                 <td className="p-3 w-80">
//                   <p className="line-clamp-2 text-gray-600 dark:text-gray-400">
//                     {log.prompt || "—"}
//                   </p>
//                 </td>

//                 <td className="p-3">
//                   <span
//                     className={`px-2 py-1 rounded text-xs ${
//                       log.altered
//                         ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300"
//                         : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
//                     }`}
//                   >
//                     {log.altered ? "Yes" : "No"}
//                   </span>
//                 </td>

//                 <td className="p-3 text-gray-500 dark:text-gray-400">
//                   {log.timestamp
//                     ? new Date(log.timestamp).toLocaleString()
//                     : "Invalid date"}
//                 </td>
//               </tr>
//             );
//           })}

//           {logs.length === 0 && (
//             <tr>
//               <td colSpan="5" className="p-6 text-center text-gray-500 dark:text-gray-400">
//                 No logs available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default LogsTable;
import React from "react";

const actionColors = {
  accept: "text-green-600 bg-green-100 border-green-300",
  alter: "text-blue-600 bg-blue-100 border-blue-300",
  warning: "text-yellow-700 bg-yellow-100 border-yellow-300",
  reject: "text-red-600 bg-red-100 border-red-300",
  block: "text-red-700 bg-red-200 border-red-400",
};

const LogsTable = ({ logs = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-auto">
      <h2 className="text-xl font-semibold mb-4 text-black">
        Moderation Logs
      </h2>

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b bg-black text-white">
            <th className="p-3 text-left">Action</th>
            <th className="p-3 text-left">Reason</th>
            <th className="p-3 text-left">Prompt</th>
            <th className="p-3 text-left">Altered</th>
            <th className="p-3 text-left">Timestamp</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log, idx) => {
            const actionKey = log?.action?.toLowerCase() || "accept";
            const colorClass = actionColors[actionKey] || actionColors.accept;

            const displayedReason =
              log.reason && log.reason.trim() !== ""
                ? log.reason
                : actionKey === "warning"
                ? "Potential sensitive content"
                : "Safe";

            const promptText =
              log.altered && log.sanitized_prompt
                ? log.sanitized_prompt
                : log.prompt;

            const formattedTime =
              log.timestamp && !log.timestamp.includes("Invalid")
                ? new Date(log.timestamp).toLocaleString()
                : "Unknown";

            return (
              <tr
                key={log.id || log.request_id || idx}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm border ${colorClass}`}
                  >
                    {actionKey}
                  </span>
                </td>

                <td className="p-3 w-64 text-sm text-gray-700">
                  {displayedReason}
                </td>

                <td className="p-3 w-80 text-sm text-gray-600 line-clamp-2">
                  {promptText}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      log.altered
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {log.altered ? "Yes" : "No"}
                  </span>
                </td>

                <td className="p-3 text-sm text-gray-500">{formattedTime}</td>
              </tr>
            );
          })}

          {logs.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="p-6 text-center text-gray-500 text-sm"
              >
                No logs available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogsTable;
