#!/usr/bin/env bash
#
# Idempotent setup for the AISTATS full-stack starter.
# Installs backend (Python venv) and frontend (npm) dependencies.
# Safe to run repeatedly.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Setting up backend (Python)"
cd "$ROOT_DIR/backend"

# Ensure the stdlib venv module is usable (Debian/Ubuntu split it into
# python3-venv). Best-effort: only attempt an install if venv is missing and
# sudo is available.
if ! python3 -c "import ensurepip, venv" >/dev/null 2>&1; then
  echo "   python3 venv/ensurepip missing; attempting to install python3-venv"
  PYVER="$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')"
  if command -v sudo >/dev/null 2>&1; then
    sudo apt-get update -qq && sudo apt-get install -y "python3-venv" "python${PYVER}-venv" || true
  fi
fi

if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
. .venv/bin/activate
python -m pip install --upgrade pip >/dev/null
pip install -r requirements.txt
deactivate

echo "==> Setting up frontend (Node)"
cd "$ROOT_DIR/frontend"
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "==> Install complete."
