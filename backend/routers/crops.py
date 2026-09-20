"""
Crop Recommendation Router - /api/crops
"""
from fastapi import APIRouter, HTTPException, status
from backend.schemas.schemas import CropRecommendationRequest, CropRecommendationResponse, AlternativeCrop
from backend.ml.crop_recommendation import crop_recommender

router = APIRouter()


@router.post("/recommend", response_model=CropRecommendationResponse)
async def recommend_crop(request: CropRecommendationRequest):
    """
    Get AI-powered crop recommendation based on soil and climate conditions.
    
    Input: N, P, K, pH, temperature, humidity, rainfall, season, location
    Output: Recommended crop with suitability score, tips, and alternatives
    """
    try:
        result = crop_recommender.predict(
            nitrogen=request.nitrogen,
            phosphorus=request.phosphorus,
            potassium=request.potassium,
            ph=request.ph,
            temperature=request.temperature,
            humidity=request.humidity,
            rainfall=request.rainfall,
            season=request.season,
        )

        return CropRecommendationResponse(
            recommended_crop=result["recommended_crop"],
            suitability_score=result["suitability_score"],
            confidence=result["confidence"],
            expected_conditions=result["expected_conditions"],
            farming_tips=result["farming_tips"],
            alternative_crops=[AlternativeCrop(**c) for c in result["alternative_crops"]],
            season_info=result["season_info"],
            is_demo=result["is_demo"],
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )


@router.get("/crops-list")
async def get_supported_crops():
    """Get list of all crops supported by the recommendation system."""
    from backend.ml.crop_recommendation import ALL_CROPS
    return {"crops": ALL_CROPS, "total": len(ALL_CROPS)}
