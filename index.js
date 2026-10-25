// Esdeath-BOT — administración de grupos y stickers. Creador: Hikaru.
// Flujo de conexión y vinculación basado en la implementación de referencia.
const {
  default: makeWASocket,
  DisconnectReason,
  delay,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  downloadContentFromMessage
} = require('baileys');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const readline = require('readline');
const pino = require('pino');
const cfonts = require('cfonts');
const chalk = require('chalk');
const NodeCache = require('node-cache');
const ffmpeg = require('fluent-ffmpeg');
const webp = require('node-webpmux');
const { Boom } = require('@hapi/boom');

const PREFIX = '.';
const SESSION_DIR = './session';
const DATA_DIR = './data';
const CONFIG_PATH = path.join(DATA_DIR, 'groups.json');
const SPAM_WINDOW_MS = 6000;
const SPAM_LIMIT = 8;
const spamState = new Map();
fs.mkdirSync(SESSION_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync('./tmp', { recursive: true });

function loadConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); }
  catch { return { groups: {}, sticker: { packname: 'Esdeath-BOT', author: 'Hikaru' } }; }
}
let config = loadConfig();
function saveConfig() { fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2)); }
function groupConfig(jid) {
  config.groups ||= {};
  config.groups[jid] ||= { welcome: false, antilink: false, antispam: false };
  return config.groups[jid];
}
function ask(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => { rl.close(); resolve(answer); });
  });
}
function unwrapMessage(message) {
  let m = message;
  while (m?.ephemeralMessage || m?.viewOnceMessage || m?.viewOnceMessageV2 || m?.documentWithCaptionMessage) {
    m = m.ephemeralMessage?.message || m.viewOnceMessage?.message || m.viewOnceMessageV2?.message || m.documentWithCaptionMessage?.message;
  }
  return m || {};
}
function messageText(m) {
  return m.conversation || m.extendedTextMessage?.text || m.imageMessage?.caption || m.videoMessage?.caption || m.documentMessage?.caption || m.buttonsResponseMessage?.selectedButtonId || m.listResponseMessage?.singleSelectReply?.selectedRowId || '';
}
function getContext(m) { return m.extendedTextMessage?.contextInfo || m.imageMessage?.contextInfo || m.videoMessage?.contextInfo || {}; }
function getTarget(msg, mentions, context) {
  return mentions?.[0] || context?.participant || null;
}
function jidNumber(jid='') { return String(jid).split('@')[0].split(':')[0]; }
function isAdmin(metadata, jid) {
  const norm = String(jid || '').split(':')[0];
  return (metadata?.participants || []).some(p => [p.id, p.lid].filter(Boolean).some(x => String(x).split(':')[0] === norm) && (p.admin === 'admin' || p.admin === 'superadmin'));
}
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}
async function downloadMedia(message, kind) {
  const stream = await downloadContentFromMessage(message, kind);
  return streamToBuffer(stream);
}
function tempPath(ext) { return path.join(os.tmpdir(), `esdeath-${crypto.randomBytes(8).toString('hex')}.${ext}`); }
async function convertToWebp(input, output, video=false) {
  await new Promise((resolve, reject) => {
    let command = ffmpeg(input).outputOptions([
      '-vcodec libwebp',
      '-vf scale= min(320\\,iw):min(320\\,ih):force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0',
      '-loop 0', '-an', '-vsync 0'
    ]);
    if (video) command = command.outputOptions(['-t 00:00:06']);
    command.toFormat('webp').on('end', resolve).on('error', reject).save(output);
  });
}
async function addExif(input, output, packname, author) {
  const img = new webp.Image();
  await img.load(input);
  const json = { 'sticker-pack-id': 'Esdeath-BOT', 'sticker-pack-name': packname || 'Esdeath-BOT', 'sticker-pack-publisher': author || 'Hikaru', emojis: ['❄️'] };
  const jsonBuffer = Buffer.from(JSON.stringify(json));
  const header = Buffer.from([0x49,0x49,0x2a,0x00,0x08,0x00,0x00,0x00,0x01,0x00,0x41,0x57,0x07,0x00,0x00,0x00,0x00,0x00,0x16,0x00,0x00,0x00]);
  const exif = Buffer.concat([header, jsonBuffer]);
  exif.writeUIntLE(jsonBuffer.length, 14, 4);
  img.exif = exif;
  await img.save(output);
}
async function createSticker(sock, jid, mediaMessage, mediaType, quoted) {
  let input, raw, converted, output;
  try {
    raw = await downloadMedia(mediaMessage, mediaType);
    const video = mediaType === 'video';
    input = tempPath(video ? 'mp4' : 'jpg');
    converted = tempPath('webp');
    output = tempPath('webp');
    fs.writeFileSync(input, raw);
    if (video && raw.length > 16 * 1024 * 1024) throw new Error('El vídeo es demasiado grande. Prueba con uno más corto y ligero.');
    await convertToWebp(input, converted, video);
    await addExif(converted, output, config.sticker?.packname, config.sticker?.author);
    await sock.sendMessage(jid, { sticker: fs.readFileSync(output) }, { quoted });
  } finally {
    for (const file of [input, converted, output]) if (file) { try { fs.unlinkSync(file); } catch {} }
  }
}
async function stickerToImage(sock, jid, mediaMessage, quoted) {
  const raw = await downloadMedia(mediaMessage, 'sticker');
  const input = tempPath('webp'); const output = tempPath('png');
  try {
    fs.writeFileSync(input, raw);
    await new Promise((resolve, reject) => ffmpeg(input).outputOptions(['-frames:v 1']).toFormat('png').on('end', resolve).on('error', reject).save(output));
    await sock.sendMessage(jid, { image: fs.readFileSync(output), caption: '❄️ Sticker convertido a imagen.' }, { quoted });
  } finally { for (const f of [input, output]) { try { fs.unlinkSync(f); } catch {} } }
}
function getMedia(m) {
  if (m.imageMessage) return { message: m.imageMessage, type: 'image' };
  if (m.videoMessage) return { message: m.videoMessage, type: 'video' };
  if (m.stickerMessage) return { message: m.stickerMessage, type: 'sticker' };
  return null;
}
function showBanner() {
  console.clear();
  // Portada compacta y adaptable: evita que el título se deforme o se parta
  // en consolas móviles estrechas.
  console.log('');
  console.log(chalk.blue.bold('  ❄️ ESDEATH'));
  console.log(chalk.blue.bold('       - BOT -'));
  console.log(chalk.blue('  WhatsApp Bot • Hikaru'));
  console.log(chalk.blue('  Administración de grupos y stickers\n'));
}

async function start() {
  showBanner();
  // Mismo patrón de autenticación de Lite-MD: estado multiparte, versión actual,
  // caché de claves de señal y el flujo original requestPairingCode.
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })) },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    msgRetryCounterCache: new NodeCache(),
    syncFullHistory: false
  });

  // Registra los eventos antes de pedir el código para no perder cierres de conexión.
  sock.ev.on('connection.update', async update => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log(chalk.red('❌ Sesión cerrada. Debes volver a vincular el dispositivo.'));
      } else {
        console.log(chalk.yellow('⚠️ Conexión cerrada; se intentará reconectar.'));
        if (process.env.ESDEATH_SUPERVISOR === '1') process.exit(1);
        else setTimeout(() => start().catch(e => console.error('[RECONEXIÓN]', e?.stack || e)), 1500);
      }
    } else if (connection === 'open') {
      console.log(chalk.blueBright('✅ Esdeath-BOT conectado correctamente.'));
      try { fs.rmSync('./tmp', { recursive: true, force: true }); fs.mkdirSync('./tmp', { recursive: true }); } catch {}
    }
  });
  sock.ev.on('creds.update', saveCreds);

  if (!sock.authState.creds.registered) {
    let number = await ask(chalk.blue('❄️ Introduce tu número con código de país (solo números): '));
    number = number.replace(/[^0-9]/g, '');
    if (!number) { console.log(chalk.red('❌ El número está vacío.')); process.exit(1); }
    console.log(chalk.cyan('⏱️ Solicitando código de vinculación a WhatsApp...'));
    try {
      const code = await sock.requestPairingCode(number);
      console.log(chalk.bgBlue.white('❄️ CÓDIGO DE VINCULACIÓN:'), chalk.bold.white(code));
      console.log('Abre WhatsApp > Dispositivos vinculados > Vincular dispositivo > Vincular con número de teléfono.');
    } catch (err) {
      console.error(chalk.red('❌ La conexión fue interrumpida:'), err.message);
      process.exit(1);
    }
  }



  sock.ev.on('group-participants.update', async event => {
    try {
      const cfg = groupConfig(event.id);
      if (!cfg.welcome || event.action !== 'add') return;
      for (const participant of event.participants || []) {
        await sock.sendMessage(event.id, { text: `❄️ Bienvenido/a @${jidNumber(participant)} al grupo.`, mentions: [participant] });
      }
    } catch (e) { console.error('[WELCOME]', e.message); }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      try {
        if (!msg.message || msg.key.fromMe) continue;
        const jid = msg.key.remoteJid;
        if (!jid || jid === 'status@broadcast') continue;
        const group = jid.endsWith('@g.us');
        const sender = msg.key.participant || jid;
        const m = unwrapMessage(msg.message);
        const raw = String(messageText(m) || '').trim();
        const context = getContext(m);
        const quotedMessage = context.quotedMessage ? unwrapMessage(context.quotedMessage) : null;
        const mentions = context.mentionedJid || [];
        if (!group) continue; // Esdeath solo responde y actúa en grupos.
        const cfg = groupConfig(jid);

        if (cfg.antilink && /(?:https?:\/\/)?(?:chat\.whatsapp\.com|wa\.me)\//i.test(raw)) {
          const metadata = await sock.groupMetadata(jid);
          if (isAdmin(metadata, sender)) continue;
          if (isAdmin(metadata, sock.user?.id)) {
            try { await sock.sendMessage(jid, { delete: msg.key }); } catch {}
            await sock.sendMessage(jid, { text: `⚠️ @${jidNumber(sender)}, los enlaces de invitación no están permitidos.`, mentions: [sender] });
          }
          continue;
        }
        if (cfg.antispam && raw) {
          const now = Date.now(); const key = `${jid}:${sender}`;
          let st = spamState.get(key) || { times: [] };
          st.times = st.times.filter(t => now - t < SPAM_WINDOW_MS); st.times.push(now); spamState.set(key, st);
          if (st.times.length > SPAM_LIMIT) {
            const metadata = await sock.groupMetadata(jid);
            if (!isAdmin(metadata, sender) && isAdmin(metadata, sock.user?.id)) {
              try { await sock.sendMessage(jid, { delete: msg.key }); } catch {}
              await sock.sendMessage(jid, { text: `⚠️ @${jidNumber(sender)}, evita enviar demasiados mensajes seguidos.`, mentions: [sender] });
            }
            continue;
          }
        }

        const isCommand = raw.startsWith(PREFIX);
        if (!isCommand) continue;
        const [cmdRaw, ...args] = raw.slice(PREFIX.length).trim().split(/\s+/);
        const cmd = (cmdRaw || '').toLowerCase();
        const arg = args.join(' ');
        const reply = text => sock.sendMessage(jid, { text }, { quoted: msg });
        if (cmd === 'menu' || cmd === 'help') {
          await reply('*❄️ ESDEATH-BOT*\n*Creador:* Hikaru\n\n*Administración*\n.kick @usuario · .promote @usuario · .demote @usuario · .del\n.tagall · .hidetag texto · .admins\n.abrir · .cerrar · .setname texto · .setdesc texto\n\n*Protección*\n.welcome on/off · .antilink on/off · .antispam on/off\n\n*Stickers*\n.sticker / .s · .toimg · .setpack nombre | autor\n\n.ping');
          continue;
        }
        if (cmd === 'ping') { await reply(`❄️ Pong! ${Date.now() - (msg.messageTimestamp ? Number(msg.messageTimestamp) * 1000 : Date.now())} ms`); continue; }

        const metadata = await sock.groupMetadata(jid);
        const botAdmin = isAdmin(metadata, sock.user?.id);
        const senderAdmin = isAdmin(metadata, sender);
        const ownerJid = sock.user?.id;
        const target = getTarget(msg, mentions, context);
        if (['kick','promote','demote','abrir','cerrar','setname','setdesc','welcome','antilink','antispam','tagall','hidetag','admins','del','sticker','s','toimg','setpack'].includes(cmd) && !senderAdmin && !['sticker','s','toimg','ping','menu','help'].includes(cmd)) {
          await reply('⚠️ Este comando requiere que seas administrador del grupo.'); continue;
        }
        if (['kick','promote','demote','abrir','cerrar','setname','setdesc'].includes(cmd) && !botAdmin) { await reply('⚠️ Necesito ser administrador del grupo para ejecutar ese comando.'); continue; }
        if (cmd === 'kick' || cmd === 'promote' || cmd === 'demote') {
          if (!target) { await reply(`Uso: ${PREFIX}${cmd} @usuario (o responde a su mensaje).`); continue; }
          const action = cmd === 'kick' ? 'remove' : cmd === 'promote' ? 'promote' : 'demote';
          await sock.groupParticipantsUpdate(jid, [target], action);
          await reply(`❄️ Acción completada: ${cmd} @${jidNumber(target)}.`); continue;
        }
        if (cmd === 'del') {
          if (!context.stanzaId || !context.participant) { await reply('Responde al mensaje que quieres borrar con .del.'); continue; }
          await sock.sendMessage(jid, { delete: { remoteJid: jid, fromMe: context.participant === sock.user?.id, id: context.stanzaId, participant: context.participant } }); continue;
        }
        if (cmd === 'tagall' || cmd === 'hidetag') {
          const participants = metadata.participants.map(p => p.id).filter(Boolean);
          const text = cmd === 'tagall' ? `❄️ *Etiquetado general*\n${arg || 'Atención a todos.'}` : (arg || '❄️ Aviso para el grupo.');
          await sock.sendMessage(jid, { text: text + (cmd === 'tagall' ? '\n' + participants.map(p => `@${jidNumber(p)}`).join(' ') : ''), mentions: participants }); continue;
        }
        if (cmd === 'admins') {
          const admins = metadata.participants.filter(p => p.admin).map(p => p.id);
          await sock.sendMessage(jid, { text: '❄️ *Administradores del grupo*\n' + admins.map(p => `• @${jidNumber(p)}`).join('\n'), mentions: admins }); continue;
        }
        if (cmd === 'abrir' || cmd === 'cerrar') {
          await sock.groupSettingUpdate(jid, cmd === 'abrir' ? 'not_announcement' : 'announcement');
          await reply(cmd === 'abrir' ? '❄️ El grupo está abierto para todos.' : '❄️ Solo los administradores pueden enviar mensajes.'); continue;
        }
        if (cmd === 'setname') { if (!arg) { await reply('Uso: .setname nuevo nombre'); continue; } await sock.groupUpdateSubject(jid, arg.slice(0, 100)); await reply('❄️ Nombre del grupo actualizado.'); continue; }
        if (cmd === 'setdesc') { if (!arg) { await reply('Uso: .setdesc nueva descripción'); continue; } await sock.groupUpdateDescription(jid, arg.slice(0, 2048)); await reply('❄️ Descripción del grupo actualizada.'); continue; }
        if (['welcome','antilink','antispam'].includes(cmd)) {
          const val = arg.toLowerCase(); if (!['on','off'].includes(val)) { await reply(`Uso: .${cmd} on/off`); continue; }
          cfg[cmd] = val === 'on'; saveConfig(); await reply(`❄️ ${cmd} ${val === 'on' ? 'activado' : 'desactivado'} en este grupo.`); continue;
        }
        if (cmd === 'setpack') {
          const [pack, ...authorParts] = arg.split('|');
          if (!pack.trim() || !authorParts.join('|').trim()) { await reply('Uso: .setpack nombre del paquete | autor'); continue; }
          config.sticker = { packname: pack.trim().slice(0, 64), author: authorParts.join('|').trim().slice(0, 64) }; saveConfig(); await reply('❄️ Metadatos de stickers actualizados.'); continue;
        }
        if (cmd === 'sticker' || cmd === 's') {
          const quoted = quotedMessage;
          let media = getMedia(m);
          if (!media && quoted) media = getMedia(quoted);
          if (!media || !['image','video','sticker'].includes(media.type)) { await reply('Envía o responde a una imagen o vídeo corto con .sticker.'); continue; }
          if (media.type === 'sticker') { await reply('Ese archivo ya es un sticker. Usa .toimg para convertirlo a imagen.'); continue; }
          await createSticker(sock, jid, media.message, media.type, msg); continue;
        }
        if (cmd === 'toimg') {
          let media = getMedia(m); if (!media && quotedMessage) media = getMedia(quotedMessage);
          if (!media || media.type !== 'sticker') { await reply('Responde a un sticker con .toimg.'); continue; }
          await stickerToImage(sock, jid, media.message, msg); continue;
        }
      } catch (e) {
        console.error('[ESDEATH]', e?.stack || e);
        try { await sock.sendMessage(msg.key.remoteJid, { text: '⚠️ No pude completar la acción. Comprueba mis permisos y vuelve a intentarlo.' }, { quoted: msg }); } catch {}
      }
    }
  });
}

start().catch(error => { console.error('[START]', error?.stack || error); process.exit(1); });
