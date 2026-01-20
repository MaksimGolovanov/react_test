import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

class DocService {
  // ========== МЕТОДЫ ДЛЯ ДОКУМЕНТОВ ==========

  // Получить все документы
  static async fetchAllDocs() {
    try {
      const response = await axios.get(`${API_URL}api/docs/`);
      return response.data;
    } catch (error) {
      console.error('Documents fetch error:', error.response || error);
      throw error;
    }
  }

  // Получить документ по ID
  static async fetchDocById(id) {
    try {
      const response = await axios.get(`${API_URL}api/docs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении документа:', error);
      throw error;
    }
  }

  // Создать новый документ
  static async createDoc(docData) {
    try {
      const response = await axios.post(`${API_URL}api/docs/`, docData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании документа:', error);
      throw error;
    }
  }

  // Обновить документ
  static async updateDoc(id, docData) {
    try {
      const response = await axios.put(`${API_URL}api/docs/${id}`, docData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении документа:', error);
      throw error;
    }
  }

  // Удалить документ
  static async deleteDoc(id) {
    try {
      const response = await axios.delete(`${API_URL}api/docs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении документа:', error);
      throw error;
    }
  }

  // Загрузить файл документа
  // Загрузить файл документа
  static async uploadDocFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}api/docs/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      throw error;
    }
  }

  // Импорт документов
  static async importDocs(docsData) {
    try {
      const response = await axios.post(`${API_URL}api/docs/import`, docsData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при импорте документов:', error);
      throw error;
    }
  }

  // ========== МЕТОДЫ ДЛЯ ТИПОВ ОБУЧЕНИЯ ==========

  // Получить все типы обучения
  static async fetchAllTrainingTypes() {
    try {
      const response = await axios.get(`${API_URL}api/docs/training-types`);
      return response.data;
    } catch (error) {
      console.error('Training types fetch error:', error.response || error);
      throw error;
    }
  }

  // Получить тип обучения по ID
  static async fetchTrainingTypeById(id) {
    try {
      const response = await axios.get(
        `${API_URL}api/docs/training-types/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении типа обучения:', error);
      throw error;
    }
  }

  // Создать тип обучения
  static async createTrainingType(typeData) {
    try {
      const response = await axios.post(
        `${API_URL}api/docs/training-types`,
        typeData
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании типа обучения:', error);
      throw error;
    }
  }

  // Обновить тип обучения
  static async updateTrainingType(id, typeData) {
    try {
      const response = await axios.put(
        `${API_URL}api/docs/training-types/${id}`,
        typeData
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении типа обучения:', error);
      throw error;
    }
  }

  // Удалить тип обучения
  static async deleteTrainingType(id) {
    try {
      const response = await axios.delete(
        `${API_URL}api/docs/training-types/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении типа обучения:', error);
      throw error;
    }
  }

  // ========== МЕТОДЫ ДЛЯ КАТЕГОРИЙ ДОКУМЕНТОВ ==========

  // Получить все категории
  static async fetchAllDocCategories() {
    try {
      const response = await axios.get(`${API_URL}api/docs/categories`);
      return response.data;
    } catch (error) {
      console.error(
        'Document categories fetch error:',
        error.response || error
      );
      throw error;
    }
  }

  // Получить категорию по ID
  static async fetchDocCategoryById(id) {
    try {
      const response = await axios.get(`${API_URL}api/docs/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении категории документа:', error);
      throw error;
    }
  }

  // Создать категорию
  static async createDocCategory(categoryData) {
    try {
      const response = await axios.post(
        `${API_URL}api/docs/categories`,
        categoryData
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании категории документа:', error);
      throw error;
    }
  }

  // Обновить категорию
  static async updateDocCategory(id, categoryData) {
    try {
      const response = await axios.put(
        `${API_URL}api/docs/categories/${id}`,
        categoryData
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении категории документа:', error);
      throw error;
    }
  }

  // Удалить категорию
  static async deleteDocCategory(id) {
    try {
      const response = await axios.delete(
        `${API_URL}api/docs/categories/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении категории документа:', error);
      throw error;
    }
  }

  // ========== МЕТОДЫ ДЛЯ СТАТУСОВ ДОКУМЕНТОВ ==========

  // Получить все статусы
  static async fetchAllDocStatuses() {
    try {
      const response = await axios.get(`${API_URL}api/docs/statuses`);
      return response.data;
    } catch (error) {
      console.error('Document statuses fetch error:', error.response || error);
      throw error;
    }
  }

  // Получить статус по ID
  static async fetchDocStatusById(id) {
    try {
      const response = await axios.get(`${API_URL}api/docs/statuses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении статуса документа:', error);
      throw error;
    }
  }

  // Создать статус
  static async createDocStatus(statusData) {
    try {
      const response = await axios.post(
        `${API_URL}api/docs/statuses`,
        statusData
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании статуса документа:', error);
      throw error;
    }
  }

  // Обновить статус
  static async updateDocStatus(id, statusData) {
    try {
      const response = await axios.put(
        `${API_URL}api/docs/statuses/${id}`,
        statusData
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении статуса документа:', error);
      throw error;
    }
  }

  // Удалить статус
  static async deleteDocStatus(id) {
    try {
      const response = await axios.delete(`${API_URL}api/docs/statuses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении статуса документа:', error);
      throw error;
    }
  }

  // ========== ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ==========

  // Поиск документов с фильтрами
  static async searchDocs(filters = {}) {
    try {
      const response = await axios.get(`${API_URL}api/docs/`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при поиске документов:', error);
      throw error;
    }
  }

  // Скачать документ
  static async downloadDoc(fileUrl, fileName) {
    try {
      const response = await axios.get(`${API_URL}${fileUrl}`, {
        responseType: 'blob',
      });

      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'document.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    } catch (error) {
      console.error('Ошибка при скачивании документа:', error);
      throw error;
    }
  }

  // Получить документы по типу обучения
  static async fetchDocsByTrainingType(trainingTypeId) {
    try {
      const response = await axios.get(`${API_URL}api/docs/`, {
        params: { training_type_id: trainingTypeId },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении документов по типу обучения:', error);
      throw error;
    }
  }

  // Получить документы по категории
  static async fetchDocsByCategory(categoryId) {
    try {
      const response = await axios.get(`${API_URL}api/docs/`, {
        params: { category_id: categoryId },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении документов по категории:', error);
      throw error;
    }
  }

  // Получить статистику документов
  static async getDocsStats() {
    try {
      const docs = await this.fetchAllDocs();

      const stats = {
        total: docs.length,
        byTrainingType: {},
        byCategory: {},
        byStatus: {},
        totalFileSize: 0,
      };

      docs.forEach((doc) => {
        // Статистика по типам обучения
        const typeName = doc.training_type?.name || 'Без типа';
        stats.byTrainingType[typeName] =
          (stats.byTrainingType[typeName] || 0) + 1;

        // Статистика по категориям
        const categoryName = doc.category?.name || 'Без категории';
        stats.byCategory[categoryName] =
          (stats.byCategory[categoryName] || 0) + 1;

        // Статистика по статусам
        const statusName = doc.status?.name || 'Без статуса';
        stats.byStatus[statusName] = (stats.byStatus[statusName] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Ошибка при получении статистики документов:', error);
      throw error;
    }
  }
}

export default DocService;
