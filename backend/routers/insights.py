"""
AI Insights Router - /api/insights
"""
from datetime import datetime
from fastapi import APIRouter, Query
from backend.schemas.schemas import InsightsResponse, InsightItem

router = APIRouter()


def _generate_insights(soil_moisture: float = 42, temperature: float = 28,
                        humidity: float = 68, rainfall: float = 10,
                        crop: str = "Cotton") -> list:
    """Generate rule-based AI insights from current farm conditions."""
    insights = []

    # Soil moisture insights
    if soil_moisture < 35:
        insights.append(InsightItem(
            id="soil_moisture_low",
            type="warning",
            title="Low Soil Moisture Detected",
            message=f"Soil moisture is at {soil_moisture}% — below the critical 40% threshold for {crop}. Consider irrigation in the next 12-24 hours.",
            action="Check Irrigation",
            icon="💧"
        ))
    elif soil_moisture > 75:
        insights.append(InsightItem(
            id="soil_moisture_high",
            type="info",
            title="High Soil Moisture",
            message=f"Soil moisture is at {soil_moisture}%. Excellent water retention. No irrigation needed — monitor drainage if rain is expected.",
            action=None,
            icon="🌊"
        ))
    else:
        insights.append(InsightItem(
            id="soil_moisture_ok",
            type="success",
            title="Soil Moisture Optimal",
            message=f"Soil moisture ({soil_moisture}%) is in the optimal range for {crop}. Continue current irrigation schedule.",
            action=None,
            icon="✅"
        ))

    # Temperature insights
    if temperature > 38:
        insights.append(InsightItem(
            id="high_temp",
            type="warning",
            title="High Temperature Alert",
            message=f"Temperature is {temperature}°C. This can stress crops and increase pest activity. Irrigate early morning and monitor for heat stress symptoms.",
            action="View Irrigation",
            icon="🌡️"
        ))
    elif temperature < 15:
        insights.append(InsightItem(
            id="low_temp",
            type="info",
            title="Cool Weather Conditions",
            message=f"Temperature at {temperature}°C. Good conditions for Rabi crops (Wheat, Mustard, Chickpea). Frost risk if temperature drops below 0°C.",
            action=None,
            icon="❄️"
        ))

    # Rainfall insights
    if rainfall > 50:
        insights.append(InsightItem(
            id="high_rainfall",
            type="warning",
            title="High Rainfall — Drainage Check",
            message=f"Heavy rainfall detected ({rainfall}mm). Check drainage channels, avoid field operations to prevent soil compaction. Disease risk is elevated.",
            action="View Disease Detection",
            icon="⛈️"
        ))
    elif rainfall < 5 and soil_moisture < 45:
        insights.append(InsightItem(
            id="dry_conditions",
            type="warning",
            title="Dry Conditions — Irrigation Advised",
            message=f"Low rainfall ({rainfall}mm) combined with low soil moisture. Your {crop} crop may need supplemental irrigation soon.",
            action="Check Irrigation",
            icon="🏜️"
        ))
    else:
        insights.append(InsightItem(
            id="rainfall_normal",
            type="info",
            title="Rainfall Contributing to Soil Moisture",
            message=f"Recent rainfall ({rainfall}mm) is contributing to soil moisture. This may reduce or eliminate irrigation requirement for the next 24-48 hours.",
            action=None,
            icon="🌧️"
        ))

    # Humidity/Disease risk
    if humidity > 85:
        insights.append(InsightItem(
            id="disease_risk",
            type="warning",
            title="High Disease Risk",
            message=f"Humidity at {humidity}% creates ideal conditions for fungal diseases (blast, blight, rust). Consider preventive fungicide spray and monitor plant health.",
            action="Upload Leaf Photo",
            icon="🔬"
        ))

    # AI Crop suggestion
    insights.append(InsightItem(
        id="ai_suggestion",
        type="tip",
        title="AI Farming Tip",
        message=f"Based on your current conditions (soil moisture: {soil_moisture}%, temp: {temperature}°C), your {crop} crop is in moderate health. Run a complete soil analysis for personalized recommendations.",
        action="Get Crop Recommendation",
        icon="🤖"
    ))

    return insights


@router.get("/", response_model=InsightsResponse)
async def get_insights(
    soil_moisture: float = Query(default=42, ge=0, le=100),
    temperature: float = Query(default=28, ge=-10, le=60),
    humidity: float = Query(default=68, ge=0, le=100),
    rainfall: float = Query(default=10, ge=0, le=500),
    crop: str = Query(default="Cotton")
):
    """
    Get AI-generated insights based on current farm conditions.
    Uses rule-based logic in demo mode; ready for ML model integration.
    """
    insights = _generate_insights(soil_moisture, temperature, humidity, rainfall, crop)

    # Calculate farm health score
    health_factors = []
    if 30 <= soil_moisture <= 70:
        health_factors.append(25)
    else:
        health_factors.append(10)
    
    if 15 <= temperature <= 35:
        health_factors.append(25)
    else:
        health_factors.append(10)
    
    if 40 <= humidity <= 80:
        health_factors.append(25)
    else:
        health_factors.append(15)
    
    if 5 <= rainfall <= 100:
        health_factors.append(25)
    else:
        health_factors.append(15)
    
    farm_health_score = sum(health_factors)

    return InsightsResponse(
        insights=insights,
        farm_health_score=farm_health_score,
        generated_at=datetime.now().strftime("%Y-%m-%d %H:%M"),
        is_demo=True,
    )
