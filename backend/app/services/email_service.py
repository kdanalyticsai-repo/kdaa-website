"""
Email delivery service.
Strategy:
  1. Try SendGrid if SENDGRID_API_KEY is set (preferred for production).
  2. Fall back to SMTP (works with Gmail, SES, Mailgun SMTP, etc.).
  3. If both fail, log the lead and return gracefully — never lose a lead.
"""

import asyncio
import logging
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

from app.core.config import settings
from app.models.contact import ContactRequest

logger = logging.getLogger(__name__)


# ── HTML email templates ──────────────────────────────────────────────────────

def _build_internal_html(lead: ContactRequest, lead_id: str) -> str:
    """Rich HTML email sent to KDA team when a new lead arrives."""
    return f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body {{ font-family: 'Helvetica Neue', Arial, sans-serif; background:#040810; color:#e8f0fe; margin:0; padding:0; }}
    .wrap {{ max-width:600px; margin:0 auto; padding:40px 20px; }}
    .header {{ background:linear-gradient(135deg,#00d4ff22,#7c3aed22); border:1px solid #1a2d50;
               border-radius:12px; padding:28px 32px; margin-bottom:24px; }}
    .badge {{ display:inline-block; background:#00d4ff22; border:1px solid #00d4ff44;
              color:#00d4ff; font-size:11px; letter-spacing:0.12em; text-transform:uppercase;
              padding:4px 12px; border-radius:20px; margin-bottom:14px; }}
    h1 {{ font-size:24px; margin:0 0 6px; color:#fff; }}
    .sub {{ color:#6b7fa8; font-size:13px; }}
    table {{ width:100%; border-collapse:collapse; margin:20px 0; }}
    td {{ padding:12px 0; border-bottom:1px solid #1a2d50; font-size:14px; vertical-align:top; }}
    td:first-child {{ color:#6b7fa8; width:140px; min-width:140px; padding-right:24px; font-size:12px; text-transform:uppercase; letter-spacing:0.08em; }}
    td:last-child {{ color:#e8f0fe; }}
    .msg-box {{ background:#0c1628; border:1px solid #1a2d50; border-radius:8px;
                padding:20px; margin:20px 0; font-size:14px; line-height:1.7; color:#e8f0fe; }}
    .footer {{ text-align:center; color:#6b7fa8; font-size:11px; margin-top:32px; }}
    .accent {{ color:#00d4ff; }}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div class="badge">🔵 New Lead · {lead_id}</div>
      <h1>New Contact Submission</h1>
      <p class="sub">Received {datetime.utcnow().strftime('%d %b %Y, %H:%M UTC')} · KDA Analytics</p>
    </div>
    <table>
      <tr><td>Name</td><td><strong>{lead.first_name} {lead.last_name}</strong></td></tr>
      <tr><td>Email</td><td><span class="accent">{lead.email}</span></td></tr>
      <tr><td>Company</td><td>{lead.company or '—'}</td></tr>
      <tr><td>Phone</td><td>{lead.phone or '—'}</td></tr>
      <tr><td>Interest</td><td>{lead.interest}</td></tr>
    </table>
    <p style="color:#6b7fa8;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Message</p>
    <div class="msg-box">{lead.message}</div>
    <div class="footer">KDA Analytics · info@kdaanalytics.com · New Delhi NCR Region </div>
  </div>
</body>
</html>
"""


def _build_confirmation_html(lead: ContactRequest) -> str:
    """Auto-reply confirmation sent to the person who submitted."""
    return f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body {{ font-family: 'Helvetica Neue', Arial, sans-serif; background:#040810; color:#e8f0fe; margin:0; padding:0; }}
    .wrap {{ max-width:600px; margin:0 auto; padding:40px 20px; }}
    .hero {{ text-align:center; padding:40px 0; }}
    .logo {{ font-size:22px; font-weight:800; letter-spacing:-0.02em; color:#fff; }}
    .logo span {{ color:#00d4ff; }}
    h1 {{ font-size:26px; margin:24px 0 12px; }}
    p {{ color:#6b7fa8; line-height:1.7; font-size:14px; }}
    .highlight {{ color:#e8f0fe; }}
    .cta {{ display:inline-block; background:#00d4ff; color:#040810; font-weight:700;
            font-size:14px; padding:12px 28px; border-radius:8px; text-decoration:none;
            margin:24px 0; }}
    .footer {{ border-top:1px solid #1a2d50; padding-top:24px; margin-top:32px;
               text-align:center; color:#6b7fa8; font-size:11px; }}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero">
      <div class="logo">KDA<span>.</span>Analytics</div>
      <h1>We've received your message 👋</h1>
      <p>Hi <span class="highlight">{lead.first_name}</span>, thank you for reaching out about
         <strong class="highlight">{lead.interest}</strong>.<br/>
         Our team will get back to you within <strong class="highlight">24 business hours</strong>.</p>
      <a href="https://kdaanalytics.ai" class="cta">Explore KDA Analytics →</a>
    </div>
    <p style="text-align:center;">In the meantime, feel free to connect with us on LinkedIn
       or reply directly to this email.</p>
    <div class="footer">
      © {datetime.utcnow().year} KDA Analytics · info@kdaanalytics.com<br/>
      New Delhi NCR Region · Where Data Meets Intelligence
    </div>
  </div>
</body>
</html>
"""


# ── Delivery methods ──────────────────────────────────────────────────────────

async def send_via_sendgrid(lead: ContactRequest, lead_id: str) -> bool:
    """Send via SendGrid HTTP API (requires SENDGRID_API_KEY)."""
    try:
        import httpx
        headers = {
            "Authorization": f"Bearer {settings.SENDGRID_API_KEY}",
            "Content-Type": "application/json",
        }
        sender = {"email": settings.SENDGRID_FROM_EMAIL, "name": "KDA Analytics"}

        internal_payload = {
            "personalizations": [
                {
                    "to": [{"email": settings.COMPANY_EMAIL}],
                    "subject": f"[KDA Lead] {lead.interest} — {lead.first_name} {lead.last_name}",
                }
            ],
            "from": sender,
            "content": [{"type": "text/html", "value": _build_internal_html(lead, lead_id)}],
        }

        confirmation_payload = {
            "personalizations": [
                {
                    "to": [{"email": lead.email, "name": f"{lead.first_name} {lead.last_name}"}],
                    "subject": "We've received your message — KDA Analytics",
                }
            ],
            "from": sender,
            "reply_to": {"email": settings.COMPANY_EMAIL, "name": "KDA Analytics"},
            "content": [{"type": "text/html", "value": _build_confirmation_html(lead)}],
        }

        async with httpx.AsyncClient() as client:
            r1, r2 = await asyncio.gather(
                client.post("https://api.sendgrid.com/v3/mail/send", headers=headers, json=internal_payload, timeout=10),
                client.post("https://api.sendgrid.com/v3/mail/send", headers=headers, json=confirmation_payload, timeout=10),
            )

        if r1.status_code in (200, 202) and r2.status_code in (200, 202):
            logger.info("SendGrid delivery OK (internal + confirmation) — lead %s", lead_id)
            return True

        if r1.status_code not in (200, 202):
            logger.warning("SendGrid internal email returned %s: %s", r1.status_code, r1.text)
        if r2.status_code not in (200, 202):
            logger.warning("SendGrid confirmation email returned %s: %s", r2.status_code, r2.text)
        return False
    except Exception as exc:
        logger.error("SendGrid error: %s", exc)
        return False


def send_via_smtp(lead: ContactRequest, lead_id: str) -> bool:
    """Send via SMTP (sync, run in thread pool by caller)."""
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured — skipping SMTP send")
        return False

    try:
        context = ssl.create_default_context()

        # --- internal notification to team ---
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[KDA Lead] {lead.interest} — {lead.first_name} {lead.last_name}"
        msg["From"] = f"KDA Analytics <{settings.SMTP_USERNAME}>"
        msg["To"] = settings.COMPANY_EMAIL
        msg.attach(MIMEText(_build_internal_html(lead, lead_id), "html"))

        # --- auto-reply to sender ---
        reply = MIMEMultipart("alternative")
        reply["Subject"] = "We've received your message — KDA Analytics"
        reply["From"] = f"KDA Analytics <{settings.SMTP_USERNAME}>"
        reply["To"] = lead.email
        reply.attach(MIMEText(_build_confirmation_html(lead), "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.ehlo()
            if settings.SMTP_USE_TLS:
                server.starttls(context=context)
                server.ehlo()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USERNAME,
                            settings.COMPANY_EMAIL, msg.as_string())
            server.sendmail(settings.SMTP_USERNAME,
                            lead.email, reply.as_string())

        logger.info("SMTP delivery OK — lead %s", lead_id)
        return True

    except Exception as exc:
        logger.error("SMTP error: %s", exc)
        return False


async def send_sms_alert(lead: ContactRequest) -> bool:
    """Optional: send a WhatsApp/SMS alert via Twilio."""
    if not all([settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN, settings.TWILIO_FROM_NUMBER]):
        return False
    try:
        from twilio.rest import Client
        client = Client(settings.TWILIO_ACCOUNT_SID,
                        settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=f"[KDA Lead] {lead.first_name} {lead.last_name} · {lead.email} · {lead.interest}",
            from_=settings.TWILIO_FROM_NUMBER,
            to=settings.TWILIO_TO_NUMBER,
        )
        logger.info("SMS/WhatsApp alert sent")
        return True
    except Exception as exc:
        logger.warning("SMS alert failed: %s", exc)
        return False
