"""
PostgreSQL Database Connection Module for Version 2
Replaces Firestore with PostgreSQL for better performance and cost efficiency
"""

import os
import asyncio
import asyncpg
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger(__name__)

class PostgreSQLDatabase:
    """PostgreSQL database connection manager for Version 2"""
    
    def __init__(self):
        # Cloud SQL connection details
        self.host = "104.197.28.111"  # unschooling-db IP
        self.port = 5432
        self.database = "unschooling"
        self.user = "app-user"
        self.password = "unschooling2024!"
        self.connection_string = f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"
        self.pool = None
    
    async def connect(self):
        """Initialize database connection pool"""
        try:
            self.pool = await asyncpg.create_pool(
                self.connection_string,
                min_size=1,
                max_size=10,
                command_timeout=60
            )
            logger.info("✅ PostgreSQL connection pool created successfully")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to create PostgreSQL connection pool: {e}")
            return False
    
    async def close(self):
        """Close database connection pool"""
        if self.pool:
            await self.pool.close()
            logger.info("✅ PostgreSQL connection pool closed")
    
    # User operations
    async def create_user(self, user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new user"""
        try:
            async with self.pool.acquire() as conn:
                result = await conn.fetchrow(
                    """
                    INSERT INTO users (email, name, google_id)
                    VALUES ($1, $2, $3)
                    RETURNING *
                    """,
                    user_data.get('email'),
                    user_data.get('name'),
                    user_data.get('google_id')
                )
                return dict(result) if result else None
        except Exception as e:
            logger.error(f"❌ Error creating user: {e}")
            return None
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        try:
            async with self.pool.acquire() as conn:
                result = await conn.fetchrow(
                    "SELECT * FROM users WHERE email = $1",
                    email
                )
                return dict(result) if result else None
        except Exception as e:
            logger.error(f"❌ Error getting user by email: {e}")
            return None
    
    # Children operations
    async def create_child(self, user_id: str, child_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new child profile"""
        try:
            async with self.pool.acquire() as conn:
                result = await conn.fetchrow(
                    """
                    INSERT INTO children (user_id, name, age, interests, learning_style)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *
                    """,
                    user_id,
                    child_data.get('name'),
                    child_data.get('age'),
                    child_data.get('interests', []),
                    child_data.get('learning_style')
                )
                return dict(result) if result else None
        except Exception as e:
            logger.error(f"❌ Error creating child: {e}")
            return None
    
    async def get_children_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all children for a user"""
        try:
            async with self.pool.acquire() as conn:
                results = await conn.fetch(
                    "SELECT * FROM children WHERE user_id = $1 ORDER BY created_at",
                    user_id
                )
                return [dict(row) for row in results]
        except Exception as e:
            logger.error(f"❌ Error getting children: {e}")
            return []
    
    # Learning plans operations
    async def create_learning_plan(self, child_id: str, plan_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new learning plan"""
        try:
            async with self.pool.acquire() as conn:
                result = await conn.fetchrow(
                    """
                    INSERT INTO learning_plans (child_id, month, year, plan_data, agent_performance)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *
                    """,
                    child_id,
                    plan_data.get('month'),
                    plan_data.get('year'),
                    plan_data.get('plan_data'),
                    plan_data.get('agent_performance')
                )
                return dict(result) if result else None
        except Exception as e:
            logger.error(f"❌ Error creating learning plan: {e}")
            return None
    
    async def get_learning_plans_by_child(self, child_id: str) -> List[Dict[str, Any]]:
        """Get all learning plans for a child"""
        try:
            async with self.pool.acquire() as conn:
                results = await conn.fetch(
                    "SELECT * FROM learning_plans WHERE child_id = $1 ORDER BY created_at DESC",
                    child_id
                )
                return [dict(row) for row in results]
        except Exception as e:
            logger.error(f"❌ Error getting learning plans: {e}")
            return []
    
    # Topics operations (for migration from JSON files)
    async def create_topic(self, topic_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new topic"""
        try:
            async with self.pool.acquire() as conn:
                result = await conn.fetchrow(
                    """
                    INSERT INTO topics (title, description, age_group, niche, growth_pillar, 
                                      objective, explanation, estimated_time, hashtags,
                                      activity1_title, activity1_description,
                                      activity2_title, activity2_description)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                    RETURNING *
                    """,
                    topic_data.get('title'),
                    topic_data.get('description'),
                    topic_data.get('age_group'),
                    topic_data.get('niche'),
                    topic_data.get('growth_pillar'),
                    topic_data.get('objective'),
                    topic_data.get('explanation'),
                    topic_data.get('estimated_time'),
                    topic_data.get('hashtags'),
                    topic_data.get('activity1_title'),
                    topic_data.get('activity1_description'),
                    topic_data.get('activity2_title'),
                    topic_data.get('activity2_description')
                )
                return dict(result) if result else None
        except Exception as e:
            logger.error(f"❌ Error creating topic: {e}")
            return None
    
    async def get_topics_by_age_and_niche(self, age: int, niche: str) -> List[Dict[str, Any]]:
        """Get topics by age and niche"""
        try:
            async with self.pool.acquire() as conn:
                results = await conn.fetch(
                    """
                    SELECT * FROM topics 
                    WHERE age_group = $1 AND niche = $2 
                    ORDER BY title
                    """,
                    age, niche
                )
                return [dict(row) for row in results]
        except Exception as e:
            logger.error(f"❌ Error getting topics: {e}")
            return []

# Global database instance
db = PostgreSQLDatabase()

# Initialize database connection
async def init_database():
    """Initialize database connection"""
    return await db.connect()

# Close database connection
async def close_database():
    """Close database connection"""
    await db.close()

