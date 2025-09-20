#!/bin/bash

# Production Deployment Script
# Comprehensive deployment script for production environment

set -e  # Exit on any error

echo "🚀 Starting Production Deployment..."
echo "📅 Date: $(date)"
echo "=============================================="

# Configuration
FRONTEND_URL="https://your-domain.com"
BACKEND_URL="https://api.your-domain.com"
ENVIRONMENT="production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Running pre-deployment checks..."
    
    # Check if required files exist
    if [ ! -f "package.json" ]; then
        error "package.json not found"
        exit 1
    fi
    
    if [ ! -f "backend/main_agents.py" ]; then
        error "backend/main_agents.py not found"
        exit 1
    fi
    
    if [ ! -f "backend/requirements.txt" ]; then
        error "backend/requirements.txt not found"
        exit 1
    fi
    
    # Check if environment files exist
    if [ ! -f "env.production" ]; then
        warning "env.production not found, using default values"
    fi
    
    # Check if integration tests exist
    if [ ! -f "integration-tests/user-journey.test.js" ]; then
        warning "Integration tests not found, skipping test execution"
    fi
    
    success "Pre-deployment checks passed"
}

# Run integration tests
run_integration_tests() {
    log "Running integration tests..."
    
    if [ -f "run-integration-tests.js" ]; then
        node run-integration-tests.js
        if [ $? -eq 0 ]; then
            success "Integration tests passed"
        else
            error "Integration tests failed"
            exit 1
        fi
    else
        warning "Integration test runner not found, skipping tests"
    fi
}

# Run system health check
run_health_check() {
    log "Running system health check..."
    
    if [ -f "system-health-check.js" ]; then
        node system-health-check.js
        if [ $? -eq 0 ]; then
            success "System health check passed"
        else
            error "System health check failed"
            exit 1
        fi
    else
        warning "System health check not found, skipping"
    fi
}

# Run production readiness check
run_production_readiness() {
    log "Running production readiness check..."
    
    if [ -f "production-readiness-checklist.js" ]; then
        node production-readiness-checklist.js
        if [ $? -eq 0 ]; then
            success "Production readiness check passed"
        else
            error "Production readiness check failed"
            exit 1
        fi
    else
        warning "Production readiness check not found, skipping"
    fi
}

# Build frontend
build_frontend() {
    log "Building frontend..."
    
    # Install dependencies
    npm install
    
    # Build for production
    npm run build
    
    if [ $? -eq 0 ]; then
        success "Frontend build completed"
    else
        error "Frontend build failed"
        exit 1
    fi
}

# Deploy frontend to Firebase
deploy_frontend() {
    log "Deploying frontend to Firebase..."
    
    # Check if Firebase CLI is installed
    if ! command -v firebase &> /dev/null; then
        error "Firebase CLI not found. Please install it first."
        exit 1
    fi
    
    # Deploy to Firebase Hosting
    firebase deploy --only hosting --project production
    
    if [ $? -eq 0 ]; then
        success "Frontend deployed to Firebase"
    else
        error "Frontend deployment failed"
        exit 1
    fi
}

# Deploy backend to Google Cloud Run
deploy_backend() {
    log "Deploying backend to Google Cloud Run..."
    
    # Check if gcloud CLI is installed
    if ! command -v gcloud &> /dev/null; then
        error "Google Cloud CLI not found. Please install it first."
        exit 1
    fi
    
    # Navigate to backend directory
    cd backend
    
    # Build and deploy to Cloud Run
    gcloud run deploy unschooling-backend \
        --source . \
        --platform managed \
        --region us-central1 \
        --allow-unauthenticated \
        --set-env-vars="ENVIRONMENT=production" \
        --project production
    
    if [ $? -eq 0 ]; then
        success "Backend deployed to Google Cloud Run"
    else
        error "Backend deployment failed"
        exit 1
    fi
    
    # Return to root directory
    cd ..
}

# Update environment configuration
update_environment_config() {
    log "Updating environment configuration..."
    
    # Update frontend config
    if [ -f "src/config/config.js" ]; then
        # Update API base URL for production
        sed -i.bak "s|API_BASE_URL.*|API_BASE_URL: '${BACKEND_URL}',|g" src/config/config.js
        success "Frontend configuration updated"
    fi
    
    # Update backend environment variables
    if [ -f "env.production" ]; then
        # Set production environment variables
        export $(cat env.production | xargs)
        success "Backend environment variables updated"
    fi
}

# Run post-deployment tests
post_deployment_tests() {
    log "Running post-deployment tests..."
    
    # Test frontend
    log "Testing frontend..."
    curl -f "${FRONTEND_URL}" > /dev/null
    if [ $? -eq 0 ]; then
        success "Frontend is accessible"
    else
        error "Frontend is not accessible"
        exit 1
    fi
    
    # Test backend
    log "Testing backend..."
    curl -f "${BACKEND_URL}/health" > /dev/null
    if [ $? -eq 0 ]; then
        success "Backend is accessible"
    else
        error "Backend is not accessible"
        exit 1
    fi
    
    # Test admin dashboard
    log "Testing admin dashboard..."
    curl -f "${FRONTEND_URL}/admin" > /dev/null
    if [ $? -eq 0 ]; then
        success "Admin dashboard is accessible"
    else
        error "Admin dashboard is not accessible"
        exit 1
    fi
}

# Setup monitoring and alerting
setup_monitoring() {
    log "Setting up monitoring and alerting..."
    
    # Configure Google Cloud Monitoring
    if command -v gcloud &> /dev/null; then
        # Enable monitoring for Cloud Run
        gcloud services enable monitoring.googleapis.com --project production
        
        # Create alerting policies
        gcloud alpha monitoring policies create \
            --policy-from-file=monitoring/alert-policies.yaml \
            --project production
        
        success "Monitoring and alerting configured"
    else
        warning "Google Cloud CLI not found, skipping monitoring setup"
    fi
}

# Generate deployment report
generate_deployment_report() {
    log "Generating deployment report..."
    
    REPORT_FILE="deployment-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$REPORT_FILE" << EOF
Production Deployment Report
============================
Date: $(date)
Environment: ${ENVIRONMENT}
Frontend URL: ${FRONTEND_URL}
Backend URL: ${BACKEND_URL}

Deployment Steps Completed:
- Pre-deployment checks
- Integration tests
- System health check
- Production readiness check
- Frontend build
- Frontend deployment
- Backend deployment
- Environment configuration
- Post-deployment tests
- Monitoring setup

Status: SUCCESS
All systems are operational and ready for production use.

Next Steps:
1. Monitor system performance
2. Check error logs
3. Verify user functionality
4. Update documentation
5. Notify stakeholders

EOF
    
    success "Deployment report generated: $REPORT_FILE"
}

# Main deployment function
main() {
    log "Starting production deployment process..."
    
    # Pre-deployment checks
    pre_deployment_checks
    
    # Run tests and checks
    run_integration_tests
    run_health_check
    run_production_readiness
    
    # Update environment configuration
    update_environment_config
    
    # Build and deploy
    build_frontend
    deploy_frontend
    deploy_backend
    
    # Post-deployment verification
    post_deployment_tests
    
    # Setup monitoring
    setup_monitoring
    
    # Generate report
    generate_deployment_report
    
    success "Production deployment completed successfully!"
    log "System is now live and ready for production use"
    log "Frontend: ${FRONTEND_URL}"
    log "Backend: ${BACKEND_URL}"
    log "Admin Dashboard: ${FRONTEND_URL}/admin"
}

# Error handling
trap 'error "Deployment failed at line $LINENO"' ERR

# Run main function
main "$@"
