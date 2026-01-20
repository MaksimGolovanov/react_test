// src/features/security-training/components/documents/DocumentsTab.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Row,
  Col,
  Button,
  Typography,
  List,
  Tag,
  Empty,
  Select,
  Space,
  Badge,
  Input,
  Spin,
  message,
} from 'antd';
import {
  FilePdfOutlined,
  EyeOutlined,
  SafetyOutlined,
  FireOutlined,
  MedicineBoxOutlined,
  SecurityScanOutlined,
  BookOutlined,
  TeamOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import documentStore from '../../store/DocumentStore';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

// Иконки для типов обучения (соответствуют кодам из БД)
const TRAINING_TYPE_ICONS = {
  information_security: <SecurityScanOutlined style={{ color: '#1890ff' }} />,
  labor_protection: <SafetyOutlined style={{ color: '#52c41a' }} />,
  fire_safety: <FireOutlined style={{ color: '#fa541c' }} />,
  first_aid: <MedicineBoxOutlined style={{ color: '#eb2f96' }} />,
  electrical_safety: <SafetyOutlined style={{ color: '#722ed1' }} />,
  environmental_safety: <TeamOutlined style={{ color: '#13c2c2' }} />,
  general_requirements: <BookOutlined style={{ color: '#fa8c16' }} />,
};

// Статусы документов
const STATUS_COLORS = {
  active: 'green',
  draft: 'orange',
  archived: 'gray',
  pending: 'blue',
};

const STATUS_LABELS = {
  active: 'Активный',
  draft: 'Черновик',
  archived: 'Архивный',
  pending: 'На утверждении',
};

// Вспомогательный компонент для отображения отдельного документа
const DocumentItem = observer(
  ({ item, handleOpenDocument, handleDownloadDocument }) => {
    const {
      title,
      description,
      training_type,
      category,
      status,
      file_size,
      created_at,
      file_url,
    } = item;

    // Форматирование даты
    const formatDate = (dateString) => {
      if (!dateString) return 'Дата неизвестна';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      } catch (error) {
        return 'Некорректная дата';
      }
    };

    const formattedDate = formatDate(created_at);

    const styles = {
      pdfIcon: {
        fontSize: '28px',
        color: '#ff4d4f',
      },
      avatarContainer: {
        position: 'relative',
      },
      trainingTypeIcon: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        background: '#fff',
        borderRadius: '50%',
        padding: 2,
        fontSize: '14px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      },
      tag: {
        fontSize: '11px',
        margin: 0,
      },
    };

    // Определяем цвет статуса
    const getStatusColor = (statusCode) => {
      return STATUS_COLORS[statusCode] || 'default';
    };

    // Определяем текст статуса
    const getStatusLabel = (statusCode, statusName) => {
      return statusName || STATUS_LABELS[statusCode] || 'Неизвестно';
    };

    return (
      <List.Item
        key={item.id}
        actions={[
          <Button
            key="view"
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleOpenDocument(item)} // Передаем весь объект, не только file_url
            title="Просмотреть"
            disabled={!item.file_url && !item.url} // Проверяем оба поля
            size="small"
          />,
        ]}
      >
        <List.Item.Meta
          avatar={
            <div style={styles.avatarContainer}>
              <FilePdfOutlined style={styles.pdfIcon} />
              {training_type?.code &&
                TRAINING_TYPE_ICONS[training_type.code] && (
                  <div style={styles.trainingTypeIcon}>
                    {TRAINING_TYPE_ICONS[training_type.code]}
                  </div>
                )}
            </div>
          }
          title={
            <div>
              <Space>
                <Text strong style={{ fontSize: '14px' }}>
                  {title || 'Без названия'}
                </Text>
                {status?.code && (
                  <Badge
                    color={getStatusColor(status.code)}
                    text={getStatusLabel(status.code, status.name)}
                    size="small"
                  />
                )}
              </Space>
            </div>
          }
          description={
            <div>
              <div style={{ marginBottom: 4, fontSize: '12px', color: '#666' }}>
                {description || 'Описание отсутствует'}
              </div>
              <Space wrap size={[8, 4]}>
                {training_type && (
                  <Tag
                    color="blue"
                    icon={
                      training_type.code &&
                      TRAINING_TYPE_ICONS[training_type.code]
                    }
                    style={styles.tag}
                  >
                    {training_type.name}
                  </Tag>
                )}
                {category && (
                  <Tag color="cyan" style={styles.tag}>
                    {category.name}
                  </Tag>
                )}
                {file_size && (
                  <Tag color="default" style={styles.tag}>
                    {file_size}
                  </Tag>
                )}
                {formattedDate && (
                  <Tag color="default" style={styles.tag}>
                    {formattedDate}
                  </Tag>
                )}
              </Space>
            </div>
          }
        />
      </List.Item>
    );
  }
);

const DocumentsTab = observer(
  ({
    title = 'Нормативные документы и стандарты',
    showFilters = true,
    onOpenDocument,
    onDownloadDocument,
    
  }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTrainingType, setSelectedTrainingType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Загрузка документов и справочников при монтировании
    useEffect(() => {
      loadData();
    }, []);

    const loadData = async () => {
      try {
        setIsInitialLoading(true);

        // Если переданы внешние документы, не загружаем из store
        
          await Promise.all([
            documentStore.loadDocuments(),
            documentStore.loadTrainingTypes(),
            documentStore.loadCategories(),
            documentStore.loadStatuses(),
          ]);
        
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Ошибка загрузки данных');
      } finally {
        setIsInitialLoading(false);
      }
    };

    // Обработчик открытия документа
    const handleOpenDocument = useCallback(
      (record) => {
        console.log('Opening document from DocumentsTab:', record);

        // Если передан внешний обработчик, используем его
        if (onOpenDocument && typeof onOpenDocument === 'function') {
          onOpenDocument(record);
        } else {
          // Иначе используем стандартную логику
          let url = record.url || record.file_url || '';

          if (!url || url.trim() === '') {
            message.error('Ссылка на документ отсутствует');
            return;
          }

          // ... стандартная логика формирования URL
          if (!url.startsWith('/')) {
            url = `/${url}`;
          }

          const apiBaseUrl = process.env.REACT_APP_API_URL || '';
          let baseUrl;

          if (apiBaseUrl.includes('localhost')) {
            baseUrl = apiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
          } else {
            baseUrl = apiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
          }

          const fullUrl = `${baseUrl}${url}`;
          window.open(fullUrl, '_blank', 'noopener,noreferrer');
        }
      },
      [onOpenDocument]
    );

    // Обработчик скачивания документа
    const handleDownloadDocument = useCallback(
      async (document) => {
        // Если передан внешний обработчик, используем его
        if (onDownloadDocument && typeof onDownloadDocument === 'function') {
          onDownloadDocument(document);
        } else {
          // Иначе используем стандартную логику из store
          try {
            await documentStore.downloadDocument(document);
          } catch (error) {
            // Ошибка уже обработана в store
          }
        }
      },
      [onDownloadDocument]
    );

    // Обработчик поиска
    const handleSearch = useCallback((value) => {
      setSearchText(value);
      setSelectedCategory('all');
      setSelectedTrainingType('all');
      setSelectedStatus('all');
      documentStore.searchDocuments(value);
    }, []);

    // Обработчик фильтрации по типу обучения
    const handleTrainingTypeFilter = useCallback((value) => {
      setSelectedTrainingType(value);
      setSearchText('');
      documentStore.filterByTrainingType(value === 'all' ? null : value);
    }, []);

    // Обработчик фильтрации по категории
    const handleCategoryFilter = useCallback((value) => {
      setSelectedCategory(value);
      setSearchText('');
      documentStore.filterByCategory(value === 'all' ? null : value);
    }, []);

    // Обработчик фильтрации по статусу
    const handleStatusFilter = useCallback((value) => {
      setSelectedStatus(value);
      setSearchText('');
      documentStore.filterByStatus(value === 'all' ? null : value);
    }, []);

    // Сброс фильтров
    const handleResetFilters = useCallback(() => {
      setSelectedCategory('all');
      setSelectedTrainingType('all');
      setSelectedStatus('all');
      setSearchText('');
      documentStore.resetFilters();
    }, []);

    // Фильтрация документов на стороне клиента (если API не поддерживает фильтрацию)
    const filteredDocuments = useCallback(() => {
      let filtered = documentStore.documents || [];

      // Фильтрация по поисковому запросу
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        filtered = filtered.filter(
          (doc) =>
            (doc.title && doc.title.toLowerCase().includes(searchLower)) ||
            (doc.description &&
              doc.description.toLowerCase().includes(searchLower))
        );
      }

      // Фильтрация по типу обучения
      if (selectedTrainingType && selectedTrainingType !== 'all') {
        filtered = filtered.filter(
          (doc) =>
            doc.training_type_id === parseInt(selectedTrainingType) ||
            doc.training_type?.id === parseInt(selectedTrainingType)
        );
      }

      // Фильтрация по категории
      if (selectedCategory && selectedCategory !== 'all') {
        filtered = filtered.filter(
          (doc) =>
            doc.category_id === parseInt(selectedCategory) ||
            doc.category?.id === parseInt(selectedCategory)
        );
      }

      // Фильтрация по статусу
      if (selectedStatus && selectedStatus !== 'all') {
        filtered = filtered.filter(
          (doc) =>
            doc.status_id === parseInt(selectedStatus) ||
            doc.status?.id === parseInt(selectedStatus)
        );
      }

      return filtered;
    }, [
      
      documentStore.documents,
      searchText,
      selectedTrainingType,
      selectedCategory,
      selectedStatus,
    ]);

    // Получение отображаемых документов с пагинацией
    const getDisplayedDocuments = useCallback(() => {
      const filtered = filteredDocuments();
      const { current, pageSize } = documentStore.pagination;
      const startIndex = (current - 1) * pageSize;
      return filtered.slice(startIndex, startIndex + pageSize);
    }, [filteredDocuments, documentStore.pagination]);

    const styles = {
      container: {
        padding: '16px 0',
      },
      title: {
        marginBottom: '24px',
      },
      filterContainer: {
        marginBottom: '24px',
        padding: '16px',
        background: '#fafafa',
        borderRadius: '8px',
        border: '1px solid #f0f0f0',
      },
      filterRow: {
        marginBottom: '12px',
      },
      list: {
        border: '1px solid #f0f0f0',
        borderRadius: '8px',
      },
      infoContainer: {
        marginTop: '24px',
        padding: '16px',
        background: '#f6f6f6',
        borderRadius: '8px',
      },
      statsContainer: {
        marginBottom: '16px',
        padding: '12px',
        background: '#fff',
        borderRadius: '8px',
        border: '1px solid #f0f0f0',
      },
    };

    // Если идет первоначальная загрузка
    if (isInitialLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Загрузка документов и справочников...</Text>
          </div>
        </div>
      );
    }

    const currentFilteredDocuments = filteredDocuments();
    const displayedDocuments = getDisplayedDocuments();

    return (
      <div style={styles.container}>
        <Title level={4} style={styles.title}>
          {title}
        </Title>


        {showFilters && (
          <div style={styles.filterContainer}>
            <Row gutter={[16, 12]} style={styles.filterRow}>
              <Col span={24}>
                <Search
                  placeholder="Поиск по названию или описанию..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={handleSearch}
                  allowClear
                  enterButton="Найти"
                  size="middle"
                />
              </Col>
            </Row>

            <Row gutter={[16, 12]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="Тип обучения"
                  style={{ width: '100%' }}
                  value={selectedTrainingType}
                  onChange={handleTrainingTypeFilter}
                  allowClear
                  suffixIcon={<FilterOutlined />}
                  size="middle"
                >
                  <Option value="all">Все типы</Option>
                  {documentStore.trainingTypes?.map((type) => (
                    <Option key={type.id} value={type.id}>
                      <Space>
                        {type.code && TRAINING_TYPE_ICONS[type.code]}
                        {type.name}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="Категория"
                  style={{ width: '100%' }}
                  value={selectedCategory}
                  onChange={handleCategoryFilter}
                  allowClear
                  suffixIcon={<FilterOutlined />}
                  size="middle"
                >
                  <Option value="all">Все категории</Option>
                  {documentStore.categories?.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="Статус"
                  style={{ width: '100%' }}
                  value={selectedStatus}
                  onChange={handleStatusFilter}
                  allowClear
                  suffixIcon={<FilterOutlined />}
                  size="middle"
                >
                  <Option value="all">Все статусы</Option>
                  {documentStore.statuses?.map((status) => (
                    <Option key={status.id} value={status.id}>
                      <Space>
                        <Badge
                          color={STATUS_COLORS[status.code] || 'default'}
                          style={{ marginRight: 4 }}
                        />
                        {status.name}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Button
                  onClick={handleResetFilters}
                  style={{ width: '100%' }}
                  size="middle"
                >
                  Сбросить фильтры
                </Button>
              </Col>
            </Row>

            {/* Информация о результатах фильтрации */}
            {(searchText ||
              selectedTrainingType !== 'all' ||
              selectedCategory !== 'all' ||
              selectedStatus !== 'all') && (
              <Row style={{ marginTop: 12 }}>
                <Col span={24}>
                  <Text type="secondary">
                    Найдено документов: {currentFilteredDocuments.length}
                    {searchText && ` по запросу "${searchText}"`}
                  </Text>
                </Col>
              </Row>
            )}
          </div>
        )}

        {documentStore.isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Загрузка документов...</Text>
            </div>
          </div>
        ) : displayedDocuments.length > 0 ? (
          <List
            dataSource={displayedDocuments}
            renderItem={(item) => (
              <DocumentItem
                item={item}
                handleOpenDocument={handleOpenDocument}
                handleDownloadDocument={handleDownloadDocument}
              />
            )}
            rowKey="id"
            style={styles.list}
            pagination={{
              current: documentStore.pagination.current,
              pageSize: documentStore.pagination.pageSize,
              total: currentFilteredDocuments.length,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} из ${total} документов`,
              onChange: (page) => documentStore.setPage(page),
              onShowSizeChange: (current, size) =>
                documentStore.setPageSize(size),
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
          />
        ) : (
          <Empty
            description={
              <div>
                <div style={{ marginBottom: 8 }}>Документы не найдены</div>
                <Text type="secondary">
                  {searchText ||
                  selectedCategory !== 'all' ||
                  selectedTrainingType !== 'all' ||
                  selectedStatus !== 'all'
                    ? 'Попробуйте изменить параметры фильтрации'
                    : 'Документы еще не добавлены'}
                </Text>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    );
  }
);

DocumentsTab.defaultProps = {
  showFilters: true,
};

export default DocumentsTab;
