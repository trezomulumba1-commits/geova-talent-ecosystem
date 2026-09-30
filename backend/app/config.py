from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "GEOVA Backend"
    environment: str = "development"
    port: int = 8000
    database_url: str = "sqlite+aiosqlite:///./geova.db"
    jwt_secret: str = "geova-super-secret-jwt-key-2026-please-change-in-production"
    jwt_expires_days: int = 7
    gemini_api_key: str = ""
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()