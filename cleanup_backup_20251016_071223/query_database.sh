#!/bin/bash

# Script to run queries on GCP Cloud SQL
echo "🔍 Running query on your database..."

# Method 1: Try using gcloud sql connect (if available)
echo "Method 1: Using gcloud sql connect"
if gcloud sql connect unschooling-db --user=postgres --database=unschooling --quiet 2>/dev/null; then
    echo "✅ Connected successfully"
    echo "SELECT topic_name, objective, age, estimated_time FROM niche_topics;" | gcloud sql connect unschooling-db --user=postgres --database=unschooling
else
    echo "❌ gcloud sql connect not available"
fi

echo ""
echo "Method 2: Using Cloud SQL Admin API"
echo "You can also use the Google Cloud Console:"
echo "1. Go to: https://console.cloud.google.com/sql/instances/unschooling-db"
echo "2. Click on 'Open Cloud Shell Editor'"
echo "3. Run: psql 'host=127.0.0.1 port=5432 user=postgres dbname=unschooling'"
echo "4. Then run your query: SELECT topic_name, objective, age, estimated_time FROM niche_topics;"

echo ""
echo "Method 3: Using Cloud Shell"
echo "1. Go to: https://console.cloud.google.com/"
echo "2. Open Cloud Shell (terminal icon in top right)"
echo "3. Run: gcloud sql connect unschooling-db --user=postgres --database=unschooling"
echo "4. Then run your query"

echo ""
echo "Your query is:"
echo "SELECT topic_name, objective, age, estimated_time FROM niche_topics;"
