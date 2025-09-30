"""
Real Usage Tracker - Tracks actual usage of the system
"""

import json
import os
from datetime import datetime
from typing import Dict, Any

class RealUsageTracker:
    """Tracks real usage data for analytics and optimization."""
    
    def __init__(self):
        self.data_file = "backend/data/real_usage_data.json"
        self.ensure_data_file()
    
    def ensure_data_file(self):
        """Ensure the data file exists."""
        if not os.path.exists(self.data_file):
            os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
            with open(self.data_file, 'w') as f:
                json.dump([], f)
    
    def track_usage(self, event_type: str, data: Dict[str, Any]):
        """Track a usage event."""
        try:
            with open(self.data_file, 'r') as f:
                usage_data = json.load(f)
            
            event = {
                "timestamp": datetime.now().isoformat(),
                "event_type": event_type,
                "data": data
            }
            
            usage_data.append(event)
            
            with open(self.data_file, 'w') as f:
                json.dump(usage_data, f, indent=2)
                
        except Exception as e:
            print(f"Error tracking usage: {e}")

# Create global instance
real_usage_tracker = RealUsageTracker()
