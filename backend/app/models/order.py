from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base


class Order(Base):
    """
    Модель заказа тура пользователем
    """
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Информация о туре
    tour_id = Column(String(150), ForeignKey("tours.id"), nullable=False)
    tour_title = Column(String, nullable=False)
    booking_date_id = Column(Integer, ForeignKey("booking_dates.id"), nullable=False)
    date_range = Column(String, nullable=False)
    
    # Количество участников и суммы
    participants_count = Column(Integer, nullable=False)
    total_amount = Column(Float, nullable=False)
    prepayment_amount = Column(Float, nullable=False)
    
    # Данные путешественников (JSON)
    primary_traveler = Column(JSON, nullable=False)
    additional_travelers = Column(JSON, nullable=True)
    
    # Статус заказа
    status = Column(String(50), default="confirmed")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Связи
    user = relationship("User", back_populates="orders")
    tour = relationship("Tour")
    booking_date = relationship("BookingDate")