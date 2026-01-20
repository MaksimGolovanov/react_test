// src/features/security-training/components/admin/DocumentsContent.jsx

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Upload,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  message,
  Popconfirm,
  Typography,
  Tooltip,
  Badge,
  Spin,
} from 'antd';
import {
  UploadOutlined,
  
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FilePdfOutlined,
  SearchOutlined,
  SafetyOutlined,
  FireOutlined,
  MedicineBoxOutlined,
  SecurityScanOutlined,
  BookOutlined,
  TeamOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import documentStore from '../../store/DocumentStore';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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

// Основной компонент
const DocumentsContent = observer(() => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTrainingType, setSelectedTrainingType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка данных при монтировании
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
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
      setIsLoading(false);
    }
  };

  // Фильтрация документов
  const filteredDocuments = documentStore.documents.filter((doc) => {
    const matchesSearch = searchText
      ? (doc.title &&
          doc.title.toLowerCase().includes(searchText.toLowerCase())) ||
        (doc.description &&
          doc.description.toLowerCase().includes(searchText.toLowerCase()))
      : true;

    const matchesCategory =
      selectedCategory === 'all' ||
      doc.category_id?.toString() === selectedCategory ||
      doc.category?.id?.toString() === selectedCategory;

    const matchesTrainingType =
      selectedTrainingType === 'all' ||
      doc.training_type_id?.toString() === selectedTrainingType ||
      doc.training_type?.id?.toString() === selectedTrainingType;

    const matchesStatus =
      selectedStatus === 'all' ||
      doc.status_id?.toString() === selectedStatus ||
      doc.status?.id?.toString() === selectedStatus;

    return (
      matchesSearch && matchesCategory && matchesTrainingType && matchesStatus
    );
  });

  // Открытие модалки для добавления/редактирования
  const showModal = (document = null) => {
    setEditingDocument(document);
    if (document) {
      form.setFieldsValue({
        ...document,
        training_type_id:
          document.training_type_id || document.training_type?.id,
        category_id: document.category_id || document.category?.id,
        status_id: document.status_id || document.status?.id,
      });
    } else {
      form.resetFields();
      // Установка значений по умолчанию
      const activeStatus = documentStore.statuses.find(
        (s) => s.code === 'active'
      );
      const firstTrainingType = documentStore.trainingTypes[0];
      const firstCategory = documentStore.categories[0];

      form.setFieldsValue({
        status_id: activeStatus?.id,
        training_type_id: firstTrainingType?.id,
        category_id: firstCategory?.id,
        version: '1.0',
      });
    }
    setIsModalVisible(true);
  };

  // Функция для транслитерации русского текста в латиницу
  const transliterate = (text) => {
    if (!text) return '';

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
      А: 'A',
      Б: 'B',
      В: 'V',
      Г: 'G',
      Д: 'D',
      Е: 'E',
      Ё: 'Yo',
      Ж: 'Zh',
      З: 'Z',
      И: 'I',
      Й: 'Y',
      К: 'K',
      Л: 'L',
      М: 'M',
      Н: 'N',
      О: 'O',
      П: 'P',
      Р: 'R',
      С: 'S',
      Т: 'T',
      У: 'U',
      Ф: 'F',
      Х: 'Kh',
      Ц: 'Ts',
      Ч: 'Ch',
      Ш: 'Sh',
      Щ: 'Shch',
      Ъ: '',
      Ы: 'Y',
      Ь: '',
      Э: 'E',
      Ю: 'Yu',
      Я: 'Ya',
    };

    return text
      .split('')
      .map((char) => {
        return translitMap[char] || char;
      })
      .join('');
  };
 
  // Загрузка файла документа
  const handleFileUpload = async (file) => {
    setUploadingFile(true);
    try {
      const result = await documentStore.uploadDocumentFile(file);

      console.log("documentStore.uploadDocumentFile ",result)
      // Просто используем original_name, который сервер правильно возвращает
      const displayName = result.original_name || file.name;

      setUploadedFileData(result);

      // В форму записываем русское имя из original_name
      form.setFieldsValue({
        file_name: displayName,
        file_url: result.file_url,
        file_path: result.file_path,
        file_size: result.file_size,
      });

      message.success('Файл успешно загружен');
      return false;
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Ошибка загрузки файла');
      return false;
    } finally {
      setUploadingFile(false);
    }
  };

 
  // Сохранение документа
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      if (editingDocument) {
        // Обновление существующего документа
        await documentStore.updateDocument(editingDocument.id, {
          ...values,
          training_type_id: values.training_type_id,
          category_id: values.category_id,
          status_id: values.status_id,
        });
        message.success('Документ успешно обновлен');
      } else {
        // Создание нового документа
        await documentStore.createDocument({
          ...values,
          training_type_id: values.training_type_id,
          category_id: values.category_id,
          status_id: values.status_id,
        });
        message.success('Документ успешно создан');
      }

      setIsModalVisible(false);
      form.resetFields();
      setUploadedFileData(null);
    } catch (error) {
      console.error('Save error:', error);
      message.error(
        error.response?.data?.message || 'Ошибка сохранения документа'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Удаление документа
  const handleDelete = async (id) => {
    try {
      await documentStore.deleteDocument(id);
      message.success('Документ успешно удален');
    } catch (error) {
      console.error('Delete error:', error);
      message.error(
        error.response?.data?.message || 'Ошибка удаления документа'
      );
    }
  };

  // Просмотр документа
  // Просмотр документа
  // Просмотр документа
  const handleView = (record) => {
    console.log('Opening document:', record);

    let url = record.file_url || '';

    if (!url || url.trim() === '') {
      message.error('Ссылка на документ отсутствует');
      return;
    }

    console.log('Original URL:', url);

    // Убедимся, что URL начинается со слеша
    if (!url.startsWith('/')) {
      url = `/${url}`;
    }

    // Базовый URL берем из API_URL, но убираем конечный путь 'api/'
    const apiBaseUrl = process.env.REACT_APP_API_URL || '';
    let baseUrl;

    if (apiBaseUrl.includes('localhost')) {
      // Для разработки - localhost:5000
      baseUrl = apiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    } else {
      // Для продакшена - убираем 'api' из пути если есть
      baseUrl = apiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    }

    // Формируем полный URL
    const fullUrl = `${baseUrl}${url}`;

    console.log('Full URL:', {
      original: record.file_url,
      normalized: url,
      apiBaseUrl,
      baseUrl,
      fullUrl,
    });

    // Открываем в новом окне
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  // Сброс фильтров
  const handleResetFilters = () => {
    setSearchText('');
    setSelectedCategory('all');
    setSelectedTrainingType('all');
    setSelectedStatus('all');
    documentStore.resetFilters();
  };

  // Обновить данные
  const handleRefresh = () => {
    loadAllData();
  };

  // Колонки таблицы
  const columns = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text, record) => (
        <Space align="start">
          <FilePdfOutlined
            style={{ color: '#ff4d4f', fontSize: '18px', marginTop: 4 }}
          />
          <div>
            <Text strong style={{ fontSize: '14px', display: 'block' }}>
              {text || 'Без названия'}
            </Text>
            <Text
              type="secondary"
              style={{ fontSize: '12px', display: 'block' }}
            >
              {record.description || 'Без описания'}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Тип обучения',
      key: 'training_type',
      width: 180,
      render: (_, record) => {
        const type =
          record.training_type ||
          documentStore.trainingTypes.find(
            (t) => t.id === record.training_type_id
          );
        return type ? (
          <Space>
            {type.code && TRAINING_TYPE_ICONS[type.code]}
            <Text>{type.name}</Text>
          </Space>
        ) : (
          <Text type="secondary">Не указан</Text>
        );
      },
    },
    {
      title: 'Категория',
      key: 'category',
      width: 120,
      render: (_, record) => {
        const category =
          record.category ||
          documentStore.categories.find((c) => c.id === record.category_id);
        return category ? <Tag color="blue">{category.name}</Tag> : '-';
      },
    },
    {
      title: 'Статус',
      key: 'status',
      width: 120,
      render: (_, record) => {
        const status =
          record.status ||
          documentStore.statuses.find((s) => s.id === record.status_id);
        if (!status) return '-';

        const statusColor = STATUS_COLORS[status.code] || 'default';
        const statusLabel =
          status.name || STATUS_LABELS[status.code] || 'Неизвестно';

        return (
          <Space>
            <Tag color={statusColor}>{statusLabel}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Дата',
      dataIndex: 'created_at',
      key: 'date',
      width: 100,
      render: (date) => {
        if (!date) return '-';
        try {
          return new Date(date).toLocaleDateString('ru-RU');
        } catch {
          return date;
        }
      },
    },
    {
      title: 'Размер',
      dataIndex: 'file_size',
      key: 'file_size',
      width: 90,
      render: (size) => size || '-',
    },
    {
      title: 'Версия',
      dataIndex: 'version',
      key: 'version',
      width: 80,
      render: (version) => version || '1.0',
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space>
          <Tooltip title="Просмотреть">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)} // Передаем весь объект записи
              disabled={!record.file_url}
              size="small"
            />
          </Tooltip>

          <Tooltip title="Редактировать">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Удалить документ?"
            description="Вы уверены, что хотите удалить этот документ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Tooltip title="Удалить">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading && !filteredDocuments.length) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Загрузка документов...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Заголовок и кнопки действий */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Управление документами
          </Title>
          <Text type="secondary">
            Всего документов: {documentStore.totalDocuments} | Активных:{' '}
            {documentStore.totalActiveDocuments} | Черновиков:{' '}
            {documentStore.draftDocuments.length}
          </Text>
        </Col>
        <Col>
          <Space>
            <Tooltip title="Обновить данные">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={documentStore.isLoading}
              />
            </Tooltip>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => showModal()}
              loading={documentStore.loading}
            >
              Добавить документ
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Фильтры */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Input
              placeholder="Поиск по названию или описанию..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="middle"
            />
          </Col>
          <Col>
            <Select
              placeholder="Тип обучения"
              style={{ width: 200 }}
              value={selectedTrainingType}
              onChange={setSelectedTrainingType}
              allowClear
              loading={documentStore.trainingTypes.length === 0}
              size="middle"
            >
              <Option value="all">Все типы</Option>
              {documentStore.trainingTypes.map((type) => (
                <Option key={type.id} value={type.id}>
                  <Space>
                    {type.code && TRAINING_TYPE_ICONS[type.code]}
                    {type.name}
                  </Space>
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              placeholder="Категория"
              style={{ width: 150 }}
              value={selectedCategory}
              onChange={setSelectedCategory}
              allowClear
              loading={documentStore.categories.length === 0}
              size="middle"
            >
              <Option value="all">Все категории</Option>
              {documentStore.categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              placeholder="Статус"
              style={{ width: 150 }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
              loading={documentStore.statuses.length === 0}
              size="middle"
            >
              <Option value="all">Все статусы</Option>
              {documentStore.statuses.map((status) => (
                <Option key={status.id} value={status.id}>
                  <Space>
                    <Badge color={STATUS_COLORS[status.code] || 'default'} />
                    {status.name}
                  </Space>
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Button onClick={handleResetFilters}>Сбросить фильтры</Button>
          </Col>
        </Row>
        <Row style={{ marginTop: 8 }}>
          <Col span={24}>
            <Text type="secondary">
              Найдено документов: {filteredDocuments.length}
              {searchText && ` по запросу "${searchText}"`}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Таблица документов */}
      <Card>
        {documentStore.isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Загрузка таблицы...</Text>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredDocuments}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Найдено ${total} документов`,
            }}
            scroll={{ x: 1200 }}
            loading={documentStore.loading}
          />
        )}
      </Card>

      {/* Модалка добавления/редактирования документа */}
      <Modal
        title={
          editingDocument ? 'Редактировать документ' : 'Добавить новый документ'
        }
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setUploadedFileData(null);
        }}
        width={600}
        okText={editingDocument ? 'Обновить' : 'Добавить'}
        cancelText="Отмена"
        confirmLoading={documentStore.loading || isLoading}
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item
            name="title"
            label="Название документа"
            rules={[{ required: true, message: 'Введите название документа' }]}
          >
            <Input placeholder="Например: Стандарт информационной безопасности" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание"
            rules={[{ required: true, message: 'Введите описание документа' }]}
          >
            <TextArea rows={3} placeholder="Краткое описание документа..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="training_type_id"
                label="Тип обучения"
                rules={[{ required: true, message: 'Выберите тип обучения' }]}
              >
                <Select
                  placeholder="Выберите тип обучения"
                  loading={documentStore.trainingTypes.length === 0}
                >
                  {documentStore.trainingTypes.map((type) => (
                    <Option key={type.id} value={type.id}>
                      <Space>
                        {type.code && TRAINING_TYPE_ICONS[type.code]}
                        {type.name}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category_id"
                label="Категория"
                rules={[{ required: true, message: 'Выберите категорию' }]}
              >
                <Select
                  placeholder="Выберите категорию"
                  loading={documentStore.categories.length === 0}
                >
                  {documentStore.categories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status_id"
                label="Статус"
                rules={[{ required: true, message: 'Выберите статус' }]}
              >
                <Select
                  placeholder="Выберите статус"
                  loading={documentStore.statuses.length === 0}
                >
                  {documentStore.statuses.map((status) => (
                    <Option key={status.id} value={status.id}>
                      <Space>
                        <Badge
                          color={STATUS_COLORS[status.code] || 'default'}
                        />
                        {status.name}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="version"
                label="Версия"
                rules={[{ required: true, message: 'Введите версию' }]}
              >
                <Input placeholder="Например: 1.0" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Загрузка файла"
            extra="Поддерживаются только PDF файлы до 10 МБ"
          >
            <Upload
              accept=".pdf"
              beforeUpload={handleFileUpload}
              maxCount={1}
              showUploadList={false}
            >
              <Button
                icon={<UploadOutlined />}
                loading={uploadingFile}
                disabled={uploadingFile}
              >
                {uploadedFileData ? 'Файл загружен' : 'Выбрать файл'}
              </Button>
            </Upload>
            
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="file_name"
                label="Имя файла"
                rules={[{ required: true, message: 'Введите имя файла' }]}
              >
                <Input placeholder="Например: security-standard.pdf" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="file_size"
                label="Размер файла"
                rules={[{ required: true, message: 'Введите размер файла' }]}
              >
                <Input placeholder="Например: 2.4 МБ" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="file_url"
            label="Ссылка на файл"
            rules={[{ required: true, message: 'Введите ссылку на файл' }]}
          >
            <Input placeholder="Например: /static/documents/filename.pdf" />
          </Form.Item>

          {uploadedFileData && (
            <Form.Item name="file_path" hidden>
              <Input />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
});

// Экспортируем компонент по умолчанию
export default DocumentsContent;
