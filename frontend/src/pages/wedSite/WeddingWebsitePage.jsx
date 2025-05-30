import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import WeddingForm from "../../components/wedSite/WeddingForm";
import WeddingDisplay from "../../components/wedSite/WeddingDisplay";

const WeddingWebsitePage = () => {
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWebsite = async () => {
    try {
      const response = await API.get("/me/website");
      setWebsite(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        // No website created yet — show form
        setWebsite(null);
      } else if (err.response?.status === 401) {
        setError("You're unauthorized");
      } else {
        setError("Failed to load your wedding website.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsite();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {website ? (
        <WeddingDisplay website={website} />
      ) : (
        <WeddingForm onCreated={setWebsite} />
      )}
    </div>
  );
};

export default WeddingWebsitePage;
