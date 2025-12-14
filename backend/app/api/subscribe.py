from datetime import datetime, timedelta
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import SubscribeRequest

from app.models import Subscriber
from app.database import get_db
from app.email_service import send_all_emails_async

router = APIRouter()

@router.post("/subscribe")
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
        if bool(now - subscriber.last_subscribed_at < cooldown):
            raise HTTPException(
                status_code=429,
                detail="Пожалуйста, подождите перед повторной подпиской",
            )
        subscriber.name = data.name  # pyright: ignore[reportAttributeAccessIssue]
        subscriber.last_subscribed_at = now # pyright: ignore[reportAttributeAccessIssue]
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
