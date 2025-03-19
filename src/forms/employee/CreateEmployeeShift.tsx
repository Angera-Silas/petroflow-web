import React, { useState, useEffect } from 'react';
import { getRequest, postRequest, putRequest } from '../../utils/api';
import NotificationPopup from '../../components/popups/NotificationPopup';
import Button from '../../components/buttons/Button';
import TextInputField from '../../components/inputs/TextInputField';
import SelectInputField from '../../components/inputs/SelectInputField';
import { format } from 'date-fns';

enum ShiftType {
    DAY_SHIFT = 'DAY_SHIFT',
    NIGHT_SHIFT = 'NIGHT_SHIFT',
    A24_HOURS_SHIFT = 'A24_HOURS_SHIFT'
}

interface CreateEmployeeShiftFormProps {
    theme: string;
    organizationId: string;
    facilityId: string;
    employeeShift?: EmployeeShift | null;
    onSubmit: () => void;
}

interface Employee {
    employeeNo: string;
    department: string;
    firstname: string;
    lastname: string;
    role: string;
}

interface EmployeeShift {
    id: number;
    employeeName: string;
    shiftStart: string;
    shiftEnd: string;
    shiftType: string;
    facilityId: number;
    employeeNo: string;
}

interface SellPoint {
    id: number;
    name: string;
}

const CreateEmployeeShiftForm: React.FC<CreateEmployeeShiftFormProps> = ({ theme, organizationId, facilityId, employeeShift, onSubmit }) => {
    const [formData, setFormData] = useState({
        facilityId: Number(facilityId),
        employeeNo: '',
        startDate: '',
        endDate: '',
        type: ShiftType.DAY_SHIFT,
        sellingPoints: [] as string[]
    });

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<string[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [loading, setLoading] = useState(false);
    const [sellPoints, setSellPoints] = useState<SellPoint[]>([]);

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

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response: Employee[] = await getRequest(`/organization-employee/details/get/${organizationId}/facility/${facilityId}`);
                setEmployees(response);

                const uniqueDepartments = Array.from(new Set(response.map((employee: Employee) => employee.department)));
                setDepartments(uniqueDepartments);

                const uniqueRoles = Array.from(new Set(response.map((employee: Employee) => employee.role)));
                setRoles(uniqueRoles);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, [organizationId, facilityId]);

    useEffect(() => {
        if (employeeShift) {
            setFormData({
                facilityId: employeeShift.facilityId,
                employeeNo: employeeShift.employeeNo,
                startDate: employeeShift.shiftStart,
                endDate: employeeShift.shiftEnd,
                type: employeeShift.shiftType as ShiftType,
                sellingPoints: []
            });
        }
    }, [employeeShift]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSellingPointsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData((prev) => ({ ...prev, sellingPoints: selectedOptions }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);

        try {
            const dataToSend = {
                ...formData,
                startDate: format(new Date(formData.startDate), 'yyyy-MM-dd HH:mm:ss'),
                endDate: format(new Date(formData.endDate), 'yyyy-MM-dd HH:mm:ss'),
                sellingPoints: formData.sellingPoints.join(', ')
            };

            if (employeeShift) {
                // Update existing employee shift
                await putRequest(`/shifts/update/${employeeShift.id}`, dataToSend);
                setNotification({
                    title: 'Success',
                    message: 'Employee shift updated successfully!',
                    type: 'success'
                });
            } else {
                // Create new employee shift
                await postRequest('/shifts/add', dataToSend);
                setNotification({
                    title: 'Success',
                    message: 'Employee shift created successfully!',
                    type: 'success'
                });
            }

            onSubmit();
            // Reset form
            setFormData({
                facilityId: Number(facilityId),
                employeeNo: '',
                startDate: '',
                endDate: '',
                type: ShiftType.DAY_SHIFT,
                sellingPoints: []
            });
        } catch (error) {
            setNotification({
                title: 'Error',
                message: (error as Error).message || 'Failed to save employee shift',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(employee =>
        (!selectedDepartment || employee.department === selectedDepartment) &&
        (!selectedRole || employee.role === selectedRole)
    );

    const formBgStyle = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black';

    return (
        <div className={`max-w-3xl mx-auto p-6 shadow-lg rounded-lg ${formBgStyle}`}>
            <h2 className="text-2xl font-semibold mb-4">{employeeShift ? 'Edit Employee Shift' : 'Create Employee Shift'}</h2>

            {notification && (
                <NotificationPopup
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <SelectInputField
                        label="Department"
                        name="department"
                        value={selectedDepartment}
                        theme={theme}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        options={departments.map(department => ({
                            label: department,
                            value: department
                        }))}
                    />
                    <SelectInputField
                        label="Role"
                        name="role"
                        value={selectedRole}
                        theme={theme}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        options={roles.map(role => ({
                            label: role,
                            value: role
                        }))}
                    />
                    <SelectInputField
                        label="Employee"
                        name="employeeNo"
                        value={formData.employeeNo}
                        theme={theme}
                        onChange={(e) => {
                            console.log('Selected Employee No:', e.target.value); // Debugging line
                            handleChange(e);
                        }}
                        options={filteredEmployees.map(employee => ({
                            label: `${employee.firstname} ${employee.lastname}`,
                            value: employee.employeeNo
                        }))}
                    />
                    <SelectInputField
                        label="Selling Points"
                        name="sellingPoints"
                        value={formData.sellingPoints}
                        theme={theme}
                        onChange={handleSellingPointsChange}
                        options={sellPoints.map(sellPoint => ({
                            label: sellPoint.name,
                            value: sellPoint.name
                        }))}
                        multiple={true}
                    />
                    <TextInputField
                        label="Start Date/Time"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        type="datetime-local"
                        theme={theme}
                    />
                    <TextInputField
                        label="End Date/Time"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        type="datetime-local"
                        theme={theme}
                    />
                    <SelectInputField
                        label="Shift Type"
                        name="type"
                        value={formData.type}
                        theme={theme}
                        onChange={handleChange}
                        options={[
                            { label: 'Day Shift', value: ShiftType.DAY_SHIFT },
                            { label: 'Night Shift', value: ShiftType.NIGHT_SHIFT },
                            { label: '24 Hours Shift', value: ShiftType.A24_HOURS_SHIFT }
                        ]}
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : employeeShift ? 'Update Shift' : 'Create Shift'}
                </Button>
            </form>
        </div>
    );
};

export default CreateEmployeeShiftForm;