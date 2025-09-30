"""
Data Standardizer for Unschooling Backend
Ensures consistent data formats across child profiles, topics, and learning plans
"""

import json
from typing import Dict, List, Any
from datetime import datetime

class DataStandardizer:
    """Standardizes data formats for child profiles, topics, and learning plans"""
    
    @staticmethod
    def standardize_child_profile(child_data: Dict[str, Any]) -> Dict[str, Any]:
        """Standardize child profile data format"""
        return {
            "id": child_data.get("id", f"child_{datetime.now().timestamp()}"),
            "name": child_data.get("name", child_data.get("child_name", "")),
            "age": int(child_data.get("age", child_data.get("child_age", 5))),
            "age_range": child_data.get("age_range", [child_data.get("age", 5), child_data.get("age", 5)]),
            "interests": child_data.get("interests", []),
            "learning_style": child_data.get("learning_style", child_data.get("preferred_learning_style", "mixed")),
            "learning_styles": child_data.get("learning_styles", [child_data.get("learning_style", "mixed")]),
            "goals": child_data.get("goals", []),
            "plan_type": child_data.get("plan_type", "hybrid"),
            "difficulty_level": child_data.get("difficulty_level", "beginner"),
            "attention_span": child_data.get("attention_span", "medium"),
            "cognitive_level": child_data.get("cognitive_level", "beginner"),
            "preferred_activities": child_data.get("preferred_activities", []),
            "created_at": child_data.get("created_at", datetime.now().isoformat()),
            "updated_at": datetime.now().isoformat()
        }
    
    @staticmethod
    def standardize_topic(topic_data: Dict[str, Any]) -> Dict[str, Any]:
        """Standardize topic data format"""
        # Parse age range from string or number
        age = topic_data.get("Age", "3 and 4")
        if isinstance(age, int):
            age_range = [age, age]
            age_str = f"{age} and {age}"
        elif isinstance(age, str):
            if " and " in age:
                parts = age.split(" and ")
                age_range = [int(parts[0]), int(parts[1])]
                age_str = age
            else:
                age_num = int(age)
                age_range = [age_num, age_num]
                age_str = f"{age_num} and {age_num}"
        else:
            age_range = [3, 4]
            age_str = "3 and 4"
        
        return {
            "id": topic_data.get("#", topic_data.get("id", 1)),
            "niche": topic_data.get("Niche", ""),
            "topic": topic_data.get("Topic", ""),
            "objective": topic_data.get("Objective", ""),
            "explanation": topic_data.get("Explanation", ""),
            "hashtags": topic_data.get("Hashtags", ""),
            "estimated_time": topic_data.get("Estimated Time", topic_data.get("EstimatedTime", "20 mins")),
            "age": age_str,
            "age_range": age_range,
            "difficulty": topic_data.get("Difficulty", "beginner"),
            "learning_style": topic_data.get("LearningStyle", ["visual", "kinesthetic"]),
            "activity1": DataStandardizer._parse_activity(topic_data.get("Activity 1", "")),
            "activity2": DataStandardizer._parse_activity(topic_data.get("Activity 2", ""))
        }
    
    @staticmethod
    def _parse_activity(activity_text: str) -> Dict[str, Any]:
        """Parse activity text into structured format"""
        if not activity_text:
            return {
                "title": "",
                "materials": [],
                "steps": [],
                "achievement": "",
                "gains": []
            }
        
        lines = activity_text.split('\n')
        title = lines[0] if lines else ""
        
        materials = []
        steps = []
        achievement = ""
        gains = []
        
        current_section = None
        
        for line in lines[1:]:
            line = line.strip()
            if not line:
                continue
                
            if "Materials Needed:" in line:
                current_section = "materials"
                materials_text = line.replace("Materials Needed:", "").strip()
                materials = [item.strip() for item in materials_text.split(",")]
            elif "Steps to Follow:" in line:
                current_section = "steps"
            elif "What Should Be Achieved:" in line:
                current_section = "achievement"
                achievement = line.replace("What Should Be Achieved:", "").strip()
            elif "What is Gained:" in line:
                current_section = "gains"
            elif current_section == "steps" and line.startswith("•"):
                steps.append(line.replace("•", "").strip())
            elif current_section == "gains" and line.startswith("•"):
                gains.append(line.replace("•", "").strip())
        
        return {
            "title": title,
            "materials": materials,
            "steps": steps,
            "achievement": achievement,
            "gains": gains
        }
    
    @staticmethod
    def standardize_learning_plan(plan_data: Dict[str, Any], child_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Standardize learning plan data format"""
        return {
            "plan_id": f"plan_{datetime.now().timestamp()}",
            "month": datetime.now().strftime("%B %Y"),
            "generated_at": datetime.now().isoformat(),
            "child_profile": child_profile,
            "weekly_plan": plan_data.get("weekly_plan", {}),
            "matched_topics": plan_data.get("matched_topics", []),
            "learning_objectives": plan_data.get("learning_objectives", []),
            "recommended_activities": plan_data.get("recommended_activities", []),
            "progress_tracking": plan_data.get("progress_tracking", {
                "metrics": ["engagement", "completion", "understanding", "enjoyment"],
                "frequency": "daily",
                "assessment_methods": ["observation", "conversation", "project_review"]
            })
        }
    
    @staticmethod
    def convert_topics_to_standard_format(topics_file_path: str) -> List[Dict[str, Any]]:
        """Convert existing topics data to standardized format"""
        with open(topics_file_path, 'r', encoding='utf-8') as f:
            topics_data = json.load(f)
        
        standardized_topics = []
        for topic in topics_data:
            standardized_topic = DataStandardizer.standardize_topic(topic)
            standardized_topics.append(standardized_topic)
        
        return standardized_topics
    
    @staticmethod
    def save_standardized_topics(topics: List[Dict[str, Any]], output_path: str):
        """Save standardized topics to file"""
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(topics, f, indent=2, ensure_ascii=False)

# Example usage
if __name__ == "__main__":
    # Convert existing topics data
    standardizer = DataStandardizer()
    standardized_topics = standardizer.convert_topics_to_standard_format("data/topicsdata.json")
    standardizer.save_standardized_topics(standardized_topics, "data/topicsdata_standardized.json")
    print(f"✅ Converted {len(standardized_topics)} topics to standardized format") 