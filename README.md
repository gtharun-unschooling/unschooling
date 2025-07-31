# Unschooling React - Personalized Learning Platform

A modern React application with a Python FastAPI backend that provides personalized learning plans and content recommendations using AI-powered embeddings.

## 🏗️ Project Structure

```
unschooling-react/
├── backend/                    # Python FastAPI backend
│   ├── agents/                 # LangGraph agents for plan generation
│   ├── config/                 # Configuration and settings
│   ├── data/                   # JSON data files
│   ├── embeddings/             # Vector store operations
│   ├── utils/                  # Utility functions and error handling
│   └── main.py                 # FastAPI application entry point
├── src/                        # React frontend
│   ├── components/             # Reusable UI components
│   ├── config/                 # Frontend configuration
│   ├── contexts/               # React contexts (loading, auth)
│   ├── pages/                  # Page components
│   ├── routes/                 # Routing configuration
│   ├── services/               # API services
│   └── layouts/                # Layout components
├── public/                     # Static assets
├── requirements.txt            # Python dependencies
├── package.json                # Node.js dependencies
└── env.example                 # Environment variables template
```

## 🚀 Features

- **Personalized Learning Plans**: AI-generated plans based on user profiles
- **Vector Search**: Semantic search using Google Cloud Vertex AI
- **Real-time Updates**: Live embedding updates and queries
- **Error Handling**: Comprehensive error handling and retry logic
- **Loading States**: Smooth loading experiences throughout the app
- **Environment Configuration**: Flexible configuration management
- **Responsive Design**: Modern, mobile-friendly UI

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **LangGraph**: AI workflow orchestration
- **Google Cloud Vertex AI**: Vector embeddings and search
- **Firebase**: Authentication and database
- **Python-dotenv**: Environment variable management

### Frontend
- **React**: UI framework
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Firebase SDK**: Authentication and real-time database

## 📋 Prerequisites

- Python 3.11+
- Node.js 16+
- Google Cloud account with Vertex AI enabled
- Firebase project
- gcloud CLI configured

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd unschooling-react
```

### 2. Set up Python backend
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Set up Node.js frontend
```bash
# Install dependencies
npm install
```

### 4. Configure environment variables
```bash
# Copy environment template
cp env.example .env

# Edit .env with your actual values
nano .env
```

### 5. Configure Google Cloud
```bash
# Authenticate with Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable firestore.googleapis.com
```

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```env
# Application Settings
DEBUG=False
FRONTEND_URL=http://localhost:3000

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=your_project_id

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_CLOUD_REGION=us-central1

# Vertex AI Configuration
VERTEX_AI_PROJECT_ID=your_project_id
VERTEX_AI_INDEX_ID=your_index_id
VERTEX_AI_INDEX_ENDPOINT_ID=your_endpoint_id

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
```

#### Frontend (.env)
```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_PROJECT_ID=your_project_id

# Feature Flags
REACT_APP_EMBEDDINGS_ENABLED=true
REACT_APP_PLAN_GENERATION_ENABLED=true
```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
```bash
cd backend
python main.py
```
The API will be available at `http://localhost:8000`

2. **Start the frontend development server**
```bash
npm start
```
The app will be available at `http://localhost:3000`

### Production Mode

1. **Build the frontend**
```bash
npm run build
```

2. **Start the backend with production settings**
```bash
cd backend
python main.py
```

## 📚 API Documentation

### Endpoints

#### Health Check
- `GET /health` - Check API health status

#### Plan Generation
- `POST /api/generate-plan` - Generate personalized learning plan
  ```json
  {
    "profile": {
      "age": 10,
      "interests": ["science", "math"],
      "learning_style": "visual"
    }
  }
  ```

#### Embeddings
- `POST /api/embeddings/query` - Query similar content
  ```json
  {
    "query": "How to teach kids about money?"
  }
  ```

- `POST /api/embeddings/update` - Update embeddings
  ```json
  {
    "embedding_text": "New content to embed"
  }
  ```

### Error Handling

All API endpoints return standardized error responses:
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "status_code": 400
  }
}
```

## 🔍 Usage Examples

### Generating a Learning Plan

```javascript
import apiService from './services/api';

const profile = {
  age: 8,
  interests: ['science', 'art'],
  learning_style: 'hands-on'
};

try {
  const result = await apiService.generatePlan(profile);
  console.log('Generated plan:', result.data);
} catch (error) {
  console.error('Error generating plan:', error.message);
}
```

### Querying Embeddings

```javascript
import apiService from './services/api';

try {
  const results = await apiService.queryEmbeddings('science experiments for kids');
  console.log('Similar content:', results.data);
} catch (error) {
  console.error('Error querying embeddings:', error.message);
}
```

### Using Loading States

```javascript
import { useLoading } from './contexts/LoadingContext';

const { withLoading, isLoading } = useLoading();

const handleGeneratePlan = async () => {
  try {
    const result = await withLoading('plan-generation', () => 
      apiService.generatePlan(profile)
    );
    // Handle success
  } catch (error) {
    // Handle error
  }
};

// In JSX
{isLoading('plan-generation') && <LoadingSpinner text="Generating plan..." />}
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
npm test
```

## 📦 Deployment

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

## 🔧 Development

### Code Structure

- **Backend**: Follows FastAPI best practices with modular structure
- **Frontend**: Component-based architecture with hooks and contexts
- **Error Handling**: Centralized error handling with custom error classes
- **Loading States**: Context-based loading state management
- **Configuration**: Environment-based configuration management

### Adding New Features

1. **Backend API**: Add new endpoints in `backend/main.py`
2. **Frontend Service**: Add API methods in `src/services/api.js`
3. **UI Components**: Create reusable components in `src/components/`
4. **Configuration**: Update environment variables as needed

### Debugging

- **Backend**: Use `DEBUG=true` in environment variables
- **Frontend**: Use React Developer Tools and browser console
- **API**: Check FastAPI automatic documentation at `/docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/docs`
- Review the error logs
- Open an issue on GitHub

## 🔄 Changelog

### v1.0.0
- Initial release with basic functionality
- Personalized learning plan generation
- Vector search capabilities
- Comprehensive error handling
- Loading state management
# Deployment trigger - Wed Jul 30 23:36:42 IST 2025
# Test deployment with Firebase token - Thu Jul 31 07:54:48 IST 2025
