#!/usr/bin/env python3
"""Check that the project-local skill bundles survived checkout intact."""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent / "skills"
required = {
    "ui-ux-pro-max": ["scripts/search.py", "scripts/validate_data.py", "data/styles.csv", "data/typography.csv", "data/ui-reasoning.csv"],
    "design-taste-frontend": ["scripts/draw.mjs", "scripts/inspect.mjs", "scripts/lib/cdp.mjs", "library/directions.json", "assets/base.css", "references/layout.md"],
    "motion-design": ["director/core-philosophy.md", "patterns/entrance-exit.md", "reference/timing-easing-tables.md"],
    "hairline-create": ["build.mjs", "validate.mjs", "look.mjs", "kernel.js", "bench.html", "examples/terrain.js"],
    "hairline-adopt": [],
    "impeccable": ["scripts/impeccable", "scripts/VERSION", "scripts/command-metadata.json", "reference/audit.md"],
    "playwright-cli": ["references/running-code.md", "references/session-management.md"],
    "cro": ["references/experiments.md", "references/form.md"],
    "copywriting": ["references/copy-frameworks.md", "references/ai-tells.md"],
    "awesome-design-reference": [
        "scripts/search.py",
        "scripts/show.py",
        "tests/test_tools.py",
        "references/CATALOG.md",
        "references/design-md/apple/DESIGN.md",
        "references/design-md/linear.app/DESIGN.md",
        "LICENSE",
        "NOTICE.md",
    ],
    "liquid-glass-js": ["references/UPSTREAM-README.md", "LICENSE", "NOTICE.md"],
    "react-three-fiber": ["references/UPSTREAM-README.md", "LICENSE", "NOTICE.md"],
    "shadergradient": ["references/UPSTREAM-README.md", "LICENSE-NOTICE.md", "NOTICE.md"],
    "liquid-logo": ["references/UPSTREAM-README.md", "LICENSE", "NOTICE.md"],
    "brainstorming": ["visual-companion.md", "scripts/server.cjs", "LICENSE"],
    "diagnosing-superpowers": ["references/context-safety.md", "templates/report.md", "LICENSE"],
    "dispatching-parallel-agents": ["LICENSE"],
    "executing-plans": ["scripts/task-start", "scripts/task-done", "LICENSE"],
    "finishing-a-development-branch": ["LICENSE"],
    "receiving-code-review": ["LICENSE"],
    "requesting-code-review": ["code-reviewer.md", "LICENSE"],
    "subagent-driven-development": ["scripts/task-brief", "references/preflight.md", "LICENSE"],
    "systematic-debugging": ["root-cause-tracing.md", "find-polluter.sh", "LICENSE"],
    "test-driven-development": ["writing-good-tests.md", "LICENSE"],
    "using-git-worktrees": ["LICENSE"],
    "using-superpowers": ["references/codex-tools.md", "LICENSE"],
    "verification-before-completion": ["LICENSE"],
    "writing-plans": ["LICENSE"],
    "writing-skills": ["render-graphs.js", "references/bulletproofing.md", "LICENSE"],
    "hallmark": ["LICENSE", "scripts/theme.mjs", "scripts/refcheck.mjs", "references/themes/README.md"],
    "diagram-design": ["LICENSE", "scripts/self_check.py", "assets/template.html", "references/style-guide.md"],
}
for name, paths in required.items():
    folder = root / name
    for relative in ["SKILL.md", *paths]:
        path = folder / relative
        assert path.is_file() and path.stat().st_size, f"Missing or empty: {path}"
    text = (folder / "SKILL.md").read_text()
    assert text.startswith("---\n"), f"Missing skill metadata: {name}"
    assert re.search(r"^name:\s*" + re.escape(name) + r"\s*$", text, re.M), f"Wrong skill name: {name}"
    files = [p for p in folder.rglob("*") if p.is_file() and "__pycache__" not in p.parts]
    for path in files:
        if path.suffix == ".json":
            json.loads(path.read_text())
    print(f"OK {name}: {len(files)} bundled files")
assert {p.name for p in root.iterdir() if p.is_dir()} == set(required), "Unexpected skill folder"
print("All thirty-one skill bundles are present. Runtime checks are separate.")
