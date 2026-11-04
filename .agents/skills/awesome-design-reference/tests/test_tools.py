#!/usr/bin/env python3
"""Regression tests for the bundled reference discovery helpers."""

from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load_script(name: str):
    path = ROOT / "scripts" / f"{name}.py"
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(module)
    return module


search = load_script("search")


class SearchTests(unittest.TestCase):
    def test_library_contains_expected_collection(self):
        records = search.records()
        self.assertEqual(len(records), 84)
        slugs = {record["slug"] for record in records}
        self.assertTrue({"apple", "linear.app", "stripe", "wired"} <= slugs)

    def test_exact_brand_name_ranks_first(self):
        records = search.records()
        ranked = sorted(
            ((search.score(record, ["linear.app"])[0], record["slug"]) for record in records),
            reverse=True,
        )
        self.assertEqual(ranked[0][1], "linear.app")

    def test_quality_query_returns_matching_documents(self):
        records = search.records()
        query = search.terms("dark technical restrained")
        ranked = [search.score(record, query)[0] for record in records]
        self.assertGreater(max(ranked), 0)


if __name__ == "__main__":
    unittest.main()
