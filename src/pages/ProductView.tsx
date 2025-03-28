import React, { useState, useEffect } from "react";
import { getRequest } from "../utils/api";
import NotificationPopup from "../components/popups/NotificationPopup";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const ProductView: React.FC<{ theme: string }> = ({ theme }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [notification, setNotification] = useState<{ title: string; message: string; type: string } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getRequest("/products/get/all");
        setProducts(response);
      } catch {
        setNotification({ title: "Error", message: "Failed to fetch products", type: "error" });
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={`product-view ${theme} p-6`}>
      <h1>Product View</h1>
      {notification && (
        <NotificationPopup
          title={notification.title}
          message={notification.message}
          type={notification.type.toString() as "success" | "error" | "info" | "warning"}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {products.map((product) => (
          <div key={product.id} className="card">
            <p><strong>Name:</strong> {product.name}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Category:</strong> {product.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductView;