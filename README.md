<h1 align="center">❄️ Esdeath-BOT</h1>

<p align="center"><b>Bot de WhatsApp para administración y protección de grupos, con herramientas de stickers.</b></p>

<p align="center"><img src="https://i.postimg.cc/W3QZX2Gt/IMG-20261024-WA0147.jpg" width="260" alt="Esdeath-BOT" /></p>

## ❄️ Características
- Administración de grupos: expulsiones, promoción, degradación, mute y advertencias.
- Protección: AntiLink, AntiSpam, AntiFalsos y control de bienvenida.
- Herramientas de stickers: crear desde imágenes y vídeos cortos, y convertir stickers a imágenes.
- Identificación automática de administradores mediante los identificadores de WhatsApp (LID y número telefónico), sin registro manual.
- Funcionamiento exclusivo en grupos: los mensajes privados se ignoran silenciosamente.
- Stickers de imagen y vídeo en lienzo cuadrado de 320 × 320, estirando la imagen para no recortar contenido.
- Comandos con o sin prefijo.
- Identidad visual inspirada en hielo; creador: **Hikaru**.

## 🖼️ Imágenes del proyecto
- https://i.postimg.cc/W3QZX2Gt/IMG-20261024-WA0147.jpg
- https://i.postimg.cc/Bvb138pw/038b18063cb2d3beef0da5acc4765177.jpg
- https://i.postimg.cc/MGLfpWrb/e5fa8e6922178fe9367dfaa32e814a53.jpg
- https://i.postimg.cc/15KgN0jZ/e4d824ad41c4339de6c16d1bcc7d499c.jpg

## 📱 Instalación en Termux
Instala Node.js y FFmpeg y luego ejecuta:

```bash
pkg update -y && pkg upgrade -y && pkg install git nodejs-lts ffmpeg -y && termux-setup-storage
```

Para instalar desde el repositorio oficial del proyecto:

```bash
pkg update -y && pkg upgrade -y && pkg install git nodejs-lts ffmpeg -y && termux-setup-storage && git clone https://github.com/GabrielVB26/Esdeath-BOT.git && cd Esdeath-BOT && npm install && npm start
```

Para actualizar las dependencias dentro de los rangos compatibles definidos por el proyecto:

```bash
npm run update:deps
```

## ⚠️ Notas
- Se requiere FFmpeg para la conversión y creación de stickers.
- La primera conexión solicita vincular el dispositivo con WhatsApp.
- La actualización elimina dependencias redundantes que duplicaban módulos nativos de Node.js. La actualización de versiones desde el registro npm debe ejecutarse con conexión a Internet mediante `npm run update:deps`.
- Esta entrega fue revisada estáticamente; la conexión real con WhatsApp debe probarse desde tu dispositivo.

## 📜 Licencia
Se conserva el archivo de licencia incluido en el proyecto base.
