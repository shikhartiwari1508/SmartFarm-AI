"""
SmartFarm AI - Application Configuration
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_ENV: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str = "smartfarm-dev-secret-key"

    DATABASE_URL: str = "sqlite+aiosqlite:///./smartfarm.db"

    OPENWEATHER_API_KEY: str = ""
    WEATHER_DEMO_MODE: bool = True

    ML_DEMO_MODE: bool = True
    CROP_MODEL_PATH: str = "./models/crop_recommendation_model.pkl"
    DISEASE_MODEL_PATH: str = "./models/disease_detection_model.h5"

    MAX_UPLOAD_SIZE_MB: int = 5
    UPLOAD_DIR: str = "./uploads"

    FRONTEND_URL: str = "http://localhost:5173"

    GEMINI_API_KEY: str = ""
    CHAT_DEMO_MODE: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
