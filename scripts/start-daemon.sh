#!/bin/bash

# ============================================================================
# FORUM ANTI PENYIMPANGAN - DAEMON STARTUP (Run Server 24/7)
# ============================================================================
# Usage: bash scripts/start-daemon.sh
# 
# This script starts the server as a background daemon using different methods:
# 1. tmux (best - interactive, easy management)
# 2. nohup (simple, less control)
# 3. screen (alternative to tmux)
# ============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT=3003
SESSION_NAME="forum-server"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "============================================================================"
echo "Forum Anti Penyimpangan - Daemon Server Startup"
echo "============================================================================"
echo ""

cd "$PROJECT_DIR"

# ============================================================================
# METHOD 1: TMUX (RECOMMENDED)
# ============================================================================

if command -v tmux &> /dev/null; then
    echo -e "${YELLOW}[INFO]${NC} Using tmux (recommended)"
    echo ""
    
    # Check if session already exists
    if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
        echo -e "${YELLOW}[INFO]${NC} Session '$SESSION_NAME' already exists"
        echo "Existing sessions:"
        tmux list-sessions
        echo ""
        echo "To attach to running server:"
        echo "  tmux attach -t $SESSION_NAME"
        echo ""
        echo "To kill the server:"
        echo "  tmux kill-session -t $SESSION_NAME"
        exit 0
    fi
    
    echo -e "${YELLOW}[INFO]${NC} Creating tmux session: $SESSION_NAME"
    
    # Create new session with server startup
    tmux new-session -d -s "$SESSION_NAME" -x 200 -y 50 \
        "cd '$PROJECT_DIR' && NODE_ENV=production pnpm start"
    
    echo -e "${GREEN}[OK]${NC} Server started in tmux session: $SESSION_NAME"
    echo ""
    echo "Server is running on port $PORT"
    echo ""
    echo "Useful commands:"
    echo "  tmux attach -t $SESSION_NAME      # View live output"
    echo "  tmux detach                        # Detach from session (Ctrl+B, then D)"
    echo "  tmux kill-session -t $SESSION_NAME # Stop the server"
    echo "  tmux list-sessions                 # List all sessions"
    echo ""
    exit 0
fi

# ============================================================================
# METHOD 2: NOHUP (FALLBACK)
# ============================================================================

if command -v nohup &> /dev/null; then
    echo -e "${YELLOW}[INFO]${NC} tmux not found, using nohup"
    echo ""
    
    # Start server with nohup
    nohup env NODE_ENV=production pnpm start > server.log 2>&1 &
    PID=$!
    
    echo $PID > .server.pid
    
    echo -e "${GREEN}[OK]${NC} Server started with PID: $PID"
    echo ""
    echo "Server is running on port $PORT"
    echo ""
    echo "Useful commands:"
    echo "  tail -f server.log                     # View live output"
    echo "  cat .server.pid                        # Get server PID"
    echo "  kill \$(cat .server.pid)               # Stop the server"
    echo "  ps aux | grep 'next start'             # Check if running"
    echo ""
    exit 0
fi

# ============================================================================
# METHOD 3: SCREEN (FALLBACK)
# ============================================================================

if command -v screen &> /dev/null; then
    echo -e "${YELLOW}[INFO]${NC} Using screen"
    echo ""
    
    # Check if session already exists
    if screen -ls "$SESSION_NAME" 2>/dev/null | grep -q "$SESSION_NAME"; then
        echo -e "${YELLOW}[INFO]${NC} Screen session '$SESSION_NAME' already exists"
        echo ""
        echo "To attach to running server:"
        echo "  screen -r $SESSION_NAME"
        exit 0
    fi
    
    echo -e "${YELLOW}[INFO]${NC} Creating screen session: $SESSION_NAME"
    
    screen -dmS "$SESSION_NAME" bash -c "cd '$PROJECT_DIR' && NODE_ENV=production pnpm start"
    
    echo -e "${GREEN}[OK]${NC} Server started in screen session: $SESSION_NAME"
    echo ""
    echo "Server is running on port $PORT"
    echo ""
    echo "Useful commands:"
    echo "  screen -r $SESSION_NAME               # Attach to session"
    echo "  screen -ls                             # List sessions"
    echo "  screen -XS $SESSION_NAME quit          # Stop the server"
    echo ""
    exit 0
fi

# ============================================================================
# ERROR: NO METHOD AVAILABLE
# ============================================================================

echo -e "${RED}[ERROR]${NC} No daemon method available!"
echo ""
echo "Install one of these:"
echo "  apt install tmux    # Recommended"
echo "  apt install screen"
echo ""
echo "Or run server directly:"
echo "  bash scripts/start-termux.sh"
exit 1
