// Esdeath-BOT — administración de grupos y herramientas de stickers.
// Proyecto derivado de Esdeath-BOT; personalización realizada para Hikaru.

//Modulos
const { default: makeWASocket,
  DisconnectReason, JulsBotIncConnect, getAggregateVotesInPollMessage, makeCacheableSignalKeyStore, useMultiFileAuthState,
 fetchLatestBaileysVersion, 
 generateForwardMessageContent,
 prepareWAMessageMedia, 
 generateWAMessageFromContent, 
 generateMessageID,
  downloadContentFromMessage, 
  jidDecode,
   proto } = require("baileys")
const fs = require('fs')
const path = require('path')

// Rutas de datos de moderación. Deben existir antes de registrar eventos de WhatsApp.
const moderacionPath = './settings/Grupo/Json/moderacion.json';
const banuserPath = './settings/Grupo/Json/usuarios-baneados.json';
function cargarBaneados(){ const d=cargarJsonSimple(banuserPath,{users:[]}); return new Set(Array.isArray(d.users)?d.users.map(normalizarJid).filter(Boolean):[]); }
function guardarBaneados(set){ guardarJsonSimple(banuserPath,{users:[...set].sort()}); }
function identidadObjetivo(info, groupMembers){ const m=obtenerMencionado(info); if(m) return m; return info?.quoted?.participant || info?.message?.extendedTextMessage?.contextInfo?.participant || null; }
const mutePath = './settings/Grupo/Json/mute.json';
const antifalsosPath = './settings/Grupo/Json/antifalsos.json';
const antispamPath = './settings/Grupo/Json/antispam.json';
const antilinkAvisosPath = './settings/Grupo/Json/antilink_avisos.json';
const actividadPath = './settings/Grupo/Json/actividad.json';

for (const [file, initial] of [
  [mutePath, { groups: {} }],
  [antifalsosPath, { groups: {} }],
  [antispamPath, { groups: {} }],
  [antilinkAvisosPath, { groups: {} }],
  [actividadPath, {}]
]) {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(initial, null, 2));
  }
}
const { Boom } = require('@hapi/boom')
const NodeCache = require("node-cache")
const readline = require("readline")
const PhoneNumber = require('awesome-phonenumber')
const cfonts = require('cfonts');
const pino = require('pino')
const util = require("util")
const speed = require("performance-now");
const mimetype = require('mime-types')
const { exec, spawn, execSync } = require("child_process")
let phoneNumber = "5199999999"; // cambiar número
const axios = require("axios")

//color
const chalk = require('chalk')
const color = (text, color) => { return !color ? chalk.green(text) : chalk.keyword(color)(text) };
 
 //baner
const banner = cfonts.render("ESDEATH| BOT", {
  font: 'pallet',
  align: 'center',
  colors: ["blue"]
})
      
const {getExtension, getRandom } =require('./fuction/settings/fuctions.js')

 //Stickers (Calcomanías digitales)
const { sendVideoAsSticker, sendImageAsSticker } = require('./fuction/sticker/rename.js');
const { sendVideoAsSticker2, sendImageAsSticker2 } = require('./fuction/sticker/rename2.js');

;
 
 //Grupos js
     
           // GAMES
// Los módulos de juegos y economía fueron excluidos de esta edición.


      
    // Menu bot js
const Menu = require ('./settings/Bot/Js/menu.js')
// Sin juegos: el bot se centra en administración y stickers.

 //configurar ggrupos
const welkom = JSON.parse(fs.readFileSync('./settings/Grupo/Json/welkom.json')) 
// Antilink: activo por defecto en todos los grupos.
// Se conserva el formato antiguo (array) y las desactivaciones nuevas se guardan en "disabled".
const antilinkPath = './settings/Grupo/Json/antilink.json';
function cargarConfigAntilink() {
  try {
    const raw = JSON.parse(fs.readFileSync(antilinkPath, 'utf8'));
    if (Array.isArray(raw)) return { enabled: raw, disabled: [] };
    return {
      enabled: Array.isArray(raw?.enabled) ? raw.enabled : [],
      disabled: Array.isArray(raw?.disabled) ? raw.disabled : []
    };
  } catch {
    return { enabled: [], disabled: [] };
  }
}
function guardarConfigAntilink(data) {
  fs.mkdirSync(path.dirname(antilinkPath), { recursive: true });
  fs.writeFileSync(antilinkPath, JSON.stringify({
    enabled: [...new Set(data.enabled || [])],
    disabled: [...new Set(data.disabled || [])]
  }, null, 2) + '\n');
}
function antiLinkActivo(grupo) {
  const cfg = cargarConfigAntilink();
  return !cfg.disabled.includes(grupo); // ON de fábrica; solo OFF explícito lo desactiva.
}
function contieneEnlaceWhatsApp(texto = '') {
  const t = String(texto).replace(/[\u200B-\u200D\uFEFF]/g, '').toLowerCase();
  return [
    /(?:https?:\/\/)?(?:www\.)?chat\.whatsapp\.com(?:[\/?#:\s]|$)/i,
    /(?:https?:\/\/)?(?:www\.)?wa\.me(?:[\/?#:\s]|$)/i,
    /(?:https?:\/\/)?(?:www\.)?api\.whatsapp\.com(?:[\/?#:\s]|$)/i,
    /(?:https?:\/\/)?(?:www\.)?whatsapp\.com\/(?:channel|invite|groups?|send)(?:[\/?#:\s]|$)/i
  ].some(re => re.test(t));
}
let bngp = JSON.parse(fs.readFileSync('./settings/Grupo/Json/grupo.json'))
// 𝚃𝙸𝙼𝙴
const moment = require("moment-timezone") 
const time = moment.tz('America/Caracas').format('DD/MM HH:mm:ss')
const horap = moment().format('HH')
var timeFt ='Saludos ❄️'
if (horap >= '01' && horap <= '05') {
  timeFt = '𝘽𝙪𝙚𝙣𝙤𝙨 𝙙𝙞𝙖𝙨 ❄️'
} else if (horap >= '05' && horap <= '12') {
  timeFt = '𝘽𝙪𝙚𝙣𝙤𝙨 𝙙𝙞𝙖𝙨 ☀️'
} else if (horap >= '12' && horap <= '18') {
  timeFt = '𝘽𝙪𝙚𝙣𝙖𝙨 𝙩𝙖𝙧𝙙𝙚𝙨 ⛅'
} else if (horap >= '18' && horap <= '23') {
  timeFt = '𝙗𝙪𝙚𝙣𝙖𝙨 𝙣𝙤𝙘𝙝𝙚𝙨 🌑'
}



 //Configuraciones 
var { owner } = require("./settings/settings.json");

// Imágenes oficiales del bot: menú y avisos visuales.
// Se selecciona una al azar para evitar repetir siempre la misma.
const BOT_IMAGES = [
  "https://i.postimg.cc/W3QZX2Gt/IMG-20261024-WA0147.jpg",
  "https://i.postimg.cc/Bvb138pw/038b18063cb2d3beef0da5acc4765177.jpg",
  "https://i.postimg.cc/MGLfpWrb/e5fa8e6922178fe9367dfaa32e814a53.jpg",
  "https://i.postimg.cc/15KgN0jZ/e4d824ad41c4339de6c16d1bcc7d499c.jpg"
];

const getBotImage = () => BOT_IMAGES[Math.floor(Math.random() * BOT_IMAGES.length)];        
const prefixo = ['.', '#', '/', '!', '?', '*', '•']; // Prefijos compatibles



const pairingCode = true;

const useMobile = process.argv.includes("--mobile")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

function getGroupAdmins(participants) {
  const admins = [];
  for (const i of participants || []) {
    if (i?.admin === 'admin' || i?.admin === 'superadmin') {
      for (const id of [i?.id, i?.lid, i?.phoneNumber].filter(Boolean)) if (!admins.includes(id)) admins.push(id);
    }
  }
  return admins;
}

// Estas funciones viven fuera de messages.upsert porque también las usan
// los eventos de solicitudes de ingreso y de participantes.
const removeAccents = (str = '') => String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const ARAB_COUNTRY_CODES = new Set([
  '20','212','213','216','218','222','249','252','253','269',
  '961','962','963','964','965','966','967','968','970','971','972','973','974',
  '975','976','977','978','979','990','991','992','993','994','995','996','998'
]);

function normalizarJid(jid) {
  return String(jid || '').split(':')[0].trim().toLowerCase();
}

function variantesNumeroWhatsApp(numero) {
  const n = String(numero || '').replace(/\D/g, '');
  if (!n) return [];
  const out = new Set([n]);
  // WhatsApp puede representar móviles argentinos como 549... o 54....
  if (n.startsWith('54') && !n.startsWith('549') && n.length >= 11) out.add('549' + n.slice(2));
  if (n.startsWith('549') && n.length >= 12) out.add('54' + n.slice(3));
  return [...out];
}

function mismoNumeroWhatsApp(a, b) {
  const A = new Set(variantesNumeroWhatsApp(a));
  return variantesNumeroWhatsApp(b).some(v => A.has(v));
}

function mismoJid(a, b) {
  const A = normalizarJid(a);
  const B = normalizarJid(b);
  if (!A || !B) return false;
  if (A === B) return true;
  const [aId, aType] = A.split('@');
  const [bId, bType] = B.split('@');
  if (aType === 'lid' || bType === 'lid') return false;
  if (aType !== 's.whatsapp.net' || bType !== 's.whatsapp.net') return false;
  return mismoNumeroWhatsApp(aId.replace(/\D/g, ''), bId.replace(/\D/g, ''));
}

function cargarJsonSimple(filePath, inicial) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(inicial, null, 2) + '\n');
      return JSON.parse(JSON.stringify(inicial));
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.log(`[ESDEATH JSON] ${filePath}: ${e.message}`);
    return JSON.parse(JSON.stringify(inicial));
  }
}

function guardarJsonSimple(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

// Las protecciones principales vienen activadas de fábrica.
// Un grupo solo las desactiva cuando guarda explícitamente false.
function funcionActivaPorDefecto(filePath, grupo, defecto = true) {
  const data = cargarJsonSimple(filePath, { groups: {} });
  const valor = data?.groups?.[grupo];
  return typeof valor === 'boolean' ? valor : defecto;
}

function clavesIdentidadWhatsApp(...identidades) {
  const claves = new Set();
  for (const valor of identidades.flat(Infinity).filter(Boolean)) {
    const jid = String(valor).trim().toLowerCase();
    if (!jid) continue;
    const limpio = jid.split(':')[0];
    claves.add(limpio);
    if (limpio.endsWith('@s.whatsapp.net')) {
      const numero = limpio.split('@')[0].replace(/\D/g, '');
      for (const variante of variantesNumeroWhatsApp(numero)) claves.add(`${variante}@s.whatsapp.net`);
    }
  }
  return claves;
}

function identidadesCoinciden(identidadesA, identidadesB) {
  const a = clavesIdentidadWhatsApp(identidadesA);
  const b = clavesIdentidadWhatsApp(identidadesB);
  for (const clave of a) if (b.has(clave)) return true;
  return false;
}

function esAdminFlexible(sock, listaDeAdmins = []) {
  const me = sock?.__esdeathCreds?.me;
  if (!me) return false;

  const botId = me.id;
  const botLid = me.lid;

  const clean = (jid) => jid?.split(':')[0];

  return listaDeAdmins.some(adminJid => {
    const adminRefugio = clean(adminJid);
    return (
      adminJid === botId ||
      adminJid === botLid ||
      adminJid === botId.replace(/:\d+/, '') ||
      adminJid === botLid.replace(/:\d+/, '') ||
      adminRefugio === clean(botId) ||
      adminRefugio === clean(botLid)
    );
  });
}

function obtenerMiembroPorIdentidad(miembros, jid) {
  return (miembros || []).find(p =>
    mismoJid(p?.id, jid) || mismoJid(p?.lid, jid) || mismoJid(p?.phoneNumber, jid)
  );
}

function obtenerMencionado(info) {
  const context = info?.message?.extendedTextMessage?.contextInfo
    || info?.message?.contextInfo
    || null;
  if (context?.mentionedJid?.length) return context.mentionedJid[0];
  if (context?.participant) return context.participant;
  return null;
}

function obtenerMencionExplicita(info) {
  const context = info?.message?.extendedTextMessage?.contextInfo
    || info?.message?.contextInfo
    || null;
  return context?.mentionedJid?.[0] || null;
}

function obtenerObjetivo(info, argumento, miembros = []) {
  const citado = obtenerMencionado(info);
  if (citado) return citado;
  const mencionado = obtenerMencionExplicita(info);
  if (mencionado) return mencionado;
  const numero = String(argumento || '').replace(/[^0-9]/g, '');
  if (!numero) return null;
  const encontrado = miembros.find(p => [p?.id, p?.lid, p?.phoneNumber].filter(Boolean).some(id => {
    const raw = String(id).split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
    return mismoNumeroWhatsApp(raw, numero);
  }));
  return encontrado?.id || encontrado?.lid || `${numero}@s.whatsapp.net`;
}

function esObjetivoValido(jid) {
  return typeof jid === 'string' && /@(s\.whatsapp\.net|lid)$/.test(jid);
}

function esNumeroArab(jid) {
  const value = String(jid || '').trim().toLowerCase();
  if (value.endsWith('@lid')) return false;
  if (!value.endsWith('@s.whatsapp.net')) return true;
  const raw = value.split('@')[0].split(':')[0].replace(/\D/g, '');
  if (!raw || raw.length < 7 || raw.length > 15) return true;
  return [...ARAB_COUNTRY_CODES].some(code => raw.startsWith(code));
}

function isBotAdminForMetadata(sock, metadata) {
  const admins = (metadata?.participants || []).filter(p => p?.admin).flatMap(p => [p.id, p.lid].filter(Boolean));
  return esAdminFlexible(sock, admins);
}

let reconnectAttempts = 0;
let reconnectTimer = null;

async function startProo() {
  console.clear();
  console.log(banner.string);
  console.log(chalk.cyanBright("❄️Esdeath-BOT"));

  // Estado de sesión
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version, isLatest } = await fetchLatestBaileysVersion();
  const msgRetryCounterCache = new NodeCache();

  // Crear socket
  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false, // Desactivado para no mostrar QR
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    msgRetryCounterCache,
    syncFullHistory: false,
  });

  // Referencia estable a las credenciales reales de la sesión para comparar
  // el ID propio del bot con los participantes administradores del grupo.
  sock.__esdeathCreds = state.creds;

  // 🟢 Si no hay sesión registrada, generar el código de vinculación de 8 dígitos
  if (!sock.authState.creds.registered) {
    let number = await question(
      chalk.blue("❄️ Ingrese el número del dispositivo (con código de país): ")
    );
    rl.close();
    number = number.replace(/[^0-9]/g, "");

    if (!number) {
      console.log(chalk.red("❌ Error lógico: El número es inexistente."));
      process.exit(1);
    }

    console.log(chalk.cyan("⏱️  Solicitando sello de vinculación a los servidores..."));
    try {
      const code = await sock.requestPairingCode(number);
      console.log(chalk.bgBlue.white("❄️ SELLO DE VINCULACIÓN:"), chalk.bold.white(code));
    } catch (err) {
      console.error(chalk.red("❌ La conexion ha sido interrumpida"), err.message);
      process.exit(1);
    }
  }


  // 🔄 Monitorear el estado de conexión
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log(chalk.red("❌ Conexion cortada: Sesión cerrada. Elimine la carpeta 'session' para restaurar la conexión."));
      } else {
        console.log(chalk.yellow("⚠️ Problemas de conexión: conexión cerrada."));
        // Si start.sh supervisa el proceso, dejamos que un único proceso vuelva
        // a levantar Esdeath. Evita sockets duplicados y sesiones criptográficas
        // concurrentes que pueden terminar en Bad MAC.
        if (process.env.ESDEATH_SUPERVISOR === '1') {
          process.exit(1);
        } else if (!reconnectTimer) {
          const wait = Math.min(30000, 1500 * (2 ** Math.min(reconnectAttempts, 5)));
          reconnectAttempts += 1;
          reconnectTimer = setTimeout(() => {
            reconnectTimer = null;
            startProo().catch(err => console.error('[RECONEXIÓN] Error al reiniciar:', err));
          }, wait);
        }
      }
    } else if (connection === "open") {
      reconnectAttempts = 0;
      console.log(chalk.blueBright("✅ Esdeath-BOT: Conexión establecida correctamente."));
      exec("rm -rf tmp && mkdir tmp");

    }
  });


  // Guardar credenciales cuando se actualicen
  sock.ev.on("creds.update", saveCreds);



    
               // 𝙲𝙾𝙽𝙴𝚇𝙸𝙾𝙽 
        // 𝙱𝙸𝙴𝙽𝚅𝙴𝙽𝙸𝙳𝙰 𝚈 𝙳𝙴𝚂𝙿𝙴𝙳𝙸𝙳𝙰 
sock.ev.on('group-participants.update', async (anu) => {
  if (anu.action !== 'add') return;
  try {
    const cfg = cargarJsonSimple(antifalsosPath, { groups: {} });
    if (cfg.groups?.[anu.id] === false) return;
    const metadata = await sock.groupMetadata(anu.id);
    if (!await isBotAdminForMetadata(sock, metadata)) return;
    const sospechosos = (anu.participants || []).filter(esNumeroArab);
    if (sospechosos.length) {
      await sock.groupParticipantsUpdate(anu.id, sospechosos, 'remove');
      console.log(`[ANTIFALSOS] Eliminados en ${anu.id}: ${sospechosos.join(', ')}`);
    }
  } catch (e) {
    console.log('[ANTIFALSOS] Error:', e.message);
  }
});

sock.ev.on("group-participants.update", async (anu) => {
  if (!welkom.includes(anu.id)) return;
  try {
    const metadata = await sock.groupMetadata(anu.id);
    const participantes = anu.participants || [];
    const grupo = metadata.subject || 'este grupo';
    const miembros = metadata.participants?.length || 0;

    for (const num of participantes) {
      if (anu.action === 'add') {
        const bienvenida = `
❄️ *¡𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐎/𝐀!*

¡Hola, @${String(num).split('@')[0]}! 💙

Nos alegra mucho tenerte en *${grupo}*. Soy *Esdeath-BOT* y estaré aquí para ayudarte a mantener el grupo organizado.

Te invitamos a saludar, conocer a los demás integrantes y revisar las normas para que todos podamos disfrutar de un buen ambiente.

『 👥 Somos ${miembros} miembros 』
`;
        await sock.sendMessage(anu.id, {
          image: { url: getBotImage() },
          caption: bienvenida,
          mentions: [num]
        });
      }

      if (anu.action === 'promote') {
        const reconocimiento = `
❄️ *¡𝐅𝐄𝐋𝐈𝐂𝐈𝐃𝐀𝐃𝐄𝐒 𝐏𝐎𝐑 𝐓𝐔 𝐏𝐑𝐎𝐌𝐎𝐂𝐈Ó𝐍!*

🪪 *Integrante:* @${String(num).split('@')[0]}
🌐 *Grupo:* ${grupo}

Ahora formas parte del equipo de administración. ¡Gracias por asumir esta responsabilidad! Te deseamos mucho éxito y contamos con tu apoyo para mantener un ambiente agradable y ordenado. 💙
`;
        await sock.sendMessage(anu.id, {
          image: { url: getBotImage() },
          caption: reconocimiento,
          mentions: [num]
        });
      }
    }
  } catch (e) {
    console.log('Error en bienvenida/promoción:', color(e, 'red'));
  }
});

//Bienvenida y despedidas


sock.ev.on('messages.upsert', async m => {
 try {
 const info = m.messages[0]
 if (!info.message) return 
 if (info.key && info.key.remoteJid == "status@broadcast") return
 const altpdf = Object.keys(info.message)
 const type = altpdf[0] == "senderKeyDistributionMessage" ? altpdf[1] == "messageContextInfo" ? altpdf[2] : altpdf[1] : altpdf[0]
const content = JSON.stringify(info.message)
const from = info.key.remoteJid
 // Ignorar todos los mensajes privados sin responder ni procesarlos.
 if (!from || !from.endsWith('@g.us')) return;
 const bodyValue = (type === 'conversation') ? info.message.conversation : (type == 'imageMessage') ? info.message.imageMessage.caption : (type == 'videoMessage') ? info.message.videoMessage.caption : (type == 'extendedTextMessage') ? info.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? info.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? info.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? info.message.templateButtonReplyMessage.selectedId : '';
 const body = String(bodyValue ?? '');

const budyValue = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : '';
const budy = String(budyValue ?? '');

const pesValue = (type === 'conversation' && info.message.conversation) ? info.message.conversation : (type == 'imageMessage') && info.message.imageMessage.caption ? info.message.imageMessage.caption : (type == 'videoMessage') && info.message.videoMessage.caption ? info.message.videoMessage.caption : (type == 'extendedTextMessage') && info.message.extendedTextMessage.text ? info.message.extendedTextMessage.text : '';
const pes = String(pesValue ?? '');

const numerodono = [
  `${owner}`
];


const verificarN = async(sla) => {
const [result] = await sock.onWhatsApp(sla)
if(result == undefined) {
enviar("Este usuário no existe en WhatsApp")
} else {
enviar(`${sla} Número existente en WhatsApp con  id: ${result.jid}`)
}
}
    
// Constantes is — resolución de identidad adaptada del AkameBot comprobado.
const isGroup = String(info.key.remoteJid || '').endsWith('@g.us');
const rawSender = isGroup
  ? (info.key.participant || info.key.participantPn || (info.key.fromMe ? sock.user?.id : '') || '')
  : (info.key.fromMe ? String(sock.user?.id || from) : from);
const senderPhone = String(info.key.senderPn || info.key.participantPn || ((!isGroup && String(from).endsWith('@s.whatsapp.net')) ? from : '') || '').trim();
const senderLid = isGroup ? String(info.key.participant || '').trim() : '';
const __esdeathGroupMetaCache = global.__ESDEATH_GROUP_META_CACHE || (global.__ESDEATH_GROUP_META_CACHE = new Map());
let groupMetadata = '';
if (isGroup) {
  const cached = __esdeathGroupMetaCache.get(from);
  if (cached && Date.now() - cached.at < 10000 && Array.isArray(cached.data?.participants) && cached.data.participants.length) {
    groupMetadata = cached.data;
  } else {
    try {
      groupMetadata = await sock.groupMetadata(from);
      __esdeathGroupMetaCache.set(from, { at: Date.now(), data: groupMetadata });
    } catch (e) {
      groupMetadata = cached?.data || { participants: [] };
    }
  }
}
let groupMembers = isGroup ? (groupMetadata.participants || []) : [];
let sender = rawSender;
if (isGroup) {
  let member = obtenerMiembroPorIdentidad(groupMembers, rawSender);
  if (!member && info.key.participantPn) member = obtenerMiembroPorIdentidad(groupMembers, info.key.participantPn);
  if (!member && info.key.participantLid) member = obtenerMiembroPorIdentidad(groupMembers, info.key.participantLid);
  if (!member) {
    try {
      const fresh = await sock.groupMetadata(from);
      if (fresh?.participants?.length) {
        groupMetadata = fresh;
        groupMembers = fresh.participants;
        __esdeathGroupMetaCache.set(from, { at: Date.now(), data: fresh });
        member = obtenerMiembroPorIdentidad(groupMembers, rawSender)
          || obtenerMiembroPorIdentidad(groupMembers, info.key.participantPn)
          || obtenerMiembroPorIdentidad(groupMembers, info.key.participantLid);
      }
    } catch {}
  }
  if (member) sender = member.phoneNumber || member.id || member.jid || member.lid || rawSender;
}
const groupName = isGroup ? groupMetadata.subject : ''
const groupDesc = isGroup ? groupMetadata.desc : ''
const nome = info.pushName ? info.pushName : ''
const groupAdmins = groupMembers.filter(p => p.admin);
const Sadm = isGroup ? getGroupAdmins(groupAdmins) :''
const messagesC = String(pes ?? '').trim().split(/ +/).shift().toLowerCase()
let args = String(body ?? '').trim().split(/ +/).slice(1)
let q = args.join(' ')
let text = args.join(' ')
// MULTIPREFIJO
const prefixes = prefixo.map(prefix => prefix.toLowerCase());
const rawBudy = String(budy || '').trim();
const lowerBudy = rawBudy.toLowerCase();
const usedPrefix = prefixes.find(prefix => lowerBudy.startsWith(prefix));
const hasPrefix = Boolean(usedPrefix);
const isCmd = hasPrefix;
const commandSource = hasPrefix ? rawBudy.slice(usedPrefix.length).trim() : rawBudy;
const commandArgs = commandSource ? commandSource.split(/\s+/) : [];
const comando = removeAccents(commandArgs[0] || '').toLowerCase();
args = commandArgs.slice(1);
q = args.join(' ');
text = q;
  // MULTIPREFIJO
const mentions = (teks, memberr, id) => {
(id == null || id == undefined || id == false) ? sock.sendMessage(from, {text: teks.trim(), mentions: memberr}) : sock.sendMessage(from, {text: teks.trim(), mentions: memberr})}
const quoted = info.quoted ? info.quoted : info
const mime = (quoted.info || quoted).Mimetype || ""
const sleep = async (ms) => {return new Promise(resolve => setTimeout(resolve, ms))}
const pushname = info.pushName ? info.pushName : ''
const isBot = info.key.fromMe ? true : false
const senderNumber = sender.split("@")[0]
const BotNumber = sock.user.id.split(':')[0]+'@s.whatsapp.net'
const senderIdentidades = [
   info.key.participant, info.key.participantPn, info.key.senderPn,
   sender, senderPhone, senderLid
 ].filter(Boolean);
 const isOwner = numerodono.some(ownerId =>
   identidadesCoinciden(senderIdentidades, [ownerId])
 );
 const isGroupAdmins = groupAdmins.some(admin =>
   identidadesCoinciden(senderIdentidades, [admin?.id, admin?.lid, admin?.phoneNumber])
 );
 const isBotGroupAdmins = esAdminFlexible(sock, groupAdmins.flatMap(p => [p?.id, p?.lid, p?.phoneNumber].filter(Boolean)));

// Bloqueo global de usuarios, adaptado del mecanismo de AkameBot.
const bannedUsers = cargarBaneados();
if (bannedUsers.has(normalizarJid(sender)) && !isOwner && comando !== 'desbanuser') return;

// ❄️ MUTE: borra automáticamente cualquier mensaje de usuarios silenciados.
// Solo se aplica en grupos y requiere que Esdeath sea administradora.
if (isGroup && !isBot) {
  const antiData = cargarJsonSimple(antifalsosPath, { groups: {} });
  if (funcionActivaPorDefecto(antifalsosPath, from, true) && isBotGroupAdmins && (sender.endsWith('@s.whatsapp.net') || sender.endsWith('@lid'))) {
    const digits = sender.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
    // Solo considera inválidos identificadores claramente malformados.
    // No usa país/nacionalidad como criterio.
    if (digits.length < 7 || digits.length > 15) {
      try {
        await sock.groupParticipantsUpdate(from, [sender], 'remove');
        return;
      } catch {}
    }
  }
}

if (isGroup && !isBot) {
  const muteData = cargarJsonSimple(mutePath, { groups: {} });
  const muted = muteData.groups?.[from] || [];
  const estaMuteado = muted.some(jid => mismoJid(jid, sender));
  if (estaMuteado) {
    if (isBotGroupAdmins) {
      try {
        await sock.sendMessage(from, {
          delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender }
        });
      } catch (e) {
        console.log('No se pudo borrar mensaje de usuario muteado:', e.message);
      }
    }
    return;
  }
}

const isUrl = (url) => { return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi')) }
const deviceType = info.key.id.length > 21 ? 'Android' : info.key.id.substring(0, 2) == '3A' ? 'IPhone' : 'WhatsApp web'
const options = { timeZone: 'America/Lima', hour12: false }
const data = new Date().toLocaleDateString('PE', { ...options, day: '2-digit', month: '2-digit', year: '2-digit' })
const hora = new Date().toLocaleTimeString('PE', options) 

           // Constantes if nuevas
  const iswelkom = isGroup ? welkom.includes(from) : false
const isBanGp = isGroup ? bngp.includes(from) : false
 const isAntiLink = isGroup ? antiLinkActivo(from) : false 
 
 // 🟢 Sistema de encendido/apagado global del bot

const estadoPath = './settings/estadoBot.json'


if (!fs.existsSync(estadoPath)) {
  fs.writeFileSync(estadoPath, JSON.stringify({ activo: true }, null, 2))
}
let botActivo = JSON.parse(fs.readFileSync(estadoPath)).activo
function guardarEstadoBot(estado) {
  fs.writeFileSync(estadoPath, JSON.stringify({ activo: estado }, null, 2))
  botActivo = estado
}

//

//MODO ADMIN 

const modoAdminPath = './settings/Grupo/Json/modo_admin.json';
const modoAdminList = fs.existsSync(modoAdminPath) ? JSON.parse(fs.readFileSync(modoAdminPath)) : [];
const isModoAdmin = isGroup ? modoAdminList.includes(from) : false;

// Estado individual por grupo: bot on/off pausa o reanuda Esdeath solo en este grupo.
const estadoGruposPath = './settings/Grupo/Json/estado_grupos.json';
function cargarEstadoGrupos() {
  try {
    const data = JSON.parse(fs.readFileSync(estadoGruposPath, 'utf8'));
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch { return {}; }
}
function guardarEstadoGrupos(data) {
  fs.mkdirSync(path.dirname(estadoGruposPath), { recursive: true });
  fs.writeFileSync(estadoGruposPath, JSON.stringify(data || {}, null, 2));
}
const estadoGrupos = cargarEstadoGrupos();
const grupoActivo = !isGroup || estadoGrupos[from] !== false;



 //Funciones nuevas
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
} 
function DLT_FL(file) {
        try {
            fs.unlinkSync(file);
        } catch (error) {
            return;
        }
    }
    
 const enviar = (texto, opciones = {}) => {
 sock.sendMessage(from, { text: texto, ...opciones }, { quoted: info })
 }
 
             // 𝙽iveles
 // Constantes if
 const isImage = type == "imageMessage"
const isVideo = type == "videoMessage"
const isAudio = type == "audioMessage"
const isSticker = type == "stickerMessage"
const isContact = type == "contactMessage"
const isLocation = type == "locationMessage"
const isProduct = type == "productMessage"
const isMedia = (type === "imageMessage" || type === "videoMessage" || type === "audioMessage") 
typeMessage = body.substr(0, 50).replace(/\n/g, "")
if (isImage) typeMessage = "Image"
else if (isVideo) typeMessage = "Video"
else if (isAudio) typeMessage = "Audio"
else if (isSticker) typeMessage = "Sticker"
else if (isContact) typeMessage = "Contact"
else if (isLocation) typeMessage = "Location"
else if (isProduct) typeMessage = "Product"
const isQuotedMsg = type === "extendedTextMessage" && content.includes("textMessage")
const isQuotedImage = type === "extendedTextMessage" && content.includes("imageMessage")
const isQuotedVideo = type === "extendedTextMessage" && content.includes("videoMessage")
const isQuotedDocument = type === "extendedTextMessage" && content.includes("documentMessage")
const isQuotedAudio = type === "extendedTextMessage" && content.includes("audioMessage")
const isQuotedSticker = type === "extendedTextMessage" && content.includes("stickerMessage")
const isQuotedContact = type === "extendedTextMessage" && content.includes("contactMessage")
const isQuotedLocation = type === "extendedTextMessage" && content.includes("locationMessage")
const isQuotedProduct = type === "extendedTextMessage" && content.includes("productMessage")


const getFileBuffer = async (mediakey, MediaType) => {
const stream = await downloadContentFromMessage(mediakey, MediaType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]) }
return buffer}



//funcion para mencionar 

// ===================== ESDEATH-BOT: MODERACIÓN Y ACTIVIDAD =====================

const moderacionInicial = {
  palabras: [
    'idiota', 'imbecil', 'imbécil', 'estupido', 'estúpido', 'estupida', 'estúpida',
    'pendejo', 'pendeja', 'cabron', 'cabrón', 'cabrona', 'mierda', 'puto', 'puta',
    'maricon', 'maricón', 'zorra', 'coño', 'gay'
  ],
  advertencias: {},
  activo: {}
};

function cargarJsonSeguro(path, inicial) {
  try {
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify(inicial, null, 2) + '\n');
      return JSON.parse(JSON.stringify(inicial));
    }
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch {
    return JSON.parse(JSON.stringify(inicial));
  }
}

function guardarJsonSeguro(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

// Registro de actividad para los comandos .fantasmas y .ejecutarfantasmas.
// Cuenta mensajes de miembros en grupos; la información se guarda por lotes.
let actividadCache = null;
let actividadFlushTimer = null;
let actividadDirty = false;

function normalizarIdentidadActividad(jid) {
  return String(jid || '').split(':')[0].trim().toLowerCase();
}

function cargarActividadCache() {
  if (actividadCache) return actividadCache;
  actividadCache = cargarJsonSeguro(actividadPath, {});
  return actividadCache;
}

function programarGuardadoActividad() {
  actividadDirty = true;
  if (actividadFlushTimer) return;
  actividadFlushTimer = setTimeout(() => {
    actividadFlushTimer = null;
    if (!actividadDirty || !actividadCache) return;
    try {
      guardarJsonSeguro(actividadPath, actividadCache);
      actividadDirty = false;
    } catch (e) {
      console.log('[ACTIVIDAD] Error al guardar:', e.message);
    }
  }, 3000);
  actividadFlushTimer.unref?.();
}

function sumarActividad(grupo, key, miembros = []) {
  const data = cargarActividadCache();
  if (!data[grupo]) data[grupo] = {};
  const aliases = new Set([
    key?.participant, key?.participantPn, key?.participantLid,
    key?.senderPn, key?.senderLid
  ].filter(Boolean).map(normalizarIdentidadActividad));
  const miembro = (miembros || []).find(p =>
    [p?.id, p?.lid, p?.phoneNumber].filter(Boolean)
      .map(normalizarIdentidadActividad).some(id => aliases.has(id))
  );
  const usuario = normalizarIdentidadActividad(
    miembro?.id || miembro?.lid || miembro?.phoneNumber ||
    key?.participant || key?.participantPn || key?.participantLid
  );
  if (!usuario) return;
  data[grupo][usuario] = Number(data[grupo][usuario] || 0) + 1;
  programarGuardadoActividad();
}

function obtenerActividad(grupo) {
  return cargarActividadCache()[grupo] || {};
}

function contarMensajesFantasma(miembro, actividad) {
  const claves = [miembro?.id, miembro?.lid, miembro?.phoneNumber]
    .filter(Boolean).map(normalizarIdentidadActividad);
  return claves.reduce((max, clave) => Math.max(max, Number(actividad[clave] || 0)), 0);
}

function normalizarTextoModeracion(texto = '') {
  return removeAccents(String(texto))
    .toLowerCase()
    .replace(/[0-9]/g, '')
    .replace(/[^\p{L}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function contienePalabraProhibida(texto, palabras) {
  const limpio = normalizarTextoModeracion(texto);
  return palabras.some(palabra => {
    const p = normalizarTextoModeracion(palabra);
    return p && limpio.split(/\s+/).includes(p);
  });
}

function obtenerAdvertencias(grupo, usuario) {
  const data = cargarJsonSeguro(moderacionPath, moderacionInicial);
  return Number(data.advertencias?.[grupo]?.[usuario] || 0);
}

function cambiarAdvertencias(grupo, usuario, cantidad) {
  const data = cargarJsonSeguro(moderacionPath, moderacionInicial);
  if (!data.advertencias[grupo]) data.advertencias[grupo] = {};
  data.advertencias[grupo][usuario] = Math.max(0, Number(cantidad) || 0);
  guardarJsonSeguro(moderacionPath, data);
  return data.advertencias[grupo][usuario];
}

// Anti-spam: ventana temporal real por usuario.
// Cuenta mensajes y stickers mezclados para que no se pueda esquivar el límite alternando tipos.
const antispamEstado = new Map();
const antispamSanciones = new Map();
const ANTISPAM_VENTANA_MS = 7000;
const ANTISPAM_LIMITE_MENSAJES = 6;
const ANTISPAM_LIMITE_STICKERS = 4;

function antiSpamActivo(grupo) {
  return funcionActivaPorDefecto(antispamPath, grupo, true);
}
function establecerAntiSpam(grupo, activo) {
  const data = cargarJsonSimple(antispamPath, { groups: {} });
  if (!data.groups) data.groups = {};
  data.groups[grupo] = Boolean(activo);
  guardarJsonSimple(antispamPath, data);
}
function registrarAntiSpam(grupo, usuario, esSticker = false) {
  const ahora = Date.now();
  const clave = `${grupo}:${normalizarJid(usuario)}`;
  let estado = antispamEstado.get(clave);
  if (!estado) estado = { mensajes: [], stickers: [] };
  estado.mensajes = estado.mensajes.filter(t => ahora - t <= ANTISPAM_VENTANA_MS);
  estado.stickers = estado.stickers.filter(t => ahora - t <= ANTISPAM_VENTANA_MS);
  estado.mensajes.push(ahora);
  if (esSticker) estado.stickers.push(ahora);
  antispamEstado.set(clave, estado);
  return {
    mensajes: estado.mensajes.length,
    stickers: estado.stickers.length,
    excedeMensajes: estado.mensajes.length >= ANTISPAM_LIMITE_MENSAJES,
    excedeStickers: estado.stickers.length >= ANTISPAM_LIMITE_STICKERS
  };
}
function limpiarAntiSpam(grupo, usuario) {
  antispamEstado.delete(`${grupo}:${normalizarJid(usuario)}`);
}
function limpiarAntiSpamGrupo(grupo) {
  const base = `${grupo}:`;
  for (const clave of antispamEstado.keys()) {
    if (clave.startsWith(base)) antispamEstado.delete(clave);
  }
  for (const clave of antispamSanciones.keys()) {
    if (clave.startsWith(base)) antispamSanciones.delete(clave);
  }
}

function obtenerTemaTop(texto) {
  return String(texto || 'aleatorio').trim().replace(/\s+/g, ' ') || 'aleatorio';
}

function seleccionarUsuariosAleatorios(participantes, cantidad = 10) {
  const candidatos = [...new Map(
    participantes
      .filter(p => p?.id && !p.id.includes('status@broadcast'))
      .map(p => [p.id, p])
  ).values()];
  for (let i = candidatos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidatos[i], candidatos[j]] = [candidatos[j], candidatos[i]];
  }
  return candidatos.slice(0, Math.min(cantidad, candidatos.length));
}

// ===================== INTERACCIONES / ESCENAS =====================
// Cada acción tiene frases propias y una etiqueta compatible con una API pública
// de imágenes/GIFs anime. Si la imagen no está disponible, se envía la escena en texto.
//  Time
const runtime = function(seconds) {
    seconds = Number(seconds);
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60); // Utilizando Math.floor() para asegurar que los segundos sean enteros
    const parts = [];    
    if (days > 0) {
        parts.push(days + (days === 1 ? " 𝙳𝙸𝙰" : " 𝙳𝙸𝙰𝚂"));
    }
    if (hours > 0) {
        parts.push(hours + (hours === 1 ? " 𝙷𝙾𝚁𝙰" : " 𝙷𝙾𝚁𝙰𝚂"));
    }
    if (minutes > 0) {
        parts.push(minutes + (minutes === 1 ? "  𝙼𝙸𝙽𝚄𝚃𝙾" : " 𝙼𝙸𝙽𝚄𝚃𝙾𝚂"));
    }
   if (remainingSeconds > 0) {
    parts.push(remainingSeconds + (remainingSeconds === 1 ? " 𝚂𝙴𝙶𝚄𝙽𝙳𝙾" : " 𝚂𝙴𝙶𝚄𝙽𝙳𝙾𝚂"));
    }    
    return parts.join(', ');
}

  // Respuesta
     const respuesta = {
  admin: "『 🚫 No eres un Administrador 』",
  botadmin: "『 ⚠️ El bot requiere rango de Administrador para ejecutar esto 』",
  vacio: "『 ❓ Falta información para procesar el reporte 』",
  miowner: "『 ⛔ Solo Hikaru, propietario de Esdeath-BOT, tiene acceso a esto. 』",

}


 
   // Verificados
 const SvnC = {key : {participant : '0@s.whatsapp.net'},message : {contactMessage : {displayName : `${pushname}`}}};
 
  // Funciones para crear códigos de 6 Digitos
  
  function generarCodigo() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres.charAt(indice);
    }
    return codigo;
}


 // MENSAJES EN CONSOLA
 
// comando pv
if  (!isGroup && isCmd) console.log( '\n  ╔─━━━━ ', color(' CMD 「 USUARIO 」','blue'), '━━━━─╗','\n',
color(' GRUPO :','blue'),color(groupName,'cyan'),'\n',
color(' NOMBRE :','blue'),color(pushname,'cyan'),'\n',
color(' COMANDO :','blue'),color(comando,'cyan'),'\n',
color(' HORA :','blue'),color(hora,'cyan'),'\n',
color(' DATOS :','blue'),color(data,'cyan'),'\n',color(' ╚─━━━━━━ '),color ('ESDEATH','blue'), '━━━━━─╝')

//pv
if (!isCmd && !isGroup) console.log( '\n  ╔─━━━━━', color(' CHAT 「 BOT 」','blue'), '━━━━━─╗','\n',
color(' GRUPO :','blue'),color(groupName,'cyan'),'\n',
color(' NOMBRE :','blue'),color(pushname,'cyan'),'\n',
color(' MENSAJE :','blue'),color(budy,'cyan'),'\n',
color(' HORA :','blue'),color(hora,'cyan'),'\n',
color(' DATOS :','blue'),color(data,'cyan'),'\n',color(' ╚─━━━━━━━━ '),color ('【✔】 ','blue'), '━━━━━━━━━─╝')

//comando grupo
if (isCmd && isGroup) console.log( '\n  ╔─━━━ ', color('  CMD 「 USUARIO 」','blue'), '━━━─╗','\n',
color(' GRUPO :','blue'),color(groupName,'cyan'),'\n',
color(' NOMBRE :','blue'),color(pushname,'cyan'),'\n',
color(' COMANDO :','blue'),color(comando,'cyan'),'\n',
color(' HORA :','blue'),color(hora,'cyan'),'\n',
color(' DATOS :','blue'),color(data,'cyan'),'\n',color(' ╚─━━━━━━ '),color ('ESDEATH','blue'), '━━━━━─╝')

//mensaje grupo
if (!isCmd && isGroup) console.log( '\n  ╔─━━━━━', color(' CHAT 「 BOT 」','blue'), '━━━━━─╗','\n',
color(' GRUPO :','blue'),color(groupName,'cyan'),'\n',
color(' NOMBRE :','blue'),color(pushname,'cyan'),'\n',
color(' MENSAJE :','blue'),color(budy,'cyan'),'\n',
color(' HORA :','blue'),color(hora,'cyan'),'\n',
color(' DATOS :','blue'),color(data,'cyan'),'\n',color(' ╚─━━━━━━━━━ '),color ('【✔】 ','blue'), '━━━━━━━━━─╝')
// Grupo bloqueado: nadie puede usar comandos allí, excepto el creador
// cuando necesita levantar la restricción.
const comandosDesbloqueoGrupo = ['desbangp', 'desbang', 'desban', 'unban'];
if (isBanGp && !(isOwner && comandosDesbloqueoGrupo.includes(comando))) {
  return;
}
      // Los mensajes privados se ignoran al inicio del evento, sin enviar avisos.\n// INICIO DE COMANDOS
//solo funciona si está activado el bot
// Si el grupo está en modo admin y el usuario no es admin ni owner, se bloquea su acceso
if (isModoAdmin && !isGroupAdmins && !isOwner && !['actualizar','update','upgrade','dolar'].includes(comando)) return;
if (!botActivo && !isOwner && !['actualizar','update','upgrade'].includes(comando)) return

// Si Esdeath está apagada en un grupo, solo bot on puede reactivarla.
if (isGroup && !grupoActivo && comando !== 'bot') return

  // ===================== ANTILINK GLOBAL =====================
  // Solo bloquea enlaces de WhatsApp. Redes como YouTube, Facebook,
  // Instagram, TikTok, X y Telegram quedan permitidas.
  if (isGroup && isAntiLink && !isGroupAdmins && !isOwner && !isBot) {
    const textoAntilink = String(body || budy || '');
    if (contieneEnlaceWhatsApp(textoAntilink)) {
      if (!isBotGroupAdmins) {
        await enviar('⚠️ No soy administrador del grupo, así que no puedo aplicar el Antilink.');
        return;
      }
      const avisosData = cargarJsonSimple(antilinkAvisosPath, { groups: {} });
      if (!avisosData.groups) avisosData.groups = {};
      if (!avisosData.groups[from]) avisosData.groups[from] = {};
      const claveAviso = normalizarJid(sender);
      const faltas = Number(avisosData.groups[from][claveAviso] || 0) + 1;
      avisosData.groups[from][claveAviso] = faltas;
      guardarJsonSimple(antilinkAvisosPath, avisosData);

      // Primero se informa y después se elimina/expulsa.
      if (faltas === 1) {
        await enviar(
          `⚠️ *ENLACE NO PERMITIDO*

@${sender.split('@')[0].split(':')[0]}, los enlaces de WhatsApp no están permitidos en este grupo.

🔔 Esta es tu primera advertencia. Si vuelves a enviar otro enlace prohibido, serás eliminado.`,
          { mentions: [sender] }
        );
        try { await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } }); } catch {}
      } else {
        await enviar(
          `🚫 *ENLACE PROHIBIDO*

@${sender.split('@')[0].split(':')[0]}, has vuelto a enviar un enlace de WhatsApp.

⛔ Segunda advertencia: serás eliminado del grupo.`,
          { mentions: [sender] }
        );
        await new Promise(resolve => setTimeout(resolve, 1200));
        try { await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } }); } catch {}
        try {
          const miembro = obtenerMiembroPorIdentidad(groupMembers, sender);
          const objetivo = miembro?.id || miembro?.phoneNumber || sender;
          await sock.groupParticipantsUpdate(from, [objetivo], 'remove');
        } catch (err) { console.log('[ANTILINK] Error al expulsar:', err?.message || err); }
        delete avisosData.groups[from][claveAviso];
        guardarJsonSimple(antilinkAvisosPath, avisosData);
      }
      return;
    }
  }

  // Protocolo de Hielo: 3 advertencias antes de expulsar.
  if (isGroup && !isBot && !isGroupAdmins && !isOwner && body) {
    const modData = cargarJsonSeguro(moderacionPath, moderacionInicial);
    if (modData.activo?.[from] === true && modData.palabras?.length && contienePalabraProhibida(body, modData.palabras)) {
      const actual = obtenerAdvertencias(from, sender);
      const siguiente = Math.min(actual + 1, 3);
      cambiarAdvertencias(from, sender, siguiente);

      if (isBotGroupAdmins) {
        try {
          await sock.sendMessage(from, {
            delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender }
          });
        } catch {}
      }

      if (siguiente >= 3 && isBotGroupAdmins) {
        try {
          await sock.groupParticipantsUpdate(from, [sender], 'remove');
          await enviar(`❄️ *𝐏𝐔𝐑𝐆𝐀 𝐈𝐌𝐏𝐄𝐑𝐈𝐀𝐋*\n\n@${sender.split('@')[0]} alcanzó *3/3 advertencias* y ha sido expulsado.\n\n*Esdeath:* «Tres oportunidades fueron suficientes.»`, { mentions: [sender] });
        } catch {
          await enviar(`❄️ *𝐏𝐔𝐑𝐆𝐀 𝐈𝐌𝐏𝐄𝐑𝐈𝐀𝐋*\n\n@${sender.split('@')[0]} alcanzó *3/3 advertencias*, pero no pude expulsarlo porque necesito ser administrador.`, { mentions: [sender] });
        }
      } else {
        await enviar(`⚠️ *𝐀𝐃𝐕𝐄𝐑𝐓𝐄𝐍𝐂𝐈𝐀 𝐃𝐄 𝐀𝐊𝐀𝐌𝐄*\n\n@${sender.split('@')[0]}, cuida tu lenguaje.\n*Advertencias: ${siguiente}/3*`, { mentions: [sender] });
      }
    }
  }

  // ===================== ANTI-SPAM DE MENSAJES/STICKERS =====================
  if (isGroup && !isBot && !isGroupAdmins && !isOwner && antiSpamActivo(from)) {
    const mensajeActual = info?.message || {};
    const esStickerActual = Boolean(mensajeActual.stickerMessage) || type === 'stickerMessage';
    const esTextoActual = Boolean(String(body || '').trim());
    const esMensajeRastreable = esStickerActual || esTextoActual || Boolean(
      mensajeActual.imageMessage || mensajeActual.videoMessage || mensajeActual.documentMessage || mensajeActual.audioMessage
    );

    if (esMensajeRastreable) {
      const resultado = registrarAntiSpam(from, sender, esStickerActual);
      if (resultado.excedeMensajes || resultado.excedeStickers) {
        limpiarAntiSpam(from, sender);
        const claveSancion = `${from}:${normalizarJid(sender)}`;
        const nuevaSancion = (antispamSanciones.get(claveSancion) || 0) + 1;
        antispamSanciones.set(claveSancion, nuevaSancion);
        const motivo = resultado.excedeStickers ? 'stickers' : 'mensajes';

        try {
          if (isBotGroupAdmins) {
            await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } });
          }
        } catch {}

        if (nuevaSancion === 1) {
          await enviar(
            `⚠️ *ANTI-SPAM*\n\n@${sender.split('@')[0]}, estás enviando demasiados ${motivo} en muy poco tiempo.\n\n🔔 Esta es tu primera advertencia. Si continúas, serás eliminado del grupo.`,
            { mentions: [sender] }
          );
        } else if (isBotGroupAdmins) {
          await enviar(
            `🚫 *ANTI-SPAM*\n\n@${sender.split('@')[0]} continuó enviando spam después de la advertencia.\n\n⛔ Serás eliminado del grupo.`,
            { mentions: [sender] }
          );
          await new Promise(resolve => setTimeout(resolve, 700));
          try {
            await sock.groupParticipantsUpdate(from, [sender], 'remove');
            antispamSanciones.delete(claveSancion);
          } catch (err) {
            await enviar(`⚠️ *ANTI-SPAM*\n\n@${sender.split('@')[0]} superó nuevamente el límite, pero no pude expulsarlo porque necesito ser administrador.`, { mentions: [sender] });
          }
        } else {
          await enviar(`⚠️ *ANTI-SPAM*\n\n@${sender.split('@')[0]} superó nuevamente el límite, pero necesito ser administrador para expulsarlo.`, { mentions: [sender] });
        }
      }
    }
  }

  // ===================== ACTUALIZACIÓN DESDE GITHUB =====================
  async function actualizarDesdeGitHub() {
    const repoUrl = 'https://github.com/GabrielVB26/Esdeath-BOT.git';
    const cwd = process.cwd();
    const respaldoRoot = path.join(require('os').tmpdir(), `esdeath-update-backup-${Date.now()}`);
    const preservar = ['settings', 'session'];
    let reiniciar = false;

    const mover = (origen, destino) => {
      if (!fs.existsSync(origen)) return false;
      fs.mkdirSync(path.dirname(destino), { recursive: true });
      fs.renameSync(origen, destino);
      return true;
    };

    const restaurar = () => {
      for (const nombre of preservar) {
        const backup = path.join(respaldoRoot, nombre);
        const destino = path.join(cwd, nombre);
        if (!fs.existsSync(backup)) continue;
        if (fs.existsSync(destino)) fs.rmSync(destino, { recursive: true, force: true });
        fs.renameSync(backup, destino);
      }
      try { fs.rmSync(respaldoRoot, { recursive: true, force: true }); } catch {}
    };

    try {
      await enviar('❄️ *INICIANDO ACTUALIZACIÓN*\n\nComprobando si existe una nueva versión de Esdeath-BOT...');

      try { execSync('git --version', { cwd, stdio: 'ignore' }); }
      catch { return enviar('❌ *No puedo actualizar automáticamente.*\n\nNecesito que Git esté instalado en este dispositivo.'); }

      const gitDir = path.join(cwd, '.git');
      const instalacionSinGit = !fs.existsSync(gitDir);

      // Conservamos los datos locales antes de tocar el árbol del repositorio.
      fs.mkdirSync(respaldoRoot, { recursive: true });
      for (const nombre of preservar) {
        mover(path.join(cwd, nombre), path.join(respaldoRoot, nombre));
      }

      if (instalacionSinGit) {
        execSync('git init', { cwd, stdio: 'pipe' });
      }
      try { execSync(`git remote set-url origin ${repoUrl}`, { cwd, stdio: 'pipe' }); }
      catch { execSync(`git remote add origin ${repoUrl}`, { cwd, stdio: 'pipe' }); }

      execSync('git fetch origin main --prune', { cwd, stdio: 'pipe', timeout: 180000 });
      const remoto = execSync('git rev-parse origin/main', { cwd, encoding: 'utf8' }).trim();
      let local = '';
      try { local = execSync('git rev-parse HEAD', { cwd, encoding: 'utf8' }).trim(); } catch {}

      if (local && local === remoto) {
        restaurar();
        return enviar('✅ *El bot ya está actualizado.*');
      }

      // La instalación descargada como ZIP puede tener archivos sin seguimiento.
      // Se eliminan para que Git pueda colocar exactamente la versión del repositorio.
      execSync('git clean -fd -e node_modules/ -e .env', { cwd, stdio: 'pipe' });
      execSync('git reset --hard origin/main', { cwd, stdio: 'pipe', timeout: 180000 });
      restaurar();

      try {
        execSync('npm install --omit=dev', { cwd, stdio: 'pipe', timeout: 300000 });
      } catch (npmError) {
        console.error('[UPDATE] npm install:', npmError.message);
      }

      reiniciar = true;
      await enviar('✅ *ACTUALIZACIÓN DESCARGADA*\n\n♻️ Reiniciando Esdeath-BOT para aplicar los cambios...');

      // Si el bot está bajo start.sh, el supervisor se encargará de levantar
      // la nueva versión. Evitamos arrancar dos procesos simultáneamente.
      if (process.env.ESDEATH_SUPERVISOR === '1') {
        setTimeout(() => process.exit(0), 1200);
      } else {
        const child = spawn(process.execPath, [path.resolve(__filename), ...process.argv.slice(2)], {
          cwd, detached: true, stdio: 'ignore',
          env: { ...process.env, ESDEATH_SUPERVISOR: '0' }
        });
        child.unref();
        setTimeout(() => process.exit(0), 1200);
      }
    } catch (e) {
      console.error('[UPDATE] Error:', e);
      if (!reiniciar) restaurar();
      await enviar('❌ *No pude completar la actualización.*\n\nLa instalación actual no fue reemplazada. Revisa la consola de Termux para ver el motivo.');
    }
  }

  // Los comandos también pueden escribirse sin prefijo.
  // Los mensajes normales caen en default y no generan respuesta.
// Registrar actividad de cada participante para el sistema de fantasmas.
if (isGroup && !isBot) {
  sumarActividad(from, info.key, groupMembers);
}

// ===================== COMANDOS ESDEATH-BOT HABILITADOS =====================
// Solo se ejecutan los comandos de administración, protección y stickers.
// Todo comando que no aparezca aquí queda deshabilitado aunque exista código heredado.
const COMANDOS_ESDEATH_PERMITIDOS = new Set([
  'dolar', 'seradmin', 'noseradmin', 'banuser', 'desbanuser', 'antispam', 'advertenciasall', 'reiniciaradvertenciasall', 'del', 'abrir', 'cerrar', 'menu', 'help', 'bot', 'botglobal', 'reiniciar', 'infobot', 'ping', 'entra', 'welcome', 'bienvenida', 'bang', 'bangp', 'desbangp', 'desbang', 'desban', 'unban', 'invocar', 'fantasmas', 'ghosts', 'ejecutarfantasmas', 'purga', 'anuncio', 'modoadmin', 'etiquetar', 'notify', 'kick', 'ban', 'antilink', 'toimg', 's', 's2', 'sticker', 'palabras', 'filtro', 'wordfilter', 'mute', 'silenciar', 'unmute', 'desmute', 'desilenciar', 'promote', 'promover', 'demote', 'degradar', 'antifalsos', 'antifake', 'advertir', 'warn', 'advertencias', 'warnings', 'quitaradvertencia', 'delwarn', 'reiniciaradvertencias', 'resetwarn', 'agregarpalabra', 'addword', 'eliminarpalabra', 'delword', 'listaofensivas', 'filterwords'
]);
if (comando && !COMANDOS_ESDEATH_PERMITIDOS.has(comando)) return;

switch(comando) {

// Consulta de la tasa oficial BCV. Disponible para cualquier participante del grupo.
case 'dolar': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  const amount = Number(args[0] || 1);
  if (!Number.isFinite(amount) || amount <= 0) {
    return enviar('⚠️ Usa .dólar o .dólar 5.');
  }
  try {
    const res = await fetch('https://bcv.today/api/v1/rate.json', {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    const rate = Number(j?.USD);
    if (!Number.isFinite(rate) || rate <= 0) throw new Error('Tasa inválida');

    // Guardar la última consulta sin alterar las demás opciones del bot.
    const settingsPath = './settings/settings.json';
    const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    settingsData.tasaCambio = {
      ...(settingsData.tasaCambio || {}),
      usdVes: rate,
      fechaVigencia: j.effective_date || j.date || null,
      ultimaConsulta: new Date().toISOString()
    };
    fs.writeFileSync(settingsPath, JSON.stringify(settingsData, null, 2) + '\n');

    const zona = 'America/Caracas';
    const ahora = new Date();
    const fechaParte = new Intl.DateTimeFormat('es-VE', {
      timeZone: zona, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(ahora).replace(/^./, m => m.toUpperCase());
    const horaParte = new Intl.DateTimeFormat('es-VE', {
      timeZone: zona, hour: 'numeric', minute: '2-digit', hour12: true
    }).format(ahora);
    const fechaConsulta = `${fechaParte} · ${horaParte}`;
    const conversion = amount === 1
      ? `🇻🇪 1 USD = *${rate.toFixed(2)} Bs.*`
      : `🇻🇪 ${amount.toLocaleString('es-VE')} USD = *${(rate * amount).toFixed(2)} Bs.*`;
    const extra = amount === 1 ? '\n\nPara calcular otra cantidad, usa: *.dólar 5*' : '';
    return enviar(`💵 *DÓLAR BCV*\n\n${conversion}\n\n🕒 ${fechaConsulta}${extra}`);
  } catch (e) {
    console.error('[ESDEATH/DOLAR]', e?.message || e);
    return enviar('⚠️ No pude consultar la tasa BCV en este momento. Inténtalo nuevamente.');
  }
}
break;

//Comandos owner

case 'banuser': {
  if(!isOwner)return enviar(respuesta.miowner); const objetivo=identidadObjetivo(info,groupMembers); if(!objetivo)return enviar('🚫 Responde al mensaje del usuario o menciona a quien quieres bloquear.');
  const m=obtenerMiembroPorIdentidad(groupMembers,objetivo); const baneados=cargarBaneados(); [objetivo,m?.id,m?.lid,m?.phoneNumber].filter(Boolean).forEach(x=>baneados.add(normalizarJid(x))); guardarBaneados(baneados);
  return enviar(`🚫 *USUARIO BLOQUEADO*\n\n@${String(objetivo).split('@')[0].split(':')[0]} ya no podrá utilizar Esdeath.`,{mentions:[objetivo]});
}
break;
case 'desbanuser': {
  if(!isOwner)return enviar(respuesta.miowner); const objetivo=identidadObjetivo(info,groupMembers); if(!objetivo)return enviar('🧊 Responde al mensaje del usuario o menciona a quien quieres desbloquear.');
  const m=obtenerMiembroPorIdentidad(groupMembers,objetivo); const baneados=cargarBaneados(); [objetivo,m?.id,m?.lid,m?.phoneNumber].filter(Boolean).forEach(x=>baneados.delete(normalizarJid(x))); guardarBaneados(baneados);
  return enviar(`🟢 *USUARIO DESBLOQUEADO*\n\n@${String(objetivo).split('@')[0].split(':')[0]} puede volver a utilizar Esdeath.`,{mentions:[objetivo]});
}
break;

  
  
case 'seradmin': {
  if (!isOwner) return enviar(respuesta.miowner);
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isBotGroupAdmins) return enviar('❄️ Primero necesito ser administradora del grupo.');

  const ownerConfigurado = String(owner || '').trim();
  const miembroOwner = (groupMembers || []).find(p => {
    const ids = [p?.id, p?.lid, p?.phoneNumber].filter(Boolean).map(normalizarJid);
    if (!ownerConfigurado) return false;
    const ownerNormalizado = normalizarJid(ownerConfigurado);
    if (ids.includes(ownerNormalizado)) return true;
    // Si settings.json guarda un número y WhatsApp entrega un LID, usamos
    // también phoneNumber/id para encontrar al mismo participante.
    const ownerNumero = ownerNormalizado.split('@')[0].split(':')[0].replace(/\D/g, '');
    if (ownerNumero && ownerNormalizado.endsWith('@s.whatsapp.net')) {
      return ids.some(id => id.endsWith('@s.whatsapp.net') && id.split('@')[0].split(':')[0].replace(/\D/g, '') === ownerNumero);
    }
    return false;
  });

  if (!miembroOwner) return enviar('❄️ No encuentro al creador guardado como owner entre los participantes del grupo.');
  const objetivoOwner = miembroOwner.id || miembroOwner.lid || miembroOwner.phoneNumber;
  if (!objetivoOwner) return enviar('❄️ El creador no tiene un identificador válido para recibir administrador.');
  if (miembroOwner.admin) return enviar('❄️ Ya tienes administrador, Jefe.');

  try {
    await sock.groupParticipantsUpdate(from, [objetivoOwner], 'promote');
    await enviar(`👑 *Dando admin a mi creador*\n\n@${objetivoOwner.split('@')[0].split(':')[0]}, ahora eres administrador.`, { mentions: [objetivoOwner] });
  } catch (e) {
    console.error('[AUTOADMIN]', e);
    await enviar('❄️ No pude darte administrador. Comprueba que Esdeath tenga administrador en este grupo.');
  }
}
break;

case 'noseradmin': {
  if (!isOwner) return enviar(respuesta.miowner);
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isBotGroupAdmins) return enviar('❄️ Necesito ser administradora para quitarte el admin.');

  const ownerConfigurado = String(owner || '').trim();
  const miembroOwner = (groupMembers || []).find(p => {
    const ids = [p?.id, p?.lid, p?.phoneNumber].filter(Boolean).map(normalizarJid);
    const ownerNormalizado = normalizarJid(ownerConfigurado);
    if (ids.includes(ownerNormalizado)) return true;
    const ownerNumero = ownerNormalizado.split('@')[0].split(':')[0].replace(/\D/g, '');
    return ownerNumero && ownerNormalizado.endsWith('@s.whatsapp.net') && ids.some(id => id.endsWith('@s.whatsapp.net') && id.split('@')[0].split(':')[0].replace(/\D/g, '') === ownerNumero);
  });

  if (!miembroOwner) return enviar('❄️ No encuentro al creador guardado como owner entre los participantes del grupo.');
  const objetivoOwner = miembroOwner.id || miembroOwner.lid || miembroOwner.phoneNumber;
  if (!objetivoOwner) return enviar('❄️ El creador no tiene un identificador válido.');
  if (!miembroOwner.admin) return enviar('❄️ Ya no tienes administrador, Jefe.');
  try {
    await sock.groupParticipantsUpdate(from, [objetivoOwner], 'demote');
    await enviar(`🫡 *ADMIN RETIRADO*\n\n@${objetivoOwner.split('@')[0].split(':')[0]}, he retirado tu administrador por tu orden.`, { mentions: [objetivoOwner] });
  } catch (e) {
    console.error('[NOSERADMIN]', e);
    await enviar('❄️ No pude quitarte administrador.');
  }
}
break;

case 'antispam': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  if (!isBotGroupAdmins) return enviar(respuesta.botadmin);
  const valor = String(args[0] || '').toLowerCase();
  if (!['on','off'].includes(valor)) return enviar(`🛡️ *USO:* .antispam on | .antispam off`);
  const activo = valor === 'on';
  establecerAntiSpam(from, activo);
  limpiarAntiSpamGrupo(from);
  return enviar(activo
    ? '🟢 *ANTI-SPAM ACTIVADO*\n\nEsdeath vigilará ráfagas excesivas de mensajes y stickers consecutivos.'
    : '🔴 *ANTI-SPAM DESACTIVADO*');
}
break;

case 'advertenciasall': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  const data = cargarJsonSeguro(moderacionPath, moderacionInicial);
  const grupo = data.advertencias?.[from] || {};
  const entradas = Object.entries(grupo).filter(([, n]) => Number(n) > 0);
  if (!entradas.length) return enviar('⚠️ *ADVERTENCIAS*\n\nNo hay personas con advertencias en este grupo.');
  const menciones = entradas.map(([jid]) => jid);
  const texto = entradas.map(([jid,n],i) => `${i+1}. @${jid.split('@')[0]} — *${n}*`).join('\n');
  return enviar(`⚠️ *ADVERTENCIAS DEL GRUPO*\n\n${texto}`, { mentions: menciones });
}
break;

case 'reiniciaradvertenciasall': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  const data = cargarJsonSeguro(moderacionPath, moderacionInicial);
  if (data.advertencias?.[from]) data.advertencias[from] = {};
  guardarJsonSeguro(moderacionPath, data);
  return enviar('🧹 *ADVERTENCIAS REINICIADAS*\n\nSe eliminaron todas las advertencias registradas de este grupo.');
}
break;

case 'del': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  if (!isBotGroupAdmins) return enviar(respuesta.botadmin);
  const ctx = info?.message?.extendedTextMessage?.contextInfo;
  if (!ctx?.stanzaId) return enviar('🗑️ Responde al mensaje que quieres eliminar usando `.del`.');
  try {
    await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: ctx.stanzaId, participant: ctx.participant || undefined } });
    return;
  } catch (e) {
    return enviar('❌ No pude eliminar ese mensaje.');
  }
}
break;

case 'abrir': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  if (!isBotGroupAdmins) return enviar(respuesta.botadmin);
  try { await sock.groupSettingUpdate(from, 'not_announcement'); return enviar('🔓 *GRUPO ABIERTO*\n\nTodos los participantes pueden enviar mensajes nuevamente.'); }
  catch { return enviar('❌ No pude abrir el grupo.'); }
}
break;

case 'cerrar': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  if (!isBotGroupAdmins) return enviar(respuesta.botadmin);
  try { await sock.groupSettingUpdate(from, 'announcement'); return enviar('🔒 *GRUPO CERRADO*\n\nSolo los administradores pueden enviar mensajes.'); }
  catch { return enviar('❌ No pude cerrar el grupo.'); }
}
break;

case 'menu':
case 'help': {

    const Mnu = Menu();

    // Enviar imagen del menú completa
    await sock.sendMessage(from, {
        image: { url:getBotImage() },
        caption: Mnu,
        mentions: [sender]
    }, { quoted: info });
}
break;

case 'bot': {
  if (!isGroup) return enviar('❄️ En privado, usa *menu* o *ping*.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  const estado = String(args[0] || '').toLowerCase();
  if (!['on','off'].includes(estado)) return enviar('❄️ Usa *bot on* para activar Esdeath en este grupo o *bot off* para desactivarla.');
  const estados = cargarEstadoGrupos();
  if (estado === 'on') {
    if (estados[from] !== false) return enviar('🟢 *ESDEATH YA ESTÁ ACTIVA EN ESTE GRUPO*');
    estados[from] = true;
    guardarEstadoGrupos(estados);
    return enviar('🟢 *ESDEATH ACTIVADA*\n\nVolveré a responder normalmente en este grupo.');
  }
  if (estados[from] === false) return enviar('🔴 *ESDEATH YA ESTÁ DESACTIVADA EN ESTE GRUPO*');
  estados[from] = false;
  guardarEstadoGrupos(estados);
  return enviar('🔴 *ESDEATH DESACTIVADA EN ESTE GRUPO*\n\nUsa *bot on* para reactivarla.');
}
break;

case 'botglobal': {
  if (!isOwner) return enviar(respuesta.miowner);
  const estado = String(args[0] || '').toLowerCase();
  if (!['on','off'].includes(estado)) return enviar('❄️ Usa *botglobal on* o *botglobal off*.');
  if (estado === 'on') {
    if (botActivo) return enviar('🟢 *BOT GLOBAL YA ESTÁ ACTIVO*');
    guardarEstadoBot(true);
    return enviar('🟢 *BOT GLOBAL ACTIVADO*\n\nEsdeath vuelve a estar disponible en todos los grupos.');
  }
  if (!botActivo) return enviar('🔴 *BOT GLOBAL YA ESTÁ DESACTIVADO*');
  guardarEstadoBot(false);
  return enviar('🔴 *BOT GLOBAL DESACTIVADO*\n\nEsdeath dejará de procesar comandos hasta que uses *botglobal on*.');
}
break;


case 'reiniciar': {
    if (!isOwner) return enviar(respuesta.miowner);
    
    enviar(`❄️ *Por órdenes de Hikaru, voy a reiniciar mi presencia...*`);
    
    console.log("=== REINICIO DE SISTEMA: ORDEN DEL PATRÓN ===");
    
    setTimeout(async () => {
        process.exit(0);
    }, 1500);
}
break;


//información 

case 'infobot': case 'ping': {
let timestamp = speed()
let latensi = speed() - timestamp
uptime = process.uptime()
botinfo = `
╔═【 ❄️ 𝑬𝒔𝒕𝒂𝒅𝒐 𝒅𝒆 𝒍𝒂 𝑺𝒆𝒅𝒆 】═╗
⏰  𝐇𝐎𝐑𝐀 »  ${time}
📅  𝐅𝐄𝐂𝐇𝐀 »  ${data}
🤖  *BOT* »  Esdeath
⚡  𝐕𝐄𝐋𝐎𝐂𝐈𝐃𝐀𝐃 »  ${latensi.toFixed(4)} ms
⏳  𝐆𝐔𝐀𝐑𝐃𝐈𝐀 »  ${runtime(uptime)}
💾  𝐄𝐍𝐄𝐑𝐆𝐈́𝐀 »  ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
❄️  𝐄𝐒𝐓𝐀𝐃𝐎 »  Lista para la batalla
╰─────────
`
sock.sendMessage(from, { image: { url: getBotImage() }, caption: botinfo }, { quoted: info })
}
break 

case 'entra': {
  if (!isOwner) return enviar(respuesta.miowner);
  const enlace = String(args[0] || '').trim();
  const match = enlace.match(/chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/i);
  if (!match) return enviar('❄️ Usa *entra + enlace de invitación de WhatsApp*.');
  try {
    await sock.groupAcceptInvite(match[1]);
    return enviar('🟢 *ESDEATH ENTRÓ AL GRUPO*\n\nLa invitación fue aceptada correctamente.');
  } catch (e) {
    console.error('[ESDEATH/ENTRA]', e?.message || e);
    return enviar('❌ No pude aceptar esa invitación. El enlace puede haber expirado o WhatsApp puede estar rechazándolo.');
  }
}
break;


//AJUSTES DEL GRUPO

case 'welcome':
case 'bienvenida': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  if (!isBotGroupAdmins) return enviar('❄️ Necesito ser administrador del grupo para gestionar las bienvenidas.');
  const opcion = String(args[0] || '').toLowerCase();
  if (!['on','off'].includes(opcion)) return enviar('❄️ Usa *welcome on* para activar o *welcome off* para desactivar.');
  if (opcion === 'on') {
    if (welkom.includes(from)) return enviar('🟢 *La bienvenida ya está activada en este grupo.*');
    welkom.push(from);
    fs.writeFileSync('./settings/Grupo/Json/welkom.json', JSON.stringify([...new Set(welkom)], null, 2));
    return enviar('🟢 *BIENVENIDA ACTIVADA*\n\nEsdeath dará la bienvenida a los nuevos integrantes.');
  }
  if (!welkom.includes(from)) return enviar('🔴 *La bienvenida ya está desactivada en este grupo.*');
  const indice = welkom.indexOf(from);
  welkom.splice(indice, 1);
  fs.writeFileSync('./settings/Grupo/Json/welkom.json', JSON.stringify(welkom, null, 2));
  return enviar('🔴 *BIENVENIDA DESACTIVADA*\n\nEsdeath dejará de enviar bienvenidas automáticas.');
}
break

case 'bang':
case 'bangp': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isOwner) return enviar('❄️ Solo el creador puede bloquear este grupo.');

  const JsonGp = './settings/Grupo/Json/grupo.json';
  if (bngp.includes(from)) return enviar('🔴 *Este grupo ya está bloqueado.*');
  bngp.push(from);
  bngp = [...new Set(bngp)];
  fs.writeFileSync(JsonGp, JSON.stringify(bngp, null, 2));
  return enviar('🔴 *GRUPO BLOQUEADO*\n\nEsdeath dejará de responder en este grupo hasta que el creador quite la restricción.');
}
break

case 'desbangp':
case 'desbang':
case 'desban':
case 'unban': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isOwner) return enviar('❄️ Solo el creador puede levantar esta restricción.');

  const JsonGp = './settings/Grupo/Json/grupo.json';
  if (!bngp.includes(from)) return enviar('🟢 *Este grupo no está bloqueado.*');
  bngp = bngp.filter(g => g !== from);
  fs.writeFileSync(JsonGp, JSON.stringify(bngp, null, 2));
  return enviar('🟢 *RESTRICCIÓN LEVANTADA*\n\nEsdeath vuelve a estar disponible en este grupo.');
}
break

case 'invocar': {
  if (!isGroup) return enviar('❄️ Esta técnica solo funciona dentro de los grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);

  const miembros = Array.isArray(groupMembers) ? groupMembers : [];
  if (!miembros.length) return enviar('❄️ No pude obtener la lista de miembros del grupo.');

  const menciones = [];
  const filas = miembros.map((miembro, indice) => {
    const jid = miembro?.id || miembro?.lid || miembro?.phoneNumber;
    if (!jid) return `│ ${indice + 1}. Identificador no disponible`;
    menciones.push(jid);
    const numero = String(jid).split('@')[0].split(':')[0];
    return `│ ${indice + 1}. @${numero}`;
  });

  const texto = `╭─〔 *📢 INVOCACIÓN* 〕
│ ❄️ *Aparezcan todos.*
│ 👥 *Total:* ${miembros.length}
╰────────────

╭─〔 *👥 MIEMBROS* 〕
${filas.join('\n')}
╰────────────`;

  await sock.sendMessage(from, { text: texto, mentions: menciones }, { quoted: info });
  break;
}

case 'fantasmas': case 'ghosts': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  const limite = Number(args[0]);
  if (!Number.isInteger(limite) || limite < 0) {
    return enviar('❄️ Usa `.fantasmas <cantidad>`. Ejemplo: `.fantasmas 10`.');
  }

  const actividad = obtenerActividad(from);
  const fantasmas = groupMembers
    .filter(p => p?.id && !p.admin && !String(p.id).includes('status@broadcast'))
    .map(p => ({ id: p.id, mensajes: contarMensajesFantasma(p, actividad) }))
    .filter(p => p.mensajes < limite)
    .sort((a, b) => a.mensajes - b.mensajes);

  if (!fantasmas.length) {
    return enviar(`❄️ *REVISIÓN DE FANTASMAS*\n\nNo encontré miembros con menos de *${limite} mensajes*.`);
  }

  const lista = fantasmas.slice(0, 40)
    .map((p, i) => `│ ${i + 1}. @${String(p.id).split('@')[0]} — ${p.mensajes} mensaje(s)`)
    .join('\n');
  const texto = `╭─〔 *👻 FANTASMAS* 〕
│ ❄️ *REVISIÓN DE ACTIVIDAD*
│ Umbral: *${limite} mensajes*
│ Encontrados: *${fantasmas.length}*
╰────────────

${lista}${fantasmas.length > 40 ? `\n\n… y ${fantasmas.length - 40} más.` : ''}

Usa *.ejecutarfantasmas ${limite}* para expulsar a los miembros encontrados.`;
  return sock.sendMessage(from, {
    text: texto,
    mentions: fantasmas.slice(0, 40).map(p => p.id)
  }, { quoted: info });
}
break;

case 'ejecutarfantasmas': case 'purga': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  const limite = Number(args[0]);
  if (!Number.isInteger(limite) || limite < 0) {
    return enviar('❄️ Usa `.ejecutarfantasmas <cantidad>`. Ejemplo: `.ejecutarfantasmas 10`.');
  }
  if (!isBotGroupAdmins) return enviar(respuesta.botadmin);

  const actividad = obtenerActividad(from);
  const objetivos = groupMembers.filter(p =>
    p?.id && !p.admin && !String(p.id).includes('status@broadcast') &&
    contarMensajesFantasma(p, actividad) < limite
  );

  if (!objetivos.length) return enviar('❄️ No hay fantasmas que expulsar con ese límite.');

  // Evitar enviar identificadores duplicados y limitar la acción a participantes normales.
  const ids = [...new Set(objetivos.map(p => p.id))];
  try {
    await sock.groupParticipantsUpdate(from, ids, 'remove');
    return enviar(`╭─〔 *❄️ PURGA DE FANTASMAS* 〕
│ 👻 Eliminados: *${ids.length}*
│ 📊 Límite: menos de *${limite} mensajes*
╰────────────

❄️ *La limpieza ha terminado.*`);
  } catch (e) {
    console.log('[FANTASMAS] No se pudo completar la purga:', e?.message || e);
    return enviar('⚠️ No pude completar la purga. Comprueba que sigo siendo administrador y que tengo permisos para expulsar miembros.');
  }
}
break;

case 'anuncio':{
if(!isGroup) return enviar('Esta técnica de comunicación solo es válida dentro de los grupos')
if(!isGroupAdmins) return enviar('Solo los Administradores tienen autoridad para emitir anuncios generales.') 
if(!q) return enviar('Debe proporcionar el mensaje para el anuncio.')
men = []
num = 0
teks = `
❄️ ❝ *AVISO DE LOS ADMINISTRADORES* ❞
 👉 ❝ ${q} ❞ 👈 
\n`
for(let m of groupMembers){
num +=1 
teks += `• [${num.toString()}] @${m.id.split('@')[0]}\n`
men.push(m.id)
}
mentions(teks,men,true)
}
break 

case 'modoadmin': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  const estado = String(args[0] || '').toLowerCase();
  if (!['on','off'].includes(estado)) return enviar('❄️ Usa *modoadmin on* para limitar los comandos a administradores o *modoadmin off* para permitirlos a todos.');
  const JsonModoAdmin = './settings/Grupo/Json/modo_admin.json';
  let modoAdmin = cargarJsonSimple(JsonModoAdmin, []);
  if (!Array.isArray(modoAdmin)) modoAdmin = [];
  if (estado === 'on') {
    if (modoAdmin.includes(from)) return enviar('🟢 *MODO ADMIN YA ESTÁ ACTIVADO*');
    modoAdmin.push(from);
    guardarJsonSimple(JsonModoAdmin, [...new Set(modoAdmin)]);
    return enviar('🟢 *MODO ADMIN ACTIVADO*\n\nSolo los administradores podrán usar los comandos del grupo.');
  }
  if (!modoAdmin.includes(from)) return enviar('🔴 *MODO ADMIN YA ESTÁ DESACTIVADO*');
  modoAdmin = modoAdmin.filter(g => g !== from);
  guardarJsonSimple(JsonModoAdmin, modoAdmin);
  return enviar('🔴 *MODO ADMIN DESACTIVADO*\n\nLos miembros vuelven a tener acceso a los comandos permitidos.');
}
break;

case 'etiquetar' :
case 'notify' :
  if(!isGroupAdmins) return enviar("Solo los Administradores pueden convocar a las filas de esta manera.")
  if(!isGroup) return enviar('Esta acción no puede ejecutarse en un chat privado.')
  if(!q) return enviar('Debe escribir el mensaje para que los Administradores notifiquen a las filas.')
  
  var group = await sock.groupMetadata(from)
  var member = group['participants']
  var mem = []
  member.map(async adm => {
    mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
  })
  
  var optionshidetag = {
    text : `❄️ *NOTIFICACIÓN DE LOS ADMINISTRADORES:*\n\n${q}`,
    contextInfo: { mentionedJid: mem },
    quoted: info
  }
  sock.sendMessage(from, optionshidetag)
break


case 'kick' :
case 'ban' :{
if (!isGroup) return  
if(!isGroupAdmins) return enviar('Solo los Administradores tienen autoridad para expulsar a un integrante.')
if(!isBotGroupAdmins) return enviar (respuesta.botadmin)
let mentioned = obtenerObjetivo(info, args[0], groupMembers);

if (!mentioned) return enviar("⚠️ Debe etiquetar a un integrante para ser eliminado por mi.");

if(mentioned === BotNumber || mentioned === owner) return enviar(`🤨 No seas ridículo. Jamás osaría eliminar a mi creador`)
await sock.groupParticipantsUpdate(from, [mentioned] , 'remove')
enviar(`❄️ El objetivo ha sido eliminado por mi bajo las órdenes del admin.`)
}
break 
     
case 'antilink': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar('Solo los Administradores pueden gestionar las barreras del sector.');
  if (!isBotGroupAdmins) return enviar(respuesta.botadmin);

  const valor = String(args[0] || '').toLowerCase();
  if (!['on', 'off'].includes(valor)) {
    return enviar('❄️ Usa *antilink on* para activar o *antilink off* para desactivar.');
  }

  const activar = valor === 'on';
  const cfg = cargarConfigAntilink();
  cfg.enabled = cfg.enabled || [];
  cfg.disabled = cfg.disabled || [];

  if (activar) {
    cfg.disabled = cfg.disabled.filter(g => g !== from);
    if (!cfg.enabled.includes(from)) cfg.enabled.push(from);
    guardarConfigAntilink(cfg);
    return enviar('🟢 *ANTILINK ACTIVADO*\n\nEsdeath eliminará y expulsará a quien envíe enlaces de WhatsApp o enlaces prohibidos.');
  }

  if (!cfg.disabled.includes(from)) cfg.disabled.push(from);
  guardarConfigAntilink(cfg);
  return enviar('🔴 *ANTILINK DESACTIVADO*\n\nLa protección contra enlaces queda desactivada en este grupo.');
}
break;

case 'toimg': {
  if (!isQuotedSticker) return enviar('❄️ Responde a un sticker estático para convertirlo en imagen.');
  try {
    const buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker');
    await sock.sendMessage(from, { image: buff, caption: '❄️ *CONVERSIÓN COMPLETADA*' }, { quoted: info });
  } catch {
    return enviar('⚠️ No pude convertir ese sticker. Asegúrate de que sea un sticker estático.');
  }
}
break;

case 's2': {
  const quotedMessage = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const unwrapMedia = (message) => {
    if (!message) return null;
    return message.videoMessage
      || message.viewOnceMessageV2?.message?.videoMessage
      || message.viewOnceMessage?.message?.videoMessage
      || message.viewOnceMessageV2Extension?.message?.videoMessage
      || null;
  };
  const video = unwrapMedia(info.message) || unwrapMedia(quotedMessage);

  if (!video) {
    return enviar('❄️ *STICKER CON SONIDO*\n\nEnvía un vídeo con audio o responde directamente a un vídeo con el comando *.s2*.\n\nDuración máxima: 10 segundos.');
  }
  if (!video.seconds || video.seconds > 10) {
    return enviar('⚠️ El vídeo debe durar 10 segundos o menos para crear el sticker con sonido.');
  }

  try {
    const { encolarStickerConSonido, obtenerEstadoCola } = require('./fuction/sticker/sound');
    const estado = obtenerEstadoCola();
    const posicion = estado.enEspera + (estado.procesando ? 1 : 0) + 1;
    if (posicion > 1) {
      await enviar(`❄️ *SOLICITUD EN COLA*\n\nTu sticker con sonido ocupa el puesto *${posicion}*. Se procesará automáticamente cuando termine el anterior.`);
    } else {
      await enviar('❄️ *Procesando tu sticker con sonido...*\n\nEstoy preparando la animación y el audio. Espera un momento.');
    }

    const pack = `❄️ ESDEATH-BOT ❄️\n👑 Creador: Hikaru\n⭐ Sticker solicitado por: ${pushname}\n `;
    const author = `❄️ Esdeath-BOT | ${groupName} `;
    await encolarStickerConSonido(sock, from, video, {
      quoted: info,
      seconds: Math.min(10, Number(video.seconds) || 10),
      packname: pack,
      author
    });

  } catch (error) {
    console.error('[S2] Error:', error?.stack || error);
    const detalle = String(error?.message || error || 'Error desconocido').slice(0, 220);
    await enviar(`⚠️ *NO SE PUDO CREAR EL STICKER CON SONIDO*\n\n${detalle}\n\nComprueba que el vídeo tenga audio y vuelve a intentarlo.`);
  }
}
break;

case 's':
case 'sticker':


  // Primero detectamos si hay un mensaje citado
  var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
  
  // Modificado: Ahora el bot mira el mensaje actual ANTES que el citado para permitir enviar foto + s
  var boij2 = info.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage
  var boij = info.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage

  var pack = `❄️ ESDEATH-BOT ❄️\n👑 Creador: Hikaru\n⭐ Sticker solicitado por: ${pushname}\n `
  var author2 = `❄️ Esdeath-BOT | ${groupName} `

  if(boij2){
    enviar(`❄️ *Creando sticker, espera un momento...*`)
    owgi = await getFileBuffer(boij2, 'image')
    let encmediaa = await sendImageAsSticker2(sock, from, owgi, info, { packname:pack, author:author2})
    await DLT_FL(encmediaa)
    
  } else if(boij && boij.seconds < 11){
    enviar(`❄️ Creando sticker, espera un momento...`)
    owgi = await getFileBuffer(boij, 'video')
    let encmedia = await sendVideoAsSticker2(sock, from, owgi, info, { packname:pack, author:author2})
    await DLT_FL(encmedia)
    
  } else {
    return enviar(`❄️ Envía o responde a una imagen o vídeo de máximo 10 segundos.`)
  }
break

//Nesecita clave API ////
case 'palabras': case 'filtro': case 'wordfilter': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  const valor = String(args[0] || '').toLowerCase();
  if (!['on','off'].includes(valor)) return enviar('❄️ Usa *palabras on* para activar o *palabras off* para desactivar.');
  const data = cargarJsonSeguro(moderacionPath, moderacionInicial);
  if (!data.activo) data.activo = {};
  data.activo[from] = valor === 'on';
  guardarJsonSeguro(moderacionPath, data);
  await enviar(`❄️ *FILTRO DE PALABRAS ${valor === 'on' ? 'ACTIVADO' : 'DESACTIVADO'}*`);
}
break;


case 'mute': case 'silenciar': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  if (!isBotGroupAdmins) return enviar(respuesta.botadmin);

  const objetivo = obtenerObjetivo(info, args[0], groupMembers);
  if (!esObjetivoValido(objetivo)) return enviar('❄️ Responde al mensaje del usuario o usa .mute @usuario / .mute número.');
  if (objetivo === sender || objetivo === BotNumber || numerodono.includes(objetivo)) return enviar('❄️ Ese objetivo no puede ser silenciado.');
  const miembro = groupMembers.find(p => p.id === objetivo);
  if (miembro?.admin) return enviar('❄️ No puedo silenciar a un administrador. Primero quítale el admin.');

  const dataMute = cargarJsonSimple(mutePath, { groups: {} });
  if (!dataMute.groups[from]) dataMute.groups[from] = [];
  const idsMute = [objetivo, miembro?.lid].filter(Boolean);
  for (const id of idsMute) {
    if (!dataMute.groups[from].some(jid => mismoJid(jid, id))) dataMute.groups[from].push(id);
  }
  guardarJsonSimple(mutePath, dataMute);

  await enviar(`🔇 *MUTE ACTIVADO*\n\n@${objetivo.split('@')[0].split(':')[0]} quedará silenciado y sus mensajes serán eliminados automáticamente mientras Esdeath sea administradora.`, { mentions: [objetivo] });
}
break;

case 'unmute': case 'desmute': case 'desilenciar': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);

  const objetivo = obtenerObjetivo(info, args[0], groupMembers);
  if (!esObjetivoValido(objetivo)) return enviar('❄️ Responde al mensaje del usuario o usa .unmute @usuario / .unmute número.');

  const dataMute = cargarJsonSimple(mutePath, { groups: {} });
  const lista = dataMute.groups[from] || [];
  const miembroObjetivo = obtenerMiembroPorIdentidad(groupMembers, objetivo);
  const idsObjetivo = [objetivo, miembroObjetivo?.id, miembroObjetivo?.lid].filter(Boolean);
  dataMute.groups[from] = lista.filter(jid => !idsObjetivo.some(id => mismoJid(jid, id)));
  guardarJsonSimple(mutePath, dataMute);

  await enviar(`🔊 *MUTE DESACTIVADO*\n\n@${objetivo.split('@')[0].split(':')[0]} ya puede enviar mensajes normalmente.`, { mentions: [objetivo] });
}
break;

case 'promote': case 'promover': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  if (!isBotGroupAdmins) return enviar(respuesta.botadmin);

  const objetivo = obtenerObjetivo(info, args[0], groupMembers);
  if (!esObjetivoValido(objetivo)) return enviar('❄️ Responde al mensaje o usa .promote @usuario / .promote número.');
  try {
    await sock.groupParticipantsUpdate(from, [objetivo], 'promote');
    await enviar(`🛡️ *ADMIN OTORGADO*\n\n@${objetivo.split('@')[0].split(':')[0]} ahora es administrador.`, { mentions: [objetivo] });
  } catch (e) {
    await enviar(`❄️ No pude dar administrador a ese usuario.\n\n${e.message || 'WhatsApp rechazó la operación.'}`);
  }
}
break;

case 'demote': case 'degradar': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  if (!isBotGroupAdmins) return enviar(respuesta.botadmin);

  const objetivo = obtenerObjetivo(info, args[0], groupMembers);
  if (!esObjetivoValido(objetivo)) return enviar('❄️ Responde al mensaje o usa .demote @usuario / .demote número.');
  if (objetivo === BotNumber || objetivo === sender) return enviar('❄️ No voy a quitarle el admin a ese objetivo.');

  try {
    await sock.groupParticipantsUpdate(from, [objetivo], 'demote');
    await enviar(`🛡️ *ADMIN RETIRADO*\n\n@${objetivo.split('@')[0].split(':')[0]} ya no es administrador.`, { mentions: [objetivo] });
  } catch (e) {
    await enviar(`❄️ No pude quitarle el administrador a ese usuario.\n\n${e.message || 'WhatsApp rechazó la operación.'}`);
  }
}
break;

case 'antifalsos': case 'antifake': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  if (!isBotGroupAdmins) return enviar(respuesta.botadmin);

  const valor = String(args[0] || '').toLowerCase();
  const antiData = cargarJsonSimple(antifalsosPath, { groups: {} });
  if (valor === 'on') {
    antiData.groups[from] = true;
    guardarJsonSimple(antifalsosPath, antiData);
    return enviar('🛡️ *ANTIFALSOS ACTIVADO*\n\nEsdeath vigilará identificadores de WhatsApp anómalos o no válidos. Se rechazan solicitudes con prefijos configurados como árabes o identificadores claramente inválidos.');
  }
  if (valor === 'off') {
    antiData.groups[from] = false;
    guardarJsonSimple(antifalsosPath, antiData);
    return enviar('🛡️ *ANTIFALSOS DESACTIVADO*');
  }
  return enviar('❄️ Usa .antifalsos on o .antifalsos off.');
}
break;

case 'advertir': case 'warn': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  const objetivo = obtenerObjetivo(info, args[0], groupMembers);
  if (!objetivo) return enviar('❄️ Menciona a un usuario o responde a su mensaje para advertirlo.');
  const actual = obtenerAdvertencias(from, objetivo);
  const nuevo = Math.min(3, actual + 1);
  cambiarAdvertencias(from, objetivo, nuevo);
  await enviar(`⚠️ *𝐀𝐃𝐕𝐄𝐑𝐓𝐄𝐍𝐂𝐈𝐀*\n\n@${objetivo.split('@')[0]} tiene *${nuevo}/3* advertencias.\n\n*Esdeath:* «La próxima decisión será más severa.»`, { mentions: [objetivo] });
}
break;

case 'advertencias': case 'warnings': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  const objetivo = obtenerMencionado(info) || sender;
  const cantidad = obtenerAdvertencias(from, objetivo);
  await enviar(`⚠️ *𝐀𝐃𝐕𝐄𝐑𝐓𝐄𝐍𝐂𝐈𝐀𝐒*\n\n@${objetivo.split('@')[0]} tiene *${cantidad}/3* advertencias.`, { mentions: [objetivo] });
}
break;

case 'quitaradvertencia': case 'delwarn': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  const objetivo = obtenerObjetivo(info, args[0], groupMembers);
  if (!objetivo) return enviar('❄️ Menciona a un usuario o responde a su mensaje.');
  const nuevo = Math.max(0, obtenerAdvertencias(from, objetivo) - 1);
  cambiarAdvertencias(from, objetivo, nuevo);
  await enviar(`❄️ Se eliminó una advertencia a @${objetivo.split('@')[0]}. Ahora tiene *${nuevo}/3*.`, { mentions: [objetivo] });
}
break;

case 'reiniciaradvertencias': case 'resetwarn': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  const objetivo = obtenerObjetivo(info, args[0], groupMembers);
  if (!objetivo) return enviar('❄️ Menciona a un usuario o responde a su mensaje.');
  cambiarAdvertencias(from, objetivo, 0);
  await enviar(`❄️ Las advertencias de @${objetivo.split('@')[0]} han sido reiniciadas.`, { mentions: [objetivo] });
}
break;

case 'agregarpalabra': case 'addword': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  const palabra = normalizarTextoModeracion(q);
  if (!palabra) return enviar('❄️ Escribe una palabra para añadir.');
  const data = cargarJsonSeguro(moderacionPath, moderacionInicial);
  if (!data.palabras.includes(palabra)) data.palabras.push(palabra);
  guardarJsonSeguro(moderacionPath, data);
  await enviar(`❄️ La palabra *${palabra}* ha sido añadida a la Protocolo de Hielo.`);
}
break;

case 'eliminarpalabra': case 'delword': {
  if (!isGroup) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  const palabra = normalizarTextoModeracion(q);
  const data = cargarJsonSeguro(moderacionPath, moderacionInicial);
  data.palabras = data.palabras.filter(p => p !== palabra);
  guardarJsonSeguro(moderacionPath, data);
  await enviar(`❄️ La palabra *${palabra || 'indicada'}* ha sido eliminada del filtro.`);
}
break;

case 'listaofensivas': case 'filterwords': {
  if (!isGroup && !isOwner) return enviar('❄️ Este comando solo funciona en grupos.');
  if (!isGroupAdmins && !isOwner) return enviar(respuesta.admin);
  const data = cargarJsonSeguro(moderacionPath, moderacionInicial);
  await enviar(`❄️ *𝐏𝐀𝐋𝐀𝐁𝐑𝐀𝐒 𝐕𝐈𝐆𝐈𝐋𝐀𝐃𝐀𝐒*\n\n${data.palabras.map((p, i) => `${i + 1}. ${p}`).join('\n')}`);
}
break;

// Los mensajes o comandos no habilitados se ignoran.
default:
  break;

} // Cierre del switch principal

} catch (e) {
    e = String(e)
    if (!e.includes("this.isZero") && !e.includes("Could not find MIME for Buffer <null>") && !e.includes("Cannot read property 'conversation' of null") && !e.includes("Cannot read property 'contextInfo' of undefined") && !e.includes("Cannot set property 'mtype' of undefined") && !e.includes("jid is not defined")) {
        console.log('Error detectado por Esdeath-BOT: %s', color(e, 'red'))
    }
}

})
}

/////////// MONITOREO DEL ARCHIVO
// Iniciar los limpiadores de cooldown una sola vez.
// Antes estaban dentro de messages.upsert y podían crear intervalos repetidos por cada mensaje.

startProo()
fs.watchFile('./index.js', (curr, prev) => {
    if (curr.mtime.getTime() !== prev.mtime.getTime()) {
        console.log(color('  [❗] ¡Atención Esdeath! El archivo Index fue modificado. Reiniciando...',"blue"));
        process.exit()
    }
})
