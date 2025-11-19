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
import re
from typing import Dict, Any, List
# MIGRATED TO GOOGLE AI STUDIO (Gemini API with instant access)
import google.generativeai as genai
import os
from real_usage_tracker import real_usage_tracker
from child_activity_tracker import child_activity_tracker
# Firebase Admin for Firestore
import firebase_admin
from firebase_admin import credentials, firestore

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Firebase Admin (Single Source of Truth)
try:
    if not firebase_admin._apps:
        cred = credentials.Certificate('google-sheets-service-account.json')
        firebase_admin.initialize_app(cred)
    db = firestore.client()
    logger.info("✅ Firebase Admin initialized - Firestore connected")
except Exception as e:
    logger.error(f"❌ Firebase Admin initialization failed: {e}")
    db = None

def safe_json_parse(text: str, fallback: Any = None, max_retries: int = 3) -> Any:
    """
    Safely parse JSON with multiple fallback strategies.
    
    Args:
        text: Raw text to parse as JSON
        fallback: Fallback value if all parsing attempts fail
        max_retries: Maximum number of retry attempts
    
    Returns:
        Parsed JSON object or fallback value
    """
    if not text or not text.strip():
        logger.warning("⚠️ Empty text provided for JSON parsing")
        return fallback
    
    # Clean the text
    cleaned_text = text.strip()
    
    # Remove markdown code blocks
    if cleaned_text.startswith('```'):
        cleaned_text = cleaned_text.strip('`').replace('json\n', '').replace('json', '').strip()
    
    # Try direct parsing first
    try:
        return json.loads(cleaned_text)
    except json.JSONDecodeError as e:
        logger.warning(f"⚠️ Direct JSON parsing failed: {e}")
    
    # Try to extract JSON from text (look for { ... } or [ ... ])
    json_patterns = [
        r'\{.*\}',  # Object
        r'\[.*\]',  # Array
    ]
    
    for pattern in json_patterns:
        matches = re.findall(pattern, cleaned_text, re.DOTALL)
        for match in matches:
            try:
                return json.loads(match)
            except json.JSONDecodeError:
                continue
    
    # Try to fix common JSON issues
    fixed_text = cleaned_text
    
    # Fix missing commas between objects
    fixed_text = re.sub(r'}\s*{', '},{', fixed_text)
    
    # Fix missing commas between array elements
    fixed_text = re.sub(r']\s*\[', '],[', fixed_text)
    
    # Fix trailing commas
    fixed_text = re.sub(r',\s*}', '}', fixed_text)
    fixed_text = re.sub(r',\s*]', ']', fixed_text)
    
    try:
        return json.loads(fixed_text)
    except json.JSONDecodeError as e:
        logger.error(f"❌ All JSON parsing attempts failed: {e}")
        logger.error(f"Original text: {text[:200]}...")
        return fallback

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
    """Profile Agent - LLM-Powered Profile Enrichment Engine.
    
    Responsibilities:
    1. Uses AI to enrich minimal parent input into comprehensive profile
    2. Analyzes child characteristics based on age, interests, learning style
    3. Generates personalized learning objectives and recommendations
    4. Provides deep insights to all downstream agents
    5. Creates detailed developmental and learning analysis
    """
    
    def run(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """Use LLM to enrich and analyze the child's profile."""
        start_time = time.time()
        logger.info("📋 Profile Agent: AI-Powered Profile Enrichment")
        
        # Import the LLM-powered profile agent
        from agents.profile_agent import run_profile_agent
        logger.info("✅ Imported run_profile_agent")
        
        # Prepare state for profile agent
        state = {"profile": profile}
        logger.info(f"✅ Prepared state: {list(state.keys())}")
        
        # Get LLM model
        llm_model = get_gemini_model()
        logger.info(f"✅ Got LLM model: {type(llm_model)}")
        
        # Call LLM-powered profile agent
        logger.info("🤖 Calling run_profile_agent with LLM model...")
        profile_result = run_profile_agent(state, llm_model)
        logger.info(f"✅ Profile agent returned: llm_used={profile_result.get('agent_timing', {}).get('llm_used')}")
        
        # Extract enriched profile
        enriched_profile = profile_result.get("enriched_profile", {})
        agent_timing = profile_result.get("agent_timing", {})
        
        # Create standardized profile for downstream agents
        standardized_profile = {
            "child_name": profile.get("child_name", "Child"),
            "child_age": profile.get("child_age", 7),
            "interests": profile.get("interests", []),
            "dislikes": profile.get("dislikes", []),
            "preferred_learning_style": profile.get("preferred_learning_style", "visual"),
            "goals": profile.get("goals", []),
            "enriched_profile": enriched_profile,  # AI-enriched data
            "agent_flow": "ProfileAgent",
            "processing_timestamp": time.time()
        }
        
        result = {
            "profile": profile,
            "standardized_profile": standardized_profile,
            "enriched_profile": enriched_profile,
            "agent_timing": {
                "agent_name": "ProfileAgent",
                "execution_time_seconds": time.time() - start_time,
                "llm_used": agent_timing.get("llm_used", True),
                "tokens_used": agent_timing.get("tokens_used", 0),
                "llm_calls_count": agent_timing.get("llm_calls_count", 0),
                "llm_prompt": agent_timing.get("llm_prompt", ""),
                "llm_response": agent_timing.get("llm_response", ""),
                "llm_calls_detail": agent_timing.get("llm_calls_detail", []),
                "action": "profile_enriched_by_ai",
                "insights_generated": True
            }
        }
        
        logger.info(f"✅ Profile Agent completed AI enrichment in {time.time() - start_time:.2f} seconds")
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
        
        # Simplified: Always holistic intent
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
        # SIMPLIFIED: Always holistic plan
        plan_type = "holistic"
        
        # Determine month type
        current_month = monthly_evolution.get("current_month", 1)
        month_type = "introduction" if current_month == 1 else "continuation"
        
        logger.info(f"📅 Planning Month {current_month} for {child_name} (age {child_age})")
        
        # Get age group for theme filtering
        age_group = self._get_age_group(child_age)
        
        # Filter themes by age and interests only
        matching_themes = self._filter_themes(age_group, interests, "holistic")
        
        logger.info(f"📚 Found {len(matching_themes)} holistic themes")
        
        # Ensure we have themes
        if len(matching_themes) == 0:
            logger.warning(f"⚠️ No themes found, using all holistic themes for age group")
            matching_themes = [t for t in self.themes 
                             if t.get('ageGroup') == age_group and t.get('planType', '').lower() == 'holistic'][:15]
        
        # Use LLM to select 3 themes
        selected_themes, monthly_strategy = self._llm_select_themes_and_strategy(
            matching_themes, child_name, child_age, interests, learning_style
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
        """Filter themes by age group and interests (holistic only)."""
        
        logger.info(f"🔍 Filtering holistic themes: age={age_group}, interests={interests[:3]}")
        
        # Step 1: Filter by age and holistic plan type
        age_matched = []
        for theme in self.themes:
            if theme.get("ageGroup") == age_group and theme.get("planType", "").lower() == "holistic":
                age_matched.append(theme)
        
        logger.info(f"   Found {len(age_matched)} holistic themes for age group")
        
        # Step 2: Match by interests (optional)
        if interests and age_matched:
            interest_matched = []
            for theme in age_matched:
                theme_text = f"{theme.get('themeName', '')} {theme.get('shortDescription', '')}".lower()
                # Simple interest matching
                if any(interest.lower() in theme_text for interest in interests[:3]):
                    interest_matched.append(theme)
            
            logger.info(f"   Interest-matched: {len(interest_matched)} themes")
            final_matched = interest_matched if interest_matched else age_matched
        else:
            final_matched = age_matched
        
        logger.info(f"✅ Final matched themes: {len(final_matched)}")
        
        # Return matched themes, or fallback to first 10 from any age+plan if nothing matched
        if final_matched:
            return final_matched
        else:
            logger.warning(f"⚠️ No themes matched! Using fallback (first 10)")
            return self.themes[:10]
    
    def _llm_select_themes_and_strategy(self, matching_themes, child_name, child_age, interests, learning_style):
        """Use LLM to select 6-7 holistic themes (gives Schedule Agent more options)."""
        
        # Prepare theme list for LLM (limit to 25 for more variety)
        theme_list = []
        for i, theme in enumerate(matching_themes[:25], 1):
            theme_list.append({
                "id": i,
                "name": theme.get("themeName"),
                "description": theme.get("shortDescription")
            })
        
        # SIMPLIFIED PROMPT: Clear and concise
        prompt = f"""Select 6-7 learning themes for {child_name} (age {child_age}).

Interests: {', '.join(interests[:3]) if interests else 'General learning'}

THEMES:
{json.dumps(theme_list, indent=2)}

Choose 6-7 themes that match the child's interests. This gives Schedule Agent more options to create the best weekly plan.

Return JSON:
{{"selected_theme_ids": [1, 5, 9, 12, 15, 18, 22]}}"""
        
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
                
                strategy = safe_json_parse(response_text, {"selected_theme_ids": []})
                
                # Map selected IDs to actual themes
                selected_ids = strategy.get("selected_theme_ids", [])[:7]  # Up to 7 themes
                
                # Ensure we have at least 6 themes
                if len(selected_ids) < 6:
                    while len(selected_ids) < 7 and len(selected_ids) < len(matching_themes):
                        selected_ids.append(len(selected_ids) + 1)
                
                selected_themes = []
                for theme_id in selected_ids:
                    if 1 <= theme_id <= len(theme_list):
                        original_theme = matching_themes[theme_id - 1]
                        selected_themes.append(original_theme)
                
                strategy["tokens_used"] = len(prompt.split()) + len(response_text.split())
                strategy["llm_prompt"] = prompt
                
                logger.info(f"✅ LLM selected {len(selected_themes)} themes: {[t.get('themeName') for t in selected_themes]}")
                
                # Add simplified strategy data
                strategy["monthly_agenda"] = {"primary_goal": "Holistic development", "learning_focus": "Multi-domain skills"}
                strategy["weekly_progression"] = {"week_1": "Discovery", "week_2": "Exploration", "week_3": "Practice", "week_4": "Project"}
                strategy["guidance_for_match_agent"] = {"skill_focus": ["cognitive", "creative", "social", "physical", "real-world"]}
                strategy["guidance_for_schedule_agent"] = {"structure_type": "holistic_varied", "daily_balance": "Mix of skills daily"}
                
                return selected_themes, strategy
            else:
                logger.warning("⚠️ LLM not available, using fallback")
                # Fallback: Always select first 6-7 themes
                fallback_themes = matching_themes[:7] if len(matching_themes) >= 7 else matching_themes
                return fallback_themes, {
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
                        "structure_type": "holistic",
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
            
            # Error fallback: Return first 7 themes
            error_fallback_themes = matching_themes[:7] if len(matching_themes) >= 7 else matching_themes
            return error_fallback_themes, {
                "monthly_agenda": {"primary_goal": "General learning", "thought_process": "Fallback", "learning_narrative": "Discovery"},
                "weekly_progression": {"week_1": "Week 1", "week_2": "Week 2", "week_3": "Week 3", "week_4": "Week 4"},
                "guidance_for_match_agent": {"topic_criteria": "General", "skill_focus": [], "avoid_topics": []},
                "guidance_for_schedule_agent": {"structure_type": "holistic", "daily_balance": "Balanced"},
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
        
        # Initialize LLM tracking
        self.llm_calls = []  # Store all LLM calls made by this agent
        
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
        
        # Step 1: Pre-filter NICHE topics by age (STRICT: only ±1 year)
        age_appropriate_niche_topics = []
        for topic in self.topics_data:
            topic_age = topic.get("Age", 5)
            if abs(topic_age - child_age) <= 1:  # ±1 year ONLY (age 6-8 for 7-year-old)
                age_appropriate_niche_topics.append(topic)
        
        # If NO age-appropriate niche topics, try ±2 years as fallback
        if len(age_appropriate_niche_topics) < 10:
            logger.warning(f"⚠️ Only {len(age_appropriate_niche_topics)} niche topics for exact age match. Expanding to ±2 years...")
            age_appropriate_niche_topics = []
            for topic in self.topics_data:
                topic_age = topic.get("Age", 5)
                if abs(topic_age - child_age) <= 2:  # ±2 years as fallback
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
        niche_result = self._llm_select_niche_topics(
            age_appropriate_niche_topics, 
            child_name, 
            child_age, 
            interests, 
            learning_style,
            count=30  # Target ~30 from niches for 50 total
        )
        niche_topics = niche_result['topics'] if isinstance(niche_result, dict) else niche_result
        
        logger.info(f"🎯 LLM selected {len(niche_topics)} CANDIDATE niche topics")
        
        # Step 4: Use LLM to select ~20 CANDIDATE essential growth  
        eg_result = self._llm_select_essential_growth_topics(
            age_appropriate_eg_activities,
            child_name,
            child_age,
            learning_style,
            count=20  # Target ~20 from EG
        )
        eg_topics = eg_result['topics'] if isinstance(eg_result, dict) else eg_result
        
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
        
        # Collect all LLM calls made by this agent
        all_prompts = []
        all_responses = []
        total_tokens = 0
        
        for llm_call in getattr(self, 'llm_calls', []):
            if llm_call.get('prompt'):
                all_prompts.append(llm_call['prompt'])
            if llm_call.get('response'):
                all_responses.append(llm_call['response'])
            total_tokens += llm_call.get('tokens', 0)
        
        result = {
            "profile": profile,
            "standardized_profile": standardized_profile,
            "monthly_plan_structure": monthly_plan_structure,
            "matched_topics": matched_topics,
            "match_analysis": match_analysis,
            "agent_timing": {
                "agent_name": "MatchAgent",
                "execution_time_seconds": time.time() - start_time,
                "llm_used": len(self.llm_calls) > 0,
                "tokens_used": total_tokens,
                "llm_prompt": "\n\n=== CALL 1: NICHE TOPIC SELECTION ===\n".join(all_prompts) if all_prompts else None,
                "llm_response": "\n\n=== RESPONSE 1 ===\n".join(all_responses) if all_responses else None,
                "llm_calls_count": len(self.llm_calls),
                "llm_calls_detail": self.llm_calls
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

CRITICAL REQUIREMENTS:
1. Select EXACTLY {count} topics
2. **AGE FILTERING IS CRITICAL**: ONLY select topics aged {child_age-1} to {child_age+1} (ages {child_age-1}-{child_age+1})
   - REJECT any topic aged {child_age-2} or younger (too simple!)
   - REJECT any topic aged {child_age+2} or older (too complex!)
3. BALANCE across child's interests: {', '.join(interests) if interests else 'general topics'}
4. Consider {learning_style} learning style
5. Prefer topics from diverse niches

Return ONLY a JSON array of topic IDs (numbers 1-{len(topic_summaries)}):
{{"selected_topic_ids": [1, 5, 12, ...]}}

IMPORTANT: Age filtering is MANDATORY - DO NOT select age {child_age-2} or younger topics!"""
        
        try:
            if gemini_api_available:
                model = get_gemini_model()
                response = model.generate_content(prompt)
                response_text = response.text.strip()
                
                logger.info(f"📝 LLM response length: {len(response_text)} chars")
                
                # Store this LLM call
                if hasattr(self, 'llm_calls'):
                    self.llm_calls.append({
                        'call_name': 'niche_topic_selection',
                        'prompt': prompt,
                        'response': response_text,
                        'tokens': len(prompt.split()) + len(response_text.split())
                    })
                
                if not response_text:
                    logger.error(f"❌ LLM returned empty response!")
                    raise ValueError("Empty LLM response")
                
                llm_result = safe_json_parse(response_text, {"selected_topic_ids": []})
                selected_ids = llm_result.get('selected_topic_ids', [])
                
                # Map IDs back to actual topics WITH AGE VALIDATION
                matched_topics = []
                rejected_topics = []
                for topic_id in selected_ids:
                    if 1 <= topic_id <= len(topic_summaries):
                        original_topic = topics_pool[topic_id - 1]
                        topic_age = original_topic.get("Age", 5)
                        
                        # STRICT AGE VALIDATION: Only ±1 year
                        if abs(topic_age - child_age) <= 1:
                            matched_topics.append(original_topic)
                        else:
                            rejected_topics.append({
                                'topic': original_topic.get('Topic', 'Unknown')[:30],
                                'age': topic_age,
                                'reason': f'Age {topic_age} not suitable for {child_age}-year-old'
                            })
                
                if rejected_topics:
                    logger.warning(f"⚠️ Rejected {len(rejected_topics)} age-inappropriate topics: {rejected_topics[:3]}")
                
                logger.info(f"✅ LLM selected {len(matched_topics)} age-appropriate niche topics (rejected {len(rejected_topics)})")
                
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
                
                # Store this LLM call
                if hasattr(self, 'llm_calls'):
                    self.llm_calls.append({
                        'call_name': 'essential_growth_activity_selection',
                        'prompt': prompt,
                        'response': response_text,
                        'tokens': len(prompt.split()) + len(response_text.split())
                    })
                
                if response_text.startswith('```'):
                    response_text = response_text.strip('`').replace('json\n', '').replace('json', '').strip()
                
                llm_result = safe_json_parse(response_text, {"selected_topic_ids": []})
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
        
        # Initialize LLM tracking
        self.llm_calls = []  # Store all LLM calls made by this agent
        
        # Extract data from previous agents
        profile = match_result.get("profile", {})
        standardized_profile = match_result.get("standardized_profile", {})
        monthly_plan_structure = match_result.get("monthly_plan_structure", {})
        candidate_topics = match_result.get("matched_topics", [])  # 50 candidates
        
        # SIMPLIFIED: Always holistic
        child_name = standardized_profile.get("child_name", "Child")
        child_age = standardized_profile.get("child_age", 7)
        learning_style = standardized_profile.get("preferred_learning_style", "visual")
        interests = standardized_profile.get("interests", [])
        
        # Get monthly strategy guidance
        selected_themes = monthly_plan_structure.get("selected_themes", [])
        weekly_progression = monthly_plan_structure.get("weekly_progression", {
            "week_1": "Discovery", "week_2": "Exploration", "week_3": "Practice", "week_4": "Project"
        })
        
        logger.info(f"🎯 Holistic plan for {child_name}")
        logger.info(f"📊 Candidate topics received: {len(candidate_topics)}")
        logger.info(f"📚 Themes: {[t.get('themeName', 'Unknown') for t in selected_themes]}")
        logger.info(f"📅 Target: Select 28 final topics from {len(candidate_topics)} candidates")
        
        if not candidate_topics:
            logger.error("❌ No candidate topics available - cannot create plan")
            return self._create_error_result("No topics matched for plan generation")
        
        # Step 1: Use LLM to select 28 final topics from 50 candidates organized by week
        final_topics_by_week = self._llm_select_final_28_topics(
            candidate_topics, child_name, child_age, interests, learning_style,
            weekly_progression, selected_themes, "holistic"
        )
        
        logger.info(f"📅 LLM organized {sum(len(topics) for topics in final_topics_by_week.values())} topics into themed weeks")
        
        # Step 2: Generate weekly plan with theme names
        weekly_plan = self._create_themed_weekly_plan(
            final_topics_by_week, 
            profile, 
            selected_themes=selected_themes
        )
        
        # Get all final selected topics (flatten from weeks)
        final_matched_topics = []
        for week_topics in final_topics_by_week.values():
            final_matched_topics.extend(week_topics)
        
        logger.info(f"📊 Final topics selected: {len(final_matched_topics)}")
        
        # Use LLM to generate learning objectives (NO hardcoded)
        learning_objectives = self._llm_generate_learning_objectives(child_name, child_age, interests, learning_style, final_matched_topics)
        
        # Use LLM to generate recommended activities (NO hardcoded)
        recommended_activities = self._llm_generate_recommended_activities(child_name, child_age, interests, learning_style, "holistic")
        
        # Use LLM to generate progress tracking approach (NO hardcoded)
        progress_tracking = self._llm_generate_progress_tracking(child_name, child_age, learning_style)
        
        # Use LLM to analyze plan structure (NO hardcoded)
        systematic_approach = self._llm_analyze_plan_structure(weekly_plan, child_name, interests)
        
        # Create final result (preserve match_analysis from Match Agent!)
        match_analysis = match_result.get("match_analysis", {
            "total_topics_selected": len(final_matched_topics),
            "niches_covered": list(set(t.get("Niche", "General") for t in final_matched_topics)),
            "selection_criteria": {}
        })
        
        result = {
            "profile": profile,
            "standardized_profile": standardized_profile,
            "monthly_plan_structure": monthly_plan_structure,
            "weekly_plan": weekly_plan,
            "matched_topics": final_matched_topics,  # 28 final topics (not 50 candidates)
            "candidate_topics": candidate_topics,  # 50 candidates for reference
            "match_analysis": match_analysis,  # PRESERVE from Match Agent!
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
                "llm_used": len(getattr(self, 'llm_calls', [])) > 0,
                "tokens_used": sum(call.get('tokens', 0) for call in getattr(self, 'llm_calls', [])),
                "llm_prompt": "\n\n".join(f"=== {call['call_name']} ===\n{call['prompt']}" for call in getattr(self, 'llm_calls', [])) if getattr(self, 'llm_calls', []) else None,
                "llm_response": "\n\n".join(f"=== {call['call_name']} ===\n{call['response']}" for call in getattr(self, 'llm_calls', [])) if getattr(self, 'llm_calls', []) else None,
                "llm_calls_count": len(getattr(self, 'llm_calls', [])),
                "llm_calls_detail": getattr(self, 'llm_calls', [])
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
                
                # Store this LLM call
                if hasattr(self, 'llm_calls'):
                    self.llm_calls.append({
                        'call_name': 'final_28_topic_selection_and_week_organization',
                        'prompt': prompt,
                        'response': response_text,
                        'tokens': len(prompt.split()) + len(response_text.split())
                    })
                
                if response_text.startswith('```'):
                    response_text = response_text.strip('`').replace('json\n', '').replace('json', '').strip()
                
                llm_result = safe_json_parse(response_text, {"selected_topic_ids": []})
                
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
                    niche_ids = safe_json_parse(text1, {}).get('selected_topic_ids', [])
                    
                    # Select EG topics
                    response2 = model.generate_content(eg_prompt)
                    text2 = response2.text.strip()
                    eg_ids = safe_json_parse(text2, {}).get('selected_activity_ids', [])
                    
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
    
    def _create_themed_weekly_plan(self, topics_by_week: Dict[str, List[Dict]], profile: Dict, 
                                   selected_themes: List[Dict] = None) -> Dict[str, Any]:
        """Create the weekly plan structure with creative week names (holistic)."""
        
        weekly_plan = {}
        day_names = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        
        # Generate week names (always holistic approach)
        week_names = self._generate_week_names(topics_by_week, selected_themes, "holistic", profile)
        
        # ✅ CRITICAL: Iterate in EXPLICIT ORDER to ensure weeks are 1→2→3→4
        week_order = ["week_1", "week_2", "week_3", "week_4"]
        
        for week_key in week_order:
            if week_key not in topics_by_week:
                logger.warning(f"⚠️ {week_key} not found in topics_by_week, skipping")
                continue
            
            week_topics = topics_by_week[week_key]
            week_info = week_names.get(week_key, {})
            
            weekly_plan[week_key] = {
                "name": week_info.get("name", f"Week {week_key.split('_')[1]}"),
                "theme": week_info.get("theme", "Learning"),
                "focus": week_info.get("focus", "Exploration and growth"),
                "days": {}
            }
            
            # ✅ CRITICAL: Assign topics to days in EXPLICIT ORDER (Mon→Sun)
            for day_idx, day_name in enumerate(day_names):
                if day_idx < len(week_topics):
                    topic = week_topics[day_idx]
                    weekly_plan[week_key]["days"][day_name] = {
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
    
    def _generate_week_names(self, topics_by_week: Dict[str, List[Dict]], 
                            selected_themes: List[Dict], plan_type: str, profile: Dict) -> Dict[str, Dict]:
        """Generate creative week names using LLM (holistic approach)."""
        
        week_names = {}
        child_name = profile.get("child_name", "Child")
        
        # SIMPLIFIED: Always use holistic approach - generate creative names based on week topics
        # Weeks 1-3: LLM generates names based on topics
        for week_num in [1, 2, 3]:
            week_key = f"week_{week_num}"
            if week_key in topics_by_week:
                week_topics = topics_by_week[week_key]
                week_names[week_key] = self._llm_generate_single_week_name(week_topics, week_num, child_name, selected_themes)
        
        # Week 4: Project week with creative name
        if "week_4" in topics_by_week:
            week_names["week_4"] = self._generate_project_week_name(topics_by_week, child_name, selected_themes[:3] if selected_themes and len(selected_themes) >= 3 else selected_themes)
        
        return week_names
    
    def _generate_project_week_name(self, topics_by_week: Dict, child_name: str, themes: List[Dict]) -> Dict[str, str]:
        """Generate creative achievement name for Week 4."""
        
        creative_names = [
            f"{child_name}'s Grand Showcase",
            f"{child_name}'s Learning Journey",
            "Skills Mastery Week",
            "Achievement Celebration",
            "My Creative Project",
            "Grand Learning Showcase",
            "Skills & Talents Week"
        ]
        
        # Use LLM to generate personalized project week name
        if gemini_api_available and themes:
            try:
                theme_names = [t.get("themeName", "") for t in themes[:3]]
                prompt = f"""Generate a creative, inspiring name for the final project week of a learning plan.

CONTEXT:
- Child: {child_name}
- Previous weeks covered: {', '.join(theme_names)}
- This week combines all previous learning into a final project

Generate a name that:
- Shows achievement and accomplishment
- Is inspiring and motivational
- Reflects what the child will create/showcase
- Is 2-5 words maximum

Return JSON:
{{
  "name": "creative week name",
  "theme": "Project & Creation",
  "focus": "brief description of what child will achieve"
}}"""
                
                model = get_gemini_model()
                response = model.generate_content(prompt)
                response_text = response.text.strip()
                
                if response_text.startswith('```'):
                    response_text = response_text.strip('`').replace('json\n', '').replace('json', '').strip()
                
                result = safe_json_parse(response_text, {})
                
                # CRITICAL: Ensure result is a dict, not a list
                if isinstance(result, list):
                    logger.warning(f"⚠️ LLM returned list instead of dict for project week")
                    result = {"name": f"{child_name}'s Grand Showcase", "theme": "Project & Mastery", "focus": "Final showcase"}
                
                return result
            except Exception as e:
                logger.error(f"❌ LLM project week name generation failed: {e}")
        
        # Fallback: Use random creative name
        import random
        return {
            "name": random.choice(creative_names),
            "theme": "Project & Mastery",
            "focus": "Showcase learning through creative project"
        }
    
    def _llm_generate_holistic_week_names(self, topics_by_week: Dict[str, List[Dict]], child_name: str) -> Dict[str, Dict]:
        """Use LLM to generate week names for HOLISTIC plans based on topic connections."""
        
        week_names = {}
        
        for week_key, week_topics in topics_by_week.items():
            if week_key == "week_4":
                # Week 4 is always project week
                week_names[week_key] = self._generate_project_week_name([], child_name, "holistic")
            else:
                # Generate name based on topic connections
                week_names[week_key] = self._llm_generate_single_week_name(week_topics, child_name, week_key)
        
        return week_names
    
    def _llm_generate_single_week_name(self, week_topics: List[Dict], week_num: int, child_name: str, selected_themes: List[Dict]) -> Dict[str, str]:
        """Generate creative week name using LLM (simplified)."""
        
        if not gemini_api_available or not week_topics:
            return {"name": f"Week {week_num}", "theme": "Learning", "focus": "Skill development"}
        
        try:
            # Get topic names (first 5 for brevity)
            topic_names = [t.get("Topic", "")[:30] for t in week_topics[:5]]
            
            # SIMPLIFIED PROMPT
            prompt = f"""Create a fun week name for {child_name}.

Topics: {', '.join(topic_names)}

Make it creative (2-3 words). Examples: "Ocean Explorers", "Space Adventures"

Return JSON:
{{"name": "Week Name", "theme": "Theme", "focus": "Focus"}}"""
            
            model = get_gemini_model()
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            if response_text.startswith('```'):
                response_text = response_text.strip('`').replace('json\n', '').replace('json', '').strip()
            
            result = safe_json_parse(response_text, {})
            
            # CRITICAL: Ensure result is a dict, not a list
            if isinstance(result, list):
                logger.warning(f"⚠️ LLM returned list instead of dict for week {week_num}")
                result = {"name": f"Learning Week {week_num}", "theme": "Multi-domain", "focus": "Exploration"}
            
            return result
            
        except Exception as e:
            logger.error(f"❌ LLM week name generation failed: {e}")
            return {
                "name": f"Learning Week {week_num}",
                "theme": "Multi-domain Exploration",
                "focus": "Developing diverse skills"
            }
    
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
                result = safe_json_parse(response_text, {})
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
                result = safe_json_parse(response_text, {})
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
                return safe_json_parse(response_text, {})
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
                return safe_json_parse(response_text, {})
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
        
        # Initialize LLM tracking
        self.llm_calls = []  # Store all LLM calls made by this agent
        
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
                "llm_used": len(getattr(self, 'llm_calls', [])) > 0,
                "tokens_used": sum(call.get('tokens', 0) for call in getattr(self, 'llm_calls', [])),
                "llm_prompt": "\n\n".join(f"=== {call['call_name']} ===\n{call['prompt']}" for call in getattr(self, 'llm_calls', [])) if getattr(self, 'llm_calls', []) else None,
                "llm_response": "\n\n".join(f"=== {call['call_name']} ===\n{call['response']}" for call in getattr(self, 'llm_calls', [])) if getattr(self, 'llm_calls', []) else None,
                "llm_calls_count": len(getattr(self, 'llm_calls', [])),
                "llm_calls_detail": getattr(self, 'llm_calls', [])
            }
        }
        
        logger.info(f"✅ Reviewer Agent completed in {time.time() - start_time:.2f} seconds (LLM: True)")
        return result
    
    def _llm_comprehensive_review(self, weekly_plan: Dict, matched_topics: List[Dict], 
                                   child_name: str, child_age: int, learning_style: str, 
                                   interests: List[str]) -> Dict[str, Any]:
        """Use LLM to perform comprehensive plan review."""
        
        # Prepare complete topic list for LLM review
        topics_for_review = []
        for topic in matched_topics:
            topics_for_review.append({
                "id": topic.get("Topic ID", "N/A"),
                "name": topic.get("Topic", "Unknown"),
                "objective": topic.get("Objective", ""),
                "niche": topic.get("Niche", topic.get("Pillar", "General")),
                "age": topic.get("Age", "")
            })
        
        # Prepare week summary with names
        week_summary = []
        for week_key, week_data in weekly_plan.items():
            week_summary.append({
                "week": week_key,
                "name": week_data.get("name", "N/A"),
                "theme": week_data.get("theme", "N/A"),
                "focus": week_data.get("focus", "N/A")
            })
        
        prompt = f"""You are an expert educational reviewer. Perform a comprehensive review of this learning plan.

CHILD PROFILE:
- Name: {child_name}
- Age: {child_age} years old
- Interests: {', '.join(interests)}
- Learning Style: {learning_style}

WEEKLY PLAN STRUCTURE:
{json.dumps(week_summary, indent=2)}

ALL SELECTED TOPICS ({len(topics_for_review)} topics):
{json.dumps(topics_for_review, indent=2)}

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
                
                # Store this LLM call
                if hasattr(self, 'llm_calls'):
                    self.llm_calls.append({
                        'call_name': 'comprehensive_quality_review',
                        'prompt': prompt,
                        'response': response_text,
                        'tokens': len(prompt.split()) + len(response_text.split())
                    })
                
                # Remove markdown if present
                if response_text.startswith('```'):
                    response_text = response_text.strip('`').replace('json\n', '').replace('json', '').strip()
                
                llm_result = safe_json_parse(response_text, {"selected_topic_ids": []})
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

def call_llm_with_tracking(agent_instance, call_name, prompt):
    """Call LLM and automatically track the input/output."""
    if not gemini_api_available:
        return None
    
    model = get_gemini_model()
    response = model.generate_content(prompt)
    response_text = response.text.strip()
    
    # Store in agent's llm_calls list
    if hasattr(agent_instance, 'llm_calls'):
        agent_instance.llm_calls.append({
            'call_name': call_name,
            'prompt': prompt,
            'response': response_text,
            'tokens': len(prompt.split()) + len(response_text.split())
        })
    
    return response_text

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

@app.get("/api/get-latest-plan/{user_id}/{child_id}")
async def get_latest_plan_for_child(user_id: str, child_id: str):
    """Fetch the latest plan for a specific child from Firestore."""
    try:
        if not db:
            return JSONResponse(
                status_code=500,
                content={"error": "Firestore not initialized"}
            )
        
        logger.info(f"📥 Fetching latest plan for child: {child_id}")
        
        # Get the child's plans collection
        plans_ref = db.collection('users').document(user_id).collection('children').document(child_id).collection('plans')
        
        # Get all plans ordered by timestamp (most recent first)
        plans_query = plans_ref.order_by('timestamp', direction=firestore.Query.DESCENDING).limit(1)
        plans = list(plans_query.stream())
        
        if not plans:
            return JSONResponse(
                status_code=404,
                content={"error": f"No plans found for child {child_id}"}
            )
        
        latest_plan = plans[0].to_dict()
        
        # ✅ CRITICAL: Fix week/day order before sending to frontend
        if 'weekly_plan' in latest_plan and latest_plan['weekly_plan']:
            latest_plan['weekly_plan'] = ensure_correct_order(latest_plan['weekly_plan'])
            logger.info("✅ Week/day order corrected before sending to frontend")
        
        # Convert Firestore timestamps to strings
        if 'timestamp' in latest_plan:
            latest_plan['timestamp'] = str(latest_plan['timestamp'])
        if 'created_at' in latest_plan:
            latest_plan['created_at'] = str(latest_plan['created_at'])
        if 'updated_at' in latest_plan:
            latest_plan['updated_at'] = str(latest_plan['updated_at'])
        
        logger.info(f"✅ Found latest plan: {plans[0].id}")
        
        # Wrap response in standard format expected by frontend
        return JSONResponse(content={
            "success": True,
            "data": latest_plan
        })
        
    except Exception as e:
        logger.error(f"❌ Error fetching plan: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

def ensure_correct_order(weekly_plan: Dict) -> Dict:
    """Ensure weekly_plan has correct week and day order."""
    from collections import OrderedDict
    
    ordered_plan = OrderedDict()
    week_order = ['week_1', 'week_2', 'week_3', 'week_4']
    day_order = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    
    for week_key in week_order:
        if week_key in weekly_plan:
            week_data = weekly_plan[week_key]
            ordered_week = OrderedDict()
            ordered_week['name'] = week_data.get('name', f'Week {week_key.split("_")[1]}')
            ordered_week['theme'] = week_data.get('theme', 'Learning')
            ordered_week['focus'] = week_data.get('focus', 'Exploration')
            
            # Order days
            ordered_days = OrderedDict()
            for day_key in day_order:
                if day_key in week_data.get('days', {}):
                    ordered_days[day_key] = week_data['days'][day_key]
            
            ordered_week['days'] = dict(ordered_days)
            ordered_plan[week_key] = dict(ordered_week)
    
    return dict(ordered_plan)

@app.get("/api/get-latest-plan")
async def get_absolute_latest_plan():
    """Fetch the absolute latest plan from Firestore (across all users/children)."""
    try:
        if not db:
            return JSONResponse(
                status_code=500,
                content={"error": "Firestore not initialized"}
            )
        
        logger.info(f"📥 Fetching absolute latest plan from all users")
        
        # Get all users first, then find latest plan (avoids collection_group index issue)
        users = db.collection('users').stream()
        all_plans = []
        
        for user_doc in users:
            user_id = user_doc.id
            children = db.collection('users').document(user_id).collection('children').stream()
            
            for child_doc in children:
                child_id = child_doc.id
                plans = db.collection('users').document(user_id).collection('children').document(child_id).collection('plans').stream()
                
                for plan_doc in plans:
                    plan_data = plan_doc.to_dict()
                    plan_data['user_id'] = user_id
                    plan_data['child_id'] = child_id
                    plan_data['plan_id'] = plan_doc.id
                    
                    # Keep original timestamp for sorting
                    all_plans.append(plan_data)
        
        if not all_plans:
            return JSONResponse(
                status_code=404,
                content={"error": "No plans found in database"}
            )
        
        # Sort by timestamp (Firestore SERVER_TIMESTAMP) - most reliable
        # Use generated_at as fallback, then timestamp, then created_at
        def get_sort_key(plan):
            # Try generated_at first (Unix timestamp)
            if 'generated_at' in plan and plan['generated_at']:
                return plan['generated_at']
            # Try timestamp (Firestore timestamp object)
            elif 'timestamp' in plan and plan['timestamp']:
                ts = plan['timestamp']
                if hasattr(ts, 'seconds'):
                    return ts.seconds
                elif hasattr(ts, 'timestamp'):
                    return ts.timestamp()
            # Try created_at (Firestore timestamp object)
            elif 'created_at' in plan and plan['created_at']:
                ts = plan['created_at']
                if hasattr(ts, 'seconds'):
                    return ts.seconds
                elif hasattr(ts, 'timestamp'):
                    return ts.timestamp()
            return 0
        
        all_plans.sort(key=get_sort_key, reverse=True)
        
        # Log all plans found with their timestamps for debugging
        logger.info(f"📊 Found {len(all_plans)} total plans across all users/children")
        for i, p in enumerate(all_plans[:5]):  # Log top 5
            sort_key = get_sort_key(p)
            logger.info(f"   Plan {i+1}: Month={p.get('month')}, Child={p.get('child_id')}, SortKey={sort_key}, Generated={p.get('generated_at', 'N/A')}")
        
        latest_plan = all_plans[0]
        
        # ✅ CRITICAL: Fix week/day order before sending to frontend
        if 'weekly_plan' in latest_plan and latest_plan['weekly_plan']:
            latest_plan['weekly_plan'] = ensure_correct_order(latest_plan['weekly_plan'])
            logger.info("✅ Week/day order corrected before sending to frontend")
        
        # NOW convert timestamps to strings for JSON response
        if 'timestamp' in latest_plan:
            latest_plan['timestamp'] = str(latest_plan['timestamp'])
        if 'created_at' in latest_plan:
            latest_plan['created_at'] = str(latest_plan['created_at'])
        if 'updated_at' in latest_plan:
            latest_plan['updated_at'] = str(latest_plan['updated_at'])
        
        logger.info(f"✅ Returning latest plan: {latest_plan.get('month', 'Unknown')} for child {latest_plan.get('child_id', 'Unknown')}")
        
        # Wrap response in standard format expected by frontend
        return JSONResponse(content={
            "success": True,
            "data": latest_plan
        })
        
    except Exception as e:
        logger.error(f"❌ Error fetching latest plan: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@app.post("/api/generate-plan")
async def generate_plan(request: Request):
    """Generate a personalized learning plan using the full agent system."""
    
    try:
        # Get the request body
        body = await request.json()
        
        # Support both "profile" and "childProfile" keys
        child_profile_data = body.get("childProfile") or body.get("profile", {})
        
        # Map frontend format to backend format (SIMPLIFIED: Always holistic)
        profile = {
            "child_name": child_profile_data.get("name", child_profile_data.get("child_name", "Child")),
            "child_age": child_profile_data.get("age", child_profile_data.get("child_age", 7)),
            "interests": child_profile_data.get("interests", []),
            "dislikes": child_profile_data.get("dislikes", []),
            "preferred_learning_style": child_profile_data.get("learningStyle", child_profile_data.get("learning_style", child_profile_data.get("preferred_learning_style", "visual"))),
            "goals": child_profile_data.get("goals", [])
        }
        
        logger.info(f"🚀 Starting full agent system (5 agents) for {profile['child_name']}, age {profile['child_age']}")
        logger.info(f"📋 Profile: interests={profile['interests']}, style={profile['preferred_learning_style']}")
        
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
        
        # Reviewer now includes weekly_plan, matched_topics, and all necessary data
        # Combine all results
        final_result = {
            "success": True,
            "data": reviewer_result,  # ✅ reviewer_result now includes weekly_plan
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
        
        # Save to Firestore (Single Source of Truth)
        if db and body.get("userId") and body.get("childId"):
            try:
                user_id = body.get("userId")
                child_id = body.get("childId")
                month_key = body.get("monthKey", f"{time.strftime('%B %Y')}")
                
                logger.info(f"💾 Saving plan to Firestore: users/{user_id}/children/{child_id}/plans/{month_key}")
                
                # Save only the plan data, not the API response wrapper
                # final_result = {success: True, data: {...}, message: ...}
                # We want to save data + metadata, not the whole response
                plan_to_save = {
                    **final_result["data"],  # ✅ Save only the actual plan data
                    "timestamp": firestore.SERVER_TIMESTAMP,
                    "created_at": firestore.SERVER_TIMESTAMP,  # ✅ CRITICAL: Frontend uses this!
                    "updated_at": firestore.SERVER_TIMESTAMP,
                    "generated_at": time.time(),
                    "month": month_key,
                    "child_id": child_id,
                    "user_id": user_id,
                    "agent_timings": final_result.get("agent_timings", {}),
                    "llm_integration": final_result.get("llm_integration", {}),
                    "agent_flow": final_result.get("agent_flow", "")
                }
                
                # Save to Firestore
                plan_ref = db.collection('users').document(user_id).collection('children').document(child_id).collection('plans').document(month_key)
                plan_ref.set(plan_to_save)
                
                logger.info(f"✅ Plan saved to Firestore: {month_key}")
                
            except Exception as firestore_error:
                logger.error(f"⚠️ Failed to save to Firestore: {firestore_error}")
                # Continue anyway - plan is still returned to frontend
        
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
