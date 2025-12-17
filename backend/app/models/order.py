from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Информация о туре
    tour_id = Column(String, ForeignKey("tours.id"), nullable=False)
    booking_date_id = Column(Integer, ForeignKey("booking_dates.id"), nullable=False)
    
    # Количество участников и суммы
    participants_count = Column(Integer, nullable=False)
    total_amount = Column(Integer, nullable=False)
    currency = Column(String, nullable=False)
    prepayment_amount = Column(Integer, nullable=False)
    
    # Данные путешественников (JSON)
    primary_traveler = Column(JSON, nullable=False)
    additional_travelers = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Связи
    user = relationship("User", back_populates="orders")
    tour = relationship("Tour")
    booking_date = relationship("BookingDate")