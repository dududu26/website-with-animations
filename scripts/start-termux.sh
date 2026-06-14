#!/bin/bash

# ============================================================================
# FORUM ANTI PENYIMPANGAN - TERMUX SERVER STARTUP SCRIPT
# ============================================================================
# Usage: bash scripts/start-termux.sh
# Or: chmod +x scripts/start-termux.sh && ./scripts/start-termux.sh
#
# This script prepares and starts the Node.js server on port 3003
# ============================================================================

set -e  # Exit on error

echo "============================================================================"
echo "Forum Anti Penyimpangan - Termux Server Startup"
echo "============================================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================================================
# CONFIGURATION
# ============================================================================
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT=3003
NODE_ENV="production"

echo -e "${YELLOW}[INFO]${NC} Project directory: $PROJECT_DIR"
echo -e "${YELLOW}[INFO]${NC} Port: $PORT"
echo -e "${YELLOW}[INFO]${NC} Environment: $NODE_ENV"
echo ""

# ============================================================================
# CHECK PREREQUISITES
# ============================================================================
echo -e "${YELLOW}[STEP 1]${NC} Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Node.js is not installed!"
    echo "Install Node.js with: apt update && apt install nodejs-lts"
    exit 1
fi

# Check npm or pnpm
if ! command -v pnpm &> /dev/null && ! command -v npm &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} pnpm or npm is not installed!"
    echo "Install pnpm with: npm install -g pnpm"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}[OK]${NC} Node.js version: $NODE_VERSION"

# Get package manager
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
else
    PKG_MANAGER="npm"
fi
echo -e "${GREEN}[OK]${NC} Package manager: $PKG_MANAGER"
echo ""

# ============================================================================
# CHECK ENVIRONMENT VARIABLES
# ============================================================================
echo -e "${YELLOW}[STEP 2]${NC} Checking environment variables..."

cd "$PROJECT_DIR"

if [ ! -f ".env.production" ] && [ ! -f ".env.local" ]; then
    echo -e "${RED}[ERROR]${NC} No .env.production or .env.local file found!"
    echo ""
    echo "Please create .env.production with required variables:"
    echo "  DATABASE_URL=postgresql://..."
    echo "  BETTER_AUTH_SECRET=..."
    echo "  BETTER_AUTH_URL=https://anti-penyimpangan.lombok26.biz.id"
    echo "  NEXT_PUBLIC_APP_URL=https://anti-penyimpangan.lombok26.biz.id"
    echo ""
    echo "Or copy from .env.example:"
    echo "  cp .env.example .env.production"
    exit 1
fi

# Use .env.production if available, else .env.local
if [ -f ".env.production" ]; then
    ENV_FILE=".env.production"
else
    ENV_FILE=".env.local"
fi
echo -e "${GREEN}[OK]${NC} Using environment file: $ENV_FILE"

# Check required variables
if grep -q "DATABASE_URL=" "$ENV_FILE"; then
    echo -e "${GREEN}[OK]${NC} DATABASE_URL is set"
else
    echo -e "${RED}[ERROR]${NC} DATABASE_URL is not set in $ENV_FILE"
    exit 1
fi

if grep -q "BETTER_AUTH_SECRET=" "$ENV_FILE"; then
    echo -e "${GREEN}[OK]${NC} BETTER_AUTH_SECRET is set"
else
    echo -e "${RED}[ERROR]${NC} BETTER_AUTH_SECRET is not set in $ENV_FILE"
    exit 1
fi

echo ""

# ============================================================================
# INSTALL DEPENDENCIES
# ============================================================================
echo -e "${YELLOW}[STEP 3]${NC} Installing dependencies..."

if [ ! -d "node_modules" ]; then
    echo "Running: $PKG_MANAGER install"
    $PKG_MANAGER install
    echo -e "${GREEN}[OK]${NC} Dependencies installed"
else
    echo -e "${GREEN}[OK]${NC} Dependencies already installed"
fi
echo ""

# ============================================================================
# BUILD PROJECT
# ============================================================================
echo -e "${YELLOW}[STEP 4]${NC} Building project..."

if [ ! -d ".next" ]; then
    echo "Running: $PKG_MANAGER build"
    $PKG_MANAGER build
    echo -e "${GREEN}[OK]${NC} Project built successfully"
else
    echo -e "${GREEN}[OK]${NC} Project already built"
fi
echo ""

# ============================================================================
# START SERVER
# ============================================================================
echo -e "${YELLOW}[STEP 5]${NC} Starting server..."
echo ""
echo "============================================================================"
echo -e "${GREEN}✓ Server starting on port $PORT${NC}"
echo "============================================================================"
echo ""
echo "Access URLs:"
echo "  Local WiFi:  http://192.168.x.x:3003"
echo "  With Domain: https://anti-penyimpangan.lombok26.biz.id"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "============================================================================"
echo ""

# Set environment and start server
NODE_ENV=$NODE_ENV $PKG_MANAGER start

# This line is reached only if server crashes
exit 1
