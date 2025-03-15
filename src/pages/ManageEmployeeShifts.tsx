import React, { useState, useEffect } from 'react';
import { getRequest, deleteRequest } from '../utils/api';
import NotificationPopup from '../components/popups/NotificationPopup';
import Button from '../components/buttons/Button';
import CreateEmployeeShiftForm from '../forms/employee/CreateEmployeeShift';
import ReusableTable from '../components/tables/ReusableTable';
import Modal from '../components/modals/Modal'; // Assuming you have a Modal component
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface EmployeeShift {
    id: number;
    employeeName: string;
    shiftStart: string;
    shiftEnd: string;
    shiftType: string;
    facilityId: number;
    employeeNo: string;
}

interface ManageEmployeeShiftsProps {
    theme: string;
}

const ManageEmployeeShifts: React.FC<ManageEmployeeShiftsProps> = ({ theme }) => {
    const [employeeShifts, setEmployeeShifts] = useState<EmployeeShift[]>([]);
    const [selectedEmployeeShift, setSelectedEmployeeShift] = useState<EmployeeShift | null>(null);
    const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeShiftToDelete, setEmployeeShiftToDelete] = useState<EmployeeShift | null>(null);
    const user = useSelector((state: RootState) => state.user);

    const organizationId = user.organizationId ? String(user.organizationId) : '';
    const facilityId = user.facilityId ? String(user.facilityId) : '';

    useEffect(() => {
        if (facilityId) {
            const fetchEmployeeShifts = async () => {
                try {
                    const response = await getRequest(`/shifts/get/byfacility/${facilityId}`);
                    setEmployeeShifts(response);
                } catch (error) {
                    console.error('Error fetching employee shifts:', error);
                }
            };

            fetchEmployeeShifts();
        }
    }, [facilityId]);

    const handleDelete = async () => {
        if (!employeeShiftToDelete) return;
        setLoading(true);
        setNotification(null);

        try {
            await deleteRequest(`/shifts/delete/${employeeShiftToDelete.id}`);
            setEmployeeShifts(employeeShifts.filter(shift => shift.id !== employeeShiftToDelete.id));
            setNotification({
                title: 'Success',
                message: 'Employee shift deleted successfully!',
                type: 'success'
            });
            setIsDeleteModalOpen(false);
        } catch (error) {
            setNotification({
                title: 'Error',
                message: (error as Error).message || 'Failed to delete employee shift',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (shift: EmployeeShift) => {
        setSelectedEmployeeShift(shift);
        setIsModalOpen(true);
    };

    const handleFormSubmit = () => {
        setSelectedEmployeeShift(null);
        setIsModalOpen(false);
        if (facilityId) {
            const fetchEmployeeShifts = async () => {
                try {
                    const response = await getRequest(`/shifts/get/byfacility/${facilityId}`);
                    setEmployeeShifts(response);
                } catch (error) {
                    console.error('Error fetching employee shifts:', error);
                }
            };

            fetchEmployeeShifts();
        }
    };

    const columns = [
        { key: 'employeeName', label: 'Employee Name' },
        { key: 'shiftStart', label: 'Shift Start' },
        { key: 'shiftEnd', label: 'Shift End' },
        { key: 'shiftType', label: 'Shift Type' },
        {
            key: 'actions',
            label: 'Actions',
            render: (row: EmployeeShift) => (
                <>
                    <Button onClick={() => handleEdit(row)}>Edit</Button>
                    <Button onClick={() => { setEmployeeShiftToDelete(row); setIsDeleteModalOpen(true); }} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </>
            )
        }
    ];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Employee Shifts</h1>

            {notification && (
                <NotificationPopup
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <Button onClick={() => setIsModalOpen(true)}>Add New Employee Shift</Button>

            <ReusableTable
                columns={columns}
                data={employeeShifts}
                onRowSelect={() => {}}
                theme={theme}
                itemsPerPage={10}
                visibleColumns={columns}
                onColumnVisibilityChange={() => {}}
                rowKey="id"
            />

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} open={isModalOpen} theme={theme}>
                    <CreateEmployeeShiftForm
                        theme={theme}
                        organizationId={organizationId}
                        facilityId={facilityId}
                        employeeShift={selectedEmployeeShift}
                        onSubmit={handleFormSubmit}
                    />
                </Modal>
            )}

            {isDeleteModalOpen && (
                <Modal onClose={() => setIsDeleteModalOpen(false)} open={isDeleteModalOpen} theme={theme}>
                    <div>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this employee shift?</p>
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

export default ManageEmployeeShifts;