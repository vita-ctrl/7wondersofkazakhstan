from datetime import timedelta
from sqlalchemy import case, CheckConstraint, Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from app.models import Base

class Booking(Base):
    __tablename__ = 'bookings'

    id = Column(Integer, primary_key=True)

    tour_id = Column(String(150), ForeignKey('tours.id'), nullable=False)

    cost = Column(Integer, CheckConstraint('cost >= 0'), nullable=False)
    currency = Column(String(10), nullable=False)
    days = Column(Integer, CheckConstraint('days > 0'), nullable=False)
    prepayment = Column(Integer, CheckConstraint('prepayment >= 0'), nullable=False)
    max_seats = Column(Integer, CheckConstraint('max_seats > 0'), nullable=False)

    # relationships
    dates = relationship(
        "BookingDate",
        back_populates="booking",
        cascade="all, delete-orphan"
    )

    tour = relationship("Tour", back_populates="booking")

class BookingDate(Base):
    __tablename__ = 'booking_dates'

    id = Column(Integer, primary_key=True)

    booking_id = Column(
        Integer,
        ForeignKey('bookings.id', ondelete='CASCADE'),
        nullable=False
    )

    start_date = Column(Date, nullable=False)
    # end_date = Column(Date, nullable=False)

    price = Column(Integer, CheckConstraint('price >= 0'), nullable=False)
    seats = Column(Integer, CheckConstraint('seats >= 0'), nullable=False)
    # active = Column(Boolean, default=True)

    booking = relationship("Booking", back_populates="dates")

    @hybrid_property
    def end_date(self):
        return self.start_date + timedelta(days=self.booking.days - 1)

    @hybrid_property
    def active(self):  # pyright: ignore[reportRedeclaration]
        return self.seats > 0

    @active.expression
    def active(cls):
        return case(
            (cls.seats > 0, True),
            else_=False,
        )