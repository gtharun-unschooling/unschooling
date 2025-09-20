# 🚀 Development Workflow Guide

## Overview
This guide provides a clear, step-by-step approach to development that eliminates deployment frustrations and ensures reliable testing.

## 🏗️ Environment Strategy

### Three-Tier Environment System
1. **Local Development** (`local`) - Full local stack for rapid iteration
2. **Staging** (`staging`) - Cloud-based testing environment
3. **Production** (`production`) - Live environment

## 🛠️ Quick Start Commands

### Local Development (Recommended for daily work)
```bash
# Start everything locally
./dev-local.sh

# This will:
# - Switch to local environment config
# - Start Python backends locally
# - Start React frontend on port 3000
# - Everything runs on localhost
```

### Staging Testing (Before production)
```bash
# Deploy to staging first
./deploy-staging.sh

# Then test staging environment
./dev-staging.sh
```

### Production Deployment (Final step)
```bash
# Only after staging tests pass
./deploy-cloud-run.sh
```

## 📋 Development Workflow

### Daily Development Process
1. **Start Local Development**
   ```bash
   ./dev-local.sh
   ```
   - Make your changes
   - Test locally at http://localhost:3000
   - All backend services run locally

2. **Test Environment Health**
   ```bash
   node test-environment.js
   ```
   - Verifies all environments are working
   - Shows which services are healthy

3. **Deploy to Staging** (When ready to test cloud behavior)
   ```bash
   ./deploy-staging.sh
   ./dev-staging.sh
   ```
   - Tests your changes in cloud environment
   - Identifies production-like issues early

4. **Deploy to Production** (Only after staging passes)
   ```bash
   ./deploy-cloud-run.sh
   ```

## 🔧 Environment Configuration

### Environment Files
- `env.local` - Local development settings
- `env.staging` - Staging environment settings  
- `env.production` - Production environment settings

### Automatic Environment Detection
The app automatically detects which environment it's running in:
```javascript
import { getEnvironmentInfo, logEnvironmentInfo } from './src/config/config.js';

// Log current environment info
logEnvironmentInfo();
```

## 🧪 Testing Strategy

### Local Testing
- **Fast iteration** - Changes reflect immediately
- **Full control** - All services run locally
- **Debug friendly** - Easy to inspect and modify

### Staging Testing
- **Production-like** - Tests cloud services
- **Safe testing** - No impact on production users
- **Integration testing** - Tests full cloud stack

### Production Deployment
- **Only after staging validation**
- **Gradual rollout** possible with feature flags
- **Monitoring** and rollback capabilities

## 🚨 Troubleshooting

### Local Environment Issues
```bash
# Check if services are running
curl http://localhost:8000/health
curl http://localhost:5001/api/warehouse/health

# Restart local environment
./dev-local.sh
```

### Staging Environment Issues
```bash
# Test staging endpoints
node test-environment.js

# Redeploy staging
./deploy-staging.sh
```

### Production Issues
```bash
# Check production health
node test-environment.js

# Rollback if needed (redeploy previous version)
./deploy-cloud-run.sh
```

## 📊 Environment Status Dashboard

Run the environment tester to see status of all environments:
```bash
node test-environment.js
```

This will show:
- ✅ Healthy environments
- ❌ Unhealthy environments  
- 💡 Recommendations for next steps

## 🎯 Best Practices

### Development
1. **Always start with local development**
2. **Test locally first** - Make sure basic functionality works
3. **Use staging for cloud testing** - Don't deploy to production directly
4. **Test environment health** - Use the testing script regularly

### Deployment
1. **Local → Staging → Production** - Never skip staging
2. **Test after each deployment** - Verify everything works
3. **Monitor production** - Watch for issues after deployment
4. **Have rollback plan** - Know how to revert if needed

### Code Changes
1. **Small, incremental changes** - Easier to debug and rollback
2. **Test each change** - Don't accumulate multiple untested changes
3. **Use feature flags** - For gradual rollouts
4. **Document changes** - Keep track of what you're changing

## 🔄 Feature Flag System

The app includes feature flags for safe rollouts:
```javascript
// In your components
import { isFeatureEnabled } from './src/config/config.js';

if (isFeatureEnabled('NEW_FEATURE')) {
  // Show new feature
} else {
  // Show old feature
}
```

## 📈 Monitoring and Logs

### Local Logs
- Frontend: `logs/frontend.log`
- LLM Agents: `logs/llm-agents.log`
- Warehouse API: `logs/warehouse-api.log`

### Cloud Logs
```bash
# View Cloud Run logs
gcloud logs read --service=llm-agents --limit=50
gcloud logs read --service=warehouse-api --limit=50
```

## 🎉 Success Metrics

You'll know the workflow is working when:
- ✅ Local development is fast and reliable
- ✅ Staging catches issues before production
- ✅ Production deployments are smooth
- ✅ You can quickly switch between environments
- ✅ Testing is automated and comprehensive

## 🆘 Emergency Procedures

### If Production is Broken
1. **Check environment status**: `node test-environment.js`
2. **Redeploy previous version**: `./deploy-cloud-run.sh`
3. **Monitor logs**: Check Cloud Run logs for errors
4. **Rollback if needed**: Deploy known good version

### If Local Development is Broken
1. **Restart local environment**: `./dev-local.sh`
2. **Check service health**: Test local endpoints
3. **Clean restart**: Kill all processes and restart
4. **Check dependencies**: Ensure all packages are installed

---

## 🎯 Your New Development Flow

**Instead of**: Deploy → Test → Fix → Deploy → Test → Fix...

**You now have**: Local Test → Staging Test → Production Deploy

This eliminates the deployment-testing cycle and gives you confidence in your changes before they go live!
