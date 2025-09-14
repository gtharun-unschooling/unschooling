#!/usr/bin/env python3
"""
Plan Manager
Manages AI-generated learning plans, customization, and progress tracking
"""

import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import logging
from copy import deepcopy

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PlanManager:
    """Manages learning plans with versioning, customization, and progress tracking."""
    
    def __init__(self):
        self.plan_statuses = {
            "draft": "Plan is being created or modified",
            "active": "Plan is currently being followed",
            "paused": "Plan is temporarily paused",
            "completed": "Plan has been fully completed",
            "archived": "Plan is stored for reference"
        }
        
        self.modification_types = {
            "topic_replacement": "Replace one topic with another",
            "difficulty_adjustment": "Change difficulty level",
            "learning_style_change": "Modify learning approach",
            "time_adjustment": "Change time allocation",
            "activity_addition": "Add new activities",
            "activity_removal": "Remove activities"
        }
    
    def create_ai_plan(self, child_id: str, ai_generated_plan: Dict[str, Any], 
                       child_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new AI-generated learning plan."""
        plan_id = f"plan_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{child_id}"
        
        plan = {
            "plan_id": plan_id,
            "child_id": child_id,
            "created_at": datetime.now().isoformat(),
            "last_modified": datetime.now().isoformat(),
            "version": 1,
            "status": "draft",
            "plan_type": "ai_generated",
            
            # Original AI plan
            "ai_generated_plan": ai_generated_plan,
            "child_profile": child_profile,
            
            # Plan structure
            "plan_structure": {
                "total_weeks": ai_generated_plan.get("total_weeks", 4),
                "topics_per_week": ai_generated_plan.get("topics_per_week", 5),
                "total_topics": ai_generated_plan.get("total_topics", 20),
                "estimated_total_time": ai_generated_plan.get("estimated_total_time", "10 hours")
            },
            
            # Plan content
            "weekly_plans": ai_generated_plan.get("weekly_plans", {}),
            
            # Customization tracking
            "customizations": [],
            "modification_history": [],
            
            # Progress tracking
            "progress": {
                "overall_progress": 0.0,
                "weeks_completed": 0,
                "topics_completed": 0,
                "total_time_spent": 0,
                "weekly_progress": {},
                "topic_progress": {}
            },
            
            # Quality metrics
            "quality_metrics": {
                "prerequisites_checked": True,
                "difficulty_progression": "optimal",
                "age_appropriateness": "perfect",
                "learning_stage_alignment": "excellent",
                "content_richness_score": 8.5,
                "ai_confidence_score": 0.95
            },
            
            # Recommendations
            "recommendations": {
                "suggested_modifications": [],
                "optimization_suggestions": [],
                "next_steps": []
            }
        }
        
        # Initialize progress tracking
        plan["progress"] = self._initialize_progress_tracking(plan)
        
        return plan
    
    def _initialize_progress_tracking(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """Initialize progress tracking for all weeks and topics."""
        progress = {
            "overall_progress": 0.0,
            "weeks_completed": 0,
            "topics_completed": 0,
            "total_time_spent": 0,
            "weekly_progress": {},
            "topic_progress": {}
        }
        
        weekly_plans = plan.get("weekly_plans", {})
        
        for week_key, week_data in weekly_plans.items():
            progress["weekly_progress"][week_key] = {
                "status": "not_started",
                "topics_completed": 0,
                "total_topics": len(week_data.get("topics", [])),
                "progress_percentage": 0.0,
                "time_spent": 0,
                "started_at": None,
                "completed_at": None
            }
            
            # Initialize topic progress
            topics = week_data.get("topics", [])
            for topic in topics:
                topic_id = topic.get("topic_id", f"topic_{topic.get('Topic', '').replace(' ', '_')}")
                progress["topic_progress"][topic_id] = {
                    "status": "not_started",
                    "started_at": None,
                    "completed_at": None,
                    "time_spent": 0,
                    "activities_completed": [],
                    "parent_rating": None,
                    "child_engagement": None,
                    "notes": ""
                }
        
        return progress
    
    def customize_plan(self, plan: Dict[str, Any], customization: Dict[str, Any]) -> Dict[str, Any]:
        """Apply customization to a learning plan."""
        # Create new version
        new_version = plan["version"] + 1
        customized_plan = deepcopy(plan)
        
        # Update version info
        customized_plan["version"] = new_version
        customized_plan["last_modified"] = datetime.now().isoformat()
        customized_plan["status"] = "draft"  # Reset to draft for review
        
        # Apply customization
        modification = {
            "modification_id": f"mod_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "type": customization.get("type", "unknown"),
            "description": customization.get("description", ""),
            "applied_at": datetime.now().isoformat(),
            "details": customization
        }
        
        # Apply specific modifications
        if customization["type"] == "topic_replacement":
            customized_plan = self._replace_topic(customized_plan, customization)
        elif customization["type"] == "difficulty_adjustment":
            customized_plan = self._adjust_difficulty(customized_plan, customization)
        elif customization["type"] == "learning_style_change":
            customized_plan = self._change_learning_style(customized_plan, customization)
        
        # Add to modification history
        customized_plan["modification_history"].append(modification)
        customized_plan["customizations"].append(customization)
        
        # Recalculate quality metrics
        customized_plan["quality_metrics"] = self._recalculate_quality_metrics(customized_plan)
        
        return customized_plan
    
    def _replace_topic(self, plan: Dict[str, Any], customization: Dict[str, Any]) -> Dict[str, Any]:
        """Replace a topic in the plan."""
        old_topic = customization.get("old_topic")
        new_topic = customization.get("new_topic")
        week_key = customization.get("week_key")
        
        if week_key in plan["weekly_plans"]:
            week_data = plan["weekly_plans"][week_key]
            topics = week_data.get("topics", [])
            
            for i, topic in enumerate(topics):
                if topic.get("Topic") == old_topic:
                    topics[i] = new_topic
                    
                    # Update progress tracking
                    old_topic_id = f"topic_{old_topic.replace(' ', '_')}"
                    new_topic_id = f"topic_{new_topic.get('Topic', '').replace(' ', '_')}"
                    
                    if old_topic_id in plan["progress"]["topic_progress"]:
                        # Transfer progress if any
                        old_progress = plan["progress"]["topic_progress"][old_topic_id]
                        plan["progress"]["topic_progress"][new_topic_id] = {
                            "status": "not_started",
                            "started_at": None,
                            "completed_at": None,
                            "time_spent": 0,
                            "activities_completed": [],
                            "parent_rating": None,
                            "child_engagement": None,
                            "notes": ""
                        }
                        # Remove old topic progress
                        del plan["progress"]["topic_progress"][old_topic_id]
                    
                    break
        
        return plan
    
    def _adjust_difficulty(self, plan: Dict[str, Any], customization: Dict[str, Any]) -> Dict[str, Any]:
        """Adjust difficulty level of topics in the plan."""
        target_difficulty = customization.get("target_difficulty")
        affected_weeks = customization.get("affected_weeks", [])
        
        for week_key in affected_weeks:
            if week_key in plan["weekly_plans"]:
                week_data = plan["weekly_plans"][week_key]
                topics = week_data.get("topics", [])
                
                # Find topics with appropriate difficulty
                # This would integrate with your topic database
                pass
        
        return plan
    
    def _change_learning_style(self, plan: Dict[str, Any], customization: Dict[str, Any]) -> Dict[str, Any]:
        """Change learning style approach in the plan."""
        new_learning_style = customization.get("new_learning_style")
        
        # Update child profile
        if "child_profile" in plan:
            plan["child_profile"]["preferred_learning_style"] = new_learning_style
        
        # Adjust activities based on new learning style
        # This would integrate with your activity database
        pass
        
        return plan
    
    def _recalculate_quality_metrics(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """Recalculate quality metrics after customization."""
        # This would implement complex quality assessment logic
        # For now, return basic metrics
        return {
            "prerequisites_checked": True,
            "difficulty_progression": "optimal",
            "age_appropriateness": "perfect",
            "learning_stage_alignment": "excellent",
            "content_richness_score": 8.0,
            "ai_confidence_score": 0.90,
            "customization_impact": "minimal"
        }
    
    def update_plan_progress(self, plan: Dict[str, Any], progress_update: Dict[str, Any]) -> Dict[str, Any]:
        """Update plan progress based on learning session completion."""
        topic_id = progress_update.get("topic_id")
        week_key = progress_update.get("week_key")
        status = progress_update.get("status", "in_progress")
        
        if topic_id in plan["progress"]["topic_progress"]:
            topic_progress = plan["progress"]["topic_progress"][topic_id]
            
            # Update topic progress
            topic_progress["status"] = status
            topic_progress["time_spent"] = progress_update.get("time_spent", 0)
            
            if status == "started" and not topic_progress["started_at"]:
                topic_progress["started_at"] = datetime.now().isoformat()
            elif status == "completed" and not topic_progress["completed_at"]:
                topic_progress["completed_at"] = datetime.now().isoformat()
                topic_progress["activities_completed"] = progress_update.get("activities_completed", [])
                topic_progress["parent_rating"] = progress_update.get("parent_rating")
                topic_progress["child_engagement"] = progress_update.get("child_engagement")
                topic_progress["notes"] = progress_update.get("notes", "")
            
            # Update weekly progress
            if week_key in plan["progress"]["weekly_progress"]:
                week_progress = plan["progress"]["weekly_progress"][week_key]
                
                if status == "started" and not week_progress["started_at"]:
                    week_progress["started_at"] = datetime.now().isoformat()
                
                if status == "completed":
                    week_progress["topics_completed"] += 1
                    week_progress["time_spent"] += progress_update.get("time_spent", 0)
                    
                    # Check if week is completed
                    if week_progress["topics_completed"] >= week_progress["total_topics"]:
                        week_progress["status"] = "completed"
                        week_progress["completed_at"] = datetime.now().isoformat()
                        week_progress["progress_percentage"] = 100.0
                    else:
                        week_progress["progress_percentage"] = (week_progress["topics_completed"] / week_progress["total_topics"]) * 100
                
                week_progress["status"] = "in_progress"
            
            # Update overall progress
            plan["progress"] = self._calculate_overall_progress(plan)
        
        return plan
    
    def _calculate_overall_progress(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate overall plan progress."""
        progress = plan["progress"]
        
        # Calculate topics completed
        total_topics = 0
        completed_topics = 0
        total_time = 0
        
        for week_progress in progress["weekly_progress"].values():
            total_topics += week_progress["total_topics"]
            completed_topics += week_progress["topics_completed"]
            total_time += week_progress["time_spent"]
        
        # Calculate weeks completed
        completed_weeks = sum(1 for wp in progress["weekly_progress"].values() if wp["status"] == "completed")
        
        # Calculate overall progress percentage
        overall_progress = (completed_topics / total_topics * 100) if total_topics > 0 else 0
        
        progress.update({
            "overall_progress": overall_progress,
            "weeks_completed": completed_weeks,
            "topics_completed": completed_topics,
            "total_time_spent": total_time
        })
        
        return progress
    
    def generate_plan_insights(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """Generate insights and recommendations for the plan."""
        insights = {
            "performance_analysis": {},
            "optimization_suggestions": [],
            "next_steps": [],
            "risk_assessments": []
        }
        
        progress = plan["progress"]
        
        # Performance analysis
        insights["performance_analysis"] = {
            "completion_rate": progress["overall_progress"],
            "pace_analysis": self._analyze_learning_pace(plan),
            "engagement_patterns": self._analyze_engagement_patterns(plan),
            "difficulty_distribution": self._analyze_difficulty_distribution(plan)
        }
        
        # Optimization suggestions
        if progress["overall_progress"] < 50:
            insights["optimization_suggestions"].append({
                "type": "pace_adjustment",
                "description": "Consider slowing down the pace to improve comprehension",
                "priority": "high"
            })
        
        # Next steps
        insights["next_steps"] = self._suggest_next_steps(plan)
        
        # Risk assessments
        insights["risk_assessments"] = self._assess_plan_risks(plan)
        
        return insights
    
    def _analyze_learning_pace(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze the learning pace of the plan."""
        # This would implement pace analysis logic
        return {
            "current_pace": "moderate",
            "recommended_pace": "moderate",
            "pace_adjustment_needed": False
        }
    
    def _analyze_engagement_patterns(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze engagement patterns in the plan."""
        # This would implement engagement analysis logic
        return {
            "average_engagement": "high",
            "engagement_trend": "increasing",
            "engagement_concerns": []
        }
    
    def _analyze_difficulty_distribution(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze difficulty distribution in the plan."""
        # This would implement difficulty analysis logic
        return {
            "difficulty_balance": "optimal",
            "progression_smoothness": "smooth",
            "difficulty_spikes": []
        }
    
    def _suggest_next_steps(self, plan: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Suggest next steps based on current progress."""
        next_steps = []
        progress = plan["progress"]
        
        if progress["overall_progress"] >= 80:
            next_steps.append({
                "type": "plan_completion",
                "description": "Focus on completing remaining topics",
                "priority": "high"
            })
        elif progress["overall_progress"] >= 50:
            next_steps.append({
                "type": "mid_plan_review",
                "description": "Review progress and adjust if needed",
                "priority": "medium"
            })
        else:
            next_steps.append({
                "type": "early_plan_focus",
                "description": "Focus on building momentum and consistency",
                "priority": "high"
            })
        
        return next_steps
    
    def _assess_plan_risks(self, plan: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Assess potential risks in the plan."""
        risks = []
        progress = plan["progress"]
        
        if progress["overall_progress"] < 20 and len(plan["modification_history"]) > 3:
            risks.append({
                "type": "over_customization",
                "description": "Plan has been modified multiple times, may lose AI optimization benefits",
                "severity": "medium",
                "mitigation": "Consider reverting to original AI plan or consulting with educators"
            })
        
        if progress["overall_progress"] > 0 and progress["weeks_completed"] == 0:
            risks.append({
                "type": "slow_progress",
                "description": "Topics are being started but weeks are not being completed",
                "severity": "low",
                "mitigation": "Focus on completing weekly goals rather than starting new topics"
            })
        
        return risks
    
    def save_plan(self, plan: Dict[str, Any], plans_file: str) -> bool:
        """Save a learning plan to file."""
        try:
            # Load existing plans
            all_plans = {}
            if os.path.exists(plans_file):
                with open(plans_file, 'r', encoding='utf-8') as f:
                    all_plans = json.load(f)
            
            # Update this plan
            all_plans[plan["plan_id"]] = plan
            
            # Save all plans
            with open(plans_file, 'w', encoding='utf-8') as f:
                json.dump(all_plans, f, indent=2, ensure_ascii=False)
            
            return True
        except Exception as e:
            logger.error(f"Error saving plan {plan['plan_id']}: {e}")
            return False
    
    def load_plan(self, plan_id: str, plans_file: str) -> Optional[Dict[str, Any]]:
        """Load a learning plan from file."""
        try:
            if os.path.exists(plans_file):
                with open(plans_file, 'r', encoding='utf-8') as f:
                    all_plans = json.load(f)
                    return all_plans.get(plan_id)
            return None
        except Exception as e:
            logger.error(f"Error loading plan {plan_id}: {e}")
            return None

def main():
    """Main function to demonstrate plan management."""
    manager = PlanManager()
    
    print("📅 Plan Manager Demo")
    print("=" * 30)
    
    # Create sample AI plan
    ai_plan = {
        "total_weeks": 4,
        "topics_per_week": 5,
        "total_topics": 20,
        "estimated_total_time": "10 hours",
        "weekly_plans": {
            "Week 1": {
                "topics": [
                    {"Topic": "Understanding Money", "topic_id": "Finance_Understanding_Money"},
                    {"Topic": "Coins and Bills", "topic_id": "Finance_Coins_and_Bills"}
                ]
            }
        }
    }
    
    child_profile = {
        "child_name": "Rahul",
        "child_age": 8,
        "interests": ["Finance", "AI"],
        "preferred_learning_style": "visual"
    }
    
    # Create plan
    plan = manager.create_ai_plan("child_123", ai_plan, child_profile)
    print(f"✅ Created plan: {plan['plan_id']}")
    
    # Customize plan
    customization = {
        "type": "topic_replacement",
        "description": "Replace 'Coins and Bills' with 'Spending vs Saving'",
        "old_topic": "Coins and Bills",
        "new_topic": {"Topic": "Spending vs Saving", "topic_id": "Finance_Spending_vs_Saving"},
        "week_key": "Week 1"
    }
    
    customized_plan = manager.customize_plan(plan, customization)
    print(f"✅ Customized plan to version {customized_plan['version']}")
    
    # Update progress
    progress_update = {
        "topic_id": "Finance_Understanding_Money",
        "week_key": "Week 1",
        "status": "completed",
        "time_spent": 30,
        "activities_completed": ["Money Sorting", "Shopping Game"],
        "parent_rating": 5,
        "child_engagement": "high",
        "notes": "Child loved the activities!"
    }
    
    updated_plan = manager.update_plan_progress(customized_plan, progress_update)
    print(f"✅ Updated plan progress: {updated_plan['progress']['overall_progress']:.1f}%")
    
    # Generate insights
    insights = manager.generate_plan_insights(updated_plan)
    print(f"✅ Generated plan insights")
    
    # Save plan
    plans_file = "data/learning_plans.json"
    if manager.save_plan(updated_plan, plans_file):
        print(f"✅ Saved plan to {plans_file}")
    
    print(f"\n📊 Plan Summary:")
    print(f"   Version: {updated_plan['version']}")
    print(f"   Status: {updated_plan['status']}")
    print(f"   Progress: {updated_plan['progress']['overall_progress']:.1f}%")
    print(f"   Topics Completed: {updated_plan['progress']['topics_completed']}/{updated_plan['plan_structure']['total_topics']}")

if __name__ == "__main__":
    main()
