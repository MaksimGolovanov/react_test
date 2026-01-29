export const mockStats = {
    total_articles: 156,
    published_articles: 132,
    draft_articles: 18,
    archived_articles: 6,
    total_views: 125430,
    total_authors: 28,
    total_categories: 15,
    total_tags: 87,
    featured_articles: 12,
    most_viewed_article: {
        id: 8,
        title: 'React Hooks: полное руководство',
        views: 3200
    },
    recent_articles: [
        {
            id: 7,
            title: 'Настройка Nginx для production',
            created_at: '2024-03-01T15:30:00Z',
            author: 'Павел Волков'
        },
        {
            id: 4,
            title: 'Микросервисная архитектура на Node.js',
            created_at: '2024-03-01T10:20:00Z',
            author: 'Дмитрий Иванов'
        },
        {
            id: 2,
            title: 'Оптимизация производительности PostgreSQL',
            created_at: '2024-03-05T11:45:00Z',
            author: 'Анна Сидорова'
        }
    ],
    popular_tags: [
        { name: 'React', count: 15 },
        { name: 'JavaScript', count: 12 },
        { name: 'DevOps', count: 10 },
        { name: 'Node.js', count: 8 },
        { name: 'Frontend', count: 7 }
    ],
    monthly_stats: [
        { month: 'Янв 2024', articles: 12, views: 25400 },
        { month: 'Фев 2024', articles: 18, views: 42000 },
        { month: 'Мар 2024', articles: 8, views: 15000 }
    ]
};