const express = require('express');
const controller = require('../controllers/index');
const api = require('./api');

//create router
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// GET / => display index page
router.get('/', controller.index);

// mount API router
router.use('/api', api);

module.exports = router;