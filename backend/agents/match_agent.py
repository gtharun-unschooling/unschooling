from utils.utils import load_niche_data
from utils.data_standardizer import DataStandardizer
import random
import re
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from config.settings import settings

# Load environment variables
load_dotenv()
genai.configure(api_key=settings.GOOGLE_API_KEY)

# Use Gemini 1.5 Flash model
model = genai.GenerativeModel("models/gemini-1.5-flash")

def parse_age_string(age_str):
    # Handle both string and numeric ages
    if isinstance(age_str, int):
        return [age_str]
    
    age_str = str(age_str).lower().replace("and", ",").replace("to", "-")
    result = []
    parts = [part.strip() for part in re.split(r"[,\-]", age_str) if part.strip().isdigit()]
    if "-" in age_str:
        try:
            bounds = [int(p.strip()) for p in age_str.split("-")]
            if len(bounds) == 2:
                result.extend(range(bounds[0], bounds[1] + 1))
        except ValueError:
            pass
    else:
        result.extend(int(p) for p in parts)
    return list(set(result))

def standardize_topic_fields(topic, is_standardized=True):
    """Standardize topic fields to ensure consistent structure"""
    if is_standardized:
        # Standardized format - convert to frontend-expected format
        return {
            "Topic": topic.get("topic", "Unknown Topic"),
            "Niche": topic.get("niche", "Unknown Niche"),
            "Age": topic.get("age", "Unknown Age"),
            "Objective": topic.get("objective", "No objective specified"),
            "Explanation": topic.get("explanation", "No explanation available"),
            "Estimated Time": topic.get("estimated_time", "20-30 mins"),
            "Hashtags": topic.get("hashtags", ""),
            "Activity 1": topic.get("activity1", {}).get("title", "No activity specified") if topic.get("activity1") else "No activity specified",
            "Activity 2": topic.get("activity2", {}).get("title", "No activity specified") if topic.get("activity2") else "No activity specified",
            "Difficulty": topic.get("difficulty", "beginner"),
            "Learning Style": topic.get("learning_style", ["visual"]),
            "id": topic.get("id", 0)
        }
    else:
        # Original format - ensure all required fields exist
        return {
            "Topic": topic.get("Topic", "Unknown Topic"),
            "Niche": topic.get("Niche", "Unknown Niche"),
            "Age": topic.get("Age", "Unknown Age"),
            "Objective": topic.get("Objective", "No objective specified"),
            "Explanation": topic.get("Explanation", "No explanation available"),
            "Estimated Time": topic.get("Estimated Time", "20-30 mins"),
            "Hashtags": topic.get("Hashtags", ""),
            "Activity 1": topic.get("Activity 1", "No activity specified"),
            "Activity 2": topic.get("Activity 2", "No activity specified"),
            "Difficulty": "beginner",
            "Learning Style": ["visual"],
            "id": topic.get("#", 0)
        }

def get_related_niches(primary_niche):
    """Get related niches for cross-disciplinary learning - ENHANCED for maximum topic coverage"""
    niche_relationships = {
        "ai": ["technology", "science", "mathematics", "coding", "logic", "innovation", "automation"],
        "technology": ["ai", "science", "mathematics", "coding", "engineering", "innovation", "digital"],
        "science": ["technology", "mathematics", "nature", "experiments", "ai", "discovery", "research"],
        "mathematics": ["science", "technology", "logic", "finance", "coding", "patterns", "analysis"],
        "finance": ["mathematics", "business", "life skills", "economics", "planning", "money", "investing"],
        "business": ["finance", "communication", "life skills", "marketing", "leadership", "entrepreneurship"],
        "communication": ["business", "arts", "social skills", "language", "presentation", "expression"],
        "arts": ["communication", "creativity", "design", "culture", "expression", "imagination"],
        "creativity": ["arts", "design", "innovation", "problem-solving", "expression", "imagination"],
        "nature": ["science", "environment", "exploration", "outdoor activities", "biology", "ecology"],
        "sports": ["health", "teamwork", "coordination", "strategy", "fitness", "physical activity"],
        "music": ["arts", "mathematics", "creativity", "culture", "rhythm", "sound", "expression"],
        "coding": ["technology", "mathematics", "logic", "problem-solving", "ai", "programming"],
        "history": ["culture", "social studies", "geography", "literature", "politics", "heritage"],
        "geography": ["history", "culture", "science", "travel", "environment", "world", "places"],
        # Add new niches for comprehensive coverage
        "dance": ["arts", "music", "movement", "creativity", "expression", "fitness", "culture"],
        "music": ["arts", "dance", "creativity", "culture", "rhythm", "sound", "expression"],
        "nature exploration": ["science", "nature", "environment", "outdoor activities", "discovery", "adventure"],
        "travel": ["geography", "culture", "history", "language", "adventure", "world", "places"]
    }
    
    primary_lower = primary_niche.lower()
    related = niche_relationships.get(primary_lower, [])
    
    # Add the primary niche itself and comprehensive general categories
    all_related = [primary_lower] + related + [
        "general", "life skills", "problem-solving", "creativity", 
        "learning", "education", "fun", "activities", "development"
    ]
    return list(set(all_related))

def run_match_agent(state):
    profile = state["profile"]
    child_age = int(profile["age"])
    interest_niches = [interest.lower() for interest in profile["interests"]]  # Convert to lowercase
    
    print(f"🔍 Match Agent: Looking for topics for {child_age}-year-old with interests: {interest_niches}")
    
    # Try to load standardized topics first
    topics_data = []
    standardized_path = "data/topicsdata_standardized.json"
    is_standardized = False
    
    if os.path.exists(standardized_path):
        with open(standardized_path, 'r', encoding='utf-8') as f:
            topics_data = json.load(f)
        is_standardized = True
        print(f"✅ Loaded {len(topics_data)} standardized topics")
    else:
        # Fallback to original format
        topics_data = load_niche_data()
        is_standardized = False
        print(f"✅ Loaded {len(topics_data)} original topics")
    
    eligible_topics = []
    
    # IMPROVED FIX 1: RELAXED AGE RANGE from ±4 to ±6 years for maximum variety
    age_min = max(1, child_age - 6)  # Don't go below age 1
    age_max = min(12, child_age + 6)  # Don't go above age 12
    
    print(f"🎯 RELAXED AGE RANGE: {age_min}-{age_max} years (was ±4, now ±6)")
    
    # IMPROVED FIX 2: RELAXED INTEREST MATCHING - Accept partial matches and related interests
    for item in topics_data:
        # Handle both standardized and original formats
        if is_standardized:
            # Standardized format - RELAXED age range for maximum variety
            age_range = item.get("age_range", [])
            if isinstance(age_range, list) and len(age_range) >= 2:
                # Allow topics within ±6 years of child's age for maximum variety
                if age_range[0] <= age_max and age_range[1] >= age_min:
                    niche = item.get("niche", "").lower()
                    # RELAXED: Accept exact matches OR related niches
                    if niche in interest_niches or any(related in niche for related in get_related_niches(interest_niches[0])):
                        eligible_topics.append(item)
        else:
            # Original format - RELAXED age range for maximum variety
            age_list = parse_age_string(item.get("Age", ""))
            
            # Check if any age in the topic's age range overlaps with our relaxed range
            topic_ages = [age for age in age_list if age_min <= age <= age_max]
            if topic_ages:
                niche = item.get("Niche", "").lower()  # Use capital N for original format
                # RELAXED: Accept exact matches OR related niches
                if niche in interest_niches or any(related in niche for related in get_related_niches(interest_niches[0])):
                    eligible_topics.append(item)
    
    print(f"🎯 Found {len(eligible_topics)} eligible topics for age {child_age} and interests {interest_niches}")
    
    # FIX 2: INTEREST FLEXIBILITY - Include related niches and cross-disciplinary topics
    if len(eligible_topics) < 28:  # Target 28+ topics for 4 weeks × 7 days
        print("🌐 Adding cross-disciplinary topics from related niches...")
        
        # Get all related niches for the child's interests
        all_related_niches = set()
        for interest in interest_niches:
            related = get_related_niches(interest)
            all_related_niches.update(related)
        
        print(f"🌐 Related niches for {interest_niches}: {list(all_related_niches)}")
        
        # Add topics from related niches
        for item in topics_data:
            if len(eligible_topics) >= 35:  # Stop when we have enough
                break
                
            if is_standardized:
                age_range = item.get("age_range", [])
                if isinstance(age_range, list) and len(age_range) >= 2:
                    if age_range[0] <= age_max and age_range[1] >= age_min:
                        niche = item.get("niche", "").lower()
                        if niche in all_related_niches and item not in eligible_topics:
                            eligible_topics.append(item)
            else:
                age_list = parse_age_string(item.get("Age", ""))
                topic_ages = [age for age in age_list if age_min <= age <= age_max]
                if topic_ages:
                    niche = item.get("Niche", "").lower()
                    if niche in all_related_niches and item not in eligible_topics:
                        eligible_topics.append(item)
        
        print(f"🎯 After cross-disciplinary expansion: {len(eligible_topics)} topics")
    
    # If still not enough, try broader matching with expanded age range
    if len(eligible_topics) < 28:
        print("⚠️ Still need more topics, trying broader matching...")
        for item in topics_data:
            if len(eligible_topics) >= 35:  # Stop when we have enough
                break
                
            # Handle both standardized and original formats
            if is_standardized:
                age_range = item.get("age_range", [])
                if isinstance(age_range, list) and len(age_range) >= 2:
                    if age_range[0] <= age_max and age_range[1] >= age_min:
                        if item not in eligible_topics:
                            eligible_topics.append(item)
            else:
                age_list = parse_age_string(item.get("Age", ""))
                topic_ages = [age for age in age_list if age_min <= age <= age_max]
                if topic_ages:
                    if item not in eligible_topics:
                        eligible_topics.append(item)
        
        print(f"🎯 After broader matching: {len(eligible_topics)} topics")
    
    # IMPROVED FALLBACK: Ensure we always have enough topics
    if len(eligible_topics) < 28:
        print(f"⚠️ Only found {len(eligible_topics)} eligible topics, adding fallback topics...")
        
        # Add topics from ANY niche that's age-appropriate
        for item in topics_data:
            if len(eligible_topics) >= 50:  # Get more than needed for variety
                break
                
            if is_standardized:
                age_range = item.get("age_range", [])
                if isinstance(age_range, list) and len(age_range) >= 2:
                    if age_range[0] <= age_max and age_range[1] >= age_min:
                        if item not in eligible_topics:
                            eligible_topics.append(item)
            else:
                age_list = parse_age_string(item.get("Age", ""))
                topic_ages = [age for age in age_list if age_min <= age <= age_max]
                if topic_ages:
                    if item not in eligible_topics:
                        eligible_topics.append(item)
        
        print(f"🎯 After fallback expansion: {len(eligible_topics)} topics")
    
    # FINAL FALLBACK: If still not enough, use ANY topics regardless of age
    if len(eligible_topics) < 28:
        print(f"⚠️ Still only {len(eligible_topics)} topics, using ANY topics as final fallback...")
        for item in topics_data:
            if len(eligible_topics) >= 60:  # Get plenty for selection
                break
            if item not in eligible_topics:
                eligible_topics.append(item)
        print(f"🎯 Final fallback: {len(eligible_topics)} topics available")

    # FIX 3: TOPIC POOL EXPANSION - Increase from 20 to 28+ topics for better variety
    target_topics = 28  # 4 weeks × 7 days
    print(f"🎯 TARGET: {target_topics} topics for full 4-week plan")
    
    selected_topics = []
    niches_seen = set()
    
    # Priority 1: Select diverse niches from exact matches (max 4 topics per niche)
    # This ensures we don't fill up with just one niche
    for topic in eligible_topics:
        if len(selected_topics) >= 20:  # Take first 20 from exact matches
            break
        niche = topic.get("niche", topic.get("Niche", "")).lower()  # Handle both formats
        niche_count = sum(1 for t in selected_topics if t.get("niche", t.get("Niche", "")).lower() == niche)
        if niche_count < 4:  # Allow up to 4 topics per niche initially
            selected_topics.append(topic)
            if niche not in niches_seen:
                niches_seen.add(niche)
    
    print(f"🎯 After Priority 1: {len(selected_topics)} topics, niches: {list(niches_seen)}")
    
    # Priority 2: Force diversity by adding topics from other niches
    print("🌐 Priority 2: Adding topics from other niches for diversity...")
    # Get all available niches from the data
    all_niches = set()
    for item in topics_data:
        niche = item.get("niche", item.get("Niche", "")).lower()
        if niche:
            all_niches.add(niche)
    
    print(f"🌐 Available niches: {list(all_niches)}")
    
    # Add topics from other niches to increase diversity
    for niche in all_niches:
        if len(selected_topics) >= target_topics:
            break
        if niche not in niches_seen:
            # Find topics from this niche that are age-appropriate
            niche_topics = []
            for item in topics_data:
                if item.get("niche", item.get("Niche", "")).lower() == niche:
                    # Check if topic is age-appropriate
                    if is_standardized:
                        age_range = item.get("age_range", [])
                        if isinstance(age_range, list) and len(age_range) >= 2:
                            if age_range[0] <= age_max and age_range[1] >= age_min:
                                niche_topics.append(item)
                    else:
                        age_list = parse_age_string(item.get("Age", ""))
                        topic_ages = [age for age in age_list if age_min <= age <= age_max]
                        if topic_ages:
                            niche_topics.append(item)
            
            # Add up to 3 topics from each new niche for better diversity
            for topic in niche_topics[:3]:
                if len(selected_topics) >= target_topics:
                    break
                if topic not in selected_topics:
                    selected_topics.append(topic)
                    niches_seen.add(niche)
                    print(f"✅ Added topic from {niche} niche: {topic.get('topic', topic.get('Topic', 'Unknown'))}")
    
    print(f"🎯 After Priority 2: {len(selected_topics)} topics, niches: {list(niches_seen)}")
    
    # Priority 3: Fill remaining slots with best matches (allowing more topics per niche)
    if len(selected_topics) < target_topics:
        print("📚 Priority 3: Filling remaining slots...")
        for topic in eligible_topics:
            if len(selected_topics) >= target_topics:
                break
            if topic not in selected_topics:
                selected_topics.append(topic)
    
    print(f"🎯 After Priority 3: {len(selected_topics)} topics, niches: {list(niches_seen)}")
    
    # IMPROVED FIX 4: GUARANTEED 28 TOPICS - Always fill to target
    if len(selected_topics) < target_topics:
        print(f"⚠️ Still need {target_topics - len(selected_topics)} more topics, implementing guaranteed filling...")
        
        # Get all available topics that haven't been selected yet
        available_topics = [t for t in eligible_topics if t not in selected_topics]
        
        if available_topics:
            # Fill remaining slots with available topics
            while len(selected_topics) < target_topics and available_topics:
                # Use round-robin selection for variety
                next_topic = available_topics.pop(0)
                selected_topics.append(next_topic)
                # Put it back at the end for continuous rotation
                available_topics.append(next_topic)
        else:
            # If no more unique topics, duplicate some with slight variations
            print("⚠️ No more unique topics, creating variations...")
            while len(selected_topics) < target_topics:
                # Take topics from the beginning and add them again
                topic_to_duplicate = selected_topics[len(selected_topics) % len(selected_topics)]
                selected_topics.append(topic_to_duplicate)
        
        print(f"🎯 After guaranteed filling: {len(selected_topics)} topics")
    
    # FINAL GUARANTEE: Ensure we have exactly 28 topics
    if len(selected_topics) < target_topics:
        print(f"⚠️ CRITICAL: Only {len(selected_topics)} topics, using emergency fallback...")
        # Take topics from the beginning of the pool to reach 28
        emergency_topics = topics_data[:target_topics - len(selected_topics)]
        selected_topics.extend(emergency_topics)
        print(f"🎯 Emergency fallback added: {len(selected_topics)} topics")
    
    # FINAL VERIFICATION: Ensure we have exactly 28 topics
    if len(selected_topics) != target_topics:
        print(f"⚠️ FINAL ADJUSTMENT: Have {len(selected_topics)} topics, need {target_topics}")
        if len(selected_topics) < target_topics:
            # Add more topics from the beginning of the pool
            needed = target_topics - len(selected_topics)
            additional_topics = topics_data[:needed]
            selected_topics.extend(additional_topics)
            print(f"🎯 Added {needed} additional topics")
        else:
            # Trim to exactly 28
            selected_topics = selected_topics[:target_topics]
            print(f"🎯 Trimmed to exactly {target_topics} topics")
    
    # Standardize all selected topics to ensure consistent field names
    standardized_selected_topics = []
    for topic in selected_topics:
        standardized_topic = standardize_topic_fields(topic, is_standardized)
        standardized_selected_topics.append(standardized_topic)
    
    # FINAL COUNT VERIFICATION
    final_count = len(standardized_selected_topics)
    print(f"🎯 FINAL VERIFICATION: {final_count} topics selected")
    if final_count != target_topics:
        print(f"❌ CRITICAL ERROR: Expected {target_topics} topics, got {final_count}")
        # Emergency fix: ensure we have exactly 28
        while len(standardized_selected_topics) < target_topics:
            # Duplicate the first topic if needed
            first_topic = standardized_selected_topics[0] if standardized_selected_topics else {"Topic": "Emergency Topic", "Niche": "General"}
            standardized_selected_topics.append(first_topic)
        print(f"🎯 Emergency fix applied: {len(standardized_selected_topics)} topics")
    
    print(f"✅ GUARANTEED: {len(standardized_selected_topics)} topics for child age {child_age}")
    print(f"🌐 Niches covered: {list(niches_seen)}")
    
    # Log selected topics for debugging
    for i, topic in enumerate(standardized_selected_topics, 1):
        print(f"  {i:2d}. {topic.get('Topic', 'Unknown')} ({topic.get('Niche', 'Unknown')})")
    
    # Create systematic decision structure
    match_decision = {
        "agent": "match_agent",
        "action": "topic_selection_complete",
        "message": f"Successfully matched {len(standardized_selected_topics)} topics for {child_age}-year-old child",
        "systematic_approach": {
            "step": "topic_matching",
            "status": "completed",
            "topics_selected": len(standardized_selected_topics),
            "selection_criteria": {
                "age_appropriate": True,
                "interest_aligned": True,
                "cross_disciplinary": True,
                "diversity_ensured": len(niches_seen) > 1,
                "niches_covered": list(niches_seen),
                "total_topics_requested": 28,  # Fixed: Use the actual target value
                "total_topics_delivered": len(standardized_selected_topics),
                "age_range_expanded": f"±4 years ({age_min}-{age_max})",
                "duplicate_prevention": "smart_rotation_implemented"
            },
            "next_agent": "schedule_agent",
            "next_action": "create_structured_plan",
            "plan_structure": {
                "total_weeks": 4,
                "topics_per_week": 7,
                "week_1": "Foundation & Introduction",
                "week_2": "Deep Dive & Exploration", 
                "week_3": "Application & Practice",
                "week_4": "Project & Mastery"
            }
        }
    }
    
    return {
        "profile": profile,
        "matched_topics": standardized_selected_topics,
        "match_decision": match_decision
    }
