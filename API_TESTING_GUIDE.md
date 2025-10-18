# API Testing Guide

## 🧪 Manual Testing Commands

### Base URL
```
http://127.0.0.1:8080/api
```

### 1. Restaurant Endpoints

**Get all restaurants:**
```bash
curl http://127.0.0.1:8080/api/get_restaurants
```

**Search restaurants:**
```bash
curl "http://127.0.0.1:8080/api/get_filtered-restaurant?q=pizza"
curl "http://127.0.0.1:8080/api/get_filtered-restaurant?keywords=fast food,burgers"
```

**Get open restaurants:**
```bash
curl http://127.0.0.1:8080/api/restaurants/open
```

### 2. Transaction Endpoints

**Get all transactions:**
```bash
curl http://127.0.0.1:8080/api/transactions
```

**Create transaction:**
```bash
curl -X POST http://127.0.0.1:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount": 25.50, "user_id": "USER_ID_HERE", "location": "RESTAURANT_ID_HERE"}'
```

### 3. Budget Endpoints

**Get user budget:**
```bash
curl http://127.0.0.1:8080/api/budget/USER_ID_HERE
```

**Update budget:**
```bash
curl -X PUT http://127.0.0.1:8080/api/budget/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"budgetAmount": 150, "timeUnit": "weekly"}'
```

**Add spending:**
```bash
curl -X POST http://127.0.0.1:8080/api/budget \
  -H "Content-Type: application/json" \
  -d '{"amount": 15.75, "locationId": "RESTAURANT_ID_HERE"}'
```

### 4. Recipe Endpoints

**Get recipe suggestions:**
```bash
curl "http://127.0.0.1:8080/api/recipe?userId=USER_ID_HERE&limit=3"
```

**Generate recipe:**
```bash
curl -X POST http://127.0.0.1:8080/api/recipe \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID_HERE", "prompt": "healthy chicken dinner", "cuisine": "Mediterranean"}'
```

### 5. Profile Endpoints

**Get all users:**
```bash
curl http://127.0.0.1:8080/api/profile
```

**Create user:**
```bash
curl -X POST http://127.0.0.1:8080/api/profile \
  -H "Content-Type: application/json" \
  -d '{"username": "newuser", "password": "password123"}'
```

## 🔍 Response Format

All endpoints return JSON in this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "count": 5
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🎯 Quick Test IDs

To get test IDs, run:
```bash
# Get user ID
curl -s http://127.0.0.1:8080/api/profile | jq '.data[0]._id'

# Get restaurant ID
curl -s http://127.0.0.1:8080/api/get_restaurants | jq '.data[0]._id'
```

## Automated Testing

Run the automated test script:
```bash
./test-routes.sh
```

