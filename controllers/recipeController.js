import UserData from '../models/userData.js';
import User from '../models/user.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv.js';

// Load environment variables
dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /recipes/generate - Generate a recipe using Gemini AI (no database storage)
export const generateRecipe = async (req, res) => {
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
      "name": "Chicken Breast",
      "amount": "2 lbs (4 breasts)",
      "price": 8
    },
    {
      "name": "Quinoa",
      "amount": "1 cup (uncooked)",
      "price": 3
    },
    {
      "name": "Black Beans (canned)",
      "amount": "1 can (15 oz), rinsed and drained",
      "price": 1
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
3. The "name" field should be a string (e.g., "Chicken Breast")
4. The "amount" field should be a string with measurements (e.g., "2 lbs (4 breasts)")
5. The "price" field should be a number (e.g., 8)
6. Include realistic ingredient prices based on current market rates
7. Provide detailed, step-by-step cooking instructions
8. Consider the user's dietary preferences and restrictions
9. Ensure the total cost is reasonable for the user's budget
10. Include proper quantities for each ingredient with clear measurements
11. Make the recipe practical and achievable
12. The summary should highlight key flavors, cooking techniques, and what makes this recipe special

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
]`;

        // Generate recipe using Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(geminiPrompt);
        const response = await result.response;
        const text = response.text();
        
        // Parse the JSON response
        let recipeData;
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
export const getRecipeSuggestions = async (req, res) => {
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

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(suggestionPrompt);
        const response = await result.response;
        const text = response.text();
        
        // Parse the JSON response
        let suggestions;
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
