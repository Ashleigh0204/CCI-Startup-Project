# Forty Knives and Forks

A comprehensive restaurant discovery and budget management platform developed for the 2025 CCI Startup Hackathon.

## Overview

Forty Knives and Forks is a full-stack web application that helps users discover restaurants, manage their dining budget, and get personalized recipe recommendations. The platform combines restaurant discovery with intelligent budget tracking and AI-powered recipe generation.

## Features

### Restaurant Discovery
- Browse restaurants with real-time availability status
- Filter restaurants by keywords, status (open/closed), and search terms
- View detailed restaurant information including hours, descriptions, and keywords
- Smart time display showing closing times or next opening times

### Budget Management
- Set and adjust daily, weekly, or monthly dining budgets
- Track spending across all dining transactions
- Visual budget progress indicators with color-coded status
- Transaction history with detailed spending breakdowns
- Real-time budget updates and notifications

### Recipe Recommendations
- AI-powered recipe generation using Google Gemini API
- Personalized recipes based on user preferences and dietary restrictions
- Ingredient cost calculation and grocery store integration
- Recipe viewing with step-by-step instructions
- Ingredient purchasing with automatic transaction recording

### User Profile Management
- Comprehensive user profiles with dietary preferences
- Customizable budget settings and time periods
- Preference tracking for personalized recommendations
- Profile editing with real-time updates

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM for data persistence
- **Google Gemini AI** for recipe generation
- **RESTful API** architecture
- **CORS** enabled for cross-origin requests

### Frontend
- **React 19** with modern hooks and functional components
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **Component-based architecture** with reusable UI elements

### Key Dependencies
- `@google/generative-ai` - AI recipe generation
- `mongoose` - MongoDB object modeling
- `express` - Web application framework
- `cors` - Cross-origin resource sharing
- `bcrypt` - Password hashing
- `dotenv` - Environment variable management

## Project Structure

```
CCI-Startup-Project/
├── controllers/           # API route handlers
│   ├── budgetController.js
│   ├── recipeController.js
│   ├── restaurantController.js
│   ├── transactionController.js
│   ├── userController.js
│   └── userDataController.js
├── endpoints/             # API route definitions
│   ├── api.js
│   └── index.js
├── models/                # Database schemas
│   ├── restaurants.js
│   ├── transactions.js
│   ├── user.js
│   └── userData.js
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main application component
│   ├── package.json
│   └── vite.config.js
├── seed.js                # Database seeding script
├── runSeed.js             # Seed execution script
├── index.js               # Main server entry point
└── package.json           # Backend dependencies
```

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Google Gemini API key

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CCI-Startup-Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   PORT=8080
   ```

4. **Database Seeding**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## API Documentation

### Restaurant Endpoints
- `GET /api/get_restaurants` - Retrieve all restaurants
- `GET /api/restaurants/search` - Search restaurants by keywords
- `GET /api/restaurants/open` - Get currently open restaurants

### Budget Endpoints
- `GET /api/budget/:userId` - Get user budget information
- `PUT /api/budget/:userId` - Update user budget settings

### Transaction Endpoints
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Recipe Endpoints
- `POST /api/recipe` - Generate personalized recipe
- `GET /api/recipe/suggestions` - Get recipe suggestions

### User Data Endpoints
- `GET /api/userdata/user/:userId` - Get user profile data
- `PUT /api/userdata/:id` - Update user profile
- `POST /api/userdata` - Create user profile

## Database Schema

### Users
- User authentication and basic information
- Profile management and preferences

### UserData
- Extended user preferences
- Budget settings and dietary restrictions
- Recipe preferences and goals

### Restaurants
- Restaurant information and hours
- Keywords and descriptions
- Real-time availability status

### Transactions
- Spending records with amounts and locations
- Timestamps and user associations
- Budget impact tracking

## Development Guidelines

### Code Style
- Use ES6+ JavaScript features
- Follow React functional component patterns
- Implement proper error handling
- Use meaningful variable and function names

### Component Architecture
- Reusable UI components in `/components`
- Page-specific components in `/pages`
- Proper prop passing and state management
- Consistent styling with Tailwind CSS

### API Design
- RESTful endpoint naming conventions
- Consistent response formats
- Proper HTTP status codes
- Input validation and error handling

## Testing

### Manual Testing
- Test all CRUD operations for each entity
- Verify budget calculations and updates
- Test recipe generation with different inputs
- Validate restaurant filtering and search functionality

### API Testing
Use the provided test scripts:
- `test-cors.sh` - CORS configuration testing
- `test-routes.sh` - Route functionality testing
- `test-frontend-fix.sh` - Frontend integration testing

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables
3. Deploy to cloud platform (Heroku, AWS, etc.)
4. Run database seeding

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure API endpoints for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Team

- **Ashleigh Sico** - Frontend Development
  - React component architecture and UI/UX design
  - Frontend state management and user interface implementation
  - Client-side application logic and user experience optimization

- **Toya Okey-Nwamara** - Database Setup and Integration
  - MongoDB database design and schema implementation
  - Database seeding and data management
  - Backend-frontend integration and API connectivity

- **Hafsa Konain** - Backend Development and Quality Features
  - Backend router setup and API endpoint implementation
  - Quality filtering features and business logic
  - Server-side architecture and data processing

## License

This project is licensed under the ISC License.

## Acknowledgments

- Google Gemini AI for recipe generation capabilities
- MongoDB for database services
- React and Vite communities for excellent development tools
- Tailwind CSS for rapid UI development

## Future Roadmap

### Phase 1: Core Improvements (Next 3 months)
- **User Authentication System**
  - JWT-based authentication with secure login/logout
  - User registration and profile management
  - Password reset and account recovery features
  - Role-based access control for different user types

- **Enhanced Budget Analytics**
  - Detailed spending reports and visualizations
  - Budget trend analysis and forecasting
  - Spending category breakdowns
  - Monthly and yearly budget comparisons

- **Improved Recipe System**
  - Recipe rating and review system
  - User recipe collections and favorites
  - Nutritional information integration
  - Cooking time and difficulty level indicators

### Phase 2: Social Features (3-6 months)
- **Community Features**
  - User profiles with dining preferences
  - Restaurant review and rating system
  - Social sharing of favorite restaurants and recipes
  - User-generated content and recommendations

- **Advanced Filtering**
  - Price range filtering for restaurants
  - Dietary restriction filtering
  - Distance-based restaurant discovery
  - Real-time availability updates

### Phase 3: Mobile and Integration (6-9 months)
- **Mobile Application**
  - Native iOS and Android applications
  - Offline functionality for basic features
  - Push notifications for budget alerts
  - Location-based restaurant discovery

- **Third-Party Integrations**
  - Food delivery service integration (Uber Eats, DoorDash)
  - Payment processing integration
  - Calendar integration for meal planning
  - Grocery store inventory checking

### Phase 4: Advanced Features (9-12 months)
- **Machine Learning Integration**
  - Personalized restaurant recommendations
  - Predictive budget analysis
  - Smart meal planning suggestions
  - Dynamic pricing optimization

- **Business Intelligence**
  - Restaurant analytics dashboard
  - Market trend analysis
  - User behavior insights
  - Revenue optimization tools

### Phase 5: Enterprise Features (12+ months)
- **Multi-tenant Architecture**
  - Support for multiple cities and regions
  - Franchise and chain restaurant management
  - Corporate account features
  - Bulk user management

- **API Marketplace**
  - Public API for third-party developers
  - Plugin system for custom features
  - White-label solutions
  - Enterprise integrations

### Technical Debt and Infrastructure
- **Performance Optimization**
  - Database query optimization
  - Caching implementation (Redis)
  - CDN integration for static assets
  - Load balancing and scaling

- **Code Quality**
  - Comprehensive test coverage (unit, integration, e2e)
  - Code documentation and API documentation
  - CI/CD pipeline implementation
  - Security audit and penetration testing

- **Monitoring and Analytics**
  - Application performance monitoring
  - User analytics and behavior tracking
  - Error tracking and logging
  - Business metrics dashboard