"""
Smart Irrigation Router - /api/irrigation
"""
from fastapi import APIRouter, HTTPException, status
from backend.schemas.schemas import IrrigationRequest, IrrigationResponse
from backend.ml.irrigation_prediction import irrigation_predictor

router = APIRouter()


@router.post("/recommend", response_model=IrrigationResponse)
async def recommend_irrigation(request: IrrigationRequest):
    """
    Get smart irrigation recommendation based on current field conditions.
    
    Input: Soil moisture, temperature, humidity, rainfall, crop type, growth stage
    Output: Irrigation decision, amount, urgency, water-saving tips
    """
    try:
        result = irrigation_predictor.predict(
            soil_moisture=request.soil_moisture,
            temperature=request.temperature,
            humidity=request.humidity,
            rainfall=request.rainfall,
            crop_type=request.crop_type,
            growth_stage=request.growth_stage,
        )
        return IrrigationResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Recommendation failed: {str(e)}"
        )


@router.get("/crops")
async def get_supported_crops():
    """Get list of crops and growth stages supported by irrigation model."""
    from backend.ml.irrigation_prediction import CROP_WATER_NEEDS
    return {
        "crops": [
            {"name": crop, "stages": list(info["stages"].keys())}
            for crop, info in CROP_WATER_NEEDS.items()
        ]
    }
