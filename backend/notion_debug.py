#!/usr/bin/env python3
"""
Debug Notion Integration Access
"""

import os
from notion_client import Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('notion.env')

def debug_notion_access():
    """Debug Notion integration access"""
    notion = Client(auth=os.getenv('NOTION_TOKEN'))
    
    print("🔍 Debugging Notion Integration Access...")
    print(f"Token: {os.getenv('NOTION_TOKEN')[:20]}...")
    
    try:
        # Test 1: Basic search
        print("\n1. Testing basic search...")
        search_result = notion.search()
        print(f"   Results: {len(search_result['results'])} items found")
        
        # Test 2: Search for pages only
        print("\n2. Testing page search...")
        page_search = notion.search(filter={"property": "object", "value": "page"})
        print(f"   Pages: {len(page_search['results'])} found")
        
        # Test 3: Search for databases only
        print("\n3. Testing database search...")
        db_search = notion.search(filter={"property": "object", "value": "database"})
        print(f"   Databases: {len(db_search['results'])} found")
        
        # Test 4: Try to get user info
        print("\n4. Testing user access...")
        try:
            user = notion.users.me()
            print(f"   User: {user.get('name', 'Unknown')}")
        except Exception as e:
            print(f"   User access error: {e}")
        
        # Test 5: List all accessible content
        print("\n5. All accessible content:")
        if search_result['results']:
            for i, item in enumerate(search_result['results']):
                item_type = item.get('object', 'unknown')
                if item_type == 'page':
                    title = item.get('properties', {}).get('title', {}).get('title', [{}])[0].get('text', {}).get('content', 'Untitled')
                elif item_type == 'database':
                    title = item.get('title', [{}])[0].get('text', {}).get('content', 'Untitled Database')
                else:
                    title = 'Unknown'
                print(f"   {i+1}. {item_type}: {title}")
        else:
            print("   No accessible content found")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_notion_access()
