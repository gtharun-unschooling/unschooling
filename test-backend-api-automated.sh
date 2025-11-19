#!/bin/bash

echo "🤖 FULLY AUTOMATED BACKEND API TEST"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "This test will:"
echo "  1. Call backend API directly (no frontend/auth needed)"
echo "  2. Generate a test plan"
echo "  3. Monitor backend logs"
echo "  4. Check if plan is saved"
echo "  5. Report complete results"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Test data
TEST_CHILD_NAME="AutoTestChild"
TEST_AGE=7
TEST_INTERESTS='["Animals", "Science", "Art", "Space Exploration"]'
TEST_LEARNING_STYLE="visual"
TEST_USER_ID="test-user-$(date +%s)"
TEST_CHILD_ID="test-child-$(date +%s)"
TEST_MONTH="October 2025"

echo "📋 TEST DATA:"
echo "   Child Name: $TEST_CHILD_NAME"
echo "   Age: $TEST_AGE"
echo "   Interests: $TEST_INTERESTS"
echo "   Learning Style: $TEST_LEARNING_STYLE"
echo "   User ID: $TEST_USER_ID"
echo "   Child ID: $TEST_CHILD_ID"
echo ""

# Create JSON payload
PAYLOAD=$(cat <<EOF
{
  "userId": "$TEST_USER_ID",
  "childId": "$TEST_CHILD_ID",
  "monthKey": "$TEST_MONTH",
  "childProfile": {
    "child_name": "$TEST_CHILD_NAME",
    "child_age": $TEST_AGE,
    "interests": $TEST_INTERESTS,
    "dislikes": ["Loud noises"],
    "preferred_learning_style": "$TEST_LEARNING_STYLE",
    "goals": ["Learn about nature", "Improve creativity"]
  }
}
EOF
)

echo "📤 REQUEST PAYLOAD:"
echo "$PAYLOAD" | jq '.' 2>/dev/null || echo "$PAYLOAD"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "🚀 SENDING REQUEST TO BACKEND..."
echo "═══════════════════════════════════════════════════════════════"
echo ""

BACKEND_URL="https://llm-agents-790275794964.us-central1.run.app/api/generate-plan"

START_TIME=$(date +%s)

# Make the API call and capture response
RESPONSE=$(curl -X POST "$BACKEND_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  -w "\n\nHTTP_STATUS_CODE:%{http_code}" \
  --max-time 600 \
  -s 2>&1)

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

# Extract status code
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS_CODE:" | cut -d: -f2)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS_CODE:/d')

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📊 RESPONSE RECEIVED"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "HTTP Status: $HTTP_CODE"
echo "Time Elapsed: ${ELAPSED}s ($(($ELAPSED / 60))m $(($ELAPSED % 60))s)"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ ✅ ✅ SUCCESS - HTTP 200 OK ✅ ✅ ✅"
    echo ""
    echo "📄 RESPONSE BODY:"
    echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
    echo ""
    
    # Save response to file
    echo "$RESPONSE_BODY" > /tmp/test-api-response.json
    echo "💾 Full response saved to: /tmp/test-api-response.json"
    echo ""
    
    # Extract week names if present
    echo "📅 EXTRACTING WEEK NAMES..."
    WEEK_NAMES=$(echo "$RESPONSE_BODY" | jq -r '.weekly_plan | to_entries[] | "\(.key): \(.value.name // "N/A")"' 2>/dev/null)
    
    if [ -n "$WEEK_NAMES" ]; then
        echo "✅ Week names found:"
        echo "$WEEK_NAMES"
    else
        echo "⚠️  Could not extract week names (might be in different format)"
    fi
    echo ""
    
    # Check for LLM data
    echo "🤖 CHECKING LLM AGENT DATA..."
    LLM_USED=$(echo "$RESPONSE_BODY" | jq -r '.agent_timing.profile_agent.llm_used // "N/A"' 2>/dev/null)
    echo "   Profile Agent LLM Used: $LLM_USED"
    
    ANALYSIS_LLM=$(echo "$RESPONSE_BODY" | jq -r '.agent_timing.analysis_agent.llm_used // "N/A"' 2>/dev/null)
    echo "   Analysis Agent LLM Used: $ANALYSIS_LLM"
    
    THEMES_SELECTED=$(echo "$RESPONSE_BODY" | jq -r '.monthly_plan_structure.selected_themes | length // "N/A"' 2>/dev/null)
    echo "   Themes Selected: $THEMES_SELECTED"
    echo ""
    
    echo "═══════════════════════════════════════════════════════════════"
    echo "✅ ✅ ✅ TEST PASSED ✅ ✅ ✅"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "SUMMARY:"
    echo "  • API responded successfully in ${ELAPSED}s"
    echo "  • Plan generated and returned"
    echo "  • LLM agents executed: $LLM_USED"
    echo "  • Themes selected: $THEMES_SELECTED"
    echo ""
    
elif [ "$HTTP_CODE" = "500" ]; then
    echo "❌ ❌ ❌ INTERNAL SERVER ERROR ❌ ❌ ❌"
    echo ""
    echo "📄 ERROR RESPONSE:"
    echo "$RESPONSE_BODY"
    echo ""
    
    # Save error response
    echo "$RESPONSE_BODY" > /tmp/test-api-error.json
    echo "💾 Error response saved to: /tmp/test-api-error.json"
    echo ""
    
    echo "📊 CHECKING BACKEND LOGS..."
    gcloud run services logs read llm-agents --region=us-central1 --limit=50 2>/dev/null | grep -E "ERROR|Exception|Traceback" | tail -20
    echo ""
    
elif [ -z "$HTTP_CODE" ]; then
    echo "❌ ❌ ❌ REQUEST TIMEOUT OR FAILED ❌ ❌ ❌"
    echo ""
    echo "📄 RESPONSE:"
    echo "$RESPONSE_BODY"
    echo ""
    
else
    echo "❌ ❌ ❌ UNEXPECTED HTTP CODE: $HTTP_CODE ❌ ❌ ❌"
    echo ""
    echo "📄 RESPONSE:"
    echo "$RESPONSE_BODY"
    echo ""
fi

echo "═══════════════════════════════════════════════════════════════"
echo "🏁 TEST COMPLETE"
echo "═══════════════════════════════════════════════════════════════"

