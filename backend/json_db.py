import json
import re
from datetime import date, datetime
from sqlalchemy import create_engine, desc, func
from sqlalchemy.orm import Session, sessionmaker

from app.models.tour import Tour
from app.models.booking import Booking, BookingDate
from app.models.base import Base
from app.models.review import Review

# ---------- helpers ----------

def parse_date_range(date_range_str: str) -> tuple[date, date]:
    """
    Парсит строки:
    - 26–28 нояб 2025
    - 28 нояб – 2 дек 2025
    - 30 дек 2025 – 2 янв 2026
    - 10 май 2025
    """

    months = {
        "янв": 1, "фев": 2, "мар": 3, "апр": 4,
        "май": 5, "мая": 5,
        "июн": 6, "июл": 7,
        "авг": 8, "сен": 9,
        "окт": 10, "ноя": 11, "нояб": 11,
        "дек": 12,
    }

    s = date_range_str.lower().strip()

    # -------------------------
    # 1. Один день: "10 май 2025"
    # -------------------------
    single_day_pattern = r"^(\d{1,2})\s+(\w+)\s+(\d{4})$"
    m = re.match(single_day_pattern, s)
    if m:
        day, month_str, year = m.groups()
        month = months.get(month_str)
        if not month:
            raise ValueError(f"Неизвестный месяц: {month_str}")

        d = date(int(year), month, int(day))
        return d, d

    # -------------------------
    # 2. Диапазон
    # -------------------------
    parts = re.split(r"\s*[–-]\s*", s)
    if len(parts) != 2:
        raise ValueError(f"Неверный формат диапазона: {date_range_str}")

    left, right = parts

    # Левая часть: "26" или "28 нояб" или "30 дек 2025"
    left_pattern = r"^(\d{1,2})(?:\s+(\w+))?(?:\s+(\d{4}))?$"
    lm = re.match(left_pattern, left)
    if not lm:
        raise ValueError(f"Неверный формат даты: {left}")

    l_day, l_month_str, l_year = lm.groups()

    # Правая часть: "28 нояб 2025" или "2 дек 2025"
    right_pattern = r"^(\d{1,2})\s+(\w+)\s+(\d{4})$"
    rm = re.match(right_pattern, right)
    if not rm:
        raise ValueError(f"Неверный формат даты: {right}")

    r_day, r_month_str, r_year = rm.groups()

    r_month = months.get(r_month_str)
    if not r_month:
        raise ValueError(f"Неизвестный месяц: {r_month_str}")

    r_year = int(r_year)

    # Если в левой части не указан месяц — берём из правой
    if l_month_str:
        l_month = months.get(l_month_str)
        if not l_month:
            raise ValueError(f"Неизвестный месяц: {l_month_str}")
    else:
        l_month = r_month

    # Если в левой части не указан год — берём из правой
    l_year = int(l_year) if l_year else r_year

    start_date = date(l_year, l_month, int(l_day))
    end_date = date(r_year, r_month, int(r_day))

    if start_date > end_date:
        raise ValueError("start_date больше end_date")

    return start_date, end_date


# ---------- main logic ----------

def load_reviews(db: Session, tour_id: str, reviews_data: list[dict]):
    """
    Загружает отзывы в БД

    reviews_data = [
        {
            "id": 1,
            "name": "...",
            "date": "12.10.2025",
            "rating": 5,
            "text": "..."
        }
    ]
    """

    for r in reviews_data:
        review = Review(
            tour_id=tour_id,
            name=r["name"],
            date=datetime.strptime(r["date"], "%d.%m.%Y").date(),
            rating=r["rating"],
            text=r["text"]
        )

        db.add(review)

def load_tour_from_json(db: Session, json_path: str):
    with open(json_path, "r", encoding="utf-8") as f:
        lst = json.load(f)

    for data in lst:
        try:
            # ---------- Tour ----------
            tour = Tour(
                id=data["id"],
                title=data["title"],
                description=data.get("description"),
                images=data.get("images"),
                included=data.get("included"),
                excluded=data.get("excluded"),
                what_to_bring=data.get("whatToBring"),
                important_info=data.get("importantInfo"),
                faq=data.get("faq"),
                organizer=data.get("organizer"),
                map_popup=data["map"]["popup"],
                map_lat=data["map"]["lat"],
                map_long=data["map"]["long"]
            )

            db.add(tour)
            db.flush()  # чтобы появился tour.id

            db.commit()

            # ---------- Booking ----------
            booking_data = data["booking"]

            booking = Booking(
                tour_id=tour.id,
                cost=booking_data["cost"],
                currency=booking_data["currency"],
                days=booking_data["days"],
                prepayment=booking_data["prepayment"],
                max_seats=booking_data["maxSeats"]
            )

            db.add(booking)
            db.flush()

            # ---------- Booking dates ----------
            for d in booking_data["dates"]:
                start_date, _ = parse_date_range(d["range"])

                booking_date = BookingDate(
                    booking_id=booking.id,
                    start_date=start_date,
                    price=d["price"],
                    seats=d["seats"],
                    # active=d["active"]
                )

                db.add(booking_date)

            # ---------- Reviews (если будут реальные данные) ----------
            # Сейчас reviews в JSON — это summary, не реальные отзывы
            # поэтому пропускаем
            if "reviews" in data and isinstance(data["reviews"], list):
                load_reviews(db, str(tour.id), data["reviews"])

            db.commit()

            db.commit()
            print(f"Тур '{tour.id}' успешно загружен")

        except Exception as e:
            db.rollback()
            raise e

        finally:
            db.close()


# --------


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


def format_review_date(d: date) -> str:
    return d.strftime("%d.%m.%Y")


# ---------- reviews ----------

def export_reviews(db: Session, tour_id: str, page: int = 1, per_page: int = 3):
    """
    Экспорт отзывов с пагинацией

    :param db: SQLAlchemy Session
    :param tour_id: id тура
    :param page: номер страницы (начинается с 1)
    :param per_page: количество отзывов на страницу
    :return: список отзывов на данной странице
    """
    if page < 1:
        page = 1

    offset = (page - 1) * per_page

    reviews = (
        db.query(Review)
        .filter(Review.tour_id == tour_id)
        .order_by(desc(Review.date))  # сортировка по дате, можно DESC для последних сверху
        .offset(offset)
        .limit(per_page)
        .all()
    )

    reviews_json = [
        {
            "id": r.id,
            "name": r.name,
            "date": r.date.strftime("%d.%m.%Y"),
            "rating": r.rating,
            "text": r.text
        }
        for r in reviews
    ]

    # Опционально можно записывать только текущую страницу в файл
    # Если хочешь записывать все отзывы — оставляем без записи
    with open(f"reviews_page_{page}.json", "w", encoding="utf-8") as f:
        json.dump(reviews_json, f, ensure_ascii=False, indent=2)

    return reviews_json


# ---------- tour ----------

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



def export_tour(db: Session, tour_id: str):

    try:
        tour = db.query(Tour).filter(Tour.id == tour_id).first()
        if not tour:
            raise ValueError(f"Tour '{tour_id}' not found")

        # ---------- booking ----------
        booking = tour.booking
        booking_json = {
            "cost": booking.cost,
            "currency": booking.currency,
            "days": booking.days,
            "prepayment": booking.prepayment,
            "maxSeats": booking.max_seats,
            "dates": [
                {
                    "id": d.id,
                    "range": format_date_range(d.start_date, d.end_date),
                    "price": d.price,
                    "seats": d.seats,
                    "active": d.active
                }
                for d in booking.dates
            ]
        }

        # ---------- reviews ----------
        rating_summary = get_rating_summary(db, str(tour.id))

        # ---------- tour JSON ----------
        tour_json = {
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
            "map": {
                "popup": tour.map_popup,
                "lat": tour.map_lat,
                "long": tour.map_long
            },
            "reviews": {
                "url": f"/tours/{tour.id}/reviews.json",
                "ratingSummary": rating_summary
            }
        }

        other_tours = (
            db.query(Tour)
            .filter(Tour.id != tour.id)
            .all()
        )

        recommended_cards = [
            {
                "url": f"/tours/{t.id}",
                "title": t.title,
                "img": t.images[0] if bool(t.images) else "",
                "price": t.booking.cost if t.booking else 0,
                "currency": t.booking.currency if t.booking else ""
            }
            for t in other_tours
        ]

        tour_json["recommendedCards"] = recommended_cards

        with open(f"{tour.id}_db.json", "w", encoding="utf-8") as f:
            json.dump(tour_json, f, ensure_ascii=False, indent=2)

        print(f"Экспорт завершён: {tour.id}_db.json + reviews.json")

    finally:
        db.close()


# ---------- entrypoint ----------

if __name__ == "__main__":
    # print(format_date_range(date(2026, 1, 22), date(2026, 1, 24)))
    
    DATABASE_URL = "sqlite:///./example.db"

    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    db = sessionmaker(bind=engine, autoflush=False, autocommit=False)()
    
    Base.metadata.create_all(bind=engine)

    load_tour_from_json(db, "tours.json")

    # export_tour(db, "baikonur")
    # export_reviews(db, "baikonur", 3)
