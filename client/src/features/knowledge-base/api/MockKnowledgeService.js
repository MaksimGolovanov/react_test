import { mockArticles } from '../mockData/articles';
import { mockCategories } from '../mockData/categories';
import { mockStats } from '../mockData/stats';

class MockKnowledgeService {
    static async fetchArticles(params = {}) {
        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let filteredArticles = [...mockArticles];
        
        // Фильтрация по статусу
        if (params.status) {
            filteredArticles = filteredArticles.filter(
                article => article.status === params.status
            );
        }
        
        // Фильтрация по категории
        if (params.category_id) {
            filteredArticles = filteredArticles.filter(
                article => article.category_id === parseInt(params.category_id)
            );
        }
        
        // Фильтрация по автору
        if (params.author) {
            filteredArticles = filteredArticles.filter(
                article => article.author.toLowerCase().includes(params.author.toLowerCase())
            );
        }
        
        // Сортировка
        if (params.sortBy) {
            filteredArticles.sort((a, b) => {
                const aValue = a[params.sortBy];
                const bValue = b[params.sortBy];
                
                if (params.sortOrder === 'desc') {
                    return bValue > aValue ? 1 : -1;
                }
                return aValue > bValue ? 1 : -1;
            });
        }
        
        return filteredArticles;
    }

    static async fetchArticle(id) {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const article = mockArticles.find(article => article.id === parseInt(id));
        
        if (!article) {
            throw new Error('Статья не найдена');
        }
        
        return article;
    }

    static async createArticle(data) {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const newArticle = {
            id: mockArticles.length + 1,
            ...data,
            slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            views: 0,
            rating: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: data.status || 'draft',
            featured: data.featured || false
        };
        
        // В реальном приложении здесь был бы запрос к API
        console.log('Создание статьи:', newArticle);
        
        return newArticle;
    }

    static async updateArticle(id, data) {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const index = mockArticles.findIndex(article => article.id === parseInt(id));
        
        if (index === -1) {
            throw new Error('Статья не найдена');
        }
        
        const updatedArticle = {
            ...mockArticles[index],
            ...data,
            updated_at: new Date().toISOString()
        };
        
        // В реальном приложении здесь был бы запрос к API
        console.log('Обновление статьи:', updatedArticle);
        
        return updatedArticle;
    }

    static async deleteArticle(id) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const index = mockArticles.findIndex(article => article.id === parseInt(id));
        
        if (index === -1) {
            throw new Error('Статья не найдена');
        }
        
        // В реальном приложении здесь был бы запрос к API
        console.log('Удаление статьи с id:', id);
        
        return { success: true, message: 'Статья удалена' };
    }

    static async fetchCategories() {
        await new Promise(resolve => setTimeout(resolve, 200));
        return mockCategories;
    }

    static async fetchStats() {
        await new Promise(resolve => setTimeout(resolve, 150));
        return mockStats;
    }

    static async searchArticles(query) {
        await new Promise(resolve => setTimeout(resolve, 250));
        
        if (!query) {
            return mockArticles.slice(0, 5);
        }
        
        const searchTerm = query.toLowerCase();
        
        return mockArticles.filter(article =>
            article.title.toLowerCase().includes(searchTerm) ||
            article.description.toLowerCase().includes(searchTerm) ||
            article.content.toLowerCase().includes(searchTerm) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            article.author.toLowerCase().includes(searchTerm)
        ).slice(0, 10); // Ограничиваем результаты
    }

    static async uploadFile(file) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Имитация загрузки файла
        const fakeUrl = `https://mock-storage.example.com/files/${Date.now()}_${file.name}`;
        
        return {
            url: fakeUrl,
            filename: file.name,
            size: file.size,
            uploaded_at: new Date().toISOString()
        };
    }
}

export default MockKnowledgeService;