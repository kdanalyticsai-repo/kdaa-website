"""
Contact / Lead submission endpoint.
POST /api/v1/contact
"""

import asyncio
import logging
import uuid
from datetime import datetime

from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models.contact import ContactRequest, ContactResponse
from app.services.email_service import send_via_sendgrid, send_via_smtp, send_sms_alert
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.post("/contact", response_model=ContactResponse)
@limiter.limit(f"{settings.CONTACT_RATE_LIMIT_PER_HOUR}/hour")
async def submit_contact(request: Request, payload: ContactRequest):
    """
    Accepts a contact form submission, delivers email to company,
    sends auto-reply to the requester, optionally sends SMS alert.
    """
    lead_id = f"KDA-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
    logger.info("New lead %s — %s <%s> — %s", lead_id, payload.first_name, payload.email, payload.interest)

    delivered = False

    # 1. Try SendGrid first (preferred in production)
    if settings.SENDGRID_API_KEY:
        delivered = await send_via_sendgrid(payload, lead_id)

    # 2. Fall back to SMTP
    if not delivered:
        loop = asyncio.get_event_loop()
        delivered = await loop.run_in_executor(None, send_via_smtp, payload, lead_id)

    # 3. Optional SMS/WhatsApp alert (fire-and-forget)
    asyncio.create_task(send_sms_alert(payload))

    if not delivered:
        # Log to stdout so nothing is ever lost — ops team can recover from logs
        logger.error(
            "EMAIL DELIVERY FAILED — lead %s: %s %s <%s> | %s | %s",
            lead_id, payload.first_name, payload.last_name,
            payload.email, payload.interest, payload.message[:80]
        )
        # Still return success to user — we log and will follow up manually
        # Change to raise HTTPException if you prefer strict failure signalling

    return ContactResponse(
        success=True,
        message="Thank you! We'll be in touch within 24 business hours.",
        lead_id=lead_id,
    )
