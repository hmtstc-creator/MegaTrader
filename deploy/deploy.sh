#!/bin/bash

set -Eeuo pipefail

PROJECT_DIR="/var/www/MegaTrader"
BACKEND_SERVICE="megatrader-backend.service"
HEALTH_URL="http://127.0.0.1:8000/health"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "MegaTrader deploy starting"

cd "$PROJECT_DIR"

git fetch origin
git reset --hard origin/main

if [ -f backend/requirements.txt ]; then
    log "Installing backend requirements"
    source /opt/megatrader/venv/bin/activate
    pip install -r backend/requirements.txt
fi

if systemctl list-unit-files | grep -q "$BACKEND_SERVICE"; then
    log "Restarting backend service"
    systemctl restart "$BACKEND_SERVICE"
fi

if command -v curl >/dev/null 2>&1; then
    if curl -fsS "$HEALTH_URL" >/dev/null; then
        log "Health check passed"
    else
        log "Health check failed"
        exit 1
    fi
fi

log "MegaTrader deploy completed"