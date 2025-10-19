import User from '../models/user.js';
import UserData from '../models/userData.js';
import bcrypt from 'bcrypt';

// GET /users - Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash');
        res.json({
            success: true,
            data: users,
            count: users.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// GET /users/:id - Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

// POST /users - Create new user
export const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Username already exists'
            });
        }
        
        // Hash password
        const passwordHash = bcrypt.hashSync(password, 10);
        
        // Create user
        const user = new User({
            username,
            passwordHash
        });
        
        await user.save();
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: user._id,
                username: user.username,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
};

// PUT /users/:id - Update user
export const updateUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userId = req.params.id;
        
        const updateData = {};
        if (username) updateData.username = username;
        if (password) updateData.passwordHash = bcrypt.hashSync(password, 10);
        
        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-passwordHash');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
};

// DELETE /users/:id - Delete user
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Also delete associated userData
        await UserData.deleteMany({ user_id: userId });
        
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

// POST /users/login - User login
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                id: user._id,
                username: user.username
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};
