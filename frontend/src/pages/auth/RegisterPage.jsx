import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm";
import API from "../../api/axios";

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async ({ email, password }) => {
    try {
      const { response } = await API.post(
        "/register",
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );

      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error(err.response);
      alert(err.response?.data?.detail || "Registration failed");
    }
  };

  return <AuthForm onSubmit={handleRegister} type="register" />;
}
