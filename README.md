<h1 align="center">❄️ Esdeath-BOT</h1>

<p align="center"><b>Bot de WhatsApp para administración y protección de grupos, con herramientas de stickers.</b></p>

<p align="center"><img src="https://i.postimg.cc/W3QZX2Gt/IMG-20261024-WA0147.jpg" width="260" alt="Esdeath-BOT" /></p>

## ❄️ Características

- Administración de grupos.
- Protección AntiLink, AntiSpam y AntiFalsos.
- Advertencias, mute y expulsiones.
- Creación de stickers desde imágenes y vídeos.

## 📲 Instalación en Termux

### 1. Descargar Termux

Si no tienes Termux, puedes descargarlo aquí:

- **Google Play Store:** https://play.google.com/store/apps/details?id=com.termux
- **F-Droid:** https://f-droid.org/packages/com.termux/
- **GitHub:** https://github.com/termux/termux-app

### 2. Instalar Esdeath-BOT

Abre Termux, copia y pega este único comando:

    cd ~ && termux-wake-lock && pkg update -y && pkg upgrade -y && pkg install -y git nodejs-lts ffmpeg termux-tools && rm -rf ~/Esdeath-BOT && git clone https://github.com/GabrielVB26/Esdeath-BOT.git ~/Esdeath-BOT && cd ~/Esdeath-BOT && npm install --yes --no-audit --no-fund && node index.js

Cuando se solicite, introduce tu número de WhatsApp con el código del país y completa la vinculación.

**Importante:** La instalación elimina la carpeta anterior de Esdeath-BOT. Tendrás que vincular WhatsApp nuevamente.

## 🔋 Mantener
