import { makeAutoObservable, action } from 'mobx';
import MockKnowledgeService from '../api/MockKnowledgeService';

class MockKnowledgeStore {
    articles = null;
    categories = null;
    stats = null;
    error = null;
    isLoading = false;
    searchResults = null;

    constructor() {
        makeAutoObservable(this);
        this.fetchInitialData();
    }
    
    fetchInitialData = action(async () => {
        this.isLoading = true;
        try {
            await Promise.all([
                this.fetchArticles(),
                this.fetchCategories(),
                this.fetchStats()
            ]);
        } catch (error) {
            this.error = error;
        } finally {
            this.isLoading = false;
        }
    });

    fetchArticles = action(async (params = {}) => {
        this.isLoading = true;
        try {
            const response = await MockKnowledgeService.fetchArticles(params);
            this.articles = response;
        } catch (error) {
            this.error = error;
        } finally {
            this.isLoading = false;
        }
    });

    fetchArticle = action(async (id) => {
        this.isLoading = true;
        try {
            return await MockKnowledgeService.fetchArticle(id);
        } catch (error) {
            this.error = error;
        } finally {
            this.isLoading = false;
        }
    });

    createArticle = action(async (data) => {
        try {
            const newArticle = await MockKnowledgeService.createArticle(data);
            // Добавляем в локальный список для мгновенного отображения
            this.articles = [...(this.articles || []), newArticle];
            // Обновляем статистику
            await this.fetchStats();
        } catch (error) {
            this.error = error;
            throw error;
        }
    });

    updateArticle = action(async (id, data) => {
        try {
            const updatedArticle = await MockKnowledgeService.updateArticle(id, data);
            // Обновляем локальный список
            if (this.articles) {
                this.articles = this.articles.map(article =>
                    article.id === parseInt(id) ? updatedArticle : article
                );
            }
        } catch (error) {
            this.error = error;
            throw error;
        }
    });

    deleteArticle = action(async (id) => {
        try {
            await MockKnowledgeService.deleteArticle(id);
            // Удаляем из локального списка
            if (this.articles) {
                this.articles = this.articles.filter(article => article.id !== parseInt(id));
            }
            // Обновляем статистику
            await this.fetchStats();
        } catch (error) {
            this.error = error;
            throw error;
        }
    });

    fetchCategories = action(async () => {
        try {
            const response = await MockKnowledgeService.fetchCategories();
            this.categories = response;
        } catch (error) {
            this.error = error;
        }
    });

    fetchStats = action(async () => {
        try {
            const response = await MockKnowledgeService.fetchStats();
            this.stats = response;
        } catch (error) {
            this.error = error;
        }
    });

    searchArticles = action(async (query) => {
        if (!query) {
            this.searchResults = null;
            return;
        }
        
        this.isLoading = true;
        try {
            const response = await MockKnowledgeService.searchArticles(query);
            this.searchResults = response;
        } catch (error) {
            this.error = error;
        } finally {
            this.isLoading = false;
        }
    });

    clearSearch = action(() => {
        this.searchResults = null;
    });

    setError = action((error) => {
        this.error = error;
    });

    clearError = action(() => {
        this.error = null;
    });
}

const mockKnowledgeStore = new MockKnowledgeStore();
export default mockKnowledgeStore;