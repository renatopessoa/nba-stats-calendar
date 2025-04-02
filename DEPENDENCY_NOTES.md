# Notas sobre Dependências

## Conflitos Identificados

1. **date-fns vs react-day-picker**: 
   - `react-day-picker@8.10.1` requer `date-fns@^2.28.0 || ^3.0.0`
   - O projeto estava usando `date-fns@^4.1.0` (incompatível)
   - Solução: Faça downgrade para `date-fns@^3.6.0`

2. **Vite versão**:
   - Alguns plugins do projeto requerem Vite versão 4 ou 5:
     - `@vitejs/plugin-react-swc@3.7.1` requer `vite ^4 || ^5`
     - `lovable-tagger@1.1.7` requer `vite ^5.0.0`
   - Recomendação: Mantenha o Vite na versão 5.x até que os plugins sejam atualizados

## Soluções alternativas

Se você precisar manter as versões atuais:
- Use `npm install --force` ou `npm install --legacy-peer-deps`
- Esteja ciente que isso pode levar a problemas de comportamento não esperados
