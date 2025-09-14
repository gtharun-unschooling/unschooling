#!/usr/bin/env python3
"""
Notion Business Management Setup Script
Helps you create databases and manage your company in Notion
"""

import os
from notion_client import Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('notion.env')

def setup_notion_client():
    """Initialize Notion client with your token"""
    token = os.getenv('NOTION_TOKEN')
    if not token:
        print("❌ Please set your NOTION_TOKEN in .env file")
        print("   Get your token from: https://www.notion.so/my-integrations")
        return None
    
    return Client(auth=token)

def create_sales_database(notion, parent_page_id):
    """Create a sales tracking database"""
    print("📊 Creating Sales Database...")
    
    sales_db = notion.databases.create(
        parent={"page_id": parent_page_id},
        title=[{"type": "text", "text": {"content": "Sales Tracking"}}],
        properties={
            "Customer Name": {"title": {}},
            "Product": {"select": {
                "options": [
                    {"name": "Monthly Plan", "color": "blue"},
                    {"name": "Quarterly Plan", "color": "green"},
                    {"name": "Annual Plan", "color": "purple"},
                    {"name": "Custom Plan", "color": "orange"}
                ]
            }},
            "Amount": {"number": {"format": "currency"}},
            "Status": {"select": {
                "options": [
                    {"name": "Lead", "color": "yellow"},
                    {"name": "Proposal Sent", "color": "blue"},
                    {"name": "Negotiating", "color": "orange"},
                    {"name": "Closed Won", "color": "green"},
                    {"name": "Closed Lost", "color": "red"}
                ]
            }},
            "Date": {"date": {}},
            "Notes": {"rich_text": {}},
            "Child Count": {"number": {}},
            "Revenue": {"formula": {"expression": "prop(\"Amount\")"}}
        }
    )
    
    print(f"✅ Sales database created: {sales_db['id']}")
    return sales_db['id']

def create_customers_database(notion, parent_page_id):
    """Create a customer management database"""
    print("👥 Creating Customers Database...")
    
    customers_db = notion.databases.create(
        parent={"page_id": parent_page_id},
        title=[{"type": "text", "text": {"content": "Customer Management"}}],
        properties={
            "Customer Name": {"title": {}},
            "Email": {"email": {}},
            "Phone": {"phone_number": {}},
            "Plan Type": {"select": {
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
                    {"name": "Churned", "color": "red"},
                    {"name": "On Hold", "color": "gray"}
                ]
            }},
            "Join Date": {"date": {}},
            "Children Count": {"number": {}},
            "Total Spent": {"number": {"format": "currency"}},
            "Last Activity": {"date": {}},
            "Notes": {"rich_text": {}}
        }
    )
    
    print(f"✅ Customers database created: {customers_db['id']}")
    return customers_db['id']

def create_children_database(notion, parent_page_id):
    """Create a children tracking database"""
    print("👶 Creating Children Database...")
    
    children_db = notion.databases.create(
        parent={"page_id": parent_page_id},
        title=[{"type": "text", "text": {"content": "Children Tracking"}}],
        properties={
            "Child Name": {"title": {}},
            "Parent": {"relation": {"database_id": "CUSTOMERS_DB_ID"}},  # Will be updated
            "Age": {"number": {}},
            "Grade": {"select": {
                "options": [
                    {"name": "Pre-K", "color": "pink"},
                    {"name": "K-2", "color": "blue"},
                    {"name": "3-5", "color": "green"},
                    {"name": "6-8", "color": "orange"},
                    {"name": "9-12", "color": "purple"}
                ]
            }},
            "Learning Style": {"select": {
                "options": [
                    {"name": "Visual", "color": "blue"},
                    {"name": "Auditory", "color": "green"},
                    {"name": "Kinesthetic", "color": "orange"},
                    {"name": "Mixed", "color": "purple"}
                ]
            }},
            "Interests": {"multi_select": {
                "options": [
                    {"name": "Science", "color": "blue"},
                    {"name": "Math", "color": "green"},
                    {"name": "Art", "color": "orange"},
                    {"name": "Music", "color": "purple"},
                    {"name": "Sports", "color": "red"},
                    {"name": "Reading", "color": "yellow"}
                ]
            }},
            "Status": {"select": {
                "options": [
                    {"name": "Active", "color": "green"},
                    {"name": "Paused", "color": "yellow"},
                    {"name": "Completed", "color": "blue"},
                    {"name": "Dropped", "color": "red"}
                ]
            }},
            "Progress": {"number": {"format": "percent"}},
            "Last Activity": {"date": {}},
            "Notes": {"rich_text": {}}
        }
    )
    
    print(f"✅ Children database created: {children_db['id']}")
    return children_db['id']

def create_company_dashboard(notion):
    """Create the main company dashboard page"""
    print("🏢 Creating Company Dashboard...")
    
    # Create main dashboard page
    dashboard = notion.pages.create(
        parent={"type": "workspace"},
        properties={
            "title": [{"type": "text", "text": {"content": "Unschooling Company Dashboard"}}]
        },
        children=[
            {
                "type": "heading_1",
                "heading_1": {"rich_text": [{"type": "text", "text": {"content": "📊 Business Overview"}}]}
            },
            {
                "type": "paragraph",
                "paragraph": {"rich_text": [{"type": "text", "text": {"content": "Welcome to your company management dashboard! Use the databases below to track sales, customers, and children."}}]}
            },
            {
                "type": "heading_2",
                "heading_2": {"rich_text": [{"type": "text", "text": {"content": "📈 Key Metrics"}}]}
            },
            {
                "type": "bulleted_list_item",
                "bulleted_list_item": {"rich_text": [{"type": "text", "text": {"content": "Total Revenue: $0"}}]}
            },
            {
                "type": "bulleted_list_item",
                "bulleted_list_item": {"rich_text": [{"type": "text", "text": {"content": "Active Customers: 0"}}]}
            },
            {
                "type": "bulleted_list_item",
                "bulleted_list_item": {"rich_text": [{"type": "text", "text": {"content": "Active Children: 0"}}]}
            },
            {
                "type": "bulleted_list_item",
                "bulleted_list_item": {"rich_text": [{"type": "text", "text": {"content": "Conversion Rate: 0%"}}]}
            }
        ]
    )
    
    print(f"✅ Dashboard created: {dashboard['id']}")
    return dashboard['id']

def main():
    """Main setup function"""
    print("🚀 Setting up Notion Business Management System...")
    
    # Initialize Notion client
    notion = setup_notion_client()
    if not notion:
        return
    
    try:
        # Create main dashboard
        dashboard_id = create_company_dashboard(notion)
        
        # Create databases
        sales_db_id = create_sales_database(notion, dashboard_id)
        customers_db_id = create_customers_database(notion, dashboard_id)
        children_db_id = create_children_database(notion, dashboard_id)
        
        print("\n🎉 Setup Complete!")
        print(f"📊 Dashboard ID: {dashboard_id}")
        print(f"💰 Sales DB ID: {sales_db_id}")
        print(f"👥 Customers DB ID: {customers_db_id}")
        print(f"👶 Children DB ID: {children_db_id}")
        
        print("\n📝 Next Steps:")
        print("1. Go to your Notion workspace")
        print("2. Find 'Unschooling Company Dashboard'")
        print("3. Start adding your sales, customers, and children data")
        print("4. Use the databases to track your business metrics")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure your Notion token has the correct permissions")

if __name__ == "__main__":
    main()
