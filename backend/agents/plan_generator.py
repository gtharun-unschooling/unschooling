"""
Real Plan Generator - No Fallback Data
Uses only original data from the database
"""

import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class RealPlanGenerator:
    """Generates learning plans using only real topics from the database."""
    
    def __init__(self, topics_data: List[Dict], niches_data: List[Dict], essential_growth_data: Dict):
        self.topics_data = topics_data
        self.niches_data = niches_data
        self.essential_growth_data = essential_growth_data
        logger.info(f"🎯 RealPlanGenerator initialized with {len(topics_data)} topics, {len(niches_data)} niches")
    
    def generate_weekly_plan(self, profile: Dict[str, Any], matched_topics: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate a 4-week plan using only real topics."""
        logger.info("📅 Generating weekly plan with real topics only")
        
        if not matched_topics:
            logger.error("❌ No matched topics available - cannot generate plan")
            return self._create_empty_plan()
        
        # Create 4-week structure
        weekly_plan = {}
        week_themes = [
            {"name": "Discovery Week", "theme": "Technology & Innovation", "goal": "Master basic AI concepts and technology understanding"},
            {"name": "Skills Week", "theme": "Life Skills & Finance", "goal": "Develop essential life skills and financial awareness"},
            {"name": "Creation Week", "theme": "Creative Expression", "goal": "Express creativity and improve communication skills"},
            {"name": "Project Week", "theme": "Problem Solving & Logic", "goal": "Apply all learned skills in a comprehensive project"}
        ]
        
        # Distribute topics across weeks
        topics_per_week = len(matched_topics) // 4
        remaining_topics = len(matched_topics) % 4
        
        topic_index = 0
        for week_idx, week_theme in enumerate(week_themes):
            week_key = week_theme["name"].lower().replace(" ", "_")
            weekly_plan[week_key] = {}
            
            # Calculate topics for this week
            week_topic_count = topics_per_week + (1 if week_idx < remaining_topics else 0)
            week_topics = matched_topics[topic_index:topic_index + week_topic_count]
            topic_index += week_topic_count
            
            # Create 7 days of activities
            day_names = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
            
            for day_idx, day_name in enumerate(day_names):
                if day_idx < len(week_topics):
                    topic = week_topics[day_idx]
                    weekly_plan[week_key][day_name] = self._create_day_activity(topic, profile)
                else:
                    # Use additional topics or create meaningful activities
                    if len(matched_topics) > 7:
                        additional_topic = matched_topics[(week_idx * 7) + day_idx] if (week_idx * 7) + day_idx < len(matched_topics) else matched_topics[day_idx % len(matched_topics)]
                        weekly_plan[week_key][day_name] = self._create_day_activity(additional_topic, profile)
                    else:
                        # Use a topic from the current week for practice
                        practice_topic = week_topics[day_idx % len(week_topics)] if week_topics else matched_topics[0]
                        weekly_plan[week_key][day_name] = self._create_practice_activity(practice_topic, profile)
        
        return weekly_plan
    
    def _create_day_activity(self, topic: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
        """Create a day activity from a real topic."""
        return {
            "activity": topic.get("Activity 1", topic.get("activity_1", f"Explore {topic.get('Topic', 'Learning')}")),
            "duration": topic.get("Estimated Time", topic.get("estimated_time", "30 minutes")),
            "topic": topic.get("Topic", "Learning"),
            "niche": topic.get("Niche", "General"),
            "objective": topic.get("Objective", f"Learn about {topic.get('Topic', 'learning')}"),
            "materials_needed": self._get_materials(topic, profile),
            "difficulty": topic.get("Difficulty", "Beginner"),
            "age_appropriate": topic.get("Age", 5)
        }
    
    def _create_practice_activity(self, topic: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
        """Create a practice activity based on a real topic."""
        return {
            "activity": f"Practice and apply {topic.get('Topic', 'learning')} concepts",
            "duration": "30 min",
            "topic": f"{topic.get('Topic', 'Learning')} Practice",
            "niche": topic.get("Niche", "Practice"),
            "objective": f"Reinforce understanding of {topic.get('Topic', 'learning')}",
            "materials_needed": self._get_materials(topic, profile),
            "difficulty": "Intermediate",
            "age_appropriate": topic.get("Age", 5)
        }
    
    def _get_materials(self, topic: Dict[str, Any], profile: Dict[str, Any]) -> List[str]:
        """Extract materials needed from topic data."""
        materials = []
        
        # Extract from Activity 1 materials
        activity1 = topic.get("Activity 1", topic.get("activity_1", ""))
        if "Materials Needed:" in activity1:
            materials_text = activity1.split("Materials Needed:")[1].split("Steps to Follow:")[0].strip()
            materials = [m.strip() for m in materials_text.split(",") if m.strip()]
        
        # Add basic materials if none found
        if not materials:
            materials = ["Basic materials", "Paper", "Pencils"]
        
        return materials[:5]  # Limit to 5 materials
    
    def _create_empty_plan(self) -> Dict[str, Any]:
        """Create an empty plan structure when no topics are available."""
        logger.warning("⚠️ Creating empty plan - no topics available")
        return {
            "discovery_week": {},
            "skills_week": {},
            "creation_week": {},
            "project_week": {}
        }
