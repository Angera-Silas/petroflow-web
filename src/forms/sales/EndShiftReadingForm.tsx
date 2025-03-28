import React, { useState, useEffect } from 'react';
import { putRequest } from '../../utils/api';
import NotificationPopup from '../../components/popups/NotificationPopup';
import Button from '../../components/buttons/Button';
import TextInputField from '../../components/inputs/TextInputField';

interface EndShiftReadingFormProps {
    theme: string;
    selectedReading: {
        id: number;
        readingDate: string;
        shiftType: string;
        sellPointName: string;
        startReading: string;
        endReading: string;
        totalVolume: string;
        status: string;
        sellPointId: number;
        shiftId: number;
        createdBy: string;
        updatedBy: string;
        createdAt: string;
    };
    userName: string; // Name of the person sending the request
}

const formatDate = (date: Date): string => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const EndShiftReadingForm: React.FC<EndShiftReadingFormProps> = ({ theme, selectedReading, userName }) => {
    const [formData, setFormData] = useState({
        ...selectedReading,
        updatedBy: userName,
        updatedAt: formatDate(new Date()).toString(),
        
        status: 'CLOSED',
    });

    const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [loading, setLoading] = useState(false);

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
            const updatedFormData = {
                "id": formData.id,
                "endReading":formData.endReading,
                "startReading": formData.startReading,
                "updatedBy": formData.updatedBy,
                "updatedAt": formData.updatedAt,
                "status": formData.status,
            }

            
            await putRequest(`/pump-meter-readings/record/endreading/${updatedFormData.id}`, updatedFormData);

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
                        label="Shift Type"
                        name="shiftType"
                        value={formData.shiftType}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Shift Type"
                        theme={theme}
                        readonly={true}
                    />
                    <TextInputField
                        label="Sell Point Name"
                        name="sellPointName"
                        value={formData.sellPointName}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Sell Point Name"
                        theme={theme}
                        readonly={true}
                    />
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


                    
                </div>
                <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Record End Reading'}
                </Button>
                </div>
            </form>
        </div>
    );
};

export default EndShiftReadingForm;