"""
Google Sheets API Integration for Unschooling Data Management
Handles sync between Google Sheets and PostgreSQL database
"""

import gspread
import json
import asyncio
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging
from google.auth.exceptions import DefaultCredentialsError
from config.settings import settings

logger = logging.getLogger(__name__)

class GoogleSheetsSync:
    """Handle Google Sheets synchronization with PostgreSQL database"""
    
    def __init__(self):
        self.gc = None
        self.sheets_config = {
            "niche_topics": {
                "sheet_id": "YOUR_NICHE_SHEET_ID",  # Replace with actual sheet ID
                "worksheet_name": "Topics",
                "columns": [
                    "topic_id", "topic_name", "objective", "explanation", 
                    "age_min", "age_max", "category", "hashtags", "estimated_time"
                ]
            },
            "essential_growth": {
                "sheet_id": "YOUR_ESSENTIAL_GROWTH_SHEET_ID",  # Replace with actual sheet ID
                "worksheet_name": "Activities", 
                "columns": [
                    "activity_id", "activity_name", "objective", "explanation",
                    "age_group", "pillar", "materials", "steps", "skills"
                ]
            }
        }
    
    async def authenticate(self, service_account_path: Optional[str] = None) -> bool:
        """Authenticate with Google Sheets API"""
        try:
            if service_account_path:
                # Use service account key file
                self.gc = gspread.service_account(filename=service_account_path)
                logger.info("✅ Authenticated with Google Sheets using service account")
            else:
                # Use default credentials (for local development)
                self.gc = gspread.oauth()
                logger.info("✅ Authenticated with Google Sheets using OAuth")
            
            return True
        except DefaultCredentialsError:
            logger.error("❌ Google Sheets authentication failed - no credentials found")
            return False
        except Exception as e:
            logger.error(f"❌ Google Sheets authentication error: {e}")
            return False
    
    async def get_sheet_data(self, sheet_type: str) -> List[Dict[str, Any]]:
        """Get data from specific Google Sheet"""
        if not self.gc:
            logger.error("❌ Not authenticated with Google Sheets")
            return []
        
        try:
            config = self.sheets_config.get(sheet_type)
            if not config:
                logger.error(f"❌ Unknown sheet type: {sheet_type}")
                return []
            
            # Open the spreadsheet
            sheet = self.gc.open_by_key(config["sheet_id"])
            worksheet = sheet.worksheet(config["worksheet_name"])
            
            # Get all records
            records = worksheet.get_all_records()
            
            logger.info(f"✅ Retrieved {len(records)} records from {sheet_type}")
            return records
            
        except Exception as e:
            logger.error(f"❌ Error getting sheet data for {sheet_type}: {e}")
            return []
    
    async def sync_niche_topics(self) -> Dict[str, Any]:
        """Sync niche topics from Google Sheets to database"""
        try:
            # Get data from Google Sheets
            sheet_data = await self.get_sheet_data("niche_topics")
            if not sheet_data:
                return {"success": False, "error": "No data retrieved from Google Sheets"}
            
            # Process and validate data
            processed_data = []
            for row in sheet_data:
                if row.get("topic_name"):  # Skip empty rows
                    processed_data.append({
                        "topic_name": row.get("topic_name"),
                        "objective": row.get("objective"),
                        "explanation": row.get("explanation"),
                        "age_min": int(row.get("age_min", 3)),
                        "age_max": int(row.get("age_max", 18)),
                        "category": row.get("category"),
                        "hashtags": row.get("hashtags", "").split(",") if row.get("hashtags") else [],
                        "estimated_time": row.get("estimated_time"),
                        "source_type": "google_sheets",
                        "source_page": "Topics"
                    })
            
            # TODO: Insert into PostgreSQL database
            # This would connect to your PostgreSQL database and insert the processed_data
            
            return {
                "success": True,
                "records_processed": len(processed_data),
                "data": processed_data[:5]  # Return first 5 for preview
            }
            
        except Exception as e:
            logger.error(f"❌ Error syncing niche topics: {e}")
            return {"success": False, "error": str(e)}
    
    async def sync_essential_growth(self) -> Dict[str, Any]:
        """Sync essential growth activities from Google Sheets to database"""
        try:
            # Get data from Google Sheets
            sheet_data = await self.get_sheet_data("essential_growth")
            if not sheet_data:
                return {"success": False, "error": "No data retrieved from Google Sheets"}
            
            # Process and validate data
            processed_data = []
            for row in sheet_data:
                if row.get("activity_name"):  # Skip empty rows
                    processed_data.append({
                        "activity_name": row.get("activity_name"),
                        "objective": row.get("objective"),
                        "explanation": row.get("explanation"),
                        "age_group": row.get("age_group"),
                        "pillar": row.get("pillar"),
                        "materials": row.get("materials", "").split(",") if row.get("materials") else [],
                        "steps": row.get("steps", "").split("\n") if row.get("steps") else [],
                        "skills": row.get("skills", "").split(",") if row.get("skills") else [],
                        "source_type": "google_sheets",
                        "source_page": "Activities"
                    })
            
            # TODO: Insert into PostgreSQL database
            # This would connect to your PostgreSQL database and insert the processed_data
            
            return {
                "success": True,
                "records_processed": len(processed_data),
                "data": processed_data[:5]  # Return first 5 for preview
            }
            
        except Exception as e:
            logger.error(f"❌ Error syncing essential growth: {e}")
            return {"success": False, "error": str(e)}
    
    async def get_sheet_info(self) -> Dict[str, Any]:
        """Get information about available sheets"""
        if not self.gc:
            return {"error": "Not authenticated"}
        
        try:
            sheet_info = {}
            for sheet_type, config in self.sheets_config.items():
                try:
                    sheet = self.gc.open_by_key(config["sheet_id"])
                    worksheet = sheet.worksheet(config["worksheet_name"])
                    records = worksheet.get_all_records()
                    
                    sheet_info[sheet_type] = {
                        "title": sheet.title,
                        "worksheet": config["worksheet_name"],
                        "record_count": len(records),
                        "columns": list(records[0].keys()) if records else []
                    }
                except Exception as e:
                    sheet_info[sheet_type] = {"error": str(e)}
            
            return sheet_info
            
        except Exception as e:
            return {"error": str(e)}

# Example usage
async def test_google_sheets_sync():
    """Test function to verify Google Sheets integration"""
    sync = GoogleSheetsSync()
    
    # Authenticate
    auth_success = await sync.authenticate()
    if not auth_success:
        print("❌ Authentication failed")
        return
    
    # Get sheet information
    print("📊 Getting sheet information...")
    sheet_info = await sync.get_sheet_info()
    print(json.dumps(sheet_info, indent=2))
    
    # Test niche topics sync
    print("\n🔄 Testing niche topics sync...")
    niche_result = await sync.sync_niche_topics()
    print(json.dumps(niche_result, indent=2))
    
    # Test essential growth sync
    print("\n🔄 Testing essential growth sync...")
    growth_result = await sync.sync_essential_growth()
    print(json.dumps(growth_result, indent=2))

if __name__ == "__main__":
    asyncio.run(test_google_sheets_sync())
