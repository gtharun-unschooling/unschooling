#!/usr/bin/env python3

# 📊 Get Latest Real Customer Data
# Extracts actual customer profile from Cloud Run logs

import subprocess
import json
import re
from datetime import datetime, timedelta

print("📊 Fetching latest REAL customer from Cloud Run logs...")

# Get logs from last 2 hours
two_hours_ago = (datetime.utcnow() - timedelta(hours=2)).strftime('%Y-%m-%dT%H:%M:%SZ')

cmd = [
    'gcloud', 'logging', 'read',
    f'resource.type=cloud_run_revision AND resource.labels.service_name=unschooling-backend AND timestamp>="{two_hours_ago}"',
    '--limit=1000',
    '--format=value(timestamp,textPayload)',
    '--project=unschooling-464413'
]

result = subprocess.run(cmd, capture_output=True, text=True)
logs = result.stdout

# Parse logs
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
            'success': False,
            'raw_logs': []
        }
    
    if current_exec:
        current_exec['raw_logs'].append(message)
        
        # Extract profile
        if "Matching topics for" in message or "Profile for" in message:
            name_match = re.search(r'for ([a-zA-Z0-9_]+)', message)
            age_match = re.search(r'age (\d+)', message)
            interests_match = re.search(r"interests: \[(.*?)\]", message)
            
            if name_match:
                current_exec['profile']['child_name'] = name_match.group(1)
            if age_match:
                current_exec['profile']['child_age'] = int(age_match.group(1))
            if interests_match:
                interests_str = interests_match.group(1)
                interests = [i.strip().strip("'\"") for i in interests_str.split(',')]
                current_exec['profile']['interests'] = interests
        
        # Extract metrics
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

# Get latest execution
latest = executions[-1] if executions else {'error': 'No recent requests found'}

# Print summary
if 'error' not in latest:
    print(f"\n✅ Latest Customer Found:")
    print(f"   👤 Name: {latest['profile'].get('child_name', 'Unknown')}")
    print(f"   🎂 Age: {latest['profile'].get('child_age', 'Unknown')}")
    print(f"   🎯 Interests: {', '.join(latest['profile'].get('interests', []))}")
    print(f"   📚 Topics: {latest['topics']}")
    print(f"   📅 Weeks: {latest['weeks']}")
    print(f"   ⏰ Time: {latest['timestamp']}")
    print(f"   ✅ Success: {latest['success']}")
else:
    print("\n⚠️  No recent customer requests in last 2 hours")

# Generate HTML
html_output = f'''<!DOCTYPE html>
<html>
<head>
    <title>Latest Customer - Auto Refresh</title>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="30">
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            padding: 30px;
            margin: 0;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 40px;
            color: #333;
        }}
        h1 {{ color: #667eea; font-size: 2.5em; margin: 0 0 10px 0; }}
        .customer-card {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin: 25px 0;
        }}
        .profile-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }}
        .profile-item {{
            background: rgba(255,255,255,0.15);
            padding: 20px;
            border-radius: 10px;
        }}
        .profile-label {{
            font-size: 0.85em;
            opacity: 0.9;
            margin-bottom: 8px;
        }}
        .profile-value {{
            font-size: 1.5em;
            font-weight: 700;
        }}
        .json-box {{
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }}
        pre {{
            margin: 0;
            overflow-x: auto;
            max-height: 600px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
        }}
        .btn {{
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 15px;
            margin: 10px 5px;
        }}
        .auto-refresh {{
            background: #4caf50;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.85em;
            animation: pulse 2s infinite;
        }}
        @keyframes pulse {{
            0%, 100% {{ opacity: 1; }}
            50% {{ opacity: 0.7; }}
        }}
        .status {{
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: 600;
            display: inline-block;
        }}
        .status.success {{ background: #4caf50; }}
        .status.error {{ background: #f44336; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Latest Customer Request</h1>
        <p style="color: #666;">
            Updated: {datetime.now().strftime('%Y-%m-%d %I:%M:%S %p IST')}
            <span class="auto-refresh">🔄 Auto-refresh: 30s</span>
        </p>
        
        <button class="btn" onclick="location.reload()">🔄 Refresh Now</button>
        <button class="btn" onclick="copyAll()">📋 Copy All JSON</button>
        
        <div class="customer-card">
            <h2 style="margin-top: 0;">
                👤 Latest Customer
                <span class="status {'success' if latest.get('success') else 'error'}">
                    {'✅ SUCCESS' if latest.get('success') else '⚠️ INCOMPLETE'}
                </span>
            </h2>
            <div class="profile-grid">
                <div class="profile-item">
                    <div class="profile-label">👤 Child Name</div>
                    <div class="profile-value">{latest.get('profile', {}).get('child_name', 'Not found')}</div>
                </div>
                <div class="profile-item">
                    <div class="profile-label">🎂 Age</div>
                    <div class="profile-value">{latest.get('profile', {}).get('child_age', '-')}</div>
                </div>
                <div class="profile-item">
                    <div class="profile-label">🎯 Interests</div>
                    <div class="profile-value" style="font-size: 1.1em;">{', '.join(latest.get('profile', {}).get('interests', []))}</div>
                </div>
                <div class="profile-item">
                    <div class="profile-label">📚 Topics Matched</div>
                    <div class="profile-value">{latest.get('topics', 0)}</div>
                </div>
                <div class="profile-item">
                    <div class="profile-label">📅 Weeks Generated</div>
                    <div class="profile-value">{latest.get('weeks', 0)}</div>
                </div>
                <div class="profile-item">
                    <div class="profile-label">⏰ Request Time (IST)</div>
                    <div class="profile-value" style="font-size: 1.1em;">
                        {datetime.fromisoformat(latest['timestamp'].replace('Z', '+00:00')).strftime('%I:%M:%S %p') if latest.get('timestamp') else '-'}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="json-box">
            <h2 style="color: #4fc3f7;">📥 Customer Input (Original JSON)</h2>
            <button class="btn" onclick="copyInput()">📋 Copy Input</button>
            <pre>{json.dumps(latest.get('profile', {{}}), indent=2)}</pre>
        </div>
        
        <div class="json-box">
            <h2 style="color: #4fc3f7;">📤 Complete Data (Original JSON)</h2>
            <button class="btn" onclick="copyOutput()">📋 Copy Output</button>
            <pre>{json.dumps(latest, indent=2)}</pre>
        </div>
    </div>

    <script>
        function copyInput() {{
            const text = {json.dumps(json.dumps(latest.get('profile', {{}}), indent=2))};
            navigator.clipboard.writeText(text).then(() => alert('✅ Input copied!'));
        }}
        
        function copyOutput() {{
            const text = {json.dumps(json.dumps(latest, indent=2))};
            navigator.clipboard.writeText(text).then(() => alert('✅ Output copied!'));
        }}
        
        function copyAll() {{
            const text = {json.dumps(json.dumps(latest, indent=2))};
            navigator.clipboard.writeText(text).then(() => alert('✅ All data copied!'));
        }}
        
        // Countdown
        let countdown = 30;
        setInterval(() => {{
            countdown--;
            if (countdown <= 0) countdown = 30;
            document.title = `Latest Customer (${{countdown}}s)`;
        }}, 1000);
    </script>
</body>
</html>
'''

# Write HTML
with open('latest_customer.html', 'w', encoding='utf-8') as f:
    f.write(html_output)

print("\n✅ HTML created: latest_customer.html")
print("\n📖 Opening in browser...")

# Open in browser
import webbrowser
webbrowser.open('latest_customer.html')

print("\n🔄 To refresh: python3 get_latest_customer.py")
print("   (or just refresh the HTML page)")

