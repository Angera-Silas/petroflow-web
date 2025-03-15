import React, { useState, useEffect, useCallback } from "react";
import { getRequest } from "../utils/api";
import NotificationPopup from "../components/popups/NotificationPopup";
import SelectInputField from "../components/inputs/SelectInputField";

interface Organization {
  orgId: number;
  orgName: string;
}

interface Facility {
  id: number;
  facilityName: string;
}

interface Role {
  role: string;
}

interface User {
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
  userId: number;
  employeeNo: string;
  postalCode: string;
  physicalAddress: string;
  city: string;
  dateOfBirth: string;
  hireDate: string;
  role: string;
}

interface UserProfileViewProps {
  theme: string;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ theme }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [notification, setNotification] = useState<{ title: string; message: string; type: "error" | "success" | "info" | "warning" } | null>(null);

  const showNotification = (title: string, message: string, type: "error" | "success" | "info" | "warning") => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchOrganizations = useCallback(async () => {
    try {
      const response = await getRequest("/organizations/get/all");
      if (!response) {
        throw new Error("Invalid response from server");
      }
      setOrganizations(response);
    } catch {
      showNotification("Error", "Failed to fetch organizations", "error");
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const fetchUsers = async (orgId: string, facilityId?: string, roleName?: string) => {
    try {
      let url = `/employees/info/org/${orgId}`;
      if (facilityId) {
        url = `/employees/info/facility/${facilityId}`;
      }
      if (roleName) {
        url = `/organization-employee/get/organization/${orgId}/facility/${facilityId}/employees/${roleName}`;
      }
      const response = await getRequest(url);
      if (!response) {
        throw new Error("Invalid response from server");
      }
      setUsers(response);
    } catch {
      showNotification("Error", "Failed to fetch users", "error");
    }
  };

  const handleOrganizationChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = e.target.value;
    setSelectedOrganization(orgId);
    try {
      const response = await getRequest(`/facilities/organization/${orgId}`);
      if (!response) {
        throw new Error("Invalid response from server");
      }
      setFacilities(response);

      const rolesResponse = await getRequest(`/organization-employee/get/organization/${orgId}/roles`);
      if (!rolesResponse) {
        throw new Error("Invalid response from server");
      }
      setRoles(rolesResponse);

      await fetchUsers(orgId);

      setSelectedFacility("");
      setSelectedRole("");
      setSelectedUser(null);
      setUserProfile(null);
    } catch {
      showNotification("Error", "Failed to fetch facilities", "error");
    }
  };

  const handleFacilityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const facilityId = e.target.value;
    setSelectedFacility(facilityId);
    try {
      const response = await getRequest(`/organization-employee/get/organization/${selectedOrganization}/facility/${facilityId}/roles`);
      if (!response) {
        throw new Error("Invalid response from server");
      }
      setRoles(response);

      await fetchUsers(selectedOrganization, facilityId);

      setSelectedRole("");
      setSelectedUser(null);
      setUserProfile(null);
    } catch {
      showNotification("Error", "Failed to fetch roles", "error");
    }
  };

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roleName = e.target.value;
    setSelectedRole(roleName);
    try {
      await fetchUsers(selectedOrganization, selectedFacility, roleName);

      setSelectedUser(null);
      setUserProfile(null);
    } catch {
      showNotification("Error", "Failed to fetch users", "error");
    }
  };

  const handleUserChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    try {
      const response = await getRequest(`/employees/info/${userId}`);
      if (!response) {
        throw new Error("Invalid response from server");
      }
      setUserProfile(response);

      // Update selected facility and role based on the selected user
      setSelectedFacility(response.facilityId.toString());
      setSelectedRole(response.role);
    } catch {
      showNotification("Error", "Failed to fetch user profile", "error");
    }
  };

  const organizationOptions = organizations
    .filter(org => org?.orgId !== undefined)
    .map(org => ({
      value: org.orgId.toString(),
      label: org.orgName || "Unknown Organization"
    }));

  const facilityOptions = facilities
    .filter(facility => facility?.id !== undefined)
    .map(facility => ({
      value: facility.id.toString(),
      label: facility.facilityName || "Unknown Facility"
    }));

  const roleOptions = roles
    .filter(role => role?.role !== undefined)
    .map(role => ({
      value: role.role.toString(),
      label: role.role || "Unknown Role"
    }));

  const userOptions = users
    .filter(user => user?.userId !== undefined)
    .map(user => ({
      value: user.userId.toString(),
      label: user.firstname + " " + user.lastname || "Unknown User"
    }));

  return (
    <div className={`view-user-profile ${theme} m-8`}>
      <h1>View User Profile</h1>
      {notification && (
        <NotificationPopup
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="form grid grid-cols-2 mt-10 gap-8">
        <SelectInputField
          label="Organization"
          value={selectedOrganization}
          name="organization"
          theme={theme}
          onChange={handleOrganizationChange}
          options={organizationOptions}
        />
        <SelectInputField
          label="Facility"
          value={selectedFacility}
          name="facility"
          theme={theme}
          onChange={handleFacilityChange}
          options={facilityOptions}
          disabled={!selectedOrganization}
        />
        <SelectInputField
          label="Role"
          value={selectedRole}
          name="role"
          theme={theme}
          onChange={handleRoleChange}
          options={roleOptions}
          disabled={!selectedOrganization}
        />
        <SelectInputField
          label="User"
          value={selectedUser || ""}
          name="user"
          theme={theme}
          onChange={handleUserChange}
          options={userOptions}
          disabled={!selectedOrganization}
        />
      </div>
      {userProfile && (
        <div className="grid grid-cols-2 gap-4 mt-10">
          <div className="card">
            <p><strong>Name:</strong> {userProfile.name}</p>
            <p><strong>Email:</strong> {userProfile.email}</p>
            <p><strong>Department:</strong> {userProfile.department}</p>
            <p><strong>Employment Type:</strong> {userProfile.employmentType}</p>
            <p><strong>Employee No:</strong> {userProfile.employeeNo}</p>
            <p><strong>City:</strong> {userProfile.city}</p>
            <p><strong>Postal Code:</strong> {userProfile.postalCode}</p>
            <p><strong>Physical Address:</strong> {userProfile.physicalAddress}</p>
          </div>
          <div className="card">
            <p><strong>Facility Name:</strong> {userProfile.facilityName}</p>
            <p><strong>First Name:</strong> {userProfile.firstname}</p>
            <p><strong>Job Title:</strong> {userProfile.jobTitle}</p>
            <p><strong>Last Name:</strong> {userProfile.lastname}</p>
            <p><strong>Date of Birth:</strong> {userProfile.dateOfBirth}</p>
            <p><strong>Hire Date:</strong> {userProfile.hireDate}</p>
          </div>
          <div className="card">
            <p><strong>Organization Name:</strong> {userProfile.organizationName}</p>
            <p><strong>Phone Number:</strong> {userProfile.phoneNumber}</p>
            <p><strong>Role:</strong> {userProfile.role}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileView;