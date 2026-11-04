#!/usr/bin/env python3
"""Locate or summarize one bundled DESIGN.md reference."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIBRARY = ROOT / "references" / "design-md"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slug", help="Reference slug, for example linear.app")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--path", action="store_true", help="Print only the file path")
    mode.add_argument("--summary", action="store_true", help="Print name and description")
    args = parser.parse_args()
    path = LIBRARY / args.slug / "DESIGN.md"
    if not path.is_file():
        choices = [p.parent.name for p in LIBRARY.glob("*/DESIGN.md")]
        close = [choice for choice in choices if args.slug.lower() in choice.lower()]
        parser.error(
            f"unknown reference: {args.slug}"
            + (f"; possible matches: {', '.join(close)}" if close else "")
        )
    if args.path:
        print(path)
        return
    text = path.read_text(encoding="utf-8", errors="replace")
    if args.summary:
        name = re.search(r"^name:\s*[\"']?(.+?)[\"']?\s*$", text, re.M)
        description = re.search(
            r"^description:\s*(?:[>|]-?\s*)?[\"']?(.+?)[\"']?\s*$", text, re.M
        )
        print(name.group(1) if name else args.slug)
        print(description.group(1) if description else "No description found.")
        print(path)
        return
    print(text, end="" if text.endswith("\n") else "\n")


if __name__ == "__main__":
    main()
