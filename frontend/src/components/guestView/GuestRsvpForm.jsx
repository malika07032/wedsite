import React, { useState } from "react";
import API from "../../api/axios";

const RSVP_OPTIONS = ["Pending", "Yes", "No", "Maybe"];
const GROUP_OPTIONS = ["Family", "Friends", "Coworkers", "Others"];

const GuestRsvpForm = ({ guest, token, onSubmitted }) => {
    console.log(guest);

    const [status, setStatus] = useState(guest.rsvp_status || "");
    const [group, setGroup] = useState(guest.group || "");
    const [meal, setMeal] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
        await API.post(`/guest-view/${token}/rsvp`, {
            attending: status,
            group: group,
            meal_preference: meal,
            notes,
        });
        onSubmitted(); // Trigger reload or confirmation
        } catch (err) {
        setError("Failed to submit RSVP. Please try again.");
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

      return (
        <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}

        <label className="block">
            RSVP Status:
            <select
            className="block w-full mt-1 border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            >
            <option value="">Select...</option>


            {RSVP_OPTIONS.map((status) => (
                <option key={status} value={status}>
                {status[0].toUpperCase() + status.slice(1)}
                </option>
            ))}

            </select>
        </label>

        <label className="block">
            How are you related to the couple:
            <select
            className="block w-full mt-1 border p-2 rounded"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            required
            >
            <option value="">Select...</option>


            {GROUP_OPTIONS.map((status) => (
                <option key={status} value={status}>
                {status[0].toUpperCase() + status.slice(1)}
                </option>
            ))}

            </select>
        </label>

        <label className="block">
            Meal Preference:
            <input
            type="text"
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
            className="block w-full mt-1 border p-2 rounded"
            placeholder="Optional"
            />
        </label>

        <label className="block">
            Notes:
            <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="block w-full mt-1 border p-2 rounded"
            rows="3"
            placeholder="Optional"
            />
        </label>

        <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            {loading ? "Submitting..." : "Submit RSVP"}
        </button>
        </form>
    );

};

export default GuestRsvpForm;