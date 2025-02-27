/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SidebarMenu from "../components/sidebar/UsersSideBar";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useDispatch } from "react-redux";
import { setUserData } from "../store/slices/userSlice";
import { getRequest } from "../utils/api";

interface AppLayoutProps {
  theme: string;
  toggleTheme: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ theme, toggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    const username = localStorage.getItem("authUser")?.replace(/"/g, "") || null;

    if (!username) {
      window.location.href = "/login";
      return;
    }

    try {
      const userDetails = await getRequest(`/users/get/username/${username}`);
      if (!userDetails?.id) {
        console.error("User details not found");
        window.location.href = "/login";
        return;
      }

      const employeeDetails = await getRequest(`/employees/info/${userDetails.id}`);
      if (!employeeDetails) {
        console.error("Employee details not found");
        window.location.href = "/login";
        return;
      }

      const userData = {
        userId: userDetails.id,
        username: userDetails.username,
        email: employeeDetails.email,
        name: `${employeeDetails.firstname} ${employeeDetails.lastname}`,
        jobTitle: employeeDetails.jobTitle,
        employmentType: employeeDetails.employmentType,
        department: employeeDetails.department,
        role: userDetails.role,
        organizationId: employeeDetails.organizationId,
        facilityId: employeeDetails.facilityId,
        organizationName: employeeDetails.organizationName,
        facilityName: employeeDetails.facilityName,
        address: `${employeeDetails.physicalAddress} - ${employeeDetails.postalCode}`,
        town: employeeDetails.city,
        phone: employeeDetails.phoneNumber,
        employeeNo: employeeDetails.employeeNo,
      };

      dispatch(setUserData(userData)); // Store data in Redux

    } catch (error) {
      console.error("Error fetching user data:", error);
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleToggleSidebar = () => {
    toggleSidebar(); // Collapse or expand the sidebar
  };

  return (
    <div className={`flex w-full h-screen ${theme === "dark" ? "bg-dark-background text-dark-text" : "bg-light-background text-light-text"}`}>
      {/* Sidebar */}
      <SidebarMenu isOpen={isSidebarOpen} theme={theme} />

      {/* Main Content */}
      <div className={`flex flex-col h-screen flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-60" : "ml-16"}`}>
        {/* Header */}
        <Header toggleSidebar={handleToggleSidebar} theme={theme} toggleTheme={toggleTheme} />

        {/* Main Content with Padding to Avoid Overlap */}
        <div
          className={`flex-1 overflow-y-auto pt-2 transition-all duration-300 
          ${theme === "dark" ? "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" : "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"}`}
        >
          <main className="flex-1 p-2">
            <Outlet /> {/* Dynamically renders content based on route */}
          </main>
          <div className={`bottom-0 items-center justify-center`}>
            <Footer theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;