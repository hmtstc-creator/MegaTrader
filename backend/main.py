from datetime import datetime
from fastapi import FastAPI
app = FastAPI( title="MegaTrader Backend", version="1.0.0" )
@app.get("/") def root(): return { "service": "MegaTrader Backend", "status": "running", "server_time": datetime.utcnow().isoformat() }
@app.get("/health") def health(): return { "status": "ok" }
@app.get("/api/status") def api_status(): return { "bot_running": False, "active_trade": None, "server_time": datetime.utcnow().isoformat() }
@app.get("/api/version") def version(): return { "version": "1.0.0" }