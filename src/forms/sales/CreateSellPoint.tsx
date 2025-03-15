import React, { useState, useEffect } from 'react';
import { postRequest, putRequest } from '../../utils/api';
import NotificationPopup from '../../components/popups/NotificationPopup';
import Button from '../../components/buttons/Button';
import TextInputField from '../../components/inputs/TextInputField';
import SelectInputField from '../../components/inputs/SelectInputField';

enum SellPointType {
    GARAGE = 'GARAGE',
    PUMP_SUPER_DIESEL_PETROL = 'PUMP_SUPER_DIESEL_PETROL',
    GAS_STATION = 'GAS_STATION',
    OIL_SHOP = 'OIL_SHOP',
    CAR_WASH = 'CAR_WASH',
    FOOD_AND_BEVARAGES = 'FOOD_AND_BEVARAGES',
    PRESSURE_REFILLING = 'PRESSURE_REFILLING',
    OTHER = 'OTHER'
}

interface CreateSellPointFormProps {
    theme: string;
    facilityId: number;
    sellPoint?: SellPoint | null;
    onSubmit: () => void;
}

interface SellPoint {
    id: number;
    facilityId: number;
    name: string;
    description: string;
    type: string;
}

const CreateSellPointForm: React.FC<CreateSellPointFormProps> = ({ theme, facilityId, sellPoint, onSubmit }) => {
    const [formData, setFormData] = useState({
        facilityId: facilityId,
        name: '',
        description: '',
        type: SellPointType.GARAGE
    });

    const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (sellPoint) {
            setFormData({
                facilityId: sellPoint.facilityId,
                name: sellPoint.name,
                description: sellPoint.description,
                type: sellPoint.type as SellPointType
            });
        }
    }, [sellPoint]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);

        try {
            if (sellPoint) {
                // Update existing sell point
                await putRequest(`/sellpoints/update/${sellPoint.id}`, formData);
                setNotification({
                    title: 'Success',
                    message: 'Sell point updated successfully!',
                    type: 'success'
                });
            } else {
                // Create new sell point
                await postRequest('/sellpoints/create', formData);
                setNotification({
                    title: 'Success',
                    message: 'Sell point created successfully!',
                    type: 'success'
                });
            }

            onSubmit();
            // Reset form
            setFormData({
                facilityId: facilityId,
                name: '',
                description: '',
                type: SellPointType.GARAGE
            });
        } catch (error) {
            setNotification({
                title: 'Error',
                message: (error as Error).message || 'Failed to save sell point',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const formBgStyle = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black';

    return (
        <div className={`max-w-3xl mx-auto p-6 shadow-lg rounded-lg ${formBgStyle}`}>
            <h2 className="text-2xl font-semibold mb-4">{sellPoint ? 'Edit Sell Point' : 'Create Sell Point'}</h2>

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
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Name"
                        theme={theme}
                    />
                    <TextInputField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Description"
                        theme={theme}
                    />
                    <SelectInputField
                        label="Type"
                        name="type"
                        value={formData.type}
                        theme={theme}
                        onChange={handleChange}
                        options={[
                            { label: 'Garage', value: SellPointType.GARAGE },
                            { label: 'Pump Super Diesel Petrol', value: SellPointType.PUMP_SUPER_DIESEL_PETROL },
                            { label: 'Gas Station', value: SellPointType.GAS_STATION },
                            { label: 'Oil Shop', value: SellPointType.OIL_SHOP },
                            { label: 'Car Wash', value: SellPointType.CAR_WASH },
                            { label: 'Food and Beverages', value: SellPointType.FOOD_AND_BEVARAGES },
                            { label: 'Pressure Refilling', value: SellPointType.PRESSURE_REFILLING },
                            { label: 'Other', value: SellPointType.OTHER }
                        ]}
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : sellPoint ? 'Update Sell Point' : 'Create Sell Point'}
                </Button>
            </form>
        </div>
    );
};

export default CreateSellPointForm;