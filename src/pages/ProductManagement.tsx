import React, { useState, useEffect } from 'react';
import { getRequest, deleteRequest } from '../utils/api';
import NotificationPopup from '../components/popups/NotificationPopup';
import Button from '../components/buttons/Button';
import CreateProductForm from '../forms/sales/CreateProduct';
import ReusableTable from '../components/tables/ReusableTable';
import Modal from '../components/modals/Modal'; // Assuming you have a Modal component
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

const ProductManagement: React.FC<ProductManagementProps> = ({ theme }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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

    const columns = [
        { key: 'productName', label: 'Product Name' },
        { key: 'productDescription', label: 'Description' },
        { key: 'productCategory', label: 'Category' },
        { key: 'productSubCategory', label: 'SubCategory' },
        { key: 'department', label: 'Department' },
        {
            key: 'actions',
            label: 'Actions',
            render: (row: Product) => (
                <>
                    <Button onClick={() => handleEdit(row)}>Edit</Button>
                    <Button onClick={() => { setProductToDelete(row); setIsDeleteModalOpen(true); }} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className='flex justify-between items-center'>
                <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
                <div className='mb-5' >
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
                onRowSelect={() => { }}
                theme={theme}
                itemsPerPage={10}
                visibleColumns={columns}
                onColumnVisibilityChange={() => { }}
                rowKey="id"
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
                        <Button onClick={handleDelete} disabled={loading}>
                            {loading ? 'Deleting...' : 'Confirm'}
                        </Button>
                        <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ProductManagement;