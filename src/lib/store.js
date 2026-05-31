// Store d'état global du bot
import { config } from '../config.js';

export const botState = {
  state: 'disconnected',
  qrCode: null,
  phoneNumber: null,
  name: config.botName,
  startTime: null,
  messagesHandled: 0,
  commandsExecuted: 0,
  activeGroups: new Set(),
};

// Paramètres dynamiques (modifiables par commandes)
export const settings = {
  mode: config.mode,
  autoRead: config.autoRead,
  autoStatus: config.autoStatus,
  antiCall: config.antiCall,
  antiSpam: config.antiSpam,
  pmBlocker: config.pmBlocker,
  antilink: new Map(),
  antibadword: new Map(),
  welcome: new Map(),
  goodbye: new Map(),
  warns: new Map(),
  mentionReply: '',
};

export function setState(state) { botState.state = state; }
export function setPhoneNumber(num) { botState.phoneNumber = num; }
export function setConnected(num, name) {
  botState.state = 'connected';
  botState.phoneNumber = num;
  botState.name = name || config.botName;
  botState.startTime = botState.startTime || new Date();
}
export function incrementMessages() { botState.messagesHandled++; }
export function incrementCommands() { botState.commandsExecuted++; }
export function addGroup(jid) { botState.activeGroups.add(jid); }
export function getUptime() {
  if (!botState.startTime) return 0;
  return Math.floor((Date.now() - botState.startTime.getTime()) / 1000);
}
export function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
