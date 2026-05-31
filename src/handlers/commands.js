import { config, BOT_NAME, OWNER, PREFIX } from '../config.js';
import { settings, botState, getUptime, formatUptime } from '../lib/store.js';
import { isOwner, getMentions, getRandom, numFmt } from '../lib/utils.js';
import {
  PROVERBES, CITATIONS, MOTIVATIONS, MUSIC_MOTIVATION,
  JOKES, EIGHT_BALL, TRUTH_QUESTIONS, DARE_CHALLENGES, TEXT_EFFECTS,
} from '../lib/content.js';
import { getMenu } from './menu.js';

export async function handleCommand(ctx) {
  const { sock, msg, jid, senderJid, isGroup, command, args, text, reply, react, isAdmin: isAdm, isOwner: isOwn } = ctx;

  const requireAdmin = async () => {
    if (!isAdm && !isOwn) {
      await reply('❌ *Réservé aux admins du groupe !*'); return false;
    }
    return true;
  };
  const requireOwner = async () => {
    if (!isOwn) { await reply('❌ *Réservé à l\'owner du bot !*'); return false; }
    return true;
  };
  const requireGroup = async () => {
    if (!isGroup) { await reply('❌ *Cette commande fonctionne uniquement en groupe !*'); return false; }
    return true;
  };

  switch (command) {

    // ═══════════ SYSTÈME ═══════════

    case 'menu':
    case 'help':
      await reply(getMenu());
      break;

    case 'ping': {
      const start = Date.now();
      await reply(`🏓 *PONG !*\n⚡ Latence: *${Date.now() - start}ms*\n🟢 Bot en ligne et opérationnel`);
      break;
    }

    case 'alive':
    case 'bot':
      await reply(
        `╔═━━━⟬ 🔥 *${BOT_NAME}* 🔥 ⟭━━━═╗\n` +
        `║ ✅ *SYSTÈME ACTIF ET OPÉRATIONNEL*\n` +
        `║ ⏱️ Uptime: *${formatUptime(getUptime())}*\n` +
        `║ 📊 Messages traités: *${numFmt(botState.messagesHandled)}*\n` +
        `║ ⚡ Commandes exécutées: *${numFmt(botState.commandsExecuted)}*\n` +
        `║ 👥 Groupes actifs: *${botState.activeGroups.size}*\n` +
        `║ 🔖 Préfixe: *${PREFIX}*\n` +
        `║ 📦 Version: *${config.botVersion}*\n` +
        `╚═━━━═══════════════════════━━━═╝`
      );
      break;

    case 'owner':
      await reply(
        `╔═━━━⟬ 👑 *OWNER INFO* 👑 ⟭━━━═╗\n` +
        `║ 🧬 *Nom:* ${config.ownerName}\n` +
        `║ 📱 *Contact:* wa.me/${config.ownerNumber}\n` +
        `║ 🤖 *Bot:* ${BOT_NAME}\n` +
        `║ 📦 *Version:* ${config.botVersion}\n` +
        `╚═━━━═══════════════════════━━━═╝`
      );
      break;

    case 'info':
    case 'runtime': {
      const uptime = getUptime();
      const mem = process.memoryUsage();
      await reply(
        `╔═━━━⟬ 💻 *SYSTEM INFO* ⟭━━━═╗\n` +
        `║ 🤖 *Bot:* ${BOT_NAME}\n` +
        `║ 📦 *Version:* ${config.botVersion}\n` +
        `║ ⏱️ *Uptime:* ${formatUptime(uptime)}\n` +
        `║ 🟢 *Mode:* ${settings.mode.toUpperCase()}\n` +
        `║ 💾 *RAM:* ${Math.round(mem.heapUsed / 1024 / 1024)}MB / ${Math.round(mem.heapTotal / 1024 / 1024)}MB\n` +
        `║ 📊 *Messages:* ${numFmt(botState.messagesHandled)}\n` +
        `║ ⚡ *Commandes:* ${numFmt(botState.commandsExecuted)}\n` +
        `║ 📡 *Groupes:* ${botState.activeGroups.size}\n` +
        `║ 🔖 *Préfixe:* ${PREFIX}\n` +
        `╚═━━━═══════════════════════━━━═╝`
      );
      break;
    }

    case 'speed': {
      const t = Date.now();
      await reply(`⚡ *Speed Test:* ${Date.now() - t}ms`);
      break;
    }

    case 'jid':
      await reply(
        `📱 *Votre JID:*\n\`${senderJid}\`\n\n` +
        (isGroup ? `👥 *JID du groupe:*\n\`${jid}\`` : '')
      );
      break;

    // ═══════════ MOTIVATION / PROVERBES ═══════════

    case 'motivation': {
      const m = getRandom(MOTIVATIONS);
      await react('💪');
      try {
        await sock.sendMessage(jid, {
          image: { url: m.image },
          caption: m.text,
        }, { quoted: msg });
      } catch {
        await reply(m.text);
      }
      break;
    }

    case 'proverbe':
      await reply(`📜 *Proverbe du jour:*\n\n${getRandom(PROVERBES)}`);
      break;

    case 'citation':
    case 'quote':
      await reply(`💬 *Citation inspirante:*\n\n${getRandom(CITATIONS)}`);
      break;

    case 'musique':
    case 'musicmotiv': {
      const mus = getRandom(MUSIC_MOTIVATION);
      await reply(
        `${mus.emoji} *Musique Motivation:*\n\n` +
        `🎵 *${mus.title}*\n\n` +
        `_Écoute ça et donne tout ! 💪🔥_`
      );
      break;
    }

    // ═══════════ JEUX ═══════════

    case 'joke':
    case 'blague':
      await reply(`😂 *Blague:*\n\n${getRandom(JOKES)}`);
      break;

    case '8ball': {
      if (!text) { await reply(`❓ Usage: ${PREFIX}8ball <question>`); break; }
      await reply(`🎱 *Question:* ${text}\n\n${getRandom(EIGHT_BALL)}`);
      break;
    }

    case 'love': {
      const [n1, n2] = args;
      if (!n1 || !n2) { await reply(`💕 Usage: ${PREFIX}love <nom1> <nom2>`); break; }
      const combined = (n1 + n2).toLowerCase();
      let score = 0;
      for (const c of combined) score += c.charCodeAt(0);
      const pct = (score % 81) + 20;
      const hearts = '❤️'.repeat(Math.floor(pct / 10)) + '🖤'.repeat(10 - Math.floor(pct / 10));
      await reply(
        `💕 *Love Calculator* 💕\n\n` +
        `👫 *${n1}* + *${n2}*\n\n` +
        `${hearts}\n\n` +
        `💯 Score: *${pct}%*\n\n` +
        `${pct >= 70 ? '🔥 C\'est l\'amour fou !' : pct >= 50 ? '😊 Belle compatibilité !' : '💔 Pas très compatible...'}`
      );
      break;
    }

    case 'truth':
    case 'verite':
      await reply(`🎯 *VÉRITÉ:*\n\n❓ ${getRandom(TRUTH_QUESTIONS)}`);
      break;

    case 'dare':
    case 'defi':
      await reply(`💪 *DÉFI:*\n\n⚡ ${getRandom(DARE_CHALLENGES)}`);
      break;

    case 'trivia': {
      const trivias = [
        { q: 'Quelle est la capitale du Sénégal ?', r: 'Dakar' },
        { q: 'Combien de côtés a un hexagone ?', r: '6' },
        { q: 'Qui a peint la Joconde ?', r: 'Léonard de Vinci' },
        { q: 'Quel est le plus grand océan du monde ?', r: 'L\'océan Pacifique' },
        { q: 'En quelle année l\'homme a-t-il marché sur la Lune ?', r: '1969' },
        { q: 'Quelle est la formule chimique de l\'eau ?', r: 'H₂O' },
        { q: 'Combien y a-t-il d\'os dans le corps humain ?', r: '206' },
        { q: 'Quel pays est le plus grand du monde ?', r: 'La Russie' },
        { q: 'Qui a écrit Roméo et Juliette ?', r: 'William Shakespeare' },
        { q: 'Quelle est la vitesse de la lumière ?', r: '299 792 km/s' },
      ];
      const t = getRandom(trivias);
      await reply(`🧠 *TRIVIA*\n\n❓ *Question:* ${t.q}\n\n⏱️ Tu as 30 secondes !\n\n||✅ Réponse: ${t.r}||`);
      break;
    }

    // ═══════════ TEXT EFFECTS ═══════════

    case 'neon':
    case 'fire':
    case 'ice':
    case 'glitch':
    case 'matrix':
    case 'hacker':
    case 'devil':
    case 'wave':
    case 'bold': {
      if (!text) { await reply(`❌ Usage: ${PREFIX}${command} <texte>`); break; }
      const fn = TEXT_EFFECTS[command];
      await reply(`✨ *Effet ${command.toUpperCase()}:*\n\n${fn(text)}`);
      break;
    }

    // ═══════════ GROUPE — ADMIN ═══════════

    case 'tagall':
    case 'everyone': {
      if (!await requireGroup()) break;
      if (!await requireAdmin()) break;
      try {
        const meta = await sock.groupMetadata(jid);
        const members = meta.participants;
        const mention = text || '📢 Attention tout le monde !';
        const mentions = members.map(m => m.id);
        const tagText = `📢 *${mention}*\n\n${members.map(m => `@${m.id.split('@')[0]}`).join(' ')}`;
        await sock.sendMessage(jid, { text: tagText, mentions }, { quoted: msg });
      } catch { await reply('❌ Erreur lors du tagall.'); }
      break;
    }

    case 'hidetag': {
      if (!await requireGroup()) break;
      if (!await requireAdmin()) break;
      try {
        const meta = await sock.groupMetadata(jid);
        const mentions = meta.participants.map(m => m.id);
        await sock.sendMessage(jid, { text: text || '📢 Message', mentions }, { quoted: msg });
      } catch { await reply('❌ Erreur.'); }
      break;
    }

    case 'kick':
    case 'remove': {
      if (!await requireGroup()) break;
      if (!await requireAdmin()) break;
      const targets = getMentions(msg);
      if (!targets.length) { await reply(`❌ Usage: ${PREFIX}kick @membre`); break; }
      try {
        await sock.groupParticipantsUpdate(jid, targets, 'remove');
        await reply(`✅ *${targets.map(j => '@' + j.split('@')[0]).join(', ')}* exclu(s) du groupe !`);
      } catch { await reply('❌ Impossible d\'exclure. Le bot est-il admin ?'); }
      break;
    }

    case 'promote': {
      if (!await requireGroup()) break;
      if (!await requireAdmin()) break;
      const targets = getMentions(msg);
      if (!targets.length) { await reply(`❌ Usage: ${PREFIX}promote @membre`); break; }
      try {
        await sock.groupParticipantsUpdate(jid, targets, 'promote');
        await reply(`✅ *${targets.map(j => '@' + j.split('@')[0]).join(', ')}* promu(s) admin !`);
      } catch { await reply('❌ Impossible de promouvoir.'); }
      break;
    }

    case 'demote': {
      if (!await requireGroup()) break;
      if (!await requireAdmin()) break;
      const targets = getMentions(msg);
      if (!targets.length) { await reply(`❌ Usage: ${PREFIX}demote @membre`); break; }
      try {
        await sock.groupParticipantsUpdate(jid, targets, 'demote');
        await reply(`✅ *${targets.map(j => '@' + j.split('@')[0]).join(', ')}* rétrogradé(s) !`);
      } catch { await reply('❌ Impossible de rétrograder.'); }
      break;
    }

    case 'mute': {
      if (!await requireGroup()) break;
      if (!await requireAdmin()) break;
      try {
        await sock.groupSettingUpdate(jid, 'announcement');
        await reply('🔇 *Groupe mis en silence !*\nSeuls les admins peuvent écrire.');
      } catch { await reply('❌ Erreur (suis-je admin ?)'); }
      break;
    }

    case 'unmute': {
      if (!await requireGroup()) break;
      if (!await requireAdmin()) break;
      try {
        await sock.groupSettingUpdate(jid, 'not_announcement');
        await reply('🔊 *Groupe réactivé !*\nTout le monde peut écrire.');
      } catch { await reply('❌ Erreur.'); }
      break;
    }

    case 'delete':
    case 'del': {
      if (!isAdm && !isOwn) { await reply('❌ Admins seulement !'); break; }
      const quoted = msg.message?.extendedTextMessage?.contextInfo;
      if (!quoted?.stanzaId) { await reply('❌ Réponds à un message pour le supprimer.'); break; }
      try {
        await sock.sendMessage(jid, {
          delete: { remoteJid: jid, id: quoted.stanzaId, fromMe: false, participant: quoted.participant },
        });
      } catch { await reply('❌ Impossible de supprimer.'); }
      break;
    }

    case 'setgname': {
      if (!await requireGroup()) break;
      if (!await requireAdmin()) break;
      if (!text) { await reply(`❌ Usage: ${PREFIX}setgname <nouveau nom>`); break; }
      try {
        await sock.groupUpdateSubject(jid, text);
        await reply(`✅ Nom du groupe changé en: *${text}*`);
      } catch { await reply('❌ Impossible de changer le nom.'); }
      break;
    }

    case 'setgdesc':
    case 'setgp': {
      if (!await requireGroup()) break;
      if (!await requireAdmin()) break;
      if (!text) { await reply(`❌ Usage: ${PREFIX}setgdesc <description>`); break; }
      try {
        await sock.groupUpdateDescription(jid, text);
        await reply('✅ Description du groupe mise à jour !');
      } catch { await reply('❌ Erreur.'); }
      break;
    }

    case 'warn': {
      if (!await requireGroup()) break;
      if (!await requireAdmin()) break;
      const targets = getMentions(msg);
      if (!targets.length) { await reply(`❌ Usage: ${PREFIX}warn @membre <raison>`); break; }
      const target = targets[0];
      const reason = args.slice(1).join(' ') || 'Comportement inapproprié';
      const current = (settings.warns.get(target) || 0) + 1;
      settings.warns.set(target, current);
      await reply(
        `⚠️ *AVERTISSEMENT ${current}/3* ⚠️\n\n` +
        `👤 @${target.split('@')[0]}\n` +
        `📋 Raison: ${reason}\n` +
        `${current >= 3 ? '\n🚫 *3 avertissements → Exclusion automatique !*' : ''}`
      );
      if (current >= 3) {
        try {
          await sock.groupParticipantsUpdate(jid, [target], 'remove');
          settings.warns.delete(target);
        } catch {}
      }
      break;
    }

    case 'resetwarn': {
      if (!await requireAdmin()) break;
      const targets = getMentions(msg);
      if (!targets.length) { await reply(`❌ Usage: ${PREFIX}resetwarn @membre`); break; }
      settings.warns.delete(targets[0]);
      await reply(`✅ Avertissements réinitialisés pour @${targets[0].split('@')[0]}`);
      break;
    }

    case 'antilink': {
      if (!await requireGroup()) break;
      if (!await requireAdmin()) break;
      const val = args[0]?.toLowerCase();
      if (val !== 'on' && val !== 'off') { await reply(`❌ Usage: ${PREFIX}antilink on/off`); break; }
      settings.antilink.set(jid, val === 'on');
      await reply(`✅ Anti-Lien: *${val.toUpperCase()}*`);
      break;
    }

    case 'welcome': {
      if (!await requireGroup()) break;
      if (!await requireAdmin()) break;
      const val = args[0]?.toLowerCase();
      if (val !== 'on' && val !== 'off') { await reply(`❌ Usage: ${PREFIX}welcome on/off`); break; }
      settings.welcome.set(jid, val === 'on');
      await reply(`✅ Message de bienvenue: *${val.toUpperCase()}*`);
      break;
    }

    case 'goodbye': {
      if (!await requireGroup()) break;
      if (!await requireAdmin()) break;
      const val = args[0]?.toLowerCase();
      if (val !== 'on' && val !== 'off') { await reply(`❌ Usage: ${PREFIX}goodbye on/off`); break; }
      settings.goodbye.set(jid, val === 'on');
      await reply(`✅ Message d'au revoir: *${val.toUpperCase()}*`);
      break;
    }

    case 'groupinfo': {
      if (!await requireGroup()) break;
      try {
        const meta = await sock.groupMetadata(jid);
        const admins = meta.participants.filter(p => p.admin).length;
        await reply(
          `╔═━━━⟬ 👥 *INFO GROUPE* ⟭━━━═╗\n` +
          `║ 📛 *Nom:* ${meta.subject}\n` +
          `║ 👤 *Membres:* ${meta.participants.length}\n` +
          `║ 🛡️ *Admins:* ${admins}\n` +
          `║ 📝 *Description:* ${meta.desc || 'Aucune'}\n` +
          `║ 🆔 *JID:* ${jid}\n` +
          `╚═━━━═══════════════════════━━━═╝`
        );
      } catch { await reply('❌ Impossible de récupérer les infos.'); }
      break;
    }

    case 'staff': {
      if (!await requireGroup()) break;
      try {
        const meta = await sock.groupMetadata(jid);
        const admins = meta.participants.filter(p => p.admin);
        const list = admins.map(a => `⬢ @${a.id.split('@')[0]} ${a.admin === 'superadmin' ? '👑' : '🛡️'}`).join('\n');
        await sock.sendMessage(jid, {
          text: `╔═━━━⟬ 🛡️ *STAFF DU GROUPE* ⟭━━━═╗\n${list}\n╚═━━━═══════════════════════━━━═╝`,
          mentions: admins.map(a => a.id),
        }, { quoted: msg });
      } catch { await reply('❌ Erreur.'); }
      break;
    }

    case 'getpp': {
      const targets = getMentions(msg);
      const target = targets[0] || senderJid;
      try {
        const ppUrl = await sock.profilePictureUrl(target, 'image');
        await sock.sendMessage(jid, {
          image: { url: ppUrl },
          caption: `📷 Photo de profil de @${target.split('@')[0]}`,
          mentions: [target],
        }, { quoted: msg });
      } catch { await reply('❌ Photo de profil non disponible.'); }
      break;
    }

    // ═══════════ OWNER ═══════════

    case 'mode': {
      if (!await requireOwner()) break;
      const val = args[0]?.toLowerCase();
      if (val !== 'public' && val !== 'private') { await reply(`❌ Usage: ${PREFIX}mode public/private`); break; }
      settings.mode = val;
      await reply(`✅ Mode changé en: *${val.toUpperCase()}*`);
      break;
    }

    case 'autoread': {
      if (!await requireOwner()) break;
      const val = args[0]?.toLowerCase();
      if (val !== 'on' && val !== 'off') { await reply(`❌ Usage: ${PREFIX}autoread on/off`); break; }
      settings.autoRead = val === 'on';
      await reply(`✅ Auto Read: *${val.toUpperCase()}*`);
      break;
    }

    case 'anticall': {
      if (!await requireOwner()) break;
      const val = args[0]?.toLowerCase();
      if (val !== 'on' && val !== 'off') { await reply(`❌ Usage: ${PREFIX}anticall on/off`); break; }
      settings.antiCall = val === 'on';
      await reply(`✅ Anti Call: *${val.toUpperCase()}*`);
      break;
    }

    case 'antispam': {
      if (!await requireOwner()) break;
      const val = args[0]?.toLowerCase();
      if (val !== 'on' && val !== 'off') { await reply(`❌ Usage: ${PREFIX}antispam on/off`); break; }
      settings.antiSpam = val === 'on';
      await reply(`✅ Anti Spam: *${val.toUpperCase()}*`);
      break;
    }

    case 'pmblocker': {
      if (!await requireOwner()) break;
      const val = args[0]?.toLowerCase();
      if (val !== 'on' && val !== 'off') { await reply(`❌ Usage: ${PREFIX}pmblocker on/off`); break; }
      settings.pmBlocker = val === 'on';
      await reply(`✅ PM Blocker: *${val.toUpperCase()}*`);
      break;
    }

    case 'settings': {
      if (!await requireOwner()) break;
      await reply(
        `╔═━━━⟬ ⚙️ *PARAMÈTRES BOT* ⟭━━━═╗\n` +
        `║ 🌐 Mode: *${settings.mode.toUpperCase()}*\n` +
        `║ 📖 Auto Read: *${settings.autoRead ? 'ON' : 'OFF'}*\n` +
        `║ 📞 Anti Call: *${settings.antiCall ? 'ON' : 'OFF'}*\n` +
        `║ 🛡️ Anti Spam: *${settings.antiSpam ? 'ON' : 'OFF'}*\n` +
        `║ 📵 PM Blocker: *${settings.pmBlocker ? 'ON' : 'OFF'}*\n` +
        `╚═━━━═══════════════════════━━━═╝`
      );
      break;
    }

    case 'botpp':
    case 'setbotpp': {
      if (!await requireOwner()) break;
      const quoted = msg.message?.extendedTextMessage?.contextInfo;
      let imgMsg = msg.message?.imageMessage || quoted?.quotedMessage?.imageMessage;
      if (!imgMsg) { await reply('❌ Envoie une image ou réponds à une image avec cette commande.'); break; }
      try {
        const { downloadMediaMessage } = await import('@whiskeysockets/baileys');
        const buffer = await downloadMediaMessage({ message: { imageMessage: imgMsg }, type: 'buffer' }, 'buffer', {});
        await sock.updateProfilePicture(sock.user.id, buffer);
        await reply('✅ Photo de profil du bot mise à jour !');
      } catch (e) { await reply(`❌ Erreur: ${e.message}`); }
      break;
    }

    case 'setbotname': {
      if (!await requireOwner()) break;
      if (!text) { await reply(`❌ Usage: ${PREFIX}setbotname <nom>`); break; }
      try {
        await sock.updateProfileName(text);
        await reply(`✅ Nom du bot changé en: *${text}*`);
      } catch (e) { await reply(`❌ Erreur: ${e.message}`); }
      break;
    }

    case 'broadcast':
    case 'bc': {
      if (!await requireOwner()) break;
      if (!text) { await reply(`❌ Usage: ${PREFIX}broadcast <message>`); break; }
      let sent = 0;
      for (const groupJid of botState.activeGroups) {
        try {
          await sock.sendMessage(groupJid, { text: `📢 *BROADCAST*\n\n${text}` });
          sent++;
        } catch {}
      }
      await reply(`✅ Broadcast envoyé à *${sent}* groupe(s) !`);
      break;
    }

    case 'restart': {
      if (!await requireOwner()) break;
      await reply('🔄 *Redémarrage du bot en cours...*\n\nA dans quelques secondes ! 👋');
      setTimeout(() => process.exit(0), 2000);
      break;
    }

    // ═══════════ IA / MEDIA ═══════════

    case 'gpt':
    case 'ai': {
      if (!text) { await reply(`❌ Usage: ${PREFIX}gpt <question>`); break; }
      if (!config.openaiKey) {
        await reply(`🤖 *GPT:* "${text}"\n\n_Configure OPENAI_API_KEY dans config.env pour activer l'IA._`);
        break;
      }
      try {
        await react('⏳');
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${config.openaiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: `Tu es ${BOT_NAME}, un assistant WhatsApp intelligent. Réponds en français de façon concise.` },
              { role: 'user', content: text },
            ],
            max_tokens: 500,
          }),
        });
        const data = await res.json();
        const answer = data.choices?.[0]?.message?.content || 'Pas de réponse.';
        await reply(`🤖 *GPT-4:*\n\n${answer}`);
      } catch (e) { await reply(`❌ Erreur GPT: ${e.message}`); }
      break;
    }

    case 'gemini': {
      if (!text) { await reply(`❌ Usage: ${PREFIX}gemini <question>`); break; }
      if (!config.geminiKey) {
        await reply(`✨ *Gemini:* "${text}"\n\n_Configure GEMINI_API_KEY dans config.env._`);
        break;
      }
      try {
        await react('⏳');
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text }] }] }),
        });
        const data = await res.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas de réponse.';
        await reply(`✨ *Gemini AI:*\n\n${answer}`);
      } catch (e) { await reply(`❌ Erreur Gemini: ${e.message}`); }
      break;
    }

    case 'weather':
    case 'meteo': {
      if (!text) { await reply(`❌ Usage: ${PREFIX}weather <ville>\nEx: ${PREFIX}weather Dakar`); break; }
      try {
        await react('🌤️');
        const res = await fetch(`https://wttr.in/${encodeURIComponent(text)}?format=j1`);
        const data = await res.json();
        const current = data.current_condition?.[0];
        if (!current) { await reply('❌ Ville introuvable.'); break; }
        const desc = current.weatherDesc?.[0]?.value || 'N/A';
        const temp = current.temp_C;
        const feels = current.FeelsLikeC;
        const humidity = current.humidity;
        const wind = current.windspeedKmph;
        await reply(
          `🌤️ *Météo — ${text}*\n\n` +
          `🌡️ Température: *${temp}°C* (ressenti ${feels}°C)\n` +
          `💧 Humidité: *${humidity}%*\n` +
          `💨 Vent: *${wind} km/h*\n` +
          `☁️ Conditions: *${desc}*`
        );
      } catch { await reply(`❌ Météo indisponible pour "${text}".`); }
      break;
    }

    case 'trt':
    case 'translate': {
      const [lang, ...rest] = args;
      const textToTranslate = rest.join(' ');
      if (!lang || !textToTranslate) { await reply(`❌ Usage: ${PREFIX}trt <langue> <texte>\nEx: ${PREFIX}trt en Bonjour`); break; }
      try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(textToTranslate)}`);
        const data = await res.json();
        const translated = data[0]?.map(t => t[0]).join('') || 'Traduction échouée';
        await reply(`🌐 *Traduction (→ ${lang}):*\n\n"${textToTranslate}"\n\n↓\n\n"${translated}"`);
      } catch { await reply('❌ Service de traduction indisponible.'); }
      break;
    }

    case 'sticker':
    case 'stickerize': {
      const quoted = msg.message?.extendedTextMessage?.contextInfo;
      const imgMsg = msg.message?.imageMessage || quoted?.quotedMessage?.imageMessage;
      const vidMsg = msg.message?.videoMessage || quoted?.quotedMessage?.videoMessage;
      if (!imgMsg && !vidMsg) { await reply(`❌ Envoie une image/vidéo avec ${PREFIX}sticker en légende.`); break; }
      try {
        await react('⏳');
        const { downloadMediaMessage } = await import('@whiskeysockets/baileys');
        const buffer = await downloadMediaMessage(
          { message: imgMsg ? { imageMessage: imgMsg } : { videoMessage: vidMsg }, type: 'buffer' }, 'buffer', {}
        );
        await sock.sendMessage(jid, {
          sticker: buffer,
        }, { quoted: msg });
      } catch (e) { await reply(`❌ Erreur sticker: ${e.message}`); }
      break;
    }

    case 'play':
    case 'song':
    case 'ytmp4':
    case 'tiktok':
    case 'instagram':
    case 'facebook':
    case 'spotify': {
      if (!text && !args[0]) { await reply(`❌ Usage: ${PREFIX}${command} <titre ou URL>`); break; }
      await reply(
        `📥 *${command.toUpperCase()}*\n\n` +
        `🔗 Requête: _${text || args[0]}_\n\n` +
        `_⚠️ Connecte une API (ytdl, yt-dlp) dans config.env pour activer les téléchargements._`
      );
      break;
    }

    case 'vv': {
      const quoted = msg.message?.extendedTextMessage?.contextInfo;
      if (!quoted) { await reply('❌ Réponds à un message view-once avec .vv'); break; }
      await reply(`👁️ *View Once activé !*\n_Fonctionnalité disponible avec la version complète du bot._`);
      break;
    }

    case 'tts': {
      if (!text) { await reply(`❌ Usage: ${PREFIX}tts <texte>`); break; }
      await reply(`🔊 *TTS:* "${text}"\n\n_Configure une API TTS pour générer l'audio._`);
      break;
    }

    case 'ss':
    case 'screenshot': {
      if (!args[0]) { await reply(`❌ Usage: ${PREFIX}ss <url>\nEx: ${PREFIX}ss https://google.com`); break; }
      await reply(`📸 *Screenshot:* ${args[0]}\n\n_Configure une API screenshot (e.g. screenshotlayer) dans config.env._`);
      break;
    }

    case 'url':
    case 'shorten': {
      if (!args[0]) { await reply(`❌ Usage: ${PREFIX}url <lien>`); break; }
      try {
        const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(args[0])}`);
        const short = await res.text();
        await reply(`🔗 *URL raccourcie:*\n${short.trim()}`);
      } catch { await reply('❌ Service indisponible.'); }
      break;
    }

    case 'lyrics': {
      if (!text) { await reply(`❌ Usage: ${PREFIX}lyrics <titre de la chanson>`); break; }
      await reply(`🎵 *Paroles de "${text}":*\n\n_Configure une API paroles (e.g. lyrics.ovh) dans config.env._`);
      break;
    }

    default:
      await reply(
        `❓ Commande *${PREFIX}${command}* inconnue.\n\n` +
        `Tape *${PREFIX}menu* pour voir toutes les commandes disponibles.`
      );
      break;
  }
}
