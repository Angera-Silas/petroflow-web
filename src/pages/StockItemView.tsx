import React, { useState, useEffect } from "react";
import { getRequest } from "../utils/api";
import NotificationPopup from "../components/popups/NotificationPopup";

interface StockItem {
  id: number;
  name: string;
  quantity: number;
  location: string;
}

const StockItemView: React.FC<{ theme: string }> = ({ theme }) => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [notification, setNotification] = useState<{ title: string; message: string; type: string } | null>(null);

  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const response = await getRequest("/stock-items/get/all");
        setStockItems(response);
      } catch {
        setNotification({ title: "Error", message: "Failed to fetch stock items", type: "error" });
      }
    };

    fetchStockItems();
  }, []);

  return (
    <div className={`stock-item-view ${theme} p-6`}>
      <h1>Stock Item View</h1>
      {notification && (
        <NotificationPopup
          title={notification.title}
          message={notification.message}
          type={notification.type.toString() as "success" | "error" | "info" | "warning"}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {stockItems.map((item) => (
          <div key={item.id} className="card">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Location:</strong> {item.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockItemView;