#!/bin/bash

# Local Unified Development Script
# Starts all services and makes everything appear to run on port 3000

echo "🚀 Starting Unified Development Environment..."
echo "🎯 Everything will appear to run on port 3000"

# Function to cleanup background processes
cleanup() {
    echo "🧹 Cleaning up background processes..."
    pkill -f "python.*main_agents.py" 2>/dev/null || true
    pkill -f "python.*warehouse_api.py" 2>/dev/null || true
    pkill -f "react-scripts" 2>/dev/null || true
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "📦 Creating virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
fi

# Activate virtual environment and install dependencies
echo "📦 Installing backend dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt >/dev/null 2>&1
pip install -r requirements_api.txt >/dev/null 2>&1
cd ..

# Start backend services in background
echo "🤖 Starting LLM Agents backend..."
cd backend
source venv/bin/activate
python main_agents.py > ../logs/llm-agents.log 2>&1 &
LLM_PID=$!
cd ..

echo "🏭 Starting Warehouse API backend..."
cd backend
source venv/bin/activate
python warehouse_api.py > ../logs/warehouse-api.log 2>&1 &
WAREHOUSE_PID=$!
cd ..

# Create logs directory if it doesn't exist
mkdir -p logs

# Wait for backends to start
echo "⏳ Waiting for backend services to start..."
sleep 5

# Check if backends are running
if ! curl -s http://localhost:8000/ >/dev/null 2>&1; then
    echo "❌ LLM Agents backend failed to start"
    cleanup
fi

if ! curl -s http://localhost:5001/api/warehouse/health >/dev/null 2>&1; then
    echo "❌ Warehouse API backend failed to start"
    cleanup
fi

echo "✅ Backend services are running!"
echo "   LLM Agents: http://localhost:8000"
echo "   Warehouse API: http://localhost:5001"

# Start frontend
echo "🌐 Starting frontend on port 3000..."
npm start > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

echo ""
echo "🎉 Unified development environment started!"
echo "🌐 Frontend: http://localhost:3000"
echo "🤖 LLM Backend: http://localhost:8000"
echo "🏭 Warehouse Backend: http://localhost:5001"
echo ""
echo "📝 Logs are available in the logs/ directory"
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Wait for user to stop
wait
