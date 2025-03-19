import React, { useState, useEffect } from 'react';
import { postRequest, putRequest, getRequest } from '../../utils/api';
import NotificationPopup from '../../components/popups/NotificationPopup';
import Button from '../../components/buttons/Button';
import TextInputField from '../../components/inputs/TextInputField';
import SelectInputField from '../../components/inputs/SelectInputField';

interface CreateProductFormProps {
    theme: string;
    orgId: number;
    facilityId: number;
    product?: Product | null;
    onSubmit: () => void;
}

interface Product {
    id: number;
    dateAdded: string;
    productName: string;
    productDescription: string;
    productCategory: string;
    productSubCategory: string;
    orgId: number;
    facilityId: number;
    department: string;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({ theme, orgId, facilityId, product, onSubmit }) => {
    const [formData, setFormData] = useState({
        dateAdded: '',
        productName: '',
        productDescription: '',
        productCategory: '',
        productSubCategory: '',
        orgId: orgId,
        facilityId: facilityId,
        department: '',
        buyingPricePerUnit: '',
        unitsAvailable: ''
    });

    const [departments, setDepartments] = useState<string[]>([]);
    const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await getRequest(`/organization-employee/get/organization/${orgId}/facility/${facilityId}/departments`);
                const departmentNames = response.map((dept: { departmentName: string }) => dept.departmentName);
                setDepartments(departmentNames);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchDepartments();

        if (product) {
            setFormData({
                dateAdded: product.dateAdded,
                productName: product.productName,
                productDescription: product.productDescription,
                productCategory: product.productCategory,
                productSubCategory: product.productSubCategory,
                orgId: product.orgId,
                facilityId: product.facilityId,
                department: product.department,
                buyingPricePerUnit: '',
                unitsAvailable: ''
            });
        }
    }, [orgId, facilityId, product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);

        try {
            let productId;
            let organization;
            let facility;
            if (product) {
                // Update existing product
                await putRequest(`/products/${product.id}`, formData);
                setNotification({
                    title: 'Success',
                    message: 'Product updated successfully!',
                    type: 'success'
                });
                productId = product.id;
                organization = product.orgId;
                facility = product.facilityId;
            } else {
                // Create new product
                const response = await postRequest('/products/create', formData);
                setNotification({
                    title: 'Success',
                    message: 'Product created successfully!',
                    type: 'success'
                });
                productId = response.id;
                organization = response.orgId;
                facility = response.facilityId;
            }

            // Add product to stock
            const stockData = {
                dateStocked: new Date().toISOString(),
                productId: productId,
                orgId: organization,
                facilityId: facility,
                unitsAvailable: parseFloat(formData.unitsAvailable),
                unitsSold: 0,
                unitsBought: parseFloat(formData.unitsAvailable),
                unitsReturned: 0,
                unitsDamaged: 0,
                unitsLost: 0,
                buyingPricePerUnit: parseFloat(formData.buyingPricePerUnit),
                sellingPricePerUnit: 1 // Default selling price
            };
            await postRequest('/stocks/add', stockData);

            onSubmit();
            // Reset form
            setFormData({
                dateAdded: '',
                productName: '',
                productDescription: '',
                productCategory: '',
                productSubCategory: '',
                orgId: orgId,
                facilityId: facilityId,
                department: '',
                buyingPricePerUnit: '',
                unitsAvailable: ''
            });
        } catch (error) {
            setNotification({
                title: 'Error',
                message: (error as Error).message || 'Failed to save product',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const formBgStyle = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black';

    return (
        <div className={`max-w-3xl mx-auto p-6 shadow-lg rounded-lg ${formBgStyle}`}>
            <h2 className="text-2xl font-semibold mb-4">{product ? 'Edit Product' : 'Create Product'}</h2>

            {notification && (
                <NotificationPopup
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <TextInputField
                        label="Date Added"
                        name="dateAdded"
                        value={formData.dateAdded}
                        onChange={handleChange}
                        type="date"
                        theme={theme}
                    />
                    <TextInputField
                        label="Product Name"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Product Name"
                        theme={theme}
                    />
                    <TextInputField
                        label="Product Description"
                        name="productDescription"
                        value={formData.productDescription}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Product Description"
                        theme={theme}
                    />
                    <TextInputField
                        label="Product Category"
                        name="productCategory"
                        value={formData.productCategory}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Product Category"
                        theme={theme}
                    />
                    <TextInputField
                        label="Product SubCategory"
                        name="productSubCategory"
                        value={formData.productSubCategory}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Product SubCategory"
                        theme={theme}
                    />
                    <TextInputField
                        label="Buying Price Per Unit"
                        name="buyingPricePerUnit"
                        value={formData.buyingPricePerUnit}
                        onChange={handleChange}
                        type="number"
                        placeholder="Enter Buying Price Per Unit"
                        theme={theme}
                    />
                    <TextInputField
                        label="Units Available"
                        name="unitsAvailable"
                        value={formData.unitsAvailable}
                        onChange={handleChange}
                        type="number"
                        placeholder="Enter Units Available"
                        theme={theme}
                    />
                    <SelectInputField
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        options={departments.map(department => ({ value: department, label: department }))}
                        theme={theme}
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : product ? 'Update Product' : 'Create Product'}
                </Button>
            </form>
        </div>
    );
};

export default CreateProductForm;