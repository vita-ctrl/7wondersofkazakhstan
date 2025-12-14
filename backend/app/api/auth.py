from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.email_service import get_user_by_email, send_verification_email
from app.security import create_access_token, get_password_hash, verify_password

from app.schemas import UserProfile, RegisterRequest
from app.database import get_db
from app.models import User, EmailToken
from app.schemas import LoginRequest, TokenResponse

from datetime import datetime

router = APIRouter()

@router.post("/register", response_model=UserProfile)
async def register_user(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, data.email)
    if existing and bool(existing.is_active):
        raise HTTPException(status_code=400, detail="Пользователь уже зарегистрирован")
    if existing and not bool(existing.is_active):
        existing.hashed_password = get_password_hash(data.password)  # pyright: ignore[reportAttributeAccessIssue]
        existing.first_name = data.first_name  # pyright: ignore[reportAttributeAccessIssue]
        existing.last_name = data.last_name  # pyright: ignore[reportAttributeAccessIssue]
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

@router.get("/verify_token")
async def verify_token(token: str, db: Session = Depends(get_db)):
    email_token = (
        db.query(EmailToken)
        .filter(EmailToken.token == token)
        .filter(EmailToken.used == False)  # noqa: E712
        .first()
    )
    if not email_token:
        raise HTTPException(status_code=400, detail="Неверный или использованный токен")

    if bool(email_token.expires_at < datetime.now()):
        raise HTTPException(status_code=400, detail="Срок действия токена истёк")

    user = db.query(User).filter(User.id == email_token.user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="Пользователь не найден")

    # Активируем пользователя
    user.is_active = True  # pyright: ignore[reportAttributeAccessIssue]
    email_token.used = True  # pyright: ignore[reportAttributeAccessIssue]
    db.commit()

    return Response(status_code=200)  


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, data.email)
    if not user:
        raise HTTPException(status_code=400, detail="Неверный email или пароль")
    if not bool(user.is_active):
        raise HTTPException(status_code=400, detail="Email не подтверждён")

    if not verify_password(data.password, str(user.hashed_password)):
        raise HTTPException(status_code=400, detail="Неверный email или пароль")

    access_token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=access_token)