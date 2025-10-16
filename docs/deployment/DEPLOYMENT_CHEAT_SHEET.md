# 🚀 Deployment Cheat Sheet - One Page Reference

## ⚡ **3 Commands You Need**

```bash
# 1. Check status
cat CURRENT_VERSION.txt

# 2. Deploy
./deploy.sh

# 3. Rollback (emergency)
./rollback-production.sh
```

---

## 📋 **Standard Workflow (Every Time)**

```
1. cat CURRENT_VERSION.txt     → Check where you are
2. [Make changes & test]        → Work locally
3. ./deploy.sh                  → Deploy to staging
4. [Test staging URL]           → Verify everything
5. ./deploy.sh                  → Deploy to production
6. [Verify production]          → Check live site
7. [Monitor for 30 min]         → Watch for issues
```

**Time**: 20-50 minutes total

---

## 🏷️ **Version Numbers**

| Change Type | Example | Version |
|-------------|---------|---------|
| Bug fix | Fix spacing | v1.3.0 → **v1.3.1** |
| New feature | Add page | v1.3.0 → **v1.4.0** |
| Major change | Redesign | v1.3.0 → **v2.0.0** |

**Script calculates automatically when you select type!**

---

## 📊 **Tracking Files**

| File | Shows |
|------|-------|
| `CURRENT_VERSION.txt` | Current version, last deploy |
| `DEPLOYMENT_LOG.md` | When deployed, by whom, status |
| `CHANGELOG.md` | What changed in each version |

**All auto-updated by scripts!**

---

## 🔄 **Rollback (30 Seconds)**

```bash
./rollback-production.sh
# Enter version: v1.2.0
# Confirm: yes
# Done!
```

---

## ✅ **Today's Deploy**

**Your navbar changes**:
- Version: **v1.3.0** (MINOR)
- Rollback to: v1.2.0
- Command: `./deploy.sh`

---

## 📚 **Help Files**

- Quick guide: `DEPLOYMENT_QUICK_START.md`
- Full guide: `STANDARD_DEPLOYMENT_PROCEDURE.md`
- Version help: `VERSION_CONTROL_GUIDE.md`

---

**Print this page and keep it handy!** 📋

