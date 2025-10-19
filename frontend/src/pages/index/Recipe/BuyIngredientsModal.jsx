import { useState, useEffect } from "react";
import Modal from "../../../components/Modal/Modal.jsx";
import ModalContent from "../../../components/Modal/ModalContent.jsx";
import ModalTitle from "../../../components/Modal/ModalTitle.jsx";

export default function BuyIngredientsModal({onRequestClose, onSubmit, cancel, recipe}) {
    const [selectedStore, setSelectedStore] = useState('');
    const [groceryStores, setGroceryStores] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const FIXED_USER_ID = '507f1f77bcf86cd799439011';

    useEffect(() => {
        fetch('http://127.0.0.1:8080/api/get_restaurants')
            .then(response => response.json())
            .then(data => {
                if (data.success && data.data) {
                    const groceryStores = data.data.filter(store => 
                        store.keywords.some(keyword => 
                            ['groceries', 'organic', 'natural', 'health food', 'grocery'].includes(keyword.toLowerCase())
                        )

                    );
                    setGroceryStores(groceryStores);
                    if (groceryStores.length > 0) {
                        setSelectedStore(groceryStores[0]._id);
                    }
                    console.log(groceryStores);
                }
            })
            .catch(error => {
                console.error('Error fetching grocery stores:', error);
            });
    }, []);

    const totalCost = recipe.ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0);

    const handleIngredientPurchase = async () => {
        if (!selectedStore) {
            alert('Please select a grocery store');
            return;
        }

        setIsProcessing(true);

        try {
            const transactionData = {
                amount: totalCost,
                user_id: FIXED_USER_ID,
                location: selectedStore
            };

            console.log('Creating ingredient purchase transaction:', transactionData);

            const response = await fetch('http://127.0.0.1:8080/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData)
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                console.log('Ingredient purchase successful:', result);
                // Close modal and refresh page
                onRequestClose();
                window.location.reload();
            } else {
                throw new Error(result.message || 'Failed to purchase ingredients');
            }
        } catch (err) {
            console.error('Error purchasing ingredients:', err);
            alert(err.message || 'Failed to purchase ingredients');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Modal 
            onRequestClose={onRequestClose} 
            onSubmit={handleIngredientPurchase} 
            cancel={cancel}
            submitText={isProcessing ? 'Processing...' : `Purchase $${totalCost.toFixed(2)}`}
        >
            <ModalTitle>
                {recipe.name} Ingredients
            </ModalTitle>
            <ModalContent className="max-h-80 overflow-y-auto">
                <div className="space-y-4">
                    {/* Ingredients List */}
                    <div>
                        <h3 className="font-semibold mb-2">Ingredients:</h3>
                        {recipe.ingredients.map((item, index) => (
                            <div key={index} className="flex justify-between py-1">
                                <div>{item.amount} {item.name}</div>
                                <div>${item.price.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                        <div>Total</div>
                        <div>${totalCost.toFixed(2)}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Grocery Store:
                        </label>
                        <select
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {groceryStores.map(store => (
                                <option key={store._id} value={store._id}>
                                    {store.name} - {store.description}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            </ModalContent>
        </Modal>
    )
}