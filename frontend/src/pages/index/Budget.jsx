import Button from "../components/Button"
import { useState, useEffect } from "react"
import ViewTransactionModal from "./ViewTransactionModal";
import AdjustBudgetModal from "./AdjustBudgetModal";
import AddTransactionModal from "./AddTransactionModal";

export default function Budget() {
    const [viewTransactionsModalOpen, setViewTransactionModalOpen] = useState(false);
    const [adjustBudgetModalOpen, setAdjustBudgetModalOpen] = useState(false);
    const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
    const [restaurantNames, setRestaurantNames] = useState([]);
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const FIXED_USER_ID = '507f1f77bcf86cd799439011';

    useEffect(() => {
        fetchBudgetData();
        fetchRestaurantNames();
    }, []);

    const fetchBudgetData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://127.0.0.1:8080/api/budget/${FIXED_USER_ID}`);
            const data = await response.json();
            
            if (data.success && data.data) {
                setBudgetData(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch budget data');
            }
        } catch (err) {
            console.error('Error fetching budget data:', err);
            setError(err.message || 'Failed to load budget data');
        } finally {
            setLoading(false);
        }
    };

    const fetchRestaurantNames = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8080/api/get_restaurants');
            const data = await response.json();
            
            if (data.success && data.data) {
                const names = data.data.map(restaurant => restaurant.name);
                setRestaurantNames(names);
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            // Fallback to hardcoded names
            setRestaurantNames(["Wendy's", "Chick-fil-A", "Crown Restaurant"]);
        }
    };

    const handleTransactionAdded = () => {
        // Refresh budget data when a new transaction is added
        fetchBudgetData();
    };

    const handleBudgetUpdated = () => {
        // Refresh budget data when budget is updated
        fetchBudgetData();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-600">Loading budget data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    if (!budgetData) {
        return (
            <div className="text-center py-8 text-gray-600">
                No budget data found
            </div>
        );
    }

    const { budgetAmount, timeUnit, totalSpent, remainingBudget, percentageUsed } = budgetData;

    return (
        <div>
            <div className="mb-4">
                <p className="text-lg">
                    You have spent <span className="font-semibold">${totalSpent.toFixed(2)}</span> this {timeUnit}.
                </p>
                <p className={`text-lg ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    You have <span className="font-semibold">${remainingBudget.toFixed(2)}</span> left in your budget.
                </p>
                <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full ${percentageUsed > 100 ? 'bg-red-500' : percentageUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        {percentageUsed.toFixed(1)}% of budget used
                    </p>
                </div>
            </div>
            
            <div className="flex justify-center">
                <Button className="w-full m-5" onClick={() => setAddTransactionModalOpen(true)}>
                    Add Transaction
                </Button>
            </div>
            <div className="flex justify-between mt-3">
                <Button onClick={() => setViewTransactionModalOpen(true)}>View Transactions</Button>
                <Button onClick={() => setAdjustBudgetModalOpen(true)}>Adjust Budget</Button>
            </div>
            
            {viewTransactionsModalOpen && (
                <ViewTransactionModal 
                    onRequestClose={() => setViewTransactionModalOpen(false)} 
                    onSubmit={() => setViewTransactionModalOpen(false)} 
                    cancel={false}
                />
            )}
            {adjustBudgetModalOpen && (
                <AdjustBudgetModal 
                    onRequestClose={() => setAdjustBudgetModalOpen(false)} 
                    onSubmit={() => {
                        setAdjustBudgetModalOpen(false);
                        handleBudgetUpdated();
                    }} 
                    cancel={true} 
                />
            )}
            {addTransactionModalOpen && (
                <AddTransactionModal 
                    onRequestClose={() => setAddTransactionModalOpen(false)} 
                    onSubmit={() => {
                        setAddTransactionModalOpen(false);
                        handleTransactionAdded();
                    }} 
                    cancel={true} 
                    locations={restaurantNames} 
                />
            )}
        </div>
    )
}