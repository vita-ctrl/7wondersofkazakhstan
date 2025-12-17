from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.schemas import OrderResponse, OrderCreate, Orders
from app.schemas.order import OrderSchema
from app.models import User, Order, BookingDate
from app.database import get_db
from app.security import get_current_user
from app.email_service import generate_order_email_html, send_email_async
from app.utils import format_date_range

import json

router = APIRouter()

def create_order(db: Session, order_data: OrderCreate, current_user: User) -> Order:
    # Проверяем существование даты бронирования
    booking_date = db.execute(
        select(BookingDate).where(BookingDate.id == order_data.booking_date_id)
    ).scalar_one_or_none()
    
    if not booking_date:
        raise HTTPException(status_code=404, detail="Дата бронирования не найдена")
    
    if not bool(booking_date.active):
        raise HTTPException(status_code=400, detail="Эта дата недоступна для бронирования")
    
    if bool(booking_date.seats < order_data.participants_count):
        raise HTTPException(status_code=400, detail="Недостаточно свободных мест")
    

    order = Order(
        user_id=current_user.id,
        tour_id=order_data.tour_id,
        booking_date_id=booking_date.id,
        participants_count=order_data.participants_count,
        total_amount=booking_date.price * order_data.participants_count,
        currency=booking_date.booking.currency,
        prepayment_amount=booking_date.booking.prepayment * order_data.participants_count,
        primary_traveler=order_data.primary_traveler.model_dump_json(),
        additional_travelers=order_data.additional_travelers.model_dump_json() if order_data.additional_travelers else None,
    )

    booking_date.seats -= order_data.participants_count  # pyright: ignore[reportAttributeAccessIssue]

    db.add(order)
    db.commit()
    db.refresh(order)
    
    return order

@router.get("/orders", response_model=Orders)
async def my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).options(
        joinedload(Order.user),
        joinedload(Order.tour),
        joinedload(Order.booking_date)
    ).order_by(Order.created_at.desc()).all()
    
    order_schemas = []
    for order in orders:
        # Парсим primary_traveler из JSON-строки в dict
        primary_traveler = order.primary_traveler
        if isinstance(primary_traveler, str):
            primary_traveler = json.loads(primary_traveler)
        
        # Парсим additional_travelers из JSON-строки в list
        additional_travelers = order.additional_travelers
        if isinstance(additional_travelers, str):
            if additional_travelers and additional_travelers != '[]': # pyright: ignore[reportGeneralTypeIssues]
                additional_travelers = json.loads(additional_travelers)
            else:
                additional_travelers = None  # или [] если хотите пустой список
        
        order_schemas.append(
            OrderSchema(
                id=order.id, # pyright: ignore[reportArgumentType]
                user_id=order.user_id, # pyright: ignore[reportArgumentType]
                tour_id=order.tour_id, # pyright: ignore[reportArgumentType]
                booking_date_id=order.booking_date_id, # pyright: ignore[reportArgumentType]
                participants_count=order.participants_count, # pyright: ignore[reportArgumentType]
                total_amount=order.total_amount, # pyright: ignore[reportArgumentType]
                currency=order.currency, # pyright: ignore[reportArgumentType]
                prepayment_amount=order.prepayment_amount, # pyright: ignore[reportArgumentType]
                primary_traveler=primary_traveler, # pyright: ignore[reportArgumentType]
                additional_travelers=additional_travelers # pyright: ignore[reportArgumentType]
            )
        )
    
    return Orders(root=order_schemas)


@router.post("/orders", response_model=OrderResponse)
async def post_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = create_order(db, data, current_user)

    email_html = generate_order_email_html(
        order_id=order.id,  # pyright: ignore[reportArgumentType]
        tour_title=order.tour.title,
        tour_image_url=order.tour.images[0],
        date_range=format_date_range(order.booking_date.start_date, order.booking_date.end_date),
        days=order.booking_date.booking.days,
        participants_count=order.participants_count,  # pyright: ignore[reportArgumentType]
        total_amount=order.total_amount,  # pyright: ignore[reportArgumentType]
        prepayment_amount=order.prepayment_amount,  # pyright: ignore[reportArgumentType]
        currency=order.booking_date.booking.currency,
        primary_traveler=data.primary_traveler,  # pyright: ignore[reportArgumentType]
        additional_travelers=data.additional_travelers,  # pyright: ignore[reportArgumentType]
    )

    await send_email_async(str(current_user.email), f"Покупка тура №{order.id}", email_html)

    return OrderResponse(order_id=order.id)  # pyright: ignore[reportArgumentType]
