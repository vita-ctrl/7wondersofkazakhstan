import asyncio
from datetime import datetime, timedelta
import smtplib
import uuid

from sqlalchemy.orm import Session

from app.config import get_settings
from app.models import User

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.executors import executor
from app.logger import logger
from app.database import session
from app.models import EmailToken

settings = get_settings()


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def send_email_sync(to_email: str, subject: str, html_body: str):
    msg = MIMEMultipart("alternative")
    msg["subject"] = subject
    msg["from"] = settings.SMTP.USER
    msg["to"] = to_email

    part_html = MIMEText(html_body, "html", "utf-8")
    msg.attach(part_html)

    with smtplib.SMTP_SSL(settings.SMTP.HOST, settings.SMTP.PORT, timeout=10) as server:
        server.login(settings.SMTP.USER, settings.SMTP.PASSWORD)
        server.send_message(msg)


async def send_email_async(to_email: str, subject: str, html_body: str):
    loop = asyncio.get_event_loop()
    try:
        await loop.run_in_executor(
            executor, lambda: send_email_sync(to_email, subject, html_body)
        )
        logger.info(f"email успешно отправлен на {to_email}")
    except Exception as e:
        logger.error(f"ошибка отправки email на {to_email}: {e}")


async def send_all_emails_async(name: str, email: str):
    admin_task = send_email_async(
        settings.SMTP.ADMIN,
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

    db = session()
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

    verify_url = f"{settings.FRONTEND_URL}login?verify_token={token}"
    html = build_html_verification(str(user.first_name) or "", verify_url)
    await send_email_async(str(user.email), "Подтверждение email KazWonder", html)


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
                    <a href="{settings.FRONTEND_URL}" class="btn">Посмотреть туры</a>
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


def build_html_support(
    name: str,
    email: str,
    phone: str | None,
    request_type: str | None,
    message: str,
) -> str:
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
            .value {{ color: #222; }} .footer {{ margin-top: 20px; text-align: center; color: #666; font-size: 13px; }} </style>
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
