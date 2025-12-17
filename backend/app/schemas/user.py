from pydantic import BaseModel, EmailStr


class UserProfile(BaseModel):
    id: int
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    card_brand: str | None = None
    card_last4: str | None = None
    card_holder_name: str | None = None
    is_active: bool

    class Config:
        from_attributes = True


class UpdateProfileRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
