import React, { useState, useEffect } from 'react';
import { getRequest, deleteRequest } from '../utils/api';
import ReusableTable from '../components/tables/ReusableTable';
import Button from '../components/buttons/Button';
import Modal from '../components/modals/Modal';
import StartShiftReadingForm from '../forms/sales/StartShiftReadingForm';
import EndShiftReadingForm from '../forms/sales/EndShiftReadingForm';
import NotificationPopup from '../components/popups/NotificationPopup';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface Reading {
    id: number;
    readingDate: string;
    shiftType: string;
    sellPointName: string;
    startReading: number;
    endReading: number;
    totalVolume: number;
    status: string;
    sellPointId: number;
    shiftId: number;
}

interface Column {
    key: string;
    label: string;
    resizable?: boolean;
    render?: (row: Reading) => React.ReactNode;
}

interface PumpManagementProps {
    theme: string;
}

const PumpManagement: React.FC<PumpManagementProps> = ({ theme }) => {
    const [readings, setReadings] = useState<Reading[]>([]);
    const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [loading, setLoading] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<Column[]>([]);
    const user = useSelector((state: RootState) => state.user);

    const orgId = user.organizationId ? Number(user.organizationId) : 0;
    const facilityId = user.facilityId ? Number(user.facilityId) : 0;
    const name = user.name || '';

    const columns: Column[] = React.useMemo(() => [
        { key: 'readingDate', label: 'Reading Date', resizable: true },
        { key: 'shiftType', label: 'Shift', resizable: true },
        { key: 'sellPointName', label: 'Sell Point', resizable: true },
        { key: 'startReading', label: 'Start Reading', resizable: true },
        { key: 'endReading', label: 'End Reading', resizable: true },
        { key: 'totalVolume', label: 'Total Volume', resizable: true },
        { key: 'status', label: 'Status', resizable: true }
    ], []);

    useEffect(() => {
        // Fetch meter readings
        const fetchReadings = async () => {
            try {
                const response = await getRequest(`/pump-meter-readings/get/meter-reading/facility/${facilityId}`);
                setReadings(response); // Directly set the response as readings
            } catch (error) {
                console.error('Error fetching meter readings:', error);
            }
        };

        fetchReadings();
    }, [facilityId]);

    useEffect(() => {
        // Set all columns as visible by default
        setVisibleColumns(columns);
    }, [columns]);

    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };

    const handleUpdateClick = () => {
        setIsUpdateModalOpen(true);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedReading) return;

        setLoading(true);
        setNotification(null);

        try {
            await deleteRequest(`/pump-meter-readings/delete/${selectedReading.id}`);
            setNotification({
                title: 'Success',
                message: 'Reading deleted successfully!',
                type: 'success'
            });
            setReadings(readings.filter((reading) => reading.id !== selectedReading.id));
            setIsDeleteModalOpen(false);
            setSelectedReading(null);
        } catch (error) {
            setNotification({
                title: 'Error',
                message: (error as Error).message || 'Failed to delete reading',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleColumnVisibilityChange = (col: Column) => {
        setVisibleColumns((prev) => {
            if (prev.includes(col)) {
                // Remove column
                return prev.filter((c) => c.key !== col.key);
            } else {
                // Add column back in its original position
                const updatedColumns = [...prev];
                const originalIndex = columns.findIndex((c) => c.key === col.key);
                updatedColumns.splice(originalIndex, 0, col);
                return updatedColumns;
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold mb-4">Pump Management</h2>
                <div className="flex space-x-4 mt-4">
                    <Button onClick={handleAddClick}>Add</Button>
                    {selectedReading && (
                        <>
                            <Button onClick={handleUpdateClick}>Update</Button>
                            <Button onClick={handleDeleteClick}>Delete</Button>
                        </>
                    )}
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
                data={readings}
                onRowSelect={(selectedIds: string[]) => {
                    console.log('Selected IDs:', selectedIds); // Debugging: Log selected IDs
                    const selected = readings.find((reading) => reading.id.toString() === selectedIds[0]);
                    console.log('Selected Reading:', selected); // Debugging: Log selected reading
                    setSelectedReading(selected || null);
                }}
                theme={theme}
                itemsPerPage={10}
                visibleColumns={visibleColumns}
                onColumnVisibilityChange={handleColumnVisibilityChange}
                rowKey="id" // Ensure this matches the `id` field in the data
            />

            {isAddModalOpen && (
                <Modal onClose={() => setIsAddModalOpen(false)} open={isAddModalOpen} theme={theme}>
                    <StartShiftReadingForm
                        theme={theme}
                        organizationId={orgId}
                        facilityId={facilityId}
                        userName={name}
                    />
                </Modal>
            )}

            {isUpdateModalOpen && selectedReading && (
                <Modal onClose={() => setIsUpdateModalOpen(false)} open={isUpdateModalOpen} theme={theme}>
                    <EndShiftReadingForm
                        theme={theme}
                        organizationId={orgId}
                        facilityId={facilityId}
                        sellPointId={selectedReading.sellPointId}
                        shiftId={selectedReading.shiftId}
                        userName={name}
                    />
                </Modal>
            )}

            {isDeleteModalOpen && (
                <Modal onClose={() => setIsDeleteModalOpen(false)} open={isDeleteModalOpen} theme={theme}>
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete this reading?</p>
                        <div className="flex space-x-4 mt-4">
                            <Button onClick={handleDeleteConfirm} disabled={loading}>
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

export default PumpManagement;