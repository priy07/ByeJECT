import React from "react";

const cards = [
  { key: "accept", label: "Accepted", color: "bg-green-500" },
  { key: "warning", label: "Warnings", color: "bg-yellow-500" },
  { key: "alter", label: "Altered", color: "bg-orange-500" },
  { key: "reject", label: "Rejected", color: "bg-red-500" },
];

const StatsCards = ({ stats }) => {
  if (!stats) return "Loading...";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.key} className={`p-4 rounded-xl text-white ${c.color}`}>
          <h2 className="text-xl font-bold">{c.label}</h2>
          <p className="text-3xl mt-2">{stats[c.key] ?? 0}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
