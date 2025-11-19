# Weekly Plan Data Format - Agent Instructions

## 📋 Required Data Structure for Frontend Routing

### FOR ALL DAILY ACTIVITIES:

Each daily activity in the weekly plan MUST include these fields for correct routing:

---

## 🎯 FORMAT FOR NICHE TOPICS

```json
{
  "topic": "Building a Mini-Business",
  "niche": "Finance",
  "duration": "30-45 minutes",
  "objective": "Help kids create and run a small business project",
  "difficulty": "Intermediate",
  "materials_needed": ["Paper", "Markers", "Calculator"]
}
```

**REQUIRED FIELDS:**
- ✅ `topic` (string) - Exact topic name from topicsdata.json
- ✅ `niche` (string) - Exact niche name (Finance, Communication, Leadership, etc.)
- ✅ `duration` (string)
- ✅ `objective` (string)
- ✅ `difficulty` (string)

**ROUTING:**
- Frontend creates: `/niche/{niche-slug}/{topic-slug}`
- Example: `/niche/finance/building-a-mini-business`

---

## 🌱 FORMAT FOR ESSENTIAL GROWTH ACTIVITIES

```json
{
  "topic": "Make Your Own Board Game",
  "niche": "Essential Growth",
  "pillar": "Play & Creativity",
  "pillar_slug": "play-creativity",
  "duration": "30-45 minutes",
  "objective": "Create and design a custom board game",
  "difficulty": "Intermediate",
  "materials_needed": ["Cardboard", "Markers", "Dice"]
}
```

**REQUIRED FIELDS:**
- ✅ `topic` (string) - Exact activity name from Essential Growth JSON
- ✅ `niche` (string) - MUST be "Essential Growth"
- ✅ `pillar` (string) - Full pillar name (e.g., "Play & Creativity", "Cognitive Skills")
- ✅ `pillar_slug` (string) - Pillar slug (e.g., "play-creativity", "cognitive-skills")
- ✅ `duration` (string)
- ✅ `objective` (string)
- ✅ `difficulty` (string)

**ROUTING:**
- Frontend creates: `/essential-growth/{pillar-slug}/{activity-slug}`
- Example: `/essential-growth/play-creativity/make-your-own-board-game`

---

## 📐 18 ESSENTIAL GROWTH PILLARS (Reference)

Agents MUST select pillar from this list:

| Pillar Name | pillar_slug |
|-------------|-------------|
| Play & Creativity | play-creativity |
| Cognitive Skills | cognitive-skills |
| Physical & Social Play | physical-social-play |
| Language & Speech | language-speech |
| Learning Tools | learning-tools |
| Health & Fitness | health-fitness |
| Visual Arts | visual-arts |
| Music & Rhythm | music-rhythm |
| Nature Exploration | nature-exploration |
| Cultural Awareness | cultural-awareness |
| Emotional Intelligence | emotional-intelligence |
| Life Skills | life-skills |
| Science & Discovery | science-discovery |
| Math & Logic | math-logic |
| Technology & Innovation | technology-innovation |
| Reading & Literacy | reading-literacy |
| Writing & Expression | writing-expression |
| Social Responsibility | social-responsibility |

---

## 🔗 SLUG CREATION RULES (Frontend Auto-Generates)

**Agents don't need to create slugs - frontend does it automatically!**

Frontend slug logic:
```javascript
const slug = name
  .toLowerCase()
  .replace(/\s+/g, '-')       // Spaces to hyphens
  .replace(/[^a-z0-9-]/g, '');  // Keep only letters, numbers, hyphens
```

Examples:
- "Building a Mini-Business" → "building-a-mini-business"
- "Make Your Own Board Game" → "make-your-own-board-game"
- "Play & Creativity" → "play-creativity"

**Agents just provide the full names, frontend handles slugs!**

---

## ✅ COMPLETE EXAMPLE: Weekly Plan Day

```json
{
  "monday": {
    "topic": "Building a Mini-Business",
    "niche": "Finance",
    "duration": "30-45 minutes",
    "objective": "Help kids create and run a small business project",
    "difficulty": "Intermediate",
    "materials_needed": ["Paper", "Markers", "Calculator"],
    "age_appropriate": 6
  },
  "tuesday": {
    "topic": "Make Your Own Board Game",
    "niche": "Essential Growth",
    "pillar": "Play & Creativity",
    "pillar_slug": "play-creativity",
    "duration": "30-45 minutes",
    "objective": "Create and design a custom board game",
    "difficulty": "Intermediate",
    "materials_needed": ["Cardboard", "Markers", "Dice"],
    "age_appropriate": 6
  }
}
```

---

## 🚨 CRITICAL RULES FOR AGENTS:

### Rule 1: IF niche = "Essential Growth"
**MUST include:** `pillar` AND `pillar_slug`

### Rule 2: IF niche = anything else (Finance, Communication, etc.)
**DON'T include:** pillar fields (not needed)

### Rule 3: Topic names MUST match exactly
- Use exact names from source data
- Don't modify or simplify names
- Frontend handles slug conversion

### Rule 4: Pillar names MUST match exactly
- Use exact pillar names from list above
- Use exact pillar_slug from list above
- Don't create new pillar names

---

## 🔍 VALIDATION CHECKLIST FOR AGENTS:

Before returning a weekly plan, check:

- [ ] All niche topics have `niche` field
- [ ] All Essential Growth activities have `niche` = "Essential Growth"
- [ ] All Essential Growth activities have BOTH `pillar` AND `pillar_slug`
- [ ] All pillar names match the 18 official pillars
- [ ] All pillar_slugs match the official slugs
- [ ] Topic names match source data exactly

---

## 🎯 AGENT PROMPT ADDITION:

**Add this to your agent prompts:**

```
CRITICAL ROUTING REQUIREMENTS:

When selecting Essential Growth activities, you MUST include these fields:
- "niche": "Essential Growth"
- "pillar": [Exact pillar name from list]
- "pillar_slug": [Exact slug from list]

Example:
{
  "topic": "Sensory Play Mat",
  "niche": "Essential Growth",
  "pillar": "Play & Creativity",
  "pillar_slug": "play-creativity",
  ...
}

Without pillar info, the frontend cannot create clickable links to the activity!
```

---

## 📊 CURRENT VS NEEDED FORMAT:

### CURRENT (Broken):
```json
{
  "topic": "Make Your Own Board Game",
  "niche": "Essential Growth"
}
```
❌ Missing pillar → Can't route → Not clickable

### NEEDED (Working):
```json
{
  "topic": "Make Your Own Board Game",
  "niche": "Essential Growth",
  "pillar": "Play & Creativity",
  "pillar_slug": "play-creativity"
}
```
✅ Has pillar → Can route to `/essential-growth/play-creativity/make-your-own-board-game`

---

## 🔧 WHERE TO ADD THIS IN BACKEND:

Check these files:
1. `backend/agents/schedule_agent.py` - Where daily activities are created
2. `backend/agents/plan_generator.py` - Where plans are generated
3. `backend/main_agents.py` - Main orchestration

Make sure when Essential Growth activities are selected, the code includes:
```python
if activity.get('niche') == 'Essential Growth':
    day_activity['pillar'] = activity.get('pillar', 'Unknown')
    day_activity['pillar_slug'] = activity.get('pillar_slug', 'unknown')
```

---

End of format specification.


