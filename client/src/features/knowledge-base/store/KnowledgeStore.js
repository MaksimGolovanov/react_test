import { makeAutoObservable, action } from 'mobx';
import KnowledgeService from '../api/KnowledgeService';

class KnowledgeStore {
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
            const response = await KnowledgeService.fetchArticles(params);
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
            return await KnowledgeService.fetchArticle(id);
        } catch (error) {
            this.error = error;
        } finally {
            this.isLoading = false;
        }
    });

    createArticle = action(async (data) => {
        try {
            await KnowledgeService.createArticle(data);
            await this.fetchArticles();
        } catch (error) {
            this.error = error;
            throw error;
        }
    });

    updateArticle = action(async (id, data) => {
        try {
            await KnowledgeService.updateArticle(id, data);
            await this.fetchArticles();
        } catch (error) {
            this.error = error;
            throw error;
        }
    });

    deleteArticle = action(async (id) => {
        try {
            await KnowledgeService.deleteArticle(id);
            await this.fetchArticles();
        } catch (error) {
            this.error = error;
            throw error;
        }
    });

    fetchCategories = action(async () => {
        try {
            const response = await KnowledgeService.fetchCategories();
            this.categories = response;
        } catch (error) {
            this.error = error;
        }
    });

    fetchStats = action(async () => {
        try {
            const response = await KnowledgeService.fetchStats();
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
            const response = await KnowledgeService.searchArticles(query);
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

const knowledgeStore = new KnowledgeStore();
export default knowledgeStore;