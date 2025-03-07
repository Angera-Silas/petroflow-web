/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "../components/popups/NotificationPopup";
import TextInputField from "../components/inputs/TextInputField";
import Button from "../components/buttons/Button";
import { postRequest } from "../utils/api";

interface LoginProps {
  theme: string;
}

const Login: React.FC<LoginProps> = ({ theme }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [notification, setNotification] = useState<{ title: string; message: string; type: "error" | "success" | "info" | "warning" } | null>(null);

  // Function to save auth details in local storage
  const saveAuthDetails = (token: string, username: string, role: string) => {
    const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 1 day expiry

    localStorage.setItem("authToken", token);
    localStorage.setItem("authTokenExpiry", expiryTime.toString());
    localStorage.setItem("authUser", username);
    localStorage.setItem("authRole", JSON.stringify(role));

    if (rememberMe) {
      localStorage.setItem("rememberedUsername", username);
      localStorage.setItem("rememberedPassword", btoa(password)); // Encode password
    } else {
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberedPassword");
    }
  };

  // Function to determine dashboard route based on user role
  const getDashboardRoute = (role: string | null) => {
    switch (role) {
      case "SYSTEM_ADMIN":
        return "/system-admin-dashboard";
      case "ORGANIZATION_ADMIN":
        return "/organization-dashboard";
      case "RETAILER":
        return "/retailer-dashboard";
      case "ACCOUNTANT":
        return "/accountant-dashboard";
      case "STATION_MANAGER":
        return "/station-manager-dashboard";
      case "DEPARTMENT_MANAGER":
        return "/department-manager-dashboard";
      case "QUALITY_MARSHAL":
        return "/quality-dashboard";
      default:
        return "/login"; // Default to login if role is unknown
    }
  };

  // Login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setNotification({ title: "Error", message: "Please fill in all fields.", type: "error" });
      return;
    }

    setNotification({ title: "Info", message: "Logging in...", type: "info" });

    try {
      const data = await postRequest("/users/login", { username, password });

      if (!data || !data.token) {
        throw new Error(data?.message || "Login failed");
      }

      saveAuthDetails(data.token, username, data.role);
      setNotification({ title: "Success", message: "Login successful!", type: "success" });

      setTimeout(() => navigate(getDashboardRoute(data.role)), 1500);
    } catch (error: any) {
      setNotification({ title: "Error", message: error.message, type: "error" });
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen bg-cover bg-center ${theme}`}>
      <div className="absolute top-1/4 z-30 p-4">
        {notification && (
          <NotificationPopup
            title={notification.title}
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
      <div className="w-full max-w-md p-8 border border-gray-200 bg-white/20 backdrop-blur-md rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-2">PetroFlow</h1>
        <h2 className="text-xl text-white text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInputField
            label="Username or Email"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            name="username"
            theme={theme}
          />

          <TextInputField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minlength={6}
            maxlength={15}
            name="password"
            theme={theme}
          />

          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2 cursor-pointer w-4 h-4"
              />
              <span>Show Password</span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/reset-password")}
              className="hover:underline text-blue-500"
            >
              Forgot Password?
            </button>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2 cursor-pointer w-4 h-4"
            />
            <span className="text-white text-sm">Remember me</span>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Login</Button>
          </div>
        </form>

        <p className="text-white text-center text-sm mt-4">
          Don't have an account?{" "}
          <button onClick={() => navigate("/signup")} className="font-semibold hover:underline text-blue-500">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
