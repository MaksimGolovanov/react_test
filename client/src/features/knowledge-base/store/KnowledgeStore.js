// src/store/KnowledgeStore.js
import { makeAutoObservable, runInAction } from 'mobx';
import KnowledgeService from '../api/KnowledgeService';

class KnowledgeStore {
  articles = null;
  categories = null;
  error = null;
  isLoading = false;
  searchResults = null;
  allTags = null
  constructor() {
    makeAutoObservable(this);
    this.fetchInitialData();
  }

  async fetchAllTags() {
    try {
      const response = await KnowledgeService.fetchTags();
      runInAction(() => {
        this.allTags = response;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
      throw error;
    }
  }

  async fetchInitialData() {
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      await Promise.all([this.fetchArticles(), this.fetchCategories()]);
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchArticles(params = {}) {
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      const response = await KnowledgeService.fetchArticles(params);
      runInAction(() => {
        this.articles = response;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchArticle(id) {
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      return await KnowledgeService.fetchArticle(id);
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async createArticle(data) {
    try {
      await KnowledgeService.createArticle(data);
      await this.fetchArticles();
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
      throw error;
    }
  }

  async updateArticle(id, data) {
    try {
      await KnowledgeService.updateArticle(id, data);
      await this.fetchArticles();
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
      throw error;
    }
  }

  async deleteArticle(id) {
    try {
      await KnowledgeService.deleteArticle(id);
      await this.fetchArticles();
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
      throw error;
    }
  }

  async fetchCategories() {
    try {
      const response = await KnowledgeService.fetchCategories();
      runInAction(() => {
        this.categories = response;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
      throw error;
    }
  }

  async createCategory(data) {
    try {
      const newCategory = await KnowledgeService.createCategory(data);
      runInAction(() => {
        this.categories = [...(this.categories || []), newCategory];
      });
      return newCategory;
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
      throw error;
    }
  }

  async updateCategory(id, data) {
    try {
      const updated = await KnowledgeService.updateCategory(id, data);
      runInAction(() => {
        this.categories = (this.categories || []).map((cat) =>
          cat.id === id ? { ...cat, ...updated } : cat
        );
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      await KnowledgeService.deleteCategory(id);
      runInAction(() => {
        this.categories = (this.categories || []).filter(
          (cat) => cat.id !== id
        );
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
      throw error;
    }
  }

  async searchArticles(query) {
    if (!query) {
      runInAction(() => {
        this.searchResults = null;
      });
      return;
    }
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      const response = await KnowledgeService.searchArticles(query);
      runInAction(() => {
        this.searchResults = response;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  clearSearch() {
    runInAction(() => {
      this.searchResults = null;
    });
  }

  clearError() {
    runInAction(() => {
      this.error = null;
    });
  }
}

const knowledgeStore = new KnowledgeStore();
export default knowledgeStore;
