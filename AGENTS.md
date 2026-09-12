# WeatherGPT – AI & Team Development Rules

## Project
WeatherGPT is our Smart India Hackathon 2026 project:
a conversational AI platform for weather forecasting, alerts,
location intelligence and climate information.

## Core Rules

- Do not make unnecessary changes outside the task.
- Do not delete or overwrite another developer's work.
- Before making major changes, inspect the existing code first.
- Keep the application modular and maintainable.
- Prefer simple, production-ready solutions over unnecessary complexity.
- Never commit API keys, passwords, tokens or secrets.
- Use environment variables for secrets.
- Do not hardcode weather/API credentials.

## Frontend

- Framework: Next.js
- Language: TypeScript
- Styling: Tailwind CSS
- Build reusable components.
- Keep components small and organized.
- Prioritize responsive design and accessibility.
- Avoid generic AI-generated dashboard designs.
- UI should feel polished, modern and distinctive.
- Do not introduce a new UI library without team approval.

## Backend

- Backend will use Python + FastAPI.
- Keep API logic separate from UI.
- Validate external weather data before presenting it to users.

## AI

- AI responses must be grounded in retrieved weather data.
- Never invent weather forecasts, warnings or measurements.
- Use function/tool calling for weather data retrieval.
- Clearly distinguish unavailable data from actual data.
- Do not expose API keys to the frontend.

## Weather Data

Preferred trusted sources include:
- India Meteorological Department (IMD)
- MOSDAC / ISRO
- data.gov.in
- Other approved meteorological APIs

## Git

- `main` is the stable branch.
- `dev` is the integration branch.
- Developers should work on feature branches.
- Do not directly push experimental work to `main`.
- Make focused commits with clear messages.
- Pull the latest changes before starting significant work.

## AI Coding Agents

This file is the shared source of truth for AI coding agents.

Before modifying code:
1. Read this file.
2. Inspect the existing project structure.
3. Understand related components.
4. Make the smallest appropriate change.
5. Check for errors after making changes.

Never assume a file is safe to replace just because an AI agent created it.

## Team

There are 6 developers working on this project.
Code must remain understandable to teammates who did not write it.

## Current MVP Priority

Build in this order:

1. Conversational weather interface
2. Location-aware weather
3. Current weather and forecast
4. Weather alerts/warnings
5. AI grounding/function calling
6. Indian-language support
7. Voice interaction
8. SMS/IVR and advanced features

Do not build advanced infrastructure before the core MVP works.