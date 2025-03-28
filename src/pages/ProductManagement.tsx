import React, { useState, useEffect } from 'react';
import { getRequest, deleteRequest } from '../utils/api';
import NotificationPopup from '../components/popups/NotificationPopup';
import Button from '../components/buttons/Button';
import CreateProductForm from '../forms/sales/CreateProduct';
import ReusableTable from '../components/tables/ReusableTable';
import Modal from '../components/modals/Modal';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ProductManagementProps {
    theme: string;
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
interface Action<T> {
    label: string;
    onClick: (row: T) => void;
}


const ProductManagement: React.FC<ProductManagementProps> = ({ theme }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedRow, setSelectedRow] = useState<string | null>(null); // Track the selected row for single selection
    const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const user = useSelector((state: RootState) => state.user);

    const orgId = user.organizationId ? Number(user.organizationId) : 0;
    const facilityId = user.facilityId ? Number(user.facilityId) : 0;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getRequest(`/products/get/facility/${facilityId}`);
                setProducts(response);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [facilityId]);

    const handleDelete = async () => {
        if (!productToDelete) return;
        setLoading(true);
        setNotification(null);

        try {
            await deleteRequest(`/products/${productToDelete.id}`);
            setProducts(products.filter(product => product.id !== productToDelete.id));
            setNotification({
                title: 'Success',
                message: 'Product deleted successfully!',
                type: 'success'
            });
            setIsDeleteModalOpen(false);
        } catch (error) {
            setNotification({
                title: 'Error',
                message: (error as Error).message || 'Failed to delete product',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleFormSubmit = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
        const fetchProducts = async () => {
            try {
                const response = await getRequest(`/products/get/facility/${facilityId}`);
                setProducts(response);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    };

    const actions: Action<Product>[] = [
    {
        label: 'Edit',
        onClick: (row: Product) => {
            console.log('Edit action triggered for row:', row);
            handleEdit(row);
        },
    },
    {
        label: 'Delete',
        onClick: (row: Product) => {
            console.log('Delete action triggered for row:', row);
            setProductToDelete(row);
            setIsDeleteModalOpen(true);
        },
    },
];

    const columns = [
        { key: 'productName', label: 'Product Name' },
        { key: 'productDescription', label: 'Description' },
        { key: 'productCategory', label: 'Category' },
        { key: 'productSubCategory', label: 'SubCategory' },
        { key: 'department', label: 'Department' },
    ];

    return (
        <div className="p-6">
            <div className='flex justify-between items-center mb-6 mt-4'>
                <h1 className="text-3xl font-bold">Manage Products</h1>

                <div className='flex space-x-4'>
                    <Button onClick={() => setIsModalOpen(true)}>Add New Product</Button>
                </div>
            </div>
            {notification && (
                <NotificationPopup
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <ReusableTable
                columns={columns}
                data={products}
                onRowSelect={(selectedIds) => setSelectedRow(selectedIds[0] || null)} // Handle single row selection
                theme={theme}
                itemsPerPage={10}
                visibleColumns={columns}
                onColumnVisibilityChange={() => { }}
                rowKey="id"
                selectionMode="single" // Enable single selection mode
                actions={actions} // Pass the actions to the ReusableTable
            />

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} open={isModalOpen} theme={theme}>
                    <CreateProductForm
                        theme={theme}
                        orgId={orgId}
                        facilityId={facilityId}
                        product={selectedProduct}
                        onSubmit={handleFormSubmit}
                    />
                </Modal>
            )}

            {isDeleteModalOpen && (
                <Modal onClose={() => setIsDeleteModalOpen(false)} open={isDeleteModalOpen} theme={theme}>
                    <div>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this product?</p>
                        <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={handleDelete} disabled={loading}>
                            {loading ? 'Deleting...' : 'Confirm'}
                        </Button>
                        <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ProductManagement;