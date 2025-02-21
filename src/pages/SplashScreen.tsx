/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { postRequest } from "../utils/api"; // Import the specific method

interface SplashScreenProps {
  theme: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ theme }) => {
  const navigate = useNavigate();

  const getDashboardRoute = useCallback((role: string | null) => {
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
  }, []);

  const handleAutoLogin = useCallback(async (savedUsername: string, savedPassword: string) => {
    try {
      const data = await postRequest("/users/login", { username: savedUsername, password: savedPassword });

      if (!data || !data.token) throw new Error(data?.message || "Auto-login failed");

      saveAuthDetails(data.token, savedUsername, data.role);
      navigate(getDashboardRoute(data.role));
    } catch (error: any) {
      console.error("Auto-login error:", error.message);
      navigate("/login"); // Redirect to login if auto-login fails
    }
  }, [getDashboardRoute, navigate]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const tokenExpiry = localStorage.getItem("authTokenExpiry");

    // Check if a valid token exists and is not expired
    if (authToken && tokenExpiry && new Date().getTime() < parseInt(tokenExpiry)) {
      const userRole = localStorage.getItem("authRole")?.replace(/"/g, "") || null; // Remove quotes and ensure it's a string or null
      navigate(getDashboardRoute(userRole));
      return;
    }

    // If token expired but "Remember Me" was checked, attempt auto-login
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedPassword = localStorage.getItem("rememberedPassword");

    if (savedUsername && savedPassword) {
      handleAutoLogin(savedUsername, atob(savedPassword)); // Decode password from base64
    } else {
      // Redirect to login after splash animation
      setTimeout(() => navigate("/login"), 4000);
    }
  }, [getDashboardRoute, handleAutoLogin, navigate]);

  // Function to store login details after successful login
  const saveAuthDetails = (token: string, username: string, role: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authTokenExpiry", (new Date().getTime() + 3600000).toString()); // Set expiry for 1 hour
    localStorage.setItem("authUser", JSON.stringify(username));
    localStorage.setItem("authRole", JSON.stringify(role));
  };

  return (
    <div className={`flex flex-col items-center justify-center h-screen transition-all duration-500 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Animated Logo */}
      <motion.img
        src="/logo.svg"
        alt="Logo"
        className="w-40 h-40"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 2 }}
        transition={{ duration: 2 }}
      />

      {/* Animated Text */}
      <motion.h1
        className="text-2xl font-bold mt-15"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Welcome to PetroFlow
      </motion.h1>

      <motion.p
        className="text-sm mt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        Your fuel station management solution
      </motion.p>
    </div>
  );
};

export default SplashScreen;