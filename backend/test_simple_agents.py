#!/usr/bin/env python3
"""
Simple test to check if agents work without Google API.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents.profile_agent import run_profile_agent
from agents.schedule_agent import run_schedule_agent
from agents.reviewer_agent import run_reviewer_agent

def test_agents_without_api():
    """Test agents that don't require external API calls."""
    print("🧪 Testing Agents Without External API...")
    
    # Test profile agent
    print("\n1. Testing Profile Agent...")
    try:
        profile_state = {"profile": {"child_name": "Test", "child_age": 7, "interests": ["AI"]}}
        result = run_profile_agent(profile_state)
        print(f"✅ Profile Agent Result: {result}")
    except Exception as e:
        print(f"❌ Profile Agent Error: {e}")
    
    # Test schedule agent with mock topics
    print("\n2. Testing Schedule Agent...")
    try:
        mock_topics = [
            {"Topic": "What is a Robot?", "Niche": "AI", "Age": "7", "Activity 1": "Build a simple robot", "Activity 2": "Learn about automation"},
            {"Topic": "Smart Helpers", "Niche": "AI", "Age": "7", "Activity 1": "Explore smart devices", "Activity 2": "Create a smart home project"}
        ]
        schedule_state = {
            "profile": {"child_name": "Test", "child_age": 7, "interests": ["AI"]},
            "matched_topics": mock_topics
        }
        result = run_schedule_agent(schedule_state)
        print(f"✅ Schedule Agent Result: {result}")
    except Exception as e:
        print(f"❌ Schedule Agent Error: {e}")
    
    # Test reviewer agent
    print("\n3. Testing Reviewer Agent...")
    try:
        reviewer_state = {
            "profile": {"child_name": "Test", "child_age": 7, "interests": ["AI"]},
            "matched_topics": mock_topics,
            "weekly_plan": {"Day 1": {"Topic": "What is a Robot?"}}
        }
        result = run_reviewer_agent(reviewer_state)
        print(f"✅ Reviewer Agent Result: {result}")
    except Exception as e:
        print(f"❌ Reviewer Agent Error: {e}")

if __name__ == "__main__":
    print("🚀 Starting Simple Agent Test...")
    test_agents_without_api()
    print("\n🎉 Simple agent tests completed!") 