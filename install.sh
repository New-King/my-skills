#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="${DSH_HOME:-$HOME/.dsh}/skills"
mkdir -p "$DEST"

for src in "$ROOT"/skills/*/; do
  name="$(basename "$src")"
  target="$DEST/$name"
  if [ -e "$target" ] && [ ! -L "$target" ]; then
    echo "skip $name: $target exists and is not a symlink"
    continue
  fi
  ln -sfn "$src" "$target"
  echo "linked $name -> $target"
done
