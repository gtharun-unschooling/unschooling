from langgraph.graph import StateGraph
from agents.profile_agent import run_profile_agent
from agents.match_agent import run_match_agent
from agents.schedule_agent import run_schedule_agent
from agents.reviewer_agent import run_reviewer_agent



from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph

class AgentState(TypedDict, total=False):
    profile: Dict[str, Any]
    matched_topics: List[Dict[str, Any]]
    weekly_plan: Dict[str, Any]
    review: str


graph = StateGraph(AgentState)

graph.add_node("ProfileAgent", run_profile_agent)
graph.add_node("MatchAgent", run_match_agent)
graph.add_node("ScheduleAgent", run_schedule_agent)
graph.add_node("ReviewerAgent", run_reviewer_agent)

graph.set_entry_point("ProfileAgent")
graph.add_edge("ProfileAgent", "MatchAgent")
graph.add_edge("MatchAgent", "ScheduleAgent")
graph.add_edge("ScheduleAgent", "ReviewerAgent")
graph.set_finish_point("ReviewerAgent")

flow = graph.compile()


# # Step 3: Run the flow
# result = flow.invoke({})

# # Step 4: Print the final plan
# print("✅ Weekly Plan Generated:")
# for day, details in result["weekly_plan"].items():
#     print(f"\n📅 {day}:")
#     print(f"  Niche: {details['Niche']}")
#     print(f"  Topic: {details['Topic']}")
#     print(f"  Activity 1: {details['Activity 1'].splitlines()[0]}")
#     print(f"  Activity 2: {details['Activity 2'].splitlines()[0]}")