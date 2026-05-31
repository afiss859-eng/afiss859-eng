import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Charger config.env
const envPath = resolve(ROOT, 'config.env');
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

export const config = {
  ownerNumber: process.env.OWNER_NUMBER || '0000000000',
  ownerName: process.env.OWNER_NAME || 'DEV TECH',
  botName: process.env.BOT_NAME || '𓅂𝐃𝚯𝐌𝚫 𝐋𝐔𝐂𝐈𝐅𝚵𝐑𝚯 𓅂',
  botVersion: process.env.BOT_VERSION || '1.0.0',
  prefix: process.env.PREFIX || '.',
  mode: process.env.MODE || 'public',
  autoRead: process.env.AUTO_READ === 'true',
  autoStatus: process.env.AUTO_STATUS === 'true',
  antiCall: process.env.ANTI_CALL !== 'false',
  antiSpam: process.env.ANTI_SPAM !== 'false',
  pmBlocker: process.env.PM_BLOCKER === 'true',
  openaiKey: process.env.OPENAI_API_KEY || '',
  geminiKey: process.env.GEMINI_API_KEY || '',
  sessionId: process.env.SESSION_ID || '',
  sessionDir: resolve(ROOT, 'session'),
  rootDir: ROOT,
};

export const BOT_NAME = config.botName;
export const PREFIX = config.prefix;
export const OWNER = config.ownerNumber;
