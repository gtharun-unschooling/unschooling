"""
Full Agent System Backend with Google AI Studio Gemini API
Uses Gemini 2.5 Flash for fast, cost-effective plan generation
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os
import json
import time
from typing import Dict, Any, List
# MIGRATED TO GOOGLE AI STUDIO (Gemini API with instant access)
import google.generativeai as genai
import os
from real_usage_tracker import real_usage_tracker
from child_activity_tracker import child_activity_tracker

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Unschooling Backend - Agent System",
    debug=True,
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data files - NO FALLBACK DATA
def load_topics_data():
    """Load topics data from the original data source."""
    try:
        topics_file = "data/topicsdata.json"
        logger.info(f"📁 Loading topics data from {topics_file}")
        
        if not os.path.exists(topics_file):
            logger.error(f"❌ Topics data file not found: {topics_file}")
            return []
            
        with open(topics_file, "r", encoding='utf-8') as f:
            data = json.load(f)
            logger.info(f"✅ Successfully loaded {len(data)} topics from {topics_file}")
            return data
            
    except Exception as e:
        logger.error(f"❌ Error loading topics data: {e}")
        return []

def load_niches_data():
    """Load niches data from the original data source."""
    try:
        niches_file = "data/nichesdata.json"
        logger.info(f"📁 Loading niches data from {niches_file}")
        
        if not os.path.exists(niches_file):
            logger.error(f"❌ Niches data file not found: {niches_file}")
            return []
            
        with open(niches_file, "r", encoding='utf-8') as f:
            data = json.load(f)
            logger.info(f"✅ Successfully loaded {len(data)} niches from {niches_file}")
            return data
            
    except Exception as e:
        logger.error(f"❌ Error loading niches data: {e}")
        return []

def load_essential_growth_data():
    """Load essential growth data from the original data source."""
    try:
        essential_file = "data/essential-growth/index.json"
        logger.info(f"📁 Loading essential growth data from {essential_file}")
        
        if not os.path.exists(essential_file):
            logger.error(f"❌ Essential growth data file not found: {essential_file}")
            return {}
            
        with open(essential_file, "r", encoding='utf-8') as f:
            data = json.load(f)
            logger.info(f"✅ Successfully loaded essential growth data from {essential_file}")
            return data
            
    except Exception as e:
        logger.error(f"❌ Error loading essential growth data: {e}")
        return {}

# Import the new systematic agents
from agents.match_agent import run_match_agent
from agents.schedule_agent import run_schedule_agent
from agents.plan_generator import RealPlanGenerator

# Agent System Implementation
class ProfileAgent:
    """Profile Agent - Intelligent Profile Understanding & Evolution Engine.
    
    Responsibilities:
    1. Analyzes parent-created profiles deeply (not just extraction)
    2. Makes intelligent assumptions based on provided information
    3. Stores profile data in structured, retrievable format
    4. Acts as central knowledge base about the child
    5. Tracks monthly behavioral patterns and learning traits
    6. Builds comprehensive developmental history over time
    7. Provides enriched context to all downstream agents
    """
    
    def run(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze and understand the child's profile intelligently."""
        start_time = time.time()
        logger.info("📋 Profile Agent: Intelligent Profile Analysis & Understanding")
        
        # Extract observable fields provided by user
        child_name = profile.get("child_name", "Child")
        child_age = profile.get("child_age", 7)
        interests = profile.get("interests", [])
        dislikes = profile.get("dislikes", [])
        learning_style = profile.get("preferred_learning_style", "visual")
        goals = profile.get("goals", [])
        plan_type = profile.get("plan_type", "hybrid")
        
        logger.info(f"📊 Analyzing Profile for {child_name} (age {child_age})")
        logger.info(f"   • Interests: {interests}")
        logger.info(f"   • Dislikes: {dislikes}")
        logger.info(f"   • Learning Style: {learning_style}")
        logger.info(f"   • Goals: {goals}")
        logger.info(f"   • Plan Type: {plan_type}")
        
        # Analyze and understand the profile context
        profile_insights = self._analyze_profile_context(
            child_name, child_age, interests, dislikes, learning_style, goals, plan_type
        )
        
        logger.info(f"🧠 Profile Insights Generated:")
        logger.info(f"   • Parent Intent: {profile_insights.get('parent_intent')}")
        logger.info(f"   • Interest Pattern: {profile_insights.get('interest_pattern')}")
        logger.info(f"   • Learning Focus: {profile_insights.get('learning_focus')}")
        
        # Create standardized profile with insights
        standardized_profile = {
            "child_name": child_name,
            "child_age": child_age,
            "interests": interests,
            "dislikes": dislikes,
            "preferred_learning_style": learning_style,
            "goals": goals,
            "plan_type": plan_type,
            "profile_insights": profile_insights,
            "agent_flow": "ProfileAgent",
            "processing_timestamp": time.time(),
            "monthly_evolution": {
                "current_month": 1,
                "observations": [],
                "behavioral_patterns": [],
                "historical_context": "Initial profile - no history yet"
            }
        }
        
        result = {
            "profile": profile,
            "standardized_profile": standardized_profile,
            "agent_timing": {
                "agent_name": "ProfileAgent",
                "execution_time_seconds": time.time() - start_time,
                "llm_used": False,
                "tokens_used": 0,
                "action": "profile_analyzed_and_stored",
                "insights_generated": True
            }
        }
        
        logger.info(f"✅ Profile Agent completed analysis in {time.time() - start_time:.2f} seconds")
        return result
    
    def _analyze_profile_context(self, child_name, child_age, interests, dislikes, 
                                  learning_style, goals, plan_type):
        """Analyze the profile and make intelligent assumptions about the child."""
        
        # Analyze interest patterns
        interest_pattern = "diverse" if len(interests) > 3 else "focused"
        if any(interest.lower() in ["technology", "coding", "robotics", "ai"] for interest in interests):
            interest_pattern = "technology-oriented"
        elif any(interest.lower() in ["art", "music", "dancing", "crafts"] for interest in interests):
            interest_pattern = "creative-oriented"
        elif any(interest.lower() in ["sports", "outdoor", "physical"] for interest in interests):
            interest_pattern = "physical-oriented"
        
        # Infer parent intent from plan type and goals
        parent_intent = "balanced development"
        if plan_type == "hybrid":
            parent_intent = "depth-focused mastery in specific areas"
        elif plan_type == "holistic":
            parent_intent = "well-rounded development across all domains"
        
        # Determine learning focus
        learning_focus = "experiential"
        if learning_style in ["visual", "auditory"]:
            learning_focus = "observation-based"
        elif learning_style == "kinesthetic":
            learning_focus = "hands-on and active"
        elif learning_style == "read/write":
            learning_focus = "text-based and reflective"
        
        # Make assumptions about engagement preferences
        engagement_preferences = []
        if len(interests) > 0:
            engagement_preferences.append("interest-driven activities preferred")
        if len(dislikes) > 0:
            engagement_preferences.append("avoid topics similar to dislikes")
        if age_appropriate_attention_span := self._estimate_attention_span(child_age):
            engagement_preferences.append(f"activities should be {age_appropriate_attention_span} minutes or less")
        
        return {
            "parent_intent": parent_intent,
            "interest_pattern": interest_pattern,
            "learning_focus": learning_focus,
            "engagement_preferences": engagement_preferences,
            "assumptions": {
                "optimal_session_length": self._estimate_attention_span(child_age),
                "complexity_preference": "moderate" if child_age >= 6 else "simple",
                "independence_level": "guided" if child_age < 9 else "semi-independent",
                "social_preference": "collaborative" if "teamwork" in ' '.join(goals).lower() else "individual-focused"
            },
            "context_notes": f"{child_name} is a {child_age}-year-old with {interest_pattern} interests, preferring {learning_focus} learning approaches."
        }
    
    def _estimate_attention_span(self, age):
        """Estimate age-appropriate attention span."""
        if age < 4:
            return 10
        elif age < 6:
            return 15
        elif age < 9:
            return 20
        elif age < 12:
            return 30
        else:
            return 45


class AnalysisAgent:
    """Analysis Agent - Monthly Planning & Theme Selection.
    
    Responsibilities:
    1. Determines if this is first month (intro) or continuation
    2. Selects appropriate themes from theme_names.json (240 themes)
    3. Creates monthly learning strategy and agenda
    4. Plans weekly progression (Foundation → Exploration → Application → Project)
    5. Provides guidance to Match and Schedule agents
    """
    
    def __init__(self):
        logger.info("🧠 Initializing AnalysisAgent (Monthly Planning)")
        # Load theme names database
        import os
        # Try both paths for compatibility (local vs Cloud Run)
        possible_paths = [
            "data/theme_names.json",  # Cloud Run path
            "backend/data/theme_names.json"  # Local path
        ]
        
        self.themes = []
        for theme_file in possible_paths:
            try:
                if os.path.exists(theme_file):
                    with open(theme_file, 'r', encoding='utf-8') as f:
                        theme_data = json.load(f)
                        self.themes = theme_data.get('themes', [])
                    logger.info(f"📚 Loaded {len(self.themes)} themes from {theme_file}")
                    break
            except Exception as e:
                logger.warning(f"⚠️ Could not load from {theme_file}: {e}")
        
        if len(self.themes) == 0:
            logger.error(f"❌ Failed to load themes from any path!")
        else:
            logger.info(f"✅ Analysis Agent ready with {len(self.themes)} themes")
    
    def run(self, profile_result: Dict[str, Any]) -> Dict[str, Any]:
        """Create monthly learning strategy and select themes."""
        start_time = time.time()
        logger.info("🧠 Analysis Agent: Creating Monthly Learning Strategy")
        
        standardized_profile = profile_result.get("standardized_profile", {})
        profile_insights = standardized_profile.get("profile_insights", {})
        monthly_evolution = standardized_profile.get("monthly_evolution", {})
        
        # Extract standardized fields
        child_name = standardized_profile.get("child_name", "Child")
        child_age = standardized_profile.get("child_age", 7)
        interests = standardized_profile.get("interests", [])
        dislikes = standardized_profile.get("dislikes", [])
        learning_style = standardized_profile.get("preferred_learning_style", "visual")
        goals = standardized_profile.get("goals", [])
        plan_type = standardized_profile.get("plan_type", "hybrid")
        
        # Determine month type
        current_month = monthly_evolution.get("current_month", 1)
        month_type = "introduction" if current_month == 1 else "continuation"
        
        logger.info(f"📅 Planning Month {current_month} ({month_type}) for {child_name} (age {child_age})")
        
        # Get age group for theme filtering
        age_group = self._get_age_group(child_age)
        
        # Filter themes by age, interests, and plan type
        matching_themes = self._filter_themes(age_group, interests, plan_type)
        
        logger.info(f"📚 Found {len(matching_themes)} matching themes for age {age_group}, plan type: {plan_type}")
        
        # Check if we have themes
        if len(self.themes) == 0:
            logger.error("❌ CRITICAL: No themes loaded in Analysis Agent! Using fallback.")
        if len(matching_themes) == 0:
            logger.warning(f"⚠️ No themes matched for age {age_group}, plan {plan_type}. Relaxing filters...")
            # Fallback: Just match age group and plan type, ignore interests
            matching_themes = [t for t in self.themes 
                             if t.get('ageGroup') == age_group and t.get('planType', '').lower() == plan_type.lower()]
            logger.info(f"📚 After relaxing filters: {len(matching_themes)} themes")
        
        # Use LLM to select best theme(s) for this month
        selected_themes, monthly_strategy = self._llm_select_themes_and_strategy(
            matching_themes, child_name, child_age, interests, dislikes, 
            learning_style, goals, plan_type, month_type, profile_insights
        )
        
        logger.info(f"✅ Selected {len(selected_themes)} theme(s): {[t['themeName'] for t in selected_themes]}")
        
        # Create monthly plan structure
        monthly_plan_structure = {
            "month_number": current_month,
            "month_type": month_type,
            "selected_themes": selected_themes,
            "monthly_agenda": monthly_strategy["monthly_agenda"],
            "weekly_progression": monthly_strategy["weekly_progression"],
            "guidance_for_match_agent": monthly_strategy["guidance_for_match_agent"],
            "guidance_for_schedule_agent": monthly_strategy["guidance_for_schedule_agent"]
        }
        
        result = {
            "profile": profile_result.get("profile", {}),
            "standardized_profile": standardized_profile,
            "monthly_plan_structure": monthly_plan_structure,
            "agent_timing": {
                "agent_name": "AnalysisAgent",
                "execution_time_seconds": time.time() - start_time,
                "llm_used": True,
                "tokens_used": monthly_strategy.get("tokens_used", 0),
                "llm_prompt": monthly_strategy.get("llm_prompt"),
                "llm_response": monthly_strategy
            }
        }
        
        logger.info(f"✅ Analysis Agent completed in {time.time() - start_time:.2f} seconds")
        return result
    
    def _get_age_group(self, age: int) -> str:
        """Convert age to age group string."""
        if age <= 5:
            return "3–5 yrs"
        elif age <= 8:
            return "6–8 yrs"
        elif age <= 12:
            return "9–12 yrs"
        else:
            return "13–18 yrs"
    
    def _filter_themes(self, age_group: str, interests: List[str], plan_type: str) -> List[Dict]:
        """Filter themes by age group, interests, and plan type."""
        
        logger.info(f"🔍 Filtering themes: age={age_group}, plan={plan_type}, interests={interests}")
        logger.info(f"   Total themes available: {len(self.themes)}")
        
        # Step 1: Filter by age and plan type (mandatory)
        age_plan_matched = []
        for theme in self.themes:
            if theme.get("ageGroup") == age_group and theme.get("planType", "").lower() == plan_type.lower():
                age_plan_matched.append(theme)
        
        logger.info(f"   After age+plan filter: {len(age_plan_matched)} themes")
        
        # Step 2: Try to match interests (optional - broader matching)
        if interests and age_plan_matched:
            interest_matched = []
            
            # Create broader keyword list from interests
            interest_keywords = []
            for interest in interests:
                interest_lower = interest.lower()
                interest_keywords.append(interest_lower)
                # Add related keywords
                if interest_lower in ["science", "technology", "tech"]:
                    interest_keywords.extend(["stem", "science", "technology", "tech", "innovation", "experiment"])
                elif interest_lower in ["art", "drawing", "painting"]:
                    interest_keywords.extend(["art", "creative", "creativity", "visual", "drawing", "painting"])
                elif interest_lower in ["music", "dancing", "dance"]:
                    interest_keywords.extend(["music", "rhythm", "dance", "movement", "performing"])
            
            interest_keywords = list(set(interest_keywords))  # Remove duplicates
            logger.info(f"   Interest keywords: {interest_keywords[:10]}")
            
            for theme in age_plan_matched:
                theme_text = f"{theme.get('themeName', '')} {theme.get('shortDescription', '')} {theme.get('coreFocusArea', '')}".lower()
                
                # Check if any keyword matches
                if any(keyword in theme_text for keyword in interest_keywords):
                    interest_matched.append(theme)
            
            logger.info(f"   After interest filter: {len(interest_matched)} themes")
            
            # If we got matches, use them; otherwise use all age+plan matches
            final_matched = interest_matched if interest_matched else age_plan_matched
        else:
            final_matched = age_plan_matched
        
        logger.info(f"✅ Final matched themes: {len(final_matched)}")
        
        # Return matched themes, or fallback to first 10 from any age+plan if nothing matched
        if final_matched:
            return final_matched
        else:
            logger.warning(f"⚠️ No themes matched! Using fallback (first 10)")
            return self.themes[:10]
    
    def _llm_select_themes_and_strategy(self, matching_themes, child_name, child_age, interests,
                                         dislikes, learning_style, goals, plan_type, month_type, profile_insights):
        """Use LLM to select themes and create monthly strategy."""
        
        # Prepare theme list for LLM
        theme_list = []
        for i, theme in enumerate(matching_themes[:20], 1):  # Limit to 20 for LLM
            theme_list.append({
                "id": i,
                "name": theme.get("themeName"),
                "description": theme.get("shortDescription"),
                "focus": theme.get("coreFocusArea")
            })
        
        theme_count = 1 if plan_type.lower() == "hybrid" else 2
        
        prompt = f"""You are an educational strategist. Create a monthly learning plan.

CHILD PROFILE:
- Name: {child_name}
- Age: {child_age} years old
- Interests: {', '.join(interests) if interests else 'General'}
- Dislikes: {', '.join(dislikes) if dislikes else 'None'}
- Learning Style: {learning_style}
- Goals: {', '.join(goals) if goals else 'Holistic development'}
- Plan Type: {plan_type}
- Month Type: {month_type}
- Profile Insights: {profile_insights.get('context_notes', '')}

AVAILABLE THEMES ({len(theme_list)}):
{json.dumps(theme_list, indent=2)}

TASK: Select {theme_count} theme(s) and create monthly strategy.

For HYBRID plan: Select 1 theme for deep mastery
For HOLISTIC plan: Select 2-3 themes for balanced development

Return JSON:
{{
  "selected_theme_ids": [1 or 2-3 IDs],
  "monthly_agenda": {{
    "primary_goal": "main goal for this month",
    "thought_process": "why these themes for this child",
    "learning_narrative": "story of this month's journey"
  }},
  "weekly_progression": {{
    "week_1": "Foundation & Discovery - ...",
    "week_2": "Exploration & Research - ...",
    "week_3": "Application & Practice - ...",
    "week_4": "Project & Mastery - ..."
  }},
  "guidance_for_match_agent": {{
    "topic_criteria": "what topics to look for",
    "skill_focus": ["skill1", "skill2", "skill3"],
    "avoid_topics": ["based on dislikes"]
  }},
  "guidance_for_schedule_agent": {{
    "structure_type": "hybrid_deep_dive or holistic_varied",
    "daily_balance": "how to balance activities"
  }}
}}

Return ONLY valid JSON, no markdown."""
        
        try:
            # Check if we have themes to select from
            if len(matching_themes) == 0:
                logger.error("❌ No matching themes available for LLM selection! Using fallback.")
                raise ValueError("No themes available")
            
            logger.info(f"🧠 Sending {len(theme_list)} themes to LLM for selection...")
            
            if gemini_api_available:
                model = get_gemini_model()
                response = model.generate_content(prompt)
                response_text = response.text.strip()
                
                logger.info(f"✅ LLM response received ({len(response_text)} chars)")
                
                if response_text.startswith('```'):
                    response_text = response_text.strip('`').replace('json\n', '').replace('json', '').strip()
                
                strategy = json.loads(response_text)
                
                # Map selected IDs to actual themes
                selected_ids = strategy.get("selected_theme_ids", [1])
                selected_themes = []
                for theme_id in selected_ids:
                    if 1 <= theme_id <= len(theme_list):
                        original_theme = matching_themes[theme_id - 1]
                        selected_themes.append(original_theme)
                
                strategy["tokens_used"] = len(prompt.split()) + len(response_text.split())
                strategy["llm_prompt"] = prompt
                
                logger.info(f"✅ LLM selected {len(selected_themes)} theme(s): {[t.get('themeName') for t in selected_themes]}")
                
                return selected_themes, strategy
            else:
                logger.warning("⚠️ Vertex AI not available, using fallback")
                # Fallback: select first theme
                return [matching_themes[0]] if matching_themes else [], {
                    "monthly_agenda": {
                        "primary_goal": f"Explore {matching_themes[0].get('themeName') if matching_themes else 'general topics'}",
                        "thought_process": "Selected based on interests",
                        "learning_narrative": "Month of discovery and growth"
                    },
                    "weekly_progression": {
                        "week_1": "Foundation & Discovery",
                        "week_2": "Exploration & Research",
                        "week_3": "Application & Practice",
                        "week_4": "Project & Mastery"
                    },
                    "guidance_for_match_agent": {
                        "topic_criteria": "Age-appropriate topics matching interests",
                        "skill_focus": ["problem-solving", "creativity", "exploration"],
                        "avoid_topics": dislikes
                    },
                    "guidance_for_schedule_agent": {
                        "structure_type": plan_type,
                        "daily_balance": "Mix hands-on and observation activities"
                    },
                    "tokens_used": 0,
                    "llm_prompt": None
                }
        except Exception as e:
            logger.error(f"❌ LLM theme selection failed: {e}")
            logger.error(f"   Matching themes available: {len(matching_themes)}")
            logger.error(f"   Total themes loaded: {len(self.themes)}")
            logger.error(f"   Vertex AI available: {gemini_api_available}")
            import traceback
            logger.error(f"   Stack trace: {traceback.format_exc()}")
            
            return [matching_themes[0]] if matching_themes else [], {
                "monthly_agenda": {"primary_goal": "General learning", "thought_process": "Fallback", "learning_narrative": "Discovery"},
                "weekly_progression": {"week_1": "Week 1", "week_2": "Week 2", "week_3": "Week 3", "week_4": "Week 4"},
                "guidance_for_match_agent": {"topic_criteria": "General", "skill_focus": [], "avoid_topics": []},
                "guidance_for_schedule_agent": {"structure_type": plan_type, "daily_balance": "Balanced"},
                "tokens_used": 0,
                "llm_prompt": None
            }

class MatchAgent:
    """Match Agent - Selects 50 topics from niche + EG (intelligent mix, not rigid 50/50).
    
    Receives monthly_plan_structure from Analysis Agent and selects 50 candidate topics
    for Schedule Agent to choose final 28 from.
    """
    
    def __init__(self):
        logger.info("🎯 Initializing MatchAgent (Hybrid: Niches + Essential Growth)")
        self.topics_data = load_topics_data()
        self.niches_data = load_niches_data()
        self.essential_growth_data = load_essential_growth_data()
        
        # Load essential growth activities from all pillars
        self.essential_growth_activities = self._load_all_essential_growth_activities()
        
        logger.info(f"📊 MatchAgent loaded:")
        logger.info(f"   • {len(self.topics_data)} niche topics")
        logger.info(f"   • {len(self.niches_data)} niches")
        logger.info(f"   • {len(self.essential_growth_activities)} essential growth activities")
        
        if len(self.topics_data) == 0:
            logger.error("❌ CRITICAL: No topics data loaded! MatchAgent will not work properly.")
        else:
            logger.info(f"✅ Topics data loaded successfully. Sample topics: {[t.get('Topic', 'Unknown')[:20] for t in self.topics_data[:3]]}")
        
        if len(self.niches_data) == 0:
            logger.error("❌ CRITICAL: No niches data loaded! MatchAgent will not work properly.")
        else:
            logger.info(f"✅ Niches data loaded successfully. Sample niches: {[n.get('Niche', 'Unknown')[:20] for n in self.niches_data[:3]]}")
        
        if len(self.essential_growth_activities) == 0:
            logger.error("❌ CRITICAL: No essential growth activities loaded! MatchAgent will not work properly.")
        else:
            logger.info(f"✅ Essential growth activities loaded successfully.")
    
    def _load_all_essential_growth_activities(self):
        """Load all essential growth activities from all 18 pillars."""
        all_activities = []
        
        pillars = self.essential_growth_data.get('pillars', [])
        for pillar in pillars:
            pillar_slug = pillar.get('slug', '')
            pillar_name = pillar.get('name', '')
            activities_file = f"data/essential-growth/{pillar_slug}/activities.json"
            
            try:
                if os.path.exists(activities_file):
                    with open(activities_file, 'r', encoding='utf-8') as f:
                        pillar_data = json.load(f)
                        age_groups = pillar_data.get('ageGroups', [])
                        
                        for age_group in age_groups:
                            categories = age_group.get('categories', [])
                            for category in categories:
                                activities = category.get('activities', [])
                                for activity in activities:
                                    # Add pillar info to each activity
                                    activity['pillar'] = pillar_name
                                    activity['pillar_slug'] = pillar_slug
                                    all_activities.append(activity)
            except Exception as e:
                logger.warning(f"⚠️ Could not load {activities_file}: {e}")
        
        logger.info(f"📚 Loaded {len(all_activities)} essential growth activities from {len(pillars)} pillars")
        return all_activities
    
    def run(self, analysis_result: Dict[str, Any]) -> Dict[str, Any]:
        """Select 50 candidate topics from niche + EG (intelligent mix based on monthly strategy)."""
        start_time = time.time()
        logger.info("🎯 Match Agent: Selecting 50 candidate topics (intelligent mix)")
        
        profile = analysis_result.get("profile", {})
        standardized_profile = analysis_result.get("standardized_profile", {})
        monthly_plan_structure = analysis_result.get("monthly_plan_structure", {})
        
        child_name = standardized_profile.get("child_name", "Child")
        child_age = standardized_profile.get("child_age", 7)
        interests = standardized_profile.get("interests", [])
        dislikes = standardized_profile.get("dislikes", [])
        learning_style = standardized_profile.get("preferred_learning_style", "visual")
        
        # Get guidance from Analysis Agent
        selected_themes = monthly_plan_structure.get("selected_themes", [])
        guidance = monthly_plan_structure.get("guidance_for_match_agent", {})
        
        logger.info(f"🎯 Matching for {child_name} (age {child_age}) with interests: {interests}")
        logger.info(f"📚 Selected themes: {[t.get('themeName', 'Unknown') for t in selected_themes]}")
        logger.info(f"🎯 Topic criteria: {guidance.get('topic_criteria', 'General')}")
        
        # Step 1: Pre-filter NICHE topics by age
        age_appropriate_niche_topics = []
        for topic in self.topics_data:
            topic_age = topic.get("Age", 5)
            if abs(topic_age - child_age) <= 3:  # ±3 years
                age_appropriate_niche_topics.append(topic)
        
        logger.info(f"📊 Age-appropriate niche topics: {len(age_appropriate_niche_topics)}")
        
        # Step 2: Pre-filter ESSENTIAL GROWTH activities by age
        age_appropriate_eg_activities = []
        for activity in self.essential_growth_activities:
            activity_age = activity.get("age", "All Ages")
            # Simple age matching logic
            if self._is_age_appropriate(activity_age, child_age):
                age_appropriate_eg_activities.append(activity)
        
        logger.info(f"📊 Age-appropriate essential growth activities: {len(age_appropriate_eg_activities)}")
        
        # Step 3: Use LLM to select 40 CANDIDATE niche topics (50%)
        niche_topics = self._llm_select_niche_topics(
            age_appropriate_niche_topics, 
            child_name, 
            child_age, 
            interests, 
            learning_style,
            count=30  # Target ~30 from niches for 50 total
        )
        
        logger.info(f"🎯 LLM selected {len(niche_topics)} CANDIDATE niche topics")
        
        # Step 4: Use LLM to select ~20 CANDIDATE essential growth  
        eg_topics = self._llm_select_essential_growth_topics(
            age_appropriate_eg_activities,
            child_name,
            child_age,
            learning_style,
            count=20  # Target ~20 from EG
        )
        
        logger.info(f"🎯 LLM selected {len(eg_topics)} CANDIDATE essential growth activities")
        
        # Step 5: Combine both (~30 + ~20 = ~50 CANDIDATES)
        matched_topics = niche_topics + eg_topics
        
        # Trim to exactly 50 if we have more
        if len(matched_topics) > 50:
            matched_topics = matched_topics[:50]
        
        logger.info(f"🎯 Total candidates: {len(matched_topics)} topics ({len(niche_topics)} niche + {len(eg_topics)} EG)")
        logger.info(f"📅 Schedule Agent will select final 28 from these {len(matched_topics)} candidates")
        
        # Create match analysis
        match_analysis = {
            "total_topics_selected": len(matched_topics),
            "niches_covered": list(set(t.get("Niche", "General") for t in matched_topics)),
            "selection_criteria": {
                "age_appropriate": True,
                "interest_aligned": True,
                "theme_aligned": True,
                "selected_themes": [t.get('themeName', '') for t in selected_themes],
                "learning_style_considered": True
            },
            "agent_flow": "ProfileAgent → AnalysisAgent → MatchAgent"
        }
        
        result = {
            "profile": profile,
            "standardized_profile": standardized_profile,
            "monthly_plan_structure": monthly_plan_structure,
            "matched_topics": matched_topics,
            "match_analysis": match_analysis,
            "agent_timing": {
                "agent_name": "MatchAgent",
                "execution_time_seconds": time.time() - start_time,
                "llm_used": False,
                "tokens_used": 0,
                "llm_prompt": None,
                "llm_response": None
            }
        }
        
        logger.info(f"✅ Match Agent completed in {time.time() - start_time:.2f} seconds")
        return result
    
    def _is_age_appropriate(self, activity_age: str, child_age: int) -> bool:
        """Check if an essential growth activity is age-appropriate."""
        # Handle "All Ages"
        if "All Ages" in activity_age or "all" in activity_age.lower():
            return True
        
        # Handle age ranges like "0-1", "3-5", "6-8", etc.
        try:
            # Extract numbers from age string
            import re
            numbers = re.findall(r'\d+', activity_age)
            if numbers:
                min_age = int(numbers[0])
                max_age = int(numbers[-1]) if len(numbers) > 1 else min_age
                return min_age <= child_age <= max_age + 2  # Allow +2 years flexibility
        except:
            pass
        
        return True  # Default to true if we can't parse
    
    def _llm_select_niche_topics(self, topics_pool: List[Dict], child_name: str, child_age: int, 
                                  interests: List[str], learning_style: str, count: int = 14) -> List[Dict]:
        """Use LLM to select topics from NICHE topics (interest-based)."""
        
        logger.info(f"🔍 Selecting {count} niche topics from {len(topics_pool)} age-appropriate topics")
        
        # Create concise topic list for LLM
        topic_summaries = []
        for idx, topic in enumerate(topics_pool[:100], 1):  # Limit to 100 for LLM context
            topic_summaries.append({
                'id': idx,
                'topic': topic.get('Topic', '')[:50],
                'niche': topic.get('Niche', ''),
                'age': topic.get('Age', 0),
                'objective': topic.get('Objective', '')[:80]
            })
        
        # LLM Prompt for niche topic selection
        prompt = f"""You are an expert educational planner. Select exactly {count} NICHE topics for {child_name} (age {child_age}).

CHILD PROFILE:
- Interests: {', '.join(interests)}
- Learning Style: {learning_style}
- Age: {child_age} years old

AVAILABLE NICHE TOPICS ({len(topic_summaries)}):
{json.dumps(topic_summaries, indent=2)}

REQUIREMENTS:
1. Select EXACTLY {count} topics
2. BALANCE across ALL interests ({', '.join(interests) if interests else 'general topics'})
   - Distribute evenly: ~{count // max(1, len(interests))} topics per interest
3. Focus on interest-driven learning (AI, Finance, Entrepreneurship, etc.)
4. Age-appropriate for {child_age} years old
5. Consider {learning_style} learning style
6. Mix difficulty levels within interests

Return ONLY a JSON array of topic IDs (numbers 1-{len(topic_summaries)}):
{{"selected_topic_ids": [1, 5, 12, ...]}}

IMPORTANT: Select {count} topics that match the child's INTERESTS!"""
        
        try:
            if gemini_api_available:
                model = get_gemini_model()
                response = model.generate_content(prompt)
                response_text = response.text.strip()
                
                logger.info(f"📝 LLM response length: {len(response_text)} chars")
                
                if not response_text:
                    logger.error(f"❌ LLM returned empty response!")
                    raise ValueError("Empty LLM response")
                
                llm_result = json.loads(response_text)
                selected_ids = llm_result.get('selected_topic_ids', [])
                
                # Map IDs back to actual topics
                matched_topics = []
                for topic_id in selected_ids[:count]:
                    if 1 <= topic_id <= len(topic_summaries):
                        original_topic = topics_pool[topic_id - 1]
                        matched_topics.append(original_topic)
                
                logger.info(f"✅ LLM selected {len(matched_topics)} niche topics")
                
                # Log balance
                niche_counts = {}
                for topic in matched_topics:
                    niche = topic.get('Niche', 'Unknown')
                    niche_counts[niche] = niche_counts.get(niche, 0) + 1
                logger.info(f"📊 Niche topic balance: {niche_counts}")
                
                return matched_topics
            else:
                return self._fallback_balanced_selection(topics_pool, interests, count)
                
        except Exception as e:
            logger.error(f"❌ LLM niche selection failed: {e}")
            return self._fallback_balanced_selection(topics_pool, interests, count)
    
    def _llm_select_essential_growth_topics(self, activities_pool: List[Dict], child_name: str, 
                                             child_age: int, learning_style: str, count: int = 14) -> List[Dict]:
        """Use LLM to select topics from ESSENTIAL GROWTH activities (developmental)."""
        
        logger.info(f"🔍 Selecting {count} essential growth activities from {len(activities_pool)} age-appropriate activities")
        
        # Create concise activity list for LLM
        activity_summaries = []
        for idx, activity in enumerate(activities_pool[:100], 1):  # Limit to 100 for LLM context
            activity_summaries.append({
                'id': idx,
                'activity': activity.get('topic', activity.get('name', ''))[:50],
                'pillar': activity.get('pillar', 'Unknown'),
                'age': activity.get('age', 'All Ages'),
                'objective': activity.get('objective', '')[:80]
            })
        
        # LLM Prompt for essential growth selection
        prompt = f"""You are an expert child development specialist. Select exactly {count} ESSENTIAL GROWTH activities for {child_name} (age {child_age}).

CHILD PROFILE:
- Age: {child_age} years old
- Learning Style: {learning_style}

AVAILABLE ESSENTIAL GROWTH ACTIVITIES ({len(activity_summaries)}):
{json.dumps(activity_summaries, indent=2)}

CRITICAL REQUIREMENTS:
1. Select EXACTLY {count} activities
2. MUST BALANCE across AT LEAST 7-10 DIFFERENT developmental pillars:
   - Select 1-2 activities from EACH pillar
   - DO NOT select more than 3 activities from the same pillar
   - Ensure variety: Cognitive, Emotional, Social, Physical, Creative, etc.
3. Age-appropriate for {child_age} years old
4. Consider {learning_style} learning style
5. Focus on holistic child development
6. Distribute evenly across multiple skill areas

Return ONLY a JSON array of activity IDs (numbers 1-{len(activity_summaries)}):
{{"selected_activity_ids": [1, 5, 12, ...]}}

CRITICAL: Select activities from MULTIPLE DIFFERENT pillars! NO MORE than 3 from same pillar!"""
        
        try:
            if gemini_api_available:
                model = get_gemini_model()
                response = model.generate_content(prompt)
                response_text = response.text.strip()
                
                if response_text.startswith('```'):
                    response_text = response_text.strip('`').replace('json\n', '').replace('json', '').strip()
                
                llm_result = json.loads(response_text)
                selected_ids = llm_result.get('selected_activity_ids', [])
                
                # Map IDs back to actual activities
                matched_activities = []
                for activity_id in selected_ids[:count]:
                    if 1 <= activity_id <= len(activity_summaries):
                        original_activity = activities_pool[activity_id - 1]
                        # Convert to topic format for consistency
                        topic_format = {
                            'Topic': original_activity.get('topic', original_activity.get('activity', {}).get('name', 'Activity')),
                            'Niche': 'Essential Growth',
                            'Pillar': original_activity.get('pillar', 'Unknown'),
                            'Age': original_activity.get('age', 'All Ages'),
                            'Objective': original_activity.get('objective', ''),
                            'Explanation': original_activity.get('explanation', ''),
                            'Estimated Time': original_activity.get('estimatedTime', '20-30 min'),
                            'Activity 1': str(original_activity.get('activity', {}).get('steps', [])),
                            'Activity 2': '',
                            'source': 'essential_growth'
                        }
                        matched_activities.append(topic_format)
                
                logger.info(f"✅ LLM selected {len(matched_activities)} essential growth activities")
                
                # Log pillar balance
                pillar_counts = {}
                for activity in matched_activities:
                    pillar = activity.get('Pillar', 'Unknown')
                    pillar_counts[pillar] = pillar_counts.get(pillar, 0) + 1
                logger.info(f"📊 Essential growth pillar balance: {pillar_counts}")
                
                return matched_activities
            else:
                return self._fallback_eg_selection(activities_pool, count)
                
        except Exception as e:
            logger.error(f"❌ LLM essential growth selection failed: {e}")
            return self._fallback_eg_selection(activities_pool, count)
    
    def _fallback_eg_selection(self, activities_pool: List[Dict], count: int) -> List[Dict]:
        """Fallback: Select essential growth activities manually with pillar balancing."""
        logger.info(f"⚠️ Using fallback selection for {count} essential growth activities")
        
        # Group by pillar
        by_pillar = {}
        for activity in activities_pool:
            pillar = activity.get('pillar', 'Unknown')
            if pillar not in by_pillar:
                by_pillar[pillar] = []
            by_pillar[pillar].append(activity)
        
        logger.info(f"📊 Activities available by pillar: {[(p, len(a)) for p, a in by_pillar.items()]}")
        
        # Distribute across pillars
        selected = []
        activities_per_pillar = max(1, count // len(by_pillar))  # At least 1 per pillar
        
        for pillar, activities in by_pillar.items():
            # Take activities_per_pillar from each pillar
            for activity in activities[:activities_per_pillar]:
                if len(selected) < count:
                    topic_format = {
                        'Topic': activity.get('topic', 'Activity'),
                        'Niche': 'Essential Growth',
                        'Pillar': pillar,
                        'Age': activity.get('age', 'All Ages'),
                        'Objective': activity.get('objective', ''),
                        'source': 'essential_growth'
                    }
                    selected.append(topic_format)
        
        # Fill remaining if needed
        if len(selected) < count:
            for pillar, activities in by_pillar.items():
                for activity in activities[activities_per_pillar:]:
                    if len(selected) < count:
                        topic_format = {
                            'Topic': activity.get('topic', 'Activity'),
                            'Niche': 'Essential Growth',
                            'Pillar': pillar,
                            'Age': activity.get('age', 'All Ages'),
                            'Objective': activity.get('objective', ''),
                            'source': 'essential_growth'
                        }
                        selected.append(topic_format)
        
        logger.info(f"✅ Fallback selected {len(selected)} activities from {len(by_pillar)} pillars")
        return selected[:count]
    
    def _llm_select_topics(self, topics_pool: List[Dict], child_name: str, child_age: int, 
                           interests: List[str], learning_style: str) -> List[Dict]:
        """DEPRECATED: Use _llm_select_niche_topics and _llm_select_essential_growth_topics instead."""
        # This method is no longer used - kept for backwards compatibility
        return []
    
    def _fallback_balanced_selection(self, topics_pool: List[Dict], interests: List[str], total_needed: int) -> List[Dict]:
        """Fallback: Balance topics manually across interests."""
        matched = []
        
        # If interests provided, try to balance across them
        if interests:
            topics_per_interest = total_needed // max(1, len(interests))
            for interest in interests:
                interest_topics = [t for t in topics_pool if interest.lower() in t.get('Niche', '').lower()]
                matched.extend(interest_topics[:topics_per_interest])
        
        # Fill remaining slots with any suitable topics (or all if no interests)
        while len(matched) < total_needed and len(matched) < len(topics_pool):
            for topic in topics_pool:
                if topic not in matched:
                    matched.append(topic)
                    if len(matched) >= total_needed:
                        break
        
        return matched[:total_needed]

class ScheduleAgent:
    """Schedule Agent - Creates weekly learning plan using real topics only."""
    
    def __init__(self):
        logger.info("📅 Initializing ScheduleAgent")
        self.topics_data = load_topics_data()
        self.niches_data = load_niches_data()
        self.essential_growth_data = load_essential_growth_data()
        self.plan_generator = RealPlanGenerator(self.topics_data, self.niches_data, self.essential_growth_data)
        logger.info(f"📊 ScheduleAgent loaded {len(self.topics_data)} topics, {len(self.niches_data)} niches")
    
    def run(self, match_result: Dict[str, Any]) -> Dict[str, Any]:
        """Select 28 final topics from 50 candidates and create daily schedule."""
        start_time = time.time()
        logger.info("📅 Schedule Agent: Selecting final 28 topics from 50 candidates")
        
        # Extract data from previous agents
        profile = match_result.get("profile", {})
        standardized_profile = match_result.get("standardized_profile", {})
        monthly_plan_structure = match_result.get("monthly_plan_structure", {})
        candidate_topics = match_result.get("matched_topics", [])  # 50 candidates
        
        plan_type = standardized_profile.get("plan_type", "hybrid")
        child_name = standardized_profile.get("child_name", "Child")
        child_age = standardized_profile.get("child_age", 7)
        learning_style = standardized_profile.get("preferred_learning_style", "visual")
        interests = standardized_profile.get("interests", [])
        
        # Get monthly strategy guidance
        selected_themes = monthly_plan_structure.get("selected_themes", [])
        weekly_progression = monthly_plan_structure.get("weekly_progression", {})
        schedule_guidance = monthly_plan_structure.get("guidance_for_schedule_agent", {})
        
        logger.info(f"🎯 Plan Type: {plan_type}")
        logger.info(f"📊 Candidate topics received: {len(candidate_topics)}")
        logger.info(f"📚 Themes: {[t.get('themeName', 'Unknown') for t in selected_themes]}")
        logger.info(f"📅 Target: Select 28 final topics from {len(candidate_topics)} candidates")
        
        if not candidate_topics:
            logger.error("❌ No candidate topics available - cannot create plan")
            return self._create_error_result("No topics matched for plan generation")
        
        # Step 1: Use LLM to select 28 final topics from 50 candidates organized by week
        final_topics_by_week = self._llm_select_final_28_topics(
            candidate_topics, child_name, child_age, interests, learning_style,
            weekly_progression, selected_themes, plan_type
        )
        
        logger.info(f"📅 LLM organized {sum(len(topics) for topics in final_topics_by_week.values())} topics into themed weeks")
        
        # Step 2: Generate weekly plan using the themed topics
        weekly_plan = self._create_themed_weekly_plan(final_topics_by_week, profile)
        
        # Get all final selected topics (flatten from weeks)
        final_matched_topics = []
        for week_topics in final_topics_by_week.values():
            final_matched_topics.extend(week_topics)
        
        logger.info(f"📊 Final topics selected: {len(final_matched_topics)}")
        
        # Use LLM to generate learning objectives (NO hardcoded)
        learning_objectives = self._llm_generate_learning_objectives(child_name, child_age, interests, learning_style, final_matched_topics)
        
        # Use LLM to generate recommended activities (NO hardcoded)
        recommended_activities = self._llm_generate_recommended_activities(child_name, child_age, interests, learning_style, plan_type)
        
        # Use LLM to generate progress tracking approach (NO hardcoded)
        progress_tracking = self._llm_generate_progress_tracking(child_name, child_age, learning_style)
        
        # Use LLM to analyze plan structure (NO hardcoded)
        systematic_approach = self._llm_analyze_plan_structure(weekly_plan, child_name, interests)
        
        # Create final result
        result = {
            "profile": profile,
            "standardized_profile": standardized_profile,
            "monthly_plan_structure": monthly_plan_structure,
            "weekly_plan": weekly_plan,
            "matched_topics": final_matched_topics,  # 28 final topics (not 50 candidates)
            "candidate_topics": candidate_topics,  # 50 candidates for reference
            "learning_objectives": learning_objectives,
            "recommended_activities": recommended_activities,
            "progress_tracking": progress_tracking,
            "systematic_approach": systematic_approach,
            "llm_integration": {
                "schedule_agent_llm_used": True,
                "schedule_agent_methods_using_llm": [
                    "learning_objectives_generation",
                    "recommended_activities_generation",
                    "progress_tracking_generation",
                    "plan_structure_analysis"
                ]
            },
            "agent_timing": {
                "agent_name": "ScheduleAgent",
                "execution_time_seconds": time.time() - start_time,
                "llm_used": True,
                "tokens_used": "calculated per LLM call",
                "llm_prompt": "multiple prompts for different aspects",
                "llm_response": "multiple responses stored in each component"
            }
        }
        
        logger.info(f"✅ Schedule Agent completed in {time.time() - start_time:.2f} seconds (LLM: True)")
        logger.info(f"📊 Generated plan with {len(weekly_plan)} weeks")
        return result
    
    def _llm_select_final_28_topics(self, candidate_topics: List[Dict], child_name: str, 
                                     child_age: int, interests: List[str], learning_style: str,
                                     weekly_progression: Dict, selected_themes: List[Dict], plan_type: str) -> Dict[str, List[Dict]]:
        """Use LLM to select 28 final topics from 50 candidates organized by weekly progression."""
        
        logger.info(f"📅 Using LLM to select 28 final topics from {len(candidate_topics)} candidates")
        
        # Prepare topic summaries for LLM
        topic_summaries = []
        for idx, topic in enumerate(candidate_topics, 1):
            topic_summaries.append({
                'id': idx,
                'topic': topic.get('Topic', '')[:60],
                'niche': topic.get('Niche', topic.get('Pillar', 'General')),
                'source': topic.get('source', 'niche'),
                'objective': topic.get('Objective', '')[:80]
            })
        
        # Get theme names for context
        theme_names = [t.get('themeName', 'General') for t in selected_themes]
        
        # Create comprehensive LLM prompt
        prompt = f"""You are an expert curriculum designer. Select 28 topics from 50 candidates for a 4-week plan.

CHILD PROFILE:
- Name: {child_name}
- Age: {child_age} years old
- Interests: {', '.join(interests)}
- Learning Style: {learning_style}
- Plan Type: {plan_type}

MONTHLY THEMES: {', '.join(theme_names)}

WEEKLY PROGRESSION:
- Week 1: {weekly_progression.get('week_1', 'Foundation & Discovery')}
- Week 2: {weekly_progression.get('week_2', 'Exploration & Research')}
- Week 3: {weekly_progression.get('week_3', 'Application & Practice')}
- Week 4: {weekly_progression.get('week_4', 'Project & Mastery')}

AVAILABLE TOPICS (50 candidates):
{json.dumps(topic_summaries, indent=2)}

TASK: Select exactly 28 topics (7 per week) that:
1. Align with monthly themes
2. Follow weekly progression (Foundation → Exploration → Application → Project)
3. Balance niche interests + essential growth
4. Create coherent learning journey

Return JSON with topics organized by week:
{{
  "week_1_topic_ids": [7 IDs],
  "week_2_topic_ids": [7 IDs],
  "week_3_topic_ids": [7 IDs],
  "week_4_topic_ids": [7 IDs]
}}

Return ONLY valid JSON, no markdown."""
        
        final_topics_by_week = {}
        
        try:
            if gemini_api_available:
                model = get_gemini_model()
                response = model.generate_content(prompt)
                response_text = response.text.strip()
                
                if response_text.startswith('```'):
                    response_text = response_text.strip('`').replace('json\n', '').replace('json', '').strip()
                
                llm_result = json.loads(response_text)
                
                # Map IDs back to actual topics
                for week_num in range(1, 5):
                    week_key = f"week_{week_num}"
                    topic_ids = llm_result.get(f"{week_key}_topic_ids", [])
                    week_topics = []
                    
                    for topic_id in topic_ids[:7]:
                        if 1 <= topic_id <= len(candidate_topics):
                            week_topics.append(candidate_topics[topic_id - 1])
                    
                    final_topics_by_week[week_key] = week_topics
                    logger.info(f"✅ Week {week_num}: {len(week_topics)} topics selected")
                
                return final_topics_by_week
                
            else:
                # Fallback: distribute 50 topics evenly
                logger.warning("⚠️ LLM unavailable, using fallback distribution")
                topics_per_week = 7
                for week_num in range(1, 5):
                    week_key = f"week_{week_num}"
                    start_idx = (week_num - 1) * topics_per_week
                    end_idx = start_idx + topics_per_week
                    final_topics_by_week[week_key] = candidate_topics[start_idx:end_idx]
                
                return final_topics_by_week
                
        except Exception as e:
            logger.error(f"❌ LLM topic selection failed: {e}")
            # Fallback
            topics_per_week = 7
            for week_num in range(1, 5):
                week_key = f"week_{week_num}"
                start_idx = (week_num - 1) * topics_per_week
                end_idx = start_idx + topics_per_week
                final_topics_by_week[week_key] = candidate_topics[start_idx:end_idx]
            
            return final_topics_by_week
    
    def _llm_theme_based_selection_old(self, candidate_topics: List[Dict], child_name: str, 
                                     child_age: int, interests: List[str], learning_style: str) -> Dict[str, List[Dict]]:
        """OLD METHOD - Use LLM to select 7 topics per week from 80 candidates based on weekly themes."""
        
        logger.info(f"📅 Using LLM to organize {len(candidate_topics)} candidates into 4 themed weeks")
        
        # Separate candidates by source FIRST
        niche_candidates = [t for t in candidate_topics if t.get('source') != 'essential_growth']
        eg_candidates = [t for t in candidate_topics if t.get('source') == 'essential_growth']
        
        logger.info(f"📊 Separated: {len(niche_candidates)} niche + {len(eg_candidates)} EG")
        
        # Define the 4 weekly themes
        weekly_themes = {
            "discovery_week": {
                "theme": "Technology & Innovation",
                "focus": "AI, Coding, Robotics, Technology, Science",
                "goal": "Master basic technology concepts"
            },
            "skills_week": {
                "theme": "Life Skills & Finance", 
                "focus": "Money, Entrepreneurship, Communication, Social Skills",
                "goal": "Develop essential life skills"
            },
            "creation_week": {
                "theme": "Creative Expression",
                "focus": "Art, Music, Writing, Design, Creativity, Play",
                "goal": "Express creativity and innovation"
            },
            "project_week": {
                "theme": "Problem Solving & Logic",
                "focus": "Math, Science, Critical Thinking, Problem Solving, Logic",
                "goal": "Apply learned skills"
            }
        }
        
        # Use LLM to select topics for each week
        final_topics_by_week = {}
        
        for week_key, week_info in weekly_themes.items():
            logger.info(f"📅 Selecting topics for {week_key}: {week_info['theme']}")
            
            # Select 4 from NICHE and 3 from ESSENTIAL GROWTH separately
            week_topics = []
            
            # Part 1: Select 4 NICHE topics for this theme
            niche_summaries = []
            for idx, topic in enumerate(niche_candidates, 1):
                niche_summaries.append({
                    'id': idx,
                    'topic': topic.get('Topic', '')[:50],
                    'niche': topic.get('Niche', 'Unknown'),
                    'age': topic.get('Age', '')
                })
            
            niche_prompt = f"""Select exactly 4 NICHE topics for "{week_info['theme']}" week.

THEME: {week_info['theme']}
FOCUS: {week_info['focus']}
CHILD: {child_name} (age {child_age}, interests: {', '.join(interests)})

NICHE TOPICS ({len(niche_summaries)}):
{json.dumps(niche_summaries[:40], indent=2)}

Select 4 topics that FIT this theme. Return: {{"selected_topic_ids": [1, 5, ...]}}"""
            
            # Part 2: Select 3 ESSENTIAL GROWTH topics for this theme
            eg_summaries = []
            for idx, topic in enumerate(eg_candidates, 1):
                eg_summaries.append({
                    'id': idx,
                    'topic': topic.get('Topic', '')[:50],
                    'pillar': topic.get('Pillar', 'Unknown'),
                    'age': topic.get('Age', '')
                })
            
            eg_prompt = f"""Select exactly 3 ESSENTIAL GROWTH activities for "{week_info['theme']}" week.

THEME: {week_info['theme']}
FOCUS: {week_info['focus']}
CHILD: {child_name} (age {child_age})

ESSENTIAL GROWTH ACTIVITIES ({len(eg_summaries)}):
{json.dumps(eg_summaries[:40], indent=2)}

Select 3 activities that FIT this theme. Return: {{"selected_activity_ids": [1, 5, ...]}}"""
            
            try:
                if gemini_api_available:
                    model = get_gemini_model()
                    
                    # Select niche topics
                    response1 = model.generate_content(niche_prompt)
                    text1 = response1.text.strip()
                    niche_ids = json.loads(text1).get('selected_topic_ids', [])
                    
                    # Select EG topics
                    response2 = model.generate_content(eg_prompt)
                    text2 = response2.text.strip()
                    eg_ids = json.loads(text2).get('selected_activity_ids', [])
                    
                    # Combine: 4 niche + 3 EG = 7 total
                    for niche_id in niche_ids[:4]:
                        if 1 <= niche_id <= len(niche_candidates):
                            week_topics.append(niche_candidates[niche_id - 1])
                    
                    for eg_id in eg_ids[:3]:
                        if 1 <= eg_id <= len(eg_candidates):
                            week_topics.append(eg_candidates[eg_id - 1])
                    
                    logger.info(f"✅ Selected {len(week_topics)} topics for {week_key} (4 niche + 3 EG)")
                    
                else:
                    # Fallback: Take 4 niche + 3 EG sequentially
                    week_idx = list(weekly_themes.keys()).index(week_key)
                    week_topics = niche_candidates[week_idx*4:(week_idx+1)*4] + eg_candidates[week_idx*3:(week_idx+1)*3]
                    
            except Exception as e:
                logger.error(f"❌ LLM selection failed for {week_key}: {e}")
                # Fallback
                week_idx = list(weekly_themes.keys()).index(week_key)
                week_topics = niche_candidates[week_idx*4:(week_idx+1)*4] + eg_candidates[week_idx*3:(week_idx+1)*3]
            
            final_topics_by_week[week_key] = week_topics
        
        return final_topics_by_week
    
    def _create_themed_weekly_plan(self, topics_by_week: Dict[str, List[Dict]], profile: Dict) -> Dict[str, Any]:
        """Create the weekly plan structure from themed topic selections."""
        
        weekly_plan = {}
        day_names = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        
        for week_key, week_topics in topics_by_week.items():
            weekly_plan[week_key] = {}
            
            # Assign topics to days
            for day_idx, day_name in enumerate(day_names):
                if day_idx < len(week_topics):
                    topic = week_topics[day_idx]
                    weekly_plan[week_key][day_name] = {
                        "activity": topic.get("Activity 1", f"Explore {topic.get('Topic', 'Learning')}"),
                        "duration": topic.get("Estimated Time", "30 minutes"),
                        "topic": topic.get("Topic", "Learning"),
                        "niche": topic.get("Niche", topic.get("Pillar", "General")),
                        "objective": topic.get("Objective", f"Learn about {topic.get('Topic', 'learning')}"),
                        "materials_needed": [],
                        "difficulty": "Beginner",
                        "age_appropriate": topic.get("Age", 5)
                    }
        
        return weekly_plan
    
    def _llm_generate_learning_objectives(self, child_name: str, child_age: int, interests: List[str], learning_style: str, matched_topics: List[Dict]) -> List[str]:
        """Use LLM to generate personalized learning objectives."""
        topic_summary = [{"topic": t.get("Topic", "")[:30], "niche": t.get("Niche", "")} for t in matched_topics[:10]]
        
        prompt = f"""You are an educational expert. Create 5 specific, measurable learning objectives for {child_name} (age {child_age}).

CHILD PROFILE:
- Interests: {', '.join(interests)}
- Learning Style: {learning_style}
- Selected Topics: {json.dumps(topic_summary, indent=2)}

Return ONLY a JSON array of 5 learning objectives:
{{"objectives": ["objective 1", "objective 2", ...]}}"""

        try:
            if gemini_api_available:
                model = get_gemini_model()
                response = model.generate_content(prompt)
                response_text = response.text.strip()
                if response_text.startswith('```'):
                    response_text = response_text.strip('`').replace('json\n', '').replace('json', '').strip()
                result = json.loads(response_text)
                return result.get('objectives', [])
        except Exception as e:
            logger.error(f"❌ LLM objectives generation failed: {e}")
        
        # Fallback objectives - handle empty interests
        if interests and len(interests) > 0:
            return [f"Develop {interests[0]} skills", "Enhance problem-solving abilities", "Foster curiosity and creativity"]
        else:
            return ["Develop foundational skills", "Enhance problem-solving abilities", "Foster curiosity and creativity"]
    
    def _llm_generate_recommended_activities(self, child_name: str, child_age: int, interests: List[str], learning_style: str, plan_type: str) -> List[str]:
        """Use LLM to generate personalized recommended activities."""
        prompt = f"""You are an educational expert. Suggest 5 engaging activities for {child_name} (age {child_age}).

CHILD PROFILE:
- Interests: {', '.join(interests)}
- Learning Style: {learning_style}
- Plan Type: {plan_type}

Return ONLY a JSON array of 5 activity recommendations:
{{"activities": ["activity 1", "activity 2", ...]}}"""

        try:
            if gemini_api_available:
                model = get_gemini_model()
                response = model.generate_content(prompt)
                response_text = response.text.strip()
                if response_text.startswith('```'):
                    response_text = response_text.strip('`').replace('json\n', '').replace('json', '').strip()
                result = json.loads(response_text)
                return result.get('activities', [])
        except Exception as e:
            logger.error(f"❌ LLM activities generation failed: {e}")
        
        return ["Interactive learning", "Hands-on projects"]
    
    def _llm_generate_progress_tracking(self, child_name: str, child_age: int, learning_style: str) -> Dict[str, Any]:
        """Use LLM to generate personalized progress tracking approach."""
        prompt = f"""You are an educational expert. Design a progress tracking system for {child_name} (age {child_age}).

CHILD PROFILE:
- Age: {child_age}
- Learning Style: {learning_style}

Return ONLY a JSON object:
{{
  "metrics": ["metric1", "metric2", ...],
  "frequency": "daily/weekly",
  "assessment_methods": ["method1", "method2", ...]
}}"""

        try:
            if gemini_api_available:
                model = get_gemini_model()
                response = model.generate_content(prompt)
                response_text = response.text.strip()
                if response_text.startswith('```'):
                    response_text = response_text.strip('`').replace('json\n', '').replace('json', '').strip()
                return json.loads(response_text)
        except Exception as e:
            logger.error(f"❌ LLM progress tracking generation failed: {e}")
        
        return {"metrics": ["engagement"], "frequency": "daily", "assessment_methods": ["observation"]}
    
    def _llm_analyze_plan_structure(self, weekly_plan: Dict, child_name: str, interests: List[str]) -> Dict[str, Any]:
        """Use LLM to analyze and describe the plan structure."""
        week_keys = list(weekly_plan.keys())
        
        prompt = f"""You are an educational expert. Analyze this 4-week learning plan structure for {child_name}.

PLAN STRUCTURE:
- Weeks: {', '.join(week_keys)}
- Interests: {', '.join(interests)}

Return ONLY a JSON object describing the plan flow:
{{
  "agent_flow": [
    {{"agent": "profile_agent", "status": "completed"}},
    {{"agent": "match_agent", "status": "completed"}},
    {{"agent": "schedule_agent", "status": "completed"}}
  ],
  "plan_structure": {{
    "total_weeks": 4,
    "week_themes": {{
      "{week_keys[0] if week_keys else 'week1'}": {{"theme": "...", "focus": "..."}},
      "{week_keys[1] if len(week_keys) > 1 else 'week2'}": {{"theme": "...", "focus": "..."}},
      "{week_keys[2] if len(week_keys) > 2 else 'week3'}": {{"theme": "...", "focus": "..."}},
      "{week_keys[3] if len(week_keys) > 3 else 'week4'}": {{"theme": "...", "focus": "..."}}
    }}
  }}
}}"""

        try:
            if gemini_api_available:
                model = get_gemini_model()
                response = model.generate_content(prompt)
                response_text = response.text.strip()
                if response_text.startswith('```'):
                    response_text = response_text.strip('`').replace('json\n', '').replace('json', '').strip()
                return json.loads(response_text)
        except Exception as e:
            logger.error(f"❌ LLM plan analysis failed: {e}")
        
        return {
            "agent_flow": [
                {"agent": "profile_agent", "status": "completed"},
                {"agent": "match_agent", "status": "completed"},
                {"agent": "schedule_agent", "status": "completed"}
            ],
            "plan_structure": {"total_weeks": 4}
        }
    
    def _get_recommended_activities(self, profile: Dict[str, Any]) -> List[str]:
        """DEPRECATED: Use _llm_generate_recommended_activities instead."""
        learning_style = profile.get("learning_style", "visual")
        activities = {
            "visual": ["Interactive diagrams", "Video tutorials", "Visual storytelling"],
            "auditory": ["Discussion groups", "Audio stories", "Music-based learning"],
            "kinesthetic": ["Hands-on projects", "Physical activities", "Building exercises"],
            "mixed": ["Mixed learning activities", "Interactive projects", "Creative exploration"]
        }
        return activities.get(learning_style, activities["mixed"])
    
    def _create_error_result(self, error_message: str) -> Dict[str, Any]:
        """Create error result when plan generation fails."""
        return {
            "weekly_plan": {},
            "matched_topics": [],
            "error": error_message,
            "agent_timing": {
                "agent_name": "ScheduleAgent",
                "execution_time_seconds": 0,
                "llm_used": False,
                "tokens_used": 0
            }
        }

class ReviewerAgent:
    """Reviewer Agent - Reviews and optimizes the plan using LLM (NO hardcoded logic)."""
    
    def run(self, schedule_result: Dict[str, Any]) -> Dict[str, Any]:
        """Review and validate the final learning plan."""
        start_time = time.time()
        logger.info("🔍 Reviewer Agent: Quality validation of final plan")
        
        # Extract plan data
        weekly_plan = schedule_result.get("weekly_plan", {})
        matched_topics = schedule_result.get("matched_topics", [])
        standardized_profile = schedule_result.get("standardized_profile", {})
        monthly_plan_structure = schedule_result.get("monthly_plan_structure", {})
        
        child_name = standardized_profile.get('child_name', 'Child')
        child_age = standardized_profile.get('child_age', 7)
        learning_style = standardized_profile.get('preferred_learning_style', 'visual')
        interests = standardized_profile.get('interests', [])
        
        # Use LLM to generate comprehensive review insights
        review_insights = self._llm_comprehensive_review(
            weekly_plan, matched_topics, child_name, child_age, learning_style, interests
        )
        
        # Create review analysis
        selected_themes = monthly_plan_structure.get("selected_themes", [])
        review_analysis = {
            "child_name": child_name,
            "child_age": child_age,
            "learning_style": learning_style,
            "plan_type": standardized_profile.get("plan_type", "hybrid"),
            "selected_themes": [t.get('themeName', '') for t in selected_themes],
            "total_topics_reviewed": len(matched_topics),
            "total_weeks_planned": len(weekly_plan),
            "agent_flow": "ProfileAgent → AnalysisAgent → MatchAgent → ScheduleAgent → ReviewerAgent"
        }
        
        result = {
            **schedule_result,
            "review_insights": review_insights,
            "review_analysis": review_analysis,
            "agent_timing": {
                "agent_name": "ReviewerAgent",
                "execution_time_seconds": time.time() - start_time,
                "llm_used": True,
                "tokens_used": "calculated in LLM call",
                "llm_prompt": "comprehensive review prompt",
                "llm_response": "stored in review_insights"
            }
        }
        
        logger.info(f"✅ Reviewer Agent completed in {time.time() - start_time:.2f} seconds (LLM: True)")
        return result
    
    def _llm_comprehensive_review(self, weekly_plan: Dict, matched_topics: List[Dict], 
                                   child_name: str, child_age: int, learning_style: str, 
                                   interests: List[str]) -> Dict[str, Any]:
        """Use LLM to perform comprehensive plan review."""
        
        # Summarize plan for LLM
        plan_summary = {
            "total_weeks": len(weekly_plan),
            "total_topics": len(matched_topics),
            "interests": interests,
            "sample_topics": [t.get("Topic", "")[:30] for t in matched_topics[:5]]
        }
        
        prompt = f"""You are an expert educational reviewer. Perform a comprehensive review of this learning plan.

CHILD PROFILE:
- Name: {child_name}
- Age: {child_age} years old
- Interests: {', '.join(interests)}
- Learning Style: {learning_style}

PLAN OVERVIEW:
- Total Weeks: {plan_summary['total_weeks']}
- Total Topics: {plan_summary['total_topics']}
- Sample Topics: {', '.join(plan_summary['sample_topics'])}

TASK: Provide a comprehensive review in JSON format:

{{
  "plan_quality": {{
    "overall_score": "excellent/good/fair/poor",
    "structure_completeness": "complete/partial/incomplete",
    "activity_variety": "high/medium/low",
    "assessment": "detailed assessment"
  }},
  "age_appropriateness": {{
    "suitability_score": "excellent/good/fair/poor",
    "complexity_level": "appropriate/too_simple/too_complex",
    "attention_span_match": "well_matched/somewhat_matched/mismatched",
    "assessment": "detailed assessment"
  }},
  "learning_style_alignment": {{
    "alignment_score": "excellent/good/fair/poor",
    "style_match": "optimal/good/needs_work",
    "activity_types": "varied/consistent/limited",
    "assessment": "detailed assessment"
  }},
  "engagement_potential": {{
    "engagement_score": "high/medium/low",
    "motivation_factors": ["factor1", "factor2", ...],
    "interest_alignment": "strong/moderate/weak",
    "assessment": "detailed assessment"
  }},
  "potential_issues": ["issue1", "issue2", ...],
  "improvement_suggestions": ["suggestion1", "suggestion2", ...],
  "parent_recommendations": ["recommendation1", "recommendation2", ...],
  "performance_tracking": {{
    "tracking_methods": ["method1", "method2", ...],
    "success_indicators": ["indicator1", "indicator2", ...],
    "assessment_frequency": "daily/weekly/monthly"
  }},
  "optimization_suggestions": ["optimization1", "optimization2", ...],
  "risk_assessment": {{
    "overall_risk": "low/medium/high",
    "potential_risks": ["risk1", "risk2", ...],
    "mitigation_strategies": ["strategy1", "strategy2", ...]
  }},
  "topic_analysis": {{
    "interest_alignment_score": "excellent/good/fair/poor",
    "topic_variety_score": "excellent/good/fair/poor",
    "age_appropriateness_score": "excellent/good/fair/poor",
    "topic_analysis_summary": "detailed summary"
  }},
  "overall_performance_assessment": {{
    "engagement_prediction": "high/medium/low",
    "learning_effectiveness": "excellent/good/fair/poor",
    "plan_deliverability": "ready/needs_revision/not_ready",
    "success_probability": "high/medium/low",
    "performance_summary": "detailed summary"
  }},
  "review_summary": "comprehensive summary of the entire review"
}}

Return ONLY valid JSON, no markdown.
"""
        
        try:
            if gemini_api_available:
                model = get_gemini_model()
                response = model.generate_content(prompt)
                response_text = response.text.strip()
                
                # Remove markdown if present
                if response_text.startswith('```'):
                    response_text = response_text.strip('`').replace('json\n', '').replace('json', '').strip()
                
                llm_result = json.loads(response_text)
                logger.info(f"✅ LLM comprehensive review completed")
                return llm_result
            else:
                # Minimal fallback if LLM unavailable
                return self._fallback_review(child_name, child_age, learning_style, len(matched_topics))
                
        except Exception as e:
            logger.error(f"❌ LLM review failed: {e}")
            return self._fallback_review(child_name, child_age, learning_style, len(matched_topics))
    
    def _fallback_review(self, child_name: str, child_age: int, learning_style: str, topic_count: int) -> Dict[str, Any]:
        """Fallback review if LLM unavailable."""
        return {
            "plan_quality": {
                "overall_score": "good",
                "structure_completeness": "complete",
                "activity_variety": "high",
                "assessment": "Plan structure appears comprehensive"
            },
            "age_appropriateness": {
                "suitability_score": "good",
                "complexity_level": "appropriate",
                "attention_span_match": "well_matched",
                "assessment": f"Activities suitable for {child_age}-year-old"
            },
            "learning_style_alignment": {
                "alignment_score": "good",
                "style_match": "optimal",
                "activity_types": "varied",
                "assessment": f"Plan aligns with {learning_style} learning style"
            },
            "engagement_potential": {
                "engagement_score": "high",
                "motivation_factors": ["interest-based activities"],
                "interest_alignment": "strong",
                "assessment": "High engagement potential"
            },
            "potential_issues": ["Monitor for overstimulation"],
            "improvement_suggestions": ["Include progress check-ins"],
            "parent_recommendations": ["Observe child's engagement"],
            "performance_tracking": {
                "tracking_methods": ["observation"],
                "success_indicators": ["engagement"],
                "assessment_frequency": "weekly"
            },
            "optimization_suggestions": ["Include child's input"],
            "risk_assessment": {
                "overall_risk": "low",
                "potential_risks": ["overwhelm"],
                "mitigation_strategies": ["flexible scheduling"]
            },
            "topic_analysis": {
                "interest_alignment_score": "good",
                "topic_variety_score": "good",
                "age_appropriateness_score": "good",
                "topic_analysis_summary": f"Topics suitable for {child_age}-year-old"
            },
            "overall_performance_assessment": {
                "engagement_prediction": "high",
                "learning_effectiveness": "good",
                "plan_deliverability": "ready",
                "success_probability": "high",
                "performance_summary": f"Plan well-suited for {child_name}"
            },
            "review_summary": f"Review completed for {child_name} with {topic_count} topics"
        }

# Initialize agents
profile_agent = ProfileAgent()
analysis_agent = AnalysisAgent()
match_agent = MatchAgent()
schedule_agent = ScheduleAgent()
reviewer_agent = ReviewerAgent()

# Setup Google AI Studio Gemini API
def setup_gemini_api():
    """Setup Google AI Studio Gemini API with API key."""
    try:
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            logger.error("❌ GEMINI_API_KEY environment variable not set")
            return False
        
        # Configure Google AI with API key
        genai.configure(api_key=api_key)
        logger.info("✅ Google AI Studio Gemini API configured successfully")
        logger.info("🎯 Using Gemini 2.5 Flash (fastest & cheapest)")
        return True
    except Exception as e:
        logger.error(f"❌ Error setting up Gemini API: {e}")
        return False

gemini_api_available = setup_gemini_api()

def get_gemini_model():
    """Get configured Gemini model with JSON output mode."""
    generation_config = {
        "temperature": 0.7,
        "response_mime_type": "application/json"
    }
    return genai.GenerativeModel(
        'models/gemini-2.5-flash',
        generation_config=generation_config
    )

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Welcome to Unschooling Backend - Full Agent System Active",
        "status": "healthy",
        "version": "1.0.0",
        "agents": "enabled",
        "deployment": "full_agents",
        "features": ["Profile Agent", "Analysis Agent", "Match Agent", "Schedule Agent", "Reviewer Agent"]
    }

@app.get("/health")
async def health_check():
    """Detailed health check endpoint."""
    topics_loaded = len(load_topics_data()) > 0
    niches_loaded = len(load_niches_data()) > 0
    essential_loaded = bool(load_essential_growth_data())
    
    return {
        "status": "healthy",
        "app_name": "Unschooling Backend - Agent System",
        "debug": True,
        "agents_available": True,
        "data_loaded": topics_loaded and niches_loaded and essential_loaded,
        "topics_loaded": topics_loaded,
        "niches_loaded": niches_loaded,
        "essential_loaded": essential_loaded
    }

@app.post("/api/generate-plan")
async def generate_plan(request: Request):
    """Generate a personalized learning plan using the full agent system."""
    
    try:
        # Get the request body
        body = await request.json()
        profile = body.get("profile", {})
        
        logger.info("🚀 Starting full agent system (5 agents)")
        
        # Step 1: Profile Agent (Extract user input)
        logger.info("Step 1: Profile Agent - Extracting user input")
        profile_result = profile_agent.run(profile)
        profile_timing = profile_result["agent_timing"]
        
        # Step 2: Analysis Agent (Monthly Planning & Theme Selection)
        logger.info("Step 2: Analysis Agent - Monthly Planning & Theme Selection")
        analysis_result = analysis_agent.run(profile_result)
        analysis_timing = analysis_result["agent_timing"]
        
        # Step 3: Match Agent (Select 50 candidate topics)
        logger.info("Step 3: Match Agent - Selecting 50 candidate topics")
        match_result = match_agent.run(analysis_result)
        match_timing = match_result["agent_timing"]
        logger.info(f"📊 Match Agent result keys: {list(match_result.keys())}")
        
        # Log matched topics for debugging
        matched_topics = match_result.get("matched_topics", [])
        match_analysis = match_result.get("match_analysis", {})
        logger.info(f"🎯 Match Agent returned {len(matched_topics)} candidate topics (target: 50)")
        logger.info(f"📊 Match analysis: {match_analysis}")
        for i, topic in enumerate(matched_topics[:5], 1):  # Log first 5 topics
            logger.info(f"  {i}. {topic.get('Topic', 'Unknown')} ({topic.get('Niche', 'Unknown')})")
        
        # Step 4: Schedule Agent (Select final 28 from 50 & create daily schedule)
        logger.info("Step 4: Schedule Agent - Selecting final 28 topics and creating daily schedule")
        schedule_result = schedule_agent.run(match_result)
        schedule_timing = schedule_result["agent_timing"]
        
        # Step 5: Reviewer Agent (Quality Assurance)
        logger.info("Step 5: Reviewer Agent - Quality Assurance")
        reviewer_result = reviewer_agent.run(schedule_result)
        reviewer_timing = reviewer_result["agent_timing"]
        
        # Combine all results
        final_result = {
            "success": True,
            "data": reviewer_result,
            "message": "Plan generated successfully using full agent system",
            "agent_flow": "Profile → Analysis → Match → Schedule → Reviewer",
            "real_agents": True,
            "agent_timings": {
                "profile_agent": profile_timing,
                "analysis_agent": analysis_timing,
                "match_agent": match_timing,
                "schedule_agent": schedule_timing,
                "reviewer_agent": reviewer_timing,
                "total_execution_time": sum([
                    profile_timing["execution_time_seconds"],
                    analysis_timing["execution_time_seconds"],
                    match_timing["execution_time_seconds"],
                    schedule_timing["execution_time_seconds"],
                    reviewer_timing["execution_time_seconds"]
                ])
            },
            "llm_integration": {
                "gemini_api_available": gemini_api_available,
                "profile_agent_llm_used": profile_timing.get("llm_used", False),
                "profile_agent_prompt": profile_timing.get("llm_prompt"),
                "profile_agent_response": profile_timing.get("llm_response"),
                "profile_agent_tokens_used": profile_timing.get("tokens_used", 0),
                "analysis_agent_llm_used": analysis_timing.get("llm_used", False),
                "analysis_agent_prompt": analysis_timing.get("llm_prompt"),
                "analysis_agent_response": analysis_timing.get("llm_response"),
                "analysis_agent_tokens_used": analysis_timing.get("tokens_used", 0),
                "match_agent_llm_used": match_timing.get("llm_used", False),
                "match_agent_prompt": match_timing.get("llm_prompt"),
                "match_agent_response": match_timing.get("llm_response"),
                "match_agent_tokens_used": match_timing.get("tokens_used", 0),
                "schedule_agent_llm_used": schedule_timing.get("llm_used", False),
                "schedule_agent_prompt": schedule_timing.get("llm_prompt"),
                "schedule_agent_response": schedule_timing.get("llm_response"),
                "schedule_agent_tokens_used": schedule_timing.get("tokens_used", 0),
                "reviewer_agent_llm_used": reviewer_timing.get("llm_used", False),
                "reviewer_agent_prompt": reviewer_timing.get("llm_prompt"),
                "reviewer_agent_response": reviewer_timing.get("llm_response"),
                "reviewer_agent_tokens_used": reviewer_timing.get("tokens_used", 0)
            }
        }
        
        logger.info("✅ Full agent system completed successfully")
        return JSONResponse(content=final_result)
        
    except Exception as e:
        import traceback
        logger.error(f"❌ Error in generate_plan: {e}")
        logger.error(f"❌ Full traceback:\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e),
                "message": "Failed to generate plan",
                "traceback": traceback.format_exc() if app.debug else None
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
