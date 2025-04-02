#!/bin/bash

# Remover o lock file para garantir instalação limpa
rm -f package-lock.json
rm -rf node_modules

# Atualizar date-fns para versão compatível com react-day-picker
npm install date-fns@^3.6.0

# Manter vite na versão 5 por compatibilidade com plugins
npm install vite@^5.4.10

# Reinstalar todas as dependências
npm install
