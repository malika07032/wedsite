import React, { useState } from "react";
import API from "../../api/axios";

const RSVP_OPTIONS = ["Pending", "Yes", "No", "Maybe"];
const GROUP_OPTIONS = ["Family", "Friends", "Coworkers", "Others"];

const GuestForm = ({
  onSubmit,
  onCancel,
  initialValues = null,
  mode = "create",
}) => {
  const [form, setForm] = useState({
    name: initialValues?.name || "",
    email: initialValues?.email || "",
    group: initialValues?.group || "",
    rsvp_status: initialValues?.rsvp_status || "Pending",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = { ...form };
      if (!payload.email) delete payload.email;
      if (!payload.group) delete payload.group;

      let response;
      if (mode === "edit" && initialValues?.id) {
        response = await API.put(`/me/guests/${initialValues.id}`, payload);
      } else {
        console.log(payload)
        response = await API.post("/me/guests", payload);
      }

      onSubmit(response.data);
    } catch (err) {
      setError("Failed to submit guest.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">
        {mode === "edit" ? "Edit Guest" : "Add Guest"}
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
        className="w-full border p-2 mb-2 rounded"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email (optional)"
        className="w-full border p-2 mb-2 rounded"
      />

      <select
        name="group"
        value={form.group}
        onChange={handleChange}
        className="w-full border p-2 mb-2 rounded"
      >
        <option value="">Select Group (optional)</option>
        {GROUP_OPTIONS.map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>

      <select
        name="rsvp_status"
        value={form.rsvp_status}
        onChange={handleChange}
        className="w-full border p-2 mb-4 rounded"
      >
        {RSVP_OPTIONS.map((status) => (
          <option key={status} value={status}>
            RSVP: {status}
          </option>
        ))}
      </select>

      <div className="flex justify-between gap-4">
        <button
          type="submit"
          className="bg-pink-600 text-white px-4 py-2 rounded w-full"
        >
          {mode === "edit" ? "Save Changes" : "Add Guest"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-black px-4 py-2 rounded w-full"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default GuestForm;
