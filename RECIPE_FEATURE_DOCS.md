# Recipe Generation Feature

This feature allows users to generate personalized recipes using the Gemini AI API based on their profile and preferences.

## Setup

### 1. Get a Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 2. Install Dependencies
The Gemini AI package is already installed:
```bash
npm install @google/generative-ai
```

## API Endpoints

### POST /recipes/generate
Generate a personalized recipe based on user preferences.

**Request Body:**
```json
{
  "userId": "user_id_here",
  "prompt": "I want to make a healthy chicken dinner",
  "cuisine": "Mediterranean", // optional
  "mealType": "dinner" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Recipe generated successfully",
  "data": {
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
      }
    },
    "steps": [
      "Step 1: Preheat oven to 400°F (200°C)",
      "Step 2: Season chicken breasts with salt, pepper, and herbs",
      "Step 3: Heat olive oil in a pan and sear chicken for 3 minutes per side"
    ],
    "totalCost": 15.75,
    "dietaryInfo": {
      "diet": "omnivore",
      "preferences": ["healthy", "mediterranean"],
      "allergens": []
    },
    "generatedFor": {
      "userId": "68f3b4db2b98a55d41a872bd",
      "username": "john_doe"
    },
    "generatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /recipes/suggestions
Get recipe suggestions based on user preferences.

**Query Parameters:**
- `userId` (required): User ID
- `limit` (optional): Number of suggestions (default: 3)

**Example:**
```
GET /recipes/suggestions?userId=68f3b4db2b98a55d41a872bd&limit=5
```

**Response:**
```json
{
  "success": true,
  "message": "Recipe suggestions generated successfully",
  "data": [
    {
      "name": "Quinoa Buddha Bowl",
      "description": "Nutritious bowl with quinoa, roasted vegetables, and tahini dressing",
      "estimatedCost": 12.50,
      "difficulty": "easy",
      "cookingTime": "30 minutes"
    },
    {
      "name": "Grilled Salmon with Asparagus",
      "description": "Healthy protein with seasonal vegetables",
      "estimatedCost": 18.75,
      "difficulty": "medium",
      "cookingTime": "25 minutes"
    }
  ]
}
```

## Ingredient Format

The ingredients are returned as key-value pairs where:
- **Key**: Ingredient name (string)
- **Value**: Object containing:
  - `amount`: Quantity needed (string)
  - `price`: Estimated price in dollars (number)

**Example:**
```json
"ingredients": {
  "chicken breast": {
    "amount": "2 pieces (6 oz each)",
    "price": 8.50
  },
  "olive oil": {
    "amount": "2 tbsp", 
    "price": 1.20
  }
}
```

## How It Works

1. **User Preferences Integration**: The system automatically pulls user preferences from their UserData profile including:
   - Diet type (omnivore, vegetarian, vegan, keto, etc.)
   - Food preferences (spicy food, outdoor seating, etc.)
   - Budget constraints

2. **AI Prompt Engineering**: The system builds a comprehensive prompt for Gemini AI that includes:
   - User's specific request
   - Dietary restrictions and preferences
   - Budget considerations
   - Cuisine type and meal type if specified

3. **Structured Response**: Gemini returns a JSON response with:
   - Recipe name
   - Ingredients as key-value pairs with amounts and prices
   - Step-by-step cooking instructions
   - Total cost calculation
   - Dietary information

4. **No Database Storage**: Recipes are generated on-demand and returned directly to the user without being stored in the database.

## Testing Without API Key

If you don't have a valid Gemini API key, you can test the endpoint structure by using the mock controller (`recipeControllerMock.js`) which returns sample data in the same format.

## Frontend Integration

The frontend can call these endpoints to:
1. Show recipe suggestions on the user dashboard
2. Generate specific recipes based on user requests
3. Display ingredient lists with prices for shopping
4. Show step-by-step cooking instructions

## Error Handling

The API includes comprehensive error handling for:
- Invalid user IDs
- Missing required fields
- Gemini API errors
- JSON parsing errors
- Invalid recipe data structure

All errors return consistent JSON responses with descriptive error messages.
