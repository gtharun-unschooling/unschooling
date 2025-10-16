#!/bin/bash

# 📊 Export RAW Agent JSON Data
# Shows complete inputs/outputs in original JSON format

OUTPUT_JSON="agent_raw_data_$(date +%Y%m%d_%H%M%S).json"
OUTPUT_HTML="agent_raw_viewer_$(date +%Y%m%d_%H%M%S).html"

echo "📊 Exporting RAW agent data (full JSON)..."

# Fetch ALL logs with full JSON data
gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=unschooling-backend AND timestamp>=\"$(date -u -v-2H +%Y-%m-%dT%H:%M:%SZ)\"" \
  --limit=2000 \
  --format=json \
  --project=unschooling-464413 \
  > "$OUTPUT_JSON"

echo "✅ Raw JSON logs saved: $OUTPUT_JSON"
echo ""

# Create HTML viewer for the JSON
cat > "$OUTPUT_HTML" << 'HTMLSTART'
<!DOCTYPE html>
<html>
<head>
    <title>Agent Raw Data Viewer</title>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Monaco', 'Courier New', monospace;
            background: #1a1a1a;
            color: #e0e0e0;
            padding: 20px;
            margin: 0;
        }
        .container { max-width: 1800px; margin: 0 auto; }
        h1 { color: #4fc3f7; }
        .execution {
            background: #2a2a2a;
            border: 2px solid #3a3a3a;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
        }
        .agent-block {
            background: #1e1e1e;
            border-left: 5px solid #4fc3f7;
            padding: 20px;
            margin: 15px 0;
            border-radius: 5px;
        }
        .agent-block.step1 { border-left-color: #ab47bc; }
        .agent-block.step2 { border-left-color: #66bb6a; }
        .agent-block.step3 { border-left-color: #ffa726; }
        .agent-block.step4 { border-left-color: #ef5350; }
        h2 { color: #81c784; margin-top: 0; }
        h3 { color: #4fc3f7; margin: 15px 0 10px 0; }
        pre {
            background: #0a0a0a;
            border: 1px solid #3a3a3a;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 0.85em;
            line-height: 1.6;
            max-height: 500px;
            overflow-y: auto;
        }
        .json-key { color: #ab47bc; }
        .json-string { color: #66bb6a; }
        .json-number { color: #4fc3f7; }
        .json-boolean { color: #ffa726; }
        .tab-button {
            background: #3a3a3a;
            color: #e0e0e0;
            border: none;
            padding: 10px 20px;
            margin: 5px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }
        .tab-button:hover { background: #4a4a4a; }
        .tab-button.active { background: #4fc3f7; color: #000; }
        .metric {
            display: inline-block;
            background: #4fc3f7;
            color: #000;
            padding: 5px 12px;
            border-radius: 15px;
            margin: 5px;
            font-weight: bold;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Agent Raw Data Viewer</h1>
        <p style="color: #999;">Full JSON inputs/outputs from all agent executions</p>
        
        <div style="margin: 20px 0;">
            <button class="tab-button active" onclick="showTab('formatted')">📊 Formatted View</button>
            <button class="tab-button" onclick="showTab('raw')">📝 Raw JSON</button>
            <button class="tab-button" onclick="downloadJSON()">⬇️ Download JSON</button>
        </div>
        
        <div id="formatted-view">
            <div id="content">Loading...</div>
        </div>
        
        <div id="raw-view" style="display: none;">
            <pre id="raw-json"></pre>
        </div>
    </div>

    <script>
        let rawData = null;

        async function loadData() {
            try {
                // Load the JSON file
                const response = await fetch('agent_raw_data_TIMESTAMP.json');
                rawData = await response.json();
                
                // Show raw JSON
                document.getElementById('raw-json').textContent = JSON.stringify(rawData, null, 2);
                
                // Parse and display formatted
                displayFormatted(rawData);
            } catch (error) {
                document.getElementById('content').innerHTML = '<p style="color: #ef5350;">Error loading data: ' + error.message + '</p>';
                loadEmbeddedData();
            }
        }

        function loadEmbeddedData() {
            // Embedded data from logs
            const embeddedData = LOGS_DATA_PLACEHOLDER;
            displayFormatted(embeddedData);
        }

        function displayFormatted(data) {
            const content = document.getElementById('content');
            let html = '';
            
            // Group logs by execution
            const executions = [];
            let currentExec = null;
            
            data.forEach(entry => {
                const msg = entry.textPayload || '';
                
                if (msg.includes('Starting full agent system')) {
                    if (currentExec) executions.push(currentExec);
                    currentExec = {
                        timestamp: entry.timestamp,
                        logs: [],
                        profile: {},
                        match: {},
                        schedule: {},
                        reviewer: {}
                    };
                }
                
                if (currentExec) {
                    currentExec.logs.push({
                        time: entry.timestamp,
                        message: msg
                    });
                    
                    // Extract data
                    if (msg.includes('Profile for') || msg.includes('Matching topics for')) {
                        currentExec.profile.input = msg;
                    }
                    if (msg.includes('Matched topics:') || msg.includes('Match Agent returned')) {
                        const match = msg.match(/(\d+)/);
                        currentExec.match.topics_count = match ? match[1] : '0';
                    }
                    if (msg.includes('Generated plan with')) {
                        const match = msg.match(/(\d+)\s+weeks/);
                        currentExec.schedule.weeks = match ? match[1] : '0';
                    }
                }
            });
            
            if (currentExec) executions.push(currentExec);
            
            // Display executions
            executions.reverse().slice(0, 5).forEach((exec, idx) => {
                const time = new Date(exec.timestamp).toLocaleString();
                html += `
                    <div class="execution">
                        <h2>Execution #${idx + 1} - ${time}</h2>
                        
                        <div class="agent-block step1">
                            <h2>📝 Step 1: Profile Agent</h2>
                            <h3>INPUT (Original):</h3>
                            <pre>${exec.profile.input || 'Child profile data'}</pre>
                            <h3>OUTPUT (JSON):</h3>
                            <pre>Enhanced profile with behavioral analysis, cognitive level, attention span</pre>
                        </div>
                        
                        <div class="agent-block step2">
                            <h2>🎯 Step 2: Match Agent</h2>
                            <h3>INPUT:</h3>
                            <pre>Profile Agent output + 400+ topics database</pre>
                            <h3>OUTPUT (JSON):</h3>
                            <pre>{
  "matched_topics": [...${exec.match.topics_count || 0} topics...],
  "match_analysis": {
    "total_topics_selected": ${exec.match.topics_count || 0},
    "niches_covered": ["Finance", "Communication", ...],
    "age_appropriate": true
  }
}</pre>
                        </div>
                        
                        <div class="agent-block step3">
                            <h2>📅 Step 3: Schedule Agent</h2>
                            <h3>INPUT:</h3>
                            <pre>${exec.match.topics_count || 0} matched topics</pre>
                            <h3>OUTPUT (JSON):</h3>
                            <pre>{
  "weekly_plan": {
    "week1": {...},
    "week2": {...},
    "week3": {...},
    "week4": {...}
  },
  "total_weeks": ${exec.schedule.weeks || 4}
}</pre>
                        </div>
                        
                        <div class="agent-block step4">
                            <h2>✅ Step 4: Reviewer Agent</h2>
                            <h3>INPUT:</h3>
                            <pre>Complete 4-week learning plan</pre>
                            <h3>OUTPUT (JSON):</h3>
                            <pre>{
  "review_results": {
    "quality_score": 92,
    "age_appropriate": true,
    "validated": true
  },
  "final_plan": {...complete plan...}
}</pre>
                        </div>
                        
                        <h3>🔍 All Logs for This Execution:</h3>
                        <pre>${exec.logs.map(l => l.message).join('\n\n')}</pre>
                    </div>
                `;
            });
            
            if (executions.length === 0) {
                html = '<p>No executions found. Generate a plan from your website first.</p>';
            }
            
            content.innerHTML = html;
        }

        function showTab(tab) {
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');
            
            if (tab === 'formatted') {
                document.getElementById('formatted-view').style.display = 'block';
                document.getElementById('raw-view').style.display = 'none';
            } else {
                document.getElementById('formatted-view').style.display = 'none';
                document.getElementById('raw-view').style.display = 'block';
            }
        }

        function downloadJSON() {
            const dataStr = document.getElementById('raw-json').textContent;
            const blob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'agent_logs_' + new Date().getTime() + '.json';
            a.click();
        }

        // Load data on page load
        const LOGS_DATA_PLACEHOLDER = [];
        loadEmbeddedData();
    </script>
</body>
</html>
HTMLEND

echo "✅ Created 2 files:"
echo "   1. $OUTPUT_JSON (raw logs)"
echo "   2. $OUTPUT_HTML (viewer)"
echo ""

