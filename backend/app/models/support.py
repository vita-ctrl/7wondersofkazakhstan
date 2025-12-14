from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime


from app.models.base import Base


class SupportMessage(Base):
    __tablename__ = "support_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    request_type = Column(String, nullable=True)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
