import path from 'path';
import { frontendPath } from "../config.js";
import * as userController from './userController.js';
import * as restaurantController from './restaurantController.js';
import * as transactionController from './transactionController.js';
import * as userDataController from './userDataController.js';
import * as recipeController from './recipeController.js';
import * as budgetController from './budgetController.js';

// GET / => display index page
const index = (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
};

// Export all controllers
export default {
    // User controllers
    ...userController,
    
    // Restaurant controllers
    ...restaurantController,
    
    // Transaction controllers
    ...transactionController,
    
    // UserData controllers
    ...userDataController,
    
    // Recipe controllers
    ...recipeController,
    
    // Budget controllers
    ...budgetController,
    
    // Original index controller
    index
};