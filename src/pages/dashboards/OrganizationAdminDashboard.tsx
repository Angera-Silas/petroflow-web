/* eslint-disable @typescript-eslint/no-unused-vars */
import { FaUsers, FaGasPump, FaMoneyBillWave, FaExclamationCircle } from "react-icons/fa";
import Table from "../../components/tables/CustomTable";
import LineChart from "../../components/charts/LineChart";
import PieChart from "../../components/charts/PieChart";
import { getRequest } from "../../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";


interface OrganizationAdminDashboardProps {
  theme: string;
}

const OrganizationAdminDashboard = ({ theme }: OrganizationAdminDashboardProps) => {

  const user = useSelector((state: RootState) => state.user);

  const isDarkMode = theme === "dark";
  const revenueData = [{ label: "Revenue", values: [500, 700, 1000] }];
  const revenueLabels = ["Q1", "Q2", "Q3"];
  const userStats = [{ label: "Managers", value: 50 }, { label: "Attendants", value: 200 }];


  return (
    <div className="p-6 container mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-6">Organization Admin Dashboard</h1>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <FaGasPump />, label: "Total Stations", value: "25" },
          { icon: <FaUsers />, label: "Total Employees", value: "200" },
          { icon: <FaMoneyBillWave />, label: "Revenue (Monthly)", value: "Ksh 12,000,000" },
          { icon: <FaExclamationCircle />, label: "Pending Incidents", value: "5" },
        ].map((item, index) => (
          <div key={index} className={`p-4 rounded-lg shadow-lg flex items-center space-x-4 ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
            <span className="text-3xl">{item.icon}</span>
            <div>
              <p className="text-sm">{item.label}</p>
              <p className="text-lg font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <LineChart data={revenueData} labels={revenueLabels} theme="dark" />
      <PieChart data={userStats} theme="dark" />

      {/* Station List */}
      <Table title="Stations" columns={["Name", "Location", "Manager", "Status"]} data={[]} theme={theme} />

      {/* Employees */}
      <Table title="Employees" columns={["Name", "Email", "Role"]} data={[]} theme={theme} />

      {/* Incident Reports */}
      <Table title="Incidents" columns={["Date", "Type", "Status", "Reported By"]} data={[]} theme={theme} />
    </div>
  );
};

export default OrganizationAdminDashboard;
