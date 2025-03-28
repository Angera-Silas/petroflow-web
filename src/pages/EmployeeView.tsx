import React, { useState, useEffect } from "react";
import { getRequest } from "../utils/api";
import NotificationPopup from "../components/popups/NotificationPopup";

interface Employee {
  id: number;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
}

const EmployeeView: React.FC<{ theme: string }> = ({ theme }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [notification, setNotification] = useState<{ title: string; message: string; type: string } | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getRequest("/employees/get/all");
        setEmployees(response);
      } catch {
        setNotification({ title: "Error", message: "Failed to fetch employees", type: "error" });
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className={`employee-view ${theme} p-6`}>
      <h1>Employee View</h1>
      {notification && (
        <NotificationPopup
          title={notification.title}
          message={notification.message}
          type={notification.type.toString() as "success" | "error" | "info" | "warning"}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {employees.map((employee) => (
          <div key={employee.id} className="card">
            <p><strong>Name:</strong> {employee.name}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Job Title:</strong> {employee.jobTitle}</p>
            <p><strong>Department:</strong> {employee.department}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeView;