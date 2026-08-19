#!/usr/bin/env bash
set -euo pipefail

STATE="docs/00_Estado/ESTADO_PROYECTO.md"
NOW="$(date -u '+%Y-%m-%d %H:%M UTC')"
COMMIT="$(git rev-parse --short HEAD)"
BRANCH="$(git branch --show-current || true)"
[ -n "$BRANCH" ] || BRANCH="main"

RECENT="$(git log -5 --date=iso --pretty=format:'- %h — %ad — %s' --date-order)"
FILES="$(git ls-files | wc -l | tr -d ' ')"

python3 - "$STATE" "$NOW" "$COMMIT" "$BRANCH" "$FILES" "$RECENT" <<'PY'
import pathlib, sys
path, now, commit, branch, files, recent = sys.argv[1:]
p = pathlib.Path(path)
text = p.read_text(encoding='utf-8')
start = text.index('## Última generación')
end = text.index('\n## 1. Estado ejecutivo')
block = f'''## Última generación\n\n- Generado automáticamente: `{now}`\n- Commit observado: `{commit}`\n- Rama: `{branch}`\n- Archivos versionados: `{files}`\n- Últimos commits:\n{recent}\n'''
p.write_text(text[:start] + block + text[end:], encoding='utf-8')
PY
