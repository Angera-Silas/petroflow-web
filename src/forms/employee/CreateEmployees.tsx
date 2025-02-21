/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { getRequest, postRequest, putRequest } from "../../utils/api";
import NotificationPopup from "../../components/popups/NotificationPopup";
import Button from "../../components/buttons/Button";

interface EmployeeFormData {
  email: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  idNumber: string;
  employeeNo: string;
  jobTitle: string;
  employmentType: string;
  salary: number;
  nssfNo: string;
  nhifNo: string;
  kraPin: string;
  hireDate: string;
  organizationId: string;
  facilityId: string;
  department: string;
  role: string;
  phoneNumber: string;
  dateOfBirth?: string;
  bankName?: string;
  accountNo?: string;
  userId?: number;
  employeeId?: number;
  username?: string;
  physicalAddress?: string;
  postalCode?: string;
  city?: string;
  gender?: string;
  registrationDate?: string;
}

const requiredFields = [
  "email", "firstname", "lastname", "idNumber", "employeeNo", "jobTitle", "employmentType",
  "salary", "nssfNo", "nhifNo", "kraPin", "hireDate", "organizationId", "facilityId", "department", "role"
];

const headerMappings: { [key: string]: string } = {
  "Email": "email",
  "First Name": "firstname",
  "Last Name": "lastname",
  "ID Number": "idNumber",
  "Employee No": "employeeNo",
  "Job Title": "jobTitle",
  "Employment Type": "employmentType",
  "Salary": "salary",
  "NSSF No": "nssfNo",
  "NHIF No": "nhifNo",
  "KRA Pin": "kraPin",
  "Hire Date": "hireDate",
  "Organization ID": "organizationId",
  "Facility ID": "facilityId",
  "Department": "department",
  "Role": "role",
};

const CreateEmployees: React.FC<{ theme: string }> = ({ theme }) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [employees, setEmployees] = useState<EmployeeFormData[]>([]);
  const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning" } | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; type: string } | null>(null);
  const [existingUsers, setExistingUsers] = useState<any[]>([]);
  const [existingUserDetails, setExistingUserDetails] = useState<any[]>([]);
  const [existingEmployees, setExistingEmployees] = useState<any[]>([]);
  const [existingEmployeeOrganizations, setExistingEmployeeOrganizations] = useState<any[]>([]);

  useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
    try {
      const [users, profiles, employees, orgEmployees] = await Promise.all([
        getRequest("/users/get/all"),
        getRequest("/profiles/get/all"),
        getRequest("/employees/get/all"),
        getRequest("/organization-employee/get/all"),
      ]);
      setExistingUsers(users);
      setExistingUserDetails(profiles);
      setExistingEmployees(employees);
      setExistingEmployeeOrganizations(orgEmployees);
    } catch (error) {
      console.error("Error fetching existing data:", error);
    }
  };

  const showNotification = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 5000); // Auto-close after 5 sec
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      setFileDetails({
        name: uploadedFile.name,
        size: `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`, // Convert size to MB
        type: uploadedFile.type,
      });
      handleUpload(uploadedFile);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileDetails({
        name: droppedFile.name,
        size: `${(droppedFile.size / 1024 / 1024).toFixed(2)} MB`, // Convert size to MB
        type: droppedFile.type,
      });
      handleUpload(droppedFile);
    }
  };

  const handleUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      let jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      if (jsonData.length === 0) {
        showNotification("Error", "The uploaded file is empty.", "error");
        return;
      }

      let rawHeaders = jsonData[0] as string[];
      jsonData.shift(); // Remove headers row

      // Normalize headers
      let mappedHeaders = rawHeaders.map((header) => headerMappings[header] || header);

      // Validate headers
      let missingHeaders = requiredFields.filter((field) => !mappedHeaders.includes(field));
      if (missingHeaders.length > 0) {
        showNotification("Error", `Missing required fields: ${missingHeaders.join(", ")}`, "error");
        return;
      }

      processEmployees(jsonData, mappedHeaders);
    };
    reader.readAsArrayBuffer(file);
  };

  const processEmployees = (data: any[], headers: string[]) => {
    let uniqueEmployees: EmployeeFormData[] = [];
    let existingEmails = new Set<string>();

    data.forEach((row, index) => {
      let employee: EmployeeFormData = {
        email: "",
        firstname: "",
        lastname: "",
        idNumber: "",
        employeeNo: "",
        jobTitle: "",
        employmentType: "",
        salary: 0,
        nssfNo: "",
        nhifNo: "",
        kraPin: "",
        hireDate: "",
        organizationId: "",
        facilityId: "",
        department: "",
        role: "",
        phoneNumber: "",
        dateOfBirth: "",
        bankName: "",
        accountNo: "",
        physicalAddress: "Unknown",
        postalCode: "Unknown",
        city: "Unknown",
        gender: "Unknown",
        registrationDate: new Date().toISOString().split("T")[0],
        middlename: "N/A",
      };
      let isValid = true;

      requiredFields.forEach((field) => {
        let fieldIndex = headers.indexOf(field);
        if (fieldIndex === -1 || !row[fieldIndex]) isValid = false;
        (employee as any)[field] = row[fieldIndex] || "";
      });

      if (!isValid) {
        showNotification("Error", `Error in row ${index + 2}: Missing required data.`, "error");
        return;
      }

      // Check for duplicate email
      if (existingEmails.has(employee.email) || existingUsers.some((user) => user.email === employee.email)) {
        showNotification("Error", `Duplicate email found in row ${index + 2}: ${employee.email}`, "error");
        return;
      }

      uniqueEmployees.push(employee);
      existingEmails.add(employee.email);

      setProgress(((index + 1) / data.length) * 100);
    });

    setEmployees(uniqueEmployees);
    showNotification("Success", "File processed successfully.", "success");
  };

  const handleSubmit = async () => {
    try {
      let newUsersAndProfiles: any[] = [];
      let existingUsersWithProfiles: any[] = [];
      let usersWithSameUsername: any[] = [];
      let newEmployees: any[] = [];
      let existingEmployees: any[] = [];
      let newOrganizationEmployees: any[] = [];
      let existingOrganizationEmployees: any[] = [];

      // First, handle users and profiles
      for (let employee of employees) {
        let baseUsername = `${employee.lastname}${employee.firstname}`.toLowerCase();
        let finalUsername = `${baseUsername}@petroflow.co.ke`;
        let userId: number | undefined;

        let existingUser = existingUsers.find((user) => user.username === finalUsername);
        let existingProfile = existingUserDetails.find(
          (profile) =>
            profile.idNumber === employee.idNumber ||
            profile.email.toLowerCase() === employee.email.toLowerCase() ||
            profile.phoneNumber === employee.phoneNumber
        );

        // Ensure unique username if needed
        if (existingUser && !existingProfile) {
          let counter = 1;
          while (existingUsers.find((user) => user.username === finalUsername)) {
            finalUsername = `${baseUsername}${counter}@petroflow.co.ke`;
            counter++;
          }
          usersWithSameUsername.push({ username: finalUsername, role: employee.role, isActive: true });
        }

        if (!existingUser && !existingProfile) {
          newUsersAndProfiles.push({
            username: finalUsername,
            password: employee.idNumber,
            role: employee.role,
            isActive: true,
          });
        } else if (existingUser && existingProfile) {
          userId = existingUser.id;
          existingUsersWithProfiles.push({
            id: userId,
            username: finalUsername,
            role: employee.role,
            isActive: true,
          });
        }
      }

      // Perform batch operations for users and profiles
      if (newUsersAndProfiles.length > 0) {
        const userResponses = await postRequest("/users/add/batch", newUsersAndProfiles);
        userResponses.forEach((response: any, index: number) => {
          employees[index].userId = response.id;
        });
      }
      if (existingUsersWithProfiles.length > 0) {
        await putRequest("/users/update/batch", existingUsersWithProfiles);
      }
      if (usersWithSameUsername.length > 0) {
        const userResponses = await postRequest("/users/add/batch", usersWithSameUsername);
        userResponses.forEach((response: any, index: number) => {
          employees[index].userId = response.id;
        });
      }

      // Next, handle employees
      for (let employee of employees) {
        let employeeId: number | undefined;

        let existingEmployee = existingEmployees.find(
          (emp) =>
            emp.idNumber === employee.idNumber ||
            emp.nssfNo === employee.nssfNo ||
            emp.nhifNo === employee.nhifNo ||
            emp.kraPin === employee.kraPin ||
            emp.userId === employee.userId
        );

        if (!existingEmployee) {
          newEmployees.push(employee);
        } else {
          employeeId = existingEmployee.id;
          existingEmployees.push({ ...employee, employeeId });
        }
      }

      // Perform batch operations for employees
      if (newEmployees.length > 0) {
        const employeeResponses = await postRequest("/employees/add/batch", newEmployees);
        employeeResponses.forEach((response: any, index: number) => {
          employees[index].employeeId = response.id;
        });
      }
      if (existingEmployees.length > 0) {
        await putRequest("/employees/update/batch", existingEmployees);
      }

      // Finally, handle organization-employee associations
      for (let employee of employees) {
        let existingOrgEmployee = existingEmployeeOrganizations.find(
          (orgEmp) =>
            orgEmp.organizationId === employee.organizationId &&
            orgEmp.employeeId === employee.employeeId &&
            orgEmp.facilityId === employee.facilityId
        );

        if (!existingOrgEmployee) {
          newOrganizationEmployees.push({
            organizationId: employee.organizationId,
            facilityId: employee.facilityId,
            employeeId: employee.employeeId,
            department: employee.department,
            employmentStatus: "ACTIVE",
          });
        } else {
          existingOrganizationEmployees.push({
            organizationId: existingOrgEmployee.organizationId,
            facilityId: existingOrgEmployee.facilityId,
            employeeId: existingOrgEmployee.employeeId,
            department: employee.department,
            employmentStatus: "ACTIVE",
          });
        }
      }

      // Perform batch operations for organization-employee associations
      if (newOrganizationEmployees.length > 0) {
        await postRequest("/organization-employee/add/batch", newOrganizationEmployees);
      }
      if (existingOrganizationEmployees.length > 0) {
        await putRequest("/organization-employee/update/batch", existingOrganizationEmployees);
      }

      showNotification("Success", `${employees.length} employees processed successfully!`, "success");
      setEmployees([]);
    } catch (error) {
      if (error instanceof Error) {
        showNotification("Error", `An error occurred: ${error.message}`, "error");
      } else {
        showNotification("Error", "An unknown error occurred.", "error");
      }
    }
  };
  const themeClasses = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";

  return (
    <div
      className={`p-6 rounded-md shadow-md ${themeClasses}`}
      onDrop={handleFileDrop}
      onDragOver={(e) => e.preventDefault()} // Prevent default behavior to allow drop
    >
      {notification && (
        <NotificationPopup
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h2 className="text-xl font-semibold mb-4">Upload Employees</h2>

      {/* File Details Display after upload */}
      {fileDetails ? (
        <div className={`mb-4 p-4 ${theme === "dark" ? "border-gray-400" : "border-gray-700"} border rounded-md ${themeClasses}`}>
          <p><strong>File Name:</strong> {fileDetails.name}</p>
          <p><strong>File Size:</strong> {fileDetails.size}</p>
          <p><strong>File Type:</strong> {fileDetails.type}</p>
        </div>
      ) : (
        <div
          className={`mb-4 p-6 border-dashed border-2 rounded ${theme === "dark" ? "border-gray-400" : "border-gray-700"} text-center cursor-pointer`}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <p>Drag and drop a file here, or click to select a file</p>
          <input
            id="file-input"
            type="file"
            accept=".csv,.xlsx,.ods"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Progress Bar */}
      <progress value={progress} max="100" className="w-full mt-4">
        {progress}
      </progress>

      {/* Submit Button */}
      {employees.length > 0 && (
        <Button onClick={handleSubmit}>Submit Employees</Button>
      )}
    </div>
  );
};

export default CreateEmployees;