import LineChart from "../../components/charts/LineChart";
import PivotTable from "../../components/tables/PivotTable";

const QualityMarshalDashboard = () => {
  const qualityTrends = [{ label: "Fuel Purity", values: [98, 96, 99, 97] }];
  const labels = ["Jan", "Feb", "Mar", "Apr"];
  const incidentReports = [
    { Date: "2024-01-10", Issue: "Water Contamination", Status: "Resolved" },
    { Date: "2024-02-15", Issue: "Low Octane", Status: "Pending" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quality Marshal Dashboard</h1>
      <LineChart data={qualityTrends} labels={labels} theme="light" />
      <PivotTable data={incidentReports} columns={["Issue", "Status"]} rowKey="Date" theme="light" />
    </div>
  );
};

export default QualityMarshalDashboard;
