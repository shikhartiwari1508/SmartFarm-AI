import json
import os
import shutil
import subprocess
import sys
import time
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_FILE = ROOT / "backend" / "data" / "mandi_prices.json"

API_URL = (
    "https://api.data.gov.in/resource/"
    "9ef84268-d588-465a-a308-a864a43d0070"
)

PAGE_SIZE = 1000
MAX_RETRIES = 3
REQUEST_TIMEOUT = 100


def fetch_page(curl, api_key, offset):
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
    ]

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=REQUEST_TIMEOUT,
                check=False,
            )

            if result.returncode != 0:
                details = (result.stderr or "").strip()
                response_body = (result.stdout or "").strip()

                details = details.replace(api_key, "[REDACTED]")
                response_body = response_body.replace(
                    api_key, "[REDACTED]"
                )

                raise RuntimeError(
                    f"curl exit code: {result.returncode}; "
                    f"stderr: {details[-1000:]}; "
                    f"response: {response_body[-1000:]}"
                )

            payload = json.loads(result.stdout)

            if not isinstance(payload, dict):
                raise RuntimeError("Invalid API response.")

            if not isinstance(payload.get("records"), list):
                raise RuntimeError(
                    "API response has no valid records list."
                )

            if "total" not in payload:
                raise RuntimeError(
                    "API response is missing total record count."
                )

            return payload

        except Exception as error:
            if attempt == MAX_RETRIES:
                message = str(error).replace(
                    api_key, "[REDACTED]"
                )
                raise RuntimeError(
                    f"Request at offset {offset} failed after "
                    f"{MAX_RETRIES} attempts: {message}"
                ) from None

            print(
                f"  Retry {attempt}/{MAX_RETRIES} "
                f"at offset {offset}...",
                flush=True,
            )
            time.sleep(attempt * 3)


def fetch_all_records(curl, api_key):
    all_records = []
    offset = 0
    expected_total = None
    page_number = 0

    print("\nFetching ALL available mandi records...", flush=True)

    while True:
        payload = fetch_page(curl, api_key, offset)
        page_records = payload["records"]

        try:
            current_total = int(payload["total"])
        except (TypeError, ValueError):
            raise RuntimeError(
                "API returned an invalid total record count."
            ) from None

        if current_total < 0:
            raise RuntimeError("API returned a negative total.")

        if expected_total is None:
            expected_total = current_total
            print(
                f"  API-reported total: {expected_total}",
                flush=True,
            )
        elif current_total != expected_total:
            raise RuntimeError(
                "API total changed during pagination. "
                "Snapshot not updated."
            )

        if len(page_records) > PAGE_SIZE:
            raise RuntimeError(
                "API returned more records than requested."
            )

        if len(page_records) > expected_total - offset:
            raise RuntimeError(
                "API returned more records than its reported total."
            )

        if not page_records and offset < expected_total:
            raise RuntimeError(
                f"Unexpected empty page at offset {offset}."
            )

        page_number += 1
        all_records.extend(page_records)

        print(
            f"  Page {page_number}: "
            f"{len(page_records)} records | "
            f"Downloaded {len(all_records)} / {expected_total}",
            flush=True,
        )

        if len(all_records) == expected_total:
            break

        if not page_records:
            raise RuntimeError(
                "Pagination stopped before all records were fetched."
            )

        if len(page_records) < PAGE_SIZE:
            raise RuntimeError(
                "Incomplete final page received before expected total."
            )

        offset += len(page_records)

    if len(all_records) != expected_total:
        raise RuntimeError(
            f"Incomplete download: received {len(all_records)} "
            f"of {expected_total} records."
        )

    return all_records


def main():
    api_key = os.getenv("DATA_GOV_API_KEY", "").strip()

    if not api_key:
        print("ERROR: DATA_GOV_API_KEY is not configured.")
        sys.exit(1)

    curl = shutil.which("curl.exe") or shutil.which("curl")

    if not curl:
        print("ERROR: curl executable was not found.")
        sys.exit(1)

    try:
        all_records = fetch_all_records(curl, api_key)

    except Exception as error:
        print(f"\nERROR: {error}")
        print("Existing snapshot preserved.")
        sys.exit(1)

    if not all_records:
        print("\nERROR: No records received.")
        print("Existing snapshot preserved.")
        sys.exit(1)

    commodity_counts = Counter(
        str(record.get("commodity", "")).strip()
        for record in all_records
        if isinstance(record, dict)
        and record.get("commodity")
    )

    summary = dict(sorted(commodity_counts.items()))

    snapshot = {
        "success": True,
        "source": "AGMARKNET / data.gov.in",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total": len(all_records),
        "commodities": summary,
        "records": all_records,
    }

    temporary_file = OUTPUT_FILE.with_suffix(".tmp")

    try:
        OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

        with temporary_file.open(
            "w", encoding="utf-8"
        ) as file:
            json.dump(
                snapshot,
                file,
                ensure_ascii=False,
                separators=(",", ":"),
            )
            file.flush()
            os.fsync(file.fileno())

        temporary_file.replace(OUTPUT_FILE)

    except Exception as error:
        print(f"\nERROR: Could not save snapshot: {error}")
        print("Existing snapshot preserved.")
        sys.exit(1)

    print("\nSUCCESS: Complete mandi snapshot created.")
    print(f"Total records: {len(all_records)}")
    print(f"Unique commodities: {len(summary)}")
    print(f"File size: {OUTPUT_FILE.stat().st_size / 1024:.2f} KB")
    print(f"Output: {OUTPUT_FILE}")

    print("\nTop 20 commodities by record count:")
    for commodity, count in commodity_counts.most_common(20):
        print(f"  {commodity}: {count}")


if __name__ == "__main__":
    main()
