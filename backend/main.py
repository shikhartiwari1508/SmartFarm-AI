"""
SmartFarm AI - FastAPI Backend
Main application entry point
"""

import os
import socket
import asyncio
from contextlib import asynccontextmanager
from urllib.parse import urlparse

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.database import create_tables
from backend.routers import crops, disease, irrigation, weather, chat, farm, insights, market_prices
from backend.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    print("SmartFarm AI backend started successfully")
    print(f"Demo Mode: {'ON' if settings.ML_DEMO_MODE else 'OFF'}")
    yield
    print("SmartFarm AI backend shutting down")


app = FastAPI(
    title="SmartFarm AI",
    description="AI-Powered Agriculture Platform for Smarter Farming",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(crops.router, prefix="/api/crops", tags=["Crop Recommendation"])
app.include_router(disease.router, prefix="/api/disease", tags=["Disease Detection"])
app.include_router(irrigation.router, prefix="/api/irrigation", tags=["Smart Irrigation"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather Intelligence"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI Assistant"])
app.include_router(farm.router, prefix="/api/farm", tags=["Farm Management"])
app.include_router(insights.router, prefix="/api/insights", tags=["AI Insights"])
app.include_router(market_prices.router, prefix="/api/market-prices", tags=["Mandi Market Prices"])


@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "SmartFarm AI API is running",
        "version": "1.0.0",
        "demo_mode": settings.ML_DEMO_MODE,
        "docs": "/docs",
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "SmartFarm AI Backend",
        "demo_mode": settings.ML_DEMO_MODE,
        "environment": settings.APP_ENV,
    }


@app.get("/api/diagnostics/network", tags=["Diagnostics"])
async def network_diagnostics():
    targets = {
        "google": "https://www.google.com",
        "data_gov": "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
    }

    results = {}

    async with httpx.AsyncClient(
        timeout=httpx.Timeout(12.0, connect=5.0),
        follow_redirects=True,
    ) as client:
        for name, url in targets.items():
            hostname = urlparse(url).hostname
            result = {
                "host": hostname,
                "dns": "not_tested",
                "https": "not_tested",
            }

            try:
                await asyncio.to_thread(socket.getaddrinfo, hostname, 443)
                result["dns"] = "ok"
            except Exception as exc:
                result["dns"] = "failed"
                result["dns_error"] = type(exc).__name__

            try:
                response = await client.get(url)
                result["https"] = "connected"
                result["http_status"] = response.status_code
            except httpx.ConnectError as exc:
                result["https"] = "connection_failed"
                result["error"] = type(exc).__name__
            except httpx.TimeoutException:
                result["https"] = "timeout"
                result["error"] = "Timeout"
            except Exception as exc:
                result["https"] = "failed"
                result["error"] = type(exc).__name__

            results[name] = result

    return {
        "diagnostic": "network_connectivity",
        "results": results,
    }
