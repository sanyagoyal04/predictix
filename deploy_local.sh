#!/bin/bash
# ================================================================
# PredictiX Local Deployment (No Docker Required)
# ================================================================

set -e

GREEN='\033[0;32m'; BLUE='\033[0;34m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[✓]${NC} $1"; }
error()   { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   PredictiX — Local Deployment (No Docker)  ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

export PATH="/opt/homebrew/bin:$PATH"

# Kill any old processes
info "Cleaning up old processes..."
pkill -f "node src/index" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 1
success "Cleaned up"

# Start MongoDB
info "Starting MongoDB..."
brew services start mongodb/brew/mongodb-community 2>/dev/null || true
sleep 3
mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1 && success "MongoDB running" || error "MongoDB failed to start"

# Train models
info "Training ML models..."
cd ML
[ ! -f "models/heart_model.pkl" ] && python3 train_heart.py || success "Heart model already trained"
[ ! -f "models/diabetes_model.pkl" ] && python3 train_diabetes.py || success "Diabetes model already trained"
cd ..

# Start Backend
info "Starting Backend (port 5001)..."
mkdir -p Backend/logs
PORT=5001 node Backend/src/index.js > /tmp/predictix_backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Check backend health
if curl -s http://localhost:5001/health > /dev/null 2>&1; then
    success "Backend running (PID: $BACKEND_PID)"
else
    error "Backend failed — check /tmp/predictix_backend.log"
fi

# Start Frontend
info "Starting Frontend (port 5173)..."
cd Frontend && npm run dev > /tmp/predictix_frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
sleep 3
success "Frontend running (PID: $FRONTEND_PID)"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║         🚀 PredictiX is LIVE!               ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
success "App:        http://localhost:5173"
success "API:        http://localhost:5001/health"
success "Metrics:    http://localhost:5001/metrics"
echo ""
echo -e "${YELLOW}PIDs saved — to stop: kill $BACKEND_PID $FRONTEND_PID${NC}"
echo "$BACKEND_PID $FRONTEND_PID" > /tmp/predictix_pids.txt

# Open browser
sleep 2
open http://localhost:5173 2>/dev/null || true
