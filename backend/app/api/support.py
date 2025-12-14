
from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import SupportRequest
from app.models import SupportMessage
from app.email_service import build_html_support, send_email_async
from app.config import Settings, get_settings

router = APIRouter()

@router.post("/support")
async def support_form(
    data: SupportRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings)
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
        settings.SMTP.ADMIN,
        "📩 Новое сообщение в поддержку KazWonder",
        html,
    )

    return {"status": "success", "message": "Ваше сообщение отправлено!"}

