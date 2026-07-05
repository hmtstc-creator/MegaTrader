from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(
    title="MegaTrader Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://178.105.40.99"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def root():

    return {
        "service": "MegaTrader Backend",
        "status": "running",
        "environment": "production",
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
        "server": "178.105.40.99",
        "timestamp": datetime.utcnow().isoformat()
    }