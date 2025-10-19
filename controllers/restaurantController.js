import Restaurant from '../models/restaurants.js';

// GET /restaurants - Get all restaurants
export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json({
            success: true,
            data: restaurants,
            count: restaurants.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching restaurants',
            error: error.message
        });
    }
};

// GET /restaurants/:id - Get restaurant by ID
export const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        res.json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching restaurant',
            error: error.message
        });
    }
};

// POST /restaurants - Create new restaurant
export const createRestaurant = async (req, res) => {
    try {
        const {
            name,
            description,
            keywords,
            Mopen, Mclose,
            Topen, Tclose,
            Wopen, Wclose,
            Ropen, Rclose,
            Fopen, Fclose,
            Sopen, Sclose,
            Uopen, Uclose
        } = req.body;
        
        // Validate required fields
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Name and description are required'
            });
        }
        
        const restaurant = new Restaurant({
            name,
            description,
            keywords: keywords || [],
            Mopen, Mclose,
            Topen, Tclose,
            Wopen, Wclose,
            Ropen, Rclose,
            Fopen, Fclose,
            Sopen, Sclose,
            Uopen, Uclose
        });
        
        await restaurant.save();
        
        res.status(201).json({
            success: true,
            message: 'Restaurant created successfully',
            data: restaurant
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating restaurant',
            error: error.message
        });
    }
};

// PUT /restaurants/:id - Update restaurant
export const updateRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        
        const restaurant = await Restaurant.findByIdAndUpdate(
            restaurantId,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Restaurant updated successfully',
            data: restaurant
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating restaurant',
            error: error.message
        });
    }
};

// DELETE /restaurants/:id - Delete restaurant
export const deleteRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        
        const restaurant = await Restaurant.findByIdAndDelete(restaurantId);
        
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Restaurant deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting restaurant',
            error: error.message
        });
    }
};

// GET /restaurants/search - Search restaurants by keywords
export const searchRestaurants = async (req, res) => {
    try {
        const { q, keywords } = req.query;
        
        let query = {};
        
        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }
        
        if (keywords) {
            const keywordArray = keywords.split(',').map(k => k.trim());
            query.keywords = { $in: keywordArray };
        }
        
        const restaurants = await Restaurant.find(query);
        
        res.json({
            success: true,
            data: restaurants,
            count: restaurants.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching restaurants',
            error: error.message
        });
    }
};

// GET /restaurants/open - Get currently open restaurants
export const getOpenRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        const openRestaurants = restaurants.filter(restaurant => restaurant.isOpen);
        
        res.json({
            success: true,
            data: openRestaurants,
            count: openRestaurants.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching open restaurants',
            error: error.message
        });
    }
};
