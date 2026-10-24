#!/usr/bin/env bash
# Reproduce dependencies without reinstalling or replacing the vendored skills.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
node --version
npm --version
python3 --version
python3 .agents/verify-skills.py
npm ci --ignore-scripts --no-fund
. .agents/activate.sh
.agents/skills/impeccable/scripts/impeccable engine-probe
python3 .agents/skills/ui-ux-pro-max/scripts/validate_data.py
test -x "$CHROME_PATH"
echo "System Chromium is available for Playwright CLI and Taste."
echo "Hairline's automatic screenshot helper also needs Playwright-managed Chromium."
