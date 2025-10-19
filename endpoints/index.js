import express from 'express';
import controller from '../controllers/index.js';
import api from './api.js';

//create router
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// GET / => display index page
router.get('/', controller.index);

// mount API router
router.use('/api', api);

export default router;