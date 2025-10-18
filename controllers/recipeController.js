const UserData = require('../models/userData');
const User = require('../models/user');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
        
        geminiPrompt += `\n\nPlease respond with a JSON object in the following exact format:
{
  "name": "Recipe Name",
  "ingredients": {
    "ingredient name": {
      "amount": "amount needed",
      "price": estimated_price_in_dollars
    },
    "another ingredient": {
      "amount": "amount needed", 
      "price": estimated_price_in_dollars
    }
  },
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

Make sure to:
1. Include realistic ingredient prices based on current market rates
2. Provide detailed, step-by-step cooking instructions
3. Consider the user's dietary preferences and restrictions
4. Ensure the total cost is reasonable for the user's budget
5. Include proper quantities for each ingredient
6. Make the recipe practical and achievable`;

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
        
        // Validate the recipe data structure
        if (!recipeData.name || !recipeData.ingredients || !recipeData.steps) {
            return res.status(500).json({
                success: false,
                message: 'Invalid recipe data structure from AI response',
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
    "description": "Brief description",
    "estimatedCost": estimated_cost,
    "difficulty": "easy/medium/hard",
    "cookingTime": "time estimate"
  }
]`;

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
