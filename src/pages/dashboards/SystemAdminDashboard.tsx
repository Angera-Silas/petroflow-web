/* eslint-disable @typescript-eslint/no-unused-vars */
import { FaUsers, FaBox, FaMoneyBillWave, FaHome } from "react-icons/fa";
import Table from "../../components/tables/CustomTable";
import { useState, useEffect } from "react";
import { getRequest } from "../../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface AdminDashboardProps {
  theme: string;
}

interface Organization {
  name: string;
  physicalAddress: string;
  town: string;
  street: string;
  postalCode: string;
  type: string;
  email: string;
  phone: string;
  facilityCount: number;
  employeeCount: number;
}

interface Users {
  firstname: string;
  lastname: string;
  role: string;
  department: string;
  email: string;
  organizationName: string;
  facilityName: string;
}

interface Facility{
  name: string;
  county: string;
  town: string;
  street: string;
  phone: string;
  email: string;
  physicalAddress: string;
  postalCode: string;
  servicesOffered: string;
  employeeCount: number;
  orgName: string;
}

const AdminDashboard = ({ theme }: AdminDashboardProps) => {
  
  const user = useSelector((state: RootState) => state.user);

  const isDarkMode = theme === "dark"; // Check the theme prop

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning" } | null>(null);

  const showNotification = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await getRequest("/organizations/get/details/all");

        if (!response) {
          throw new Error("Invalid response from server");
        }

        setOrganizations(response);
        setLoading(false); // Ensure loading is set to false once data is fetched
      } catch (error) {
        showNotification("Error", "Failed to fetch organizations", "error");
        setLoading(false);
      }
    };

    fetchOrganizations();

  }, []);



  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const userResponse = await getRequest("/organization-employee/details/get/all");
        if (!userResponse) {
          throw new Error("Invalid response from server");
        }

        setUsers(userResponse);
        setLoading(false);
      } catch (error) {
        showNotification("Error", "Failed to fetch employees", "error");
        setLoading(false);
      }
    };

    fetchUsers();

  }, []);


  useEffect(() => {

    const fetchFacilities = async () => {
      try {
        const facilityResponse = await getRequest("/facilities/get/all/details");
        if (!facilityResponse) {
          throw new Error("Invalid response from server");
        }

        setFacilities(facilityResponse);
        setLoading(false);
      } catch (error) {
        showNotification("Error", "Failed to fetch facilities", "error");
        setLoading(false);
      }
    };

    fetchFacilities();

  }, []);


  // Transform organizations data to match table structure
  const organizationData = organizations.map((org) => ({
    Name: org.name,
    Type: org.type,
    Location: (
      <>
          {org.physicalAddress || "Unknown Address"} - {org.postalCode || ""}
          <br />
          {org.street || ""}, {org.town || ""}
      </>
  ),
    Email: org.email,
    Phone: org.phone,
    Facilities: org.facilityCount.toString(),
    Employees: org.employeeCount, // Update if worker data is available
  }));



  const usersData = users.map((user) => ({
    "First Name": user.firstname,
    "Last Name": user.lastname,
    Role: user.role,
    Email: user.email,
    Organization: user.organizationName,
    Facility: user.facilityName,
    Department: user.department,
  }));
 

  const facilitiesData = facilities.map((facility) => ({
    Name: facility.name || "N/A",
    Organization: facility.orgName || "N/A",
    Location: (
        <>
            {facility.physicalAddress || "Unknown Address"} - {facility.postalCode || ""}
            <br />
            {facility.street || ""}, {facility.town || ""}
        </>
    ),
    Email: facility.email || "N/A",
    Phone: facility.phone || "N/A",
    Employees: facility.employeeCount ?? 0,
    "Products/Services": Array.isArray(facility.servicesOffered)
        ? facility.servicesOffered.join(", ")
        : facility.servicesOffered || "N/A",
}));



  const notifications = [
    { type: "new_user", message: "New user registered.", sender: "Admin" },
    { type: "new_facility", message: "5 new facilities added to Shell Company.", sender: "Manager" },
    { type: "new_sale", message: "Sale of Ksh 25,000 completed.", sender: "Cashier" },
  ];


  const getIcon = (type: string) => {
    switch (type) {
      case "new_user":
        return "✅";
      case "new_facility":
        return "📦";
      case "new_sale":
        return "💰";
      case "new_feature":
        return "🚀";
      default:
        return "🔔";
    }
  };

  return (
    <div className="p-6 container mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-6">System Administrator Dashboard</h1>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <FaUsers />, label: "Total Users", value: "1,245" },
          { icon: <FaHome />, label: "Total Companies Registered", value: "150" },
          { icon: <FaBox />, label: "Facilities", value: "350" },
          { icon: <FaMoneyBillWave />, label: "Revenue", value: "Ksh 2,500,000" },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-lg flex items-center space-x-4 
            ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}
          >
            <span className="text-3xl">{item.icon}</span>
            <div>
              <p className="text-sm">{item.label}</p>
              <p className="text-lg font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div
        className={`mt-8 p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
      >
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-3">
          {notifications.map((notification, index) => (
            <li
              key={index}
              className={`text-sm border-b pb-2 ${isDarkMode ? "border-gray-700" : "border-gray-300"
                }`}
            >
              {getIcon(notification.type)} <strong>{notification.message}</strong>
              <span className="text-gray-500"> (by {notification.sender})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Users Table */}
      <Table title="Users" columns={["First Name", "Last Name", "Role", "Email", "Organization", "Facility", "Department"]} data={usersData} theme={theme} itemsPerPage={15} />

      {/* Organizations Table with real data */}
      <Table title="Organizations" columns={["Name","Type", "Location", "Email", "Phone", "Facilities", "Employees"]} data={organizationData} theme={theme} />

      {/* Facilities Table */}
      <Table title="Stations / Facilities" columns={["Name", "Name", "Location", "Email", "Phone", "Employees", "Products/Services"]} data={facilitiesData} theme={theme} itemsPerPage={15} />
    </div>
  );
};

export default AdminDashboard;