#!/usr/bin/env python3
"""
Prepare a Question-3-ready agriculture dataset from the uploaded CSV.

Input:
  uploads/Total_agriculture_land_holders_Total_c8cf.csv

Output:
  agriculture_india_q3_modified.csv
"""

import csv
from pathlib import Path


INPUT_PATH = Path("/home/ubuntu/.cursor/projects/workspace/uploads/Total_agriculture_land_holders_Total_c8cf.csv")
OUTPUT_PATH = Path("/workspace/agriculture_india_q3_modified.csv")


def clean_num(value: str) -> float:
    value = (value or "").strip()
    if value == "":
        return 0.0
    return float(value)


def classify_level(value: float) -> str:
    if value == 0:
        return "Zero"
    if value < 10000:
        return "Low"
    if value < 50000:
        return "Medium"
    return "High"


def main() -> None:
    if not INPUT_PATH.exists():
        raise FileNotFoundError(f"Input file not found: {INPUT_PATH}")

    metric_map = [
        ("Total Agricultural Land Holders _Total_numbers_Male", "Numbers", "Male", "Count"),
        ("Total Agricultural Land Holders _Total_numbers_Female", "Numbers", "Female", "Count"),
        ("Total Agricultural Land Holders _Total_numbers_Institution", "Numbers", "Institution", "Count"),
        ("Total Agricultural Land Holders _Total_numbers_Total", "Numbers", "Total", "Count"),
        ("Total Agricultural Land Holders _Total_Area_Male", "Area", "Male", "Area"),
        ("Total Agricultural Land Holders _Total_Area_Female", "Area", "Female", "Area"),
        ("Total Agricultural Land Holders _Total_Area_Institutions", "Area", "Institution", "Area"),
        ("Total Agricultural Land Holders _Total_Area_Total", "Area", "Total", "Area"),
    ]

    out_rows = []
    with INPUT_PATH.open("r", newline="", encoding="utf-8") as infile:
        reader = csv.DictReader(infile)
        record_id = 1
        for src_row in reader:
            taluk = (src_row.get("Taluk name") or "").strip()
            for col_name, metric_group, holder_group, unit in metric_map:
                value = clean_num(src_row.get(col_name, "0"))
                out_rows.append(
                    {
                        "record_id": f"AG{record_id:05d}",
                        "state": "Karnataka",
                        "taluk_name": taluk,
                        "metric_group": metric_group,
                        "holder_group": holder_group,
                        "value": value,
                        "unit": unit,
                        "value_level": classify_level(value),
                        "is_zero": "Yes" if value == 0 else "No",
                    }
                )
                record_id += 1

    with OUTPUT_PATH.open("w", newline="", encoding="utf-8") as outfile:
        writer = csv.DictWriter(
            outfile,
            fieldnames=[
                "record_id",
                "state",
                "taluk_name",
                "metric_group",
                "holder_group",
                "value",
                "unit",
                "value_level",
                "is_zero",
            ],
        )
        writer.writeheader()
        writer.writerows(out_rows)

    print(f"Created: {OUTPUT_PATH}")
    print(f"Rows (excluding header): {len(out_rows)}")
    print("Columns: 9")


if __name__ == "__main__":
    main()
