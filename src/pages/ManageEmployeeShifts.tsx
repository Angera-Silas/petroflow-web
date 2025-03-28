import React, { useState, useEffect } from 'react';
import { getRequest, deleteRequest } from '../utils/api';
import NotificationPopup from '../components/popups/NotificationPopup';
import Button from '../components/buttons/Button';
import CreateEmployeeShiftForm from '../forms/employee/CreateEmployeeShift';
import ReusableTable from '../components/tables/ReusableTable';
import Modal from '../components/modals/Modal';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { format } from 'date-fns';

interface EmployeeShift {
    id: number;
    employeeName: string;
    shiftStart: string;
    shiftEnd: string;
    shiftType: string;
    facilityId: number;
    employeeNo: string;
    sellingPoints: string;
}

interface Column {
    key: string;
    label: string;
    resizable?: boolean;
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
    const [visibleColumns, setVisibleColumns] = useState<Column[]>([]);
    const user = useSelector((state: RootState) => state.user);

    const organizationId = user.organizationId ? String(user.organizationId) : '';
    const facilityId = user.facilityId ? String(user.facilityId) : '';

    const columns: Column[] = React.useMemo(() => [
        { key: 'employeeName', label: 'Employee Name', resizable: true },
        { key: 'shiftStart', label: 'Shift Start', resizable: true },
        { key: 'shiftEnd', label: 'Shift End', resizable: true },
        { key: 'shiftType', label: 'Shift Type', resizable: true },
        { key: 'sellingPoints', label: 'Selling Points', resizable: true },
    ], []);

    useEffect(() => {
        setVisibleColumns(columns); // Initialize all columns as visible
    }, [columns]);

    useEffect(() => {
        if (facilityId) {
            const fetchEmployeeShifts = async () => {
                try {
                    const response = await getRequest(`/shifts/get/facility/${facilityId}`);
                    const formattedResponse = response.map((shift: any) => ({
                        id: shift.shiftId,
                        employeeName: shift.employeeName,
                        shiftStart: shift.startDate,
                        shiftEnd: shift.endDate,
                        shiftType: shift.type,
                        facilityId: shift.facilityId,
                        employeeNo: shift.employeeNo,
                        sellingPoints: shift.sellingPoints
                    }));
                    setEmployeeShifts(formattedResponse);
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
        if (facilityId) {
            const fetchEmployeeShifts = async () => {
                try {
                    const response = await getRequest(`/shifts/get/facility/${facilityId}`);
                    const formattedResponse = response.map((shift: any) => ({
                        id: shift.shiftId,
                        employeeName: shift.employeeName,
                        shiftStart: shift.startDate,
                        shiftEnd: shift.endDate,
                        shiftType: shift.type,
                        facilityId: shift.facilityId,
                        employeeNo: shift.employeeNo,
                        sellingPoints: shift.sellingPoints
                    }));
                    setEmployeeShifts(formattedResponse);
                } catch (error) {
                    console.error('Error fetching employee shifts:', error);
                }
            };

            fetchEmployeeShifts();
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
            onClick: (row: EmployeeShift) => handleEdit(row),
        },
        {
            label: 'Delete',
            onClick: (row: EmployeeShift) => {
                setEmployeeShiftToDelete(row);
                setIsDeleteModalOpen(true);
            },
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Employee Shifts</h1>
                <Button onClick={() => setIsModalOpen(true)}>Add New Employee Shift</Button>
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
                data={employeeShifts}
                onRowSelect={(selectedIds) => {
                    const selectedId = selectedIds[0];
                    const selected = employeeShifts.find((shift) => shift.id === Number(selectedId)) || null;
                    setSelectedEmployeeShift(selected);
                }}
                theme={theme}
                itemsPerPage={10}
                visibleColumns={visibleColumns}
                onColumnVisibilityChange={handleColumnVisibilityChange}
                rowKey="id"
                selectionMode="single"
                actions={actions} // Pass actions to the table
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

export default ManageEmployeeShifts;