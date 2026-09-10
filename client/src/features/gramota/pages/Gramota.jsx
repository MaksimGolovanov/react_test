import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Form,
  Select,
  Typography,
  message,
  Spin,
  Space,
  Divider,
  theme,
  List,
  Avatar,
  Badge,
  Tag,
  Alert,
  Switch,
} from 'antd';
import {
  FilePdfOutlined,
  DeleteOutlined,
  UserOutlined,
  PlusOutlined,
  CloseOutlined,
  PictureOutlined,
  EditOutlined,
  FileTextOutlined,
  SignatureOutlined,
  TeamOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { pdf } from '@react-pdf/renderer';
import StaffService from '../../staff/services/StaffService';
import BackgroundService from '../services/BackgroundService';
import GramotaTextService from '../services/GramotaTemplateService';
import SignatoryService from '../services/SignatoryService';
import GramotaPDFDocument from '../components/GramotaPDFDocument';
import BackgroundManagerModal from '../components/BackgroundManagerModal';
import TextTemplateManagerModal from '../components/TextTemplateManagerModal';
import SignatoryManagerModal from '../components/SignatoryManagerModal';
import styles from '../styles/Gramota.module.css';

const STORAGE_KEYS = {
  APPROVER_ID: 'gramota_approver_id',
  SIGNER_ID: 'gramota_signer_id',
  USE_APPROVER: 'gramota_use_approver',
  USE_SIGNER: 'gramota_use_signer',
};

const { Title, Text } = Typography;
const { useToken } = theme;

const Gramota = () => {
  const { token } = useToken();

  // Состояния
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffDetails, setSelectedStaffDetails] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Модалки
  const [backgroundManagerVisible, setBackgroundManagerVisible] = useState(false);
  const [templateManagerVisible, setTemplateManagerVisible] = useState(false);
  const [signatoryManagerVisible, setSignatoryManagerVisible] = useState(false);

  // Подписи - signatoryList объявляем ДО useEffect
  const [signatoryList, setSignatoryList] = useState([]);

  const [approver, setApprover] = useState({ id: null, position: '', name: '' });
  const [signer, setSigner] = useState({ id: null, position: '', name: '' });

  const [useApprover, setUseApprover] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USE_APPROVER);
    return saved !== null ? saved === 'true' : true;
  });
  const [useSigner, setUseSigner] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USE_SIGNER);
    return saved !== null ? saved === 'true' : true;
  });
  const [selectedApproverId, setSelectedApproverId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPROVER_ID);
    return saved ? Number(saved) : null;
  });
  const [selectedSignerId, setSelectedSignerId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SIGNER_ID);
    return saved ? Number(saved) : null;
  });

  // Загрузка списка подписантов
  const loadSignatoryList = async () => {
    try {
      const data = await SignatoryService.fetchAll();
      setSignatoryList(data);
    } catch {
      message.error('Ошибка загрузки списка подписантов');
    }
  };

  // Восстановление выбранных подписантов после загрузки списка
  useEffect(() => {
    if (signatoryList.length > 0) {
      if (selectedApproverId && !signatoryList.some(s => s.id === selectedApproverId)) {
        setSelectedApproverId(null);
        setApprover({ id: null, position: '', name: '' });
        localStorage.setItem(STORAGE_KEYS.APPROVER_ID, '');
      }
      if (selectedSignerId && !signatoryList.some(s => s.id === selectedSignerId)) {
        setSelectedSignerId(null);
        setSigner({ id: null, position: '', name: '' });
        localStorage.setItem(STORAGE_KEYS.SIGNER_ID, '');
      }
      if (selectedApproverId) {
        const found = signatoryList.find(s => s.id === selectedApproverId);
        if (found) setApprover({ id: found.id, position: found.position, name: found.name });
      }
      if (selectedSignerId) {
        const found = signatoryList.find(s => s.id === selectedSignerId);
        if (found) setSigner({ id: found.id, position: found.position, name: found.name });
      }
    }
  }, [signatoryList]);

  // Загрузка сотрудников
  const loadStaff = async () => {
    setLoading(true);
    try {
      const data = await StaffService.fetchStaff();
      const active = data.filter(
        (item) =>
          !item.isDeleted &&
          !item.isExcludedDepartment &&
          item.fio &&
          item.fio.trim()
      );
      setStaffList(active);
    } catch (error) {
      message.error('Ошибка загрузки списка сотрудников');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка активного фона
  const loadActiveBackground = async () => {
    try {
      const all = await BackgroundService.fetchAll();
      const active = all.find((bg) => bg.isActive);
      if (active) setSelectedBackground(active);
    } catch (error) {
      console.error('Ошибка загрузки активного фона:', error);
    }
  };

  // Загрузка активного шаблона текста
  const loadActiveTemplate = async () => {
    setTemplateLoading(true);
    try {
      const all = await GramotaTextService.fetchAll();
      const active = all.find((t) => t.isActive);
      if (active) {
        setSelectedTemplate(active);
      }
    } catch (error) {
      console.error('Ошибка загрузки активного шаблона:', error);
    } finally {
      setTemplateLoading(false);
    }
  };

  // Загрузка всех данных при монтировании
  useEffect(() => {
    loadStaff();
    loadActiveBackground();
    loadActiveTemplate();
    loadSignatoryList();
  }, []);

  // Обновление макета выбранного шаблона
  const updateSelectedTemplateLayout = (templateId, newLayout) => {
    setSelectedTemplate((prev) => {
      if (prev && prev.id === templateId) {
        return { ...prev, layout: newLayout };
      }
      return prev;
    });
  };

  // Обработчики выбора подписантов
  const handleSelectApprover = (id) => {
    setSelectedApproverId(id);
    localStorage.setItem(STORAGE_KEYS.APPROVER_ID, id !== null ? String(id) : '');
    if (id) {
      const signatory = signatoryList.find((s) => s.id === id);
      if (signatory) {
        setApprover({ id: signatory.id, position: signatory.position, name: signatory.name });
      }
    } else {
      setApprover({ id: null, position: '', name: '' });
    }
  };

  const handleSelectSigner = (id) => {
    setSelectedSignerId(id);
    localStorage.setItem(STORAGE_KEYS.SIGNER_ID, id !== null ? String(id) : '');
    if (id) {
      const signatory = signatoryList.find((s) => s.id === id);
      if (signatory) {
        setSigner({ id: signatory.id, position: signatory.position, name: signatory.name });
      }
    } else {
      setSigner({ id: null, position: '', name: '' });
    }
  };

  // Переключатели подписей
  const handleToggleApprover = (checked) => {
    setUseApprover(checked);
    localStorage.setItem(STORAGE_KEYS.USE_APPROVER, String(checked));
    if (!checked) {
      setSelectedApproverId(null);
      setApprover({ id: null, position: '', name: '' });
      localStorage.setItem(STORAGE_KEYS.APPROVER_ID, '');
    }
  };

  const handleToggleSigner = (checked) => {
    setUseSigner(checked);
    localStorage.setItem(STORAGE_KEYS.USE_SIGNER, String(checked));
    if (!checked) {
      setSelectedSignerId(null);
      setSigner({ id: null, position: '', name: '' });
      localStorage.setItem(STORAGE_KEYS.SIGNER_ID, '');
    }
  };

  // Добавление/удаление сотрудников
  const handleSelectStaff = (staffItem) => {
    const existing = selectedStaffDetails.find(
      (s) => s.tabNumber === staffItem.tabNumber
    );
    if (existing) {
      setSelectedStaffDetails((prev) =>
        prev.filter((s) => s.tabNumber !== staffItem.tabNumber)
      );
    } else {
      setSelectedStaffDetails((prev) => [
        ...prev,
        {
          ...staffItem,
          place: 'I',
          gender: staffItem.gender || 'male',
          age: 50,
        },
      ]);
    }
  };

  const removeStaff = (tabNumber) => {
    setSelectedStaffDetails((prev) =>
      prev.filter((s) => s.tabNumber !== tabNumber)
    );
  };

  const updateStaffDetail = (tabNumber, field, value) => {
    setSelectedStaffDetails((prev) =>
      prev.map((item) =>
        item.tabNumber === tabNumber ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  // Генерация PDF
  const generatePDF = async () => {
    if (selectedStaffDetails.length === 0) {
      message.warning('Выберите хотя бы одного сотрудника');
      return;
    }
    if (!selectedBackground) {
      message.warning('Выберите фоновое изображение');
      return;
    }
    if (!selectedTemplate) {
      message.warning('Выберите шаблон текста');
      return;
    }
    if (!selectedTemplate.text || !selectedTemplate.text.trim()) {
      message.warning('Выбранный шаблон не содержит текста');
      return;
    }

    setPdfLoading(true);
    try {
      const approverData = useApprover && selectedApproverId !== null ? approver : null;
      const signerData = useSigner && selectedSignerId !== null ? signer : null;

      const backgroundUrl = `${process.env.REACT_APP_API_URL}static/backgrounds/${selectedBackground.filename}`;
      const doc = (
        <GramotaPDFDocument
          staffList={selectedStaffDetails}
          backgroundImage={backgroundUrl}
          textTemplate={selectedTemplate.text}
          gramotaType={selectedTemplate.gramotaType || 'ПОЧЕТНАЯ ГРАМОТА'}
          layout={selectedTemplate.layout || null}
          approver={approverData}
          signer={signerData}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Грамоты_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      message.success('PDF успешно создан');
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      message.error('Ошибка при создании PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  // Фильтрация сотрудников
  const filteredStaff = staffList.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const fields = [item.fio, item.post, item.departmentName, item.login, item.tabNumber];
    return fields.some((field) => field && field.toString().toLowerCase().includes(query));
  });

  const isReady =
    selectedStaffDetails.length > 0 &&
    selectedBackground &&
    selectedTemplate &&
    selectedTemplate.text &&
    selectedTemplate.text.trim();

  return (
    <div className={styles.gramotaContainer}>
      <Card className={styles.mainCard} bordered={false}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Блок 1: Фоновое изображение */}
              <Card
                size="small"
                title={
                  <Space>
                    <PictureOutlined style={{ color: token.colorPrimary }} />
                    <span>Фоновое изображение</span>
                  </Space>
                }
                className={styles.sectionCard}
              >
                <div className={styles.backgroundCompact}>
                  {!selectedBackground ? (
                    <Button
                      type="primary"
                      icon={<PictureOutlined />}
                      onClick={() => setBackgroundManagerVisible(true)}
                      block
                    >
                      Выбрать фон из коллекции
                    </Button>
                  ) : (
                    <div className={styles.backgroundPreviewCompact}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}static/backgrounds/${selectedBackground.filename}`}
                        alt={selectedBackground.name}
                        className={styles.backgroundThumb}
                      />
                      <div className={styles.backgroundInfo}>
                        <Text strong>{selectedBackground.name}</Text>
                        {selectedBackground.description && (
                          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                            {selectedBackground.description}
                          </Text>
                        )}
                        <Space size={4}>
                          <Button type="link" size="small" onClick={() => setBackgroundManagerVisible(true)}>
                            Выбрать другой
                          </Button>
                          <Button type="link" size="small" danger onClick={() => setSelectedBackground(null)}>
                            Удалить
                          </Button>
                        </Space>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 8 }}>
                  <Button
                    type="default"
                    icon={<EditOutlined />}
                    onClick={() => setBackgroundManagerVisible(true)}
                    size="small"
                  >
                    Управление коллекцией
                  </Button>
                </div>
              </Card>

              {/* Блок 2: Шаблон текста */}
              <Card
                size="small"
                title={
                  <Space>
                    <FileTextOutlined style={{ color: token.colorPrimary }} />
                    <span>Шаблон текста</span>
                  </Space>
                }
                className={styles.sectionCard}
              >
                <div className={styles.templateSelector}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Выбранный шаблон:</Text>
                    {selectedTemplate ? (
                      <Tag color="blue" style={{ fontSize: 12 }}>{selectedTemplate.name}</Tag>
                    ) : (
                      <Tag color="default">Не выбран</Tag>
                    )}
                    <Button type="link" size="small" onClick={() => setTemplateManagerVisible(true)}>
                      Выбрать из коллекции
                    </Button>
                    <Button type="link" size="small" danger onClick={() => setSelectedTemplate(null)}>
                      Очистить
                    </Button>
                  </div>
                  <Button
                    type="default"
                    icon={<EditOutlined />}
                    onClick={() => setTemplateManagerVisible(true)}
                    size="small"
                    style={{ marginTop: 4 }}
                  >
                    Управление шаблонами
                  </Button>
                </div>

                {selectedTemplate ? (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ marginBottom: 4 }}>
                      <Text strong>Текст шаблона:</Text>
                      <div
                        style={{
                          background: '#f5f5f5',
                          padding: 8,
                          borderRadius: 4,
                          whiteSpace: 'pre-wrap',
                          fontSize: 13,
                          maxHeight: 120,
                          overflow: 'auto',
                          marginTop: 4,
                        }}
                      >
                        {selectedTemplate.text || '(пусто)'}
                      </div>
                    </div>
                    {selectedTemplate.description && (
                      <div>
                        <Text type="secondary">Описание: </Text>
                        <Text>{selectedTemplate.description}</Text>
                      </div>
                    )}
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary">Тип грамоты: </Text>
                      <Tag color="blue">{selectedTemplate.gramotaType || 'ПОЧЕТНАЯ ГРАМОТА'}</Tag>
                    </div>
                    {selectedTemplate.isActive && (
                      <Tag color="green" style={{ marginTop: 4 }}>Активный</Tag>
                    )}
                  </div>
                ) : (
                  <Alert
                    message="Шаблон не выбран"
                    description="Выберите шаблон из коллекции, чтобы продолжить"
                    type="info"
                    showIcon
                  />
                )}
              </Card>

              {/* Блок 3: Подписи */}
              <Card
                size="small"
                title={
                  <Space>
                    <SignatureOutlined style={{ color: token.colorPrimary }} />
                    <span>Подписи</span>
                  </Space>
                }
                className={styles.sectionCard}
              >
                <Row gutter={[16, 8]}>
                  <Col span={24}>
                    <Space>
                      <Switch checked={useApprover} onChange={handleToggleApprover} />
                      <Text strong>Утверждающий</Text>
                      <Button size="small" onClick={() => setSignatoryManagerVisible(true)}>
                        Управление справочником
                      </Button>
                    </Space>
                  </Col>
                  {useApprover && (
                    <Col span={24}>
                      <Select
                        showSearch
                        allowClear
                        placeholder="Выберите подписанта из справочника"
                        value={selectedApproverId}
                        onChange={handleSelectApprover}
                        options={signatoryList.map((s) => ({
                          label: `${s.position} — ${s.name}`,
                          value: s.id,
                        }))}
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        style={{ width: '100%' }}
                      />
                    </Col>
                  )}

                  <Col span={24} style={{ marginTop: 8 }}>
                    <Space>
                      <Switch checked={useSigner} onChange={handleToggleSigner} />
                      <Text strong>Подписывающий</Text>
                    </Space>
                  </Col>
                  {useSigner && (
                    <Col span={24}>
                      <Select
                        showSearch
                        allowClear
                        placeholder="Выберите подписанта из справочника"
                        value={selectedSignerId}
                        onChange={handleSelectSigner}
                        options={signatoryList.map((s) => ({
                          label: `${s.position} — ${s.name}`,
                          value: s.id,
                        }))}
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        style={{ width: '100%' }}
                      />
                    </Col>
                  )}
                </Row>
              </Card>
            </Space>
          </Col>

          {/* Правая колонка – сотрудники */}
          <Col xs={24} lg={10}>
            <Card
              size="small"
              title={
                <Space>
                  <TeamOutlined style={{ color: token.colorPrimary }} />
                  <span>Сотрудники</span>
                  <Badge count={selectedStaffDetails.length} style={{ backgroundColor: token.colorPrimary }} />
                </Space>
              }
              className={styles.sectionCard}
              bodyStyle={{ padding: '12px 16px' }}
            >
              <Input
                placeholder="Поиск по ФИО, должности, отделу..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                style={{ marginBottom: 12 }}
              />

              {loading ? (
                <Spin />
              ) : (
                <>
                  <div className={styles.staffListContainer}>
                    <List
                      dataSource={filteredStaff}
                      size="small"
                      renderItem={(item) => {
                        const isSelected = selectedStaffDetails.some(
                          (s) => s.tabNumber === item.tabNumber
                        );
                        return (
                          <List.Item
                            className={styles.staffItem}
                            actions={[
                              <Button
                                type={isSelected ? 'primary' : 'default'}
                                icon={isSelected ? <CloseOutlined /> : <PlusOutlined />}
                                onClick={() => handleSelectStaff(item)}
                                size="small"
                                style={{ fontSize: 12 }}
                              >
                                {isSelected ? 'Убрать' : 'Добавить'}
                              </Button>,
                            ]}
                          >
                            <List.Item.Meta
                              avatar={<Avatar size="small" icon={<UserOutlined />} />}
                              title={<span style={{ fontSize: 13 }}>{item.fio}</span>}
                              description={
                                <span style={{ fontSize: 12 }}>
                                  {item.post || ''} | {item.departmentName || ''}
                                </span>
                              }
                            />
                          </List.Item>
                        );
                      }}
                    />
                    {filteredStaff.length === 0 && !loading && (
                      <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
                        {searchQuery ? 'Ничего не найдено' : 'Нет сотрудников'}
                      </div>
                    )}
                  </div>

                  {selectedStaffDetails.length > 0 && (
                    <>
                      <Divider style={{ margin: '12px 0' }} />
                      <div className={styles.selectedStaff}>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>
                          Выбрано: {selectedStaffDetails.length}
                        </Text>
                        <Space wrap size={[4, 4]}>
                          {selectedStaffDetails.map((s) => (
                            <Tag
                              key={s.tabNumber}
                              closable
                              onClose={() => removeStaff(s.tabNumber)}
                              style={{ padding: '2px 6px', margin: 0 }}
                            >
                              <span style={{ fontSize: 12 }}>{s.fio}</span>
                              <Select
                                value={s.place}
                                onChange={(val) => updateStaffDetail(s.tabNumber, 'place', val)}
                                size="small"
                                style={{ width: 50, marginLeft: 4, fontSize: 11 }}
                                dropdownStyle={{ minWidth: 80 }}
                              >
                                <Select.Option value="I">I</Select.Option>
                                <Select.Option value="II">II</Select.Option>
                                <Select.Option value="III">III</Select.Option>
                                <Select.Option value="участие">участие</Select.Option>
                              </Select>
                              <Select
                                value={s.gender}
                                onChange={(val) => updateStaffDetail(s.tabNumber, 'gender', val)}
                                size="small"
                                style={{ width: 70, marginLeft: 4, fontSize: 11 }}
                              >
                                <Select.Option value="male">М</Select.Option>
                                <Select.Option value="female">Ж</Select.Option>
                              </Select>
                              <Select
                                value={s.age || 50}
                                onChange={(val) => updateStaffDetail(s.tabNumber, 'age', val)}
                                size="small"
                                style={{ width: 60, marginLeft: 4, fontSize: 11 }}
                              >
                                <Select.Option value={50}>50</Select.Option>
                                <Select.Option value={55}>55</Select.Option>
                                <Select.Option value={60}>60</Select.Option>
                                <Select.Option value={65}>65</Select.Option>
                              </Select>
                            </Tag>
                          ))}
                        </Space>
                      </div>
                    </>
                  )}
                </>
              )}
            </Card>

            {/* Блок генерации PDF */}
            <Card
              className={styles.sectionCard}
              style={{ marginTop: 16, backgroundColor: token.colorBgLayout }}
            >
              <Button
                type="primary"
                size="large"
                icon={<FilePdfOutlined />}
                onClick={generatePDF}
                loading={pdfLoading}
                disabled={!isReady}
                block
                style={{ height: 48, fontSize: 16 }}
              >
                {isReady
                  ? `Сгенерировать PDF (${selectedStaffDetails.length} шт.)`
                  : 'Заполните все настройки'}
              </Button>
              {!isReady && (
                <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
                  {!selectedBackground && '❌ Выберите фон'}
                  {selectedBackground && !selectedTemplate && '❌ Выберите шаблон'}
                  {selectedBackground && selectedTemplate && !selectedTemplate.text?.trim() && '❌ Шаблон не содержит текста'}
                  {selectedBackground && selectedTemplate && selectedTemplate.text?.trim() && selectedStaffDetails.length === 0 && '❌ Выберите сотрудников'}
                </Text>
              )}
              <Text type="secondary" style={{ display: 'block', marginTop: 4, fontSize: 12 }}>
                Для каждой грамоты будет создана отдельная страница в PDF
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>

      <BackgroundManagerModal
        visible={backgroundManagerVisible}
        onClose={() => setBackgroundManagerVisible(false)}
        onSelect={(bg) => setSelectedBackground(bg)}
        selectedId={selectedBackground?.id}
      />

      <TextTemplateManagerModal
        visible={templateManagerVisible}
        onClose={() => setTemplateManagerVisible(false)}
        onSelect={handleSelectTemplate}
        selectedId={selectedTemplate?.id}
        onUpdate={loadActiveTemplate}
        backgroundImage={
          selectedBackground
            ? `${process.env.REACT_APP_API_URL}static/backgrounds/${selectedBackground.filename}`
            : null
        }
        onLayoutSaved={updateSelectedTemplateLayout}
        approver={useApprover && selectedApproverId !== null ? approver : null}
        signer={useSigner && selectedSignerId !== null ? signer : null}
      />

      <SignatoryManagerModal
        visible={signatoryManagerVisible}
        onClose={() => setSignatoryManagerVisible(false)}
        onSelect={loadSignatoryList}
      />
    </div>
  );
};

export default Gramota;