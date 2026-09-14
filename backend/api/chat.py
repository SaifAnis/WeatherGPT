"""
POST /chat — conversational weather AI with function calling.

Requires OPENAI_API_KEY in the backend .env.
Returns a graceful error message if the key is missing (does not crash).
"""

from fastapi import APIRouter

from providers.mock import MockWeatherProvider
from schemas.chat import ChatRequest, ChatResponse
from services.chat_service import ChatService
from services.weather_service import WeatherService

router = APIRouter(prefix="/chat", tags=["chat"])

# Shared services
_provider = MockWeatherProvider()
_weather_service = WeatherService(_provider)
_chat_service = ChatService(_weather_service)


@router.post("", response_model=ChatResponse, summary="Ask WeatherGPT a question")
async def post_chat(request: ChatRequest) -> ChatResponse:
    """
    Send a natural-language weather question.

    The LLM will call the `get_current_weather` tool to retrieve real data
    before composing its answer. Weather values are never invented.

    Requires `OPENAI_API_KEY` to be set. Returns an error message if not.
    """
    return await _chat_service.chat(request.message, request.location)
