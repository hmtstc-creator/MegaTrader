import hashlib
import hmac
import os
import subprocess

from fastapi import FastAPI, Header, HTTPException, Request

app = FastAPI()

WEBHOOK_SECRET = os.getenv(
    "WEBHOOK_SECRET",
    "MegaTraderWebhook2026"
).strip()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/webhook")
async def webhook(
    request: Request,
    x_hub_signature_256: str | None = Header(default=None),
):
    body = await request.body()

    if not x_hub_signature_256:
        raise HTTPException(status_code=401, detail="Missing signature")

    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()

    received = x_hub_signature_256.replace("sha256=", "")

    if not hmac.compare_digest(expected, received):
        raise HTTPException(status_code=401, detail="Invalid signature")

    result = subprocess.run(
        [
            "sudo",
            "systemctl",
            "start",
            "megatrader-deploy.service"
        ],
        capture_output=True,
        text=True
    )

    return {
        "ok": result.returncode == 0,
        "returncode": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr
    }