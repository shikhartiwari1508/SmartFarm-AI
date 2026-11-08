"""
SmartFarm AI - Multilingual Kisan Avatar API
Improved Gemini quota and error handling.
"""

import json
import logging
import re

import httpx

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal

from backend.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

GEMINI_MODEL = "gemini-3.5-flash"

LANGUAGE_NAMES = {
    "hi": "Hindi",
    "en": "English",
    "bho": "Natural Bhojpuri",
}


class KisanChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    language: Literal["hi", "en", "bho"] = "hi"


class KisanChatResponse(BaseModel):
    answer: str
    language: str
    model: str


def get_error_message(language: str, error_type: str, retry_time: str = "") -> str:
    """Return farmer-friendly messages without exposing internal API errors."""

    messages = {
        "hi": {
            "daily_quota": (
                "Kisan Avatar ki aaj ki free AI request limit poori ho gayi hai. "
                f"Kripya {retry_time} baad dobara koshish karein."
                if retry_time else
                "Kisan Avatar ki aaj ki free AI request limit poori ho gayi hai. "
                "Kripya quota reset hone ke baad dobara koshish karein."
            ),
            "rate_limit": (
                "Bahut saari requests ek saath aa rahi hain. "
                f"Kripya {retry_time} baad dobara koshish karein."
                if retry_time else
                "Bahut saari requests aa rahi hain. Kripya thodi der baad koshish karein."
            ),
            "unavailable": "AI seva filhaal uplabdh nahi hai. Kripya thodi der baad koshish karein.",
            "timeout": "AI ka jawab aane mein zyada samay lag raha hai. Kripya dobara koshish karein.",
            "connection": "AI seva se connection nahi ho pa raha hai. Internet connection check karein.",
            "empty": "AI se jawab nahi mila. Kripya apna sawaal dobara poochhein.",
            "configuration": "Kisan Avatar ki AI configuration abhi uplabdh nahi hai.",
        },
        "en": {
            "daily_quota": (
                f"Today's free AI request limit has been reached. Please try again {retry_time}."
                if retry_time else
                "Today's free AI request limit has been reached. Please try again after the quota resets."
            ),
            "rate_limit": (
                f"Too many requests. Please try again {retry_time}."
                if retry_time else
                "Too many requests. Please wait a moment and try again."
            ),
            "unavailable": "The AI service is temporarily unavailable. Please try again later.",
            "timeout": "The AI response timed out. Please try again.",
            "connection": "Could not connect to the AI service. Please check your internet connection.",
            "empty": "The AI returned an empty response. Please try again.",
            "configuration": "The AI service is not configured on the server.",
        },
        "bho": {
            "daily_quota": (
                f"Aaj ke free AI request ke limit poora ho गइल बा. Kripya {retry_time} बाद फेर कोशिश करीं."
                if retry_time else
                "Aaj ke free AI request ke limit poora ho गइल बा. Quota reset होखे के बाद फेर कोशिश करीं."
            ),
            "rate_limit": (
                f"Bahut request aa रहल बा. Kripya {retry_time} बाद फेर कोशिश करीं."
                if retry_time else
                "Bahut request aa रहल बा. Thoda der baad फेर कोशिश करीं."
            ),
            "unavailable": "AI सेवा अभी उपलब्ध नइखे. थोड़ी देर बाद फेर कोशिश करीं.",
            "timeout": "AI के जवाब आवे में बहुत समय लागत बा. फेर कोशिश करीं.",
            "connection": "AI सेवा से connection नइखे हो पावत. Internet check करीं.",
            "empty": "AI से जवाब नइखे मिलल. आपन सवाल फेर पूछीं.",
            "configuration": "AI सेवा के configuration अभी उपलब्ध नइखे.",
        },
    }

    return messages.get(language, messages["hi"])[error_type]


def extract_retry_time(error_data: dict) -> str:
    """Extract a safe retry duration from Gemini's error response."""

    try:
        message = error_data.get("error", {}).get("message", "")
        match = re.search(r"Please retry in ([^.]+)", message, re.IGNORECASE)

        if match:
            return match.group(1).strip()

    except (AttributeError, TypeError):
        pass

    return ""


@router.get("/health")
async def kisan_avatar_health():
    configured = bool(settings.GEMINI_API_KEY)

    return {
        "status": "ready" if configured else "configuration_required",
        "feature": "Kisan Avatar",
        "gemini_configured": configured,
        "model": GEMINI_MODEL,
        "quota_status": "unknown",
        "quota_note": "Actual Gemini quota is checked when a chat request is made.",
        "supported_languages": ["hi", "en", "bho"],
    }


@router.post("/chat", response_model=KisanChatResponse)
async def kisan_avatar_chat(request: KisanChatRequest):

    language = request.language

    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail=get_error_message(language, "configuration"),
        )

    language_name = LANGUAGE_NAMES[language]

    system_prompt = f"""
You are SmartFarm AI's friendly multilingual Kisan Avatar.

Your role:
- Help Indian farmers with practical agriculture information.
- Explain farming topics in simple, understandable language.
- Give guidance about crops, soil, irrigation, weather,
  pests, plant diseases, seeds and government farming schemes.
- Be respectful, patient and supportive.

LANGUAGE RULE:
The farmer selected {language_name}.
Always reply in {language_name}.
For Bhojpuri, use natural conversational Bhojpuri,
not formal Hindi.
Do not switch languages unless the farmer requests it.

SAFETY:
- Never invent government schemes, market prices or weather data.
- Never claim certainty when information is incomplete.
- Do not recommend unverified pesticide doses or chemical mixtures.
- Do not give fixed fertilizer quantities, NPK doses or irrigation schedules
  without knowing the farmer's location, soil condition and crop stage.
- Prefer soil-test-based and locally approved agricultural recommendations.
- Clearly label general guidance as general guidance.
- For serious crop disease or pesticide decisions, recommend
  consulting the nearest Krishi Vigyan Kendra or agriculture officer.
- Ask for crop name, location or symptoms when necessary.
- Do not pretend to have inspected a farm or image if none was provided.

Keep answers friendly, useful and concise. Prefer 4 to 6 short points.
Use simple language. Always finish every sentence and list item.
Ask at most one short follow-up question.
Never start a new point unless you can complete it within the response.
"""

    payload = {
        "systemInstruction": {
            "parts": [{"text": system_prompt}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": request.message.strip()}]
            }
        ],
        "generationConfig": {
            "temperature": 0.6,
            "maxOutputTokens": 2048,
            "thinkingConfig": {
                "thinkingLevel": "MINIMAL"
            }
        }
    }

    url = (
        "https://generativelanguage.googleapis.com/v1beta/"
        f"models/{GEMINI_MODEL}:generateContent"
    )

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                url,
                headers={
                    "x-goog-api-key": settings.GEMINI_API_KEY,
                    "Content-Type": "application/json",
                },
                json=payload,
            )

        if response.status_code != 200:

            try:
                error_data = response.json()
            except (ValueError, json.JSONDecodeError):
                error_data = {}

            google_error = error_data.get("error", {})
            google_message = google_error.get("message", "")
            logger.warning(
                "Gemini API error: HTTP %s, status=%s",
                response.status_code,
                google_error.get("status", "unknown"),
            )

            if response.status_code == 429:
                retry_time = extract_retry_time(error_data)

                quota_text = (
                    google_message
                    + " "
                    + str(google_error.get("status", ""))
                ).lower()

                daily_quota = any(
                    marker in quota_text
                    for marker in (
                        "generate_content_free_tier_requests",
                        "requestsperday",
                        "per day",
                        "daily quota",
                    )
                )

                error_type = "daily_quota" if daily_quota else "rate_limit"

                raise HTTPException(
                    status_code=429,
                    detail=get_error_message(language, error_type, retry_time),
                    headers={"Retry-After": "60"},
                )

            if response.status_code in (500, 502, 503, 504):
                raise HTTPException(
                    status_code=503,
                    detail=get_error_message(language, "unavailable"),
                )

            if response.status_code in (401, 403):
                logger.error("Gemini authentication or permission error.")
                raise HTTPException(
                    status_code=503,
                    detail=get_error_message(language, "configuration"),
                )

            raise HTTPException(
                status_code=502,
                detail=get_error_message(language, "unavailable"),
            )

        data = response.json()
        candidates = data.get("candidates", [])

        if not candidates:
            raise HTTPException(
                status_code=502,
                detail=get_error_message(language, "empty"),
            )

        candidate = candidates[0]

        logger.info(
            "Kisan Avatar response received. Finish reason: %s",
            candidate.get("finishReason", "unknown"),
        )

        parts = candidate.get("content", {}).get("parts", [])

        answer = "\n".join(
            part.get("text", "")
            for part in parts
            if part.get("text")
        ).strip()

        if not answer:
            raise HTTPException(
                status_code=502,
                detail=get_error_message(language, "empty"),
            )

        return KisanChatResponse(
            answer=answer,
            language=language,
            model=GEMINI_MODEL,
        )

    except HTTPException:
        raise

    except httpx.TimeoutException:
        logger.warning("Kisan Avatar Gemini request timed out.")
        raise HTTPException(
            status_code=504,
            detail=get_error_message(language, "timeout"),
        )

    except httpx.RequestError as exc:
        logger.warning("Kisan Avatar connection error: %s", type(exc).__name__)
        raise HTTPException(
            status_code=503,
            detail=get_error_message(language, "connection"),
        )

    except (ValueError, KeyError, TypeError):
        logger.exception("Kisan Avatar response parsing failed.")
        raise HTTPException(
            status_code=502,
            detail=get_error_message(language, "unavailable"),
        )
