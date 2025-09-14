#!/usr/bin/env python3
"""
Data Restructurer for Unschooling Platform
Transforms raw topics data into organized, structured learning paths
"""

import json
import os
import copy
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataRestructurer:
    """Restructures topics data into organized learning paths with relationships."""
    
    def __init__(self):
        self.age_groups = {
            "Infant": {"min_age": 0, "max_age": 2, "description": "Early development and sensory exploration"},
            "Toddler": {"min_age": 2, "max_age": 4, "description": "Basic skills and concept introduction"},
            "Children": {"min_age": 5, "max_age": 8, "description": "Foundation building and skill development"},
            "Pre-Teen": {"min_age": 9, "max_age": 12, "description": "Advanced concepts and independent learning"}
        }
        
        self.difficulty_levels = {
            "Beginner": {"level": 1, "description": "Basic introduction and foundation concepts"},
            "Intermediate": {"level": 2, "description": "Building on basics with practical applications"},
            "Advanced": {"level": 3, "description": "Complex concepts and independent exploration"},
            "Expert": {"level": 4, "description": "Mastery level and creative application"}
        }
        
        self.learning_paths = {
            "Finance": {
                "path": ["Money Basics", "Spending & Saving", "Budgeting", "Investing", "Financial Planning"],
                "description": "Progressive financial literacy from basic concepts to advanced planning"
            },
            "Communication": {
                "path": ["Listening Skills", "Speaking Clearly", "Reading", "Writing", "Public Speaking"],
                "description": "Communication skills development from basic to advanced"
            },
            "AI": {
                "path": ["AI Basics", "Machine Learning", "Coding", "Problem Solving", "AI Ethics"],
                "description": "AI and technology skills progression"
            },
            "Entrepreneurship": {
                "path": ["Business Basics", "Idea Generation", "Planning", "Marketing", "Business Growth"],
                "description": "Entrepreneurial mindset and business skills development"
            }
        }
    
    def categorize_age_group(self, age: int) -> str:
        """Categorize age into appropriate age group."""
        if age <= 2:
            return "Infant"
        elif age <= 4:
            return "Toddler"
        elif age <= 8:
            return "Children"
        else:
            return "Pre-Teen"
    
    def determine_difficulty(self, topic: Dict[str, Any], niche: str) -> str:
        """Determine difficulty level based on topic complexity and age."""
        age = topic.get("Age", 5)
        topic_name = topic.get("Topic", "").lower()
        objective = topic.get("Objective", "").lower()
        
        # Age-based difficulty
        if age <= 3:
            base_difficulty = "Beginner"
        elif age <= 6:
            base_difficulty = "Intermediate"
        elif age <= 9:
            base_difficulty = "Advanced"
        else:
            base_difficulty = "Expert"
        
        # Topic complexity adjustments
        complex_keywords = ["advanced", "complex", "strategy", "analysis", "planning", "ethics"]
        simple_keywords = ["basic", "introduction", "simple", "fundamental", "start"]
        
        if any(keyword in topic_name or keyword in objective for keyword in complex_keywords):
            if base_difficulty == "Beginner":
                base_difficulty = "Intermediate"
            elif base_difficulty == "Intermediate":
                base_difficulty = "Advanced"
        
        if any(keyword in topic_name or keyword in objective for keyword in simple_keywords):
            if base_difficulty == "Advanced":
                base_difficulty = "Intermediate"
            elif base_difficulty == "Expert":
                base_difficulty = "Advanced"
        
        return base_difficulty
    
    def create_topic_relationships(self, topics: List[Dict[str, Any]]) -> Dict[str, List[str]]:
        """Create topic relationships and prerequisites."""
        relationships = {}
        
        # Group topics by niche
        niche_topics = {}
        for topic in topics:
            niche = topic.get("Niche", "")
            if niche not in niche_topics:
                niche_topics[niche] = []
            niche_topics[niche].append(topic)
        
        # Create relationships within each niche
        for niche, niche_topic_list in niche_topics.items():
            # Sort by age and difficulty
            sorted_topics = sorted(niche_topic_list, key=lambda x: (x.get("Age", 0), x.get("Topic", "")))
            
            for i, topic in enumerate(sorted_topics):
                topic_id = f"{niche}_{topic.get('Topic', '').replace(' ', '_')}"
                relationships[topic_id] = []
                
                # Find prerequisites (topics that should come before)
                for j, potential_prereq in enumerate(sorted_topics[:i]):
                    if potential_prereq.get("Age", 0) < topic.get("Age", 0):
                        prereq_id = f"{niche}_{potential_prereq.get('Topic', '').replace(' ', '_')}"
                        relationships[topic_id].append(prereq_id)
        
        return relationships
    
    def create_learning_sequences(self, topics: List[Dict[str, Any]]) -> Dict[str, List[str]]:
        """Create logical learning sequences for each niche."""
        sequences = {}
        
        for niche in self.learning_paths.keys():
            niche_topics = [t for t in topics if t.get("Niche") == niche]
            
            # Sort by age and difficulty
            sorted_topics = sorted(niche_topics, key=lambda x: (x.get("Age", 0), x.get("Topic", "")))
            
            # Create sequence
            sequence = []
            for topic in sorted_topics:
                topic_id = f"{niche}_{topic.get('Topic', '').replace(' ', '_')}"
                sequence.append(topic_id)
            
            sequences[niche] = sequence
        
        return sequences
    
    def restructure_topic(self, topic: Dict[str, Any], relationships: Dict[str, List[str]], sequences: Dict[str, List[str]]) -> Dict[str, Any]:
        """Restructure a single topic with new organization fields."""
        restructured = copy.deepcopy(topic)
        
        # Add new fields
        age = topic.get("Age", 5)
        niche = topic.get("Niche", "")
        topic_name = topic.get("Topic", "")
        
        # Age group categorization
        restructured["age_group"] = self.categorize_age_group(age)
        restructured["age_group_info"] = self.age_groups[self.categorize_age_group(age)]
        
        # Difficulty level
        restructured["difficulty"] = self.determine_difficulty(topic, niche)
        restructured["difficulty_info"] = self.difficulty_levels[self.determine_difficulty(topic, niche)]
        
        # Topic relationships
        topic_id = f"{niche}_{topic_name.replace(' ', '_')}"
        restructured["prerequisites"] = relationships.get(topic_id, [])
        restructured["topic_id"] = topic_id
        
        # Learning path information
        if niche in self.learning_paths:
            restructured["learning_path"] = self.learning_paths[niche]["path"]
            restructured["path_description"] = self.learning_paths[niche]["description"]
            
            # Find position in learning path
            try:
                path_position = self.learning_paths[niche]["path"].index(topic_name) + 1
                restructured["path_position"] = path_position
                restructured["total_path_topics"] = len(self.learning_paths[niche]["path"])
            except ValueError:
                restructured["path_position"] = None
                restructured["total_path_topics"] = None
        
        # Enhanced metadata
        restructured["estimated_time_minutes"] = self._extract_time_minutes(topic.get("Estimated Time", "20 mins"))
        restructured["has_activities"] = bool(topic.get("Activity 1") or topic.get("Activity 2"))
        restructured["activity_count"] = sum([1 for i in range(1, 3) if topic.get(f"Activity {i}")])
        
        # Content quality indicators
        restructured["content_richness"] = self._assess_content_richness(topic)
        
        return restructured
    
    def _extract_time_minutes(self, time_str: str) -> int:
        """Extract time in minutes from time string."""
        try:
            if "mins" in time_str.lower():
                return int(time_str.lower().replace("mins", "").strip())
            elif "min" in time_str.lower():
                return int(time_str.lower().replace("min", "").strip())
            else:
                return 20  # Default fallback
        except:
            return 20
    
    def _assess_content_richness(self, topic: Dict[str, Any]) -> str:
        """Assess the richness of topic content."""
        score = 0
        
        # Check for various content elements
        if topic.get("Explanation"):
            score += 2
        if topic.get("Activity 1"):
            score += 3
        if topic.get("Activity 2"):
            score += 3
        if topic.get("Hashtags"):
            score += 1
        
        if score >= 7:
            return "Rich"
        elif score >= 4:
            return "Good"
        else:
            return "Basic"
    
    def restructure_all_topics(self, input_file: str, output_file: str) -> Dict[str, Any]:
        """Restructure all topics and save to new file."""
        logger.info(f"🚀 Starting data restructuring from {input_file}")
        
        # Load original data
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                original_topics = json.load(f)
            logger.info(f"✅ Loaded {len(original_topics)} topics from {input_file}")
        except Exception as e:
            logger.error(f"❌ Error loading {input_file}: {e}")
            return {"success": False, "error": str(e)}
        
        # Create relationships and sequences
        logger.info("🔗 Creating topic relationships...")
        relationships = self.create_topic_relationships(original_topics)
        
        logger.info("📚 Creating learning sequences...")
        sequences = self.create_learning_sequences(original_topics)
        
        # Restructure each topic
        logger.info("🔄 Restructuring individual topics...")
        restructured_topics = []
        
        for i, topic in enumerate(original_topics):
            if i % 100 == 0:
                logger.info(f"   Progress: {i}/{len(original_topics)} topics processed")
            
            restructured_topic = self.restructure_topic(topic, relationships, sequences)
            restructured_topics.append(restructured_topic)
        
        # Create comprehensive output structure
        output_data = {
            "metadata": {
                "restructured_at": datetime.now().isoformat(),
                "original_file": input_file,
                "total_topics": len(restructured_topics),
                "age_groups": self.age_groups,
                "difficulty_levels": self.difficulty_levels,
                "learning_paths": self.learning_paths
            },
            "relationships": relationships,
            "sequences": sequences,
            "topics": restructured_topics
        }
        
        # Save restructured data
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=2, ensure_ascii=False)
            logger.info(f"✅ Restructured data saved to {output_file}")
        except Exception as e:
            logger.error(f"❌ Error saving {output_file}: {e}")
            return {"success": False, "error": str(e)}
        
        # Generate summary statistics
        stats = self._generate_statistics(restructured_topics, relationships, sequences)
        
        logger.info("📊 Restructuring completed successfully!")
        return {
            "success": True,
            "output_file": output_file,
            "statistics": stats,
            "metadata": output_data["metadata"]
        }
    
    def _generate_statistics(self, topics: List[Dict[str, Any]], relationships: Dict[str, List[str]], sequences: Dict[str, List[str]]) -> Dict[str, Any]:
        """Generate comprehensive statistics about the restructured data."""
        stats = {
            "total_topics": len(topics),
            "by_age_group": {},
            "by_difficulty": {},
            "by_niche": {},
            "by_content_richness": {},
            "relationships_count": len(relationships),
            "sequences_count": len(sequences)
        }
        
        # Count by age group
        for topic in topics:
            age_group = topic.get("age_group", "Unknown")
            stats["by_age_group"][age_group] = stats["by_age_group"].get(age_group, 0) + 1
        
        # Count by difficulty
        for topic in topics:
            difficulty = topic.get("difficulty", "Unknown")
            stats["by_difficulty"][difficulty] = stats["by_difficulty"].get(difficulty, 0) + 1
        
        # Count by niche
        for topic in topics:
            niche = topic.get("Niche", "Unknown")
            stats["by_niche"][niche] = stats["by_niche"].get(niche, 0) + 1
        
        # Count by content richness
        for topic in topics:
            richness = topic.get("content_richness", "Unknown")
            stats["by_content_richness"][richness] = stats["by_content_richness"].get(richness, 0) + 1
        
        return stats
    
    def create_backup(self, original_file: str) -> str:
        """Create a timestamped backup of the original file."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = f"{original_file.replace('.json', '')}_backup_{timestamp}.json"
        
        try:
            with open(original_file, 'r', encoding='utf-8') as f:
                original_data = json.load(f)
            
            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(original_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"✅ Backup created: {backup_file}")
            return backup_file
        except Exception as e:
            logger.error(f"❌ Error creating backup: {e}")
            return ""

def main():
    """Main function to run the data restructuring."""
    restructurer = DataRestructurer()
    
    # File paths
    input_file = "data/topicsdata.json"
    output_file = "data/topicsdata_restructured.json"
    
    # Create backup first
    logger.info("🔄 Creating backup of original data...")
    backup_file = restructurer.create_backup(input_file)
    
    if not backup_file:
        logger.error("❌ Backup failed. Aborting restructuring.")
        return
    
    # Run restructuring
    result = restructurer.restructure_all_topics(input_file, output_file)
    
    if result["success"]:
        logger.info("🎉 Data restructuring completed successfully!")
        logger.info(f"📁 Output file: {output_file}")
        logger.info(f"📊 Statistics: {json.dumps(result['statistics'], indent=2)}")
        logger.info(f"🔄 Original data backed up to: {backup_file}")
    else:
        logger.error(f"❌ Data restructuring failed: {result.get('error', 'Unknown error')}")

if __name__ == "__main__":
    main()
