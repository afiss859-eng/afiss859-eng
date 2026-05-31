#!/bin/bash
# ╔═━━━⟬ 𓅂 LUCIFERO BOT — Script de mise à jour ⟭━━━═╗

GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}🔄 Mise à jour de LUCIFERO BOT...${NC}"

# Pull dernière version
git pull origin main

# Mettre à jour les dépendances
npm install --production

# Redémarrer si PM2 est utilisé
if pm2 list | grep -q "lucifero"; then
  echo -e "${CYAN}🔄 Redémarrage via PM2...${NC}"
  pm2 restart lucifero
  echo -e "${GREEN}✅ Bot mis à jour et redémarré !${NC}"
else
  echo -e "${GREEN}✅ Mise à jour terminée ! Lance: npm start${NC}"
fi
