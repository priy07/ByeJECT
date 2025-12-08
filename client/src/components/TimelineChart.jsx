// // import React from "react";
// // import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// // const TimelineChart = ({ data }) => {
// //   return (
// //     <div className="bg-white p-4 rounded-xl shadow">
// //       <h2 className="text-xl mb-4 font-semibold">Moderation Over Time</h2>
// //       <LineChart width={900} height={300} data={data}>
// //         <CartesianGrid strokeDasharray="3 3" />
// //         <XAxis dataKey="date" />
// //         <YAxis />
// //         <Tooltip />
// //         <Legend />
// //         <Line type="monotone" dataKey="accept" stroke="#22c55e" />
// //         <Line type="monotone" dataKey="warning" stroke="#eab308" />
// //         <Line type="monotone" dataKey="alter" stroke="#fb923c" />
// //         <Line type="monotone" dataKey="reject" stroke="#ef4444" />
// //       </LineChart>
// //     </div>
// //   );
// // };

// // export default TimelineChart;
// import React from "react";
// import {
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from "recharts";

// const TimelineChart = ({ data }) => {
//   return (
//     <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-xl shadow-lg border dark:border-white/10 w-full">
//       <h2 className="text-xl font-semibold mb-3">Moderation Timeline</h2>

//       {data.length === 0 ? (
//         <p className="text-gray-400 text-center py-10">No moderation activity yet...</p>
//       ) : (
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis allowDecimals={false} />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="accept" stroke="#22c55e" />
//             <Line type="monotone" dataKey="alter" stroke="#fb923c" />
//             <Line type="monotone" dataKey="reject" stroke="#ef4444" />
//             <Line type="monotone" dataKey="warning" stroke="#eab308" />
//           </LineChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// };

// export default TimelineChart;
import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const TimelineChart = ({ data }) => {
  return (
    <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-xl shadow-lg border dark:border-white/10 w-full">

      {data.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No moderation activity yet...</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}> {/* 60% of parent width */}
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="accept" stroke="#22c55e" />
            <Line type="monotone" dataKey="alter" stroke="#fb923c" />
            <Line type="monotone" dataKey="reject" stroke="#ef4444" />
            <Line type="monotone" dataKey="warning" stroke="#eab308" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TimelineChart;
