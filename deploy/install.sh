#!/bin/bash

set -Eeuo pipefail

apt update

apt install -y \
    git \
    curl \
    nginx \
    python3 \
    python3-venv \
    python3-pip

mkdir -p /opt/megatrader
mkdir -p /var/log/megatrader

echo "MegaTrader install completed"


python3 -m venv /opt/megatrader/venv

source /opt/megatrader/venv/bin/activate

pip install --upgrade pip

pip install -r /var/www/MegaTrader/deploy/requirements.txt