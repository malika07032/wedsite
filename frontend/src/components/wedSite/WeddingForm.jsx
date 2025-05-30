import React, { useState } from "react";
import API from "../../api/axios";

const WeddingForm = ({
  onCreated,
  onCancel,
  initialValues = null,
  mode = "create",
}) => {
  const [form, setForm] = useState({
    title: initialValues?.title || "",
    date: initialValues?.date?.split("T")[0] || "",
    location: initialValues?.location || "",
    story: initialValues?.story || "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Ensure full datetime format for the backend
      const payload = {
        ...form,
        date: `${form.date}T00:00:00`, // append dummy time
      };

      const url = "/me/website";
      const method = mode === "edit" ? API.put : API.post;
      const response = await method(url, payload);

      onCreated(response.data); // Pass new website data to parent
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response.data?.detail === "Website already exists for this user."
      ) {
        setError("You have already created a wedding website.");
      } else {
        setError("Failed to create website. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white rounded shadow"
    >
      <h2 className="text-xl font-semibold mb-4">
        {mode === "edit"
          ? "Update Your Wedding Info"
          : "Create Your Wedding Dashboard"}
      </h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="mb-3">
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium">Location</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Your Story</label>
        <textarea
          name="story"
          value={form.story}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="flex justify-between gap-4 mt-4">
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
        >
          {mode === "edit" ? "Save Changes" : "Create Dashboard"}
        </button>

        {mode === "edit" && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default WeddingForm;
