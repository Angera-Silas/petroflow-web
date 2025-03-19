import React, { useState, useEffect } from 'react';
import { getRequest, putRequest } from '../../utils/api';
import NotificationPopup from '../../components/popups/NotificationPopup';
import Button from '../../components/buttons/Button';
import TextInputField from '../../components/inputs/TextInputField';

interface EndShiftReadingFormProps {
    theme: string;
    organizationId: number;
    facilityId: number;
    sellPointId: number;
    shiftId: number;
    userName: string; // Name of the person sending the request
}

const EndShiftReadingForm: React.FC<EndShiftReadingFormProps> = ({ theme, organizationId, facilityId, sellPointId, shiftId, userName }) => {
    const [formData, setFormData] = useState({
        organizationId: organizationId,
        facilityId: facilityId,
        sellPointId: sellPointId,
        shiftId: shiftId,
        startReading: '',
        endReading: '',
        readingDate: '',
        createdBy: '',
        updatedBy: userName,
        status: 'CLOSED',
        totalVolume: ''
    });

    const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch the start reading data
        const fetchStartReading = async () => {
            try {
                const response = await getRequest(`/pump-meter-readings/get/${organizationId}/${facilityId}/${sellPointId}/${shiftId}`);
                setFormData((prev) => ({ ...prev, ...response }));
            } catch (error) {
                console.error('Error fetching start reading:', error);
            }
        };

        fetchStartReading();
    }, [organizationId, facilityId, sellPointId, shiftId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);

        try {
            // Calculate total volume
            const totalVolume = (parseFloat(formData.endReading) - parseFloat(formData.startReading)).toString();
            const updatedFormData = { ...formData, totalVolume };

            // Handle form submission logic here
            await putRequest(`/pump-meter-readings/update/${updatedFormData.shiftId}`, updatedFormData);

            setNotification({
                title: 'Success',
                message: 'End reading recorded successfully!',
                type: 'success'
            });
        } catch (error) {
            setNotification({
                title: 'Error',
                message: (error as Error).message || 'Failed to record end reading',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const formBgStyle = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black';

    return (
        <div className={`max-w-3xl mx-auto p-6 shadow-lg rounded-lg ${formBgStyle}`}>
            <h2 className="text-2xl font-semibold mb-4">Record End Meter Reading</h2>

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
                    <TextInputField
                        label="Start Reading"
                        name="startReading"
                        value={formData.startReading}
                        onChange={handleChange}
                        type="number"
                        placeholder="Enter Start Reading"
                        theme={theme}
                        readonly={true}
                    />
                    <TextInputField
                        label="End Reading"
                        name="endReading"
                        value={formData.endReading}
                        onChange={handleChange}
                        type="number"
                        placeholder="Enter End Reading"
                        theme={theme}
                    />
                    <TextInputField
                        label="Reading Date"
                        name="readingDate"
                        value={formData.readingDate}
                        onChange={handleChange}
                        type="datetime-local"
                        theme={theme}
                        readonly={true}
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
                    <TextInputField
                        label="Updated By"
                        name="updatedBy"
                        value={userName}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Updated By"
                        theme={theme}
                        readonly={true}
                    />
                    <TextInputField
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Status"
                        theme={theme}
                    />
                    <TextInputField
                        label="Total Volume"
                        name="totalVolume"
                        value={formData.totalVolume}
                        onChange={handleChange}
                        type="number"
                        placeholder="Enter Total Volume"
                        theme={theme}
                        readonly={true}
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Record End Reading'}
                </Button>
            </form>
        </div>
    );
};

export default EndShiftReadingForm;