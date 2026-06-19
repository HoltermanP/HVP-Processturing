#!/usr/bin/env bash
# Start een lokale webserver voor de HVP Procesturing-app en open de browser.
cd "$(dirname "$0")" || exit 1
PORT="${1:-8080}"
echo "HVP Procesturing draait op http://localhost:$PORT"
echo "Stoppen: Ctrl+C"
( sleep 1; (command -v open >/dev/null && open "http://localhost:$PORT") || true ) &
python3 -m http.server "$PORT"
