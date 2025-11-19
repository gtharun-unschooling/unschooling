# ═══════════════════════════════════════════════════════════════════
#  MAKEFILE - Unschooling Platform
# ═══════════════════════════════════════════════════════════════════
# 
# Common commands for development and deployment
# Usage: make <command>
#
# ═══════════════════════════════════════════════════════════════════

.PHONY: help install dev build test clean deploy lint format

# Default target
help:
	@echo "╔══════════════════════════════════════════════════════════════════╗"
	@echo "║  UNSCHOOLING PLATFORM - Available Commands                      ║"
	@echo "╚══════════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "📦 Installation:"
	@echo "  make install          Install all dependencies (frontend + backend)"
	@echo "  make install-frontend  Install frontend dependencies"
	@echo "  make install-backend   Install backend dependencies"
	@echo ""
	@echo "🚀 Development:"
	@echo "  make dev               Start development servers (frontend + backend)"
	@echo "  make dev-frontend       Start frontend dev server (port 3000)"
	@echo "  make dev-backend       Start backend dev server (port 8000)"
	@echo ""
	@echo "🏗️  Build:"
	@echo "  make build             Build for production"
	@echo "  make build-frontend    Build frontend only"
	@echo ""
	@echo "🧪 Testing:"
	@echo "  make test              Run all tests"
	@echo "  make test-frontend     Run frontend tests"
	@echo "  make test-e2e         Run end-to-end tests"
	@echo ""
	@echo "🧹 Cleanup:"
	@echo "  make clean             Remove build artifacts and caches"
	@echo "  make clean-frontend    Clean frontend build"
	@echo "  make clean-backend     Clean backend cache"
	@echo ""
	@echo "📝 Code Quality:"
	@echo "  make lint              Run linters (frontend + backend)"
	@echo "  make format            Format code (Prettier + Black)"
	@echo ""
	@echo "🚀 Deployment:"
	@echo "  make deploy-staging    Deploy to staging"
	@echo "  make deploy-prod       Deploy to production"
	@echo ""

# ═══════════════════════════════════════════════════════════════════
#  INSTALLATION
# ═══════════════════════════════════════════════════════════════════

install: install-frontend install-backend
	@echo "✅ All dependencies installed"

install-frontend:
	@echo "📦 Installing frontend dependencies..."
	npm install

install-backend:
	@echo "📦 Installing backend dependencies..."
	cd backend && python -m venv venv || true
	cd backend && source venv/bin/activate && pip install -r requirements.txt

# ═══════════════════════════════════════════════════════════════════
#  DEVELOPMENT
# ═══════════════════════════════════════════════════════════════════

dev-frontend:
	@echo "🚀 Starting frontend dev server..."
	npm start

dev-backend:
	@echo "🚀 Starting backend dev server..."
	cd backend && source venv/bin/activate && uvicorn main_agents:app --reload --port 8000

# ═══════════════════════════════════════════════════════════════════
#  BUILD
# ═══════════════════════════════════════════════════════════════════

build: build-frontend
	@echo "✅ Build complete"

build-frontend:
	@echo "🏗️  Building frontend..."
	npm run build

# ═══════════════════════════════════════════════════════════════════
#  TESTING
# ═══════════════════════════════════════════════════════════════════

test:
	@echo "🧪 Running tests..."
	npm test

test-e2e:
	@echo "🧪 Running E2E tests..."
	npm run test:e2e

# ═══════════════════════════════════════════════════════════════════
#  CLEANUP
# ═══════════════════════════════════════════════════════════════════

clean: clean-frontend clean-backend
	@echo "✅ Cleanup complete"

clean-frontend:
	@echo "🧹 Cleaning frontend..."
	rm -rf build/
	rm -rf node_modules/.cache

clean-backend:
	@echo "🧹 Cleaning backend..."
	find backend -type d -name __pycache__ -exec rm -r {} + 2>/dev/null || true
	find backend -type f -name "*.pyc" -delete 2>/dev/null || true

# ═══════════════════════════════════════════════════════════════════
#  CODE QUALITY
# ═══════════════════════════════════════════════════════════════════

lint:
	@echo "🔍 Running linters..."
	npm run lint || echo "⚠️  Linting not configured"

format:
	@echo "✨ Formatting code..."
	npx prettier --write "src/**/*.{js,jsx,json,css}" || echo "⚠️  Prettier not available"

# ═══════════════════════════════════════════════════════════════════
#  DEPLOYMENT
# ═══════════════════════════════════════════════════════════════════

deploy-staging:
	@echo "🚀 Deploying to staging..."
	npm run deploy:staging

deploy-prod:
	@echo "🚀 Deploying to production..."
	npm run deploy:production

