"""
Error handling utilities for the Unschooling React application.
Provides standardized error responses and logging.
"""

import logging
import traceback
from typing import Dict, Any, Optional
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AppError(Exception):
    """Base application error class."""
    
    def __init__(self, message: str, error_code: Optional[str] = None, status_code: int = 500):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        super().__init__(self.message)

class ValidationError(AppError):
    """Validation error for invalid input data."""
    
    def __init__(self, message: str, field: Optional[str] = None):
        super().__init__(message, "VALIDATION_ERROR", 400)
        self.field = field

class AuthenticationError(AppError):
    """Authentication error for unauthorized access."""
    
    def __init__(self, message: str = "Authentication required"):
        super().__init__(message, "AUTHENTICATION_ERROR", 401)

class AuthorizationError(AppError):
    """Authorization error for forbidden access."""
    
    def __init__(self, message: str = "Access forbidden"):
        super().__init__(message, "AUTHORIZATION_ERROR", 403)

class NotFoundError(AppError):
    """Resource not found error."""
    
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, "NOT_FOUND", 404)

class ExternalServiceError(AppError):
    """Error from external services (Firebase, Vertex AI, etc.)."""
    
    def __init__(self, message: str, service: str = "external"):
        super().__init__(message, f"{service.upper()}_SERVICE_ERROR", 502)

def create_error_response(
    message: str,
    error_code: Optional[str] = "INTERNAL_ERROR",
    status_code: int = 500,
    details: Optional[Dict[str, Any]] = None
) -> JSONResponse:
    """Create a standardized error response."""
    
    error_data = {
        "error": {
            "message": message,
            "code": error_code,
            "status_code": status_code
        }
    }
    
    if details:
        error_data["error"]["details"] = details
    
    return JSONResponse(
        status_code=status_code,
        content=error_data
    )

def handle_exception(exc: Exception) -> JSONResponse:
    """Handle exceptions and return appropriate error responses."""
    
    # Log the exception
    logger.error(f"Exception occurred: {str(exc)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    
    # Handle known application errors
    if isinstance(exc, AppError):
        return create_error_response(
            message=exc.message,
            error_code=exc.error_code,
            status_code=exc.status_code
        )
    
    # Handle FastAPI HTTP exceptions
    if isinstance(exc, HTTPException):
        return create_error_response(
            message=exc.detail,
            error_code="HTTP_ERROR",
            status_code=exc.status_code
        )
    
    # Handle validation errors
    if "validation" in str(exc).lower():
        return create_error_response(
            message="Invalid input data",
            error_code="VALIDATION_ERROR",
            status_code=400,
            details={"original_error": str(exc)}
        )
    
    # Handle authentication errors
    if "authentication" in str(exc).lower() or "unauthorized" in str(exc).lower():
        return create_error_response(
            message="Authentication required",
            error_code="AUTHENTICATION_ERROR",
            status_code=401
        )
    
    # Handle external service errors
    if any(service in str(exc).lower() for service in ["firebase", "vertex", "google", "api"]):
        return create_error_response(
            message="External service error",
            error_code="EXTERNAL_SERVICE_ERROR",
            status_code=502,
            details={"original_error": str(exc)}
        )
    
    # Default internal server error
    return create_error_response(
        message="Internal server error",
        error_code="INTERNAL_ERROR",
        status_code=500,
        details={"original_error": str(exc)} if settings.DEBUG else None
    )

def validate_required_fields(data: Dict[str, Any], required_fields: list) -> None:
    """Validate that required fields are present in the data."""
    
    missing_fields = [field for field in required_fields if field not in data or data[field] is None]
    
    if missing_fields:
        raise ValidationError(
            message=f"Missing required fields: {', '.join(missing_fields)}",
            field=missing_fields[0] if len(missing_fields) == 1 else None
        )

def safe_execute(func, *args, **kwargs):
    """Safely execute a function and handle exceptions."""
    
    try:
        return func(*args, **kwargs)
    except Exception as exc:
        logger.error(f"Error in {func.__name__}: {str(exc)}")
        raise

# Import settings for debug mode
try:
    from config.settings import settings
except ImportError:
    # Fallback for when running as module
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from config.settings import settings 