"""
Pydantic schemas for weather data.

WeatherData is the canonical internal representation returned by any
WeatherProvider. Keeping it stable means the LLM tool schema and API
response never need to change when we swap providers.
"""

from typing import Optional

from pydantic import BaseModel, Field


class LocationInput(BaseModel):
    """Location data sent by the client."""

    city: str = Field(..., description="City name, e.g. 'Bengaluru'")
    latitude: Optional[float] = Field(None, description="Latitude in decimal degrees")
    longitude: Optional[float] = Field(None, description="Longitude in decimal degrees")


class WeatherData(BaseModel):
    """
    Canonical weather snapshot for a single location.
    All fields are required — the mock provider must fill every field.
    Real providers must map their API response to this schema.
    """

    city: str
    country: str = "IN"
    temperature_c: float = Field(..., description="Temperature in °C")
    feels_like_c: float = Field(..., description="Feels-like temperature in °C")
    humidity_pct: int = Field(..., description="Relative humidity 0-100")
    wind_speed_kmh: float = Field(..., description="Wind speed in km/h")
    wind_direction: str = Field(..., description="Compass direction, e.g. 'SW'")
    visibility_km: float = Field(..., description="Visibility in km")
    condition: str = Field(..., description="Short weather description, e.g. 'Light Rain'")
    condition_code: str = Field(
        ...,
        description="Machine-readable code, e.g. 'light_rain'. "
        "Used by the frontend for icon selection.",
    )
    source: str = Field(default="mock", description="Data source: 'mock', 'imd', etc.")


class WeatherResponse(BaseModel):
    """Shape of the GET /weather API response."""

    success: bool = True
    data: WeatherData
