from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.schemas.tour import TourSchema
from app.database import get_db
from app.models.tour import Tour
from app.utils import format_date_range, get_rating_summary
from app.models.booking import BookingDate


router = APIRouter()


@router.get("/tours", response_model=TourSchema)
async def get_tour(
    tour_id: str = Query(..., alias="tourId"), db: Session = Depends(get_db)
):
    # ---------- проверка существования ----------
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(status_code=404, detail=f"Tour '{tour_id}' not found")

    # ---------- booking ----------
    booking = tour.booking
    
    booking_dates = (
        db.query(BookingDate)
        .filter(BookingDate.booking_id == booking.id)
        .filter(BookingDate.active == True)  # noqa: E712
        .filter(BookingDate.start_date >= date.today())
        .all()
    )

    booking_json = {
        "cost": booking.cost,
        "currency": booking.currency,
        "days": booking.days,
        "prepayment": booking.prepayment,
        "maxSeats": booking.max_seats,
        "dates": [
            {
                "id": d.id,
                "range": format_date_range(d.start_date, d.end_date),  # pyright: ignore[reportArgumentType]
                "price": d.price,
                "seats": d.seats,
                "active": d.active,
            }
            for d in booking_dates
        ],
    }

    # ---------- reviews ----------
    rating_summary = get_rating_summary(db, str(tour.id))

    # ---------- recommendedCards ----------
    other_tours = db.query(Tour).filter(Tour.id != tour.id).all()
    recommended_cards = [
        {
            "url": f"/tours/{t.id}",
            "title": t.title,
            "img": t.images[0] if bool(t.images) else "",
            "price": t.booking.cost if t.booking else 0,
            "currency": t.booking.currency if t.booking else "",
        }
        for t in other_tours
    ]

    # ---------- формирование данных ----------
    tour_dict = {
        "id": tour.id,
        "title": tour.title,
        "images": tour.images,
        "included": tour.included,
        "excluded": tour.excluded,
        "whatToBring": tour.what_to_bring,
        "importantInfo": tour.important_info,
        "faq": tour.faq,
        "organizer": tour.organizer,
        "description": tour.description,
        "booking": booking_json,
        "map": {"popup": tour.map_popup, "lat": tour.map_lat, "long": tour.map_long},
        "reviews": {
            "url": f"/api/reviews?tourId={tour.id}",
            "ratingSummary": rating_summary,
        },
        "recommendedCards": recommended_cards,
    }

    # ---------- Pydantic валидация ----------
    return TourSchema(**tour_dict)
