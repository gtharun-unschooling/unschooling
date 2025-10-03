# 🚀 QUICK GIT COMMANDS - DAILY REFERENCE

## **📋 MOST COMMON COMMANDS:**

### **Start Working:**
```bash
git checkout development
git pull origin development
```

### **Make Changes:**
```bash
git add .
git commit -m "Describe your changes"
```

### **Deploy to Production:**
```bash
git checkout main
git merge development
git push origin main
./deploy-production.sh
```

### **Go Back to Development:**
```bash
git checkout development
```

## **🔍 CHECK STATUS:**
```bash
git status          # See current changes
git branch          # See all branches
git log --oneline   # See recent commits
```

## **🚨 EMERGENCY ROLLBACK:**
```bash
git checkout main
git revert HEAD     # Undo last commit
git push origin main
./deploy-production.sh
```

## **📱 SYNC WITH GITHUB:**
```bash
git push origin development
git push origin main
git push origin staging
```

## **🎯 CURRENT SITUATION:**
- You're on `development` branch
- Cookie consent fix is ready
- Ready to deploy to production

## **✅ NEXT STEP:**
Choose one:
1. Deploy now: `git checkout main && git merge development && ./deploy-production.sh`
2. Add more features first: Stay on development branch
