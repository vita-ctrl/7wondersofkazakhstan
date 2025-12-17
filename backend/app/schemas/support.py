from pydantic import BaseModel, EmailStr


class SupportRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    requestType: str | None = None
    message: str
