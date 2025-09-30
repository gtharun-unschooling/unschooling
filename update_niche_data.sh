#!/bin/bash

echo "🔄 UPDATING NICHE DATA SOURCE"
echo "=============================="

# Check if src/data/nichesdata.json exists
if [ ! -f "src/data/nichesdata.json" ]; then
    echo "❌ Source file not found: src/data/nichesdata.json"
    exit 1
fi

# Create backup of current public file
if [ -f "public/nichesdata.json" ]; then
    cp public/nichesdata.json public/nichesdata_backup_$(date +%Y%m%d_%H%M%S).json
    echo "💾 Backup created with timestamp"
fi

# Copy source to public
cp src/data/nichesdata.json public/nichesdata.json
echo "✅ Data synced from src/data/nichesdata.json to public/nichesdata.json"

# Count niches
NICHE_COUNT=$(python3 -c "import json; data=json.load(open('public/nichesdata.json')); print(len(data))")
echo "📊 Total niches: $NICHE_COUNT"

echo "🎉 Update completed!"
