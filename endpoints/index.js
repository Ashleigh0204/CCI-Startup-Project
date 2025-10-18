const express = require('express');
const controller = require('../controllers/index');
const restaurants = require('./restaurants');
const transactions = require('./transactions');

//create router
const router = express.Router();

// GET / => display index page
router.get('/', controller.index);

// mount restaurants router
router.use('/api', restaurants);



module.exports = router