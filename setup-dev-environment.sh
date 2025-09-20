#!/bin/bash

# Development Environment Setup Script
# Sets up the new development workflow

echo "🚀 Setting up Development Environment..."

# Make scripts executable
chmod +x dev-local.sh
chmod +x dev-staging.sh  
chmod +x dev-production.sh
chmod +x deploy-staging.sh
chmod +x deploy-cloud-run.sh

# Create logs directory
mkdir -p logs

# Copy local environment file to .env
cp env.local .env

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Your new development workflow:"
echo ""
echo "1. 🏠 LOCAL DEVELOPMENT (Daily work):"
echo "   ./dev-local.sh"
echo "   # or: npm run dev:local"
echo ""
echo "2. 🧪 STAGING TESTING (Before production):"
echo "   ./deploy-staging.sh"
echo "   ./dev-staging.sh"
echo "   # or: npm run deploy:staging && npm run dev:staging"
echo ""
echo "3. 🌐 PRODUCTION DEPLOYMENT (Final step):"
echo "   ./deploy-cloud-run.sh"
echo "   # or: npm run deploy:production"
echo ""
echo "4. 🧪 TEST ENVIRONMENTS:"
echo "   node test-environment.js"
echo "   # or: npm run test:env"
echo ""
echo "📖 Read DEVELOPMENT_WORKFLOW.md for detailed instructions"
echo ""
echo "🎉 You're ready to develop without deployment frustrations!"
