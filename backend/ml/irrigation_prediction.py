"""
SmartFarm AI - Irrigation Prediction ML Module
==============================================
Uses agronomic thresholds for irrigation decision-making.

DEMO MODE: Rule-based irrigation scheduling based on:
    - FAO-56 Penman-Monteith evapotranspiration principles
    - Soil moisture thresholds per crop type

PRODUCTION: Replace with trained regression model or ET-based calculations
            connected to IoT soil moisture sensors.
"""
from backend.config import settings


# Crop water requirements (mm/day at peak demand) and critical moisture thresholds
CROP_WATER_NEEDS = {
    "Wheat":      {"peak_et": 6.0, "critical_moisture": 45, "stages": {"Germination": 55, "Vegetative": 45, "Flowering": 40, "Grain Fill": 50, "Maturity": 65}},
    "Rice":       {"peak_et": 8.0, "critical_moisture": 60, "stages": {"Transplanting": 50, "Tillering": 55, "Flowering": 45, "Grain Fill": 50}},
    "Maize":      {"peak_et": 6.5, "critical_moisture": 45, "stages": {"Germination": 50, "Vegetative": 40, "Tasseling": 35, "Grain Fill": 45}},
    "Cotton":     {"peak_et": 7.0, "critical_moisture": 50, "stages": {"Germination": 55, "Vegetative": 45, "Flowering": 40, "Boll": 45}},
    "Sugarcane":  {"peak_et": 7.5, "critical_moisture": 55, "stages": {"Germination": 50, "Tillering": 45, "Grand Growth": 40, "Maturity": 60}},
    "Tomato":     {"peak_et": 5.5, "critical_moisture": 40, "stages": {"Transplanting": 50, "Vegetative": 40, "Flowering": 35, "Fruiting": 40}},
    "Potato":     {"peak_et": 5.0, "critical_moisture": 45, "stages": {"Emergence": 55, "Vegetative": 45, "Tuber Init": 40, "Bulking": 35, "Maturity": 65}},
    "Groundnut":  {"peak_et": 4.5, "critical_moisture": 50, "stages": {"Germination": 55, "Vegetative": 45, "Pegging": 40, "Pod Fill": 45, "Maturity": 65}},
    "Soybean":    {"peak_et": 5.5, "critical_moisture": 45, "stages": {"Germination": 55, "Vegetative": 45, "Flowering": 40, "Pod Fill": 45}},
    "Chickpea":   {"peak_et": 3.5, "critical_moisture": 55, "stages": {"Germination": 60, "Vegetative": 55, "Flowering": 50, "Pod Fill": 55}},
    "Mustard":    {"peak_et": 4.0, "critical_moisture": 55, "stages": {"Germination": 60, "Vegetative": 50, "Flowering": 40, "Maturity": 65}},
    "Onion":      {"peak_et": 4.0, "critical_moisture": 45, "stages": {"Establishment": 50, "Vegetative": 40, "Bulb Dev": 35, "Maturity": 60}},
}

IRRIGATION_METHODS = {
    "low": "Light surface irrigation (furrow/flood)",
    "moderate": "Sprinkler irrigation or controlled flood",
    "high": "Sprinkler irrigation with 2-3 passes",
    "critical": "Immediate drip irrigation or heavy flood",
}


class IrrigationPredictionML:
    """
    ML interface for irrigation recommendation.
    Demo mode uses agronomic threshold-based logic.
    """

    def __init__(self):
        self.demo_mode = settings.ML_DEMO_MODE

    def predict(self, soil_moisture: float, temperature: float, humidity: float,
                rainfall: float, crop_type: str, growth_stage: str) -> dict:
        """Predict irrigation requirement."""
        return self._demo_predict(soil_moisture, temperature, humidity, rainfall, crop_type, growth_stage)

    def _demo_predict(self, soil_moisture: float, temperature: float, humidity: float,
                      rainfall: float, crop_type: str, growth_stage: str) -> dict:
        """Rule-based irrigation recommendation."""
        crop_info = CROP_WATER_NEEDS.get(crop_type, CROP_WATER_NEEDS["Wheat"])
        
        # Get critical moisture for this growth stage
        stage_thresholds = crop_info["stages"]
        critical_moisture = stage_thresholds.get(growth_stage, crop_info["critical_moisture"])
        
        # Estimate effective rainfall contribution (simple model)
        effective_rainfall = min(rainfall * 0.6, 25)  # max 25mm credit
        
        # Estimate evapotranspiration based on temp/humidity
        et_base = crop_info["peak_et"]
        et_adjustment = (temperature - 25) * 0.2  # higher temp = more ET
        humidity_adjustment = -(humidity - 60) * 0.05  # high humidity = less ET
        estimated_et = max(1.0, et_base + et_adjustment + humidity_adjustment)
        
        # Decision logic
        moisture_deficit = critical_moisture - soil_moisture
        irrigation_required = soil_moisture < critical_moisture and effective_rainfall < estimated_et

        if not irrigation_required and rainfall > 20:
            reason = f"Recent rainfall ({rainfall}mm) provides sufficient moisture. Soil at {soil_moisture}% — above critical threshold of {critical_moisture}% for {growth_stage} stage."
            recommended_mm = 0
            urgency = "None"
            next_check = 48
            method = "No irrigation needed"
        elif soil_moisture >= critical_moisture:
            reason = f"Soil moisture ({soil_moisture}%) is adequate for {crop_type} at {growth_stage} stage. Minimum threshold is {critical_moisture}%."
            recommended_mm = 0
            irrigation_required = False
            urgency = "None"
            next_check = 24
            method = "No irrigation needed"
        elif moisture_deficit < 10:
            reason = f"Soil moisture ({soil_moisture}%) is slightly below optimal ({critical_moisture}%) for {growth_stage}. Light irrigation recommended."
            recommended_mm = round(estimated_et * 2, 1)
            urgency = "Low"
            next_check = 24
            method = IRRIGATION_METHODS["low"]
        elif moisture_deficit < 20:
            reason = f"Soil moisture ({soil_moisture}%) significantly below optimal ({critical_moisture}%) for {crop_type} at {growth_stage}. Moderate irrigation needed."
            recommended_mm = round(estimated_et * 3, 1)
            urgency = "Medium"
            next_check = 12
            method = IRRIGATION_METHODS["moderate"]
        else:
            reason = f"Critical moisture deficit! Soil at {soil_moisture}% — well below {critical_moisture}% required for {growth_stage}. Immediate irrigation required."
            recommended_mm = round(estimated_et * 4, 1)
            urgency = "High"
            next_check = 6
            method = IRRIGATION_METHODS["critical"]

        # Water saving tip
        if temperature > 35:
            tip = "Irrigate early morning (5-7 AM) or evening to reduce evaporation losses by up to 30%."
        elif humidity > 80:
            tip = "High humidity is reducing water demand. Monitor soil moisture before next irrigation."
        else:
            tip = "Consider drip irrigation to improve water use efficiency by 40-50% compared to flood irrigation."

        return {
            "irrigation_required": irrigation_required,
            "recommended_amount_mm": recommended_mm,
            "urgency": urgency,
            "reason": reason,
            "next_check_hours": next_check,
            "water_saving_tip": tip,
            "method_suggestion": method,
        }


# Singleton
irrigation_predictor = IrrigationPredictionML()
