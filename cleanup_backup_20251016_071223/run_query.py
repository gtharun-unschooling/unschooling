#!/usr/bin/env python3
"""
Script to run SELECT queries on GCP Cloud SQL using the Cloud SQL Admin API
"""

import os
import json
from google.cloud import sql_v1beta4
from google.oauth2 import service_account

def run_query(query_sql):
    """Run a SELECT query on the Cloud SQL instance"""
    
    # Initialize the Cloud SQL client
    client = sql_v1beta4.SqlInstancesServiceClient()
    
    # Your project and instance details
    project_id = "unschooling-464413"
    instance_id = "unschooling-db"
    database_name = "unschooling"
    
    # Create the request
    request = sql_v1beta4.SqlInstancesExecuteSqlRequest(
        instance=instance_id,
        project=project_id,
        body={
            "sql": query_sql
        }
    )
    
    try:
        # Execute the query
        response = client.execute_sql(request=request)
        
        print("Query executed successfully!")
        print("Response:", response)
        return response
        
    except Exception as e:
        print(f"Error executing query: {e}")
        return None

if __name__ == "__main__":
    # Your query
    query = "SELECT topic_name, objective, age, estimated_time FROM niche_topics;"
    
    print(f"Running query: {query}")
    result = run_query(query)
