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
from app.schemas.order import AdditionalTravelers, PrimaryTraveler

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
    await send_email_async(str(user.email), "Подтверждение регистрации KazWonder", html)


def build_html_for_admin(name: str, email: str) -> str:
    """Email для администратора о новой подписке - минималистичный стиль"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                background: linear-gradient(135deg, #0a0e1a 0%, #1a2332 100%);
                padding: 40px 20px;
                line-height: 1.6;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }}
            .header {{
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }}
            .header::before {{
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                animation: pulse 4s ease-in-out infinite;
            }}
            @keyframes pulse {{
                0%, 100% {{ transform: scale(1); opacity: 0.5; }}
                50% {{ transform: scale(1.1); opacity: 0.8; }}
            }}
            .header-content {{
                position: relative;
                z-index: 1;
            }}
            .header h1 {{
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 10px;
                text-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }}
            .header .emoji {{
                font-size: 48px;
                display: block;
                margin-bottom: 15px;
                animation: bounce 2s ease-in-out infinite;
            }}
            @keyframes bounce {{
                0%, 100% {{ transform: translateY(0); }}
                50% {{ transform: translateY(-10px); }}
            }}
            .header .timestamp {{
                color: rgba(255,255,255,0.9);
                font-size: 14px;
                font-weight: 500;
            }}
            .content {{
                padding: 40px 30px;
                background: #ffffff;
            }}
            .info-card {{
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-radius: 16px;
                padding: 25px;
                margin-bottom: 20px;
                border: 2px solid #e2e8f0;
            }}
            .info-row {{
                display: flex;
                align-items: flex-start;
                padding: 12px 0;
                border-bottom: 1px solid #e2e8f0;
            }}
            .info-row:last-child {{
                border-bottom: none;
            }}
            .info-label {{
                font-weight: 700;
                color: #475569;
                min-width: 100px;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }}
            .info-value {{
                color: #0f172a;
                font-size: 16px;
                font-weight: 600;
                flex: 1;
            }}
            .highlight {{
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: 700;
            }}
            .footer {{
                padding: 30px;
                text-align: center;
                background: #f8fafc;
                border-top: 2px solid #e2e8f0;
            }}
            .footer p {{
                color: #64748b;
                font-size: 13px;
                line-height: 1.6;
            }}
            .badge {{
                display: inline-block;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 10px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="header-content">
                    <span class="emoji">🎯</span>
                    <h1>Новая подписка!</h1>
                    <p class="timestamp">{datetime.now().strftime("%d.%m.%Y в %H:%M")}</p>
                </div>
            </div>
            
            <div class="content">
                <div class="info-card">
                    <div class="info-row">
                        <span class="info-label">Имя</span>
                        <span class="info-value highlight">{name}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Email</span>
                        <span class="info-value">{email}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Время</span>
                        <span class="info-value">{datetime.now().strftime("%d.%m.%Y %H:%M:%S")}</span>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <span class="badge">✓ Новый подписчик</span>
                </div>
            </div>
            
            <div class="footer">
                <p>Автоматическое уведомление от <strong>KazWonder</strong></p>
                <p style="margin-top: 5px; color: #94a3b8;">Платформа авторских туров по Казахстану</p>
            </div>
        </div>
    </body>
    </html>
    """

def build_html_for_user(name: str) -> str:
    """Email для пользователя - строгий профессиональный дизайн"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                background: #f5f5f5;
                padding: 40px 20px;
                line-height: 1.6;
            }}
            .container {{
                max-width: 650px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }}
            .hero {{
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
                padding: 50px 40px;
                text-align: center;
                position: relative;
            }}
            .logo {{
                font-size: 42px;
                margin-bottom: 18px;
                display: block;
            }}
            .hero h1 {{
                color: #ffffff;
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 12px;
                letter-spacing: -0.3px;
            }}
            .hero .subtitle {{
                color: rgba(255,255,255,0.9);
                font-size: 16px;
                font-weight: 400;
            }}
            .content {{
                padding: 45px 40px;
                background: #ffffff;
            }}
            .greeting {{
                font-size: 22px;
                color: #1e293b;
                font-weight: 600;
                margin-bottom: 25px;
            }}
            .greeting .name {{
                color: #3b82f6;
            }}
            .message {{
                color: #334155;
                font-size: 16px;
                line-height: 1.7;
                margin-bottom: 30px;
            }}
            .benefits {{
                background: #f8fafc;
                border-radius: 8px;
                padding: 35px;
                margin: 30px 0;
                border: 1px solid #e2e8f0;
            }}
            .benefits h3 {{
                color: #1e293b;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 25px;
            }}
            .benefit-item {{
                display: flex;
                align-items: flex-start;
                padding: 12px 0;
                border-bottom: 1px solid #e2e8f0;
            }}
            .benefit-item:last-child {{
                border-bottom: none;
                padding-bottom: 0;
            }}
            .benefit-icon {{
                font-size: 20px;
                margin-right: 15px;
                min-width: 30px;
                text-align: center;
                margin-top: 2px;
            }}
            .benefit-text {{
                color: #475569;
                font-size: 15px;
                font-weight: 400;
                flex: 1;
            }}
            .cta-button {{
                display: inline-block;
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
                color: #ffffff !important;
                padding: 16px 40px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                margin: 30px auto;
                display: block;
                max-width: 260px;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                transition: all 0.3s ease;
            }}
            .divider {{
                height: 1px;
                background: #e2e8f0;
                margin: 40px 0;
            }}
            .footer {{
                padding: 35px 40px;
                background: #f8fafc;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }}
            .footer-brand {{
                color: #1e293b;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
            }}
            .footer-text {{
                color: #64748b;
                font-size: 14px;
                line-height: 1.6;
                margin-bottom: 8px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="hero">
                <span class="logo">⛰️</span>
                <h1>Подтверждение подписки</h1>
                <p class="subtitle">KazWonder — маркетплейс туристических маршрутов</p>
            </div>
            
            <div class="content">
                <p class="greeting">Уважаемый(-ая) <span class="name">{name}</span>,</p>
                
                <p class="message">
                    Благодарим за регистрацию на платформе <strong>KazWonder</strong>. 
                    Вы успешно подписались на информационную рассылку о турах и маршрутах по Казахстану.
                </p>
                
                <p class="message">
                    Наша платформа объединяет профессиональных гидов и организаторов туров, 
                    предлагающих проверенные маршруты по природным и культурным 
                    достопримечательностям Казахстана.
                </p>
                
                <div class="benefits">
                    <h3>Преимущества подписки:</h3>
                    
                    <div class="benefit-item">
                        <span class="benefit-icon">📍</span>
                        <span class="benefit-text">Информация о новых маршрутах и турах от проверенных организаторов</span>
                    </div>
                    
                    <div class="benefit-item">
                        <span class="benefit-icon">💼</span>
                        <span class="benefit-text">Специальные предложения и акции для подписчиков</span>
                    </div>
                    
                    <div class="benefit-item">
                        <span class="benefit-icon">📊</span>
                        <span class="benefit-text">Аналитика и рекомендации по выбору туров</span>
                    </div>
                    
                    <div class="benefit-item">
                        <span class="benefit-icon">🔔</span>
                        <span class="benefit-text">Уведомления о сезонных турах и доступности маршрутов</span>
                    </div>
                    
                    <div class="benefit-item">
                        <span class="benefit-icon">📖</span>
                        <span class="benefit-text">Практические материалы по подготовке к путешествиям</span>
                    </div>
                </div>
                
                <a href="{settings.FRONTEND_URL}" class="cta-button">
                    Перейти на платформу
                </a>
            </div>
            
            <div class="footer">
                <p class="footer-brand">KazWonder</p>
                <p class="footer-text">Маркетплейс туристических маршрутов по Казахстану</p>
                <p class="footer-text" style="font-size: 13px; margin-top: 15px; color: #94a3b8;">
                    Если вы не регистрировались на нашей платформе, проигнорируйте это письмо
                </p>
                <p class="footer-text" style="font-size: 12px; margin-top: 10px; color: #cbd5e1;">
                    © 2025 KazWonder. Все права защищены.
                </p>
            </div>
        </div>
    </body>
    </html>
    """


def build_html_verification(name: str, verify_url: str) -> str:
    """Email для подтверждения регистрации - современный дизайн"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                background: linear-gradient(135deg, #0a0e1a 0%, #1e293b 100%);
                padding: 40px 20px;
                line-height: 1.6;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
            }}
            .header {{
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                padding: 50px 40px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }}
            .header::before {{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
                            radial-gradient(circle at 70% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%);
                animation: glow 8s ease-in-out infinite;
            }}
            @keyframes glow {{
                0%, 100% {{ opacity: 0.5; }}
                50% {{ opacity: 1; }}
            }}
            .header-content {{
                position: relative;
                z-index: 1;
            }}
            .shield-icon {{
                font-size: 64px;
                display: block;
                margin-bottom: 20px;
                animation: pulse 2s ease-in-out infinite;
            }}
            @keyframes pulse {{
                0%, 100% {{ transform: scale(1); }}
                50% {{ transform: scale(1.1); }}
            }}
            .header h1 {{
                color: #ffffff;
                font-size: 32px;
                font-weight: 800;
                margin-bottom: 10px;
                text-shadow: 0 2px 15px rgba(0,0,0,0.3);
            }}
            .header p {{
                color: rgba(255,255,255,0.9);
                font-size: 16px;
            }}
            .content {{
                padding: 50px 40px;
            }}
            .greeting {{
                color: #0f172a;
                font-size: 22px;
                font-weight: 700;
                margin-bottom: 25px;
            }}
            .message {{
                color: #475569;
                font-size: 16px;
                line-height: 1.8;
                margin-bottom: 20px;
            }}
            .notice-box {{
                background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
                border-left: 4px solid #3b82f6;
                border-radius: 12px;
                padding: 25px;
                margin: 30px 0;
            }}
            .notice-box p {{
                color: #1e293b;
                font-size: 15px;
                font-weight: 600;
                margin: 0;
            }}
            .verify-button {{
                display: inline-block;
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                color: #ffffff;
                padding: 20px 50px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 700;
                font-size: 17px;
                text-align: center;
                margin: 35px auto;
                display: block;
                max-width: 320px;
                box-shadow: 0 15px 40px rgba(30, 41, 59, 0.4);
                transition: all 0.3s ease;
            }}
            .verify-button:hover {{
                transform: translateY(-2px);
                box-shadow: 0 20px 50px rgba(30, 41, 59, 0.5);
            }}
            .alt-link-box {{
                background: #f8fafc;
                border-radius: 12px;
                padding: 25px;
                margin-top: 30px;
                border: 2px solid #e2e8f0;
            }}
            .alt-link-box p {{
                color: #64748b;
                font-size: 14px;
                margin-bottom: 12px;
            }}
            .alt-link-box .link {{
                color: #3b82f6;
                word-break: break-all;
                font-size: 13px;
                text-decoration: none;
                font-weight: 500;
            }}
            .timer {{
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-radius: 12px;
                padding: 20px;
                margin-top: 30px;
                text-align: center;
                border: 2px solid #fbbf24;
            }}
            .timer p {{
                color: #92400e;
                font-size: 14px;
                font-weight: 600;
                margin: 0;
            }}
            .footer {{
                padding: 40px;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-top: 2px solid #e2e8f0;
            }}
            .footer-text {{
                color: #64748b;
                font-size: 14px;
                line-height: 1.8;
                margin-bottom: 12px;
                text-align: center;
            }}
            .footer-brand {{
                color: #0f172a;
                font-size: 16px;
                font-weight: 700;
                text-align: center;
                margin-top: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="header-content">
                    <span class="shield-icon">🛡️</span>
                    <h1>Подтверждение регистрации</h1>
                    <p>Финальный шаг для активации аккаунта</p>
                </div>
            </div>
            
            <div class="content">
                <p class="greeting">Здравствуйте{', ' + name if name else ''}!</p>
                
                <p class="message">
                    Благодарим вас за регистрацию на платформе <strong>KazWonder</strong>. 
                    Мы рады приветствовать вас в сообществе любителей путешествий по Казахстану!
                </p>
                
                <div class="notice-box">
                    <p>⚡ Для завершения регистрации подтвердите ваш email-адрес</p>
                </div>
                
                <p class="message">
                    Нажмите на кнопку ниже, чтобы активировать ваш аккаунт и получить 
                    полный доступ ко всем функциям платформы:
                </p>
                
                <a href="{verify_url}" class="verify-button">
                    ✓ Подтвердить email
                </a>
                
                <div class="timer">
                    <p>⏰ Ссылка действительна в течение 24 часов</p>
                </div>
                
                <div class="alt-link-box">
                    <p><strong>Если кнопка не работает</strong>, скопируйте и вставьте эту ссылку в браузер:</p>
                    <p><a href="{verify_url}" class="link">{verify_url}</a></p>
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    <strong>Если вы не регистрировались на KazWonder</strong>, просто проигнорируйте это письмо.
                </p>
                <p class="footer-text">
                    Ваш email-адрес не будет использован без вашего подтверждения.
                </p>
                <p class="footer-text" style="font-size: 13px; color: #94a3b8; margin-top: 20px;">
                    Это автоматическое письмо, пожалуйста, не отвечайте на него.
                </p>
                <p class="footer-brand">KazWonder Team</p>
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
    """Email для обращения в поддержку - чистый минимализм"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                background: linear-gradient(135deg, #0a0e1a 0%, #1a2332 100%);
                padding: 40px 20px;
                line-height: 1.6;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }}
            .header {{
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }}
            .header::before {{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%);
            }}
            .header-content {{
                position: relative;
                z-index: 1;
            }}
            .header .emoji {{
                font-size: 48px;
                display: block;
                margin-bottom: 15px;
            }}
            .header h1 {{
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 10px;
                text-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }}
            .header .timestamp {{
                color: rgba(255,255,255,0.9);
                font-size: 14px;
                font-weight: 500;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .info-grid {{
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-radius: 16px;
                padding: 30px;
                margin-bottom: 25px;
                border: 2px solid #e2e8f0;
            }}
            .info-item {{
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid #e2e8f0;
            }}
            .info-item:last-child {{
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: none;
            }}
            .info-label {{
                color: #64748b;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
                display: block;
            }}
            .info-value {{
                color: #0f172a;
                font-size: 16px;
                font-weight: 600;
            }}
            .message-box {{
                background: #ffffff;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                padding: 25px;
                margin-top: 20px;
            }}
            .message-box .label {{
                color: #64748b;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 12px;
                display: block;
            }}
            .message-box .text {{
                color: #1e293b;
                font-size: 15px;
                line-height: 1.8;
                white-space: pre-wrap;
            }}
            .priority-badge {{
                display: inline-block;
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                padding: 8px 20px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 20px;
            }}
            .footer {{
                padding: 25px 30px;
                background: #f8fafc;
                border-top: 2px solid #e2e8f0;
                text-align: center;
            }}
            .footer p {{
                color: #64748b;
                font-size: 13px;
                margin-bottom: 5px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="header-content">
                    <span class="emoji">📩</span>
                    <h1>Новое обращение в поддержку</h1>
                    <p class="timestamp">{datetime.now().strftime("%d.%m.%Y в %H:%M")}</p>
                </div>
            </div>
            
            <div class="content">
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Контактное лицо</span>
                        <div class="info-value">{name}</div>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Email для ответа</span>
                        <div class="info-value">{email}</div>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Телефон</span>
                        <div class="info-value">{phone if phone else 'Не указан'}</div>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Тип обращения</span>
                        <div class="info-value">{request_type if request_type else 'Общий вопрос'}</div>
                    </div>
                </div>
                
                <div class="message-box">
                    <span class="label">Сообщение от клиента</span>
                    <div class="text">{message}</div>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>KazWonder Support</strong></p>
                <p style="color: #94a3b8; margin-top: 8px;">Автоматическое уведомление</p>
            </div>
        </div>
    </body>
    </html>
    """

def generate_order_email_html(
    order_id: int,
    tour_title: str,
    tour_image_url: str,
    date_range: str,
    days: int,
    participants_count: int,
    total_amount: int,
    prepayment_amount: int,
    currency: str,
    primary_traveler: PrimaryTraveler,
    additional_travelers: AdditionalTravelers | None = None,
) -> str:
    """Генерирует HTML письмо-чек для заказа тура"""
    
    order_number = f"TRV-{order_id:08d}"
    current_date = datetime.now().strftime("%d.%m.%Y %H:%M")
    
    # Форматирование цены
    def format_price(amount: int) -> str:
        formatted = f"{amount:,}".replace(",", " ")
        return f"{currency} {formatted}"
    
    # Склонение слов
    def pluralize(n: int, forms: tuple[str, str, str]) -> str:
        if n % 10 == 1 and n % 100 != 11:
            return f"{n} {forms[0]}"
        elif 2 <= n % 10 <= 4 and (n % 100 < 10 or n % 100 >= 20):
            return f"{n} {forms[1]}"
        return f"{n} {forms[2]}"
    
    # Генерация списка путешественников
    def generate_travelers_html() -> str:
        travelers_html = ""
        
        # Основной путешественник
        primary_name = f"{primary_traveler.firstName or ''} {primary_traveler.lastName or ''}".strip()
        primary_email = primary_traveler.email or ''
        
        travelers_html += f"""
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
            <tr>
                <td style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 18px; border-left: 4px solid #22c55e;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="width: 40px; vertical-align: top;">
                                <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 50%; text-align: center; line-height: 36px; font-size: 18px; color: white;">👤</div>
                            </td>
                            <td style="vertical-align: top;">
                                <div style="font-weight: 700; color: #166534; font-size: 16px; margin-bottom: 4px;">
                                    {primary_name}
                                </div>
                                <div style="font-size: 13px; color: #15803d; margin-bottom: 2px;">
                                    ✨ Основной путешественник
                                </div>
                                <div style="font-size: 13px; color: #16a34a;">
                                    ✉️ {primary_email}
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        """
        
        # Дополнительные путешественники
        if additional_travelers:
            for i, traveler in enumerate(additional_travelers.root, start=1):
                traveler_name = f"{traveler.firstName or ''} {traveler.lastName or ''}".strip()
                if traveler_name:
                    travelers_html += f"""
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                        <tr>
                            <td style="background: #f8fafc; border-radius: 12px; padding: 18px; border-left: 4px solid #94a3b8;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="width: 40px; vertical-align: top;">
                                            <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 50%; text-align: center; line-height: 36px; font-size: 18px; color: white;">👤</div>
                                        </td>
                                        <td style="vertical-align: top;">
                                            <div style="font-weight: 700; color: #1e293b; font-size: 16px; margin-bottom: 4px;">
                                                {traveler_name}
                                            </div>
                                            <div style="font-size: 13px; color: #475569;">
                                                Путешественник #{i}
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    """
        
        return travelers_html

    # Расчет остатка
    remaining_amount = total_amount - prepayment_amount
    

    html = f"""
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Подтверждение заказа {order_number}</title>
        <!--[if mso]>
        <style type="text/css">
            table {{border-collapse: collapse; border-spacing: 0; margin: 0;}}
        </style>
        <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
        
        <!-- Контейнер -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 20px 0;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
                        
                        <!-- Хедер -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%); border-radius: 20px 20px 0 0; padding: 40px 32px; text-align: center;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center">
                                            <div style="width: 80px; height: 80px; background: white; border-radius: 50%; margin: 0 auto 20px; box-shadow: 0 8px 16px rgba(0,0,0,0.15);">
                                                <table width="80" height="80" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td align="center" valign="middle" style="font-size: 40px; line-height: 80px;">✓</td>
                                                    </tr>
                                                </table>
                                            </div>
                                            <h1 style="color: white; margin: 0 0 12px; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                                🎉 Оплата прошла успешно!
                                            </h1>
                                            <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 16px; line-height: 1.5;">
                                                Ваше бронирование подтверждено<br>Приготовьтесь к незабываемому путешествию!
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Основной контент -->
                        <tr>
                            <td style="background: white; padding: 40px 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
                                
                                <!-- Номер заказа -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 3px dashed #f59e0b; border-radius: 16px; padding: 20px; text-align: center;">
                                            <div style="font-size: 13px; color: #92400e; margin-bottom: 6px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">Номер заказа</div>
                                            <div style="font-size: 28px; font-weight: 700; color: #78350f; font-family: 'Courier New', monospace; letter-spacing: 2px;">{order_number}</div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Информация о туре -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                                    <tr>
                                        <td>
                                            <h2 style="font-size: 15px; color: #64748b; margin: 0 0 16px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                                                🎯 Детали Тура
                                            </h2>
                                            
                                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; overflow: hidden; border: 2px solid #e2e8f0;">
                                                <tr>
                                                    <td style="padding: 20px;">
                                                        <table width="100%" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td style="width: 140px; vertical-align: top; padding-right: 20px;">
                                                                    <img src="{tour_image_url}" alt="{tour_title}" style="width: 140px; height: 105px; object-fit: cover; border-radius: 12px; display: block; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <h3 style="margin: 0 0 12px; font-size: 19px; color: #0f172a; font-weight: 700; line-height: 1.3;">{tour_title}</h3>
                                                                    <div style="font-size: 14px; color: #475569; margin-bottom: 6px; line-height: 1.6;">
                                                                        <span style="display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 6px; font-weight: 600;">📅 {date_range}</span>
                                                                    </div>
                                                                    <div style="font-size: 14px; color: #475569; line-height: 1.6;">
                                                                        <span style="display: inline-block; background: #fce7f3; color: #be185d; padding: 4px 10px; border-radius: 6px; font-weight: 600;">⏱ {pluralize(days, ('день', 'дня', 'дней'))}</span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Путешественники -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                                    <tr>
                                        <td>
                                            <h2 style="font-size: 15px; color: #64748b; margin: 0 0 16px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                                                👥 Путешественники <span style="background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 8px; font-size: 13px;">({participants_count})</span>
                                            </h2>
                                            {generate_travelers_html()}
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Оплата -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                                    <tr>
                                        <td>
                                            <h2 style="font-size: 15px; color: #64748b; margin: 0 0 16px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                                                💳 Детали Оплаты
                                            </h2>
                                            
                                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; border: 2px solid #e2e8f0; overflow: hidden;">
                                                <tr>
                                                    <td style="padding: 24px;">
                                                        <table width="100%" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td style="padding: 0 0 16px 0; border-bottom: 2px solid #e2e8f0;">
                                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                                        <tr>
                                                                            <td style="color: #64748b; font-size: 15px;">Стоимость тура</td>
                                                                            <td align="right" style="color: #1e293b; font-weight: 700; font-size: 16px;">{format_price(total_amount)}</td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 16px 0; border-bottom: 2px solid #e2e8f0;">
                                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                                        <tr>
                                                                            <td style="color: #64748b; font-size: 15px;">Количество участников</td>
                                                                            <td align="right" style="color: #1e293b; font-weight: 600; font-size: 15px;">{pluralize(participants_count, ('человек', 'человека', 'человек'))}</td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 16px 0 0 0;">
                                                                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; padding: 16px;">
                                                                        <tr>
                                                                            <td style="color: #065f46; font-weight: 700; font-size: 18px;">✓ Оплачено</td>
                                                                            <td align="right" style="color: #047857; font-weight: 700; font-size: 22px;">{format_price(prepayment_amount)}</td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Остаток к оплате -->
                                {f'''
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 20px; border: 2px solid #f59e0b;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="vertical-align: middle;">
                                                        <div style="font-size: 16px; color: #92400e; font-weight: 700; margin-bottom: 4px;">⚠️ Остаток к оплате</div>
                                                        <div style="font-size: 13px; color: #b45309;">Оплачивается при встрече с гидом</div>
                                                    </td>
                                                    <td align="right" style="vertical-align: middle;">
                                                        <div style="font-size: 24px; font-weight: 700; color: #78350f;">{format_price(remaining_amount)}</div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                ''' if remaining_amount > 0 else ''}
                                
                                <!-- Контактная информация -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 16px; padding: 20px; border: 2px solid #3b82f6;">
                                            <h3 style="margin: 0 0 12px; font-size: 16px; color: #1e40af; font-weight: 700;">📞 Нужна помощь?</h3>
                                            <p style="margin: 0; font-size: 14px; color: #1e40af; line-height: 1.6;">
                                                Мы всегда на связи! Свяжитесь с нами:<br>
                                                <a href="mailto:support@KazWonder.kz" style="color: #1d4ed8; text-decoration: none; font-weight: 600;">✉️ support@KazWonder.kz</a>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Дополнительная информация -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border-radius: 12px; padding: 16px; border-left: 4px solid #84cc16;">
                                    <tr>
                                        <td style="font-size: 13px; color: #475569; line-height: 1.6;">
                                            <strong style="color: #334155;">💡 Важно помнить:</strong><br>
                                            • Сохраните это письмо для предъявления гиду<br>
                                            • Приезжайте на место встречи за 15 минут до начала<br>
                                            • При себе иметь документ, удостоверяющий личность
                                        </td>
                                    </tr>
                                </table>
                                
                            </td>
                        </tr>
                        
                        <!-- Футер -->
                        <tr>
                            <td style="background: white; border-radius: 0 0 20px 20px; text-align: center; padding: 32px; color: #94a3b8; font-size: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
                                <p style="margin: 0 0 12px; font-size: 13px; color: #64748b;">
                                    Это автоматическое письмо. Пожалуйста, не отвечайте на него.
                                </p>
                                <div style="height: 1px; background: linear-gradient(to right, transparent, #cbd5e1, transparent); margin: 16px 0;"></div>
                                <p style="margin: 0 0 8px; font-weight: 600; color: #475569;">© {datetime.now().year} KazWonder Travel</p>
                                <p style="margin: 0; color: #94a3b8;">Все права защищены</p>
                                <p style="margin: 12px 0 0; color: #cbd5e1; font-size: 11px;">Дата формирования: {current_date}</p>
                            </td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
        </table>
        
    </body>
    </html>
    """
    
    return html