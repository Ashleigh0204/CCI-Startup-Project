import Modal from "../../components/Modal/Modal";
import ModalContent from "../../components/Modal/ModalContent";
import ModalTitle from "../../components/Modal/ModalTitle";
import { useState, useEffect } from "react";
export default function ViewTransactionModal({onRequestClose, onSubmit, cancel}) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://127.0.0.1:8080/api/transactions');
            const data = await response.json();
            
            if (data.success && data.data) {
                const sortedTransactions = data.data.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setTransactions(sortedTransactions);
            } else {
                throw new Error(data.message || 'Failed to fetch transactions');
            }
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError(err.message || 'Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount) => {
        return `$${amount.toFixed(2)}`;
    };

    const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    return (
        <Modal onRequestClose={onRequestClose} onSubmit={onSubmit} cancel={cancel}>
            <ModalTitle>
                Recent Transactions
            </ModalTitle>
            <ModalContent>
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="text-gray-600">Loading transactions...</div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">
                        No transactions found
                    </div>
                ) : (
                    <div>
                        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-blue-800">Total Spent:</span>
                                <span className="text-lg font-bold text-blue-900">{formatAmount(totalSpent)}</span>
                            </div>
                            <div className="text-sm text-blue-700 mt-1">
                                {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(transaction.createdAt)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {transaction.location?.name || 'Unknown Location'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatAmount(transaction.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                    </div>
                )}
            </ModalContent>
        </Modal>
    );
}