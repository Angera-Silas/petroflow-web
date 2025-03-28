/* eslint-disable @typescript-eslint/no-unused-vars */
import { FaGasPump, FaMoneyBillWave, FaShoppingCart, FaExclamationTriangle } from "react-icons/fa";
import Table from "../../components/tables/CustomTable";
import BarChart from "../../components/charts/BarChart";
import LineChart from "../../components/charts/LineChart";
import { getRequest } from "../../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";

interface StationManagerDashboardProps {
  theme: string;
}

interface User {
  firstname: string;
  lastname: string;
  role: string;
  email: string;
  department: string;
}

interface Sale {
  sellingPoints: string;
  productName: string;
  employeeNo: string;
  amountPaid: number;
  dateTime: string;
}

const StationManagerDashboard = ({ theme }: StationManagerDashboardProps) => {
  const user = useSelector((state: RootState) => state.user);

  const organizationId = user.organizationId ? Number(user.organizationId) : 0;
  const facilityId = user.facilityId ? Number(user.facilityId) : 0;

  const isDarkMode = theme === "dark";

  const [users, setUsers] = useState<User[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const userResponse = await getRequest(`/organization-employee/details/get/${organizationId}/facility/${facilityId}`);
        setUsers(userResponse);

        // Fetch sales
        const salesResponse = await getRequest(`/sales/get/facility/${facilityId}`);
        setSales(salesResponse);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [organizationId, facilityId]);

  // Calculate metrics
  const totalDailySales = sales.reduce((sum, sale) => sum + sale.amountPaid, 0);
  const totalTransactions = sales.length;

  // Group sales by sell point
  const salesBySellPoint = sales.reduce((acc, sale) => {
    acc[sale.sellingPoints] = (acc[sale.sellingPoints] || 0) + sale.amountPaid;
    return acc;
  }, {} as Record<string, number>);

  const sellPointData = Object.entries(salesBySellPoint).map(([sellPoint, total]) => ({
    "Sell Point": sellPoint,
    "Total Sales": `Ksh ${total.toLocaleString()}`,
  }));

  // Group sales by product
  const salesByProduct = sales.reduce((acc, sale) => {
    acc[sale.productName] = (acc[sale.productName] || 0) + sale.amountPaid;
    return acc;
  }, {} as Record<string, number>);

  const productData = Object.entries(salesByProduct).map(([product, total]) => ({
    Product: product,
    "Total Sales": `Ksh ${total.toLocaleString()}`,
  }));

  // Group sales by employee
  const salesByEmployee = sales.reduce((acc, sale) => {
    acc[sale.employeeNo] = (acc[sale.employeeNo] || 0) + sale.amountPaid;
    return acc;
  }, {} as Record<string, number>);

  const employeeData = Object.entries(salesByEmployee).map(([employee, total]) => ({
    Employee: employee,
    "Total Sales": `Ksh ${total.toLocaleString()}`,
  }));

  // Group sales by date
  const salesByDate = sales.reduce((acc, sale) => {
    const date = new Date(sale.dateTime).toLocaleDateString();
    acc[date] = (acc[date] || 0) + sale.amountPaid;
    return acc;
  }, {} as Record<string, number>);

  const salesByDateData = Object.entries(salesByDate).map(([date, total]) => ({
    Date: date,
    "Total Sales": `Ksh ${total.toLocaleString()}`,
  }));

  // Line chart data for sales trends
  const lineChartData = [
    {
      label: "Total Sales",
      values: Object.values(salesByDate),
    },
  ];

  const labels = Object.keys(salesByDate);

  // Bar chart data for products
  const productBarChartData = Object.keys(salesByProduct).map((product) => ({
    label: product,
    values: [salesByProduct[product]],
  }));

  return (
    <div className="p-6 container mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-6">Station Manager Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: <FaMoneyBillWave />, label: "Daily Sales", value: `Ksh ${totalDailySales.toLocaleString()}` },
          { icon: <FaShoppingCart />, label: "Transactions", value: totalTransactions },
          { icon: <FaGasPump />, label: "Sell Points", value: sellPointData.length },
         
        ].map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-lg flex items-center space-x-4 ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
              }`}
          >
            <span className="text-3xl">{item.icon}</span>
            <div>
              <p className="text-sm">{item.label}</p>
              <p className="text-lg font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
        {/* Bar Chart for Product Sales */}
        <BarChart data={productBarChartData} labels={["Total Sales"]} theme={theme} />

        {/* Line Chart for Sales Trends */}
        <LineChart data={lineChartData} labels={labels} theme={theme} />
      </div>

      {/* Tables */}
      <Table title="Sales by Sell Point" columns={["Sell Point", "Total Sales"]} data={sellPointData} theme={theme} />
      <Table title="Sales by Product" columns={["Product", "Total Sales"]} data={productData} theme={theme} />
      <Table title="Sales by Employee" columns={["Employee", "Total Sales"]} data={employeeData} theme={theme} />
      <Table title="Sales by Date" columns={["Date", "Total Sales"]} data={salesByDateData} theme={theme} />
    </div>
  );
};

export default StationManagerDashboard;