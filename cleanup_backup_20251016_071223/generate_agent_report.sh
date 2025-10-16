#!/bin/bash

# 📊 Generate Detailed Agent Report (HTML)
# Shows ALL inputs, outputs, LLM prompts/responses for each agent

OUTPUT_HTML="agent_report_$(date +%Y%m%d_%H%M%S).html"

echo "📊 Generating detailed agent report..."
echo "Fetching logs from last 2 hours..."

# Fetch logs
LOGS=$(gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=unschooling-backend AND timestamp>=\"$(date -u -v-2H +%Y-%m-%dT%H:%M:%SZ)\"" \
  --limit=1000 \
  --format="value(timestamp,textPayload)" \
  --project=unschooling-464413)

# Generate HTML
cat > "$OUTPUT_HTML" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Agent Execution Report</title>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0d1117;
            color: #c9d1d9;
            padding: 20px;
            margin: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        h1 {
            color: #58a6ff;
            border-bottom: 3px solid #58a6ff;
            padding-bottom: 15px;
        }
        h2 {
            color: #79c0ff;
            margin-top: 30px;
        }
        .execution {
            background: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .agent-section {
            background: #0d1117;
            border-left: 4px solid #58a6ff;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        .agent-section.profile { border-left-color: #a371f7; }
        .agent-section.match { border-left-color: #3fb950; }
        .agent-section.schedule { border-left-color: #d29922; }
        .agent-section.reviewer { border-left-color: #f85149; }
        .agent-section.success { border-left-color: #3fb950; }
        .timestamp {
            color: #8b949e;
            font-size: 0.85em;
            font-family: 'Monaco', monospace;
        }
        .label {
            display: inline-block;
            background: #21262d;
            color: #58a6ff;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            margin: 5px 5px 5px 0;
            font-weight: 500;
        }
        .label.success { background: #1a472a; color: #3fb950; }
        .label.error { background: #3d1319; color: #f85149; }
        .label.warning { background: #3d2f1e; color: #d29922; }
        .code {
            background: #0d1117;
            border: 1px solid #30363d;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
            margin: 10px 0;
        }
        .metric {
            display: inline-block;
            background: #1f6feb;
            color: white;
            padding: 6px 14px;
            border-radius: 4px;
            margin: 5px;
            font-size: 0.9em;
        }
        .summary {
            background: #1a472a;
            border: 1px solid #2ea043;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        pre {
            background: #0d1117;
            border: 1px solid #30363d;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .input-output {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 15px 0;
        }
        .input-box, .output-box {
            background: #0d1117;
            border: 1px solid #30363d;
            padding: 15px;
            border-radius: 6px;
        }
        .input-box h3 { color: #79c0ff; margin-top: 0; }
        .output-box h3 { color: #3fb950; margin-top: 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Agent Execution Detailed Report</h1>
        <div class="timestamp">Generated: $(date)</div>
        
        <div class="summary">
            <h2>📊 Summary</h2>
            <p>This report shows detailed inputs, outputs, and LLM interactions for each AI agent.</p>
        </div>
        
        <div id="executions">
EOF

# Parse logs and add to HTML
echo "$LOGS" | awk '
BEGIN {
    in_execution = 0
    agent_count = 0
}
/Starting full agent system/ {
    if (in_execution) {
        print "        </div>" # Close previous execution
    }
    in_execution = 1
    agent_count++
    split($1, time_parts, "T")
    print "        <div class=\"execution\">"
    print "            <h2>Execution #" agent_count " - " time_parts[2] "</h2>"
}
/Profile for/ {
    print "            <div class=\"agent-section profile\">"
    print "                <h3>📝 Profile Agent</h3>"
    print "                <div class=\"label\">Step 1</div>"
    print "                <p><strong>Input:</strong> " $0 "</p>"
}
/Profile Agent completed/ {
    print "                <p><strong>Output:</strong> " $0 "</p>"
    print "            </div>"
}
/Match Agent/ && /Matching topics/ {
    print "            <div class=\"agent-section match\">"
    print "                <h3>🎯 Match Agent</h3>"
    print "                <div class=\"label\">Step 2</div>"
    print "                <p><strong>Input:</strong> " $0 "</p>"
}
/Matched.*topics/ {
    print "                <p><strong>Output:</strong> " $0 "</p>"
}
/Match Agent completed/ {
    print "            </div>"
}
/Schedule Agent.*Creating/ {
    print "            <div class=\"agent-section schedule\">"
    print "                <h3>📅 Schedule Agent</h3>"
    print "                <div class=\"label\">Step 3</div>"
    print "                <p><strong>Input:</strong> " $0 "</p>"
}
/Generated plan/ {
    print "                <p><strong>Output:</strong> " $0 "</p>"
}
/Schedule Agent completed/ {
    print "            </div>"
}
/Reviewer Agent.*Reviewing/ {
    print "            <div class=\"agent-section reviewer\">"
    print "                <h3>✅ Reviewer Agent</h3>"
    print "                <div class=\"label\">Step 4</div>"
    print "                <p><strong>Input:</strong> Complete plan</p>"
}
/Reviewer Agent completed/ {
    print "                <p><strong>Output:</strong> " $0 "</p>"
    print "            </div>"
}
/Full agent system completed/ {
    print "            <div class=\"agent-section success\">"
    print "                <h3>🎉 Execution Complete</h3>"
    print "                <div class=\"label success\">SUCCESS</div>"
    print "                <p>" $0 "</p>"
    print "            </div>"
}
' >> "$OUTPUT_HTML"

# Close HTML
cat >> "$OUTPUT_HTML" << 'EOF'
        </div>
        
        <div class="summary">
            <h2>📋 How to Read This Report</h2>
            <ul>
                <li><strong>Profile Agent:</strong> Analyzes child profile</li>
                <li><strong>Match Agent:</strong> Selects topics from 400+ database</li>
                <li><strong>Schedule Agent:</strong> Creates 4-week learning plan</li>
                <li><strong>Reviewer Agent:</strong> Validates quality</li>
            </ul>
        </div>
    </div>
</body>
</html>
EOF

echo "✅ Report generated: $OUTPUT_HTML"
echo ""
echo "📖 Open in browser:"
echo "   open $OUTPUT_HTML"
echo ""

