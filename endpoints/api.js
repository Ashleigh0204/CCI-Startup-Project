const express = require('express');
const controller = require('../controllers/index');
const restaurants = require('./restaurants');
const transactions = require('./transactions');

//create router
const router = express.Router();

// GET / => display index page
router.get('/', controller.index);

// mount restaurants router
router.get('/get_restaurants', getAllRestaurants);

// mount transactions router
router.get('/transactions', getAllTransactions);


router.post('/budget', addSpending);

// new recipe endpoints
router.get('/recipe', getRecipeSuggestions);
router.post('recipe', generateRecipe);

// user profile endpoints
router.get('profile', getUser);
router.post('profile', updateUser);

module.exports = router