"""
Application settings loaded from environment variables.

Copy .env.example to .env and fill in your values.
The application does NOT fail at startup if OPENAI_API_KEY is missing —
it will fail gracefully only at request time on the /chat endpoint.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # LLM configuration — all optional so the server boots without them
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"  # Override via OPENAI_MODEL env var

    # Weather API key — reserved for real providers (IMD, OpenWeatherMap, etc.)
    weather_api_key: str = ""

    # Future use
    imd_api_key: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def has_openai_key(self) -> bool:
        return bool(self.openai_api_key)

    @property
    def has_weather_api_key(self) -> bool:
        return bool(self.weather_api_key)


# Module-level singleton — imported everywhere else
settings = Settings()
