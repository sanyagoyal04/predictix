#!/bin/bash
# Stop all PredictiX services
export PATH="/opt/homebrew/bin:$PATH"

pkill -f "node src/index" 2>/dev/null && echo "✓ Backend stopped" || echo "Backend was not running"
pkill -f "vite" 2>/dev/null && echo "✓ Frontend stopped" || echo "Frontend was not running"
brew services stop mongodb/brew/mongodb-community 2>/dev/null && echo "✓ MongoDB stopped" || true
echo "All services stopped."
