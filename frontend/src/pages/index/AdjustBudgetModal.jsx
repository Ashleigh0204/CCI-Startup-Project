import Modal from "../components/Modal/Modal"
import ModalTitle from "../components/Modal/ModalTitle"
import ModalContent from "../components/Modal/ModalContent"
import { useState, useEffect } from "react"

export default function AdjustBudgetModal({onRequestClose, onSubmit, cancel}) {
    const [formData, setFormData] = useState({
        budgetAmount: '',
        timeUnit: 'weekly'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [currentBudget, setCurrentBudget] = useState(null);

    const FIXED_USER_ID = '507f1f77bcf86cd799439011';

    useEffect(() => {
        fetchCurrentBudget();
    }, []);

    const fetchCurrentBudget = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/budget/${FIXED_USER_ID}`);
            const data = await response.json();
            
            if (data.success && data.data) {
                setCurrentBudget(data.data);
                setFormData({
                    budgetAmount: data.data.budgetAmount.toString(),
                    timeUnit: data.data.timeUnit
                });
            }
        } catch (err) {
            console.error('Error fetching current budget:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const budgetData = {
                budgetAmount: parseFloat(formData.budgetAmount),
                timeUnit: formData.timeUnit
            };

            console.log('Updating budget:', budgetData);

            const response = await fetch(`http://127.0.0.1:8080/api/budget/${FIXED_USER_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(budgetData)
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                console.log('Budget updated successfully:', result);
                onSubmit(); 
            } else {
                throw new Error(result.message || 'Failed to update budget');
            }
        } catch (err) {
            console.error('Error updating budget:', err);
            setError(err.message || 'Failed to update budget');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal onRequestClose={onRequestClose} onSubmit={handleSubmit} cancel={cancel}>
            <ModalTitle>
                Adjust Budget
            </ModalTitle>
            <ModalContent>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {currentBudget && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                            <p className="text-sm text-blue-800">
                                <strong>Current Budget:</strong> ${currentBudget.budgetAmount} per {currentBudget.timeUnit}
                            </p>
                        </div>
                    )}
                    
                    <div className="m-2">
                        <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-700 mb-1">
                            Budget Amount ($)
                        </label>
                        <input 
                            type="number" 
                            step="0.01"
                            min="0"
                            required 
                            name="budgetAmount" 
                            value={formData.budgetAmount}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="0.00"
                        />
                    </div>
                    
                    <div className="m-2">
                        <label htmlFor="timeUnit" className="block text-sm font-medium text-gray-700 mb-1">
                            Budget Frequency
                        </label>
                        <select 
                            name="timeUnit" 
                            value={formData.timeUnit}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">
                            <strong>Note:</strong> Changing your budget will reset the current period and recalculate your spending progress.
                        </p>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            type="button"
                            onClick={onRequestClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>

                    </div>
                </form>
            </ModalContent>
        </Modal>
    )
}


