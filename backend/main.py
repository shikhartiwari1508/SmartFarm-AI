"""
SmartFarm AI - FastAPI Backend
Main application entry point
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.database import create_tables
from backend.routers import crops, disease, irrigation, weather, chat, farm, insights
from backend.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - startup and shutdown events."""
    # Startup
    await create_tables()
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    print("✅ SmartFarm AI backend started successfully")
    print(f"📊 Demo Mode: {'ON' if settings.ML_DEMO_MODE else 'OFF'}")
    yield
    # Shutdown
    print("🔴 SmartFarm AI backend shutting down")


app = FastAPI(
    title="SmartFarm AI",
    description="AI-Powered Agriculture Platform for Smarter Farming",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Register routers
app.include_router(crops.router, prefix="/api/crops", tags=["Crop Recommendation"])
app.include_router(disease.router, prefix="/api/disease", tags=["Disease Detection"])
app.include_router(irrigation.router, prefix="/api/irrigation", tags=["Smart Irrigation"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather Intelligence"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI Assistant"])
app.include_router(farm.router, prefix="/api/farm", tags=["Farm Management"])
app.include_router(insights.router, prefix="/api/insights", tags=["AI Insights"])


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
