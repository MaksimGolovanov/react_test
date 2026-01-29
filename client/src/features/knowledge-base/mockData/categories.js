export const mockCategories = [
    {
        id: 1,
        name: 'Frontend',
        slug: 'frontend',
        description: 'Разработка пользовательского интерфейса',
        parent_id: null,
        article_count: 25,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 2,
        name: 'DevOps',
        slug: 'devops',
        description: 'Разработка и эксплуатация',
        parent_id: null,
        article_count: 18,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 3,
        name: 'Базы данных',
        slug: 'bazy-dannykh',
        description: 'Проектирование и оптимизация баз данных',
        parent_id: null,
        article_count: 12,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 4,
        name: 'Backend',
        slug: 'backend',
        description: 'Серверная разработка',
        parent_id: null,
        article_count: 20,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 5,
        name: 'Системное администрирование',
        slug: 'sistemnoe-administrirovanie',
        description: 'Администрирование серверов и сетей',
        parent_id: null,
        article_count: 8,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 6,
        name: 'React',
        slug: 'react',
        description: 'Библиотека React и экосистема',
        parent_id: 1,
        article_count: 15,
        created_at: '2024-01-15T00:00:00Z'
    },
    {
        id: 7,
        name: 'Vue.js',
        slug: 'vue-js',
        description: 'Фреймворк Vue.js',
        parent_id: 1,
        article_count: 7,
        created_at: '2024-01-15T00:00:00Z'
    },
    {
        id: 8,
        name: 'Docker',
        slug: 'docker',
        description: 'Контейнеризация приложений',
        parent_id: 2,
        article_count: 10,
        created_at: '2024-01-20T00:00:00Z'
    },
    {
        id: 9,
        name: 'Kubernetes',
        slug: 'kubernetes',
        description: 'Оркестрация контейнеров',
        parent_id: 2,
        article_count: 5,
        created_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 10,
        name: 'PostgreSQL',
        slug: 'postgresql',
        description: 'Реляционная база данных',
        parent_id: 3,
        article_count: 8,
        created_at: '2024-01-25T00:00:00Z'
    },
    {
        id: 11,
        name: 'MongoDB',
        slug: 'mongodb',
        description: 'Документо-ориентированная база данных',
        parent_id: 3,
        article_count: 4,
        created_at: '2024-02-10T00:00:00Z'
    },
    {
        id: 12,
        name: 'Node.js',
        slug: 'node-js',
        description: 'JavaScript на сервере',
        parent_id: 4,
        article_count: 12,
        created_at: '2024-01-10T00:00:00Z'
    },
    {
        id: 13,
        name: 'Python',
        slug: 'python',
        description: 'Backend на Python',
        parent_id: 4,
        article_count: 8,
        created_at: '2024-01-12T00:00:00Z'
    },
    {
        id: 14,
        name: 'Linux',
        slug: 'linux',
        description: 'Администрирование Linux серверов',
        parent_id: 5,
        article_count: 6,
        created_at: '2024-02-05T00:00:00Z'
    },
    {
        id: 15,
        name: 'Nginx',
        slug: 'nginx',
        description: 'Веб-сервер и обратный прокси',
        parent_id: 5,
        article_count: 2,
        created_at: '2024-02-15T00:00:00Z'
    }
];