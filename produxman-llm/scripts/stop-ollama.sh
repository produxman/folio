#!/bin/bash 
# Make the script strict: stop if a command fails, a variable is unset, or a pipeline fails
set -euo pipefail
# Load .env safely (auto-exports all keys)
set -a
source ../.env
set +a
# ========================================================================
# Settings (from .env with fallbacks)
PY_FILE="${PY_FILE:-app/server.py}"
FLASK_HOST="${FLASK_HOST:-0.0.0.0}"
FLASK_PORT="${FLASK_PORT:-3000}"
OLLAMA_HOST_BIND="${OLLAMA_HOST_BIND:-0.0.0.0:11434}"
OLLAMA_PORT="${OLLAMA_HOST_BIND##*:}"
MODEL="${MODEL_NAME}"
# ========================================================================
# clears the stage by killing any leftovers from previous runs: Old waitress, ollama serve, ollama run, python flask app, ngrok
echo "🛑 Killing previous processes..."
pkill -f "waitress-serve" || true
pkill -f "ollama serve" || true
pkill -f "ollama run ${MODEL}" || true
pkill -f "python3 ${PY_FILE}" || true
pkill -f "ngrok start flask" || true
# free ports just in case
kill -9 "$(lsof -t -i :"${FLASK_PORT}"  -sTCP:LISTEN)" 2>/dev/null || true
kill -9 "$(lsof -t -i :"${OLLAMA_PORT}" -sTCP:LISTEN)" 2>/dev/null || true
sleep 1
# ========================================================================