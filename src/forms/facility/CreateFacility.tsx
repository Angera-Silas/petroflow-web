/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import NotificationPopup from "../../components/popups/NotificationPopup";
import TextInputField from "../../components/inputs/TextInputField";
import SelectInputField from "../../components/inputs/SelectInputField";
import TextAreaInput from "../../components/inputs/TextAreaInput";
import { postRequest, getRequest } from "../../utils/api";
import Button from "../../components/buttons/Button";

interface FacilityFormProps {
  theme: string;
}

interface OrganizationOption {
  label: string;
  value: string;
}

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

const FacilityForm: React.FC<FacilityFormProps> = ({ theme }) => {
  const [formData, setFormData] = useState<FacilityFormData>(() => {
    // Load saved data if available
    const savedData = localStorage.getItem("facilityFormData");
    return savedData ? JSON.parse(savedData) : {
      orgId: "",
      facilityName: "",
      facilityCounty: "",
      facilityTown: "",
      facilityStreet: "",
      physicalAddress: "",
      facilityPostalCode: "",
      facilityPhone: "",
      facilityEmail: "",
      servicesOffered: "",
    };
  });

  const [step, setStep] = useState(1);
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning" } | null>(null);

  const formBgStyle = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";

  useEffect(() => {
    // Save form data locally
    localStorage.setItem("facilityFormData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await getRequest("/organizations/get/all");

        if (!response) {
          throw new Error("Invalid response from server");
        }

        const orgOptions = response.map((org: any) => ({
          label: org.orgName,
          value: org.orgId.toString(),
        }));

        setOrganizations(orgOptions);
      } catch (error) {
        showNotification("Error", "Failed to fetch organizations", "error");
      }
    };

    fetchOrganizations();
  }, []);

  const showNotification = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      const response = await postRequest("/facilities/add", formData);

      if (response?.id) {  // Ensure response contains expected data
        const organizationFacility = {
          facilityId: String(response.id),
          organizationId: String(formData.orgId),
        };

        const orgFacilityResponse = await postRequest("/organization-facilities/add", organizationFacility);

        if (orgFacilityResponse) {
          showNotification("Success", "Facility added successfully", "success");

          // Clear storage and reset form only on success
          localStorage.removeItem("facilityFormData");
          setFormData({
            orgId: "",
            facilityName: "",
            facilityCounty: "",
            facilityTown: "",
            facilityStreet: "",
            physicalAddress: "",
            facilityPostalCode: "",
            facilityPhone: "",
            facilityEmail: "",
            servicesOffered: "",
          });

          setStep(1);
        } else {
          throw new Error("Failed to link facility with organization");
        }
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      showNotification("Error", (error as Error).message || "Failed to add facility", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 shadow-lg rounded-lg ${formBgStyle}`}>
      <h2 className="text-2xl font-semibold mb-4">Facility Registration</h2>

      {notification && (
        <NotificationPopup
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <>
            <h3 className="text-lg font-semibold">Step 1: Basic Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <SelectInputField label="Organization" name="orgId" value={formData.orgId} onChange={handleChange} options={organizations} theme={theme} />
              <TextInputField label="Facility Name" name="facilityName" value={formData.facilityName} onChange={handleChange} type="text" theme={theme} />
              <TextInputField label="Phone" name="facilityPhone" value={formData.facilityPhone} onChange={handleChange} type="phone" theme={theme} />
              <TextInputField label="Email" name="facilityEmail" value={formData.facilityEmail} onChange={handleChange} type="email" theme={theme} />
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={() => setStep(2)}>Next</Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="text-lg font-semibold">Step 2: Location Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <TextInputField label="County" name="facilityCounty" value={formData.facilityCounty} onChange={handleChange} type="text" theme={theme} />
              <TextInputField label="Town" name="facilityTown" value={formData.facilityTown} onChange={handleChange} type="text" theme={theme} />
              <TextInputField label="Street" name="facilityStreet" value={formData.facilityStreet} onChange={handleChange} type="text" theme={theme} />
              <TextInputField label="Postal Code" name="facilityPostalCode" value={formData.facilityPostalCode} onChange={handleChange} type="text" theme={theme} />
            </div>
            <div className="flex justify-between">
              <Button type="button" onClick={() => setStep(1)}>Back</Button>
              <Button type="button" onClick={() => setStep(3)}>Next</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="text-lg font-semibold">Step 3: Additional Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <TextInputField label="Physical Address" name="physicalAddress" value={formData.physicalAddress} onChange={handleChange} type="text" theme={theme} />
            </div>
            <TextAreaInput label="Services Offered" name="servicesOffered" value={formData.servicesOffered} onChange={handleChange} theme={theme} />

            <div className="flex justify-between">
              <Button type="button" onClick={() => setStep(2)}>Back</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default FacilityForm;