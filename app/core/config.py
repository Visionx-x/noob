from pydantic_settings import BaseSettings
from typing import Optional
import secrets


class Settings(BaseSettings):
    environment: str = "development"
    host: str = "0.0.0.0"
    port: int = 8000

    database_url: str = "sqlite:///./growthforge.db"

    # Must be set in production (e.g. 32+ char random string)
    secret_key: str = "change-me-in-production-use-openssl-rand-hex-32"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours for mobile
    refresh_token_expire_days: int = 30

    # CORS: comma-separated list. Mobile app uses capacitor://localhost; add your VPS domain for web later.
    allowed_origins: str = (
        "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,"
        "capacitor://localhost,https://localhost,http://localhost,"
        "http://77.90.6.237:3000,http://77.90.6.237:2000,"
        "capacitor://localhost,http://localhost,*"
    )
    log_level: str = "INFO"

    # Production: comma-separated hosts for TrustedHostMiddleware (e.g. api.yourdomain.com). Leave empty to allow any host.
    allowed_hosts: str = ""

    # Rate limiting
    rate_limit_requests: int = 100
    rate_limit_window: int = 3600  # 1 hour

    # Mobile / web API URLs (for reference; app uses NEXT_PUBLIC_API_URL)
    mobile_api_url: str = "https://yourdomain.com/api"
    web_api_url: str = "https://yourdomain.com/api"
    mobile_app_name: str = "GrowthForge"
    mobile_app_id: str = "com.growthforge.app"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
