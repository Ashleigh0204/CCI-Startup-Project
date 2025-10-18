const Transaction = require('../models/transactions');
const User = require('../models/user');
const Restaurant = require('../models/restaurants');

// GET /transactions - Get all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('user_id', 'username')
            .populate('location', 'name');
        
        res.json({
            success: true,
            data: transactions,
            count: transactions.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message
        });
    }
};

// GET /transactions/:id - Get transaction by ID
exports.getTransactions = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('user_id', 'username')
            .populate('location', 'name');
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        
        res.json({
            success: true,
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching transaction',
            error: error.message
        });
    }
};

// POST /transactions - Create new transaction
exports.createTransaction = async (req, res) => {
    try {
        const { amount, user_id, location } = req.body;
        
        // Validate required fields
        if (!amount || !user_id || !location) {
            return res.status(400).json({
                success: false,
                message: 'Amount, user_id, and location are required'
            });
        }
        
        // Validate amount is positive
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }
        
        // Check if user exists
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Check if restaurant exists
        const restaurant = await Restaurant.findById(location);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        
        const transaction = new Transaction({
            amount,
            user_id,
            location
        });
        
        await transaction.save();
        
        // Populate the response
        await transaction.populate('user_id', 'username');
        await transaction.populate('location', 'name');
        
        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating transaction',
            error: error.message
        });
    }
};

// PUT /transactions/:id - Update transaction
exports.updateTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const { amount, user_id, location } = req.body;
        
        // Validate amount if provided
        if (amount !== undefined && amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }
        
        // Check if user exists if user_id is provided
        if (user_id) {
            const user = await User.findById(user_id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
        }
        
        // Check if restaurant exists if location is provided
        if (location) {
            const restaurant = await Restaurant.findById(location);
            if (!restaurant) {
                return res.status(404).json({
                    success: false,
                    message: 'Restaurant not found'
                });
            }
        }
        
        const transaction = await Transaction.findByIdAndUpdate(
            transactionId,
            req.body,
            { new: true, runValidators: true }
        ).populate('user_id', 'username').populate('location', 'name');
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Transaction updated successfully',
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating transaction',
            error: error.message
        });
    }
};

// DELETE /transactions/:id - Delete transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        
        const transaction = await Transaction.findByIdAndDelete(transactionId);
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting transaction',
            error: error.message
        });
    }
};

// GET /transactions/user/:userId - Get transactions by user
exports.getTransactionsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const transactions = await Transaction.find({ user_id: userId })
            .populate('location', 'name')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: transactions,
            count: transactions.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user transactions',
            error: error.message
        });
    }
};

// GET /transactions/restaurant/:restaurantId - Get transactions by restaurant
exports.getTransactionsByRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        
        // Check if restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        
        const transactions = await Transaction.find({ location: restaurantId })
            .populate('user_id', 'username')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: transactions,
            count: transactions.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching restaurant transactions',
            error: error.message
        });
    }
};
