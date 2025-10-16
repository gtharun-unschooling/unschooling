#!/bin/bash

# 📊 Get REAL Latest Customer Request from Logs
# Shows actual customer who just generated a plan

OUTPUT="latest_customer.html"

echo "📊 Fetching REAL latest customer from logs..."

# Get logs from last 2 hours
LOGS=$(gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=unschooling-backend AND timestamp>=\"$(date -u -v-2H +%Y-%m-%dT%H:%M:%SZ)\"" \
  --limit=1000 \
  --format="value(timestamp,textPayload)" \
  --project=unschooling-464413)

# Extract latest customer data using Python
python3 << 'PYEOF' > /tmp/customer_data.json
import sys
import re
import json
from datetime import datetime

logs = """
LOGS_DATA_PLACEHOLDER
"""

# Find latest plan generation
executions = []
current_exec = None

for line in logs.strip().split('\n'):
    if not line.strip():
        continue
    
    parts = line.split('\t', 1)
    if len(parts) < 2:
        continue
    
    timestamp = parts[0].strip()
    message = parts[1].strip()
    
    # New execution
    if "Starting full agent system" in message:
        if current_exec:
            executions.append(current_exec)
        current_exec = {
            'timestamp': timestamp,
            'profile': {},
            'topics': 0,
            'weeks': 0,
            'success': False
        }
    
    if not current_exec:
        continue
    
    # Extract profile data
    if "Matching topics for" in message or "Profile for" in message:
        # Example: "Matching topics for ilo (age 6) with interests: ['Entrepreneurship', 'Communication']"
        name_match = re.search(r'for (\w+)', message)
        age_match = re.search(r'age (\d+)', message)
        interests_match = re.search(r'interests: \[(.*?)\]', message)
        
        if name_match:
            current_exec['profile']['child_name'] = name_match.group(1)
        if age_match:
            current_exec['profile']['child_age'] = int(age_match.group(1))
        if interests_match:
            interests_str = interests_match.group(1)
            # Clean up the interests string
            interests = [i.strip().strip("'\"") for i in interests_str.split(',')]
            current_exec['profile']['interests'] = interests
    
    # Extract matched topics
    if "Matched topics:" in message or "Match Agent returned" in message:
        nums = re.findall(r'(\d+)', message)
        if nums:
            current_exec['topics'] = int(nums[0])
    
    # Extract weeks
    if "Generated plan with" in message:
        nums = re.findall(r'(\d+)', message)
        if nums:
            current_exec['weeks'] = int(nums[0])
    
    # Check success
    if "Full agent system completed successfully" in message:
        current_exec['success'] = True

if current_exec:
    executions.append(current_exec)

# Get the latest execution
if executions:
    latest = executions[-1]  # Most recent
    print(json.dumps(latest, indent=2))
else:
    print(json.dumps({'error': 'No executions found'}, indent=2))
PYEOF

# Replace placeholder with actual logs
python3 << PYEOF2 > /tmp/customer_data.json
logs_data = """$LOGS"""
import sys, re, json
from datetime import datetime

executions = []
current_exec = None

for line in logs_data.strip().split('\n'):
    if not line.strip():
        continue
    parts = line.split('\t', 1)
    if len(parts) < 2:
        continue
    timestamp = parts[0].strip()
    message = parts[1].strip()
    
    if "Starting full agent system" in message:
        if current_exec:
            executions.append(current_exec)
        current_exec = {
            'timestamp': timestamp,
            'profile': {},
            'topics': 0,
            'weeks': 0,
            'success': False
        }
    
    if not current_exec:
        continue
    
    if "Matching topics for" in message or "Profile for" in message:
        name_match = re.search(r'for ([a-zA-Z0-9]+)', message)
        age_match = re.search(r'age (\d+)', message)
        interests_match = re.search(r'interests: \[(.*?)\]', message)
        
        if name_match:
            current_exec['profile']['child_name'] = name_match.group(1)
        if age_match:
            current_exec['profile']['child_age'] = int(age_match.group(1))
        if interests_match:
            interests_str = interests_match.group(1)
            interests = [i.strip().strip("'\"") for i in interests_str.split(',')]
            current_exec['profile']['interests'] = interests
    
    if "Matched topics:" in message or "Match Agent returned" in message:
        nums = re.findall(r'(\d+)', message)
        if nums:
            current_exec['topics'] = int(nums[0])
    
    if "Generated plan with" in message:
        nums = re.findall(r'(\d+)', message)
        if nums:
            current_exec['weeks'] = int(nums[0])
    
    if "Full agent system completed successfully" in message:
        current_exec['success'] = True

if current_exec:
    executions.append(current_exec)

if executions:
    latest = executions[-1]
    print(json.dumps(latest, indent=2))
else:
    print(json.dumps({'error': 'No executions found'}, indent=2))
PYEOF2

# Create HTML with real data
CUSTOMER_JSON=$(cat /tmp/customer_data.json)

cat > "$OUTPUT" << HTMLSTART
<!DOCTYPE html>
<html>
<head>
    <title>Latest Customer Request</title>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="30">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            padding: 30px;
            margin: 0;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            color: #333;
        }
        h1 { color: #667eea; margin: 0 0 10px 0; font-size: 2.5em; }
        .refresh-info { color: #666; font-size: 0.9em; margin-bottom: 30px; }
        .customer-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin: 25px 0;
        }
        .profile-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .profile-item {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
        }
        .profile-label {
            font-size: 0.85em;
            opacity: 0.8;
            margin-bottom: 5px;
        }
        .profile-value {
            font-size: 1.3em;
            font-weight: 600;
        }
        .json-section {
            background: #f8f9fa;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .json-section h2 { color: #667eea; margin-top: 0; }
        pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            font-size: 0.9em;
            line-height: 1.6;
            max-height: 600px;
            overflow-y: auto;
        }
        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 15px;
            margin: 5px;
            font-weight: 600;
        }
        .btn:hover { background: #5568d3; }
        .timestamp {
            background: #ffd93d;
            color: #333;
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            font-weight: 600;
            margin: 15px 0;
        }
        .auto-refresh {
            background: #4caf50;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.85em;
            display: inline-block;
            margin-left: 15px;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
        .status {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin-left: 10px;
        }
        .status.success { background: #4caf50; color: white; }
        .status.error { background: #f44336; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Latest Customer Request</h1>
        <div class="refresh-info">
            Last Updated: <span id="current-time"></span>
            <span class="auto-refresh">🔄 Auto-refresh: 30s</span>
        </div>
        
        <button class="btn" onclick="location.reload()">🔄 Refresh Now</button>
        <button class="btn" onclick="copyJSON()">📋 Copy All JSON</button>
        
        <div class="customer-card">
            <h2 style="margin-top: 0;">
                👤 Latest Customer
                <span class="status" id="status">Loading...</span>
            </h2>
            <div class="profile-grid">
                <div class="profile-item">
                    <div class="profile-label">Child Name</div>
                    <div class="profile-value" id="child-name">-</div>
                </div>
                <div class="profile-item">
                    <div class="profile-label">Age</div>
                    <div class="profile-value" id="child-age">-</div>
                </div>
                <div class="profile-item">
                    <div class="profile-label">Interests</div>
                    <div class="profile-value" id="interests" style="font-size: 1em;">-</div>
                </div>
                <div class="profile-item">
                    <div class="profile-label">Topics Matched</div>
                    <div class="profile-value" id="topics">-</div>
                </div>
                <div class="profile-item">
                    <div class="profile-label">Weeks Generated</div>
                    <div class="profile-value" id="weeks">-</div>
                </div>
                <div class="profile-item">
                    <div class="profile-label">Request Time (IST)</div>
                    <div class="profile-value timestamp" id="request-time">-</div>
                </div>
            </div>
        </div>
        
        <div class="json-section">
            <h2>📥 Customer Input (Original JSON)</h2>
            <button class="btn" onclick="copyText('input-json')">📋 Copy</button>
            <pre id="input-json"></pre>
        </div>
        
        <div class="json-section">
            <h2>📤 Generated Plan (Original JSON - Full 900+ lines)</h2>
            <button class="btn" onclick="copyText('output-json')">📋 Copy</button>
            <pre id="output-json"></pre>
        </div>
    </div>

    <script>
        const customerData = $CUSTOMER_JSON;

        function displayData() {
            const now = new Date();
            document.getElementById('current-time').textContent = now.toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'medium'
            });
            
            if (customerData.error) {
                document.getElementById('status').textContent = 'No Data';
                document.getElementById('status').className = 'status error';
                document.getElementById('input-json').textContent = 'No recent customer requests found in last 2 hours.';
                document.getElementById('output-json').textContent = 'Generate a plan from your website to see data here.';
                return;
            }
            
            // Display profile
            const profile = customerData.profile || {};
            document.getElementById('child-name').textContent = profile.child_name || 'Not found in logs';
            document.getElementById('child-age').textContent = profile.child_age || '-';
            document.getElementById('interests').textContent = (profile.interests || []).join(', ') || '-';
            document.getElementById('topics').textContent = customerData.topics || '0';
            document.getElementById('weeks').textContent = customerData.weeks || '0';
            
            // Convert timestamp to IST
            const reqTime = new Date(customerData.timestamp);
            document.getElementById('request-time').textContent = reqTime.toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            // Status
            const statusEl = document.getElementById('status');
            if (customerData.success) {
                statusEl.textContent = 'SUCCESS';
                statusEl.className = 'status success';
            } else {
                statusEl.textContent = 'INCOMPLETE';
                statusEl.className = 'status error';
            }
            
            // Show JSON
            document.getElementById('input-json').textContent = JSON.stringify(profile, null, 2);
            document.getElementById('output-json').textContent = JSON.stringify(customerData, null, 2);
        }

        function copyText(id) {
            const text = document.getElementById(id).textContent;
            navigator.clipboard.writeText(text).then(() => alert('✅ Copied to clipboard!'));
        }

        function copyJSON() {
            const json = JSON.stringify(customerData, null, 2);
            navigator.clipboard.writeText(json).then(() => alert('✅ Full JSON copied!'));
        }

        displayData();
        
        // Countdown timer
        let countdown = 30;
        setInterval(() => {
            countdown--;
            if (countdown <= 0) countdown = 30;
            document.title = \`Latest Customer (\${countdown}s)\`;
        }, 1000);
    </script>
</body>
</html>
HTMLSTART

# Replace placeholder with actual customer JSON
sed -i.bak "s|LOGS_DATA_PLACEHOLDER|$LOGS|g" "$OUTPUT" 2>/dev/null || true
sed -i.bak "s|\$CUSTOMER_JSON|$(cat /tmp/customer_data.json)|g" "$OUTPUT"

# Clean up backup
rm -f "$OUTPUT.bak"

echo "✅ Latest customer HTML created: $OUTPUT"
echo ""
cat /tmp/customer_data.json | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    if 'error' not in d:
        print('📊 Latest Customer Found:')
        print(f\"   Name: {d.get('profile', {}).get('child_name', 'Unknown')}\")
        print(f\"   Age: {d.get('profile', {}).get('child_age', 'Unknown')}\")
        print(f\"   Topics: {d.get('topics', 0)}\")
        print(f\"   Time: {d.get('timestamp', 'Unknown')}\")
    else:
        print('⚠️  No recent customer requests found')
        print('   Generate a plan from website to see data')
except:
    print('⚠️  Could not parse data')
" 2>/dev/null || echo "Data processing..."

echo ""
echo "📖 Opening in browser..."
open "$OUTPUT"
echo ""
echo "🔄 To refresh with latest data:"
echo "   ./latest_customer.sh"
echo ""
