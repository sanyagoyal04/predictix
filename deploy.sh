#!/bin/bash
# ================================================================
# PredictiX Deployment Script
# Runs the complete DevOps stack locally using Docker Compose
# ================================================================

set -e

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║     PredictiX — DevOps with AI Deployment   ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[✓]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
error()   { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# Step 1: Check Python
info "Checking Python..."
python3 --version || error "Python3 not found. Install from python.org"
success "Python OK"

# Step 2: Check ML dependencies
info "Installing ML dependencies..."
pip3 install scikit-learn numpy pandas joblib -q
success "ML dependencies installed"

# Step 3: Train ML models
info "Training ML models..."
cd ML

if [ ! -f "models/heart_model.pkl" ]; then
    echo "  → Training Heart Disease model (Logistic Regression)..."
    python3 train_heart.py
    success "Heart model trained"
else
    success "Heart model already exists — skipping"
fi

if [ ! -f "models/diabetes_model.pkl" ]; then
    echo "  → Training Diabetes model (SVM)..."
    python3 train_diabetes.py
    success "Diabetes model trained"
else
    success "Diabetes model already exists — skipping"
fi

cd ..

# Step 4: Check Docker
info "Checking Docker..."
if ! command -v docker &> /dev/null; then
    warn "Docker not found. Please install Docker Desktop from:"
    echo "     https://www.docker.com/products/docker-desktop/"
    echo ""
    warn "Falling back to LOCAL deployment (Node.js + MongoDB)..."
    echo ""
    exec bash deploy_local.sh
fi

if ! docker info &> /dev/null; then
    error "Docker is installed but not running. Please start Docker Desktop."
fi
success "Docker is running"

# Step 5: Create .env if not exists
if [ ! -f ".env" ]; then
    info "Creating environment file..."
    cat > .env << EOF
JWT_SECRET=$(openssl rand -hex 32)
GRAFANA_PASSWORD=predictix_admin
EOF
    success ".env created"
fi

# Step 6: Build and deploy
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║         Starting Docker Compose...           ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

info "Building and starting all services..."
docker-compose up --build -d

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║          🚀 Deployment Complete!             ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
success "Frontend:   http://localhost:80"
success "Backend:    http://localhost:5001/health"
success "Prometheus: http://localhost:9090"
success "Grafana:    http://localhost:3000  (admin/predictix_admin)"
echo ""
info "Run 'docker-compose logs -f' to view logs"
info "Run 'docker-compose down' to stop"
