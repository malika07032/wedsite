import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import WeddingWebsitePage from "./pages/wedSite/WeddingWebsitePage";
import GuestsPage from "./pages/guests/GuestsPage";
import RsvpPage from "./pages/rsvp/RsvpPage"
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/wedding" element={<WeddingWebsitePage />} />
        <Route path="/wedding/guests" element={<GuestsPage />} />
        <Route path="wedding/rsvps" element={<RsvpPage />} />
        <Route path="/me" element={<DashboardPage />} />
        {/* You can add /dashboard and other routes later */}
      </Routes>
    </BrowserRouter>
  );
}
