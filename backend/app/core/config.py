"""
Application configuration — loaded from environment variables / .env file.
"""

from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────────────────────────────
    APP_NAME: str = "KDA Analytics API"
    ENVIRONMENT: str = "development"          # development | staging | production
    SECRET_KEY: str = "change-me-in-production"

    # ── CORS / Hosts ─────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",              # Vite dev server
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "https://kdaanalytics.com",
        "https://www.kdaanalytics.com",
        "https://kdaanalytics.pages.dev",
    ]
    ALLOWED_HOSTS: List[str] = [
        "kdaanalytics.com",
        "www.kdaanalytics.com",
        "localhost",
    ]

    # ── Email (SMTP) ─────────────────────────────────────────────────────────
    # Supports any SMTP provider: Titan, Gmail, AWS SES, Mailgun, Postmark, etc.
    SMTP_HOST: str = "smtp.titan.email"
    SMTP_PORT: int = 587
    SMTP_USE_TLS: bool = True
    SMTP_USERNAME: str = ""                   # e.g. info@kdaanalytics.com
    SMTP_PASSWORD: str = ""                   # Titan account password

    # Where company receives leads
    COMPANY_EMAIL: str = "info@kdaanalytics.com"
    COMPANY_PHONE: str = "Country Code-XXXXXXXXXX"     # WhatsApp / SMS fallback

    # ── SendGrid fallback (optional) ─────────────────────────────────────────
    SENDGRID_API_KEY: str = ""                # Set to enable SendGrid path
    SENDGRID_FROM_EMAIL: str = "info@kdaanalytics.com"

    # ── Twilio SMS (optional) ────────────────────────────────────────────────
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_FROM_NUMBER: str = ""
    TWILIO_TO_NUMBER: str = ""                # Company WhatsApp / SMS number

    # ── Rate limiting ────────────────────────────────────────────────────────
    CONTACT_RATE_LIMIT_PER_HOUR: int = 5      # per IP

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
