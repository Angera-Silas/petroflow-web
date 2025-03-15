/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import ReusableTable from "../components/tables/ReusableTable";
import Modal from "../components/modals/Modal";
import Button from "../components/buttons/DashButton";
import TextInputField from "../components/inputs/TextInputField";
import SelectInputField from "../components/inputs/SelectInputField";
import { getRequest, postRequest, putRequest } from "../utils/api";
import NotificationPopup from "../components/popups/NotificationPopup";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  employmentType: string;
  facilityName: string;
  firstname: string;
  jobTitle: string;
  lastname: string;
  organizationName: string;
  phoneNumber: string;
  role: string;
  organizationId: string;
  facilityId: string;
  userId: number;
  employeeId: number;
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
  { key: "Department", label: "Department" },
  { key: "Role", label: "Role" },
];

const roleOptions = [
  { label: "System Admin", value: "SYSTEM_ADMIN" },
  { label: "Organization Admin", value: "ORGANIZATION_ADMIN" },
  { label: "Station Admin", value: "STATION_ADMIN" },
  { label: "Customer Attendant", value: "CUSTOMER_ATTENDANT" },
  { label: "Oil Specialist", value: "OIL_SPECIALIST" },
  { label: "Retailer", value: "RETAILER" },
  { label: "Accountant", value: "ACCOUNTANT" },
  { label: "Station Manager", value: "STATION_MANAGER" },
  { label: "Department Manager", value: "DEPARTMENT_MANAGER" },
  { label: "HR Manager", value: "HR_MANAGER" },
  { label: "Quality Marshal", value: "QUALITY_MARSHAL" },
];

interface ManageEmployees {
  theme: string;
}

const ManageEmployees: React.FC<ManageEmployees> = ({ theme }) => {
  const user = useSelector((state: RootState) => state.user);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [editedEmployees, setEditedEmployees] = useState<Employee[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning"; onClose?: () => void } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [visibleColumns, setVisibleColumns] = useState<Column[]>(columns.filter(col => col.key !== "Email"));
  const [password, setPassword] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"delete" | "update">();
  const itemsPerPage = 10; // Define the number of items per page
  const [organizations, setOrganizations] = useState<{ value: string; label: string }[]>([]);
  const [facilities, setFacilities] = useState<{ value: string; label: string }[]>([]);

  const fetchEmployees = async () => {
    try {
      const userRole = user.role;
      let employeeResponse;

      switch (userRole) {
        case "SYSTEM_ADMIN":
          employeeResponse = await getRequest("/organization-employee/details/get/all");
          break;
        case "ORGANIZATION_ADMIN":
          employeeResponse = await getRequest(`/organization-employee/details/get/${user.organizationId}`);
          break;
        case "STATION_MANAGER":
        case "DEPARTMENT_MANAGER":
        case "QUALITY_MARSHAL":
          employeeResponse = await getRequest(`/organization-employee/details/get/${user.organizationId}/facility/${user.facilityId}`);
          break;
        case "RETAILER":
          employeeResponse = await getRequest(`/organization-employee/details/get/${user.organizationId}`);
          break;
        default:
          throw new Error("Invalid user role");
      }

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


  const fetchOrganizations = async () => {
    try {
      const response = await getRequest("/organizations/get/all");
      setOrganizations(response.map((org: any) => ({ value: org.orgId.toString(), label: org.orgName })));
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const fetchFacilities = async (organizationId: string) => {
    try {
      const response = await getRequest(`/facilities/organization/${organizationId}`);
      setFacilities(response.map((facility: any) => ({ value: facility.id.toString(), label: facility.facilityName })));
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };


  useEffect(() => {
    fetchOrganizations();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (user.organizationId) {
      fetchFacilities(user.organizationId.toString());
    }
  }, [user.organizationId]);

  useEffect(() => {
    if (editedEmployees.length > 0) {
      const employee = editedEmployees[currentPage];
      if (employee && employee.organizationName) {
        const selectedOrg = organizations.find(org => org.label === employee.organizationName);
        if (selectedOrg) {
          fetchFacilities(selectedOrg.value);
        }
      }
    }
  }, [editedEmployees, currentPage, organizations]);


  const employeesData = employees.map((employee) => ({
    "Full Name": `${employee.firstname} ${employee.lastname}`,
    Role: employee.role,
    Email: employee.email,
    Department: employee.department,
    "Employment Type": employee.employmentType,
    "Job Title": employee.jobTitle,
    "Phone Number": employee.phoneNumber,
  }));

  const confirmAction = async () => {
    try {
      if (!password) {
        setNotification({
          title: "Error",
          message: "Please enter your password",
          type: "error",
          onClose: () => setNotification(null),
        });
        return;
      }

      const isAuthenticated = await postRequest("/users/verify-password", {
        username: user.username,
        password
      });

      if (!isAuthenticated) {
        setNotification({
          title: "Error",
          message: "Password does not match",
          type: "error",
          onClose: () => setNotification(null),
        });
        return;
      }

      if (actionType === "delete") {
        await postRequest("/employees/delete/all", { emails: selectedRows });
        setNotification({
          title: "Success",
          message: "Employees deleted successfully",
          type: "success",
          onClose: () => setNotification(null),
        });
      } else if (actionType === "update") {
        const formattedEmployees = editedEmployees.map(employee => ({
          firstname: employee.firstname,
          lastname: employee.lastname,
          facilityId: employee.facilityId, 
          organizationId: employee.organizationId,
          employeeId: employee.employeeId,
          userId: employee.userId, 
          jobTitle: employee.jobTitle,
          role: employee.role,
          department: employee.department,
          employmentType: employee.employmentType,
          phoneNumber: employee.phoneNumber,
          email: employee.email,
        }));

        await putRequest("/employees/update/all", formattedEmployees);
        setNotification({
          title: "Success",
          message: "Employees updated successfully",
          type: "success",
          onClose: () => setNotification(null),
        });
      }

      setConfirmModalOpen(false);
      setModalOpen(false);
      setSelectedRows([]);
      setEditedEmployees([]);
      fetchEmployees();
    } catch (error) {
      setNotification({
        title: "Error",
        message: `Failed to ${actionType} employees`,
        type: "error",
        onClose: () => setNotification(null),
      });
    }
  };

  const handleDelete = () => {
    setActionType("delete");
    setConfirmModalOpen(true);
  };

  const handleUpdate = () => {
    setActionType("update");
    setEditedEmployees(selectedRows.map(email => employees.find(employee => employee.email === email)).filter(employee => employee !== undefined) as Employee[]);
    setModalOpen(true);
  };

  const handleNextPage = () => {
    if (currentPage < editedEmployees.length - 1) {
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

  const handleInputChange = (index: number, field: keyof Employee, value: string) => {
    const updatedEmployees = [...editedEmployees];
    updatedEmployees[index] = { ...updatedEmployees[index], [field]: value };
    setEditedEmployees(updatedEmployees);
  };



  const renderUpdateForm = () => {
    const employee = editedEmployees[currentPage];
    if (!employee) return null;

    const isSystemAdmin = user.role === "SYSTEM_ADMIN";

    // Find organization ID based on organization name
    const selectedOrg = organizations.find(org => org.label === employee.organizationName);
    const selectedOrgId = selectedOrg ? selectedOrg.value : "";

    // Find facility ID based on facility name
    const selectedFacility = facilities.find(facility => facility.label === employee.facilityName);
    const selectedFacilityId = selectedFacility ? selectedFacility.value : "";

    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-4">
          <TextInputField label="First Name" name="firstname" value={employee.firstname} onChange={(e) => handleInputChange(currentPage, 'firstname', e.target.value)} type="text" theme={theme} />
          <TextInputField label="Last Name" name="lastname" value={employee.lastname} onChange={(e) => handleInputChange(currentPage, 'lastname', e.target.value)} type="text" theme={theme} />
          <SelectInputField label="Role" name="role" value={employee.role} onChange={(e) => handleInputChange(currentPage, 'role', e.target.value)} options={roleOptions} theme={theme} />
          <TextInputField label="Email" name="email" value={employee.email} onChange={(e) => handleInputChange(currentPage, 'email', e.target.value)} type="email" theme={theme} />

          {/* Organization Selection */}
          {isSystemAdmin ? (
            <SelectInputField
              label="Organization"
              name="organizationId"
              options={organizations}
              value={selectedOrgId} // Default selected based on employee.organizationName
              selectedValue={selectedOrgId}
              onChange={(e) => {
                handleInputChange(currentPage, "organizationId", e.target.value);
                fetchFacilities(e.target.value); // Fetch facilities for selected organization
              }}
              theme={theme}
            />
          ) : (
            <TextInputField label="Organization" name="organizationName" value={employee.organizationName} readonly={true} theme={theme} type="text" />
          )}

          {/* Facility Selection */}
          <SelectInputField
            label="Facility"
            name="facilityId"
            options={facilities}
            value={selectedFacilityId} // Default selected based on employee.facilityName
            selectedValue={selectedFacilityId}
            onChange={(e) => handleInputChange(currentPage, "facilityId", e.target.value)}
            theme={theme}
          />

          {/* Department as a Text Field */}
          <TextInputField label="Department" name="department" value={employee.department} onChange={(e) => handleInputChange(currentPage, 'department', e.target.value)} type="text" theme={theme} />

          <TextInputField label="Employment Type" name="employmentType" value={employee.employmentType} onChange={(e) => handleInputChange(currentPage, 'employmentType', e.target.value)} type="text" theme={theme} />
          <TextInputField label="Job Title" name="jobTitle" value={employee.jobTitle} onChange={(e) => handleInputChange(currentPage, 'jobTitle', e.target.value)} type="text" theme={theme} />
          <TextInputField label="Phone Number" name="phoneNumber" value={employee.phoneNumber} onChange={(e) => handleInputChange(currentPage, 'phoneNumber', e.target.value)} type="tel" theme={theme} />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {currentPage > 0 && <Button variant="secondary" onClick={handlePreviousPage} theme={theme}>Previous</Button>}
          {currentPage < editedEmployees.length - 1 && <Button variant="primary" onClick={handleNextPage} theme={theme}>Next</Button>}
          {currentPage === editedEmployees.length - 1 && <Button variant="primary" onClick={() => setConfirmModalOpen(true)} theme={theme}>Submit</Button>}
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
            <Button variant="primary" onClick={() => { setModalType("update"); handleUpdate(); }} theme={theme}>
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

      {confirmModalOpen && (
        <Modal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} theme={theme}>
          <div className="p-4">
            <p>Please enter your password to confirm {actionType}:</p>
            <TextInputField
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              theme={theme}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setConfirmModalOpen(false)} theme={theme}>Cancel</Button>
              <Button onClick={confirmAction} theme="danger">
                Confirm {actionType === "delete" ? "Deletion" : "Update"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default ManageEmployees;