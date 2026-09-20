"""
Pydantic schemas for all API request/response validation
"""
from typing import Optional, List, Any
from pydantic import BaseModel, Field, validator


# ---- Crop Recommendation ----

class CropRecommendationRequest(BaseModel):
    nitrogen: float = Field(..., ge=0, le=200, description="Nitrogen content in kg/ha")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus content in kg/ha")
    potassium: float = Field(..., ge=0, le=200, description="Potassium content in kg/ha")
    ph: float = Field(..., ge=0, le=14, description="Soil pH level")
    temperature: float = Field(..., ge=-10, le=60, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Humidity percentage")
    rainfall: float = Field(..., ge=0, le=3000, description="Annual rainfall in mm")
    season: str = Field("Kharif", description="Growing season (Kharif/Rabi/Zaid)")
    location: Optional[str] = Field(None, description="Farm location")

    class Config:
        json_schema_extra = {
            "example": {
                "nitrogen": 90,
                "phosphorus": 42,
                "potassium": 43,
                "ph": 6.5,
                "temperature": 28,
                "humidity": 82,
                "rainfall": 202,
                "season": "Kharif",
                "location": "Maharashtra"
            }
        }


class AlternativeCrop(BaseModel):
    crop: str
    score: float
    reason: str


class CropRecommendationResponse(BaseModel):
    recommended_crop: str
    suitability_score: float
    confidence: str
    expected_conditions: dict
    farming_tips: List[str]
    alternative_crops: List[AlternativeCrop]
    season_info: str
    is_demo: bool = True


# ---- Disease Detection ----

class DiseaseDetectionResponse(BaseModel):
    disease_name: str
    confidence: float
    severity: str
    description: str
    causes: List[str]
    prevention: List[str]
    next_steps: str
    image_url: Optional[str] = None
    is_demo: bool = True


# ---- Irrigation ----

class IrrigationRequest(BaseModel):
    soil_moisture: float = Field(..., ge=0, le=100, description="Soil moisture percentage")
    temperature: float = Field(..., ge=0, le=60, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Humidity percentage")
    rainfall: float = Field(..., ge=0, le=500, description="Recent rainfall in mm")
    crop_type: str = Field(..., description="Type of crop being grown")
    growth_stage: str = Field(..., description="Current growth stage of the crop")

    class Config:
        json_schema_extra = {
            "example": {
                "soil_moisture": 35,
                "temperature": 30,
                "humidity": 65,
                "rainfall": 5,
                "crop_type": "Wheat",
                "growth_stage": "Vegetative"
            }
        }


class IrrigationResponse(BaseModel):
    irrigation_required: bool
    recommended_amount_mm: float
    urgency: str
    reason: str
    next_check_hours: int
    water_saving_tip: str
    method_suggestion: str


# ---- Weather ----

class WeatherCurrent(BaseModel):
    temperature: float
    feels_like: float
    humidity: float
    pressure: float
    wind_speed: float
    wind_direction: str
    condition: str
    description: str
    icon: str
    rain_probability: float
    location: str
    updated_at: str


class WeatherForecastDay(BaseModel):
    date: str
    day_name: str
    max_temp: float
    min_temp: float
    humidity: float
    rain_probability: float
    condition: str
    icon: str
    wind_speed: float


class WeatherResponse(BaseModel):
    current: WeatherCurrent
    forecast: List[WeatherForecastDay]
    farming_advisory: str
    is_demo: bool = True


# ---- Chat ----

class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    session_id: Optional[str] = Field(None)

    class Config:
        json_schema_extra = {"example": {"message": "Which crop should I grow in Kharif season?", "session_id": "user-123"}}


class ChatResponse(BaseModel):
    reply: str
    session_id: str
    suggestions: List[str]
    is_demo: bool = True


# ---- Farm ----

class FarmProfileResponse(BaseModel):
    farmer_name: str
    farm_name: str
    location: str
    area_acres: float
    soil_type: str
    irrigation_type: str
    current_crop: str
    soil_health_score: int
    last_updated: str


# ---- Insights ----

class InsightItem(BaseModel):
    id: str
    type: str  # "info", "warning", "success", "tip"
    title: str
    message: str
    action: Optional[str] = None
    icon: str


class InsightsResponse(BaseModel):
    insights: List[InsightItem]
    farm_health_score: int
    generated_at: str
    is_demo: bool = True
