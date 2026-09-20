"""
Farm Profile Router - /api/farm
"""
from datetime import datetime
from fastapi import APIRouter
from backend.schemas.schemas import FarmProfileResponse

router = APIRouter()

# Demo farm profile — in production, this comes from the database
DEMO_FARM_PROFILE = {
    "farmer_name": "Demo Farmer",
    "farm_name": "Green Valley Farm",
    "location": "Nashik, Maharashtra",
    "area_acres": 5.5,
    "soil_type": "Black Cotton Soil",
    "irrigation_type": "Drip + Furrow",
    "current_crop": "Cotton",
    "soil_health_score": 72,
    "last_updated": datetime.now().strftime("%Y-%m-%d"),
}


@router.get("/profile", response_model=FarmProfileResponse)
async def get_farm_profile():
    """Get the current farmer's profile and farm overview."""
    return FarmProfileResponse(**DEMO_FARM_PROFILE)


@router.get("/summary")
async def get_farm_summary():
    """Get a comprehensive farm summary with all current metrics."""
    return {
        "profile": DEMO_FARM_PROFILE,
        "soil_metrics": {
            "nitrogen": 85,
            "phosphorus": 55,
            "potassium": 62,
            "ph": 6.8,
            "organic_matter": 2.1,
            "moisture": 42,
        },
        "current_conditions": {
            "temperature": 28.5,
            "humidity": 68,
            "rainfall_last_7_days": 35,
            "irrigation_status": "Not Required",
        },
        "alerts": [
            {"type": "info", "message": "Soil moisture is adequate for current crop stage"},
            {"type": "warning", "message": "Monitor for bollworm — high temperature conditions"},
        ],
        "recent_activities": [
            {"date": "2026-09-15", "activity": "Crop Recommendation Run", "result": "Cotton Recommended"},
            {"date": "2026-09-14", "activity": "Irrigation Check", "result": "Not Required"},
            {"date": "2026-09-12", "activity": "Disease Scan", "result": "No Disease Detected"},
        ],
        "is_demo": True,
    }
