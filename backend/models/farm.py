# stub imports for database.py compatibility
from backend.models.farmer import Farmer, Farm, SoilData, CropRecommendation, DiseaseDetection, IrrigationRecommendation, ChatHistory

__all__ = [
    "Farmer", "Farm", "SoilData", "CropRecommendation",
    "DiseaseDetection", "IrrigationRecommendation", "ChatHistory"
]
