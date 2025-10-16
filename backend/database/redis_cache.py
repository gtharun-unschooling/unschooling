"""
Redis Cache Module for Version 2
Provides caching layer for improved performance
"""

import os
import json
import asyncio
import redis.asyncio as redis
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger(__name__)

class RedisCache:
    """Redis cache manager for Version 2"""
    
    def __init__(self):
        # Memorystore Redis connection details
        self.host = "10.200.59.219"  # unschooling-cache IP
        self.port = 6379
        self.db = 0
        self.redis_client = None
    
    async def connect(self):
        """Initialize Redis connection"""
        try:
            self.redis_client = redis.Redis(
                host=self.host,
                port=self.port,
                db=self.db,
                decode_responses=True
            )
            # Test connection
            await self.redis_client.ping()
            logger.info("✅ Redis connection established successfully")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to connect to Redis: {e}")
            return False
    
    async def close(self):
        """Close Redis connection"""
        if self.redis_client:
            await self.redis_client.close()
            logger.info("✅ Redis connection closed")
    
    # Cache operations
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            if not self.redis_client:
                return None
            
            value = await self.redis_client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logger.error(f"❌ Error getting cache key {key}: {e}")
            return None
    
    async def set(self, key: str, value: Any, ttl: int = 3600) -> bool:
        """Set value in cache with TTL"""
        try:
            if not self.redis_client:
                return False
            
            serialized_value = json.dumps(value)
            await self.redis_client.setex(key, ttl, serialized_value)
            return True
        except Exception as e:
            logger.error(f"❌ Error setting cache key {key}: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from cache"""
        try:
            if not self.redis_client:
                return False
            
            result = await self.redis_client.delete(key)
            return result > 0
        except Exception as e:
            logger.error(f"❌ Error deleting cache key {key}: {e}")
            return False
    
    # Specific cache methods for the application
    async def get_topics(self, niche: str, age: int) -> Optional[List[Dict[str, Any]]]:
        """Get cached topics for niche and age"""
        cache_key = f"topics:{niche}:{age}"
        return await self.get(cache_key)
    
    async def set_topics(self, niche: str, age: int, topics: List[Dict[str, Any]], ttl: int = 3600) -> bool:
        """Cache topics for niche and age"""
        cache_key = f"topics:{niche}:{age}"
        return await self.set(cache_key, topics, ttl)
    
    async def get_learning_plan(self, child_id: str, month: str, year: int) -> Optional[Dict[str, Any]]:
        """Get cached learning plan"""
        cache_key = f"plan:{child_id}:{month}:{year}"
        return await self.get(cache_key)
    
    async def set_learning_plan(self, child_id: str, month: str, year: int, plan: Dict[str, Any], ttl: int = 86400) -> bool:
        """Cache learning plan"""
        cache_key = f"plan:{child_id}:{month}:{year}"
        return await self.set(cache_key, plan, ttl)
    
    async def get_user_session(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get cached user session"""
        cache_key = f"session:{user_id}"
        return await self.get(cache_key)
    
    async def set_user_session(self, user_id: str, session_data: Dict[str, Any], ttl: int = 3600) -> bool:
        """Cache user session"""
        cache_key = f"session:{user_id}"
        return await self.set(cache_key, session_data, ttl)
    
    async def invalidate_user_cache(self, user_id: str) -> bool:
        """Invalidate all cache entries for a user"""
        try:
            if not self.redis_client:
                return False
            
            # Get all keys matching user pattern
            pattern = f"*{user_id}*"
            keys = await self.redis_client.keys(pattern)
            
            if keys:
                await self.redis_client.delete(*keys)
                logger.info(f"✅ Invalidated {len(keys)} cache entries for user {user_id}")
            
            return True
        except Exception as e:
            logger.error(f"❌ Error invalidating cache for user {user_id}: {e}")
            return False

# Global cache instance
cache = RedisCache()

# Initialize cache connection
async def init_cache():
    """Initialize cache connection"""
    return await cache.connect()

# Close cache connection
async def close_cache():
    """Close cache connection"""
    await cache.close()

