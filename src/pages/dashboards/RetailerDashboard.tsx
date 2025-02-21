import BarChart from "../../components/charts/BarChart";
import PieChart from "../../components/charts/PieChart";
import PivotTable from "../../components/tables/PivotTable";

const RetailerDashboard = () => {
  const salesData = [{ label: "Sales", values: [100, 200, 300] }];
  const salesLabels = ["Jan", "Feb", "Mar"];
  const stockData = [{ label: "Fuel", value: 12000 }, { label: "Lubricants", value: 500 }];
  const pivotData = [{ Month: "Jan", Sales: 100, Profit: 20 }, { Month: "Feb", Sales: 200, Profit: 50 }];
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Retailer Dashboard</h1>
      <BarChart data={salesData} labels={salesLabels} theme="light" />
      <PieChart data={stockData} theme="light" />
      <PivotTable data={pivotData} columns={["Sales", "Profit"]} rowKey="Month" theme="light" />
    </div>
  );
};

export default RetailerDashboard;
