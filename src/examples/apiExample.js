const basketballStatsService = require('../services/basketballStatsService');

/**
 * Exemplo de como utilizar o serviço de estatísticas de basquete
 */
async function demonstrateBasketballStats() {
    try {
        console.log('Obtendo jogos de hoje...');
        const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const games = await basketballStatsService.getGamesByDate(today);
        console.log('Jogos de hoje:', JSON.stringify(games, null, 2));

        // Exemplo com IDs fictícios - substitua pelos reais da sua API
        console.log('\nObtendo estatísticas de um time...');
        const teamStats = await basketballStatsService.getTeamStats(123, '2023-2024');
        console.log('Estatísticas do time:', JSON.stringify(teamStats, null, 2));

        console.log('\nObtendo estatísticas de um jogador...');
        const playerStats = await basketballStatsService.getPlayerStats(456, '2023-2024');
        console.log('Estatísticas do jogador:', JSON.stringify(playerStats, null, 2));
    } catch (error) {
        console.error('Erro ao demonstrar estatísticas:', error);
    }
}

// Execute o exemplo
demonstrateBasketballStats();
