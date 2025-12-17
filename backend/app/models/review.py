from sqlalchemy import CheckConstraint, Column, Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.models.base import Base


class Review(Base):
    __tablename__ = 'reviews'
    
    id = Column(Integer, primary_key=True)
    tour_id = Column(String, ForeignKey('tours.id'), nullable=False)
    name = Column(String(100), nullable=False)
    date = Column(Date, nullable=False)
    rating = Column(Integer, CheckConstraint('rating >= 1 AND rating <= 5'), nullable=False)
    text = Column(Text, nullable=False)
    
    tour = relationship("Tour", back_populates="reviews")
