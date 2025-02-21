/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import NotificationPopup from "../../components/popups/NotificationPopup";
import TextInputField from "../../components/inputs/TextInputField";
import SelectInputField from "../../components/inputs/SelectInputField";
import { postRequest } from "../../utils/api";
import Button from "../../components/buttons/Button";
import TextAreaInput from "../../components/inputs/TextAreaInput";

interface NewOrganizationFormProps {
  theme: string;
}

interface NewOrganizationFormData {
  orgName: string;
  orgCounty: string;
  orgTown: string;
  orgStreet: string;
  physicalAddress: string;
  orgPostalCode: string;
  orgPhone: string;
  orgEmail: string;
  numberOfStations: number;
  registrationDate: string;
  lisenceNo: string;
  orgType: string;
  orgWebsite: string;
  orgDescription: string;
}

const orgTypeOptions = [
  { label: "Private", value: "Private" },
  { label: "Public", value: "Public" },
];

const LOCAL_STORAGE_KEY = "newOrganizationForm";

const NewOrganizationForm: React.FC<NewOrganizationFormProps> = ({ theme }) => {
  const [formData, setFormData] = useState<NewOrganizationFormData>(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : {
      orgName: "",
      orgCounty: "",
      orgTown: "",
      orgStreet: "",
      physicalAddress: "",
      orgPostalCode: "",
      orgPhone: "",
      orgEmail: "",
      numberOfStations: 0,
      registrationDate: new Date().toISOString().split("T")[0],
      lisenceNo: "",
      orgType: "",
      orgWebsite: "N/A",
      orgDescription: "",
    };
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning" } | null>(null);

  const formBgStyle = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    // Validate form: Ensure all fields are filled
    const requiredFields = [
      "orgName", "orgCounty", "orgTown", "orgStreet", "physicalAddress",
      "orgPostalCode", "orgPhone", "orgEmail", "numberOfStations",
      "registrationDate", "lisenceNo", "orgType"
    ];

    const isEmpty = requiredFields.some(field => !formData[field as keyof NewOrganizationFormData]?.toString().trim());

    if (isEmpty) {
      setNotification({ title: "Error", message: "Please fill in all required fields before submitting.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      await postRequest("/organizations/add", formData);
      setNotification({ title: "Success", message: "Organization added successfully", type: "success" });
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setFormData({
        orgName: "",
        orgCounty: "",
        orgTown: "",
        orgStreet: "",
        physicalAddress: "",
        orgPostalCode: "",
        orgPhone: "",
        orgEmail: "",
        numberOfStations: 0,
        registrationDate: new Date().toISOString().split("T")[0],
        lisenceNo: "",
        orgType: "",
        orgWebsite: "N/A",
        orgDescription: "",
      });
      setCurrentStep(1);
    } catch (error) {
      setNotification({ title: "Error", message: "Failed to add organization", type: "error" });
    }

    setLoading(false);
  };


  return (
    <div className={`max-w-4xl mx-auto p-6 shadow-lg rounded-lg ${formBgStyle}`}>
      <h2 className="text-2xl font-semibold mb-4">New Organization Registration</h2>

      {notification && (
        <NotificationPopup
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step Indicators */}
        <div className="flex justify-between items-center mb-6 text-center">
          <span className={`p-2 w-8 h-8 text-center rounded-full ${currentStep === 1 ? "bg-blue-500 text-white" : "bg-gray-300"}`}>1</span>
          <span className={`p-2 w-8 h-8 text-center rounded-full ${currentStep === 2 ? "bg-blue-500 text-white" : "bg-gray-300"}`}>2</span>
          <span className={`p-2 w-8 h-8 text-center rounded-full ${currentStep === 3 ? "bg-blue-500 text-white" : "bg-gray-300"}`}>3</span>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div>
            <div className="grid grid-cols-2 gap-4">
              <TextInputField label="Organization Name" name="orgName" value={formData.orgName} onChange={handleChange} type="text" theme={theme} />
              <SelectInputField label="Organization Type" name="orgType" value={formData.orgType} onChange={handleChange} options={orgTypeOptions} theme={theme} />
              <TextInputField label="County" name="orgCounty" value={formData.orgCounty} onChange={handleChange} type="text" theme={theme} />
              <TextInputField label="Town" name="orgTown" value={formData.orgTown} onChange={handleChange} type="text" theme={theme} />
            </div>

            {/* Step 1 Buttons */}
            <div className="flex justify-end mt-6">
              <Button type="button" onClick={handleNextStep}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <div>
            <div className="grid grid-cols-2 gap-4">
              <TextInputField label="Street" name="orgStreet" value={formData.orgStreet} onChange={handleChange} type="text" theme={theme} />
              <TextInputField label="Physical Address" name="physicalAddress" value={formData.physicalAddress} onChange={handleChange} type="text" theme={theme} />
              <TextInputField label="Postal Code" name="orgPostalCode" value={formData.orgPostalCode} onChange={handleChange} type="text" theme={theme} />
              <TextInputField label="Phone" name="orgPhone" value={formData.orgPhone} onChange={handleChange} type="text" theme={theme} />
              <TextInputField label="Email" name="orgEmail" value={formData.orgEmail} onChange={handleChange} type="email" theme={theme} />
            </div>

            {/* Step 2 Buttons */}
            <div className="flex justify-between mt-6">
              <Button type="button" onClick={handlePrevStep}>
                Back
              </Button>
              <Button type="button" onClick={handleNextStep}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Additional Details */}
        {currentStep === 3 && (
          <div>
            <div className="grid grid-cols-2 gap-4">
              <TextInputField label="Number of Stations" name="numberOfStations" type="number" value={formData.numberOfStations.toString()} onChange={handleChange} theme={theme} />
              <TextInputField label="Registration Date" name="registrationDate" type="date" value={formData.registrationDate} onChange={handleChange} theme={theme} />
              <TextInputField label="License Number" name="lisenceNo" value={formData.lisenceNo} onChange={handleChange} type="text" theme={theme} />
              <TextInputField label="Website" name="orgWebsite" value={formData.orgWebsite} onChange={handleChange} type="text" theme={theme} />
            </div>
            <TextAreaInput label="Organization Description" name="orgDescription" value={formData.orgDescription} onChange={handleChange} theme={theme} />

            {/* Step 3 Buttons */}
            <div className="flex justify-between mt-6">
              <Button type="button" onClick={handlePrevStep}>
                Back
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewOrganizationForm;