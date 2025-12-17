from functools import lru_cache
from typing import ClassVar
from pydantic import AnyHttpUrl, BaseModel, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class DatabaseSettings(BaseModel):
    URL: str

    class Config:
        env_prefix = "DB_"


class SMTPSettings(BaseModel):
    HOST: str
    PORT: int
    USER: str
    PASSWORD: str
    ADMIN: str

    class Config:
        env_prefix = "SMTP_"


class JWTSettings(BaseModel):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 14

    allowed_algorithms: ClassVar = {
        "HS256",
        "HS384",
        "HS512",
        "RS256",
        "RS384",
        "RS512",
    }

    @field_validator("ALGORITHM", mode="after")
    @classmethod
    def validate_algorithm(cls, v: str) -> str:
        if v not in cls.allowed_algorithms:
            raise ValueError(
                f"INVALID JWT ALGORITHM: '{v}'. Allowed values: {cls.allowed_algorithms}"
            )
        return v

    class Config:
        env_prefix = "JWT_"


class Settings(BaseSettings):
    FRONTEND_URL: AnyHttpUrl
    BACKEND_URL: AnyHttpUrl

    SMTP: SMTPSettings
    DB: DatabaseSettings
    JWT: JWTSettings

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_nested_delimiter="__",
        extra="ignore",
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings(**{})
