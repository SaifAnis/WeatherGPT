"""
MockWeatherProvider — returns realistic static data per city.

This is the default provider used until a real meteorological API
(IMD, OpenWeatherMap, MOSDAC) is configured.

TO REPLACE WITH A REAL PROVIDER:
  1. Create providers/imd.py (or providers/openweather.py)
  2. Subclass WeatherProvider and implement get_weather()
  3. In services/weather_service.py, change the import to use the real class
  4. Set WEATHER_API_KEY in your .env
  No other files need to change.
"""

from typing import Optional

from providers.base import WeatherProvider
from schemas.weather import WeatherData

# Realistic demo data for Indian cities.
# Each entry uses seasonal averages appropriate for September (monsoon/post-monsoon).
_CITY_DATA: dict[str, dict] = {
    "new delhi": {
        "city": "New Delhi",
        "temperature_c": 33.0,
        "feels_like_c": 37.0,
        "humidity_pct": 72,
        "wind_speed_kmh": 14.0,
        "wind_direction": "SW",
        "visibility_km": 6.0,
        "condition": "Partly Cloudy",
        "condition_code": "partly_cloudy",
    },
    "delhi": {
        "city": "New Delhi",
        "temperature_c": 33.0,
        "feels_like_c": 37.0,
        "humidity_pct": 72,
        "wind_speed_kmh": 14.0,
        "wind_direction": "SW",
        "visibility_km": 6.0,
        "condition": "Partly Cloudy",
        "condition_code": "partly_cloudy",
    },
    "mumbai": {
        "city": "Mumbai",
        "temperature_c": 29.0,
        "feels_like_c": 34.0,
        "humidity_pct": 88,
        "wind_speed_kmh": 22.0,
        "wind_direction": "W",
        "visibility_km": 4.0,
        "condition": "Heavy Rain",
        "condition_code": "heavy_rain",
    },
    "bengaluru": {
        "city": "Bengaluru",
        "temperature_c": 24.0,
        "feels_like_c": 26.0,
        "humidity_pct": 68,
        "wind_speed_kmh": 10.0,
        "wind_direction": "SE",
        "visibility_km": 8.0,
        "condition": "Light Rain",
        "condition_code": "light_rain",
    },
    "bangalore": {
        "city": "Bengaluru",
        "temperature_c": 24.0,
        "feels_like_c": 26.0,
        "humidity_pct": 68,
        "wind_speed_kmh": 10.0,
        "wind_direction": "SE",
        "visibility_km": 8.0,
        "condition": "Light Rain",
        "condition_code": "light_rain",
    },
    "chennai": {
        "city": "Chennai",
        "temperature_c": 31.0,
        "feels_like_c": 36.0,
        "humidity_pct": 80,
        "wind_speed_kmh": 18.0,
        "wind_direction": "NE",
        "visibility_km": 5.0,
        "condition": "Humid and Overcast",
        "condition_code": "overcast",
    },
    "kolkata": {
        "city": "Kolkata",
        "temperature_c": 30.0,
        "feels_like_c": 35.0,
        "humidity_pct": 85,
        "wind_speed_kmh": 12.0,
        "wind_direction": "S",
        "visibility_km": 5.0,
        "condition": "Thunderstorms",
        "condition_code": "thunderstorm",
    },
}

# Generic fallback for any city not in the table above
_FALLBACK: dict = {
    "temperature_c": 28.0,
    "feels_like_c": 31.0,
    "humidity_pct": 70,
    "wind_speed_kmh": 12.0,
    "wind_direction": "N",
    "visibility_km": 7.0,
    "condition": "Partly Cloudy",
    "condition_code": "partly_cloudy",
}


class MockWeatherProvider(WeatherProvider):
    """
    Returns static per-city mock data without calling any external API.
    Marked with source='mock' so consumers can tell it apart from real data.
    """

    async def get_weather(
        self,
        city: str,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
    ) -> WeatherData:
        key = city.strip().lower()
        data = _CITY_DATA.get(key, {**_FALLBACK, "city": city})

        return WeatherData(
            city=data.get("city", city),
            country="IN",
            temperature_c=data["temperature_c"],
            feels_like_c=data["feels_like_c"],
            humidity_pct=data["humidity_pct"],
            wind_speed_kmh=data["wind_speed_kmh"],
            wind_direction=data["wind_direction"],
            visibility_km=data["visibility_km"],
            condition=data["condition"],
            condition_code=data["condition_code"],
            source="mock",
        )
