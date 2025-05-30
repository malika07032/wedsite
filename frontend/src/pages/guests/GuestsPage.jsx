import React, { useState } from "react";
import GuestList from "../../components/guests/GuestList";

const GuestsPage = () => {
  const [error, setError] = useState("");

  return (
    <div className="p-6">
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div>
        <h1 className="text-3xl font-bold mb-6">Manage Guests</h1>
        <GuestList onError={(msg) => setError(msg)} />
      </div>
      
    </div>
  );
};

export default GuestsPage;
