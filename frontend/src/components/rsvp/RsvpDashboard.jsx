import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import API from "../../api/axios";

const RsvpDashboard = () => {
  const [stats, setStats] = useState({
    yes: 0,
    no: 0,
    maybe: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await API.get("/me/rsvps");
        const guests = response.data;
        const counts = { yes: 0, no: 0, maybe: 0, pending: 0 };

        guests.forEach((guest) => {
          const status = guest.rsvp_status?.toLowerCase();
          if (counts[status] !== undefined) {
            counts[status]++;
          }
        });

        setStats(counts);
      } catch (err) {
        console.error("Failed to fetch RSVP data", err);
        setError("Could not load RSVP stats.");
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

  if (loading) return <p>Loading RSVP stats...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">RSVP Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Yes" count={stats.yes} color="green" />
        <StatCard label="No" count={stats.no} color="red" />
        <StatCard label="Maybe" count={stats.maybe} color="yellow" />
        <StatCard label="Pending" count={stats.pending} color="gray" />
      </div>
    </div>
  );
};



export default RsvpDashboard;