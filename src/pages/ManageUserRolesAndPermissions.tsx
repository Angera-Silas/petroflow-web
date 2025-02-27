/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import SelectInputField from "../components/inputs/SelectInputField";
import NotificationPopup from "../components/popups/NotificationPopup";
import Button from "../components/buttons/DashButton";
import { getRequest, postRequest } from "../utils/api";
import ReusableTable from "../components/tables/ReusableTable";

// Define Permissions Based on Role Access from Provided Menu Structure
const rolePermissions: { [key: string]: string[] } = {
    SYSTEM_ADMIN: [
        "MANAGE_USERS", "MANAGE_ORGANIZATIONS", "MANAGE_FACILITIES",
        "MANAGE_EMPLOYEES", "VIEW_REPORTS", "MANAGE_INVENTORY", "MANAGE_PRODUCTS"
    ],
    ORGANIZATION_ADMIN: ["MANAGE_FACILITIES", "VIEW_REPORTS", "ASSIGN_ROLES"],
    STATION_ADMIN: ["MANAGE_EMPLOYEES", "VIEW_REPORTS"],
    CUSTOMER_ATTENDANT: ["VIEW_ORDERS", "PROCESS_TRANSACTIONS"],
    OIL_SPECIALIST: ["MANAGE_INVENTORY", "VIEW_REPORTS"],
    RETAILER: ["VIEW_ORDERS", "PLACE_ORDERS"],
    ACCOUNTANT: ["VIEW_FINANCES", "MANAGE_PAYMENTS"],
    STATION_MANAGER: ["MANAGE_EMPLOYEES", "VIEW_REPORTS", "APPROVE_SALES"],
    DEPARTMENT_MANAGER: ["MANAGE_DEPARTMENT", "VIEW_DEPARTMENT_REPORTS"],
    HR_MANAGER: ["MANAGE_EMPLOYEES", "VIEW_PAYROLL"],
    QUALITY_MARSHAL: ["INSPECT_QUALITY", "GENERATE_REPORTS"],
};

interface ManageUserPermissionsProps {
    theme: string;
}

interface User {
    userId: number;
    firstname: string;
    lastname: string;
    role: string;
    permissions: string[];
}

interface Column {
    label: string;
    key: string;
    render?: (row: any) => React.ReactNode;
}

const ManageUserPermissions: React.FC<ManageUserPermissionsProps> = ({ theme }) => {
    const [roles] = useState(Object.keys(rolePermissions));
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [userPermissions, setUserPermissions] = useState<string[]>([]);
    const [customPermissions, setCustomPermissions] = useState<string[]>([]);
    const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning" } | null>(null);
    const [visibleColumns, setVisibleColumns] = useState<Column[]>([
        { label: "User", key: "name" },
        { label: "Role", key: "role" },
        { label: "Permissions", key: "permissions" }
    ]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getRequest(`/employees/permissions`);
            const usersData = response.content.map((user: any) => ({
                userId: user.userId,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                permissions: user.permissions.split(", "), // Assuming permissions are comma-separated
            }));
            setUsers(usersData);
            setFilteredUsers(usersData);
        } catch (error) {
            setNotification({ title: "Error", message: "Failed to fetch users", type: "error" });
        }
    };

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        setUserPermissions(rolePermissions[role] || []);
        setFilteredUsers(users.filter(user => user.role === role));
    };

    const handleUserChange = (userId: number) => {
        setSelectedUser(userId);
        const user = users.find((user) => user.userId === userId);
        setCustomPermissions(user?.permissions || []);
    };

    const togglePermission = (permission: string) => {
        setCustomPermissions((prev) =>
            prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]
        );
    };

    const savePermissions = async () => {
        if (selectedUser === null) return;
        try {
            const payload = { userId: selectedUser, permissions: customPermissions };
            await postRequest("/users/permissions/update", payload);
            setNotification({ title: "Success", message: "Permissions updated successfully", type: "success" });
        } catch (error) {
            setNotification({ title: "Error", message: "Failed to update permissions", type: "error" });
        }
    };

    const handleColumnVisibilityChange = (col: Column) => {
        setVisibleColumns((prev) => {
            if (prev.includes(col)) {
                return prev.filter((c) => c !== col);
            } else {
                const newVisibleColumns = [...prev, col];
                return visibleColumns.filter((column) => newVisibleColumns.includes(column));
            }
        });
    };

    const usersData = users.map(user => ({
        name: `${user.firstname} ${user.lastname}`,
        role: user.role,
        permissions: user.permissions.join(", "),
        userId: user.userId.toString()
    }));

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
            <h1 className="text-2xl font-semibold mb-4">User Permissions & Roles</h1>

            <div className="grid grid-cols-2 gap-4">
                {/* Role-Based Permissions */}
                <div className={`p-4 rounded-md shadow-md ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}>
                    <h2 className="text-xl font-semibold mb-2">Role-Based Permissions</h2>
                    <SelectInputField
                        label="Select Role"
                        name="role"
                        value={selectedRole}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        options={roles.map((role) => ({ label: role, value: role }))}
                        theme={theme}
                    />
                    <ul className="mt-3 border p-3 rounded">
                        {userPermissions.map((perm) => (
                            <li key={perm} className="text-sm">{perm}</li>
                        ))}
                    </ul>
                </div>

                {/* User-Specific Permissions */}
                <div className={`p-4 rounded-md shadow-md ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}>
                    <h2 className="text-xl font-semibold mb-2">User-Specific Permissions</h2>
                    <SelectInputField
                        label="Select User"
                        name="user"
                        value={selectedUser?.toString() || ""}
                        onChange={(e) => handleUserChange(Number(e.target.value))}
                        options={filteredUsers.map((user) => ({ label: user.firstname + " " + user.lastname, value: user.userId.toString() }))}
                        theme={theme}
                    />
                    <div className="mt-3 border p-3 rounded">
                        {userPermissions.map((perm) => (
                            <div key={perm} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={customPermissions.includes(perm)}
                                    onChange={() => togglePermission(perm)}
                                    className="mr-2"
                                />
                                <label className="text-sm">{perm}</label>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                    <Button onClick={savePermissions} theme={theme} variant="primary">Save Permissions</Button>
                    </div>
                </div>
            </div>

            {/* User Data Table */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">User Roles & Permissions Overview</h2>
                <ReusableTable
                    columns={[
                        { label: "User", key: "name" },
                        { label: "Role", key: "role" },
                        { label: "Permissions", key: "permissions", render: (row: User) => row.permissions.join(", ") },
                    ]}
                    data={usersData}
                    onRowSelect={(selectedIds: string[]) => {
                        if (selectedIds.length > 0) {
                            const selectedId = Number(selectedIds[0]);
                            handleUserChange(selectedId);
                        }
                    }}
                    theme={theme}
                    itemsPerPage={10}
                    visibleColumns={visibleColumns}
                    onColumnVisibilityChange={handleColumnVisibilityChange}
                    rowKey="userId"
                />
            </div>
        </div>
    );
};

export default ManageUserPermissions;