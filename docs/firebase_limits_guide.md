# 🔥 Firebase Firestore Limits - Complete Guide

## 📏 DOCUMENT SIZE LIMITS

### **Maximum Document Size: 1 MB (1,048,576 bytes)**

This includes:
- All field names
- All field values (strings, numbers, arrays, maps)
- Nested data structures
- Metadata

**Your Current Situation:**
- Yashna's child document with 1 nested plan: **84 KB**
- If you add 12 plans: **~1 MB** (you'd hit the limit!)

---

## �� FIELD LIMITS PER DOCUMENT

| Limit | Value |
|-------|-------|
| **Maximum depth of nested fields** | 20 levels |
| **Maximum size of a field name** | 1,500 bytes |
| **Maximum size of a single field value (string)** | 1 MB |
| **Maximum number of index entries per document** | 40,000 |
| **Maximum size of a document name** | 1,500 bytes |

---

## 🔢 COLLECTION & QUERY LIMITS

| Operation | Limit |
|-----------|-------|
| **Maximum collections per database** | Unlimited |
| **Maximum documents per collection** | Unlimited |
| **Maximum subcollection depth** | 100 levels |
| **Maximum write batch size** | 500 operations |
| **Maximum transaction size** | 500 operations |
| **Maximum query results** | Unlimited (but paginate!) |
| **Maximum offset for queries** | 10,000 documents |

---

## ⚡ WRITE & READ LIMITS

### **Free Tier (Spark Plan):**
- **Reads:** 50,000 per day
- **Writes:** 20,000 per day  
- **Deletes:** 20,000 per day
- **Storage:** 1 GB

### **Paid Tier (Blaze Plan):**
- **Reads:** Unlimited (pay per read)
  - $0.06 per 100,000 reads
- **Writes:** Unlimited (pay per write)
  - $0.18 per 100,000 writes
- **Deletes:** Unlimited (pay per delete)
  - $0.02 per 100,000 deletes
- **Storage:** Unlimited
  - $0.18 per GB/month

---

## 🚀 PERFORMANCE LIMITS

| Operation | Limit |
|-----------|-------|
| **Maximum sustained writes per second per document** | 1 write/second |
| **Maximum sustained writes per second per database** | 10,000 writes/second (then scales) |
| **Maximum reads per second** | Unlimited (auto-scales) |
| **Maximum size of a query result** | Unlimited (but bandwidth costs!) |

---

## 📦 ARRAY & MAP LIMITS

| Type | Limit |
|------|-------|
| **Maximum array size** | 1 MB (within document limit) |
| **Maximum array elements** | ~20,000 (depends on element size) |
| **Maximum map size** | 1 MB (within document limit) |
| **Maximum map keys** | Unlimited (within size limit) |

---

## 🎯 REAL-WORLD IMPACT ON YOUR APP

### **Scenario: Nested Plans (Current Structure)**

**Child Document Structure:**
```javascript
{
  child_name: "yashna",      // ~10 bytes
  child_age: 6,              // ~5 bytes  
  interests: [...],          // ~200 bytes
  plans: {                   // ⚠️ THE PROBLEM
    "October2025": {...},    // 84 KB
    "November2025": {...},   // 84 KB
    "December2025": {...},   // 84 KB
    // ... 9 more months
  }
}
```

**Calculation:**
- 1 plan ≈ 84 KB
- 12 plans ≈ 1,008 KB = **0.98 MB**
- **You can fit ONLY 12 plans before hitting 1 MB limit!**

### **Scenario: Subcollection Plans (Recommended)**

**Child Document:**
```javascript
{
  child_name: "yashna",     // ~10 bytes
  child_age: 6,             // ~5 bytes
  interests: [...],         // ~200 bytes
  // Total: ~500 bytes
}
```

**Plans Subcollection:**
```
/plans/
├── plan_001 (84 KB)
├── plan_002 (84 KB)
├── plan_003 (84 KB)
├── ... 
└── plan_1000 (84 KB)  ← Can store 1000+ plans!
```

**Benefits:**
- ✅ Child document stays tiny (< 1 KB)
- ✅ Each plan has its own 1 MB limit
- ✅ Can store unlimited plans
- ✅ Load only plans you need

---

## 💰 COST COMPARISON

### **Reading 1 Child with 10 Nested Plans:**
- **Reads:** 1 document read
- **Data transferred:** 840 KB
- **Cost:** $0.000006 (1 read)

### **Reading 1 Child + 1 Latest Plan (Subcollection):**
- **Reads:** 2 document reads (child + 1 plan)
- **Data transferred:** 85 KB
- **Cost:** $0.000012 (2 reads)

**BUT:** If you only need child info (common case):
- **Nested:** Must load all 840 KB
- **Subcollection:** Load only 1 KB
- **Savings:** 99% bandwidth!

---

## 🎲 SPECIAL LIMITS TO WATCH

### **1. Composite Index Limits**
- **Maximum composite indexes:** 200 per database
- **Maximum fields per composite index:** 100

### **2. Security Rules**
- **Maximum size of security rules:** 256 KB
- **Maximum rule depth:** 10 levels
- **Maximum rule evaluation time:** 10 seconds

### **3. Cloud Functions Integration**
- **Maximum function execution time:** 540 seconds (9 minutes)
- **Maximum concurrent executions:** 1,000 (then scales)

### **4. Real-time Listeners**
- **Maximum concurrent listeners per client:** 100
- **Maximum listener result size:** Unlimited (but bandwidth!)

---

## ⚠️ COMMON MISTAKES & HOW TO AVOID

### **Mistake 1: Storing Arrays of Objects**
```javascript
// ❌ BAD: Can hit 1 MB limit quickly
plans: [
  { week1: {...}, week2: {...} },  // 84 KB each
  { week1: {...}, week2: {...} },
  // ...
]
```

**Solution:** Use subcollection instead!

### **Mistake 2: Storing Large Text Fields**
```javascript
// ❌ BAD: Description could be huge
description: "Very long text..." // Could be 500 KB!
```

**Solution:** Store large text in Cloud Storage, keep reference in Firestore.

### **Mistake 3: Deeply Nested Objects**
```javascript
// ❌ BAD: Hard to query, can hit 20-level depth limit
user.profile.settings.preferences.notifications.email.frequency...
```

**Solution:** Flatten structure or use subcollections.

---

## 📊 YOUR APP'S CURRENT USAGE

Based on analysis:
- **Documents:** 159 total (2 users, 1 child, 156 logs/executions)
- **Largest document:** 84 KB (yashna's child doc with nested plan)
- **Storage used:** ~500 KB total
- **Daily reads:** ~10-50 (very low)
- **Daily writes:** ~5-20 (very low)

**Status:** Well within free tier limits! ✅

---

## 🎯 RECOMMENDATIONS FOR YOUR APP

### **1. Move Plans to Subcollection** (Critical)
- **Why:** Will hit 1 MB limit with 12 plans
- **Impact:** Prevent future errors

### **2. Consider Plan Size Optimization**
- Current: 84 KB per plan
- Could optimize to: ~30-40 KB
- **How:** Store only essential data, remove redundant fields

### **3. Implement Pagination**
- Don't load all plans at once
- Load 5-10 recent plans
- **Benefit:** Faster load times, lower costs

### **4. Archive Old Plans**
- Move plans >1 year old to separate collection
- Or export to Cloud Storage
- **Benefit:** Keep active data small

---

## 📚 RESOURCES

- [Official Firestore Limits](https://firebase.google.com/docs/firestore/quotas)
- [Firestore Pricing](https://firebase.google.com/pricing)
- [Best Practices](https://firebase.google.com/docs/firestore/best-practices)

