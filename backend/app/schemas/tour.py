from pydantic import BaseModel


class ImportantInfoItem(BaseModel):
    title: str
    text: str


class FAQItem(BaseModel):
    question: str
    answer: str


class Organizer(BaseModel):
    name: str
    rating: float
    photo: str


class BookingDateItem(BaseModel):
    id: int
    range: str
    price: int
    seats: int
    active: bool


class Booking(BaseModel):
    cost: int
    currency: str
    days: int
    prepayment: int
    maxSeats: int
    dates: list[BookingDateItem]


class RatingItem(BaseModel):
    stars: int
    count: int


class RatingSummary(BaseModel):
    totalReviews: int
    average: float
    ratings: list[RatingItem]


class Reviews(BaseModel):
    url: str
    ratingSummary: RatingSummary


class RecommendedCardItem(BaseModel):
    url: str
    title: str
    img: str
    price: int
    currency: str


class TourSchema(BaseModel):
    id: str
    title: str
    images: list[str]
    included: list[str]
    excluded: list[str]
    whatToBring: list[str]
    importantInfo: list[ImportantInfoItem]
    faq: list[FAQItem]
    organizer: Organizer
    description: list[str]
    booking: Booking
    map: dict
    reviews: Reviews
    recommendedCards: list[RecommendedCardItem]
