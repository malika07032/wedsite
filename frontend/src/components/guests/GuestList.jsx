import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import GuestForm from "./GuestForm";

const GuestList = () => {
  const [guests, setGuests] = useState([]);
  const [editingGuest, setEditingGuest] = useState(null);

  const fetchGuests = async () => {
    try {
      const res = await API.get("/me/guests");
      setGuests(res.data);
    } catch (err) {
      console.error("Failed to load guests", err);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleEdit = (guest) => setEditingGuest(guest);
  const handleCancel = () => setEditingGuest(null);

  const handleSubmit = () => {
    fetchGuests();
    setEditingGuest(null);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Guest List</h1>

      {editingGuest ? (
        <GuestForm
          mode="edit"
          initialValues={editingGuest}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <GuestForm mode="create" onSubmit={fetchGuests} />
      )}

      <ul className="mt-6 space-y-4">
        {guests.map((guest) => (
          <li
            key={guest.id}
            className="bg-white p-4 rounded shadow flex justify-between items-start"
          >
            <div>
              <p className="font-semibold">{guest.name}</p>
              <p className="text-sm text-gray-600">{guest.email || "No email"}</p>
              <p className="text-sm">Group: {guest.group || "None"}</p>
              <p className="text-sm">RSVP: {guest.rsvp_status}</p>
              <p className="text-xs text-gray-500 break-all">
                Guest Link: /guest-view/{guest.token}
              </p>
            </div>
            <button
              onClick={() => handleEdit(guest)}
              className="bg-blue-600 text-white px-3 py-1 rounded h-fit"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuestList;