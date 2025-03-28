/* eslint-disable no-self-assign */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import NotificationPopup from "../../components/popups/NotificationPopup";
import TextInputField from "../../components/inputs/TextInputField";
import SelectInputField from "../../components/inputs/SelectInputField";
import { getRequest, postRequest, putRequest } from "../../utils/api";
import Button from "../../components/buttons/Button";

interface EmployeeFormProps {
  theme: string;
}

interface EmployeeFormData {
  email: string;
  firstname: string;
  middlename: string,
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
  dateOfBirth: string;
  bankName: string;
  accountNo: string;
  userId: number;
  employeeId: number;
  username?: string;
  physicalAddress: string,
  postalCode: string,
  city: string,
  gender: string,
  registrationDate: string,
}

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

const departmentOptions = [
  { label: "Management", value: "Management" },
  { label: "General Sales", value: "Sales" },
  { label: "Sales (Fuel & Engine Oil)", value: "Sales_Fuel" },
  { label: "Sales (Gas_Cylinders)", value: "Sales_Gas_Cylinders" },
  { label: "Sales(Shop)", value: "Sales_Shop" },
  { label: "Garage", value: "Garage" },
  { label: "Carwash", value: "Carwash" },
  { label: "Accounts", value: "Accounts" },
  { label: "ICT", value: "ICT" },
  { label: "Customer Service", value: "Customer_Service" },
  { label: "Human Resources", value: "Human_Resources" },
  { label: "Marketing", value: "Marketing" },
  { label: "Quality Control", value: "Quality_Control" },
  { label: "Retail (Convenience Store)", value: "Retail_Convenience_Store" },
  
];

const EmployeeForm: React.FC<EmployeeFormProps> = ({ theme }) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
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
    userId: 0,
    employeeId: 0,
    username: "",
    physicalAddress: "Unknown",
    postalCode: "Unknown",
    city: "Unknown",
    gender: "Unknown",
    registrationDate: new Date().toISOString().split("T")[0],
    middlename: "N/A",
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning" } | null>(null);
  const [organizations, setOrganizations] = useState<{ value: string; label: string }[]>([]);
  const [facilities, setFacilities] = useState<{ value: string; label: string }[]>([]);
  const [existingUsers, setExistingUsers] = useState<any[]>([]);
  const [existingEmployees, setExistingEmployees] = useState<any[]>([]);
  const [existingUserDetails, setExistingUserDetails] = useState<any[]>([]);
  const [existingEmployeeOrganization, setExistingEmployeeOrganization] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);

  const formBgStyle = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";

  useEffect(() => {
    fetchOrganizations();
    fetchExistingUsers();
    fetchExistingUserDetails();
    fetchExistingEmployees();
    fetchExistingEmployeeOrganization();
  }, []);

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



  const fetchRoles = async () =>{
    try {
      const response = await getRequest(`/roles/get/all`);
      setRoles(response.map((role: any) => ({value: role.id.toString(), label: role.name})));
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }


  const fetchExistingUsers = async () => {
    try {
      const response = await getRequest("/users/get/all");
      console.log(response);
      setExistingUsers(response);
    } catch (error) {
      console.error("Error fetching existing users:", error);
    }
  }

  const fetchExistingUserDetails = async () => {
    try {
      const response = await getRequest("/profiles/get/all");
      console.log(response);
      setExistingUserDetails(response);
    } catch (error) {
      console.error("Error fetching existing user details:", error
      );
    }
  }

  const fetchExistingEmployees = async () => {
    try {
      const response = await getRequest("/employees/get/all");
      console.log(response);
      setExistingEmployees(response);
    } catch (error) {
      console.error("Error fetching existing user details:", error
      );
    }
  }

  const fetchExistingEmployeeOrganization = async () => {
    try {
      const response = await getRequest("/organization-employee/get/all");
      console.log(response);
      setExistingEmployeeOrganization(response);
    } catch (error) {
      console.error("Error fetching existing user details:", error
      );
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;


    if(name === "department" || name === "role"){
      value = value;
    }else if (name === "email" || name === "username") {
      value = value.toLowerCase(); // Convert to lowercase
    } else if (["bankName", "kraPin", "nhifNo", "nssfNo","employeeNo"].includes(name)) {
      value = value.toUpperCase(); // Convert to uppercase
    } else {
      // Capitalize first letter of each word (for names, job titles, etc.)
      value = value
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
  
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    if (name === "organizationId") fetchFacilities(value);
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      formData.username = formData.lastname + formData.firstname;
      let userId, employeeId, profileId;
      const updatedUsername = (formData.username + "@petroflow.co.ke").toLocaleLowerCase();


      // Check if user exists, else create/update
      let existingUser = existingUsers.find(
        (user) => (user.username).toLocaleLowerCase() === updatedUsername
      );

      //  Check if profile exists, else create/update
      let existingProfile = existingUserDetails.find(
        (profile) =>
          profile.idNumber === formData.idNumber ||
          (profile.email).toLocaleLowerCase() === formData.email ||
          profile.phoneNumber === formData.phoneNumber
      );

      let finalUsername = updatedUsername;


      if (existingUser && !existingUserDetails) {
        // Ensure a unique username
        do {
          finalUsername = (formData.lastname + formData.firstname + Math.floor(Math.random() * 1000) + "@petroflow.co.ke").toLocaleLowerCase();
        } while (existingUsers.find((user) => (user.username).toLowerCase() === finalUsername));

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

      formData.userId = userId;

      // Check if employee exists, else create/update
      let existingEmployee = existingEmployees.find(
        (employee) =>
          employee.idNumber === formData.idNumber ||
          employee.nssfNo === formData.nssfNo ||
          employee.nhifNo === formData.nhifNo ||
          employee.kraPin === formData.kraPin ||
          employee.userId === userId
      );

      if (!existingEmployee) {
        const employeeResponse = await postRequest("/employees/add", formData);
        if (!employeeResponse?.id) throw new Error("Failed to create employee");
        employeeId = employeeResponse.id;
      } else {
        employeeId = existingEmployee.id;
        await putRequest(`/employees/update/${employeeId}`, formData);
      }

      formData.employeeId = employeeId;

      // Check if employee is linked to organization & facility, else create/update
      let existingOrgEmployee = existingEmployeeOrganization.find(
        (orgEmp) =>
          orgEmp.organizationId === formData.organizationId &&
          orgEmp.employeeId === formData.employeeId &&
          orgEmp.facilityId === formData.facilityId
      );

      if (!existingOrgEmployee) {
        const organizationEmployee = {
          organizationId: formData.organizationId,
          employeeNo: formData.employeeNo,
          facilityId: formData.facilityId,
          employeeId: formData.employeeId,
          department: formData.department,
          employmentStatus: "ACTIVE",
          transferDate: "N/A",
          shift: "N/A",
        };
        const organizationEmployeeResponse = await postRequest(
          "/organization-employee/add",
          organizationEmployee
        );
        if (!organizationEmployeeResponse)
          throw new Error("Failed to link employee to organization & facility");
      } else {
        await putRequest(
          `/organization-employee/update/${existingOrgEmployee.organizationId}/${existingOrgEmployee.facilityId}/${existingOrgEmployee.employeeId}`,
          formData
        );
      }

      // Success notification
      setNotification({
        title: "Success",
        message: "Employee data saved successfully!",
        type: "success",
      });

      await postRequest("/email/send", {
        to: formData.email,
        subject: "✨ Welcome to Petroflow ✨",
        body: `
          Hello ${formData.firstname},<br><br>
      
          Congratulations! 🎉 Your account has been successfully created on Petroflow.<br><br>
      
          <hr>
          <strong>🔹 Username:</strong> ${finalUsername} <br>
          <strong>🔹 Password:</strong> ${formData.idNumber} <br>
          <hr><br>
      
          Please log in to your account to update your profile and <strong>change your password</strong> for security reasons.<br><br>
      
          If you have any questions or need assistance, feel free to reach out.<br><br>
      
          Best regards,<br>
          🚀 <strong>Petroflow Support Team</strong>
        `,
      });
      

      // Reset Form
      setFormData({
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
        userId: 0,
        employeeId: 0,
        physicalAddress: "Unknown",
        postalCode: "Unknown",
        city: "Unknown",
        username: "",
        gender: "",
        registrationDate: new Date().toISOString().split("T")[0],
        middlename: "N/A",
      });

      setStep(1);
    } catch (error) {
      setNotification({
        title: "Error",
        message: (error as Error).message || "Failed to save employee data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-3xl mx-auto p-6 shadow-lg rounded-lg ${formBgStyle}`}>
      <h2 className="text-2xl font-semibold mb-4">Employee Registration</h2>

      {notification && (
        <NotificationPopup
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <>
            <h3 className="text-lg font-semibold mb-2">Step 1: Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <TextInputField type="text" label="First Name" name="firstname" value={formData.firstname} onChange={handleChange} theme={theme} placeholder="Silas" />
              <TextInputField label="Last Name" name="lastname" value={formData.lastname} onChange={handleChange} type="text" theme={theme} placeholder="Angera" />
              <TextInputField label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" theme={theme} />
              <TextInputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" theme={theme} placeholder="angera@angisoft.co.ke" />
              <TextInputField label="ID Number" name="idNumber" value={formData.idNumber} onChange={handleChange} type="text" theme={theme} placeholder="00000000" />
              <TextInputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} type="tel" theme={theme} />
            </div>
            <Button type="button" onClick={() => setStep(2)}>Next</Button>
          </>
        )}

        {/* Step 2: Job Information */}
        {step === 2 && (
          <>
            <h3 className="text-lg font-semibold mb-2">Step 2: Job Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <TextInputField label="Employee No" name="employeeNo" value={formData.employeeNo} onChange={handleChange} type="text" theme={theme} placeholder="AST00100" />
              <SelectInputField label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} options={[{ label: "Intern", value: "Intern" }, { label: "Manager", value: "Manager" }, { label: "Clerk", value: "Clerk" }]} theme={theme} />
              <SelectInputField label="Employment Type" name="employmentType" value={formData.employmentType} onChange={handleChange} options={[{ label: "Full Time", value: "Full Time" }, { label: "Part Time", value: "Part Time" }, { label: "Contract", value: "Contract" }]} theme={theme} />
              <TextInputField label="Hire Date" name="hireDate" value={formData.hireDate} onChange={handleChange} type="date" theme={theme} />
            </div>
            <div className="flex justify-between">
              <Button type="button" onClick={() => setStep(1)}>Back</Button>
              <Button type="button" onClick={() => setStep(3)}>Next</Button>
            </div>
          </>
        )}

        {/* Step 3: Compensation Details */}
        {step === 3 && (
          <>
            <h3 className="text-lg font-semibold mb-2">Step 3: Compensation Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <TextInputField label="Salary" name="salary" value={formData.salary.toString()} onChange={handleChange} type="number" theme={theme} />
              <TextInputField label="NSSF No" name="nssfNo" value={formData.nssfNo} onChange={handleChange} type="text" theme={theme} />
              <TextInputField label="SHIF No" name="nhifNo" value={formData.nhifNo} onChange={handleChange} type="text" theme={theme} />
              <TextInputField label="KRA Pin" name="kraPin" value={formData.kraPin.toLocaleUpperCase()} onChange={handleChange} type="text" theme={theme} />
              <TextInputField label="Bank Name" name="bankName" value={formData.bankName.toLocaleUpperCase()} onChange={handleChange} type="text" theme={theme} />
              <TextInputField label="Account Number" name="accountNo" value={formData.accountNo} onChange={handleChange} type="text" theme={theme} />
            </div>
            <div className="flex justify-between">
              <Button type="button" onClick={() => setStep(2)}>Back</Button>
              <Button type="button" onClick={() => setStep(4)}>Next</Button>
            </div>
          </>
        )}


        {/* Step 4: Organization Details */}
        {step === 4 && (
          <>
            <h3 className="text-lg font-semibold mb-2">Final Step: Organization Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <SelectInputField label="Organization" name="organizationId" value={formData.organizationId} onChange={handleChange} options={organizations} theme={theme} />
              <SelectInputField label="Facility" name="facilityId" value={formData.facilityId} onChange={handleChange} options={facilities} theme={theme} />
              <SelectInputField label="Department" name="department" value={formData.department} onChange={handleChange} options={departmentOptions} theme={theme} />
              <SelectInputField label="Role" name="role" value={formData.role} onChange={handleChange} options={roleOptions} theme={theme} />
            </div>
            <div className="flex justify-between">
              <Button type="button" onClick={() => setStep(3)}>Back</Button>
              <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</Button>
            </div>

          </>
        )}
      </form>
    </div>
  );
};

export default EmployeeForm;
