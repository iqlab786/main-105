# app/config/settings.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongo_uri: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"

    class Config:
        env_file = ".env"

settings = Settings()