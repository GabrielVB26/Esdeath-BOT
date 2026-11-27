<h1 align="center">❄️ Esdeath-BOT</h1>

<p align="center"><b>Bot de WhatsApp para administración y protección de grupos, con herramientas de stickers.</b></p>

<p align="center"><img src="https://i.postimg.cc/W3QZX2Gt/IMG-20261024-WA0147.jpg" width="260" alt="Esdeath-BOT" /></p>

## ❄️ Características
- Administración de grupos: expulsiones, promoción, degradación, mute y advertencias.
- Protección: AntiLink, AntiSpam, AntiFalsos y control de bienvenida.
- Herramientas de stickers: crear desde imágenes y vídeos cortos, y convertir stickers a imágenes.

## 📲 Instalar o actualizar Esdeath-BOT en Termux

Copia y pega **este único comando completo** en Termux:

```bash
cd ~ && termux-wake-lock && pkg update -y && pkg upgrade -y && pkg install -y git nodejs-lts ffmpeg && rm -rf ~/Esdeath-BOT && git clone [https://github.com/GabrielVB26/Esdeath-BOT.git](https://github.com/GabrielVB26/Esdeath-BOT.git) ~/Esdeath-BOT && cd ~/Esdeath-BOT && npm install --yes --no-audit --no-fund && node index.js
```

Cuando Esdeath-BOT lo solicite, introduce tu número de WhatsApp con el código de país y sigue las indicaciones de vinculación.

### 🔋 Evitar que Android cierre o apague Termux

1. **Mantener Termux despierto:** El comando ya incluye `termux-wake-lock` para evitar que el sistema suspenda el proceso. Si alguna vez lo necesitas por separado, usa `termux-wake-lock` (y `termux-wake-unlock` para desactivarlo).
 
2. **Sin restricciones de batería:** Entra en **Info de la app** de Termux (**Ajustes > Aplicaciones > Termux > Batería**) y ponlo en **Sin restricciones** (o *Sin optimización*) para que Android no mate el proceso en segundo plano.

### 🔄 ¿Qué hacer si el bot se apaga o se detiene?

Si el bot se cierra, se apaga o reinicias el teléfono, **no hace falta volver a instalarlo**. Abre Termux y ejecuta este comando para encenderlo de nuevo:

```bash
termux-wake-lock && cd ~/Esdeath-BOT && node index.js
```

Como la sesión ya quedó guardada, el bot se conectará automáticamente sin pedir tu número otra vez.

## 📜 Licencia
Se conserva el archivo de licencia correspondiente a este proyecto.

## HECHO EN VENEZUELA 🇻🇪
