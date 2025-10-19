const UserData = require('../models/userData');
const User = require('../models/user');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Gemini AI (with fallback to mock data if API key is not available)
let genAI = null;
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
    console.log('GEMINI_API_KEY not found. Using mock data for recipe generation.');
}

// POST /recipes/generate - Generate a recipe using Gemini AI (no database storage)
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
        
        // Get user preferences and dietary info
        const userData = await UserData.findOne({ user_id: userId });
        
        // Build the prompt for Gemini
        let geminiPrompt = `Generate a detailed recipe based on the following request: "${prompt}"`;
        
        if (userData) {
            geminiPrompt += `\n\nUser Preferences:
- Diet: ${userData.diet}
- Food Preferences: ${userData.preferences.join(', ')}
- Budget: $${userData.budgetAmount} per ${userData.timeUnit}`;
        }
        
        if (cuisine) {
            geminiPrompt += `\n- Cuisine Type: ${cuisine}`;
        }
        
        if (mealType) {
            geminiPrompt += `\n- Meal Type: ${mealType}`;
        }
        
        geminiPrompt += `\n\nCRITICAL: You MUST respond with a JSON object in the following EXACT format. The ingredients field MUST be an array, not an object:

{
  "name": "Recipe Name",
  "summary": "A brief 200-character summary of what this recipe is about, including key flavors, cooking method, and appeal.",
  "ingredients": [
    {
      "name": "Food Item 1",
      "amount": "Amount of the food item",
      "price": Price of the food item
    },
    {
      "name": "Food Item 2",
      "amount": "Amount of the food item",
      "price": Price of the food item
    },
    {
      "name": "Food Item 3",
      "amount": "Amount of the food item",
      "price": Price of the food item
    }
  ],
  "steps": [
    "Step 1: Detailed instruction",
    "Step 2: Detailed instruction",
    "Step 3: Detailed instruction"
  ],
  "totalCost": total_cost_in_dollars,
  "dietaryInfo": {
    "diet": "dietary_type",
    "preferences": ["preference1", "preference2"],
    "allergens": ["allergen1", "allergen2"]
  }
}

MANDATORY REQUIREMENTS:
1. The "ingredients" field MUST be an array of objects, NOT a key-value object
2. Each ingredient object MUST have exactly these three fields: "name", "amount", "price"
3. The "name" field should be a string (e.g., "Food Item 1")
4. The "amount" field should be a string with measurements (e.g., "2 lbs (4 breasts)")
5. The "price" field should be a number (e.g., 8)
6. Include realistic ingredient prices based on current market rates
7. Provide detailed, step-by-step cooking instructions
8. Consider the user's dietary preferences and restrictions
9. Ensure the total cost is reasonable for the user's budget
10. Include proper quantities for each ingredient with clear measurements
11. Make the recipe practical and achievable
12. The summary should highlight key flavors, cooking techniques, and what makes this recipe special
13. Keep in the mind the ingredients that I provided in the prompt are just an example, you can use other ingredients that are not in the prompt but are related to the prompt. Also make sure the ingredients are realistic and achievable, and make sure to take into account the user's dietary preferences and restrictions.
14. Do not only use chicken emphasize on using other ingredients that are not in the prompt but are related to the prompt.


DO NOT use this format for ingredients:
{
  "ingredient name": {
    "amount": "amount needed",
    "price": estimated_price_in_dollars
  }
}

ONLY use this format for ingredients:
[
  {
    "name": "ingredient name",
    "amount": "amount needed", 
    "price": estimated_price_in_dollars
  }
]

  
`;

        // Generate recipe using Gemini or fallback to mock data
        let recipeData;
        
        if (genAI) {
            // Use Gemini AI
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(geminiPrompt);
            const response = await result.response;
            const text = response.text();
            
            // Parse the JSON response
            try {
                // Clean the response text (remove markdown formatting if present)
                const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
                recipeData = JSON.parse(cleanedText);
            } catch (parseError) {
                console.error('Error parsing Gemini response:', parseError);
                console.error('Raw response:', text);
                return res.status(500).json({
                    success: false,
                    message: 'Error parsing recipe data from AI response',
                    error: parseError.message,
                    rawResponse: text
                });
            }
        } else {
            // Fallback to mock data
            console.log('Using mock data for recipe generation');
            const mockRecipes = {
                "chicken": {
                    "name": "Mediterranean Herb-Crusted Chicken",
                    "summary": "Tender chicken breast coated in aromatic Mediterranean herbs, pan-seared to golden perfection. Served with roasted vegetables and a light lemon-herb sauce.",
                    "ingredients": [
                        { "name": "Chicken Breast", "amount": "2 pieces (6 oz each)", "price": 8.50 },
                        { "name": "Olive Oil", "amount": "2 tbsp", "price": 1.20 },
                        { "name": "Mixed Herbs", "amount": "1 tbsp", "price": 0.75 },
                        { "name": "Lemon", "amount": "1 medium", "price": 0.80 },
                        { "name": "Garlic", "amount": "3 cloves", "price": 0.50 },
                        { "name": "Cherry Tomatoes", "amount": "1 cup", "price": 2.25 },
                        { "name": "Fresh Spinach", "amount": "2 cups", "price": 1.50 }
                    ],
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
                "pasta": {
                    "name": "Creamy Mushroom Pasta",
                    "summary": "Rich and creamy pasta with sautéed mushrooms, garlic, and herbs. A comforting vegetarian dish perfect for any night of the week.",
                    "ingredients": [
                        { "name": "Pasta", "amount": "12 oz", "price": 2.50 },
                        { "name": "Mixed Mushrooms", "amount": "1 lb", "price": 4.00 },
                        { "name": "Heavy Cream", "amount": "1 cup", "price": 2.00 },
                        { "name": "Garlic", "amount": "4 cloves", "price": 0.50 },
                        { "name": "Fresh Thyme", "amount": "2 tbsp", "price": 1.00 },
                        { "name": "Parmesan Cheese", "amount": "1/2 cup grated", "price": 3.00 },
                        { "name": "Butter", "amount": "2 tbsp", "price": 0.50 }
                    ],
                    "steps": [
                        "Step 1: Cook pasta according to package directions until al dente. Reserve 1 cup pasta water.",
                        "Step 2: Heat butter in a large skillet over medium-high heat.",
                        "Step 3: Add mushrooms and cook for 5-7 minutes until golden brown.",
                        "Step 4: Add minced garlic and thyme, cook for 1 minute until fragrant.",
                        "Step 5: Pour in heavy cream and bring to a simmer.",
                        "Step 6: Add cooked pasta and toss to combine.",
                        "Step 7: Add grated Parmesan and toss until creamy.",
                        "Step 8: Add reserved pasta water as needed to achieve desired consistency.",
                        "Step 9: Season with salt and pepper to taste.",
                        "Step 10: Serve immediately with extra Parmesan on top."
                    ],
                    "totalCost": 13.50,
                    "dietaryInfo": {
                        "diet": "vegetarian",
                        "preferences": ["comfort food", "creamy", "mushroom"],
                        "allergens": ["dairy"]
                    }
                }
            };
            
            // Select mock recipe based on prompt
            const promptLower = prompt.toLowerCase();
            if (promptLower.includes('chicken')) {
                recipeData = mockRecipes.chicken;
            } else if (promptLower.includes('pasta')) {
                recipeData = mockRecipes.pasta;
            } else {
                recipeData = mockRecipes.chicken; // Default
            }
        }
        
        // Convert ingredients from object to array format if needed
        if (recipeData.ingredients && typeof recipeData.ingredients === 'object' && !Array.isArray(recipeData.ingredients)) {
            console.log('Converting ingredients from object to array format...');
            const ingredientsArray = Object.entries(recipeData.ingredients).map(([name, data]) => ({
                name: name,
                amount: data.amount || data.quantity || '1 unit',
                price: typeof data.price === 'number' ? data.price : parseFloat(data.price) || 0
            }));
            recipeData.ingredients = ingredientsArray;
        }
        
        // Validate the recipe data structure
        if (!recipeData.name || !recipeData.ingredients || !recipeData.steps) {
            return res.status(500).json({
                success: false,
                message: 'Invalid recipe data structure from AI response',
                rawResponse: text
            });
        }
        
        // Ensure ingredients is an array
        if (!Array.isArray(recipeData.ingredients)) {
            return res.status(500).json({
                success: false,
                message: 'Ingredients must be an array format',
                rawResponse: text
            });
        }
        
        // Return the recipe directly without storing in database
        res.json({
            success: true,
            message: 'Recipe generated successfully',
            data: {
                ...recipeData,
                generatedFor: {
                    userId: userId,
                    username: user.username
                },
                generatedAt: new Date().toISOString()
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

// GET /recipes/suggestions - Get recipe suggestions based on user preferences
exports.getRecipeSuggestions = async (req, res) => {
    try {
        const { userId, limit = 1 } = req.query;
        
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
        
        // Build suggestion prompt
        let suggestionPrompt = `Based on the user's preferences, suggest ${limit} different recipe ideas.`;
        
        if (userData) {
            suggestionPrompt += `\n\nUser Preferences:
- Diet: ${userData.diet}
- Food Preferences: ${userData.preferences.join(', ')}
- Budget: $${userData.budgetAmount} per ${userData.timeUnit}`;
        }
        
        suggestionPrompt += `\n\nRespond with a JSON array of recipe suggestions:
[
  {
    "name": "Recipe Name",
    "summary": "A brief 200-character summary highlighting key flavors, cooking method, and appeal",
    "description": "Brief description",
    "estimatedCost": estimated_cost,
    "difficulty": "easy/medium/hard",
    "cookingTime": "time estimate"
  }
]

Make sure each suggestion includes a compelling 200-character summary that captures the essence of the recipe.`;

        let suggestions;
        
        if (genAI) {
            // Use Gemini AI
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(suggestionPrompt);
            const response = await result.response;
            const text = response.text();
            
            // Parse the JSON response
            try {
                const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
                suggestions = JSON.parse(cleanedText);
            } catch (parseError) {
                console.error('Error parsing suggestions response:', parseError);
                return res.status(500).json({
                    success: false,
                    message: 'Error parsing recipe suggestions',
                    error: parseError.message
                });
            }
        } else {
            // Fallback to mock suggestions
            console.log('Using mock data for recipe suggestions');
            suggestions = [
                {
                    "name": "Mediterranean Herb-Crusted Chicken",
                    "summary": "Tender chicken breast coated in aromatic Mediterranean herbs, pan-seared to golden perfection. Served with roasted vegetables and a light lemon-herb sauce.",
                    "description": "Healthy protein with Mediterranean flavors",
                    "estimatedCost": 15.50,
                    "difficulty": "medium",
                    "cookingTime": "30 minutes"
                },
                {
                    "name": "Creamy Mushroom Pasta",
                    "summary": "Rich and creamy pasta with sautéed mushrooms, garlic, and herbs. A comforting vegetarian dish perfect for any night of the week.",
                    "description": "Comforting vegetarian pasta dish",
                    "estimatedCost": 13.50,
                    "difficulty": "easy",
                    "cookingTime": "25 minutes"
                }
            ];
            
            // Filter based on user diet
            if (userData && userData.diet === 'vegetarian') {
                suggestions = suggestions.filter(s => s.name.includes('Mushroom'));
            }
            
            // Limit results
            suggestions = suggestions.slice(0, parseInt(limit));
        }
        
        res.json({
            success: true,
            message: 'Recipe suggestions generated successfully',
            data: suggestions
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
