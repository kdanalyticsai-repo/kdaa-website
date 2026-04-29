from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/health")
async def health():
    return {"status": "ok", "service": "kda-analytics-api", "ts": datetime.utcnow().isoformat()}
