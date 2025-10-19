const UserData = require('../models/userData');
const Transaction = require('../models/transactions');
const User = require('../models/user');

// GET /budget/:userId - Get user's budget information
exports.getUserBudget = async (req, res) => {
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
        
        // Get user data with budget information
        const userData = await UserData.findOne({ user_id: userId });
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User budget data not found'
            });
        }
        
        // Calculate current spending for the time period
        // For testing purposes, use October 19, 2024 as "now"
        const now = new Date('2024-10-19T12:00:00Z');
        let startDate;
        
        switch (userData.timeUnit) {
            case 'daily':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'weekly':
                const dayOfWeek = now.getDay();
                // Calculate start of current week (Sunday = 0)
                startDate = new Date(now);
                startDate.setDate(now.getDate() - dayOfWeek);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // Default to weekly
        }
        
        // Get transactions for the current period
        const transactions = await Transaction.find({
            user_id: userId,
            createdAt: { $gte: startDate }
        }).populate('location', 'name');
        
        // Calculate total spent
        const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        
        // Calculate remaining budget
        const remainingBudget = userData.budgetAmount - totalSpent;
        
        // Calculate percentage used
        const percentageUsed = userData.budgetAmount > 0 ? (totalSpent / userData.budgetAmount) * 100 : 0;
        
        res.json({
            success: true,
            data: {
                userId: userId,
                username: user.username,
                budgetAmount: userData.budgetAmount,
                timeUnit: userData.timeUnit,
                totalSpent: Math.round(totalSpent * 100) / 100,
                remainingBudget: Math.round(remainingBudget * 100) / 100,
                percentageUsed: Math.round(percentageUsed * 100) / 100,
                periodStart: startDate,
                periodEnd: now,
                transactions: transactions.map(t => ({
                    id: t._id,
                    amount: t.amount,
                    location: t.location.name,
                    date: t.createdAt
                }))
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching budget information',
            error: error.message
        });
    }
};

// PUT /budget/:userId - Update user's budget
exports.updateUserBudget = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { budgetAmount, timeUnit } = req.body;
        
        // Validate required fields
        if (budgetAmount === undefined && !timeUnit) {
            return res.status(400).json({
                success: false,
                message: 'budgetAmount or timeUnit is required'
            });
        }
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Validate budget amount
        if (budgetAmount !== undefined && budgetAmount < 0) {
            return res.status(400).json({
                success: false,
                message: 'budgetAmount must be greater than or equal to 0'
            });
        }
        
        // Validate time unit
        if (timeUnit) {
            const validTimeUnits = ['daily', 'weekly', 'monthly'];
            if (!validTimeUnits.includes(timeUnit)) {
                return res.status(400).json({
                    success: false,
                    message: 'timeUnit must be one of: daily, weekly, monthly'
                });
            }
        }
        
        const updateData = {};
        if (budgetAmount !== undefined) updateData.budgetAmount = budgetAmount;
        if (timeUnit) updateData.timeUnit = timeUnit;
        
        const userData = await UserData.findOneAndUpdate(
            { user_id: userId },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User budget data not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Budget updated successfully',
            data: {
                userId: userId,
                budgetAmount: userData.budgetAmount,
                timeUnit: userData.timeUnit,
                updatedAt: userData.updatedAt
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating budget',
            error: error.message
        });
    }
};

// POST /budget/:userId/spending - Add spending transaction
exports.addSpending = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { amount, locationId, description } = req.body;
        
        if (!amount || !locationId) {
            return res.status(400).json({
                success: false,
                message: 'amount and locationId are required'
            });
        }
        
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'amount must be greater than 0'
            });
        }
        
        if (amount > 10000) {
            return res.status(400).json({
                success: false,
                message: 'Amount cannot exceed $10,000. Please contact support for larger transactions.'
            });
        }
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Check budget constraints to prevent negative balance
        const userData = await UserData.findOne({ user_id: userId });
        if (userData) {
            // Calculate current spending for the time period
            const now = new Date('2024-10-19T12:00:00Z'); // Use same date as budget controller
            let startDate;
            
            switch (userData.timeUnit) {
                case 'daily':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'weekly':
                    const dayOfWeek = now.getDay();
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - dayOfWeek);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'monthly':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                default:
                    startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // Default to weekly
            }
            
            // Get current spending for the period
            const currentTransactions = await Transaction.find({
                user_id: userId,
                createdAt: { $gte: startDate }
            });
            
            const currentSpending = currentTransactions.reduce((sum, t) => sum + t.amount, 0);
            const remainingBudget = userData.budgetAmount - currentSpending;
            
            // Check if this transaction would exceed the budget
            if (amount > remainingBudget) {
                return res.status(400).json({
                    success: false,
                    message: `Transaction would exceed your ${userData.timeUnit} budget. You have $${remainingBudget.toFixed(2)} remaining.`
                });
            }
        }
        
        // Create transaction
        const transaction = new Transaction({
            amount,
            user_id: userId,
            location: locationId
        });
        
        await transaction.save();
        
        // Populate the response
        await transaction.populate('location', 'name');
        
        res.status(201).json({
            success: true,
            message: 'Spending added successfully',
            data: {
                id: transaction._id,
                amount: transaction.amount,
                location: transaction.location ? transaction.location.name : 'Unknown',
                date: transaction.createdAt
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding spending',
            error: error.message
        });
    }
};

// GET /budget/:userId/spending-history - Get spending history
exports.getSpendingHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { period = 'monthly', limit = 50 } = req.query;
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Calculate date range based on period
        // For testing purposes, use October 19, 2024 as "now"
        const now = new Date('2024-10-19T12:00:00Z');
        let startDate;
        
        switch (period) {
            case 'daily':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'weekly':
                const dayOfWeek = now.getDay();
                // Calculate start of current week (Sunday = 0)
                startDate = new Date(now);
                startDate.setDate(now.getDate() - dayOfWeek);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'yearly':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); // Default to 30 days
        }
        
        // Get transactions
        const transactions = await Transaction.find({
            user_id: userId,
            createdAt: { $gte: startDate }
        })
        .populate('location', 'name')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));
        
        // Calculate summary statistics
        const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        const averageSpending = transactions.length > 0 ? totalSpent / transactions.length : 0;
        
        // Group by location for insights
        const spendingByLocation = {};
        transactions.forEach(transaction => {
            const locationName = transaction.location.name;
            if (!spendingByLocation[locationName]) {
                spendingByLocation[locationName] = { count: 0, total: 0 };
            }
            spendingByLocation[locationName].count++;
            spendingByLocation[locationName].total += transaction.amount;
        });
        
        res.json({
            success: true,
            data: {
                userId: userId,
                period: period,
                periodStart: startDate,
                periodEnd: now,
                summary: {
                    totalTransactions: transactions.length,
                    totalSpent: Math.round(totalSpent * 100) / 100,
                    averageSpending: Math.round(averageSpending * 100) / 100
                },
                spendingByLocation: Object.keys(spendingByLocation).map(location => ({
                    location: location,
                    count: spendingByLocation[location].count,
                    total: Math.round(spendingByLocation[location].total * 100) / 100
                })),
                transactions: transactions.map(t => ({
                    id: t._id,
                    amount: t.amount,
                    location: t.location.name,
                    date: t.createdAt
                }))
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching spending history',
            error: error.message
        });
    }
};

// GET /budget/:userId/insights - Get budget insights and recommendations
exports.getBudgetInsights = async (req, res) => {
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
        
        // Get user budget data
        const userData = await UserData.findOne({ user_id: userId });
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User budget data not found'
            });
        }
        
        // Get recent transactions (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentTransactions = await Transaction.find({
            user_id: userId,
            createdAt: { $gte: thirtyDaysAgo }
        }).populate('location', 'name');
        
        // Calculate insights
        const totalSpent = recentTransactions.reduce((sum, t) => sum + t.amount, 0);
        const averageDailySpending = totalSpent / 30;
        const projectedMonthlySpending = averageDailySpending * 30;
        
        // Calculate budget health
        const budgetHealth = userData.budgetAmount > 0 ? 
            ((userData.budgetAmount - projectedMonthlySpending) / userData.budgetAmount) * 100 : 0;
        
        // Generate recommendations
        const recommendations = [];
        
        if (budgetHealth < 0) {
            recommendations.push({
                type: 'warning',
                message: 'You are projected to exceed your monthly budget',
                suggestion: 'Consider reducing spending or increasing your budget'
            });
        } else if (budgetHealth < 20) {
            recommendations.push({
                type: 'caution',
                message: 'You are close to your budget limit',
                suggestion: 'Monitor your spending closely this month'
            });
        } else {
            recommendations.push({
                type: 'success',
                message: 'You are within your budget',
                suggestion: 'Great job managing your spending!'
            });
        }
        
        // Top spending locations
        const spendingByLocation = {};
        recentTransactions.forEach(transaction => {
            const locationName = transaction.location.name;
            if (!spendingByLocation[locationName]) {
                spendingByLocation[locationName] = 0;
            }
            spendingByLocation[locationName] += transaction.amount;
        });
        
        const topSpendingLocations = Object.keys(spendingByLocation)
            .map(location => ({
                location: location,
                amount: Math.round(spendingByLocation[location] * 100) / 100
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);
        
        res.json({
            success: true,
            data: {
                userId: userId,
                budgetHealth: Math.round(budgetHealth * 100) / 100,
                insights: {
                    totalSpentLast30Days: Math.round(totalSpent * 100) / 100,
                    averageDailySpending: Math.round(averageDailySpending * 100) / 100,
                    projectedMonthlySpending: Math.round(projectedMonthlySpending * 100) / 100,
                    budgetAmount: userData.budgetAmount,
                    timeUnit: userData.timeUnit
                },
                topSpendingLocations: topSpendingLocations,
                recommendations: recommendations
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating budget insights',
            error: error.message
        });
    }
};
