from pydantic import BaseModel

class ReviewItem(BaseModel):
    id: int
    name: str
    date: str  # "DD.MM.YYYY"
    rating: int
    text: str

class ReviewsSchema(BaseModel):
    reviews: list[ReviewItem]
    hasMore: bool