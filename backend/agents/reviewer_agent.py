def run_reviewer_agent(state):
    plan = state["weekly_plan"]
    profile = state["profile"]

    # Basic example - add logic for memory comparison later
    review_notes = "All selected topics are unique. Plan is balanced."

    return {"final_plan": plan, "profile": profile, "review": review_notes}
