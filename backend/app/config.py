import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "NoteXchangE"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "super-secret-notexchange-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./notexchange.db")
    
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:8000")
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")

    class Config:
        case_sensitive = True

settings = Settings()
