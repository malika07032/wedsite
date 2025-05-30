import React from "react";
import dayjs from "dayjs";

const WeddingDisplay = ({ website, onEditClick }) => {
  if (!website) return null;

  const { title, date, location, story } = website;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <button
        onClick={onEditClick}
        className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Edit
      </button>

      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 mb-2">
        <strong>Date:</strong> {dayjs(date).format("MMMM D, YYYY")}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Location:</strong> {location}
      </p>
      <div>
        <h2 className="text-xl font-semibold mb-1">Our Story</h2>
        <p className="text-gray-700 whitespace-pre-line">{story}</p>
      </div>
    </div>
  );
};

export default WeddingDisplay;
