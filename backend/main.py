"""
Main FastAPI application for the Unschooling React backend.
Handles API endpoints, CORS, and error handling.
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from typing import Dict, Any
import logging
import os

# Import local modules
from config.settings import settings
from utils.error_handling import handle_exception, validate_required_fields, safe_execute
from agents.profile_agent import run_profile_agent
from main_graph import flow

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

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info(f"🚀 Starting {settings.APP_NAME}")
    
    # Validate configuration
    if not settings.validate_config():
        logger.error("❌ Configuration validation failed")
        raise RuntimeError("Invalid configuration")
    
    logger.info("✅ Application started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown."""
    logger.info("🛑 Shutting down application")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for all unhandled exceptions."""
    return handle_exception(exc)

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": f"Welcome to {settings.APP_NAME} - Agent System Active v2",
        "status": "healthy",
        "version": "1.0.0",
        "agents": "enabled",
        "deployment": "latest"
    }

@app.get("/health")
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "debug": settings.DEBUG,
        "frontend_url": settings.FRONTEND_URL
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
        required_fields = ["profile"]
        validate_required_fields(input_data, required_fields)
        
        # Wrap the input correctly for LangGraph
        state = {"profile": input_data["profile"]}
        
        # Generate plan using LangGraph
        result = safe_execute(flow.invoke, state)
        
        logger.info("✅ Plan generated successfully")
        
        return {
            "success": True,
            "data": result,
            "message": "Plan generated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"❌ Error generating plan: {str(exc)}")
        return handle_exception(exc)

@app.post("/api/embeddings/query")
async def query_embeddings(request: Request):
    """Query embeddings for similar content."""
    
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
        logger.info(f"📥 Received embedding query: {input_data}")
        
        # Validate required fields
        required_fields = ["query"]
        validate_required_fields(input_data, required_fields)
        
        # Import and execute query
        from embeddings.query_embeddings import query_embeddings
        result = safe_execute(query_embeddings, input_data["query"])
        
        logger.info("✅ Embedding query completed successfully")
        
        return {
            "success": True,
            "data": result,
            "message": "Query completed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"❌ Error querying embeddings: {str(exc)}")
        return handle_exception(exc)

@app.post("/api/embeddings/update")
async def update_embeddings(request: Request):
    """Update embeddings in the vector store."""
    
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
        logger.info(f"📥 Received embedding update request: {input_data}")
        
        # Validate required fields
        required_fields = ["embedding_text"]
        validate_required_fields(input_data, required_fields)
        
        # Import and execute update
        from embeddings.update_embeddings import update_embeddings
        result = safe_execute(update_embeddings)
        
        logger.info("✅ Embeddings updated successfully")
        
        return {
            "success": True,
            "data": result,
            "message": "Embeddings updated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"❌ Error updating embeddings: {str(exc)}")
        return handle_exception(exc)

@app.get("/api/topics")
async def get_topics():
    """Serve topicsdata.json as JSON."""
    data_path = os.path.join(os.path.dirname(__file__), "data", "topicsdata.json")
    return FileResponse(data_path, media_type="application/json")

@app.get("/api/niches")
async def get_niches():
    """Serve nichesdata.json as JSON."""
    data_path = os.path.join(os.path.dirname(__file__), "data", "nichesdata.json")
    return FileResponse(data_path, media_type="application/json")

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )