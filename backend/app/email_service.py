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
    """Email для пользователя - премиальный дизайн с горами"""
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
                max-width: 650px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
            }}
            .hero {{
                background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #8b5cf6 100%);
                padding: 60px 40px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }}
            .hero::before {{
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 100px;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,0 L50,30 L100,15 L150,40 L200,20 L250,45 L300,25 L350,50 L400,30 L450,55 L500,35 L550,60 L600,40 L650,65 L700,45 L750,70 L800,50 L850,75 L900,55 L950,80 L1000,60 L1050,85 L1100,65 L1150,90 L1200,70 L1200,120 L0,120 Z" fill="white" opacity="0.3"/></svg>') no-repeat bottom;
                background-size: cover;
                animation: wave 15s ease-in-out infinite;
            }}
            @keyframes wave {{
                0%, 100% {{ transform: translateX(0); }}
                50% {{ transform: translateX(-50px); }}
            }}
            .hero-content {{
                position: relative;
                z-index: 1;
            }}
            .logo {{
                font-size: 48px;
                margin-bottom: 20px;
                display: block;
                animation: float 3s ease-in-out infinite;
            }}
            @keyframes float {{
                0%, 100% {{ transform: translateY(0); }}
                50% {{ transform: translateY(-15px); }}
            }}
            .hero h1 {{
                color: #ffffff;
                font-size: 36px;
                font-weight: 800;
                margin-bottom: 15px;
                text-shadow: 0 4px 20px rgba(0,0,0,0.2);
                letter-spacing: -0.5px;
            }}
            .hero .subtitle {{
                color: rgba(255,255,255,0.95);
                font-size: 18px;
                font-weight: 500;
                text-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            .content {{
                padding: 50px 40px;
                background: #ffffff;
            }}
            .greeting {{
                font-size: 24px;
                color: #0f172a;
                font-weight: 700;
                margin-bottom: 20px;
            }}
            .greeting .name {{
                background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }}
            .message {{
                color: #475569;
                font-size: 16px;
                line-height: 1.8;
                margin-bottom: 35px;
            }}
            .benefits {{
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-radius: 20px;
                padding: 35px;
                margin: 30px 0;
                border: 2px solid #e2e8f0;
            }}
            .benefits h3 {{
                color: #0f172a;
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 25px;
                text-align: center;
            }}
            .benefit-item {{
                display: flex;
                align-items: center;
                padding: 15px 0;
                border-bottom: 1px solid #e2e8f0;
            }}
            .benefit-item:last-child {{
                border-bottom: none;
            }}
            .benefit-icon {{
                font-size: 28px;
                margin-right: 20px;
                min-width: 40px;
                text-align: center;
            }}
            .benefit-text {{
                color: #334155;
                font-size: 15px;
                font-weight: 500;
                flex: 1;
            }}
            .cta-button {{
                display: inline-block;
                background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #8b5cf6 100%);
                color: #ffffff;
                padding: 18px 45px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 700;
                font-size: 16px;
                text-align: center;
                margin: 30px auto;
                display: block;
                max-width: 280px;
                box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
                transition: all 0.3s ease;
            }}
            .divider {{
                height: 2px;
                background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
                margin: 40px 0;
            }}
            .footer {{
                padding: 40px;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                text-align: center;
                border-top: 2px solid #e2e8f0;
            }}
            .footer-brand {{
                color: #0f172a;
                font-size: 16px;
                font-weight: 700;
                margin-bottom: 10px;
            }}
            .footer-text {{
                color: #64748b;
                font-size: 14px;
                line-height: 1.6;
                margin-bottom: 8px;
            }}
            .social-links {{
                margin-top: 25px;
                display: flex;
                justify-content: center;
                gap: 15px;
            }}
            .social-icon {{
                display: inline-block;
                width: 40px;
                height: 40px;
                background: #ffffff;
                border-radius: 50%;
                border: 2px solid #e2e8f0;
                text-align: center;
                line-height: 36px;
                font-size: 18px;
                text-decoration: none;
                transition: all 0.3s ease;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="hero">
                <div class="hero-content">
                    <span class="logo">⛰️</span>
                    <h1>Добро пожаловать!</h1>
                    <p class="subtitle">Вы подписались на эксклюзивные туры по Казахстану</p>
                </div>
            </div>
            
            <div class="content">
                <p class="greeting">Здравствуйте, <span class="name">{name}</span>!</p>
                
                <p class="message">
                    Благодарим за подписку на <strong>KazWonder</strong> — премиальный маркетплейс 
                    авторских туров по Казахстану. Теперь вы будете первыми узнавать о лучших 
                    маршрутах и эксклюзивных предложениях.
                </p>
                
                <div class="benefits">
                    <h3>🎁 Что вас ожидает:</h3>
                    
                    <div class="benefit-item">
                        <span class="benefit-icon">🗺️</span>
                        <span class="benefit-text">Авторские маршруты от местных экспертов</span>
                    </div>
                    
                    <div class="benefit-item">
                        <span class="benefit-icon">⭐</span>
                        <span class="benefit-text">Эксклюзивные предложения для подписчиков</span>
                    </div>
                    
                    <div class="benefit-item">
                        <span class="benefit-icon">🎯</span>
                        <span class="benefit-text">Персональные рекомендации туров</span>
                    </div>
                    
                    <div class="benefit-item">
                        <span class="benefit-icon">💎</span>
                        <span class="benefit-text">Доступ к закрытым направлениям</span>
                    </div>
                    
                    <div class="benefit-item">
                        <span class="benefit-icon">🏔️</span>
                        <span class="benefit-text">Советы по организации путешествий</span>
                    </div>
                </div>
                
                <a href="{settings.FRONTEND_URL}" class="cta-button">
                    Посмотреть туры →
                </a>
                
                <div class="divider"></div>
                
                <p class="message" style="text-align: center; font-size: 15px; color: #64748b;">
                    Присоединяйтесь к сообществу путешественников, которые открывают 
                    для себя неизведанные уголки величественной природы Казахстана
                </p>
            </div>
            
            <div class="footer">
                <p class="footer-brand">KazWonder Expeditions</p>
                <p class="footer-text">Премиальные туры по Казахстану с 2008 года</p>
                <p class="footer-text" style="font-size: 13px; margin-top: 15px; color: #94a3b8;">
                    Если вы не подписывались на рассылку, просто проигнорируйте это письмо
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
                
                <div style="text-align: center;">
                    <span class="priority-badge">⚡ Требует ответа</span>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>KazWonder Support System</strong></p>
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
        travelers_html = f"""
        <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 8px;">
            <div style="font-weight: 600; color: #2d3748; margin-bottom: 4px;">
                👤 {primary_traveler.firstName if primary_traveler.firstName else ''} {primary_traveler.lastName if primary_traveler.lastName else ''}
            </div>
            <div style="font-size: 13px; color: #718096;">
                Основной путешественник • {primary_traveler.email if primary_traveler.email else ''}
            </div>
        </div>
        """
        
        if additional_travelers:
            for i, traveler in enumerate(additional_travelers.root, start=2):
                name = f"{traveler.firstName if primary_traveler.firstName else ''} {traveler.lastName if primary_traveler.lastName else ''}".strip()
                if name:
                    travelers_html += f"""
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 8px;">
                        <div style="font-weight: 600; color: #2d3748;">
                            👤 {name}
                        </div>
                        <div style="font-size: 13px; color: #718096;">
                            {i}-й путешественник
                        </div>
                    </div>
                    """
        
        return travelers_html

    html = f"""
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Подтверждение заказа {order_number}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Хедер -->
            <div style="background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
                <div style="width: 64px; height: 64px; background: white; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 32px;">✓</span>
                </div>
                <h1 style="color: white; margin: 0 0 8px; font-size: 24px; font-weight: 700;">
                    Оплата прошла успешно!
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">
                    Ваше бронирование подтверждено
                </p>
            </div>
            
            <!-- Основной контент -->
            <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Номер заказа -->
                <div style="background: #fefce8; border: 2px dashed #eab308; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px;">
                    <div style="font-size: 13px; color: #854d0e; margin-bottom: 4px;">Номер заказа</div>
                    <div style="font-size: 24px; font-weight: 700; color: #713f12; font-family: monospace;">{order_number}</div>
                </div>
                
                <!-- Информация о туре -->
                <div style="margin-bottom: 24px;">
                    <h2 style="font-size: 16px; color: #6b7280; margin: 0 0 16px; font-weight: 600;">
                        🎯 ДЕТАЛИ ТУРА
                    </h2>
                    
                    <div style="display: flex; gap: 16px; background: #f9fafb; border-radius: 12px; padding: 16px;">
                        <img src="{tour_image_url}" alt="{tour_title}" style="width: 120px; height: 90px; object-fit: cover; border-radius: 8px;">
                        <div>
                            <h3 style="margin: 0 0 8px; font-size: 18px; color: #1f2937;">{tour_title}</h3>
                            <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">
                                📅 {date_range}
                            </div>
                            <div style="font-size: 14px; color: #6b7280;">
                                ⏱ {pluralize(days, ('день', 'дня', 'дней'))}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Путешественники -->
                <div style="margin-bottom: 24px;">
                    <h2 style="font-size: 16px; color: #6b7280; margin: 0 0 16px; font-weight: 600;">
                        👥 ПУТЕШЕСТВЕННИКИ ({participants_count})
                    </h2>
                    {generate_travelers_html()}
                </div>
                
                <!-- Оплата -->
                <div style="margin-bottom: 24px;">
                    <h2 style="font-size: 16px; color: #6b7280; margin: 0 0 16px; font-weight: 600;">
                        💳 ДЕТАЛИ ОПЛАТЫ
                    </h2>
                    
                    <div style="background: #f9fafb; border-radius: 12px; padding: 16px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6b7280;">Стоимость тура</span>
                            <span style="color: #1f2937; font-weight: 600;">{format_price(total_amount)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #6b7280;">Участники</span>
                            <span style="color: #1f2937;">{pluralize(participants_count, ('человек', 'человека', 'человек'))}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #1f2937; font-weight: 700; font-size: 18px;">Оплачено</span>
                            <span style="color: #16a34a; font-weight: 700; font-size: 18px;">{format_price(prepayment_amount)}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Остаток к оплате -->
                {f'''
                <div style="background: #fef3c7; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 14px; color: #92400e; margin-bottom: 2px;">Остаток к оплате</div>
                            <div style="font-size: 12px; color: #a16207;">Оплачивается при встрече с гидом</div>
                        </div>
                        <div style="font-size: 20px; font-weight: 700; color: #92400e;">{format_price(total_amount - prepayment_amount)}</div>
                    </div>
                </div>
                ''' if total_amount > prepayment_amount else ''}
                
                <!-- Контактная информация -->
                <div style="background: #eff6ff; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                    <h3 style="margin: 0 0 12px; font-size: 14px; color: #1e40af;">📞 Нужна помощь?</h3>
                    <p style="margin: 0; font-size: 14px; color: #3b82f6;">
                        Свяжитесь с нами: <a href="mailto:support@travel.kz" style="color: #1d4ed8;">support@travel.kz</a>
                    </p>
                </div>
                
                <!-- Кнопка -->
                <div style="text-align: center;">
                    <a href="https://travel.kz/profile/bookings" style="display: inline-block; background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                        Мои бронирования
                    </a>
                </div>
            </div>
            
            <!-- Футер -->
            <div style="text-align: center; padding: 24px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0 0 8px;">Это автоматическое письмо, пожалуйста, не отвечайте на него.</p>
                <p style="margin: 0;">© {datetime.now().year} Travel.kz. Все права защищены.</p>
                <p style="margin: 8px 0 0; color: #d1d5db;">{current_date}</p>
            </div>
            
        </div>
    </body>
    </html>
    """
    
    return html