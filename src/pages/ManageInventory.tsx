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

interface Column {
    key: string;
    label: string;
    resizable?: boolean;
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
    const [visibleColumns, setVisibleColumns] = useState<Column[]>([]);

    const user = useSelector((state: RootState) => state.user);

    const orgId = user.organizationId ? String(user.organizationId) : '';
    const facilityId = user.facilityId ? String(user.facilityId) : '';

    const columns: Column[] = React.useMemo(() => [
        { key: 'dateStocked', label: 'Date Stocked', resizable: true },
        { key: 'productName', label: 'Product Name', resizable: true },
        { key: 'unitsAvailable', label: 'Units Available', resizable: true },
        { key: 'unitsSold', label: 'Units Sold', resizable: true },
        { key: 'unitsBought', label: 'Units Bought', resizable: true },
        { key: 'unitsReturned', label: 'Units Returned', resizable: true },
        { key: 'unitsDamaged', label: 'Units Damaged', resizable: true },
        { key: 'unitsLost', label: 'Units Lost', resizable: true },
        { key: 'buyingPricePerUnit', label: 'Buying Price Per Unit', resizable: true },
        { key: 'sellingPricePerUnit', label: 'Selling Price Per Unit', resizable: true },
    ], []);

    useEffect(() => {
        setVisibleColumns(columns); // Initialize all columns as visible
    }, [columns]);

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

    const handleColumnVisibilityChange = (col: Column) => {
        setVisibleColumns((prev) => {
            if (prev.includes(col)) {
                return prev.filter((c) => c.key !== col.key); // Remove column
            } else {
                const updatedColumns = [...prev];
                const originalIndex = columns.findIndex((c) => c.key === col.key);
                updatedColumns.splice(originalIndex, 0, col); // Restore column to its original position
                return updatedColumns;
            }
        });
    };

    const actions = [
        {
            label: 'Edit',
            onClick: (row: Stock) => handleEdit(row),
        },
        {
            label: 'Delete',
            onClick: (row: Stock) => {
                setSelectedStock(row);
                setIsDeleteModalOpen(true);
            },
        },
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
                onRowSelect={(selectedIds) => {
                    const selectedId = selectedIds[0];
                    const selected = stockItems.find((item) => item.id === Number(selectedId)) || null;
                    setSelectedStock(selected);
                }}
                theme={theme}
                itemsPerPage={10}
                visibleColumns={visibleColumns}
                onColumnVisibilityChange={handleColumnVisibilityChange}
                rowKey="id"
                selectionMode="single" // Enable single selection mode
                actions={actions} // Pass actions to the table
            />

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} open={isModalOpen} theme={theme}>
                    <form onSubmit={handleFormSubmit} className="p-4">
                        <h2 className="text-xl font-bold mb-4">Edit Stock</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <TextInputField
                                label="Units Available"
                                name="unitsAvailable"
                                value={selectedStock?.unitsAvailable ? String(selectedStock.unitsAvailable) : ''}
                                onChange={(e) => setSelectedStock(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null)}
                                type="number"
                                theme={theme}
                            />

                            <TextInputField
                                label="Units Sold"
                                name="unitsSold"
                                value={selectedStock?.unitsSold ? String(selectedStock.unitsSold) : ''}
                                onChange={(e) => setSelectedStock(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null)}
                                type="number"
                                theme={theme}
                            />

                            <TextInputField
                                label="Units Bought"
                                name="unitsBought"
                                value={selectedStock?.unitsBought ? String(selectedStock.unitsBought) : ''}
                                onChange={(e) => setSelectedStock(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null)}
                                type="number"
                                theme={theme}
                            />

                            <TextInputField
                                label="Units Returned"
                                name="unitsReturned"
                                value={selectedStock?.unitsReturned ? String(selectedStock.unitsReturned) : ''}
                                onChange={(e) => setSelectedStock(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null)}
                                type="number"
                                theme={theme}
                            />

                            <TextInputField
                                label="Units Damaged"
                                name="unitsDamaged"
                                value={selectedStock?.unitsDamaged ? String(selectedStock.unitsDamaged) : ''}
                                onChange={(e) => setSelectedStock(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null)}
                                type="number"
                                theme={theme}
                            />

                            <TextInputField
                                label="Units Lost"
                                name="unitsLost"
                                value={selectedStock?.unitsLost ? String(selectedStock.unitsLost) : ''}
                                onChange={(e) => setSelectedStock(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null)}
                                type="number"
                                theme={theme}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Submitting...' : 'Update Stock'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}

            {isDeleteModalOpen && (
                <Modal onClose={() => setIsDeleteModalOpen(false)} open={isDeleteModalOpen} theme={theme}>
                    <div>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this stock item?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleDelete} disabled={loading}>
                                {loading ? 'Deleting...' : 'Confirm'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ManageInventory;