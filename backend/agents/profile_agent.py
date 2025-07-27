
def run_profile_agent(state):
    print("✅ Received input state in ProfileAgent:", state)

    # Just pass along the profile info (already received via API)
    profile = state.get("profile", {})
    return {"profile": profile}