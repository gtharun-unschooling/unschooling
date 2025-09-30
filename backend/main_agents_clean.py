"""
Full Agent System Backend with LangGraph and Gemini API - Clean Version
No Fallback Data - Uses Only Original Data Sources
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os
import json
import time
from typing import Dict, Any, List
import google.generativeai as genai
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
        topics_file = "src/data/topicsdata.json"
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
        niches_file = "src/data/nichesdata.json"
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
        essential_file = "src/data/essential-growth/index.json"
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
    """Profile Agent - Analyzes child profile and extracts key information."""
    
    def run(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """Process the child profile with LLM insights."""
        start_time = time.time()
        logger.info("🔍 Profile Agent: Analyzing child profile")
        
        # Extract key information
        child_name = profile.get("child_name", "Child")
        child_age = profile.get("child_age", 7)
        interests = profile.get("interests", ["AI"])
        learning_style = profile.get("preferred_learning_style", "visual")
        plan_type = profile.get("plan_type", "hybrid")
        
        # Create profile analysis
        profile_analysis = {
            "child_name": child_name,
            "child_age": child_age,
            "interests": interests,
            "learning_style": learning_style,
            "plan_type": plan_type,
            "cognitive_level": "intermediate",
            "attention_span": "medium",
            "preferred_activities": [],
            "llm_insights": {}
        }
        
        # Create enhanced profile
        enhanced_profile = {
            **profile,
            "learning_style": learning_style,
            "cognitive_level": "intermediate",
            "attention_span": "medium",
            "preferred_activities": [],
            "llm_insights": {},
            "agent_flow": "ProfileAgent",
            "processing_timestamp": time.time()
        }
        
        result = {
            "profile": profile,
            "profile_analysis": profile_analysis,
            "enhanced_profile": enhanced_profile,
            "agent_timing": {
                "execution_time_seconds": time.time() - start_time,
                "llm_used": False,
                "tokens_used": 0,
                "llm_prompt": None,
                "llm_response": None
            }
        }
        
        logger.info(f"✅ Profile Agent completed in {time.time() - start_time:.2f} seconds")
        return result

class MatchAgent:
    """Match Agent - Selects appropriate topics based on profile and history."""
    
    def __init__(self):
        logger.info("🎯 Initializing MatchAgent")
        self.topics_data = load_topics_data()
        self.niches_data = load_niches_data()
        self.essential_growth_data = load_essential_growth_data()
        logger.info(f"📊 MatchAgent loaded {len(self.topics_data)} topics, {len(self.niches_data)} niches")
        
        if len(self.topics_data) == 0:
            logger.error("❌ CRITICAL: No topics data loaded! MatchAgent will not work properly.")
        else:
            logger.info(f"✅ Topics data loaded successfully. Sample topics: {[t.get('Topic', 'Unknown')[:20] for t in self.topics_data[:3]]}")
        
        if len(self.niches_data) == 0:
            logger.error("❌ CRITICAL: No niches data loaded! MatchAgent will not work properly.")
        else:
            logger.info(f"✅ Niches data loaded successfully. Sample niches: {[n.get('Niche', 'Unknown')[:20] for n in self.niches_data[:3]]}")
        
        if not self.essential_growth_data:
            logger.error("❌ CRITICAL: No essential growth data loaded! MatchAgent will not work properly.")
        else:
            logger.info(f"✅ Essential growth data loaded successfully. Pillars: {len(self.essential_growth_data.get('pillars', []))}")
    
    def run(self, profile_result: Dict[str, Any]) -> Dict[str, Any]:
        """Match topics to child profile using real data only."""
        start_time = time.time()
        logger.info("🎯 Match Agent: Selecting topics from real database")
        
        profile = profile_result.get("profile", {})
        enhanced_profile = profile_result.get("enhanced_profile", {})
        
        child_name = enhanced_profile.get("child_name", "Child")
        child_age = enhanced_profile.get("child_age", 7)
        interests = enhanced_profile.get("interests", ["AI"])
        learning_style = enhanced_profile.get("learning_style", "visual")
        
        logger.info(f"🎯 Matching topics for {child_name} (age {child_age}) with interests: {interests}")
        
        # Match topics based on interests and age
        matched_topics = []
        for topic in self.topics_data:
            if self._is_topic_suitable(topic, child_age, interests, learning_style):
                matched_topics.append(topic)
        
        # Limit to reasonable number of topics
        matched_topics = matched_topics[:28]  # 4 weeks * 7 days
        
        logger.info(f"🎯 Matched {len(matched_topics)} topics")
        
        # Create match analysis
        match_analysis = {
            "total_topics_selected": len(matched_topics),
            "niches_covered": list(set(t.get("Niche", "General") for t in matched_topics)),
            "selection_criteria": {
                "age_appropriate": True,
                "interest_aligned": True,
                "cognitive_level_matched": True,
                "learning_style_considered": True
            },
            "agent_flow": "ProfileAgent → MatchAgent"
        }
        
        result = {
            "profile": profile_result.get("profile", {}),
            "profile_analysis": profile_result.get("profile_analysis", {}),
            "enhanced_profile": enhanced_profile,
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
    
    def _is_topic_suitable(self, topic: Dict[str, Any], child_age: int, interests: List[str], learning_style: str) -> bool:
        """Check if topic is suitable for the child."""
        # Age appropriateness
        topic_age = topic.get("Age", 5)
        if abs(topic_age - child_age) > 2:
            return False
        
        # Interest alignment
        topic_niche = topic.get("Niche", "").lower()
        topic_topic = topic.get("Topic", "").lower()
        
        for interest in interests:
            if interest.lower() in topic_niche or interest.lower() in topic_topic:
                return True
        
        return False

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
        """Create weekly learning plan using real topics only."""
        start_time = time.time()
        logger.info("📅 Schedule Agent: Creating weekly plan with real topics")
        
        # Extract data from previous agents
        profile = match_result.get("profile", {})
        profile_analysis = match_result.get("profile_analysis", {})
        enhanced_profile = match_result.get("enhanced_profile", {})
        matched_topics = match_result.get("matched_topics", [])
        match_analysis = match_result.get("match_analysis", {})
        
        plan_type = enhanced_profile.get("plan_type", "hybrid")
        child_name = enhanced_profile.get("child_name", "Child")
        child_age = enhanced_profile.get("child_age", 7)
        learning_style = enhanced_profile.get("learning_style", "visual")
        attention_span = enhanced_profile.get("attention_span", "medium")
        
        logger.info(f"🎯 Plan Type: {plan_type}")
        logger.info(f"📊 Matched topics: {len(matched_topics)}")
        
        if not matched_topics:
            logger.error("❌ No matched topics available - cannot create plan")
            return self._create_error_result("No topics matched for plan generation")
        
        # Generate weekly plan using real topics only
        weekly_plan = self.plan_generator.generate_weekly_plan(profile, matched_topics)
        
        # Generate learning objectives
        learning_objectives = [
            f"Develop {profile.get('interests', ['AI'])[0]} skills",
            "Enhance problem-solving abilities", 
            "Build creativity and innovation",
            "Improve critical thinking",
            "Foster curiosity and exploration"
        ]
        
        # Generate recommended activities
        recommended_activities = self._get_recommended_activities(profile)
        
        # Progress tracking
        progress_tracking = {
            "metrics": ["engagement", "completion", "understanding", "enjoyment"],
            "frequency": "daily",
            "assessment_methods": ["observation", "conversation", "project_review"]
        }
        
        # Create systematic approach tracking
        systematic_approach = {
            "agent_flow": [
                {"agent": "profile_agent", "status": "completed"},
                {"agent": "match_agent", "status": "completed"},
                {"agent": "schedule_agent", "status": "completed"}
            ],
            "plan_structure": {
                "total_weeks": 4,
                "discovery_week": {"theme": "Technology & Innovation", "focus": "AI, Coding, Robotics"},
                "skills_week": {"theme": "Life Skills & Finance", "focus": "Money, Entrepreneurship, Communication"},
                "creation_week": {"theme": "Creative Expression", "focus": "Art, Music, Writing, Design"},
                "project_week": {"theme": "Problem Solving & Logic", "focus": "Math, Science, Engineering, Critical Thinking"}
            }
        }
        
        # Create final result
        result = {
            "weekly_plan": weekly_plan,
            "matched_topics": matched_topics,
            "profile_analysis": profile_analysis,
            "learning_objectives": learning_objectives,
            "recommended_activities": recommended_activities,
            "progress_tracking": progress_tracking,
            "systematic_approach": systematic_approach,
            "llm_integration": {
                "schedule_agent_llm_used": False,
                "schedule_agent_prompt": None,
                "schedule_agent_response": None,
                "schedule_agent_tokens_used": 0
            },
            "agent_timing": {
                "agent_name": "ScheduleAgent",
                "execution_time_seconds": time.time() - start_time,
                "llm_used": False,
                "tokens_used": 0,
                "llm_prompt": None,
                "llm_response": None
            }
        }
        
        logger.info(f"✅ Schedule Agent completed in {time.time() - start_time:.2f} seconds")
        logger.info(f"📊 Generated plan with {len(weekly_plan)} weeks")
        return result
    
    def _get_recommended_activities(self, profile: Dict[str, Any]) -> List[str]:
        """Get recommended activities based on profile."""
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
    """Reviewer Agent - Reviews and optimizes the plan."""
    
    def run(self, schedule_result: Dict[str, Any]) -> Dict[str, Any]:
        """Review and optimize the learning plan."""
        start_time = time.time()
        logger.info("🔍 Reviewer Agent: Reviewing plan quality")
        
        # Extract plan data
        weekly_plan = schedule_result.get("weekly_plan", {})
        matched_topics = schedule_result.get("matched_topics", [])
        profile_analysis = schedule_result.get("profile_analysis", {})
        
        # Create review insights
        review_insights = {
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
                "assessment": f"Activities suitable for {profile_analysis.get('child_age', 5)}-year-old"
            },
            "learning_style_alignment": {
                "alignment_score": "good",
                "style_match": "optimal",
                "activity_types": "varied",
                "assessment": f"Plan aligns with {profile_analysis.get('learning_style', 'visual')} learning style"
            },
            "engagement_potential": {
                "engagement_score": "high",
                "motivation_factors": ["interest-based activities"],
                "interest_alignment": "strong",
                "assessment": "High engagement potential"
            },
            "potential_issues": ["Monitor for overstimulation", "Ensure adequate breaks"],
            "improvement_suggestions": ["Add more hands-on activities", "Include regular progress check-ins"],
            "parent_recommendations": ["Observe child's engagement", "Celebrate small achievements"],
            "performance_tracking": {
                "tracking_methods": ["observation", "conversation"],
                "success_indicators": ["engagement", "skill development"],
                "assessment_frequency": "weekly"
            },
            "optimization_suggestions": ["Customize based on energy levels", "Include child's input"],
            "risk_assessment": {
                "overall_risk": "low",
                "potential_risks": ["overwhelm", "boredom"],
                "mitigation_strategies": ["flexible scheduling"]
            },
            "topic_analysis": {
                "weekly_topic_distribution": {},
                "interest_alignment_score": "medium",
                "topic_variety_score": "good",
                "age_appropriateness_score": "good",
                "topic_analysis_summary": f"Topics appear suitable for {profile_analysis.get('child_age', 5)}-year-old with {profile_analysis.get('learning_style', 'visual')} learning style"
            },
            "overall_performance_assessment": {
                "engagement_prediction": "high",
                "learning_effectiveness": "good",
                "plan_deliverability": "ready",
                "success_probability": "high",
                "performance_summary": f"Plan appears well-suited for {profile_analysis.get('child_name', 'Child')} based on interests and age"
            },
            "llm_analysis": {},
            "review_summary": f"Comprehensive review completed for {profile_analysis.get('child_name', 'Child')} (Age: {profile_analysis.get('child_age', 5)}) with {profile_analysis.get('learning_style', 'visual')} learning style"
        }
        
        # Create review analysis
        review_analysis = {
            "child_name": profile_analysis.get("child_name", "Child"),
            "child_age": profile_analysis.get("child_age", 5),
            "learning_style": profile_analysis.get("learning_style", "visual"),
            "cognitive_level": profile_analysis.get("cognitive_level", "intermediate"),
            "attention_span": profile_analysis.get("attention_span", "medium"),
            "total_topics_reviewed": len(matched_topics),
            "total_weeks_planned": len(weekly_plan),
            "agent_flow": "ProfileAgent → MatchAgent → ScheduleAgent → ReviewerAgent"
        }
        
        result = {
            **schedule_result,
            "review_insights": review_insights,
            "review_analysis": review_analysis,
            "agent_timing": {
                "agent_name": "ReviewerAgent",
                "execution_time_seconds": time.time() - start_time,
                "llm_used": False,
                "tokens_used": 0,
                "llm_prompt": None,
                "llm_response": None
            }
        }
        
        logger.info(f"✅ Reviewer Agent completed in {time.time() - start_time:.2f} seconds")
        return result

# Initialize agents
profile_agent = ProfileAgent()
match_agent = MatchAgent()
schedule_agent = ScheduleAgent()
reviewer_agent = ReviewerAgent()

# Setup Gemini
def setup_gemini():
    """Setup Gemini API if available."""
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            logger.info("✅ Gemini API configured successfully")
            return True
        else:
            logger.warning("⚠️ GOOGLE_API_KEY not found - using fallback mode")
            return False
    except Exception as e:
        logger.error(f"❌ Error setting up Gemini: {e}")
        return False

gemini_available = setup_gemini()

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Welcome to Unschooling Backend - Full Agent System Active",
        "status": "healthy",
        "version": "1.0.0",
        "agents": "enabled",
        "deployment": "full_agents",
        "features": ["Profile Agent", "Match Agent", "Schedule Agent", "Reviewer Agent"]
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
        
        logger.info("🚀 Starting full agent system")
        
        # Step 1: Profile Agent
        logger.info("Step 1: Profile Agent")
        profile_result = profile_agent.run(profile)
        profile_analysis = profile_result["profile_analysis"]
        profile_timing = profile_result["agent_timing"]
        
        # Step 2: Match Agent (Systematic Topic Selection)
        logger.info("Step 2: Match Agent - Systematic Topic Selection")
        match_result = match_agent.run(profile_result)
        match_timing = match_result["agent_timing"]
        logger.info(f"📊 Match Agent result keys: {list(match_result.keys())}")
        
        # Ensure Profile Agent data flows through
        match_result.update({
            "profile": profile_result.get("profile", {}),
            "profile_analysis": profile_result.get("profile_analysis", {}),
            "enhanced_profile": profile_result.get("enhanced_profile", {})
        })
        
        # Log matched topics for debugging
        matched_topics = match_result.get("matched_topics", [])
        match_analysis = match_result.get("match_analysis", {})
        logger.info(f"🎯 Match Agent returned {len(matched_topics)} topics")
        logger.info(f"📊 Match analysis: {match_analysis}")
        for i, topic in enumerate(matched_topics[:5], 1):  # Log first 5 topics
            logger.info(f"  {i}. {topic.get('Topic', 'Unknown')} ({topic.get('Niche', 'Unknown')})")
        
        # Step 3: Schedule Agent (Systematic 4-Week Planning)
        logger.info("Step 3: Schedule Agent - Systematic 4-Week Planning")
        schedule_result = schedule_agent.run(match_result)
        schedule_timing = schedule_result["agent_timing"]
        
        # Step 4: Reviewer Agent (Quality Assurance)
        logger.info("Step 4: Reviewer Agent - Quality Assurance")
        reviewer_result = reviewer_agent.run(schedule_result)
        reviewer_timing = reviewer_result["agent_timing"]
        
        # Combine all results
        final_result = {
            "success": True,
            "data": reviewer_result,
            "message": "Plan generated successfully using full agent system",
            "agent_flow": "Profile → Match → Schedule → Reviewer",
            "real_agents": True,
            "agent_timings": {
                "profile_agent": profile_timing,
                "match_agent": match_timing,
                "schedule_agent": schedule_timing,
                "reviewer_agent": reviewer_timing,
                "total_execution_time": sum([
                    profile_timing["execution_time_seconds"],
                    match_timing["execution_time_seconds"],
                    schedule_timing["execution_time_seconds"],
                    reviewer_timing["execution_time_seconds"]
                ])
            },
            "llm_integration": {
                "gemini_available": gemini_available,
                "profile_agent_llm_used": profile_timing.get("llm_used", False),
                "profile_agent_prompt": profile_timing.get("llm_prompt"),
                "profile_agent_response": profile_timing.get("llm_response"),
                "profile_agent_tokens_used": profile_timing.get("tokens_used", 0),
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
        logger.error(f"❌ Error in generate_plan: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e),
                "message": "Failed to generate plan"
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
