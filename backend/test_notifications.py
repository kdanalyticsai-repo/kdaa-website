# -*- coding: utf-8 -*-
"""
Standalone notification test - email (SMTP) and WhatsApp/SMS (Twilio).
No server required. Run from the backend/ directory:

    cd backend
    python test_notifications.py

What it does:
  Test 1 - Sends a sample lead email to COMPANY_EMAIL via SMTP,
            and an auto-reply to the lead's email address.
  Test 2 - Sends a WhatsApp/SMS alert to TWILIO_TO_NUMBER via Twilio.
"""

import asyncio
import sys
import os

sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.models.contact import ContactRequest, InterestType
from app.services.email_service import send_via_smtp, send_sms_alert

SAMPLE_LEAD = ContactRequest(
    first_name="Test",
    last_name="Lead",
    email=settings.SMTP_USERNAME or "test@example.com",
    company="KDA Test",
    phone=settings.COMPANY_PHONE,
    interest=InterestType.general,
    message="This is a test notification sent from test_notifications.py to verify email and WhatsApp delivery.",
)
SAMPLE_LEAD_ID = "KDA-TEST-000001"


def sep():
    print("-" * 60)


def _print_config():
    print()
    sep()
    print("  Current Configuration (.env)")
    sep()
    print(f"  SMTP_HOST         : {settings.SMTP_HOST}")
    print(f"  SMTP_PORT         : {settings.SMTP_PORT}")
    print(f"  SMTP_USERNAME     : {settings.SMTP_USERNAME or '(not set)'}")
    print(f"  SMTP_PASSWORD     : {'(set)' if settings.SMTP_PASSWORD else '(NOT SET)'}")
    print(f"  COMPANY_EMAIL     : {settings.COMPANY_EMAIL}")
    print(f"  SENDGRID_API_KEY  : {'(set)' if settings.SENDGRID_API_KEY else '(not set - using SMTP)'}")
    print(f"  TWILIO_ACCOUNT_SID: {'(set)' if settings.TWILIO_ACCOUNT_SID else '(NOT SET)'}")
    print(f"  TWILIO_AUTH_TOKEN : {'(set)' if settings.TWILIO_AUTH_TOKEN else '(NOT SET)'}")
    print(f"  TWILIO_FROM_NUMBER: {settings.TWILIO_FROM_NUMBER or '(not set)'}")
    print(f"  TWILIO_TO_NUMBER  : {settings.TWILIO_TO_NUMBER or '(NOT SET)'}")
    print()


async def test_email():
    sep()
    print("  TEST 1 - SMTP Email")
    sep()

    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        print("  SKIPPED - SMTP_USERNAME or SMTP_PASSWORD not set in .env")
        print()
        return

    print(f"  Sending lead notification to : {settings.COMPANY_EMAIL}")
    print(f"  Sending auto-reply to        : {SAMPLE_LEAD.email}")
    print(f"  Via                          : {settings.SMTP_HOST}:{settings.SMTP_PORT}")
    print()

    ok = send_via_smtp(SAMPLE_LEAD, SAMPLE_LEAD_ID)

    if ok:
        print("  RESULT : PASS")
        print(f"  ACTION : Check inbox at {settings.COMPANY_EMAIL}")
        print(f"           Subject: '[KDA Lead] General Enquiry - Test Lead'")
    else:
        print("  RESULT : FAIL")
        print()
        print("  Common causes:")
        print("  1. Gmail requires an App Password, not your regular account password.")
        print("     Steps: Google Account -> Security -> 2-Step Verification (enable)")
        print("            -> App Passwords -> Mail -> Generate 16-char code")
        print("            -> paste that code as SMTP_PASSWORD in .env")
        print()
        print("  2. SMTP_HOST must be 'smtp.gmail.com' (already fixed from the old value).")
        print()
        print("  3. For non-Gmail (Outlook, Yahoo), update SMTP_HOST to match your provider.")
    print()


async def test_whatsapp():
    sep()
    print("  TEST 2 - WhatsApp / SMS (Twilio)")
    sep()

    missing = [
        k for k, v in {
            "TWILIO_ACCOUNT_SID": settings.TWILIO_ACCOUNT_SID,
            "TWILIO_AUTH_TOKEN": settings.TWILIO_AUTH_TOKEN,
            "TWILIO_FROM_NUMBER": settings.TWILIO_FROM_NUMBER,
            "TWILIO_TO_NUMBER": settings.TWILIO_TO_NUMBER,
        }.items() if not v
    ]

    if missing:
        print(f"  SKIPPED - Missing in .env: {', '.join(missing)}")
        print()
        print("  Setup steps for Twilio WhatsApp sandbox (free):")
        print("  1. Sign up at twilio.com")
        print("  2. Console -> Messaging -> Try it out -> Send a WhatsApp message")
        print("  3. From your WhatsApp, send 'join <sandbox-word>' to +14155238886")
        print("  4. Copy Account SID and Auth Token from console.twilio.com")
        print("  5. Add to .env:")
        print("       TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
        print("       TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
        print("       TWILIO_FROM_NUMBER=whatsapp:+14155238886")
        print("       TWILIO_TO_NUMBER=whatsapp:+919412309146")
        print()
        return

    if not settings.TWILIO_TO_NUMBER.startswith("whatsapp:"):
        print("  WARNING - TWILIO_TO_NUMBER must start with 'whatsapp:' for WhatsApp delivery.")
        print(f"            Current : {settings.TWILIO_TO_NUMBER}")
        print(f"            Fix to  : whatsapp:+919412309146")
        print()

    print(f"  Sending WhatsApp alert to : {settings.TWILIO_TO_NUMBER}")
    print(f"  From                      : {settings.TWILIO_FROM_NUMBER}")
    print()

    ok = await send_sms_alert(SAMPLE_LEAD)

    if ok:
        print("  RESULT : PASS")
        print(f"  ACTION : Check WhatsApp on {settings.TWILIO_TO_NUMBER}")
    else:
        print("  RESULT : FAIL")
        print()
        print("  Common causes:")
        print("  1. Sandbox activation - from WhatsApp send 'join <word>' to +14155238886 first.")
        print("  2. Wrong credentials - verify SID / Auth Token at console.twilio.com.")
        print("  3. Number format must be: whatsapp:+919412309146  (no spaces or dashes).")
    print()


async def main():
    print()
    print("=" * 60)
    print("  KDA Analytics - Notification Test")
    print("=" * 60)

    _print_config()
    await test_email()
    await test_whatsapp()

    sep()
    print("  Done. Fix any FAIL or SKIPPED items above, then re-run.")
    sep()
    print()


if __name__ == "__main__":
    asyncio.run(main())
