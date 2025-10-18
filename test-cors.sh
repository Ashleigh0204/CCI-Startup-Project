#!/bin/bash

echo "Testing CORS Configuration"
echo "============================="

# Test CORS preflight request
echo "Testing CORS preflight (OPTIONS)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  http://127.0.0.1:8080/api/get_restaurants)

if [ "$RESPONSE" = "204" ]; then
    echo "CORS preflight: PASS"
else
    echo "CORS preflight: FAIL (HTTP $RESPONSE)"
fi

echo "Testing API call with CORS headers..."
API_RESPONSE=$(curl -s -H "Origin: http://localhost:5173" http://127.0.0.1:8080/api/get_restaurants)
RESTAURANT_COUNT=$(echo "$API_RESPONSE" | jq '.data | length' 2>/dev/null)

if [ "$RESTAURANT_COUNT" -gt 0 ]; then
    echo "API call: PASS (Found $RESTAURANT_COUNT restaurants)"
else
    echo "API call: FAIL"
fi

echo
echo "Your frontend should now be able to access the API!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://127.0.0.1:8080"
