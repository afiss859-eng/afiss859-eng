import { config } from '../config.js';

export function isOwner(jid) {
  return jid.replace('@s.whatsapp.net', '').replace(/[^0-9]/g, '') === config.ownerNumber.replace(/[^0-9]/g, '');
}

export async function isAdmin(sock, groupJid, userJid) {
  try {
    const meta = await sock.groupMetadata(groupJid);
    return meta.participants.some(p =>
      p.id === userJid && (p.admin === 'admin' || p.admin === 'superadmin')
    );
  } catch { return false; }
}

export async function isBotAdmin(sock, groupJid) {
  try {
    const meta = await sock.groupMetadata(groupJid);
    const botJid = sock.user.id;
    return meta.participants.some(p =>
      p.id === botJid && (p.admin === 'admin' || p.admin === 'superadmin')
    );
  } catch { return false; }
}

export function getMentions(msg) {
  return msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
}

export function getQuotedMsg(msg) {
  return msg.message?.extendedTextMessage?.contextInfo;
}

export function getBodyText(msg) {
  return (
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    msg.message?.documentMessage?.caption ||
    ''
  );
}

export function getSenderJid(msg) {
  return msg.key.participant || msg.key.remoteJid || '';
}

export function parseCommand(text, prefix) {
  if (!text.startsWith(prefix)) return null;
  const parts = text.slice(prefix.length).trim().split(/\s+/);
  return {
    command: parts[0]?.toLowerCase() || '',
    args: parts.slice(1),
    text: parts.slice(1).join(' '),
  };
}

export function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export function numFmt(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
  return String(n);
}
