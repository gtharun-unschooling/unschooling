#!/usr/bin/env python3
"""
Learning History Tracker
Tracks child learning progress and provides intelligent recommendations
"""

import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import logging
from collections import defaultdict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LearningHistoryTracker:
    """Tracks learning history and provides intelligent recommendations."""
    
    def __init__(self):
        self.achievement_definitions = {
            "first_topic": {
                "id": "first_topic",
                "name": "First Steps",
                "description": "Completed your first learning topic",
                "icon": "🌟",
                "requirement": {"topics_completed": 1}
            },
            "basic_master": {
                "id": "basic_master",
                "name": "Basic Master",
                "description": "Completed all basic level topics in any niche",
                "icon": "📚",
                "requirement": {"stage_completed": "basic"}
            },
            "intermediate_explorer": {
                "id": "intermediate_explorer",
                "name": "Intermediate Explorer",
                "description": "Completed 20 intermediate level topics",
                "icon": "🔍",
                "requirement": {"stage_count": {"intermediate": 20}}
            },
            "advanced_thinker": {
                "id": "advanced_thinker",
                "name": "Advanced Thinker",
                "description": "Completed 10 advanced level topics",
                "icon": "🧠",
                "requirement": {"stage_count": {"advanced": 10}}
            },
            "expert_achiever": {
                "id": "expert_achiever",
                "name": "Expert Achiever",
                "description": "Completed 5 expert level topics",
                "icon": "🏆",
                "requirement": {"stage_count": {"expert": 5}}
            },
            "niche_specialist": {
                "id": "niche_specialist",
                "name": "Niche Specialist",
                "description": "Completed 30 topics in any single niche",
                "icon": "🎯",
                "requirement": {"niche_count": 30}
            },
            "learning_streak": {
                "id": "learning_streak",
                "name": "Learning Streak",
                "description": "Learned for 7 consecutive days",
                "icon": "🔥",
                "requirement": {"consecutive_days": 7}
            },
            "time_master": {
                "id": "time_master",
                "name": "Time Master",
                "description": "Spent 10 hours learning",
                "icon": "⏰",
                "requirement": {"total_time_hours": 10}
            }
        }
    
    def create_learning_session(self, child_id: str, topic_id: str, topic_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new learning session record."""
        session = {
            "session_id": f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{child_id}",
            "child_id": child_id,
            "topic_id": topic_id,
            "topic_name": topic_data.get("Topic", ""),
            "niche": topic_data.get("Niche", ""),
            "age_group": topic_data.get("age_group", ""),
            "difficulty": topic_data.get("difficulty", ""),
            "learning_stage": topic_data.get("dynamic_path", {}).get("stage", ""),
            "started_at": datetime.now().isoformat(),
            "completed_at": None,
            "time_spent_minutes": 0,
            "activities_completed": [],
            "parent_rating": None,
            "child_engagement": None,
            "notes": "",
            "status": "in_progress"
        }
        return session
    
    def complete_learning_session(self, session: Dict[str, Any], completion_data: Dict[str, Any]) -> Dict[str, Any]:
        """Mark a learning session as completed."""
        completed_session = session.copy()
        completed_session.update({
            "completed_at": datetime.now().isoformat(),
            "time_spent_minutes": completion_data.get("time_spent_minutes", 0),
            "activities_completed": completion_data.get("activities_completed", []),
            "parent_rating": completion_data.get("parent_rating", 5),
            "child_engagement": completion_data.get("child_engagement", "medium"),
            "notes": completion_data.get("notes", ""),
            "status": "completed"
        })
        
        # Calculate session duration
        start_time = datetime.fromisoformat(session["started_at"])
        end_time = datetime.fromisoformat(completed_session["completed_at"])
        duration = end_time - start_time
        completed_session["actual_duration_minutes"] = duration.total_seconds() / 60
        
        return completed_session
    
    def update_learning_history(self, child_id: str, completed_session: Dict[str, Any], history_file: str) -> Dict[str, Any]:
        """Update the child's learning history with completed session."""
        # Load existing history
        history = self.load_learning_history(child_id, history_file)
        
        # Add completed session
        history["learning_sessions"].append(completed_session)
        
        # Update progress summary
        history["progress_summary"] = self.calculate_progress_summary(history["learning_sessions"])
        
        # Check for new achievements
        new_achievements = self.check_achievements(history)
        if new_achievements:
            history["achievements"].extend(new_achievements)
            history["recent_achievements"] = new_achievements
        
        # Update last activity
        history["last_activity"] = datetime.now().isoformat()
        
        # Save updated history
        self.save_learning_history(child_id, history, history_file)
        
        return history
    
    def calculate_progress_summary(self, sessions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate comprehensive progress summary from learning sessions."""
        if not sessions:
            return self._create_empty_progress_summary()
        
        # Basic counts
        total_sessions = len(sessions)
        completed_sessions = [s for s in sessions if s.get("status") == "completed"]
        total_topics_completed = len(completed_sessions)
        
        # Time calculations
        total_time_minutes = sum(s.get("time_spent_minutes", 0) for s in completed_sessions)
        total_time_hours = total_time_minutes / 60
        
        # Niche breakdown
        niche_progress = defaultdict(lambda: {"completed": 0, "total_time": 0, "sessions": []})
        for session in completed_sessions:
            niche = session.get("niche", "Unknown")
            niche_progress[niche]["completed"] += 1
            niche_progress[niche]["total_time"] += session.get("time_spent_minutes", 0)
            niche_progress[niche]["sessions"].append(session)
        
        # Stage breakdown
        stage_progress = defaultdict(lambda: {"completed": 0, "total_time": 0})
        for session in completed_sessions:
            stage = session.get("learning_stage", "unknown")
            stage_progress[stage]["completed"] += 1
            stage_progress[stage]["total_time"] += session.get("time_spent_minutes", 0)
        
        # Difficulty breakdown
        difficulty_progress = defaultdict(lambda: {"completed": 0, "total_time": 0})
        for session in completed_sessions:
            difficulty = session.get("difficulty", "unknown")
            difficulty_progress[difficulty]["completed"] += 1
            difficulty_progress[difficulty]["total_time"] += session.get("time_spent_minutes", 0)
        
        # Learning streak calculation
        learning_streak = self._calculate_learning_streak(completed_sessions)
        
        # Engagement analysis
        engagement_scores = [s.get("child_engagement_score", 3) for s in completed_sessions if s.get("child_engagement_score")]
        avg_engagement = sum(engagement_scores) / len(engagement_scores) if engagement_scores else 3
        
        # Parent rating analysis
        parent_ratings = [s.get("parent_rating", 5) for s in completed_sessions if s.get("parent_rating")]
        avg_parent_rating = sum(parent_ratings) / len(parent_ratings) if parent_ratings else 5
        
        return {
            "total_sessions": total_sessions,
            "total_topics_completed": total_topics_completed,
            "total_learning_time_minutes": total_time_minutes,
            "total_learning_time_hours": total_time_hours,
            "learning_streak_days": learning_streak,
            "average_session_length_minutes": total_time_minutes / total_topics_completed if total_topics_completed > 0 else 0,
            "average_engagement_score": avg_engagement,
            "average_parent_rating": avg_parent_rating,
            "niche_progress": dict(niche_progress),
            "stage_progress": dict(stage_progress),
            "difficulty_progress": dict(difficulty_progress),
            "recent_activity": {
                "last_week": len([s for s in completed_sessions if self._is_within_days(s, 7)]),
                "last_month": len([s for s in completed_sessions if self._is_within_days(s, 30)]),
                "last_3_months": len([s for s in completed_sessions if self._is_within_days(s, 90)])
            },
            "strengths": self._identify_strengths(completed_sessions),
            "areas_for_growth": self._identify_growth_areas(completed_sessions),
            "recommended_next_topics": self._generate_recommendations(completed_sessions)
        }
    
    def _create_empty_progress_summary(self) -> Dict[str, Any]:
        """Create empty progress summary for new learners."""
        return {
            "total_sessions": 0,
            "total_topics_completed": 0,
            "total_learning_time_minutes": 0,
            "total_learning_time_hours": 0,
            "learning_streak_days": 0,
            "average_session_length_minutes": 0,
            "average_engagement_score": 0,
            "average_parent_rating": 0,
            "niche_progress": {},
            "stage_progress": {},
            "difficulty_progress": {},
            "recent_activity": {"last_week": 0, "last_month": 0, "last_3_months": 0},
            "strengths": [],
            "areas_for_growth": [],
            "recommended_next_topics": []
        }
    
    def _calculate_learning_streak(self, sessions: List[Dict[str, Any]]) -> int:
        """Calculate consecutive days of learning."""
        if not sessions:
            return 0
        
        # Sort sessions by completion date
        sorted_sessions = sorted(sessions, key=lambda x: x.get("completed_at", ""), reverse=True)
        
        streak = 0
        current_date = datetime.now().date()
        
        for session in sorted_sessions:
            session_date = datetime.fromisoformat(session["completed_at"]).date()
            days_diff = (current_date - session_date).days
            
            if days_diff == streak:
                streak += 1
            else:
                break
        
        return streak
    
    def _is_within_days(self, session: Dict[str, Any], days: int) -> bool:
        """Check if session was completed within specified days."""
        if not session.get("completed_at"):
            return False
        
        session_date = datetime.fromisoformat(session["completed_at"])
        days_diff = (datetime.now() - session_date).days
        return days_diff <= days
    
    def _identify_strengths(self, sessions: List[Dict[str, Any]]) -> List[str]:
        """Identify child's learning strengths."""
        strengths = []
        
        # High engagement areas
        high_engagement = [s for s in sessions if s.get("child_engagement") == "high"]
        if len(high_engagement) >= 5:
            strengths.append("high engagement and motivation")
        
        # Consistent learning
        if len(sessions) >= 10:
            strengths.append("consistent learning habits")
        
        # Multiple niches
        niches = set(s.get("niche") for s in sessions)
        if len(niches) >= 3:
            strengths.append("diverse learning interests")
        
        # Advanced topics
        advanced_topics = [s for s in sessions if s.get("difficulty") in ["Advanced", "Expert"]]
        if len(advanced_topics) >= 3:
            strengths.append("advanced concept understanding")
        
        return strengths
    
    def _identify_growth_areas(self, sessions: List[Dict[str, Any]]) -> List[str]:
        """Identify areas where child can improve."""
        growth_areas = []
        
        # Engagement patterns
        low_engagement = [s for s in sessions if s.get("child_engagement") == "low"]
        if len(low_engagement) >= 3:
            growth_areas.append("maintaining engagement in challenging topics")
        
        # Difficulty progression
        basic_topics = [s for s in sessions if s.get("difficulty") == "Beginner"]
        if len(basic_topics) >= 10 and len(sessions) >= 15:
            growth_areas.append("progressing to intermediate topics")
        
        # Learning consistency
        if len(sessions) < 5:
            growth_areas.append("building regular learning habits")
        
        return growth_areas
    
    def _generate_recommendations(self, sessions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate topic recommendations based on learning history."""
        if not sessions:
            return []
        
        recommendations = []
        
        # Find most successful niche
        niche_success = defaultdict(lambda: {"sessions": 0, "avg_rating": 0, "total_rating": 0})
        for session in sessions:
            niche = session.get("niche", "Unknown")
            niche_success[niche]["sessions"] += 1
            niche_success[niche]["total_rating"] += session.get("parent_rating", 5)
        
        # Calculate averages
        for niche in niche_success:
            if niche_success[niche]["sessions"] > 0:
                niche_success[niche]["avg_rating"] = niche_success[niche]["total_rating"] / niche_success[niche]["sessions"]
        
        # Recommend next topic in most successful niche
        if niche_success:
            best_niche = max(niche_success.keys(), key=lambda x: niche_success[x]["avg_rating"])
            recommendations.append({
                "type": "niche_continuation",
                "niche": best_niche,
                "reason": f"High success rate in {best_niche} (avg rating: {niche_success[best_niche]['avg_rating']:.1f})",
                "priority": "high"
            })
        
        # Recommend next difficulty level
        completed_difficulties = set(s.get("difficulty") for s in sessions)
        difficulty_order = ["Beginner", "Intermediate", "Advanced", "Expert"]
        
        for difficulty in difficulty_order:
            if difficulty in completed_difficulties:
                # Find next difficulty
                try:
                    next_difficulty_index = difficulty_order.index(difficulty) + 1
                    if next_difficulty_index < len(difficulty_order):
                        next_difficulty = difficulty_order[next_difficulty_index]
                        recommendations.append({
                            "type": "difficulty_progression",
                            "difficulty": next_difficulty,
                            "reason": f"Ready to progress from {difficulty} to {next_difficulty} level",
                            "priority": "medium"
                        })
                except ValueError:
                    pass
                break
        
        return recommendations
    
    def check_achievements(self, history: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Check if child has earned new achievements."""
        new_achievements = []
        sessions = history.get("learning_sessions", [])
        completed_sessions = [s for s in sessions if s.get("status") == "completed"]
        
        # Check each achievement
        for achievement_id, achievement_def in self.achievement_definitions.items():
            # Skip if already earned
            if any(a.get("id") == achievement_id for a in history.get("achievements", [])):
                continue
            
            # Check if requirements are met
            if self._check_achievement_requirements(achievement_def, completed_sessions, history):
                new_achievement = {
                    "id": achievement_id,
                    "name": achievement_def["name"],
                    "description": achievement_def["description"],
                    "icon": achievement_def["icon"],
                    "unlocked_at": datetime.now().isoformat(),
                    "progress": self._calculate_achievement_progress(achievement_def, completed_sessions, history)
                }
                new_achievements.append(new_achievement)
        
        return new_achievements
    
    def _check_achievement_requirements(self, achievement_def: Dict[str, Any], sessions: List[Dict[str, Any]], history: Dict[str, Any]) -> bool:
        """Check if achievement requirements are met."""
        requirements = achievement_def.get("requirement", {})
        
        for req_type, req_value in requirements.items():
            if req_type == "topics_completed":
                if len(sessions) < req_value:
                    return False
            elif req_type == "stage_completed":
                # Check if all topics in a stage are completed
                stage_sessions = [s for s in sessions if s.get("learning_stage") == req_value]
                # This would need more complex logic based on available topics
                pass
            elif req_type == "stage_count":
                for stage, count in req_value.items():
                    stage_sessions = [s for s in sessions if s.get("learning_stage") == stage]
                    if len(stage_sessions) < count:
                        return False
            elif req_type == "niche_count":
                niche_sessions = [s for s in sessions if s.get("niche") == req_value]
                if len(niche_sessions) < req_value:
                    return False
            elif req_type == "consecutive_days":
                streak = self._calculate_learning_streak(sessions)
                if streak < req_value:
                    return False
            elif req_type == "total_time_hours":
                total_time = sum(s.get("time_spent_minutes", 0) for s in sessions) / 60
                if total_time < req_value:
                    return False
        
        return True
    
    def _calculate_achievement_progress(self, achievement_def: Dict[str, Any], sessions: List[Dict[str, Any]], history: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate progress towards an achievement."""
        requirements = achievement_def.get("requirement", {})
        progress = {}
        
        for req_type, req_value in requirements.items():
            if req_type == "topics_completed":
                current = len(sessions)
                progress[req_type] = {
                    "current": current,
                    "required": req_value,
                    "percentage": min(100, (current / req_value) * 100)
                }
            elif req_type == "total_time_hours":
                current = sum(s.get("time_spent_minutes", 0) for s in sessions) / 60
                progress[req_type] = {
                    "current": current,
                    "required": req_value,
                    "percentage": min(100, (current / req_value) * 100)
                }
        
        return progress
    
    def load_learning_history(self, child_id: str, history_file: str) -> Dict[str, Any]:
        """Load learning history for a child."""
        try:
            if os.path.exists(history_file):
                with open(history_file, 'r', encoding='utf-8') as f:
                    all_history = json.load(f)
                    return all_history.get(child_id, self._create_empty_history(child_id))
            else:
                return self._create_empty_history(child_id)
        except Exception as e:
            logger.error(f"Error loading history for {child_id}: {e}")
            return self._create_empty_history(child_id)
    
    def save_learning_history(self, child_id: str, history: Dict[str, Any], history_file: str) -> bool:
        """Save learning history for a child."""
        try:
            # Load existing history for all children
            all_history = {}
            if os.path.exists(history_file):
                with open(history_file, 'r', encoding='utf-8') as f:
                    all_history = json.load(f)
            
            # Update this child's history
            all_history[child_id] = history
            
            # Save all history
            with open(history_file, 'w', encoding='utf-8') as f:
                json.dump(all_history, f, indent=2, ensure_ascii=False)
            
            return True
        except Exception as e:
            logger.error(f"Error saving history for {child_id}: {e}")
            return False
    
    def _create_empty_history(self, child_id: str) -> Dict[str, Any]:
        """Create empty learning history for a new child."""
        return {
            "child_id": child_id,
            "created_at": datetime.now().isoformat(),
            "last_activity": datetime.now().isoformat(),
            "learning_sessions": [],
            "achievements": [],
            "recent_achievements": [],
            "progress_summary": self._create_empty_progress_summary()
        }

def main():
    """Main function to demonstrate learning history tracking."""
    tracker = LearningHistoryTracker()
    
    # Example usage
    child_id = "child_123"
    history_file = "data/learning_history.json"
    
    print("🎯 Learning History Tracker Demo")
    print("=" * 40)
    
    # Create a sample learning session
    topic_data = {
        "Topic": "Understanding Money",
        "Niche": "Finance",
        "age_group": "Toddler",
        "difficulty": "Beginner",
        "dynamic_path": {"stage": "basic"}
    }
    
    # Start learning session
    session = tracker.create_learning_session(child_id, "Finance_Understanding_Money", topic_data)
    print(f"✅ Created learning session: {session['session_id']}")
    
    # Complete learning session
    completion_data = {
        "time_spent_minutes": 25,
        "activities_completed": ["Money Sorting", "Shopping Pretend Play"],
        "parent_rating": 5,
        "child_engagement": "high",
        "notes": "Child loved the shopping game!"
    }
    
    completed_session = tracker.complete_learning_session(session, completion_data)
    print(f"✅ Completed learning session: {completed_session['time_spent_minutes']} minutes")
    
    # Update learning history
    history = tracker.update_learning_history(child_id, completed_session, history_file)
    print(f"✅ Updated learning history for {child_id}")
    
    # Show progress summary
    progress = history["progress_summary"]
    print(f"\n📊 Progress Summary:")
    print(f"   Topics completed: {progress['total_topics_completed']}")
    print(f"   Total learning time: {progress['total_learning_time_hours']:.1f} hours")
    print(f"   Learning streak: {progress['learning_streak_days']} days")
    print(f"   Average rating: {progress['average_parent_rating']:.1f}/5")
    
    # Show achievements
    if history.get("recent_achievements"):
        print(f"\n🏆 New Achievements:")
        for achievement in history["recent_achievements"]:
            print(f"   {achievement['icon']} {achievement['name']}: {achievement['description']}")
    
    # Show recommendations
    if progress.get("recommended_next_topics"):
        print(f"\n💡 Recommendations:")
        for rec in progress["recommended_next_topics"]:
            print(f"   {rec['type']}: {rec['reason']}")

if __name__ == "__main__":
    main()
