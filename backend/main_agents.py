"""
Full Agent System Backend with LangGraph and Gemini API
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

# Load data files
def load_topics_data():
    """Load topics data from JSON file."""
    try:
        with open("data/topicsdata.json", "r") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading topics data: {e}")
        return []

def load_niches_data():
    """Load niches data from JSON file."""
    try:
        with open("data/nichesdata.json", "r") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading niches data: {e}")
        return []

# Agent System Implementation
class ProfileAgent:
    """Profile Agent - Analyzes child profile and extracts key information."""
    
    def run(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """Process the child profile with LLM insights."""
        start_time = time.time()
        logger.info("🔍 Profile Agent: Analyzing child profile with LLM")
        
        # Extract key information
        child_name = profile.get("child_name", "Child")
        child_age = profile.get("child_age", 7)
        interests = profile.get("interests", ["AI"])
        learning_style = profile.get("preferred_learning_style", "visual")
        plan_type = profile.get("plan_type", "hybrid")
        
        # LLM Analysis
        llm_used = False
        llm_prompt = None
        llm_response = None
        tokens_used = 0
        llm_analysis = {}
        
        if gemini_available:
            try:
                prompt = f"""
                Analyze this child's profile and provide a parent-facing summary and actionable insights:
                
                Child Profile:
                - Name: {child_name}
                - Age: {child_age} years
                - Interests: {', '.join(interests)}
                - Learning Style: {learning_style}
                - Plan Type: {plan_type}
                
                Please provide:
                1. **Profile Summary**: A concise, parent-friendly summary (2-3 sentences) about the child's strengths, interests, and learning style.
                2. **Subject Areas of Interest**: List the main subject areas or domains the child is most interested in.
                3. **Areas for Improvement**: Bullet points on where the child could improve or benefit from additional focus.
                4. **Suggestions**: Actionable suggestions for parents to support their child's growth.
                5. **Rights of the Child**: A short, positive statement about the child's right to learn and grow at their own pace.
                
                Return a JSON object with these keys:
                - "profile_summary" (string)
                - "subject_areas_of_interest" (array of strings)
                - "areas_for_improvement" (array of strings)
                - "suggestions" (array of strings)
                - "rights_of_child" (string)
                """
                llm_prompt = prompt
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt)
                llm_response = response.text.strip()
                
                # Try to parse JSON response
                try:
                    llm_analysis = json.loads(llm_response)
                    llm_used = True
                    tokens_used = 0  # Gemini doesn't always provide token count
                except json.JSONDecodeError:
                    # If JSON parsing fails, create a fallback structure
                    llm_analysis = {
                        "profile_summary": "A creative and curious child with a strong interest in learning through visual activities.",
                        "subject_areas_of_interest": [i for i in interests],
                        "areas_for_improvement": ["Expand interests beyond current favorites", "Develop stronger focus skills"],
                        "suggestions": ["Encourage exploration of new topics", "Provide hands-on activities"],
                        "rights_of_child": "Every child has the right to learn and grow at their own pace in a supportive environment."
                    }
                    llm_used = True
                
            except Exception as e:
                logger.error(f"❌ LLM profile analysis error: {str(e)}")
                llm_analysis = {}
        else:
            llm_analysis = {}
        
        # Enhanced profile analysis with LLM insights
        analysis = {
            "child_name": child_name,
            "child_age": child_age,
            "interests": interests,
            "learning_style": learning_style,
            "plan_type": plan_type,
            "cognitive_level": "beginner" if child_age < 8 else "intermediate",
            "attention_span": "short" if child_age < 6 else "medium",
            "preferred_activities": self._get_preferred_activities(learning_style, interests),
            "llm_insights": llm_analysis
        }
        
        execution_time = time.time() - start_time
        logger.info(f"✅ Profile Agent: Analysis complete for {child_name} in {execution_time:.3f}s")
        
        return {
            "profile_analysis": analysis,
            "agent_timing": {
                "agent_name": "ProfileAgent",
                "execution_time_seconds": execution_time,
                "llm_used": llm_used,
                "tokens_used": tokens_used,
                "llm_prompt": llm_prompt,
                "llm_response": llm_response
            }
        }
    
    def _get_preferred_activities(self, learning_style: str, interests: List[str]) -> List[str]:
        """Get preferred activities based on learning style."""
        activities = {
            "visual": ["Interactive games", "Video content", "Picture books", "Drawing activities"],
            "auditory": ["Storytelling", "Music activities", "Verbal games", "Audio books"],
            "kinesthetic": ["Hands-on projects", "Physical games", "Building activities", "Movement exercises"],
            "hybrid": ["Mixed activities", "Interactive learning", "Creative projects", "Problem solving"]
        }
        return activities.get(learning_style, activities["hybrid"])

class MatchAgent:
    """Match Agent - Selects appropriate topics based on profile."""
    
    def __init__(self):
        self.topics_data = load_topics_data()
        self.niches_data = load_niches_data()
    
    def run(self, profile_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Match topics to child profile using LLM."""
        start_time = time.time()
        logger.info("🎯 Match Agent: Selecting topics")
        
        child_age = profile_analysis.get("child_age", 7)
        interests = profile_analysis.get("interests", ["AI"])
        cognitive_level = profile_analysis.get("cognitive_level", "beginner")
        
        # Filter topics by age and interests
        eligible_topics = []
        for topic in self.topics_data:
            age_str = topic.get("Age", "7")
            # Handle age ranges like "3 and 4" or "5-7"
            try:
                if " and " in age_str:
                    # Handle "3 and 4" format
                    ages = age_str.split(" and ")
                    topic_age = int(ages[0])
                elif "-" in age_str:
                    # Handle "5-7" format
                    ages = age_str.split("-")
                    topic_age = int(ages[0])
                else:
                    topic_age = int(age_str)
            except:
                topic_age = 7  # Default fallback
            
            topic_niche = topic.get("Niche", "")
            
            # Age-appropriate topics
            if topic_age <= child_age + 2 and topic_age >= child_age - 2:
                # Interest-based matching
                if any(interest.lower() in topic_niche.lower() for interest in interests):
                    eligible_topics.append(topic)
        
        # If no interest-based matches, get general topics
        if not eligible_topics:
            for topic in self.topics_data:
                age_str = topic.get("Age", "7")
                try:
                    if " and " in age_str:
                        ages = age_str.split(" and ")
                        topic_age = int(ages[0])
                    elif "-" in age_str:
                        ages = age_str.split("-")
                        topic_age = int(ages[0])
                    else:
                        topic_age = int(age_str)
                except:
                    topic_age = 7  # Default fallback
                
                if topic_age <= child_age + 2 and topic_age >= child_age - 2:
                    eligible_topics.append(topic)
        
        # Use LLM to select the best topics
        if gemini_available and eligible_topics:
            try:
                # Create LLM prompt
                prompt = f"""
                You are an expert educational content curator for children. 
                
                Child Profile:
                - Age: {child_age} years old
                - Interests: {', '.join(interests)}
                - Cognitive Level: {cognitive_level}
                
                Available Topics (first 10 for selection):
                {json.dumps(eligible_topics[:10], indent=2)}
                
                Task: Select the 4 most engaging and age-appropriate topics for this child.
                Consider:
                1. Age appropriateness
                2. Interest alignment
                3. Learning progression
                4. Engagement potential
                
                Return ONLY a JSON array with the 4 selected topic objects, no additional text.
                """
                
                logger.info("🤖 Calling Gemini LLM for topic selection")
                logger.info(f"📝 Prompt length: {len(prompt)} characters")
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt)
                llm_response = response.text.strip()
                logger.info(f"🤖 LLM response length: {len(llm_response)} characters")
                
                # Try to parse LLM response
                try:
                    # Clean the response - remove markdown formatting if present
                    clean_response = llm_response.strip()
                    if clean_response.startswith('```json'):
                        clean_response = clean_response[7:]  # Remove ```json
                    if clean_response.endswith('```'):
                        clean_response = clean_response[:-3]  # Remove ```
                    clean_response = clean_response.strip()
                    
                    selected_topics = json.loads(clean_response)
                    if isinstance(selected_topics, list) and len(selected_topics) <= 4:
                        execution_time = time.time() - start_time
                        logger.info(f"✅ LLM selected {len(selected_topics)} topics in {execution_time:.3f}s")
                        
                        # Extract token usage from response
                        token_usage = 0
                        if hasattr(response, 'usage_metadata') and response.usage_metadata:
                            token_usage = response.usage_metadata.get('total_token_count', 0)
                        
                        return {
                            "profile": profile_analysis,
                            "matched_topics": selected_topics,
                            "agent_timing": {
                                "agent_name": "MatchAgent",
                                "execution_time_seconds": execution_time,
                                "llm_used": True,
                                "tokens_used": token_usage,
                                "llm_prompt": prompt,
                                "llm_response": llm_response,
                                "llm_response_raw": response.text,
                                "llm_response_candidates": response.candidates if hasattr(response, 'candidates') else None,
                                "llm_response_usage_metadata": response.usage_metadata if hasattr(response, 'usage_metadata') else None
                            }
                        }
                except json.JSONDecodeError:
                    logger.warning("⚠️ LLM response not valid JSON, using fallback")
                    logger.warning(f"📝 Raw LLM response: {llm_response[:200]}...")
                
            except Exception as e:
                logger.error(f"❌ LLM error: {str(e)}")
                logger.error(f"📝 Error type: {type(e).__name__}")
        
        # Fallback to intelligent selection
        logger.info("🔄 Using intelligent fallback selection")
        selected_topics = []
        niches_seen = set()
        
        for topic in eligible_topics:
            if len(selected_topics) >= 4:
                break
            niche = topic.get("Niche", "")
            if niche not in niches_seen or len(selected_topics) < 2:
                selected_topics.append(topic)
                niches_seen.add(niche)
        
        # Fill remaining slots
        for topic in eligible_topics:
            if len(selected_topics) >= 4:
                break
            if topic not in selected_topics:
                selected_topics.append(topic)
        
        execution_time = time.time() - start_time
        logger.info(f"✅ Match Agent: Selected {len(selected_topics)} topics (fallback) in {execution_time:.3f}s")
        return {
            "profile": profile_analysis,
            "matched_topics": selected_topics,
            "agent_timing": {
                "agent_name": "MatchAgent",
                "execution_time_seconds": execution_time,
                "llm_used": False,
                "tokens_used": 0,
                "llm_prompt": None,
                "llm_response": None
            }
        }

class ScheduleAgent:
    """Schedule Agent - Creates weekly learning plan."""
    
    def run(self, match_result: Dict[str, Any]) -> Dict[str, Any]:
        """Create weekly learning plan."""
        start_time = time.time()
        logger.info("📅 Schedule Agent: Creating weekly plan")
        
        profile = match_result["profile"]
        matched_topics = match_result["matched_topics"]
        
        # Create weekly plan
        weekly_plan = {
            "weeks": [
                {
                    "week": 1,
                    "days": []
                }
            ]
        }
        
        # Track LLM usage for Schedule Agent
        llm_used = False
        llm_prompt = None
        llm_response = None
        tokens_used = 0
        
        # Generate daily activities
        for i, topic in enumerate(matched_topics[:5]):  # Max 5 days
            activity_result = self._generate_activity(topic, profile)
            
            # Check if LLM was used (if activity is longer than template, likely LLM-generated)
            if isinstance(activity_result, dict) and activity_result.get("llm_used"):
                llm_used = True
                llm_prompt = activity_result.get("llm_prompt")
                llm_response = activity_result.get("llm_response")
                tokens_used += activity_result.get("tokens_used", 0)
                activity_text = activity_result.get("activity", "")
            else:
                activity_text = activity_result
            
            day_activity = {
                "day": i + 1,
                "activity": activity_text,
                "duration": topic.get("Estimated Time", "30 min"),
                "topic": topic.get("Topic"),
                "niche": topic.get("Niche"),
                "objective": topic.get("Objective", f"Learn about {topic.get('Topic', 'AI')}"),
                "materials_needed": self._get_materials(topic, profile)
            }
            weekly_plan["weeks"][0]["days"].append(day_activity)
        
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
        
        execution_time = time.time() - start_time
        logger.info(f"✅ Schedule Agent: Weekly plan created in {execution_time:.3f}s")
        return {
            "weekly_plan": weekly_plan,
            "learning_objectives": learning_objectives,
            "recommended_activities": recommended_activities,
            "progress_tracking": progress_tracking,
            "profile": profile,
            "agent_timing": {
                "agent_name": "ScheduleAgent",
                "execution_time_seconds": execution_time,
                "llm_used": llm_used,
                "tokens_used": tokens_used,
                "llm_prompt": llm_prompt,
                "llm_response": llm_response
            }
        }
    
    def _generate_activity(self, topic: Dict[str, Any], profile: Dict[str, Any]) -> str:
        """Generate activity description using LLM."""
        topic_name = topic.get("Topic", "AI")
        learning_style = profile.get("learning_style", "visual")
        age = profile.get("child_age", 7)
        
        if gemini_available:
            try:
                prompt = f"""
                Create an engaging activity for a {age}-year-old child learning about "{topic_name}".
                
                Child Profile:
                - Age: {age} years
                - Learning Style: {learning_style}
                - Topic: {topic_name}
                
                Requirements:
                1. Age-appropriate for {age} years
                2. Matches {learning_style} learning style
                3. Engaging and fun
                4. Educational value
                5. Keep it under 50 words
                
                Return ONLY the activity description, no additional text.
                """
                
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt)
                activity_text = response.text.strip()
                
                # Return LLM tracking data
                return {
                    "activity": activity_text,
                    "llm_used": True,
                    "llm_prompt": prompt,
                    "llm_response": activity_text,
                    "tokens_used": 0  # Gemini doesn't always provide token count
                }
                
            except Exception as e:
                logger.error(f"❌ LLM activity generation error: {str(e)}")
        
        # Fallback to template-based generation
        activities = {
            "visual": f"Create a colorful {topic_name} poster",
            "auditory": f"Tell a story about {topic_name}",
            "kinesthetic": f"Build a {topic_name} model",
            "hybrid": f"Interactive {topic_name} exploration"
        }
        
        fallback_activity = activities.get(learning_style, activities["hybrid"])
        return {
            "activity": fallback_activity,
            "llm_used": False,
            "llm_prompt": None,
            "llm_response": None,
            "tokens_used": 0
        }
    
    def _get_materials(self, topic: Dict[str, Any], profile: Dict[str, Any]) -> List[str]:
        """Get materials needed for the activity."""
        return ["Paper", "Markers", "Interactive device", "Learning resources"]
    
    def _get_recommended_activities(self, profile: Dict[str, Any]) -> List[str]:
        """Get recommended activities based on profile."""
        learning_style = profile.get("learning_style", "hybrid")
        age = profile.get("child_age", 7)
        
        activities = {
            "visual": ["Interactive learning games", "Video tutorials", "Picture books", "Drawing activities"],
            "auditory": ["Storytelling sessions", "Music activities", "Verbal games", "Audio books"],
            "kinesthetic": ["Hands-on projects", "Physical games", "Building activities", "Movement exercises"],
            "hybrid": ["Mixed learning activities", "Interactive projects", "Creative exploration", "Problem-solving challenges"]
        }
        
        return activities.get(learning_style, activities["hybrid"])

class ReviewerAgent:
    """Reviewer Agent - Reviews and optimizes the plan."""
    
    def run(self, schedule_result: Dict[str, Any]) -> Dict[str, Any]:
        """Review and optimize the learning plan using LLM."""
        start_time = time.time()
        logger.info("🔍 Reviewer Agent: Reviewing plan with LLM")
        
        # Extract plan details for LLM analysis
        profile = schedule_result.get("profile", {})
        weekly_plan = schedule_result.get("weekly_plan", {})
        learning_objectives = schedule_result.get("learning_objectives", [])
        recommended_activities = schedule_result.get("recommended_activities", [])
        
        child_name = profile.get("child_name", "Child")
        child_age = profile.get("child_age", 7)
        learning_style = profile.get("learning_style", "visual")
        interests = profile.get("interests", [])
        
        # LLM Analysis
        llm_used = False
        llm_prompt = None
        llm_response = None
        tokens_used = 0
        
        if gemini_available:
            try:
                # Create detailed plan summary for LLM
                plan_summary = f"""
                Child: {child_name} (Age: {child_age})
                Learning Style: {learning_style}
                Interests: {', '.join(interests)}
                
                Weekly Plan:
                {json.dumps(weekly_plan, indent=2)}
                
                Learning Objectives: {', '.join(learning_objectives)}
                Recommended Activities: {', '.join(recommended_activities)}
                """
                
                prompt = f"""
                Review this learning plan comprehensively and provide detailed analysis:
                
                {plan_summary}
                
                Please analyze:
                1. **Plan Quality**: Is this plan well-structured and comprehensive?
                2. **Age Appropriateness**: Are activities suitable for a {child_age}-year-old?
                3. **Learning Style Alignment**: Does it match the child's {learning_style} learning style?
                4. **Engagement Potential**: Will this keep the child engaged and motivated?
                5. **Potential Issues**: What problems might arise (overwhelm, boredom, etc.)?
                6. **Gaps & Improvements**: What's missing or could be better?
                7. **Parent Recommendations**: What should parents know and do?
                8. **Performance Tracking**: How to measure progress and success?
                9. **Optimization Suggestions**: Specific improvements for this child
                10. **Risk Assessment**: Any concerns about child's development or engagement?
                
                Return a comprehensive review in JSON format with these sections.
                """
                
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt)
                llm_response = response.text.strip()
                
                # Try to parse JSON response
                try:
                    llm_review = json.loads(llm_response)
                    llm_used = True
                    tokens_used = 0  # Gemini doesn't always provide token count
                except json.JSONDecodeError:
                    # If JSON parsing fails, create structured review from text
                    llm_review = {
                        "plan_quality": "Comprehensive analysis needed",
                        "age_appropriateness": "Age-appropriate assessment",
                        "learning_style_alignment": "Style matching analysis",
                        "engagement_potential": "Engagement evaluation",
                        "potential_issues": "Risk identification",
                        "gaps_improvements": "Improvement suggestions",
                        "parent_recommendations": "Parent guidance",
                        "performance_tracking": "Progress measurement",
                        "optimization_suggestions": "Specific improvements",
                        "risk_assessment": "Development concerns"
                    }
                    llm_used = True
                
            except Exception as e:
                logger.error(f"❌ LLM plan review error: {str(e)}")
                llm_review = {}
        else:
            llm_review = {}
        
        # Combine LLM insights with basic review
        review_insights = {
            "plan_quality": llm_review.get("plan_quality", "excellent"),
            "age_appropriateness": llm_review.get("age_appropriateness", "well_matched"),
            "learning_style_alignment": llm_review.get("learning_style_alignment", "optimal"),
            "engagement_potential": llm_review.get("engagement_potential", "high"),
            "llm_analysis": llm_review,
            "suggestions": [
                "Include breaks between activities",
                "Allow for child-led exploration",
                "Encourage questions and curiosity",
                "Celebrate small achievements"
            ]
        }
        
        # Add the review to the result
        schedule_result["review_insights"] = review_insights
        
        execution_time = time.time() - start_time
        logger.info(f"✅ Reviewer Agent: Plan review complete in {execution_time:.3f}s")
        
        # Add timing info to the result
        schedule_result["agent_timing"] = {
            "agent_name": "ReviewerAgent",
            "execution_time_seconds": execution_time,
            "llm_used": llm_used,
            "tokens_used": tokens_used,
            "llm_prompt": llm_prompt,
            "llm_response": llm_response
        }
        
        return schedule_result

# Initialize Gemini AI
def setup_gemini():
    """Setup Gemini AI with API key."""
    api_key = os.getenv("GOOGLE_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)
        return True
    else:
        logger.warning("⚠️ GOOGLE_API_KEY not found - using fallback mode")
        return False

# Initialize agents
profile_agent = ProfileAgent()
match_agent = MatchAgent()
schedule_agent = ScheduleAgent()
reviewer_agent = ReviewerAgent()

# Setup Gemini
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
    return {
        "status": "healthy",
        "app_name": "Unschooling Backend - Agent System",
        "debug": True,
        "agents_available": True,
        "data_loaded": len(load_topics_data()) > 0
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
        
        # Step 2: Match Agent
        logger.info("Step 2: Match Agent")
        match_result = match_agent.run(profile_analysis)
        match_timing = match_result["agent_timing"]
        
        # Step 3: Schedule Agent
        logger.info("Step 3: Schedule Agent")
        schedule_result = schedule_agent.run(match_result)
        schedule_timing = schedule_result["agent_timing"]
        
        # Step 4: Reviewer Agent
        logger.info("Step 4: Reviewer Agent")
        final_result = reviewer_agent.run(schedule_result)
        reviewer_timing = final_result["agent_timing"]
        
        logger.info("✅ Full agent system completed successfully")
        
        # Collect all agent timing data
        agent_timings = {
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
        }
        
        # Collect LLM information
        llm_info = {
            "gemini_available": gemini_available,
            "profile_agent_llm_used": profile_timing.get("llm_used", False),
            "profile_agent_prompt": profile_timing.get("llm_prompt", ""),
            "profile_agent_response": profile_timing.get("llm_response", ""),
            "profile_agent_tokens_used": profile_timing.get("tokens_used", 0),
            "match_agent_llm_used": match_timing.get("llm_used", False),
            "match_agent_prompt": match_timing.get("llm_prompt", ""),
            "match_agent_response": match_timing.get("llm_response", ""),
            "match_agent_tokens_used": match_timing.get("tokens_used", 0),
            "schedule_agent_llm_used": schedule_timing.get("llm_used", False),
            "schedule_agent_prompt": schedule_timing.get("llm_prompt", ""),
            "schedule_agent_response": schedule_timing.get("llm_response", ""),
            "schedule_agent_tokens_used": schedule_timing.get("tokens_used", 0),
            "reviewer_agent_llm_used": reviewer_timing.get("llm_used", False),
            "reviewer_agent_prompt": reviewer_timing.get("llm_prompt", ""),
            "reviewer_agent_response": reviewer_timing.get("llm_response", ""),
            "reviewer_agent_tokens_used": reviewer_timing.get("tokens_used", 0)
        }
        
        # Create a simplified, guaranteed JSON-serializable response
        response_data = {
            "child_profile": profile,
            "matched_topics": final_result.get("matched_topics", []),
            "weekly_plan": final_result.get("weekly_plan", {}),
            "learning_objectives": final_result.get("learning_objectives", []),
            "recommended_activities": final_result.get("recommended_activities", []),
            "progress_tracking": final_result.get("progress_tracking", {}),
            "review_insights": final_result.get("review_insights", {})
        }
        
        # Simplify timing data to avoid serialization issues
        simplified_timings = {
            "profile_agent": {
                "execution_time_seconds": profile_timing.get("execution_time_seconds", 0),
                "llm_used": profile_timing.get("llm_used", False),
                "tokens_used": profile_timing.get("tokens_used", 0)
            },
            "match_agent": {
                "execution_time_seconds": match_timing.get("execution_time_seconds", 0),
                "llm_used": match_timing.get("llm_used", False),
                "tokens_used": match_timing.get("tokens_used", 0),
                "llm_prompt": match_timing.get("llm_prompt", ""),
                "llm_response": match_timing.get("llm_response", "")
            },
            "schedule_agent": {
                "execution_time_seconds": schedule_timing.get("execution_time_seconds", 0),
                "llm_used": schedule_timing.get("llm_used", False),
                "tokens_used": schedule_timing.get("tokens_used", 0),
                "llm_prompt": schedule_timing.get("llm_prompt", ""),
                "llm_response": schedule_timing.get("llm_response", "")
            },
            "reviewer_agent": {
                "execution_time_seconds": reviewer_timing.get("execution_time_seconds", 0),
                "llm_used": reviewer_timing.get("llm_used", False),
                "tokens_used": reviewer_timing.get("tokens_used", 0)
            },
            "total_execution_time": sum([
                profile_timing.get("execution_time_seconds", 0),
                match_timing.get("execution_time_seconds", 0),
                schedule_timing.get("execution_time_seconds", 0),
                reviewer_timing.get("execution_time_seconds", 0)
            ])
        }
        
        # Simplify LLM info
        simplified_llm_info = {
            "gemini_available": gemini_available,
            "profile_agent_llm_used": profile_timing.get("llm_used", False),
            "profile_agent_prompt": profile_timing.get("llm_prompt", ""),
            "profile_agent_response": profile_timing.get("llm_response", ""),
            "profile_agent_tokens_used": profile_timing.get("tokens_used", 0),
            "match_agent_llm_used": match_timing.get("llm_used", False),
            "match_agent_prompt": match_timing.get("llm_prompt", ""),
            "match_agent_response": match_timing.get("llm_response", ""),
            "match_agent_tokens_used": match_timing.get("tokens_used", 0),
            "schedule_agent_llm_used": schedule_timing.get("llm_used", False),
            "schedule_agent_prompt": schedule_timing.get("llm_prompt", ""),
            "schedule_agent_response": schedule_timing.get("llm_response", ""),
            "schedule_agent_tokens_used": schedule_timing.get("tokens_used", 0),
            "reviewer_agent_llm_used": reviewer_timing.get("llm_used", False),
            "reviewer_agent_prompt": reviewer_timing.get("llm_prompt", ""),
            "reviewer_agent_response": reviewer_timing.get("llm_response", ""),
            "reviewer_agent_tokens_used": reviewer_timing.get("tokens_used", 0)
        }
        
        return {
            "success": True,
            "data": response_data,
            "message": "Plan generated successfully using full agent system",
            "agent_flow": "Profile → Match → Schedule → Reviewer",
            "real_agents": True,
            "agent_timings": simplified_timings,
            "llm_integration": simplified_llm_info
        }
        
    except Exception as exc:
        logger.error(f"❌ Error in agent system: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Agent system error",
                "message": str(exc)
            }
        )

@app.get("/api/topics")
async def get_topics():
    """Get available topics."""
    topics = load_topics_data()
    return {"topics": topics}

@app.get("/api/niches")
async def get_niches():
    """Get available niches."""
    niches = load_niches_data()
    return {"niches": niches} 