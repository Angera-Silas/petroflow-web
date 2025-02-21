import { FaGasPump, FaMoneyBillWave, FaShoppingCart, FaExclamationTriangle } from "react-icons/fa";
import Table from "../../components/tables/CustomTable";
import BarChart from "../../components/charts/BarChart";
import PivotTable from "../../components/tables/PivotTable";

interface StationManagerDashboardProps {
  theme: string;
}

const StationManagerDashboard = ({ theme }: StationManagerDashboardProps) => {
  const isDarkMode = theme === "dark";
  const fuelSales = [{ label: "Diesel", values: [200, 300, 400] }];
  const labels = ["Jan", "Feb", "Mar"];
  const pumpData = [{ Pump: "Pump 1", Sales: 500 }, { Pump: "Pump 2", Sales: 700 }];


  return (
    <div className="p-6 container mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-6">Station Manager Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <FaMoneyBillWave />, label: "Daily Sales", value: "Ksh 500,000" },
          { icon: <FaShoppingCart />, label: "Transactions", value: "120" },
          { icon: <FaGasPump />, label: "Fuel Stock", value: "12,000L" },
          { icon: <FaExclamationTriangle />, label: "Pending Issues", value: "3" },
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

      <BarChart data={fuelSales} labels={labels} theme="light" />
      <PivotTable data={pumpData} columns={["Sales"]} rowKey="Pump" theme="light" />
      {/* Staff List */}
      <Table title="Staff Members" columns={["Name", "Role", "Shift"]} data={[]} theme={theme} />

      {/* Fuel Inventory */}
      <Table title="Fuel Inventory" columns={["Type", "Stock (L)", "Reorder Level"]} data={[]} theme={theme} />

      {/* Daily Transactions */}
      <Table title="Today's Transactions" columns={["Time", "Amount", "Payment Method"]} data={[]} theme={theme} />
    </div>
  );
};

export default StationManagerDashboard;
