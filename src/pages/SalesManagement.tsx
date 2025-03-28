import React, { useState, useEffect, useMemo } from 'react';
import { getRequest, deleteRequest, putRequest } from '../utils/api';
import ReusableTable from '../components/tables/ReusableTable';
import Button from '../components/buttons/Button';
import Modal from '../components/modals/Modal';
import NotificationPopup from '../components/popups/NotificationPopup';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface Sale {
    id: number;
    dateTime: string;
    productId: number;
    productName: string;
    employeeNo: string;
    sellPointId: number;
    sellingPoints: string;
    shiftId: number;
    shiftType: string;
    unitsSold: string;
    amountBilled: number;
    discount: number;
    amountPaid: number;
    paymentMethod: string;
    paymentStatus: string;
    balance: number;
    status: string;
}

interface Column {
    key: string;
    label: string;
    resizable?: boolean;
}

interface Action<T> {
    label: string;
    onClick: (row: T) => void;
}

interface SalesManagementProps {
    theme: string;
}

const SalesManagement: React.FC<SalesManagementProps> = ({ theme }) => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<string>('');
    const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [loading, setLoading] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<Column[]>([]);
    const user = useSelector((state: RootState) => state.user);

    const facilityId = user.facilityId ? Number(user.facilityId) : 0;

    const columns: Column[] = React.useMemo(
        () => [
            { key: 'dateTime', label: 'Date & Time', resizable: true },
            { key: 'productName', label: 'Product Name', resizable: true },
            { key: 'employeeNo', label: 'Employee No', resizable: true },
            { key: 'sellingPoints', label: 'Selling Points', resizable: true },
            { key: 'unitsSold', label: 'Units Sold', resizable: true },
            { key: 'amountBilled', label: 'Amount Billed', resizable: true },
            { key: 'discount', label: 'Discount', resizable: true },
            { key: 'amountPaid', label: 'Amount Paid', resizable: true },
            { key: 'balance', label: 'Balance', resizable: true },
            { key: 'status', label: 'Status', resizable: true },
        ],
        []
    );



    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await getRequest(`/sales/get/facility/${facilityId}`);
                setSales(response);
            } catch (error) {
                console.error('Error fetching sales:', error);
            }
        };

        fetchSales();
    }, [facilityId]);

    const handleApprove = async (sale: Sale) => {
        setLoading(true);
        setNotification(null);

        try {
            await putRequest(`/sales/update/${sale.id}`, { ...sale, status: 'Approved' });
            setSales(sales.map((s) => (s.id === sale.id ? { ...s, status: 'Approved' } : s)));


            const stockUpdate = sale.unitsSold; // Extract only the unitsSold value

            await putRequest(`/stocks/update/levels/${sale.productId}`, stockUpdate);
            setNotification({
                title: 'Success',
                message: 'Sale approved successfully!',
                type: 'success',
            });

        } catch (error) {
            setNotification({
                title: 'Error',
                message: 'Failed to approve sale',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedSale) return;
        setLoading(true);
        setNotification(null);

        try {
            await deleteRequest(`/sales/delete/${selectedSale.id}`);
            setSales(sales.filter((sale) => sale.id !== selectedSale.id));
            setNotification({
                title: 'Success',
                message: 'Sale deleted successfully!',
                type: 'success',
            });
            setIsModalOpen(false);
        } catch (error) {
            setNotification({
                title: 'Error',
                message: 'Failed to delete sale',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (sale: Sale) => {
        setSelectedSale(sale);
        setModalType('edit');
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (updatedSale: Sale) => {
        setLoading(true);
        setNotification(null);

        try {
            await putRequest(`/sales/update/${updatedSale.id}`, updatedSale);
            setSales(sales.map((s) => (s.id === updatedSale.id ? updatedSale : s)));
            setNotification({
                title: 'Success',
                message: 'Sale updated successfully!',
                type: 'success',
            });
            setIsModalOpen(false);
        } catch (error) {
            setNotification({
                title: 'Error',
                message: 'Failed to update sale',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setVisibleColumns(columns);
    }, [columns]);


    const handleColumnVisibilityChange = (col: Column) => {
        setVisibleColumns((prev) => {
            if (prev.includes(col)) {
                return prev.filter((c) => c.key !== col.key);
            } else {
                const updatedColumns = [...prev];
                const originalIndex = columns.findIndex((c) => c.key === col.key);
                updatedColumns.splice(originalIndex, 0, col);
                return updatedColumns;
            }
        });
    };

    const actions: Action<Sale>[] = [
        {
            label: 'Approve',
            onClick: (row: Sale) => handleApprove(row),
        },
        {
            label: 'Edit',
            onClick: (row: Sale) => handleEdit(row),
        },
        {
            label: 'Delete',
            onClick: (row: Sale) => {
                setSelectedSale(row);
                setModalType('delete');
                setIsModalOpen(true);
            },
        },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold mb-4">Sales Management</h2>
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
                data={sales}
                onRowSelect={(selectedIds) => setSelectedSale(sales.find((sale) => sale.id === Number(selectedIds[0])) || null)}
                theme={theme}
                itemsPerPage={10}
                visibleColumns={visibleColumns}
                onColumnVisibilityChange={handleColumnVisibilityChange}
                rowKey="id"
                selectionMode="single"
                actions={actions}
            />

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} open={isModalOpen} theme={theme}>
                    {modalType === 'delete' ? (
                        <>
                            <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
                            <p>Are you sure you want to delete the selected sale?</p>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleDelete} disabled={loading}>
                                    {loading ? 'Deleting...' : 'Confirm'}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <EditSaleForm
                            sale={selectedSale!}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    )}
                </Modal>
            )}
        </div>
    );
};

interface EditSaleFormProps {
    sale: Sale;
    onSubmit: (updatedSale: Sale) => void;
    onCancel: () => void;
}

const EditSaleForm: React.FC<EditSaleFormProps> = ({ sale, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Sale>(sale);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'amountBilled' || name === 'amountPaid' || name === 'balance' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Edit Sale</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2">Product Name</label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="w-full border p-2"
                    />
                </div>
                <div>
                    <label className="block mb-2">Units Sold</label>
                    <input
                        type="text"
                        name="unitsSold"
                        value={formData.unitsSold}
                        onChange={handleChange}
                        className="w-full border p-2"
                    />
                </div>
                <div>
                    <label className="block mb-2">Amount Billed</label>
                    <input
                        type="number"
                        name="amountBilled"
                        value={formData.amountBilled}
                        onChange={handleChange}
                        className="w-full border p-2"
                    />
                </div>
                <div>
                    <label className="block mb-2">Amount Paid</label>
                    <input
                        type="number"
                        name="amountPaid"
                        value={formData.amountPaid}
                        onChange={handleChange}
                        className="w-full border p-2"
                    />
                </div>
                <div>
                    <label className="block mb-2">Balance</label>
                    <input
                        type="number"
                        name="balance"
                        value={formData.balance}
                        onChange={handleChange}
                        className="w-full border p-2"
                    />
                </div>
                <div>
                    <label className="block mb-2">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border p-2"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save</Button>
            </div>
        </form>
    );
};

export default SalesManagement;