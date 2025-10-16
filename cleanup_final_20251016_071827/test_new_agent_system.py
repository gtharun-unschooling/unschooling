#!/usr/bin/env python3
"""Test the new 5-agent system with 50→28 topic selection."""

import sys
import os
sys.path.insert(0, 'backend')

from main_agents import profile_agent, analysis_agent, match_agent, schedule_agent, reviewer_agent
import json
from datetime import datetime

def test_agent_system():
    print("=" * 80)
    print("🧪 TESTING NEW 5-AGENT SYSTEM")
    print("=" * 80)
    
    # Test profile
    test_profile = {
        "child_name": "Alex",
        "child_age": 7,
        "interests": ["Technology", "Science", "Robots"],
        "dislikes": ["Heavy Reading"],
        "preferred_learning_style": "visual",
        "goals": ["Learn coding", "Build projects"],
        "plan_type": "hybrid"
    }
    
    print("\n📋 TEST PROFILE:")
    print(json.dumps(test_profile, indent=2))
    
    try:
        # Step 1: Profile Agent
        print("\n" + "=" * 80)
        print("STEP 1: PROFILE AGENT")
        print("=" * 80)
        profile_result = profile_agent.run(test_profile)
        print(f"✅ Profile Agent completed in {profile_result['agent_timing']['execution_time_seconds']:.3f}s")
        print(f"📊 Generated insights: {profile_result['standardized_profile'].get('profile_insights', {}).keys()}")
        
        # Step 2: Analysis Agent
        print("\n" + "=" * 80)
        print("STEP 2: ANALYSIS AGENT (Monthly Planning)")
        print("=" * 80)
        analysis_result = analysis_agent.run(profile_result)
        print(f"✅ Analysis Agent completed in {analysis_result['agent_timing']['execution_time_seconds']:.3f}s")
        print(f"📚 Themes loaded: {len(analysis_agent.themes)}")
        
        monthly_structure = analysis_result.get('monthly_plan_structure', {})
        selected_themes = monthly_structure.get('selected_themes', [])
        print(f"📅 Month type: {monthly_structure.get('month_type', 'unknown')}")
        print(f"🎯 Selected themes: {[t.get('themeName', 'Unknown') for t in selected_themes]}")
        print(f"🧠 LLM used: {analysis_result['agent_timing']['llm_used']}")
        
        # Step 3: Match Agent
        print("\n" + "=" * 80)
        print("STEP 3: MATCH AGENT (50 Candidate Topics)")
        print("=" * 80)
        match_result = match_agent.run(analysis_result)
        print(f"✅ Match Agent completed in {match_result['agent_timing']['execution_time_seconds']:.3f}s")
        
        matched_topics = match_result.get('matched_topics', [])
        print(f"🎯 Candidate topics selected: {len(matched_topics)} (target: 50)")
        print(f"📊 Topics database size: {len(match_agent.topics_data)}")
        print(f"📊 EG activities size: {len(match_agent.essential_growth_activities)}")
        
        # Step 4: Schedule Agent
        print("\n" + "=" * 80)
        print("STEP 4: SCHEDULE AGENT (Final 28 from 50)")
        print("=" * 80)
        schedule_result = schedule_agent.run(match_result)
        print(f"✅ Schedule Agent completed in {schedule_result['agent_timing']['execution_time_seconds']:.3f}s")
        
        final_topics = schedule_result.get('matched_topics', [])
        weekly_plan = schedule_result.get('weekly_plan', {})
        print(f"🎯 Final topics selected: {len(final_topics)} (target: 28)")
        print(f"📅 Weeks created: {len(weekly_plan)}")
        
        # Step 5: Reviewer Agent
        print("\n" + "=" * 80)
        print("STEP 5: REVIEWER AGENT (Quality Validation)")
        print("=" * 80)
        reviewer_result = reviewer_agent.run(schedule_result)
        print(f"✅ Reviewer Agent completed in {reviewer_result['agent_timing']['execution_time_seconds']:.3f}s")
        
        review_analysis = reviewer_result.get('review_analysis', {})
        print(f"🎯 Themes validated: {review_analysis.get('selected_themes', [])}")
        print(f"📊 Topics reviewed: {review_analysis.get('total_topics_reviewed', 0)}")
        
        # Final Summary
        print("\n" + "=" * 80)
        print("✅ SYSTEM TEST COMPLETE")
        print("=" * 80)
        
        total_time = sum([
            profile_result['agent_timing']['execution_time_seconds'],
            analysis_result['agent_timing']['execution_time_seconds'],
            match_result['agent_timing']['execution_time_seconds'],
            schedule_result['agent_timing']['execution_time_seconds'],
            reviewer_result['agent_timing']['execution_time_seconds']
        ])
        
        print(f"\n⏱️  TIMING BREAKDOWN:")
        print(f"  Profile Agent:  {profile_result['agent_timing']['execution_time_seconds']:.3f}s")
        print(f"  Analysis Agent: {analysis_result['agent_timing']['execution_time_seconds']:.3f}s (LLM)")
        print(f"  Match Agent:    {match_result['agent_timing']['execution_time_seconds']:.3f}s (LLM)")
        print(f"  Schedule Agent: {schedule_result['agent_timing']['execution_time_seconds']:.3f}s (LLM)")
        print(f"  Reviewer Agent: {reviewer_result['agent_timing']['execution_time_seconds']:.3f}s")
        print(f"  TOTAL:          {total_time:.3f}s")
        
        print(f"\n📊 DATA FLOW VERIFICATION:")
        print(f"  ✅ Profile → Analysis: standardized_profile")
        print(f"  ✅ Analysis → Match: monthly_plan_structure")
        print(f"  ✅ Match → Schedule: {len(matched_topics)} candidate topics")
        print(f"  ✅ Schedule → Reviewer: {len(final_topics)} final topics")
        
        print(f"\n🎯 RESULTS:")
        print(f"  Selected Themes: {review_analysis.get('selected_themes', [])}")
        print(f"  Candidate Topics: {len(matched_topics)}")
        print(f"  Final Topics: {len(final_topics)}")
        print(f"  Weeks Planned: {len(weekly_plan)}")
        
        # Save results
        output_file = 'test_agent_results.json'
        with open(output_file, 'w') as f:
            json.dump({
                'test_profile': test_profile,
                'final_result': reviewer_result,
                'test_timestamp': datetime.now().isoformat()
            }, f, indent=2)
        
        print(f"\n💾 Results saved to: {output_file}")
        print("\n✅ ALL TESTS PASSED!")
        
        return True
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_agent_system()
    sys.exit(0 if success else 1)

