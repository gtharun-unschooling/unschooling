#!/bin/bash
# Clean up all test JS and temporary HTML files

BACKUP_DIR="./cleanup_final_js_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "🧹 Cleaning test JS and temporary HTML files..."

# Move all test JS files
find . -maxdepth 1 -name "*.js" \
  ! -name "reportWebVitals.js" \
  ! -name "setupTests.js" \
  -exec mv {} "$BACKUP_DIR/" \; 2>/dev/null

# Move temporary HTML files (keep only useful tools)
find . -maxdepth 1 -name "*.html" \
  ! -name "agent_execution_viewer.html" \
  ! -name "live_latest_customer.html" \
  -exec mv {} "$BACKUP_DIR/" \; 2>/dev/null

echo "✅ Complete!"
echo "Backup: $BACKUP_DIR"

