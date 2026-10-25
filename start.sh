#!/usr/bin/env bash

NOCOLOR='\033[0m'
RED='\033[0;31m'
CYAN='\033[1;36m'

cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo 'Falta Node.js.' >&2
  exit 1
fi

# Igual que Lite-MD: un único supervisor vuelve a iniciar Node cuando la
# conexión se cierra por una causa recuperable. No se usa set -e porque
# impediría ejecutar el ciclo de recuperación tras un error de Node.
if ! command -v ffmpeg >/dev/null 2>&1; then
  if [ -n "${PREFIX:-}" ] && command -v pkg >/dev/null 2>&1; then
    echo '⚙️ Instalando FFmpeg en Termux...'
    pkg install ffmpeg -y || exit 1
  else
    echo '⚠️ FFmpeg no está instalado; la conversión de stickers necesita FFmpeg.' >&2
  fi
fi

mkdir -p session data tmp
if [ ! -d node_modules ]; then npm install --no-audit --no-fund || exit 1; fi
export ESDEATH_SUPERVISOR=1
while :; do
  echo -e "${CYAN}❄️ ESDEATH-BOT EN MODO AUTOMÁTICO${NOCOLOR}"
  node index.js
  status=$?
  sleep 2
  clear 2>/dev/null || true
  echo -e "${RED}♻️ Esdeath-BOT se reiniciará (código ${status})...${NOCOLOR}"
done
