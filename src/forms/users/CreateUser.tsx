/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import NotificationPopup from "../../components/popups/NotificationPopup";
import TextInputField from "../../components/inputs/TextInputField";
import SelectInputField from "../../components/inputs/SelectInputField";
import { postRequest, getRequest, putRequest } from "../../utils/api";
import Button from "../../components/buttons/Button";

interface CreateUserProps {
  theme: string;
}

const initialFormData = {
  firstname: "",
  middlename: "N/A",
  lastname: "",
  idNumber: "",
  dateOfBirth: new Date().toISOString().split("T")[0], // Format YYYY-MM-DD
  email: "",
  phoneNumber: "",
  physicalAddress: "Unknown",
  postalCode: "Unknown",
  city: "Unknown",
  role: "",
  gender: "",
  username: "",
  registrationDate: new Date().toISOString(),
};

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

const CreateUser: React.FC<CreateUserProps> = ({ theme }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning" } | null>(null);
  const [existingUsers, setExistingUsers] = useState<any[]>([]);
  const [existingProfiles, setExistingProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    fetchUsersAndProfiles();
  }, []);

  const showNotification = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        let userId = null;
        let profileId = null;
        formData.username = formData.lastname + formData.firstname;
        const updatedUsername = formData.username + "@petroflow.co.ke";

        // Check if user exists
        const existingUser = existingUsers.find((user) => user.username === updatedUsername );
        
        // Check if profile exists
        const existingProfile = existingProfiles.find(
            (profile) => profile.email === formData.email || profile.idNumber === formData.idNumber
        );

        let finalUsername = updatedUsername;

        if (existingUser && !existingProfile) {
            // Ensure a unique username
            do {
                finalUsername = formData.lastname + formData.firstname + Math.floor(Math.random() * 1000) + "@petroflow.co.ke";
            } while (existingUsers.find((user) => user.username === finalUsername));

            const newUser = {
                username: finalUsername,
                password: formData.idNumber, // Consider hashing before storing
                role: formData.role,
                isActive: true,
            };

            const userResponse = await postRequest("/users/add", newUser);
            if (!userResponse || !userResponse.id) throw new Error("Failed to create user");
            userId = userResponse.id;

            const newProfile = { ...formData, username: finalUsername, userId };
            const profileResponse = await postRequest("/profiles/create", newProfile);
            if (!profileResponse || !profileResponse.id) throw new Error("Failed to create profile");
            profileId = profileResponse.id;
        } else if (existingUser && existingProfile) {
            userId = existingUser.id;
            profileId = existingProfile.id;

            await putRequest(`/users/update/${userId}`, {
                username: updatedUsername,
                role: formData.role,
                isActive: true,
            });

            await putRequest(`/profiles/update/${profileId}`, formData);
        } else {
            const newUser = {
                username: updatedUsername,
                password: formData.idNumber, // Consider hashing
                role: formData.role,
                isActive: true,
            };

            const userResponse = await postRequest("/users/add", newUser);
            if (!userResponse || !userResponse.id) throw new Error("Failed to create user");
            userId = userResponse.id;

            const newProfile = { ...formData, username: updatedUsername, userId };
            const profileResponse = await postRequest("/profiles/create", newProfile);
            if (!profileResponse || !profileResponse.id) throw new Error("Failed to create profile");
            profileId = profileResponse.id;
        }
         
        showNotification("Success", "User data saved successfully!", "success");

        setFormData(initialFormData);
        setStep(1);
    } catch (error) {
        showNotification("Error", error instanceof Error ? error.message : "An error occurred.", "error");
    } finally {
        setLoading(false);
    }
};



  const themeClasses = theme === "dark" ? "bg-dark-background text-dark-text" : "bg-light-background text-light-text";
  const buttonClasses = theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-300 text-black hover:bg-gray-400";

  return (
    <div className={`p-2 shadow-md rounded-md w-full ${themeClasses}`}>
      {notification && (
        <NotificationPopup
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create User - Step 1: Personal Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <TextInputField theme={theme} label="First Name" type="text" name="firstname" value={formData.firstname} onChange={handleChange} />
              <TextInputField theme={theme} label="Middle Name" type="text" name="middlename" value={formData.middlename} onChange={handleChange} />
              <TextInputField theme={theme} label="Last Name" type="text" name="lastname" value={formData.lastname} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextInputField theme={theme} label="ID Number" type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} />
              <TextInputField theme={theme} label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
              <TextInputField theme={theme} label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
              <TextInputField theme={theme} label="Phone Number" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <button type="button" onClick={() => setStep(2)} className={`px-4 py-2 rounded ${buttonClasses}`}>
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create User - Step 2: Address & Role</h3>
            <SelectInputField theme={theme} label="Role" name="role" value={formData.role} onChange={handleChange} options={roleOptions} />
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className={`px-4 py-2 rounded ${buttonClasses}`}>
                Previous
              </button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Submit"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateUser;
