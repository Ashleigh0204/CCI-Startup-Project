#!/bin/bash

echo "🧪 Testing All API Routes"
echo "========================="

BASE_URL="http://127.0.0.1:8080/api"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -n "Testing $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s "$BASE_URL$endpoint")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$data")
    fi
    
    # Check if response contains success:true
    if echo "$response" | grep -q '"success":true'; then
        echo -e "${GREEN} PASS${NC}"
        echo "   Response: $(echo "$response" | jq -r '.message // .count // "OK"' 2>/dev/null || echo "Valid JSON")"
    else
        echo -e "${RED} FAIL${NC}"
        echo "   Error: $(echo "$response" | jq -r '.message // .error // "Invalid response"' 2>/dev/null || echo "$response")"
    fi
    echo
}

# Get a user ID for testing
echo "Getting test user ID..."
USER_ID=$(curl -s "$BASE_URL/profile" | jq -r '.data[0]._id' 2>/dev/null)
if [ "$USER_ID" = "null" ] || [ -z "$USER_ID" ]; then
    echo -e "${RED} Could not get user ID${NC}"
    exit 1
fi
echo -e "${GREEN} Using user ID: $USER_ID${NC}"
echo

# Test Restaurant Endpoints
echo -e "${YELLOW}🏪 RESTAURANT ENDPOINTS${NC}"
test_endpoint "GET" "/get_restaurants" "" "Get all restaurants"
test_endpoint "GET" "/get_filtered-restaurant?q=pizza" "" "Search restaurants (pizza)"
test_endpoint "GET" "/restaurants/open" "" "Get open restaurants"

# Test Transaction Endpoints
echo -e "${YELLOW} TRANSACTION ENDPOINTS${NC}"
test_endpoint "GET" "/transactions" "" "Get all transactions"

# Test Budget Endpoints
echo -e "${YELLOW} BUDGET ENDPOINTS${NC}"
test_endpoint "GET" "/budget/$USER_ID" "" "Get user budget"
test_endpoint "PUT" "/budget/$USER_ID" '{"budgetAmount": 100}' "Update user budget"

# Test Recipe Endpoints
echo -e "${YELLOW}🍳 RECIPE ENDPOINTS${NC}"
test_endpoint "GET" "/recipe?userId=$USER_ID&limit=2" "" "Get recipe suggestions"
test_endpoint "POST" "/recipe" "{\"userId\": \"$USER_ID\", \"prompt\": \"healthy chicken dinner\"}" "Generate recipe"

# Test Profile Endpoints
echo -e "${YELLOW} PROFILE ENDPOINTS${NC}"
test_endpoint "GET" "/profile" "" "Get all users"
test_endpoint "POST" "/profile" '{"username": "testuser", "password": "testpass123"}' "Create new user"

echo -e "${GREEN} Testing Complete!${NC}"
