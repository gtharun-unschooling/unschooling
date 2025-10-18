# Gemini API Setup Guide - Instant Access

Since Vertex AI Gemini models aren't available in your project yet, we'll use the **Google AI Studio Gemini API** instead.

## ✅ **Advantages:**
- 🚀 **Instant access** (no waiting for approval)
- 💰 **Free tier:** 60 requests/minute, 1,500 requests/day
- 🎯 **Same Gemini models** (Flash, Pro)
- ⚡ **Faster setup** (just need an API key)

---

## 📝 **Step 1: Get Your Gemini API Key**

1. **Open Google AI Studio:**
   👉 **https://aistudio.google.com/app/apikey**

2. **Click "Create API Key"**

3. **Select Project:**
   - Choose "unschooling-464413"
   - OR create a new project if needed

4. **Copy the API Key:**
   - It will look like: `AIzaSyD...` (long string)
   - **Keep it secret!** Don't commit to git

---

## 📦 **Step 2: Install the Library**

The backend Docker image needs this library instead of `google-cloud-aiplatform`:

```python
# In requirements.txt - ADD:
google-generativeai>=0.3.0
```

---

## 🔧 **Step 3: Code Changes**

### **Before (Vertex AI - NOT Working):**
```python
import vertexai
from vertexai.generative_models import GenerativeModel

vertexai.init(project="unschooling-464413", location="us-central1")
model = GenerativeModel("gemini-1.5-flash")
response = model.generate_content(prompt)
```

### **After (Google AI - Works!):**
```python
import google.generativeai as genai
import os

# Configure with API key
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Use the model
model = genai.GenerativeModel('gemini-1.5-flash')
response = model.generate_content(prompt)
# Same response.text usage!
```

---

## 🔐 **Step 4: Set API Key in Cloud Run**

```bash
# Set the API key as environment variable in Cloud Run
gcloud run services update llm-agents \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY=your-api-key-here
```

---

## 💰 **Pricing Comparison**

| | Google AI Studio | Vertex AI |
|---|---|---|
| **Setup** | Instant (API key) | Need project approval |
| **Free Tier** | ✅ 60 req/min, 1.5K/day | ❌ No free tier |
| **Flash Pricing** | $0.075 / 1M input tokens | Same |
| **Pro Pricing** | $1.25 / 1M input tokens | Same |
| **Best For** | Quick start, prototyping | Enterprise, production |

**For your use case:** Google AI Studio is perfect! Same pricing, instant access.

---

## ⚡ **Quick Test**

```python
import google.generativeai as genai

genai.configure(api_key='YOUR-API-KEY-HERE')
model = genai.GenerativeModel('gemini-1.5-flash')
response = model.generate_content('Hello!')
print(response.text)
```

---

## 🎯 **What I'll Do Next:**

1. Update `requirements.txt` to use `google-generativeai`
2. Modify backend code to use the new API
3. You provide the API key
4. Deploy and test!

**Ready to proceed?**

