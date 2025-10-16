#!/bin/bash

# Production Development Script
# Switches to production environment

echo "🌐 Switching to PRODUCTION environment..."

# Copy production environment file
cp env.production .env

# Build and start frontend with production config
echo "🚀 Starting frontend with production configuration..."
npm start
