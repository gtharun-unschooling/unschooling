#!/bin/bash

# Cleanup Temporary Files Script
# Removes temporary files, screenshots, and old scripts

echo "🧹 CLEANUP: Removing Temporary Files"
echo "====================================="
echo ""

# Create backup directory first
BACKUP_DIR="./cleanup_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Creating backup at: $BACKUP_DIR"
echo ""

# Function to move files
move_to_backup() {
    if [ -f "$1" ]; then
        mv "$1" "$BACKUP_DIR/"
        echo "  ✅ Moved: $1"
    fi
}

# Function to delete files
delete_file() {
    if [ -f "$1" ]; then
        rm "$1"
        echo "  ❌ Deleted: $1"
    fi
}

echo "Category 1: Screenshot/PNG Files (Testing images)"
echo "------------------------------------------------"
# Delete all PNG screenshots (clearly temporary testing files)
for file in *.png; do
    [ -f "$file" ] && delete_file "$file"
done

echo ""
echo "Category 2: CSV Backup Files (Old data backups)"
echo "------------------------------------------------"
# Delete old CSV backups with timestamps
delete_file "essential-growth-activities-backup-*.csv"
delete_file "enhanced_cognitive_skills.csv"
delete_file "essential-growth-activities-comprehensive.csv"
delete_file "essential-growth-activities-enhanced*.csv"
delete_file "essential-growth-activities-metadata*.csv"
delete_file "essential-growth-activities-sample-15.csv"
delete_file "niche_data_Sample_1_Activities.csv"
delete_file "sheet_data_*.csv"

echo ""
echo "Category 3: Temporary Python Scripts (One-off utilities)"
echo "--------------------------------------------------------"
# Delete check/fix/update scripts (one-off data manipulation)
for script in check_*.py fix_*.py update_*.py add_*.py analyze_*.py complete_*.py comprehensive_*.py enhance_*.py fill_*.py; do
    [ -f "$script" ] && move_to_backup "$script"
done

# Delete other temporary scripts
move_to_backup "access_google_sheets.py"
move_to_backup "access_sample_1.py"
move_to_backup "attempt_recovery.py"
move_to_backup "audit_*.py"
move_to_backup "batch_*.py"
move_to_backup "bidirectional_sync.py"
move_to_backup "clean_*.py"
move_to_backup "cleanup_*.py"
move_to_backup "color_code_*.py"
move_to_backup "column_standards_definition.py"
move_to_backup "compare_*.py"
move_to_backup "conservative_*.py"
move_to_backup "create_*.py"
move_to_backup "delete_*.py"
move_to_backup "demonstrate_*.py"
move_to_backup "detailed_*.py"
move_to_backup "divide_*.py"
move_to_backup "explore_*.py"
move_to_backup "extract_*.py"
move_to_backup "final_*.py"
move_to_backup "find_*.py"
move_to_backup "force_*.py"
move_to_backup "format_*.py"
move_to_backup "get_latest_customer.py"
move_to_backup "history_*.py"
move_to_backup "identify_*.py"
move_to_backup "improve_*.py"
move_to_backup "interactive_session.py"
move_to_backup "make_*.py"
move_to_backup "manual_upload_instructions.md"
move_to_backup "migrate_*.py"
move_to_backup "move_*.py"
move_to_backup "perfect_*.py"
move_to_backup "query_*.py"
move_to_backup "read_niche*.py"
move_to_backup "real_customer.py"
move_to_backup "recheck_*.py"
move_to_backup "remove_*.py"
move_to_backup "reorder_*.py"
move_to_backup "reorganize_*.py"
move_to_backup "replace_*.py"
move_to_backup "restore_*.py"
move_to_backup "rewrite_*.py"
move_to_backup "robust_*.py"
move_to_backup "run_query.py"
move_to_backup "show_*.py"
move_to_backup "simple_*.py"
move_to_backup "standardize_*.py"
move_to_backup "strategic_*.py"
move_to_backup "sync_*.py"
move_to_backup "test_*.py"
move_to_backup "thorough_*.py"
move_to_backup "undo_*.py"
move_to_backup "upload_*.py"
move_to_backup "validate_*.py"
move_to_backup "verify_*.py"

echo ""
echo "Category 4: Old/Redundant Deployment Scripts"
echo "--------------------------------------------"
# Keep new ones, remove old ones
move_to_backup "deploy-cloud-run.sh"  # Replaced by deploy.sh
move_to_backup "deploy-now-manual.sh"  # Replaced by deploy.sh
move_to_backup "deploy-v1.sh"  # Old version
move_to_backup "deploy_analysis_fix.sh"  # Temporary
move_to_backup "quick-deploy.sh"  # Replaced by deploy.sh
move_to_backup "setup-automated-deployment.sh"  # Not used
move_to_backup "setup-dev-environment.sh"  # Not used
move_to_backup "setup-github-actions.sh"  # Not used
move_to_backup "start-local-unified.sh"  # Not used

echo ""
echo "Category 5: Old HTML/Debug Files"
echo "--------------------------------"
move_to_backup "test-dropdown.html"
move_to_backup "view_logs.html"
move_to_backup "agent_full_details_*.html"
move_to_backup "agent_full_json_*.html"
move_to_backup "agent_report_*.html"
move_to_backup "latest_customer.sh"

# Keep these (useful):
# - agent_execution_viewer.html (useful tool)
# - live_latest_customer.html (useful tool)

echo ""
echo "Category 6: Old Shell Scripts (Data/Query)"
echo "------------------------------------------"
move_to_backup "create_full_json_viewer.sh"
move_to_backup "export_*.sh"
move_to_backup "generate_agent_report.sh"
move_to_backup "query_database.sh"
move_to_backup "setup_database_automated.sh"
move_to_backup "test_agents_detailed.sh"
move_to_backup "update_niche_data.sh"
move_to_backup "view_agent_logs.sh"

echo ""
echo "Category 7: Old/Redundant Documentation"
echo "---------------------------------------"
# Keep new deployment docs, remove old/redundant ones
move_to_backup "DEPLOY_NOW.md"  # Replaced
move_to_backup "DEPLOY_TO_PRODUCTION.md"  # Replaced
move_to_backup "DEPLOYMENT_GUIDE.md"  # Replaced by new ones
move_to_backup "DEPLOYMENT_READY_SUMMARY.md"  # Old
move_to_backup "DEPLOYMENT_SUCCESS_REPORT.md"  # Old
move_to_backup "DEPLOYMENT_VERIFICATION.md"  # Old
move_to_backup "automated-deployment-guide.md"  # Old
move_to_backup "ENTERPRISE_DEPLOYMENT_GUIDE.md"  # Not needed

# Activity/data creation docs (move to backup - not deployment related)
move_to_backup "activity_creation_instructions.md"
move_to_backup "ACTIVITY_CREATION_STRATEGY.md"
move_to_backup "COMPREHENSIVE_ACTIVITY_CREATION_GUIDELINES.md"
move_to_backup "COMPREHENSIVE_ACTIVITY_TYPES_SUMMARY.md"
move_to_backup "COMPREHENSIVE_PILLAR_STRUCTURE.md"
move_to_backup "cognitive_skills_enhancement_plan.md"
move_to_backup "cognitive_skills_strategy_framework.py"
move_to_backup "hero-section-image-analysis.md"

# Analysis/debug docs (move to backup)
move_to_backup "ACTUAL_BILLING_ANALYSIS_7_DAYS.md"
move_to_backup "ANALYSIS_AGENT_DEBUG_GUIDE.md"
move_to_backup "ANALYSIS_AGENT_IMPLEMENTATION.md"
move_to_backup "BILLING_INVESTIGATION_GUIDE.md"
move_to_backup "CLEANUP_GUIDE.md"
move_to_backup "COLUMN_COMPLETENESS_ANALYSIS.md"
move_to_backup "CONNECTION_FIX_SUMMARY.md"
move_to_backup "CORRECT_DATA_STRUCTURE_ANALYSIS.md"
move_to_backup "CORRECTED_AGE_STRUCTURE.md"
move_to_backup "CORRECTED_LAYOUT_SUMMARY.md"
move_to_backup "CORRECTED_METADATA_TABLES.md"
move_to_backup "CRITICAL_FIX_NEEDED.md"
move_to_backup "CURRENT_GCP_STATUS_ANALYSIS.md"
move_to_backup "CURRENT_vs_MISSING_DATA_SHOWCASE.md"
move_to_backup "CUSTOM_LAYOUT_SUMMARY.md"
move_to_backup "CUSTOMER_BUG_FIX.md"
move_to_backup "DATA_ANALYSIS_AND_SCHEMA_DESIGN.md"
move_to_backup "DATA_EDITING_WORKFLOW_GUIDE.md"
move_to_backup "DATA_QUALITY_ANALYSIS_GUIDE.md"
move_to_backup "DATA_QUALITY_ASSESSMENT_REPORT.md"
move_to_backup "DATA_STRUCTURE_SUMMARY.md"
move_to_backup "EASY_DATABASE_ACCESS.md"
move_to_backup "ENTERPRISE_DATA_MANAGEMENT_STRATEGY.md"
move_to_backup "ENTERPRISE_DATABASE_ARCHITECTURE.md"

# Old SQL files
move_to_backup "analyze_database_data.sql"
move_to_backup "check_column_completeness.sql"
move_to_backup "check_missing_data.sql"
move_to_backup "comprehensive_data_quality_analysis.sql"
move_to_backup "create_staging_database.sql"
move_to_backup "database_content_comparison.sql"
move_to_backup "database_schema.sql"
move_to_backup "database_schema_with_sample_data.sql"
move_to_backup "enhanced_sample_data.sql"

echo ""
echo "✅ CLEANUP COMPLETE!"
echo "==================="
echo ""
echo "📊 Summary:"
echo "  Deleted: All PNG screenshots"
echo "  Deleted: All CSV backups"
echo "  Moved to backup: Python utility scripts"
echo "  Moved to backup: Old documentation"
echo "  Moved to backup: Old shell scripts"
echo ""
echo "📦 Backup location: $BACKUP_DIR"
echo "   (You can delete this folder later if you don't need it)"
echo ""
echo "✅ Kept (Important files):"
echo "  - All new deployment docs and scripts"
echo "  - CHANGELOG.md, DEPLOYMENT_LOG.md, CURRENT_VERSION.txt"
echo "  - agent_execution_viewer.html"
echo "  - live_latest_customer.html"
echo "  - src/, public/, backend/ (your code)"
echo ""

