/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import SelectInputField from "../components/inputs/SelectInputField";
import NotificationPopup from "../components/popups/NotificationPopup";
import Button from "../components/buttons/DashButton";
import { getRequest, postRequest, putRequest } from "../utils/api";
import ReusableTable from "../components/tables/ReusableTable";

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

interface Role {
    roleId: string;
    roleName: string;
    permissions: string[];
}

interface Permission {
    permissionId: number;
    permissionName: string;
}

interface Column {
    label: string;
    key: string;
    render?: (row: any) => React.ReactNode;
}

const ManageUserPermissions: React.FC<ManageUserPermissionsProps> = ({ theme }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [filteredRolePermissions, setFilteredRolePermissions] = useState<Permission[]>([]);
    const [filteredUserPermissions, setFilteredUserPermissions] = useState<Permission[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [userPermissions, setUserPermissions] = useState<string[]>([]);
    const [customPermissions, setCustomPermissions] = useState<string[]>([]);
    const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning" } | null>(null);
    const [visibleColumns, setVisibleColumns] = useState<Column[]>([
        { label: "User", key: "name" },
        { label: "Role", key: "role" },
        { label: "Permissions", key: "permissions" }
    ]);
    const [roleSearchTerm, setRoleSearchTerm] = useState<string>("");
    const [userSearchTerm, setUserSearchTerm] = useState<string>("");

    useEffect(() => {
        fetchRolesAndPermissions();
        fetchUsers();
    }, []);

    useEffect(() => {
        filterRolePermissions();
    }, [roleSearchTerm, permissions]);

    useEffect(() => {
        filterUserPermissions();
    }, [userSearchTerm, permissions]);

    const fetchRolesAndPermissions = async () => {
        try {
            const rolesResponse = await getRequest(`/roles/all/permissions`);
            const rolesData = rolesResponse.content.map((role: any) => ({
                roleId: role.roleId,
                roleName: role.roleName,
                permissions: role.permissions
            }));
            setRoles(rolesData);

            const permissionsResponse = await getRequest(`/permissions/get/all`);
            const permissionsData = permissionsResponse.map((permission: any) => ({
                permissionId: permission.id,
                permissionName: permission.name
            }));
            setPermissions(permissionsData);
            setFilteredRolePermissions(permissionsData);
            setFilteredUserPermissions(permissionsData);
        } catch (error) {
            setNotification({ title: "Error", message: "Failed to fetch roles and permissions", type: "error" });
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await getRequest(`/employees/permissions`);
            const usersData = response.content.map(
                (user: { userId: any; firstname: any; lastname: any; roleName: any; 
                    department:any; facilityId: any; facilityName: any; organizationId: any; 
                    organizationName: any; permissions: any; }) => ({
                userId: user.userId,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.roleName, // Correct property name
                department: user.department,
                facilityId: user.facilityId,
                facilityName: user.facilityName,
                organizationId: user.organizationId,
                organizationName: user.organizationName,
                permissions: user.permissions, // No need to split, it's already an array
            }));
            setUsers(usersData);
            setFilteredUsers(usersData);
        } catch (error) {
            setNotification({ title: "Error", message: "Failed to fetch users", type: "error" });
        }
    };    

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        const rolePermissions = roles.find(r => r.roleName === role)?.permissions || [];
        setUserPermissions(rolePermissions);
        setFilteredUsers(users.filter(user => user.role === role));
    };

    const handleUserChange = (userId: number) => {
        setSelectedUser(userId);
        const user = users.find((user) => user.userId === userId);
        if (user) {
            setSelectedRole(user.role);
            setCustomPermissions(user.permissions);
        }
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
            await putRequest("/users/permissions/update", payload);
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

    const filterRolePermissions = () => {
        const filtered = permissions.filter(permission =>
            permission.permissionName.toLowerCase().includes(roleSearchTerm.toLowerCase())
        );
        setFilteredRolePermissions(filtered);
    };

    const filterUserPermissions = () => {
        const filtered = permissions.filter(permission =>
            permission.permissionName.toLowerCase().includes(userSearchTerm.toLowerCase())
        );
        setFilteredUserPermissions(filtered);
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

            <div className="grid grid-cols-2 gap-2">
                {/* Role-Based Permissions */}
                <div className={`p-4 rounded-md shadow-md ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}>
                    <h2 className="text-xl font-semibold mb-2">Role-Based Permissions</h2>
                    <SelectInputField
                        label="Select Role"
                        name="role"
                        value={selectedRole}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        options={roles.map((role) => ({ label: role.roleName, value: role.roleName }))}
                        theme={theme}
                    />
                    <div className="mt-3">
                        <input
                            type="text"
                            placeholder="Search permissions..."
                            value={roleSearchTerm}
                            onChange={(e) => setRoleSearchTerm(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mt-3 border p-2 rounded">
                        {filteredRolePermissions.map((perm) => (
                            <div key={perm.permissionId} className="flex items-center flex-wrap">
                                <input
                                    type="checkbox"
                                    checked={userPermissions.includes(perm.permissionName)}
                                    onChange={() => togglePermission(perm.permissionName)}
                                    className="mr-2 text-xm"
                                />
                                <label className="text-sm">{perm.permissionName}</label>
                            </div>
                        ))}
                    </div>
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
                    <div className="mt-3">
                        <input
                            type="text"
                            placeholder="Search permissions..."
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mt-3 border p-3 rounded">
                        {filteredUserPermissions.map((perm) => (
                            <div key={perm.permissionId} className="flex items-center flex-wrap">
                                <input
                                    type="checkbox"
                                    checked={customPermissions.includes(perm.permissionName)}
                                    onChange={() => togglePermission(perm.permissionName)}
                                    className="mr-2"
                                />
                                <label className="text-sm">{perm.permissionName}</label>
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