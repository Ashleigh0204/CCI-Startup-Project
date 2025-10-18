const cors = require('cors');
app.use(cors());#!/bin/bash

echo "Testing Fixed User ID Consistency"
echo "===================================="

FIXED_USER_ID="507f1f77bcf86cd799439011"

# Function to test user ID
test_user_id() {
    local iteration=$1
    echo "Test $iteration: Running seed..."
    
    # Run seed
    node runSeed.js > /dev/null 2>&1
    
    # Start server
    node index.js > /dev/null 2>&1 &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Get first user ID
    USER_ID=$(curl -s http://127.0.0.1:8080/api/profile | jq -r '.data[0]._id' 2>/dev/null)
    
    # Kill server
    kill $SERVER_PID 2>/dev/null
    
    # Check if ID matches
    if [ "$USER_ID" = "$FIXED_USER_ID" ]; then
        echo "PASS - User ID: $USER_ID"
    else
        echo "FAIL - Expected: $FIXED_USER_ID, Got: $USER_ID"
    fi
    echo
}

# Run multiple tests
for i in {1..3}; do
    test_user_id $i
done

echo "Fixed User ID: $FIXED_USER_ID"
echo "All tests completed!"
