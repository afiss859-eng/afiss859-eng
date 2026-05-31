import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { existsSync, mkdirSync } from 'fs';
import { logger } from './lib/logger.js';
import { setState, setConnected } from './lib/store.js';
import { onMessage, onCall, onGroupUpdate } from './handlers/message.js';
import { config } from './config.js';
import chalk from 'chalk';

// Banner de démarrage
console.log(chalk.red(`
╔═━━━═══━━━⟬ 𓅂 LUCIFERO BOT 𓅂 ⟭━━━═══━━━╗
║     🔥 𝐃𝚯𝐌𝚫 𝐋𝐔𝐂𝐈𝐅𝚵𝐑𝚯 — v${config.botVersion}
║     WhatsApp XMD Multi-Device Bot
║     Owner: ${config.ownerName}
╚═━━━═══━━━═══━━━═══━━━═══━━━═══╝
`));

if (!existsSync(config.sessionDir)) {
  mkdirSync(config.sessionDir, { recursive: true });
}

let retryCount = 0;

async function startBot() {
  try {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    logger.info(`Baileys v${version.join('.')} ${isLatest ? '(latest)' : '(update available)'}`);

    const { state: authState, saveCreds } = await useMultiFileAuthState(config.sessionDir);

    const sock = makeWASocket({
      version,
      auth: authState,
      printQRInTerminal: false,
      logger: { level: 'silent', child: () => ({ level: 'silent', info: () => {}, error: () => {}, warn: () => {}, debug: () => {}, trace: () => {}, fatal: () => {} }) },
      browser: ['𓅂 LUCIFERO 𓅂', 'Chrome', config.botVersion],
      syncFullHistory: false,
      getMessage: async () => ({ conversation: '' }),
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        setState('qr_pending');
        logger.warn('QR code disponible — utilise plutôt le Pair Code: npm run pair');
      }

      if (connection === 'close') {
        const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
        logger.warn(`Connexion fermée — Code: ${statusCode}`);

        if (statusCode === DisconnectReason.loggedOut) {
          logger.error('Bot déconnecté (logged out) — Session supprimée. Relancer avec: npm run pair');
          setState('disconnected');
          process.exit(1);
        } else if (statusCode === DisconnectReason.badSession) {
          logger.error('Session invalide — Supprime le dossier session/ et relance pair code');
          setState('error');
          process.exit(1);
        } else {
          const delay = Math.min(3000 * (retryCount + 1), 30000);
          retryCount++;
          logger.info(`Reconnexion dans ${delay / 1000}s... (tentative ${retryCount})`);
          setState('connecting');
          setTimeout(startBot, delay);
        }
      } else if (connection === 'open') {
        retryCount = 0;
        const user = sock.user;
        const num = user?.id?.split(':')[0] || 'Unknown';
        setConnected(num, user?.name || config.botName);
        logger.success(`✅ Bot connecté ! Numéro: ${num}`);
        logger.success(`👋 Connecté en tant que: ${user?.name || config.botName}`);
        logger.bot(`𓅂 ${config.botName} 𓅂 est ACTIF et prêt !`);
      } else if (connection === 'connecting') {
        setState('connecting');
        logger.info('Connexion en cours...');
      }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', (data) => onMessage(sock, data));

    sock.ev.on('call', (calls) => onCall(sock, calls));

    sock.ev.on('group-participants.update', (data) => onGroupUpdate(sock, data));

    return sock;
  } catch (err) {
    logger.error(`Erreur démarrage: ${err.message}`);
    setTimeout(startBot, 5000);
  }
}

startBot();
