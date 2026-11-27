'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { pipeline } = require('stream/promises');
const { prepareWAMessageMedia, generateWAMessageFromContent, proto, downloadContentFromMessage } = require('baileys');
const webpMux = require('node-webpmux');

const AUDIO_MIMETYPE = 'audio/ogg; codecs=opus';
const STICKER_AUDIO_FIELD = 26;
const STICKER_AUDIO_TAG = (STICKER_AUDIO_FIELD << 3) | 2;
const PATCHED = Symbol.for('esdeath.sound-sticker.encode-patched');
const pendingAudio = new Map();

// Cola única: evita que dos conversiones pesadas compitan por la RAM del servidor.
const cola = [];
let procesando = false;

function keyOf(hash) {
  return Buffer.from(hash).toString('base64');
}

function instalarParcheAudio() {
  const StickerMessage = proto?.Message?.StickerMessage;
  if (!StickerMessage?.encode || StickerMessage.encode[PATCHED]) return;
  const originalEncode = StickerMessage.encode;
  const patchedEncode = function (message, writer) {
    const result = originalEncode.call(this, message, writer);
    if (message?.fileSha256) {
      const audio = pendingAudio.get(keyOf(message.fileSha256));
      if (audio) result.uint32(STICKER_AUDIO_TAG).bytes(audio);
    }
    return result;
  };
  patchedEncode[PATCHED] = true;
  StickerMessage.encode = patchedEncode;
}

function ejecutarFFmpeg(args, { bin = 'ffmpeg', timeoutMs = 90000 } = {}) {
  return new Promise((resolve, reject) => {
    // Un hilo por etapa y filtros limitados: reduce los picos de RAM/CPU.
    const child = spawn(bin, [
      '-hide_banner', '-loglevel', 'error', '-nostdin', '-y',
      '-threads', '1', '-filter_threads', '1', '-filter_complex_threads', '1',
      ...args
    ], { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    let settled = false;
    const finish = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      error ? reject(error) : resolve();
    };
    const timer = setTimeout(() => {
      try { child.kill('SIGKILL'); } catch {}
      finish(new Error('La conversión tardó demasiado y fue cancelada.'));
    }, timeoutMs);
    child.stderr.on('data', chunk => {
      if (stderr.length < 12000) stderr += chunk.toString();
    });
    child.on('error', error => finish(new Error(`No se pudo iniciar FFmpeg: ${error.message}`)));
    child.on('close', code => {
      if (code === 0) finish();
      else finish(new Error(`FFmpeg no pudo procesar el vídeo: ${stderr.trim().slice(-500) || `código ${code}`}`));
    });
  });
}

function leerVarint(buffer, state) {
  let value = 0n;
  let shift = 0n;
  while (state.offset < buffer.length) {
    const byte = buffer[state.offset++];
    value |= BigInt(byte & 0x7f) << shift;
    if (!(byte & 0x80)) return Number(value);
    shift += 7n;
    if (shift > 63n) throw new Error('Protobuf inválido: varint demasiado largo.');
  }
  throw new Error('Protobuf inválido: varint incompleto.');
}

function encontrarCampoBytes(buffer, numeroCampo) {
  const state = { offset: 0 };
  while (state.offset < buffer.length) {
    const tag = leerVarint(buffer, state);
    const field = tag >>> 3;
    const wire = tag & 7;
    if (wire === 0) leerVarint(buffer, state);
    else if (wire === 1) state.offset += 8;
    else if (wire === 2) {
      const length = leerVarint(buffer, state);
      const start = state.offset;
      state.offset += length;
      if (state.offset > buffer.length) throw new Error('Protobuf inválido: longitud fuera del mensaje.');
      if (field === numeroCampo) return buffer.subarray(start, state.offset);
    } else if (wire === 5) state.offset += 4;
    else throw new Error(`Protobuf inválido: tipo de campo ${wire}.`);
    if (state.offset > buffer.length) throw new Error('Protobuf inválido: campo truncado.');
  }
  return null;
}

function calcularWaveform(pcm, barras = 64) {
  const muestras = Math.floor(pcm.length / 2);
  const niveles = new Array(barras).fill(0);
  if (!muestras) return Uint8Array.from(niveles);
  for (let barra = 0; barra < barras; barra++) {
    const desde = Math.floor(barra * muestras / barras);
    const hasta = Math.max(desde + 1, Math.floor((barra + 1) * muestras / barras));
    let suma = 0;
    for (let i = desde; i < Math.min(hasta, muestras); i++) suma += Math.abs(pcm.readInt16LE(i * 2));
    niveles[barra] = suma / Math.max(1, Math.min(hasta, muestras) - desde);
  }
  const pico = Math.max(...niveles) || 1;
  return Uint8Array.from(niveles.map(valor => Math.round(valor / pico * 100)));
}

async function aplicarMetadatosSticker(stickerPath, { packname, author, categories } = {}) {
  if (!packname && !author) return;
  const salida = `${stickerPath}.exif.webp`;
  const imagen = new webpMux.Image();
  const json = {
    'sticker-pack-id': 'Esdeath-BOT',
    'sticker-pack-name': packname || '',
    'sticker-pack-publisher': author || '',
    emojis: Array.isArray(categories) ? categories : ['']
  };
  const exifHeader = Buffer.from([
    0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x16, 0x00, 0x00, 0x00
  ]);
  const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
  const exif = Buffer.concat([exifHeader, jsonBuffer]);
  exif.writeUIntLE(jsonBuffer.length, 14, 4);
  await imagen.load(stickerPath);
  imagen.exif = exif;
  await imagen.save(salida);
  fs.renameSync(salida, stickerPath);
}

async function descargarVideoADisco(videoMessage, destino) {
  const stream = await downloadContentFromMessage(videoMessage, 'video');
  await pipeline(stream, fs.createWriteStream(destino, { flags: 'wx' }));
  const stat = fs.statSync(destino);
  if (!stat.size) throw new Error('No se pudo descargar el vídeo.');
  // Límite preventivo para no aceptar archivos enormes en un servidor pequeño.
  if (stat.size > 80 * 1024 * 1024) throw new Error('El vídeo supera el límite de 80 MB para proteger el servidor.');
}

async function crearStickerConSonido(sock, chatJid, videoMessage, { quoted, seconds = 10, packname, author, categories } = {}) {
  instalarParcheAudio();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'esdeath-s2-'));
  const input = path.join(dir, 'entrada.mp4');
  const ogg = path.join(dir, 'audio.ogg');
  const waveformFile = path.join(dir, 'waveform.pcm');
  const webp = path.join(dir, 'sticker.webp');

  try {
    // El vídeo se descarga directamente a disco; nunca se concatena en RAM.
    await descargarVideoADisco(videoMessage, input);
    const duracion = Math.max(1, Math.min(10, Number(seconds) || 10));

    // Una sola conversión de audio, sin WAV/PCM intermedio ni lectura completa del audio.
    await ejecutarFFmpeg([
      '-i', input,
      '-map', '0:a:0', '-vn', '-af', `aresample=48000:first_pts=0,apad=whole_dur=${duracion}`,
      '-t', String(duracion), '-ac', '1', '-ar', '48000',
      '-c:a', 'libopus', '-application', 'voip', '-b:a', '48k',
      '-vbr', 'on', '-frame_duration', '20', '-map_metadata', '-1', '-f', 'ogg', ogg,
      '-map', '0:a:0', '-vn', '-t', String(duracion), '-ac', '1', '-ar', '8000',
      '-f', 's16le', waveformFile
    ]);

    // Compresión progresiva: prioriza calidad y solo baja FPS/calidad si hace falta.
    // El límite se comprueba DESPUÉS de incorporar EXIF para contar el archivo final real.
    // La duración no se recorta entre intentos: todos usan el mismo tiempo solicitado.
    const LIMITE_STICKER = 500 * 1024;
    const perfiles = [
      { fps: 12, calidad: 55 },
      { fps: 12, calidad: 48 },
      { fps: 10, calidad: 44 },
      { fps: 10, calidad: 38 },
      { fps: 8, calidad: 34 },
      { fps: 7, calidad: 30 },
      { fps: 6, calidad: 26 },
      { fps: 5, calidad: 22 }
    ];
    let stickerStat = null;
    let perfilElegido = null;

    for (const perfil of perfiles) {
      try { fs.rmSync(webp, { force: true }); } catch {}
      const filtro = `scale=320:320:flags=lanczos,fps=${perfil.fps},pad=0:0:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse`;
      await ejecutarFFmpeg([
        '-i', input, '-t', String(duracion), '-an',
        '-vf', filtro,
        '-loop', '0', '-c:v', 'libwebp', '-lossless', '0', '-q:v', String(perfil.calidad), '-preset', 'picture',
        '-threads', '1', webp
      ]);

      const generado = fs.statSync(webp);
      if (generado.size < 1024) throw new Error('FFmpeg generó un sticker vacío o incompleto.');
      await aplicarMetadatosSticker(webp, { packname, author, categories });
      stickerStat = fs.statSync(webp);
      if (stickerStat.size <= LIMITE_STICKER) {
        perfilElegido = perfil;
        break;
      }
    }

    const audioStat = fs.statSync(ogg);
    if (audioStat.size < 1024 || !stickerStat || stickerStat.size < 1024) {
      throw new Error('No se generaron correctamente los archivos multimedia.');
    }
    if (stickerStat.size > LIMITE_STICKER) {
      throw new Error('Este vídeo no pudo reducirse a 500 KB manteniendo los 10 segundos. Prueba con otro vídeo.');
    }
    console.log(`[S2] Sticker listo: ${stickerStat.size} bytes; ${perfilElegido.fps} FPS; calidad ${perfilElegido.calidad}.`);

    // Los únicos búferes en RAM son los dos archivos finales, ya pequeños y acotados.
    const audioBuffer = fs.readFileSync(ogg);
    const stickerBuffer = fs.readFileSync(webp);
    const uploadOptions = { upload: sock.waUploadToServer };
    const uploadedAudio = await prepareWAMessageMedia({
      audio: audioBuffer, mimetype: AUDIO_MIMETYPE, seconds: duracion, ptt: true
    }, uploadOptions);
    const uploadedSticker = await prepareWAMessageMedia({
      sticker: stickerBuffer, mimetype: 'image/webp', isAnimated: true
    }, uploadOptions);
    audioBuffer.fill(0);
    stickerBuffer.fill(0);

    const waveform = calcularWaveform(fs.readFileSync(waveformFile));
    const audio = uploadedAudio.audioMessage;
    const audioBytes = proto.Message.AudioMessage.encode(proto.Message.AudioMessage.create({
      url: audio.url,
      mimetype: AUDIO_MIMETYPE,
      fileSha256: audio.fileSha256,
      fileLength: audio.fileLength,
      seconds: duracion,
      ptt: true,
      mediaKey: audio.mediaKey,
      fileEncSha256: audio.fileEncSha256,
      directPath: audio.directPath,
      mediaKeyTimestamp: audio.mediaKeyTimestamp || Math.floor(Date.now() / 1000),
      waveform
    })).finish();

    const sticker = uploadedSticker.stickerMessage;
    sticker.isAnimated = true;
    sticker.width = 320;
    sticker.height = 320;
    const hashKey = keyOf(sticker.fileSha256);
    pendingAudio.set(hashKey, audioBytes);
    try {
      const own = sock.user || sock.authState?.creds?.me || {};
      const userJid = chatJid.endsWith('@lid') && own.lid ? own.lid : (own.id || sock.user?.id);
      const message = generateWAMessageFromContent(chatJid, { stickerMessage: sticker }, { quoted, userJid });
      const encoded = Buffer.from(proto.Message.encode(message.message).finish());
      const stickerBytes = encontrarCampoBytes(encoded, 26);
      const embeddedAudio = stickerBytes && encontrarCampoBytes(stickerBytes, STICKER_AUDIO_FIELD);
      if (!embeddedAudio || !embeddedAudio.length) throw new Error('No se pudo integrar el audio dentro del mensaje del sticker.');
      await sock.relayMessage(chatJid, message.message, { messageId: message.key.id });
    } finally {
      pendingAudio.delete(hashKey);
    }
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
  }
}

async function ejecutarCola() {
  if (procesando) return;
  procesando = true;
  try {
    while (cola.length) {
      const trabajo = cola.shift();
      try {
        await crearStickerConSonido(trabajo.sock, trabajo.chatJid, trabajo.videoMessage, trabajo.options);
        trabajo.resolve();
      } catch (error) {
        trabajo.reject(error);
      }
      // Pequeño respiro entre trabajos, sin introducir esperas largas.
      if (cola.length) await new Promise(resolve => setTimeout(resolve, 250));
    }
  } finally {
    procesando = false;
    if (cola.length) void ejecutarCola();
  }
}

function encolarStickerConSonido(sock, chatJid, videoMessage, options = {}) {
  return new Promise((resolve, reject) => {
    cola.push({ sock, chatJid, videoMessage, options, resolve, reject });
    void ejecutarCola();
  });
}

function obtenerEstadoCola() {
  return { enEspera: cola.length, procesando };
}

module.exports = { encolarStickerConSonido, obtenerEstadoCola, instalarParcheAudio };
