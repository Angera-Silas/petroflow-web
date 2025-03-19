import LineChart from "../../components/charts/LineChart";

import { getRequest } from "../../utils/api";


let userRole = localStorage.getItem("authRole")?.replace(/"/g, "") || null;
const username = localStorage.getItem("authUser")?.replace(/"/g, "") || null;

  if(userRole === null && username === null){
    window.location.href = "/login";
  }else{
    const userDetails = await getRequest(`/users/get/username/${username}`);
    const userId = userDetails.id;

    userRole = userDetails.role;

    const employeeDetails = await getRequest(`/employees/info/${userId}`);

    const orgId = employeeDetails.organizationId;
    const facilityId = employeeDetails.facilityId;


    localStorage.setItem("authOrgId", orgId);
    localStorage.setItem("authFacilityId", facilityId);
    
  }
  
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
     
    </div>
  );
};

export default QualityMarshalDashboard;
