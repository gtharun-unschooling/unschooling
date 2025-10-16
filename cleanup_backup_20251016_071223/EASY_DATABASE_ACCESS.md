# 🎯 EASY DATABASE ACCESS GUIDE

## 🔍 **METHOD 1: Google Cloud Console (RECOMMENDED)**

### **Step 1: Go to Cloud SQL Console**
1. Open: https://console.cloud.google.com/sql/instances/unschooling-db
2. Click on your instance: `unschooling-db`

### **Step 2: Open Query Editor**
1. Click on **"Open Cloud Shell Editor"** button
2. Or click on **"Query"** tab in the interface

### **Step 3: Run Your Query**
```sql
SELECT topic_name, objective, age, estimated_time FROM niche_topics;
```

---

## 🔍 **METHOD 2: Cloud Shell (No Password Required)**

### **Step 1: Open Cloud Shell**
1. Go to: https://console.cloud.google.com/
2. Click the **Cloud Shell** icon (terminal) in the top right

### **Step 2: Connect to Database**
```bash
gcloud sql connect unschooling-db --user=postgres --database=unschooling
```

### **Step 3: Enter Password When Prompted**
**Password:** `unschooling2024!`

### **Step 4: Run Your Query**
```sql
SELECT topic_name, objective, age, estimated_time FROM niche_topics;
```

---

## 🔍 **METHOD 3: Local Connection (If Proxy Works)**

### **Step 1: Start Cloud SQL Proxy**
```bash
./cloud_sql_proxy unschooling-464413:us-central1:unschooling-db --port=5432
```

### **Step 2: Connect with psql**
```bash
/opt/homebrew/opt/postgresql@14/bin/psql "host=localhost port=5432 user=postgres dbname=unschooling sslmode=disable"
```

### **Step 3: Enter Password**
**Password:** `unschooling2024!`

### **Step 4: Run Query**
```sql
SELECT topic_name, objective, age, estimated_time FROM niche_topics;
```

---

## 🎯 **RECOMMENDED: Use Method 1 (Cloud Console)**

**Why?**
- ✅ No password needed
- ✅ No proxy setup required
- ✅ Works from any browser
- ✅ Built-in query editor
- ✅ Easy to use interface

---

## 📊 **YOUR QUERY RESULT WILL BE:**

```
topic_name        | objective                                    | age | estimated_time
------------------|----------------------------------------------|-----|---------------
Understanding Money | To introduce the concept of money...     | 3   | 20 mins
```

---

## 🔧 **TROUBLESHOOTING:**

### **If you get authentication errors:**
1. Make sure you're logged into the correct Google account
2. Ensure you have access to the `unschooling-464413` project
3. Try refreshing the Cloud Console page

### **If the proxy doesn't work:**
- Use Method 1 (Cloud Console) instead
- It's easier and more reliable

---

## 🚀 **READY TO QUERY YOUR DATABASE!**

**Go to:** https://console.cloud.google.com/sql/instances/unschooling-db
**Click:** "Open Cloud Shell Editor" or "Query" tab
**Run:** Your SQL query
