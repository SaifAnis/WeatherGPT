"""
GET /weather — returns current weather for a given location.

Works without OPENAI_API_KEY. Uses MockWeatherProvider by default.
"""

from typing import Optional

from fastapi import APIRouter, Query

from providers.mock import MockWeatherProvider
from schemas.weather import WeatherResponse
from services.weather_service import WeatherService

router = APIRouter(prefix="/weather", tags=["weather"])

# Dependency: inject mock provider (replace with real provider here later)
_provider = MockWeatherProvider()
_service = WeatherService(_provider)


@router.get("", response_model=WeatherResponse, summary="Get current weather for a location")
async def get_weather(
    city: str = Query(..., description="City name, e.g. Bengaluru"),
    lat: Optional[float] = Query(None, description="Latitude in decimal degrees"),
    lon: Optional[float] = Query(None, description="Longitude in decimal degrees"),
) -> WeatherResponse:
    """
    Returns current weather data for the specified city.

    - Works without an LLM key.
    - Uses MockWeatherProvider until a real weather API is configured.
    - `source` field in response indicates the data origin ('mock', 'imd', etc.).
    """
    data = await _service.get_weather(city, lat, lon)
    return WeatherResponse(success=True, data=data)
