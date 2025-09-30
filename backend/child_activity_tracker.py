"""
Child Activity Tracker - Tracks child learning activities and progress
"""

import json
import os
from datetime import datetime
from typing import Dict, Any, List

class ChildActivityTracker:
    """Tracks child learning activities and progress."""
    
    def __init__(self):
        self.data_file = "backend/data/child_activity_logs.json"
        self.ensure_data_file()
    
    def ensure_data_file(self):
        """Ensure the data file exists."""
        if not os.path.exists(self.data_file):
            os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
            with open(self.data_file, 'w') as f:
                json.dump([], f)
    
    def log_activity(self, child_id: str, activity: str, data: Dict[str, Any]):
        """Log a child activity."""
        try:
            with open(self.data_file, 'r') as f:
                activity_logs = json.load(f)
            
            log_entry = {
                "timestamp": datetime.now().isoformat(),
                "child_id": child_id,
                "activity": activity,
                "data": data
            }
            
            activity_logs.append(log_entry)
            
            with open(self.data_file, 'w') as f:
                json.dump(activity_logs, f, indent=2)
                
        except Exception as e:
            print(f"Error logging activity: {e}")
    
    def get_child_activities(self, child_id: str) -> List[Dict[str, Any]]:
        """Get activities for a specific child."""
        try:
            with open(self.data_file, 'r') as f:
                activity_logs = json.load(f)
            
            return [log for log in activity_logs if log.get("child_id") == child_id]
            
        except Exception as e:
            print(f"Error getting child activities: {e}")
            return []

# Create global instance
child_activity_tracker = ChildActivityTracker()
