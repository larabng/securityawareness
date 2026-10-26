#!/usr/bin/env python3
"""Merge the per-participant CSV exports into one table (one row per run).

Each export from the result page is a two-column file (field,value).
This script collects every imoah_*.csv in a folder and writes one wide CSV
that opens directly in Excel / SPSS / R.

Usage:
    python3 tools/merge_results.py <folder-with-exports> [output.csv]

Duplicate exports of the same run (same run_id) are counted once – the
latest export wins.
"""
import csv
import sys
from pathlib import Path


def read_export(path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        rows = list(csv.reader(f))
    if not rows or rows[0] != ["field", "value"]:
        raise ValueError("not an export file (missing field,value header)")
    return {r[0]: r[1] for r in rows[1:] if len(r) >= 2}


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    folder = Path(sys.argv[1])
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else folder / "merged_results.csv"

    runs, columns = {}, []
    for path in sorted(folder.glob("imoah_*.csv")):
        try:
            data = read_export(path)
        except ValueError as e:
            print(f"skipped {path.name}: {e}")
            continue
        for k in data:
            if k not in columns:
                columns.append(k)
        key = data.get("run_id") or path.name
        prev = runs.get(key)
        if prev is None or data.get("exported_at", "") >= prev.get("exported_at", ""):
            runs[key] = data
        data["source_file"] = path.name

    if not runs:
        sys.exit(f"no imoah_*.csv exports found in {folder}")

    columns.append("source_file")
    with open(out, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=columns)
        w.writeheader()
        for data in sorted(runs.values(), key=lambda d: d.get("started_at", "")):
            w.writerow(data)
    print(f"{len(runs)} runs, {len(columns)} columns -> {out}")


if __name__ == "__main__":
    main()
