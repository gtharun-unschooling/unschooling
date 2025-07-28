"""
Simple FastAPI backend for testing deployment.
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Welcome to Unschooling Backend - Agent System Active v4",
        "status": "healthy",
        "version": "1.0.0",
        "agents": "enabled",
        "deployment": "simple_test"
    }

@app.get("/health")
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "app_name": "Unschooling Backend",
        "debug": True
    }

@app.post("/api/generate-plan")
async def generate_plan(request: Request):
    """Generate a personalized learning plan based on user profile."""
    
    try:
        # Get the request body
        body = await request.json()
        profile = body.get("profile", {})
        
        # Simple mock response for testing
        return {
            "success": True,
            "data": {
                "child_profile": profile,
                "matched_topics": [
                    {
                        "Topic": "AI Basics",
                        "Niche": "AI",
                        "Age": str(profile.get("child_age", 7))
                    },
                    {
                        "Topic": "Problem Solving",
                        "Niche": "AI", 
                        "Age": str(profile.get("child_age", 7))
                    }
                ],
                "weekly_plan": {
                    "weeks": [
                        {
                            "week": 1,
                            "days": [
                                {
                                    "day": 1,
                                    "activity": "AI Basics Game",
                                    "duration": "30 min"
                                },
                                {
                                    "day": 2,
                                    "activity": "Problem Solving Puzzle",
                                    "duration": "45 min"
                                }
                            ]
                        }
                    ]
                },
                "learning_objectives": [
                    "Develop AI skills",
                    "Enhance problem-solving abilities"
                ],
                "recommended_activities": [
                    "Interactive AI games",
                    "Puzzle solving"
                ],
                "progress_tracking": {
                    "metrics": ["engagement", "completion", "understanding"],
                    "frequency": "weekly"
                }
            },
            "message": "Plan generated successfully (Simple Test)"
        }
        
    except Exception as exc:
        logger.error(f"❌ Error generating plan: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Internal server error",
                "message": str(exc)
            }
        ) 