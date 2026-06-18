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
import './DocumentsContent.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const TRAINING_TYPE_ICONS = {
  information_security: <SecurityScanOutlined />,
  labor_protection: <SafetyOutlined />,
  fire_safety: <FireOutlined />,
  first_aid: <MedicineBoxOutlined />,
  electrical_safety: <SafetyOutlined />,
  environmental_safety: <TeamOutlined />,
  general_requirements: <BookOutlined />,
};

const STATUS_COLORS = { active: 'green', draft: 'orange', archived: 'gray', pending: 'blue' };
const STATUS_LABELS = { active: 'Активный', draft: 'Черновик', archived: 'Архивный', pending: 'На утверждении' };

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

  useEffect(() => { loadAllData(); }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([documentStore.loadDocuments(), documentStore.loadTrainingTypes(), documentStore.loadCategories(), documentStore.loadStatuses()]);
    } catch (error) { console.error('Error loading data:', error); message.error('Ошибка загрузки данных'); }
    finally { setIsLoading(false); }
  };

  const filteredDocuments = documentStore.documents.filter((doc) => {
    const matchesSearch = searchText ? (doc.title?.toLowerCase().includes(searchText.toLowerCase()) || doc.description?.toLowerCase().includes(searchText.toLowerCase())) : true;
    const matchesCategory = selectedCategory === 'all' || doc.category_id?.toString() === selectedCategory || doc.category?.id?.toString() === selectedCategory;
    const matchesTrainingType = selectedTrainingType === 'all' || doc.training_type_id?.toString() === selectedTrainingType || doc.training_type?.id?.toString() === selectedTrainingType;
    const matchesStatus = selectedStatus === 'all' || doc.status_id?.toString() === selectedStatus || doc.status?.id?.toString() === selectedStatus;
    return matchesSearch && matchesCategory && matchesTrainingType && matchesStatus;
  });

  const showModal = (document = null) => {
    setEditingDocument(document);
    if (document) {
      form.setFieldsValue({ ...document, training_type_id: document.training_type_id || document.training_type?.id, category_id: document.category_id || document.category?.id, status_id: document.status_id || document.status?.id });
    } else {
      form.resetFields();
      const activeStatus = documentStore.statuses.find(s => s.code === 'active');
      form.setFieldsValue({ status_id: activeStatus?.id, training_type_id: documentStore.trainingTypes[0]?.id, category_id: documentStore.categories[0]?.id, version: '1.0' });
    }
    setIsModalVisible(true);
  };

  const handleFileUpload = async (file) => {
    setUploadingFile(true);
    try {
      const result = await documentStore.uploadDocumentFile(file);
      setUploadedFileData(result);
      form.setFieldsValue({ file_name: result.original_name || file.name, file_url: result.file_url, file_path: result.file_path, file_size: result.file_size });
      message.success('Файл успешно загружен');
      return false;
    } catch (error) { console.error('Upload error:', error); message.error('Ошибка загрузки файла'); return false; }
    finally { setUploadingFile(false); }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);
      if (editingDocument) await documentStore.updateDocument(editingDocument.id, values);
      else await documentStore.createDocument(values);
      message.success(editingDocument ? 'Документ обновлен' : 'Документ создан');
      setIsModalVisible(false);
      form.resetFields();
      setUploadedFileData(null);
      loadAllData();
    } catch (error) { console.error('Save error:', error); message.error(error.response?.data?.message || 'Ошибка сохранения документа'); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id) => {
    try { await documentStore.deleteDocument(id); message.success('Документ удален'); loadAllData(); }
    catch (error) { console.error('Delete error:', error); message.error(error.response?.data?.message || 'Ошибка удаления документа'); }
  };

  const handleView = (record) => {
    let url = record.file_url || '';
    if (!url?.trim()) { message.error('Ссылка на документ отсутствует'); return; }
    if (!url.startsWith('/')) url = `/${url}`;
    const apiBaseUrl = process.env.REACT_APP_API_URL || '';
    const baseUrl = apiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    window.open(`${baseUrl}${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleResetFilters = () => {
    setSearchText(''); setSelectedCategory('all'); setSelectedTrainingType('all'); setSelectedStatus('all');
    documentStore.resetFilters();
  };

  const handleRefresh = () => loadAllData();

  const columns = [
    { title: 'Название', dataIndex: 'title', key: 'title', width: 250, render: (text, record) => (<Space align="start"><FilePdfOutlined className="pdf-icon-table" /><div><Text strong>{text || 'Без названия'}</Text><Text type="secondary" className="doc-desc-table">{record.description || 'Без описания'}</Text></div></Space>) },
    { title: 'Тип обучения', key: 'training_type', width: 180, render: (_, record) => { const type = record.training_type || documentStore.trainingTypes.find(t => t.id === record.training_type_id); return type ? <Space>{type.code && TRAINING_TYPE_ICONS[type.code]}<Text>{type.name}</Text></Space> : <Text type="secondary">Не указан</Text>; } },
    { title: 'Категория', key: 'category', width: 120, render: (_, record) => { const category = record.category || documentStore.categories.find(c => c.id === record.category_id); return category ? <Tag color="blue">{category.name}</Tag> : '-'; } },
    { title: 'Статус', key: 'status', width: 120, render: (_, record) => { const status = record.status || documentStore.statuses.find(s => s.id === record.status_id); if (!status) return '-'; return <Tag color={STATUS_COLORS[status.code] || 'default'}>{status.name || STATUS_LABELS[status.code]}</Tag>; } },
    { title: 'Дата', dataIndex: 'created_at', key: 'date', width: 100, render: (date) => date ? new Date(date).toLocaleDateString('ru-RU') : '-' },
    { title: 'Размер', dataIndex: 'file_size', key: 'file_size', width: 90 },
    { title: 'Версия', dataIndex: 'version', key: 'version', width: 80 },
    { title: 'Действия', key: 'actions', width: 180, render: (_, record) => (<Space><Tooltip title="Просмотреть"><Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} disabled={!record.file_url} size="small" /></Tooltip><Tooltip title="Редактировать"><Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)} size="small" /></Tooltip><Popconfirm title="Удалить документ?" onConfirm={() => handleDelete(record.id)}><Tooltip title="Удалить"><Button type="text" danger icon={<DeleteOutlined />} size="small" /></Tooltip></Popconfirm></Space>) },
  ];

  if (isLoading && !filteredDocuments.length) return (<div className="documents-loading"><Spin size="large" /><div>Загрузка документов...</div></div>);

  return (
    <div className="documents-admin-container">
      <Row justify="space-between" align="middle" className="documents-header">
        <Col><Title level={4}>Управление документами</Title><Text type="secondary">Всего: {documentStore.totalDocuments} | Активных: {documentStore.totalActiveDocuments} | Черновиков: {documentStore.draftDocuments.length}</Text></Col>
        <Col><Space><Tooltip title="Обновить"><Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={documentStore.isLoading} /></Tooltip><Button icon={<PlusOutlined />} type="primary" onClick={() => showModal()}>Добавить документ</Button></Space></Col>
      </Row>
      <Card className="filters-card">
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto"><Input placeholder="Поиск по названию или описанию..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} allowClear /></Col>
          <Col><Select placeholder="Тип обучения" style={{ width: 200 }} value={selectedTrainingType} onChange={setSelectedTrainingType} allowClear><Option value="all">Все типы</Option>{documentStore.trainingTypes.map(type => <Option key={type.id} value={type.id}><Space>{type.code && TRAINING_TYPE_ICONS[type.code]}{type.name}</Space></Option>)}</Select></Col>
          <Col><Select placeholder="Категория" style={{ width: 150 }} value={selectedCategory} onChange={setSelectedCategory} allowClear><Option value="all">Все категории</Option>{documentStore.categories.map(cat => <Option key={cat.id} value={cat.id}>{cat.name}</Option>)}</Select></Col>
          <Col><Select placeholder="Статус" style={{ width: 150 }} value={selectedStatus} onChange={setSelectedStatus} allowClear><Option value="all">Все статусы</Option>{documentStore.statuses.map(status => <Option key={status.id} value={status.id}><Space><Badge color={STATUS_COLORS[status.code] || 'default'} />{status.name}</Space></Option>)}</Select></Col>
          <Col><Button onClick={handleResetFilters}>Сбросить фильтры</Button></Col>
        </Row>
        <Row style={{ marginTop: 8 }}><Col><Text type="secondary">Найдено документов: {filteredDocuments.length}{searchText && ` по запросу "${searchText}"`}</Text></Col></Row>
      </Card>
      <Card className="documents-table-card">
        {documentStore.isLoading ? <div className="documents-loading"><Spin /><div>Загрузка таблицы...</div></div> : <Table columns={columns} dataSource={filteredDocuments} rowKey="id" pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Найдено ${total} документов` }} scroll={{ x: 1200 }} loading={documentStore.loading} />}
      </Card>
      <Modal title={editingDocument ? 'Редактировать документ' : 'Добавить новый документ'} open={isModalVisible} onOk={handleSave} onCancel={() => { setIsModalVisible(false); form.resetFields(); setUploadedFileData(null); }} width={600} okText={editingDocument ? 'Обновить' : 'Добавить'} cancelText="Отмена" confirmLoading={documentStore.loading || isLoading}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Название документа" rules={[{ required: true, message: 'Введите название' }]}><Input placeholder="Название" /></Form.Item>
          <Form.Item name="description" label="Описание" rules={[{ required: true, message: 'Введите описание' }]}><TextArea rows={3} placeholder="Описание" /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="training_type_id" label="Тип обучения" rules={[{ required: true }]}><Select placeholder="Выберите тип">{documentStore.trainingTypes.map(type => <Option key={type.id} value={type.id}><Space>{type.code && TRAINING_TYPE_ICONS[type.code]}{type.name}</Space></Option>)}</Select></Form.Item></Col>
            <Col span={12}><Form.Item name="category_id" label="Категория" rules={[{ required: true }]}><Select placeholder="Выберите категорию">{documentStore.categories.map(cat => <Option key={cat.id} value={cat.id}>{cat.name}</Option>)}</Select></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="status_id" label="Статус" rules={[{ required: true }]}><Select placeholder="Выберите статус">{documentStore.statuses.map(status => <Option key={status.id} value={status.id}><Space><Badge color={STATUS_COLORS[status.code] || 'default'} />{status.name}</Space></Option>)}</Select></Form.Item></Col>
            <Col span={12}><Form.Item name="version" label="Версия" rules={[{ required: true }]}><Input placeholder="1.0" /></Form.Item></Col>
          </Row>
          <Form.Item label="Загрузка файла" extra="PDF до 10 МБ"><Upload accept=".pdf" beforeUpload={handleFileUpload} maxCount={1} showUploadList={false}><Button icon={<UploadOutlined />} loading={uploadingFile} disabled={uploadingFile}>{uploadedFileData ? 'Файл загружен' : 'Выбрать файл'}</Button></Upload></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="file_name" label="Имя файла" rules={[{ required: true }]}><Input placeholder="filename.pdf" /></Form.Item></Col>
            <Col span={12}><Form.Item name="file_size" label="Размер файла" rules={[{ required: true }]}><Input placeholder="2.4 МБ" /></Form.Item></Col>
          </Row>
          <Form.Item name="file_url" label="Ссылка на файл" rules={[{ required: true }]}><Input placeholder="/static/documents/filename.pdf" /></Form.Item>
          {uploadedFileData && <Form.Item name="file_path" hidden><Input /></Form.Item>}
        </Form>
      </Modal>
    </div>
  );
});

export default DocumentsContent;