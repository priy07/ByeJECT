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
