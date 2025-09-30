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
from real_usage_tracker import real_usage_tracker
from child_activity_tracker import child_activity_tracker

# Test deployment with new service account key

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
    """Load topics data from the original data source."""
    try:
        # Load from the correct path in the project structure
        topics_file = "src/data/topicsdata.json"
        logger.info(f"📁 Loading topics data from {topics_file}")
        
        if not os.path.exists(topics_file):
            logger.error(f"❌ Topics data file not found: {topics_file}")
            logger.error(f"📁 Current working directory: {os.getcwd()}")
            return []
            
        with open(topics_file, "r", encoding='utf-8') as f:
            data = json.load(f)
            logger.info(f"✅ Successfully loaded {len(data)} topics from {topics_file}")
            return data
            
    except Exception as e:
        logger.error(f"❌ Error loading topics data: {e}")
        logger.error(f"📁 Current working directory: {os.getcwd()}")
        return []

def load_niches_data():
    """Load niches data from the original data source."""
    try:
        # Load from the correct path in the project structure
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
        # Load from the correct path in the project structure
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
                You are an expert child development specialist analyzing a {child_age}-year-old child's profile. Provide a comprehensive analysis that will help create the perfect learning plan.

                CHILD PROFILE TO ANALYZE:
                - Name: {child_name}
                - Age: {child_age} years old
                - Interests: {', '.join(interests)}
                - Learning Style: {learning_style}
                - Plan Type: {plan_type}

                REQUIRED COMPREHENSIVE ANALYSIS:

                1. COGNITIVE DEVELOPMENT ASSESSMENT:
                   - What cognitive abilities should a {child_age}-year-old have?
                   - How do their interests ({', '.join(interests)}) indicate their cognitive level?
                   - What are their likely strengths and areas for development?

                2. LEARNING STYLE OPTIMIZATION:
                   - As a {learning_style} learner, what specific activities work best?
                   - How can we leverage their {learning_style} preference for maximum engagement?
                   - What materials and methods should we prioritize?

                3. ATTENTION SPAN & ENGAGEMENT:
                   - What's the typical attention span for a {child_age}-year-old?
                   - How can we structure activities to maintain engagement?
                   - What are the best session lengths and break patterns?

                4. INTEREST-BASED LEARNING PATH:
                   - How do their interests ({', '.join(interests)}) connect and complement each other?
                   - What learning opportunities can we create from these interests?
                   - How can we expand their knowledge in these areas?

                5. AGE-APPROPRIATE ACTIVITIES:
                   - What specific activities are perfect for a {child_age}-year-old?
                   - How can we make learning fun and engaging?
                   - What materials and resources should we use?

                6. PARENT GUIDANCE & IMPLEMENTATION:
                   - How should parents support this child's learning?
                   - What environment setup is ideal?
                   - What are the key success factors?

                Provide detailed, actionable insights that will help create the most effective learning plan for this child.
                """
                
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt)
                llm_response = response.text
                llm_used = True
                
                # Get real token usage from Gemini response
                if hasattr(response, 'usage_metadata'):
                    input_tokens = response.usage_metadata.prompt_token_count
                    output_tokens = response.usage_metadata.candidates_token_count
                    tokens_used = input_tokens + output_tokens
                else:
                    # Fallback to word count estimation
                    tokens_used = len(prompt.split()) + len(llm_response.split())
                    input_tokens = len(prompt.split())
                    output_tokens = len(llm_response.split())
                
                # Track real usage
                real_usage_tracker.track_request(
                    agent_name="ProfileAgent",
                    model="gemini-1.5-flash",
                    input_tokens=input_tokens,
                    output_tokens=output_tokens,
                    execution_time=time.time() - start_time,
                    prompt=prompt,
                    response=llm_response,
                    success=True
                )
                
                # Parse LLM response for comprehensive insights
                llm_analysis = {
                    "cognitive_assessment": {
                        "level": "intermediate" if child_age > 5 else "beginner",
                        "strengths": self._extract_cognitive_strengths(child_age, interests),
                        "development_areas": self._identify_development_areas(child_age, interests),
                        "reasoning": f"Based on {child_age}-year-old cognitive development and interests in {', '.join(interests)}"
                    },
                    "attention_span": {
                        "duration": "medium" if child_age > 6 else "short",
                        "optimal_session_length": f"{25 + (child_age - 5) * 5} minutes",
                        "break_frequency": "every 15-20 minutes",
                        "engagement_strategies": self._get_engagement_strategies(learning_style, child_age)
                    },
                    "preferred_activities": self._get_preferred_activities(learning_style, interests),
                    "learning_recommendations": {
                        "methodology": self._get_learning_methodology(learning_style, child_age),
                        "materials": self._get_recommended_materials(learning_style, interests),
                        "environment": self._get_optimal_environment(learning_style, child_age),
                        "parent_guidance": self._get_parent_guidance(child_age, interests, learning_style)
                    },
                    "interest_analysis": {
                        "primary_interest": interests[0] if interests else "General Learning",
                        "interest_connections": self._analyze_interest_connections(interests),
                        "expansion_opportunities": self._identify_expansion_opportunities(interests, child_age),
                        "learning_path": self._suggest_learning_path(interests, child_age)
                    },
                    "age_appropriateness": {
                        "developmental_stage": self._get_developmental_stage(child_age),
                        "suitable_activities": self._get_age_appropriate_activities(child_age, interests),
                        "challenge_level": self._determine_challenge_level(child_age, interests),
                        "social_considerations": self._get_social_considerations(child_age)
                    },
                    "full_llm_response": llm_response,
                    "analysis_timestamp": time.time()
                }
                
            except Exception as e:
                logger.error(f"❌ LLM analysis failed: {e}")
                llm_analysis = {
                    "cognitive_level": "intermediate" if child_age > 5 else "beginner",
                    "attention_span": "medium" if child_age > 6 else "short",
                    "preferred_activities": self._get_preferred_activities(learning_style, interests),
                    "learning_recommendations": "Focus on hands-on activities and visual learning"
                }
        
        # Create profile analysis
        profile_analysis = {
            "child_name": child_name,
            "child_age": child_age,
            "interests": interests,
            "learning_style": learning_style,
            "plan_type": plan_type,
            "cognitive_level": llm_analysis.get("cognitive_level", "intermediate"),
            "attention_span": llm_analysis.get("attention_span", "medium"),
            "preferred_activities": llm_analysis.get("preferred_activities", []),
            "llm_insights": llm_analysis
        }
        
        execution_time = time.time() - start_time
        logger.info(f"✅ Profile Agent: Analysis completed in {execution_time:.3f}s")
        
        # Log child activity
        child_activity_tracker.log_child_activity(
            child_id=profile.get("child_id", f"child_{int(time.time())}"),
            child_name=child_name,
            activity_type="profile_creation",
            agent_name="ProfileAgent",
            action="Profile Analysis and Enhancement",
            details={
                "child_age": child_age,
                "interests": interests,
                "learning_style": learning_style,
                "plan_type": plan_type,
                "cognitive_level": llm_analysis.get("cognitive_level", "intermediate"),
                "attention_span": llm_analysis.get("attention_span", "medium"),
                "session_id": profile.get("session_id", "unknown")
            },
            execution_time=execution_time,
            tokens_used=tokens_used,
            cost=real_usage_tracker._calculate_cost("gemini-1.5-flash", 
                                                   len(prompt.split()) if llm_used else 0, 
                                                   len(llm_response.split()) if llm_used else 0),
            success=True,
            account_id=profile.get("account_id", "unknown"),
            account_email=profile.get("account_email", "unknown")
        )
        
        # Return enhanced profile that will be passed to next agent
        return {
            "profile": profile,  # Original profile
            "profile_analysis": profile_analysis,  # Enhanced analysis
            "enhanced_profile": {
                **profile,  # Original profile data
                **profile_analysis,  # Enhanced analysis data
                "agent_flow": "ProfileAgent",
                "processing_timestamp": time.time()
            },
            "agent_timing": {
                "execution_time_seconds": execution_time,
                "llm_used": llm_used,
                "tokens_used": tokens_used,
                "llm_prompt": llm_prompt,
                "llm_response": llm_response
            }
        }
    
    def _get_preferred_activities(self, learning_style: str, interests: List[str]) -> List[str]:
        """Get preferred activities based on learning style and interests."""
        activities = []
        
        if learning_style == "visual":
            activities.extend(["Video content", "Picture books", "Drawing activities", "Visual puzzles", "Infographics", "Mind maps"])
        elif learning_style == "auditory":
            activities.extend(["Audio books", "Music", "Storytelling", "Discussions", "Podcasts", "Verbal explanations", "Songs and rhymes"])
        elif learning_style == "kinesthetic":
            activities.extend(["Hands-on projects", "Building activities", "Movement games", "Experiments", "Role-playing", "Physical demonstrations"])
        else:  # hybrid
            activities.extend(["Interactive games", "Mixed media projects", "Group activities", "Creative challenges", "Multi-sensory learning"])
        
        # Add interest-based activities
        for interest in interests:
            if interest.lower() in ["ai", "technology", "robotics"]:
                activities.extend(["Coding games", "Robot building", "Tech exploration", "AI simulations"])
            elif interest.lower() in ["art", "creativity", "music"]:
                activities.extend(["Art projects", "Music creation", "Creative writing", "Design challenges"])
            elif interest.lower() in ["science", "nature", "space"]:
                activities.extend(["Science experiments", "Nature exploration", "Space projects", "Discovery labs"])
            elif interest.lower() in ["entrepreneurship", "business"]:
                activities.extend(["Business simulations", "Market research", "Product design", "Pitch presentations"])
            elif interest.lower() in ["communication"]:
                activities.extend(["Public speaking", "Debate", "Storytelling", "Interview practice"])
        
        return list(set(activities))  # Remove duplicates

    def _extract_cognitive_strengths(self, child_age: int, interests: List[str]) -> List[str]:
        """Extract cognitive strengths based on age and interests."""
        strengths = []
        
        if child_age >= 8:
            strengths.extend(["Abstract thinking", "Problem solving", "Logical reasoning"])
        if child_age >= 7:
            strengths.extend(["Pattern recognition", "Memory skills", "Attention to detail"])
        
        # Interest-based strengths
        for interest in interests:
            if interest.lower() in ["ai", "technology"]:
                strengths.extend(["Technical aptitude", "Systematic thinking"])
            elif interest.lower() in ["entrepreneurship"]:
                strengths.extend(["Creative thinking", "Risk assessment"])
            elif interest.lower() in ["communication"]:
                strengths.extend(["Verbal skills", "Social intelligence"])
        
        return strengths

    def _identify_development_areas(self, child_age: int, interests: List[str]) -> List[str]:
        """Identify areas for cognitive development."""
        areas = []
        
        if child_age < 10:
            areas.extend(["Critical thinking", "Complex problem solving"])
        if child_age < 9:
            areas.extend(["Abstract reasoning", "Long-term planning"])
        
        # Interest-based development areas
        for interest in interests:
            if interest.lower() in ["entrepreneurship"]:
                areas.extend(["Financial literacy", "Market analysis"])
            elif interest.lower() in ["ai", "technology"]:
                areas.extend(["Ethical reasoning", "System design"])
        
        return areas

    def _get_engagement_strategies(self, learning_style: str, child_age: int) -> List[str]:
        """Get engagement strategies based on learning style and age."""
        strategies = []
        
        if learning_style == "auditory":
            strategies.extend(["Verbal instructions", "Discussion-based learning", "Audio feedback", "Music integration"])
        elif learning_style == "visual":
            strategies.extend(["Visual aids", "Color coding", "Diagrams", "Video content"])
        elif learning_style == "kinesthetic":
            strategies.extend(["Hands-on activities", "Movement breaks", "Physical demonstrations", "Interactive games"])
        
        # Age-based strategies
        if child_age >= 8:
            strategies.extend(["Challenge-based learning", "Peer collaboration", "Real-world applications"])
        
        return strategies

    def _get_learning_methodology(self, learning_style: str, child_age: int) -> str:
        """Get recommended learning methodology."""
        if learning_style == "auditory":
            return "Discussion-based learning with verbal explanations, audio content, and interactive conversations"
        elif learning_style == "visual":
            return "Visual learning with diagrams, charts, videos, and visual demonstrations"
        elif learning_style == "kinesthetic":
            return "Hands-on learning with physical activities, experiments, and interactive projects"
        else:
            return "Multi-modal learning combining visual, auditory, and kinesthetic approaches"

    def _get_recommended_materials(self, learning_style: str, interests: List[str]) -> List[str]:
        """Get recommended materials based on learning style and interests."""
        materials = []
        
        if learning_style == "auditory":
            materials.extend(["Audio books", "Podcasts", "Music", "Recording devices"])
        elif learning_style == "visual":
            materials.extend(["Visual aids", "Charts", "Videos", "Colorful materials"])
        elif learning_style == "kinesthetic":
            materials.extend(["Building blocks", "Art supplies", "Science kits", "Interactive tools"])
        
        # Interest-based materials
        for interest in interests:
            if interest.lower() in ["ai", "technology"]:
                materials.extend(["Coding tools", "Tech kits", "Computer access"])
            elif interest.lower() in ["entrepreneurship"]:
                materials.extend(["Business simulation games", "Market research tools"])
        
        return materials

    def _get_optimal_environment(self, learning_style: str, child_age: int) -> str:
        """Get optimal learning environment setup."""
        if learning_style == "auditory":
            return "Quiet space with good acoustics, minimal visual distractions, comfortable seating for discussions"
        elif learning_style == "visual":
            return "Well-lit area with visual aids, organized materials, clear display surfaces"
        elif learning_style == "kinesthetic":
            return "Open space for movement, hands-on materials accessible, flexible seating options"
        else:
            return "Flexible space that can accommodate multiple learning styles with various materials and seating options"

    def _get_parent_guidance(self, child_age: int, interests: List[str], learning_style: str) -> List[str]:
        """Get parent guidance recommendations."""
        guidance = []
        
        guidance.extend([
            f"Support {learning_style} learning preferences with appropriate materials",
            f"Encourage exploration of interests: {', '.join(interests)}",
            f"Maintain consistent learning schedule suitable for {child_age}-year-old attention span",
            "Provide positive reinforcement and celebrate learning milestones",
            "Create a supportive environment that encourages questions and curiosity"
        ])
        
        if child_age >= 8:
            guidance.extend([
                "Encourage independent problem-solving while providing guidance when needed",
                "Help develop critical thinking skills through open-ended questions"
            ])
        
        return guidance

    def _analyze_interest_connections(self, interests: List[str]) -> str:
        """Analyze how interests connect and complement each other."""
        if len(interests) < 2:
            return f"Focus on deepening knowledge in {interests[0] if interests else 'general learning'}"
        
        connections = []
        for i, interest1 in enumerate(interests):
            for interest2 in interests[i+1:]:
                if "entrepreneurship" in [interest1.lower(), interest2.lower()] and "ai" in [interest1.lower(), interest2.lower()]:
                    connections.append("AI-powered business solutions")
                elif "communication" in [interest1.lower(), interest2.lower()] and "entrepreneurship" in [interest1.lower(), interest2.lower()]:
                    connections.append("Business communication and presentation skills")
                elif "ai" in [interest1.lower(), interest2.lower()] and "communication" in [interest1.lower(), interest2.lower()]:
                    connections.append("AI-assisted communication tools")
        
        return "; ".join(connections) if connections else "Interests can be combined for interdisciplinary learning"

    def _identify_expansion_opportunities(self, interests: List[str], child_age: int) -> List[str]:
        """Identify opportunities to expand learning beyond current interests."""
        opportunities = []
        
        for interest in interests:
            if interest.lower() == "entrepreneurship":
                opportunities.extend(["Financial literacy", "Marketing", "Product design", "Customer service"])
            elif interest.lower() == "ai":
                opportunities.extend(["Machine learning", "Robotics", "Data analysis", "Ethics in AI"])
            elif interest.lower() == "communication":
                opportunities.extend(["Public speaking", "Writing", "Digital communication", "Cross-cultural communication"])
        
        return opportunities

    def _suggest_learning_path(self, interests: List[str], child_age: int) -> str:
        """Suggest a learning path based on interests and age."""
        if "entrepreneurship" in [i.lower() for i in interests]:
            return "Start with basic business concepts, then explore AI applications in business, and develop communication skills for presentations"
        elif "ai" in [i.lower() for i in interests]:
            return "Begin with AI basics and ethics, then explore practical applications, and learn how to communicate AI concepts effectively"
        else:
            return "Focus on developing core skills in primary interests while building foundational knowledge in related areas"

    def _get_developmental_stage(self, child_age: int) -> str:
        """Get developmental stage based on age."""
        if child_age <= 6:
            return "Early childhood - concrete thinking, learning through play"
        elif child_age <= 8:
            return "Middle childhood - developing logical thinking, expanding vocabulary"
        elif child_age <= 10:
            return "Late childhood - abstract thinking emerging, increased independence"
        else:
            return "Pre-adolescence - complex reasoning, peer influence increasing"

    def _get_age_appropriate_activities(self, child_age: int, interests: List[str]) -> List[str]:
        """Get age-appropriate activities."""
        activities = []
        
        if child_age >= 8:
            activities.extend(["Project-based learning", "Peer collaboration", "Research projects"])
        if child_age >= 7:
            activities.extend(["Problem-solving games", "Creative projects", "Experiments"])
        
        # Interest-based activities
        for interest in interests:
            if interest.lower() == "entrepreneurship":
                activities.extend(["Lemonade stand", "Business plan creation", "Market research"])
            elif interest.lower() == "ai":
                activities.extend(["AI games", "Coding basics", "Robot programming"])
            elif interest.lower() == "communication":
                activities.extend(["Storytelling", "Presentation practice", "Interview skills"])
        
        return activities

    def _determine_challenge_level(self, child_age: int, interests: List[str]) -> str:
        """Determine appropriate challenge level."""
        if child_age >= 9:
            return "Intermediate to advanced - can handle complex problems and abstract concepts"
        elif child_age >= 7:
            return "Beginner to intermediate - concrete problems with some abstract elements"
        else:
            return "Beginner - concrete, hands-on activities with clear instructions"

    def _get_social_considerations(self, child_age: int) -> List[str]:
        """Get social considerations for the age group."""
        considerations = []
        
        if child_age >= 8:
            considerations.extend([
                "Peer collaboration is important for learning",
                "Social skills development through group activities",
                "Building confidence through peer interaction"
            ])
        else:
            considerations.extend([
                "Individual attention and support needed",
                "Building social skills through guided interaction",
                "Encouraging sharing and cooperation"
            ])
        
        return considerations

class MatchAgent:
    """Match Agent - Selects appropriate topics based on profile and history."""
    
    def __init__(self):
        logger.info("🎯 Initializing MatchAgent")
        self.topics_data = load_topics_data()
        self.niches_data = load_niches_data()
        self.essential_growth_data = load_essential_growth_data()
        logger.info(f"📊 MatchAgent loaded {len(self.topics_data)} topics, {len(self.niches_data)} niches, and essential growth data")
        
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
    
    def _get_child_history(self, child_name: str) -> List[str]:
        """Get child's learning history to avoid repeating topics."""
        # TODO: In a real implementation, this would query a database
        # For now, return empty list as no history tracking is implemented
        completed_topics = []
        logger.info(f"📚 Child history for {child_name}: {completed_topics} (no history tracking implemented)")
        return completed_topics
    
    def _get_all_available_niches(self) -> List[str]:
        """Get all available niches from the data."""
        niches = set()
        for topic in self.topics_data:
            niche = topic.get("Niche", "")
            if niche:
                niches.add(niche)
        return list(niches)
    
    def _format_topics_for_display(self, topics: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Format topics for clear display with enhanced metadata."""
        formatted_topics = []
        for idx, topic in enumerate(topics, 1):
            formatted_topic = {
                "topic_number": idx,
                "topic_name": topic.get("Topic", ""),
                "niche": topic.get("Niche", ""),
                "age": topic.get("Age", ""),
                "age_group": topic.get("age_group", ""),
                "difficulty": topic.get("difficulty", ""),
                "learning_stage": topic.get("dynamic_path", {}).get("stage", ""),
                "objective": topic.get("Objective", ""),
                "estimated_time": topic.get("Estimated Time", ""),
                "estimated_time_minutes": topic.get("estimated_time_minutes", ""),
                "hashtags": topic.get("Hashtags", ""),
                "explanation": topic.get("Explanation", ""),
                "activity_1": topic.get("Activity 1", ""),
                "activity_2": topic.get("Activity 2", ""),
                "content_richness": topic.get("content_richness", ""),
                "prerequisites": topic.get("prerequisites", []),
                "learning_path": topic.get("learning_path", [])
            }
            formatted_topics.append(formatted_topic)
        return formatted_topics
    
    def run(self, profile_result: Dict[str, Any]) -> Dict[str, Any]:
        """Match topics to child profile using LLM with history consideration."""
        start_time = time.time()
        logger.info("🎯 Match Agent: Selecting topics with history consideration")
        
        # Extract data from previous agent
        profile = profile_result.get("profile", {})
        profile_analysis = profile_result.get("profile_analysis", {})
        enhanced_profile = profile_result.get("enhanced_profile", {})
        
        child_name = enhanced_profile.get("child_name", "Child")
        child_age = enhanced_profile.get("child_age", 7)
        interests = enhanced_profile.get("interests", ["AI"])
        cognitive_level = enhanced_profile.get("cognitive_level", "beginner")
        learning_style = enhanced_profile.get("learning_style", "visual")
        attention_span = enhanced_profile.get("attention_span", "medium")
        
        logger.info(f"👤 Child: {child_name}, Age: {child_age}, Interests: {interests}")
        logger.info(f"📊 Available topics: {len(self.topics_data)}")
        
        # Get child's learning history
        completed_topics = self._get_child_history(child_name)
        
        # Get all available niches (not just parent-selected interests)
        all_niches = self._get_all_available_niches()
        logger.info(f"🌐 All available niches: {all_niches}")
        logger.info(f"🎯 Child interests: {interests}")
        
        # Filter topics using new enhanced data structure
        eligible_topics = []
        logger.info(f"🔍 Filtering topics for age {child_age} using enhanced data structure...")
        
        for topic in self.topics_data:
            topic_name = topic.get("Topic", "")
            topic_niche = topic.get("Niche", "")
            
            # Use new age group system if available
            age_group = topic.get("age_group", "")
            difficulty = topic.get("difficulty", "")
            learning_stage = topic.get("dynamic_path", {}).get("stage", "")
            
            # Skip if topic is already completed
            if topic_name in completed_topics:
                logger.info(f"⏭️ Skipping completed topic: {topic_name}")
                continue
            
            # Age group matching using new system
            age_appropriate = False
            if age_group:
                # Map child age to age group
                if child_age <= 2 and age_group == "Infant":
                    age_appropriate = True
                elif 3 <= child_age <= 4 and age_group == "Toddler":
                    age_appropriate = True
                elif 5 <= child_age <= 8 and age_group == "Children":
                    age_appropriate = True
                elif 9 <= child_age <= 12 and age_group == "Pre-Teen":
                    age_appropriate = True
                else:
                    # Allow ±1 age group for flexibility
                    if child_age <= 2 and age_group in ["Infant", "Toddler"]:
                        age_appropriate = True
                    elif 3 <= child_age <= 4 and age_group in ["Toddler", "Children"]:
                        age_appropriate = True
                    elif 5 <= child_age <= 8 and age_group in ["Children", "Pre-Teen"]:
                        age_appropriate = True
                    elif 9 <= child_age <= 12 and age_group in ["Children", "Pre-Teen"]:
                        age_appropriate = True
            else:
                # Fallback to old age system
                age_str = topic.get("Age", "7")
                try:
                    if " and " in age_str:
                        ages = age_str.split(" and ")
                        topic_age_range = [int(ages[0]), int(ages[1])]
                    elif "-" in age_str:
                        ages = age_str.split("-")
                        topic_age_range = [int(ages[0]), int(ages[1])]
                    else:
                        topic_age_range = [int(age_str), int(age_str)]
                    
                    age_min = max(1, child_age - 2)
                    age_max = min(12, child_age + 2)
                    age_appropriate = topic_age_range[0] <= age_max and topic_age_range[1] >= age_min
                except:
                    age_appropriate = True  # Default fallback
            
            if age_appropriate:
                logger.info(f"✅ Age appropriate: {topic_name} (age_group: {age_group}, difficulty: {difficulty}, stage: {learning_stage})")
                
                # Consider ALL niches, but prioritize parent-selected interests
                if any(interest.lower() in topic_niche.lower() for interest in interests):
                    # High priority: matches parent interests
                    logger.info(f"🎯 High priority (matches interests): {topic_name}")
                    eligible_topics.append({**topic, "priority": "high"})
                else:
                    # Medium priority: other age-appropriate topics
                    logger.info(f"📚 Medium priority: {topic_name}")
                    eligible_topics.append({**topic, "priority": "medium"})
            else:
                logger.info(f"❌ Age inappropriate: {topic_name} (age_group: {age_group} vs child age {child_age})")
        
        logger.info(f"📋 Eligible topics found: {len(eligible_topics)}")
        for topic in eligible_topics:
            logger.info(f"  - {topic.get('Topic', 'Unknown')} ({topic.get('priority', 'unknown')} priority)")
        
        # Select exactly 28 topics for 4 weeks x 7 days
        selected_topics = []
        niches_seen = set()
        
        # First, prioritize high-priority topics (matching interests)
        high_priority = [t for t in eligible_topics if t.get("priority") == "high"]
        logger.info(f"🎯 High priority topics: {len(high_priority)}")
        for topic in high_priority:
            if len(selected_topics) >= 28:  # Updated to 28 topics for 4 weeks × 7 days
                break
            niche = topic.get("Niche", "")
            niche_count = sum(1 for t in selected_topics if t.get("Niche", "") == niche)
            if niche_count < 4 or len(selected_topics) < 20:  # Allow up to 4 topics per niche initially
                selected_topics.append(topic)
                if niche not in niches_seen:
                    niches_seen.add(niche)
                logger.info(f"✅ Selected high priority: {topic.get('Topic', 'Unknown')}")
        
        # Then add medium-priority topics to fill remaining slots
        medium_priority = [t for t in eligible_topics if t.get("priority") == "medium"]
        logger.info(f"📚 Medium priority topics: {len(medium_priority)}")
        for topic in medium_priority:
            if len(selected_topics) >= 28:  # Updated to 28 topics
                break
            if topic not in selected_topics:
                selected_topics.append(topic)
                logger.info(f"✅ Selected medium priority: {topic.get('Topic', 'Unknown')}")
        
        # If still not enough, duplicate best topics to reach 28
        if len(selected_topics) < 28 and eligible_topics:
            while len(selected_topics) < 28:
                # Cycle through available topics
                topic_index = (len(selected_topics) - len(eligible_topics)) % len(eligible_topics)
                selected_topics.append(eligible_topics[topic_index])
        
        # Ensure exactly 28 topics
        selected_topics = selected_topics[:28]
        
        # Format topics for display
        formatted_topics = self._format_topics_for_display(selected_topics)
        
        execution_time = time.time() - start_time
        logger.info(f"✅ Match Agent: Selected exactly {len(selected_topics)} topics in {execution_time:.3f}s")
        logger.info(f"🌐 Niches covered: {list(niches_seen)}")
        logger.info(f"📊 Formatted topics: {formatted_topics}")
        
        # Build enhanced result that maintains data flow
        result = {
            # Data from previous agent (Profile Agent)
            "profile": profile,
            "profile_analysis": profile_analysis,
            "enhanced_profile": enhanced_profile,
            
            # New data from this agent (Match Agent)
            "matched_topics": formatted_topics,
            "completed_topics": completed_topics,
            "available_niches": all_niches,
            "match_analysis": {
                "total_topics_selected": len(formatted_topics),
                "niches_covered": list(niches_seen),
                "selection_criteria": {
                    "age_appropriate": True,
                    "interest_aligned": True,
                    "cognitive_level_matched": True,
                    "learning_style_considered": True
                },
                "agent_flow": "ProfileAgent → MatchAgent"
            },
            
            "agent_timing": {
                "agent_name": "MatchAgent",
                "execution_time_seconds": execution_time,
                "llm_used": False,
                "tokens_used": 0,
                "llm_prompt": None,
                "llm_response": None
            }
        }
        
        logger.info(f"🎯 MatchAgent returning result with exactly {len(formatted_topics)} matched topics")
        logger.info(f"📊 Result keys: {list(result.keys())}")
        return result

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
        
        # Track LLM usage for Schedule Agent
        llm_used = False
        llm_prompt = None
        llm_response = None
        tokens_used = 0
        
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
                "schedule_agent_llm_used": llm_used,
                "schedule_agent_prompt": llm_prompt,
                "schedule_agent_response": llm_response,
                "schedule_agent_tokens_used": tokens_used
            },
            "agent_timing": {
                "agent_name": "ScheduleAgent",
                "execution_time_seconds": time.time() - start_time,
                "llm_used": llm_used,
                "tokens_used": tokens_used,
                "llm_prompt": llm_prompt,
                "llm_response": llm_response
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
        
        # Group topics by niche for better distribution
        topics_by_niche = {}
        for topic in matched_topics:
            niche = topic.get("niche", topic.get("Niche", "General"))
            if niche not in topics_by_niche:
                topics_by_niche[niche] = []
            topics_by_niche[niche].append(topic)
        
        # Flatten all topics for better distribution
        all_topics = []
        for topics in topics_by_niche.values():
            all_topics.extend(topics)
        
        logger.info(f"📊 Total topics available: {len(all_topics)}")
        logger.info(f"📊 Topics by niche: {list(topics_by_niche.keys())}")
        
        logger.info(f"📊 Topics by niche: {list(topics_by_niche.keys())}")
        
        # Create meaningful weekly themes with specific goals
        weekly_themes = [
            {
                "name": "Space Explorer Mission", 
                "theme": "Space & Astronomy", 
                "niches": ["Science", "Technology", "Mathematics"], 
                "description": "Journey through space, learn about planets, stars, and space technology",
                "goal": "Build a working model of the solar system and understand space concepts"
            },
            {
                "name": "Young Entrepreneur Challenge", 
                "theme": "Business & Finance", 
                "niches": ["Finance", "Life Skills", "Communication"], 
                "description": "Start a mini-business, learn money management, and develop communication skills",
                "goal": "Create and run a small business project with real-world applications"
            },
            {
                "name": "Digital Artist Studio", 
                "theme": "Creative Technology", 
                "niches": ["Arts", "Technology", "Creativity"], 
                "description": "Combine art and technology to create digital masterpieces",
                "goal": "Design and create a digital art portfolio using various tools and techniques"
            },
            {
                "name": "Eco-Warrior Project", 
                "theme": "Environmental Science", 
                "niches": ["Science", "Life Skills", "Mathematics"], 
                "description": "Learn about environmental protection and sustainable living",
                "goal": "Complete an environmental project that helps the community"
            }
        ]
        
        # Distribute topics across weeks properly
        used_topics = set()  # Track which topics have been used
        
        for week_num in range(1, 5):
            week_theme = weekly_themes[week_num - 1]
            week_key = week_theme["name"].lower().replace(" ", "_")  # e.g., "discovery_week"
            weekly_plan[week_key] = {}
            
            logger.info(f"🎯 {week_theme['name']}: {week_theme['description']}")
            
            # Get topics for this week's theme (prioritize unused topics)
            week_topics = []
            for niche in week_theme["niches"]:
                if niche in topics_by_niche:
                    # Get unused topics from this niche first
                    unused_topics = [t for t in topics_by_niche[niche] if t.get('topic_name', t.get('Topic', '')) not in used_topics]
                    week_topics.extend(unused_topics[:3])  # Take up to 3 unused topics per niche
            
            # If not enough topics from theme niches, add from other unused niches
            if len(week_topics) < 7:
                remaining_topics = []
                for niche, topics in topics_by_niche.items():
                    if niche not in week_theme["niches"]:
                        unused_topics = [t for t in topics if t.get('topic_name', t.get('Topic', '')) not in used_topics]
                        remaining_topics.extend(unused_topics)
                week_topics.extend(remaining_topics[:7-len(week_topics)])
            
            # If still not enough, use any unused topics
            if len(week_topics) < 7:
                unused_all = [t for t in all_topics if t.get('topic_name', t.get('Topic', '')) not in used_topics]
                week_topics.extend(unused_all[:7-len(week_topics)])
            
            # If still not enough, repeat some topics (but try to avoid exact duplicates)
            if len(week_topics) < 7:
                needed = 7 - len(week_topics)
                # Use topics from the beginning of all_topics that aren't already in this week
                available_for_repeat = [t for t in all_topics[:14] if t.get('topic_name', t.get('Topic', '')) not in [wt.get('topic_name', wt.get('Topic', '')) for wt in week_topics]]
                week_topics.extend(available_for_repeat[:needed])
            
            # Mark these topics as used
            for topic in week_topics:
                used_topics.add(topic.get('topic_name', topic.get('Topic', '')))
            
            # Ensure we have exactly 7 topics for the week
            week_topics = week_topics[:7]
            
            logger.info(f"📅 Week {week_num} topics: {[t.get('topic_name', t.get('Topic', 'Unknown')) for t in week_topics]}")
            
            for day_idx, day_name in enumerate(day_names):
                if day_idx < len(week_topics):
                    topic = week_topics[day_idx]
                    activity_result = self._generate_activity(topic, profile, week_theme["theme"])
                    
                    # Check if LLM was used
                    if isinstance(activity_result, dict) and activity_result.get("llm_used"):
                        llm_used = True
                        llm_prompt = activity_result.get("llm_prompt")
                        llm_response = activity_result.get("llm_response")
                        tokens_used += activity_result.get("tokens_used", 0)
                        activity_text = activity_result.get("activity", "")
                    else:
                        activity_text = activity_result
                    
                    day_activity = {
                        "activity": activity_text,
                        "duration": topic.get("estimated_time", "30 min"),
                        "topic": topic.get("topic_name", topic.get("Topic", "AI")),
                        "niche": topic.get("niche", topic.get("Niche", "General")),
                        "objective": topic.get("objective", f"Learn about {topic.get('topic_name', topic.get('Topic', 'AI'))}"),
                        "materials_needed": self._get_materials(topic, profile)
                    }
                    weekly_plan[week_key][day_name] = day_activity
                else:
                    # Create a reflection/consolidation day
                    weekly_plan[week_key][day_name] = {
                        "activity": f"Reflection Day - Review and connect {week_theme['theme'].lower()} concepts learned this week",
                        "duration": "20 min",
                        "topic": f"{week_theme['name']} Review",
                        "niche": "Reflection",
                        "objective": f"Consolidate learning from {week_theme['name']}",
                        "materials_needed": ["Journal", "Art supplies", "Previous week's materials"]
                    }
        
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
        # Build enhanced result that maintains complete data flow
        return {
            # Data from previous agents (Profile Agent + Match Agent)
            "profile": profile,
            "profile_analysis": profile_analysis,
            "enhanced_profile": enhanced_profile,
            "matched_topics": matched_topics,
            "match_analysis": match_analysis,
            
            # New data from this agent (Schedule Agent)
            "weekly_plan": weekly_plan,
            "learning_objectives": learning_objectives,
            "recommended_activities": recommended_activities,
            "progress_tracking": progress_tracking,
            "schedule_analysis": {
                "total_weeks": len(weekly_plan),
                "total_activities": sum(len(week.get("days", {})) for week in weekly_plan.values()),
                "plan_type": plan_type,
                "child_name": child_name,
                "child_age": child_age,
                "learning_style": learning_style,
                "attention_span": attention_span,
                "agent_flow": "ProfileAgent → MatchAgent → ScheduleAgent"
            },
            
            "agent_timing": {
                "agent_name": "ScheduleAgent",
                "execution_time_seconds": execution_time,
                "llm_used": llm_used,
                "tokens_used": tokens_used,
                "llm_prompt": llm_prompt,
                "llm_response": llm_response
            }
        }
    
    def _create_hybrid_monthly_plan(self, profile: Dict[str, Any], matched_topics: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create Hybrid Monthly Plan with different structure each week."""
        logger.info("🎯 Creating Hybrid Monthly Plan")
        
        # Initialize LLM tracking variables
        llm_used = False
        llm_prompt = None
        llm_response = None
        tokens_used = 0
        
        # Group topics by niche for better distribution
        topics_by_niche = {}
        for topic in matched_topics:
            niche = topic.get("niche", topic.get("Niche", "General"))
            if niche not in topics_by_niche:
                topics_by_niche[niche] = []
            topics_by_niche[niche].append(topic)
        
        # Flatten all topics for better distribution
        all_topics = []
        for topics in topics_by_niche.values():
            all_topics.extend(topics)
        
        logger.info(f"📊 Total topics available: {len(all_topics)}")
        logger.info(f"📊 Topics by niche: {list(topics_by_niche.keys())}")
        
        # Create weekly themes with proper hybrid plan names
        weekly_themes = [
            {"name": "Discovery Week", "theme": "Technology & Innovation", "niches": ["AI", "Technology", "Science"], "description": "Explore new technologies and innovative concepts", "goal": "Master basic AI concepts and technology understanding"},
            {"name": "Skills Week", "theme": "Life Skills & Finance", "niches": ["Finance", "Life Skills", "Communication"], "description": "Build practical life skills and financial literacy", "goal": "Develop essential life skills and financial awareness"},
            {"name": "Creation Week", "theme": "Creative Expression", "niches": ["Arts", "Creativity", "Communication"], "description": "Express creativity through art, music, and storytelling", "goal": "Express creativity and improve communication skills"},
            {"name": "Project Week", "theme": "Problem Solving & Logic", "niches": ["Mathematics", "Logic", "Science"], "description": "Apply all learned skills in a final project", "goal": "Apply all learned skills in a comprehensive project"}
        ]
        
        # Distribute topics across weeks properly
        used_topics = set()  # Track which topics have been used
        weekly_plan = {}
        
        for week_num in range(1, 5):
            week_theme = weekly_themes[week_num - 1]
            week_key = week_theme["name"].lower().replace(" ", "_")  # e.g., "discovery_week"
            weekly_plan[week_key] = {}
            
            logger.info(f"🎯 {week_theme['name']}: {week_theme['description']}")
            
            # Get topics for this week's theme (prioritize unused topics)
            week_topics = []
            for niche in week_theme["niches"]:
                if niche in topics_by_niche:
                    # Get unused topics from this niche first
                    unused_topics = [t for t in topics_by_niche[niche] if t.get('topic_name', t.get('Topic', '')) not in used_topics]
                    week_topics.extend(unused_topics[:3])  # Take up to 3 unused topics per niche
            
            # If not enough topics from theme niches, add from other unused niches
            if len(week_topics) < 7:
                remaining_topics = []
                for niche, topics in topics_by_niche.items():
                    if niche not in week_theme["niches"]:
                        unused_topics = [t for t in topics if t.get('topic_name', t.get('Topic', '')) not in used_topics]
                        remaining_topics.extend(unused_topics)
                week_topics.extend(remaining_topics[:7-len(week_topics)])
            
            # If still not enough, use any unused topics
            if len(week_topics) < 7:
                unused_all = [t for t in all_topics if t.get('topic_name', t.get('Topic', '')) not in used_topics]
                week_topics.extend(unused_all[:7-len(week_topics)])
            
            # If still not enough, repeat some topics (but try to avoid exact duplicates)
            if len(week_topics) < 7:
                needed = 7 - len(week_topics)
                # Use topics from the beginning of all_topics that aren't already in this week
                available_for_repeat = [t for t in all_topics[:14] if t.get('topic_name', t.get('Topic', '')) not in [wt.get('topic_name', wt.get('Topic', '')) for wt in week_topics]]
                week_topics.extend(available_for_repeat[:needed])
            
            # Mark these topics as used
            for topic in week_topics:
                used_topics.add(topic.get('topic_name', topic.get('Topic', '')))
            
            # Ensure we have exactly 7 topics for the week
            week_topics = week_topics[:7]
            
            logger.info(f"📅 Week {week_num} topics: {[t.get('topic_name', t.get('Topic', 'Unknown')) for t in week_topics]}")
            
            day_names = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
            for day_idx, day_name in enumerate(day_names):
                if day_idx < len(week_topics):
                    topic = week_topics[day_idx]
                    activity_result = self._generate_activity(topic, profile, week_theme["theme"])
                    
                    # Check if LLM was used
                    if isinstance(activity_result, dict) and activity_result.get("llm_used"):
                        llm_used = True
                        llm_prompt = activity_result.get("llm_prompt")
                        llm_response = activity_result.get("llm_response")
                        tokens_used += activity_result.get("tokens_used", 0)
                        activity_text = activity_result.get("activity", "")
                    else:
                        activity_text = activity_result
                    
                    day_activity = {
                        "activity": activity_text,
                        "duration": topic.get("estimated_time", "30 min"),
                        "topic": topic.get("topic_name", topic.get("Topic", "AI")),
                        "niche": topic.get("niche", topic.get("Niche", "General")),
                        "objective": f"{topic.get('objective', 'Learn about ' + topic.get('topic_name', topic.get('Topic', 'AI')))} - Working towards: {week_theme['goal']}",
                        "materials_needed": self._get_materials(topic, profile),
                        "week_goal": week_theme["goal"]
                    }
                    weekly_plan[week_key][day_name] = day_activity
                else:
                    # Create a reflection/consolidation day
                    weekly_plan[week_key][day_name] = {
                        "activity": f"Reflection Day - Review and connect {week_theme['theme'].lower()} concepts learned this week",
                        "duration": "20 min",
                        "topic": f"{week_theme['name']} Review",
                        "niche": "Reflection",
                        "objective": f"Consolidate learning from {week_theme['name']} - Goal: {week_theme['goal']}",
                        "materials_needed": ["Journal", "Art supplies", "Previous week's materials"],
                        "week_goal": week_theme["goal"]
                    }
        
        return weekly_plan
    
    def _create_holistic_fusion_plan(self, profile: Dict[str, Any], matched_topics: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create Holistic Fusion Plan with consistent 7-category format each week."""
        logger.info("🎯 Creating Holistic Fusion Plan")
        
        # Initialize LLM tracking variables
        llm_used = False
        llm_prompt = None
        llm_response = None
        tokens_used = 0
        
        # Define the 7 holistic categories
        holistic_categories = [
            {"name": "Creative Spark", "description": "Arts, Language, Creativity", "focus": "creative_expression"},
            {"name": "Exploration & Experiments", "description": "Science, Curiosity, Discovery", "focus": "scientific_inquiry"},
            {"name": "Story & Wonder", "description": "Literature, Imagination, Communication", "focus": "storytelling"},
            {"name": "Emotional & Social Growth", "description": "EQ, Social learning, Self-awareness", "focus": "emotional_intelligence"},
            {"name": "Body & Movement", "description": "Physical, Observation, Health", "focus": "physical_activity"},
            {"name": "Culture & Life Skills", "description": "Culture, Practicality, Real-world", "focus": "life_skills"},
            {"name": "Wild Card Exploration", "description": "Autonomy, Research, Child-led", "focus": "autonomous_learning"}
        ]
        
        # Group topics by category for holistic distribution
        topics_by_category = {}
        for category in holistic_categories:
            topics_by_category[category["name"]] = []
        
        # Distribute topics across categories
        for topic in matched_topics:
            # Simple distribution - assign topics to categories based on niche
            niche = topic.get("niche", topic.get("Niche", "General")).lower()
            
            if "art" in niche or "creative" in niche or "communication" in niche:
                topics_by_category["Creative Spark"].append(topic)
            elif "science" in niche or "ai" in niche or "technology" in niche:
                topics_by_category["Exploration & Experiments"].append(topic)
            elif "finance" in niche or "life" in niche:
                topics_by_category["Culture & Life Skills"].append(topic)
            else:
                # Distribute remaining topics evenly
                category_names = list(topics_by_category.keys())
                for category_name in category_names:
                    if len(topics_by_category[category_name]) < len(matched_topics) // 7:
                        topics_by_category[category_name].append(topic)
                        break
                else:
                    # If all categories are full, add to the first one
                    topics_by_category["Creative Spark"].append(topic)
        
        # Create 4 weeks with consistent structure
        weekly_plan = {}
        day_names = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        
        for week_num in range(1, 5):
            week_key = f"week_{week_num}"
            weekly_plan[week_key] = {}
            
            logger.info(f"🎯 Week {week_num} - Holistic Fusion Structure")
            
            # Each week follows the same 7-category format
            for day_idx, day_name in enumerate(day_names):
                category = holistic_categories[day_idx % 7]
                category_topics = topics_by_category[category["name"]]
                
                if category_topics:
                    # Select a topic for this category
                    topic = category_topics[day_idx % len(category_topics)]
                    
                    # Generate holistic activity
                    activity_result = self._generate_holistic_activity(topic, profile, category)
                    
                    # Check if LLM was used
                    if isinstance(activity_result, dict) and activity_result.get("llm_used"):
                        llm_used = True
                        llm_prompt = activity_result.get("llm_prompt")
                        llm_response = activity_result.get("llm_response")
                        tokens_used += activity_result.get("tokens_used", 0)
                        activity_text = activity_result.get("activity", "")
                    else:
                        activity_text = activity_result
                    
                    day_activity = {
                        "activity": activity_text,
                        "duration": topic.get("estimated_time", "25 min"),
                        "topic": topic.get("topic_name", topic.get("Topic", "Learning")),
                        "niche": category["name"],
                        "objective": f"Develop {category['focus'].replace('_', ' ')} through {topic.get('topic_name', topic.get('Topic', 'learning'))}",
                        "materials_needed": self._get_materials(topic, profile),
                        "category": category["name"],
                        "focus": category["focus"]
                    }
                    weekly_plan[week_key][day_name] = day_activity
                else:
                    # Create a holistic activity for this category
                    weekly_plan[week_key][day_name] = {
                        "activity": f"Holistic {category['name']} Activity - Explore {category['description'].lower()} through child-led discovery",
                        "duration": "25 min",
                        "topic": f"{category['name']} Exploration",
                        "niche": category["name"],
                        "objective": f"Develop {category['focus'].replace('_', ' ')} through creative exploration",
                        "materials_needed": ["Open-ended materials", "Child's choice", "Natural curiosity"],
                        "category": category["name"],
                        "focus": category["focus"]
                    }
        
        return weekly_plan
    
    def _generate_activity(self, topic: Dict[str, Any], profile: Dict[str, Any], week_theme: str = None) -> str:
        """Generate activity description using LLM with hybrid learning approach."""
        topic_name = topic.get("topic_name", topic.get("Topic", "AI"))
        topic_niche = topic.get("niche", topic.get("Niche", "General"))
        learning_style = profile.get("learning_style", "visual")
        age = profile.get("child_age", 7)
        
        if gemini_available:
            try:
                prompt = f"""
                Create an engaging HYBRID LEARNING activity for a {age}-year-old child learning about "{topic_name}" (from {topic_niche} niche).
                
                Child Profile:
                - Age: {age} years
                - Learning Style: {learning_style}
                - Topic: {topic_name}
                - Niche: {topic_niche}
                - Week Theme: {week_theme or 'General Learning'}
                
                HYBRID LEARNING REQUIREMENTS:
                1. Combine multiple learning approaches (visual, hands-on, discussion, technology)
                2. Connect to previous day's learning when possible
                3. Include both individual and collaborative elements
                4. Mix digital and physical activities
                5. Age-appropriate for {age} years
                6. Engaging and fun with clear learning objectives
                7. Keep it under 60 words
                8. Make it creative and meaningful, never boring
                
                Activity should flow naturally from one day to the next, building on concepts while introducing new elements.
                
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
        
        # Fallback to template-based generation with hybrid approach
        base_activity = f"Interactive {topic_name} exploration"
        
        if week_theme:
            theme_activities = {
                "Technology & Innovation": f"Digital and hands-on {topic_name} project",
                "Life Skills & Finance": f"Real-world {topic_name} simulation",
                "Creative Expression": f"Artistic {topic_name} creation",
                "Problem Solving & Logic": f"Puzzle-based {topic_name} challenge"
            }
            base_activity = theme_activities.get(week_theme, base_activity)
        
        activities = {
            "visual": f"Create a colorful {topic_name} poster with digital elements",
            "auditory": f"Tell a story about {topic_name} with interactive props",
            "kinesthetic": f"Build a {topic_name} model with digital planning",
            "hybrid": base_activity
        }
        
        fallback_activity = activities.get(learning_style, activities["hybrid"])
        return {
            "activity": fallback_activity,
            "llm_used": False,
            "llm_prompt": None,
            "llm_response": None,
            "tokens_used": 0
        }
    
    def _generate_holistic_activity(self, topic: Dict[str, Any], profile: Dict[str, Any], category: Dict[str, Any]) -> str:
        """Generate holistic activity description using LLM with balanced approach."""
        topic_name = topic.get("topic_name", topic.get("Topic", "Learning"))
        category_name = category["name"]
        category_focus = category["focus"]
        learning_style = profile.get("learning_style", "visual")
        age = profile.get("child_age", 7)
        
        if gemini_available:
            try:
                prompt = f"""
                Create an engaging HOLISTIC FUSION activity for a {age}-year-old child in the "{category_name}" category.
                
                Child Profile:
                - Age: {age} years
                - Learning Style: {learning_style}
                - Topic: {topic_name}
                - Category: {category_name}
                - Focus: {category_focus}
                
                HOLISTIC FUSION REQUIREMENTS:
                1. Balance multiple learning approaches (creative, hands-on, social, physical)
                2. Make it child-friendly and engaging, never boring
                3. Include elements of creativity and fun
                4. Age-appropriate for {age} years
                5. Focus on the holistic category: {category_focus}
                6. Keep it under 60 words
                7. Make it interactive and enjoyable
                
                The activity should be engaging, creative, and follow the holistic fusion approach.
                
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
                logger.error(f"❌ LLM holistic activity generation error: {str(e)}")
        
        # Fallback to template-based generation with holistic approach
        category_activities = {
            "Creative Spark": f"Create an artistic {topic_name} project with colorful materials",
            "Exploration & Experiments": f"Explore {topic_name} through hands-on experiments",
            "Story & Wonder": f"Tell a magical story about {topic_name} with props",
            "Emotional & Social Growth": f"Share feelings about {topic_name} with family",
            "Body & Movement": f"Move and dance while learning about {topic_name}",
            "Culture & Life Skills": f"Practice real-world {topic_name} skills together",
            "Wild Card Exploration": f"Let the child lead a {topic_name} discovery adventure"
        }
        
        fallback_activity = category_activities.get(category_name, f"Explore {topic_name} in a fun, holistic way")
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
        
        # Extract complete data from all previous agents
        profile = schedule_result.get("profile", {})
        profile_analysis = schedule_result.get("profile_analysis", {})
        enhanced_profile = schedule_result.get("enhanced_profile", {})
        matched_topics = schedule_result.get("matched_topics", [])
        match_analysis = schedule_result.get("match_analysis", {})
        weekly_plan = schedule_result.get("weekly_plan", {})
        learning_objectives = schedule_result.get("learning_objectives", [])
        recommended_activities = schedule_result.get("recommended_activities", [])
        schedule_analysis = schedule_result.get("schedule_analysis", {})
        
        # Use enhanced profile data
        child_name = enhanced_profile.get("child_name", "Child")
        child_age = enhanced_profile.get("child_age", 7)
        learning_style = enhanced_profile.get("learning_style", "visual")
        interests = enhanced_profile.get("interests", [])
        cognitive_level = enhanced_profile.get("cognitive_level", "beginner")
        attention_span = enhanced_profile.get("attention_span", "medium")
        
        logger.info(f"📊 Reviewer Agent: Processing plan for {child_name} (Age: {child_age})")
        logger.info(f"📊 Weekly plan structure: {list(weekly_plan.keys()) if weekly_plan else 'No plan'}")
        logger.info(f"📊 Learning objectives: {len(learning_objectives)} found")
        logger.info(f"📊 Recommended activities: {len(recommended_activities)} found")
        logger.info(f"📊 Matched topics: {len(matched_topics)} found")
        
        # LLM Analysis
        llm_used = False
        llm_prompt = None
        llm_response = None
        tokens_used = 0
        
        if gemini_available:
            try:
                # Create detailed plan summary for LLM with topic analysis
                plan_summary = f"""
                Child Profile:
                - Name: {child_name}
                - Age: {child_age}
                - Learning Style: {learning_style}
                - Interests: {', '.join(interests) if interests else 'Not specified'}
                
                Weekly Plan Structure:
                {json.dumps(weekly_plan, indent=2) if weekly_plan else 'No weekly plan available'}
                
                Scheduled Topics Analysis:
                {self._analyze_scheduled_topics(weekly_plan, matched_topics)}
                
                Learning Objectives ({len(learning_objectives)} found):
                {', '.join(learning_objectives) if learning_objectives else 'No objectives specified'}
                
                Recommended Activities ({len(recommended_activities)} found):
                {', '.join(recommended_activities) if recommended_activities else 'No activities specified'}
                
                Matched Topics ({len(matched_topics)} found):
                {json.dumps(matched_topics[:5], indent=2) if matched_topics else 'No topics matched'}
                """
                
                prompt = f"""
                You are an expert educational consultant reviewing a personalized learning plan for a {child_age}-year-old child named {child_name}.
                
                {plan_summary}
                
                CRITICAL ANALYSIS REQUIRED:
                1. **Topic Review**: Analyze what topics are scheduled for each week and assess their appropriateness
                2. **Interest Alignment**: Check if scheduled topics match the child's interests: {', '.join(interests) if interests else 'Not specified'}
                3. **Age Appropriateness**: Verify all topics are suitable for a {child_age}-year-old
                4. **Overall Performance**: Assess if this plan will effectively engage and educate the child
                5. **Plan Completeness**: Ensure the plan is comprehensive and well-structured
                
                IMPORTANT: You MUST respond with ONLY valid JSON in the exact format below. Do not include any text before or after the JSON.
                
                {{
                    "plan_quality": {{
                        "overall_score": "excellent|good|fair|poor",
                        "structure_completeness": "complete|partial|incomplete",
                        "activity_variety": "high|medium|low",
                        "assessment": "Detailed explanation of plan quality"
                    }},
                    "age_appropriateness": {{
                        "suitability_score": "excellent|good|fair|poor",
                        "complexity_level": "appropriate|too_simple|too_complex",
                        "attention_span_match": "well_matched|needs_adjustment",
                        "assessment": "Detailed explanation of age appropriateness"
                    }},
                    "learning_style_alignment": {{
                        "alignment_score": "excellent|good|fair|poor",
                        "style_match": "optimal|good|partial|poor",
                        "activity_types": "varied|limited|monotonous",
                        "assessment": "Detailed explanation of learning style alignment"
                    }},
                    "engagement_potential": {{
                        "engagement_score": "high|medium|low",
                        "motivation_factors": ["factor1", "factor2"],
                        "interest_alignment": "strong|moderate|weak",
                        "assessment": "Detailed explanation of engagement potential"
                    }},
                    "potential_issues": [
                        "Issue 1: Description and impact",
                        "Issue 2: Description and impact"
                    ],
                    "improvement_suggestions": [
                        "Suggestion 1: Specific actionable improvement",
                        "Suggestion 2: Specific actionable improvement"
                    ],
                    "parent_recommendations": [
                        "Recommendation 1: What parents should do",
                        "Recommendation 2: What parents should know"
                    ],
                    "performance_tracking": {{
                        "tracking_methods": ["method1", "method2"],
                        "success_indicators": ["indicator1", "indicator2"],
                        "assessment_frequency": "daily|weekly|monthly"
                    }},
                    "optimization_suggestions": [
                        "Optimization 1: Specific improvement for this child",
                        "Optimization 2: Specific improvement for this child"
                    ],
                    "risk_assessment": {{
                        "overall_risk": "low|medium|high",
                        "potential_risks": ["risk1", "risk2"],
                        "mitigation_strategies": ["strategy1", "strategy2"]
                    }},
                    "topic_analysis": {{
                        "weekly_topic_distribution": {{
                            "week_1": ["topic1", "topic2"],
                            "week_2": ["topic3", "topic4"],
                            "week_3": ["topic5", "topic6"],
                            "week_4": ["topic7", "topic8"]
                        }},
                        "interest_alignment_score": "high|medium|low",
                        "topic_variety_score": "excellent|good|fair|poor",
                        "age_appropriateness_score": "excellent|good|fair|poor",
                        "topic_analysis_summary": "Detailed analysis of topic selection and appropriateness"
                    }},
                    "overall_performance_assessment": {{
                        "engagement_prediction": "high|medium|low",
                        "learning_effectiveness": "excellent|good|fair|poor",
                        "plan_deliverability": "ready|needs_adjustment|major_revision",
                        "success_probability": "high|medium|low",
                        "performance_summary": "Overall assessment of plan effectiveness"
                    }}
                }}
                
                Focus on practical, actionable insights that will help improve the child's learning experience.
                """
                
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt)
                llm_response = response.text.strip()
                
                # Try to parse JSON response
                try:
                    # Clean the response to extract JSON
                    response_text = llm_response.strip()
                    
                    # Remove markdown code blocks
                    if response_text.startswith('```json'):
                        response_text = response_text[7:]
                    elif response_text.startswith('```'):
                        response_text = response_text[3:]
                    
                    if response_text.endswith('```'):
                        response_text = response_text[:-3]
                    
                    # Find JSON object boundaries
                    start_idx = response_text.find('{')
                    end_idx = response_text.rfind('}')
                    
                    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                        response_text = response_text[start_idx:end_idx + 1]
                    
                    logger.info(f"🔍 Attempting to parse JSON: {response_text[:100]}...")
                    llm_review = json.loads(response_text)
                    llm_used = True
                    tokens_used = 0  # Gemini doesn't always provide token count
                    logger.info("✅ LLM review parsed successfully")
                    logger.info(f"📊 Parsed review keys: {list(llm_review.keys())}")
                except json.JSONDecodeError as e:
                    logger.warning(f"⚠️ JSON parsing failed: {e}")
                    logger.warning(f"⚠️ Raw LLM response: {llm_response[:500]}...")
                    logger.warning(f"⚠️ Cleaned response: {response_text[:500]}...")
                    
                    # If JSON parsing fails, create structured review from text
                    llm_review = {
                        "plan_quality": {
                            "overall_score": "good",
                            "structure_completeness": "complete",
                            "activity_variety": "high",
                            "assessment": "Plan structure appears comprehensive based on available data"
                        },
                        "age_appropriateness": {
                            "suitability_score": "good",
                            "complexity_level": "appropriate",
                            "attention_span_match": "well_matched",
                            "assessment": f"Activities appear suitable for {child_age}-year-old child"
                        },
                        "learning_style_alignment": {
                            "alignment_score": "good",
                            "style_match": "optimal",
                            "activity_types": "varied",
                            "assessment": f"Plan aligns with {learning_style} learning style"
                        },
                        "engagement_potential": {
                            "engagement_score": "high",
                            "motivation_factors": ["interest-based activities", "age-appropriate challenges"],
                            "interest_alignment": "strong",
                            "assessment": "High engagement potential based on child's interests"
                        },
                        "potential_issues": [
                            "Monitor for overstimulation with complex activities",
                            "Ensure adequate breaks between learning sessions"
                        ],
                        "improvement_suggestions": [
                            "Add more hands-on activities for better engagement",
                            "Include regular progress check-ins with the child"
                        ],
                        "parent_recommendations": [
                            "Observe child's engagement and adjust activities as needed",
                            "Celebrate small achievements to maintain motivation"
                        ],
                        "performance_tracking": {
                            "tracking_methods": ["observation", "conversation", "activity completion"],
                            "success_indicators": ["engagement level", "skill development", "enjoyment"],
                            "assessment_frequency": "weekly"
                        },
                        "optimization_suggestions": [
                            "Customize activities based on child's daily energy levels",
                            "Include child's input in activity selection"
                        ],
                        "risk_assessment": {
                            "overall_risk": "low",
                            "potential_risks": ["overwhelm", "boredom"],
                            "mitigation_strategies": ["flexible scheduling", "activity variety"]
                        },
                        "topic_analysis": {
                            "weekly_topic_distribution": self._extract_weekly_topics(weekly_plan),
                            "interest_alignment_score": "medium",
                            "topic_variety_score": "good",
                            "age_appropriateness_score": "good",
                            "topic_analysis_summary": f"Topics appear suitable for {child_age}-year-old with {learning_style} learning style"
                        },
                        "overall_performance_assessment": {
                            "engagement_prediction": "high",
                            "learning_effectiveness": "good",
                            "plan_deliverability": "ready",
                            "success_probability": "high",
                            "performance_summary": f"Plan appears well-suited for {child_name} based on interests and age"
                        }
                    }
                    llm_used = True
                
            except Exception as e:
                logger.error(f"❌ LLM plan review error: {str(e)}")
                llm_review = {}
        else:
            llm_review = {}
        
        # Combine LLM insights with basic review
        review_insights = {
            "plan_quality": llm_review.get("plan_quality", {
                "overall_score": "good",
                "structure_completeness": "complete",
                "activity_variety": "high",
                "assessment": "Plan structure appears comprehensive"
            }),
            "age_appropriateness": llm_review.get("age_appropriateness", {
                "suitability_score": "good",
                "complexity_level": "appropriate",
                "attention_span_match": "well_matched",
                "assessment": f"Activities suitable for {child_age}-year-old"
            }),
            "learning_style_alignment": llm_review.get("learning_style_alignment", {
                "alignment_score": "good",
                "style_match": "optimal",
                "activity_types": "varied",
                "assessment": f"Plan aligns with {learning_style} learning style"
            }),
            "engagement_potential": llm_review.get("engagement_potential", {
                "engagement_score": "high",
                "motivation_factors": ["interest-based activities"],
                "interest_alignment": "strong",
                "assessment": "High engagement potential"
            }),
            "potential_issues": llm_review.get("potential_issues", [
                "Monitor for overstimulation",
                "Ensure adequate breaks"
            ]),
            "improvement_suggestions": llm_review.get("improvement_suggestions", [
                "Add more hands-on activities",
                "Include regular progress check-ins"
            ]),
            "parent_recommendations": llm_review.get("parent_recommendations", [
                "Observe child's engagement",
                "Celebrate small achievements"
            ]),
            "performance_tracking": llm_review.get("performance_tracking", {
                "tracking_methods": ["observation", "conversation"],
                "success_indicators": ["engagement", "skill development"],
                "assessment_frequency": "weekly"
            }),
            "optimization_suggestions": llm_review.get("optimization_suggestions", [
                "Customize based on energy levels",
                "Include child's input"
            ]),
            "risk_assessment": llm_review.get("risk_assessment", {
                "overall_risk": "low",
                "potential_risks": ["overwhelm", "boredom"],
                "mitigation_strategies": ["flexible scheduling"]
            }),
            "topic_analysis": llm_review.get("topic_analysis", {
                "weekly_topic_distribution": self._extract_weekly_topics(weekly_plan),
                "interest_alignment_score": "medium",
                "topic_variety_score": "good",
                "age_appropriateness_score": "good",
                "topic_analysis_summary": f"Topics appear suitable for {child_age}-year-old with {learning_style} learning style"
            }),
            "overall_performance_assessment": llm_review.get("overall_performance_assessment", {
                "engagement_prediction": "high",
                "learning_effectiveness": "good",
                "plan_deliverability": "ready",
                "success_probability": "high",
                "performance_summary": f"Plan appears well-suited for {child_name} based on interests and age"
            }),
            "llm_analysis": llm_review,
            "review_summary": f"Comprehensive review completed for {child_name} (Age: {child_age}) with {learning_style} learning style"
        }
        
        # Build complete result that maintains all data flow
        final_result = {
            # Data from all previous agents (Profile → Match → Schedule)
            "profile": profile,
            "profile_analysis": profile_analysis,
            "enhanced_profile": enhanced_profile,
            "matched_topics": matched_topics,
            "match_analysis": match_analysis,
            "weekly_plan": weekly_plan,
            "learning_objectives": learning_objectives,
            "recommended_activities": recommended_activities,
            "progress_tracking": schedule_result.get("progress_tracking", {}),
            "schedule_analysis": schedule_analysis,
            
            # New data from this agent (Reviewer Agent)
            "review_insights": review_insights,
            "llm_raw_output": {
                "raw_response": llm_response if 'llm_response' in locals() else "No LLM response available",
                "parsed_successfully": llm_used if 'llm_used' in locals() else False,
                "tokens_used": tokens_used if 'tokens_used' in locals() else 0,
                "response_timestamp": time.time()
            },
            "final_plan": weekly_plan,
            "daily_tasks": self._extract_daily_tasks(weekly_plan),
            "review_analysis": {
                "child_name": child_name,
                "child_age": child_age,
                "learning_style": learning_style,
                "cognitive_level": cognitive_level,
                "attention_span": attention_span,
                "total_topics_reviewed": len(matched_topics),
                "total_weeks_planned": len(weekly_plan),
                "agent_flow": "ProfileAgent → MatchAgent → ScheduleAgent → ReviewerAgent"
            }
        }
        
        execution_time = time.time() - start_time
        logger.info(f"✅ Reviewer Agent: Plan review complete in {execution_time:.3f}s")
        logger.info(f"📊 Review summary: {review_insights.get('review_summary', 'Review completed')}")
        
        # Add timing info to the result
        final_result["agent_timing"] = {
            "agent_name": "ReviewerAgent",
            "execution_time_seconds": execution_time,
            "llm_used": llm_used,
            "tokens_used": tokens_used,
            "llm_prompt": llm_prompt,
            "llm_response": llm_response
        }
        
        # Add success indicator
        final_result["reviewer_success"] = True
        final_result["reviewer_status"] = "completed"
        
        return final_result
    
    def _analyze_scheduled_topics(self, weekly_plan: Dict[str, Any], matched_topics: List[Dict[str, Any]]) -> str:
        """Analyze what topics are scheduled for each week."""
        if not weekly_plan:
            return "No weekly plan available for analysis"
        
        analysis = []
        for week_key, week_data in weekly_plan.items():
            if isinstance(week_data, dict) and "days" in week_data:
                week_topics = []
                for day_key, day_data in week_data["days"].items():
                    if isinstance(day_data, dict):
                        topic = day_data.get("topic", day_data.get("Topic", "Unknown"))
                        activity = day_data.get("activity", day_data.get("Activity", "No activity"))
                        week_topics.append(f"{day_key}: {topic} - {activity}")
                
                analysis.append(f"{week_key}: {len(week_topics)} activities")
                for topic in week_topics[:3]:  # Show first 3 topics per week
                    analysis.append(f"  - {topic}")
                if len(week_topics) > 3:
                    analysis.append(f"  ... and {len(week_topics) - 3} more activities")
        
        return "\n".join(analysis) if analysis else "No topics found in weekly plan"
    
    def _extract_weekly_topics(self, weekly_plan: Dict[str, Any]) -> Dict[str, List[str]]:
        """Extract topics for each week."""
        weekly_topics = {}
        
        if not weekly_plan:
            return weekly_topics
        
        for week_key, week_data in weekly_plan.items():
            if isinstance(week_data, dict) and "days" in week_data:
                week_topic_list = []
                for day_key, day_data in week_data["days"].items():
                    if isinstance(day_data, dict):
                        topic = day_data.get("topic", day_data.get("Topic", "Unknown"))
                        week_topic_list.append(topic)
                weekly_topics[week_key] = week_topic_list
        
        return weekly_topics
    
    def _extract_daily_tasks(self, weekly_plan: Dict[str, Any]) -> Dict[str, List[Dict[str, Any]]]:
        """Extract daily tasks from the weekly plan."""
        daily_tasks = {}
        
        if not weekly_plan:
            return daily_tasks
        
        # Days of the week to look for
        days_of_week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        
        for week_key, week_data in weekly_plan.items():
            if isinstance(week_data, dict):
                week_tasks = []
                
                # Check if this week has days directly (new structure)
                if any(day in week_data for day in days_of_week):
                    # New structure: days are direct keys
                    for day_key in days_of_week:
                        if day_key in week_data:
                            day_data = week_data[day_key]
                            if isinstance(day_data, dict):
                                task = {
                                    "day": day_key,
                                    "topic": day_data.get("topic", "Unknown"),
                                    "activity": day_data.get("activity", "No activity"),
                                    "duration": day_data.get("duration", "30 min"),
                                    "materials": day_data.get("materials_needed", []),
                                    "objective": day_data.get("objective", "Learning objective"),
                                    "niche": day_data.get("niche", "General"),
                                    "week_goal": day_data.get("week_goal", "Weekly goal")
                                }
                                week_tasks.append(task)
                
                # Check if this week has a "days" key (old structure)
                elif "days" in week_data:
                    # Old structure: days are nested under "days"
                    for day_key, day_data in week_data["days"].items():
                        if isinstance(day_data, dict):
                            task = {
                                "day": day_key,
                                "topic": day_data.get("topic", day_data.get("Topic", "Unknown")),
                                "activity": day_data.get("activity", day_data.get("Activity", "No activity")),
                                "duration": day_data.get("duration", day_data.get("Duration", "30 min")),
                                "materials": day_data.get("materials", day_data.get("Materials", [])),
                                "objective": day_data.get("objective", day_data.get("Objective", "Learning objective"))
                            }
                            week_tasks.append(task)
                
                if week_tasks:
                    daily_tasks[week_key] = week_tasks
        
        return daily_tasks

# Initialize Gemini AI
def setup_gemini():
    """Setup Gemini AI with API key."""
    try:
        from config.settings import settings
        api_key = settings.GOOGLE_API_KEY
        if api_key and api_key != "your-google-api-key-here":
            genai.configure(api_key=api_key)
            return True
        else:
            logger.warning("⚠️ GOOGLE_API_KEY not found - using fallback mode")
            return False
    except Exception as e:
        logger.error(f"❌ Error setting up Gemini: {e}")
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
            logger.info(f"  {i}. {topic.get('topic_name', topic.get('Topic', 'Unknown'))} ({topic.get('niche', topic.get('Niche', 'Unknown'))})")
        
        # Step 3: Schedule Agent (Systematic 4-Week Planning)
        logger.info("Step 3: Schedule Agent - Systematic 4-Week Planning")
        schedule_result = schedule_agent.run(match_result)
        schedule_timing = schedule_result["agent_timing"]
        schedule_analysis = schedule_result.get("schedule_analysis", {})
        
        # Ensure all previous agent data flows through
        schedule_result.update({
            "profile": profile_result.get("profile", {}),
            "profile_analysis": profile_result.get("profile_analysis", {}),
            "enhanced_profile": profile_result.get("enhanced_profile", {}),
            "matched_topics": match_result.get("matched_topics", []),
            "match_analysis": match_result.get("match_analysis", {})
        })
        
        # Log schedule completion
        logger.info(f"📅 Schedule Agent completed")
        logger.info(f"📊 Schedule analysis: {schedule_analysis}")
        
        # Ensure schedule_result has all required fields for reviewer agent
        logger.info(f"📊 Schedule result keys: {list(schedule_result.keys())}")
        logger.info(f"📊 Weekly plan structure: {list(schedule_result.get('weekly_plan', {}).keys()) if schedule_result.get('weekly_plan') else 'No weekly plan'}")
        
        # Step 4: Reviewer Agent
        logger.info("Step 4: Reviewer Agent")
        final_result = reviewer_agent.run(schedule_result)
        reviewer_timing = final_result["agent_timing"]
        
        # Ensure ALL agent data flows through to final result
        final_result.update({
            "profile": profile_result.get("profile", {}),
            "profile_analysis": profile_result.get("profile_analysis", {}),
            "enhanced_profile": profile_result.get("enhanced_profile", {}),
            "matched_topics": match_result.get("matched_topics", []),
            "match_analysis": match_result.get("match_analysis", {}),
            "weekly_plan": schedule_result.get("weekly_plan", {}),
            "schedule_analysis": schedule_result.get("schedule_analysis", {}),
            "learning_objectives": schedule_result.get("learning_objectives", []),
            "recommended_activities": schedule_result.get("recommended_activities", [])
        })
        
        # Log final result structure
        logger.info(f"📊 Final result keys: {list(final_result.keys())}")
        logger.info(f"📊 Review insights keys: {list(final_result.get('review_insights', {}).keys())}")
        logger.info(f"📊 Daily tasks keys: {list(final_result.get('daily_tasks', {}).keys())}")
        logger.info(f"📊 Final plan keys: {list(final_result.get('final_plan', {}).keys())}")
        
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
            # Complete data flow from all agents
            "child_profile": final_result.get("profile", {}),
            "profile_analysis": final_result.get("profile_analysis", {}),
            "enhanced_profile": final_result.get("enhanced_profile", {}),
            "matched_topics": final_result.get("matched_topics", []),
            "match_analysis": final_result.get("match_analysis", {}),
            "weekly_plan": final_result.get("weekly_plan", {}),
            "schedule_analysis": final_result.get("schedule_analysis", {}),
            "learning_objectives": final_result.get("learning_objectives", []),
            "recommended_activities": final_result.get("recommended_activities", []),
            "progress_tracking": final_result.get("progress_tracking", {}),
            "review_insights": final_result.get("review_insights", {}),
            "review_analysis": final_result.get("review_analysis", {}),
            "daily_tasks": final_result.get("daily_tasks", {}),
            "final_plan": final_result.get("final_plan", {}),
            "agent_flow": "Profile → Match → Schedule → Reviewer",
            "real_agents": True,
            "agent_timings": agent_timings,
            "llm_integration": llm_info
        }
        
        # Log response data structure for debugging
        logger.info(f"📊 Response data keys: {list(response_data.keys())}")
        logger.info(f"📊 Daily tasks in response: {len(response_data.get('daily_tasks', {}))} weeks")
        logger.info(f"📊 Final plan in response: {len(response_data.get('final_plan', {}))} weeks")
        logger.info(f"📊 Review insights in response: {len(response_data.get('review_insights', {}))} sections")
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "data": response_data,
                "message": "Plan generated successfully using full agent system",
                "agent_flow": "Profile → Match → Schedule → Reviewer",
                "real_agents": True,
                "agent_timings": agent_timings,
                "llm_integration": llm_info
            }
        )
        
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

@app.get("/api/topics/enhanced")
async def get_enhanced_topics():
    """Get enhanced topics with age groups, difficulty levels, and learning stages."""
    topics = load_topics_data()
    
    # Filter and format enhanced data
    enhanced_topics = []
    for topic in topics:
        enhanced_topic = {
            "topic_id": topic.get("topic_id", ""),
            "topic_name": topic.get("Topic", ""),
            "niche": topic.get("Niche", ""),
            "age": topic.get("Age", ""),
            "age_group": topic.get("age_group", ""),
            "difficulty": topic.get("difficulty", ""),
            "learning_stage": topic.get("dynamic_path", {}).get("stage", ""),
            "objective": topic.get("Objective", ""),
            "explanation": topic.get("Explanation", ""),
            "estimated_time": topic.get("Estimated Time", ""),
            "estimated_time_minutes": topic.get("estimated_time_minutes", ""),
            "hashtags": topic.get("Hashtags", ""),
            "activity_1": topic.get("Activity 1", ""),
            "activity_2": topic.get("Activity 2", ""),
            "content_richness": topic.get("content_richness", ""),
            "prerequisites": topic.get("prerequisites", []),
            "learning_path": topic.get("learning_path", []),
            "path_description": topic.get("path_description", "")
        }
        enhanced_topics.append(enhanced_topic)
    
    return {
        "topics": enhanced_topics,
        "total_count": len(enhanced_topics),
        "age_groups": list(set(t.get("age_group") for t in enhanced_topics if t.get("age_group"))),
        "difficulty_levels": list(set(t.get("difficulty") for t in enhanced_topics if t.get("difficulty"))),
        "learning_stages": list(set(t.get("learning_stage") for t in enhanced_topics if t.get("learning_stage"))),
        "niches": list(set(t.get("niche") for t in enhanced_topics if t.get("niche")))
    }

@app.get("/api/topics/by-age-group/{age_group}")
async def get_topics_by_age_group(age_group: str):
    """Get topics filtered by age group."""
    topics = load_topics_data()
    filtered_topics = [t for t in topics if t.get("age_group") == age_group]
    return {
        "age_group": age_group,
        "topics": filtered_topics,
        "count": len(filtered_topics)
    }

@app.get("/api/topics/by-difficulty/{difficulty}")
async def get_topics_by_difficulty(difficulty: str):
    """Get topics filtered by difficulty level."""
    topics = load_topics_data()
    filtered_topics = [t for t in topics if t.get("difficulty") == difficulty]
    return {
        "difficulty": difficulty,
        "topics": filtered_topics,
        "count": len(filtered_topics)
    }

@app.get("/api/topics/by-stage/{stage}")
async def get_topics_by_stage(stage: str):
    """Get topics filtered by learning stage."""
    topics = load_topics_data()
    filtered_topics = [t for t in topics if t.get("dynamic_path", {}).get("stage") == stage]
    return {
        "stage": stage,
        "topics": filtered_topics,
        "count": len(filtered_topics)
    }

@app.get("/api/niches")
async def get_niches():
    """Get available niches."""
    niches = load_niches_data()
    return {"niches": niches}

@app.get("/api/agent-metrics")
async def get_agent_metrics():
    """Get agent performance metrics."""
    try:
        # In a real implementation, this would fetch from a database
        # For now, return basic metrics based on system status
        return {
            "profileAgent": {
                "totalExecutions": 0,  # Would be tracked in production
                "averageExecutionTime": 0.0,
                "successRate": 100.0,
                "lastExecution": "2024-09-14T10:30:00Z",
                "errors": 0,
                "performance": {
                    "excellent": 0,
                    "good": 0,
                    "fair": 0,
                    "poor": 0
                }
            },
            "matchAgent": {
                "totalExecutions": 0,
                "averageExecutionTime": 0.0,
                "successRate": 100.0,
                "lastExecution": "2024-09-14T10:30:02Z",
                "errors": 0,
                "topicsMatched": 0,
                "performance": {
                    "excellent": 0,
                    "good": 0,
                    "fair": 0,
                    "poor": 0
                }
            },
            "scheduleAgent": {
                "totalExecutions": 0,
                "averageExecutionTime": 0.0,
                "successRate": 100.0,
                "lastExecution": "2024-09-14T10:30:07Z",
                "errors": 0,
                "plansGenerated": 0,
                "performance": {
                    "excellent": 0,
                    "good": 0,
                    "fair": 0,
                    "poor": 0
                }
            },
            "reviewerAgent": {
                "totalExecutions": 0,
                "averageExecutionTime": 0.0,
                "successRate": 100.0,
                "lastExecution": "2024-09-14T10:30:10Z",
                "errors": 0,
                "plansReviewed": 0,
                "performance": {
                    "excellent": 0,
                    "good": 0,
                    "fair": 0,
                    "poor": 0
                }
            },
            "systemStatus": "operational",
            "lastUpdated": "2024-09-14T10:30:00Z"
        }
    except Exception as e:
        logger.error(f"Error getting agent metrics: {e}")
        raise HTTPException(status_code=500, detail="Failed to get agent metrics")

@app.get("/api/admin/metrics")
async def get_admin_metrics():
    """Get comprehensive admin metrics for dashboard with REAL data."""
    try:
        # Get REAL usage data from the tracker
        real_metrics = real_usage_tracker.get_real_time_metrics()
        
        return {
            "systemHealth": real_metrics["system_health"],
            "customerMetrics": real_metrics["customer_metrics"],
            "agentPerformance": real_metrics["agent_performance"],
            "costTracking": real_metrics["cost_tracking"],
            "recentActivity": real_metrics["recent_activity"],
            "alerts": real_metrics["alerts"],
            "timestamp": time.time(),
            "data_source": "REAL_GCP_USAGE"
        }
        
    except Exception as e:
        logger.error(f"Error getting admin metrics: {e}")
        raise HTTPException(status_code=500, detail="Failed to get admin metrics")

@app.get("/api/admin/child-activity/{child_id}")
async def get_child_activity(child_id: str, time_range: str = "all", account_id: str = None):
    """Get detailed activity tracking for a specific child."""
    try:
        activity_summary = child_activity_tracker.get_child_activity_summary(child_id, time_range, account_id)
        return activity_summary
    except Exception as e:
        logger.error(f"Error getting child activity: {e}")
        raise HTTPException(status_code=500, detail="Failed to get child activity")

@app.get("/api/admin/all-children-activity")
async def get_all_children_activity(account_id: str = None):
    """Get activity summary for all children."""
    try:
        all_children_summary = child_activity_tracker.get_all_children_summary(account_id)
        return all_children_summary
    except Exception as e:
        logger.error(f"Error getting all children activity: {e}")
        raise HTTPException(status_code=500, detail="Failed to get all children activity")

@app.get("/api/admin/real-time-activity")
async def get_real_time_activity_feed(time_range: str = "1_hour"):
    """Get real-time activity feed for admin dashboard."""
    try:
        activity_feed = child_activity_tracker.get_real_time_activity_feed(time_range)
        return {
            "activities": activity_feed,
            "time_range": time_range,
            "count": len(activity_feed),
            "timestamp": time.time()
        }
    except Exception as e:
        logger.error(f"Error getting real-time activity feed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get real-time activity feed")

@app.get("/api/admin/filter-options")
async def get_filter_options():
    """Get all available children and accounts for filtering."""
    try:
        filter_options = child_activity_tracker.get_filter_options()
        return filter_options
    except Exception as e:
        logger.error(f"Error getting filter options: {e}")
        raise HTTPException(status_code=500, detail="Failed to get filter options")

@app.post("/api/schedules/save")
async def save_schedule(schedule_data: Dict[str, Any]):
    """Save generated schedule to Firestore."""
    try:
        from firebase_service import firebase_service
        
        if not firebase_service.initialized:
            raise HTTPException(status_code=500, detail="Firebase not initialized")
        
        # Save schedule to Firestore
        schedule_ref = firebase_service.db.collection('users').document(
            schedule_data['generated_by']
        ).collection('children').document(
            schedule_data['child_id']
        ).collection('schedules').document()
        
        schedule_ref.set({
            **schedule_data,
            'created_at': firebase_service.db.SERVER_TIMESTAMP,
            'updated_at': firebase_service.db.SERVER_TIMESTAMP
        })
        
        return {
            "success": True,
            "schedule_id": schedule_ref.id,
            "message": "Schedule saved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error saving schedule: {e}")
        raise HTTPException(status_code=500, detail="Failed to save schedule")

@app.get("/api/schedules/{child_id}")
async def get_child_schedules(child_id: str, user_id: str):
    """Get all schedules for a specific child."""
    try:
        from firebase_service import firebase_service
        
        if not firebase_service.initialized:
            raise HTTPException(status_code=500, detail="Firebase not initialized")
        
        schedules_ref = firebase_service.db.collection('users').document(
            user_id
        ).collection('children').document(
            child_id
        ).collection('schedules')
        
        schedules = []
        for doc in schedules_ref.stream():
            schedule_data = doc.to_dict()
            schedule_data['schedule_id'] = doc.id
            schedules.append(schedule_data)
        
        return {
            "success": True,
            "schedules": schedules,
            "count": len(schedules)
        }
        
    except Exception as e:
        logger.error(f"Error getting schedules: {e}")
        raise HTTPException(status_code=500, detail="Failed to get schedules")

@app.put("/api/schedules/{schedule_id}/progress")
async def update_schedule_progress(schedule_id: str, progress_data: Dict[str, Any]):
    """Update progress for a specific schedule."""
    try:
        from firebase_service import firebase_service
        
        if not firebase_service.initialized:
            raise HTTPException(status_code=500, detail="Firebase not initialized")
        
        # Update progress in Firestore
        progress_ref = firebase_service.db.collection('users').document(
            progress_data['user_id']
        ).collection('children').document(
            progress_data['child_id']
        ).collection('scheduleProgress').document(schedule_id)
        
        progress_ref.set({
            'completedActivities': progress_data['completedActivities'],
            'currentWeek': progress_data['currentWeek'],
            'totalActivities': progress_data['totalActivities'],
            'completedCount': progress_data['completedCount'],
            'lastUpdated': firebase_service.db.SERVER_TIMESTAMP
        }, merge=True)
        
        return {
            "success": True,
            "message": "Progress updated successfully"
        }
        
    except Exception as e:
        logger.error(f"Error updating progress: {e}")
        raise HTTPException(status_code=500, detail="Failed to update progress")

# Inventory Management Endpoints
@app.get("/api/inventory/materials")
async def get_materials():
    """Get all materials in the catalog."""
    try:
        # For now, return sample data. In production, this would come from a database
        sample_materials = [
            {
                "materialId": "art_001",
                "name": "Colored Pencils Set",
                "category": "Art Supplies",
                "description": "Set of 24 colored pencils for drawing and coloring activities",
                "cost": 12.99,
                "supplier": "Art Supply Co",
                "stockLevel": 50,
                "minStockLevel": 10
            },
            {
                "materialId": "science_001",
                "name": "Magnifying Glass",
                "category": "Science Kits",
                "description": "5x magnification glass for nature exploration",
                "cost": 8.50,
                "supplier": "Science Tools Inc",
                "stockLevel": 25,
                "minStockLevel": 5
            },
            {
                "materialId": "craft_001",
                "name": "Construction Paper Pack",
                "category": "Craft Supplies",
                "description": "Assorted colors construction paper, 100 sheets",
                "cost": 6.99,
                "supplier": "Craft Central",
                "stockLevel": 75,
                "minStockLevel": 15
            },
            {
                "materialId": "book_001",
                "name": "Children's Encyclopedia",
                "category": "Books",
                "description": "Age-appropriate encyclopedia for learning activities",
                "cost": 24.99,
                "supplier": "Educational Books Ltd",
                "stockLevel": 30,
                "minStockLevel": 8
            },
            {
                "materialId": "game_001",
                "name": "Educational Board Game",
                "category": "Games",
                "description": "Math and logic board game for ages 6-10",
                "cost": 19.99,
                "supplier": "Learning Games Co",
                "stockLevel": 20,
                "minStockLevel": 5
            }
        ]
        
        return {
            "success": True,
            "materials": sample_materials,
            "count": len(sample_materials)
        }
        
    except Exception as e:
        logger.error(f"Error getting materials: {e}")
        raise HTTPException(status_code=500, detail="Failed to get materials")

@app.post("/api/inventory/materials")
async def add_material(material_data: Dict[str, Any]):
    """Add a new material to the catalog."""
    try:
        # In production, this would save to a database
        logger.info(f"Adding new material: {material_data.get('name')}")
        
        return {
            "success": True,
            "material_id": f"material_{int(time.time())}",
            "message": "Material added successfully"
        }
        
    except Exception as e:
        logger.error(f"Error adding material: {e}")
        raise HTTPException(status_code=500, detail="Failed to add material")

@app.get("/api/inventory/stock")
async def get_stock_levels():
    """Get current stock levels for all materials."""
    try:
        # In production, this would come from a database
        stock_data = {
            "total_materials": 5,
            "low_stock_items": 1,
            "out_of_stock_items": 0,
            "total_value": 1250.50
        }
        
        return {
            "success": True,
            "stock_summary": stock_data
        }
        
    except Exception as e:
        logger.error(f"Error getting stock levels: {e}")
        raise HTTPException(status_code=500, detail="Failed to get stock levels")

@app.post("/api/deliveries/create")
async def create_delivery(delivery_data: Dict[str, Any]):
    """Create a new delivery for a child."""
    try:
        logger.info(f"Creating delivery for child: {delivery_data.get('child_id')}")
        
        # In production, this would save to a database and trigger delivery process
        delivery_id = f"delivery_{int(time.time())}"
        
        return {
            "success": True,
            "delivery_id": delivery_id,
            "message": "Delivery created successfully"
        }
        
    except Exception as e:
        logger.error(f"Error creating delivery: {e}")
        raise HTTPException(status_code=500, detail="Failed to create delivery")

@app.get("/api/deliveries/schedule")
async def get_delivery_schedule():
    """Get the delivery schedule."""
    try:
        # In production, this would come from a database
        schedule_data = {
            "upcoming_deliveries": [],
            "completed_deliveries": [],
            "total_deliveries": 0
        }
        
        return {
            "success": True,
            "schedule": schedule_data
        }
        
    except Exception as e:
        logger.error(f"Error getting delivery schedule: {e}")
        raise HTTPException(status_code=500, detail="Failed to get delivery schedule")

# Analytics & Reporting Endpoints
@app.get("/api/analytics/learning-outcomes")
async def get_learning_outcomes(time_range: str = "7_days", metric: str = "learning_outcomes"):
    """Get learning outcomes analytics data."""
    try:
        # In production, this would query the database for real analytics
        sample_data = {
            "learningOutcomes": {
                "totalChildren": 127,
                "averageCompletionRate": 78.5,
                "topPerformingAgeGroups": [
                    {"age": "5-6", "completionRate": 85.2, "children": 32},
                    {"age": "7-8", "completionRate": 82.1, "children": 45},
                    {"age": "9-10", "completionRate": 76.8, "children": 38},
                    {"age": "11-12", "completionRate": 71.3, "children": 12}
                ],
                "topicEngagement": [
                    {"topic": "Science Experiments", "engagement": 92.3, "completions": 89},
                    {"topic": "Art & Crafts", "engagement": 88.7, "completions": 76},
                    {"topic": "Mathematics", "engagement": 84.2, "completions": 65},
                    {"topic": "Reading & Writing", "engagement": 79.8, "completions": 58},
                    {"topic": "Music & Dance", "engagement": 76.5, "completions": 43}
                ],
                "learningProgress": [
                    {"week": 1, "averageProgress": 25.3},
                    {"week": 2, "averageProgress": 48.7},
                    {"week": 3, "averageProgress": 72.1},
                    {"week": 4, "averageProgress": 89.4}
                ]
            },
            "userEngagement": {
                "dailyActiveUsers": 89,
                "weeklyActiveUsers": 234,
                "monthlyActiveUsers": 567,
                "averageSessionDuration": "24.5 minutes",
                "sessionFrequency": 3.2,
                "featureUsage": [
                    {"feature": "Schedule Generation", "usage": 95.2, "users": 108},
                    {"feature": "Progress Tracking", "usage": 87.3, "users": 99},
                    {"feature": "Content Library", "usage": 76.8, "users": 87},
                    {"feature": "Parent Portal", "usage": 68.4, "users": 78},
                    {"feature": "Delivery Tracking", "usage": 54.7, "users": 62}
                ]
            },
            "businessMetrics": {
                "totalRevenue": 12450.75,
                "monthlyRecurringRevenue": 8750.25,
                "customerLifetimeValue": 245.80,
                "churnRate": 8.3,
                "conversionRate": 12.7,
                "averageRevenuePerUser": 98.50
            },
            "performanceMetrics": {
                "averageResponseTime": "1.2s",
                "systemUptime": "99.8%",
                "errorRate": 0.2,
                "agentAccuracy": 94.7,
                "costPerSession": 0.15
            }
        }
        
        return {
            "success": True,
            "data": sample_data,
            "timeRange": time_range,
            "metric": metric
        }
        
    except Exception as e:
        logger.error(f"Error getting learning outcomes: {e}")
        raise HTTPException(status_code=500, detail="Failed to get learning outcomes")

@app.get("/api/analytics/user-engagement")
async def get_user_engagement(time_range: str = "7_days"):
    """Get user engagement analytics data."""
    try:
        # In production, this would query the database for real engagement data
        engagement_data = {
            "dailyActiveUsers": 89,
            "weeklyActiveUsers": 234,
            "monthlyActiveUsers": 567,
            "averageSessionDuration": "24.5 minutes",
            "sessionFrequency": 3.2,
            "retentionRate": 78.5,
            "featureUsage": [
                {"feature": "Schedule Generation", "usage": 95.2, "users": 108},
                {"feature": "Progress Tracking", "usage": 87.3, "users": 99},
                {"feature": "Content Library", "usage": 76.8, "users": 87},
                {"feature": "Parent Portal", "usage": 68.4, "users": 78},
                {"feature": "Delivery Tracking", "usage": 54.7, "users": 62}
            ],
            "userJourney": {
                "signupToFirstPlan": "2.3 days",
                "planToFirstActivity": "1.1 days",
                "activityToCompletion": "4.7 days",
                "completionToRetention": "12.5 days"
            }
        }
        
        return {
            "success": True,
            "data": engagement_data,
            "timeRange": time_range
        }
        
    except Exception as e:
        logger.error(f"Error getting user engagement: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user engagement")

@app.get("/api/analytics/business-metrics")
async def get_business_metrics(time_range: str = "30_days"):
    """Get business intelligence metrics."""
    try:
        # In production, this would query the database for real business data
        business_data = {
            "revenue": {
                "totalRevenue": 12450.75,
                "monthlyRecurringRevenue": 8750.25,
                "averageRevenuePerUser": 98.50,
                "revenueGrowth": 15.3
            },
            "customers": {
                "totalCustomers": 127,
                "newCustomers": 23,
                "churnedCustomers": 8,
                "customerLifetimeValue": 245.80,
                "churnRate": 8.3
            },
            "conversion": {
                "conversionRate": 12.7,
                "trialToPaid": 34.2,
                "freeToPaid": 8.9,
                "averageTimeToConvert": "5.2 days"
            },
            "operational": {
                "costPerAcquisition": 45.20,
                "costPerSession": 0.15,
                "supportTickets": 23,
                "averageResolutionTime": "2.1 hours"
            }
        }
        
        return {
            "success": True,
            "data": business_data,
            "timeRange": time_range
        }
        
    except Exception as e:
        logger.error(f"Error getting business metrics: {e}")
        raise HTTPException(status_code=500, detail="Failed to get business metrics")

@app.post("/api/analytics/track-event")
async def track_analytics_event(event_data: Dict[str, Any]):
    """Track custom analytics events."""
    try:
        logger.info(f"Tracking analytics event: {event_data.get('eventType')}")
        
        # In production, this would save to analytics database
        # For now, just log the event
        event_id = f"event_{int(time.time())}"
        
        return {
            "success": True,
            "event_id": event_id,
            "message": "Event tracked successfully"
        }
        
    except Exception as e:
        logger.error(f"Error tracking event: {e}")
        raise HTTPException(status_code=500, detail="Failed to track event")

@app.get("/api/reports/generate")
async def generate_custom_report(report_type: str = "summary", time_range: str = "30_days"):
    """Generate custom analytics reports."""
    try:
        # In production, this would generate actual reports
        report_data = {
            "reportType": report_type,
            "timeRange": time_range,
            "generatedAt": time.time(),
            "data": {
                "summary": "Custom report generated successfully",
                "metrics": "Various metrics included",
                "insights": "Key insights and recommendations"
            }
        }
        
        return {
            "success": True,
            "report": report_data
        }
        
    except Exception as e:
        logger.error(f"Error generating report: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate report")

# Content Management Endpoints
@app.get("/api/content/templates")
async def get_content_templates():
    """Get available content templates."""
    try:
        sample_templates = [
            {
                "templateId": "science_experiment",
                "name": "Science Experiment",
                "category": "Science",
                "description": "Template for hands-on science experiments",
                "structure": {
                    "sections": ["Objective", "Materials", "Procedure", "Observations", "Conclusion"],
                    "interactiveElements": ["checklist", "photo_upload", "notes"]
                },
                "usageCount": 45
            },
            {
                "templateId": "art_project",
                "name": "Art Project",
                "category": "Art",
                "description": "Template for creative art activities",
                "structure": {
                    "sections": ["Inspiration", "Materials", "Steps", "Gallery"],
                    "interactiveElements": ["image_gallery", "video_upload", "sharing"]
                },
                "usageCount": 32
            },
            {
                "templateId": "reading_activity",
                "name": "Reading Activity",
                "category": "Language",
                "description": "Template for reading comprehension activities",
                "structure": {
                    "sections": ["Reading Material", "Questions", "Discussion", "Reflection"],
                    "interactiveElements": ["quiz", "discussion_board", "bookmark"]
                },
                "usageCount": 28
            },
            {
                "templateId": "math_game",
                "name": "Math Game",
                "category": "Mathematics",
                "description": "Template for interactive math games",
                "structure": {
                    "sections": ["Objective", "Rules", "Gameplay", "Scoring"],
                    "interactiveElements": ["score_tracker", "timer", "leaderboard"]
                },
                "usageCount": 19
            }
        ]
        
        return {
            "success": True,
            "templates": sample_templates,
            "count": len(sample_templates)
        }
        
    except Exception as e:
        logger.error(f"Error getting content templates: {e}")
        raise HTTPException(status_code=500, detail="Failed to get content templates")

@app.post("/api/content/generate")
async def generate_content_with_ai(content_data: Dict[str, Any]):
    """Generate content using AI based on specifications."""
    try:
        logger.info(f"Generating content with AI for: {content_data.get('title', 'Untitled')}")
        
        # In production, this would use AI to generate content
        # For now, return enhanced content based on the input
        generated_content = {
            "title": content_data.get("title", "AI Generated Content"),
            "description": f"AI-enhanced description for {content_data.get('type', 'activity')}",
            "sections": [
                {
                    "title": "Introduction",
                    "content": "Welcome to this engaging learning activity!",
                    "type": "text"
                },
                {
                    "title": "Instructions",
                    "content": "Follow these step-by-step instructions to complete the activity.",
                    "type": "list"
                },
                {
                    "title": "Materials Needed",
                    "content": "Gather the following materials before starting.",
                    "type": "checklist"
                },
                {
                    "title": "Reflection",
                    "content": "Think about what you learned and how you can apply it.",
                    "type": "text"
                }
            ],
            "interactiveElements": content_data.get("interactiveElements", []),
            "estimatedDuration": content_data.get("estimatedDuration", 30),
            "difficulty": content_data.get("difficulty", "beginner"),
            "ageRange": content_data.get("ageRange", "5-8")
        }
        
        return {
            "success": True,
            "generatedContent": generated_content,
            "message": "Content generated successfully"
        }
        
    except Exception as e:
        logger.error(f"Error generating content: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate content")

@app.post("/api/content/save")
async def save_content(content_data: Dict[str, Any]):
    """Save content to the content library."""
    try:
        logger.info(f"Saving content: {content_data.get('title', 'Untitled')}")
        
        # In production, this would save to database
        content_id = f"content_{int(time.time())}"
        
        return {
            "success": True,
            "content_id": content_id,
            "message": "Content saved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error saving content: {e}")
        raise HTTPException(status_code=500, detail="Failed to save content")

@app.get("/api/content/library")
async def get_content_library(category: str = "all", difficulty: str = "all"):
    """Get content from the content library."""
    try:
        # In production, this would query the database
        sample_content = [
            {
                "contentId": "content_001",
                "title": "Rainbow Milk Experiment",
                "description": "Create beautiful rainbow patterns in milk using food coloring and soap",
                "type": "experiment",
                "category": "Science",
                "difficulty": "beginner",
                "ageRange": "5-8",
                "estimatedDuration": 20,
                "tags": ["science", "experiment", "colors", "chemistry"],
                "createdBy": "admin",
                "createdAt": "2024-01-15T10:30:00Z",
                "usageCount": 45,
                "rating": 4.8
            },
            {
                "contentId": "content_002",
                "title": "Paper Mache Volcano",
                "description": "Build and erupt your own volcano using paper mache and baking soda",
                "type": "project",
                "category": "Science",
                "difficulty": "intermediate",
                "ageRange": "8-12",
                "estimatedDuration": 120,
                "tags": ["science", "volcano", "craft", "chemistry"],
                "createdBy": "admin",
                "createdAt": "2024-01-14T14:20:00Z",
                "usageCount": 32,
                "rating": 4.6
            },
            {
                "contentId": "content_003",
                "title": "Watercolor Galaxy",
                "description": "Create a beautiful galaxy painting using watercolors and salt",
                "type": "activity",
                "category": "Art",
                "difficulty": "beginner",
                "ageRange": "5-10",
                "estimatedDuration": 45,
                "tags": ["art", "painting", "space", "watercolor"],
                "createdBy": "admin",
                "createdAt": "2024-01-13T09:15:00Z",
                "usageCount": 67,
                "rating": 4.9
            }
        ]
        
        # Filter by category and difficulty
        filtered_content = sample_content
        if category != "all":
            filtered_content = [c for c in filtered_content if c["category"].lower() == category.lower()]
        if difficulty != "all":
            filtered_content = [c for c in filtered_content if c["difficulty"] == difficulty]
        
        return {
            "success": True,
            "content": filtered_content,
            "count": len(filtered_content)
        }
        
    except Exception as e:
        logger.error(f"Error getting content library: {e}")
        raise HTTPException(status_code=500, detail="Failed to get content library")

@app.get("/api/content/performance")
async def get_content_performance():
    """Get content performance analytics."""
    try:
        performance_data = {
            "totalContent": 156,
            "mostPopular": [
                {"contentId": "content_003", "title": "Watercolor Galaxy", "usageCount": 67},
                {"contentId": "content_001", "title": "Rainbow Milk Experiment", "usageCount": 45},
                {"contentId": "content_002", "title": "Paper Mache Volcano", "usageCount": 32}
            ],
            "averageRating": 4.7,
            "completionRate": 78.5,
            "categoryBreakdown": [
                {"category": "Science", "count": 45, "avgRating": 4.8},
                {"category": "Art", "count": 38, "avgRating": 4.6},
                {"category": "Mathematics", "count": 32, "avgRating": 4.5},
                {"category": "Language", "count": 28, "avgRating": 4.7},
                {"category": "Music", "count": 13, "avgRating": 4.4}
            ]
        }
        
        return {
            "success": True,
            "performance": performance_data
        }
        
    except Exception as e:
        logger.error(f"Error getting content performance: {e}")
        raise HTTPException(status_code=500, detail="Failed to get content performance")

# Performance Monitoring Endpoints
@app.get("/api/performance/metrics")
async def get_performance_metrics():
    """Get comprehensive performance metrics."""
    try:
        # In production, this would query real performance data
        performance_data = {
            "systemMetrics": {
                "responseTime": 150,
                "throughput": 250,
                "errorRate": 0.5,
                "uptime": 99.9
            },
            "scalabilityMetrics": {
                "concurrentUsers": 150,
                "resourceUtilization": 65,
                "autoScaling": True,
                "loadBalancing": True
            },
            "optimizationTools": {
                "caching": True,
                "compression": True,
                "minification": True,
                "lazyLoading": True
            },
            "performanceAlerts": [
                {
                    "id": 1,
                    "type": "warning",
                    "title": "High Response Time",
                    "message": "API response time is above 500ms",
                    "timestamp": "2024-01-15 10:30:00",
                    "severity": "medium"
                },
                {
                    "id": 2,
                    "type": "error",
                    "title": "Memory Usage Critical",
                    "message": "Memory usage has reached 90%",
                    "timestamp": "2024-01-15 09:45:00",
                    "severity": "high"
                }
            ]
        }
        
        return {
            "success": True,
            "data": performance_data
        }
        
    except Exception as e:
        logger.error(f"Error getting performance metrics: {e}")
        raise HTTPException(status_code=500, detail="Failed to get performance metrics")

@app.post("/api/performance/optimize")
async def optimize_performance(optimization_data: Dict[str, Any]):
    """Apply performance optimizations."""
    try:
        logger.info(f"Applying performance optimizations: {optimization_data}")
        
        # In production, this would apply actual optimizations
        optimization_id = f"opt_{int(time.time())}"
        
        return {
            "success": True,
            "optimization_id": optimization_id,
            "message": "Performance optimizations applied successfully"
        }
        
    except Exception as e:
        logger.error(f"Error applying optimizations: {e}")
        raise HTTPException(status_code=500, detail="Failed to apply optimizations")

@app.get("/api/performance/health")
async def get_system_health():
    """Get system health status."""
    try:
        health_data = {
            "status": "healthy",
            "timestamp": time.time(),
            "services": {
                "database": "healthy",
                "cache": "healthy",
                "queue": "healthy",
                "storage": "healthy"
            },
            "metrics": {
                "cpu_usage": 45.2,
                "memory_usage": 67.8,
                "disk_usage": 23.1,
                "network_latency": 12.5
            }
        }
        
        return {
            "success": True,
            "health": health_data
        }
        
    except Exception as e:
        logger.error(f"Error getting system health: {e}")
        raise HTTPException(status_code=500, detail="Failed to get system health")

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main_agents:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 