import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import API from "../../api/axios";

const RSVP_OPTIONS = ["Pending", "Yes", "No", "Maybe"];
const GROUP_OPTIONS = ["Family", "Friends", "Coworkers", "Others"];

const RsvpDashboard = () => {
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const getGuests = async () => {
      try {
        const response = await API.get("/me/rsvps");
        console.log(response.data);
        setGuests(response.data);
        setFilteredGuests(response.data);
      } catch (err) {
        console.error("Error loading guests", err);
        setError("Failed to load RSVP data.");
      }
    };
    getGuests();
  }, []);

  useEffect(() => {
    const filtered = guests.filter((guest) => {
      const matchStatus = statusFilter
        ? guest.rsvp_status?.toLowerCase() === statusFilter.toLocaleLowerCase()
        : true;
      const matchGroup = groupFilter ? guest.group.toLowerCase() === groupFilter.toLowerCase() : true;
      return matchStatus && matchGroup;
    });
    setFilteredGuests(filtered);
  }, [statusFilter, groupFilter, guests]);

  const getStats = (guests) => {
    const counts = { yes: 0, no: 0, maybe: 0, pending: 0 };
    guests.forEach((g) => {
      const status = g.rsvp_status?.toLowerCase();
      if (counts[status] !== undefined) counts[status]++;
    });
    return counts;
  };

  if (error) return <p className="text-red-600">{error}</p>;

  const stats = getStats(filteredGuests);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">RSVP Dashboard</h1>

      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {RSVP_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status[0].toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
        >
          <option value="">All Groups</option>
          {GROUP_OPTIONS.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Yes" count={stats.yes} color="green" />
        <StatCard label="No" count={stats.no} color="red" />
        <StatCard label="Maybe" count={stats.maybe} color="yellow" />
        <StatCard label="Pending" count={stats.pending} color="gray" />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">
          Filtered Guests ({filteredGuests.length})
        </h2>
        <ul className="divide-y">
          {filteredGuests.map((guest) => (
            <li key={guest.id} className="py-2">
              <span className="font-medium">{guest.name}</span> –{" "}
              <span className="italic text-sm">{guest.group}</span> –{" "}
              <span className="capitalize">{guest.rsvp_status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RsvpDashboard;
