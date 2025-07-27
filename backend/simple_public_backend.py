"""
Simple FastAPI backend for Unschooling React application.
This version includes authentication and matches the deployed backend.
"""

from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict, Any, Optional
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Unschooling Backend",
    debug=True,
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication function
def verify_auth(request: Request) -> bool:
    """Verify authentication from request headers or body."""
    # Check for API key in headers
    api_key = request.headers.get("X-API-Key")
    if api_key == "unschooling-api-key-2024":
        return True
    
    # Check for Bearer token
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        if token and len(token) > 10:  # Basic token validation
            return True
    
    # Check for Firebase token in headers
    firebase_token = request.headers.get("X-Firebase-Token")
    if firebase_token and len(firebase_token) > 10:
        return True
    
    # Check for auth token in body (for POST requests)
    if request.method == "POST":
        try:
            body = request.json()
            if body.get("auth_token") or body.get("api_key"):
                return True
        except:
            pass
    
    return False

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Welcome to Unschooling Backend",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "app_name": "Unschooling Backend",
        "debug": True,
        "langgraph_available": True,
        "utils_available": True
    }

@app.post("/api/generate-plan")
async def generate_plan(request: Request):
    """Generate a personalized learning plan based on user profile."""
    
    try:
        # Check authentication
        if not verify_auth(request):
            raise HTTPException(
                status_code=401,
                detail={
                    "message": "Authentication required",
                    "code": "AUTHENTICATION_ERROR",
                    "status_code": 401
                }
            )
        
        # Parse request body
        input_data: Dict[str, Any] = await request.json()
        logger.info(f"📥 Received plan generation request: {input_data}")
        
        # Validate required fields
        if "profile" not in input_data:
            raise HTTPException(status_code=400, detail="Profile is required")
        
        profile = input_data["profile"]
        
        # Generate a simple mock plan for now
        # In the future, this would call your agents
        mock_plan = {
            "child_profile": profile,
            "matched_topics": [
                {
                    "Topic": "Communication Skills",
                    "Niche": "Communication",
                    "Age": "5"
                },
                {
                    "Topic": "Problem Solving",
                    "Niche": "AI",
                    "Age": "5"
                }
            ],
            "weekly_plan": {
                "weeks": [
                    {
                        "week": 1,
                        "days": [
                            {"day": 1, "activity": "Communication game", "duration": "30 min"},
                            {"day": 2, "activity": "AI puzzle", "duration": "45 min"},
                            {"day": 3, "activity": "Story telling", "duration": "30 min"},
                            {"day": 4, "activity": "Problem solving", "duration": "45 min"},
                            {"day": 5, "activity": "Creative expression", "duration": "30 min"}
                        ]
                    }
                ]
            },
            "learning_objectives": [
                "Develop communication skills",
                "Enhance problem-solving abilities"
            ],
            "recommended_activities": [
                "Interactive storytelling",
                "Puzzle solving games",
                "Role-playing activities"
            ],
            "progress_tracking": {
                "metrics": ["engagement", "completion", "understanding"],
                "frequency": "weekly"
            }
        }
        
        logger.info("✅ Plan generated successfully")
        
        return {
            "success": True,
            "data": mock_plan,
            "message": "Plan generated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"❌ Error generating plan: {str(exc)}")
        raise HTTPException(status_code=500, detail=str(exc))

@app.get("/api/topics")
async def get_topics():
    """Serve topics data."""
    return {
        "topics": [
            {"Topic": "Communication Skills", "Niche": "Communication", "Age": "5"},
            {"Topic": "Problem Solving", "Niche": "AI", "Age": "5"},
            {"Topic": "Creative Expression", "Niche": "Arts", "Age": "5"}
        ]
    }

@app.get("/api/niches")
async def get_niches():
    """Serve niches data."""
    return {
        "niches": ["Communication", "AI", "Arts", "Science", "Math"]
    }

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "simple_public_backend:app",
        host="0.0.0.0",
        port=8080,
        reload=True
    ) 