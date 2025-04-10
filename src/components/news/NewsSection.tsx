import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

// Defina o tipo para notícias se ainda não existir
interface NewsItem {
    id: string;
    title: string;
    description: string;
    url: string;
    imageUrl: string | null;
    published: string;
    author: string;
}

const NewsSection: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                // Use a ESPN API para obter notícias da NBA
                const response = await fetch("http://site.api.espn.com/apis/site/v2/sports/basketball/nba/news");

                if (!response.ok) {
                    throw new Error('Falha ao buscar notícias');
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

                setNews(newsItems);
                setError(null);
            } catch (err) {
                console.error('Erro ao buscar notícias:', err);
                setError('Não foi possível carregar as notícias. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(date);
    };

    return (
        <Card className="animate-fade-in">
            <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Newspaper className="h-5 w-5 text-primary" />
                        <span>Últimas Notícias</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.open("https://www.espn.com.br/nba/", "_blank")}>
                        Mais Notícias
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                </CardTitle>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
                                <div className="space-y-2 flex-grow">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-4">
                        {news.slice(0, 5).map((item) => (
                            <a
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex gap-4 hover:bg-muted/50 p-2 rounded-md transition-colors cursor-pointer"
                            >
                                {item.imageUrl ? (
                                    <div
                                        className="h-24 w-24 rounded-md bg-cover bg-center flex-shrink-0"
                                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                                    />
                                ) : (
                                    <div className="h-24 w-24 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                        <Newspaper className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}

                                <div className="flex flex-col flex-grow">
                                    <h3 className="font-medium line-clamp-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                                    <div className="flex items-center mt-auto">
                                        <Badge variant="outline" className="text-xs">
                                            {formatDate(item.published)}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground ml-2">{item.author}</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default NewsSection;
