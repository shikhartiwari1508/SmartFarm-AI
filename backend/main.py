"""
SmartFarm AI - FastAPI Backend
Main application entry point
"""

import os
import socket
import ssl
import asyncio
from contextlib import asynccontextmanager

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


def probe_host(hostname: str):
    result = {
        "host": hostname,
        "dns": "not_tested",
        "addresses": [],
        "tests": [],
    }

    try:
        address_info = socket.getaddrinfo(
            hostname,
            443,
            type=socket.SOCK_STREAM,
        )
        addresses = list(dict.fromkeys(item[4][0] for item in address_info))
        result["dns"] = "ok"
        result["addresses"] = addresses
    except Exception as exc:
        result["dns"] = "failed"
        result["dns_error"] = f"{type(exc).__name__}: {str(exc)[:300]}"
        return result

    for ip in addresses[:6]:
        test = {
            "ip": ip,
            "tcp": "not_tested",
            "tls": "not_tested",
        }

        try:
            with socket.create_connection((ip, 443), timeout=6) as connection:
                test["tcp"] = "connected"

                try:
                    context = ssl.create_default_context()
                    with context.wrap_socket(
                        connection,
                        server_hostname=hostname,
                    ) as secure_connection:
                        test["tls"] = "connected"
                        test["tls_version"] = secure_connection.version()
                except Exception as exc:
                    test["tls"] = "failed"
                    test["tls_error"] = (
                        f"{type(exc).__name__}: {str(exc)[:300]}"
                    )

        except Exception as exc:
            test["tcp"] = "failed"
            test["tcp_error"] = (
                f"{type(exc).__name__}: {str(exc)[:300]}"
            )

        result["tests"].append(test)

    return result


@app.get("/api/diagnostics/network", tags=["Diagnostics"])
async def network_diagnostics():
    targets = [
        "www.google.com",
        "api.data.gov.in",
    ]

    results = await asyncio.gather(
        *[
            asyncio.to_thread(probe_host, hostname)
            for hostname in targets
        ]
    )

    return {
        "diagnostic": "tcp_ssl_connectivity",
        "results": {
            result["host"]: result
            for result in results
        },
    }
