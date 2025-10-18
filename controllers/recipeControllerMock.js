const UserData = require('../models/userData');
const User = require('../models/user');

// Mock recipe data for testing when Gemini API key is not available
const mockRecipes = {
    "healthy chicken dinner": {
        "name": "Mediterranean Herb-Crusted Chicken",
        "ingredients": {
            "chicken breast": {
                "amount": "2 pieces (6 oz each)",
                "price": 8.50
            },
            "olive oil": {
                "amount": "2 tbsp",
                "price": 1.20
            },
            "mixed herbs (oregano, thyme, rosemary)": {
                "amount": "1 tbsp",
                "price": 0.75
            },
            "lemon": {
                "amount": "1 medium",
                "price": 0.80
            },
            "garlic": {
                "amount": "3 cloves",
                "price": 0.50
            },
            "cherry tomatoes": {
                "amount": "1 cup",
                "price": 2.25
            },
            "fresh spinach": {
                "amount": "2 cups",
                "price": 1.50
            }
        },
        "steps": [
            "Step 1: Preheat oven to 400°F (200°C). Line a baking sheet with parchment paper.",
            "Step 2: Season chicken breasts with salt, pepper, and mixed herbs on both sides.",
            "Step 3: Heat 1 tbsp olive oil in a large oven-safe skillet over medium-high heat.",
            "Step 4: Sear chicken breasts for 3 minutes per side until golden brown.",
            "Step 5: Transfer skillet to oven and bake for 15-18 minutes until chicken reaches 165°F.",
            "Step 6: Meanwhile, heat remaining olive oil in a separate pan. Add minced garlic and cook for 30 seconds.",
            "Step 7: Add cherry tomatoes and cook for 2-3 minutes until they start to burst.",
            "Step 8: Add spinach and cook until wilted, about 2 minutes. Season with salt and pepper.",
            "Step 9: Remove chicken from oven and let rest for 5 minutes.",
            "Step 10: Serve chicken over the tomato-spinach mixture with lemon wedges."
        ],
        "totalCost": 15.50,
        "dietaryInfo": {
            "diet": "omnivore",
            "preferences": ["healthy", "mediterranean", "protein-rich"],
            "allergens": []
        }
    },
    "vegetarian pasta": {
        "name": "Creamy Mushroom and Spinach Pasta",
        "ingredients": {
            "whole wheat pasta": {
                "amount": "8 oz",
                "price": 2.50
            },
            "mixed mushrooms": {
                "amount": "8 oz",
                "price": 4.25
            },
            "fresh spinach": {
                "amount": "3 cups",
                "price": 2.25
            },
            "heavy cream": {
                "amount": "1/2 cup",
                "price": 1.80
            },
            "parmesan cheese": {
                "amount": "1/2 cup grated",
                "price": 3.50
            },
            "garlic": {
                "amount": "4 cloves",
                "price": 0.60
            },
            "olive oil": {
                "amount": "2 tbsp",
                "price": 1.20
            }
        },
        "steps": [
            "Step 1: Bring a large pot of salted water to boil. Cook pasta according to package directions.",
            "Step 2: Heat olive oil in a large skillet over medium heat. Add minced garlic and cook for 1 minute.",
            "Step 3: Add sliced mushrooms and cook for 5-6 minutes until golden and tender.",
            "Step 4: Add spinach and cook until wilted, about 2 minutes.",
            "Step 5: Reduce heat to low and add heavy cream. Simmer for 2-3 minutes.",
            "Step 6: Add grated parmesan cheese and stir until melted and creamy.",
            "Step 7: Drain pasta, reserving 1/2 cup pasta water.",
            "Step 8: Add pasta to the sauce and toss to combine. Add pasta water if needed for consistency.",
            "Step 9: Season with salt and pepper to taste.",
            "Step 10: Serve immediately with extra parmesan cheese."
        ],
        "totalCost": 16.10,
        "dietaryInfo": {
            "diet": "vegetarian",
            "preferences": ["comfort food", "creamy", "mushroom"],
            "allergens": ["dairy"]
        }
    }
};

// POST /recipes/generate - Generate a recipe (mock version for testing)
exports.generateRecipe = async (req, res) => {
    try {
        const { userId, prompt, cuisine, mealType } = req.body;
        
        // Validate required fields
        if (!userId || !prompt) {
            return res.status(400).json({
                success: false,
                message: 'userId and prompt are required'
            });
        }
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Get user preferences
        const userData = await UserData.findOne({ user_id: userId });
        
        // Simple mock recipe selection based on prompt keywords
        let recipeData;
        const promptLower = prompt.toLowerCase();
        
        if (promptLower.includes('chicken') || promptLower.includes('healthy')) {
            recipeData = mockRecipes['healthy chicken dinner'];
        } else if (promptLower.includes('pasta') || promptLower.includes('vegetarian')) {
            recipeData = mockRecipes['vegetarian pasta'];
        } else {
            // Default to chicken recipe
            recipeData = mockRecipes['healthy chicken dinner'];
        }
        
        // Adjust recipe based on user preferences
        if (userData) {
            if (userData.diet === 'vegetarian' && recipeData.dietaryInfo.diet === 'omnivore') {
                recipeData = mockRecipes['vegetarian pasta'];
            }
            
            // Adjust cost based on budget
            const budgetRatio = userData.budgetAmount / 50; // Assuming $50 is baseline
            recipeData.totalCost = Math.round(recipeData.totalCost * budgetRatio * 100) / 100;
            Object.keys(recipeData.ingredients).forEach(ingredientName => {
                recipeData.ingredients[ingredientName].price = Math.round(recipeData.ingredients[ingredientName].price * budgetRatio * 100) / 100;
            });
        }
        
        // Return the recipe
        res.json({
            success: true,
            message: 'Recipe generated successfully (mock data)',
            data: {
                ...recipeData,
                generatedFor: {
                    userId: userId,
                    username: user.username
                },
                generatedAt: new Date().toISOString(),
                note: "This is mock data for testing. Replace with actual Gemini API integration."
            }
        });
        
    } catch (error) {
        console.error('Error generating recipe:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating recipe',
            error: error.message
        });
    }
};

// GET /recipes/suggestions - Get recipe suggestions (mock version)
exports.getRecipeSuggestions = async (req, res) => {
    try {
        const { userId, limit = 3 } = req.query;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId is required'
            });
        }
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Get user preferences
        const userData = await UserData.findOne({ user_id: userId });
        
        // Mock suggestions based on user preferences
        const suggestions = [
            {
                "name": "Mediterranean Herb-Crusted Chicken",
                "description": "Healthy protein with fresh herbs and vegetables",
                "estimatedCost": 15.50,
                "difficulty": "medium",
                "cookingTime": "30 minutes"
            },
            {
                "name": "Creamy Mushroom and Spinach Pasta",
                "description": "Comforting vegetarian pasta with rich flavors",
                "estimatedCost": 16.10,
                "difficulty": "easy",
                "cookingTime": "25 minutes"
            },
            {
                "name": "Quinoa Buddha Bowl",
                "description": "Nutritious bowl with quinoa, roasted vegetables, and tahini dressing",
                "estimatedCost": 12.50,
                "difficulty": "easy",
                "cookingTime": "35 minutes"
            },
            {
                "name": "Grilled Salmon with Asparagus",
                "description": "Healthy protein with seasonal vegetables",
                "estimatedCost": 18.75,
                "difficulty": "medium",
                "cookingTime": "20 minutes"
            },
            {
                "name": "Vegetarian Stir-Fry",
                "description": "Quick and colorful vegetable stir-fry with tofu",
                "estimatedCost": 11.25,
                "difficulty": "easy",
                "cookingTime": "15 minutes"
            }
        ];
        
        // Filter suggestions based on user diet
        let filteredSuggestions = suggestions;
        if (userData && userData.diet === 'vegetarian') {
            filteredSuggestions = suggestions.filter(s => 
                s.name.includes('Vegetarian') || 
                s.name.includes('Buddha Bowl') || 
                s.name.includes('Mushroom')
            );
        }
        
        // Limit results
        const limitedSuggestions = filteredSuggestions.slice(0, parseInt(limit));
        
        res.json({
            success: true,
            message: 'Recipe suggestions generated successfully (mock data)',
            data: limitedSuggestions
        });
        
    } catch (error) {
        console.error('Error generating recipe suggestions:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating recipe suggestions',
            error: error.message
        });
    }
};
