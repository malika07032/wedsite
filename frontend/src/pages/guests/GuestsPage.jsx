import React from "react";
import GuestList from "../../components/guests/GuestList";

const GuestsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Guests</h1>
      <GuestList />
    </div>
  );
};

export default GuestsPage;
