const apiService = require('./apiService');

/**
 * Serviço para obter estatísticas de basquete
 */
class BasketballStatsService {
    constructor() {
        // Substitua pelo host correto da API que você está usando
        this.apiHost = 'api-basketball.p.rapidapi.com';
        this.apiBaseUrl = 'https://api-basketball.p.rapidapi.com';
    }

    /**
     * Obtém jogos para uma data específica
     * @param {string} date - Data no formato YYYY-MM-DD
     * @returns {Promise<Object>} - Dados dos jogos
     */
    async getGamesByDate(date) {
        const url = `${this.apiBaseUrl}/games?date=${date}`;
        return await apiService.get(url, this.apiHost);
    }

    /**
     * Obtém estatísticas de um time específico
     * @param {number} teamId - ID do time
     * @param {string} season - Temporada (ex: "2023-2024")
     * @returns {Promise<Object>} - Estatísticas do time
     */
    async getTeamStats(teamId, season) {
        const url = `${this.apiBaseUrl}/statistics?team=${teamId}&season=${season}`;
        return await apiService.get(url, this.apiHost);
    }

    /**
     * Obtém estatísticas de um jogador específico
     * @param {number} playerId - ID do jogador
     * @param {string} season - Temporada (ex: "2023-2024")
     * @returns {Promise<Object>} - Estatísticas do jogador
     */
    async getPlayerStats(playerId, season) {
        const url = `${this.apiBaseUrl}/players/statistics?player=${playerId}&season=${season}`;
        return await apiService.get(url, this.apiHost);
    }
}

module.exports = new BasketballStatsService();
