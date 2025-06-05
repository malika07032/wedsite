import React from "react";

const StatCard = ({ label, count, color }) => {
  const bgMap = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    gray: "bg-gray-100 text-gray-800",
  };

  return (
    <div className={`rounded-lg p-4 shadow ${bgMap[color]}`}>
      <h2 className="text-xl font-semibold">{label}</h2>
      <p className="text-3xl">{count}</p>
    </div>
  );
};

export default StatCard;