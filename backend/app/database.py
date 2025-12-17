from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import get_settings

settings = get_settings()

DATABASE_URL = settings.DB.URL

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
session = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()
