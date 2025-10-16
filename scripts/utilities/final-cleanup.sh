#!/bin/bash
# Final Complete Cleanup
set -e

BACKUP_DIR="./cleanup_final_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "🧹 FINAL COMPLETE CLEANUP"
echo "========================"
echo "Backup: $BACKUP_DIR"
echo ""

# Move all CSV files
echo "1. Removing CSV files..."
find . -maxdepth 1 -name "*.csv" -exec mv {} "$BACKUP_DIR/" \; 2>/dev/null
echo "  ✅ Moved all CSV files"

# Move all SQL files  
echo "2. Removing SQL files..."
find . -maxdepth 1 -name "*.sql" -exec mv {} "$BACKUP_DIR/" \; 2>/dev/null
echo "  ✅ Moved all SQL files"

# Move all Python scripts (except important ones)
echo "3. Removing Python utility scripts..."
find . -maxdepth 1 -name "*.py" \
  ! -name "migrate_nested_plan.py" \
  -exec mv {} "$BACKUP_DIR/" \; 2>/dev/null
echo "  ✅ Moved Python scripts"

# Keep only essential shell scripts
echo "4. Cleaning up shell scripts..."
find . -maxdepth 1 -name "*.sh" \
  ! -name "deploy.sh" \
  ! -name "deploy-to-staging.sh" \
  ! -name "deploy-to-production.sh" \
  ! -name "rollback-production.sh" \
  ! -name "dev-local.sh" \
  ! -name "dev-staging.sh" \
  ! -name "dev-production.sh" \
  ! -name "cleanup*.sh" \
  ! -name "final-cleanup.sh" \
  -exec mv {} "$BACKUP_DIR/" \; 2>/dev/null
echo "  ✅ Cleaned shell scripts"

echo ""
echo "✅ COMPLETE!"
echo "==========="
echo "Backed up: $BACKUP_DIR"
echo "Your folder is now VERY clean!"

