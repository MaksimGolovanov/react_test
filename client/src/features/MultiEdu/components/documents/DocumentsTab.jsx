// src/features/security-training/components/documents/DocumentsTab.jsx

import { useState, useEffect, useCallback } from 'react';
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
  Card,
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
import './DocumentsTab.css'; // импорт стилей

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

// Иконки для типов обучения (соответствуют кодам из БД)
const TRAINING_TYPE_ICONS = {
  information_security: <SecurityScanOutlined />,
  labor_protection: <SafetyOutlined />,
  fire_safety: <FireOutlined />,
  first_aid: <MedicineBoxOutlined />,
  electrical_safety: <SafetyOutlined />,
  environmental_safety: <TeamOutlined />,
  general_requirements: <BookOutlined />,
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
const DocumentItem = observer(({ item, handleOpenDocument, handleDownloadDocument }) => {
  const {
    title,
    description,
    training_type,
    category,
    status,
    file_size,
    created_at,
  } = item;

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

  const getStatusColor = (statusCode) => STATUS_COLORS[statusCode] || 'default';
  const getStatusLabel = (statusCode, statusName) => statusName || STATUS_LABELS[statusCode] || 'Неизвестно';

  return (
    <List.Item
      actions={[
        <Button
          key="view"
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleOpenDocument(item)}
          title="Просмотреть"
          disabled={!item.file_url && !item.url}
          size="small"
        />,
      ]}
      className="document-list-item"
    >
      <List.Item.Meta
        avatar={
          <div className="document-avatar">
            <FilePdfOutlined className="pdf-icon" />
            {training_type?.code && TRAINING_TYPE_ICONS[training_type.code] && (
              <div className="training-type-icon">
                {TRAINING_TYPE_ICONS[training_type.code]}
              </div>
            )}
          </div>
        }
        title={
          <Space>
            <Text strong className="document-title">
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
        }
        description={
          <div>
            <div className="document-description">
              {description || 'Описание отсутствует'}
            </div>
            <Space wrap size={[8, 4]} className="document-tags">
              {training_type && (
                <Tag
                  color="blue"
                  icon={training_type.code && TRAINING_TYPE_ICONS[training_type.code]}
                  className="document-tag"
                >
                  {training_type.name}
                </Tag>
              )}
              {category && (
                <Tag color="cyan" className="document-tag">
                  {category.name}
                </Tag>
              )}
              {file_size && (
                <Tag className="document-tag">
                  {file_size}
                </Tag>
              )}
              {formattedDate && (
                <Tag className="document-tag">
                  {formattedDate}
                </Tag>
              )}
            </Space>
          </div>
        }
      />
    </List.Item>
  );
});

const DocumentsTab = observer(({
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsInitialLoading(true);
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

  const handleOpenDocument = useCallback((record) => {
    if (onOpenDocument && typeof onOpenDocument === 'function') {
      onOpenDocument(record);
    } else {
      let url = record.url || record.file_url || '';
      if (!url || url.trim() === '') {
        message.error('Ссылка на документ отсутствует');
        return;
      }
      if (!url.startsWith('/')) {
        url = `/${url}`;
      }
      const apiBaseUrl = process.env.REACT_APP_API_URL || '';
      const baseUrl = apiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
      const fullUrl = `${baseUrl}${url}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  }, [onOpenDocument]);

  const handleDownloadDocument = useCallback(async (document) => {
    if (onDownloadDocument && typeof onDownloadDocument === 'function') {
      onDownloadDocument(document);
    } else {
      try {
        await documentStore.downloadDocument(document);
      } catch (error) {
        // ошибка уже обработана в store
      }
    }
  }, [onDownloadDocument]);

  const handleSearch = useCallback((value) => {
    setSearchText(value);
    setSelectedCategory('all');
    setSelectedTrainingType('all');
    setSelectedStatus('all');
    documentStore.searchDocuments(value);
  }, []);

  const handleTrainingTypeFilter = useCallback((value) => {
    setSelectedTrainingType(value);
    setSearchText('');
    documentStore.filterByTrainingType(value === 'all' ? null : value);
  }, []);

  const handleCategoryFilter = useCallback((value) => {
    setSelectedCategory(value);
    setSearchText('');
    documentStore.filterByCategory(value === 'all' ? null : value);
  }, []);

  const handleStatusFilter = useCallback((value) => {
    setSelectedStatus(value);
    setSearchText('');
    documentStore.filterByStatus(value === 'all' ? null : value);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedCategory('all');
    setSelectedTrainingType('all');
    setSelectedStatus('all');
    setSearchText('');
    documentStore.resetFilters();
  }, []);

  // Клиентская фильтрация (если API не поддерживает фильтрацию)
  const filteredDocuments = useCallback(() => {
    let filtered = documentStore.documents || [];

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          (doc.title && doc.title.toLowerCase().includes(searchLower)) ||
          (doc.description && doc.description.toLowerCase().includes(searchLower))
      );
    }

    if (selectedTrainingType && selectedTrainingType !== 'all') {
      filtered = filtered.filter(
        (doc) =>
          doc.training_type_id === parseInt(selectedTrainingType) ||
          doc.training_type?.id === parseInt(selectedTrainingType)
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(
        (doc) =>
          doc.category_id === parseInt(selectedCategory) ||
          doc.category?.id === parseInt(selectedCategory)
      );
    }

    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(
        (doc) =>
          doc.status_id === parseInt(selectedStatus) ||
          doc.status?.id === parseInt(selectedStatus)
      );
    }

    return filtered;
  }, [searchText, selectedTrainingType, selectedCategory, selectedStatus]);

  const getDisplayedDocuments = useCallback(() => {
    const filtered = filteredDocuments();
    const { current, pageSize } = documentStore.pagination;
    const startIndex = (current - 1) * pageSize;
    return filtered.slice(startIndex, startIndex + pageSize);
  }, [filteredDocuments]);

  if (isInitialLoading) {
    return (
      <div className="documents-loading">
        <Spin size="large" />
        <div className="loading-text">Загрузка документов и справочников...</div>
      </div>
    );
  }

  const currentFilteredDocuments = filteredDocuments();
  const displayedDocuments = getDisplayedDocuments();

  return (
    <div className="documents-container">
      <Title level={4} className="documents-title">
        {title}
      </Title>

      {showFilters && (
        <Card size="small" className="filter-card">
          <Row gutter={[16, 12]}>
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

          <Row gutter={[16, 12]} className="filter-row">
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
              <Button onClick={handleResetFilters} style={{ width: '100%' }} size="middle">
                Сбросить фильтры
              </Button>
            </Col>
          </Row>

          {(searchText ||
            selectedTrainingType !== 'all' ||
            selectedCategory !== 'all' ||
            selectedStatus !== 'all') && (
            <Row className="filter-info">
              <Col span={24}>
                <Text type="secondary">
                  Найдено документов: {currentFilteredDocuments.length}
                  {searchText && ` по запросу "${searchText}"`}
                </Text>
              </Col>
            </Row>
          )}
        </Card>
      )}

      {documentStore.isLoading ? (
        <div className="documents-loading">
          <Spin size="large" />
          <div className="loading-text">Загрузка документов...</div>
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
          className="documents-list"
          pagination={{
            current: documentStore.pagination.current,
            pageSize: documentStore.pagination.pageSize,
            total: currentFilteredDocuments.length,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} документов`,
            onChange: (page) => documentStore.setPage(page),
            onShowSizeChange: (current, size) => documentStore.setPageSize(size),
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
        />
      ) : (
        <Empty
          description={
            <div>
              <div>Документы не найдены</div>
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
          className="documents-empty"
        />
      )}
    </div>
  );
});

DocumentsTab.defaultProps = {
  showFilters: true,
};

export default DocumentsTab;