#!/usr/bin/env bash
# Link this skill into ~/.claude/skills so it loads in every project on the
# machine. Idempotent, and it refuses to clobber a real directory sitting in
# the way rather than silently replacing somebody's work.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="${HOME}/.claude/skills/foundry"

if [ -L "$DEST" ]; then
  ln -sfn "$REPO" "$DEST"
  echo "relinked  $DEST"
elif [ -e "$DEST" ]; then
  echo "SKIP      $DEST is a real file or directory. Move it aside and re-run." >&2
  exit 1
else
  mkdir -p "$(dirname "$DEST")"
  ln -s "$REPO" "$DEST"
  echo "linked    $DEST"
fi

echo
echo "Open a new Claude Code session and ask for the house style, or ask to"
echo "revamp an existing site into it."
echo "Reference render: $REPO/example/index.html"
echo "Validate a palette change: python3 $REPO/tools/contrast.py"
