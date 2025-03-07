/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import ReusableTable from "../components/tables/ReusableTable";
import Modal from "../components/modals/Modal";
import Button from "../components/buttons/DashButton";
import TextInputField from "../components/inputs/TextInputField";
import { getRequest, postRequest, putRequest } from "../utils/api";
import NotificationPopup from "../components/popups/NotificationPopup";

interface Users {
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  department: string;
  organizationName: string;
  facilityName: string;
}

interface Column {
  key: string;
  label: string;
  resizable?: boolean;
}

const columns: Column[] = [
  { key: "First Name", label: "First Name" },
  { key: "Last Name", label: "Last Name" },
  { key: "Role", label: "Role" },
  { key: "Email", label: "Email" },
  { key: "Organization", label: "Organization" },
  { key: "Facility", label: "Facility" },
  { key: "Department", label: "Department" },
];

interface ManageUsers {
  theme: string;
}

const ManageUsers: React.FC<ManageUsers> = ({ theme }) => {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" | "info" | "warning"; onClose?: () => void } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [visibleColumns, setVisibleColumns] = useState<Column[]>(columns);

  const itemsPerPage = 10; // Define the number of items per page

  const fetchUsers = async () => {
    try {
      const userResponse = await getRequest("/organization-employee/details/get/all");
      if (!userResponse) {
        throw new Error("Invalid response from server");
      }

      setUsers(userResponse);
      setLoading(false);
    } catch (error) {
      setNotification({
        title: "Error",
        message: "Failed to fetch users",
        type: "error",
        onClose: () => setNotification(null),
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const usersData = users.map((user) => ({
    "First Name": user.firstname,
    "Last Name": user.lastname,
    Role: user.role,
    Email: user.email,
    Organization: user.organizationName,
    Facility: user.facilityName,
    Department: user.department,
  }));

  const handleDelete = async () => {
    try {
      // Confirm password
      const confirmPassword = prompt("Please enter your password to confirm deletion:");
      if (confirmPassword !== "yourPassword") { // Replace "yourPassword" with the actual password logic
        setNotification({
          title: "Error",
          message: "Password does not match",
          type: "error",
          onClose: () => setNotification(null),
        });
        return;
      }

      // Perform delete request
      await postRequest("/users/delete/batch", { emails: selectedRows });
      setNotification({
        title: "Success",
        message: "Users deleted successfully",
        type: "success",
        onClose: () => setNotification(null),
      });
      setModalOpen(false);
      setSelectedRows([]);
      fetchUsers();
    } catch (error) {
      setNotification({
        title: "Error",
        message: "Failed to delete Users",
        type: "error",
        onClose: () => setNotification(null),
      });
    }
  };

  const handleUpdate = async () => {
    try {
      // Perform update request
      await putRequest("/users/update/batch", { users: selectedRows.map((email) => users.find((user) => user.email === email)) });
      setNotification({
        title: "Success",
        message: "Users updated successfully",
        type: "success",
        onClose: () => setNotification(null),
      });
      setModalOpen(false);
      setSelectedRows([]);
      fetchUsers();
    } catch (error) {
      setNotification({
        title: "Error",
        message: "Failed to update users",
        type: "error",
        onClose: () => setNotification(null),
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < selectedRows.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleColumnVisibilityChange = (col: Column) => {
    setVisibleColumns((prev) => {
      if (prev.includes(col)) {
        return prev.filter((c) => c !== col);
      } else {
        const newVisibleColumns = [...prev, col];
        return columns.filter((column) => newVisibleColumns.includes(column));
      }
    });
  };

  const renderUpdateForm = () => {
    const user = users.find((user) => user.email === selectedRows[currentPage]);
    if (!user) return null;

    return (
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <TextInputField label="First Name" name="firstname" value={user.firstname} onChange={(e) => (user.firstname = e.target.value)} type="text" theme={theme} />
          </div>
          <div>
            <TextInputField label="Last Name" name="lastname" value={user.lastname} onChange={(e) => (user.lastname = e.target.value)} type="text" theme={theme} />
          </div>
          <div>
            <TextInputField label="Role" name="role" value={user.role} onChange={(e) => (user.role = e.target.value)} type="text" theme={theme} />
          </div>
          <div>
            <TextInputField label="Email" name="email" value={user.email} onChange={(e) => (user.email = e.target.value)} type="email" theme={theme} />
          </div>
          <div>
            <TextInputField label="Organization" name="organizationName" value={user.organizationName} onChange={(e) => (user.organizationName = e.target.value)} type="text" theme={theme} />
          </div>
          <div>
            <TextInputField label="Facility" name="facilityName" value={user.facilityName} onChange={(e) => (user.facilityName = e.target.value)} type="text" theme={theme} />
          </div>
          <div>
            <TextInputField label="Department" name="department" value={user.department} onChange={(e) => (user.department = e.target.value)} type="text" theme={theme} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {currentPage > 0 && <Button variant="secondary" onClick={handlePreviousPage} theme={theme}>Previous</Button>}
          {currentPage < selectedRows.length - 1 && <Button variant="primary" onClick={handleNextPage} theme={theme}>Next</Button>}
          {currentPage === selectedRows.length - 1 && <Button variant="primary" onClick={handleUpdate} theme={theme}>Submit</Button>}
        </div>
      </form>
    );
  };

  return (
    <div className={`p-4 ${theme === "dark" ? "bg-dark-background text-dark-text" : "bg-light-background text-light-text"}`}>
      {notification && (
        <NotificationPopup
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage System Users</h1>

        {selectedRows.length > 0 && (
          <div className="mt-4 flex justify-end gap-10">
            <Button variant="danger" onClick={() => { setModalType("delete"); setModalOpen(true); }} theme={theme}>
              Delete
            </Button>
            <Button variant="primary" onClick={() => { setModalType("update"); setModalOpen(true); }} theme={theme}>
              Update
            </Button>
          </div>
        )}

      </div>

      {loading ? <p>Loading...</p> : <ReusableTable 
      columns={columns} data={usersData} 
      onRowSelect={setSelectedRows} theme={theme} 
      itemsPerPage={itemsPerPage} visibleColumns={visibleColumns} 
      onColumnVisibilityChange={handleColumnVisibilityChange} 
      rowKey="Email"/>}

      {modalOpen && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} theme={theme}>
          {modalType === "delete" ? (
            <>
              <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
              <p>Are you sure you want to delete the selected users?</p>
              <ul>
                {selectedRows.map((email) => {
                  const user = users.find((user) => user.email === email);
                  return user ? <li key={email}>{user.firstname} {user.lastname}</li> : null;
                })}
              </ul>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="secondary" onClick={() => setModalOpen(false)} theme={theme}>Cancel</Button>
                <Button variant="danger" onClick={handleDelete} theme={theme}>Confirm</Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">Update User Information</h2>
              {renderUpdateForm()}
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

export default ManageUsers;