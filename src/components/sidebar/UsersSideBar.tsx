import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt, FaBuilding, FaGasPump, FaUsers, FaUserPlus, FaChartBar,
  FaBox, FaTools, FaCalendarAlt, FaRegChartBar, FaExclamationTriangle, FaHandshake,
  FaWarehouse, FaChevronDown, FaChevronRight, FaInfo
} from 'react-icons/fa';
import logo from '../../assets/logo.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

// Define menu items with refined roles
const menuItems = [
  { name: "Dashboard", path: "/system-admin-dashboard", icon: <FaTachometerAlt />, roles: ["SYSTEM_ADMIN"] },
  { name: "Dashboard", path: "/organization-admin-dashboard", icon: <FaTachometerAlt />, roles: ["ORGANIZATION_ADMIN"] },
  { name: "Dashboard", path: "/station-manager-dashboard", icon: <FaTachometerAlt />, roles: ["STATION_MANAGER"] },
  { name: "Dashboard", path: "/quality-marshal-dashboard", icon: <FaTachometerAlt />, roles: ["QUALITY_MARSHAL"] },
  { name: "Dashboard", path: "/department-manager-dashboard", icon: <FaTachometerAlt />, roles: ["DEPARTMENT_MANAGER"] },
  { name: "Dashboard", path: "/accountant-dashboard", icon: <FaTachometerAlt />, roles: ["ACCOUNTANT"] },
  { name: "Dashboard", path: "/retailer-dashboard", icon: <FaTachometerAlt />, roles: ["RETAILER"] },


  {
    name: "Companies", icon: <FaBuilding />,
    roles: ["SYSTEM_ADMIN"],
    subItems: [
      { name: "Add New Company", path: "/companies/add", roles: ["SYSTEM_ADMIN"] },
      { name: "Manage Companies", path: "/companies/manage", roles: ["SYSTEM_ADMIN"] },
      { name: "View Company", path: "/company/view", roles: ["SYSTEM_ADMIN"] },
    ],
  },

  {
    name: "Users", icon: <FaUsers />,
    roles: ["SYSTEM_ADMIN"],
    subItems: [
      { name: "Add User", path: "/users/add", roles: ["SYSTEM_ADMIN"] },
      { name: "Manage Users", path: "/users/manage", roles: ["SYSTEM_ADMIN"] },
      { name: "View User", path: "/users/view", roles: ["SYSTEM_ADMIN"] },
      { name: "Roles & Permissions", path: "/users/roles/manage", roles: ["SYSTEM_ADMIN"] },
      { name: "User Permissions", path: "/users/manage/permissions", roles: ["SYSTEM_ADMIN"] },
    ],
  },

  {
    name: "Facilities/Stations", icon: <FaGasPump />,
    roles: ["SYSTEM_ADMIN", "ORGANIZATION_ADMIN", "RETAILER"],
    subItems: [
      {
        name: "New Facility", path: "/facilities/add",
        roles: ["SYSTEM_ADMIN", "ORGANIZATION_ADMIN"]
      },
      {
        name: "Manage Facilies", path: "/facilities/manage",
        roles: ["SYSTEM_ADMIN", "ORGANIZATION_ADMIN"]
      },
      {
        name: "View Facility", path: "/facility/view",
        roles: ["SYSTEM_ADMIN", "ORGANIZATION_ADMIN"]
      },
      {name: "Facility Performance", path: "/facilities/performance", roles: ["RETAILER"]},
    ],
  },

  {
    name: "Employees Mgt", icon: <FaUserPlus />,
    roles: ["STATION_MANAGER", "DEPARTMENT_MANAGER", "RETAILER", "ORGANIZATION_ADMIN", "SYSTEM_ADMIN"],
    subItems: [
      { name: "Add Employee", path: "/employees/add", roles: ["STATION_MANAGER", "ORGANIZATION_ADMIN", "SYSTEM_ADMIN"] },
      { name: "Manage Employees", path: "/employees/manage", roles: ["STATION_MANAGER", "ORGANIZATION_ADMIN", "SYSTEM_ADMIN"] },
      { name: "View Employee", path: "/employee/view", roles: ["STATION_MANAGER", "ORGANIZATION_ADMIN", "SYSTEM_ADMIN", "DEPARTMENT_MANAGER"] },
      { name: "Performance Summary", path: "/employees/performance-summary", roles: ["ALL"] },
      { name: "Employee Shifts", path: "/employees/shifts", roles: ["STATION_MANAGER", "DEPARTMENT_MANAGER", "SYSTEM_ADMIN"] },
      {name: "Employee Performance", path: "/employees/performance", roles: ["RETAILER"]},
    ],
  },
  {
    name: "Sales", icon: <FaChartBar />,
    roles: ["STATION_MANAGER", "RETAILER", "ACCOUNTANT", "DEPARTMENT_MANAGER"],
    subItems: [
      {
        name: "Manage Sell Points", path: "/sales/sell-points",
        roles: ["STATION_MANAGER", "ACCOUNTANT", "DEPARTMENT_MANAGER"]
      },
      {
        name: "Manage Metre Readings", path: "/sales/meter-reading",
        roles: ["STATION_MANAGER", "ACCOUNTANT", "DEPARTMENT_MANAGER"]
      },
      { name: "Manage Sales", path: "/sales/manage", roles: ["STATION_MANAGER", "DEPARTMENT_MANAGER"] },
      { name: "Track Defaulters", path: "/sales/defaulters", roles: ["ACCOUNTANT"] },
      { name: "Sales Summary", path: "/sales/summary", roles: ["ACCOUNTANT", "DEPARTMENT_MANAGER", "STATION_MANAGER", "RETAILER"] },
      // {
      //   name: "Process Refund", path: "/sales/refund",
      //   roles: ["STATION_MANAGER", "RETAILER", "ACCOUNTANT", "DEPARTMENT_MANAGER"]
      // },
      // {
      //   name: "Payments History", path: "/sales/payments-history",
      //   roles: ["STATION_MANAGER", "RETAILER", "ACCOUNTANT", "DEPARTMENT_MANAGER"]
      // },
    ],
  },
  {
    name: "Incidents", icon: <FaExclamationTriangle />,
    roles: ["STATION_MANAGER", "DEPARTMENT_MANAGER", "QUALITY_MARSHAL", "SYSTEM_ADMIN", "RETAILER"],
    subItems: [
      {
        name: "Report Incident", path: "/incidents/report",
        roles: ["STATION_MANAGER", "DEPARTMENT_MANAGER", "QUALITY_MARSHAL", "SYSTEM_ADMIN"]
      },
      {
        name: "Approve Incident", path: "/incidents/approve",
        roles: ["STATION_MANAGER", "DEPARTMENT_MANAGER", "QUALITY_MARSHAL", "SYSTEM_ADMIN"]
      },
      {
        name: "View Submitted", path: "/incidents/submitted",
        roles: ["STATION_MANAGER", "DEPARTMENT_MANAGER", "QUALITY_MARSHAL", "SYSTEM_ADMIN"]
      },
      { name: "Resolve Incident", path: "/incidents/resolve", 
        roles: ["QUALITY_MARSHAL", "SYSTEM_ADMIN", "STATION_MANAGER"] },
        {name: "Resolve Incidents", path: "/incidents/resolve", roles: ["RETAILER"]},
    ],
  },
  {
    name: "Requests", icon: <FaHandshake />,
    roles: ["ALL"],
    subItems: [
      {
        name: "Submit Request", path: "/requests/submit",
        roles: ["ALL"]
      },
      {
        name: "Approve Request", path: "/requests/approve",
        roles: ["DEPARTMENT_MANAGER", "STATION_MANAGER", "ORGANIZATION_ADMIN"]
      },
      {
        name: "Review Request", path: "/requests/review",
        roles: ["DEPARTMENT_MANAGER", "STATION_MANAGER", "ORGANIZATION_ADMIN", "SYSTEM_ADMIN", "QUALITY_MARSHAL", "RETAILER"]
      },
      { name: "Request Status", path: "/requests/status", roles: ["ALL"] },
      { name: "View Submitted", path: "/requests/submitted", roles: ["ALL"] },
      {name: "Requests", path: "/requests/review", roles: ["RETAILER"]},
    ],
  },
  {
    name: "Products", icon: <FaBox />,
    roles: ["SYSTEM_ADMIN", "DEPARTMENT_MANAGER", "QUALITY_MARSHAL", "STATION_MANAGER"],
    subItems: [
      { name: "Manage Products", path: "/products/manage", roles: ["QUALITY_MARSHAL", "SYSTEM_ADMIN", "STATION_MANAGER"] },
      {
        name: "View Product", path: "/product/view",
        roles: ["SYSTEM_ADMIN", "DEPARTMENT_MANAGER", "QUALITY_MARSHAL", "STATION_MANAGER"]
      },
      {
        name: "Product Status", path: "/products/status",
        roles: ["SYSTEM_ADMIN", "DEPARTMENT_MANAGER", "QUALITY_MARSHAL", "STATION_MANAGER"]
      },
      {name: "Products Performance", path: "/products/performance", roles: ["RETAILER"]},
    ],
  },
  {
    name: "Inventory", icon: <FaWarehouse />,
    roles: ["SYSTEM_ADMIN", "QUALITY_MARSHAL", "STATION_MANAGER"],
    subItems: [
      {
        name: "Manage Inventory", path: "/inventory/manage",
        roles: ["SYSTEM_ADMIN", "QUALITY_MARSHAL", "STATION_MANAGER"]
      },
      {
        name: "View Item", path: "/inventory/view",
        roles: ["SYSTEM_ADMIN", "QUALITY_MARSHAL", "STATION_MANAGER"]
      },
      {
        name: "Item Status", path: "/inventory/status",
        roles: ["SYSTEM_ADMIN", "QUALITY_MARSHAL", "STATION_MANAGER"]
      },
    ],
  },

  {
    name: "Reports", icon: <FaRegChartBar />,
    roles: ["SYSTEM_ADMIN", "ACCOUNTANT", "DEPARTMENT_MANAGER"],
    subItems: [
      { name: "Sales Report", path: "/reports/sales" },
      { name: "Incident Report", path: "/reports/incidents" },
      { name: "Request Report", path: "/reports/requests" },
      { name: "Inventory Report", path: "/reports/inventory" },
      { name: "Employee Performance", path: "/reports/employees" },
      {
        name: "Organization Performance", path: "/reports/organizations",
        roles: ["RETAILER", "ORGANIZATION_ADMIN", "SYSTEM_ADMIN"]
      },
      {
        name: "Product Sales", path: "/reports/products",
        roles: ["RETAILER", "ORGANIZATION_ADMIN", "STATION_MANAGER", "QUALITY_MARSHAL"]
      },
      {
        name: "Expenditures", path: "/reports/expenditures",
        roles: ["ACCOUNTANT", "DEPARTMENT_MANAGER"]
      },
      { name: "Summary", path: "/reports/summary" },
    ],
  },
  { name: "Calendar", path: "/calendar", icon: <FaCalendarAlt />, roles: ["ALL"] },
  { name: "Settings", path: "/settings", icon: <FaTools />, roles: ["ALL"] },
  { name: "About", path: "/about", icon: <FaInfo />, roles: ["ALL"] },
];

interface SidebarMenuProps {
  isOpen: boolean;
  theme: string;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, theme }) => {
  const location = useLocation();
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const role = user.role;
    setUserRole(role);
  }
    , [user]);


  useEffect(() => {
    // Auto-expand submenus if current path matches
    menuItems.forEach((item) => {
      if (item.subItems) {
        const isActiveSubItem = item.subItems.some((subItem) => subItem.path === location.pathname);
        if (isActiveSubItem && !openSubMenus.includes(item.name)) {
          setOpenSubMenus((prev) => [...prev, item.name]);
        }
      }
    });
  }, [location.pathname, openSubMenus]);

  const toggleSubMenu = (name: string) => {
    if (isOpen) {
      setOpenSubMenus((prev) =>
        prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
      );
    }
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems
    .map((item) => {
      // Safely check if item.subItems exists
      if (item.subItems) {
        const filteredSubItems = item.subItems.filter((subItem) =>
          !subItem.roles || subItem.roles.includes(userRole as string)
        );
        return filteredSubItems.length ? { ...item, subItems: filteredSubItems } : null;
      }
      // Check if the item has roles and matches the user role or if it's an "ALL" role
      return item.roles && (item.roles.includes(userRole as string) || item.roles.includes("ALL")) ? item : null;
    })
    .filter(Boolean); // Filter out any null values

  return (
    <div
      className={`sidebar border-r scrollbar-thin ${theme === "dark"
        ? "bg-dark-background text-dark-text border-gray-700 scrollbar-thumb-gray-700 scrollbar-track-gray-800"
        : "bg-light-background text-light-text border-gray-300 scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        } transition-all duration-300 ease-in-out ${isOpen ? "w-60" : "w-16"} h-full fixed top-0 left-0 z-30 shadow-md overflow-y-auto`}
    >
      <nav>
        <div className="sidebar-header flex items-center justify-center h-16 mb-5 shadow-md">
          {isOpen ? (
            <h1 className="text-xl font-semibold">PetroFlow</h1>
          ) : (
            <img src={logo} alt="PF" className="h-15 w-15" />
          )}
        </div>

        <ul>
          {filteredMenuItems.map((item) => (
            item && (
              <li key={item.name}>
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`menu-item py-2 px-4 text-md flex items-center rounded-md transition-all 
                ${isOpen ? "justify-start" : "justify-center"} 
                ${location.pathname === item.path ? "bg-green-400 text-white" : theme === "dark" ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-200 hover:text-black"}`}
                  >
                    {item.icon}
                    {isOpen && <span className="ml-4">{item.name}</span>}
                  </Link>
                ) : (
                  <div className={`menu-item py-2 px-4 text-md flex items-center rounded-md cursor-pointer transition-all 
                ${isOpen ? 'justify-start' : 'justify-center'} 
                ${openSubMenus.includes(item.name) ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300') : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                    onClick={() => toggleSubMenu(item.name)}
                  >
                    {item.icon}
                    {isOpen && <span className="ml-4">{item.name}</span>}
                    {isOpen && <span className="ml-auto">{openSubMenus.includes(item.name) ? <FaChevronDown /> : <FaChevronRight />}</span>}
                  </div>
                )}

                {item.subItems && openSubMenus.includes(item.name) && (
                  <ul className="sub-menu pl-4 transition-all duration-300 ease-in-out">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link to={subItem.path} className={`block py-2 px-4 text-sm rounded-md transition duration-200 
                          ${location.pathname === subItem.path ? 'bg-green-400 text-white' : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        >{subItem.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          ))}
        </ul>
      </nav>
    </div>
  );

};

export default SidebarMenu;