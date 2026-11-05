"""
SmartFarm AI - Official Mandi Market Prices API
Source: AGMARKNET / data.gov.in
"""

import json
import subprocess
import asyncio
import platform

from fastapi import APIRouter, HTTPException, Query
from backend.config import settings

router = APIRouter()

DATA_URL = "https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24"


def fetch_mandi_data(params):
    curl_command = [
        "curl.exe" if platform.system() == "Windows" else "curl",
        "--silent",
        "--show-error",
        "--fail-with-body",
        "--connect-timeout", "20",
        "--max-time", "120",
        "--get",
        DATA_URL,
    ]

    for key, value in params.items():
        curl_command.extend(["--data-urlencode", f"{key}={value}"])

    result = subprocess.run(
        curl_command,
        capture_output=True,
        text=True,
        timeout=125
    )

    if result.returncode != 0:
        raise RuntimeError(result.stderr or "Official API request failed.")

    return json.loads(result.stdout)


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
        "filters[State]": state,
        "filters[Commodity]": commodity,
        "sort[Arrival_Date]": "desc",
    }

    if district:
        params["filters[District]"] = district

    if market:
        params["filters[Market]"] = market

    try:
        payload = await asyncio.to_thread(fetch_mandi_data, params)

    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=504,
            detail="Official mandi data service timed out. Please try again."
        )

    except FileNotFoundError:
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
            min_price = float(item.get("Min_Price") or 0)
            max_price = float(item.get("Max_Price") or 0)
            modal_price = float(item.get("Modal_Price") or 0)
        except (TypeError, ValueError):
            continue

        cleaned_records.append({
            "state": item.get("State", ""),
            "district": item.get("District", ""),
            "market": item.get("Market", ""),
            "commodity": item.get("Commodity", ""),
            "variety": item.get("Variety", ""),
            "grade": item.get("Grade", ""),
            "arrival_date": item.get("Arrival_Date", ""),
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
