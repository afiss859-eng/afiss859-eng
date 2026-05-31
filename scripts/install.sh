#!/bin/bash
# ╔═━━━⟬ 𓅂 LUCIFERO BOT — Script d'installation Ubuntu ⟭━━━═╗

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${RED}"
echo "╔═━━━═══━━━⟬ 𓅂 LUCIFERO BOT INSTALLER 𓅂 ⟭━━━═══━━━╗"
echo "║     Installation automatique pour Ubuntu/Debian"
echo "╚═━━━═══━━━═══━━━═══━━━═══━━━═══╝"
echo -e "${NC}"

# Vérifier si on est root
if [ "$EUID" -eq 0 ]; then
  echo -e "${YELLOW}⚠️  Lancé en root. Recommandé d'utiliser un utilisateur normal.${NC}"
fi

# Mise à jour du système
echo -e "${CYAN}📦 Mise à jour du système...${NC}"
sudo apt-get update -y && sudo apt-get upgrade -y

# Installer Node.js 20 LTS
echo -e "${CYAN}🟢 Installation de Node.js 20...${NC}"
if ! command -v node &> /dev/null || [[ $(node --version | cut -d'.' -f1 | tr -d 'v') -lt 18 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
echo -e "${GREEN}✅ Node.js $(node --version) installé${NC}"

# Installer git
echo -e "${CYAN}📡 Installation de git...${NC}"
sudo apt-get install -y git curl

# Cloner le dépôt
echo -e "${CYAN}📥 Clonage du bot...${NC}"
if [ -d "afiss859-eng" ]; then
  echo -e "${YELLOW}⚠️  Dossier existant — mise à jour...${NC}"
  cd afiss859-eng
  git pull origin main
else
  git clone https://github.com/afiss859-eng/afiss859-eng.git
  cd afiss859-eng
fi

# Installer les dépendances npm
echo -e "${CYAN}📦 Installation des dépendances...${NC}"
npm install --production

# Copier la config
if [ ! -f "config.env" ]; then
  cp config.example.env config.env
  echo -e "${YELLOW}"
  echo "╔═━━━⟬ ⚙️ CONFIGURATION REQUISE ⟭━━━═╗"
  echo "║ Édite config.env avec tes informations:"
  echo "║ nano config.env"
  echo "║"
  echo "║ Minimum requis:"
  echo "║   OWNER_NUMBER=ton_numero"
  echo "╚═━━━═══════════════════════━━━═╝"
  echo -e "${NC}"
fi

# Installer PM2 globalement
echo -e "${CYAN}⚙️ Installation de PM2...${NC}"
sudo npm install -g pm2

echo -e "${GREEN}"
echo "╔═━━━═══━━━⟬ ✅ INSTALLATION TERMINÉE ⟭━━━═══━━━╗"
echo "║"
echo "║  Prochaines étapes:"
echo "║"
echo "║  1️⃣  Éditer la config:"
echo "║     nano config.env"
echo "║"
echo "║  2️⃣  Connecter le bot (Pair Code):"
echo "║     npm run pair"
echo "║"
echo "║  3️⃣  Démarrer le bot:"
echo "║     npm start"
echo "║"
echo "║  4️⃣  Démarrage auto (recommandé):"
echo "║     pm2 start src/index.js --name lucifero"
echo "║     pm2 save && pm2 startup"
echo "║"
echo "╚═━━━═══━━━═══━━━═══━━━═══━━━═══╝"
echo -e "${NC}"
