#!/usr/bin/env python3
"""Merge the per-participant CSV exports into one table (one row per run).

Each export from the result page is a two-column file (field,value).
This script collects every imoah_*.csv in a folder and writes one wide CSV
that opens directly in Excel / SPSS / R.

Usage:
    python3 tools/merge_results.py <folder-with-exports> [output.csv] [--include-demo]

Duplicate exports of the same run (same run_id) are counted once – the
latest export wins. Runs filled in demo mode (demo_run = 1) are left out
unless --include-demo is given.
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
    include_demo = "--include-demo" in sys.argv
    args = [a for a in sys.argv[1:] if a != "--include-demo"]
    if not args:
        sys.exit(__doc__)
    folder = Path(args[0])
    out = Path(args[1]) if len(args) > 1 else folder / "merged_results.csv"

    runs, columns, demo = {}, [], 0
    for path in sorted(folder.glob("imoah_*.csv")):
        try:
            data = read_export(path)
        except ValueError as e:
            print(f"skipped {path.name}: {e}")
            continue
        if data.get("demo_run") == "1" and not include_demo:
            demo += 1
            continue
        for k in data:
            if k not in columns:
                columns.append(k)
        key = data.get("run_id") or path.name
        prev = runs.get(key)
        if prev is None or data.get("exported_at", "") >= prev.get("exported_at", ""):
            runs[key] = data
        data["source_file"] = path.name

    if demo:
        print(f"left out {demo} demo export(s) (use --include-demo to keep them)")
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
