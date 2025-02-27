/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { postRequest, getRequest, putRequest, deleteRequest } from "../utils/api";
import NotificationPopup from "../components/popups/NotificationPopup";
import TextInputField from "../components/inputs/TextInputField";
import Button from "../components/buttons/DashButton";
import CustomTable from "../components/tables/CustomTable";

interface ManageOrganizationsProps {
    theme: string;
}

interface Organization {
    orgId: number;
    orgName: string;
    orgCounty: string;
    orgTown: string;
    orgStreet: string;
    orgPostalCode: string;
    orgType: string;
    orgEmail: string;
    orgPhone: string;
    facilityCount: number;
    employeeCount: number;
}

interface User {
    id: number;
    firstname: string;
    lastname: string;
    role: string;
    department: string;
    email: string;
    organizationName: string;
    facilityName: string;
}

interface Facility {
    id: number;
    facilityName: string;
    facilityCounty: string;
    facilityTown: string;
    facilityStreet: string;
    phone: string;
    email: string;
    physicalAddress: string;
    facilityPostalCode: string;
    servicesOffered: string;
    employeeCount: number;
    orgName: string;
}

const ManageOrganizations: React.FC<ManageOrganizationsProps> = ({ theme }) => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [editOrg, setEditOrg] = useState<Organization | null>(null);
    const [newFacility, setNewFacility] = useState<Facility>({ id: 0, facilityName: "", facilityCounty: "", facilityTown: "", facilityStreet: "", phone: "", email: "", physicalAddress: "", facilityPostalCode
        : "", servicesOffered: "", employeeCount: 0, orgName: "" });
    const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning" } | null>(null);
    const [loading, setLoading] = useState(true);

    const showNotification = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
        setNotification({ title, message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const fetchOrganizations = async () => {
        try {
            const response = await getRequest("/organizations/get/all");
            if (!response) {
                throw new Error("Invalid response from server");
            }
            setOrganizations(response);
            setLoading(false);
        } catch (error) {
            showNotification("Error", "Failed to fetch organizations", "error");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const handleViewFacilities = async (orgId: number) => {
        try {
            const response = await getRequest(`/facilities/organization/${orgId}`);
            if (!response) {
                throw new Error("Invalid response from server");
            }
            setFacilities(response);
        } catch (error) {
            showNotification("Error", "Failed to fetch facilities", "error");
        }
    };

    const handleViewUsers = async (orgId: number) => {
        try {
            const response = await getRequest(`/employees/details/get/${orgId}`);
            if (!response) {
                throw new Error("Invalid response from server");
            }
            setUsers(response);
        } catch (error) {
            showNotification("Error", "Failed to fetch users", "error");
        }
    };

    const handleUpdateOrganization = async () => {
        if (!editOrg) return;
        try {
            await putRequest(`/organizations/update/${editOrg.orgId}`, editOrg);
            showNotification("Success", "Organization updated", "success");
            setEditOrg(null);
            fetchOrganizations();
        } catch (error) {
            showNotification("Error", "Failed to update organization", "error");
        }
    };

    const handleAddFacility = async () => {
        if (!selectedOrg) return;
        try {
            await postRequest(`/facilities/add`, {
                ...newFacility,
                organizationId: selectedOrg.orgId,
            });
            showNotification("Success", "Facility added", "success");
            setNewFacility({ id: 0, facilityName: "", facilityCounty: "", facilityTown: "", facilityStreet: "", phone: "", email: "", physicalAddress: "", facilityPostalCode
                : "", servicesOffered: "", employeeCount: 0, orgName: "" });
            handleViewFacilities(selectedOrg.orgId);
        } catch (error) {
            showNotification("Error", "Failed to add facility", "error");
        }
    };

    const handleRemoveFacility = async (facilityId: number) => {
        try {
            await deleteRequest(`/facilities/delete/${facilityId}`);
            showNotification("Success", "Facility removed", "success");
            if (selectedOrg) {
                handleViewFacilities(selectedOrg.orgId);
            }
        } catch (error) {
            showNotification("Error", "Failed to remove facility", "error");
        }
    };

    return (
        <div className={`p-6 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            {notification && (
                <NotificationPopup
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <h1 className="text-2xl font-bold mb-4">Manage Organizations</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <CustomTable
                    columns={["Name", "Type", "Actions"]}
                    data={organizations.map((org) => ({
                        Name: org.orgName,
                        Type: org.orgType,
                        Actions: (
                            <button onClick={() => setSelectedOrg(org)} className="bg-blue-500 text-white px-3 py-1 rounded">
                                Manage
                            </button>
                        ),
                    }))}
                    theme={theme}
                    title="Organizations"
                />
            )}

            {selectedOrg && (
                <div className="mt-6 p-4 border rounded">
                    <h2 className="text-lg font-bold mb-2">{selectedOrg.orgName} - Options</h2>
                    <div className="flex flex-wrap gap-2">
                        <Button theme={theme} variant="primary" onClick={() => setEditOrg(selectedOrg)}>Update Organization</Button>
                        <Button theme={theme} variant="secondary" onClick={() => handleViewFacilities(selectedOrg.orgId)}>View Facilities</Button>
                        <Button theme={theme} variant="secondary" onClick={() => setNewFacility({ id: 0, facilityName: "", facilityCounty: "", facilityTown: "", facilityStreet: "", phone: "", email: "", physicalAddress: "", facilityPostalCode: "", servicesOffered: "", employeeCount: 0, orgName: "" })}>Add Facility</Button>
                        <Button theme={theme} variant="secondary" onClick={() => handleViewUsers(selectedOrg.orgId)}>View Workers</Button>
                    </div>
                </div>
            )}

            {editOrg && (
                <div className="mt-4 p-4 border rounded">
                    <h2 className="text-lg font-bold">Update Organization</h2>
                    <TextInputField label="Name" name="name" value={editOrg.orgName} onChange={(e) => setEditOrg({ ...editOrg, orgName: e.target.value })} type="text" />
                    <TextInputField label="Type" name="type" value={editOrg.orgType} onChange={(e) => setEditOrg({ ...editOrg, orgType: e.target.value })} type="text" />
                    <div className="flex gap-2">
                        <Button theme={theme} variant="primary" onClick={handleUpdateOrganization}>Save</Button>
                        <Button theme={theme} variant="secondary" onClick={() => setEditOrg(null)}>Cancel</Button>
                    </div>
                </div>
            )}

            {selectedOrg && facilities.length > 0 && (
                <div className="mt-4 p-4 border rounded">
                    <h2 className="text-lg font-bold">Facilities for {selectedOrg.orgName}</h2>
                    <CustomTable
                        columns={["Facility Name", "Location", "Products/Services", "Actions"]}
                        data={facilities.map((facility) => ({
                            "Facility Name": facility.facilityName,
                            Location: `${facility.physicalAddress} - ${facility.facilityPostalCode} , ${facility.facilityStreet}, ${facility.facilityTown} `,
                            "Products/Services": facility.servicesOffered,
                            Actions: (
                                <div className="flex gap-2">
                                    <Button theme={theme} variant="primary" onClick={() => setNewFacility(facility)}>Update</Button>
                                    <Button theme={theme} variant="danger" onClick={() => handleRemoveFacility(facility.id)}>Delete</Button>
                                </div>
                            ),
                        }))}
                        theme={theme}
                        title="Facilities"
                    />
                </div>
            )}

            {newFacility.facilityName !== "" && (
                <div className="mt-4 p-4 border rounded">
                    <h2 className="text-lg font-bold">Add Facility</h2>
                    <TextInputField label="Facility Name" name="facilityName" value={newFacility.facilityName} onChange={(e) => setNewFacility({ ...newFacility, facilityName: e.target.value })} type="text" />
                    <TextInputField label="County" name="facilityCounty" value={newFacility.facilityCounty} onChange={(e) => setNewFacility({ ...newFacility, facilityCounty: e.target.value })} type="text" />
                    <TextInputField label="Town" name="facilityTown" value={newFacility.facilityTown} onChange={(e) => setNewFacility({ ...newFacility, facilityTown: e.target.value })} type="text" />
                    <TextInputField label="Street" name="facilityStreet" value={newFacility.facilityStreet} onChange={(e) => setNewFacility({ ...newFacility, facilityStreet: e.target.value })} type="text" />
                    <TextInputField label="Phone" name="phone" value={newFacility.phone} onChange={(e) => setNewFacility({ ...newFacility, phone: e.target.value })} type="text" />
                    <TextInputField label="Email" name="email" value={newFacility.email} onChange={(e) => setNewFacility({ ...newFacility, email: e.target.value })} type="text" />
                    <TextInputField label="Physical Address" name="physicalAddress" value={newFacility.physicalAddress} onChange={(e) => setNewFacility({ ...newFacility, physicalAddress: e.target.value })} type="text" />
                    <TextInputField label="Postal Code" name="postalCode" value={newFacility.facilityPostalCode} onChange={(e) => setNewFacility({ ...newFacility, facilityPostalCode: e.target.value })} type="text" />
                    <TextInputField label="Services Offered" name="servicesOffered" value={newFacility.servicesOffered} onChange={(e) => setNewFacility({ ...newFacility, servicesOffered: e.target.value })} type="text" />
                    <TextInputField label="Employee Count" name="employeeCount" value={newFacility.employeeCount.toString()} onChange={(e) => setNewFacility({ ...newFacility, employeeCount: parseInt(e.target.value) })} type="number" />
                    <div className="flex gap-2">
                        <Button theme={theme} variant="primary" onClick={handleAddFacility}>Add</Button>
                        <Button theme={theme} variant="secondary" onClick={() => setNewFacility({ id: 0, facilityName: "", facilityCounty: "", facilityTown: "", facilityStreet: "", phone: "", email: "", physicalAddress: "", facilityPostalCode: "", servicesOffered: "", employeeCount: 0, orgName: "" })}>Cancel</Button>
                    </div>
                </div>
            )}

            {selectedOrg && users.length > 0 && (
                <div className="mt-4 p-4 border rounded">
                    <h2 className="text-lg font-bold">Users for {selectedOrg.orgName}</h2>
                    <CustomTable
                        columns={["First Name", "Last Name", "Role", "Department", "Email", "Facility", "Actions"]}
                        data={users.map((user) => ({
                            "First Name": user.firstname,
                            "Last Name": user.lastname,
                            Role: user.role,
                            Department: user.department,
                            Email: user.email,
                            Facility: user.facilityName,
                            Actions: (
                                <div className="flex gap-2">
                                    <Button theme={theme} variant="primary" onClick={() => {}}>Update</Button>
                                    <Button theme={theme} variant="danger" onClick={() => {}}>Delete</Button>
                                </div>
                            ),
                        }))}
                        theme={theme}
                        title="Users"
                    />
                </div>
            )}
        </div>
    );
};

export default ManageOrganizations;