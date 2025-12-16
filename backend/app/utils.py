from datetime import datetime, date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.review import Review

def format_date_range(start_date: date, end_date: date) -> str:
    """
    Формирует строку диапазона дат:
    - 26–28 нояб 2025
    - 28 нояб – 2 дек 2025
    - 30 дек 2025 – 2 янв 2026
    """

    months = {
        1: "янв", 2: "фев", 3: "мар", 4: "апр",
        5: "май", 6: "июн", 7: "июл", 8: "авг",
        9: "сен", 10: "окт", 11: "ноя", 12: "дек"
    }

    # Один день
    if start_date == end_date:
        return f"{start_date.day} {months[start_date.month]} {start_date.year}"

    # Один месяц и год
    if (
        start_date.year == end_date.year
        and start_date.month == end_date.month
    ):
        return (
            f"{start_date.day}–{end_date.day} "
            f"{months[start_date.month]} {start_date.year}"
        )

    # Разные месяцы, один год
    if start_date.year == end_date.year:
        return (
            f"{start_date.day} {months[start_date.month]} – "
            f"{end_date.day} {months[end_date.month]} {start_date.year}"
        )

    # Разные годы
    return (
        f"{start_date.day} {months[start_date.month]} {start_date.year} – "
        f"{end_date.day} {months[end_date.month]} {end_date.year}"
    )


def parse_review_date(date_str):
    """
    Парсит дату из формата "12.10.2025" в date объект
    """
    return datetime.strptime(date_str, "%d.%m.%Y").date()


def get_rating_summary(db: Session, tour_id: str):
    total, avg = (
        db.query(
            func.count(Review.id),
            func.avg(Review.rating)
        )
        .filter(Review.tour_id == tour_id)
        .one()
    )

    stars = (
        db.query(
            Review.rating,
            func.count(Review.id)
        )
        .filter(Review.tour_id == tour_id)
        .group_by(Review.rating)
        .all()
    )

    return {
        "totalReviews": total,
        "average": round(float(avg or 0), 1),
        "ratings": [{"stars": rating, "count": count} for rating, count in stars]
    }
