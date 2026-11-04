#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="${DSH_HOME:-$HOME/.dsh}/skills"
mkdir -p "$DEST"

for src in "$ROOT"/skills/*/; do
  name="$(basename "$src")"
  target="$DEST/$name"
  mkdir -p "$target"
  rsync -a --delete "$src/" "$target/"
  echo "synced $name -> $target"
done
