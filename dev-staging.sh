#!/bin/bash

# Staging Development Script
# Switches to staging environment for testing

echo "🧪 Switching to STAGING environment..."

# Copy staging environment file
cp env.staging .env

# Build and start frontend with staging config
echo "🚀 Starting frontend with staging configuration..."
npm start
