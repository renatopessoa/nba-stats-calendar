import { Game, Team, NewsItem } from "@/types/gameTypes";

// URLs base das APIs ESPN
const ESPN_SCOREBOARD_API = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";
const ESPN_NEWS_API = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news";
const ESPN_TEAMS_API = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams";

// Cache para evitar requisições repetidas
let teamsCache: Team[] = [];
let scoreboardCache: any = null;
let scoreboardTimestamp: number = 0;
let newsCache: NewsItem[] = [];
let newsTimestamp: number = 0;

// Tempo de expiração do cache em milissegundos
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutos

/**
 * Busca o placar atual dos jogos da NBA
 */
export const fetchScoreboard = async (): Promise<any> => {
    const now = Date.now();

    // Verificar se o cache é válido
    if (scoreboardCache && now - scoreboardTimestamp < CACHE_EXPIRATION) {
        return scoreboardCache;
    }

    try {
        const response = await fetch(ESPN_SCOREBOARD_API);

        if (!response.ok) {
            throw new Error('Falha ao buscar placar dos jogos');
        }

        const data = await response.json();

        // Atualizar cache
        scoreboardCache = data;
        scoreboardTimestamp = now;

        return data;
    } catch (error) {
        console.error('Erro ao buscar placar pela ESPN API:', error);
        throw error;
    }
};

/**
 * Busca notícias recentes da NBA
 */
export const fetchNews = async (): Promise<NewsItem[]> => {
    const now = Date.now();

    // Verificar se o cache é válido
    if (newsCache.length > 0 && now - newsTimestamp < CACHE_EXPIRATION) {
        return newsCache;
    }

    try {
        const response = await fetch(ESPN_NEWS_API);

        if (!response.ok) {
            throw new Error('Falha ao buscar notícias da NBA');
        }

        const data = await response.json();

        // Mapear dados para nosso formato de NewsItem
        const newsItems: NewsItem[] = data.articles.map((article: any) => ({
            id: article.id || String(Math.random()),
            title: article.headline,
            description: article.description,
            url: article.links.web.href,
            imageUrl: article.images.length > 0 ? article.images[0].url : null,
            published: article.published,
            author: article.byline || 'ESPN'
        }));

        // Atualizar cache
        newsCache = newsItems;
        newsTimestamp = now;

        return newsItems;
    } catch (error) {
        console.error('Erro ao buscar notícias pela ESPN API:', error);
        return [];
    }
};

/**
 * Busca todos os times da NBA
 */
export const fetchAllTeams = async (): Promise<Team[]> => {
    if (teamsCache.length > 0) {
        return teamsCache;
    }

    try {
        const response = await fetch(ESPN_TEAMS_API);

        if (!response.ok) {
            throw new Error('Falha ao buscar times da NBA');
        }

        const data = await response.json();

        // Mapear dados para nosso formato de Team
        const teams: Team[] = data.sports[0].leagues[0].teams.map((teamData: any) => {
            const team = teamData.team;
            return {
                id: team.id,
                name: team.displayName,
                abbreviation: team.abbreviation,
                record: team.record ? team.record.items[0].summary : "0-0",
                logo: team.logos && team.logos.length > 0 ? team.logos[0].href : null,
                color: team.color || '#000000',
                alternateColor: team.alternateColor || '#FFFFFF'
            };
        });

        teamsCache = teams;
        return teams;
    } catch (error) {
        console.error('Erro ao buscar times pela ESPN API:', error);
        throw error;
    }
};

/**
 * Busca informações específicas de um time
 * @param teamId - ID do time na ESPN
 */
export const fetchTeamDetails = async (teamId: string): Promise<any> => {
    try {
        const response = await fetch(`${ESPN_TEAMS_API}/${teamId}`);

        if (!response.ok) {
            throw new Error(`Falha ao buscar detalhes do time ${teamId}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar detalhes do time ${teamId}:`, error);
        throw error;
    }
};

/**
 * Converte o formato de jogo da ESPN para o nosso formato interno
 * @param espnGame - Jogo no formato da ESPN
 */
export const mapESPNGameToInternalGame = (espnGame: any): Game => {
    const homeTeam: Team = {
        id: espnGame.competitions[0].competitors.find((c: any) => c.homeAway === 'home').id,
        name: espnGame.competitions[0].competitors.find((c: any) => c.homeAway === 'home').team.displayName,
        abbreviation: espnGame.competitions[0].competitors.find((c: any) => c.homeAway === 'home').team.abbreviation,
        record: espnGame.competitions[0].competitors.find((c: any) => c.homeAway === 'home').records?.[0]?.summary || "0-0"
    };

    const awayTeam: Team = {
        id: espnGame.competitions[0].competitors.find((c: any) => c.homeAway === 'away').id,
        name: espnGame.competitions[0].competitors.find((c: any) => c.homeAway === 'away').team.displayName,
        abbreviation: espnGame.competitions[0].competitors.find((c: any) => c.homeAway === 'away').team.abbreviation,
        record: espnGame.competitions[0].competitors.find((c: any) => c.homeAway === 'away').records?.[0]?.summary || "0-0"
    };

    // Mapear status do jogo
    let status: 'scheduled' | 'live' | 'completed';
    if (espnGame.status.type.state === 'pre') {
        status = 'scheduled';
    } else if (espnGame.status.type.state === 'in') {
        status = 'live';
    } else {
        status = 'completed';
    }

    // Obter período atual e tempo restante
    let currentPeriod = '';
    if (espnGame.status.period) {
        currentPeriod = `Q${espnGame.status.period} ${espnGame.status.displayClock || ''}`;
    }

    return {
        id: parseInt(espnGame.id),
        date: new Date(espnGame.date),
        homeTeam,
        awayTeam,
        homeScore: parseInt(espnGame.competitions[0].competitors.find((c: any) => c.homeAway === 'home').score || "0"),
        awayScore: parseInt(espnGame.competitions[0].competitors.find((c: any) => c.homeAway === 'away').score || "0"),
        status,
        currentPeriod,
        arena: espnGame.competitions[0].venue?.fullName || "",
        location: espnGame.competitions[0].venue ?
            `${espnGame.competitions[0].venue.address.city}, ${espnGame.competitions[0].venue.address.state}` : ""
    };
};
