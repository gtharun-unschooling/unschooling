#!/usr/bin/env python3
"""
Display LLM outputs from the latest generated plan
"""
import json
import os

print("=" * 80)
print("🤖 LLM OUTPUTS - LATEST PLAN".center(80))
print("=" * 80)

# Load the plan
plan_file = '/Users/tharunguduguntla/Documents/unschooling/latest_llm_plan.json'

if not os.path.exists(plan_file):
    print("\n❌ No plan file found!")
    print(f"Expected: {plan_file}")
    exit(1)

with open(plan_file, 'r') as f:
    response = json.load(f)

if not response.get('success'):
    print("\n❌ Plan generation failed!")
    print(f"Error: {response.get('error', 'Unknown error')}")
    exit(1)

data = response.get('data', {})
structure = data.get('monthly_plan_structure', {})
agenda = structure.get('monthly_agenda', {})
theme = structure.get('selected_themes', [{}])[0]
match_analysis = data.get('match_analysis', {})
weekly_prog = structure.get('weekly_progression', {})
review = data.get('review', {})

print("\n" + "─" * 80)
print("📝 1. ANALYSIS AGENT - AI THEME SELECTION")
print("─" * 80)

print(f"\n🎯 AI-Selected Theme: {theme.get('themeName', 'N/A')}")
print(f"   Description: {theme.get('shortDescription', 'N/A')}")
print(f"   Focus Area: {theme.get('coreFocusArea', 'N/A')}")

print(f"\n🧠 AI Thought Process:")
print(f"   {agenda.get('thought_process', 'N/A')[:300]}...")

print(f"\n📖 AI Learning Narrative:")
print(f"   {agenda.get('learning_narrative', 'N/A')[:300]}...")

print(f"\n🎯 Primary Goal (AI-Generated):")
print(f"   {agenda.get('primary_goal', 'N/A')}")

print("\n" + "─" * 80)
print("🎯 2. MATCH AGENT - AI TOPIC SELECTION")
print("─" * 80)

print(f"\n📊 Total Topics Selected: {match_analysis.get('total_topics_selected', 'N/A')}")
print(f"📚 Niches Covered: {', '.join(match_analysis.get('niches_covered', []))}")

criteria = structure.get('guidance_for_match_agent', {})
print(f"\n🎯 AI Topic Criteria:")
print(f"   {criteria.get('topic_criteria', 'N/A')[:250]}...")

print(f"\n🎓 AI Skill Focus:")
for skill in criteria.get('skill_focus', [])[:8]:
    print(f"   • {skill}")

print("\n" + "─" * 80)
print("📅 3. SCHEDULE AGENT - AI WEEK ORGANIZATION")
print("─" * 80)

for week_name, week_desc in weekly_prog.items():
    week_num = week_name.replace('week_', '')
    print(f"\n📅 WEEK {week_num} (AI-Written):")
    print(f"   {week_desc}")

print("\n" + "─" * 80)
print("✅ 4. REVIEWER AGENT - AI QUALITY ASSESSMENT")
print("─" * 80)

if review.get('review_summary'):
    print(f"\n📊 AI Review Summary:")
    print(f"   {review.get('review_summary', 'N/A')}")
    
    plan_quality = review.get('plan_quality', {})
    print(f"\n⭐ Overall Score: {plan_quality.get('overall_score', 'N/A')}")
    print(f"📊 Structure: {plan_quality.get('structure_completeness', 'N/A')}")
    print(f"🎨 Variety: {plan_quality.get('activity_variety', 'N/A')}")
else:
    print("\n⚠️  No reviewer output (using fallback)")

print("\n" + "=" * 80)
print("📊 SUMMARY")
print("=" * 80)

# Check if LLM was actually used
weekly_plan = data.get('weekly_plan', {})
has_narrative = len(agenda.get('learning_narrative', '')) > 100
has_thought_process = len(agenda.get('thought_process', '')) > 100
has_weeks = len(weekly_plan) == 4

print(f"\n✅ Plan Generated: {has_weeks} weeks")
print(f"✅ AI Narrative: {'YES' if has_narrative else 'NO (Fallback)'}")
print(f"✅ AI Reasoning: {'YES' if has_thought_process else 'NO (Fallback)'}")

if has_narrative and has_thought_process:
    print("\n🎉 LLM IS WORKING! This plan has AI intelligence! 🤖✨")
else:
    print("\n⚠️  Using fallback - LLM may not be fully working")

print("\n" + "=" * 80)
print("\n💡 TIP: Open latest_llm_plan.json in a JSON viewer to see complete details")
print("=" * 80 + "\n")

