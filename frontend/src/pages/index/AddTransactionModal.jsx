import Modal from "../components/Modal/Modal"
import ModalTitle from "../components/Modal/ModalTitle"
import ModalContent from "../components/Modal/ModalContent"
import { useState, useEffect } from "react"

export default function AddTransactionModal({onRequestClose, onSubmit, cancel, locations}) {
    const [formData, setFormData] = useState({
        amount: '',
        location: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        // Fetch restaurants to get both names and IDs
        fetch('http://127.0.0.1:8080/api/get_restaurants')
            .then(response => response.json())
            .then(data => {
                if (data.success && data.data) {
                    setRestaurants(data.data);
                    // Set default location to first restaurant
                    if (data.data.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            location: data.data[0]._id
                        }));
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching restaurants:', error);
                setError('Failed to load restaurants');
            });
    }, []);

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
            // Use the fixed user ID for consistent testing
            const FIXED_USER_ID = '507f1f77bcf86cd799439011';
            
            const transactionData = {
                amount: parseFloat(formData.amount),
                user_id: FIXED_USER_ID,
                location: formData.location // This is now a restaurant ObjectId
            };

            console.log('Submitting transaction:', transactionData);

            const response = await fetch('http://127.0.0.1:8080/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData)
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                console.log('Transaction created successfully:', result);
                onSubmit(); // Close modal
            } else {
                throw new Error(result.message || 'Failed to create transaction');
            }
        } catch (err) {
            console.error('Error creating transaction:', err);
            setError(err.message || 'Failed to create transaction');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal onRequestClose={onRequestClose} onSubmit={handleSubmit} cancel={cancel}>
            <ModalTitle>
                Add Transaction
            </ModalTitle>
            <ModalContent>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    
                    <div className="m-2">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Amount ($)
                        </label>
                        <input 
                            type="number" 
                            step="0.01"
                            min="0"
                            required 
                            name="amount" 
                            value={formData.amount}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="0.00"
                        />
                    </div>
                    
                    <div className="m-2">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <select 
                            name="location" 
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {restaurants.map((restaurant) => (
                                <option key={restaurant._id} value={restaurant._id}>
                                    {restaurant.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-4">
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