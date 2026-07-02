import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class AppSettings(BaseSettings):

    OPENROUTER_API_KEY: str

    CHROMADB_URL: str

    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = AppSettings()