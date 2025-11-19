"""
LLM-Powered Profile Agent for Module 3
Uses Gemini AI to analyze child profiles and enrich minimal information
"""

import time
import logging
import json
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

def run_profile_agent(state: Dict[str, Any], llm_model=None) -> Dict[str, Any]:
    """
    LLM-Powered Profile Agent that enriches child profiles using AI.
    Takes minimal customer input and generates comprehensive child profile.
    """
    start_time = time.time()
    logger.info("🔍 Profile Agent: Starting AI-powered profile enrichment")
    
    # Initialize LLM tracking
    llm_calls = []
    
    try:
        # Extract profile data
        profile = state.get("profile", {})
        if not profile:
            raise ValueError("No profile data provided")
        
        # Extract profile fields (support both age and child_age)
        child_name = profile.get("child_name", "Child")
        child_age = int(profile.get("child_age") or profile.get("age", 7))
        interests = profile.get("interests", [])
        learning_style = profile.get("preferred_learning_style", "visual")
        plan_type = profile.get("plan_type", "hybrid")
        
        # Validate that we have meaningful data
        if not child_name or child_age < 2 or child_age > 18:
            raise ValueError(f"Invalid profile data: name={child_name}, age={child_age}")
        
        logger.info(f"👤 AI-enriching profile for {child_name} (Age: {child_age})")
        
        # Use LLM to enrich the profile
        enriched_profile = _llm_enrich_profile(
            profile, llm_model, llm_calls
        )
        
        execution_time = time.time() - start_time
        logger.info(f"✅ Profile Agent: AI enrichment completed in {execution_time:.3f}s")
        
        # Aggregate LLM call details
        total_tokens = sum(call.get('tokens', 0) for call in llm_calls)
        llm_prompts = "\n\n---\n\n".join(call.get('prompt', '') for call in llm_calls)
        llm_responses = "\n\n---\n\n".join(call.get('response', '') for call in llm_calls)
        
        return {
            "profile": profile,
            "enriched_profile": enriched_profile,
            "agent_timing": {
                "execution_time_seconds": execution_time,
                "llm_used": True,
                "tokens_used": total_tokens,
                "llm_calls_count": len(llm_calls),
                "llm_prompt": llm_prompts,
                "llm_response": llm_responses,
                "llm_calls_detail": llm_calls
            }
        }
        
    except Exception as e:
        execution_time = time.time() - start_time
        logger.error(f"❌ Profile Agent failed: {str(e)}")
        
        # Still track LLM calls even on error
        total_tokens = sum(call.get('tokens', 0) for call in llm_calls)
        llm_prompts = "\n\n---\n\n".join(call.get('prompt', '') for call in llm_calls)
        llm_responses = "\n\n---\n\n".join(call.get('response', '') for call in llm_calls)
        
        return {
            "profile": state.get("profile", {}),
            "error": str(e),
            "agent_timing": {
                "execution_time_seconds": execution_time,
                "llm_used": len(llm_calls) > 0,
                "tokens_used": total_tokens,
                "llm_calls_count": len(llm_calls),
                "llm_prompt": llm_prompts,
                "llm_response": llm_responses,
                "llm_calls_detail": llm_calls
            }
        }

def _llm_enrich_profile(profile: Dict[str, Any], llm_model, llm_calls: List) -> Dict[str, Any]:
    """
    Use LLM to enrich minimal customer input into comprehensive child profile.
    """
    child_name = profile.get("child_name", "Child")
    child_age = int(profile.get("child_age") or profile.get("age", 7))
    interests = profile.get("interests", [])
    learning_style = profile.get("preferred_learning_style", "visual")
    plan_type = profile.get("plan_type", "hybrid")
    
    # Build LLM prompt
    prompt = f"""You are a child development expert and educational psychologist. Based on minimal parent input, create a comprehensive child learning profile.

PARENT INPUT:
- Child Name: {child_name}
- Age: {child_age} years old
- Interests: {', '.join(interests)}
- Learning Style: {learning_style}
- Plan Type: {plan_type}

TASK: Analyze this minimal information and generate a comprehensive enriched profile that will help personalize the child's learning plan.

Your analysis should include:
1. **Developmental Stage**: Cognitive, social, emotional, physical characteristics for age {child_age}
2. **Learning Characteristics**: Based on {learning_style} learning style, what are this child's strengths, preferences, and optimal learning methods?
3. **Interest Analysis**: Deep dive into interests ({', '.join(interests)}) - what do these interests reveal about the child? What related areas might they enjoy?
4. **Attention Span**: Realistic attention span for age {child_age} with {learning_style} learning style
5. **Learning Objectives**: 5-7 personalized learning objectives based on age, interests, and learning style
6. **Activity Recommendations**: Types of activities that would work best
7. **Parent Guidance**: How parents can best support this child's learning
8. **Engagement Strategies**: Specific strategies to keep this child engaged
9. **Success Indicators**: What success looks like for this child

Return ONLY valid JSON with this structure:
{{
  "developmental_stage": {{
    "cognitive_level": "string (e.g., concrete_operational, formal_operational)",
    "social_characteristics": ["list of social traits"],
    "emotional_characteristics": ["list of emotional traits"],
    "physical_capabilities": ["list of physical capabilities"]
  }},
  "learning_characteristics": {{
    "learning_style": "{learning_style}",
    "strengths": ["list of learning strengths"],
    "preferred_activities": ["list of preferred activity types"],
    "optimal_learning_methods": ["list of methods"]
  }},
  "interest_analysis": {{
    "primary_interests": {json.dumps(interests)},
    "interest_themes": ["broader themes these interests represent"],
    "related_areas": ["areas child might also enjoy"],
    "motivation_drivers": ["what motivates this child"]
  }},
  "attention_span": {{
    "typical_minutes": number,
    "optimal_session_length": number,
    "break_frequency_minutes": number,
    "focus_strategies": ["strategies to maintain focus"]
  }},
  "learning_objectives": [
    "Objective 1 based on interests and age",
    "Objective 2...",
    "... 5-7 total objectives"
  ],
  "activity_recommendations": {{
    "highly_suitable": ["list of activity types"],
    "moderately_suitable": ["list of activity types"],
    "avoid": ["activity types to avoid"]
  }},
  "parent_guidance": {{
    "parent_role": "string describing optimal parent role",
    "support_strategies": ["specific support strategies"],
    "communication_tips": ["how to communicate with this child"],
    "monitoring_approach": "string describing how to monitor progress"
  }},
  "engagement_strategies": [
    "Strategy 1 for this specific child",
    "Strategy 2...",
    "... 5-7 strategies"
  ],
  "success_indicators": [
    "Indicator 1 of successful learning",
    "Indicator 2...",
    "... 5-7 indicators"
  ],
  "enrichment_summary": "2-3 sentence summary of this child's unique learning profile"
}}

IMPORTANT: Return ONLY the JSON object, no other text."""
    
    try:
        logger.info("🤖 Calling Gemini AI to enrich child profile...")
        
        # Check if llm_model is None
        if llm_model is None:
            logger.error("❌ LLM model is None! Cannot call Gemini API.")
            raise ValueError("LLM model is None")
        
        # Call LLM
        response = llm_model.generate_content(prompt)
        response_text = response.text.strip()
        
        logger.info(f"✅ Got response from Gemini ({len(response_text)} chars)")
        
        # Parse JSON response
        enriched_data = json.loads(response_text)
        
        # Store this LLM call
        llm_calls.append({
            'call_name': 'profile_enrichment',
            'prompt': prompt,
            'response': response_text,
            'tokens': len(prompt.split()) + len(response_text.split())
        })
        
        logger.info("✅ Profile successfully enriched by AI")
        return enriched_data
        
    except json.JSONDecodeError as e:
        logger.error(f"❌ LLM returned invalid JSON: {e}")
        logger.error(f"Response was: {response_text[:500]}")
        
        # Store failed call
        llm_calls.append({
            'call_name': 'profile_enrichment_failed',
            'prompt': prompt,
            'response': response_text if 'response_text' in locals() else "No response",
            'tokens': len(prompt.split()),
            'error': str(e)
        })
        
        # Return basic enrichment on error
        return _get_basic_enrichment(profile)
    
    except Exception as e:
        logger.error(f"❌ LLM call failed: {e}")
        
        # Store failed call
        llm_calls.append({
            'call_name': 'profile_enrichment_error',
            'prompt': prompt,
            'response': f"Error: {str(e)}",
            'tokens': len(prompt.split()),
            'error': str(e)
        })
        
        # Return basic enrichment on error
        return _get_basic_enrichment(profile)

def _get_basic_enrichment(profile: Dict[str, Any]) -> Dict[str, Any]:
    """Fallback basic enrichment if LLM fails."""
    age = int(profile.get("child_age") or profile.get("age", 7))
    learning_style = profile.get("preferred_learning_style", "visual")
    interests = profile.get("interests", [])
    
    return {
        "developmental_stage": {
            "cognitive_level": "concrete_operational" if age <= 11 else "formal_operational",
            "social_characteristics": ["peer interaction", "cooperative learning"],
            "emotional_characteristics": ["growing independence", "self-awareness"],
            "physical_capabilities": ["fine motor skills", "coordination"]
        },
        "learning_characteristics": {
            "learning_style": learning_style,
            "strengths": [f"{learning_style} learning", "curiosity", "exploration"],
            "preferred_activities": ["interactive", "engaging", "age-appropriate"],
            "optimal_learning_methods": [f"{learning_style} aids", "hands-on", "practice"]
        },
        "interest_analysis": {
            "primary_interests": interests,
            "interest_themes": interests,
            "related_areas": interests,
            "motivation_drivers": ["curiosity", "achievement", "fun"]
        },
        "attention_span": {
            "typical_minutes": min(age * 2, 45),
            "optimal_session_length": min(age * 2, 30),
            "break_frequency_minutes": 15,
            "focus_strategies": ["variety", "breaks", "engaging content"]
        },
        "learning_objectives": [
            f"Explore {interests[0] if interests else 'various topics'}",
            "Develop critical thinking skills",
            "Build creativity and expression",
            "Enhance problem-solving abilities",
            "Foster curiosity and learning joy"
        ],
        "activity_recommendations": {
            "highly_suitable": [f"{learning_style} activities", "interactive games", "projects"],
            "moderately_suitable": ["reading", "discussion", "exploration"],
            "avoid": ["overly abstract", "too long", "passive watching"]
        },
        "parent_guidance": {
            "parent_role": "supportive guide and facilitator",
            "support_strategies": ["encouragement", "guidance", "observation"],
            "communication_tips": ["open questions", "active listening", "positive feedback"],
            "monitoring_approach": "observe engagement and enjoyment"
        },
        "engagement_strategies": [
            "Keep sessions short and varied",
            "Use lots of encouragement",
            "Make learning fun and interactive",
            "Connect to child's interests",
            "Celebrate small wins"
        ],
        "success_indicators": [
            "Child shows enthusiasm for activities",
            "Asks questions and shows curiosity",
            "Completes activities willingly",
            "Demonstrates understanding",
            "Looks forward to learning time"
        ],
        "enrichment_summary": f"A {age}-year-old {learning_style} learner interested in {', '.join(interests)}. Best suited for interactive, engaging activities with frequent variety and encouragement."
        }

def _analyze_child_profile(profile: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze child profile and extract key insights."""
    child_age = int(profile.get("age", 7))
    interests = profile.get("interests", ["AI"])
    learning_style = profile.get("preferred_learning_style", "visual")
    
    # Age-based analysis
    age_group = _categorize_age_group(child_age)
    developmental_stage = _assess_developmental_stage(child_age)
    
    # Interest analysis
    interest_categories = _categorize_interests(interests)
    interest_diversity = len(set(interest_categories))
    
    # Learning style analysis
    learning_style_characteristics = _analyze_learning_style(learning_style)
    
    # Attention span estimation
    attention_span = _estimate_attention_span(child_age, learning_style)
    
    return {
        "age_group": age_group,
        "developmental_stage": developmental_stage,
        "interest_categories": interest_categories,
        "interest_diversity_score": interest_diversity,
        "learning_style_characteristics": learning_style_characteristics,
        "attention_span": attention_span,
        "profile_completeness": _assess_profile_completeness(profile),
        "learning_potential": _assess_learning_potential(child_age, interests)
    }

def _categorize_age_group(age: int) -> str:
    """Categorize child into age group."""
    if age <= 3:
        return "toddler"
    elif age <= 5:
        return "preschooler"
    elif age <= 8:
        return "early_elementary"
    elif age <= 12:
        return "upper_elementary"
    else:
        return "middle_school"

def _assess_developmental_stage(age: int) -> Dict[str, Any]:
    """Assess child's developmental stage."""
    stages = {
        "toddler": {"cognitive": "sensorimotor", "social": "parallel_play", "physical": "gross_motor"},
        "preschooler": {"cognitive": "preoperational", "social": "cooperative_play", "physical": "fine_motor"},
        "early_elementary": {"cognitive": "concrete_operational", "social": "team_work", "physical": "coordination"},
        "upper_elementary": {"cognitive": "logical_thinking", "social": "peer_groups", "physical": "skills_mastery"},
        "middle_school": {"cognitive": "abstract_thinking", "social": "identity_formation", "physical": "adolescent_growth"}
    }
    
    age_group = _categorize_age_group(age)
    return stages.get(age_group, {"cognitive": "unknown", "social": "unknown", "physical": "unknown"})

def _categorize_interests(interests: List[str]) -> List[str]:
    """Categorize child interests into broader categories."""
    interest_mapping = {
        "ai": "technology",
        "technology": "technology",
        "science": "science",
        "math": "mathematics",
        "mathematics": "mathematics",
        "art": "creative_arts",
        "music": "creative_arts",
        "dance": "creative_arts",
        "finance": "life_skills",
        "business": "life_skills",
        "cooking": "life_skills",
        "sports": "physical_activity",
        "reading": "literacy",
        "writing": "literacy",
        "storytelling": "literacy"
    }
    
    categorized = []
    for interest in interests:
        interest_lower = interest.lower()
        category = interest_mapping.get(interest_lower, "general")
        categorized.append(category)
    
    return list(set(categorized))  # Remove duplicates

def _analyze_learning_style(learning_style: str) -> Dict[str, Any]:
    """Analyze learning style characteristics."""
    style_characteristics = {
        "visual": {
            "strengths": ["spatial awareness", "visual memory", "pattern recognition"],
            "preferred_activities": ["drawing", "watching videos", "reading picture books"],
            "learning_methods": ["diagrams", "charts", "visual aids"]
        },
        "auditory": {
            "strengths": ["verbal communication", "listening skills", "musical ability"],
            "preferred_activities": ["storytelling", "singing", "discussions"],
            "learning_methods": ["verbal instructions", "audio content", "group discussions"]
        },
        "kinesthetic": {
            "strengths": ["physical coordination", "hands-on learning", "body awareness"],
            "preferred_activities": ["building", "dancing", "sports"],
            "learning_methods": ["hands-on projects", "movement", "physical manipulation"]
        }
    }
    
    return style_characteristics.get(learning_style, style_characteristics["visual"])

def _estimate_attention_span(age: int, learning_style: str) -> Dict[str, Any]:
    """Estimate child's attention span based on age and learning style."""
    # Base attention span by age (in minutes)
    base_attention = {
        "toddler": 5,
        "preschooler": 10,
        "early_elementary": 15,
        "upper_elementary": 20,
        "middle_school": 25
    }
    
    age_group = _categorize_age_group(age)
    base_span = base_attention.get(age_group, 15)
    
    # Adjust based on learning style
    style_multipliers = {
        "visual": 1.2,
        "auditory": 1.0,
        "kinesthetic": 0.8
    }
    
    adjusted_span = int(base_span * style_multipliers.get(learning_style, 1.0))
    
    return {
        "base_span_minutes": base_span,
        "adjusted_span_minutes": adjusted_span,
        "recommended_session_length": adjusted_span,
        "break_frequency": f"Every {adjusted_span//2} minutes"
    }

def _assess_profile_completeness(profile: Dict[str, Any]) -> Dict[str, Any]:
    """Assess how complete the profile information is."""
    required_fields = ["child_name", "age", "interests"]
    optional_fields = ["preferred_learning_style", "plan_type", "parent_goals", "previous_experience"]
    
    required_complete = all(field in profile for field in required_fields)
    optional_complete = sum(field in profile for field in optional_fields)
    
    completeness_score = (required_complete * 0.7) + (optional_complete / len(optional_fields) * 0.3)
    
    return {
        "completeness_score": round(completeness_score, 2),
        "required_fields_complete": required_complete,
        "optional_fields_complete": optional_complete,
        "missing_fields": [field for field in required_fields if field not in profile]
    }

def _assess_learning_potential(age: int, interests: List[str]) -> Dict[str, Any]:
    """Assess child's learning potential based on age and interests."""
    # Age-based learning capacity
    age_capacity = {
        "toddler": "basic_concepts",
        "preschooler": "foundational_skills",
        "early_elementary": "skill_building",
        "upper_elementary": "complex_concepts",
        "middle_school": "advanced_learning"
    }
    
    age_group = _categorize_age_group(age)
    capacity = age_capacity.get(age_group, "skill_building")
    
    # Interest-based motivation
    interest_motivation = len(interests) * 0.2  # More interests = higher motivation
    
    return {
        "learning_capacity": capacity,
        "motivation_level": min(1.0, interest_motivation),
        "readiness_for_complex_topics": age >= 8,
        "recommended_learning_pace": "moderate" if age <= 8 else "accelerated"
    }

def _generate_learning_recommendations(profile: Dict[str, Any], profile_analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Generate learning recommendations based on profile analysis."""
    age = int(profile.get("age", 7))
    learning_style = profile.get("preferred_learning_style", "visual")
    interests = profile.get("interests", [])
    
    recommendations = {
        "daily_structure": _get_daily_structure_recommendations(age),
        "activity_types": _get_activity_type_recommendations(learning_style, interests),
        "learning_materials": _get_learning_material_recommendations(age, learning_style),
        "engagement_strategies": _get_engagement_strategies(age, learning_style),
        "progress_tracking": _get_progress_tracking_recommendations(age)
    }
    
    return recommendations

def _generate_parent_guidance(profile: Dict[str, Any], profile_analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Generate parent guidance based on profile analysis."""
    age = int(profile.get("age", 7))
    learning_style = profile.get("preferred_learning_style", "visual")
    
    guidance = {
        "role_in_learning": _get_parent_role_guidance(age),
        "support_strategies": _get_support_strategies(learning_style),
        "communication_tips": _get_communication_tips(age),
        "motivation_techniques": _get_motivation_techniques(age, learning_style),
        "red_flags": _get_red_flags(age),
        "success_indicators": _get_success_indicators(age)
    }
    
    return guidance

def _get_daily_structure_recommendations(age: int) -> Dict[str, Any]:
    """Get daily structure recommendations based on age."""
    if age <= 5:
        return {
            "session_length": "15-20 minutes",
            "sessions_per_day": "2-3",
            "break_duration": "10-15 minutes",
            "optimal_times": ["morning", "afternoon"],
            "flexibility": "high"
        }
    elif age <= 8:
        return {
            "session_length": "25-30 minutes",
            "sessions_per_day": "3-4",
            "break_duration": "15-20 minutes",
            "optimal_times": ["morning", "midday", "afternoon"],
            "flexibility": "medium"
        }
    else:
        return {
            "session_length": "35-45 minutes",
            "sessions_per_day": "4-5",
            "break_duration": "20-25 minutes",
            "optimal_times": ["morning", "midday", "afternoon", "evening"],
            "flexibility": "low"
        }

def _get_activity_type_recommendations(learning_style: str, interests: List[str]) -> List[str]:
    """Get activity type recommendations based on learning style and interests."""
    base_activities = {
        "visual": ["Interactive videos", "Picture books", "Drawing activities", "Visual puzzles"],
        "auditory": ["Storytelling", "Music activities", "Discussion groups", "Audio books"],
        "kinesthetic": ["Hands-on experiments", "Physical games", "Building activities", "Movement-based learning"]
    }
    
    activities = base_activities.get(learning_style, base_activities["visual"])
    
    # Add interest-specific activities
    for interest in interests:
        if interest.lower() in ["ai", "technology"]:
            activities.extend(["Digital tools", "Coding games", "Tech exploration"])
        elif interest.lower() in ["art", "creative"]:
            activities.extend(["Creative projects", "Artistic expression", "Design challenges"])
        elif interest.lower() in ["science", "math"]:
            activities.extend(["Experiments", "Problem-solving", "Discovery activities"])
    
    return list(set(activities))  # Remove duplicates

def _get_learning_material_recommendations(age: int, learning_style: str) -> List[str]:
    """Get learning material recommendations."""
    materials = []
    
    if age <= 5:
        materials.extend(["Large crayons", "Safety scissors", "Building blocks", "Picture books"])
    elif age <= 8:
        materials.extend(["Colored pencils", "Construction paper", "Educational games", "Chapter books"])
    else:
        materials.extend(["Art supplies", "Science kits", "Educational software", "Reference books"])
    
    # Add style-specific materials
    if learning_style == "visual":
        materials.extend(["Poster boards", "Markers", "Visual aids"])
    elif learning_style == "auditory":
        materials.extend(["Audio recorder", "Musical instruments", "Story props"])
    elif learning_style == "kinesthetic":
        materials.extend(["Manipulatives", "Physical props", "Movement space"])
    
    return materials

def _get_engagement_strategies(age: int, learning_style: str) -> List[str]:
    """Get engagement strategies based on age and learning style."""
    strategies = []
    
    if age <= 5:
        strategies.extend(["Short attention spans", "Frequent breaks", "Play-based learning"])
    elif age <= 8:
        strategies.extend(["Clear goals", "Immediate feedback", "Choice-based activities"])
    else:
        strategies.extend(["Challenge-based learning", "Autonomy", "Real-world connections"])
    
    # Add style-specific strategies
    if learning_style == "visual":
        strategies.extend(["Visual rewards", "Progress charts", "Colorful materials"])
    elif learning_style == "auditory":
        strategies.extend(["Verbal praise", "Story-based learning", "Group discussions"])
    elif learning_style == "kinesthetic":
        strategies.extend(["Physical rewards", "Movement breaks", "Hands-on projects"])
    
    return strategies

def _get_progress_tracking_recommendations(age: int) -> Dict[str, Any]:
    """Get progress tracking recommendations based on age."""
    if age <= 5:
        return {
            "tracking_method": "observation_and_photos",
            "frequency": "daily",
            "metrics": ["engagement", "enjoyment", "participation"],
            "parent_involvement": "high"
        }
    elif age <= 8:
        return {
            "tracking_method": "simple_charts_and_photos",
            "frequency": "every_2_days",
            "metrics": ["completion", "understanding", "enjoyment"],
            "parent_involvement": "medium"
        }
    else:
        return {
            "tracking_method": "detailed_logs_and_projects",
            "frequency": "weekly",
            "metrics": ["mastery", "application", "creativity"],
            "parent_involvement": "low"
        }

def _get_parent_role_guidance(age: int) -> str:
    """Get parent role guidance based on age."""
    if age <= 5:
        return "Active facilitator and play partner"
    elif age <= 8:
        return "Supportive guide and encourager"
    else:
        return "Resource provider and cheerleader"

def _get_support_strategies(learning_style: str) -> List[str]:
    """Get support strategies based on learning style."""
    strategies = {
        "visual": ["Provide visual aids", "Use color coding", "Create visual schedules"],
        "auditory": ["Give verbal instructions", "Use storytelling", "Encourage discussions"],
        "kinesthetic": ["Allow movement", "Provide hands-on materials", "Include physical activities"]
    }
    
    return strategies.get(learning_style, strategies["visual"])

def _get_communication_tips(age: int) -> List[str]:
    """Get communication tips based on age."""
    if age <= 5:
        return ["Use simple language", "Give one instruction at a time", "Use positive reinforcement"]
    elif age <= 8:
        return ["Explain reasons", "Ask open-ended questions", "Provide choices"]
    else:
        return ["Discuss goals together", "Encourage self-reflection", "Support independence"]

def _get_motivation_techniques(age: int, learning_style: str) -> List[str]:
    """Get motivation techniques based on age and learning style."""
    techniques = []
    
    if age <= 5:
        techniques.extend(["Immediate rewards", "Praise and encouragement", "Fun activities"])
    elif age <= 8:
        techniques.extend(["Progress charts", "Achievement celebrations", "Choice-based learning"])
    else:
        techniques.extend(["Goal setting", "Intrinsic motivation", "Real-world applications"])
    
    # Add style-specific techniques
    if learning_style == "visual":
        techniques.extend(["Visual progress indicators", "Colorful rewards", "Photo documentation"])
    elif learning_style == "auditory":
        techniques.extend(["Verbal praise", "Story-based motivation", "Group celebrations"])
    elif learning_style == "kinesthetic":
        techniques.extend(["Physical rewards", "Movement-based activities", "Hands-on projects"])
    
    return techniques

def _get_red_flags(age: int) -> List[str]:
    """Get red flags to watch for based on age."""
    if age <= 5:
        return ["Complete disinterest", "Frequent tantrums", "Regression in skills"]
    elif age <= 8:
        return ["Avoidance behavior", "Negative self-talk", "Difficulty focusing"]
    else:
        return ["Complete withdrawal", "Anxiety about learning", "Perfectionism"]

def _get_success_indicators(age: int) -> List[str]:
    """Get success indicators based on age."""
    if age <= 5:
        return ["Shows curiosity", "Engages in activities", "Asks questions"]
    elif age <= 8:
        return ["Completes tasks", "Shows understanding", "Enjoys learning"]
    else:
        return ["Applies knowledge", "Shows creativity", "Takes initiative"]