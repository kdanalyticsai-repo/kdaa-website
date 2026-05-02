"""
Pydantic models for the contact / lead submission flow.
"""

from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
import html


class ContactRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    company: Optional[str] = ""
    phone: Optional[str] = ""
    interest: str = "General Enquiry"
    message: str

    @field_validator("first_name", "last_name", "company", "interest", "message", mode="before")
    @classmethod
    def sanitise(cls, v: str) -> str:
        """Strip HTML tags to prevent injection."""
        return html.escape(str(v).strip()) if v else ""

    @field_validator("message")
    @classmethod
    def message_length(cls, v: str) -> str:
        if len(v) < 10:
            raise ValueError("Message must be at least 10 characters.")
        if len(v) > 2000:
            raise ValueError("Message cannot exceed 2000 characters.")
        return v


class ContactResponse(BaseModel):
    success: bool
    message: str
    lead_id: Optional[str] = None
