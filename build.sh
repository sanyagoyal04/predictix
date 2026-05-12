#!/bin/bash
set -e

echo "==> Installing Node.js dependencies..."
cd Backend && npm install
cd ..

echo "==> Installing Python ML dependencies..."
pip install scikit-learn numpy pandas joblib --quiet

echo "==> Verifying ML models exist..."
ls ML/models/
echo "==> Build complete!"
