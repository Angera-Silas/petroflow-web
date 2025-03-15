/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import SelectInputField from "../components/inputs/SelectInputField";
import NotificationPopup from "../components/popups/NotificationPopup";
import Button from "../components/buttons/DashButton";
import TextInputField from "../components/inputs/TextInputField";
import Modal from "../components/modals/Modal";
import { getRequest, postRequest, putRequest, deleteRequest } from "../utils/api";

interface ManageRolesAndPermissionsProps {
    theme: string;
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

const ManageRolesAndPermissions: React.FC<ManageRolesAndPermissionsProps> = ({ theme }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [selectedPermission, setSelectedPermission] = useState<string>("");
    const [rolePermissions, setRolePermissions] = useState<string[]>([]);
    const [newRoleName, setNewRoleName] = useState<string>("");
    const [newPermissionName, setNewPermissionName] = useState<string>("");
    const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning" } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

    useEffect(() => {
        fetchRolesAndPermissions();
    }, []);

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
        } catch (error) {
            setNotification({ title: "Error", message: "Failed to fetch roles and permissions", type: "error" });
        }
    };

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        const rolePermissions = roles.find(r => r.roleName === role)?.permissions || [];
        setRolePermissions(rolePermissions);
    };

    const handlePermissionChange = (permission: string) => {
        setSelectedPermission(permission);
    };

    const toggleRolePermission = (permission: string) => {
        setRolePermissions((prev) =>
            prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]
        );
    };

    const saveRolePermissions = async () => {
        if (!selectedRole) return;
        try {
            const payload = { roleName: selectedRole, permissions: rolePermissions };
            await putRequest("/roles/permissions/update", payload);
            setNotification({ title: "Success", message: "Role permissions updated successfully", type: "success" });
        } catch (error) {
            setNotification({ title: "Error", message: "Failed to update role permissions", type: "error" });
        }
    };

    const createRole = async () => {
        if (!newRoleName) return;
        try {
            const payload = { roleName: newRoleName };
            await postRequest("/roles/create", payload);
            setNotification({ title: "Success", message: "Role created successfully", type: "success" });
            setNewRoleName("");
            fetchRolesAndPermissions();
        } catch (error) {
            setNotification({ title: "Error", message: "Failed to create role", type: "error" });
        }
    };

    const updateRole = async () => {
        if (!selectedRole || !newRoleName) return;
        try {
            const payload = { roleName: newRoleName };
            await putRequest(`/roles/update/${selectedRole}`, payload);
            setNotification({ title: "Success", message: "Role updated successfully", type: "success" });
            setNewRoleName("");
            fetchRolesAndPermissions();
        } catch (error) {
            setNotification({ title: "Error", message: "Failed to update role", type: "error" });
        }
    };

    const deleteRole = async () => {
        if (!selectedRole) return;
        try {
            await deleteRequest(`/roles/delete/${selectedRole}`);
            setNotification({ title: "Success", message: "Role deleted successfully", type: "success" });
            setSelectedRole("");
            fetchRolesAndPermissions();
        } catch (error) {
            setNotification({ title: "Error", message: "Failed to delete role", type: "error" });
        }
    };

    const createPermission = async () => {
        if (!newPermissionName) return;
        try {
            const payload = { permissionName: newPermissionName };
            await postRequest("/permissions/create", payload);
            setNotification({ title: "Success", message: "Permission created successfully", type: "success" });
            setNewPermissionName("");
            fetchRolesAndPermissions();
        } catch (error) {
            setNotification({ title: "Error", message: "Failed to create permission", type: "error" });
        }
    };

    const updatePermission = async () => {
        if (!selectedPermission || !newPermissionName) return;
        try {
            const payload = { permissionName: newPermissionName };
            await putRequest(`/permissions/update/${selectedPermission}`, payload);
            setNotification({ title: "Success", message: "Permission updated successfully", type: "success" });
            setNewPermissionName("");
            fetchRolesAndPermissions();
        } catch (error) {
            setNotification({ title: "Error", message: "Failed to update permission", type: "error" });
        }
    };

    const deletePermission = async () => {
        if (!selectedPermission) return;
        try {
            await deleteRequest(`/permissions/delete/${selectedPermission}`);
            setNotification({ title: "Success", message: "Permission deleted successfully", type: "success" });
            setSelectedPermission("");
            fetchRolesAndPermissions();
        } catch (error) {
            setNotification({ title: "Error", message: "Failed to delete permission", type: "error" });
        }
    };

    const openModal = (title: string, message: string, onConfirm: () => void) => {
        setModalContent({ title, message, onConfirm });
        setIsModalOpen(true);
    };

    const renderRolePermissionsForm = () => (
        <div className="flex flex-col gap-4">
            <SelectInputField
                label="Select Role"
                name="role"
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                options={roles.map((role) => ({ label: role.roleName, value: role.roleName }))}
                theme={theme}
            />
            <div className="mt-3 border p-3 rounded">
                <div className="grid grid-cols-2 gap-2">
                    {permissions.map((perm) => (
                        <div key={perm.permissionId} className="flex items-center flex-wrap">
                            <input
                                type="checkbox"
                                checked={rolePermissions.includes(perm.permissionName)}
                                onChange={() => toggleRolePermission(perm.permissionName)}
                                className="mr-2"
                            />
                            <label className="text-sm break-words">{perm.permissionName}</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 flex justify-end">
                <Button onClick={saveRolePermissions} theme={theme} variant="primary">Save Role Permissions</Button>
            </div>
        </div>
    );

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
            <h1 className="text-2xl font-semibold mb-4">Manage Roles & Permissions</h1>

            <div className="mb-4 grid grid-cols-2 gap-10">
                <div className="mb-4 rounded-md shadow-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">Create New Role</h2>
                    <div className="flex gap-4">
                        <TextInputField
                            label="Role Name"
                            name="roleName"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            type="text"
                            theme={theme}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <Button onClick={createRole} theme={theme} variant="primary">Create Role</Button>
                        {selectedRole && (
                            <>
                                <Button onClick={() => openModal("Update Role", "Are you sure you want to update this role?", updateRole)} theme={theme} variant="secondary">Update Role</Button>
                                <Button onClick={() => openModal("Delete Role", "Are you sure you want to delete this role?", deleteRole)} theme={theme} variant="danger">Delete Role</Button>
                            </>
                        )}
                    </div>
                </div>
                <div className="mb-4 rounded-md shadow-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">Add New Permission</h2>
                    <div className="flex gap-4">
                        <TextInputField
                            label="Permission Name"
                            name="permissionName"
                            value={newPermissionName}
                            onChange={(e) => setNewPermissionName(e.target.value)}
                            type="text"
                            theme={theme}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <Button onClick={createPermission} theme={theme} variant="primary">Create Permission</Button>
                        {selectedPermission && (
                            <>
                                <Button onClick={() => openModal("Update Permission", "Are you sure you want to update this permission?", updatePermission)} theme={theme} variant="secondary">Update Permission</Button>
                                <Button onClick={() => openModal("Delete Permission", "Are you sure you want to delete this permission?", deletePermission)} theme={theme} variant="danger">Delete Permission</Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className={`p-4 rounded-md shadow-md ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}>
                    <h2 className="text-xl font-semibold mb-2">Assign Permissions to Role</h2>
                    {renderRolePermissionsForm()}
                </div>
            </div>

            {isModalOpen && modalContent && (
                <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} theme={theme}>
                    <h2 className="text-xl font-semibold mb-4">{modalContent.title}</h2>
                    <p className="mb-4">{modalContent.message}</p>
                    <div className="flex justify-end gap-4">
                        <Button onClick={() => setIsModalOpen(false)} theme={theme} variant="secondary">Cancel</Button>
                        <Button onClick={() => { modalContent.onConfirm(); setIsModalOpen(false); }} theme={theme} variant="primary">Confirm</Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ManageRolesAndPermissions;