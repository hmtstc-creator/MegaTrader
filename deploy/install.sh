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

cp /var/www/MegaTrader/deploy/systemd/megatrader-deploy.service \
/etc/systemd/system/

cp /var/www/MegaTrader/deploy/systemd/megatrader-webhook.service \
/etc/systemd/system/

systemctl daemon-reload


cp /var/www/MegaTrader/deploy/nginx/megatrader.conf \
/etc/nginx/sites-available/megatrader

if [ ! -L /etc/nginx/sites-enabled/megatrader ]; then
    ln -s /etc/nginx/sites-available/megatrader \
    /etc/nginx/sites-enabled/megatrader
fi

nginx -t
systemctl reload nginx

systemctl enable megatrader-webhook.service

systemctl restart megatrader-webhook.service

mkdir -p /var/log/megatrader

touch /var/log/megatrader/webhook.log
touch /var/log/megatrader/deploy.log

chmod 664 /var/log/megatrader/webhook.log
chmod 664 /var/log/megatrader/deploy.log