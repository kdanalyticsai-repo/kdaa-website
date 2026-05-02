"""
KDA Analytics — Flask Backend (stdlib + Flask only, no external deps)
Serves the React SPA and provides the /api/v1/contact endpoint.

Run:  python3 server.py
Open: http://localhost:5000
"""

import json
import re
import html
import uuid
import logging
import smtplib
import os
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Flask, request, jsonify, send_from_directory, send_file

# ── Config ─────────────────────────────────────────────────────────────────
COMPANY_EMAIL = os.environ.get("COMPANY_EMAIL",   "info@kdaanalytics.com")
SMTP_HOST = os.environ.get("SMTP_HOST",       "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT",   "587"))
SMTP_USERNAME = os.environ.get("SMTP_USERNAME",   "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD",   "")
COMPANY_PHONE = os.environ.get("COMPANY_PHONE",   "+91-XXXXXXXXXX")

# In-memory lead store (replace with SQLite/Postgres in production)
LEADS = []

# ── App ─────────────────────────────────────────────────────────────────────
app = Flask(__name__, static_folder="static", static_url_path="/static")
logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s | %(levelname)s | %(message)s")
log = logging.getLogger("kda")

VALID_INTERESTS = {
    "Enterprise & Strategy",
    "Investors & Funds",
    "Startups & Founders",
    "API & Data Licensing",
    "General Enquiry",
}

# ── Helpers ─────────────────────────────────────────────────────────────────


def sanitise(s: str) -> str:
    return html.escape(str(s).strip()) if s else ""


def valid_email(e: str) -> bool:
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", e))


def add_cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return resp


@app.after_request
def after(resp):
    return add_cors(resp)

# ── Email delivery ─────────────────────────────────────────────────────────


def send_email(lead: dict, lead_id: str) -> bool:
    """Send SMTP email if credentials are configured."""
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        log.warning("SMTP not configured — logging lead only.")
        return False
    try:
        # Internal notification
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[KDA Lead] {lead['interest']} — {lead['first_name']} {lead['last_name']}"
        msg["From"] = f"KDA Analytics <{SMTP_USERNAME}>"
        msg["To"] = COMPANY_EMAIL
        html_body = f"""
        <div style="font-family:Arial,sans-serif;background:#040810;color:#e8f0fe;padding:32px;max-width:600px">
          <h2 style="color:#00d4ff">🔵 New Lead — {lead_id}</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="color:#6b7fa8;padding:8px 0;border-bottom:1px solid #1a2d50">Name</td>
                <td style="padding:8px 0;border-bottom:1px solid #1a2d50"><b>{lead['first_name']} {lead['last_name']}</b></td></tr>
            <tr><td style="color:#6b7fa8;padding:8px 0;border-bottom:1px solid #1a2d50">Email</td>
                <td style="color:#00d4ff;padding:8px 0;border-bottom:1px solid #1a2d50">{lead['email']}</td></tr>
            <tr><td style="color:#6b7fa8;padding:8px 0;border-bottom:1px solid #1a2d50">Company</td>
                <td style="padding:8px 0;border-bottom:1px solid #1a2d50">{lead.get('company', '—')}</td></tr>
            <tr><td style="color:#6b7fa8;padding:8px 0;border-bottom:1px solid #1a2d50">Phone</td>
                <td style="padding:8px 0;border-bottom:1px solid #1a2d50">{lead.get('phone', '—')}</td></tr>
            <tr><td style="color:#6b7fa8;padding:8px 0">Interest</td>
                <td style="padding:8px 0">{lead['interest']}</td></tr>
          </table>
          <div style="background:#0c1628;border:1px solid #1a2d50;border-radius:8px;padding:16px;margin-top:16px">
            <b style="color:#6b7fa8;font-size:12px">MESSAGE</b><br/><br/>{lead['message']}
          </div>
          <p style="color:#6b7fa8;font-size:11px;margin-top:24px">KDA Analytics · {datetime.utcnow().strftime('%d %b %Y %H:%M UTC')}</p>
        </div>"""
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
            s.starttls()
            s.login(SMTP_USERNAME, SMTP_PASSWORD)
            s.sendmail(SMTP_USERNAME, COMPANY_EMAIL, msg.as_string())

        # Auto-reply
        reply = MIMEMultipart("alternative")
        reply["Subject"] = "We've received your message — KDA Analytics"
        reply["From"] = f"KDA Analytics <{SMTP_USERNAME}>"
        reply["To"] = lead["email"]
        reply_html = f"""
        <div style="font-family:Arial,sans-serif;background:#040810;color:#e8f0fe;padding:40px;max-width:600px;text-align:center">
          <h1 style="font-size:28px">We've received your message 👋</h1>
          <p style="color:#6b7fa8">Hi <b style="color:#e8f0fe">{lead['first_name']}</b>, thanks for reaching out about
             <b style="color:#e8f0fe">{lead['interest']}</b>.<br/>
             Our team will get back to you within <b style="color:#00d4ff">24 business hours</b>.</p>
          <p style="color:#6b7fa8;font-size:12px;margin-top:32px">
            © {datetime.utcnow().year} KDA Analytics · info@kdaanalytics.com<br/>
            New Delhi NCR Region · Where Data Meets Intelligence</p>
        </div>"""
        reply.attach(MIMEText(reply_html, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
            s.starttls()
            s.login(SMTP_USERNAME, SMTP_PASSWORD)
            s.sendmail(SMTP_USERNAME, lead["email"], reply.as_string())

        log.info("Emails sent for lead %s", lead_id)
        return True

    except Exception as e:
        log.error("SMTP error: %s", e)
        return False

# ── API Routes ───────────────────────────────────────────────────────────────


@app.route("/api/v1/health")
def health():
    return jsonify({"status": "ok", "service": "kda-analytics-api",
                    "ts": datetime.utcnow().isoformat(), "leads_stored": len(LEADS)})


@app.route("/api/v1/contact", methods=["POST", "OPTIONS"])
def contact():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        data = request.get_json(force=True) or {}
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400

    # ── Validation ──────────────────────────────────────────────────────────
    errors = []
    first_name = sanitise(data.get("first_name", ""))
    last_name = sanitise(data.get("last_name",  ""))
    email = sanitise(data.get("email",      ""))
    company = sanitise(data.get("company",    ""))
    phone = sanitise(data.get("phone",      ""))
    interest = data.get("interest", "General Enquiry")
    message = sanitise(data.get("message",    ""))

    if len(first_name) < 2:
        errors.append("first_name: minimum 2 characters")
    if len(last_name) < 2:
        errors.append("last_name: minimum 2 characters")
    if not valid_email(email):
        errors.append("email: invalid email address")
    if interest not in VALID_INTERESTS:
        interest = "General Enquiry"
    if len(message) < 10:
        errors.append("message: minimum 10 characters")
    if len(message) > 2000:
        errors.append("message: maximum 2000 characters")

    if errors:
        return jsonify({"error": "Validation failed", "detail": errors}), 422

    # ── Store lead ──────────────────────────────────────────────────────────
    lead_id = f"KDA-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
    lead = {
        "id":         lead_id,
        "timestamp":  datetime.utcnow().strftime("%d %b %Y, %H:%M UTC"),
        "first_name": first_name,
        "last_name":  last_name,
        "email":      email,
        "company":    company,
        "phone":      phone,
        "interest":   interest,
        "message":    message,
        "status":     "new",
    }
    LEADS.append(lead)

    log.info("New lead %s — %s %s <%s> — %s", lead_id,
             first_name, last_name, email, interest)

    # ── Send email (non-blocking) ───────────────────────────────────────────
    import threading
    threading.Thread(target=send_email, args=(
        lead, lead_id), daemon=True).start()

    return jsonify({
        "success":  True,
        "message":  "Thank you! We'll be in touch within 24 business hours.",
        "lead_id":  lead_id,
    })


@app.route("/api/v1/leads")
def leads():
    """Simple admin endpoint to view submitted leads."""
    secret = request.args.get("secret", "")
    if secret != os.environ.get("ADMIN_SECRET", "kda-admin-2026"):
        return jsonify({"error": "Forbidden"}), 403
    return jsonify({"leads": LEADS, "count": len(LEADS)})

# ── Serve React SPA ─────────────────────────────────────────────────────────


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def spa(path):
    """Serve index.html for all non-API routes (React Router SPA)."""
    return send_from_directory("static", "index.html")


if __name__ == "__main__":
    log.info("🚀 KDA Analytics server starting at http://localhost:5000")
    log.info("📋 Admin leads: http://localhost:5000/api/v1/leads?secret=kda-admin-2026")
    app.run(host="0.0.0.0", port=5000, debug=False)
