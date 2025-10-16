#!/bin/bash

# 📊 Simple Agent Log Viewer
# Makes Cloud Run logs easy to read

echo "🔍 ===== AGENT LOGS VIEWER ====="
echo ""
echo "Fetching logs from last 30 minutes..."
echo ""

# Fetch logs and format nicely
gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=unschooling-backend AND timestamp>=\"$(date -u -v-30M +%Y-%m-%dT%H:%M:%SZ)\"" \
  --limit=200 \
  --format="value(timestamp,textPayload)" \
  --project=unschooling-464413 \
  | while IFS=$'\t' read -r timestamp message; do
    # Convert timestamp to readable format
    time=$(echo "$timestamp" | cut -d'T' -f2 | cut -d'.' -f1)
    
    # Color code different log types
    if [[ $message == *"🚀 Starting full agent system"* ]]; then
      echo ""
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo "🚀 NEW PLAN GENERATION - $time"
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    elif [[ $message == *"Step 1: Profile Agent"* ]]; then
      echo ""
      echo "📝 STEP 1: PROFILE AGENT - $time"
    elif [[ $message == *"Step 2: Match Agent"* ]]; then
      echo ""
      echo "🎯 STEP 2: MATCH AGENT - $time"
    elif [[ $message == *"Step 3: Schedule Agent"* ]]; then
      echo ""
      echo "📅 STEP 3: SCHEDULE AGENT - $time"
    elif [[ $message == *"Step 4: Reviewer Agent"* ]]; then
      echo ""
      echo "✅ STEP 4: REVIEWER AGENT - $time"
    elif [[ $message == *"✅ Full agent system completed"* ]]; then
      echo ""
      echo "🎉 COMPLETED SUCCESSFULLY - $time"
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo ""
    elif [[ $message == *"Matched topics:"* ]]; then
      echo "   $message"
    elif [[ $message == *"Profile for"* ]]; then
      echo "   $message"
    elif [[ $message == *"Generated plan"* ]]; then
      echo "   $message"
    elif [[ $message == *"ERROR"* ]] || [[ $message == *"❌"* ]]; then
      echo "   ❌ ERROR: $message"
    elif [[ $message == *"completed in"* ]]; then
      echo "   ⏱️  $message"
    fi
  done

echo ""
echo "📊 ===== END OF LOGS ====="
echo ""
echo "💡 To see live updates, run:"
echo "   ./view_agent_logs.sh"
echo ""

