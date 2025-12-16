from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.review import Review
from app.schemas.review import ReviewsSchema, ReviewItem
from app.database import get_db

router = APIRouter()

@router.get("/reviews", response_model=ReviewsSchema)
async def get_reviews(
    tour_id: str = Query(..., alias="tourId"),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1),
    db: Session = Depends(get_db)
):
    total_reviews = db.query(Review).filter(Review.tour_id == tour_id).count()
    
    if total_reviews == 0:
        raise HTTPException(status_code=404, detail=f"No reviews found for tour '{tour_id}'")
    
    offset = (page - 1) * per_page
    
    reviews = (
        db.query(Review)
        .filter(Review.tour_id == tour_id)
        .order_by(desc(Review.date))
        .offset(offset)
        .limit(per_page)
        .all()
    )
    
    reviews_list = [
        ReviewItem(
            id=r.id,  # pyright: ignore[reportArgumentType]
            name=r.name,  # pyright: ignore[reportArgumentType]
            date=r.date.strftime("%d.%m.%Y"),
            rating=r.rating,  # pyright: ignore[reportArgumentType]
            text=r.text  # pyright: ignore[reportArgumentType]
        )
        for r in reviews
    ]
    
    # Проверяем, есть ли еще отзывы после текущей страницы
    has_more = (offset + len(reviews_list)) < total_reviews
    
    return ReviewsSchema(reviews=reviews_list, hasMore=has_more)