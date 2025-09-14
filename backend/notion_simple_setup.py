#!/usr/bin/env python3
"""
Simple Notion Setup - Works with a shared page
"""

import os
from notion_client import Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('notion.env')

def main():
    """Simple setup that works with a shared page"""
    notion = Client(auth=os.getenv('NOTION_TOKEN'))
    
    print("🔍 Searching for accessible pages...")
    
    try:
        # Search for pages
        pages = notion.search(
            query="",
            filter={"property": "object", "value": "page"}
        )
        
        if not pages['results']:
            print("❌ No pages found. Please:")
            print("1. Create a new page in Notion")
            print("2. Click 'Share' on that page")
            print("3. Add your integration with 'Full access'")
            return
        
        print(f"✅ Found {len(pages['results'])} accessible pages:")
        for i, page in enumerate(pages['results']):
            title = page['properties'].get('title', {}).get('title', [{}])[0].get('text', {}).get('content', 'Untitled')
            print(f"  {i+1}. {title} (ID: {page['id']})")
        
        # Use the first page
        parent_page_id = pages['results'][0]['id']
        print(f"\n🏢 Using page: {parent_page_id}")
        
        # Create a simple database
        print("📊 Creating Sales Database...")
        sales_db = notion.databases.create(
            parent={"page_id": parent_page_id},
            title=[{"type": "text", "text": {"content": "Sales Tracking"}}],
            properties={
                "Customer": {"title": {}},
                "Amount": {"number": {"format": "dollar"}},
                "Status": {"select": {
                    "options": [
                        {"name": "Lead", "color": "yellow"},
                        {"name": "Closed Won", "color": "green"},
                        {"name": "Closed Lost", "color": "red"}
                    ]
                }},
                "Date": {"date": {}}
            }
        )
        
        print(f"✅ Sales database created: {sales_db['id']}")
        
        # Create customers database
        print("👥 Creating Customers Database...")
        customers_db = notion.databases.create(
            parent={"page_id": parent_page_id},
            title=[{"type": "text", "text": {"content": "Customers"}}],
            properties={
                "Name": {"title": {}},
                "Email": {"email": {}},
                "Plan": {"select": {
                    "options": [
                        {"name": "Basic", "color": "blue"},
                        {"name": "Premium", "color": "green"},
                        {"name": "Enterprise", "color": "purple"}
                    ]
                }},
                "Status": {"select": {
                    "options": [
                        {"name": "Active", "color": "green"},
                        {"name": "Trial", "color": "yellow"},
                        {"name": "Churned", "color": "red"}
                    ]
                }}
            }
        )
        
        print(f"✅ Customers database created: {customers_db['id']}")
        
        print("\n🎉 Setup Complete!")
        print("Go to your Notion page to see the new databases!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nMake sure you've shared a specific page with your integration.")

if __name__ == "__main__":
    main()
