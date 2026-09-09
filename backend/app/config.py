"""Application configuration.

Settings are loaded from environment variables and an optional ``.env`` file.
See ``.env.example`` for the full list of supported variables.
"""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration for the FastAPI backend."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "AISTATS API"
    environment: str = "development"
    debug: bool = True

    # Comma-separated list of origins allowed to make cross-origin requests.
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        """Return the configured CORS origins as a clean list."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
