from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.models.base import Base


class Subscriber(Base):
    __tablename__ = "subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    last_subscribed_at = Column(DateTime, default=datetime.now)
