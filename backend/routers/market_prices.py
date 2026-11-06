"""
SmartFarm AI - Official Mandi Market Prices API
Source: AGMARKNET / data.gov.in
"""

import json
import subprocess
import asyncio
import platform
import logging

from fastapi import APIRouter, HTTPException, Query
from backend.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

DATA_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"


def fetch_mandi_data(params):
    curl_command = [
        "curl.exe" if platform.system() == "Windows" else "curl",
        "--silent",
        "--show-error",
        "--fail-with-body",
        "--connect-timeout", "20",
        "--max-time", "60",
        "--get",
        DATA_URL,
    ]

    for key, value in params.items():
        curl_command.extend(["--data-urlencode", f"{key}={value}"])

    result = subprocess.run(
        curl_command,
        capture_output=True,
        text=True,
        timeout=65
    )

    if result.returncode != 0:
        api_key = str(params.get("api-key", ""))
        safe_error = result.stderr or "No error details returned."

        if api_key:
            safe_error = safe_error.replace(api_key, "[REDACTED]")

        logger.error(
            "Mandi API request failed. Curl exit code: %s. Error: %s",
            result.returncode,
            safe_error[:1000]
        )
        raise RuntimeError("Official Mandi API request failed.")

    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        logger.error("Mandi API returned invalid JSON.")
        raise


@router.get("/")
async def get_market_prices(
    commodity: str = Query(..., min_length=2),
    state: str = Query(..., min_length=2),
    district: str = Query(None),
    market: str = Query(None),
    limit: int = Query(10, ge=1, le=100),
):
    api_key = settings.DATA_GOV_API_KEY.strip()

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="DATA_GOV_API_KEY is not configured."
        )

    params = {
        "api-key": api_key,
        "format": "json",
        "limit": limit,
        "offset": 0,
        "filters[state.keyword]": state,
        "filters[commodity]": commodity,
        "sort[arrival_date]": "desc",
    }

    if district:
        params["filters[district]"] = district

    if market:
        params["filters[market]"] = market

    try:
        payload = await asyncio.to_thread(fetch_mandi_data, params)

    except subprocess.TimeoutExpired:
        logger.error("Mandi API request timed out.")
        raise HTTPException(
            status_code=504,
            detail="Official mandi data service timed out. Please try again."
        )

    except FileNotFoundError:
        logger.error("Curl executable was not found.")
        raise HTTPException(
            status_code=503,
            detail="Curl is not installed on this server."
        )

    except RuntimeError:
        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve data from the official mandi service."
        )

    except (ValueError, json.JSONDecodeError):
        raise HTTPException(
            status_code=502,
            detail="Invalid response from official mandi data provider."
        )

    records = payload.get("records", [])
    cleaned_records = []

    for item in records:
        try:
            min_price = float(item.get("min_price") or 0)
            max_price = float(item.get("max_price") or 0)
            modal_price = float(item.get("modal_price") or 0)
        except (TypeError, ValueError):
            continue

        cleaned_records.append({
            "state": item.get("state", ""),
            "district": item.get("district", ""),
            "market": item.get("market", ""),
            "commodity": item.get("commodity", ""),
            "variety": item.get("variety", ""),
            "grade": item.get("grade", ""),
            "arrival_date": item.get("arrival_date", ""),
            "min_price": min_price,
            "max_price": max_price,
            "modal_price": modal_price,
            "min_price_per_kg": round(min_price / 100, 2),
            "max_price_per_kg": round(max_price / 100, 2),
            "modal_price_per_kg": round(modal_price / 100, 2),
        })

    return {
        "success": True,
        "source": "AGMARKNET / data.gov.in",
        "message": (
            "Live mandi data retrieved successfully."
            if cleaned_records
            else "No mandi records found for these filters."
        ),
        "total": len(cleaned_records),
        "records": cleaned_records,
    }
