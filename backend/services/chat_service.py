"""
ChatService — LLM integration with function/tool calling for weather grounding.

Flow:
  1. Receive user message + location context
  2. Send to OpenAI with a system prompt enforcing grounding rules
  3. OpenAI decides to call `get_current_weather` tool
  4. We call WeatherService, get real (mock) data
  5. Return tool result to OpenAI
  6. OpenAI produces the final natural-language response
  7. We return ChatResponse with grounded=True

If OPENAI_API_KEY is not set, a configuration error is returned immediately.
The /weather endpoint is NOT affected — it works without the key.

Model is read from settings.openai_model (set via OPENAI_MODEL env var).
Default: gpt-4o-mini. Override without touching any code.
"""

import json
import logging
from typing import Optional

from openai import AsyncOpenAI, APIConnectionError, AuthenticationError

from config.settings import settings
from schemas.chat import ChatResponse
from schemas.weather import LocationInput
from services.weather_service import WeatherService

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Tool definition — this is what we tell the LLM it can call
# ---------------------------------------------------------------------------
WEATHER_TOOL = {
    "type": "function",
    "function": {
        "name": "get_current_weather",
        "description": (
            "Retrieve the current weather for a specific location. "
            "Always call this tool when the user asks about weather conditions, "
            "temperature, rain, wind, or any meteorological topic. "
            "Do NOT answer weather questions from memory or training data."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "The city name, e.g. 'Bengaluru'",
                },
                "latitude": {
                    "type": "number",
                    "description": "Optional latitude in decimal degrees",
                },
                "longitude": {
                    "type": "number",
                    "description": "Optional longitude in decimal degrees",
                },
            },
            "required": ["city"],
        },
    },
}

SYSTEM_PROMPT = """You are WeatherGPT, an intelligent weather assistant specialising in Indian weather.

RULES you must follow strictly:
1. You MUST call the `get_current_weather` tool for any weather-related question.
2. NEVER invent, estimate, or recall weather data from your training knowledge.
3. Base all weather facts ONLY on what the tool returns.
4. If the tool returns data marked as source='mock', you may note that this is demonstration data.
5. Be concise, helpful, and friendly.
6. If the user asks a non-weather question, politely redirect them to weather topics.
"""


class ChatService:
    def __init__(self, weather_service: WeatherService) -> None:
        self._weather_service = weather_service
        # Client is created lazily so missing API key doesn't crash the server
        self._client: Optional[AsyncOpenAI] = None

    def _get_client(self) -> AsyncOpenAI:
        if self._client is None:
            self._client = AsyncOpenAI(api_key=settings.openai_api_key)
        return self._client

    async def chat(self, message: str, location: LocationInput) -> ChatResponse:
        """
        Run one turn of the weather-grounded chat.
        Returns ChatResponse with grounded=True when the tool was called.
        """
        if not settings.has_openai_key:
            return ChatResponse(
                reply=(
                    "The WeatherGPT AI assistant is not yet configured. "
                    "Please set OPENAI_API_KEY in the backend .env file."
                ),
                grounded=False,
                error="OPENAI_API_KEY is not set",
            )

        client = self._get_client()
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Location context: {location.city} "
                    f"(lat={location.latitude}, lon={location.longitude})\n\n"
                    f"User question: {message}"
                ),
            },
        ]

        grounded = False
        try:
            response = await client.chat.completions.create(
                model=settings.openai_model,  # configurable via OPENAI_MODEL env var
                messages=messages,
                tools=[WEATHER_TOOL],
                tool_choice="auto",
            )

            # -----------------------------------------------------------------
            # Tool-calling loop — handle one tool call round-trip
            # -----------------------------------------------------------------
            assistant_message = response.choices[0].message

            if assistant_message.tool_calls:
                tool_call = assistant_message.tool_calls[0]
                grounded = True

                # Parse arguments the LLM wants to pass to the tool
                args = json.loads(tool_call.function.arguments)
                tool_city = args.get("city", location.city)
                tool_lat = args.get("latitude", location.latitude)
                tool_lon = args.get("longitude", location.longitude)

                # Call the actual weather service (no LLM involvement here)
                weather_data = await self._weather_service.get_weather(
                    tool_city, tool_lat, tool_lon
                )
                tool_result = weather_data.model_dump()
                tool_result_json = json.dumps(tool_result)

                logger.info(
                    "Tool called: get_current_weather(city=%s) → source=%s",
                    tool_city,
                    weather_data.source,
                )

                # Feed tool result back to the LLM for final answer
                messages.append(assistant_message)  # LLM's tool-call message
                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": tool_result_json,
                    }
                )

                final_response = await client.chat.completions.create(
                    model=settings.openai_model,
                    messages=messages,
                )
                reply = final_response.choices[0].message.content or ""

            else:
                # LLM responded without calling the tool — acceptable for
                # non-weather questions
                reply = assistant_message.content or ""

        except AuthenticationError:
            logger.error("OpenAI authentication failed — check OPENAI_API_KEY")
            return ChatResponse(
                reply="Authentication error: the provided API key is invalid.",
                grounded=False,
                error="OpenAI authentication failed",
            )
        except APIConnectionError as exc:
            logger.error("OpenAI connection error: %s", exc)
            return ChatResponse(
                reply="Could not reach the AI service. Please try again later.",
                grounded=False,
                error=str(exc),
            )
        except Exception as exc:
            logger.error("Unexpected chat error: %s", exc)
            return ChatResponse(
                reply="An unexpected error occurred. Please try again.",
                grounded=False,
                error=str(exc),
            )

        return ChatResponse(reply=reply, grounded=grounded)
