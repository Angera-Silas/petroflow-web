import React, { useState, useEffect } from 'react';
import { getRequest, deleteRequest } from '../utils/api';
import NotificationPopup from '../components/popups/NotificationPopup';
import Button from '../components/buttons/Button';
import CreateSellPointForm from '../forms/sales/CreateSellPoint';
import ReusableTable from '../components/tables/ReusableTable';
import Modal from '../components/modals/Modal';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface SellPointProps {
    theme: string;
}

interface SellPoint {
    id: number;
    facilityId: number;
    name: string;
    description: string;
    type: string;
}

const SellPoints: React.FC<SellPointProps> = ({ theme }) => {
    const [sellPoints, setSellPoints] = useState<SellPoint[]>([]);
    const [selectedSellPoint, setSelectedSellPoint] = useState<SellPoint | null>(null);
    const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const user = useSelector((state: RootState) => state.user);
    const facilityId = user.facilityId ? Number(user.facilityId) : 0;

    useEffect(() => {
        if (facilityId) {
            const fetchSellPoints = async () => {
                try {
                    const response = await getRequest(`/sellpoints/get/byfacility/${facilityId}`);
                    setSellPoints(response);
                } catch (error) {
                    console.error('Error fetching sell points:', error);
                }
            };

            fetchSellPoints();
        }
    }, [facilityId]);

    const handleDelete = async () => {
        if (!selectedSellPoint) return;
        setLoading(true);
        setNotification(null);

        try {
            await deleteRequest(`/sellpoints/delete/${selectedSellPoint.id}`);
            setSellPoints(sellPoints.filter(sellPoint => sellPoint.id !== selectedSellPoint.id));
            setNotification({
                title: 'Success',
                message: 'Sell point deleted successfully!',
                type: 'success'
            });
            setIsDeleteModalOpen(false);
        } catch (error) {
            setNotification({
                title: 'Error',
                message: (error as Error).message || 'Failed to delete sell point',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (sellPoint: SellPoint) => {
        setSelectedSellPoint(sellPoint);
        setIsModalOpen(true);
    };

    const handleFormSubmit = () => {
        setSelectedSellPoint(null);
        setIsModalOpen(false);
        if (facilityId) {
            const fetchSellPoints = async () => {
                try {
                    const response = await getRequest(`/sellpoints/get/byfacility/${facilityId}`);
                    setSellPoints(response);
                } catch (error) {
                    console.error('Error fetching sell points:', error);
                }
            };

            fetchSellPoints();
        }
    };

    const actions = [
        {
            label: 'Edit',
            onClick: (row: SellPoint) => handleEdit(row),
        },
        {
            label: 'Delete',
            onClick: (row: SellPoint) => {
                setSelectedSellPoint(row);
                setIsDeleteModalOpen(true);
            },
        },
    ];

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'type', label: 'Type' },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6">Manage Sell Points</h1>
                <Button onClick={() => setIsModalOpen(true)}>Add New Sell Point</Button>
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
                data={sellPoints}
                onRowSelect={(selectedIds) => {
                    const selectedId = selectedIds[0];
                    const selected = sellPoints.find((sp) => sp.id === Number(selectedId)) || null;
                    setSelectedSellPoint(selected);
                }}
                theme={theme}
                itemsPerPage={10}
                visibleColumns={columns}
                onColumnVisibilityChange={() => { }}
                rowKey="id"
                selectionMode="single" // Enable single selection mode
                actions={actions} // Pass actions to the table
            />

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} open={isModalOpen} theme={theme}>
                    <CreateSellPointForm
                        theme={theme}
                        facilityId={facilityId}
                        sellPoint={selectedSellPoint}
                        onSubmit={handleFormSubmit}
                    />
                </Modal>
            )}

            {isDeleteModalOpen && (
                <Modal onClose={() => setIsDeleteModalOpen(false)} open={isDeleteModalOpen} theme={theme}>
                    <div>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this sell point?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleDelete} disabled={loading}>
                                {loading ? 'Deleting...' : 'Delete Sell Point'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default SellPoints;