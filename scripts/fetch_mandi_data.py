import json
import os
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_FILE = ROOT / "backend" / "data" / "mandi_prices.json"

API_URL = (
    "https://api.data.gov.in/resource/"
    "9ef84268-d588-465a-a308-a864a43d0070"
)

COMMODITIES = ["Wheat", "Rice", "Maize", "Mustard", "Potato"]
PAGE_SIZE = 1000
MAX_RETRIES = 3


def fetch_page(curl, api_key, commodity, offset):
    command = [
        curl,
        "--silent",
        "--show-error",
        "--fail-with-body",
        "--connect-timeout", "20",
        "--max-time", "90",
        "--get",
        API_URL,
        "--data-urlencode", f"api-key={api_key}",
        "--data-urlencode", "format=json",
        "--data-urlencode", f"limit={PAGE_SIZE}",
        "--data-urlencode", f"offset={offset}",
        "--data-urlencode", f"filters[commodity]={commodity}",
    ]

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=100,
                check=False,
            )

            if result.returncode != 0:
                raise RuntimeError("Official API request failed.")

            payload = json.loads(result.stdout)

            if not isinstance(payload, dict):
                raise RuntimeError("Invalid API response.")

            if not isinstance(payload.get("records"), list):
                raise RuntimeError("API response has no valid records list.")

            return payload

        except Exception as error:
            if attempt == MAX_RETRIES:
                raise RuntimeError(
                    f"{commodity} request failed after {MAX_RETRIES} attempts "
                    f"({type(error).__name__})."
                ) from None

            print(
                f"  Retry {attempt}/{MAX_RETRIES} for {commodity}...",
                flush=True,
            )
            time.sleep(attempt * 3)


def fetch_commodity(curl, api_key, commodity):
    records = []
    offset = 0
    total = None

    print(f"\nFetching {commodity}...", flush=True)

    while True:
        payload = fetch_page(curl, api_key, commodity, offset)
        page_records = payload["records"]

        try:
            total = int(payload.get("total", len(page_records)))
        except (TypeError, ValueError):
            total = None

        records.extend(page_records)

        print(
            f"  Downloaded {len(records)} records"
            + (f" / {total}" if total is not None else ""),
            flush=True,
        )

        if not page_records:
            break

        offset += len(page_records)

        if len(page_records) < PAGE_SIZE:
            break

        if total is not None and offset >= total:
            break

    return records


def main():
    api_key = os.getenv("DATA_GOV_API_KEY", "").strip()

    if not api_key:
        print("ERROR: DATA_GOV_API_KEY is not configured.")
        sys.exit(1)

    curl = shutil.which("curl.exe") or shutil.which("curl")

    if not curl:
        print("ERROR: curl executable was not found.")
        sys.exit(1)

    all_records = []
    summary = {}

    try:
        for commodity in COMMODITIES:
            records = fetch_commodity(curl, api_key, commodity)
            summary[commodity] = len(records)
            all_records.extend(records)

    except Exception as error:
        print(f"\nERROR: {error}")
        sys.exit(1)

    if not all_records:
        print("\nERROR: No records received. Existing cache preserved.")
        sys.exit(1)

    snapshot = {
        "success": True,
        "source": "AGMARKNET / data.gov.in",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total": len(all_records),
        "commodities": summary,
        "records": all_records,
    }

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    temporary_file = OUTPUT_FILE.with_suffix(".tmp")

    with temporary_file.open("w", encoding="utf-8") as file:
        json.dump(
            snapshot,
            file,
            ensure_ascii=False,
            separators=(",", ":"),
        )

    temporary_file.replace(OUTPUT_FILE)

    print("\nSUCCESS: Mandi data snapshot created.")
    print(f"Total records: {len(all_records)}")
    print(f"File size: {OUTPUT_FILE.stat().st_size / 1024:.2f} KB")
    print(f"Output: {OUTPUT_FILE}")

    for commodity, count in summary.items():
        print(f"  {commodity}: {count}")


if __name__ == "__main__":
    main()
