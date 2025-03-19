import BarChart from "../../components/charts/BarChart";

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
  
const DepartmentManagerDashboard = () => {
  const employeePerformance = [
    { label: "Efficiency", values: [85, 90, 88] },
    { label: "Customer Satisfaction", values: [4.5, 4.7, 4.6] },
  ];
  const labels = ["Q1", "Q2", "Q3"];
  const salesReports = [
    { Month: "Jan", Sales: 2000, Revenue: 5000 },
    { Month: "Feb", Sales: 2500, Revenue: 6000 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Department Manager Dashboard</h1>
      <BarChart data={employeePerformance} labels={labels} theme="dark" />
     
    </div>
  );
};

export default DepartmentManagerDashboard;
