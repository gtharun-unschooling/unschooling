# 💰 GCP Billing & Resource Analysis - October 16, 2025

## 📊 **Current Resources & Costs**

### **1. Cloud Run Services** 🟢 (Pay-per-use - Good!)

| Service | Memory | CPU | Status | Cost Impact | Action |
|---------|--------|-----|--------|-------------|--------|
| **llm-agents** | 2 GB | 2 CPU | ✅ ACTIVE (Just deployed) | ~$5-10/month | ✅ **KEEP** - Main backend |
| **unschooling-backend** | 2 GB | 2 CPU | ⚠️ OLD (Oct 14) | ~$5-10/month | ❌ **DELETE** - Duplicate! |
| **cloudrun-proxy** | 512 MB | 1 CPU | ⚠️ OLD (July 23) | ~$2-5/month | ❌ **DELETE** - Unused? |

**Current Cost:** ~$12-25/month for 3 services  
**After Cleanup:** ~$5-10/month for 1 service  
**Savings:** ~$7-15/month (50-70% reduction)

---

### **2. Cloud Storage Buckets** 🟡 (Storage + Operations)

| Bucket | Size | Purpose | Cost | Action |
|--------|------|---------|------|--------|
| **run-sources** | 3.08 GB | Cloud Run source code | ~$0.06/month | ✅ **KEEP** - Needed |
| **cloudbuild** | 1.74 GB | Build artifacts | ~$0.04/month | 🧹 **CLEAN** - Old builds |
| **embeddings-batch** | 1.14 MB | Embeddings cache | <$0.01/month | ✅ **KEEP** - Small |
| **database-scripts** | 88 KB | SQL scripts | <$0.01/month | ✅ **KEEP** - Tiny |
| **vectors-tharun** | 0 bytes | Empty! | $0 | ❌ **DELETE** - Unused |

**Current Cost:** ~$0.15/month  
**After Cleanup:** ~$0.08/month  
**Savings:** ~$0.07/month

---

### **3. Other GCP Services** ✅

| Service | Status | Cost |
|---------|--------|------|
| **Compute Engine VMs** | ✅ None | $0 |
| **Kubernetes Clusters** | ✅ None | $0 |
| **Cloud SQL** | ✅ None | $0 |
| **App Engine** | ✅ None | $0 |

**Great news:** No expensive services running!

---

### **4. Firebase Services** 🟢 (Free Tier)

| Service | Usage | Cost |
|---------|-------|------|
| **Hosting** | 2 channels (live + staging) | FREE (within limits) |
| **Authentication** | Google Sign-In | FREE |
| **Firestore** | Database | FREE (Spark plan) |

**Cost:** $0/month (within free tier)

---

## 💰 **Total Monthly Cost Estimate**

| Category | Current | After Cleanup | Savings |
|----------|---------|---------------|---------|
| Cloud Run | $12-25 | $5-10 | $7-15 |
| Storage | $0.15 | $0.08 | $0.07 |
| Firebase | $0 | $0 | $0 |
| **TOTAL** | **$12-25** | **$5-10** | **$7-15** |

**Potential savings:** 50-70% reduction!

---

## 🔧 **Recommended Actions (Cost Savings)**

### **HIGH PRIORITY - Delete Duplicate Services**

#### **1. Delete Old Backend (unschooling-backend)**
```bash
gcloud run services delete unschooling-backend --region us-central1
```
**Saves:** ~$5-10/month  
**Impact:** None - it's a duplicate of llm-agents

#### **2. Delete Unused Proxy (cloudrun-proxy)**
```bash
gcloud run services delete cloudrun-proxy --region us-central1
```
**Saves:** ~$2-5/month  
**Impact:** Check if anything uses it first

#### **3. Delete Empty Bucket**
```bash
gcloud storage rm -r gs://unschooling-vectors-tharun
```
**Saves:** Minimal, but good housekeeping

---

### **MEDIUM PRIORITY - Clean Old Build Artifacts**

#### **4. Clean Old CloudBuild Artifacts** (1.74 GB)
```bash
# List files older than 30 days
gcloud storage ls -l gs://unschooling-464413_cloudbuild/source/ --format="value(name,timeCreated)" | head -20

# Delete old builds (older than 30 days)
gcloud storage rm -r gs://unschooling-464413_cloudbuild/source/* --older-than 30d
```
**Saves:** ~$0.04/month storage  
**Impact:** None - old builds not needed

---

## 📋 **Quick Cleanup Script**

Run this to clean up immediately:

```bash
# 1. Delete duplicate backend service
gcloud run services delete unschooling-backend --region us-central1 --quiet

# 2. Delete old proxy (if not needed)
gcloud run services delete cloudrun-proxy --region us-central1 --quiet

# 3. Delete empty bucket
gcloud storage rm -r gs://unschooling-vectors-tharun --quiet

# 4. Clean old build artifacts
gcloud storage rm gs://unschooling-464413_cloudbuild/source/* --older-than 30d --quiet
```

---

## ✅ **What's Actually Being Used (Keep These)**

### **Active Services:**
- ✅ **llm-agents** (Cloud Run) - Your main backend API
- ✅ **Firebase Hosting** - Your frontend (live + staging)
- ✅ **Firestore** - Your database
- ✅ **Firebase Auth** - Google Sign-In

### **Active Storage:**
- ✅ **run-sources** bucket - Cloud Run deployment files
- ✅ **cloudbuild** bucket - Recent builds (clean old ones)
- ✅ **embeddings-batch** - Small, keep
- ✅ **database-scripts** - Tiny, keep

---

## 🚨 **Important Notes**

### **Before Deleting cloudrun-proxy:**
Check if it's being used:
```bash
gcloud run services describe cloudrun-proxy --region us-central1 --format="value(status.traffic)"
```

If traffic is 0 → Safe to delete  
If traffic > 0 → Investigate first

### **Before Deleting unschooling-backend:**
This looks like your old backend. Since we just deployed `llm-agents`, this is probably safe to delete.

---

## 💡 **Cost Optimization Summary**

### **Current Waste:**
- ❌ Running 2 duplicate backend services (2x the cost)
- ❌ Old proxy service from July (unused?)
- ❌ Empty storage bucket
- ❌ Old build artifacts (1.74 GB)

### **After Cleanup:**
- ✅ Single backend service (llm-agents)
- ✅ Clean storage (only recent builds)
- ✅ No empty buckets
- ✅ Estimated savings: $7-15/month

---

## 📈 **Recommended Monthly Budget**

**Optimal Cost:** $5-15/month
- Cloud Run: $5-10 (only when used)
- Storage: $0.05-0.10
- Firebase: $0 (free tier)

**Your actual cost depends on:**
- Number of plan generations per month
- API requests to backend
- Storage of user data in Firestore

---

## ✅ **Next Steps**

1. **Test staging first** (make sure plan generation works)
2. **Delete duplicate services** (save money immediately)
3. **Monitor costs** in GCP Console:
   - https://console.cloud.google.com/billing

---

**Want me to clean up the duplicate services now?** This will save you ~$7-15/month! 💰

