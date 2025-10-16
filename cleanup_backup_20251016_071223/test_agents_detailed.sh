#!/bin/bash

# 🧪 DETAILED AGENT TESTING SCRIPT
# Test each AI agent and see their inputs/outputs

echo "🧪 ===== AGENT TESTING STARTED ====="
echo ""

# Backend URL
BACKEND_URL="https://llm-agents-44gsrw22gq-uc.a.run.app"

# Test profile
TEST_PROFILE='{
  "child_name": "Emma",
  "child_age": 6,
  "interests": ["AI", "Music", "Art"],
  "dislikes": ["Math"],
  "preferred_learning_style": "visual",
  "goals": ["creativity", "problem-solving"],
  "plan_type": "hybrid"
}'

echo "📋 Test Profile:"
echo "$TEST_PROFILE" | python3 -m json.tool
echo ""
echo "─────────────────────────────────────────"
echo ""

# Test 1: Health Check
echo "🏥 TEST 1: Backend Health Check"
echo "URL: $BACKEND_URL/health"
echo ""
curl -s "$BACKEND_URL/health" | python3 -m json.tool
echo ""
echo "─────────────────────────────────────────"
echo ""

# Test 2: Generate Plan (Full Agent Flow)
echo "🤖 TEST 2: Full Agent Flow"
echo "URL: $BACKEND_URL/api/generate-plan"
echo ""
echo "Calling all 4 agents in sequence..."
echo ""

# Save full response to file
curl -s -X POST "$BACKEND_URL/api/generate-plan" \
  -H "Content-Type: application/json" \
  -d "$TEST_PROFILE" \
  > /tmp/agent_response.json

# Display results
echo "✅ Response saved to: /tmp/agent_response.json"
echo ""
cat /tmp/agent_response.json | python3 -m json.tool
echo ""
echo "─────────────────────────────────────────"
echo ""

# Extract agent timings
echo "⏱️  AGENT EXECUTION TIMES:"
echo ""
cat /tmp/agent_response.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
if 'data' in data and 'agent_timings' in data['data']:
    timings = data['data']['agent_timings']
    print(f\"Profile Agent:   {timings.get('profile_agent', 'N/A')} seconds\")
    print(f\"Match Agent:     {timings.get('match_agent', 'N/A')} seconds\")
    print(f\"Schedule Agent:  {timings.get('schedule_agent', 'N/A')} seconds\")
    print(f\"Reviewer Agent:  {timings.get('reviewer_agent', 'N/A')} seconds\")
    print(f\"Total Time:      {timings.get('total_time', 'N/A')} seconds\")
else:
    print('No timing data available')
" 2>/dev/null || echo "Could not parse timings"
echo ""
echo "─────────────────────────────────────────"
echo ""

# Extract selected topics
echo "📚 SELECTED TOPICS (from Match Agent):"
echo ""
cat /tmp/agent_response.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
if 'data' in data and 'selected_topics' in data['data']:
    topics = data['data']['selected_topics']
    print(f\"Total topics matched: {len(topics)}\")
    print(\"\")
    for i, topic in enumerate(topics[:5], 1):  # Show first 5
        print(f\"{i}. {topic.get('title', 'N/A')}\")
        print(f\"   Niche: {topic.get('niche', 'N/A')}\")
        print(f\"   Age: {topic.get('age_group', 'N/A')}\")
        print(\"\")
else:
    print('No topics data available')
" 2>/dev/null || echo "Could not parse topics"
echo ""
echo "─────────────────────────────────────────"
echo ""

# Extract weekly plan structure
echo "📅 WEEKLY PLAN (from Schedule Agent):"
echo ""
cat /tmp/agent_response.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
if 'data' in data and 'weekly_plan' in data['data']:
    plan = data['data']['weekly_plan']
    print(f\"Total weeks: {len(plan)}\")
    print(\"\")
    for week_key in list(plan.keys())[:2]:  # Show first 2 weeks
        week = plan[week_key]
        print(f\"Week {week_key}:\")
        print(f\"  Theme: {week.get('theme', 'N/A')}\")
        print(f\"  Activities: {len(week.get('days', {}))}\")
        print(\"\")
else:
    print('No weekly plan available')
" 2>/dev/null || echo "Could not parse plan"
echo ""
echo "─────────────────────────────────────────"
echo ""

echo "🎉 ===== AGENT TESTING COMPLETED ====="
echo ""
echo "📁 Full response saved to: /tmp/agent_response.json"
echo "📖 View full response: cat /tmp/agent_response.json | python3 -m json.tool"
echo ""

