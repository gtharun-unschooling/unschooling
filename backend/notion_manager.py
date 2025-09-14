#!/usr/bin/env python3
"""
Notion Business Manager
Simple CLI tool to manage your company data in Notion
"""

import os
from notion_client import Client
from dotenv import load_dotenv
import json
from datetime import datetime

# Load environment variables
load_dotenv('notion.env')

class NotionBusinessManager:
    def __init__(self):
        self.notion = Client(auth=os.getenv('NOTION_TOKEN'))
        self.sales_db_id = os.getenv('SALES_DATABASE_ID')
        self.customers_db_id = os.getenv('CUSTOMERS_DATABASE_ID')
        self.children_db_id = os.getenv('CHILDREN_DATABASE_ID')
    
    def add_sale(self, customer_name, product, amount, status="Lead", notes=""):
        """Add a new sale to the database"""
        try:
            result = self.notion.pages.create(
                parent={"database_id": self.sales_db_id},
                properties={
                    "Customer Name": {"title": [{"text": {"content": customer_name}}]},
                    "Product": {"select": {"name": product}},
                    "Amount": {"number": amount},
                    "Status": {"select": {"name": status}},
                    "Date": {"date": {"start": datetime.now().isoformat()}},
                    "Notes": {"rich_text": [{"text": {"content": notes}}]}
                }
            )
            print(f"✅ Sale added: {customer_name} - ${amount}")
            return result
        except Exception as e:
            print(f"❌ Error adding sale: {e}")
    
    def add_customer(self, name, email, plan_type="Basic", status="Active"):
        """Add a new customer"""
        try:
            result = self.notion.pages.create(
                parent={"database_id": self.customers_db_id},
                properties={
                    "Customer Name": {"title": [{"text": {"content": name}}]},
                    "Email": {"email": email},
                    "Plan Type": {"select": {"name": plan_type}},
                    "Status": {"select": {"name": status}},
                    "Join Date": {"date": {"start": datetime.now().isoformat()}},
                    "Total Spent": {"number": 0}
                }
            )
            print(f"✅ Customer added: {name}")
            return result
        except Exception as e:
            print(f"❌ Error adding customer: {e}")
    
    def add_child(self, name, parent_name, age, grade, interests, learning_style="Mixed"):
        """Add a new child"""
        try:
            # Convert interests to multi-select format
            interest_options = []
            for interest in interests:
                interest_options.append({"name": interest})
            
            result = self.notion.pages.create(
                parent={"database_id": self.children_db_id},
                properties={
                    "Child Name": {"title": [{"text": {"content": name}}]},
                    "Age": {"number": age},
                    "Grade": {"select": {"name": grade}},
                    "Learning Style": {"select": {"name": learning_style}},
                    "Interests": {"multi_select": interest_options},
                    "Status": {"select": {"name": "Active"}},
                    "Progress": {"number": 0}
                }
            )
            print(f"✅ Child added: {name}")
            return result
        except Exception as e:
            print(f"❌ Error adding child: {e}")
    
    def get_sales_summary(self):
        """Get sales summary"""
        try:
            results = self.notion.databases.query(
                database_id=self.sales_db_id,
                filter={
                    "property": "Status",
                    "select": {"equals": "Closed Won"}
                }
            )
            
            total_revenue = sum(
                page['properties']['Amount']['number'] or 0 
                for page in results['results']
            )
            
            print(f"💰 Total Revenue: ${total_revenue}")
            print(f"📊 Closed Sales: {len(results['results'])}")
            return total_revenue
        except Exception as e:
            print(f"❌ Error getting sales summary: {e}")
    
    def get_customers_summary(self):
        """Get customers summary"""
        try:
            results = self.notion.databases.query(
                database_id=self.customers_db_id,
                filter={
                    "property": "Status",
                    "select": {"equals": "Active"}
                }
            )
            
            print(f"👥 Active Customers: {len(results['results'])}")
            return len(results['results'])
        except Exception as e:
            print(f"❌ Error getting customers summary: {e}")
    
    def get_children_summary(self):
        """Get children summary"""
        try:
            results = self.notion.databases.query(
                database_id=self.children_db_id,
                filter={
                    "property": "Status",
                    "select": {"equals": "Active"}
                }
            )
            
            print(f"👶 Active Children: {len(results['results'])}")
            return len(results['results'])
        except Exception as e:
            print(f"❌ Error getting children summary: {e}")

def main():
    """Interactive CLI"""
    manager = NotionBusinessManager()
    
    while True:
        print("\n🏢 Notion Business Manager")
        print("1. Add Sale")
        print("2. Add Customer")
        print("3. Add Child")
        print("4. View Sales Summary")
        print("5. View Customers Summary")
        print("6. View Children Summary")
        print("7. Exit")
        
        choice = input("\nChoose an option (1-7): ")
        
        if choice == "1":
            customer = input("Customer Name: ")
            product = input("Product (Monthly Plan/Quarterly Plan/Annual Plan/Custom Plan): ")
            amount = float(input("Amount: $"))
            status = input("Status (Lead/Proposal Sent/Negotiating/Closed Won/Closed Lost): ")
            notes = input("Notes (optional): ")
            manager.add_sale(customer, product, amount, status, notes)
        
        elif choice == "2":
            name = input("Customer Name: ")
            email = input("Email: ")
            plan = input("Plan Type (Basic/Premium/Enterprise): ")
            status = input("Status (Active/Trial/Churned/On Hold): ")
            manager.add_customer(name, email, plan, status)
        
        elif choice == "3":
            name = input("Child Name: ")
            parent = input("Parent Name: ")
            age = int(input("Age: "))
            grade = input("Grade (Pre-K/K-2/3-5/6-8/9-12): ")
            interests = input("Interests (comma-separated): ").split(",")
            learning_style = input("Learning Style (Visual/Auditory/Kinesthetic/Mixed): ")
            manager.add_child(name, parent, age, grade, interests, learning_style)
        
        elif choice == "4":
            manager.get_sales_summary()
        
        elif choice == "5":
            manager.get_customers_summary()
        
        elif choice == "6":
            manager.get_children_summary()
        
        elif choice == "7":
            print("👋 Goodbye!")
            break
        
        else:
            print("❌ Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
