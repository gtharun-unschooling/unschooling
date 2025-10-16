#!/usr/bin/env python3
"""
📊 Show Latest Real Customer Request
One HTML file - Shows only the most recent customer
Auto-refreshes every 30 seconds
"""

import subprocess
import json
import re
from datetime import datetime, timezone, timedelta
import webbrowser

print("📊 Fetching latest customer from Cloud Run logs...")

# Get logs from last 2 hours
two_hours_ago = (datetime.now(timezone.utc) - timedelta(hours=2)).strftime('%Y-%m-%dT%H:%M:%SZ')

cmd = [
    'gcloud', 'logging', 'read',
    f'resource.type=cloud_run_revision AND resource.labels.service_name=unschooling-backend AND timestamp>="{two_hours_ago}"',
    '--limit=1000',
    '--format=value(timestamp,textPayload)',
    '--project=unschooling-464413'
]

result = subprocess.run(cmd, capture_output=True, text=True)
logs = result.stdout

# Parse logs to find latest execution
executions = []
current = None

for line in logs.strip().split('\n'):
    if '\t' not in line:
        continue
    
    timestamp, message = line.split('\t', 1)
    
    if "Starting full agent system" in message:
        if current:
            executions.append(current)
        current = {
            'timestamp': timestamp.strip(),
            'child_name': 'Unknown',
            'child_age': '-',
            'interests': [],
            'topics': 0,
            'weeks': 0,
            'success': False
        }
    
    if current:
        # Extract child name and details
        match = re.search(r'for ([a-zA-Z0-9]+) \(age (\d+)\) with interests: \[(.*?)\]', message)
        if match:
            current['child_name'] = match.group(1)
            current['child_age'] = match.group(2)
            interests_str = match.group(3)
            current['interests'] = [i.strip().strip("'\"") for i in interests_str.split(',')]
        
        # Get topics count
        if "Matched topics:" in message or "Match Agent returned" in message:
            nums = re.findall(r'(\d+)', message)
            if nums:
                current['topics'] = int(nums[0])
        
        # Get weeks
        if "Generated plan with" in message:
            nums = re.findall(r'(\d+)', message)
            if nums:
                current['weeks'] = int(nums[0])
        
        if "Full agent system completed successfully" in message:
            current['success'] = True

if current:
    executions.append(current)

# Get the LATEST
latest = executions[-1] if executions else None

if latest:
    # Convert timestamp to IST
    utc_time = datetime.fromisoformat(latest['timestamp'].replace('Z', '+00:00'))
    ist_time = utc_time.astimezone(timezone(timedelta(hours=5, minutes=30)))
    
    print(f"\n✅ Latest Customer:")
    print(f"   Name: {latest['child_name']}")
    print(f"   Age: {latest['child_age']}")
    print(f"   Interests: {', '.join(latest['interests'])}")
    print(f"   Time (IST): {ist_time.strftime('%I:%M:%S %p')}")
    print(f"   Topics: {latest['topics']}")
    print(f"   Success: {latest['success']}")
else:
    print("\n⚠️  No customer requests in last 2 hours")
    latest = {'child_name': 'No data', 'child_age': '-', 'interests': [], 'topics': 0, 'weeks': 0, 'timestamp': '', 'success': False}
    ist_time = datetime.now()

# Generate clean HTML
html = f'''<!DOCTYPE html>
<html>
<head>
    <title>Latest Customer</title>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="30">
    <style>
        body {{
            font-family: -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 30px;
            color: #fff;
        }}
        .container {{
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            color: #333;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }}
        h1 {{ color: #667eea; margin: 0 0 30px 0; }}
        .card {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin: 20px 0;
        }}
        .grid {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 20px 0;
        }}
        .item {{
            background: rgba(255,255,255,0.15);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }}
        .label {{ font-size: 0.85em; opacity: 0.9; margin-bottom: 10px; }}
        .value {{ font-size: 2em; font-weight: 700; }}
        pre {{
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 20px;
            border-radius: 8px;
            overflow: auto;
            max-height: 400px;
        }}
        .btn {{
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            margin: 5px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Latest Customer Request</h1>
        <p style="color: #666;">
            Last Updated: {datetime.now().strftime('%B %d, %Y - %I:%M:%S %p IST')}
            <span style="background: #4caf50; color: white; padding: 5px 15px; border-radius: 15px; margin-left: 15px;">
                🔄 Auto-refresh: 30s
            </span>
        </p>
        
        <button class="btn" onclick="location.reload()">🔄 Refresh Now</button>
        
        <div class="card">
            <h2 style="margin: 0 0 20px 0;">👤 Customer Profile</h2>
            <div class="grid">
                <div class="item">
                    <div class="label">Child Name</div>
                    <div class="value">{latest['child_name']}</div>
                </div>
                <div class="item">
                    <div class="label">Age</div>
                    <div class="value">{latest['child_age']}</div>
                </div>
                <div class="item">
                    <div class="label">Topics</div>
                    <div class="value">{latest['topics']}</div>
                </div>
            </div>
            <div style="margin-top: 20px; text-align: center;">
                <div class="label">Interests</div>
                <div style="font-size: 1.2em; margin-top: 10px;">{', '.join(latest['interests'])}</div>
            </div>
            <div style="margin-top: 20px; text-align: center;">
                <div class="label">Request Time (IST)</div>
                <div style="font-size: 1.5em; margin-top: 10px; background: #ffd93d; color: #333; padding: 10px 20px; border-radius: 10px; display: inline-block;">
                    {ist_time.strftime('%I:%M:%S %p')}
                </div>
            </div>
        </div>
        
        <div style="margin: 30px 0;">
            <h2 style="color: #667eea;">📥 Input JSON (Original)</h2>
            <button class="btn" onclick="copyInput()">📋 Copy</button>
            <pre id="input-json">{json.dumps(latest.get('profile') if latest.get('profile') else latest, indent=2)}</pre>
        </div>
        
        <div style="margin: 30px 0;">
            <h2 style="color: #667eea;">📊 Full Data (Original JSON)</h2>
            <button class="btn" onclick="copyAll()">📋 Copy All</button>
            <pre id="full-json">{json.dumps(latest, indent=2)}</pre>
        </div>
    </div>

    <script>
        function copyInput() {{
            navigator.clipboard.writeText(document.getElementById('input-json').textContent)
                .then(() => alert('✅ Input copied!'));
        }}
        function copyAll() {{
            navigator.clipboard.writeText(document.getElementById('full-json').textContent)
                .then(() => alert('✅ All data copied!'));
        }}
        let t = 30;
        setInterval(() => {{ t--; if (t <= 0) t = 30; document.title = `Latest Customer (${{t}}s)`; }}, 1000);
    </script>
</body>
</html>
'''

with open('latest_customer.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("\n✅ File created: latest_customer.html")
print("\n📖 Opening in browser...")
webbrowser.open('latest_customer.html')

print("\n✅ Done! File shows:")
print(f"   - ONLY latest customer: {latest['child_name']}")
print(f"   - Request time: {ist_time.strftime('%I:%M:%S %p IST')}")
print(f"   - Auto-refreshes every 30 seconds")
print("\n🔄 To refresh: python3 show_latest_customer.py")

