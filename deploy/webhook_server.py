import subprocess

from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/webhook")
def webhook():
    result = subprocess.run(
        [
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