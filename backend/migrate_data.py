"""
Data Migration Script - Version 2
Migrates data from JSON files to PostgreSQL database
"""

import asyncio
import json
import os
import logging
from typing import Dict, Any, List
from database.postgresql import db
from database.redis_cache import cache

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def migrate_topics_data():
    """Migrate topics data from JSON to PostgreSQL"""
    try:
        topics_file = "data/topicsdata.json"
        logger.info(f"📁 Migrating topics from {topics_file}")
        
        if not os.path.exists(topics_file):
            logger.error(f"❌ Topics file not found: {topics_file}")
            return False
        
        with open(topics_file, "r", encoding='utf-8') as f:
            topics = json.load(f)
        
        logger.info(f"📊 Found {len(topics)} topics to migrate")
        
        migrated_count = 0
        for topic in topics:
            try:
                # Convert topic to PostgreSQL format
                topic_data = {
                    'title': topic.get('Topic', ''),
                    'description': topic.get('Explanation', ''),
                    'age_group': int(topic.get('Age', 0)) if str(topic.get('Age', 0)).isdigit() else 0,
                    'niche': topic.get('Niche', ''),
                    'growth_pillar': '',  # Will be populated from essential growth data
                    'objective': topic.get('Objective', ''),
                    'explanation': topic.get('Explanation', ''),
                    'estimated_time': topic.get('Estimated Time', '20-30 mins'),
                    'hashtags': topic.get('Hashtags', ''),
                    'activity1_title': topic.get('Activity 1', ''),
                    'activity1_description': '',
                    'activity2_title': topic.get('Activity 2', ''),
                    'activity2_description': ''
                }
                
                result = await db.create_topic(topic_data)
                if result:
                    migrated_count += 1
                    
            except Exception as e:
                logger.error(f"❌ Error migrating topic {topic.get('Topic', 'Unknown')}: {e}")
                continue
        
        logger.info(f"✅ Successfully migrated {migrated_count}/{len(topics)} topics")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error in topics migration: {e}")
        return False

async def migrate_niches_data():
    """Migrate niches data to cache for quick access"""
    try:
        niches_file = "data/nichesdata.json"
        logger.info(f"📁 Migrating niches from {niches_file}")
        
        if not os.path.exists(niches_file):
            logger.error(f"❌ Niches file not found: {niches_file}")
            return False
        
        with open(niches_file, "r", encoding='utf-8') as f:
            niches = json.load(f)
        
        logger.info(f"📊 Found {len(niches)} niches to cache")
        
        # Cache niches data in Redis
        await cache.set("niches_data", niches, ttl=86400)  # 24 hours
        
        logger.info(f"✅ Successfully cached {len(niches)} niches")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error in niches migration: {e}")
        return False

async def migrate_essential_growth_data():
    """Migrate essential growth data to cache"""
    try:
        essential_file = "data/essential-growth/index.json"
        logger.info(f"📁 Migrating essential growth from {essential_file}")
        
        if not os.path.exists(essential_file):
            logger.error(f"❌ Essential growth file not found: {essential_file}")
            return False
        
        with open(essential_file, "r", encoding='utf-8') as f:
            essential_data = json.load(f)
        
        logger.info(f"📊 Found essential growth data to cache")
        
        # Cache essential growth data in Redis
        await cache.set("essential_growth_data", essential_data, ttl=86400)  # 24 hours
        
        logger.info(f"✅ Successfully cached essential growth data")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error in essential growth migration: {e}")
        return False

async def create_database_tables():
    """Create database tables if they don't exist"""
    try:
        logger.info("🏗️ Creating database tables...")
        
        # Connect to database
        await db.connect()
        
        # Create tables using the schema
        schema_file = "database_schema.sql"
        if os.path.exists(schema_file):
            with open(schema_file, "r") as f:
                schema_sql = f.read()
            
            # Execute schema (this would need to be done via psql or similar)
            # For now, we'll assume tables are created manually
            logger.info("✅ Database schema loaded (tables should be created manually)")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Error creating database tables: {e}")
        return False

async def main():
    """Main migration function"""
    logger.info("🚀 Starting Version 2 data migration...")
    
    try:
        # Initialize connections
        logger.info("🔌 Initializing database connections...")
        db_success = await db.connect()
        cache_success = await cache.connect()
        
        if not db_success:
            logger.error("❌ Failed to connect to PostgreSQL")
            return False
        
        if not cache_success:
            logger.error("❌ Failed to connect to Redis")
            return False
        
        # Create database tables
        await create_database_tables()
        
        # Migrate data
        logger.info("📊 Starting data migration...")
        
        # Migrate topics to PostgreSQL
        topics_success = await migrate_topics_data()
        
        # Migrate niches to Redis cache
        niches_success = await migrate_niches_data()
        
        # Migrate essential growth to Redis cache
        essential_success = await migrate_essential_growth_data()
        
        # Summary
        if topics_success and niches_success and essential_success:
            logger.info("🎉 Data migration completed successfully!")
            logger.info("✅ Topics migrated to PostgreSQL")
            logger.info("✅ Niches cached in Redis")
            logger.info("✅ Essential growth data cached in Redis")
            return True
        else:
            logger.error("❌ Data migration completed with errors")
            return False
            
    except Exception as e:
        logger.error(f"❌ Migration failed: {e}")
        return False
    
    finally:
        # Close connections
        await db.close()
        await cache.close()

if __name__ == "__main__":
    asyncio.run(main())

