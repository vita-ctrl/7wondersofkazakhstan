from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor
import logging

# Настройка логгирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

DATABASE_URL = "sqlite:///./subscribers.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# Пул потоков для фоновых задач
executor = ThreadPoolExecutor(max_workers=4)


class Subscriber(Base):
    __tablename__ = "subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    last_subscribed_at = Column(DateTime, default=datetime.now)


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI(title="KazWonder Subscription API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SubscribeRequest(BaseModel):
    email: EmailStr
    name: str
    hp: str | None = ""


def build_html_for_admin(name: str, email: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 10px; padding: 30px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }}
            .content {{ background: white; padding: 25px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }}
            .field {{ margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }}
            .label {{ font-weight: 600; color: #555; display: inline-block; width: 80px; }}
            .value {{ color: #222; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Новая подписка на KazWonder</h1>
                <p>{datetime.now().strftime("%d.%m.%Y %H:%M")}</p>
            </div>
            <div class="content">
                <div class="field">
                    <span class="label">Имя:</span>
                    <span class="value">{name}</span>
                </div>
                <div class="field">
                    <span class="label">Email:</span>
                    <span class="value">{email}</span>
                </div>
                <div class="field">
                    <span class="label">Дата:</span>
                    <span class="value">{datetime.now().strftime("%d.%m.%Y %H:%M:%S")}</span>
                </div>
            </div>
        </div>
    </body>
    </html>
    """


def build_html_for_user(name: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 10px; padding: 30px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }}
            .content {{ background: white; padding: 25px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }}
            .footer {{ margin-top: 20px; text-align: center; color: #666; font-size: 14px; }}
            .btn {{ display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✨ Добро пожаловать в KazWonder!</h1>
            </div>
            <div class="content">
                <h2>Здравствуйте, {name}!</h2>
                <p>Спасибо за подписку на эксклюзивные подборки туров по Казахстану.</p>
                <p>Вы будете получать:</p>
                <ul>
                    <li>Лучшие маршруты по Казахстану</li>
                    <li>Эксклюзивные предложения</li>
                    <li>Советы от местных экспертов</li>
                    <li>Персональные рекомендации</li>
                </ul>
                <div style="text-align: center;">
                    <a href="#" class="btn">Посмотреть туры</a>
                </div>
            </div>
            <div class="footer">
                <p>С уважением, команда KazWonder</p>
                <p>Если вы не подписывались, просто проигнорируйте это письмо.</p>
            </div>
        </div>
    </body>
    </html>
    """


async def send_email_async(to_email: str, subject: str, html_body: str):
    """Асинхронная отправка email"""
    loop = asyncio.get_event_loop()
    try:
        await loop.run_in_executor(
            executor, lambda: send_email_sync(to_email, subject, html_body)
        )
        logger.info(f"Email успешно отправлен на {to_email}")
    except Exception as e:
        logger.error(f"Ошибка отправки email на {to_email}: {e}")


def send_email_sync(to_email: str, subject: str, html_body: str):
    """Синхронная отправка email"""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = to_email

    part_html = MIMEText(html_body, "html", "utf-8")
    msg.attach(part_html)

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10) as server:
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)


async def send_all_emails_async(name: str, email: str):
    """Асинхронная отправка обоих писем"""
    # Запускаем отправку параллельно
    admin_task = send_email_async(
        ADMIN_EMAIL, "🎯 Новая регистрация KazWonder", build_html_for_admin(name, email)
    )

    user_task = send_email_async(
        email, "✨ Добро пожаловать в KazWonder!", build_html_for_user(name)
    )

    # Ждем завершения обеих задач
    await asyncio.gather(admin_task, user_task, return_exceptions=True)


@app.post("/api/subscribe")
async def subscribe(
    data: SubscribeRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    if data.hp:
        return {"status": "ok"}

    subscriber = db.query(Subscriber).filter(Subscriber.email == data.email).first()
    now = datetime.now()
    cooldown = timedelta(seconds=30)  # Уменьшил время cooldown

    if subscriber:
        if now - subscriber.last_subscribed_at < cooldown:
            raise HTTPException(
                status_code=429,
                detail="Пожалуйста, подождите перед повторной подпиской",
            )
        subscriber.name = data.name
        subscriber.last_subscribed_at = now
    else:
        new_sub = Subscriber(
            email=data.email,
            name=data.name,
            created_at=now,
            last_subscribed_at=now,
        )
        db.add(new_sub)

    db.commit()

    # Отправляем письма в фоновом режиме для ускорения ответа
    background_tasks.add_task(send_all_emails_async, data.name, data.email)

    # Мгновенный ответ клиенту
    return {
        "status": "success",
        "message": "Подписка успешно оформлена!",
        "data": {"email": data.email, "name": data.name, "timestamp": now.isoformat()},
    }


@app.get("/health")
async def health_check():
    """Проверка состояния сервиса"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "KazWonder Subscription API",
    }
