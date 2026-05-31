# 𓅂𝐃𝚯𝐌𝚫 𝐋𝐔𝐂𝐈𝐅𝚵𝐑𝚯 𓅂

```
╔═━━━═══━━━⟬ 🔥 LUCIFERO BOT 🔥 ⟭━━━═══━━━╗
║     𓅂 𝐃𝚯𝐌𝚫 𝐋𝐔𝐂𝐈𝐅𝚵𝐑𝚯 𓅂 — v1.0.0
║   WhatsApp XMD Multi-Device Bot
╚═━━━═══━━━═══━━━═══━━━═══━━━═══╝
```

## 🚀 Installation rapide (Ubuntu / VPS)

```bash
# 1. Cloner le dépôt
git clone https://github.com/afiss859-eng/afiss859-eng.git
cd afiss859-eng

# 2. Installer Node.js 20 (si pas déjà installé)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Installer les dépendances
npm install

# 4. Configurer le bot
cp config.example.env config.env
nano config.env   # Remplir OWNER_NUMBER et autres

# 5. Connecter via Pair Code (sans QR)
npm run pair

# 6. Démarrer le bot
npm start
```

## ⚡ Connexion via Pair Code (recommandé)

```bash
npm run pair
# Entrer ton numéro WhatsApp (ex: 221771234567)
# Un code à 8 chiffres s'affiche
# Sur WhatsApp: Appareils liés > Lier avec numéro de téléphone
# Entrer le code → connecté !
```

## 🔧 Mise à jour

```bash
git pull origin main
npm install
# Redémarrer le bot
```

## ⚙️ Configuration (`config.env`)

| Variable | Description |
|----------|-------------|
| `OWNER_NUMBER` | Ton numéro WhatsApp (ex: 221771234567) |
| `BOT_NAME` | Nom du bot |
| `PREFIX` | Préfixe des commandes (défaut: `.`) |
| `MODE` | `public` ou `private` |
| `OPENAI_API_KEY` | Pour .gpt (optionnel) |
| `GEMINI_API_KEY` | Pour .gemini (optionnel) |

## 📋 Commandes disponibles

### 🖥️ Système
`.menu` `.ping` `.alive` `.owner` `.jid` `.runtime` `.info` `.speed`

### 🎨 Médias
`.sticker` `.toimg` `.blur` `.enhance` `.removebg` `.meme` `.attp`

### 🤖 IA
`.gpt` `.gemini` `.imagine`

### 🎵 Musique / Média
`.play` `.song` `.ytmp4` `.tiktok` `.instagram`

### 💪 Motivation
`.motivation` `.proverbe` `.citation` `.quote`

### 👥 Groupe (Admin)
`.kick` `.promote` `.demote` `.mute` `.unmute` `.tagall` `.hidetag` `.antilink` `.welcome` `.goodbye` `.setgname` `.warn` `.ban`

### 👑 Owner
`.mode` `.autoread` `.anticall` `.antispam` `.broadcast` `.botpp` `.setbotname` `.restart`

### 🎮 Jeux
`.truth` `.dare` `.8ball` `.love` `.trivia` `.tictactoe`

### ✏️ Text Effects
`.neon` `.fire` `.glitch` `.matrix` `.hacker` `.devil` `.ice`

## 📦 Déploiement avec PM2

```bash
npm install -g pm2
pm2 start src/index.js --name "lucifero"
pm2 save
pm2 startup
```

## 🔄 Auto-restart avec PM2

```bash
pm2 restart lucifero
pm2 logs lucifero
```

---
> Made with ❤️ by afiss859-eng DEV TECH
