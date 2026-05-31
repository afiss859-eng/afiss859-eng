/**
 * 𓅂 LUCIFERO BOT — Connexion par Pair Code (sans QR)
 *
 * Ce script génère un code à 8 chiffres pour connecter le bot
 * sans avoir besoin de scanner un QR code.
 *
 * Utilisation:
 *   npm run pair
 *   node src/pair.js
 */

import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { existsSync, mkdirSync } from 'fs';
import readline from 'readline';
import chalk from 'chalk';
import { config } from './config.js';

if (!existsSync(config.sessionDir)) {
  mkdirSync(config.sessionDir, { recursive: true });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

function formatPhone(num) {
  return num.replace(/[^0-9]/g, '');
}

console.log(chalk.red(`
╔═━━━═══━━━⟬ 𓅂 PAIR CODE 𓅂 ⟭━━━═══━━━╗
║  Connexion sans QR — Entre ton numéro
║  Format: 221771234567 (avec indicatif)
╚═━━━═══━━━═══━━━═══━━━═══━━━═══╝
`));

async function requestPairCode() {
  let phoneNumber = await question(chalk.cyan('📱 Ton numéro WhatsApp (ex: 221771234567): '));
  phoneNumber = formatPhone(phoneNumber.trim());

  if (!phoneNumber || phoneNumber.length < 7) {
    console.log(chalk.red('❌ Numéro invalide.'));
    process.exit(1);
  }

  console.log(chalk.yellow(`\n⏳ Génération du code pour le numéro: ${phoneNumber}...\n`));

  const { version } = await fetchLatestBaileysVersion();
  const { state: authState, saveCreds } = await useMultiFileAuthState(config.sessionDir);

  const sock = makeWASocket({
    version,
    auth: authState,
    printQRInTerminal: false,
    logger: { level: 'silent', child: () => ({ level: 'silent', info: () => {}, error: () => {}, warn: () => {}, debug: () => {}, trace: () => {}, fatal: () => {} }) },
    browser: ['𓅂 LUCIFERO 𓅂', 'Chrome', config.botVersion],
    mobile: false,
  });

  // Demander le pair code
  if (!sock.authState.creds.registered) {
    await new Promise(r => setTimeout(r, 1500));
    try {
      const code = await sock.requestPairingCode(phoneNumber);
      const formatted = code?.match(/.{1,4}/g)?.join('-') || code;

      console.log(chalk.green(`
╔═━━━═══━━━⟬ 🔑 TON CODE ⟭━━━═══━━━╗
║
║   ${chalk.white.bold(formatted)}
║
╚═━━━═══━━━═══━━━═══━━━═══━━━═══╝

📋 Comment l'utiliser:
   1. Ouvre WhatsApp sur ton téléphone
   2. Va dans: Paramètres → Appareils liés
   3. Appuie sur "Lier un appareil"
   4. Choisis "Lier avec numéro de téléphone"
   5. Entre le code ci-dessus

⏳ Le code expire dans 60 secondes !
      `));
    } catch (err) {
      console.log(chalk.red(`❌ Erreur: ${err.message}`));
      process.exit(1);
    }
  }

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
      const user = sock.user;
      console.log(chalk.green(`\n✅ CONNECTÉ avec succès !`));
      console.log(chalk.green(`👤 Compte: ${user?.name || 'Unknown'} (${user?.id?.split(':')[0]})`));
      console.log(chalk.cyan(`\n🚀 Lance maintenant le bot avec: npm start\n`));
      rl.close();
      setTimeout(() => process.exit(0), 2000);
    }

    if (connection === 'close') {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (statusCode === DisconnectReason.loggedOut) {
        console.log(chalk.red('❌ Session invalide. Relance le script.'));
        process.exit(1);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);
}

requestPairCode().catch((err) => {
  console.error(chalk.red(`❌ Erreur fatale: ${err.message}`));
  process.exit(1);
});
