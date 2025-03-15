import React, { useState, useEffect } from 'react';
import { getRequest, deleteRequest } from '../utils/api';
import NotificationPopup from '../components/popups/NotificationPopup';
import Button from '../components/buttons/Button';
import CreateSellPointForm from '../forms/sales/CreateSellPoint';
import ReusableTable from '../components/tables/ReusableTable';
import Modal from '../components/modals/Modal'; // Assuming you have a Modal component
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
    const [sellPointToDelete, setSellPointToDelete] = useState<SellPoint | null>(null);

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
        if (!sellPointToDelete) return;
        setLoading(true);
        setNotification(null);

        try {
            await deleteRequest(`/sellpoints/delete/${sellPointToDelete.id}`);
            setSellPoints(sellPoints.filter(sellPoint => sellPoint.id !== sellPointToDelete.id));
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

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'type', label: 'Type' },
        {
            key: 'actions',
            label: 'Actions',
            render: (row: SellPoint) => (
                <>
                    <Button onClick={() => handleEdit(row)}>Edit</Button>
                    <Button onClick={() => { setSellPointToDelete(row); setIsDeleteModalOpen(true); }} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </>
            )
        }
    ];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Sell Points</h1>

            {notification && (
                <NotificationPopup
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <Button onClick={() => setIsModalOpen(true)}>Add New Sell Point</Button>

            <ReusableTable
                columns={columns}
                data={sellPoints}
                onRowSelect={() => {}}
                theme={theme}
                itemsPerPage={10}
                visibleColumns={columns}
                onColumnVisibilityChange={() => {}}
                rowKey="id"
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

export default SellPoints;