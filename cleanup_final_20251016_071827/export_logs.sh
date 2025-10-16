#!/bin/bash

# 📊 Export Agent Logs to Readable File

OUTPUT_FILE="agent_logs_$(date +%Y%m%d_%H%M%S).txt"

echo "📊 Exporting agent logs to: $OUTPUT_FILE"
echo ""

# Create readable log file
{
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🧪 AGENT EXECUTION LOGS"
    echo "Generated: $(date)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Get logs from last hour
    gcloud logging read \
      "resource.type=cloud_run_revision AND resource.labels.service_name=unschooling-backend AND timestamp>=\"$(date -u -v-1H +%Y-%m-%dT%H:%M:%SZ)\"" \
      --limit=500 \
      --format="value(timestamp,textPayload)" \
      --project=unschooling-464413 \
      | while IFS=$'\t' read -r timestamp message; do
        # Format timestamp
        time=$(echo "$timestamp" | sed 's/T/ /' | cut -d'.' -f1)
        
        # Print formatted log
        if [[ $message == *"🚀 Starting full agent system"* ]]; then
            echo ""
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "🚀 NEW PLAN GENERATION"
            echo "Time: $time"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        elif [[ $message == *"Step"* ]] || [[ $message == *"Agent"* ]] || [[ $message == *"Profile for"* ]] || [[ $message == *"Matched"* ]] || [[ $message == *"Generated"* ]]; then
            echo "[$time] $message"
        fi
      done
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "END OF LOGS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
} > "$OUTPUT_FILE"

echo "✅ Logs exported to: $OUTPUT_FILE"
echo ""
echo "📖 View logs:"
echo "   cat $OUTPUT_FILE"
echo ""
echo "📝 Or open in text editor:"
echo "   open $OUTPUT_FILE"
echo ""

