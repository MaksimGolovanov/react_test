// src/features/plans/ui/PlanModal/PlanModal.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Tabs,
  Row,
  Col,
  Space,
  InputNumber,
  Typography,
  Divider,
  Tooltip,
  message,
} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  CloseOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/ru_RU';
import 'dayjs/locale/ru';
dayjs.locale('ru');

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

// ==================== Справочники (временные, для демонстрации) ====================
// В реальном проекте эти данные загружаются с сервера или из localStorage
const DICTIONARIES = {
  // Филиалы и подразделения
  filials: [
    'Вуктыльское ЛПУМГ, КС-3, газокомпрессорная служба',
    'Сосногорское ЛПУМГ, КС-4',
    'Ухтинское ЛПУМГ, ГРС-1',
  ],
  // Сотрудники (ФИО + должность)
  employees: [
    { value: 'Адаменко О.М. Начальник ГКС Вуктыльского ЛПУМГ', label: 'Адаменко О.М. (Начальник ГКС)' },
    { value: 'Бахтин Д.И. Начальник цеха №3 Вуктыльского ЛПУМГ', label: 'Бахтин Д.И. (Начальник цеха №3)' },
    { value: 'Бобарыкин А.В. Ведущий инженер ЛЭС Вуктыльского ЛПУМГ', label: 'Бобарыкин А.В. (Ведущий инженер ЛЭС)' },
    { value: 'Ю.В. Бетин Начальник Вуктыльского ЦТС Управление связи', label: 'Бетин Ю.В. (Начальник ЦТС)' },
  ],
  // Типовые этапы (для быстрого заполнения)
  typicalStages: [
    {
      title: 'ГОР, стравливание участка газопровода',
      items: [
        'ГОР, стравливание северной охранной зоны (379-380 км) МГ «Пунга-Вуктыл-Ухта II»',
        'ГОР, стравливание коммуникаций КЦ №3 (380 км)',
        'ГОР, стравливание ГРС с.н. КЦ №3 (380 км)',
      ],
    },
    {
      title: 'Продувка азотом',
      items: [
        'ГОР, продувка азотом коммуникаций КЦ №3 (380 км)',
      ],
    },
    {
      title: 'Установка заглушки',
      items: [
        'ГОР. Установка неповоротной силовой заглушки на дренажный трубопровод пылеуловителя ст. № 36.',
      ],
    },
  ],
  // Типовые приложения
  typicalAppendices: [
    'Приложение № 1 «Технологическая схема компрессорного цеха №3 до начала производства работ»',
    'Приложение № 1-1.1 «Cхема расстановки постов и мест переключения ТПА при стравливании северной охранной зоны 379-380 км» (1 этап)',
    'Приложение № 2 «Организация взаимодействия постов на участке производства сложных огневых работ»',
  ],
};

const PlanModal = ({
  show,
  onHide,
  onSubmit,
  currentPlan,
  formData,
  setFormData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // При открытии модалки заполняем форму данными
  useEffect(() => {
    if (show) {
      form.setFieldsValue({
        ...formData,
        startDate: formData.startDate ? dayjs(formData.startDate) : null,
        endDate: formData.endDate ? dayjs(formData.endDate) : null,
      });
    }
  }, [show, formData, form]);

  // Обработка отправки формы
  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const submitData = {
        ...values,
        startDate: values.startDate?.format('YYYY-MM-DD') || '',
        endDate: values.endDate?.format('YYYY-MM-DD') || '',
      };
      await onSubmit(submitData, currentPlan);
      onHide();
      message.success(currentPlan ? 'План успешно обновлён' : 'План успешно создан');
    } catch (e) {
      console.error(e);
      message.error('Ошибка при сохранении плана');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onHide();
  };

  // ==================== Вспомогательные функции ====================
  // Добавление типового этапа
  const addTypicalStage = useCallback((stageTemplate) => {
    const currentStages = form.getFieldValue('stages') || [];
    const newStage = {
      title: stageTemplate.title,
      items: stageTemplate.items.map(text => ({ text, subitems: [''] })),
    };
    form.setFieldsValue({
      stages: [...currentStages, newStage],
    });
  }, [form]);

  // Добавление типового приложения
  const addTypicalAppendix = useCallback((appText) => {
    const currentAppendices = form.getFieldValue('appendices') || [];
    form.setFieldsValue({
      appendices: [...currentAppendices, appText],
    });
  }, [form]);

  // ==================== Рендер ====================
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{currentPlan ? 'Редактирование Плана ОР' : 'Создание нового Плана ОР'}</span>
          <Tooltip title="Все поля, отмеченные *, обязательны для заполнения">
            <InfoCircleOutlined style={{ color: '#faad14' }} />
          </Tooltip>
        </div>
      }
      open={show}
      onCancel={handleCancel}
      width={1200}
      footer={[
        <Button key="cancel" onClick={handleCancel} icon={<CloseOutlined />}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
          icon={<SaveOutlined />}
        >
          {currentPlan ? 'Обновить план' : 'Создать план'}
        </Button>,
      ]}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabPosition="left"
          style={{ minHeight: 650 }}
        >
          {/* ==================== Вкладка 1: Общие сведения ==================== */}
          <TabPane
            tab={<span><InfoCircleOutlined /> Общие</span>}
            key="1"
          >
            <div style={{ padding: '8px 16px' }}>
              <Title level={5} style={{ marginBottom: 16 }}>Основная информация</Title>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="title"
                    label="Наименование плана"
                    rules={[{ required: true, message: 'Введите наименование' }]}
                    tooltip="Краткое описание работ, например: «План организации и проведения огневых работ по замене отвода DN 426»"
                  >
                    <TextArea
                      rows={2}
                      placeholder="Введите наименование плана..."
                      autoSize={{ minRows: 2, maxRows: 4 }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left" plain>Место проведения</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="filial"
                    label="Филиал / служба"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Выберите или введите филиал"
                      showSearch
                      allowClear
                      mode="tags"
                      maxTagCount={1}
                      options={DICTIONARIES.filials.map(f => ({ value: f, label: f }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="Место проведения работ"
                    rules={[{ required: true }]}
                    tooltip="Точное место: КС, цех, км газопровода"
                  >
                    <Input placeholder="КС-3, МГ «Пунга-Вуктыл-Ухта II» 380 км DN 1400..." />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left" plain>Цель и сроки</Divider>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="goal"
                    label="Цель огневых работ"
                    rules={[{ required: true }]}
                  >
                    <TextArea rows={3} placeholder="Замена дефектного отвода DN 426 на ПУ ст. № 36..." />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="startDate" label="Дата начала">
                    <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" locale={locale} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="endDate" label="Дата окончания">
                    <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" locale={locale} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="totalHours"
                    label="Расчётное время (часов)"
                    tooltip="Общая продолжительность работ в часах"
                  >
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="496" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left" plain>Ответственные лица</Divider>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="responsibleFireWorks"
                    label="Отв. за проведение (ФИО, должность)"
                  >
                    <Select
                      placeholder="Выберите из списка"
                      showSearch
                      allowClear
                      options={DICTIONARIES.employees}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="responsiblePrepFireWorks"
                    label="Отв. за подготовку (ФИО, должность)"
                  >
                    <Select
                      placeholder="Выберите из списка"
                      showSearch
                      allowClear
                      options={DICTIONARIES.employees}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="responsibleComm"
                    label="Отв. за организацию связи"
                  >
                    <Select
                      placeholder="Выберите из списка"
                      showSearch
                      allowClear
                      options={DICTIONARIES.employees}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left" plain>Газоснабжение</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="gasSupply" label="Газоснабжение потребителей">
                    <Select>
                      <Option value="Не прекращается">Не прекращается</Option>
                      <Option value="Прекращается">Прекращается</Option>
                      <Option value="С ограничениями">С ограничениями</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </TabPane>

          {/* ==================== Вкладка 2: Этапы работ ==================== */}
          <TabPane
            tab={<span><PlusOutlined /> Этапы</span>}
            key="2"
          >
            <div style={{ padding: '8px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text strong>Список этапов работ</Text>
                <Space>
                  <Tooltip title="Добавить типовой этап из справочника">
                    <Button
                      type="dashed"
                      size="small"
                      onClick={() => {
                        // Показываем выбор типового этапа через confirm или dropdown – упрощённо
                        const randomIndex = Math.floor(Math.random() * DICTIONARIES.typicalStages.length);
                        addTypicalStage(DICTIONARIES.typicalStages[randomIndex]);
                      }}
                    >
                      Добавить из шаблона
                    </Button>
                  </Tooltip>
                </Space>
              </div>

              <Form.List name="stages">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        style={{
                          border: '1px solid #e8e8e8',
                          padding: 16,
                          marginBottom: 16,
                          borderRadius: 8,
                          background: '#fafafa',
                          position: 'relative',
                        }}
                      >
                        <Row gutter={16}>
                          <Col span={20}>
                            <Form.Item
                              {...restField}
                              name={[name, 'title']}
                              label="Название этапа"
                              rules={[{ required: true, message: 'Введите название этапа' }]}
                              style={{ marginBottom: 8 }}
                            >
                              <Input placeholder="Например: Этап 1. Подготовительные работы" />
                            </Form.Item>
                          </Col>
                          <Col span={4} style={{ textAlign: 'right' }}>
                            <Button
                              danger
                              onClick={() => remove(name)}
                              icon={<MinusCircleOutlined />}
                              size="small"
                            >
                              Удалить этап
                            </Button>
                          </Col>
                        </Row>

                        {/* Подпункты этапа */}
                        <Form.List name={[name, 'items']}>
                          {(subFields, { add: addSub, remove: removeSub }) => (
                            <div style={{ paddingLeft: 12 }}>
                              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                                Подпункты этапа:
                              </Text>
                              {subFields.map(({ key: subKey, name: subName, ...restSubField }) => (
                                <div
                                  key={subKey}
                                  style={{
                                    border: '1px dashed #d9d9d9',
                                    padding: 8,
                                    marginBottom: 8,
                                    borderRadius: 4,
                                    background: '#fff',
                                  }}
                                >
                                  <Row gutter={8}>
                                    <Col span={22}>
                                      <Form.Item
                                        {...restSubField}
                                        name={[subName, 'text']}
                                        rules={[{ required: true, message: 'Введите текст подпункта' }]}
                                        style={{ marginBottom: 0 }}
                                      >
                                        <TextArea
                                          placeholder="Текст подпункта (например: 1.1. ГОР, стравливание...)"
                                          rows={2}
                                          autoSize={{ minRows: 1, maxRows: 3 }}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={2} style={{ textAlign: 'right' }}>
                                      <Button
                                        size="small"
                                        type="text"
                                        danger
                                        onClick={() => removeSub(subName)}
                                        icon={<MinusCircleOutlined />}
                                      />
                                    </Col>
                                  </Row>

                                  {/* Вложенные подпункты (subitems) */}
                                  <Form.List name={[subName, 'subitems']}>
                                    {(subSubFields, { add: addSubSub, remove: removeSubSub }) => (
                                      <div style={{ paddingLeft: 24, marginTop: 4 }}>
                                        {subSubFields.map(({ key: subSubKey, name: subSubName, ...restSubSubField }) => (
                                          <Row key={subSubKey} gutter={8} style={{ marginBottom: 4 }}>
                                            <Col span={22}>
                                              <Form.Item
                                                {...restSubSubField}
                                                name={[subSubName]}
                                                style={{ marginBottom: 0 }}
                                              >
                                                <Input
                                                  placeholder="– дополнительный пункт (например: снятие изоляции...)"
                                                />
                                              </Form.Item>
                                            </Col>
                                            <Col span={2}>
                                              <Button
                                                size="small"
                                                type="text"
                                                danger
                                                onClick={() => removeSubSub(subSubName)}
                                                icon={<MinusCircleOutlined />}
                                              />
                                            </Col>
                                          </Row>
                                        ))}
                                        <Button
                                          type="dashed"
                                          onClick={() => addSubSub('')}
                                          block
                                          icon={<PlusOutlined />}
                                          style={{ marginBottom: 8 }}
                                        >
                                          Добавить дополнительный пункт
                                        </Button>
                                      </div>
                                    )}
                                  </Form.List>
                                </div>
                              ))}
                              <Button
                                type="dashed"
                                onClick={() => addSub({ text: '', subitems: [''] })}
                                block
                                icon={<PlusOutlined />}
                                style={{ marginBottom: 8 }}
                              >
                                Добавить подпункт
                              </Button>
                            </div>
                          )}
                        </Form.List>
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add({ title: '', items: [{ text: '', subitems: [''] }] })}
                        block
                        icon={<PlusOutlined />}
                      >
                        Добавить новый этап
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          </TabPane>

          {/* ==================== Вкладка 3: Оснащение и материалы ==================== */}
          <TabPane
            tab={<span><PlusOutlined /> Оснащение</span>}
            key="3"
          >
            <div style={{ padding: '8px 16px' }}>
              <Title level={5}>Посты и бригады</Title>
              <Form.List name="posts">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        style={{
                          border: '1px solid #f0f0f0',
                          padding: 16,
                          marginBottom: 16,
                          borderRadius: 8,
                          background: '#fafafa',
                        }}
                      >
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'number']}
                              label="№ Поста"
                              rules={[{ required: true }]}
                            >
                              <Input placeholder="Пост №1" />
                            </Form.Item>
                          </Col>
                          <Col span={16}>
                            <Form.Item
                              {...restField}
                              name={[name, 'responsible']}
                              label="Ответственный за пост"
                              rules={[{ required: true }]}
                            >
                              <Select
                                placeholder="Выберите ответственного"
                                showSearch
                                allowClear
                                options={DICTIONARIES.employees}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item
                          {...restField}
                          name={[name, 'brigade']}
                          label="Состав бригады"
                        >
                          <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="Введите ФИО и нажмите Enter"
                            tokenSeparators={[',', ' ']}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'equipment']}
                          label="Автотранспорт и связь"
                        >
                          <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="Введите оборудование и нажмите Enter"
                            tokenSeparators={[',', ' ']}
                          />
                        </Form.Item>
                        <Button
                          danger
                          onClick={() => remove(name)}
                          icon={<MinusCircleOutlined />}
                          size="small"
                        >
                          Удалить пост
                        </Button>
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Добавить новый пост
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Divider orientation="left" plain>Материалы</Divider>
              <Form.List name="materials">
                {(fields, { add, remove }) => (
                  <>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '3fr 1fr 1fr 40px',
                        gap: 8,
                        marginBottom: 8,
                        fontWeight: 'bold',
                        padding: '0 4px',
                      }}
                    >
                      <span>ГОСТ, ТУ <Tooltip title="Наименование по ГОСТ или ТУ"><InfoCircleOutlined /></Tooltip></span>
                      <span>Ед. изм.</span>
                      <span>Кол-во</span>
                      <span></span>
                    </div>
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '3fr 1fr 1fr 40px',
                          gap: 8,
                          marginBottom: 8,
                        }}
                      >
                        <Form.Item
                          {...restField}
                          name={[name, 'standard']}
                          rules={[{ required: true, message: 'Введите стандарт' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="ГОСТ 123..." />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'unit']}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="шт, кг" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'quantity']}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                        <Button
                          danger
                          size="small"
                          onClick={() => remove(name)}
                          icon={<MinusCircleOutlined />}
                        />
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Добавить материал
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Divider orientation="left" plain>Приложения</Divider>
              <div style={{ marginBottom: 8 }}>
                <Tooltip title="Быстро добавить типовое приложение">
                  <Button
                    size="small"
                    onClick={() => {
                      const randomApp = DICTIONARIES.typicalAppendices[
                        Math.floor(Math.random() * DICTIONARIES.typicalAppendices.length)
                      ];
                      addTypicalAppendix(randomApp);
                    }}
                  >
                    Добавить из шаблона
                  </Button>
                </Tooltip>
              </div>
              <Form.List name="appendices">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name]}
                          rules={[{ required: true, message: 'Введите название приложения' }]}
                          style={{ width: '100%', marginBottom: 0 }}
                        >
                          <Input placeholder="Приложение № 1-1.1 «Схема расстановки постов»" />
                        </Form.Item>
                        <Button
                          danger
                          onClick={() => remove(name)}
                          icon={<MinusCircleOutlined />}
                        />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add('')}
                        block
                        icon={<PlusOutlined />}
                      >
                        Добавить приложение
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          </TabPane>

          {/* ==================== Вкладка 4: Безопасность и связь ==================== */}
          <TabPane
            tab={<span><SafetyOutlined /> Безопасность</span>}
            key="4"
          >
            <div style={{ padding: '8px 16px' }}>
              <Title level={5}>Опасные факторы</Title>
              <Form.List name={['safety', 'hazardFactors']}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 6 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name]}
                          style={{ flex: 1, marginBottom: 0 }}
                        >
                          <Input placeholder="Например: высокое давление в оборудовании" />
                        </Form.Item>
                        <Button
                          danger
                          size="small"
                          onClick={() => remove(name)}
                          icon={<MinusCircleOutlined />}
                        />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add('')}
                        block
                        icon={<PlusOutlined />}
                      >
                        Добавить опасный фактор
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Divider orientation="left" plain>Мероприятия по безопасности</Divider>
              <Form.Item
                name={['safety', 'measures']}
                label="16.2 Мероприятия по охране труда, промышленной и пожарной безопасности"
              >
                <TextArea rows={6} placeholder="Введите общие мероприятия..." />
              </Form.Item>

              <Divider orientation="left" plain>Допуск сторонних организаций</Divider>
              <Form.Item
                name={['safety', 'thirdPartyAdmission']}
                label="16.3 Допуск сторонних организаций"
              >
                <TextArea rows={3} placeholder="Порядок допуска..." />
              </Form.Item>

              <Divider orientation="left" plain>Организация связи</Divider>
              <Form.List name={['communication', 'posts']}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        style={{
                          border: '1px solid #f0f0f0',
                          padding: 12,
                          marginBottom: 12,
                          borderRadius: 6,
                        }}
                      >
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'name']}
                              label="Наименование поста"
                              rules={[{ required: true }]}
                            >
                              <Input placeholder="Пост №1 УП, «высокая» сторона" />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'number']}
                              label="Номер ОТЕ / радиостанции"
                              rules={[{ required: true }]}
                            >
                              <Input placeholder="2-53; 64-212" />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'responsible']}
                              label="Ответственный"
                            >
                              <Select
                                placeholder="Выберите ответственного"
                                showSearch
                                allowClear
                                options={DICTIONARIES.employees}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Button
                          danger
                          size="small"
                          onClick={() => remove(name)}
                          icon={<MinusCircleOutlined />}
                        >
                          Удалить пост связи
                        </Button>
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add({ name: '', number: '', responsible: '' })}
                        block
                        icon={<PlusOutlined />}
                      >
                        Добавить пост связи
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default PlanModal;