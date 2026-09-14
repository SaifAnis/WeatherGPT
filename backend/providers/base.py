"""
Abstract base class for weather providers.

Any real provider (IMD, OpenWeatherMap, MOSDAC) must subclass this and
implement `get_weather`. The rest of the system only depends on this
interface — swapping providers requires zero changes elsewhere.
"""

from abc import ABC, abstractmethod
from typing import Optional

from schemas.weather import WeatherData


class WeatherProvider(ABC):
    """
    Interface for all weather data providers.

    To add a real provider (e.g. IMD):
      1. Create providers/imd.py
      2. Subclass WeatherProvider
      3. Implement get_weather()
      4. Update services/weather_service.py to inject the new provider
    """

    @abstractmethod
    async def get_weather(
        self,
        city: str,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
    ) -> WeatherData:
        """
        Fetch current weather for the given location.

        Args:
            city: Human-readable city name.
            latitude: Optional decimal latitude (more precise than city name).
            longitude: Optional decimal longitude.

        Returns:
            WeatherData with all fields populated.

        Raises:
            RuntimeError: If the provider cannot fulfil the request.
        """
        ...
