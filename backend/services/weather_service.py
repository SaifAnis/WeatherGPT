"""
WeatherService — application-level wrapper around a WeatherProvider.

Responsibilities:
  - Delegates to the injected provider
  - Validates the returned WeatherData (sanity checks)
  - Translates provider errors into HTTP-friendly exceptions

This is the single entry point for weather data in the rest of the app.
Neither the API routes nor the ChatService talk to a provider directly.
"""

import logging
from typing import Optional

from fastapi import HTTPException

from providers.base import WeatherProvider
from schemas.weather import WeatherData

logger = logging.getLogger(__name__)


class WeatherService:
    def __init__(self, provider: WeatherProvider) -> None:
        self._provider = provider

    async def get_weather(
        self,
        city: str,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
    ) -> WeatherData:
        """
        Fetch and validate weather for the given location.

        Raises:
            HTTPException 400 — if city is empty.
            HTTPException 502 — if the provider fails or returns invalid data.
        """
        city = city.strip()
        if not city:
            raise HTTPException(status_code=400, detail="City name must not be empty.")

        try:
            data = await self._provider.get_weather(city, latitude, longitude)
        except Exception as exc:
            logger.error("Weather provider error for city=%s: %s", city, exc)
            raise HTTPException(
                status_code=502,
                detail=f"Weather provider failed: {exc}",
            ) from exc

        # Basic sanity validation — guard against provider bugs
        self._validate(data, city)
        return data

    def _validate(self, data: WeatherData, city: str) -> None:
        """Raise 502 if the provider returned clearly invalid values."""
        errors = []

        if not (-90 <= data.temperature_c <= 60):
            errors.append(f"temperature_c={data.temperature_c} out of plausible range")
        if not (0 <= data.humidity_pct <= 100):
            errors.append(f"humidity_pct={data.humidity_pct} out of range 0-100")
        if data.wind_speed_kmh < 0:
            errors.append(f"wind_speed_kmh={data.wind_speed_kmh} is negative")
        if data.visibility_km < 0:
            errors.append(f"visibility_km={data.visibility_km} is negative")

        if errors:
            logger.error("WeatherData validation failed for %s: %s", city, errors)
            raise HTTPException(
                status_code=502,
                detail=f"Weather provider returned invalid data: {errors}",
            )
