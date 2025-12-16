from enum import Enum
from pydantic import BaseModel, EmailStr, RootModel, field_validator
from datetime import date


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"


class PrimaryTraveler(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: str
    dob: date
    gender: Gender

    @field_validator("dob")
    @classmethod
    def check_age_over_18(cls, v: date) -> date:
        today = date.today()
        age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
        if age < 18:
            raise ValueError("PrimaryTraveler must be at least 18 years old")
        return v

class AdditionalTraveler(BaseModel):
    firstName: str | None = None
    lastName: str | None = None
    dob: date | None = None
    gender: Gender | None = None

    @field_validator("dob")
    @classmethod
    def check_age_over_4(cls, v: date | None) -> date | None:
        if v is None:
            return v
        today = date.today()
        age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
        if age < 4:
            raise ValueError("AdditionalTraveler must be at least 4 years old")
        return v

class AdditionalTravelers(RootModel[list[AdditionalTraveler]]):
    pass
    

# Схема запроса на создание заказа
class OrderCreate(BaseModel):
    tour_id: str
    booking_date_id: int
    participants_count: int
    primary_traveler: PrimaryTraveler
    additional_travelers: AdditionalTravelers | None = None


# Схема ответа
class OrderResponse(BaseModel):
    order_id: int
