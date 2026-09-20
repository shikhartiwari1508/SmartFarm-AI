"""
Weather Intelligence Router - /api/weather
"""
import random
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Query
from backend.schemas.schemas import WeatherResponse, WeatherCurrent, WeatherForecastDay
from backend.config import settings

router = APIRouter()

# Indian cities sample weather data for demo
DEMO_WEATHER_BY_LOCATION = {
    "default": {"base_temp": 28, "base_humidity": 65, "season": "normal"},
    "Maharashtra": {"base_temp": 30, "base_humidity": 70, "season": "monsoon"},
    "Punjab": {"base_temp": 25, "base_humidity": 55, "season": "normal"},
    "Rajasthan": {"base_temp": 35, "base_humidity": 30, "season": "dry"},
    "Kerala": {"base_temp": 27, "base_humidity": 85, "season": "monsoon"},
    "UP": {"base_temp": 28, "base_humidity": 60, "season": "normal"},
    "Bihar": {"base_temp": 29, "base_humidity": 70, "season": "normal"},
    "Karnataka": {"base_temp": 26, "base_humidity": 65, "season": "normal"},
    "Tamil Nadu": {"base_temp": 32, "base_humidity": 75, "season": "normal"},
    "Gujarat": {"base_temp": 33, "base_humidity": 45, "season": "dry"},
}

WEATHER_CONDITIONS = [
    {"condition": "Sunny", "icon": "sun", "rain_prob": 5},
    {"condition": "Partly Cloudy", "icon": "cloud-sun", "rain_prob": 20},
    {"condition": "Cloudy", "icon": "cloud", "rain_prob": 40},
    {"condition": "Light Rain", "icon": "cloud-rain", "rain_prob": 75},
    {"condition": "Heavy Rain", "icon": "cloud-heavy-rain", "rain_prob": 90},
    {"condition": "Thunderstorm", "icon": "cloud-lightning", "rain_prob": 95},
]

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def _generate_demo_weather(location: str = "Maharashtra") -> dict:
    """Generate realistic demo weather data for Indian agriculture context."""
    loc_data = DEMO_WEATHER_BY_LOCATION.get(location, DEMO_WEATHER_BY_LOCATION["default"])
    base_temp = loc_data["base_temp"]
    base_humidity = loc_data["base_humidity"]

    # Current weather
    current_condition = random.choice(WEATHER_CONDITIONS[:4])
    current_temp = round(base_temp + random.uniform(-3, 3), 1)
    current_humidity = min(100, round(base_humidity + random.uniform(-10, 10)))

    farming_advisories = {
        "Sunny": "Good day for field operations, spraying, and harvesting. Monitor for high soil evaporation.",
        "Partly Cloudy": "Ideal conditions for crop scouting and field activities. Good day for fertilizer application.",
        "Cloudy": "Overcast conditions may indicate incoming rain. Hold off on pesticide spraying.",
        "Light Rain": "Light rain is beneficial. Avoid field operations to prevent soil compaction. Good natural irrigation.",
        "Heavy Rain": "Heavy rain alert! Check drainage channels. Postpone field activities. Watch for waterlogging.",
        "Thunderstorm": "Thunderstorm warning! Avoid field operations. Check bunds and drainage. Stay safe.",
    }

    # 5-day forecast
    today = datetime.now()
    forecast = []
    for i in range(5):
        day = today + timedelta(days=i + 1)
        cond = random.choice(WEATHER_CONDITIONS)
        forecast.append(WeatherForecastDay(
            date=day.strftime("%Y-%m-%d"),
            day_name=DAYS[day.weekday()],
            max_temp=round(base_temp + random.uniform(0, 5), 1),
            min_temp=round(base_temp - random.uniform(3, 8), 1),
            humidity=min(100, round(base_humidity + random.uniform(-15, 15))),
            rain_probability=cond["rain_prob"] + random.randint(-5, 5),
            condition=cond["condition"],
            icon=cond["icon"],
            wind_speed=round(random.uniform(5, 30), 1),
        ))

    directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]

    return {
        "current": WeatherCurrent(
            temperature=current_temp,
            feels_like=round(current_temp + random.uniform(-2, 3), 1),
            humidity=current_humidity,
            pressure=round(random.uniform(1005, 1020), 1),
            wind_speed=round(random.uniform(5, 25), 1),
            wind_direction=random.choice(directions),
            condition=current_condition["condition"],
            description=f"{current_condition['condition']} with {current_humidity}% humidity",
            icon=current_condition["icon"],
            rain_probability=current_condition["rain_prob"],
            location=location,
            updated_at=datetime.now().strftime("%Y-%m-%d %H:%M"),
        ),
        "forecast": forecast,
        "farming_advisory": farming_advisories.get(current_condition["condition"], "Check local conditions before field activities."),
        "is_demo": True,
    }


async def _fetch_real_weather(location: str) -> dict:
    """Fetch real weather from OpenWeatherMap API."""
    import httpx
    url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={settings.OPENWEATHER_API_KEY}&units=metric"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

    current = WeatherCurrent(
        temperature=data["main"]["temp"],
        feels_like=data["main"]["feels_like"],
        humidity=data["main"]["humidity"],
        pressure=data["main"]["pressure"],
        wind_speed=data["wind"]["speed"],
        wind_direction="N",
        condition=data["weather"][0]["main"],
        description=data["weather"][0]["description"].capitalize(),
        icon=data["weather"][0]["icon"],
        rain_probability=data.get("clouds", {}).get("all", 0),
        location=data["name"],
        updated_at=datetime.now().strftime("%Y-%m-%d %H:%M"),
    )
    return {"current": current, "forecast": [], "farming_advisory": "Based on live weather data.", "is_demo": False}


@router.get("/", response_model=WeatherResponse)
async def get_weather(location: str = Query(default="Maharashtra", description="Location name (state or city)")):
    """
    Get current weather and 5-day forecast.
    
    Uses real OpenWeatherMap API if configured, otherwise returns realistic demo data.
    """
    if not settings.WEATHER_DEMO_MODE and settings.OPENWEATHER_API_KEY:
        try:
            return await _fetch_real_weather(location)
        except Exception as e:
            print(f"⚠️  Weather API error: {e}. Using demo data.")

    data = _generate_demo_weather(location)
    return WeatherResponse(**data)
