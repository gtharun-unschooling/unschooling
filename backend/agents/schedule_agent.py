def run_schedule_agent(state):
    matched = state["matched_topics"]
    profile = state["profile"]
    
    # Create a more structured weekly plan
    weekly_plan = {
        "weeks": [
            {
                "week": 1,
                "days": []
            }
        ]
    }
    
    # Generate activities for each day
    for i, topic in enumerate(matched[:5]):  # Limit to 5 days
        day_activity = {
            "day": i + 1,
            "activity": f"{topic.get('Activity 1', 'Explore ' + topic.get('Topic', 'AI'))}",
            "duration": topic.get("Estimated Time", "30 min"),
            "topic": topic.get("Topic"),
            "niche": topic.get("Niche"),
            "objective": topic.get("Objective", f"Learn about {topic.get('Topic', 'AI')}")
        }
        weekly_plan["weeks"][0]["days"].append(day_activity)
    
    # Add learning objectives and recommended activities
    learning_objectives = [
        f"Develop {profile.get('interests', ['AI'])[0]} skills",
        "Enhance problem-solving abilities",
        "Build creativity and innovation",
        "Improve critical thinking"
    ]
    
    recommended_activities = [
        "Interactive learning games",
        "Hands-on projects",
        "Creative exploration",
        "Problem-solving challenges"
    ]
    
    progress_tracking = {
        "metrics": ["engagement", "completion", "understanding"],
        "frequency": "weekly"
    }
    
    return {
        "weekly_plan": weekly_plan,
        "learning_objectives": learning_objectives,
        "recommended_activities": recommended_activities,
        "progress_tracking": progress_tracking,
        "profile": profile
    }
