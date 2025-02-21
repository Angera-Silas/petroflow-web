/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { postRequest, getRequest } from "../../utils/api";
import NotificationPopup from "../../components/popups/NotificationPopup";
import Button from "../../components/buttons/Button";
import SelectInputField from "../../components/inputs/SelectInputField";

const requiredFields = ["firstname", "lastname", "idNumber", "dateOfBirth", "email", "phoneNumber", "role", "gender"];
const defaultValues: { [key: string]: string } = {
  middlename: "N/A",
  physicalAddress: "Unknown",
  postalCode: "Unknown",
  city: "Unknown",
  registrationDate: new Date().toISOString(),
};

const headerMappings: { [key: string]: string } = {
  "First Name": "firstname",
  first_name: "firstname",
  Firstname: "firstname",
  "Last Name": "lastname",
  last_name: "lastname",
  Lastname: "lastname",
  "ID Number": "idNumber",
  id_number: "idNumber",
  ID: "idNumber",
  "Date of Birth": "dateOfBirth",
  DOB: "dateOfBirth",
  date_of_birth: "dateOfBirth",
  Email: "email",
  "E-mail": "email",
  email_address: "email",
  "Phone Number": "phoneNumber",
  phone: "phoneNumber",
  PhoneNumber: "phoneNumber",
  Role: "role",
  Gender: "gender",
};

interface CreateUsersProps {
  theme: string;
}

const CreateUsers: React.FC<CreateUsersProps> = ({ theme }) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [users, setUsers] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning" } | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; type: string } | null>(null);
  const [organizations, setOrganizations] = useState<{ label: string; value: string }[]>([]);
  const [existingUsers, setExistingUsers] = useState<any[]>([]);
  const [existingProfiles, setExistingProfiles] = useState<any[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchOrganizations();
    fetchUsersAndProfiles();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await getRequest("/organizations/all");
      if (response.status === 200 && response.data) {
        setOrganizations(response.data.map((org: any) => ({ label: org.name, value: org.orgId })));
      } else {
        showNotification("Error", "Failed to fetch organizations.", "error");
      }
    } catch (error) {
      showNotification("Error", "Error fetching organizations.", "error");
    }
  };

  const fetchUsersAndProfiles = async () => {
    try {
      const usersResponse = await getRequest("/users/get/all");
      const profilesResponse = await getRequest("/profiles/get/all");

      setExistingUsers(usersResponse || []);
      setExistingProfiles(profilesResponse || []);
    } catch (error) {
      showNotification("Error", "Failed to fetch user data", "error");
    }
  };

  const showNotification = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      setFileDetails({
        name: uploadedFile.name,
        size: `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`,
        type: uploadedFile.type,
      });
      handleUpload(uploadedFile);
    }
  };

  const handleUpload = async (file: File) => {
    if (!selectedOrganization) {
      showNotification("Error", "Please select an organization before uploading.", "error");
      return;
    }

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

      let mappedHeaders = jsonData[0].map((header: string | number) => headerMappings[header] || header);
      jsonData.shift();

      let missingHeaders = requiredFields.filter((field) => !mappedHeaders.includes(field));
      if (missingHeaders.length > 0) {
        showNotification("Error", `Missing required fields: ${missingHeaders.join(", ")}`, "error");
        return;
      }

      processUsers(jsonData, mappedHeaders);
    };
    reader.readAsArrayBuffer(file);
  };

  const generateUniqueUsername = (firstname: string, lastname: string) => {
    let username = `${lastname}${firstname}@petroflow.co.ke`;
    // Ensure a unique username
    do {
      username = `${lastname}${firstname}${Math.floor(Math.random() * 1000)}@petroflow.co.ke`;
    } while (existingUsers.some((user) => user.username === username));
    return username;
  };

  const processUsers = (data: any[], headers: string[]) => {
    let newUsers: any[] = [];
    let updateUsers: any[] = [];
    let updateUserDetails: any[] = [];
    let newUserDetails: any[] = [];

    data.forEach((row, index) => {
      let user: any = { ...defaultValues, organizationId: selectedOrganization };

      requiredFields.forEach((field) => {
        let fieldIndex = headers.indexOf(field);
        user[field] = fieldIndex !== -1 ? row[fieldIndex] : null;
      });

      let existingUser = existingUsers.find((u) => u.email === user.email);
      let existingProfile = existingProfiles.find((p) => p.email === user.email);

      if (existingUser && existingProfile) {
        updateUsers.push({ ...existingUser, ...user });
        updateUserDetails.push({ ...existingProfile, ...user });
      } else if (existingUser && !existingProfile) {
        let uniqueUsername = generateUniqueUsername(user.firstname, user.lastname);
        newUsers.push({ ...user, username: uniqueUsername });
      } else {
        let uniqueUsername = generateUniqueUsername(user.firstname, user.lastname);
        newUsers.push({ ...user, username: uniqueUsername });
        newUserDetails.push(user);
      }

      setProgress(((index + 1) / data.length) * 100);
    });

    submitUsers(updateUsers, updateUserDetails, newUsers, newUserDetails);
  };

  const submitUsers = async (updateUsers: any[], updateUserDetails: any[], newUsers: any[], newUserDetails: any[]) => {
    setIsProcessing(true);
    try {
      if (updateUsers.length > 0) {
        await postRequest("/users/update/all", { users: updateUsers });
      }
      if (updateUserDetails.length > 0) {
        await postRequest("/profiles/update/all", { profiles: updateUserDetails });
      }
      if (newUsers.length > 0) {
        await postRequest("/users/create/all", { users: newUsers });
      }
      if (newUserDetails.length > 0) {
        await postRequest("/profiles/create/all", { profiles: newUserDetails });
      }

      showNotification("Success", `Processed users successfully.`, "success");
      setUsers([]);
    } catch (error) {
      showNotification("Error", "An error occurred while processing users.", "error");
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  return (
    <div className={`p-6 rounded-md shadow-md ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {notification && <NotificationPopup {...notification} onClose={() => setNotification(null)} />}

      <h2 className="text-xl font-semibold mb-4">Upload Users</h2>

      <SelectInputField label="Select Organization" options={organizations} value={selectedOrganization} onChange={(e) => setSelectedOrganization(e.target.value)} name={"organizations"} theme={theme} />

      {fileDetails && (
        <div className="mb-4 p-4 border rounded-md">
          <p><strong>File Name:</strong> {fileDetails.name}</p>
          <p><strong>File Size:</strong> {fileDetails.size}</p>
          <p><strong>File Type:</strong> {fileDetails.type}</p>
        </div>
      )}

      <input type="file" accept=".csv,.xlsx,.ods" onChange={handleFileChange} className="mb-4" />

      <progress value={progress} max="100" className="w-full mt-4">{progress}%</progress>

      {progress === 100 && !isProcessing && <Button onClick={() => submitUsers([], [], [], [])}>Submit Users</Button>}
    </div>
  );
};

export default CreateUsers;