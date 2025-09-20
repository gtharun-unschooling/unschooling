"""
Child Activity Tracker
Tracks detailed real-time activity for each child with complete logging
"""

import time
import json
import os
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import logging
from firebase_service import firebase_service

logger = logging.getLogger(__name__)

class ChildActivityTracker:
    """Tracks detailed real-time activity for each child."""
    
    def __init__(self):
        self.activity_file = "backend/data/child_activity_logs.json"
        self.ensure_activity_file()
    
    def ensure_activity_file(self):
        """Ensure the activity tracking file exists."""
        os.makedirs(os.path.dirname(self.activity_file), exist_ok=True)
        if not os.path.exists(self.activity_file):
            with open(self.activity_file, 'w') as f:
                json.dump({
                    "children": {},
                    "global_activity": [],
                    "last_updated": time.time()
                }, f, indent=2)
    
    def clear_all_data(self):
        """Clear all activity tracking data."""
        with open(self.activity_file, 'w') as f:
            json.dump({
                "children": {},
                "global_activity": [],
                "last_updated": time.time()
            }, f, indent=2)
    
    def log_child_activity(self, 
                          child_id: str,
                          child_name: str,
                          activity_type: str,
                          agent_name: str,
                          action: str,
                          details: Dict[str, Any],
                          execution_time: float = 0.0,
                          tokens_used: int = 0,
                          cost: float = 0.0,
                          success: bool = True,
                          error_message: Optional[str] = None,
                          account_id: Optional[str] = None,
                          account_email: Optional[str] = None):
        """Log detailed activity for a specific child."""
        
        try:
            activity_record = {
                "timestamp": time.time(),
                "datetime": datetime.now().isoformat(),
                "child_id": child_id,
                "child_name": child_name,
                "activity_type": activity_type,  # profile_creation, plan_generation, content_access, etc.
                "agent_name": agent_name,
                "action": action,
                "details": details,
                "execution_time": execution_time,
                "tokens_used": tokens_used,
                "cost": cost,
                "success": success,
                "error_message": error_message,
                "session_id": details.get("session_id", "unknown"),
                "account_id": account_id,
                "account_email": account_email
            }
            
            # Load current activity data
            with open(self.activity_file, 'r') as f:
                activity_data = json.load(f)
            
            # Initialize child if not exists
            if child_id not in activity_data["children"]:
                activity_data["children"][child_id] = {
                    "child_name": child_name,
                    "created_at": time.time(),
                    "total_activities": 0,
                    "total_tokens": 0,
                    "total_cost": 0.0,
                    "total_execution_time": 0.0,
                    "activities": [],
                    "agent_usage": {},
                    "recent_activity": []
                }
            
            # Update child data
            child_data = activity_data["children"][child_id]
            child_data["total_activities"] += 1
            child_data["total_tokens"] += tokens_used
            child_data["total_cost"] += cost
            child_data["total_execution_time"] += execution_time
            child_data["last_activity"] = time.time()
            
            # Add to child's activity log
            child_data["activities"].append(activity_record)
            
            # Keep only last 1000 activities per child
            if len(child_data["activities"]) > 1000:
                child_data["activities"] = child_data["activities"][-1000:]
            
            # Update agent usage for this child
            if agent_name not in child_data["agent_usage"]:
                child_data["agent_usage"][agent_name] = {
                    "total_calls": 0,
                    "total_tokens": 0,
                    "total_cost": 0.0,
                    "total_execution_time": 0.0,
                    "success_rate": 0.0,
                    "last_call": None
                }
            
            agent_data = child_data["agent_usage"][agent_name]
            agent_data["total_calls"] += 1
            agent_data["total_tokens"] += tokens_used
            agent_data["total_cost"] += cost
            agent_data["total_execution_time"] += execution_time
            agent_data["last_call"] = time.time()
            
            # Update recent activity (last 50 activities)
            child_data["recent_activity"].append(activity_record)
            if len(child_data["recent_activity"]) > 50:
                child_data["recent_activity"] = child_data["recent_activity"][-50:]
            
            # Add to global activity
            activity_data["global_activity"].append(activity_record)
            if len(activity_data["global_activity"]) > 1000:
                activity_data["global_activity"] = activity_data["global_activity"][-1000:]
            
            activity_data["last_updated"] = time.time()
            
            # Save updated data
            with open(self.activity_file, 'w') as f:
                json.dump(activity_data, f, indent=2)
            
            logger.info(f"📊 Logged activity for {child_name}: {action} by {agent_name}")
            
            return activity_record
            
        except Exception as e:
            logger.error(f"❌ Error logging child activity: {e}")
            return None
    
    def get_child_activity_summary(self, child_id: str, time_range: str = "all", account_id: Optional[str] = None) -> Dict[str, Any]:
        """Get comprehensive activity summary for a specific child."""
        
        try:
            with open(self.activity_file, 'r') as f:
                activity_data = json.load(f)
            
            if child_id not in activity_data["children"]:
                return {"error": "Child not found"}
            
            child_data = activity_data["children"][child_id]
            current_time = time.time()
            
            # Calculate time ranges
            time_ranges = {
                "5_minutes": current_time - 300,
                "10_minutes": current_time - 600,
                "1_hour": current_time - 3600,
                "24_hours": current_time - 86400,
                "7_days": current_time - 604800,
                "30_days": current_time - 2592000
            }
            
            # Filter activities by time range and account
            if time_range == "all":
                filtered_activities = child_data["activities"]
            elif time_range in time_ranges:
                cutoff_time = time_ranges[time_range]
                filtered_activities = [a for a in child_data["activities"] if a["timestamp"] >= cutoff_time]
            else:
                filtered_activities = child_data["activities"]
            
            # Filter by account if specified
            if account_id:
                filtered_activities = [a for a in filtered_activities if a.get("account_id") == account_id]
            
            # Calculate metrics for the time range
            total_activities = len(filtered_activities)
            total_tokens = sum(a["tokens_used"] for a in filtered_activities)
            total_cost = sum(a["cost"] for a in filtered_activities)
            total_execution_time = sum(a["execution_time"] for a in filtered_activities)
            successful_activities = sum(1 for a in filtered_activities if a["success"])
            success_rate = (successful_activities / max(total_activities, 1)) * 100
            
            # Agent breakdown
            agent_breakdown = {}
            for activity in filtered_activities:
                agent = activity["agent_name"]
                if agent not in agent_breakdown:
                    agent_breakdown[agent] = {
                        "calls": 0,
                        "tokens": 0,
                        "cost": 0.0,
                        "execution_time": 0.0,
                        "success_rate": 0.0
                    }
                
                agent_breakdown[agent]["calls"] += 1
                agent_breakdown[agent]["tokens"] += activity["tokens_used"]
                agent_breakdown[agent]["cost"] += activity["cost"]
                agent_breakdown[agent]["execution_time"] += activity["execution_time"]
            
            # Calculate success rates for each agent
            for agent in agent_breakdown:
                agent_activities = [a for a in filtered_activities if a["agent_name"] == agent]
                successful = sum(1 for a in agent_activities if a["success"])
                agent_breakdown[agent]["success_rate"] = (successful / max(len(agent_activities), 1)) * 100
            
            # Activity type breakdown
            activity_types = {}
            for activity in filtered_activities:
                activity_type = activity["activity_type"]
                if activity_type not in activity_types:
                    activity_types[activity_type] = 0
                activity_types[activity_type] += 1
            
            return {
                "child_info": {
                    "child_id": child_id,
                    "child_name": child_data["child_name"],
                    "created_at": child_data["created_at"],
                    "last_activity": child_data.get("last_activity", 0)
                },
                "time_range": time_range,
                "summary": {
                    "total_activities": total_activities,
                    "total_tokens": total_tokens,
                    "total_cost": total_cost,
                    "total_execution_time": total_execution_time,
                    "success_rate": success_rate,
                    "average_execution_time": total_execution_time / max(total_activities, 1),
                    "average_cost_per_activity": total_cost / max(total_activities, 1)
                },
                "agent_breakdown": agent_breakdown,
                "activity_types": activity_types,
                "recent_activities": child_data["recent_activity"][-20:],  # Last 20 activities
                "all_activities": filtered_activities
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting child activity summary: {e}")
            return {"error": str(e)}
    
    def get_all_children_summary(self, account_id: Optional[str] = None) -> Dict[str, Any]:
        """Get summary of all children's activities."""
        
        try:
            with open(self.activity_file, 'r') as f:
                activity_data = json.load(f)
            
            children_summary = {}
            current_time = time.time()
            
            for child_id, child_data in activity_data["children"].items():
                # Get recent activity (last 24 hours)
                recent_activities = [
                    a for a in child_data["activities"] 
                    if a["timestamp"] >= current_time - 86400
                ]
                
                # Filter by account if specified
                if account_id:
                    recent_activities = [a for a in recent_activities if a.get("account_id") == account_id]
                
                children_summary[child_id] = {
                    "child_name": child_data["child_name"],
                    "created_at": child_data["created_at"],
                    "last_activity": child_data.get("last_activity", 0),
                    "total_activities": child_data["total_activities"],
                    "total_tokens": child_data["total_tokens"],
                    "total_cost": child_data["total_cost"],
                    "recent_activities_24h": len(recent_activities),
                    "recent_cost_24h": sum(a["cost"] for a in recent_activities),
                    "recent_tokens_24h": sum(a["tokens_used"] for a in recent_activities),
                    "agent_usage": child_data["agent_usage"]
                }
            
            return {
                "total_children": len(children_summary),
                "children": children_summary,
                "global_stats": {
                    "total_activities": sum(c["total_activities"] for c in children_summary.values()),
                    "total_tokens": sum(c["total_tokens"] for c in children_summary.values()),
                    "total_cost": sum(c["total_cost"] for c in children_summary.values()),
                    "active_children_24h": sum(1 for c in children_summary.values() if c["recent_activities_24h"] > 0)
                }
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting all children summary: {e}")
            return {"error": str(e)}
    
    def get_real_time_activity_feed(self, time_range: str = "1_hour") -> List[Dict[str, Any]]:
        """Get real-time activity feed for the admin dashboard."""
        
        try:
            with open(self.activity_file, 'r') as f:
                activity_data = json.load(f)
            
            current_time = time.time()
            time_ranges = {
                "5_minutes": current_time - 300,
                "10_minutes": current_time - 600,
                "1_hour": current_time - 3600,
                "24_hours": current_time - 86400
            }
            
            cutoff_time = time_ranges.get(time_range, current_time - 3600)
            
            # Get recent activities from all children
            recent_activities = [
                a for a in activity_data["global_activity"]
                if a["timestamp"] >= cutoff_time
            ]
            
            # Sort by timestamp (newest first)
            recent_activities.sort(key=lambda x: x["timestamp"], reverse=True)
            
            return recent_activities[:100]  # Return last 100 activities
            
        except Exception as e:
            logger.error(f"❌ Error getting real-time activity feed: {e}")
            return []
    
    def get_filter_options(self) -> Dict[str, Any]:
        """Get all available children and accounts for filtering from Firestore."""
        
        try:
            # First try to get data from Firestore
            firestore_data = firebase_service.get_accounts_summary()
            if firestore_data["total_accounts"] > 0 or firestore_data["total_children"] > 0:
                logger.info(f"📊 Got {firestore_data['total_accounts']} accounts and {firestore_data['total_children']} children from Firestore")
                return firestore_data
            
            # Fallback to activity file if Firestore is empty
            logger.info("📊 No data in Firestore, falling back to activity file")
            with open(self.activity_file, 'r') as f:
                activity_data = json.load(f)
            
            children = []
            accounts = set()
            
            for child_id, child_data in activity_data["children"].items():
                children.append({
                    "child_id": child_id,
                    "child_name": child_data["child_name"],
                    "created_at": child_data["created_at"],
                    "last_activity": child_data.get("last_activity", 0),
                    "total_activities": child_data["total_activities"]
                })
                
                # Collect unique accounts from activities
                for activity in child_data["activities"]:
                    if activity.get("account_id") and activity.get("account_id") != "unknown":
                        accounts.add(activity["account_id"])
                    if activity.get("account_email") and activity.get("account_email") != "unknown":
                        accounts.add(activity["account_email"])
            
            # Convert accounts set to list with details
            account_list = []
            for account in accounts:
                account_list.append({
                    "account_id": account,
                    "account_email": account if "@" in account else None,
                    "display_name": account
                })
            
            return {
                "children": sorted(children, key=lambda x: x["child_name"]),
                "accounts": sorted(account_list, key=lambda x: x["display_name"]),
                "total_children": len(children),
                "total_accounts": len(account_list)
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting filter options: {e}")
            return {"children": [], "accounts": [], "total_children": 0, "total_accounts": 0}
    
    def get_firestore_accounts(self) -> Dict[str, Any]:
        """Get account information from Firestore (if available)."""
        try:
            # This would require Firebase Admin SDK integration
            # For now, return the accounts from activity data
            return self.get_filter_options()
        except Exception as e:
            logger.error(f"❌ Error getting Firestore accounts: {e}")
            return {"children": [], "accounts": [], "total_children": 0, "total_accounts": 0}

# Global instance
child_activity_tracker = ChildActivityTracker()
