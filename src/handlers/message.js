import { config, PREFIX } from '../config.js';
import { settings, incrementMessages, incrementCommands, addGroup } from '../lib/store.js';
import { isOwner, isAdmin, getBodyText, getSenderJid, parseCommand } from '../lib/utils.js';
import { logger } from '../lib/logger.js';
import { handleCommand } from './commands.js';

export async function onMessage(sock, { messages, type }) {
  if (type !== 'notify') return;

  for (const msg of messages) {
    if (!msg.message) continue;
    if (msg.key.fromMe) continue;

    const jid = msg.key.remoteJid;
    if (!jid) continue;

    const isGroup = jid.endsWith('@g.us');
    const senderJid = getSenderJid(msg);

    incrementMessages();
    if (isGroup) addGroup(jid);

    // Auto-read
    if (settings.autoRead) {
      await sock.readMessages([msg.key]).catch(() => {});
    }

    const text = getBodyText(msg);
    if (!text) continue;

    // Vérifier le mode
    if (settings.mode === 'private' && !isOwner(senderJid) && !isGroup) continue;

    const parsed = parseCommand(text, PREFIX);
    if (!parsed || !parsed.command) continue;

    // PM Blocker
    if (!isGroup && settings.pmBlocker && !isOwner(senderJid)) {
      await sock.sendMessage(jid, {
        text: `❌ *PM BLOCKER ACTIVÉ*\n\nLes messages privés sont bloqués.\nContacte l'owner dans un groupe ou désactive le PM Blocker.`,
      }).catch(() => {});
      continue;
    }

    const ctx = {
      sock,
      msg,
      jid,
      senderJid,
      isGroup,
      isOwner: isOwner(senderJid),
      isAdmin: isGroup ? await isAdmin(sock, jid, senderJid) : true,
      command: parsed.command,
      args: parsed.args,
      text: parsed.text,
      reply: async (content) => {
        if (typeof content === 'string') {
          return sock.sendMessage(jid, { text: content }, { quoted: msg });
        }
        return sock.sendMessage(jid, content, { quoted: msg });
      },
      react: async (emoji) => {
        return sock.sendMessage(jid, { react: { text: emoji, key: msg.key } });
      },
    };

    try {
      incrementCommands();
      logger.cmd(senderJid.split('@')[0], parsed.command);
      await ctx.react('⚡');
      await handleCommand(ctx);
    } catch (err) {
      logger.error(`Erreur commande .${parsed.command}: ${err.message}`);
      await ctx.reply(`❌ Erreur: ${err.message}`).catch(() => {});
    }
  }
}

export async function onCall(sock, calls) {
  if (!settings.antiCall) return;
  for (const call of calls) {
    if (call.status === 'offer') {
      await sock.rejectCall(call.id, call.from).catch(() => {});
      await sock.sendMessage(call.from, {
        text: `╔═━━━⟬ 🚫 *ANTI-CALL ACTIVÉ* ⟭━━━═╗\n║ Les appels sont refusés automatiquement.\n║ Envoie un message textuel à la place.\n╚═━━━═══════════════════════━━━═╝`,
      }).catch(() => {});
    }
  }
}

export async function onGroupUpdate(sock, { id, participants, action }) {
  if (action === 'add' && settings.welcome.get(id)) {
    for (const p of participants) {
      const name = p.split('@')[0];
      await sock.sendMessage(id, {
        text: `╔═━━━⟬ 🎉 *BIENVENUE* 🎉 ⟭━━━═╗\n║ 👋 Bienvenue @${name} !\n║ 🙏 Merci d'avoir rejoint le groupe.\n║ 📜 Merci de lire les règles.\n║ 𓅂 *Bonne ambiance !* 𓅂\n╚═━━━═══════════════════════━━━═╝`,
        mentions: [p],
      }).catch(() => {});
    }
  }
  if (action === 'remove' && settings.goodbye.get(id)) {
    for (const p of participants) {
      await sock.sendMessage(id, {
        text: `👋 *Au revoir @${p.split('@')[0]} !*\nNous espérons te revoir bientôt dans le groupe. Prends soin de toi ! 🙏`,
        mentions: [p],
      }).catch(() => {});
    }
  }
}
