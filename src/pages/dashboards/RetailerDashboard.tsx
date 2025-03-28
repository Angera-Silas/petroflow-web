import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import BarChart from "../../components/charts/BarChart";
import LineChart from "../../components/charts/LineChart";
import PieChart from "../../components/charts/PieChart";
import Table from "../../components/tables/CustomTable";
import { getRequest } from "../../utils/api";
import { FaUsers, FaBox, FaMoneyBillWave } from "react-icons/fa";

interface Sale {
  dateTime: string;
  productName: string;
  employeeNo: string;
  amountPaid: number;
}

interface Employee {
  firstname: string;
  lastname: string;
  email: string;
  facilityName: string;
  department: string;
}

interface Facility {
  name: string;
  physicalAddress: string;
  postalCode: string;
  street: string;
  town: string;
  phone: string;
  email: string;
  employeeCount: number;
  servicesOffered: string;
}

interface RetailerDashboardProps {
  theme: string;
}

const RetailerDashboard = ({ theme }: RetailerDashboardProps) => {
  const user = useSelector((state: RootState) => state.user);
  const isDarkMode = theme === "dark";

  const [sales, setSales] = useState<Sale[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  const organizationId = user.organizationId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesData, employeesData, facilitiesData] = await Promise.all([
          getRequest(`/sales/get/organization/${organizationId}`),
          getRequest(`/employees/info/org/${organizationId}`),
          getRequest(`/facilities/organization/${organizationId}`),
        ]);

        setSales(salesData);
        setEmployees(employeesData);
        setFacilities(facilitiesData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [organizationId]);

  const totalEmployees = employees.length;
  const totalFacilities = facilities.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.amountPaid, 0);

  const employeesData = employees.map((employee) => ({
    Name: `${employee.firstname} ${employee.lastname}`,
    Email: employee.email,
    Facility: employee.facilityName,
    Department: employee.department,
  }));

  const facilitiesData = facilities.map((facility) => ({
    Name: facility.name || "N/A",
    Location: `${facility.physicalAddress || "Unknown Address"} - ${
      facility.postalCode || ""
    }, ${facility.street || ""}, ${facility.town || ""}`,
    Email: facility.email || "N/A",
    Phone: facility.phone || "N/A",
    Employees: facility.employeeCount ?? 0,
    "Products/Services": facility.servicesOffered || "N/A",
  }));

  const transactionsData = sales.map((sale) => ({
    Time: sale.dateTime,
    Product: sale.productName,
    Amount: sale.amountPaid,
  }));

  const allProducts = Array.from(new Set(sales.map((sale) => sale.productName)));
  const allEmployees = Array.from(new Set(sales.map((sale) => sale.employeeNo)));

  const groupSalesByInterval = (interval: "day" | "week" | "month") => {
    const groupedSales: Record<string, Record<string, number>> = {};

    sales.forEach((sale) => {
      const date = new Date(sale.dateTime);
      let key: string;

      if (interval === "day") {
        key = date.toLocaleDateString();
      } else if (interval === "week") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toLocaleDateString();
      } else {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      }

      if (!groupedSales[key]) groupedSales[key] = {};
      if (!groupedSales[key][sale.productName]) groupedSales[key][sale.productName] = 0;

      groupedSales[key][sale.productName] += sale.amountPaid;
    });

    return groupedSales;
  };

  const dateRange = sales.length
    ? new Date(sales[sales.length - 1].dateTime).getTime() -
      new Date(sales[0].dateTime).getTime()
    : 0;
  const interval =
    dateRange > 30 * 24 * 60 * 60 * 1000
      ? "month"
      : dateRange > 7 * 24 * 60 * 60 * 1000
      ? "week"
      : "day";

  const groupedSales = groupSalesByInterval(interval);

  const labels = Object.keys(groupedSales);
  const barChartData = allProducts.map((product) => ({
    label: product,
    values: labels.map((label) => groupedSales[label][product] || 0),
  }));

  const lineChartDataProducts = barChartData;

  const lineChartDataEmployees = allEmployees.map((employee) => ({
    label: employee,
    values: labels.map((label) =>
      sales
        .filter((sale) => sale.employeeNo === employee && new Date(sale.dateTime).toLocaleDateString() === label)
        .reduce((sum, sale) => sum + sale.amountPaid, 0)
    ),
  }));

  const productPieData = allProducts.map((product) => ({
    label: product,
    value: sales.filter((sale) => sale.productName === product).reduce((sum, sale) => sum + sale.amountPaid, 0),
  }));

  const employeePieData = allEmployees.map((employee) => ({
    label: employee,
    value: sales.filter((sale) => sale.employeeNo === employee).reduce((sum, sale) => sum + sale.amountPaid, 0),
  }));

  return (
    <div className="p-4 container mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-6">Retailer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: <FaUsers />, label: "Total Employees", value: totalEmployees },
          { icon: <FaBox />, label: "Facilities", value: totalFacilities },
          { icon: <FaMoneyBillWave />, label: "Revenue", value: `Ksh ${totalRevenue.toLocaleString()}` },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-lg flex items-center space-x-4 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
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

      <Table title="Employees" columns={["Name", "Email", "Facility", "Department"]} data={employeesData} theme={theme} />
      <Table title="Facilities" columns={["Name", "Location", "Email", "Phone", "Employees", "Products/Services"]} data={facilitiesData} theme={theme} />
      <Table title="Transactions" columns={["Time", "Product", "Amount"]} data={transactionsData} theme={theme} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <h2 className="text-lg font-bold mb-4">Sales Over Time</h2>
          <BarChart data={barChartData} labels={labels} theme={theme} />
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Product Sales Over Time</h2>
          <LineChart data={lineChartDataProducts} labels={labels} theme={theme} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-bold mb-4">Sales by Product</h2>
          <PieChart data={productPieData} theme={theme} />
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Sales by Employee</h2>
          <PieChart data={employeePieData} theme={theme} />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-bold mb-4">Employee Sales Over Time</h2>
        <LineChart data={lineChartDataEmployees} labels={labels} theme={theme} />
      </div>

      
    </div>
  );
};

export default RetailerDashboard;