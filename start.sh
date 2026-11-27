#!/data/data/com.termux/files/usr/bin/bash

NOCOLOR='\033[0m'
RED='\033[0;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
CYAN='\033[1;36m'

# Esdeath-BOT necesita ffmpeg para convertir imágenes/videos a WebP.
# En Termux lo instala automáticamente si falta. En VPS/Linux solo avisa
# para no ejecutar apt con permisos que el usuario no haya autorizado.
if ! command -v ffmpeg >/dev/null 2>&1; then
  if [ -n "${PREFIX:-}" ] && command -v pkg >/dev/null 2>&1; then
    echo -e "${YELLOW}⚙️ ffmpeg no está instalado. Instalándolo en Termux...${NOCOLOR}"
    pkg install ffmpeg -y || {
      echo -e "${RED}❌ No pude instalar ffmpeg. Ejecuta: pkg install ffmpeg -y${NOCOLOR}"
      exit 1
    }
  else
    echo -e "${YELLOW}⚠️ ffmpeg no está instalado. Los stickers de imagen/video necesitan ffmpeg.${NOCOLOR}"
    echo "Instálalo con el gestor de paquetes de tu distribución y vuelve a iniciar Esdeath-BOT."
  fi
fi

export ESDEATH_SUPERVISOR=1
failures=0
while :
do
  echo -e "${RED}🩸 ESDEATH-BOT EN MODO AUTOMÁTICO${NOCOLOR}"
  node index.js
  code=$?
  # Reinicio gradual: evita ciclos rápidos cuando hay fallos persistentes.
  if [ "$code" -eq 0 ]; then
    failures=0
    wait_time=2
  else
    failures=$((failures + 1))
    wait_time=$((2 ** (failures > 5 ? 5 : failures)))
    [ "$wait_time" -gt 30 ] && wait_time=30
  fi
  echo -e "${CYAN}♻️ Esdeath-BOT se reiniciará en ${wait_time}s (código ${code})...${NOCOLOR}"
  sleep "$wait_time"
  clear 2>/dev/null || true
done
