#!/usr/bin/env python3
"""
Dynamic Learning Path Builder
Creates learning paths based on actual topic content and complexity
"""

import json
import re
from typing import Dict, List, Any, Optional, Tuple
import logging
from collections import defaultdict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DynamicPathBuilder:
    """Builds learning paths based on actual topic content and complexity."""
    
    def __init__(self):
        # Keywords that indicate topic complexity
        self.complexity_indicators = {
            "basic": ["basic", "introduction", "simple", "start", "begin", "first", "learn"],
            "intermediate": ["practice", "apply", "use", "create", "build", "develop", "explore"],
            "advanced": ["advanced", "complex", "strategy", "analysis", "planning", "design", "optimize"],
            "expert": ["master", "expert", "professional", "leadership", "innovation", "research", "ethics"]
        }
        
        # Age-based complexity mapping
        self.age_complexity = {
            3: "basic",
            4: "basic", 
            5: "basic",
            6: "intermediate",
            7: "intermediate",
            8: "intermediate",
            9: "advanced",
            10: "advanced",
            11: "expert",
            12: "expert"
        }
    
    def analyze_topic_complexity(self, topic: Dict[str, Any]) -> str:
        """Analyze topic complexity based on content and age."""
        age = topic.get("Age", 5)
        topic_name = topic.get("Topic", "").lower()
        objective = topic.get("Objective", "").lower()
        explanation = topic.get("Explanation", "").lower()
        
        # Start with age-based complexity
        base_complexity = self.age_complexity.get(age, "intermediate")
        
        # Adjust based on content analysis
        content_score = 0
        
        # Check topic name for complexity indicators
        for complexity, keywords in self.complexity_indicators.items():
            for keyword in keywords:
                if keyword in topic_name:
                    if complexity == "basic":
                        content_score -= 1
                    elif complexity == "advanced":
                        content_score += 1
                    elif complexity == "expert":
                        content_score += 2
        
        # Check objective and explanation
        for complexity, keywords in self.complexity_indicators.items():
            for keyword in keywords:
                if keyword in objective or keyword in explanation:
                    if complexity == "basic":
                        content_score -= 1
                    elif complexity == "advanced":
                        content_score += 1
                    elif complexity == "expert":
                        content_score += 2
        
        # Determine final complexity
        if content_score <= -2:
            return "basic"
        elif content_score <= 0:
            return "intermediate"
        elif content_score <= 2:
            return "advanced"
        else:
            return "expert"
    
    def group_topics_by_complexity(self, topics: List[Dict[str, Any]]) -> Dict[str, Dict[str, List[Dict[str, Any]]]]:
        """Group topics by niche and complexity level."""
        grouped = defaultdict(lambda: defaultdict(list))
        
        for topic in topics:
            niche = topic.get("Niche", "Unknown")
            complexity = self.analyze_topic_complexity(topic)
            grouped[niche][complexity].append(topic)
        
        return grouped
    
    def create_learning_sequences(self, grouped_topics: Dict[str, Dict[str, List[Dict[str, Any]]]]) -> Dict[str, Dict[str, Any]]:
        """Create learning sequences for each niche based on complexity progression."""
        learning_sequences = {}
        
        complexity_order = ["basic", "intermediate", "advanced", "expert"]
        
        for niche, complexity_groups in grouped_topics.items():
            sequence = {
                "niche": niche,
                "description": f"Progressive learning path for {niche} from basic to expert",
                "stages": {},
                "total_topics": 0,
                "recommended_path": []
            }
            
            # Create stages based on complexity
            for complexity in complexity_order:
                if complexity in complexity_groups:
                    topics = complexity_groups[complexity]
                    # Sort topics within complexity by age
                    topics.sort(key=lambda x: x.get("Age", 5))
                    
                    sequence["stages"][complexity] = {
                        "complexity": complexity,
                        "description": f"{complexity.title()} level {niche} concepts",
                        "topics": topics,
                        "topic_count": len(topics),
                        "age_range": f"{min(t.get('Age', 5) for t in topics)}-{max(t.get('Age', 5) for t in topics)}"
                    }
                    sequence["total_topics"] += len(topics)
            
            # Create recommended learning path
            recommended_path = []
            for complexity in complexity_order:
                if complexity in sequence["stages"]:
                    # Take first 2-3 topics from each complexity level
                    topics = sequence["stages"][complexity]["topics"][:3]
                    for topic in topics:
                        recommended_path.append({
                            "topic_id": topic.get("topic_id", f"{niche}_{topic.get('Topic', '').replace(' ', '_')}"),
                            "topic_name": topic.get("Topic", ""),
                            "complexity": complexity,
                            "age": topic.get("Age", 5),
                            "estimated_time": topic.get("Estimated Time", "20 mins")
                        })
            
            sequence["recommended_path"] = recommended_path
            learning_sequences[niche] = sequence
        
        return learning_sequences
    
    def build_dynamic_paths(self, restructured_file: str, output_file: str) -> Dict[str, Any]:
        """Build dynamic learning paths based on actual content."""
        logger.info(f"🚀 Starting dynamic path building for {restructured_file}")
        
        # Load restructured data
        try:
            with open(restructured_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            logger.info(f"✅ Loaded restructured data with {len(data['topics'])} topics")
        except Exception as e:
            logger.error(f"❌ Error loading {restructured_file}: {e}")
            return {"success": False, "error": str(e)}
        
        # Group topics by complexity
        logger.info("📊 Analyzing topic complexity...")
        grouped_topics = self.group_topics_by_complexity(data['topics'])
        
        # Create learning sequences
        logger.info("🔗 Creating learning sequences...")
        learning_sequences = self.create_learning_sequences(grouped_topics)
        
        # Update each topic with dynamic path information
        logger.info("🔄 Updating topics with dynamic path info...")
        for topic in data['topics']:
            niche = topic.get("Niche", "")
            if niche in learning_sequences:
                sequence = learning_sequences[niche]
                
                # Find topic's position in the sequence
                topic_position = None
                topic_stage = None
                
                for stage_name, stage_data in sequence["stages"].items():
                    for stage_topic in stage_data["topics"]:
                        if stage_topic.get("Topic") == topic.get("Topic"):
                            topic_position = len(sequence["recommended_path"])
                            topic_stage = stage_name
                            break
                    if topic_position:
                        break
                
                # Update topic with dynamic path info
                topic["dynamic_path"] = {
                    "stage": topic_stage,
                    "stage_position": topic_position,
                    "total_stages": len(sequence["stages"]),
                    "recommended_next": self._find_recommended_next(topic, sequence),
                    "learning_sequence": {
                        "niche": niche,
                        "total_topics": sequence["total_topics"],
                        "stages_available": list(sequence["stages"].keys())
                    }
                }
        
        # Add dynamic paths to metadata
        data['metadata']['dynamic_paths'] = {
            "built_at": "2025-08-11T22:00:00",
            "total_niches": len(learning_sequences),
            "learning_sequences": learning_sequences
        }
        
        # Save updated data
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            logger.info(f"✅ Dynamic paths data saved to {output_file}")
        except Exception as e:
            logger.error(f"❌ Error saving {output_file}: {e}")
            return {"success": False, "error": str(e)}
        
        return {
            "success": True,
            "output_file": output_file,
            "learning_sequences": learning_sequences,
            "total_topics_updated": len(data['topics'])
        }
    
    def _find_recommended_next(self, current_topic: Dict[str, Any], sequence: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Find the next recommended topic in the learning sequence."""
        current_stage = None
        current_position = None
        
        # Find current topic's position
        for stage_name, stage_data in sequence["stages"].items():
            for i, topic in enumerate(stage_data["topics"]):
                if topic.get("Topic") == current_topic.get("Topic"):
                    current_stage = stage_name
                    current_position = i
                    break
            if current_stage:
                break
        
        if not current_stage:
            return None
        
        # Find next topic in same stage
        if current_position + 1 < len(sequence["stages"][current_stage]["topics"]):
            next_topic = sequence["stages"][current_stage]["topics"][current_position + 1]
            return {
                "topic_id": next_topic.get("topic_id", f"{next_topic.get('Niche', '')}_{next_topic.get('Topic', '').replace(' ', '_')}"),
                "topic_name": next_topic.get("Topic", ""),
                "reason": "Next topic in same complexity level"
            }
        
        # Find first topic in next stage
        stage_order = ["basic", "intermediate", "advanced", "expert"]
        try:
            current_index = stage_order.index(current_stage)
            if current_index + 1 < len(stage_order):
                next_stage = stage_order[current_index + 1]
                if next_stage in sequence["stages"] and sequence["stages"][next_stage]["topics"]:
                    next_topic = sequence["stages"][next_stage]["topics"][0]
                    return {
                        "topic_id": next_topic.get("topic_id", f"{next_topic.get('Niche', '')}_{next_topic.get('Topic', '').replace(' ', '_')}"),
                        "topic_name": next_topic.get("Topic", ""),
                        "reason": f"First topic in {next_stage} level"
                    }
        except ValueError:
            pass
        
        return None
    
    def generate_path_report(self, learning_sequences: Dict[str, Any]) -> str:
        """Generate a human-readable report of the learning paths."""
        report = []
        report.append("🎯 DYNAMIC LEARNING PATHS REPORT")
        report.append("=" * 50)
        
        for niche, sequence in learning_sequences.items():
            report.append(f"\n📚 {niche.upper()} LEARNING PATH")
            report.append("-" * 30)
            report.append(f"Total Topics: {sequence['total_topics']}")
            report.append(f"Stages: {', '.join(sequence['stages'].keys())}")
            
            for stage_name, stage_data in sequence["stages"].items():
                report.append(f"\n  {stage_name.upper()} ({stage_data['topic_count']} topics)")
                report.append(f"    Age Range: {stage_data['age_range']}")
                report.append(f"    Sample Topics:")
                for topic in stage_data["topics"][:3]:  # Show first 3
                    report.append(f"      - {topic.get('Topic', '')} (Age {topic.get('Age', '')})")
                if stage_data['topic_count'] > 3:
                    report.append(f"      ... and {stage_data['topic_count'] - 3} more")
        
        return "\n".join(report)

def main():
    """Main function to run dynamic path building."""
    builder = DynamicPathBuilder()
    
    # File paths
    input_file = "data/topicsdata_path_mapped.json"
    output_file = "data/topicsdata_dynamic_paths.json"
    
    print("🚀 Starting Dynamic Learning Path Building...")
    print("=" * 50)
    
    # Run dynamic path building
    result = builder.build_dynamic_paths(input_file, output_file)
    
    if result["success"]:
        print(f"✅ Dynamic path building completed successfully!")
        print(f"📁 Output file: {output_file}")
        print(f"📊 Total topics updated: {result['total_topics_updated']}")
        
        # Generate and display report
        print("\n📋 Generating path report...")
        report = builder.generate_path_report(result['learning_sequences'])
        print(report)
        
        print(f"\n🎉 Your AI agents now have intelligent learning paths!")
        print(f"📁 Check the output file: {output_file}")
    else:
        print(f"❌ Dynamic path building failed: {result.get('error', 'Unknown error')}")

if __name__ == "__main__":
    main()
