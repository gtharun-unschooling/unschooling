# Development Guide

This guide provides best practices and workflows for developing the Unschooling React application.

## 🏗️ Architecture Overview

### Backend Architecture
```
backend/
├── main.py              # FastAPI application entry point
├── config/              # Configuration management
│   └── settings.py      # Environment variables and settings
├── agents/              # LangGraph agents
│   ├── profile_agent.py # User profile processing
│   ├── match_agent.py   # Content matching logic
│   ├── reviewer_agent.py # Content review
│   └── schedule_agent.py # Schedule generation
├── embeddings/          # Vector store operations
│   ├── query_embeddings.py    # Query vector store
│   └── update_embeddings.py   # Update embeddings
├── utils/               # Utility functions
│   └── error_handling.py # Error handling utilities
└── data/                # JSON data files
```

### Frontend Architecture
```
src/
├── App.jsx              # Main application component
├── config/              # Configuration
│   └── config.js        # Environment variables and settings
├── contexts/            # React contexts
│   └── LoadingContext.jsx # Loading state management
├── services/            # API services
│   └── api.js           # HTTP client and API methods
├── components/          # Reusable UI components
│   ├── ui/              # Basic UI components
│   │   └── LoadingSpinner.jsx
│   └── ErrorBoundary.jsx # Error boundary component
├── pages/               # Page components
├── routes/              # Routing configuration
└── layouts/             # Layout components
```

## 🔧 Development Workflow

### 1. Setting Up Development Environment

```bash
# Clone and setup
git clone <repository>
cd unschooling-react

# Install dependencies
./start.sh  # On Unix/Mac
# or
start.bat   # On Windows
```

### 2. Environment Configuration

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Configure your environment variables:
   - Set your Google Cloud project ID
   - Configure Firebase credentials
   - Set API endpoints

### 3. Development Commands

#### Backend Development
```bash
# Start backend only
cd backend
python main.py

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Development
```bash
# Start frontend only
npm start

# Build for production
npm run build

# Run tests
npm test
```

#### Full Stack Development
```bash
# Start both servers
./start.sh  # Unix/Mac
start.bat   # Windows
```

## 📝 Coding Standards

### Python (Backend)

#### Code Style
- Follow PEP 8 guidelines
- Use type hints for function parameters and return values
- Keep functions small and focused
- Use descriptive variable and function names

#### Error Handling
```python
from utils.error_handling import safe_execute, ValidationError

# Use safe_execute for external API calls
result = safe_execute(external_api_call, param1, param2)

# Raise custom errors for validation
if not valid_data:
    raise ValidationError("Invalid input data", field="data")
```

#### API Endpoints
```python
@app.post("/api/endpoint")
async def endpoint(request: Request):
    try:
        # Validate input
        input_data = await request.json()
        validate_required_fields(input_data, ["required_field"])
        
        # Process request
        result = safe_execute(process_function, input_data)
        
        return {
            "success": True,
            "data": result,
            "message": "Operation completed successfully"
        }
    except Exception as exc:
        return handle_exception(exc)
```

### JavaScript/React (Frontend)

#### Code Style
- Use functional components with hooks
- Follow ESLint and Prettier configurations
- Use descriptive variable and function names
- Keep components small and focused

#### Error Handling
```javascript
import { useLoading } from './contexts/LoadingContext';
import apiService from './services/api';

const { withLoading, isLoading } = useLoading();

const handleOperation = async () => {
  try {
    const result = await withLoading('operation-key', () => 
      apiService.someOperation(data)
    );
    // Handle success
  } catch (error) {
    // Handle error
    console.error('Operation failed:', error.message);
  }
};
```

#### Loading States
```javascript
// In component
{isLoading('operation-key') && (
  <LoadingSpinner text="Processing..." />
)}
```

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
cd backend
python -m pytest

# Run specific test file
python -m pytest tests/test_api.py

# Run with coverage
python -m pytest --cov=.
```

### Frontend Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🔍 Debugging

### Backend Debugging
1. Enable debug mode in `.env`:
   ```env
   DEBUG=true
   ```

2. Use FastAPI's automatic documentation:
   - Visit `http://localhost:8000/docs` for interactive API docs
   - Visit `http://localhost:8000/redoc` for alternative docs

3. Check logs in the terminal where the backend is running

### Frontend Debugging
1. Use React Developer Tools browser extension
2. Check browser console for errors
3. Use React's built-in debugging tools

### API Debugging
1. Use the health check endpoint: `GET /health`
2. Check API responses in browser network tab
3. Use tools like Postman or curl for API testing

## 📦 Adding New Features

### 1. Backend API Endpoint
```python
# In backend/main.py
@app.post("/api/new-feature")
async def new_feature(request: Request):
    try:
        input_data = await request.json()
        validate_required_fields(input_data, ["required_field"])
        
        result = safe_execute(new_feature_function, input_data)
        
        return {
            "success": True,
            "data": result,
            "message": "Feature executed successfully"
        }
    except Exception as exc:
        return handle_exception(exc)
```

### 2. Frontend Service Method
```javascript
// In src/services/api.js
async newFeature(data) {
  return this.request(config.ENDPOINTS.NEW_FEATURE, {
    method: 'POST',
    body: data
  });
}
```

### 3. Frontend Component
```javascript
// In src/components/NewFeature.jsx
import { useLoading } from '../contexts/LoadingContext';
import apiService from '../services/api';

const NewFeature = () => {
  const { withLoading, isLoading } = useLoading();
  
  const handleFeature = async () => {
    try {
      const result = await withLoading('new-feature', () => 
        apiService.newFeature(data)
      );
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <div>
      {isLoading('new-feature') && <LoadingSpinner />}
      <button onClick={handleFeature}>Execute Feature</button>
    </div>
  );
};
```

## 🚀 Deployment

### Backend Deployment (Google Cloud Run)
```bash
# Build and deploy
gcloud run deploy unschooling-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Frontend Deployment (Firebase Hosting)
```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## 🔧 Troubleshooting

### Common Issues

#### Backend Issues
1. **Import errors**: Check that all Python files are in the correct directories
2. **Environment variables**: Ensure `.env` file is properly configured
3. **Google Cloud authentication**: Run `gcloud auth login` and set project
4. **Port conflicts**: Change `API_PORT` in environment variables

#### Frontend Issues
1. **API connection errors**: Check `REACT_APP_API_BASE_URL` in environment
2. **Build errors**: Clear `node_modules` and reinstall dependencies
3. **CORS errors**: Ensure backend CORS settings include frontend URL

#### General Issues
1. **Permission errors**: Check file permissions on startup scripts
2. **Virtual environment**: Ensure Python virtual environment is activated
3. **Dependencies**: Update requirements.txt and package.json as needed

### Getting Help
1. Check the main README.md for setup instructions
2. Review error logs in terminal output
3. Check API documentation at `/docs`
4. Open an issue on GitHub with detailed error information 