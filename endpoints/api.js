const express = require('express');
const controller = require('../controllers/index');

//create router
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Restaurant endpoints
router.get('/get_restaurants', controller.getAllRestaurants);
router.get('/get_filtered-restaurant', controller.searchRestaurants);
router.get('/restaurants/open', controller.getOpenRestaurants);

// Transaction endpoints
router.get('/transactions', controller.getAllTransactions);
router.post('/transactions', controller.createTransaction);
router.delete('/transactions/:id', controller.deleteTransaction);

// Budget endpoints
router.post('/budget', controller.addSpending);
router.get('/budget/:userId', controller.getUserBudget);
router.put('/budget/:userId', controller.updateUserBudget);

// Recipe endpoints
router.get('/recipe', controller.getRecipeSuggestions);
router.post('/recipe', controller.generateRecipe);

// User profile endpoints
router.get('/profile', controller.getAllUsers);
router.post('/profile', controller.createUser);

module.exports = router;