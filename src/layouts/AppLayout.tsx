import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarMenu from "../components/sidebar/UsersSideBar";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

interface AppLayoutProps {
  theme: string;
  toggleTheme: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ theme, toggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleToggleSidebar = () => {
    
    toggleSidebar(); // Collapse or expand the sidebar
  };

  return (
    <div className={`flex w-full h-screen ${theme === "dark" ? "bg-dark-background text-dark-text" : "bg-light-background text-light-text"}`}>
      {/* Sidebar */}
      <SidebarMenu isOpen={isSidebarOpen}  theme={theme} />

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
