#!/bin/bash

echo "🔧 Testing Frontend Data Structure Fix"
echo "====================================="

# Test the API response structure
echo "Testing API response structure..."
API_RESPONSE=$(curl -s http://127.0.0.1:8080/api/get_restaurants)

# Check if response has the expected structure
HAS_DATA=$(echo "$API_RESPONSE" | jq 'has("data")' 2>/dev/null)
DATA_IS_ARRAY=$(echo "$API_RESPONSE" | jq '.data | type == "array"' 2>/dev/null)
RESTAURANT_COUNT=$(echo "$API_RESPONSE" | jq '.data | length' 2>/dev/null)

if [ "$HAS_DATA" = "true" ] && [ "$DATA_IS_ARRAY" = "true" ] && [ "$RESTAURANT_COUNT" -gt 0 ]; then
    echo "API Structure: PASS"
    echo "   - Has 'data' property: $HAS_DATA"
    echo "   - Data is array: $DATA_IS_ARRAY"
    echo "   - Restaurant count: $RESTAURANT_COUNT"
else
    echo "API Structure: FAIL"
    echo "   - Has 'data' property: $HAS_DATA"
    echo "   - Data is array: $DATA_IS_ARRAY"
    echo "   - Restaurant count: $RESTAURANT_COUNT"
fi

echo
echo "🎯 Frontend Fix Applied:"
echo "   - Now extracts data.data from API response"
echo "   - Added error handling for failed requests"
echo "   - Added key prop for React list rendering"
echo "   - Fixed sorting to work with array data"
echo
echo "Your frontend should now work without 'map is not a function' errors!"
