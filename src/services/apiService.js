require('dotenv').config();

/**
 * Serviço para acessar APIs externas com autenticação via RapidAPI
 */
class ApiService {
    constructor() {
        this.apiKey = process.env.RAPID_API_KEY;
        this.baseHeaders = {
            'X-RapidAPI-Key': this.apiKey,
            'Content-Type': 'application/json',
        };
    }

    /**
     * Configura cabeçalhos específicos para um host RapidAPI
     * @param {string} host - O host da API no RapidAPI
     * @returns {Object} - Objeto de cabeçalhos HTTP
     */
    getHeaders(host) {
        return {
            ...this.baseHeaders,
            'X-RapidAPI-Host': host
        };
    }

    /**
     * Realiza uma chamada GET para a API
     * @param {string} url - URL da API
     * @param {string} host - Host da API no RapidAPI
     * @returns {Promise<Object>} - Dados da resposta
     */
    async get(url, host) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(host),
            });

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao acessar a API:', error);
            throw error;
        }
    }

    /**
     * Realiza uma chamada POST para a API
     * @param {string} url - URL da API
     * @param {string} host - Host da API no RapidAPI
     * @param {Object} data - Dados para enviar na requisição
     * @returns {Promise<Object>} - Dados da resposta
     */
    async post(url, host, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(host),
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao acessar a API:', error);
            throw error;
        }
    }
}

module.exports = new ApiService();
