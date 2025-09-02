#!/bin/bash 
# Make the script strict: stop if a command fails, a variable is unset, or a pipeline fails
set -euo pipefail
# Resolve project root (parent of scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
# Load .env safely (auto-exports all keys)
set -a
source "${PROJECT_ROOT}/.env"
set +a
# Ensure logs dir exists
mkdir -p "${PROJECT_ROOT}/logs"
# ========================================================================
# Settings (from .env with fallbacks)
PY_FILE_REL="${PY_FILE:-app/server.py}"          # keep .env value relative to project root
PY_FILE_ABS="${PROJECT_ROOT}/${PY_FILE_REL}"     # make it absolute
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
# Launch Ollama bound to OLLAMA_HOST_BIND, Logs go to ../logs/ollama-serve.log
echo "🧠 Starting Ollama Server on ${OLLAMA_HOST_BIND}..."
echo "===== $(date '+%Y-%m-%d %H:%M:%S') Starting Ollama Server =====" > "${PROJECT_ROOT}/logs/ollama-serve.log"
nohup env OLLAMA_HOST="${OLLAMA_HOST_BIND}" ollama serve >> "${PROJECT_ROOT}/logs/ollama-serve.log" 2>&1 &
# Wait until Ollama actually responds (checks /api/tags every 0.5s, max 20s). If it doesn’t, script bails out.
echo "⏳ Waiting for Ollama API..."
for i in {1..40}; do
  if curl -s "http://localhost:${OLLAMA_PORT}/api/tags" >/dev/null; then
    echo "✅ Ollama is up."
    break
  fi
  sleep 0.5
  [[ $i -eq 40 ]] && echo "❌ Ollama did not start (see ${PROJECT_ROOT}/logs/ollama-serve.log)" && exit 1
done
# Pulls model if not already there; “Warms it up” by running a dummy ping through it. (First run is always slow, so this saves pain later).
echo "⬇️ Ensuring model ${MODEL} is available..."
echo "===== $(date '+%Y-%m-%d %H:%M:%S') Pulling Ollama Model =====" > "${PROJECT_ROOT}/logs/ollama-pull.log"
ollama pull "${MODEL}" >> "${PROJECT_ROOT}/logs/ollama-pull.log" 2>&1 || true
echo "🔥 Warming the model..."
echo "ping" | ollama run "${MODEL}" > /dev/null 2>&1 || true
# ========================================================================
echo "🌐 Starting Flask via Waitress on :${FLASK_PORT}..."
# Serve your Flask app with Waitress explicitly (more reliable streaming)
echo "===== $(date '+%Y-%m-%d %H:%M:%S') Starting Flask Server =====" > "${PROJECT_ROOT}/logs/flask.log"
nohup python3 - <<PY >> "${PROJECT_ROOT}/logs/flask.log" 2>&1 &
import runpy
ns = runpy.run_path(r"${PY_FILE_ABS}")
from waitress import serve
serve(ns["app"], host="${FLASK_HOST}", port=${FLASK_PORT})
PY
echo "⏳ Waiting for Flask/Waitress..."
# Prefer /version if present; else OPTIONS on /api/generate_stream
for i in {1..40}; do
  if curl -sf "http://localhost:${FLASK_PORT}/version" >/dev/null || \
     curl -s -o /dev/null -w "%{http_code}" "http://localhost:${FLASK_PORT}/api/generate" -X OPTIONS | grep -q "200"; then
    echo "✅ Flask is up."
    break
  fi
  sleep 0.5
  [[ $i -eq 40 ]] && echo "❌ Flask did not start (see ${PROJECT_ROOT}/logs/flask.log)" && exit 1
done
echo "🩺 Local streaming smoke test..."
BASE_URL="${PUBLIC_URL:-http://${FLASK_HOST}:${FLASK_PORT}}"
# Hitting the explicit streaming endpoint so you see NDJSON headers
curl -i -N -X POST "${BASE_URL}/api/generate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(printf '%s:%s' "$BASIC_AUTH_USERNAME" "$BASIC_AUTH_PASSWORD" | base64)" \
  -d '{"prompt":"say 2 short sentences","stream":true}' | sed -n '1,20p' || true
echo
# ========================================================================
echo "🚇 Starting ngrok tunnel (as-is)..."
# ✅ Do not change how ngrok starts — keep your existing profile/label
echo "===== $(date '+%Y-%m-%d %H:%M:%S') Starting Ngrok Tunnel =====" > "${PROJECT_ROOT}/logs/ngrok.log"
nohup ngrok start --log=stdout flask >> "${PROJECT_ROOT}/logs/ngrok.log" 2>&1 &
echo "⏳ Waiting for ngrok tunnel..."
# ngrok exposes a local API on 127.0.0.1:4040; poll until a tunnel appears
for i in {1..40}; do
  # Grab the first https public URL (works for named or ephemeral tunnels)
  NGROK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | grep -o 'https://[^"]*' | head -n1 || true)
  if [[ -n "${NGROK_URL:-}" ]]; then
    echo "✅ ngrok is up: ${NGROK_URL}"
    break
  fi
  sleep 0.5
  [[ $i -eq 40 ]] && echo "❌ ngrok did not start (see ${PROJECT_ROOT}/logs/ngrok.log)" && exit 1
done
# (Optional) Wait until Flask is reachable through ngrok
for i in {1..40}; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Basic $(printf '%s:%s' "$BASIC_AUTH_USERNAME" "$BASIC_AUTH_PASSWORD" | base64)" \
    -X OPTIONS "${NGROK_URL}/api/generate" || true)
  if [[ "$code" == "200" ]]; then
    echo "✅ Flask reachable via ngrok."
    break
  fi
  sleep 0.5
  [[ $i -eq 40 ]] && echo "❌ Flask not reachable via ngrok (check tunnel target)" && exit 1
done
echo "🩺 Ngrok streaming smoke test..."
curl -i -N -X POST "${NGROK_URL}/api/generate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(printf '%s:%s' "$BASIC_AUTH_USERNAME" "$BASIC_AUTH_PASSWORD" | base64)" \
  -d '{"prompt":"say 2 short sentences","stream":true}' \
  | sed -n '1,20p' || true
echo
# ========================================================================
echo "✅ All systems go."
echo "📍 Local URL:  http://localhost:${FLASK_PORT}"
echo "📝 Logs:"
echo "  - Ollama:      ${PROJECT_ROOT}/logs/ollama-serve.log"
echo "  - Model Pull:  ${PROJECT_ROOT}/logs/ollama-pull.log"
echo "  - Flask:       ${PROJECT_ROOT}/logs/flask.log"
echo "  - ngrok:       ${PROJECT_ROOT}/logs/ngrok.log"
