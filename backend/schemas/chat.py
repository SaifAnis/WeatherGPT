"""
Pydantic schemas for the /chat endpoint.
"""

from typing import Optional

from pydantic import BaseModel, Field
from schemas.weather import LocationInput


class ChatRequest(BaseModel):
    """Request body for POST /chat."""

    message: str = Field(..., min_length=1, description="User's natural-language question")
    location: LocationInput = Field(..., description="User's current location context")


class ChatResponse(BaseModel):
    """Response from POST /chat."""

    reply: str = Field(..., description="LLM-generated natural-language response")
    grounded: bool = Field(
        ...,
        description="True if the response is grounded in retrieved weather data, "
        "False if the LLM answered without tool data (should not happen in normal flow).",
    )
    error: Optional[str] = Field(
        default=None,
        description="Set when the backend cannot fulfil the request (e.g. missing API key).",
    )
