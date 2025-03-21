import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import AppLayout from "./layouts/AppLayout";
import AdminDashboard from "./pages/dashboards/SystemAdminDashboard";
import AboutUs from "./pages/AboutUs";
import CreateNewUser from "./pages/CreateNewUser";
import AddOrganizationPage from "./pages/CreateNewOrganization";
import CreateNewFacility from "./pages/CreateNewFacility";
import CreateNewEmployee from "./pages/CreatenNewEmployee";
import Login from "./pages/LoginPage";
import ResetPassword from "./pages/ResetPage";
import SplashScreen from "./pages/SplashScreen";
import NotFound from "./pages/NotFound";
import GeneralCalendar from "./components/calendar/Calendar";
import ManageEmployees from "./pages/ManageEmployees";
import ManageUsers from "./pages/ManageUsers";
import StationManagerDashboard from "./pages/dashboards/StationManagerDashboard";
import DepartmentManagerDashboard from "./pages/dashboards/DepartmentManagerDashboard";
import RetailerDashboard from "./pages/dashboards/RetailerDashboard";
import OrganizationAdminDashboard from "./pages/dashboards/OrganizationAdminDashboard";
import QualityMarshalDashboard from "./pages/dashboards/QualityMarshalDashboard";
import ManageUserPermissions from "./pages/ManageUserRolesAndPermissions";
import ManageOrganizations from "./pages/ManageOrganizations";
import ManageRolesAndPermissions from "./pages/ManageRolesAndPermissions";
import UserProfileView from "./pages/UserProfileView";
import ProductManagement from "./pages/ProductManagement";
import SellPoints from "./pages/SellPoints";
import ManageEmployeeShifts from "./pages/ManageEmployeeShifts";
import ManageInventory from "./pages/ManageInventory";
import PumpManagement from "./pages/PumpManagement";

const RoutesComponent = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "dark"; // Default to "dark" if no theme is saved
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes (No Layout) */}
        <Route path="/" element={<SplashScreen theme={theme} />} />
        <Route path="/login" element={<Login theme={theme} />} />
        <Route path="/reset-password" element={<ResetPassword theme={theme} />} />
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<NotFound theme={theme} />} />

        {/* Protected Routes (Require Login, Wrapped in Layout) */}
        <Route element={<AppLayout theme={theme} toggleTheme={toggleTheme} />}>
          <Route path="system-admin-dashboard" element={<AdminDashboard theme={theme} />} />
          <Route path="users/add" element={<CreateNewUser theme={theme} />} />
          <Route path="companies/add" element={<AddOrganizationPage theme={theme} />} />
          <Route path="employees/add" element={<CreateNewEmployee theme={theme} />} />
          <Route path="facilities/add" element={<CreateNewFacility theme={theme} />} />
          <Route path="calendar" element={<GeneralCalendar theme={theme} />} />
          <Route path="about" element={<AboutUs theme={theme} />} />
          <Route path="employees/manage" element={<ManageEmployees theme={theme} />} />
          <Route path="users/manage" element={<ManageUsers theme={theme} />} />
          <Route path="station-manager-dashboard" element={<StationManagerDashboard theme={theme} />} />  
          <Route path="companies/manage" element={<ManageOrganizations theme={theme} />} />
          <Route path="users/manage/permissions" element={<ManageUserPermissions theme={theme} />} />
          <Route path="users/roles/manage" element={<ManageRolesAndPermissions theme={theme} />} />
          <Route path="users/view" element={<UserProfileView theme={theme} />} />
          <Route path="employees/shifts" element={<ManageEmployeeShifts theme={theme} />} />
          <Route path="products/manage" element={<ProductManagement theme={theme} />} />
          <Route path="sales/sell-points" element={<SellPoints theme={theme} />} />
          <Route path="inventory/manage" element={<ManageInventory theme={theme} />} />
          <Route path="sales/meter-reading" element={<PumpManagement theme={theme} />} />
          
          
         
  
        </Route>
      </Routes>
    </Router>
  );
};

export default RoutesComponent;
