from datetime import datetime, timedelta
from typing import Optional

import os
import asyncio
import logging
import smtplib
import uuid
import jwt  # Заменили jose на pyjwt
from concurrent.futures import ThreadPoolExecutor
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import requests
from dotenv import load_dotenv
from fastapi import (
    FastAPI,
    HTTPException,
    Depends,
    BackgroundTasks,
    Response,
    UploadFile,
    File,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    ForeignKey,
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session, relationship

# ----------------- НАСТРОЙКИ -----------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", SMTP_USER)

# URL фронтенда для редиректа после подтверждения email
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "https://30pf8d8t-5173.euw.devtunnels.ms",
)

# URL бэкенда (используется в ссылке подтверждения в письме)
BACKEND_URL = os.getenv("BACKEND_URL", "https://30pf8d8t-5173.euw.devtunnels.ms")

# JWT
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "CHANGE_ME_SUPER_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 14

# Cloudflare Images
CF_ACCOUNT_ID = os.getenv("CF_ACCOUNT_ID", "")
CF_IMAGES_TOKEN = os.getenv("CF_IMAGES_TOKEN", "")

# БД
DATABASE_URL = "sqlite:///./subscribers.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# Пул потоков для фоновых задач
executor = ThreadPoolExecutor(max_workers=4)

# Хэширование пароля
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")


# ----------------- МОДЕЛИ БД -----------------


class Subscriber(Base):
    __tablename__ = "subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    last_subscribed_at = Column(DateTime, default=datetime.now)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    card_brand = Column(String, nullable=True)
    card_last4 = Column(String, nullable=True)
    card_holder_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)

    email_tokens = relationship("EmailToken", back_populates="user")


class EmailToken(Base):
    __tablename__ = "email_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)

    user = relationship("User", back_populates="email_tokens")


class SupportMessage(Base):
    __tablename__ = "support_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    request_type = Column(String, nullable=True)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)


Base.metadata.create_all(bind=engine)


# ----------------- DEPENDS -----------------


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----------------- FASTAPI -----------------

app = FastAPI(title="KazWonder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # в проде лучше ограничить доменом фронта
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------- Pydantic-схемы -----------------


class SubscribeRequest(BaseModel):
    email: EmailStr
    name: str
    hp: Optional[str] = ""


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserProfile(BaseModel):
    id: int
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None
    card_brand: Optional[str] = None
    card_last4: Optional[str] = None
    card_holder_name: Optional[str] = None
    is_active: bool

    class Config:
        orm_mode = True


class UpdateProfileRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class CardRequest(BaseModel):
    brand: str
    last4: str
    holder_name: Optional[str] = None


class SupportRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    requestType: Optional[str] = None
    message: str


# ----------------- EMAIL ШАБЛОНЫ -----------------


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
                    <a href="{FRONTEND_URL}" class="btn">Посмотреть туры</a>
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


def build_html_verification(name: str, verify_url: str) -> str:
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
            .btn {{ display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Подтверждение регистрации</h1>
            </div>
            <div class="content">
                <h2>Здравствуйте, {name or "друг"}!</h2>
                <p>Вы зарегистрировались на платформе KazWonder.</p>
                <p>Чтобы подтвердить вашу почту, нажмите на кнопку ниже:</p>
                <p style="text-align: center;">
                    <a href="{verify_url}" class="btn">Подтвердить email</a>
                </p>
                <p>Если вы не создавали аккаунт, просто проигнорируйте это письмо.</p>
            </div>
        </div>
    </body>
    </html>
    """


def build_html_support(name: str, email: str, phone: Optional[str], request_type: Optional[str], message: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 10px; padding: 30px; }}
            .header {{ background: linear-gradient(135deg, #2c3e50 0%, #4b6a88 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }}
            .content {{ background: white; padding: 25px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }}
            .field {{ margin-bottom: 12px; }}
            .label {{ font-weight: 600; color: #555; }}
            .value {{ color: #222; }}
            .footer {{ margin-top: 20px; text-align: center; color: #666; font-size: 13px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>📩 Новое обращение в поддержку KazWonder</h2>
                <p>{datetime.now().strftime("%d.%m.%Y %H:%M")}</p>
            </div>
            <div class="content">
                <div class="field">
                    <span class="label">Имя:</span>
                    <div class="value">{name}</div>
                </div>
                <div class="field">
                    <span class="label">Email:</span>
                    <div class="value">{email}</div>
                </div>
                <div class="field">
                    <span class="label">Телефон:</span>
                    <div class="value">{phone or "не указан"}</div>
                </div>
                <div class="field">
                    <span class="label">Тип запроса:</span>
                    <div class="value">{request_type or "не указан"}</div>
                </div>
                <div class="field">
                    <span class="label">Сообщение:</span>
                    <div class="value">{message}</div>
                </div>
            </div>
            <div class="footer">
                Это письмо отправлено автоматически KazWonder API
            </div>
        </div>
    </body>
    </html>
    """


# ----------------- ОТПРАВКА EMAIL -----------------


def send_email_sync(to_email: str, subject: str, html_body: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = to_email

    part_html = MIMEText(html_body, "html", "utf-8")
    msg.attach(part_html)

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10) as server:
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)


async def send_email_async(to_email: str, subject: str, html_body: str):
    loop = asyncio.get_event_loop()
    try:
        await loop.run_in_executor(
            executor, lambda: send_email_sync(to_email, subject, html_body)
        )
        logger.info(f"Email успешно отправлен на {to_email}")
    except Exception as e:
        logger.error(f"Ошибка отправки email на {to_email}: {e}")


async def send_all_emails_async(name: str, email: str):
    admin_task = send_email_async(
        ADMIN_EMAIL,
        "🎯 Новая регистрация KazWonder",
        build_html_for_admin(name, email),
    )
    user_task = send_email_async(
        email,
        "✨ Добро пожаловать в KazWonder!",
        build_html_for_user(name),
    )
    await asyncio.gather(admin_task, user_task, return_exceptions=True)


async def send_verification_email(user: User):
    token = str(uuid.uuid4())
    expires_at = datetime.now() + timedelta(hours=24)

    db = SessionLocal()
    try:
        email_token = EmailToken(
            user_id=user.id,
            token=token,
            expires_at=expires_at,
            used=False,
        )
        db.add(email_token)
        db.commit()
    finally:
        db.close()

    verify_url = f"{BACKEND_URL}/login?verify_token={token}"
    html = build_html_verification(user.first_name or "", verify_url)
    await send_email_async(user.email, "Подтверждение email KazWonder", html)


# ----------------- УТИЛИТЫ АВТОРИЗАЦИИ -----------------


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now() + (expires_delta or timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Не удалось проверить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        if user_id is None:
            raise credentials_exception
            
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Токен истек")
    except jwt.InvalidTokenError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Email не подтверждён")
    return user


# ----------------- ЭНДПОИНТЫ ПОДПИСКИ -----------------


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
    cooldown = timedelta(seconds=30)

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

    background_tasks.add_task(send_all_emails_async, data.name, data.email)

    return {
        "status": "success",
        "message": "Подписка успешно оформлена!",
        "data": {"email": data.email, "name": data.name, "timestamp": now.isoformat()},
    }


# ----------------- ЭНДПОИНТ ПОДДЕРЖКИ -----------------


@app.post("/api/support")
async def support_form(
    data: SupportRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    # Сохранение в БД
    support_entry = SupportMessage(
        name=data.name,
        email=data.email,
        phone=data.phone,
        request_type=data.requestType,
        message=data.message,
    )
    db.add(support_entry)
    db.commit()

    # Письмо админу
    html = build_html_support(
        data.name,
        data.email,
        data.phone,
        data.requestType,
        data.message,
    )

    background_tasks.add_task(
        send_email_async,
        ADMIN_EMAIL,
        "📩 Новое сообщение в поддержку KazWonder",
        html,
    )

    return {"status": "success", "message": "Ваше сообщение отправлено!"}


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "KazWonder API",
    }


# ----------------- ЭНДПОИНТЫ АВТОРИЗАЦИИ -----------------


@app.post("/api/register", response_model=UserProfile)
async def register_user(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, data.email)
    if existing and existing.is_active:
        raise HTTPException(status_code=400, detail="Пользователь уже зарегистрирован")
    if existing and not existing.is_active:
        existing.hashed_password = get_password_hash(data.password)
        existing.first_name = data.first_name
        existing.last_name = data.last_name
        db.commit()
        await send_verification_email(existing)
        return existing

    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        is_active=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    await send_verification_email(user)

    return user

@app.get("/api/verify_token")
async def verify_token(token: str, db: Session = Depends(get_db)):
    email_token = (
        db.query(EmailToken)
        .filter(EmailToken.token == token)
        .filter(EmailToken.used == False)
        .first()
    )
    if not email_token:
        raise HTTPException(status_code=400, detail="Неверный или использованный токен")

    if email_token.expires_at < datetime.now():
        raise HTTPException(status_code=400, detail="Срок действия токена истёк")

    user = db.query(User).filter(User.id == email_token.user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="Пользователь не найден")

    # Активируем пользователя
    user.is_active = True
    email_token.used = True
    db.commit()

    return Response(status_code=200)  


@app.post("/api/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, data.email)
    if not user:
        raise HTTPException(status_code=400, detail="Неверный email или пароль")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Email не подтверждён")

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Неверный email или пароль")

    access_token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=access_token)


# ----------------- ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ -----------------


@app.get("/api/users/me", response_model=UserProfile)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user


@app.put("/api/users/me", response_model=UserProfile)
async def update_my_profile(
    data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.first_name is not None:
        current_user.first_name = data.first_name
    if data.last_name is not None:
        current_user.last_name = data.last_name

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


# ----------------- КАРТА ПОЛЬЗОВАТЕЛЯ -----------------


@app.post("/api/users/me/card", response_model=UserProfile)
async def set_card(
    data: CardRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not data.last4.isdigit() or len(data.last4) != 4:
        raise HTTPException(status_code=400, detail="last4 должен содержать 4 цифры")

    current_user.card_brand = data.brand
    current_user.card_last4 = data.last4
    current_user.card_holder_name = data.holder_name

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


# ----------------- АВАТАР ЧЕРЕЗ CLOUDFLARE IMAGES -----------------


@app.post("/api/users/me/avatar", response_model=UserProfile)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not CF_ACCOUNT_ID or not CF_IMAGES_TOKEN:
        raise HTTPException(
            status_code=500,
            detail="Cloudflare Images не настроен (CF_ACCOUNT_ID/CF_IMAGES_TOKEN)",
        )

    content = await file.read()
    url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/images/v1"

    headers = {"Authorization": f"Bearer {CF_IMAGES_TOKEN}"}
    files = {
        "file": (file.filename, content, file.content_type),
    }

    try:
        resp = requests.post(url, headers=headers, files=files, timeout=20)
        data = resp.json()
    except Exception as e:
        logger.error(f"Ошибка загрузки в Cloudflare Images: {e}")
        raise HTTPException(status_code=500, detail="Ошибка загрузки аватара")

    if not data.get("success"):
        logger.error(f"Cloudflare error: {data}")
        raise HTTPException(
            status_code=500,
            detail="Cloudflare не принял изображение",
        )

    result = data["result"]
    variants = result.get("variants") or []
    avatar_url = variants[0] if variants else None

    if not avatar_url:
        raise HTTPException(status_code=500, detail="Не удалось получить URL аватара")

    current_user.avatar_url = avatar_url
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@app.get("/api/")
async def root():
    return {"message": "KazWonder API работает!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
