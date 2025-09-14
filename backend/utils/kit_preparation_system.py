#!/usr/bin/env python3
"""
Kit Preparation System
Manages offline learning kits with materials, instructions, and shipping
"""

import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import logging
from collections import defaultdict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class KitPreparationSystem:
    """Manages offline learning kits preparation and shipping."""
    
    def __init__(self):
        self.material_categories = {
            "home_items": {
                "description": "Items commonly available at home",
                "examples": ["paper", "pencils", "kitchen items", "toys", "clothes"],
                "shipping_required": False
            },
            "kit_items": {
                "description": "Items to be included in the kit",
                "examples": ["specialized tools", "craft supplies", "educational materials"],
                "shipping_required": True
            },
            "handmade_items": {
                "description": "Items prepared by hand in bulk",
                "examples": ["custom game boards", "activity cards", "setup materials"],
                "shipping_required": True,
                "preparation_required": True
            }
        }
        
        self.activity_types = {
            "craft": "Hands-on creative activities",
            "game": "Interactive learning games",
            "experiment": "Science and exploration activities",
            "roleplay": "Imaginative play and scenarios",
            "puzzle": "Problem-solving activities",
            "movement": "Physical and kinesthetic activities"
        }
    
    def create_activity_materials_list(self, topic_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create detailed materials list for a specific topic/activity."""
        topic_name = topic_data.get("Topic", "")
        activities = []
        
        # Extract activities from topic data
        for i in range(1, 3):  # Activity 1 and Activity 2
            activity_key = f"Activity {i}"
            if activity_key in topic_data and topic_data[activity_key]:
                activity_text = topic_data[activity_key]
                activity_materials = self._parse_activity_materials(activity_text, topic_name, i)
                activities.append(activity_materials)
        
        return {
            "topic_name": topic_name,
            "niche": topic_data.get("Niche", ""),
            "age_group": topic_data.get("age_group", ""),
            "difficulty": topic_data.get("difficulty", ""),
            "activities": activities,
            "total_materials": self._count_total_materials(activities),
            "shipping_required": self._check_shipping_required(activities),
            "preparation_required": self._check_preparation_required(activities)
        }
    
    def _parse_activity_materials(self, activity_text: str, topic_name: str, activity_num: int) -> Dict[str, Any]:
        """Parse activity text to extract materials and instructions."""
        # Extract materials from "Materials Needed:" section
        materials_section = ""
        if "Materials Needed:" in activity_text:
            materials_start = activity_text.find("Materials Needed:")
            materials_end = activity_text.find("\n", materials_start)
            if materials_end == -1:
                materials_end = len(activity_text)
            materials_section = activity_text[materials_start:materials_end]
        
        # Parse materials into categories
        materials = self._categorize_materials(materials_section, topic_name, activity_num)
        
        # Extract steps and objectives
        steps = self._extract_activity_steps(activity_text)
        objectives = self._extract_activity_objectives(activity_text)
        
        return {
            "activity_number": activity_num,
            "activity_title": self._extract_activity_title(activity_text),
            "materials": materials,
            "steps": steps,
            "objectives": objectives,
            "estimated_duration": self._extract_duration(activity_text),
            "setup_instructions": self._generate_setup_instructions(materials, topic_name, activity_num)
        }
    
    def _categorize_materials(self, materials_text: str, topic_name: str, activity_num: int) -> Dict[str, List[Dict[str, Any]]]:
        """Categorize materials into home items, kit items, and handmade items."""
        materials = {
            "home_items": [],
            "kit_items": [],
            "handmade_items": []
        }
        
        if not materials_text:
            return materials
        
        # Common home items that don't need shipping
        home_items = [
            "paper", "pencil", "pencils", "pen", "pens", "marker", "markers", "crayon", "crayons",
            "scissors", "glue", "tape", "ruler", "eraser", "notebook", "notebooks",
            "bowl", "bowls", "cup", "cups", "plate", "plates", "spoon", "spoons", "fork", "forks",
            "toy", "toys", "book", "books", "card", "cards", "coin", "coins",
            "clothes", "shirt", "pants", "dress", "hat", "shoes", "socks",
            "kitchen", "food", "vegetable", "vegetables", "fruit", "fruits",
            "water", "salt", "sugar", "flour", "oil", "milk", "bread"
        ]
        
        # Parse materials text
        lines = materials_text.split('\n')
        for line in lines:
            line = line.strip()
            if line and not line.startswith("Materials Needed:"):
                # Extract material name
                material_name = self._extract_material_name(line)
                if material_name:
                    material_info = {
                        "name": material_name,
                        "description": line,
                        "quantity": self._extract_quantity(line),
                        "notes": self._extract_notes(line)
                    }
                    
                    # Categorize based on material name
                    if any(item in material_name.lower() for item in home_items):
                        materials["home_items"].append(material_info)
                    else:
                        # Check if it's a specialized item that needs to be in kit
                        if self._is_specialized_material(material_name, topic_name):
                            materials["kit_items"].append(material_info)
                        else:
                            materials["home_items"].append(material_info)
        
        # Add handmade items based on topic and activity
        handmade_items = self._generate_handmade_items(topic_name, activity_num)
        materials["handmade_items"].extend(handmade_items)
        
        return materials
    
    def _extract_material_name(self, line: str) -> str:
        """Extract material name from a line of text."""
        # Remove common prefixes and suffixes
        line = line.replace("•", "").replace("-", "").strip()
        
        # Extract first meaningful word/phrase
        words = line.split()
        if words:
            # Look for quantity patterns like "2 pieces", "3 sets"
            if words[0].isdigit() and len(words) > 1:
                return " ".join(words[1:3])  # Take next 2 words
            else:
                return words[0]  # Take first word
        
        return line
    
    def _extract_quantity(self, line: str) -> str:
        """Extract quantity information from material line."""
        words = line.split()
        for i, word in enumerate(words):
            if word.isdigit() and i + 1 < len(words):
                next_word = words[i + 1]
                if next_word.lower() in ["pieces", "sets", "packs", "boxes", "bottles", "sheets"]:
                    return f"{word} {next_word}"
                elif next_word.lower() in ["of", "x"] and i + 2 < len(words):
                    return f"{word} {next_word} {words[i + 2]}"
        
        return "1 piece"
    
    def _extract_notes(self, line: str) -> str:
        """Extract additional notes from material line."""
        if "(" in line and ")" in line:
            start = line.find("(")
            end = line.find(")")
            return line[start+1:end]
        return ""
    
    def _is_specialized_material(self, material_name: str, topic_name: str) -> bool:
        """Check if material is specialized and needs to be in kit."""
        specialized_keywords = [
            "play money", "fake money", "toy money", "play coins", "play bills",
            "educational", "learning", "worksheet", "flashcard", "puzzle",
            "game board", "dice", "spinner", "timer", "stopwatch",
            "magnifying glass", "microscope", "telescope", "compass",
            "art supplies", "paint", "brushes", "canvas", "clay", "beads",
            "science kit", "experiment", "lab", "test tube", "beaker"
        ]
        
        return any(keyword in material_name.lower() for keyword in specialized_keywords)
    
    def _generate_handmade_items(self, topic_name: str, activity_num: int) -> List[Dict[str, Any]]:
        """Generate handmade items needed for the activity."""
        handmade_items = []
        
        # Topic-specific handmade items
        if "Finance" in topic_name:
            if "store" in topic_name.lower() or "shopping" in topic_name.lower():
                handmade_items.extend([
                    {
                        "name": "Grocery Store Setup",
                        "description": "Custom store counter with price labels",
                        "type": "setup_material",
                        "preparation_time": "30 minutes",
                        "materials_needed": ["cardboard", "markers", "price labels", "store sign"]
                    },
                    {
                        "name": "Play Money Set",
                        "description": "Custom play money with denominations",
                        "type": "currency",
                        "preparation_time": "45 minutes",
                        "materials_needed": ["colored paper", "scissors", "markers", "laminator"]
                    }
                ])
            elif "budget" in topic_name.lower():
                handmade_items.extend([
                    {
                        "name": "Budget Worksheet",
                        "description": "Custom budget planning sheet",
                        "type": "worksheet",
                        "preparation_time": "20 minutes",
                        "materials_needed": ["paper", "markers", "ruler", "laminator"]
                    }
                ])
        
        elif "AI" in topic_name:
            handmade_items.extend([
                {
                    "name": "AI Learning Cards",
                    "description": "Custom AI concept flashcards",
                    "type": "educational_material",
                    "preparation_time": "40 minutes",
                    "materials_needed": ["cardstock", "markers", "images", "laminator"]
                }
            ])
        
        elif "Communication" in topic_name:
            handmade_items.extend([
                {
                    "name": "Communication Game Board",
                    "description": "Custom conversation starter board",
                    "type": "game_material",
                    "preparation_time": "35 minutes",
                    "materials_needed": ["cardboard", "markers", "dice", "game pieces"]
                }
            ])
        
        elif "Entrepreneurship" in topic_name:
            handmade_items.extend([
                {
                    "name": "Business Setup Kit",
                    "description": "Custom business planning materials",
                    "type": "business_material",
                    "preparation_time": "50 minutes",
                    "materials_needed": ["business cards", "price lists", "inventory sheets", "calculator"]
                }
            ])
        
        return handmade_items
    
    def _extract_activity_steps(self, activity_text: str) -> List[str]:
        """Extract activity steps from activity text."""
        steps = []
        
        if "Steps to Follow:" in activity_text:
            steps_start = activity_text.find("Steps to Follow:")
            steps_end = activity_text.find("What Should Be Achieved:")
            if steps_end == -1:
                steps_end = len(activity_text)
            
            steps_section = activity_text[steps_start:steps_end]
            
            # Parse numbered steps
            lines = steps_section.split('\n')
            for line in lines:
                line = line.strip()
                if line and not line.startswith("Steps to Follow:"):
                    # Remove step numbers
                    if line[0].isdigit() and "." in line:
                        step = line.split(".", 1)[1].strip()
                        if step:
                            steps.append(step)
                    else:
                        steps.append(line)
        
        return steps
    
    def _extract_activity_objectives(self, activity_text: str) -> Dict[str, str]:
        """Extract activity objectives and gains."""
        objectives = {}
        
        if "What Should Be Achieved:" in activity_text:
            achieved_start = activity_text.find("What Should Be Achieved:")
            achieved_end = activity_text.find("What is Gained:")
            if achieved_end == -1:
                achieved_end = len(activity_text)
            
            achieved_section = activity_text[achieved_start:achieved_end]
            objectives["what_should_be_achieved"] = achieved_section.replace("What Should Be Achieved:", "").strip()
        
        if "What is Gained:" in activity_text:
            gained_start = activity_text.find("What is Gained:")
            gained_section = activity_text[gained_start:]
            
            # Extract bullet points
            gains = []
            lines = gained_section.split('\n')
            for line in lines:
                line = line.strip()
                if line and not line.startswith("What is Gained:"):
                    if line.startswith("•"):
                        gains.append(line[1:].strip())
                    else:
                        gains.append(line)
            
            objectives["what_is_gained"] = gains
        
        return objectives
    
    def _extract_activity_title(self, activity_text: str) -> str:
        """Extract activity title from the first line."""
        lines = activity_text.split('\n')
        for line in lines:
            line = line.strip()
            if line and not line.startswith("Materials Needed:"):
                return line
        return "Activity"
    
    def _extract_duration(self, activity_text: str) -> str:
        """Extract estimated duration from activity text."""
        # Look for time patterns
        import re
        time_patterns = [
            r"(\d+)\s*(?:minutes?|mins?)",
            r"(\d+)\s*(?:hours?|hrs?)",
            r"(\d+)\s*(?:days?)"
        ]
        
        for pattern in time_patterns:
            match = re.search(pattern, activity_text, re.IGNORECASE)
            if match:
                number = match.group(1)
                if "hour" in pattern or "hr" in pattern:
                    return f"{number} hour{'s' if int(number) > 1 else ''}"
                elif "day" in pattern:
                    return f"{number} day{'s' if int(number) > 1 else ''}"
                else:
                    return f"{number} minute{'s' if int(number) > 1 else ''}"
        
        return "30 minutes"  # Default duration
    
    def _generate_setup_instructions(self, materials: Dict[str, List], topic_name: str, activity_num: int) -> str:
        """Generate setup instructions for the activity."""
        setup_instructions = []
        
        # Home items setup
        if materials["home_items"]:
            setup_instructions.append("Items to gather from home:")
            for item in materials["home_items"]:
                setup_instructions.append(f"• {item['name']} - {item['quantity']}")
        
        # Kit items setup
        if materials["kit_items"]:
            setup_instructions.append("\nItems included in this kit:")
            for item in materials["kit_items"]:
                setup_instructions.append(f"• {item['name']} - {item['quantity']}")
        
        # Handmade items setup
        if materials["handmade_items"]:
            setup_instructions.append("\nSpecial materials prepared for you:")
            for item in materials["handmade_items"]:
                setup_instructions.append(f"• {item['name']} - {item['description']}")
        
        # Activity-specific setup
        if "store" in topic_name.lower() or "shopping" in topic_name.lower():
            setup_instructions.append("\nSetup Instructions:")
            setup_instructions.append("1. Clear a table or counter space")
            setup_instructions.append("2. Arrange items with price labels")
            setup_instructions.append("3. Set up the cash register area")
            setup_instructions.append("4. Display the store sign")
        
        return "\n".join(setup_instructions)
    
    def _count_total_materials(self, activities: List[Dict]) -> Dict[str, int]:
        """Count total materials needed across all activities."""
        counts = {"home_items": 0, "kit_items": 0, "handmade_items": 0}
        
        for activity in activities:
            for category in counts:
                counts[category] += len(activity.get("materials", {}).get(category, []))
        
        return counts
    
    def _check_shipping_required(self, activities: List[Dict]) -> bool:
        """Check if any materials require shipping."""
        for activity in activities:
            materials = activity.get("materials", {})
            if materials.get("kit_items") or materials.get("handmade_items"):
                return True
        return False
    
    def _check_preparation_required(self, activities: List[Dict]) -> bool:
        """Check if any handmade items require preparation."""
        for activity in activities:
            materials = activity.get("materials", {})
            if materials.get("handmade_items"):
                return True
        return False
    
    def create_monthly_kit(self, topics: List[Dict[str, Any]], month: str, year: int) -> Dict[str, Any]:
        """Create a complete monthly kit for multiple topics."""
        monthly_kit = {
            "month": month,
            "year": year,
            "created_at": datetime.now().isoformat(),
            "topics": [],
            "total_activities": 0,
            "materials_summary": {
                "home_items": [],
                "kit_items": [],
                "handmade_items": []
            },
            "shipping_requirements": {
                "box_size": "medium",
                "weight_estimate": "2-3 kg",
                "fragile_items": False,
                "special_handling": False
            },
            "preparation_timeline": {
                "handmade_items_time": 0,
                "kit_assembly_time": 0,
                "total_preparation_time": 0
            }
        }
        
        # Process each topic
        for topic in topics:
            topic_kit = self.create_activity_materials_list(topic)
            monthly_kit["topics"].append(topic_kit)
            monthly_kit["total_activities"] += len(topic_kit["activities"])
            
            # Aggregate materials
            for category in ["home_items", "kit_items", "handmade_items"]:
                for activity in topic_kit["activities"]:
                    materials = activity.get("materials", {}).get(category, [])
                    monthly_kit["materials_summary"][category].extend(materials)
        
        # Calculate shipping requirements
        monthly_kit["shipping_requirements"] = self._calculate_shipping_requirements(monthly_kit)
        
        # Calculate preparation timeline
        monthly_kit["preparation_timeline"] = self._calculate_preparation_timeline(monthly_kit)
        
        return monthly_kit
    
    def _calculate_shipping_requirements(self, monthly_kit: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate shipping requirements for the monthly kit."""
        kit_items = monthly_kit["materials_summary"]["kit_items"]
        handmade_items = monthly_kit["materials_summary"]["handmade_items"]
        
        total_items = len(kit_items) + len(handmade_items)
        
        # Determine box size
        if total_items <= 10:
            box_size = "small"
        elif total_items <= 25:
            box_size = "medium"
        else:
            box_size = "large"
        
        # Estimate weight
        weight_estimate = f"{max(1, total_items // 10)}-{max(2, total_items // 8)} kg"
        
        # Check for fragile items
        fragile_keywords = ["glass", "ceramic", "mirror", "breakable", "delicate"]
        fragile_items = any(
            any(keyword in str(item).lower() for keyword in fragile_keywords)
            for item in kit_items + handmade_items
        )
        
        return {
            "box_size": box_size,
            "weight_estimate": weight_estimate,
            "fragile_items": fragile_items,
            "special_handling": fragile_items
        }
    
    def _calculate_preparation_timeline(self, monthly_kit: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate preparation timeline for handmade items."""
        handmade_items = monthly_kit["materials_summary"]["handmade_items"]
        
        total_preparation_time = 0
        for item in handmade_items:
            if "preparation_time" in item:
                time_str = item["preparation_time"]
                if "minute" in time_str:
                    minutes = int(time_str.split()[0])
                    total_preparation_time += minutes
                elif "hour" in time_str:
                    hours = int(time_str.split()[0])
                    total_preparation_time += hours * 60
        
        kit_assembly_time = len(monthly_kit["materials_summary"]["kit_items"]) * 2  # 2 minutes per item
        
        return {
            "handmade_items_time": total_preparation_time,
            "kit_assembly_time": kit_assembly_time,
            "total_preparation_time": total_preparation_time + kit_assembly_time
        }
    
    def generate_kit_instructions(self, monthly_kit: Dict[str, Any]) -> str:
        """Generate printable instructions for the monthly kit."""
        instructions = []
        
        instructions.append(f"🎯 MONTHLY LEARNING KIT - {monthly_kit['month']} {monthly_kit['year']}")
        instructions.append("=" * 50)
        instructions.append("")
        
        instructions.append("📦 WHAT'S IN YOUR KIT:")
        instructions.append("")
        
        # Kit items
        if monthly_kit["materials_summary"]["kit_items"]:
            instructions.append("🎁 Special Materials Included:")
            for item in monthly_kit["materials_summary"]["kit_items"]:
                instructions.append(f"  • {item['name']} - {item['quantity']}")
            instructions.append("")
        
        # Handmade items
        if monthly_kit["materials_summary"]["handmade_items"]:
            instructions.append("✂️ Custom Materials Made for You:")
            for item in monthly_kit["materials_summary"]["handmade_items"]:
                instructions.append(f"  • {item['name']} - {item['description']}")
            instructions.append("")
        
        instructions.append("🏠 ITEMS TO GATHER FROM HOME:")
        instructions.append("")
        
        # Home items
        home_items = monthly_kit["materials_summary"]["home_items"]
        unique_home_items = {}
        for item in home_items:
            name = item['name']
            if name in unique_home_items:
                unique_home_items[name]['quantity'] += 1
            else:
                unique_home_items[name] = item.copy()
        
        for item in unique_home_items.values():
            instructions.append(f"  • {item['name']} - {item['quantity']}")
        
        instructions.append("")
        instructions.append("📚 LEARNING TOPICS THIS MONTH:")
        instructions.append("")
        
        for topic in monthly_kit["topics"]:
            instructions.append(f"🎯 {topic['topic_name']}")
            instructions.append(f"   Age Group: {topic['age_group']}")
            instructions.append(f"   Difficulty: {topic['difficulty']}")
            instructions.append(f"   Activities: {len(topic['activities'])}")
            instructions.append("")
        
        instructions.append("⏰ PREPARATION TIMELINE:")
        instructions.append("")
        timeline = monthly_kit["preparation_timeline"]
        instructions.append(f"  • Handmade Items: {timeline['handmade_items_time']} minutes")
        instructions.append(f"  • Kit Assembly: {timeline['kit_assembly_time']} minutes")
        instructions.append(f"  • Total Time: {timeline['total_preparation_time']} minutes")
        
        return "\n".join(instructions)

def main():
    """Main function to demonstrate kit preparation system."""
    system = KitPreparationSystem()
    
    print("📦 Kit Preparation System Demo")
    print("=" * 40)
    
    # Sample topic data
    sample_topic = {
        "Topic": "Grocery Store Shopping",
        "Niche": "Finance",
        "age_group": "Toddler",
        "difficulty": "Beginner",
        "Activity 1": """Grocery Store Shopping
Materials Needed: Play money, toy groceries, table or shelf for setup, price labels
Steps to Follow:
1. Set up a pretend grocery store
2. Give the child play money
3. Let them "buy" items
4. Practice giving money and receiving change
What Should Be Achieved: Basic money exchange understanding
What is Gained: Real-life simulation, confidence using money"""
    }
    
    # Create materials list for the topic
    materials_list = system.create_activity_materials_list(sample_topic)
    
    print(f"✅ Created materials list for: {materials_list['topic_name']}")
    print(f"📊 Total activities: {len(materials_list['activities'])}")
    print(f"📦 Shipping required: {materials_list['shipping_required']}")
    print(f"✂️ Preparation required: {materials_list['preparation_required']}")
    
    # Show materials breakdown
    for category, items in materials_list['materials_summary'].items():
        print(f"\n{category.upper()}:")
        for item in items:
            print(f"  • {item['name']} - {item['quantity']}")
    
    # Create monthly kit
    monthly_topics = [sample_topic]  # In real usage, this would be 20-30 topics
    monthly_kit = system.create_monthly_kit(monthly_topics, "August", 2025)
    
    print(f"\n📅 Monthly Kit Created:")
    print(f"   Month: {monthly_kit['month']} {monthly_kit['year']}")
    print(f"   Total activities: {monthly_kit['total_activities']}")
    print(f"   Box size: {monthly_kit['shipping_requirements']['box_size']}")
    print(f"   Weight: {monthly_kit['shipping_requirements']['weight_estimate']}")
    print(f"   Preparation time: {monthly_kit['preparation_timeline']['total_preparation_time']} minutes")
    
    # Generate instructions
    instructions = system.generate_kit_instructions(monthly_kit)
    print(f"\n📋 Kit Instructions Generated ({len(instructions)} characters)")

if __name__ == "__main__":
    main()

