const UserData = require('../models/userData');
const User = require('../models/user');

// GET /userdata - Get all user data
exports.getAllUserData = async (req, res) => {
    try {
        const userData = await UserData.find().populate('user_id', 'username');
        
        res.json({
            success: true,
            data: userData,
            count: userData.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};

// GET /userdata/:id - Get user data by ID
exports.getUserDataById = async (req, res) => {
    try {
        const userData = await UserData.findById(req.params.id).populate('user_id', 'username');
        
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User data not found'
            });
        }
        
        res.json({
            success: true,
            data: userData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};

// POST /userdata - Create new user data
exports.createUserData = async (req, res) => {
    try {
        const { user_id, preferences, diet, goal, budgetAmount, timeUnit } = req.body;
        
        // Validate required fields
        if (!user_id || !diet || !goal || !budgetAmount || !timeUnit) {
            return res.status(400).json({
                success: false,
                message: 'user_id, diet, goal, budgetAmount, and timeUnit are required'
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
        
        // Check if user already has data
        const existingUserData = await UserData.findOne({ user_id });
        if (existingUserData) {
            return res.status(409).json({
                success: false,
                message: 'User data already exists for this user'
            });
        }
        
        // Validate timeUnit enum
        const validTimeUnits = ['daily', 'weekly', 'monthly'];
        if (!validTimeUnits.includes(timeUnit)) {
            return res.status(400).json({
                success: false,
                message: 'timeUnit must be one of: daily, weekly, monthly'
            });
        }
        
        // Validate budgetAmount
        if (budgetAmount < 0) {
            return res.status(400).json({
                success: false,
                message: 'budgetAmount must be greater than or equal to 0'
            });
        }
        
        const userData = new UserData({
            user_id,
            preferences: preferences || [],
            diet,
            goal,
            budgetAmount,
            timeUnit
        });
        
        await userData.save();
        
        // Populate the response
        await userData.populate('user_id', 'username');
        
        res.status(201).json({
            success: true,
            message: 'User data created successfully',
            data: userData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating user data',
            error: error.message
        });
    }
};

// PUT /userdata/:id - Update user data
exports.updateUserData = async (req, res) => {
    try {
        const userDataId = req.params.id;
        const { preferences, diet, goal, budgetAmount, timeUnit } = req.body;
        
        // Validate timeUnit if provided
        if (timeUnit) {
            const validTimeUnits = ['daily', 'weekly', 'monthly'];
            if (!validTimeUnits.includes(timeUnit)) {
                return res.status(400).json({
                    success: false,
                    message: 'timeUnit must be one of: daily, weekly, monthly'
                });
            }
        }
        
        // Validate budgetAmount if provided
        if (budgetAmount !== undefined && budgetAmount < 0) {
            return res.status(400).json({
                success: false,
                message: 'budgetAmount must be greater than or equal to 0'
            });
        }
        
        const userData = await UserData.findByIdAndUpdate(
            userDataId,
            req.body,
            { new: true, runValidators: true }
        ).populate('user_id', 'username');
        
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User data not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User data updated successfully',
            data: userData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user data',
            error: error.message
        });
    }
};

// DELETE /userdata/:id - Delete user data
exports.deleteUserData = async (req, res) => {
    try {
        const userDataId = req.params.id;
        
        const userData = await UserData.findByIdAndDelete(userDataId);
        
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User data not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User data deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user data',
            error: error.message
        });
    }
};

// GET /userdata/user/:userId - Get user data by user ID
exports.getUserDataByUserId = async (req, res) => {
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
        
        const userData = await UserData.findOne({ user_id: userId }).populate('user_id', 'username');
        
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User data not found for this user'
            });
        }
        
        res.json({
            success: true,
            data: userData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};
