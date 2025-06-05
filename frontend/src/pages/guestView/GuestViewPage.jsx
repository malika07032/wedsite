import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import GuestRsvpForm from "../../components/guestView/GuestRsvpForm";

const GuestViewPage = () => {
    const { token } = useParams();

    const [guest, setGuest] = useState(null);
    const [website, setWebsite] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGuestView = async () => {
        try {
            const res = await API.get(`/guest-view/${token}`);
            const guest = {
                name: res.data.guest_name,
                group: res.data.group,
                rsvp_status: res.data.rsvp_status
            }
            setGuest(guest);

            const website = {
                "title": res.data.title, 
                "date": res.data.date,
                "location": res.data.location,
                "story": res.data.story
            }
            setWebsite(website);
        } catch (err) {
            console.error("Failed to load guest view", err);
            setError("Invalid or expired link.");
        }
        };

        fetchGuestView();
    }, [token]);

    if (error) return <p className="text-red-600 p-6">{error}</p>;
    if (!guest || !website) return <p className="p-6">Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">{website.title}</h1>
        <p className="text-gray-700 mb-4">
            {new Date(website.date).toLocaleDateString()} | {website.location}
        </p>
        <p className="mb-6">{website.story}</p>

        <h2 className="text-xl font-semibold mb-4">
            Hi {guest.name}, please RSVP below:
        </h2>

        {submitted ? (
            <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded">
            Thank you for your response!
            </div>
        ) : (
            <GuestRsvpForm
            guest={guest}
            token={token}
            onSubmitted={() => setSubmitted(true)}
            />
        )}
        </div>
    );

};

export default GuestViewPage;
