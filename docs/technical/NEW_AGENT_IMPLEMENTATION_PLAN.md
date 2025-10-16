# 🚀 New Agent System Implementation Plan

**Date:** 2025-10-12  
**Status:** READY FOR REVIEW BEFORE IMPLEMENTATION

---

## 🎯 Key Changes

### **1. Match Agent:**
- ❌ OLD: Selects 28 topics (14 niche + 14 EG, rigid 50/50)
- ✅ NEW: Selects 50 topics (mix niche + EG intelligently)
- **Why:** Gives Schedule Agent more choice

### **2. Schedule Agent:**
- ❌ OLD: Uses all 28 topics from Match Agent
- ✅ NEW: Selects final 28 topics from 50 candidates
- **Why:** Can pick best fit for each day/theme

### **3. Analysis Agent:**
- ❌ OLD: Psychological analysis only
- ✅ NEW: Monthly Planning + Theme Selection
- **Why:** Needs to plan monthly strategy and select themes

### **4. Data Mixing:**
- ❌ OLD: Rigid 50/50 split (niche vs EG)
- ✅ NEW: Intelligent mixing based on needs
- **Why:** More flexible, better personalization

---

## 📊 New Agent Flow

```
Parent Input
   ↓
1. PROFILE AGENT (✅ DONE)
   - Analyzes profile
   - Makes assumptions
   - Stores child data
   OUTPUT: standardized_profile with insights
   ↓
2. ANALYSIS AGENT (🔧 NEEDS UPDATE)
   - Determines month type (intro/continuation)
   - Selects themes from theme_names.json
   - Creates monthly strategy
   - Plans weekly progression
   OUTPUT: monthly_plan_structure with selected themes
   ↓
3. MATCH AGENT (🔧 NEEDS UPDATE)
   - Queries niche topics (400+)
   - Queries essential growth activities
   - **Selects 50 topics** (intelligent mix)
   OUTPUT: 50 candidate topics
   ↓
4. SCHEDULE AGENT (🔧 NEEDS UPDATE)
   - Receives 50 candidates
   - **Selects final 28 topics**
   - Organizes into 4-week daily schedule
   OUTPUT: 28-topic daily plan
   ↓
5. REVIEWER AGENT (🔧 NEEDS UPDATE)
   - Quality checks
   - Validates plan
   OUTPUT: final approved plan
```

---

## 🔧 Implementation Details

### **Agent 2: Analysis Agent (Monthly Planning)**

```python
class AnalysisAgent:
    """Monthly Planning & Theme Selection"""
    
    def __init__(self):
        # Load theme_names.json (240 themes)
        self.themes = load_themes()
    
    def run(self, profile_result):
        # 1. Determine month type
        month_number = profile.get('current_month', 1)
        month_type = "introduction" if month_number == 1 else "continuation"
        
        # 2. Filter themes by age, interests, plan type
        age_group = self._get_age_group(child_age)  # e.g., "6-8 yrs"
        matching_themes = self._filter_themes(
            age_group=age_group,
            interests=interests,
            plan_type=plan_type
        )
        
        # 3. Use LLM to select best theme(s) for this month
        selected_themes = self._llm_select_themes(
            matching_themes, 
            child_profile, 
            month_type
        )
        
        # 4. Create monthly strategy
        monthly_strategy = self._create_monthly_strategy(
            selected_themes,
            plan_type,
            month_type
        )
        
        # 5. Output for Match Agent
        return {
            "monthly_plan_structure": {
                "month_number": month_number,
                "month_type": month_type,
                "selected_themes": selected_themes,
                "monthly_agenda": {
                    "primary_goal": "...",
                    "thought_process": "...",
                    "learning_narrative": "..."
                },
                "weekly_progression": {
                    "week_1": "Foundation - ...",
                    "week_2": "Exploration - ...",
                    "week_3": "Application - ...",
                    "week_4": "Project - ..."
                },
                "guidance_for_match_agent": {
                    "topic_criteria": "...",
                    "skill_focus": [...],
                    "avoid": [...]
                }
            }
        }
```

**LLM Prompt:**
```
You are an educational strategist. Select the best theme(s) for this month.

CHILD PROFILE:
- Age: 7 years
- Interests: Technology, Science
- Plan Type: Hybrid
- Month: 1 (Introduction)

AVAILABLE THEMES (filtered for age 6-8):
1. Little Scientists Lab - STEM & Cognitive
2. Story Builders - Language & Creativity
3. Tech Explorers - Technology & Innovation
...

TASK: Select 1 theme (Hybrid) or 2-3 themes (Holistic) that:
1. Match child's interests
2. Are appropriate for introduction month
3. Build foundation for future learning

Return JSON:
{
  "selected_themes": [...],
  "rationale": "why these themes",
  "monthly_goal": "what child will learn"
}
```

---

### **Agent 3: Match Agent (50 Topics)**

```python
class MatchAgent:
    def __init__(self):
        self.niche_topics = load_niche_topics()  # 400+
        self.eg_activities = load_essential_growth()  # 18 pillars
    
    def run(self, analysis_result):
        monthly_structure = analysis_result['monthly_plan_structure']
        selected_themes = monthly_structure['selected_themes']
        guidance = monthly_structure['guidance_for_match_agent']
        
        # 1. Filter niche topics
        niche_pool = self._filter_niche_topics(
            themes=selected_themes,
            age=child_age,
            interests=interests,
            criteria=guidance['topic_criteria']
        )
        
        # 2. Filter EG activities
        eg_pool = self._filter_eg_activities(
            age=child_age,
            skill_focus=guidance['skill_focus'],
            developmental_needs=True
        )
        
        # 3. Use LLM to select 50 topics (intelligent mix)
        selected_topics = self._llm_select_topics(
            niche_pool=niche_pool,
            eg_pool=eg_pool,
            target_count=50,
            balance_criteria={
                "themes": selected_themes,
                "skills": guidance['skill_focus'],
                "variety": True
            }
        )
        
        return {
            "candidate_topics": selected_topics,  # 50 topics
            "topic_distribution": {
                "from_niches": count_niche,
                "from_essential_growth": count_eg,
                "themes_covered": [...],
                "skills_covered": [...]
            }
        }
```

**LLM Prompt:**
```
You are a curriculum designer. Select 50 topics for this month.

MONTHLY THEME: Little Scientists Lab
CHILD: 7-year-old, loves science and technology

AVAILABLE TOPICS:
NICHE POOL (100 topics):
1. Build a Volcano - Science experiment
2. Robot Building - Technology
...

ESSENTIAL GROWTH POOL (80 activities):
1. Problem Solving Puzzles - Cognitive
2. Team Building Game - Social
...

TASK: Select 50 topics that:
1. Support the monthly theme
2. Mix niche + essential growth intelligently
3. Cover variety of skills
4. Balance difficulty levels

Return JSON with 50 topic IDs and rationale for each.
```

---

### **Agent 4: Schedule Agent (Final 28 from 50)**

```python
class ScheduleAgent:
    def run(self, match_result):
        candidate_topics = match_result['candidate_topics']  # 50 topics
        monthly_structure = match_result['monthly_plan_structure']
        
        # 1. Use LLM to select final 28 topics
        final_topics = self._llm_select_final_topics(
            candidates=candidate_topics,
            count=28,
            weekly_structure=monthly_structure['weekly_progression']
        )
        
        # 2. Organize into 4 weeks (7 topics each)
        weekly_plan = {
            "week_1": self._assign_topics_to_week(
                final_topics[0:7], 
                "Foundation"
            ),
            "week_2": self._assign_topics_to_week(
                final_topics[7:14], 
                "Exploration"
            ),
            "week_3": self._assign_topics_to_week(
                final_topics[14:21], 
                "Application"
            ),
            "week_4": self._assign_topics_to_week(
                final_topics[21:28], 
                "Project"
            )
        }
        
        # 3. Create daily schedule
        daily_schedule = self._create_daily_schedule(weekly_plan)
        
        return {
            "monthly_plan": {
                "final_topics": final_topics,  # 28 topics
                "weekly_plan": weekly_plan,
                "daily_schedule": daily_schedule,
                "unused_candidates": len(candidate_topics) - 28  # 22 topics
            }
        }
```

**LLM Prompt:**
```
You are a scheduling expert. Select 28 topics from 50 candidates.

CANDIDATES (50 topics):
[list of 50 topics with details]

WEEKLY STRUCTURE:
- Week 1: Foundation (7 topics)
- Week 2: Exploration (7 topics)
- Week 3: Application (7 topics)
- Week 4: Project (7 topics)

TASK: Select 28 topics that:
1. Best fit each week's focus
2. Create logical progression
3. Build skills systematically
4. Culminate in Week 4 project

Return JSON with 28 selected topic IDs organized by week.
```

---

### **Agent 5: Reviewer Agent (Validation)**

```python
class ReviewerAgent:
    def run(self, schedule_result):
        monthly_plan = schedule_result['monthly_plan']
        
        # Quality checks
        checks = {
            "coherence": self._check_coherence(monthly_plan),
            "age_appropriate": self._check_age(monthly_plan),
            "balance": self._check_balance(monthly_plan),
            "feasibility": self._check_feasibility(monthly_plan),
            "progression": self._check_progression(monthly_plan)
        }
        
        # Calculate quality score
        quality_score = self._calculate_score(checks)
        
        # Approval decision
        approved = quality_score >= 80
        
        return {
            "final_plan": monthly_plan,
            "quality_report": {
                "score": quality_score,
                "checks": checks,
                "approved": approved
            }
        }
```

---

## 📝 Standard Data Structure

### **Between All Agents:**

```json
{
  "profile": {...},  // Always passed through
  "standardized_profile": {...},  // From Profile Agent
  "profile_insights": {...},  // From Profile Agent
  "monthly_plan_structure": {...},  // From Analysis Agent
  "candidate_topics": [...],  // From Match Agent (50 topics)
  "monthly_plan": {...},  // From Schedule Agent (28 topics)
  "quality_report": {...},  // From Reviewer Agent
  "agent_timing": {...}  // From each agent
}
```

---

## ⚡ Implementation Steps

1. ✅ **Backup current file** (`main_agents_before_update.py`)
2. 🔧 **Update Analysis Agent** - Add theme loading, monthly planning
3. 🔧 **Update Match Agent** - Change to 50 topics, intelligent mixing
4. 🔧 **Update Schedule Agent** - Select final 28 from 50
5. 🔧 **Update Reviewer Agent** - Update validation logic
6. 🔧 **Update agent initialization** - Add AnalysisAgent() init
7. 🔧 **Update main flow** - Pass data correctly between agents
8. 🧪 **Test with sample user**
9. 📊 **Generate latest_customer.html**
10. ✅ **Verify all agents working**

---

## 🚨 Risks & Considerations

1. **Theme Database Path** - Must correctly load `backend/data/theme_names.json`
2. **LLM Token Limits** - 50 topics might be large for single prompt
3. **Data Structure Changes** - All agents must handle new format
4. **Backward Compatibility** - Old saved plans won't work
5. **Testing Required** - Full end-to-end test needed

---

## ✅ Testing Plan

1. **Test Profile Agent** - Verify insights generation
2. **Test Analysis Agent** - Check theme selection
3. **Test Match Agent** - Verify 50 topics returned
4. **Test Schedule Agent** - Confirm 28 final topics
5. **Test Reviewer Agent** - Validate approval logic
6. **Test Full Flow** - Complete plan generation
7. **Check HTML Output** - Verify latest_customer.html

---

## 📊 Expected Output Structure

```json
{
  "success": true,
  "data": {
    "monthly_plan": {
      "month": 1,
      "theme": "Little Scientists Lab",
      "final_topics": [28 topics],
      "weekly_plan": {
        "week_1": {...},
        "week_2": {...},
        "week_3": {...},
        "week_4": {...}
      },
      "daily_schedule": [...]
    },
    "quality_report": {
      "score": 92,
      "approved": true
    }
  },
  "agent_timings": {
    "profile_agent": {...},
    "analysis_agent": {...},
    "match_agent": {...},
    "schedule_agent": {...},
    "reviewer_agent": {...}
  }
}
```

---

## 🤔 Review Questions

Before I implement:

1. ✅ **Analysis Agent** - Should select themes from theme_names.json?
2. ✅ **Match Agent** - 50 topics correct? (not 28 or other number)
3. ✅ **Schedule Agent** - Chooses final 28 from 50?
4. ✅ **Data Mixing** - Intelligent mix (not rigid 50/50)?
5. ✅ **LLM Usage** - All agents except Profile and Reviewer use LLM?

---

**READY TO IMPLEMENT? Please confirm and I'll proceed with all changes.**

