#!/usr/bin/env python3
"""
Learning Path Mapper
Fixes the learning path mapping by properly matching existing topics to path positions
"""

import json
import re
from typing import Dict, List, Any, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LearningPathMapper:
    """Maps existing topics to proper learning path positions."""
    
    def __init__(self):
        # Define flexible learning paths with multiple possible topic names
        self.learning_paths = {
            "Finance": {
                "path": [
                    ["Money Basics", "Understanding Money", "What is Money", "Money Introduction", "Money", "Coins", "Bills"],
                    ["Spending & Saving", "Spending vs Saving", "Spend or Save", "Money Choices", "Spending", "Saving", "Budget"],
                    ["Budgeting", "Budget Basics", "Money Planning", "Financial Planning", "Plan Money", "Money Plan"],
                    ["Investing", "Investment Basics", "Growing Money", "Smart Money", "Invest", "Grow Money"],
                    ["Financial Planning", "Money Goals", "Financial Goals", "Long-term Planning", "Goals", "Future Money"]
                ],
                "description": "Progressive financial literacy from basic concepts to advanced planning"
            },
            "Communication": {
                "path": [
                    ["Listening Skills", "Active Listening", "Good Listening", "Listen Well", "Listen", "Hearing", "Pay Attention"],
                    ["Speaking Clearly", "Clear Speech", "Talk Clearly", "Express Yourself", "Speak", "Talk", "Voice"],
                    ["Reading", "Reading Skills", "Learn to Read", "Reading Basics", "Read", "Books", "Stories"],
                    ["Writing", "Writing Skills", "Learn to Write", "Writing Basics", "Write", "Pen", "Paper"],
                    ["Public Speaking", "Speaking in Public", "Presentations", "Confident Speaking", "Present", "Confidence"]
                ],
                "description": "Communication skills development from basic to advanced"
            },
            "AI": {
                "path": [
                    ["AI Basics", "What is AI", "Artificial Intelligence", "Smart Machines", "Robots", "Technology", "Computers"],
                    ["Machine Learning", "Learning Machines", "AI Learning", "Smart Learning", "Learning", "Smart", "Intelligence"],
                    ["Coding", "Programming", "Computer Code", "Learn to Code", "Code", "Program", "Computer"],
                    ["Problem Solving", "Solve Problems", "Critical Thinking", "Logic Skills", "Think", "Logic", "Problems"],
                    ["AI Ethics", "AI Safety", "Responsible AI", "Ethical Technology", "Ethics", "Safety", "Responsible"]
                ],
                "description": "AI and technology skills progression"
            },
            "Entrepreneurship": {
                "path": [
                    ["Business Basics", "Business Introduction", "What is Business", "Business Start", "Business", "Shop", "Store"],
                    ["Idea Generation", "Creative Ideas", "Business Ideas", "Innovation", "Ideas", "Creative", "Innovate"],
                    ["Planning", "Business Planning", "Plan Your Business", "Strategic Planning", "Plan", "Strategy", "Organize"],
                    ["Marketing", "Business Marketing", "Promote Business", "Customer Attraction", "Market", "Promote", "Customers"],
                    ["Business Growth", "Grow Business", "Business Expansion", "Scale Up", "Grow", "Expand", "Scale"]
                ],
                "description": "Entrepreneurial mindset and business skills development"
            }
        }
    
    def find_topic_in_path(self, topic_name: str, niche: str) -> Optional[Dict[str, Any]]:
        """Find where a topic fits in the learning path."""
        if niche not in self.learning_paths:
            return None
        
        path = self.learning_paths[niche]["path"]
        topic_lower = topic_name.lower()
        
        for position, possible_names in enumerate(path, 1):
            for possible_name in possible_names:
                if self._is_topic_match(topic_lower, possible_name.lower()):
                    return {
                        "position": position,
                        "total_topics": len(path),
                        "matched_name": possible_name,
                        "confidence": self._calculate_confidence(topic_lower, possible_name.lower())
                    }
        
        return None
    
    def _is_topic_match(self, topic_name: str, path_name: str) -> bool:
        """Check if a topic matches a path name with flexible matching."""
        # Exact match
        if topic_name == path_name:
            return True
        
        # Contains match
        if path_name in topic_name or topic_name in path_name:
            return True
        
        # Word-based matching
        topic_words = set(re.findall(r'\w+', topic_name))
        path_words = set(re.findall(r'\w+', path_name))
        
        # If more than 50% of words match
        if len(topic_words.intersection(path_words)) / max(len(topic_words), len(path_words)) > 0.5:
            return True
        
        return False
    
    def _calculate_confidence(self, topic_name: str, path_name: str) -> float:
        """Calculate confidence score for topic-path matching."""
        if topic_name == path_name:
            return 1.0
        
        topic_words = set(re.findall(r'\w+', topic_name))
        path_words = set(re.findall(r'\w+', path_name))
        
        if not topic_words or not path_words:
            return 0.0
        
        intersection = len(topic_words.intersection(path_words))
        union = len(topic_words.union(path_words))
        
        return intersection / union if union > 0 else 0.0
    
    def map_all_topics(self, restructured_file: str, output_file: str) -> Dict[str, Any]:
        """Map all topics to their learning paths."""
        logger.info(f"🗺️ Starting learning path mapping for {restructured_file}")
        
        # Load restructured data
        try:
            with open(restructured_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            logger.info(f"✅ Loaded restructured data with {len(data['topics'])} topics")
        except Exception as e:
            logger.error(f"❌ Error loading {restructured_file}: {e}")
            return {"success": False, "error": str(e)}
        
        # Map each topic
        mapped_count = 0
        unmapped_count = 0
        
        for topic in data['topics']:
            niche = topic.get('Niche', '')
            topic_name = topic.get('Topic', '')
            
            # Find topic in learning path
            path_info = self.find_topic_in_path(topic_name, niche)
            
            if path_info:
                topic['path_position'] = path_info['position']
                topic['total_path_topics'] = path_info['total_topics']
                topic['path_match_confidence'] = path_info['confidence']
                topic['path_matched_name'] = path_info['matched_name']
                mapped_count += 1
            else:
                topic['path_position'] = None
                topic['total_path_topics'] = None
                topic['path_match_confidence'] = 0.0
                topic['path_matched_name'] = None
                unmapped_count += 1
        
        # Update metadata
        data['metadata']['path_mapping'] = {
            "mapped_at": "2025-08-11T22:00:00",
            "total_topics": len(data['topics']),
            "mapped_topics": mapped_count,
            "unmapped_topics": unmapped_count,
            "mapping_success_rate": mapped_count / len(data['topics']) * 100
        }
        
        # Save updated data
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            logger.info(f"✅ Updated data saved to {output_file}")
        except Exception as e:
            logger.error(f"❌ Error saving {output_file}: {e}")
            return {"success": False, "error": str(e)}
        
        return {
            "success": True,
            "mapped_topics": mapped_count,
            "unmapped_topics": unmapped_count,
            "success_rate": mapped_count / len(data['topics']) * 100,
            "output_file": output_file
        }
    
    def generate_mapping_report(self, restructured_file: str) -> Dict[str, Any]:
        """Generate a report of mapping results."""
        try:
            with open(restructured_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            return {"success": False, "error": str(e)}
        
        report = {
            "total_topics": len(data['topics']),
            "by_niche": {},
            "mapping_quality": {},
            "unmapped_topics": []
        }
        
        # Analyze by niche
        for topic in data['topics']:
            niche = topic.get('Niche', 'Unknown')
            if niche not in report['by_niche']:
                report['by_niche'][niche] = {
                    "total": 0,
                    "mapped": 0,
                    "unmapped": 0,
                    "avg_confidence": 0.0
                }
            
            report['by_niche'][niche]['total'] += 1
            
            if topic.get('path_position'):
                report['by_niche'][niche]['mapped'] += 1
                report['by_niche'][niche]['avg_confidence'] += topic.get('path_match_confidence', 0.0)
            else:
                report['by_niche'][niche]['unmapped'] += 1
                report['unmapped_topics'].append({
                    "niche": niche,
                    "topic": topic.get('Topic', ''),
                    "age": topic.get('Age', ''),
                    "difficulty": topic.get('difficulty', '')
                })
        
        # Calculate averages
        for niche_data in report['by_niche'].values():
            if niche_data['mapped'] > 0:
                niche_data['avg_confidence'] /= niche_data['mapped']
        
        return report

def main():
    """Main function to run path mapping."""
    mapper = LearningPathMapper()
    
    # File paths
    input_file = "data/topicsdata_restructured.json"
    output_file = "data/topicsdata_path_mapped.json"
    
    print("🗺️ Starting Learning Path Mapping...")
    print("=" * 50)
    
    # Run mapping
    result = mapper.map_all_topics(input_file, output_file)
    
    if result["success"]:
        print(f"✅ Path mapping completed successfully!")
        print(f"📊 Mapped topics: {result['mapped_topics']}")
        print(f"📊 Unmapped topics: {result['unmapped_topics']}")
        print(f"📊 Success rate: {result['success_rate']:.1f}%")
        print(f"📁 Output file: {output_file}")
        
        # Generate report
        print("\n📋 Generating mapping report...")
        report = mapper.generate_mapping_report(output_file)
        
        if "error" not in report:  # Check if report was successful
            print("\n📈 MAPPING REPORT:")
            print("=" * 30)
            for niche, data in report['by_niche'].items():
                print(f"{niche}:")
                print(f"  Total: {data['total']}")
                print(f"  Mapped: {data['mapped']} ({data['mapped']/data['total']*100:.1f}%)")
                print(f"  Unmapped: {data['unmapped']}")
                print(f"  Avg Confidence: {data['avg_confidence']:.2f}")
                print()
            
            if report['unmapped_topics']:
                print(f"⚠️  {len(report['unmapped_topics'])} topics couldn't be mapped:")
                for topic in report['unmapped_topics'][:5]:  # Show first 5
                    print(f"  - {topic['niche']}: {topic['topic']}")
                if len(report['unmapped_topics']) > 5:
                    print(f"  ... and {len(report['unmapped_topics']) - 5} more")
        else:
            print(f"❌ Error generating report: {report.get('error', 'Unknown error')}")
    else:
        print(f"❌ Path mapping failed: {result.get('error', 'Unknown error')}")

if __name__ == "__main__":
    main()
