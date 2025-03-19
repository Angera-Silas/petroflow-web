/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { getRequest, deleteRequest, putRequest } from '../utils/api';
import NotificationPopup from '../components/popups/NotificationPopup';
import Button from '../components/buttons/Button';
import ReusableTable from '../components/tables/ReusableTable';
import Modal from '../components/modals/Modal';
import TextInputField from '../components/inputs/TextInputField';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface Stock {
    id: number;
    dateStocked: string;
    productId: number;
    productName: string;
    orgId: number;
    orgName: string;
    facilityId: number;
    facilityName: string;
    unitsAvailable: number;
    unitsSold: number;
    unitsBought: number;
    unitsReturned: number;
    unitsDamaged: number;
    unitsLost: number;
    buyingPricePerUnit: number;
    sellingPricePerUnit: number;
}

interface ManageInventoryProps {
    theme: string;
}

const ManageInventory: React.FC<ManageInventoryProps> = ({ theme }) => {
    const [stockItems, setStockItems] = useState<Stock[]>([]);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const user = useSelector((state: RootState) => state.user);

    const orgId = user.organizationId ? String(user.organizationId) : '';
    const facilityId = user.facilityId ? String(user.facilityId) : '';

    useEffect(() => {
        if (facilityId) {
            const fetchStockItems = async () => {
                try {
                    const response = await getRequest(`/stocks/get/stock/organization/${orgId}/facility/${facilityId}`);
                    setStockItems(response);
                } catch (error) {
                    console.error('Error fetching stock items:', error);
                }
            };

            fetchStockItems();
        }
    }, [orgId, facilityId]);

    const handleDelete = async () => {
        if (!selectedStock) return;
        setLoading(true);
        setNotification(null);

        try {
            await deleteRequest(`/stocks/delete/${selectedStock.id}`);
            setStockItems(stockItems.filter(item => item.id !== selectedStock.id));
            setNotification({
                title: 'Success',
                message: 'Stock item deleted successfully!',
                type: 'success'
            });
            setIsDeleteModalOpen(false);
        } catch (error) {
            setNotification({
                title: 'Error',
                message: (error as Error).message || 'Failed to delete stock item',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: Stock) => {
        setSelectedStock(item);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStock) return;
        setLoading(true);
        setNotification(null);

        try {
            await putRequest(`/stocks/update/${selectedStock.id}`, selectedStock);
            setStockItems(stockItems.map(item => (item.id === selectedStock.id ? selectedStock : item)));
            setNotification({
                title: 'Success',
                message: 'Stock item updated successfully!',
                type: 'success'
            });
            setIsModalOpen(false);
        } catch (error) {
            setNotification({
                title: 'Error',
                message: (error as Error).message || 'Failed to update stock item',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedStock(prev => prev ? { ...prev, [name]: value } : null);
    };

    const columns = [
        { key: 'dateStocked', label: 'Date Stocked' },
        { key: 'productName', label: 'Product Name' },
        { key: 'unitsAvailable', label: 'Units Available' },
        { key: 'unitsSold', label: 'Units Sold' },
        { key: 'unitsBought', label: 'Units Bought' },
        { key: 'unitsReturned', label: 'Units Returned' },
        { key: 'unitsDamaged', label: 'Units Damaged' },
        { key: 'unitsLost', label: 'Units Lost' },
        { key: 'buyingPricePerUnit', label: 'Buying Price Per Unit' },
        { key: 'sellingPricePerUnit', label: 'Selling Price Per Unit' },
        {
            key: 'actions',
            label: 'Actions',
            render: (row: Stock) => (
                <>
                    <Button onClick={() => handleEdit(row)}>Edit</Button>
                    <Button onClick={() => { setSelectedStock(row); setIsDeleteModalOpen(true); }} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </>
            )
        }
    ];

    return (
        <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <h1 className="text-3xl font-bold mb-6">Manage Inventory</h1>

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
                data={stockItems}
                onRowSelect={() => {}}
                theme={theme}
                itemsPerPage={10}
                visibleColumns={columns}
                onColumnVisibilityChange={() => {}}
                rowKey="id"
            />

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} open={isModalOpen} theme={theme}>
                    <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
                        <TextInputField
                            label="Units Available"
                            name="unitsAvailable"
                            value={selectedStock?.unitsAvailable ? String(selectedStock.unitsAvailable) : ''}
                            onChange={handleChange}
                            type="number"
                            theme={theme}
                        />
                        <TextInputField
                            label="Units Sold"
                            name="unitsSold"
                            value={selectedStock?.unitsSold ? String(selectedStock.unitsSold) : ''}
                            onChange={handleChange}
                            type="number"
                            theme={theme}
                        />
                        <TextInputField
                            label="Units Bought"
                            name="unitsBought"
                            value={selectedStock?.unitsBought ? String(selectedStock.unitsBought) : ''}
                            onChange={handleChange}
                            type="number"
                            theme={theme}
                        />
                        <TextInputField
                            label="Units Returned"
                            name="unitsReturned"
                            value={selectedStock?.unitsReturned ? String(selectedStock.unitsReturned) : ''}
                            onChange={handleChange}
                            type="number"
                            theme={theme}
                        />
                        <TextInputField
                            label="Units Damaged"
                            name="unitsDamaged"
                            value={selectedStock?.unitsDamaged ? String(selectedStock.unitsDamaged) : ''}
                            onChange={handleChange}
                            type="number"
                            theme={theme}
                        />
                        <TextInputField
                            label="Units Lost"
                            name="unitsLost"
                            value={selectedStock?.unitsLost ? String(selectedStock.unitsLost) : ''}
                            onChange={handleChange}
                            type="number"
                            theme={theme}
                        />
                        <TextInputField
                            label="Buying Price Per Unit"
                            name="buyingPricePerUnit"
                            value={selectedStock?.buyingPricePerUnit ? String(selectedStock.buyingPricePerUnit) : ''}
                            onChange={handleChange}
                            type="number"
                            theme={theme}
                        />
                        <TextInputField
                            label="Selling Price Per Unit"
                            name="sellingPricePerUnit"
                            value={selectedStock?.sellingPricePerUnit ? String(selectedStock.sellingPricePerUnit) : ''}
                            onChange={handleChange}
                            type="number"
                            theme={theme}
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Update Stock'}
                        </Button>
                    </form>
                </Modal>
            )}

            {isDeleteModalOpen && (
                <Modal onClose={() => setIsDeleteModalOpen(false)} open={isDeleteModalOpen} theme={theme}>
                    <div>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this stock item?</p>
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

export default ManageInventory;