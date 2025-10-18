// Import all controllers
const userController = require('./userController');
const restaurantController = require('./restaurantController');
const transactionController = require('./transactionController');
const userDataController = require('./userDataController');
const recipeController = require('./recipeController');
const budgetController = require('./budgetController');

// Export all controllers
module.exports = {
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
    index: (req, res) => {
        res.sendFile('index/index.html', { root: __dirname + '/../frontend/' });
    }
};