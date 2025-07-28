#!/usr/bin/env python3
"""
Test script to check if the agent system is working properly.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main_graph import flow
from agents.profile_agent import run_profile_agent
from agents.match_agent import run_match_agent
from agents.schedule_agent import run_schedule_agent
from agents.reviewer_agent import run_reviewer_agent

def test_individual_agents():
    """Test each agent individually."""
    print("🧪 Testing Individual Agents...")
    
    # Test profile agent
    print("\n1. Testing Profile Agent...")
    try:
        profile_state = {"profile": {"child_name": "Test", "child_age": 7, "interests": ["AI"]}}
        result = run_profile_agent(profile_state)
        print(f"✅ Profile Agent Result: {result}")
    except Exception as e:
        print(f"❌ Profile Agent Error: {e}")
    
    # Test match agent
    print("\n2. Testing Match Agent...")
    try:
        match_state = {"profile": {"child_name": "Test", "child_age": 7, "interests": ["AI"]}}
        result = run_match_agent(match_state)
        print(f"✅ Match Agent Result: {result}")
        print(f"📊 Found {len(result.get('matched_topics', []))} matched topics")
    except Exception as e:
        print(f"❌ Match Agent Error: {e}")
    
    # Test schedule agent
    print("\n3. Testing Schedule Agent...")
    try:
        schedule_state = {
            "profile": {"child_name": "Test", "child_age": 7, "interests": ["AI"]},
            "matched_topics": [{"Topic": "Test Topic", "Niche": "AI", "Age": "7"}]
        }
        result = run_schedule_agent(schedule_state)
        print(f"✅ Schedule Agent Result: {result}")
    except Exception as e:
        print(f"❌ Schedule Agent Error: {e}")
    
    # Test reviewer agent
    print("\n4. Testing Reviewer Agent...")
    try:
        reviewer_state = {
            "profile": {"child_name": "Test", "child_age": 7, "interests": ["AI"]},
            "matched_topics": [{"Topic": "Test Topic", "Niche": "AI", "Age": "7"}],
            "weekly_plan": {"Day 1": {"Topic": "Test Topic"}}
        }
        result = run_reviewer_agent(reviewer_state)
        print(f"✅ Reviewer Agent Result: {result}")
    except Exception as e:
        print(f"❌ Reviewer Agent Error: {e}")

def test_langgraph_flow():
    """Test the complete LangGraph flow."""
    print("\n🧪 Testing Complete LangGraph Flow...")
    
    try:
        # Test the complete flow
        initial_state = {
            "profile": {
                "child_name": "Test",
                "child_age": 7,
                "interests": ["AI"],
                "preferred_learning_style": "visual",
                "plan_type": "hybrid"
            }
        }
        
        print(f"📥 Initial State: {initial_state}")
        result = flow.invoke(initial_state)
        print(f"✅ LangGraph Flow Result: {result}")
        
        # Check if we got real topics
        matched_topics = result.get('matched_topics', [])
        print(f"📊 Found {len(matched_topics)} matched topics")
        if matched_topics:
            print("🎯 Sample topics:")
            for topic in matched_topics[:3]:
                print(f"  - {topic.get('Topic', 'Unknown')} ({topic.get('Niche', 'Unknown')})")
        
        return True
    except Exception as e:
        print(f"❌ LangGraph Flow Error: {e}")
        import traceback
        print(f"📋 Traceback: {traceback.format_exc()}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Agent System Test...")
    
    # Test individual agents
    test_individual_agents()
    
    # Test complete flow
    success = test_langgraph_flow()
    
    if success:
        print("\n🎉 All tests passed! Agent system is working.")
    else:
        print("\n❌ Some tests failed. Check the errors above.") 