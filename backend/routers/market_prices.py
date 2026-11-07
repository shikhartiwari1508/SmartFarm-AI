"""
SmartFarm AI - Cached Mandi Market Prices API
Source: AGMARKNET / data.gov.in
Data is served from a locally stored JSON snapshot.
"""

import json
import logging
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, HTTPException, Query

router = APIRouter()
logger = logging.getLogger(__name__)

DATA_FILE = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "mandi_prices.json"
)


def load_mandi_data():
    if not DATA_FILE.exists():
        logger.error("Mandi snapshot file not found: %s", DATA_FILE)
        raise HTTPException(
            status_code=503,
            detail="Mandi data is not available. Please try again later."
        )

    try:
        with DATA_FILE.open("r", encoding="utf-8") as file:
            payload = json.load(file)

        if not isinstance(payload, dict) or not isinstance(
            payload.get("records"), list
        ):
            raise ValueError("Invalid mandi snapshot structure.")

        return payload

    except (OSError, json.JSONDecodeError, ValueError):
        logger.exception("Unable to read mandi snapshot.")
        raise HTTPException(
            status_code=503,
            detail="Mandi data cache is temporarily unavailable."
        )


def normalize(value):
    return str(value or "").strip().casefold()


def unique_values(records, field):
    values = {
        str(item.get(field, "")).strip()
        for item in records
        if isinstance(item, dict) and item.get(field)
    }
    return sorted(values, key=str.casefold)


def parse_arrival_date(value):
    value = str(value or "").strip()

    for date_format in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"):
        try:
            return datetime.strptime(value, date_format)
        except ValueError:
            continue

    return datetime.min


@router.get("/filters")
async def get_market_price_filters(
    state: str = Query(None),
    commodity: str = Query(None),
    district: str = Query(None),
):
    """
    Districts are filtered by state and commodity.
    Markets are filtered by state and district, independent of commodity.
    """
    payload = load_mandi_data()
    records = [
        item for item in payload["records"]
        if isinstance(item, dict)
    ]

    state_records = records

    if state:
        state_records = [
            item for item in state_records
            if normalize(item.get("state")) == normalize(state)
        ]

    commodity_records = state_records

    if commodity:
        commodity_records = [
            item for item in commodity_records
            if normalize(item.get("commodity")) == normalize(commodity)
        ]

    districts = unique_values(commodity_records, "district")

    # Markets must not depend on the selected crop.
    market_records = state_records

    if district:
        market_records = [
            item for item in market_records
            if normalize(item.get("district")) == normalize(district)
        ]

    markets = unique_values(market_records, "market")

    return {
        "success": True,
        "generated_at": payload.get("generated_at"),
        "total_records": len(records),
        "commodities": unique_values(records, "commodity"),
        "states": unique_values(records, "state"),
        "districts": districts,
        "markets": markets,
    }
@router.get("/")
async def get_market_prices(
    commodity: str = Query(..., min_length=2),
    state: str = Query(..., min_length=2),
    district: str = Query(None),
    market: str = Query(None),
    limit: int = Query(10, ge=1, le=100),
):
    payload = load_mandi_data()

    records = payload["records"]
    filtered_records = []

    for item in records:
        if not isinstance(item, dict):
            continue

        if normalize(item.get("commodity")) != normalize(commodity):
            continue

        if normalize(item.get("state")) != normalize(state):
            continue

        if district and normalize(item.get("district")) != normalize(district):
            continue

        if market and normalize(item.get("market")) != normalize(market):
            continue

        try:
            min_price = float(item.get("min_price") or 0)
            max_price = float(item.get("max_price") or 0)
            modal_price = float(item.get("modal_price") or 0)
        except (TypeError, ValueError):
            continue

        filtered_records.append({
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

    filtered_records.sort(
        key=lambda record: parse_arrival_date(record["arrival_date"]),
        reverse=True
    )

    total = len(filtered_records)
    result_records = filtered_records[:limit]

    generated_at = payload.get("generated_at")

    return {
        "success": True,
        "source": payload.get("source", "AGMARKNET / data.gov.in"),
        "message": (
            "Mandi data retrieved successfully from the cached official snapshot."
            if result_records
            else "No mandi records found for these filters."
        ),
        "generated_at": generated_at,
        "total": total,
        "records": result_records,
    }
