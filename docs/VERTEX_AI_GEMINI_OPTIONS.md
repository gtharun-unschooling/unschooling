# Vertex AI Gemini Models - Options & Pricing Guide

**Project:** unschooling-464413  
**Current Backend Region:** us-central1  
**Date:** October 18, 2025

---

## 🌍 **Available Gemini Regions**

Vertex AI Gemini models are available in these regions:

### **Americas**
- ✅ `us-central1` (Iowa) - **YOUR CURRENT REGION**
- `us-east4` (Northern Virginia)
- `us-west1` (Oregon)
- `us-west4` (Las Vegas)
- `northamerica-northeast1` (Montreal)
- `southamerica-east1` (São Paulo)

### **Europe**
- `europe-west1` (Belgium)
- `europe-west2` (London)
- `europe-west3` (Frankfurt)
- `europe-west4` (Netherlands)
- `europe-west9` (Paris)

### **Asia-Pacific**
- `asia-northeast1` (Tokyo)
- `asia-northeast3` (Seoul)
- `asia-southeast1` (Singapore)
- `australia-southeast1` (Sydney)

**Recommendation:** Stay with **`us-central1`** - it's the primary region with best availability and lowest latency for US-based users.

---

## 💰 **Gemini Models & Pricing (Vertex AI)**

### **1. Gemini 1.5 Flash** ⚡ **(CHEAPEST & FASTEST)**

**Model Names to Try:**
- `gemini-1.5-flash`
- `gemini-1.5-flash-001`
- `gemini-1.5-flash-002`

**Pricing (as of Oct 2024):**
- **Input:** $0.075 per 1 million tokens (~750,000 characters)
- **Output:** $0.30 per 1 million tokens (~750,000 characters)

**Characteristics:**
- ⚡ **Fastest** response time
- 💰 **Cheapest** option
- 🎯 Best for: High-volume, simple tasks
- Context window: Up to 1 million tokens
- Quality: Very good for most tasks

**Estimated Monthly Cost for Your App:**
- 1,000 plans/month × 10,000 tokens/plan = 10M tokens
- Input: 10M × $0.075/M = **$0.75**
- Output: 10M × $0.30/M = **$3.00**
- **Total: ~$3.75/month for 1,000 plans**

---

### **2. Gemini 1.5 Pro** 🎓 **(BETTER QUALITY)**

**Model Names to Try:**
- `gemini-1.5-pro`
- `gemini-1.5-pro-001`
- `gemini-1.5-pro-002`

**Pricing (as of Oct 2024):**
- **Input:** $1.25 per 1 million tokens
- **Output:** $5.00 per 1 million tokens

**Characteristics:**
- 🎓 **Better reasoning** and analysis
- 📊 More accurate for complex tasks
- 🎯 Best for: Complex reasoning, detailed analysis
- Context window: Up to 2 million tokens
- Quality: Superior, more nuanced responses

**Estimated Monthly Cost for Your App:**
- 1,000 plans/month × 10,000 tokens/plan = 10M tokens
- Input: 10M × $1.25/M = **$12.50**
- Output: 10M × $5.00/M = **$50.00**
- **Total: ~$62.50/month for 1,000 plans**

---

### **3. Gemini Pro** (Legacy/Deprecated)

**Model Name:**
- `gemini-pro`

**Status:** ⚠️ **Being phased out** - replaced by Gemini 1.5 models

**Pricing:** Similar to Gemini 1.5 Pro

**Recommendation:** ❌ **Don't use** - migrate to 1.5 Flash or 1.5 Pro instead

---

## 🎯 **RECOMMENDATION FOR YOUR PROJECT**

### **Option 1: Gemini 1.5 Flash** ⭐ **RECOMMENDED**

**Why:**
- ✅ **20x cheaper** than Pro ($3.75 vs $62.50/month)
- ✅ **Fast enough** for your learning plan generation
- ✅ **Good quality** for educational content
- ✅ Handles your use case well (topic selection, activity generation)

**Best for:**
- ✅ Plan generation (your current use case)
- ✅ Topic matching and selection
- ✅ Activity descriptions
- ✅ Simple reasoning tasks

**Try First:** `gemini-1.5-flash`

---

### **Option 2: Gemini 1.5 Pro** (If Flash doesn't work)

**Why:**
- Better quality responses
- More complex reasoning
- **But 16x more expensive!**

**Use only if:**
- Flash doesn't work
- You need very detailed analysis
- Quality is more important than cost

**Try if Flash fails:** `gemini-1.5-pro`

---

## 🔧 **What Model Names to Try (In Order)**

Based on Vertex AI best practices, try these **exact names** in this order:

### For Flash (Try First):
1. ✅ `gemini-1.5-flash` ← **TRY THIS FIRST**
2. ✅ `gemini-1.5-flash-002` ← Latest version
3. ✅ `gemini-1.5-flash-001` ← Previous version
4. ✅ `gemini-flash` ← Alias (might work)

### For Pro (If Flash doesn't work):
1. ✅ `gemini-1.5-pro`
2. ✅ `gemini-1.5-pro-002`
3. ✅ `gemini-1.5-pro-001`
4. ✅ `gemini-pro` ← Legacy, avoid

---

## 📊 **Cost Comparison for Your Use Case**

### Scenario: 100 Plans Generated

| Model | Input Cost | Output Cost | Total Cost |
|-------|-----------|-------------|------------|
| **Flash** | $0.08 | $0.30 | **$0.38** ✅ |
| **Pro** | $1.25 | $5.00 | **$6.25** |

### Scenario: 1,000 Plans Generated

| Model | Input Cost | Output Cost | Total Cost |
|-------|-----------|-------------|------------|
| **Flash** | $0.75 | $3.00 | **$3.75** ✅ |
| **Pro** | $12.50 | $50.00 | **$62.50** |

### Scenario: 10,000 Plans Generated

| Model | Input Cost | Output Cost | Total Cost |
|-------|-----------|-------------|------------|
| **Flash** | $7.50 | $30.00 | **$37.50** ✅ |
| **Pro** | $125.00 | $500.00 | **$625.00** |

**Savings with Flash: ~94% compared to Pro!**

---

## ⚡ **Performance Comparison**

| Aspect | Gemini 1.5 Flash | Gemini 1.5 Pro |
|--------|------------------|----------------|
| **Speed** | ⚡⚡⚡ Very Fast (1-2s) | ⚡⚡ Fast (2-4s) |
| **Cost** | 💰 Cheapest | 💰💰💰 16x more expensive |
| **Quality** | ⭐⭐⭐⭐ Very Good | ⭐⭐⭐⭐⭐ Excellent |
| **Context** | 1M tokens | 2M tokens |
| **Best For** | Your use case ✅ | Complex analysis |

---

## 🚀 **WHAT TO DO NOW**

### Step 1: Update Model Name
Change in `backend/main_agents.py`:

```python
# FROM:
model = GenerativeModel("gemini-pro")

# TO (TRY FIRST):
model = GenerativeModel("gemini-1.5-flash")
```

### Step 2: Deploy and Test
```bash
cd backend
gcloud builds submit --tag gcr.io/unschooling-464413/llm-agents
gcloud run deploy llm-agents --image gcr.io/unschooling-464413/llm-agents --region us-central1
```

### Step 3: Check Logs
```bash
gcloud run services logs read llm-agents --region us-central1 --limit 50
```

**Look for:**
- ✅ "LLM selection completed" = SUCCESS!
- ❌ "404 Publisher Model" = Model name wrong, try next one

### Step 4: If Flash Doesn't Work
Try these in order:
1. `gemini-1.5-flash-002`
2. `gemini-1.5-flash-001`
3. `gemini-1.5-pro` (more expensive but should work)

---

## 💡 **Why 404 Errors Happen**

Common reasons:
1. ❌ **Wrong model name** - Use exact names above
2. ❌ **Region not supported** - us-central1 should work
3. ❌ **API not enabled** - Already fixed (aiplatform.googleapis.com enabled)
4. ❌ **Permissions missing** - Already fixed (granted aiplatform.user role)
5. ⚠️ **Model version deprecated** - Try newer versions

---

## ✅ **FINAL RECOMMENDATION**

### **Use Gemini 1.5 Flash**

**Reasons:**
1. 💰 **94% cheaper** than Pro
2. ⚡ **Faster** response times
3. 🎯 **Perfect for your use case** (educational content)
4. ✅ **More likely to be available** (widely deployed)
5. 📈 **Scales better** with volume

**Model name to use:**
```python
GenerativeModel("gemini-1.5-flash")
```

**Fallback if that fails:**
```python
GenerativeModel("gemini-1.5-pro")
```

---

## 📞 **If Still Getting 404 Errors**

### Option A: Request Vertex AI Access
Some Google Cloud projects need to explicitly request Gemini access:
1. Go to: https://console.cloud.google.com/vertex-ai
2. Click "Enable Vertex AI API" (if not enabled)
3. Navigate to "Model Garden"
4. Find "Gemini" models
5. Click "Enable" or "Request Access" if shown

### Option B: Check Quotas
```bash
gcloud services quota list --service=aiplatform.googleapis.com --project=unschooling-464413
```

### Option C: Contact Support
If models still don't work, you might need to contact Google Cloud support to enable Gemini access for your project.

---

## 📊 **Summary**

| Aspect | Recommendation |
|--------|---------------|
| **Model** | `gemini-1.5-flash` |
| **Region** | `us-central1` (keep current) |
| **Cost** | ~$3.75 per 1,000 plans |
| **Performance** | 1-2 seconds per request |
| **Quality** | Very good for educational content |

**Next Step:** Update code to use `gemini-1.5-flash` and deploy! 🚀

