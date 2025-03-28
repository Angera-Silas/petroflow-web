import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon, FiBell, FiMessageSquare, FiX, FiUser, FiChevronDown, FiMail, FiBriefcase, FiMapPin, FiPhone } from 'react-icons/fi';
import { motion } from 'framer-motion';
import profilePic from "/src/assets/profile_pics/prof-angera.png";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface HeaderProps {
  toggleSidebar: () => void;
  theme: string;
  toggleTheme: () => void; // add a prop to handle theme toggle
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, theme, toggleTheme }) => {

  const user = useSelector((state: RootState) => state.user);

  const [activeDrawer, setActiveDrawer] = useState<'notifications' | 'messages' | 'logout' | null>(null);
  const navigate = useNavigate();
  const notifications = [
    { id: 1, text: "🔔 New alert from admin" },
    { id: 2, text: "📢 System update available" },
    { id: 3, text: "🚀 New feature added" },
  ];

  const messages = [
    { id: 1, sender: "John Doe", text: "💬 Hey, how are you?" },
    { id: 2, sender: "Support", text: "💬 Your issue has been resolved." },
    { id: 3, sender: "Admin", text: "💬 Please check the new updates." },
  ];

  const userProfile = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    organization: user.organizationName,
    facility: user.facilityName,
    address: user.address,
    town: user.town,
    role: user.role,
    profile_photo: profilePic || '' // Replace with actual image URL
  };

  // Toggle function ensuring only one drawer is open at a time
  const toggleDrawer = (drawer: 'notifications' | 'messages' | 'logout') => {
    setActiveDrawer((prev) => (prev === drawer ? null : drawer));
  };


  return (
    <header
      className={`flex items-center justify-between p-3 shadow-md border-b ${theme === 'dark' ? 'bg-dark-background text-dark-text border-gray-700' : 'bg-light-background text-light-text border-gray-300'
        } transition-transform duration-300 ease-in-out`}
    >
      {/* Sidebar Toggle Button */}
      <button className="cursor-pointer text-2xl p-2" onClick={toggleSidebar}>
        <FiMenu />
      </button>

      {/* Header Actions */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="header-btn p-2 rounded-md transition text-2xl">
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>

        {/* Notifications Button */}
        <button className="header-btn relative p-2 rounded-lg transition text-2xl" onClick={() => toggleDrawer("notifications")}>
          <FiBell />
          {notifications.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">{notifications.length}</span>}
        </button>

        {/* Messages Button */}
        <button className="header-btn relative p-2 rounded-lg transition text-2xl" onClick={() => toggleDrawer("messages")}>
          <FiMessageSquare />
          {messages.length > 0 && <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full px-2">{messages.length}</span>}
        </button>

        {/* Profile Dropdown */}
        <div className={`relative w-10 h-10 rounded-full overflow-hidden cursor-pointer ${theme === "dark" ? "bg-gray-400 text-dark-text" : "bg-gray-100 text-light-text"}`} onClick={() => toggleDrawer("logout")}>
          <button className="w-10 h-10 flex items-center justify-center">
            {/* Conditional Rendering for Profile Picture */}
            {userProfile.profile_photo ? (
              <img src={userProfile.profile_photo} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full">
                <FiUser className="text-2xl text-gray-600" />
              </div>
            )}
          </button>

          {/* Dropdown Indicator */}
          <span className="absolute bottom-0 right-0 text-sm p-1 bg-transparent rounded-full">
            <FiChevronDown className="text-gray-300 semibold" />
          </span>
        </div>


        {/* Drawers */}
        <div className="relative">
          {/* Notifications Drawer */}
          {activeDrawer === "notifications" && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className={`fixed top-18 right-0 w-80 h-full shadow-lg p-4 overflow-y-auto z-999 ${theme === "dark" ? "bg-gray-900 text-dark-text" : "bg-white text-light-text"}`}>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <button onClick={() => setActiveDrawer(null)}><FiX /></button>
              </div>
              <ul className="mt-4 space-y-2">
                {notifications.map((notif) => (
                  <li key={notif.id} className={`p-2 rounded border-b ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
                    {notif.text}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Messages Drawer */}
          {activeDrawer === "messages" && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className={`fixed top-18 right-0 w-80 h-full shadow-lg p-4 overflow-y-auto z-999 ${theme === "dark" ? "bg-gray-900 text-dark-text" : "bg-white text-light-text"}`}>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Messages</h2>
                <button onClick={() => setActiveDrawer(null)}><FiX /></button>
              </div>
              <ul className="mt-4 space-y-2">
                {messages.map((msg) => (
                  <li key={msg.id} className={`p-2 rounded border-b ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
                    <strong>{msg.sender}:</strong> {msg.text}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}


          {/* Logout/Profile Drawer */}
          {activeDrawer === "logout" && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className={`fixed top-18 right-0 w-80 h-full shadow-lg p-4 overflow-hidden overflow-y-auto z-50 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
                }`}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">User Profile</h2>
                <button onClick={() => setActiveDrawer(null)}>
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Profile Section */}
              <div className="mt-4 p-4 rounded border ">
                {userProfile?.profile_photo ? (
                  <img src={userProfile.profile_photo} alt="Profile" className="w-25 h-25 rounded-full mx-auto" />
                ) : (
                  <div className="w-25 h-25 rounded-full flex items-center justify-center bg-gray-300 mx-auto">
                    <FiUser className="text-4xl text-gray-600" />
                  </div>
                )}

                <p className="text-center text-xl font-bold">{userProfile?.name || "N/A"}</p>
                <p className="text-center text-sm">{user.role || "Unknown Role"}</p>

                {/* Info Cards */}
                <div className="mt-4 space-y-5 ">
                  {[
                    
                    { icon: <FiBriefcase />, label: "Organization", value: userProfile?.organization },
                    { icon: <FiMapPin />, label: "Facility", value: userProfile?.facility },
                    // { icon: <FiMail />, label: "Email", value: userProfile?.email },
                  
                    { icon: <FiPhone />, label: "Phone", value: userProfile?.phone },

                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 rounded shadow-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                        }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div className="ml-4">
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="text-sm">{item.value || "N/A"}</p>
                      </div>
                    </div>
                  ))}

                </div>

                <button className="mt-4 p-2 w-full rounded bg-red-500 text-white hover:bg-red-600 transition duration-300"
                  onClick={() => navigate("/login")}
                >
                  Logout
                </button>

              </div>

            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
