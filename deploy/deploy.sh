#!/bin/bash

set -Eeuo pipefail

PROJECT_DIR="/var/www/MegaTrader"

echo "MegaTrader deploy starting..."

cd "$PROJECT_DIR"

git fetch origin

git reset --hard origin/main

echo "MegaTrader deploy completed"