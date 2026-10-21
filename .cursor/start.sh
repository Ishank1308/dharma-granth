#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

PORT="${PORT:-3000}"
TMUX_SOCKET="${TMUX_SOCKET:-/exec-daemon/tmux.portal.conf}"

if tmux -f "$TMUX_SOCKET" has-session -t next_dev 2>/dev/null; then
  exit 0
fi

tmux -f "$TMUX_SOCKET" new-session -d -s next_dev -c "$(pwd)" -- \
  bash -lc "exec npm run dev -- --hostname 0.0.0.0 --port ${PORT}"

for _ in $(seq 1 120); do
  if curl -sf -o /dev/null "http://127.0.0.1:${PORT}/"; then
    exit 0
  fi
  sleep 1
done

echo "next dev did not become ready on port ${PORT}" >&2
exit 1
