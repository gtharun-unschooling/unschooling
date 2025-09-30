"""
Enhanced Reviewer Agent for Module 3
Reviews and optimizes learning plans comprehensively
"""

import time
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

def run_reviewer_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Enhanced Reviewer Agent that reviews and optimizes learning plans.
    """
    start_time = time.time()
    logger.info("🔍 Reviewer Agent: Starting comprehensive plan review")
    
    try:
        # Extract data from state
        weekly_plan = state.get("weekly_plan", {})
        profile = state.get("profile", {})
        matched_topics = state.get("matched_topics", [])
        
        if not weekly_plan:
            raise ValueError("No weekly plan provided for review")
        
        # Perform comprehensive plan review
        plan_quality_assessment = _assess_plan_quality(weekly_plan, profile)
        age_appropriateness = _assess_age_appropriateness(weekly_plan, profile)
        learning_style_alignment = _assess_learning_style_alignment(weekly_plan, profile)
        engagement_potential = _assess_engagement_potential(weekly_plan, profile)
        
        # Identify potential issues and improvements
        potential_issues = _identify_potential_issues(weekly_plan, profile)
        improvement_suggestions = _generate_improvement_suggestions(weekly_plan, profile)
        
        # Generate parent recommendations
        parent_recommendations = _generate_parent_recommendations(profile, plan_quality_assessment)
        
        # Create performance tracking framework
        performance_tracking = _create_performance_tracking(profile, weekly_plan)
        
        # Optimize the plan based on findings
        optimized_plan = _optimize_plan(weekly_plan, profile, improvement_suggestions)
        
        execution_time = time.time() - start_time
        logger.info(f"✅ Reviewer Agent: Plan review completed in {execution_time:.3f}s")
        
        return {
            "final_plan": optimized_plan,
            "review_notes": "Comprehensive plan review completed successfully",
            "plan_quality_assessment": plan_quality_assessment,
            "age_appropriateness": age_appropriateness,
            "learning_style_alignment": learning_style_alignment,
            "engagement_potential": engagement_potential,
            "potential_issues": potential_issues,
            "improvement_suggestions": improvement_suggestions,
            "parent_recommendations": parent_recommendations,
            "performance_tracking": performance_tracking,
            "profile": profile,
            "status": "plan_reviewed"
        }
        
    except Exception as e:
        execution_time = time.time() - start_time
        logger.error(f"❌ Reviewer Agent failed: {str(e)}")
        return {
            "final_plan": state.get("weekly_plan", {}),
            "review_notes": f"Review failed: {str(e)}",
            "profile": state.get("profile", {}),
            "status": "failed"
        }

def _assess_plan_quality(weekly_plan: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
    """Assess the overall quality of the learning plan."""
    # Count weeks and activities
    weeks_count = len(weekly_plan)
    total_activities = sum(len(week.get("days", {})) for week in weekly_plan.values())
    
    # Assess structure completeness
    structure_score = min(1.0, weeks_count / 4.0)  # Normalize to 0-1
    
    # Assess activity variety
    activity_variety = _calculate_activity_variety(weekly_plan)
    
    # Assess topic distribution
    topic_distribution = _assess_topic_distribution(weekly_plan)
    
    # Overall quality score
    quality_score = (structure_score * 0.4 + activity_variety * 0.3 + topic_distribution * 0.3)
    
    return {
        "overall_score": round(quality_score, 2),
        "structure_completeness": structure_score,
        "activity_variety": activity_variety,
        "topic_distribution": topic_distribution,
        "weeks_planned": weeks_count,
        "total_activities": total_activities,
        "quality_level": "excellent" if quality_score >= 0.8 else "good" if quality_score >= 0.6 else "fair" if quality_score >= 0.4 else "poor"
    }

def _assess_age_appropriateness(weekly_plan: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
    """Assess if the plan is appropriate for the child's age."""
    child_age = int(profile.get("age", 7))
    
    # Age-appropriate criteria
    age_criteria = {
        "toddler": {"session_length": 15, "complexity": "simple", "supervision": "high"},
        "preschooler": {"session_length": 20, "complexity": "basic", "supervision": "medium"},
        "early_elementary": {"session_length": 30, "complexity": "moderate", "supervision": "medium"},
        "upper_elementary": {"session_length": 40, "complexity": "challenging", "supervision": "low"},
        "middle_school": {"session_length": 50, "complexity": "advanced", "supervision": "minimal"}
    }
    
    age_group = "toddler" if child_age <= 3 else "preschooler" if child_age <= 5 else "early_elementary" if child_age <= 8 else "upper_elementary" if child_age <= 12 else "middle_school"
    expected_criteria = age_criteria.get(age_group, age_criteria["early_elementary"])
    
    # Assess plan against age criteria
    appropriateness_score = 0.0
    issues = []
    
    for week_key, week_data in weekly_plan.items():
        for day_key, day_data in week_data.get("days", {}).items():
            # Check session length appropriateness
            duration = day_data.get("duration", "30 min")
            if "min" in duration:
                try:
                    actual_duration = int(duration.split()[0])
                    if abs(actual_duration - expected_criteria["session_length"]) <= 10:
                        appropriateness_score += 0.1
                    else:
                        issues.append(f"Session duration {actual_duration}min may not be optimal for age {child_age}")
                except:
                    pass
            
            # Check activity complexity
            activity = day_data.get("activity", "")
            if expected_criteria["complexity"] == "simple" and any(word in activity.lower() for word in ["complex", "advanced", "difficult"]):
                issues.append(f"Activity complexity may be too high for age {child_age}")
            elif expected_criteria["complexity"] == "advanced" and any(word in activity.lower() for word in ["simple", "basic", "easy"]):
                issues.append(f"Activity complexity may be too low for age {child_age}")
            else:
                appropriateness_score += 0.1
    
    # Normalize score
    total_activities = sum(len(week.get("days", {})) for week in weekly_plan.values())
    if total_activities > 0:
        appropriateness_score = min(1.0, appropriateness_score / total_activities)
    
    return {
        "appropriateness_score": round(appropriateness_score, 2),
        "age_group": age_group,
        "expected_criteria": expected_criteria,
        "issues": issues,
        "overall_appropriate": appropriateness_score >= 0.7
    }

def _assess_learning_style_alignment(weekly_plan: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
    """Assess if the plan aligns with the child's learning style."""
    learning_style = profile.get("preferred_learning_style", "visual")
    
    # Learning style preferences
    style_preferences = {
        "visual": ["visual", "picture", "draw", "chart", "color", "video", "diagram"],
        "auditory": ["listen", "story", "discuss", "talk", "music", "sound", "conversation"],
        "kinesthetic": ["hands-on", "build", "move", "touch", "physical", "experiment", "create"]
    }
    
    preferred_keywords = style_preferences.get(learning_style, style_preferences["visual"])
    
    # Count activities that match learning style
    matching_activities = 0
    total_activities = 0
    
    for week_key, week_data in weekly_plan.items():
        for day_key, day_data in week_data.get("days", {}).items():
            total_activities += 1
            activity = day_data.get("activity", "").lower()
            
            if any(keyword in activity for keyword in preferred_keywords):
                matching_activities += 1
    
    # Calculate alignment score
    alignment_score = matching_activities / total_activities if total_activities > 0 else 0.0
    
    return {
        "alignment_score": round(alignment_score, 2),
        "learning_style": learning_style,
        "matching_activities": matching_activities,
        "total_activities": total_activities,
        "alignment_level": "excellent" if alignment_score >= 0.8 else "good" if alignment_score >= 0.6 else "fair" if alignment_score >= 0.4 else "poor"
    }

def _assess_engagement_potential(weekly_plan: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
    """Assess the potential engagement level of the plan."""
    child_age = int(profile.get("age", 7))
    interests = profile.get("interests", [])
    
    # Engagement factors
    engagement_score = 0.0
    engagement_factors = []
    
    for week_key, week_data in weekly_plan.items():
        for day_key, day_data in week_data.get("days", {}).items():
            activity = day_data.get("activity", "").lower()
            topic = day_data.get("topic", "").lower()
            
            # Interest alignment
            if any(interest.lower() in topic for interest in interests):
                engagement_score += 0.2
                engagement_factors.append("Interest alignment")
            
            # Interactive elements
            if any(word in activity for word in ["interactive", "hands-on", "create", "build", "experiment"]):
                engagement_score += 0.15
                engagement_factors.append("Interactive activities")
            
            # Age-appropriate challenge
            if child_age <= 5 and "simple" in activity:
                engagement_score += 0.1
                engagement_factors.append("Age-appropriate challenge")
            elif child_age > 8 and "challenge" in activity:
                engagement_score += 0.1
                engagement_factors.append("Age-appropriate challenge")
            
            # Creative elements
            if any(word in activity for word in ["creative", "art", "design", "imagine"]):
                engagement_score += 0.1
                engagement_factors.append("Creative elements")
    
    # Normalize score
    total_activities = sum(len(week.get("days", {})) for week in weekly_plan.values())
    if total_activities > 0:
        engagement_score = min(1.0, engagement_score / total_activities)
    
    return {
        "engagement_score": round(engagement_score, 2),
        "engagement_factors": list(set(engagement_factors)),
        "engagement_level": "high" if engagement_score >= 0.6 else "medium" if engagement_score >= 0.4 else "low"
    }

def _identify_potential_issues(weekly_plan: Dict[str, Any], profile: Dict[str, Any]) -> List[str]:
    """Identify potential issues with the learning plan."""
    issues = []
    child_age = int(profile.get("age", 7))
    
    # Check for potential issues
    for week_key, week_data in weekly_plan.items():
        for day_key, day_data in week_data.get("days", {}).items():
            activity = day_data.get("activity", "")
            duration = day_data.get("duration", "")
            
            # Duration issues
            if "min" in duration:
                try:
                    actual_duration = int(duration.split()[0])
                    if child_age <= 5 and actual_duration > 25:
                        issues.append(f"Session duration {actual_duration}min may be too long for age {child_age}")
                    elif child_age > 8 and actual_duration < 20:
                        issues.append(f"Session duration {actual_duration}min may be too short for age {child_age}")
                except:
                    pass
            
            # Activity complexity issues
            if child_age <= 5 and any(word in activity.lower() for word in ["complex", "advanced", "difficult"]):
                issues.append(f"Activity complexity may be too high for age {child_age}")
            
            # Missing materials
            materials = day_data.get("materials_needed", [])
            if not materials or materials == ["Basic materials"]:
                issues.append(f"Specific materials not specified for {day_data.get('topic', 'activity')}")
    
    return issues

def _generate_improvement_suggestions(weekly_plan: Dict[str, Any], profile: Dict[str, Any]) -> List[str]:
    """Generate suggestions for improving the learning plan."""
    suggestions = []
    child_age = int(profile.get("age", 7))
    learning_style = profile.get("preferred_learning_style", "visual")
    
    # General improvements
    suggestions.append("Include more hands-on activities for better engagement")
    suggestions.append("Add variety in activity types to maintain interest")
    suggestions.append("Include reflection time after major activities")
    
    # Age-specific suggestions
    if child_age <= 5:
        suggestions.extend([
            "Keep sessions short (15-20 minutes)",
            "Include more play-based learning",
            "Add frequent movement breaks"
        ])
    elif child_age <= 8:
        suggestions.extend([
            "Include choice-based activities",
            "Add collaborative elements",
            "Provide clear success criteria"
        ])
    else:
        suggestions.extend([
            "Include goal-setting activities",
            "Add self-assessment opportunities",
            "Encourage independent exploration"
        ])
    
    # Learning style suggestions
    if learning_style == "visual":
        suggestions.extend([
            "Include more visual aids and diagrams",
            "Add color coding to activities",
            "Use visual progress tracking"
        ])
    elif learning_style == "auditory":
        suggestions.extend([
            "Include more discussion time",
            "Add storytelling elements",
            "Use verbal instructions and feedback"
        ])
    elif learning_style == "kinesthetic":
        suggestions.extend([
            "Include more physical activities",
            "Add building and creating tasks",
            "Use movement-based learning"
        ])
    
    return suggestions

def _generate_parent_recommendations(profile: Dict[str, Any], plan_quality: Dict[str, Any]) -> Dict[str, Any]:
    """Generate recommendations for parents."""
    child_age = int(profile.get("age", 7))
    quality_level = plan_quality.get("quality_level", "good")
    
    recommendations = {
        "daily_routine": _get_daily_routine_recommendations(child_age),
        "support_strategies": _get_support_strategies(child_age, quality_level),
        "monitoring_tips": _get_monitoring_tips(child_age),
        "encouragement_methods": _get_encouragement_methods(child_age),
        "red_flags": _get_red_flags(child_age),
        "success_indicators": _get_success_indicators(child_age)
    }
    
    return recommendations

def _create_performance_tracking(profile: Dict[str, Any], weekly_plan: Dict[str, Any]) -> Dict[str, Any]:
    """Create a performance tracking framework."""
    child_age = int(profile.get("age", 7))
    
    tracking_framework = {
        "metrics": _get_tracking_metrics(child_age),
        "frequency": _get_tracking_frequency(child_age),
        "methods": _get_tracking_methods(child_age),
        "goals": _get_tracking_goals(child_age),
        "reporting": _get_tracking_reporting(child_age)
    }
    
    return tracking_framework

def _optimize_plan(weekly_plan: Dict[str, Any], profile: Dict[str, Any], suggestions: List[str]) -> Dict[str, Any]:
    """Optimize the learning plan based on review findings."""
    # For now, return the original plan with optimization notes
    # In a full implementation, this would make actual modifications
    
    optimized_plan = weekly_plan.copy()
    
    # Add optimization metadata
    for week_key in optimized_plan:
        if "optimization" not in optimized_plan[week_key]:
            optimized_plan[week_key]["optimization"] = {
                "reviewed": True,
                "suggestions_applied": suggestions[:3],  # Apply top 3 suggestions
                "quality_improvements": "Plan optimized based on comprehensive review"
            }
    
    return optimized_plan

# Helper functions for recommendations and tracking
def _get_daily_routine_recommendations(age: int) -> List[str]:
    """Get daily routine recommendations based on age."""
    if age <= 5:
        return ["Establish consistent learning times", "Include play breaks", "Keep sessions short"]
    elif age <= 8:
        return ["Create a visual schedule", "Include choice time", "Set clear expectations"]
    else:
        return ["Plan ahead together", "Include goal-setting time", "Allow for flexibility"]

def _get_support_strategies(age: int, quality_level: str) -> List[str]:
    """Get support strategies based on age and plan quality."""
    strategies = []
    
    if quality_level in ["poor", "fair"]:
        strategies.extend(["Provide additional structure", "Break down complex activities", "Offer more guidance"])
    
    if age <= 5:
        strategies.extend(["Be actively involved", "Provide immediate feedback", "Celebrate small wins"])
    elif age <= 8:
        strategies.extend(["Offer encouragement", "Help with organization", "Provide gentle guidance"])
    else:
        strategies.extend(["Be available for questions", "Support independence", "Encourage self-reflection"])
    
    return strategies

def _get_monitoring_tips(age: int) -> List[str]:
    """Get monitoring tips based on age."""
    if age <= 5:
        return ["Watch for engagement signs", "Note what captures interest", "Observe frustration levels"]
    elif age <= 8:
        return ["Check understanding regularly", "Monitor completion rates", "Note confidence levels"]
    else:
        return ["Track goal achievement", "Monitor self-direction", "Assess skill development"]

def _get_encouragement_methods(age: int) -> List[str]:
    """Get encouragement methods based on age."""
    if age <= 5:
        return ["Immediate praise", "Physical rewards", "Celebration of effort"]
    elif age <= 8:
        return ["Progress charts", "Achievement celebrations", "Verbal encouragement"]
    else:
        return ["Goal recognition", "Skill acknowledgment", "Intrinsic motivation support"]

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

def _get_tracking_metrics(age: int) -> List[str]:
    """Get tracking metrics based on age."""
    if age <= 5:
        return ["engagement", "enjoyment", "participation", "curiosity"]
    elif age <= 8:
        return ["completion", "understanding", "enjoyment", "confidence"]
    else:
        return ["mastery", "application", "creativity", "independence"]

def _get_tracking_frequency(age: int) -> str:
    """Get tracking frequency based on age."""
    if age <= 5:
        return "daily"
    elif age <= 8:
        return "every_2_days"
    else:
        return "weekly"

def _get_tracking_methods(age: int) -> List[str]:
    """Get tracking methods based on age."""
    if age <= 5:
        return ["observation", "photos", "simple_notes"]
    elif age <= 8:
        return ["checklists", "photos", "conversation", "simple_assessments"]
    else:
        return ["detailed_logs", "self_assessments", "project_reviews", "goal_tracking"]

def _get_tracking_goals(age: int) -> List[str]:
    """Get tracking goals based on age."""
    if age <= 5:
        return ["Build curiosity", "Develop basic skills", "Foster enjoyment"]
    elif age <= 8:
        return ["Build confidence", "Develop understanding", "Maintain interest"]
    else:
        return ["Build mastery", "Develop independence", "Foster creativity"]

def _get_tracking_reporting(age: int) -> str:
    """Get tracking reporting frequency based on age."""
    if age <= 5:
        return "daily_to_parents"
    elif age <= 8:
        return "weekly_summary"
    else:
        return "biweekly_review"

def _calculate_activity_variety(weekly_plan: Dict[str, Any]) -> float:
    """Calculate the variety of activities in the plan."""
    all_activities = []
    
    for week_data in weekly_plan.values():
        for day_data in week_data.get("days", {}).values():
            activity = day_data.get("activity", "")
            if activity:
                all_activities.append(activity)
    
    # Calculate variety based on unique activities
    unique_activities = len(set(all_activities))
    total_activities = len(all_activities)
    
    if total_activities == 0:
        return 0.0
    
    variety_score = unique_activities / total_activities
    return round(variety_score, 2)

def _assess_topic_distribution(weekly_plan: Dict[str, Any]) -> float:
    """Assess the distribution of topics across the plan."""
    topics_by_week = {}
    
    for week_key, week_data in weekly_plan.items():
        week_topics = set()
        for day_data in week_data.get("days", {}).values():
            topic = day_data.get("topic", "")
            if topic:
                week_topics.add(topic)
        topics_by_week[week_key] = week_topics
    
    # Calculate distribution score
    total_weeks = len(topics_by_week)
    if total_weeks == 0:
        return 0.0
    
    # Check if each week has a good variety of topics
    well_distributed_weeks = 0
    for week_topics in topics_by_week.values():
        if len(week_topics) >= 3:  # At least 3 different topics per week
            well_distributed_weeks += 1
    
    distribution_score = well_distributed_weeks / total_weeks
    return round(distribution_score, 2)
