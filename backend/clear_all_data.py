"""
Clear All Test Data
"""

from real_usage_tracker import real_usage_tracker
from child_activity_tracker import child_activity_tracker

print("🧹 Clearing all test data...")

# Clear usage tracker data
real_usage_tracker.clear_all_data()
print("✅ Cleared real usage tracker data")

# Clear child activity data
child_activity_tracker.clear_all_data()
print("✅ Cleared child activity tracker data")

print("🎉 All test data cleared! Dashboard is now clean.")
