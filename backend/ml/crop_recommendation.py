"""
SmartFarm AI - Crop Recommendation ML Module
============================================
Architecture: This module provides a clean interface for crop recommendation.

DEMO MODE: Uses rule-based logic with realistic thresholds derived from 
           agronomy research data for Indian crops.

PRODUCTION MODE: Replace the `predict()` method body with:
    - scikit-learn: joblib.load("model.pkl").predict(features)
    - PyTorch: Load model.pt and run inference
    - Any trained classifier trained on Crop Recommendation Dataset
      (Kaggle: https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset)
"""
import math
from typing import Optional
from backend.config import settings


# Crop knowledge base - thresholds derived from agricultural research
CROP_DATA = {
    "Rice": {
        "N": (60, 120), "P": (30, 80), "K": (30, 80),
        "pH": (5.0, 7.0), "temp": (22, 35), "humidity": (80, 95),
        "rainfall": (150, 300), "seasons": ["Kharif"],
        "description": "High water requirement, grows best in warm humid conditions",
        "tips": [
            "Maintain 5-7 cm standing water during transplanting",
            "Apply nitrogen fertilizer in splits (basal + top dressing)",
            "Monitor for blast disease during high humidity",
            "Ensure proper drainage before harvesting"
        ]
    },
    "Wheat": {
        "N": (60, 120), "P": (40, 80), "K": (40, 80),
        "pH": (6.0, 7.5), "temp": (10, 25), "humidity": (40, 70),
        "rainfall": (50, 150), "seasons": ["Rabi"],
        "description": "Cool weather crop, requires moderate water and nutrients",
        "tips": [
            "Sow in November-December for Rabi season",
            "Ensure irrigation at critical stages: CRI, tillering, flowering",
            "Apply recommended dose of nitrogen fertilizer",
            "Watch for rust diseases — spray fungicide if needed"
        ]
    },
    "Maize": {
        "N": (80, 150), "P": (40, 80), "K": (40, 80),
        "pH": (5.5, 7.5), "temp": (20, 35), "humidity": (50, 80),
        "rainfall": (80, 200), "seasons": ["Kharif", "Rabi"],
        "description": "Versatile crop, adapts to various conditions, high nutrient demand",
        "tips": [
            "Ensure good soil tilth before sowing",
            "Apply nitrogen in 3 splits for maximum efficiency",
            "Irrigate at tasseling and grain filling stages",
            "Weed management is critical in first 30 days"
        ]
    },
    "Sugarcane": {
        "N": (100, 200), "P": (50, 100), "K": (50, 150),
        "pH": (6.0, 8.0), "temp": (20, 35), "humidity": (60, 90),
        "rainfall": (100, 250), "seasons": ["Kharif", "Rabi"],
        "description": "Long-duration cash crop, high water and nutrient requirement",
        "tips": [
            "Use disease-free seed setts for planting",
            "Apply organic manure before planting",
            "Earthing up is essential at 90 days",
            "Maintain regular irrigation schedule"
        ]
    },
    "Cotton": {
        "N": (80, 120), "P": (40, 80), "K": (40, 80),
        "pH": (6.0, 8.0), "temp": (25, 40), "humidity": (50, 80),
        "rainfall": (50, 150), "seasons": ["Kharif"],
        "description": "Cash crop requiring warm temperatures and moderate rainfall",
        "tips": [
            "Use BT cotton varieties for bollworm resistance",
            "Apply balanced NPK fertilization",
            "Monitor for bollworm and whitefly regularly",
            "Avoid waterlogging — ensure proper drainage"
        ]
    },
    "Groundnut": {
        "N": (15, 40), "P": (40, 80), "K": (50, 100),
        "pH": (6.0, 7.5), "temp": (25, 35), "humidity": (50, 70),
        "rainfall": (50, 150), "seasons": ["Kharif", "Rabi"],
        "description": "Leguminous oilseed, fixes atmospheric nitrogen",
        "tips": [
            "Seed treat with Rhizobium culture before sowing",
            "Ensure calcium supply during pod development",
            "Avoid irrigation after flowering — affects pod formation",
            "Harvest when 75% pods are mature"
        ]
    },
    "Tomato": {
        "N": (100, 150), "P": (50, 100), "K": (100, 200),
        "pH": (5.5, 7.0), "temp": (20, 30), "humidity": (60, 80),
        "rainfall": (40, 120), "seasons": ["Rabi", "Zaid"],
        "description": "High-value vegetable, requires consistent moisture and nutrition",
        "tips": [
            "Use virus-free certified seedlings",
            "Stake or cage plants for support",
            "Monitor for early blight and late blight",
            "Drip irrigation recommended for water efficiency"
        ]
    },
    "Onion": {
        "N": (60, 100), "P": (40, 80), "K": (60, 100),
        "pH": (6.0, 7.5), "temp": (13, 28), "humidity": (50, 70),
        "rainfall": (30, 100), "seasons": ["Rabi", "Kharif"],
        "description": "Important vegetable and cash crop for Indian farmers",
        "tips": [
            "Transplant seedlings at 6-8 weeks",
            "Avoid excess nitrogen — causes bulb splitting",
            "Stop irrigation 2 weeks before harvest",
            "Store in well-ventilated cool area"
        ]
    },
    "Chickpea": {
        "N": (20, 50), "P": (40, 80), "K": (30, 60),
        "pH": (6.0, 8.0), "temp": (15, 30), "humidity": (40, 65),
        "rainfall": (30, 100), "seasons": ["Rabi"],
        "description": "Drought-tolerant legume, excellent for nitrogen fixation",
        "tips": [
            "Sow in October-November for Rabi crop",
            "Rhizobium inoculation improves nitrogen fixation",
            "Avoid irrigation after pod filling stage",
            "Spray fungicide if wilt disease noticed"
        ]
    },
    "Soybean": {
        "N": (20, 60), "P": (60, 100), "K": (40, 80),
        "pH": (6.0, 7.5), "temp": (20, 35), "humidity": (60, 80),
        "rainfall": (80, 200), "seasons": ["Kharif"],
        "description": "Versatile protein-rich oilseed crop",
        "tips": [
            "Use Bradyrhizobium inoculated seed",
            "Maintain adequate moisture at flowering",
            "Weed management critical in first 45 days",
            "Harvest when 90% pods turn brown"
        ]
    },
    "Mustard": {
        "N": (80, 120), "P": (40, 60), "K": (40, 60),
        "pH": (6.0, 7.5), "temp": (10, 25), "humidity": (40, 65),
        "rainfall": (40, 100), "seasons": ["Rabi"],
        "description": "Cool season oilseed, one of India's major oil crops",
        "tips": [
            "Sow in October-November",
            "Apply sulfur — critical for oil content",
            "One irrigation at flowering stage is sufficient",
            "Watch for aphids and Alternaria blight"
        ]
    },
    "Potato": {
        "N": (100, 180), "P": (80, 120), "K": (150, 250),
        "pH": (5.0, 6.5), "temp": (15, 25), "humidity": (60, 80),
        "rainfall": (50, 150), "seasons": ["Rabi"],
        "description": "High-yielding vegetable with excellent market demand",
        "tips": [
            "Use certified disease-free seed tubers",
            "Earthing up at 30 and 45 days is essential",
            "Monitor for late blight — most destructive disease",
            "Harvest when vines die naturally"
        ]
    },
}

ALL_CROPS = list(CROP_DATA.keys())


def _score_crop(crop: str, data: dict, inputs: dict) -> float:
    """Calculate a suitability score (0-100) for a crop given input conditions."""
    cd = data
    score = 100.0
    penalties = 0

    def range_score(val, low, high):
        if low <= val <= high:
            return 0  # no penalty
        elif val < low:
            return min(40, (low - val) / max(low, 1) * 50)
        else:
            return min(40, (val - high) / max(high, 1) * 50)

    penalties += range_score(inputs["N"], *cd["N"])
    penalties += range_score(inputs["P"], *cd["P"])
    penalties += range_score(inputs["K"], *cd["K"])
    penalties += range_score(inputs["pH"], *cd["pH"]) * 2  # pH is critical
    penalties += range_score(inputs["temp"], *cd["temp"]) * 1.5
    penalties += range_score(inputs["humidity"], *cd["humidity"])
    penalties += range_score(inputs["rainfall"], *cd["rainfall"])

    # Season bonus
    if inputs.get("season") in cd.get("seasons", []):
        penalties -= 5  # bonus for correct season

    score = max(0, score - penalties)
    return round(score, 1)


class CropRecommendationML:
    """
    ML interface for crop recommendation.
    
    DEMO MODE: Rule-based scoring using agronomic thresholds.
    PRODUCTION: Replace predict() with trained model inference.
    """

    def __init__(self):
        self.model = None
        self.demo_mode = settings.ML_DEMO_MODE
        if not self.demo_mode:
            self._load_model()

    def _load_model(self):
        """Load trained scikit-learn/PyTorch model from disk."""
        try:
            import joblib
            self.model = joblib.load(settings.CROP_MODEL_PATH)
        except Exception as e:
            print(f"⚠️  Could not load crop model: {e}. Falling back to demo mode.")
            self.demo_mode = True

    def predict(self, nitrogen: float, phosphorus: float, potassium: float,
                ph: float, temperature: float, humidity: float,
                rainfall: float, season: str = "Kharif") -> dict:
        """
        Predict the most suitable crop.
        
        In production, replace this with:
            features = np.array([[N, P, K, temperature, humidity, pH, rainfall]])
            prediction = self.model.predict(features)[0]
            proba = self.model.predict_proba(features)[0]
        """
        if not self.demo_mode and self.model is not None:
            return self._model_predict(nitrogen, phosphorus, potassium, ph, temperature, humidity, rainfall)

        return self._demo_predict(nitrogen, phosphorus, potassium, ph, temperature, humidity, rainfall, season)

    def _demo_predict(self, N, P, K, pH, temp, humidity, rainfall, season) -> dict:
        """Demo prediction using agronomic rule-based scoring."""
        inputs = {"N": N, "P": P, "K": K, "pH": pH, "temp": temp,
                  "humidity": humidity, "rainfall": rainfall, "season": season}

        scores = {}
        for crop, data in CROP_DATA.items():
            scores[crop] = _score_crop(crop, data, inputs)

        sorted_crops = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        top_crop, top_score = sorted_crops[0]
        top_data = CROP_DATA[top_crop]

        alternatives = [
            {
                "crop": c,
                "score": round(s, 1),
                "reason": f"Suitable for {season} season with your soil conditions"
            }
            for c, s in sorted_crops[1:4]
            if s > 40
        ]

        if top_score >= 80:
            confidence = "High"
        elif top_score >= 60:
            confidence = "Medium"
        else:
            confidence = "Low"

        return {
            "recommended_crop": top_crop,
            "suitability_score": top_score,
            "confidence": confidence,
            "expected_conditions": {
                "optimal_temp": f"{top_data['temp'][0]}-{top_data['temp'][1]}°C",
                "optimal_humidity": f"{top_data['humidity'][0]}-{top_data['humidity'][1]}%",
                "optimal_rainfall": f"{top_data['rainfall'][0]}-{top_data['rainfall'][1]} mm",
                "optimal_ph": f"{top_data['pH'][0]}-{top_data['pH'][1]}",
            },
            "farming_tips": top_data["tips"],
            "alternative_crops": alternatives,
            "season_info": f"{top_crop} is {'well' if season in top_data['seasons'] else 'moderately'} suited for {season} season.",
            "is_demo": True,
        }

    def _model_predict(self, N, P, K, pH, temp, humidity, rainfall) -> dict:
        """Production model prediction (placeholder)."""
        import numpy as np
        features = np.array([[N, P, K, temp, humidity, pH, rainfall]])
        prediction = self.model.predict(features)[0]
        return {"recommended_crop": prediction, "is_demo": False}


# Singleton instance
crop_recommender = CropRecommendationML()
