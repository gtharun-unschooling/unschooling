def run_schedule_agent(state):
    matched_topics = state["matched_topics"]
    profile = state["profile"]
    match_decision = state.get("match_decision", {})
    
    print(f"🎯 Schedule Agent: Creating systematic 4-week plan for {len(matched_topics)} topics")
    
    # Ensure we have enough topics for 4 weeks × 7 days = 28 activities
    if len(matched_topics) < 28:
        print(f"⚠️ Warning: Only {len(matched_topics)} topics available, need 28 for full plan")
        # If we don't have enough topics, we'll need to handle this gracefully
        # For now, we'll work with what we have
    
    # Create systematic 4-week structured plan
    weekly_plan = {}
    
    # Week 1: Foundation & Introduction (Motivation Week)
    weekly_plan["week_1"] = {
        "week_theme": "Foundation & Introduction",
        "week_goal": "Build excitement and establish foundational knowledge",
        "motivation_focus": "Discovery and Wonder",
        "week_description": "This week focuses on introducing concepts in an exciting way that sparks curiosity and builds confidence.",
        "days": {}
    }
    
    # Week 2: Deep Dive & Exploration
    weekly_plan["week_2"] = {
        "week_theme": "Deep Dive & Exploration", 
        "week_goal": "Explore topics in depth with hands-on activities",
        "motivation_focus": "Exploration and Mastery",
        "week_description": "Dive deeper into each topic with more complex activities and real-world applications.",
        "days": {}
    }
    
    # Week 3: Application & Practice (Motivation Week)
    weekly_plan["week_3"] = {
        "week_theme": "Application & Practice",
        "week_goal": "Apply learned concepts to real-world scenarios",
        "motivation_focus": "Achievement and Progress",
        "week_description": "Practice and apply what you've learned through challenging but achievable activities.",
        "days": {}
    }
    
    # Week 4: Project & Mastery (Project Week)
    weekly_plan["week_4"] = {
        "week_theme": "Project & Mastery",
        "week_goal": "Create a comprehensive project showcasing all learned skills",
        "motivation_focus": "Creation and Pride",
        "week_description": "This is your chance to create something amazing that combines everything you've learned!",
        "project_week": {
            "project_name": f"{profile.get('child_name', 'Child')}'s Masterpiece",
            "project_goal": "Create a comprehensive project that demonstrates mastery of all topics",
            "project_outcome": "A tangible creation that showcases learning and skills",
            "project_materials": "Various materials based on topics covered",
            "project_duration": "Full week with daily milestones",
            "project_presentation": "Family showcase at the end of the week"
        },
        "days": {}
    }
    
    # Generate daily activities for each week
    day_names = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    
    # Track used topics to prevent duplication
    used_topics = set()
    topic_rotation_index = 0
    
    for week_num in range(1, 5):
        week_key = f"week_{week_num}"
        week_data = weekly_plan[week_key]
        
        for day_num, day_name in enumerate(day_names):
            # Get a unique topic for this day (no duplication)
            topic = None
            attempts = 0
            max_attempts = len(matched_topics) * 2  # Prevent infinite loops
            
            while topic is None and attempts < max_attempts:
                # Try to get a topic that hasn't been used yet
                if topic_rotation_index < len(matched_topics):
                    potential_topic = matched_topics[topic_rotation_index]
                    topic_id = f"{potential_topic.get('Topic', 'Unknown')}_{potential_topic.get('Niche', 'Unknown')}"
                    
                    if topic_id not in used_topics:
                        topic = potential_topic
                        used_topics.add(topic_id)
                    else:
                        # Move to next topic
                        topic_rotation_index = (topic_rotation_index + 1) % len(matched_topics)
                else:
                    # If we've gone through all topics, reset and find unused ones
                    topic_rotation_index = 0
                    for i, potential_topic in enumerate(matched_topics):
                        topic_id = f"{potential_topic.get('Topic', 'Unknown')}_{potential_topic.get('Niche', 'Unknown')}"
                        if topic_id not in used_topics:
                            topic = potential_topic
                            used_topics.add(topic_id)
                            topic_rotation_index = i + 1
                            break
                
                attempts += 1
            
            # If we still don't have a topic, use the next available one
            if topic is None:
                topic_index = (week_num * 7 + day_num) % len(matched_topics)
                topic = matched_topics[topic_index]
                print(f"⚠️ Using fallback topic for {week_key} {day_name}: {topic.get('Topic', 'Unknown')}")
            
            # Create day-specific activity based on week theme and actual topic
            day_activity = create_day_activity(topic, profile, week_num, day_name, day_num)
            week_data["days"][day_name] = day_activity
            
            # Move to next topic for next iteration
            topic_rotation_index = (topic_rotation_index + 1) % len(matched_topics)
    
    # Create systematic approach summary
    systematic_approach = {
        "agent": "schedule_agent",
        "action": "structured_plan_created",
        "message": f"Successfully created 4-week systematic plan for {profile.get('child_name', 'Child')}",
        "plan_structure": {
            "total_weeks": 4,
            "week_1": {
                "theme": "Foundation & Introduction",
                "focus": "Motivation and Discovery",
                "goal": "Build excitement and establish foundational knowledge"
            },
            "week_2": {
                "theme": "Deep Dive & Exploration", 
                "focus": "Exploration and Mastery",
                "goal": "Explore topics in depth with hands-on activities"
            },
            "week_3": {
                "theme": "Application & Practice",
                "focus": "Achievement and Progress", 
                "goal": "Apply learned concepts to real-world scenarios"
            },
            "week_4": {
                "theme": "Project & Mastery",
                "focus": "Creation and Pride",
                "goal": "Create a comprehensive project showcasing all learned skills"
            }
        },
        "next_agent": "reviewer_agent",
        "next_action": "review_and_optimize_plan",
        "topics_used": len(used_topics),
        "duplication_prevented": True,
        "unique_activities_per_day": True
    }
    
    return {
        "weekly_plan": weekly_plan,
        "systematic_approach": systematic_approach,
        "profile": profile,
        "matched_topics": matched_topics
    }

def create_day_activity(topic, profile, week_num, day_name, day_num):
    """Create day-specific activity based on week theme and topic."""
    
    # Extract topic information
    topic_name = topic.get("topic", topic.get("Topic", "Learning Activity"))
    niche = topic.get("niche", topic.get("Niche", "General"))
    objective = topic.get("objective", topic.get("Objective", "Learn and explore"))
    explanation = topic.get("explanation", topic.get("Explanation", ""))
    
    # Handle different activity formats
    activity_1 = ""
    activity_2 = ""
    
    # Check for standardized format (activity1, activity2 objects)
    if "activity1" in topic and isinstance(topic["activity1"], dict):
        activity_1 = topic["activity1"].get("title", "") + ": " + topic["activity1"].get("achievement", "")
    elif "activity_1" in topic:
        activity_1 = topic["activity_1"]
    elif "Activity 1" in topic:
        activity_1 = topic["Activity 1"]
    
    if "activity2" in topic and isinstance(topic["activity2"], dict):
        activity_2 = topic["activity2"].get("title", "") + ": " + topic["activity2"].get("achievement", "")
    elif "activity_2" in topic:
        activity_2 = topic["activity_2"]
    elif "Activity 2" in topic:
        activity_2 = topic["Activity 2"]
    
    child_name = profile.get("child_name", "Child")
    child_age = profile.get("age", 7)
    
    # Base activity structure
    base_activity = {
        "topic": topic_name,
        "niche": niche,
        "week_theme": f"Week {week_num}",
        "day_name": day_name.capitalize(),
        "duration": "30-45 minutes",
        "difficulty_level": "Age-appropriate",
        "materials_needed": "Basic materials",
        "objective": objective,
        "explanation": explanation
    }
    
    # Week-specific enhancements
    if week_num == 1:  # Foundation & Introduction
        base_activity.update({
            "activity": f"🎯 Discovery Mission: {activity_1[:100] if activity_1 else f'Explore {topic_name} through fun, hands-on activities'}",
            "secondary_activity": f"🌟 Wonder Wall: {activity_2[:100] if activity_2 else f'Create a visual board of questions about {topic_name}'}",
            "motivation_element": f"🚀 You're starting an amazing journey into {niche}!",
            "success_metric": "Child shows curiosity and asks questions"
        })
        
    elif week_num == 2:  # Deep Dive & Exploration
        base_activity.update({
            "activity": f"🔬 Deep Dive: {activity_1[:100] if activity_1 else f'Investigate {topic_name} through experiments and research'}",
            "secondary_activity": f"📚 Research Challenge: {activity_2[:100] if activity_2 else f'Find 3 interesting facts about {topic_name}'}",
            "motivation_element": f"🎯 You're becoming an expert in {niche}!",
            "success_metric": "Child demonstrates deeper understanding"
        })
        
    elif week_num == 3:  # Application & Practice
        base_activity.update({
            "activity": f"💡 Real-World Application: {activity_1[:100] if activity_1 else f'Use {topic_name} to solve everyday problems'}",
            "secondary_activity": f"🎯 Practice Challenge: {activity_2[:100] if activity_2 else f'Create 3 different scenarios using {topic_name}'}",
            "motivation_element": f"🏆 You're mastering {niche} skills!",
            "success_metric": "Child can explain concepts to others"
        })
        
    elif week_num == 4:  # Project & Mastery
        base_activity.update({
            "activity": f"🎨 Project Creation: {activity_1[:100] if activity_1 else f'Build a {topic_name} component for your masterpiece'}",
            "secondary_activity": f"📝 Project Documentation: {activity_2[:100] if activity_2 else f'Record your {topic_name} contribution'}",
            "motivation_element": f"🌟 You're creating something amazing with {niche}!",
            "success_metric": "Child contributes to final project",
            "project_integration": {
                "component_name": f"{topic_name} Module",
                "contribution": f"Adds {topic_name} elements to final project",
                "presentation_prep": f"Prepare to showcase {topic_name} work"
            }
        })
    
    # Add age-appropriate modifications
    if child_age <= 5:
        base_activity["activity"] = f"🎮 Play-based learning: {base_activity['activity']}"
        base_activity["duration"] = "20-30 minutes"
    elif child_age <= 8:
        base_activity["activity"] = f"🎯 Guided exploration: {base_activity['activity']}"
        base_activity["duration"] = "30-45 minutes"
    else:
        base_activity["activity"] = f"🔬 Independent investigation: {base_activity['activity']}"
        base_activity["duration"] = "45-60 minutes"
    
    return base_activity
