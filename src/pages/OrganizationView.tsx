import React, { useState, useEffect } from "react";
import { getRequest } from "../utils/api";
import NotificationPopup from "../components/popups/NotificationPopup";

interface Organization {
  id: number;
  name: string;
  address: string;
}

const OrganizationView: React.FC<{ theme: string }> = ({ theme }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [notification, setNotification] = useState<{ title: string; message: string; type: string } | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await getRequest("/organizations/get/all");
        setOrganizations(response);
      } catch {
        setNotification({ title: "Error", message: "Failed to fetch organizations", type: "error" });
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <div className={`organization-view ${theme} p-6`}>
      <h1>Organization View</h1>
      {notification && (
        <NotificationPopup
          title={notification.title}
          message={notification.message}
          type={notification.type.toString() as "success" | "error" | "info" | "warning"}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {organizations.map((org) => (
          <div key={org.id} className="card">
            <p><strong>Name:</strong> {org.name}</p>
            <p><strong>Address:</strong> {org.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationView;