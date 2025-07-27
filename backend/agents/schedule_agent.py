def run_schedule_agent(state):
    matched = state["matched_topics"]
    
    plan = {}
    for i, topic in enumerate(matched):
        plan[f"Day {i+1}"] = {
            "Niche": topic.get("Niche"),
            "#": topic.get("#"),
            "Topic": topic.get("Topic"),
            "Objective": topic.get("Objective"),
            "Explanation": topic.get("Explanation"),
            "Hashtags": topic.get("Hashtags"),
            "Estimated Time": topic.get("Estimated Time"),
            "Age": topic.get("Age"),
            "Activity 1": topic.get("Activity 1"),
            "Activity 2": topic.get("Activity 2"),
        }
    
    return {"weekly_plan": plan, "profile": state["profile"]}
