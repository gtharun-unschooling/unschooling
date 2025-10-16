#!/bin/bash

# SAFE FOLDER REORGANIZATION SCRIPT
# This script ONLY moves documentation and scripts
# Does NOT touch any website code (src/, backend/, public/)

set -e

echo "🛡️ SAFE FOLDER REORGANIZATION"
echo "============================="
echo ""
echo "⚠️  This script will:"
echo "  ✅ Move documentation to docs/"
echo "  ✅ Move scripts to scripts/"
echo "  ✅ Move tools to tools/"
echo "  ✅ Remove backup folders"
echo "  ✅ Update package.json paths"
echo "  ❌ NOT touch src/, backend/, or public/"
echo ""
read -p "Proceed? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

# Step 1: Backup package.json
echo "📦 Step 1: Creating backup..."
cp package.json package.json.backup
echo "  ✅ Backed up: package.json.backup"

# Step 2: Create new folder structure
echo ""
echo "📁 Step 2: Creating folder structure..."
mkdir -p scripts/deployment
mkdir -p scripts/development
mkdir -p scripts/utilities
mkdir -p tools
mkdir -p docs/deployment
mkdir -p docs/technical
mkdir -p docs/guides
echo "  ✅ Created: scripts/, tools/, docs/"

# Step 3: Move deployment scripts
echo ""
echo "🚀 Step 3: Moving deployment scripts..."
mv deploy.sh scripts/deployment/ 2>/dev/null || true
mv deploy-to-staging.sh scripts/deployment/ 2>/dev/null || true
mv deploy-to-production.sh scripts/deployment/ 2>/dev/null || true
mv rollback-production.sh scripts/deployment/ 2>/dev/null || true
mv deploy-staging.sh scripts/deployment/ 2>/dev/null || true
mv deploy-production.sh scripts/deployment/ 2>/dev/null || true
echo "  ✅ Moved: deployment scripts"

# Step 4: Move development scripts
echo ""
echo "🔧 Step 4: Moving development scripts..."
mv dev-local.sh scripts/development/ 2>/dev/null || true
mv dev-staging.sh scripts/development/ 2>/dev/null || true
mv dev-production.sh scripts/development/ 2>/dev/null || true
echo "  ✅ Moved: development scripts"

# Step 5: Move utility scripts
echo ""
echo "🛠️ Step 5: Moving utility scripts..."
mv cleanup-temp-files.sh scripts/utilities/ 2>/dev/null || true
mv cleanup-aggressive.sh scripts/utilities/ 2>/dev/null || true
mv cleanup-final-js.sh scripts/utilities/ 2>/dev/null || true
mv final-cleanup.sh scripts/utilities/ 2>/dev/null || true
mv reorganize-safe.sh scripts/utilities/ 2>/dev/null || true
echo "  ✅ Moved: utility scripts"

# Step 6: Move tools
echo ""
echo "🔨 Step 6: Moving tools..."
mv agent_execution_viewer.html tools/ 2>/dev/null || true
mv live_latest_customer.html tools/ 2>/dev/null || true
echo "  ✅ Moved: tools"

# Step 7: Move deployment documentation
echo ""
echo "📚 Step 7: Moving deployment documentation..."
mv DEPLOYMENT_*.md docs/deployment/ 2>/dev/null || true
mv STANDARD_DEPLOYMENT_PROCEDURE.md docs/deployment/ 2>/dev/null || true
mv VERSION_CONTROL_GUIDE.md docs/deployment/ 2>/dev/null || true
mv ACTUAL_GCP_COSTS.md docs/deployment/ 2>/dev/null || true
mv GCP_DEPLOYMENT_WORKFLOW.md docs/deployment/ 2>/dev/null || true
mv MANUAL_DEPLOYMENT_PLAN.md docs/deployment/ 2>/dev/null || true
mv OPTIMIZED_MANUAL_DEPLOYMENT.md docs/deployment/ 2>/dev/null || true
mv PLAN_DATA_STRUCTURE_FIX.md docs/deployment/ 2>/dev/null || true
echo "  ✅ Moved: deployment docs"

# Step 8: Move technical documentation
echo ""
echo "📖 Step 8: Moving technical documentation..."
mv AGENT_*.md docs/technical/ 2>/dev/null || true
mv DATABASE_*.md docs/technical/ 2>/dev/null || true
mv FIREBASE_*.md docs/technical/ 2>/dev/null || true
mv firebase-*.md docs/technical/ 2>/dev/null || true
mv setup-*.md docs/technical/ 2>/dev/null || true
mv oauth-*.md docs/technical/ 2>/dev/null || true
mv NEW_AGENT_IMPLEMENTATION_PLAN.md docs/technical/ 2>/dev/null || true
echo "  ✅ Moved: technical docs"

# Step 9: Move other docs to guides
echo ""
echo "📝 Step 9: Moving guide documentation..."
mv BEST_AUTHENTICATION_SOLUTION.md docs/guides/ 2>/dev/null || true
mv COMPLETE_SOLUTION.md docs/guides/ 2>/dev/null || true
mv CLEANUP_SUMMARY.md docs/guides/ 2>/dev/null || true
mv FINAL_CLEANUP_REPORT.md docs/guides/ 2>/dev/null || true
mv ENTERPRISE_CODE_REVIEW.md docs/guides/ 2>/dev/null || true
echo "  ✅ Moved: guide docs"

# Step 10: Update package.json
echo ""
echo "⚙️ Step 10: Updating package.json paths..."
sed -i.bak 's|"dev:local": "./dev-local.sh"|"dev:local": "./scripts/development/dev-local.sh"|' package.json
sed -i.bak 's|"dev:staging": "./dev-staging.sh"|"dev:staging": "./scripts/development/dev-staging.sh"|' package.json
sed -i.bak 's|"dev:production": "./dev-production.sh"|"dev:production": "./scripts/development/dev-production.sh"|' package.json
sed -i.bak 's|"deploy:staging": "./deploy-staging.sh"|"deploy:staging": "./scripts/deployment/deploy-to-staging.sh"|' package.json
sed -i.bak 's|"deploy:production": "./deploy-cloud-run.sh"|"deploy:production": "./scripts/deployment/deploy-to-production.sh"|' package.json
rm package.json.bak
echo "  ✅ Updated: package.json paths"

# Step 11: Remove backup/temp folders
echo ""
echo "🗑️ Step 11: Removing backup/temp folders..."
rm -rf cleanup_*_backup_* 2>/dev/null || true
rm -rf sheets_env/ 2>/dev/null || true
rm -rf __pycache__/ 2>/dev/null || true
rm -rf ~/ 2>/dev/null || true
echo "  ✅ Removed: backup and temp folders"

# Step 12: Update .gitignore
echo ""
echo "📝 Step 12: Updating .gitignore..."
cat >> .gitignore << GITIGNORE

# Backup folders (should never be in repo)
backup/
backups/
data_backups/
cleanup_*/
*_backup_*/

# Python virtual environments
sheets_env/
.venv/

# Python cache
__pycache__/
*.pyc

# Logs
logs/
*.log

# Temporary files
*.tmp
*.temp

GITIGNORE
echo "  ✅ Updated: .gitignore"

echo ""
echo "✅ REORGANIZATION COMPLETE!"
echo "==========================="
echo ""
echo "📊 Summary:"
echo "  ✅ Created: scripts/, tools/, docs/ folders"
echo "  ✅ Moved: All docs to docs/"
echo "  ✅ Moved: All scripts to scripts/"
echo "  ✅ Moved: All tools to tools/"
echo "  ✅ Removed: Backup folders"
echo "  ✅ Updated: package.json paths"
echo "  ✅ Updated: .gitignore"
echo ""
echo "🧪 Next: Test your website"
echo "  $ npm start"
echo ""
echo "If any issues:"
echo "  $ cp package.json.backup package.json"
echo "  $ git reset --hard HEAD"
echo ""

