import { config, BOT_NAME, PREFIX } from '../config.js';
import { botState, formatUptime, getUptime } from '../lib/store.js';
import { numFmt } from '../lib/utils.js';

export function getMenu() {
  const uptime = formatUptime(getUptime());
  const msgs = numFmt(botState.messagesHandled);

  return `
╔═━━━═══━━━⟬ 𓅂 *${BOT_NAME}* 𓅂 ⟭━━━═══━━━╗
║  🔥 *Version ${config.botVersion}* — Préfixe: *${PREFIX}*
║  ⏱️ Uptime: *${uptime}* | 📊 Msgs: *${msgs}*
╠═━━━═══━━━═══━━━═══━━━═══━━━╣

╔═━━━⟬ 🖥️ *SYSTÈME* ⟭━━━═╗
║ ⬢ ${PREFIX}menu / ${PREFIX}help
║ ⬢ ${PREFIX}ping — Latence du bot
║ ⬢ ${PREFIX}alive / ${PREFIX}bot — Statut
║ ⬢ ${PREFIX}info / ${PREFIX}runtime
║ ⬢ ${PREFIX}owner — Infos owner
║ ⬢ ${PREFIX}jid — Voir son JID
║ ⬢ ${PREFIX}speed — Test vitesse
╚═━━━═══════════════════════━━━═╝

╔═━━━⟬ 💪 *MOTIVATION* ⟭━━━═╗
║ ⬢ ${PREFIX}motivation — Photo + texte motivant
║ ⬢ ${PREFIX}proverbe — Proverbe du jour
║ ⬢ ${PREFIX}citation / ${PREFIX}quote
║ ⬢ ${PREFIX}musique — Chanson motivation
╚═━━━═══════════════════════━━━═╝

╔═━━━⟬ 🎮 *JEUX* ⟭━━━═╗
║ ⬢ ${PREFIX}truth / ${PREFIX}verite
║ ⬢ ${PREFIX}dare / ${PREFIX}defi
║ ⬢ ${PREFIX}8ball <question>
║ ⬢ ${PREFIX}love <nom1> <nom2>
║ ⬢ ${PREFIX}blague / ${PREFIX}joke
║ ⬢ ${PREFIX}trivia — Quiz culture générale
╚═━━━═══════════════════════━━━═╝

╔═━━━⟬ ✏️ *TEXT EFFECTS* ⟭━━━═╗
║ ⬢ ${PREFIX}neon / ${PREFIX}fire / ${PREFIX}ice
║ ⬢ ${PREFIX}glitch / ${PREFIX}matrix
║ ⬢ ${PREFIX}hacker / ${PREFIX}devil
║ ⬢ ${PREFIX}wave / ${PREFIX}bold
╚═━━━═══════════════════════━━━═╝

╔═━━━⟬ 🌐 *UTILITAIRES* ⟭━━━═╗
║ ⬢ ${PREFIX}weather / ${PREFIX}meteo <ville>
║ ⬢ ${PREFIX}trt <lang> <texte>
║ ⬢ ${PREFIX}url <lien> — Raccourcir
║ ⬢ ${PREFIX}tts <texte>
║ ⬢ ${PREFIX}ss <url>
║ ⬢ ${PREFIX}lyrics <chanson>
╚═━━━═══════════════════════━━━═╝

╔═━━━⟬ 🎭 *MÉDIAS* ⟭━━━═╗
║ ⬢ ${PREFIX}sticker — Créer un sticker
║ ⬢ ${PREFIX}vv — Voir view-once
║ ⬢ ${PREFIX}getpp — Photo de profil
║ ⬢ ${PREFIX}play / ${PREFIX}song <titre>
║ ⬢ ${PREFIX}ytmp4 / ${PREFIX}tiktok <url>
║ ⬢ ${PREFIX}instagram / ${PREFIX}facebook <url>
╚═━━━═══════════════════════━━━═╝

╔═━━━⟬ 🤖 *IA* ⟭━━━═╗
║ ⬢ ${PREFIX}gpt <question>
║ ⬢ ${PREFIX}gemini <question>
╚═━━━═══════════════════════━━━═╝

╔═━━━⟬ ⚔️ *ADMIN GROUPE* 🔒 ⟭━━━═╗
║ ⬢ ${PREFIX}tagall / ${PREFIX}hidetag
║ ⬢ ${PREFIX}kick / ${PREFIX}promote / ${PREFIX}demote
║ ⬢ ${PREFIX}mute / ${PREFIX}unmute
║ ⬢ ${PREFIX}warn @membre <raison>
║ ⬢ ${PREFIX}resetwarn @membre
║ ⬢ ${PREFIX}antilink on/off
║ ⬢ ${PREFIX}welcome / ${PREFIX}goodbye on/off
║ ⬢ ${PREFIX}setgname / ${PREFIX}setgdesc
║ ⬢ ${PREFIX}groupinfo / ${PREFIX}staff
║ ⬢ ${PREFIX}delete — Supprimer msg
╚═━━━═══════════════════════━━━═╝

╔═━━━⟬ 👑 *OWNER SEULEMENT* ⟭━━━═╗
║ ⬢ ${PREFIX}mode public/private
║ ⬢ ${PREFIX}autoread on/off
║ ⬢ ${PREFIX}anticall on/off
║ ⬢ ${PREFIX}antispam on/off
║ ⬢ ${PREFIX}pmblocker on/off
║ ⬢ ${PREFIX}settings — Voir config
║ ⬢ ${PREFIX}botpp — Changer photo bot
║ ⬢ ${PREFIX}setbotname <nom>
║ ⬢ ${PREFIX}broadcast <message>
║ ⬢ ${PREFIX}restart
╚═━━━═══════════════════════━━━═╝

╔═━━━═══━━━⟬ 𓅂 *ACTIF* 𓅂 ⟭━━━═══━━━╗
║  _𓅂 ${BOT_NAME} 𓅂 a pris le contrôle_
╚═━━━═══━━━═══━━━═══━━━═══━━━═══╝
`.trim();
}
