# 🚀 Version Migration Strategy: Firebase → GCP

## 🎯 **MIGRATION PLAN OVERVIEW**

### **Phase 1: Preserve Current Work (Version 1)**
- ✅ **Backup current Firebase setup**
- ✅ **Deploy current version to production**
- ✅ **Create version control system**
- ✅ **Document current architecture**

### **Phase 2: Build Enterprise GCP (Version 2)**
- ✅ **Set up GCP infrastructure**
- ✅ **Migrate to PostgreSQL + Redis**
- ✅ **Implement Google OAuth**
- ✅ **Deploy enterprise version**

### **Phase 3: Gradual Migration**
- ✅ **A/B testing between versions**
- ✅ **Gradual user migration**
- ✅ **Full cutover to Version 2**

---

## 📁 **VERSION CONTROL STRUCTURE**

### **Create Git Branches:**
```
main (production)
├── v1-firebase (current Firebase version)
├── v2-gcp-enterprise (new GCP version)
├── v1-deployment (Firebase production)
└── v2-development (GCP development)
```

### **Directory Structure:**
```
unschooling/
├── v1-firebase/                 # Current Firebase version
│   ├── src/
│   ├── backend/
│   ├── firebase.json
│   ├── firestore.rules
│   └── README.md
├── v2-gcp/                     # New GCP version
│   ├── src/
│   ├── backend/
│   ├── infrastructure/
│   ├── database/
│   └── README.md
├── docs/
│   ├── v1-architecture.md
│   ├── v2-architecture.md
│   └── migration-plan.md
└── deployment/
    ├── v1-firebase-deploy.sh
    ├── v2-gcp-deploy.sh
    └── backup-scripts/
```

---

## 🔄 **PHASE 1: PRESERVE CURRENT WORK**

### **Step 1: Create Version 1 Backup**
```bash
# Create backup branch
git checkout -b v1-firebase-backup
git add .
git commit -m "Backup: Firebase version before GCP migration"
git push origin v1-firebase-backup

# Create version 1 production branch
git checkout -b v1-firebase-production
git push origin v1-firebase-production
```

### **Step 2: Document Current Architecture**
```markdown
# v1-architecture.md
## Current Firebase Architecture
- Authentication: Firebase Auth
- Database: Firestore
- Storage: Firebase Storage
- Functions: Firebase Functions
- Hosting: Firebase Hosting

## Data Structure:
- Users: /users/{userId}
- Children: /users/{userId}/children/{childId}
- Plans: /users/{userId}/children/{childId}/plans/{planId}
- Analytics: /analytics/{sessionId}
```

### **Step 3: Deploy Current Version to Production**
```bash
# Deploy Firebase version to production
firebase deploy --project unschooling-prod

# Set up custom domain
firebase hosting:sites:create unschooling-v1
```

---

## 🏗️ **PHASE 2: BUILD GCP ENTERPRISE VERSION**

### **Step 1: Set up GCP Infrastructure**
```bash
# Create new branch for GCP version
git checkout -b v2-gcp-enterprise

# Set up GCP project
gcloud projects create unschooling-v2
gcloud config set project unschooling-v2

# Enable required APIs
gcloud services enable sqladmin.googleapis.com
gcloud services enable redis.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable storage.googleapis.com
```

### **Step 2: Create Database Schema**
```sql
-- v2-database-schema.sql
CREATE DATABASE unschooling_v2;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    picture TEXT,
    role VARCHAR(50) DEFAULT 'parent',
    subscription_plan VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(50) DEFAULT 'inactive',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Children table
CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 18),
    interests TEXT[] DEFAULT '{}',
    dislikes TEXT[] DEFAULT '{}',
    learning_style VARCHAR(50),
    learning_goals TEXT[] DEFAULT '{}',
    plan_type VARCHAR(50) DEFAULT 'hybrid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning plans table
CREATE TABLE learning_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    plan_name VARCHAR(200) NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_weeks INTEGER NOT NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    plan_data JSONB DEFAULT '{}',
    agent_timings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_children_parent_id ON children(parent_id);
CREATE INDEX idx_learning_plans_child_id ON learning_plans(child_id);
```

### **Step 3: Update Backend for GCP**
```python
# v2-backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests
import jwt
from datetime import datetime, timedelta
import asyncpg
import redis

app = FastAPI(title="Unschooling API V2", version="2.0.0")

# Database connection
async def get_db():
    conn = await asyncpg.connect(
        host="your-cloud-sql-ip",
        port=5432,
        user="app-user",
        password="your-password",
        database="unschooling_v2"
    )
    return conn

# Redis connection
redis_client = redis.Redis(
    host="your-redis-ip",
    port=6379,
    decode_responses=True
)

# Authentication
async def verify_google_token(credential: str):
    try:
        idinfo = id_token.verify_oauth2_token(
            credential, 
            requests.Request(), 
            "your-google-client-id"
        )
        
        return {
            'google_id': idinfo['sub'],
            'email': idinfo['email'],
            'name': idinfo['name'],
            'picture': idinfo['picture']
        }
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token")

# JWT token generation
def generate_jwt_token(user_id: str, email: str):
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, "your-secret-key", algorithm="HS256")

# API endpoints
@app.post("/api/auth/google")
async def google_auth(credential: str, db=Depends(get_db)):
    user_info = await verify_google_token(credential)
    
    # Create or update user
    user = await db.fetchrow(
        "SELECT * FROM users WHERE google_id = $1",
        user_info['google_id']
    )
    
    if not user:
        user = await db.fetchrow(
            """
            INSERT INTO users (google_id, email, name, picture)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            """,
            user_info['google_id'],
            user_info['email'],
            user_info['name'],
            user_info['picture']
        )
    else:
        user = await db.fetchrow(
            """
            UPDATE users SET name = $2, picture = $3, last_login = NOW()
            WHERE google_id = $1
            RETURNING *
            """,
            user_info['google_id'],
            user_info['name'],
            user_info['picture']
        )
    
    token = generate_jwt_token(str(user['id']), user['email'])
    
    return {
        'token': token,
        'user': {
            'id': str(user['id']),
            'email': user['email'],
            'name': user['name'],
            'picture': user['picture']
        }
    }

@app.get("/api/children")
async def get_children(token: str = Depends(get_current_user), db=Depends(get_db)):
    user_id = jwt.decode(token, "your-secret-key", algorithms=["HS256"])['user_id']
    
    children = await db.fetch(
        "SELECT * FROM children WHERE parent_id = $1 ORDER BY created_at DESC",
        user_id
    )
    
    return [dict(child) for child in children]

@app.post("/api/children")
async def create_child(child_data: dict, token: str = Depends(get_current_user), db=Depends(get_db)):
    user_id = jwt.decode(token, "your-secret-key", algorithms=["HS256"])['user_id']
    
    child = await db.fetchrow(
        """
        INSERT INTO children (parent_id, name, age, interests, learning_style)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        """,
        user_id,
        child_data['name'],
        child_data['age'],
        child_data['interests'],
        child_data['learning_style']
    )
    
    return dict(child)
```

### **Step 4: Update Frontend for GCP**
```javascript
// v2-frontend/src/services/authService.js
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

class AuthService {
  constructor() {
    this.apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  }

  async loginWithGoogle(credential) {
    const response = await fetch(`${this.apiBaseUrl}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const { token, user } = await response.json();
    
    // Store token
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  }

  async getChildren() {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${this.apiBaseUrl}/api/children`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch children');
    }

    return response.json();
  }

  async createChild(childData) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${this.apiBaseUrl}/api/children`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(childData)
    });

    if (!response.ok) {
      throw new Error('Failed to create child');
    }

    return response.json();
  }
}

export default new AuthService();
```

---

## 🚀 **PHASE 3: DEPLOYMENT STRATEGY**

### **Step 1: Deploy Version 1 (Firebase) to Production**
```bash
# Deploy current Firebase version
firebase deploy --project unschooling-prod

# Set up custom domain
firebase hosting:sites:create unschooling-v1
firebase hosting:channel:deploy v1 unschooling-v1
```

### **Step 2: Deploy Version 2 (GCP) to Staging**
```bash
# Deploy GCP version to staging
gcloud run deploy unschooling-v2 \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Set up staging domain
gcloud run domain-mappings create \
  --service unschooling-v2 \
  --domain staging.unschooling.com
```

### **Step 3: A/B Testing Setup**
```javascript
// A/B testing configuration
const versionConfig = {
  v1: {
    url: 'https://v1.unschooling.com',
    percentage: 50, // 50% of users
    features: ['firebase-auth', 'firestore']
  },
  v2: {
    url: 'https://v2.unschooling.com',
    percentage: 50, // 50% of users
    features: ['google-oauth', 'postgresql']
  }
};

// Route users based on A/B test
const getVersionForUser = (userId) => {
  const hash = hashUserId(userId);
  return hash % 100 < versionConfig.v2.percentage ? 'v2' : 'v1';
};
```

---

## 📊 **MIGRATION MONITORING**

### **Step 1: Set up Monitoring**
```python
# Monitoring service
import logging
from datetime import datetime

class MigrationMonitor:
    def __init__(self):
        self.logger = logging.getLogger('migration')
    
    def log_user_migration(self, user_id, from_version, to_version):
        self.logger.info({
            'event': 'user_migration',
            'user_id': user_id,
            'from_version': from_version,
            'to_version': to_version,
            'timestamp': datetime.now().isoformat()
        })
    
    def log_error(self, error, version):
        self.logger.error({
            'event': 'error',
            'error': str(error),
            'version': version,
            'timestamp': datetime.now().isoformat()
        })
```

### **Step 2: Data Migration Script**
```python
# Migration script
async def migrate_user_data(firebase_user, gcp_db):
    try:
        # Migrate user profile
        await gcp_db.execute(
            """
            INSERT INTO users (google_id, email, name, picture)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (google_id) DO UPDATE SET
            name = EXCLUDED.name,
            picture = EXCLUDED.picture,
            updated_at = NOW()
            """,
            firebase_user['google_id'],
            firebase_user['email'],
            firebase_user['name'],
            firebase_user['picture']
        )
        
        # Migrate children data
        for child in firebase_user['children']:
            await gcp_db.execute(
                """
                INSERT INTO children (parent_id, name, age, interests, learning_style)
                VALUES ($1, $2, $3, $4, $5)
                """,
                firebase_user['id'],
                child['name'],
                child['age'],
                child['interests'],
                child['learning_style']
            )
        
        print(f"✅ Migrated user {firebase_user['email']}")
        
    except Exception as e:
        print(f"❌ Failed to migrate user {firebase_user['email']}: {e}")
```

---

## 🎯 **DEPLOYMENT COMMANDS**

### **Version 1 (Firebase) Deployment:**
```bash
#!/bin/bash
# v1-deploy.sh

echo "🚀 Deploying Version 1 (Firebase)..."

# Deploy Firebase functions
firebase deploy --only functions --project unschooling-prod

# Deploy Firebase hosting
firebase deploy --only hosting --project unschooling-prod

# Deploy Firestore rules
firebase deploy --only firestore:rules --project unschooling-prod

echo "✅ Version 1 deployed successfully!"
```

### **Version 2 (GCP) Deployment:**
```bash
#!/bin/bash
# v2-deploy.sh

echo "🚀 Deploying Version 2 (GCP)..."

# Deploy Cloud Run service
gcloud run deploy unschooling-v2 \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="DATABASE_URL=$DATABASE_URL,REDIS_URL=$REDIS_URL"

# Deploy Cloud SQL
gcloud sql instances create unschooling-db-v2 \
  --database-version=POSTGRES_15 \
  --tier=db-standard-1 \
  --region=us-central1

# Deploy Redis
gcloud redis instances create unschooling-cache-v2 \
  --size=1 \
  --region=us-central1

echo "✅ Version 2 deployed successfully!"
```

---

## 🎯 **MIGRATION TIMELINE**

### **Week 1: Preserve Current Work**
- ✅ Create version 1 backup
- ✅ Deploy current version to production
- ✅ Document current architecture

### **Week 2: Build GCP Infrastructure**
- ✅ Set up GCP project
- ✅ Create database schema
- ✅ Deploy backend to Cloud Run

### **Week 3: Update Frontend**
- ✅ Implement Google OAuth
- ✅ Update API calls
- ✅ Test authentication flow

### **Week 4: A/B Testing**
- ✅ Deploy both versions
- ✅ Set up A/B testing
- ✅ Monitor performance

### **Week 5: Full Migration**
- ✅ Migrate all users
- ✅ Decommission Firebase
- ✅ Full cutover to GCP

---

## 🎯 **IMMEDIATE NEXT STEPS**

1. **Create backup branch** (5 minutes)
2. **Deploy current version** (30 minutes)
3. **Set up GCP project** (1 hour)
4. **Create database schema** (2 hours)
5. **Update backend** (4 hours)

**Total: 1 day to set up, 4 weeks to complete migration**

**This gives you a safe migration path with zero data loss!** 🚀

Would you like me to help you start with creating the backup and setting up the GCP project right now? 🎯
