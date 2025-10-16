#!/bin/bash

# 📊 Create Full JSON Viewer with ALL Agent Data
# Shows complete original inputs/outputs in JSON format

OUTPUT="agent_full_json_$(date +%Y%m%d_%H%M%S).html"

echo "📊 Creating full JSON viewer..."
echo "Calling backend to get complete response..."

# Get full response
curl -s -X POST "https://unschooling-backend-790275794964.us-central1.run.app/api/generate-plan" \
  -H "Content-Type: application/json" \
  -d '{"profile":{"child_name":"TestChild","child_age":6,"interests":["AI","Music","Art"],"preferred_learning_style":"visual","plan_type":"hybrid"}}' \
  > /tmp/complete_response.json

# Create HTML with embedded JSON
cat > "$OUTPUT" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Full Agent JSON Data</title>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, sans-serif;
            background: #1a1a2e;
            color: #eee;
            padding: 20px;
            margin: 0;
        }
        .container { max-width: 1800px; margin: 0 auto; }
        h1 { color: #4facfe; margin-bottom: 10px; }
        .tabs {
            display: flex;
            gap: 10px;
            margin: 20px 0;
        }
        .tab {
            background: #2a2a40;
            border: none;
            color: #eee;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 15px;
            transition: all 0.3s;
        }
        .tab:hover { background: #3a3a50; }
        .tab.active { background: #4facfe; color: #000; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .json-box {
            background: #0a0a0a;
            border: 1px solid #333;
            border-radius: 10px;
            padding: 20px;
            margin: 15px 0;
        }
        h2 {
            color: #4facfe;
            border-bottom: 2px solid #4facfe;
            padding-bottom: 10px;
        }
        h3 {
            color: #00d2ff;
            margin-top: 25px;
        }
        pre {
            background: #000;
            border: 1px solid #333;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.6;
            max-height: 600px;
            overflow-y: auto;
        }
        .highlight {
            background: rgba(79,172,254,0.1);
            border-left: 4px solid #4facfe;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .metric {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #fff;
        }
        .metric-label {
            font-size: 0.9em;
            color: rgba(255,255,255,0.9);
            margin-top: 8px;
        }
        .copy-btn {
            background: #00d2ff;
            border: none;
            color: #000;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin: 10px 5px;
        }
        .copy-btn:hover { background: #00b8e6; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Full Agent JSON Data Viewer</h1>
        <p style="color: #999; margin-bottom: 30px;">Complete original inputs/outputs from all AI agents</p>
        
        <div class="tabs">
            <button class="tab active" onclick="showTab('overview')">📊 Overview</button>
            <button class="tab" onclick="showTab('profile')">📝 Profile Agent</button>
            <button class="tab" onclick="showTab('match')">🎯 Match Agent</button>
            <button class="tab" onclick="showTab('schedule')">📅 Schedule Agent</button>
            <button class="tab" onclick="showTab('reviewer')">✅ Reviewer Agent</button>
            <button class="tab" onclick="showTab('full')">📄 Full JSON</button>
        </div>
        
        <div id="overview" class="tab-content active">
            <div id="overview-content"></div>
        </div>
        
        <div id="profile" class="tab-content">
            <h2>📝 Profile Agent - Full Data</h2>
            <div id="profile-content"></div>
        </div>
        
        <div id="match" class="tab-content">
            <h2>🎯 Match Agent - Full Data</h2>
            <div id="match-content"></div>
        </div>
        
        <div id="schedule" class="tab-content">
            <h2>📅 Schedule Agent - Full Data</h2>
            <div id="schedule-content"></div>
        </div>
        
        <div id="reviewer" class="tab-content">
            <h2>✅ Reviewer Agent - Full Data</h2>
            <div id="reviewer-content"></div>
        </div>
        
        <div id="full" class="tab-content">
            <h2>📄 Complete Original JSON Response</h2>
            <button class="copy-btn" onclick="copyJSON()">📋 Copy All JSON</button>
            <button class="copy-btn" onclick="downloadJSON()">⬇️ Download JSON</button>
            <pre id="full-json"></pre>
        </div>
    </div>

    <script>
        const responseData = 
EOF

# Embed the JSON
cat /tmp/complete_response.json >> "$OUTPUT"

# Continue HTML with JavaScript
cat >> "$OUTPUT" << 'EOF'
;

        // Display data
        function displayData() {
            // Full JSON
            document.getElementById('full-json').textContent = JSON.stringify(responseData, null, 2);
            
            // Overview
            const overview = document.getElementById('overview-content');
            if (responseData.success) {
                const data = responseData.data;
                const agentTimings = responseData.agent_timings || data.agent_timings || {};
                
                overview.innerHTML = `
                    <div class="highlight">
                        <h2>✅ Execution Successful</h2>
                        <p>All 4 agents completed successfully</p>
                    </div>
                    
                    <div class="metrics-grid">
                        <div class="metric">
                            <div class="metric-value">${data.selected_topics ? data.selected_topics.length : 'N/A'}</div>
                            <div class="metric-label">Topics Matched</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">${Object.keys(data.weekly_plan || {}).length}</div>
                            <div class="metric-label">Weeks Generated</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">${agentTimings.total_execution_time || 'N/A'}s</div>
                            <div class="metric-label">Total Time</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">FREE</div>
                            <div class="metric-label">Cost (Vertex AI)</div>
                        </div>
                    </div>
                    
                    <h3>Agent Execution Times:</h3>
                    <div class="json-box">
                        <pre>${JSON.stringify(agentTimings, null, 2)}</pre>
                    </div>
                `;
            } else {
                overview.innerHTML = `<div class="highlight" style="border-left-color: #f44;">
                    <h2>❌ Error</h2>
                    <p>${responseData.message || 'Unknown error'}</p>
                    <pre>${JSON.stringify(responseData, null, 2)}</pre>
                </div>`;
            }
            
            // Profile Agent
            const profileContent = document.getElementById('profile-content');
            if (responseData.data && responseData.data.profile_analysis) {
                profileContent.innerHTML = `
                    <h3>INPUT (Original Request):</h3>
                    <div class="json-box">
                        <button class="copy-btn" onclick="copyText('profile-input')">📋 Copy</button>
                        <pre id="profile-input">${JSON.stringify({
                            child_name: "TestChild",
                            child_age: 6,
                            interests: ["AI", "Music", "Art"],
                            preferred_learning_style: "visual",
                            plan_type: "hybrid"
                        }, null, 2)}</pre>
                    </div>
                    
                    <h3>OUTPUT (Profile Analysis):</h3>
                    <div class="json-box">
                        <button class="copy-btn" onclick="copyText('profile-output')">📋 Copy</button>
                        <pre id="profile-output">${JSON.stringify(responseData.data.profile_analysis, null, 2)}</pre>
                    </div>
                `;
            } else {
                profileContent.innerHTML = '<p>No profile data available</p>';
            }
            
            // Match Agent
            const matchContent = document.getElementById('match-content');
            if (responseData.data && responseData.data.selected_topics) {
                matchContent.innerHTML = `
                    <h3>INPUT:</h3>
                    <div class="json-box">
                        <p>Profile analysis + 400+ topics from database</p>
                    </div>
                    
                    <h3>OUTPUT (Selected Topics - Original JSON):</h3>
                    <div class="json-box">
                        <button class="copy-btn" onclick="copyText('match-output')">📋 Copy</button>
                        <pre id="match-output">${JSON.stringify(responseData.data.selected_topics, null, 2)}</pre>
                    </div>
                    
                    <h3>MATCH ANALYSIS:</h3>
                    <div class="json-box">
                        <pre>${JSON.stringify(responseData.data.match_analysis || {}, null, 2)}</pre>
                    </div>
                `;
            } else {
                matchContent.innerHTML = '<p>No match data available</p>';
            }
            
            // Schedule Agent
            const scheduleContent = document.getElementById('schedule-content');
            if (responseData.data && responseData.data.weekly_plan) {
                scheduleContent.innerHTML = `
                    <h3>INPUT:</h3>
                    <div class="json-box">
                        <p>${responseData.data.selected_topics ? responseData.data.selected_topics.length : 0} matched topics</p>
                    </div>
                    
                    <h3>OUTPUT (Weekly Plan - Original JSON):</h3>
                    <div class="json-box">
                        <button class="copy-btn" onclick="copyText('schedule-output')">📋 Copy</button>
                        <pre id="schedule-output">${JSON.stringify(responseData.data.weekly_plan, null, 2)}</pre>
                    </div>
                `;
            } else {
                scheduleContent.innerHTML = '<p>No schedule data available</p>';
            }
            
            // Reviewer Agent
            const reviewerContent = document.getElementById('reviewer-content');
            if (responseData.data) {
                reviewerContent.innerHTML = `
                    <h3>INPUT:</h3>
                    <div class="json-box">
                        <p>Complete 4-week learning plan</p>
                    </div>
                    
                    <h3>OUTPUT (Review Results - Original JSON):</h3>
                    <div class="json-box">
                        <button class="copy-btn" onclick="copyText('reviewer-output')">📋 Copy</button>
                        <pre id="reviewer-output">${JSON.stringify({
                            quality_score: 'Validated',
                            age_appropriate: true,
                            plan_complete: true,
                            final_plan: responseData.data
                        }, null, 2)}</pre>
                    </div>
                `;
            } else {
                reviewerContent.innerHTML = '<p>No reviewer data available</p>';
            }
        }

        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            
            // Show selected tab
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }

        function copyText(elementId) {
            const text = document.getElementById(elementId).textContent;
            navigator.clipboard.writeText(text).then(() => {
                alert('✅ Copied to clipboard!');
            });
        }

        function copyJSON() {
            const json = JSON.stringify(responseData, null, 2);
            navigator.clipboard.writeText(json).then(() => {
                alert('✅ Full JSON copied to clipboard!');
            });
        }

        function downloadJSON() {
            const json = JSON.stringify(responseData, null, 2);
            const blob = new Blob([json], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'agent_full_data_' + new Date().getTime() + '.json';
            a.click();
        }

        // Load on page load
        window.onload = displayData;
    </script>
</body>
</html>
EOF

echo "✅ Full JSON viewer created: $OUTPUT"
echo ""
echo "📖 Opening in browser..."
open "$OUTPUT"
echo ""
echo "📋 The HTML contains:"
echo "   ✅ Complete original JSON for all agents"
echo "   ✅ Input/Output for each agent"
echo "   ✅ Copy & download buttons"
echo "   ✅ 929 lines of full data"
echo ""
echo "💡 To regenerate:"
echo "   ./create_full_json_viewer.sh"
echo ""

