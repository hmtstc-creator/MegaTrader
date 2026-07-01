# MegaTrader Deploy

Bu klasör MegaTrader'ın dağıtım (deploy) altyapısını içerir.

Planlanan bileşenler:

- deploy.sh
- webhook_server.py
- install.sh
- systemd servisleri
- nginx konfigürasyonu
- deploy yardımcı scriptleri



## Deploy Akışı

GitHub Push
↓
Webhook
↓
webhook_server.py
↓
megatrader-deploy.service
↓
deploy.sh
↓
megatrader-backend.service
↓
Nginx
↓
Canlı Sistem


test deploy

webhook test 6