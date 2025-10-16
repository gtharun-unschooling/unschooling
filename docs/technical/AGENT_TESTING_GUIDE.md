# 🧪 AGENT TESTING GUIDE - See All Inputs & Outputs

**Purpose:** Test each AI agent and see their complete inputs/outputs  
**Backend:** Cloud Run (llm-agents)  
**URL:** https://llm-agents-44gsrw22gq-uc.a.run.app

---

## 🎯 **THE 4 AGENTS IN YOUR SYSTEM**

```
User Profile Input
      ↓
1. PROFILE AGENT → Analyzes child profile
      ↓
2. MATCH AGENT → Matches topics from 400+ database
      ↓
3. SCHEDULE AGENT → Creates 4-week learning plan
      ↓
4. REVIEWER AGENT → Validates & improves plan
      ↓
Final Personalized Plan
```

---

## 🧪 **METHOD 1: Test via Cloud Run Logs (BEST)**

### **See Real-Time Agent Execution:**

```bash
# Watch logs in real-time
gcloud logging tail \
  "resource.type=cloud_run_revision AND resource.labels.service_name=llm-agents" \
  --project=unschooling-464413 \
  --format=json

# This shows:
# ✓ Each agent starting
# ✓ Agent inputs (profile, topics, etc.)
# ✓ Agent outputs (results, timings)
# ✓ LLM prompts and responses
# ✓ Errors if any
```

### **Then trigger plan generation:**

Open another terminal and run:
```bash
curl -X POST "https://llm-agents-44gsrw22gq-uc.a.run.app/api/generate-plan" \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "child_name": "Emma",
      "child_age": 6,
      "interests": ["AI", "Music", "Art"],
      "preferred_learning_style": "visual",
      "plan_type": "hybrid"
    }
  }'
```

**You'll see in logs:**
```
INFO: 🚀 Starting full agent system
INFO: Step 1: Profile Agent
INFO: Profile Agent analyzing: Emma, age 6, interests: ['AI', 'Music', 'Art']
INFO: Profile Agent completed in 0.45s
INFO: Step 2: Match Agent
INFO: Match Agent selecting from 400+ topics
INFO: Match Agent returned 10 topics
INFO: Step 3: Schedule Agent
INFO: Schedule Agent creating 4-week plan
INFO: Step 4: Reviewer Agent
INFO: Reviewer Agent validating plan
INFO: ✅ Plan generation completed
```

---

## 🧪 **METHOD 2: Test via API with Detailed Response**

### **See Agent Timings:**

```bash
curl -s -X POST "https://llm-agents-44gsrw22gq-uc.a.run.app/api/generate-plan" \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "child_name": "Test Child",
      "child_age": 6,
      "interests": ["AI"],
      "preferred_learning_style": "visual",
      "plan_type": "hybrid"
    }
  }' | python3 -c "
import json, sys
data = json.load(sys.stdin)

print('🎯 AGENT EXECUTION SUMMARY:')
print('=' * 50)

if 'agent_timings' in data.get('data', {}):
    timings = data['data']['agent_timings']
    print(f\"\\n⏱️  Agent Timings:\")
    print(f\"  Profile Agent:  {timings.get('profile_agent', {}).get('execution_time_seconds', 'N/A')}s\")
    print(f\"  Match Agent:    {timings.get('match_agent', {}).get('execution_time_seconds', 'N/A')}s\")
    print(f\"  Schedule Agent: {timings.get('schedule_agent', {}).get('execution_time_seconds', 'N/A')}s\")
    print(f\"  Reviewer Agent: {timings.get('reviewer_agent', {}).get('execution_time_seconds', 'N/A')}s\")
    print(f\"  Total Time:     {timings.get('total_execution_time', 'N/A')}s\")

if 'selected_topics' in data.get('data', {}):
    topics = data['data']['selected_topics']
    print(f\"\\n📚 Topics Selected:\")
    print(f\"  Total: {len(topics)} topics\")
    for i, topic in enumerate(topics[:3], 1):
        print(f\"  {i}. {topic.get('title', 'N/A')} ({topic.get('niche', 'N/A')})\")

if 'weekly_plan' in data.get('data', {}):
    plan = data['data']['weekly_plan']
    print(f\"\\n📅 Weekly Plan Structure:\")
    print(f\"  Weeks: {len(plan)}\")

print()
"
```

---

## 🧪 **METHOD 3: Interactive Testing Script**

I've created: `test_agents_detailed.sh`

**Run it:**
```bash
./test_agents_detailed.sh
```

**Shows:**
- ✅ Test profile input
- ✅ Backend health status
- ✅ Agent execution times
- ✅ Topics selected by Match Agent
- ✅ Weekly plan structure
- ✅ Full JSON response saved to file

---

## 🔍 **METHOD 4: View Agent Outputs in Browser**

### **Step 1: Open Website**
Go to: https://unschooling-464413.web.app

### **Step 2: Open Browser Console**
Press F12 → Console tab

### **Step 3: Generate a Plan**
1. Sign in
2. Create child profile
3. Click "Generate Plan"

### **Step 4: Watch Console**

You'll see:
```javascript
🚀 Starting plan generation...
📝 Profile Agent: Processing child data
🎯 Match Agent: Finding topics
📅 Schedule Agent: Creating schedule
✅ Reviewer Agent: Validating plan
✅ Plan generated successfully!
```

**To see full details:**
```javascript
// In console, type:
localStorage.getItem('lastGeneratedPlan')
// Shows complete plan with all agent outputs
```

---

## 📊 **WHAT EACH AGENT DOES**

### **1. Profile Agent**

**Input:**
```json
{
  "child_name": "Emma",
  "child_age": 6,
  "interests": ["AI", "Music", "Art"],
  "preferred_learning_style": "visual",
  "plan_type": "hybrid"
}
```

**Output:**
```json
{
  "profile_analysis": {
    "child_name": "Emma",
    "child_age": 6,
    "cognitive_level": "intermediate",
    "attention_span": "medium",
    "learning_preferences": {
      "primary_style": "visual",
      "secondary_styles": ["kinesthetic"]
    }
  },
  "llm_insights": {
    "personality_traits": ["curious", "creative"],
    "motivation_drivers": ["hands-on", "visual"],
    "unique_characteristics": "Tech-savvy visual learner"
  },
  "agent_timing": {
    "execution_time_seconds": 0.45,
    "llm_used": true,
    "tokens_used": 1250
  }
}
```

---

### **2. Match Agent**

**Input:** Profile Agent output + Topics database (400+)

**Process:**
1. Uses LLM to analyze child's interests
2. Searches 400+ topics database
3. Matches topics to interests (AI, Music, Art)
4. Filters by age (6 years old)
5. Scores topics by relevance

**Output:**
```json
{
  "matched_topics": [
    {
      "title": "Introduction to AI",
      "niche": "AI",
      "age_group": "6-8",
      "difficulty": "beginner",
      "relevance_score": 95
    },
    {
      "title": "Music Fundamentals",
      "niche": "Music",
      "age_group": "6-8",
      "relevance_score": 88
    }
    // ... 8 more topics
  ],
  "match_analysis": {
    "total_topics_considered": 400,
    "topics_matched": 10,
    "niches_covered": ["AI", "Music", "Art"],
    "age_appropriate": true
  },
  "agent_timing": {
    "execution_time_seconds": 1.23,
    "llm_used": true,
    "tokens_used": 2575
  }
}
```

---

### **3. Schedule Agent**

**Input:** Match Agent output (10 topics)

**Process:**
1. Creates 4-week learning plan
2. Distributes topics across weeks
3. Assigns activities to days
4. Balances difficulty levels
5. Ensures variety

**Output:**
```json
{
  "weekly_plan": {
    "week1": {
      "theme": "AI Basics",
      "focus_areas": ["technology", "creativity"],
      "days": {
        "Monday": {
          "activity": "Introduction to AI",
          "duration": 30,
          "materials": ["computer", "notebook"]
        },
        "Tuesday": { ... },
        // ... rest of week
      }
    },
    "week2": { ... },
    "week3": { ... },
    "week4": { ... }
  },
  "plan_metadata": {
    "total_activities": 40,
    "difficulty_distribution": {
      "beginner": 20,
      "intermediate": 15,
      "advanced": 5
    }
  },
  "agent_timing": {
    "execution_time_seconds": 0.87,
    "llm_used": false
  }
}
```

---

### **4. Reviewer Agent**

**Input:** Schedule Agent output (complete plan)

**Process:**
1. Validates plan structure
2. Checks age-appropriateness
3. Verifies topic coverage
4. Suggests improvements
5. Adds quality score

**Output:**
```json
{
  "final_plan": {
    // Complete validated plan
  },
  "review_results": {
    "quality_score": 92,
    "age_appropriate": true,
    "topics_covered": 10,
    "balanced": true,
    "recommendations": [
      "Excellent variety",
      "Good difficulty progression"
    ]
  },
  "agent_timing": {
    "execution_time_seconds": 0.34,
    "llm_used": true,
    "tokens_used": 890
  }
}
```

---

## 🔍 **METHOD 5: View Cloud Run Logs in Console**

### **Visual Interface:**

1. **Go to:** https://console.cloud.google.com/run?project=unschooling-464413
2. **Click:** `llm-agents` service
3. **Click:** "LOGS" tab
4. **Filter:** Select last 1 hour
5. **Trigger:** Generate a plan from website
6. **Watch:** Real-time agent execution logs

**You'll see:**
```
[Profile Agent] Starting analysis...
[Profile Agent] Child: Emma, Age: 6
[Profile Agent] Interests: AI, Music, Art
[Profile Agent] LLM Analysis: Curious visual learner
[Profile Agent] Completed in 0.45s

[Match Agent] Starting topic matching...
[Match Agent] Searching 400+ topics...
[Match Agent] Found 25 potential matches
[Match Agent] LLM scoring topics...
[Match Agent] Selected top 10 topics
[Match Agent] Completed in 1.23s

[Schedule Agent] Creating 4-week plan...
[Schedule Agent] Distributing 10 topics across 4 weeks
[Schedule Agent] Assigning to days...
[Schedule Agent] Completed in 0.87s

[Reviewer Agent] Validating plan...
[Reviewer Agent] Quality score: 92/100
[Reviewer Agent] Age-appropriate: Yes
[Reviewer Agent] Completed in 0.34s

✅ Total execution time: 2.89 seconds
```

---

## 🧪 **METHOD 6: Test Individual Agents (Future)**

### **Create Endpoint for Each Agent:**

```python
# Add to backend/main_agents.py

@app.post("/api/test/profile-agent")
async def test_profile_agent(request: Request):
    """Test Profile Agent only"""
    body = await request.json()
    profile = body.get("profile", {})
    result = profile_agent.run(profile)
    return result

@app.post("/api/test/match-agent")
async def test_match_agent(request: Request):
    """Test Match Agent only"""
    body = await request.json()
    result = match_agent.run(body)
    return result

# Similar for schedule and reviewer agents
```

**Then test each:**
```bash
# Test Profile Agent only
curl -X POST "$BACKEND_URL/api/test/profile-agent" \
  -H "Content-Type: application/json" \
  -d '{"profile": {...}}'

# Test Match Agent only
curl -X POST "$BACKEND_URL/api/test/match-agent" \
  -H "Content-Type: application/json" \
  -d '{"profile_analysis": {...}, "matched_topics": [...]}'
```

---

## 📊 **CURRENT ISSUE & FIX**

### **Problem Identified:**

From the logs:
```
ERROR: Expecting value: line 1 column 1 (char 0)
```

This means:
- ✅ Profile Agent works
- ✅ Match Agent calls LLM
- ❌ LLM response is empty or malformed
- ❌ JSON parsing fails

### **Possible Causes:**

1. **Vertex AI quota exceeded**
2. **LLM prompt too long**
3. **Network timeout**
4. **API key issue**

### **Quick Fix:**

Check backend logs more:
```bash
gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=llm-agents AND severity>=ERROR" \
  --limit=20 \
  --project=unschooling-464413
```

---

## 🔧 **DEBUGGING AGENTS**

### **Enable Debug Mode in Backend:**

The backend already has `debug: True`, so logs are verbose.

### **See Full Agent Flow:**

```bash
# Generate plan and watch logs simultaneously
# Terminal 1: Watch logs
gcloud logging tail \
  "resource.type=cloud_run_revision AND resource.labels.service_name=llm-agents" \
  --project=unschooling-464413

# Terminal 2: Trigger plan generation
curl -X POST "https://llm-agents-44gsrw22gq-uc.a.run.app/api/generate-plan" \
  -H "Content-Type: application/json" \
  -d '{"profile":{"child_name":"Test","child_age":6,"interests":["AI"],"preferred_learning_style":"visual","plan_type":"hybrid"}}'
```

---

## 📋 **WHAT YOU'LL SEE IN LOGS**

### **Profile Agent Logs:**
```
INFO: 🚀 Starting full agent system
INFO: Step 1: Profile Agent
INFO: 🔍 Profile Agent: Analyzing child profile
INFO: Profile for Child (age 7) with interests: ['AI']
INFO: ✅ Profile Agent completed in 0.45 seconds
```

### **Match Agent Logs:**
```
INFO: Step 2: Match Agent - Systematic Topic Selection
INFO: 🎯 Selecting topics for Child (age 7) with interests: ['AI']
INFO: 🧠 Using Profile Agent insights: traits=['problem-solving'], preferences={...}
INFO: 🔍 Starting LLM-powered topic selection...
INFO: 🧠 Match Agent LLM Analysis: 2575 tokens
INFO: 📊 Match Agent result keys: ['matched_topics', 'match_analysis', ...]
INFO: 🎯 Match Agent returned 10 topics
```

### **Schedule Agent Logs:**
```
INFO: Step 3: Schedule Agent - Systematic 4-Week Planning
INFO: 📅 Creating structured schedule for 10 topics
INFO: 📊 Distributing topics across 4 weeks
INFO: ✅ Schedule created: 4 weeks, 40 activities
```

### **Reviewer Agent Logs:**
```
INFO: Step 4: Reviewer Agent - Quality Assurance
INFO: 🔍 Reviewing plan quality
INFO: ✅ Quality score: 92/100
INFO: ✅ Age-appropriate: Yes
INFO: ✅ Topic coverage: Excellent
```

---

## 🎯 **SIMPLE TEST COMMANDS**

### **Test 1: Check Health**
```bash
curl https://llm-agents-44gsrw22gq-uc.a.run.app/health | python3 -m json.tool
```

**Expected:**
```json
{
  "status": "healthy",
  "agents_available": true,
  "data_loaded": true
}
```

---

### **Test 2: Test Plan Generation**
```bash
curl -X POST "https://llm-agents-44gsrw22gq-uc.a.run.app/api/generate-plan" \
  -H "Content-Type: application/json" \
  -d '{"profile":{"child_name":"Emma","child_age":6,"interests":["AI","Music"],"preferred_learning_style":"visual","plan_type":"hybrid"}}' \
  | python3 -m json.tool > /tmp/plan_output.json

# View results
cat /tmp/plan_output.json
```

---

### **Test 3: Extract Agent Data**
```bash
# See timings
cat /tmp/plan_output.json | jq '.data.agent_timings'

# See selected topics
cat /tmp/plan_output.json | jq '.data.selected_topics[]| {title, niche, age_group}'

# See weekly plan
cat /tmp/plan_output.json | jq '.data.weekly_plan.week1'
```

---

## 🚨 **CURRENT ERROR FIX NEEDED**

### **The Issue:**

Match Agent's LLM is returning empty/malformed JSON.

### **Temporary Solution:**

Update backend to handle this:

```python
# In backend/agents/match_agent.py
try:
    llm_response = model.generate_content(prompt)
    response_text = llm_response.text
    
    # Parse JSON
    topics_data = json.loads(response_text)
except json.JSONDecodeError:
    # Fallback: Use rule-based matching
    logger.warning("LLM response parsing failed, using fallback")
    topics_data = fallback_topic_selection(profile, all_topics)
```

### **Permanent Solution:**

1. Check Vertex AI quotas
2. Verify API authentication
3. Test LLM prompt formatting
4. Add retry logic

---

## 🎯 **RECOMMENDED TESTING WORKFLOW**

### **For Development:**

```bash
# 1. Watch logs in one terminal
gcloud logging tail \
  "resource.type=cloud_run_revision AND resource.labels.service_name=llm-agents" \
  --project=unschooling-464413

# 2. Test in another terminal
curl -X POST "https://llm-agents-44gsrw22gq-uc.a.run.app/api/generate-plan" \
  -H "Content-Type: application/json" \
  -d '{"profile":{...your test profile...}}'

# 3. See what each agent does in real-time!
```

### **For Quick Testing:**

```bash
# Use the script
./test_agents_detailed.sh

# Check output file
cat /tmp/agent_response.json | python3 -m json.tool
```

---

## ✅ **SUMMARY**

### **To See Agent Inputs/Outputs:**

**Best Method:** Cloud Run Logs (real-time)
```bash
gcloud logging tail \
  "resource.type=cloud_run_revision AND resource.labels.service_name=llm-agents" \
  --project=unschooling-464413
```

**Quick Method:** Test script
```bash
./test_agents_detailed.sh
```

**Browser Method:** Console logs when generating plan

**Current Status:**
- ✅ Profile Agent: Working
- ⚠️  Match Agent: LLM response parsing error
- ⚠️  Schedule Agent: Blocked by Match Agent error
- ⚠️  Reviewer Agent: Blocked by Match Agent error

**Fix Needed:** Backend LLM response handling

---

**Would you like me to fix the Match Agent LLM parsing error?** 🔧

