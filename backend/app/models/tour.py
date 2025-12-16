from sqlalchemy import Column, String, Float, JSON
from sqlalchemy.orm import relationship

from app.models import Base


class Tour(Base):
    __tablename__ = 'tours'
    
    id = Column(String(50), primary_key=True) # +
    title = Column(String(200), nullable=False) # +
    
    # Описание как JSON array
    description = Column(JSON)
    
    # Изображения как JSON array
    images = Column(JSON) # +
    
    included = Column(JSON)
    excluded = Column(JSON)
    what_to_bring = Column(JSON)
    important_info = Column(JSON)
    faq = Column(JSON)
    organizer = Column(JSON)

    # Map координаты
    map_popup = Column(String(200))
    map_lat = Column(Float)
    map_long = Column(Float)
    
    # Relationships
    booking = relationship(
        "Booking",
        back_populates="tour",
        uselist=False
    )
    reviews = relationship("Review", back_populates="tour", cascade="all, delete-orphan")
 