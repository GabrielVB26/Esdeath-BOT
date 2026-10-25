<div align="center">

<img src="https://i.postimg.cc/Bvb138pw/038b18063cb2d3beef0da5acc4765177.jpg" alt="Esdeath" width="420">

# Esdeath-BOT

**Creador: Hikaru**

</div>

### Funciones
- Administración de grupos: expulsar, promover, degradar, borrar mensajes, etiquetar, abrir/cerrar y editar información.
- Bienvenida, antienlaces y antispam por grupo.
- Crear stickers desde imágenes y vídeos cortos.
- Convertir stickers a imágenes y personalizar sus metadatos.

### Instalar en Termux
Copia y pega el comando completo. Introduce tu número con código de país cuando lo solicite y luego escribe en WhatsApp el código que aparecerá en Termux.

```bash
pkg update -y && pkg upgrade -y && pkg install -y git nodejs-lts ffmpeg && cd "$HOME" && if [ -d Esdeath-BOT/.git ]; then cd Esdeath-BOT && git pull --ff-only; else git clone https://github.com/GabrielVB26/Esdeath-BOT.git && cd Esdeath-BOT; fi && npm install --no-audit --no-fund && mkdir -p session data && npm start
```

### Comandos
`.menu` · `.ping` · `.kick @usuario` · `.promote @usuario` · `.demote @usuario` · `.del` · `.tagall` · `.hidetag texto` · `.admins` · `.abrir` · `.cerrar` · `.setname texto` · `.setdesc texto` · `.welcome on/off` · `.antilink on/off` · `.antispam on/off` · `.sticker` · `.s` · `.toimg` · `.setpack nombre | autor`

Los comandos de administración requieren permisos de administrador del grupo. El bot debe ser administrador para expulsar, gestionar enlaces o cambiar la configuración del grupo.
