#!/bin/bash

# Local Development Script
# Switches to local environment and starts all services

echo "🏠 Switching to LOCAL development environment..."

# Copy local environment file
cp env.local .env

# Start local unified environment
echo "🚀 Starting local development environment..."
./start-local-unified.sh
