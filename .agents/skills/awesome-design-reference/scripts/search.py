#!/usr/bin/env python3
"""Search bundled DESIGN.md references using deterministic lexical scoring."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIBRARY = ROOT / "references" / "design-md"
WORD = re.compile(r"[a-z0-9][a-z0-9.+-]*")


def terms(value: str) -> list[str]:
    return [term for term in WORD.findall(value.lower()) if len(term) > 1]


def metadata(text: str) -> tuple[str, str]:
    name = re.search(r"^name:\s*[\"']?(.+?)[\"']?\s*$", text, re.M)
    description = re.search(
        r"^description:\s*(?:[>|]-?\s*)?[\"']?(.+?)[\"']?\s*$", text, re.M
    )
    return (
        name.group(1) if name else "",
        description.group(1) if description else "",
    )


def records() -> list[dict[str, object]]:
    found = []
    for path in sorted(LIBRARY.glob("*/DESIGN.md")):
        text = path.read_text(encoding="utf-8", errors="replace")
        name, description = metadata(text)
        found.append(
            {
                "slug": path.parent.name,
                "name": name or path.parent.name,
                "description": description,
                "path": str(path),
                "text": text,
            }
        )
    return found


def score(record: dict[str, object], query: list[str]) -> tuple[float, list[str]]:
    slug = str(record["slug"]).lower()
    name = str(record["name"]).lower()
    description = str(record["description"]).lower()
    text = str(record["text"]).lower()
    total = 0.0
    matched = []
    for term in query:
        term_score = 0.0
        if term == slug or term in name:
            term_score += 18
        if term in description:
            term_score += 8 + min(description.count(term), 3)
        count = min(text.count(term), 18)
        term_score += count * 0.7
        if term_score:
            matched.append(term)
            total += term_score
    if query and len(matched) == len(query):
        total += 10
    phrase = " ".join(query)
    if phrase and phrase in text:
        total += 12
    return total, matched


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("query", nargs="?", help="Design qualities or a reference name")
    parser.add_argument("--top", type=int, default=6, help="Maximum matches (default: 6)")
    parser.add_argument("--list", action="store_true", help="List all reference slugs")
    parser.add_argument("--json", action="store_true", help="Emit JSON")
    args = parser.parse_args()

    library = records()
    if args.list:
        if args.json:
            print(json.dumps([record["slug"] for record in library], indent=2))
        else:
            print("\n".join(str(record["slug"]) for record in library))
        return
    if not args.query:
        parser.error("provide a query or use --list")

    query = terms(args.query)
    ranked = []
    for record in library:
        value, matched = score(record, query)
        if value:
            ranked.append((value, matched, record))
    ranked.sort(key=lambda item: (-item[0], str(item[2]["slug"])))
    ranked = ranked[: max(1, args.top)]

    output = [
        {
            "slug": record["slug"],
            "name": record["name"],
            "score": round(value, 1),
            "matched": matched,
            "description": record["description"],
            "path": record["path"],
        }
        for value, matched, record in ranked
    ]
    if args.json:
        print(json.dumps(output, indent=2))
        return
    if not output:
        print("No matches. Try broader qualities or use --list.")
        return
    for index, item in enumerate(output, 1):
        print(f"{index}. {item['slug']} — score {item['score']}")
        if item["description"]:
            print(f"   {item['description']}")
        print(f"   matched: {', '.join(item['matched'])}")
        print(f"   {item['path']}")


if __name__ == "__main__":
    main()
