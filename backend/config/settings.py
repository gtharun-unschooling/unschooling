"""
Configuration settings for the Unschooling React application.
Handles environment variables, API configurations, and application settings.
"""

import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    """Application settings with environment variable support."""
    
    # Application Settings
    APP_NAME: str = "Unschooling React"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Frontend URL
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # Firebase Configuration
    FIREBASE_API_KEY: str = os.getenv("FIREBASE_API_KEY", "AIzaSyBX2bZmOUosU-2PXZFQVN_WLLuee_zkFzI")
    FIREBASE_AUTH_DOMAIN: str = os.getenv("FIREBASE_AUTH_DOMAIN", "unschooling-464413.firebaseapp.com")
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "unschooling-464413")
    FIREBASE_STORAGE_BUCKET: str = os.getenv("FIREBASE_STORAGE_BUCKET", "unschooling-464413.firebasestorage.app")
    FIREBASE_MESSAGING_SENDER_ID: str = os.getenv("FIREBASE_MESSAGING_SENDER_ID", "790275794964")
    FIREBASE_APP_ID: str = os.getenv("FIREBASE_APP_ID", "1:790275794964:web:f981a7f0693cc186631f01")
    
    # Google Cloud Configuration
    GOOGLE_CLOUD_PROJECT: str = os.getenv("GOOGLE_CLOUD_PROJECT", "unschooling-464413")
    GOOGLE_CLOUD_REGION: str = os.getenv("GOOGLE_CLOUD_REGION", "us-central1")
    
    # Vertex AI Configuration
    VERTEX_AI_PROJECT_ID: str = os.getenv("VERTEX_AI_PROJECT_ID", "unschooling-464413")
    VERTEX_AI_LOCATION: str = os.getenv("VERTEX_AI_LOCATION", "us-central1")
    VERTEX_AI_INDEX_ID: str = os.getenv("VERTEX_AI_INDEX_ID", "unschooling_embeddings_index")
    VERTEX_AI_INDEX_ENDPOINT_ID: str = os.getenv("VERTEX_AI_INDEX_ENDPOINT_ID", "unschooling_embeddings_endpoint")
    
    # API Configuration
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    
    # CORS Configuration
    ALLOWED_ORIGINS: list = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
    
    # Database Configuration
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    
    # Security Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    
    @classmethod
    def get_firebase_config(cls) -> dict:
        """Get Firebase configuration dictionary."""
        return {
            "apiKey": cls.FIREBASE_API_KEY,
            "authDomain": cls.FIREBASE_AUTH_DOMAIN,
            "projectId": cls.FIREBASE_PROJECT_ID,
            "storageBucket": cls.FIREBASE_STORAGE_BUCKET,
            "messagingSenderId": cls.FIREBASE_MESSAGING_SENDER_ID,
            "appId": cls.FIREBASE_APP_ID
        }
    
    @classmethod
    def validate_config(cls) -> bool:
        """Validate that all required configuration is present."""
        required_fields = [
            cls.FIREBASE_API_KEY,
            cls.FIREBASE_PROJECT_ID,
            cls.GOOGLE_CLOUD_PROJECT,
            cls.VERTEX_AI_PROJECT_ID
        ]
        
        missing_fields = [field for field in required_fields if not field]
        
        if missing_fields:
            print(f"❌ Missing required configuration: {missing_fields}")
            return False
        
        print("✅ Configuration validation passed")
        return True

# Global settings instance
settings = Settings() 