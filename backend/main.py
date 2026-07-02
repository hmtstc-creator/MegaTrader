from fastapi import FastAPI
from datetime import datetime

app = FastAPI(
    title="MegaTrader Backend",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "service": "MegaTrader Backend",
        "status": "running",
        "time": datetime.utcnow().isoformat()
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "MegaTrader Backend"
    }


@app.get("/api/status")
def api_status():
    return {
        "bot": "stopped",
        "market": "unknown",
        "timestamp": datetime.utcnow().isoformat()
    }