import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm";
import API from "../../api/axios";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email); // Backend expects "username"
      formData.append("password", password);

      const { data } = await API.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      localStorage.setItem("accessToken", data.access_token);
      navigate("/me");
    } catch (err) {
      alert("Login failed: " + err.response?.data?.detail || "Unknown error");
    }
  };

  return <AuthForm onSubmit={handleLogin} type="login" />;
}
