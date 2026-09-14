"""
WeatherGPT FastAPI application entry point.

Preserves the existing /health and / endpoints.
Adds /weather and /chat routers.
CORS is configured to allow the Next.js frontend at localhost:3000.
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.weather import router as weather_router
from api.chat import router as chat_router

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="WeatherGPT API",
    description=(
        "Backend for WeatherGPT — AI-powered weather assistant for Smart India Hackathon 2026. "
        "Provides weather data and LLM-grounded conversational responses."
    ),
    version="0.3.0",
)

# ---------------------------------------------------------------------------
# CORS — allow the Next.js dev server and production origin
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(weather_router)
app.include_router(chat_router)


# ---------------------------------------------------------------------------
# Root endpoints (preserved from original)
# ---------------------------------------------------------------------------
@app.get("/", tags=["root"])
def root():
    return {"message": "WeatherGPT backend is running", "version": "0.3.0"}


@app.get("/health", tags=["root"])
def health():
    return {"status": "ok"}