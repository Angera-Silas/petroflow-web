/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import ReusableTable from "../components/tables/ReusableTable";
import Modal from "../components/modals/Modal";
import Button from "../components/buttons/DashButton";
import TextInputField from "../components/inputs/TextInputField";
import { getRequest, postRequest, putRequest } from "../utils/api";
import NotificationPopup from "../components/popups/NotificationPopup";

interface Employee {
  department: string;
  email: string;
  employmentType: string;
  facilityName: string;
  firstname: string;
  jobTitle: string;
  lastname: string;
  organizationName: string;
  phoneNumber: string;
  role: string;
}

interface Column {
  key: string;
  label: string;
  resizable?: boolean;
}

const columns = [
  { key: "Full Name", label: "Full Name" },
  { key: "Employment Type", label: "Employment Type" },
  { key: "Job Title", label: "Job Title" },
  { key: "Email", label: "Email" },
  { key: "Phone Number", label: "Phone Number" },
  { key: "Organization", label: "Organization" },
  { key: "Facility", label: "Facility" },
  { key: "Department", label: "Department" },
  { key: "Role", label: "Role" },
];

interface ManageEmployees {
  theme: string;
}

const ManageEmployees: React.FC<ManageEmployees> = ({ theme }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning"; onClose?: () => void } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [visibleColumns, setVisibleColumns] = useState<Column[]>(columns.filter(col => col.key !== "Email" && col.key !== "Phone Number"));

  const itemsPerPage = 10; // Define the number of items per page

  const fetchEmployees = async () => {
    try {
      const employeeResponse = await getRequest("/employees/details/get/all");
      if (!employeeResponse) {
        throw new Error("Invalid response from server");
      }

      setEmployees(employeeResponse);
      setLoading(false);
    } catch (error) {
      setNotification({
        title: "Error",
        message: "Failed to fetch employees",
        type: "error",
        onClose: () => setNotification(null),
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const employeesData = employees.map((employee) => ({
    "Full Name": `${employee.firstname} ${employee.lastname}`,
    Role: employee.role,
    Email: employee.email,
    Organization: employee.organizationName,
    Facility: employee.facilityName,
    Department: employee.department,
    "Employment Type": employee.employmentType,
    "Job Title": employee.jobTitle,
    "Phone Number": employee.phoneNumber,
  }));

  const handleDelete = async () => {
    try {
      // Confirm password
      const confirmPassword = prompt("Please enter your password to confirm deletion:");
      if (confirmPassword !== "yourPassword") { // Replace "yourPassword" with the actual password logic
        setNotification({
          title: "Error",
          message: "Password does not match",
          type: "error",
          onClose: () => setNotification(null),
        });
        return;
      }

      // Perform delete request
      await postRequest("/employees/delete/batch", { emails: selectedRows });
      setNotification({
        title: "Success",
        message: "Employees deleted successfully",
        type: "success",
        onClose: () => setNotification(null),
      });
      setModalOpen(false);
      setSelectedRows([]);
      fetchEmployees();
    } catch (error) {
      setNotification({
        title: "Error",
        message: "Failed to delete employees",
        type: "error",
        onClose: () => setNotification(null),
      });
    }
  };

  const handleUpdate = async () => {
    try {
      // Perform update request
      await putRequest("/employees/update/batch", { employees: selectedRows.map((email) => employees.find((employee) => employee.email === email)) });
      setNotification({
        title: "Success",
        message: "Employees updated successfully",
        type: "success",
        onClose: () => setNotification(null),
      });
      setModalOpen(false);
      setSelectedRows([]);
      fetchEmployees();
    } catch (error) {
      setNotification({
        title: "Error",
        message: "Failed to update employees",
        type: "error",
        onClose: () => setNotification(null),
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < selectedRows.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleColumnVisibilityChange = (col: Column) => {
    setVisibleColumns((prev) => {
      if (prev.includes(col)) {
        return prev.filter((c) => c !== col);
      } else {
        const newVisibleColumns = [...prev, col];
        return columns.filter((column) => newVisibleColumns.includes(column));
      }
    });
  };

  const renderUpdateForm = () => {
    const employee = employees.find((employee) => employee.email === selectedRows[currentPage]);
    if (!employee) return null;

    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <TextInputField label="First Name" name="firstname" value={employee.firstname} onChange={(e) => (employee.firstname = e.target.value)} type="text" theme={theme} />
          </div>
          <div>
            <TextInputField label="Last Name" name="lastname" value={employee.lastname} onChange={(e) => (employee.lastname = e.target.value)} type="text" theme={theme} />
          </div>
          <div>
            <TextInputField label="Role" name="role" value={employee.role} onChange={(e) => (employee.role = e.target.value)} type="text" theme={theme} />
          </div>
          <div>
            <TextInputField label="Email" name="email" value={employee.email} onChange={(e) => (employee.email = e.target.value)} type="email" theme={theme} />
          </div>
          <div>
            <TextInputField label="Organization" name="organizationName" value={employee.organizationName} onChange={(e) => (employee.organizationName = e.target.value)} type="text" theme={theme} />
          </div>
          <div>
            <TextInputField label="Facility" name="facilityName" value={employee.facilityName} onChange={(e) => (employee.facilityName = e.target.value)} type="text" theme={theme} />
          </div>
          <div>
            <TextInputField label="Department" name="department" value={employee.department} onChange={(e) => (employee.department = e.target.value)} type="text" theme={theme} />
          </div>
          <div>
            <TextInputField label="Employment Type" name="employmentType" value={employee.employmentType} onChange={(e) => (employee.employmentType = e.target.value)} type="text" theme={theme} />
          </div>
          <div>
            <TextInputField label="Job Title" name="jobTitle" value={employee.jobTitle} onChange={(e) => (employee.jobTitle = e.target.value)} type="text" theme={theme} />
          </div>
          <div>
            <TextInputField label="Phone Number" name="phoneNumber" value={employee.phoneNumber} onChange={(e) => (employee.phoneNumber = e.target.value)} type="text" theme={theme} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {currentPage > 0 && <Button variant="secondary" onClick={handlePreviousPage} theme={theme}>Previous</Button>}
          {currentPage < selectedRows.length - 1 && <Button variant="primary" onClick={handleNextPage} theme={theme}>Next</Button>}
          {currentPage === selectedRows.length - 1 && <Button variant="primary" onClick={handleUpdate} theme={theme}>Submit</Button>}
        </div>
      </form>
    );
  };

  return (
    <div className={`p-4 ${theme === "dark" ? "bg-dark-background text-dark-text" : "bg-light-background text-light-text"}`}>
      {notification && (
        <NotificationPopup
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Employees</h1>

        {selectedRows.length > 0 && (
          <div className="mt-4 flex justify-end gap-10">
            <Button variant="danger" onClick={() => { setModalType("delete"); setModalOpen(true); }} theme={theme}>
              Delete
            </Button>
            <Button variant="primary" onClick={() => { setModalType("update"); setModalOpen(true); }} theme={theme}>
              Update
            </Button>
          </div>
        )}

      </div>

      {loading ? <p>Loading...</p> : <ReusableTable columns={columns} data={employeesData} onRowSelect={setSelectedRows} theme={theme} itemsPerPage={itemsPerPage} visibleColumns={visibleColumns} onColumnVisibilityChange={handleColumnVisibilityChange} rowKey="Email" />}

      {modalOpen && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} theme={theme}>
          {modalType === "delete" ? (
            <>
              <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
              <p>Are you sure you want to delete the selected employees?</p>
              <ul>
                {selectedRows.map((email) => {
                  const employee = employees.find((employee) => employee.email === email);
                  return employee ? <li key={email}>{employee.firstname} {employee.lastname}</li> : null;
                })}
              </ul>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="secondary" onClick={() => setModalOpen(false)} theme={theme}>Cancel</Button>
                <Button variant="danger" onClick={handleDelete} theme={theme}>Confirm</Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">Update Employee</h2>
              {renderUpdateForm()}
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

export default ManageEmployees;