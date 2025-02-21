/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { postRequest, getRequest } from "../../utils/api";
import NotificationPopup from "../../components/popups/NotificationPopup";
import SelectInputField from "../../components/inputs/SelectInputField";
import Button from "../../components/buttons/Button";

interface FacilityFormData {
  orgId: string;
  facilityName: string;
  facilityCounty: string;
  facilityTown: string;
  facilityStreet: string;
  physicalAddress: string;
  facilityPostalCode: string;
  facilityPhone: string;
  facilityEmail: string;
  servicesOffered: string;
}

interface OrganizationOption {
  label: string;
  value: string;
}

const requiredFields = [
  "facilityName", "facilityCounty", "facilityTown", "facilityStreet", "physicalAddress",
  "facilityPostalCode", "facilityPhone", "facilityEmail", "servicesOffered"
];

const headerMappings: { [key: string]: string } = {
  "Facility Name": "facilityName",
  "County": "facilityCounty",
  "Town": "facilityTown",
  "Street": "facilityStreet",
  "Physical Address": "physicalAddress",
  "Postal Code": "facilityPostalCode",
  "Phone": "facilityPhone",
  "Email": "facilityEmail",
  "Services Offered": "servicesOffered",
};

const UploadBulkFacilities: React.FC<{ theme: string }> = ({ theme }) => {
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [facilities, setFacilities] = useState<FacilityFormData[]>([]);
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning" } | null>(null);

  useEffect(() => {
    // Fetch organizations for dropdown
    getRequest("/organizations/get/all").then((response) => {
      if (response) {
        const orgOptions = response.map((org: any) => ({
          label: org.orgName,
          value: org.orgId.toString(),
        }));
        setOrganizations(orgOptions);
      } else {
        showNotification("Error", "Failed to load organizations.", "error");
      }
    });
  }, []);

  const showNotification = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!selectedOrgId) {
      showNotification("Error", "Please select an organization first.", "error");
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

      let rawHeaders = jsonData[0] as string[];
      jsonData.shift(); // Remove headers row

      let mappedHeaders = rawHeaders.map((header) => headerMappings[header] || header);
      let missingHeaders = requiredFields.filter((field) => !mappedHeaders.includes(field));

      if (missingHeaders.length > 0) {
        showNotification("Error", `Missing required fields: ${missingHeaders.join(", ")}`, "error");
        return;
      }

      processFacilities(jsonData, mappedHeaders);
    };
    reader.readAsArrayBuffer(file);
  };

  const processFacilities = (data: any[], headers: string[]) => {
    let processedFacilities: FacilityFormData[] = [];

    data.forEach((row, index) => {
      let facility: any = { orgId: selectedOrgId };
      let isValid = true;

      requiredFields.forEach((field) => {
        let fieldIndex = headers.indexOf(field);
        if (fieldIndex === -1 || !row[fieldIndex]) isValid = false;
        facility[field] = row[fieldIndex] || "";
      });

      if (!isValid) {
        showNotification("Error", `Error in row ${index + 2}: Missing required data.`, "error");
        return;
      }

      processedFacilities.push(facility);
      setProgress(((index + 1) / data.length) * 100);
    });

    setFacilities(processedFacilities);
    showNotification("Success", "File processed successfully.", "success");
  };

  const handleSubmit = async () => {
    if (facilities.length === 0) {
      showNotification("Error", "No facilities to upload.", "error");
      return;
    }

    try {
      const response = await postRequest("/facilities/add/all", { facilities });

      if (response.status === 200) {
        showNotification("Success", `${facilities.length} facilities uploaded successfully!`, "success");
        setFacilities([]);
        setProgress(0);
        setFile(null);
      } else {
        showNotification("Error", "Error uploading facilities.", "error");
      }
    } catch (error) {
      showNotification("Error", `An error occurred: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
    }
  };

  return (
    <div className={`p-6 rounded-md shadow-md ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {notification && (
        <NotificationPopup
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h2 className="text-xl font-semibold mb-4">Upload Bulk Facilities</h2>

      <SelectInputField
        label="Select Organization"
        name="organization"
        value={selectedOrgId}
        onChange={(e) => setSelectedOrgId(e.target.value)}
        options={organizations}
        theme={theme}
      />

      <div className="mt-4 border-dashed border-2 p-6 text-center cursor-pointer" onClick={() => document.getElementById("file-input")?.click()}>
        <p>{file ? file.name : "Click or Drag & Drop a file here"}</p>
        <input id="file-input" type="file" accept=".csv,.xlsx,.ods" onChange={handleFileChange} className="hidden" />
      </div>

      <progress value={progress} max="100" className="w-full mt-4">{progress}%</progress>

      {facilities.length > 0 && <Button onClick={handleSubmit}>Submit Facilities</Button>}
    </div>
  );
};

export default UploadBulkFacilities;
