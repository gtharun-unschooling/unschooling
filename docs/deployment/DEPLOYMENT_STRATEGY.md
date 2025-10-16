# 🚀 Unschooling Startup - Deployment Strategy

## 📊 **Overview**

Your startup uses a **multi-environment, cloud-native deployment strategy** with separate infrastructure for frontend and backend services.

---

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐        ┌───────────────────────────────┐  │
│  │   FRONTEND      │        │        BACKEND SERVICES         │  │
│  │  Firebase       │───────▶│     Google Cloud Run            │  │
│  │  Hosting        │        │                                 │  │
│  │  (Port 3000)    │        │  • LLM Agents (2Gi RAM, 2 CPU)│  │
│  │                 │        │  • Warehouse API (1Gi, 1 CPU)  │  │
│  └─────────────────┘        └───────────────────────────────┘  │
│         │                              │                         │
│         │                              │                         │
│         ▼                              ▼                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            SHARED INFRASTRUCTURE                         │   │
│  │                                                           │   │
│  │  • Firebase Auth (User Authentication)                   │   │
│  │  • Firestore (NoSQL Database)                           │   │
│  │  • Google Vertex AI (LLM & Embeddings)                  │   │
│  │  • Google Cloud Build (CI/CD)                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 **Deployment Environments**

### **1. LOCAL ENVIRONMENT** 🏠
**Purpose**: Development and testing

**Frontend**:
- React dev server on `localhost:3000`
- Command: `npm start`
- Hot reload enabled

**Backend**:
- FastAPI/Uvicorn on `localhost:8000`
- Command: `uvicorn main_agents_clean:app --host 0.0.0.0 --port 8000`
- Auto-reload enabled

**Database**: Firebase Firestore (shared with production)

---

### **2. STAGING ENVIRONMENT** 🧪
**Purpose**: Pre-production testing (CURRENTLY NOT CONFIGURED)

**Status**: Placeholder scripts exist but not fully implemented

**Configuration**:
```bash
# File: deploy-staging.sh
- Branch: staging
- Build: npm run build
- Deploy: Firebase (separate staging project - TO BE CREATED)
```

**Notes**:
- Staging deployment currently skipped
- Requires separate Firebase project setup
- Used for QA and final testing before production

---

### **3. PRODUCTION ENVIRONMENT** 🚀
**Purpose**: Live customer-facing application

**Frontend Deployment**:
- **Platform**: Firebase Hosting
- **Project**: `unschooling-464413`
- **Hosting ID**: `unschooling-in`
- **Build Output**: `build/` directory
- **Deploy Command**: `npm run deploy:production` → `firebase deploy --only hosting`

**Backend Deployment**:
- **Platform**: Google Cloud Run
- **Project**: `unschooling-464413`
- **Region**: `us-central1`
- **Services**:
  1. **LLM Agents**: `llm-agents-44gsrw22gq-uc.a.run.app`
  2. **Warehouse API**: `warehouse-api-44gsrw22gq-uc.a.run.app`

---

## 🛠️ **Deployment Tools & Technologies**

### **Frontend Stack**
- **Framework**: React 18.2.0
- **Build Tool**: react-scripts (Create React App)
- **Hosting**: Firebase Hosting
- **CDN**: Firebase CDN (global edge caching)

### **Backend Stack**
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Containerization**: Docker
- **Orchestration**: Google Cloud Run (serverless containers)
- **Build**: Google Cloud Build

### **Infrastructure**
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **AI/ML**: Google Vertex AI (Gemini models)
- **Secrets**: Environment variables + Google Secret Manager
- **Monitoring**: Google Cloud Logging

---

## 📝 **Deployment Scripts**

### **NPM Scripts (package.json)**
```json
{
  "scripts": {
    "start": "react-scripts start",                    // Local dev
    "build": "react-scripts build",                    // Production build
    "dev:local": "./dev-local.sh",                     // Local environment
    "dev:staging": "./dev-staging.sh",                 // Staging environment
    "dev:production": "./dev-production.sh",           // Production environment
    "deploy:staging": "./deploy-staging.sh",           // Deploy to staging
    "deploy:production": "./deploy-cloud-run.sh"       // Deploy to production
  }
}
```

### **Deployment Workflow**

#### **Frontend Deployment** (Firebase Hosting)
```bash
#!/bin/bash
# deploy-production.sh

1. Check git branch (must be 'main')
2. Check for uncommitted changes
3. Pull latest from origin/main
4. npm run build
5. firebase deploy --only hosting
6. Deploy to Firebase CDN
```

#### **Backend Deployment** (Google Cloud Run)
```bash
#!/bin/bash
# deploy-cloud-run.sh

1. Authenticate with gcloud
2. Set project: unschooling-464413
3. Enable APIs (Cloud Run, Cloud Build, AI Platform)
4. Build Docker images:
   - LLM Agents: gcr.io/unschooling-464413/llm-agents
   - Warehouse API: gcr.io/unschooling-464413/warehouse-api
5. Deploy to Cloud Run:
   - LLM Agents: 2Gi RAM, 2 CPUs, 900s timeout
   - Warehouse API: 1Gi RAM, 1 CPU, 900s timeout
6. Output service URLs
```

---

## 🐳 **Docker Configuration**

### **Backend Dockerfile** (Dockerfile.llm)
```dockerfile
FROM python:3.11-slim
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Environment
ENV PYTHONPATH=/app
ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=30s CMD curl -f http://localhost:8080/health

# Run
CMD ["uvicorn", "main_agents:app", "--host", "0.0.0.0", "--port", "8080"]
```

---

## 🔐 **Environment Configuration**

### **Environment Files**
- `.env.local` - Local development
- `.env.staging` - Staging environment (not configured)
- `.env.production` - Production environment
- `.env.example` - Template for developers

### **Key Environment Variables**

**Frontend**:
```env
REACT_APP_ENVIRONMENT=production
REACT_APP_API_BASE_URL=https://llm-agents-44gsrw22gq-uc.a.run.app
REACT_APP_WAREHOUSE_API_URL=https://warehouse-api-44gsrw22gq-uc.a.run.app
REACT_APP_FIREBASE_PROJECT_ID=unschooling-464413
REACT_APP_FIREBASE_API_KEY=<key>
```

**Backend**:
```env
GOOGLE_CLOUD_PROJECT=unschooling-464413
GOOGLE_CLOUD_REGION=us-central1
GOOGLE_API_KEY=<vertex-ai-key>
FIREBASE_PROJECT_ID=unschooling-464413
API_HOST=0.0.0.0
API_PORT=8080
```

---

## 🔄 **CI/CD Pipeline**

### **Current Strategy**: **Manual Deployment**
- No automated CI/CD pipeline
- Developers manually run deployment scripts
- Git-based workflow with branch protection

### **Workflow**:
```
1. Developer commits to feature branch
2. Pull request to 'main'
3. Code review and approval
4. Merge to 'main'
5. Checkout main branch locally
6. Run: npm run deploy:production
7. Frontend deploys to Firebase
8. Backend deploys to Cloud Run
```

### **Future CI/CD** (Recommended):
```
- GitHub Actions / Cloud Build
- Automated testing on PR
- Auto-deploy on merge to main
- Rollback capabilities
- Blue-green deployments
```

---

## 📊 **Deployment Metrics**

### **Frontend (Firebase Hosting)**
- **Build Time**: ~2-3 minutes
- **Deploy Time**: ~1-2 minutes
- **CDN Propagation**: Instant (global edge caching)
- **Rollback**: Instant (Firebase version history)

### **Backend (Cloud Run)**
- **Build Time**: ~3-5 minutes (Docker image)
- **Deploy Time**: ~2-3 minutes
- **Cold Start**: ~5-10 seconds
- **Auto-scaling**: 0 to 1000 instances
- **Cost**: Pay per request (serverless)

---

## 💰 **Cost Model**

### **Serverless Architecture Benefits**:
1. **Pay-per-use**: Only charged when requests are processed
2. **Auto-scaling**: Scales to zero when idle
3. **No idle costs**: Backend doesn't run 24/7
4. **Global CDN**: Firebase Hosting included in free tier

### **Estimated Monthly Costs**:
- Firebase Hosting: $0 (free tier for small projects)
- Cloud Run (LLM Agents): ~$20-50 (based on traffic)
- Cloud Run (Warehouse): ~$10-20 (based on traffic)
- Firestore: ~$10-30 (based on reads/writes)
- Vertex AI: ~$50-100 (based on LLM usage)

**Total**: ~$90-200/month (scales with usage)

---

## 🔒 **Security & Compliance**

### **Frontend Security**:
- ✅ HTTPS enforced (Firebase CDN)
- ✅ SPA routing with react-router
- ✅ Firebase Auth for authentication
- ✅ Environment variables for secrets

### **Backend Security**:
- ✅ HTTPS only (Cloud Run default)
- ✅ CORS configured
- ✅ API key authentication
- ✅ IAM roles and permissions
- ✅ Secrets in environment variables

### **Database Security**:
- ✅ Firestore security rules
- ✅ User-based data isolation
- ✅ Server-side validation

---

## 📋 **Deployment Checklist**

### **Before Deployment**:
- [ ] Code reviewed and approved
- [ ] Tests passing locally
- [ ] Environment variables configured
- [ ] Firebase project selected
- [ ] gcloud authenticated
- [ ] No uncommitted changes
- [ ] On correct git branch

### **During Deployment**:
- [ ] Frontend build successful
- [ ] Backend Docker build successful
- [ ] Cloud Run services deployed
- [ ] Service URLs obtained
- [ ] Health checks passing

### **After Deployment**:
- [ ] Test live website
- [ ] Verify API endpoints
- [ ] Check Firebase Auth
- [ ] Monitor logs for errors
- [ ] Notify team of deployment

---

## 🎯 **Deployment Strategy Summary**

### **Your Startup Uses**:
1. ✅ **Multi-environment setup** (local, staging placeholder, production)
2. ✅ **Serverless architecture** (Firebase + Cloud Run)
3. ✅ **Containerized backend** (Docker)
4. ✅ **Manual deployment** (bash scripts)
5. ✅ **Git-based workflow** (main branch → production)
6. ✅ **Cloud-native infrastructure** (Google Cloud ecosystem)
7. ✅ **Microservices architecture** (LLM Agents + Warehouse API)
8. ✅ **Pay-per-use cost model** (scales with traffic)

---

## 🚀 **Quick Deployment Commands**

### **Deploy Everything (Production)**:
```bash
# Frontend + Backend
npm run deploy:production
```

### **Deploy Frontend Only**:
```bash
npm run build
firebase deploy --only hosting
```

### **Deploy Backend Only**:
```bash
cd backend
./deploy-cloud-run.sh
```

### **Local Development**:
```bash
# Terminal 1 (Frontend)
npm start

# Terminal 2 (Backend)
cd backend
source venv/bin/activate
uvicorn main_agents_clean:app --reload
```

---

## 📈 **Scaling Strategy**

### **Automatic Scaling** (Cloud Run):
- Instances: 0 → 1000 (auto-scales based on traffic)
- CPU: 2 cores per instance (LLM Agents)
- Memory: 2Gi per instance (LLM Agents)
- Concurrency: 80 requests per instance

### **Database Scaling** (Firestore):
- Automatic horizontal scaling
- 1 million reads/day free tier
- No manual sharding needed

### **CDN Scaling** (Firebase Hosting):
- Global edge caching
- Automatic geographic distribution
- Unlimited bandwidth (within limits)

---

## ✅ **Best Practices Implemented**

1. ✅ Environment separation (local, staging, production)
2. ✅ Infrastructure as Code (Dockerfiles, deployment scripts)
3. ✅ Git-based deployment workflow
4. ✅ Health checks on backend services
5. ✅ Automated builds (Cloud Build)
6. ✅ Serverless architecture (cost-efficient)
7. ✅ Global CDN (fast content delivery)
8. ✅ Security best practices (HTTPS, Auth, IAM)

---

## 🔮 **Future Improvements**

### **Recommended Next Steps**:
1. **Set up CI/CD pipeline** (GitHub Actions or Cloud Build)
2. **Configure staging environment** (separate Firebase project)
3. **Add automated testing** (unit, integration, e2e)
4. **Implement monitoring** (Cloud Monitoring, Sentry)
5. **Add rollback automation** (version tagging)
6. **Set up blue-green deployments** (zero-downtime)
7. **Implement feature flags** (gradual rollouts)
8. **Add performance monitoring** (Lighthouse CI)

---

## 📚 **Documentation**

- Deployment scripts: `deploy-*.sh`
- Environment configs: `.env.*`
- Docker configs: `backend/Dockerfile*`
- Firebase config: `firebase.json`, `.firebaserc`
- Package scripts: `package.json`

---

**Last Updated**: October 2024  
**Deployment Strategy**: Multi-environment, Cloud-native, Serverless  
**Primary Cloud**: Google Cloud Platform (Firebase + Cloud Run)

