import React, { useState, useEffect } from "react";
import { getRequest } from "../utils/api";
import NotificationPopup from "../components/popups/NotificationPopup";

interface Facility {
  id: number;
  name: string;
  location: string;
}

const FacilityView: React.FC<{ theme: string }> = ({ theme }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [notification, setNotification] = useState<{ title: string; message: string; type: string } | null>(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await getRequest("/facilities/get/all");
        setFacilities(response);
      } catch {
        setNotification({ title: "Error", message: "Failed to fetch facilities", type: "error" });
      }
    };

    fetchFacilities();
  }, []);

  return (
    <div className={`facility-view ${theme} p-6`}>
      <h1>Facility View</h1>
      {notification && (
        <NotificationPopup
          title={notification.title}
          message={notification.message}
          type={notification.type.toString() as "success" | "error" | "info" | "warning"}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {facilities.map((facility) => (
          <div key={facility.id} className="card">
            <p><strong>Name:</strong> {facility.name}</p>
            <p><strong>Location:</strong> {facility.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilityView;