const express = require('express');
const controller = require('../controllers/index');

//create router
const router = express.Router();

// GET / => display index page
router.get('/', controller.index);

module.exports = router