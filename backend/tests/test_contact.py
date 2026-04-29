"""
Tests for the /api/v1/contact endpoint.
Run: pytest tests/ -v
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock

from app.main import app

client = TestClient(app)


def valid_payload(**overrides):
    base = {
        "first_name": "Arjun",
        "last_name":  "Sharma",
        "email":      "arjun@example.com",
        "company":    "Test Corp",
        "phone":      "Country Code-9999999999",
        "interest":   "Enterprise & Strategy",
        "message":    "We'd like to explore your enterprise intelligence service.",
    }
    return {**base, **overrides}


@pytest.fixture(autouse=True)
def mock_email_services():
    """Patch all external email/SMS calls so tests never hit the network."""
    with patch("app.api.v1.routes.contact.send_via_sendgrid", new_callable=AsyncMock, return_value=True), \
            patch("app.api.v1.routes.contact.send_via_smtp", return_value=True), \
            patch("app.api.v1.routes.contact.send_sms_alert", new_callable=AsyncMock, return_value=True):
        yield


class TestContactEndpoint:

    def test_happy_path(self):
        resp = client.post("/api/v1/contact", json=valid_payload())
        assert resp.status_code == 200
        body = resp.json()
        assert body["success"] is True
        assert "lead_id" in body
        assert body["lead_id"].startswith("KDA-")

    def test_missing_required_fields(self):
        resp = client.post("/api/v1/contact", json={"email": "x@x.com"})
        assert resp.status_code == 422

    def test_invalid_email(self):
        resp = client.post("/api/v1/contact",
                           json=valid_payload(email="not-an-email"))
        assert resp.status_code == 422

    def test_message_too_short(self):
        resp = client.post("/api/v1/contact", json=valid_payload(message="Hi"))
        assert resp.status_code == 422

    def test_message_too_long(self):
        resp = client.post("/api/v1/contact",
                           json=valid_payload(message="x" * 2001))
        assert resp.status_code == 422

    def test_html_injection_sanitised(self):
        resp = client.post("/api/v1/contact", json=valid_payload(
            first_name="<script>alert('xss')</script>",
            message="Hello, this is a valid test message."
        ))
        assert resp.status_code == 200
        # Name is sanitised — script tags escaped

    def test_all_interest_types(self):
        interests = [
            "Enterprise & Strategy",
            "Investors & Funds",
            "Startups & Founders",
            "API & Data Licensing",
            "General Enquiry",
        ]
        for interest in interests:
            resp = client.post("/api/v1/contact",
                               json=valid_payload(interest=interest))
            assert resp.status_code == 200


class TestHealthEndpoint:

    def test_health(self):
        resp = client.get("/api/v1/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "ok"
