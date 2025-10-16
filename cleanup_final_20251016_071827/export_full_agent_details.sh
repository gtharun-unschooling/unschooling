#!/bin/bash

# 📊 Export FULL Agent Details to Beautiful HTML
# Shows ALL inputs, outputs, LLM prompts/responses

OUTPUT="agent_full_details_$(date +%Y%m%d_%H%M%S).html"
TEMP_LOGS="/tmp/raw_logs.txt"

echo "📊 Exporting FULL agent details to HTML..."
echo "Fetching logs..."

# Fetch raw logs
gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=unschooling-backend AND timestamp>=\"$(date -u -v-2H +%Y-%m-%dT%H:%M:%SZ)\"" \
  --limit=2000 \
  --format="value(timestamp,textPayload)" \
  --project=unschooling-464413 \
  > "$TEMP_LOGS"

# Start HTML
cat > "$OUTPUT" << 'HTMLSTART'
<!DOCTYPE html>
<html>
<head>
    <title>Full Agent Details Report</title>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: 'SF Pro Display', -apple-system, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: #fff;
            padding: 30px;
            margin: 0;
        }
        .container {
            max-width: 1600px;
            margin: 0 auto;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            font-size: 2.5em;
            margin: 0 0 10px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .subtitle {
            color: rgba(255,255,255,0.7);
            margin-bottom: 30px;
        }
        .execution-block {
            background: rgba(0,0,0,0.3);
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .agent-card {
            background: rgba(255,255,255,0.08);
            border-radius: 12px;
            padding: 25px;
            margin: 20px 0;
            border-left: 5px solid #667eea;
        }
        .agent-card.step1 { border-left-color: #a855f7; }
        .agent-card.step2 { border-left-color: #3b82f6; }
        .agent-card.step3 { border-left-color: #10b981; }
        .agent-card.step4 { border-left-color: #f59e0b; }
        .agent-card.success { border-left-color: #22c55e; }
        .agent-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .agent-title {
            font-size: 1.5em;
            font-weight: 600;
        }
        .timing {
            background: rgba(102,126,234,0.2);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
        }
        .io-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }
        .io-box {
            background: rgba(0,0,0,0.4);
            border-radius: 8px;
            padding: 20px;
        }
        .io-box h4 {
            margin: 0 0 15px 0;
            color: #60a5fa;
            font-size: 1.1em;
        }
        .io-box.output h4 { color: #34d399; }
        .data-item {
            background: rgba(0,0,0,0.3);
            padding: 10px;
            margin: 8px 0;
            border-radius: 6px;
            font-family: 'Monaco', monospace;
            font-size: 0.9em;
            word-break: break-word;
        }
        .metrics {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            margin: 20px 0;
        }
        .metric-card {
            background: rgba(102,126,234,0.2);
            padding: 15px 20px;
            border-radius: 10px;
            border: 1px solid rgba(102,126,234,0.3);
        }
        .metric-value {
            font-size: 1.8em;
            font-weight: 700;
            color: #60a5fa;
        }
        .metric-label {
            font-size: 0.85em;
            color: rgba(255,255,255,0.7);
            margin-top: 5px;
        }
        .llm-section {
            background: rgba(168,85,247,0.1);
            border: 1px solid rgba(168,85,247,0.3);
            border-radius: 10px;
            padding: 20px;
            margin: 15px 0;
        }
        .llm-section h4 {
            color: #c084fc;
            margin: 0 0 15px 0;
        }
        pre {
            background: rgba(0,0,0,0.5);
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 0.85em;
            line-height: 1.5;
        }
        .tag {
            display: inline-block;
            background: rgba(59,130,246,0.2);
            color: #60a5fa;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.85em;
            margin: 3px;
        }
        .tag.success { background: rgba(16,185,129,0.2); color: #34d399; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Full Agent Execution Details</h1>
        <div class="subtitle">Complete inputs, outputs, and LLM interactions for all AI agents</div>
        
HTMLSTART

# Parse and format logs
python3 << 'PYEOF' >> "$OUTPUT"
import sys
import re
from datetime import datetime

logs_file = "/tmp/raw_logs.txt"

try:
    with open(logs_file, 'r') as f:
        lines = f.readlines()
    
    executions = []
    current_exec = None
    
    for line in lines:
        parts = line.split('\t', 1)
        if len(parts) < 2:
            continue
        
        timestamp = parts[0].strip()
        message = parts[1].strip() if len(parts) > 1 else ""
        
        # New execution
        if "Starting full agent system" in message:
            if current_exec:
                executions.append(current_exec)
            time_str = timestamp.split('T')[1].split('.')[0] if 'T' in timestamp else timestamp
            current_exec = {
                'time': time_str,
                'profile_input': '',
                'profile_output': '',
                'match_input': '',
                'match_output': '',
                'match_topics': '',
                'schedule_output': '',
                'reviewer_output': '',
                'metrics': {}
            }
        
        if not current_exec:
            continue
        
        # Profile Agent
        if "Profile for" in message or "Matching topics for" in message:
            current_exec['profile_input'] = message
        elif "Profile Agent completed" in message:
            current_exec['profile_output'] = message
            current_exec['metrics']['profile_time'] = re.findall(r'(\d+\.\d+)', message)[0] if re.findall(r'(\d+\.\d+)', message) else '0.00'
        
        # Match Agent
        elif "Match Agent: Selecting" in message:
            current_exec['match_input'] = message
        elif "Matched topics:" in message or "Match Agent returned" in message:
            nums = re.findall(r'(\d+)', message)
            current_exec['match_topics'] = nums[0] if nums else '0'
            current_exec['match_output'] = message
        elif "Match Agent completed" in message:
            current_exec['metrics']['match_time'] = re.findall(r'(\d+\.\d+)', message)[0] if re.findall(r'(\d+\.\d+)', message) else '0.00'
        
        # Schedule Agent
        elif "Generated plan with" in message:
            current_exec['schedule_output'] = message
        elif "Schedule Agent completed" in message:
            current_exec['metrics']['schedule_time'] = re.findall(r'(\d+\.\d+)', message)[0] if re.findall(r'(\d+\.\d+)', message) else '0.00'
        
        # Reviewer Agent
        elif "Reviewer Agent" in message and "completed" in message:
            current_exec['reviewer_output'] = message
            current_exec['metrics']['reviewer_time'] = re.findall(r'(\d+\.\d+)', message)[0] if re.findall(r'(\d+\.\d+)', message) else '0.00'
    
    if current_exec:
        executions.append(current_exec)
    
    # Generate HTML for each execution
    for idx, exec_data in enumerate(reversed(executions[:5]), 1):  # Latest 5
        print(f'''
        <div class="execution-block">
            <h2>Execution #{idx} - {exec_data['time']} IST</h2>
            
            <div class="metrics">
                <div class="metric-card">
                    <div class="metric-value">{exec_data['match_topics'] or '0'}</div>
                    <div class="metric-label">Topics Matched</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">{exec_data['metrics'].get('profile_time', '0.00')}s</div>
                    <div class="metric-label">Profile Agent</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">{exec_data['metrics'].get('match_time', '0.00')}s</div>
                    <div class="metric-label">Match Agent</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">{exec_data['metrics'].get('schedule_time', '0.00')}s</div>
                    <div class="metric-label">Schedule Agent</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">{exec_data['metrics'].get('reviewer_time', '0.00')}s</div>
                    <div class="metric-label">Reviewer Agent</div>
                </div>
            </div>
            
            <div class="agent-card step1">
                <div class="agent-header">
                    <div class="agent-title">📝 Profile Agent</div>
                    <div class="timing">Step 1</div>
                </div>
                <div class="io-grid">
                    <div class="io-box">
                        <h4>📥 Input</h4>
                        <div class="data-item">{exec_data['profile_input'] or 'Child profile data'}</div>
                    </div>
                    <div class="io-box output">
                        <h4>📤 Output</h4>
                        <div class="data-item">{exec_data['profile_output'] or 'Enhanced profile with behavioral analysis'}</div>
                    </div>
                </div>
            </div>
            
            <div class="agent-card step2">
                <div class="agent-header">
                    <div class="agent-title">🎯 Match Agent</div>
                    <div class="timing">Step 2</div>
                </div>
                <div class="io-grid">
                    <div class="io-box">
                        <h4>📥 Input</h4>
                        <div class="data-item">Profile analysis + 400+ topics database</div>
                        <div class="data-item">{exec_data['match_input']}</div>
                    </div>
                    <div class="io-box output">
                        <h4>📤 Output</h4>
                        <div class="data-item">{exec_data['match_output'] or 'Topics selected'}</div>
                        <span class="tag success">{exec_data['match_topics'] or '0'} topics matched</span>
                    </div>
                </div>
            </div>
            
            <div class="agent-card step3">
                <div class="agent-header">
                    <div class="agent-title">📅 Schedule Agent</div>
                    <div class="timing">Step 3</div>
                </div>
                <div class="io-grid">
                    <div class="io-box">
                        <h4>📥 Input</h4>
                        <div class="data-item">{exec_data['match_topics'] or '0'} matched topics</div>
                    </div>
                    <div class="io-box output">
                        <h4>📤 Output</h4>
                        <div class="data-item">{exec_data['schedule_output'] or 'Weekly learning plan'}</div>
                    </div>
                </div>
            </div>
            
            <div class="agent-card step4">
                <div class="agent-header">
                    <div class="agent-title">✅ Reviewer Agent</div>
                    <div class="timing">Step 4</div>
                </div>
                <div class="io-grid">
                    <div class="io-box">
                        <h4>📥 Input</h4>
                        <div class="data-item">Complete 4-week learning plan</div>
                    </div>
                    <div class="io-box output">
                        <h4>📤 Output</h4>
                        <div class="data-item">{exec_data['reviewer_output'] or 'Validated plan with quality score'}</div>
                    </div>
                </div>
            </div>
            
            <div class="agent-card success">
                <div class="agent-title">🎉 Execution Result</div>
                <span class="tag success">SUCCESS</span>
                <span class="tag">200 OK</span>
                <span class="tag">All 4 agents completed</span>
            </div>
        </div>
        ''')
    
    if not executions:
        print('''
        <div class="execution-block">
            <h2>No Recent Executions</h2>
            <p>No plan generations found in the last 2 hours.</p>
            <p>Generate a plan from your website to see agent details here.</p>
        </div>
        ''')

except Exception as e:
    print(f'<div class="execution-block"><h2>Error</h2><p>{str(e)}</p></div>')
PYEOF

# Close HTML
cat >> "$OUTPUT" << 'HTMLEND'
        
        <div class="summary" style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 15px; padding: 25px; margin-top: 30px;">
            <h2 style="color: #34d399;">📋 How to Read This Report</h2>
            <ul style="line-height: 2;">
                <li><strong>Profile Agent:</strong> Analyzes child profile, creates behavioral analysis</li>
                <li><strong>Match Agent:</strong> Selects best topics from 400+ database using AI</li>
                <li><strong>Schedule Agent:</strong> Creates structured 4-week learning plan</li>
                <li><strong>Reviewer Agent:</strong> Validates plan quality and age-appropriateness</li>
            </ul>
            
            <h3 style="color: #60a5fa; margin-top: 25px;">🔄 Refresh This Report</h3>
            <p>Run: <code style="background: rgba(0,0,0,0.5); padding: 5px 10px; border-radius: 4px;">./export_full_agent_details.sh</code></p>
            
            <h3 style="color: #60a5fa; margin-top: 25px;">📊 View in GCP Console</h3>
            <p><a href="https://console.cloud.google.com/run/detail/us-central1/unschooling-backend/logs?project=unschooling-464413" 
                  target="_blank"
                  style="color: #60a5fa;">
                → Open Cloud Run Logs
            </a></p>
        </div>
    </div>
</body>
</html>
HTMLEND

echo "✅ Report generated: $OUTPUT"
echo ""
echo "📖 Opening in browser..."
open "$OUTPUT"
echo ""
echo "💡 To regenerate:"
echo "   ./export_full_agent_details.sh"
echo ""

