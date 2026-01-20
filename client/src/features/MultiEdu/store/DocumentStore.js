// src/features/security-training/store/DocumentStore.js
import { makeAutoObservable, observable, action } from 'mobx';
import { message } from 'antd';
import DocService from '../api/DocService';
import moment from 'moment';

class DocumentStore {
  documents = observable.array([]);
  trainingTypes = observable.array([]);
  categories = observable.array([]);
  statuses = observable.array([]);

  currentDocument = null;
  isLoading = false;
  loading = false;

  // Фильтры
  filters = {
    search: '',
    trainingTypeId: null,
    categoryId: null,
    statusId: null,
  };

  // Пагинация
  pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };

  // Статистика
  stats = {
    total: 0,
    byTrainingType: {},
    byCategory: {},
    byStatus: {},
  };

  constructor() {
    makeAutoObservable(this, {
      documents: observable.shallow,
      trainingTypes: observable.shallow,
      categories: observable.shallow,
      statuses: observable.shallow,
    });

    // Инициализация данных
    this.loadInitialData();
  }

  // Загрузка начальных данных
  loadInitialData = action(async () => {
    try {
      await Promise.all([
        this.loadTrainingTypes(),
        this.loadCategories(),
        this.loadStatuses(),
      ]);
      console.log('Initial data loaded successfully');
    } catch (error) {
      console.error('Error loading initial data:', error);
      message.error('Ошибка загрузки справочников документов');
    }
  });

  // ========== ДОКУМЕНТЫ ==========

  // Загрузка всех документов
  loadDocuments = action(async (params = {}) => {
    try {
      this.isLoading = true;

      // Объединяем локальные фильтры с переданными параметрами
      const queryParams = {
        ...this.filters,
        ...params,
        page: this.pagination.current,
        limit: this.pagination.pageSize,
      };

      // Удаляем пустые параметры
      Object.keys(queryParams).forEach((key) => {
        if (
          queryParams[key] === null ||
          queryParams[key] === undefined ||
          queryParams[key] === ''
        ) {
          delete queryParams[key];
        }
      });

      const docs = await DocService.fetchAllDocs(queryParams);

      // Если API поддерживает пагинацию, обновляем ее
      if (docs.pagination) {
        this.pagination = {
          ...this.pagination,
          ...docs.pagination,
        };
      }

      // Сохраняем документы
      this.documents.replace(docs);

      // Обновляем статистику
      this.updateStats();

      return docs;
    } catch (error) {
      console.error('Error loading documents:', error);
      message.error('Ошибка загрузки документов');
      throw error;
    } finally {
      this.isLoading = false;
    }
  });

  // Получить документ по ID
  getDocumentById = action(async (id) => {
    try {
      this.isLoading = true;
      const document = await DocService.fetchDocById(id);
      this.currentDocument = document;
      return document;
    } catch (error) {
      console.error('Error getting document:', error);
      message.error('Ошибка загрузки документа');
      throw error;
    } finally {
      this.isLoading = false;
    }
  });

  // Создать новый документ
  createDocument = action(async (documentData) => {
    try {
      this.loading = true;
      const newDocument = await DocService.createDoc(documentData);

      // Добавляем в список документов
      this.documents.unshift(newDocument);

      // Обновляем статистику
      this.updateStats();

      message.success('Документ успешно создан');
      return newDocument;
    } catch (error) {
      console.error('Error creating document:', error);
      message.error(
        error.response?.data?.message || 'Ошибка создания документа'
      );
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // Обновить документ
  updateDocument = action(async (id, documentData) => {
    try {
      this.loading = true;
      const updatedDocument = await DocService.updateDoc(id, documentData);

      // Обновляем в списке
      const index = this.documents.findIndex((doc) => doc.id === id);
      if (index !== -1) {
        this.documents[index] = updatedDocument;
      }

      // Если это текущий документ, обновляем его
      if (this.currentDocument?.id === id) {
        this.currentDocument = updatedDocument;
      }

      // Обновляем статистику
      this.updateStats();

      message.success('Документ успешно обновлен');
      return updatedDocument;
    } catch (error) {
      console.error('Error updating document:', error);
      message.error(
        error.response?.data?.message || 'Ошибка обновления документа'
      );
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // Удалить документ
  deleteDocument = action(async (id) => {
    try {
      this.loading = true;

      // Получаем документ для удаления файла
      const documentToDelete = this.documents.find((doc) => doc.id === id);

      await DocService.deleteDoc(id);

      // Удаляем из списка
      this.documents = this.documents.filter((doc) => doc.id !== id);

      // Если это текущий документ, сбрасываем
      if (this.currentDocument?.id === id) {
        this.currentDocument = null;
      }

      // Обновляем статистику
      this.updateStats();

      message.success('Документ успешно удален');

      // Возвращаем удаленный документ для возможной отмены
      return documentToDelete;
    } catch (error) {
      console.error('Error deleting document:', error);
      message.error(
        error.response?.data?.message || 'Ошибка удаления документа'
      );
      throw error;
    } finally {
      this.loading = false;
    }
  });


  uploadDocumentFile = action(async (file) => {
    try {
      this.loading = true;
      const uploadResult = await DocService.uploadDocFile(file);
      message.success('Файл успешно загружен');
      return uploadResult;
    } catch (error) {
      console.error('Error uploading file:', error);
      message.error(error.response?.data?.message || 'Ошибка загрузки файла');
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // Вспомогательный метод для генерации безопасного имени файла
  generateSafeFileName = (originalName) => {
    if (!originalName) return `document_${Date.now()}.pdf`;

    // Транслитерация русского текста
    const transliterate = (text) => {
      const translitMap = {
        а: 'a',
        б: 'b',
        в: 'v',
        г: 'g',
        д: 'd',
        е: 'e',
        ё: 'yo',
        ж: 'zh',
        з: 'z',
        и: 'i',
        й: 'y',
        к: 'k',
        л: 'l',
        м: 'm',
        н: 'n',
        о: 'o',
        п: 'p',
        р: 'r',
        с: 's',
        т: 't',
        у: 'u',
        ф: 'f',
        х: 'kh',
        ц: 'ts',
        ч: 'ch',
        ш: 'sh',
        щ: 'shch',
        ъ: '',
        ы: 'y',
        ь: '',
        э: 'e',
        ю: 'yu',
        я: 'ya',
      };

      return text
        .split('')
        .map((char) => {
          return translitMap[char] || char;
        })
        .join('');
    };

    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const nameWithoutExt = originalName.substring(
      0,
      originalName.lastIndexOf('.')
    );
    const transliterated = transliterate(nameWithoutExt);

    const safeName = transliterated
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .toLowerCase();

    const timestamp = Date.now();
    return `${safeName}_${timestamp}${extension}`;
  };

  // Импорт документов
  importDocuments = action(async (docsData) => {
    try {
      this.loading = true;
      const result = await DocService.importDocs(docsData);

      // Перезагружаем документы
      await this.loadDocuments();

      message.success('Документы успешно импортированы');
      return result;
    } catch (error) {
      console.error('Error importing documents:', error);
      message.error(
        error.response?.data?.message || 'Ошибка импорта документов'
      );
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // ========== ТИПЫ ОБУЧЕНИЯ ==========

  // Загрузка всех типов обучения
  loadTrainingTypes = action(async () => {
    try {
      const types = await DocService.fetchAllTrainingTypes();
      this.trainingTypes.replace(types);
      return types;
    } catch (error) {
      console.error('Error loading training types:', error);
      throw error;
    }
  });

  // Создать тип обучения
  createTrainingType = action(async (typeData) => {
    try {
      this.loading = true;
      const newType = await DocService.createTrainingType(typeData);

      // Добавляем в список
      this.trainingTypes.push(newType);

      message.success('Тип обучения успешно создан');
      return newType;
    } catch (error) {
      console.error('Error creating training type:', error);
      message.error(
        error.response?.data?.message || 'Ошибка создания типа обучения'
      );
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // Обновить тип обучения
  updateTrainingType = action(async (id, typeData) => {
    try {
      this.loading = true;
      const updatedType = await DocService.updateTrainingType(id, typeData);

      // Обновляем в списке
      const index = this.trainingTypes.findIndex((type) => type.id === id);
      if (index !== -1) {
        this.trainingTypes[index] = updatedType;
      }

      message.success('Тип обучения успешно обновлен');
      return updatedType;
    } catch (error) {
      console.error('Error updating training type:', error);
      message.error(
        error.response?.data?.message || 'Ошибка обновления типа обучения'
      );
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // Удалить тип обучения
  deleteTrainingType = action(async (id) => {
    try {
      this.loading = true;

      // Проверяем, используется ли тип обучения в документах
      const isUsed = this.documents.some((doc) => doc.training_type_id === id);
      if (isUsed) {
        throw new Error(
          'Тип обучения используется в документах и не может быть удален'
        );
      }

      await DocService.deleteTrainingType(id);

      // Удаляем из списка
      this.trainingTypes = this.trainingTypes.filter((type) => type.id !== id);

      message.success('Тип обучения успешно удален');
    } catch (error) {
      console.error('Error deleting training type:', error);
      message.error(error.message || 'Ошибка удаления типа обучения');
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // ========== КАТЕГОРИИ ==========

  // Загрузка всех категорий
  loadCategories = action(async () => {
    try {
      const categories = await DocService.fetchAllDocCategories();
      this.categories.replace(categories);
      return categories;
    } catch (error) {
      console.error('Error loading categories:', error);
      throw error;
    }
  });

  // Создать категорию
  createCategory = action(async (categoryData) => {
    try {
      this.loading = true;
      const newCategory = await DocService.createDocCategory(categoryData);

      // Добавляем в список
      this.categories.push(newCategory);

      message.success('Категория успешно создана');
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      message.error(
        error.response?.data?.message || 'Ошибка создания категории'
      );
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // Обновить категорию
  updateCategory = action(async (id, categoryData) => {
    try {
      this.loading = true;
      const updatedCategory = await DocService.updateDocCategory(
        id,
        categoryData
      );

      // Обновляем в списке
      const index = this.categories.findIndex((cat) => cat.id === id);
      if (index !== -1) {
        this.categories[index] = updatedCategory;
      }

      message.success('Категория успешно обновлена');
      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      message.error(
        error.response?.data?.message || 'Ошибка обновления категории'
      );
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // Удалить категорию
  deleteCategory = action(async (id) => {
    try {
      this.loading = true;

      // Проверяем, используется ли категория в документах
      const isUsed = this.documents.some((doc) => doc.category_id === id);
      if (isUsed) {
        throw new Error(
          'Категория используется в документах и не может быть удалена'
        );
      }

      await DocService.deleteDocCategory(id);

      // Удаляем из списка
      this.categories = this.categories.filter((cat) => cat.id !== id);

      message.success('Категория успешно удалена');
    } catch (error) {
      console.error('Error deleting category:', error);
      message.error(error.message || 'Ошибка удаления категории');
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // ========== СТАТУСЫ ==========

  // Загрузка всех статусов
  loadStatuses = action(async () => {
    try {
      const statuses = await DocService.fetchAllDocStatuses();
      this.statuses.replace(statuses);
      return statuses;
    } catch (error) {
      console.error('Error loading statuses:', error);
      throw error;
    }
  });

  // Создать статус
  createStatus = action(async (statusData) => {
    try {
      this.loading = true;
      const newStatus = await DocService.createDocStatus(statusData);

      // Добавляем в список
      this.statuses.push(newStatus);

      message.success('Статус успешно создан');
      return newStatus;
    } catch (error) {
      console.error('Error creating status:', error);
      message.error(error.response?.data?.message || 'Ошибка создания статуса');
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // Обновить статус
  updateStatus = action(async (id, statusData) => {
    try {
      this.loading = true;
      const updatedStatus = await DocService.updateDocStatus(id, statusData);

      // Обновляем в списке
      const index = this.statuses.findIndex((status) => status.id === id);
      if (index !== -1) {
        this.statuses[index] = updatedStatus;
      }

      message.success('Статус успешно обновлен');
      return updatedStatus;
    } catch (error) {
      console.error('Error updating status:', error);
      message.error(
        error.response?.data?.message || 'Ошибка обновления статуса'
      );
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // Удалить статус
  deleteStatus = action(async (id) => {
    try {
      this.loading = true;

      // Проверяем, используется ли статус в документах
      const isUsed = this.documents.some((doc) => doc.status_id === id);
      if (isUsed) {
        throw new Error(
          'Статус используется в документах и не может быть удален'
        );
      }

      await DocService.deleteDocStatus(id);

      // Удаляем из списка
      this.statuses = this.statuses.filter((status) => status.id !== id);

      message.success('Статус успешно удален');
    } catch (error) {
      console.error('Error deleting status:', error);
      message.error(error.message || 'Ошибка удаления статуса');
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // ========== ФИЛЬТРАЦИЯ И ПОИСК ==========

  // Установить фильтры
  setFilters = action((filters) => {
    this.filters = { ...this.filters, ...filters };

    // Загружаем документы с новыми фильтрами
    this.loadDocuments();
  });

  // Сбросить фильтры
  resetFilters = action(() => {
    this.filters = {
      search: '',
      trainingTypeId: null,
      categoryId: null,
      statusId: null,
    };
    this.pagination.current = 1;

    // Загружаем документы без фильтров
    this.loadDocuments();
  });

  // Поиск документов
  searchDocuments = action((searchTerm) => {
    this.filters.search = searchTerm;
    this.pagination.current = 1;
    this.loadDocuments();
  });

  // Фильтровать по типу обучения
  filterByTrainingType = action((trainingTypeId) => {
    this.filters.trainingTypeId = trainingTypeId;
    this.pagination.current = 1;
    this.loadDocuments();
  });

  // Фильтровать по категории
  filterByCategory = action((categoryId) => {
    this.filters.categoryId = categoryId;
    this.pagination.current = 1;
    this.loadDocuments();
  });

  // Фильтровать по статусу
  filterByStatus = action((statusId) => {
    this.filters.statusId = statusId;
    this.pagination.current = 1;
    this.loadDocuments();
  });

  // ========== ПАГИНАЦИЯ ==========

  // Изменить страницу
  setPage = action((page) => {
    this.pagination.current = page;
    this.loadDocuments();
  });

  // Изменить размер страницы
  setPageSize = action((pageSize) => {
    this.pagination.pageSize = pageSize;
    this.pagination.current = 1;
    this.loadDocuments();
  });

  // ========== СТАТИСТИКА ==========

  // Обновить статистику
  updateStats = action(() => {
    try {
      const stats = {
        total: this.documents.length,
        byTrainingType: {},
        byCategory: {},
        byStatus: {},
        totalFileSize: 0,
      };

      this.documents.forEach((doc) => {
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

      this.stats = stats;
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  });

  // Загрузить полную статистику
  loadFullStats = action(async () => {
    try {
      const fullStats = await DocService.getDocsStats();
      this.stats = fullStats;
      return fullStats;
    } catch (error) {
      console.error('Error loading full stats:', error);
      return this.stats;
    }
  });

  // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

  // Получить название типа обучения по ID
  getTrainingTypeName = (id) => {
    const type = this.trainingTypes.find((t) => t.id === id);
    return type?.name || 'Неизвестно';
  };

  // Получить название категории по ID
  getCategoryName = (id) => {
    const category = this.categories.find((c) => c.id === id);
    return category?.name || 'Неизвестно';
  };

  // Получить название статуса по ID
  getStatusName = (id) => {
    const status = this.statuses.find((s) => s.id === id);
    return status?.name || 'Неизвестно';
  };

  // Получить документы по типу обучения
  getDocumentsByTrainingType = (trainingTypeId) => {
    return this.documents.filter(
      (doc) => doc.training_type_id === trainingTypeId
    );
  };

  // Получить активные документы
  get activeDocuments() {
    const activeStatus = this.statuses.find((s) => s.code === 'active');
    if (!activeStatus) return [];

    return this.documents.filter((doc) => doc.status_id === activeStatus.id);
  }

  // Получить архивные документы
  get archivedDocuments() {
    const archivedStatus = this.statuses.find((s) => s.code === 'archived');
    if (!archivedStatus) return [];

    return this.documents.filter((doc) => doc.status_id === archivedStatus.id);
  }

  // Получить черновики
  get draftDocuments() {
    const draftStatus = this.statuses.find((s) => s.code === 'draft');
    if (!draftStatus) return [];

    return this.documents.filter((doc) => doc.status_id === draftStatus.id);
  }

  // Проверить, существует ли документ с таким названием
  isDocumentNameExists = (name, excludeId = null) => {
    return this.documents.some(
      (doc) =>
        doc.title.toLowerCase() === name.toLowerCase() && doc.id !== excludeId
    );
  };

  // Скачать документ
  downloadDocument = action(async (document) => {
    try {
      const fileName = document.file_name || `document_${document.id}.pdf`;
      await DocService.downloadDoc(document.file_url, fileName);
      message.success('Документ начал скачиваться');
    } catch (error) {
      console.error('Error downloading document:', error);
      message.error('Ошибка скачивания документа');
      throw error;
    }
  });

  // Просмотреть документ

  viewDocument = action((document) => {
    console.log('Opening document:', {
      document,
      file_url: document.file_url,
    });

    let url = document.file_url || document.url;

    if (!url) {
      message.error('Ссылка на документ отсутствует');
      return;
    }

    console.log('Original URL:', url);

    // Проверяем разные форматы URL
    if (url.startsWith('http://')) {
      // URL уже полный
      console.log('Full URL detected, opening:', url);
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Если URL начинается со слеша, добавляем домен
    if (url.startsWith('/')) {
      const fullUrl = `${window.location.origin}${url}`;
      console.log('Relative URL with slash, opening:', fullUrl);
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Если URL не начинается со слеша, но есть статическая папка
    if (url.includes('static/') || url.includes('documents/')) {
      // Добавляем слеш в начало если его нет
      if (!url.startsWith('/')) {
        url = `/${url}`;
      }
      const fullUrl = `${window.location.origin}${url}`;
      console.log('Static URL, opening:', fullUrl);
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Для относительных путей
    const fullUrl = `${window.location.origin}/static/${url}`;
    console.log('Relative URL, opening:', fullUrl);
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  });

  // Сбросить текущий документ
  resetCurrentDocument = action(() => {
    this.currentDocument = null;
  });

  // Получить документы для отображения (с фильтрацией и пагинацией)
  get displayedDocuments() {
    const { current, pageSize } = this.pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return this.documents.slice(startIndex, endIndex);
  }

  // Получить общее количество документов
  get totalDocuments() {
    return this.documents.length;
  }

  // Получить общее количество активных документов
  get totalActiveDocuments() {
    return this.activeDocuments.length;
  }

  // Получить последние добавленные документы
  get recentDocuments() {
    return [...this.documents]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }

  // Получить документы, требующие внимания (черновики, на утверждении)
  get attentionRequiredDocuments() {
    const draftStatus = this.statuses.find((s) => s.code === 'draft');
    const pendingStatus = this.statuses.find((s) => s.code === 'pending');

    const statusIds = [];
    if (draftStatus) statusIds.push(draftStatus.id);
    if (pendingStatus) statusIds.push(pendingStatus.id);

    return this.documents.filter((doc) => statusIds.includes(doc.status_id));
  }

  // Проверка загрузки
  get isLoadingData() {
    return this.isLoading || this.loading;
  }
}

// Создаем и экспортируем единственный экземпляр store
const documentStore = new DocumentStore();
export default documentStore;
