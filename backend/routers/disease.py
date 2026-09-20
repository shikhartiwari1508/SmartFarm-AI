"""
Disease Detection Router - /api/disease
"""
import os
import uuid
import aiofiles
from fastapi import APIRouter, HTTPException, UploadFile, File, status
from fastapi.responses import JSONResponse
from backend.ml.disease_detection import disease_detector
from backend.config import settings

router = APIRouter()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
MAX_SIZE_BYTES = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024


@router.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    """
    Upload a leaf/crop image and get disease prediction.
    
    - Accepts: JPG, PNG, WebP, BMP
    - Max size: 5MB (configurable)
    - Returns: Disease name, confidence, description, prevention steps
    """
    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower() if file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Read and validate file size
    contents = await file.read()
    if len(contents) > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size: {settings.MAX_UPLOAD_SIZE_MB}MB"
        )

    # Save to uploads directory with safe filename
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    safe_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    async with aiofiles.open(file_path, "wb") as f:
        await f.write(contents)

    # Run prediction
    try:
        result = disease_detector.predict(file_path)
        result["image_url"] = f"/uploads/{safe_filename}"
        return JSONResponse(content=result)
    except Exception as e:
        # Clean up on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )
