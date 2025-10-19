# Running the CCI Startup Project

This guide will help you set up and run the Smart Campus Dining application locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** (for cloud database) or **MongoDB** (for local database)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Ashleigh0204/CCI-Startup-Project.git
cd CCI-Startup-Project
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
```

**Getting MongoDB URI:**
1. Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Go to Database Access and create a database user
4. Go to Network Access and add your IP address (or 0.0.0.0/0 for testing)
5. Click "Connect" → "Connect your application" → Copy the connection string
6. Replace `<password>` with your database user password

**Getting Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 5. Build the Frontend

```bash
cd frontend
npm run build
cd ..
```

This creates the production-ready files in `frontend/dist/` which the backend will serve.

### 6. Seed the Database (Optional but Recommended)

Populate the database with sample data:

```bash
npm run seed
```

This will create:
- 3 sample users (username: `norm_niner`, password: `password123`)
- User preferences and budget data
- 6 campus restaurants with operating hours
- Sample transactions

### 7. Start the Backend Server

```bash
npm start
```

The server will start on `http://127.0.0.1:8080`

You should see:
```
Server is running on port 8080
Connected to MongoDB successfully
Database seeded successfully!
```

### 8. Access the Application

Open your web browser and navigate to:
```
http://127.0.0.1:8080
```

or

```
http://localhost:8080
```

## Application Features

### 1. Restaurant Discovery
- Browse all campus dining locations
- Filter by:
  - Status (Open/Closed/All)
  - Keywords (cuisine types)
  - Search text (name/description)
- View real-time open/closed status
- See operating hours for each restaurant

### 2. Budget Management
- Track your spending across different time periods (daily/weekly/monthly)
- Add new transactions
- View spending history
- See visual budget progress bar
- Get percentage of budget used

### 3. Budget Insights & Recommendations
- View spending patterns over the last 30 days
- Get personalized budget recommendations
- See top spending locations
- Track average daily spending
- Get projected monthly spending

### 4. AI-Powered Recipe Suggestions
- Get personalized recipe recommendations
- Based on your dietary preferences and budget
- View ingredients with cost breakdown
- Step-by-step cooking instructions
- Total recipe cost calculation

## API Endpoints

### Restaurants
- `GET /api/get_restaurants` - Get all restaurants with open/closed status
- `GET /api/restaurants/open` - Get only open restaurants
- `GET /api/get_filtered-restaurant?q=search&keywords=tag` - Search restaurants

### Budget
- `GET /api/budget/:userId` - Get user's budget information
- `PUT /api/budget/:userId` - Update user's budget settings
- `POST /api/budget` - Add new spending transaction
- `GET /api/budget/:userId/insights` - Get budget insights and recommendations

### Recipes
- `GET /api/recipe?userId=:userId&limit=2` - Get recipe suggestions
- `POST /api/recipe` - Generate a detailed recipe
  ```json
  {
    "userId": "user_id_here",
    "prompt": "chicken and rice bowl",
    "cuisine": "Mexican",
    "mealType": "dinner"
  }
  ```

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions/:id` - Delete transaction

### User Profile
- `GET /api/profile` - Get all users
- `POST /api/profile` - Create new user

### User Data
- `GET /api/userdata` - Get all user data
- `GET /api/userdata/:id` - Get user data by ID
- `GET /api/userdata/user/:userId` - Get user data by user ID
- `POST /api/userdata` - Create user data
- `PUT /api/userdata/:id` - Update user data
- `DELETE /api/userdata/:id` - Delete user data

## Testing the Application

### Using the Web Interface
1. Navigate to `http://localhost:8080`
2. Browse restaurants using filters
3. View your budget summary
4. Add transactions
5. View budget insights
6. Get recipe recommendations

### Using API Testing Tools (Postman/Thunder Client/curl)

**Test restaurant endpoint:**
```bash
curl http://localhost:8080/api/get_restaurants
```

**Test budget insights:**
```bash
curl http://localhost:8080/api/budget/507f1f77bcf86cd799439011/insights
```

**Test recipe generation:**
```bash
curl -X POST http://localhost:8080/api/recipe \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011",
    "prompt": "quick pasta dinner",
    "cuisine": "Italian",
    "mealType": "dinner"
  }'
```

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Make sure you've installed dependencies:
```bash
npm install
cd frontend && npm install && cd ..
```

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Check your `.env` file has the correct `MONGO_URI`
- Verify your IP address is whitelisted in MongoDB Atlas Network Access
- Ensure your database user credentials are correct

### Issue: "Failed to load restaurants" in the UI
**Solution:**
- Ensure the backend server is running on port 8080
- Check browser console for errors
- Verify the frontend was built: `cd frontend && npm run build`

### Issue: Recipe endpoint returns empty or error
**Solution:**
- Ensure `GEMINI_API_KEY` is set in your `.env` file
- Verify the API key is valid
- Check you haven't exceeded API rate limits

### Issue: Frontend shows blank page
**Solution:**
- Rebuild the frontend: `cd frontend && npm run build && cd ..`
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check browser console for JavaScript errors

## Development Mode

For development with hot-reload:

### Backend (with nodemon):
```bash
npx nodemon index.js
```

### Frontend (development server):
```bash
cd frontend
npm run dev
```

This will start the frontend on `http://localhost:5173` with hot-reload enabled.

**Note:** When running frontend in dev mode, you'll need to ensure CORS is properly configured to allow requests from port 5173 to 8080.

## Project Structure

```
CCI-Startup-Project/
├── controllers/          # API route handlers
│   ├── budgetController.js
│   ├── recipeController.js
│   ├── restaurantController.js
│   ├── transactionController.js
│   ├── userController.js
│   ├── userDataController.js
│   └── index.js
├── models/              # MongoDB schemas
│   ├── user.js
│   ├── userData.js
│   ├── restaurants.js
│   └── transactions.js
├── endpoints/           # Route definitions
│   ├── api.js
│   └── index.js
├── frontend/            # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── dist/           # Built frontend (served by backend)
├── index.js            # Express server entry point
├── seed.js             # Database seeding script
├── runSeed.js          # Seed script runner
├── config.js           # Configuration
├── package.json        # Backend dependencies
└── .env               # Environment variables (not in git)
```

## Presentation Slides

To view the 5-minute presentation slides:

```bash
# Open in your default browser (macOS)
open presentation.html

# Open in your default browser (Windows)
start presentation.html

# Open in your default browser (Linux)
xdg-open presentation.html
```

Or simply drag and drop `presentation.html` into your web browser.

**Navigation:**
- Use arrow keys (← →) or click Previous/Next buttons
- Press Space to advance to the next slide
- Slide counter shows current position (e.g., "3 / 10")

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/Ashleigh0204/CCI-Startup-Project/issues)
- Review the API documentation in `API_TESTING_GUIDE.md`
- Check recipe feature documentation in `RECIPE_FEATURE_DOCS.md`

## Team

Built with ❤️ by Ashleigh, Hafsa, and Toya for the CCI Startup Hackathon 2025.
