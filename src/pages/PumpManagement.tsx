import React, { useState, useEffect } from 'react';
import { getRequest, deleteRequest } from '../utils/api';
import ReusableTable from '../components/tables/ReusableTable';
import Button from '../components/buttons/Button';
import Modal from '../components/modals/Modal';
import EndShiftReadingForm from '../forms/sales/EndShiftReadingForm';
import NotificationPopup from '../components/popups/NotificationPopup';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import StartShiftReadingForm from '../forms/sales/StartShiftReadingForm';

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
    createdBy: string;
    updatedBy: string;
    createdAt: string;
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

interface PumpManagementProps {
    theme: string;
}

const PumpManagement: React.FC<PumpManagementProps> = ({ theme }) => {
    const [readings, setReadings] = useState<Reading[]>([]);
    const [selectedRow, setSelectedRow] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<string>('');
    const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [loading, setLoading] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<Column[]>([]);
    const user = useSelector((state: RootState) => state.user);
    const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
    const [readingToDelete, setReadingToDelete] = useState<Reading | null>(null);

    const orgId = user.organizationId ? Number(user.organizationId) : 0;
    const facilityId = user.facilityId ? Number(user.facilityId) : 0;

    useEffect(() => {
        const fetchReadings = async () => {
            try {
                const response = await getRequest(`/pump-meter-readings/get/meter-reading/facility/${facilityId}`);
                setReadings(response);
            } catch (error) {
                console.error('Error fetching meter readings:', error);
            }
        };

        fetchReadings();
    }, [facilityId]);

    const handleRecordReading = () => {
        setModalType('record');
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!readingToDelete) return;
        setLoading(true);
        setNotification(null);

        try {
            await deleteRequest(`/pump-meter-readings/delete/${readingToDelete.id}`);
            setReadings(readings.filter((reading) => reading.id !== readingToDelete.id));
            setNotification({
                title: 'Success',
                message: 'Reading deleted successfully!',
                type: 'success',
            });
            setIsModalOpen(false);
        } catch (error) {
            setNotification({
                title: 'Error',
                message: 'Failed to delete reading',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (reading: Reading) => {
        setSelectedReading(reading);
        setModalType('edit');
        setIsModalOpen(true);
    };

    const handleFormSubmit = () => {
        setSelectedReading(null);
        setIsModalOpen(false);
        const fetchReadings = async () => {
            try {
                const response = await getRequest(`/pump-meter-readings/get/meter-reading/facility/${facilityId}`);
                setReadings(response);
            } catch (error) {
                console.error('Error fetching readings:', error);
            }
        };

        fetchReadings();
    };

    const actions: Action<Reading>[] = [
        {
            label: 'Edit',
            onClick: (row: Reading) => {
                handleEdit(row);
            },
        },
        {
            label: 'Delete',
            onClick: (row: Reading) => {
                setReadingToDelete(row);
                setModalType('delete');
                setIsModalOpen(true);
            },
        },
    ];

    const columns: Column[] = React.useMemo(
        () => [
            { key: 'readingDate', label: 'Reading Date', resizable: true },
            { key: 'shiftType', label: 'Shift', resizable: true },
            { key: 'sellPointName', label: 'Sell Point', resizable: true },
            { key: 'startReading', label: 'Start Reading', resizable: true },
            { key: 'endReading', label: 'End Reading', resizable: true },
            { key: 'totalVolume', label: 'Total Volume', resizable: true },
            { key: 'status', label: 'Status', resizable: true },
        ],
        []
    );

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

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold mb-4">Pump Management</h2>
                <div className="flex gap-4">
                    <Button onClick={handleRecordReading}>Record Reading</Button>
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
                onRowSelect={(selectedIds) => setSelectedRow(selectedIds[0] || null)}
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
                            <p>Are you sure you want to delete the selected reading?</p>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleDelete} disabled={loading}>
                                    {loading ? 'Deleting...' : 'Confirm'}
                                </Button>
                            </div>
                        </>
                    ) : modalType === 'record' ? (
                        <StartShiftReadingForm
                            theme={theme}
                            organizationId={orgId}
                            facilityId={facilityId}
                            userName={user.name || 'Unknown User'}
                        />
                    ) : (
                        <EndShiftReadingForm
                            theme={theme}
                            selectedReading={{
                                ...selectedReading!,
                                startReading: selectedReading!.startReading.toString(),
                                endReading: selectedReading!.endReading.toString(),
                                totalVolume: selectedReading!.totalVolume.toString(),
                            }}
                            userName={user.name || 'Unknown User'}
                        />
                    )}
                </Modal>
            )}
        </div>
    );
};

export default PumpManagement;