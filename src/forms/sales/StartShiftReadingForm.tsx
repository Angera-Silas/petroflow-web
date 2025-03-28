/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { getRequest, postRequest } from '../../utils/api';
import NotificationPopup from '../../components/popups/NotificationPopup';
import Button from '../../components/buttons/Button';
import TextInputField from '../../components/inputs/TextInputField';
import SelectInputField from '../../components/inputs/SelectInputField';

interface StartShiftReadingFormProps {
    theme: string;
    organizationId: number;
    facilityId: number;
    userName: string; // Name of the person sending the request
}

const formatDate = (date: Date): string => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const StartShiftReadingForm: React.FC<StartShiftReadingFormProps> = ({ theme, organizationId, facilityId, userName }) => {
    const [formData, setFormData] = useState({
        organizationId: organizationId,
        facilityId: facilityId,
        sellPointId: '',
        shiftId: '',
        startReading: '',
        readingDate: new Date().toISOString(),
        createdAt: formatDate(new Date()).toString(),
        createdBy: userName,
        status: 'ACTIVE'
    });


    const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [loading, setLoading] = useState(false);
    const [shifts, setShifts] = useState<any[]>([]); // Ensure shifts is an array
    const [sellPoints, setSellPoints] = useState<any[]>([]); // Ensure sellPoints is an array

    const [readings, setReadings] = useState<any[]>([]); // Store fetched readings

    useEffect(() => {
        // Fetch active shifts
        const fetchActiveShifts = async () => {
            try {
                const response = await getRequest('/shifts/get/active');
                setShifts(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error('Error fetching active shifts:', error);
            }
        };

        // Fetch sell points by facilityId
        const fetchSellPoints = async () => {
            try {
                const response = await getRequest(`/sellpoints/get/byfacility/${facilityId}`);
                setSellPoints(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error('Error fetching sell points:', error);
            }
        };

        fetchActiveShifts();
        fetchSellPoints();
    }, [facilityId]);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);
    
        // Validate required fields
        if (!formData.shiftId || !formData.sellPointId || !formData.startReading) {
            setNotification({
                title: 'Error',
                message: 'Please fill in all required fields.',
                type: 'error'
            });
            setLoading(false);
            return;
        }
    
        // Check for duplicate readings
        const isDuplicate = readings.some(
            (reading) =>
                reading.readingDate === formData.readingDate &&
                reading.shiftId === formData.shiftId &&
                reading.sellPointId === formData.sellPointId
        );
    
        if (isDuplicate) {
            setNotification({
                title: 'Error',
                message: 'A reading with the same date, shift, and sell point already exists.',
                type: 'error'
            });
            setLoading(false);
            return;
        }
    
        try {
            // Submit the form
            await postRequest('/pump-meter-readings/add', formData);
    
            setNotification({
                title: 'Success',
                message: 'Start reading recorded successfully!',
                type: 'success'
            });
    
            // Reset form after successful submission
            setFormData({
                ...formData,
                sellPointId: '',
                shiftId: '',
                startReading: '',
            });
        } catch (error) {
            setNotification({
                title: 'Error',
                message: (error as Error).message || 'Failed to record start reading',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };
    const formBgStyle = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black';

    return (
        <div className={`max-w-3xl mx-auto p-6 shadow-lg rounded-lg ${formBgStyle}`}>
            <h2 className="text-2xl font-semibold mb-4">Record Start Meter Reading</h2>

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
                        label="Shift"
                        name="shiftId"
                        value={formData.shiftId}
                        onChange={handleChange}
                        options={shifts.map((shift: any) => ({ label: shift.type, value: shift.id }))}
                        theme={theme}
                    />
                    <SelectInputField
                        label="Sell Point"
                        name="sellPointId"
                        value={formData.sellPointId}
                        onChange={handleChange}
                        options={sellPoints.map((sellPoint: any) => ({ label: sellPoint.name, value: sellPoint.id }))}
                        theme={theme}
                    />
                    <TextInputField
                        label="Start Reading"
                        name="startReading"
                        value={formData.startReading}
                        onChange={handleChange}
                        type="number"
                        placeholder="Enter Start Reading"
                        theme={theme}
                    />
                    
                    <TextInputField
                        label="Created By"
                        name="createdBy"
                        value={formData.createdBy}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Created By"
                        theme={theme}
                        readonly={true}
                    />
                    
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Record Start Reading'}
                </Button>
            </form>
        </div>
    );
};

export default StartShiftReadingForm;