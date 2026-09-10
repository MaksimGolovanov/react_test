// src/features/protocols/ui/ProtocolModal/ProtocolModal.jsx
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  Space,
  InputNumber,
  Typography,
  Divider,
  Checkbox,
  Tooltip,
  message,
  List,
  Card,
} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  CloseOutlined,
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/ru_RU';
import 'dayjs/locale/ru';
import DictionaryStore from '../../store/DictionaryStore';

dayjs.locale('ru');

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const ProtocolModal = ({
  show,
  onHide,
  onSubmit,
  currentProtocol,
  formData,
  setFormData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [programSelectorVisible, setProgramSelectorVisible] = useState(false);
  const [searchProgram, setSearchProgram] = useState('');

  const { dictionaries } = DictionaryStore;

  useEffect(() => {
    if (show) {
      const initialValues = {
        ...formData,
        date: formData.date ? dayjs(formData.date) : null,
      };
      form.setFieldsValue(initialValues);
    }
  }, [show, formData, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      // Все значения теперь строки, преобразование не требуется
      const submitData = {
        ...values,
        date: values.date?.format('YYYY-MM-DD') || '',
      };

      await onSubmit(submitData);
      onHide();
      message.success(currentProtocol ? 'Протокол обновлён' : 'Протокол создан');
    } catch (e) {
      console.error(e);
      message.error('Ошибка при сохранении протокола');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onHide();
  };

  const getSelectOptions = (items) =>
    items.map((item) => ({ value: item.value, label: item.value }));

  const filteredPrograms = dictionaries.programs.filter((p) =>
    p.value.toLowerCase().includes(searchProgram.toLowerCase())
  );

  const handleSelectProgram = (program) => {
    form.setFieldsValue({ programName: program.value });
    setProgramSelectorVisible(false);
    setSearchProgram('');
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileTextOutlined />
          <span>
            {currentProtocol ? 'Редактирование протокола' : 'Создание нового протокола'}
          </span>
          <Tooltip title="Все поля, отмеченные *, обязательны для заполнения">
            <InfoCircleOutlined style={{ color: '#faad14' }} />
          </Tooltip>
        </div>
      }
      open={show}
      onCancel={handleCancel}
      width={1100}
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
          {currentProtocol ? 'Обновить протокол' : 'Создать протокол'}
        </Button>,
      ]}
      destroyOnClose
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 }}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {/* ========== БЛОК 1: ОБЩИЕ СВЕДЕНИЯ ========== */}
          <Card size="small" title="Общие сведения" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="number"
                  label="Номер протокола"
                  rules={[{ required: true, message: 'Введите номер' }]}
                >
                  <Input placeholder="01/103-16-ОТ" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="date" label="Дата" rules={[{ required: true }]}>
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD.MM.YYYY"
                    locale={locale}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="organization"
              label="Организация"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Выберите организацию"
                showSearch
                allowClear
                options={getSelectOptions(dictionaries.organizations)}
              />
            </Form.Item>

            <Form.Item
              name="trainingCenter"
              label="Организация, проводившая обучение"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Выберите учебный центр"
                showSearch
                allowClear
                options={getSelectOptions(dictionaries.trainingCenters)}
              />
            </Form.Item>

            <Form.Item
              name="programName"
              label="Программа обучения (наименование)"
              rules={[{ required: true }]}
              tooltip="Введите название программы вручную или выберите из справочника"
            >
              <Input.Group compact style={{ display: 'flex' }}>
                <TextArea
                  rows={4}
                  placeholder="Введите название программы..."
                  style={{ flex: 1, resize: 'vertical' }}
                  onChange={(e) => {
                    form.setFieldsValue({ programName: e.target.value });
                  }}
                />
                <Button
                  onClick={() => setProgramSelectorVisible(true)}
                  icon={<SearchOutlined />}
                  style={{ marginLeft: 8, minWidth: 100 }}
                >
                  Выбрать
                </Button>
              </Input.Group>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="programDuration"
                  label="Продолжительность (часов)"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="64" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="programSections"
                  label="Разделы программы (через запятую)"
                  tooltip="Например: А, Б, В, Г, Д"
                >
                  <Input placeholder="А, Б, В, Г, Д" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* ========== БЛОК 2: КОМИССИЯ ========== */}
          <Card size="small" title={<><TeamOutlined /> Комиссия</>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['commission', 'chairman', 'name']}
                  label="Председатель (ФИО)"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['commission', 'chairman', 'position']}
                  label="Должность председателя"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Выберите должность"
                    showSearch
                    allowClear
                    options={getSelectOptions(dictionaries.positions)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['commission', 'deputy', 'name']}
                  label="Заместитель (ФИО)"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['commission', 'deputy', 'position']}
                  label="Должность заместителя"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Выберите должность"
                    showSearch
                    allowClear
                    options={getSelectOptions(dictionaries.positions)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left" plain>Члены комиссии</Divider>
            <Form.List name={['commission', 'members']}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        border: '1px solid #f0f0f0',
                        padding: 12,
                        marginBottom: 8,
                        borderRadius: 6,
                        background: '#fafafa',
                      }}
                    >
                      <Row gutter={8} align="middle">
                        <Col span={10}>
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            label="ФИО"
                            rules={[{ required: true }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Иванов И.И." />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            {...restField}
                            name={[name, 'position']}
                            label="Должность"
                            rules={[{ required: true }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select
                              placeholder="Выберите должность"
                              showSearch
                              allowClear
                              options={getSelectOptions(dictionaries.positions)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4} style={{ textAlign: 'right', paddingTop: 22 }}>
                          <Button
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                            size="small"
                          />
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add({ name: '', position: '' })}
                    block
                    icon={<PlusOutlined />}
                    size="small"
                  >
                    Добавить члена комиссии
                  </Button>
                </>
              )}
            </Form.List>

            <Divider orientation="left" plain>Представители (профсоюз, уполномоченные)</Divider>
            <Form.List name={['commission', 'representatives']}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        border: '1px solid #f0f0f0',
                        padding: 12,
                        marginBottom: 8,
                        borderRadius: 6,
                        background: '#fafafa',
                      }}
                    >
                      <Row gutter={8} align="middle">
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            label="ФИО"
                            rules={[{ required: true }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Петрова П.П." />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'position']}
                            label="Должность"
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Ведущий специалист" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'role']}
                            label="Роль"
                            rules={[{ required: true }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select>
                              <Option value="Председатель ППО">Председатель ППО</Option>
                              <Option value="Уполномоченный по охране труда">
                                Уполномоченный по охране труда
                              </Option>
                              <Option value="Представитель профсоюза">
                                Представитель профсоюза
                              </Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={2} style={{ textAlign: 'right', paddingTop: 22 }}>
                          <Button
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                            size="small"
                          />
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add({ name: '', position: '', role: '' })}
                    block
                    icon={<PlusOutlined />}
                    size="small"
                  >
                    Добавить представителя
                  </Button>
                </>
              )}
            </Form.List>
          </Card>

          {/* ========== БЛОК 3: РАБОТНИКИ ========== */}
          <Card size="small" title={<><UserOutlined /> Список работников</>} style={{ marginBottom: 16 }}>
            <Form.List name="workers">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        border: '1px solid #f0f0f0',
                        padding: 16,
                        marginBottom: 12,
                        borderRadius: 6,
                        background: '#fafafa',
                      }}
                    >
                      <Row gutter={8}>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'fullName']}
                            label="ФИО"
                            rules={[{ required: true }]}
                            style={{ marginBottom: 4 }}
                          >
                            <Input placeholder="Сидоров С.С." />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, 'profession']}
                            label="Должность"
                            style={{ marginBottom: 4 }}
                          >
                            <Select
                              placeholder="Выберите должность"
                              showSearch
                              allowClear
                              options={getSelectOptions(dictionaries.positions)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, 'workplace']}
                            label="Место работы"
                            style={{ marginBottom: 4 }}
                          >
                            <Input placeholder="Цех №3" />
                          </Form.Item>
                        </Col>
                        <Col span={3}>
                          <Form.Item
                            {...restField}
                            name={[name, 'result']}
                            label="Результат"
                            rules={[{ required: true }]}
                            style={{ marginBottom: 4 }}
                          >
                            <Select>
                              <Option value="удовлетворительно">Удовлетворительно</Option>
                              <Option value="неудовлетворительно">Неудовлетворительно</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={3}>
                          <Form.Item
                            {...restField}
                            name={[name, 'certificateNumber']}
                            label="№ удостоверения"
                            style={{ marginBottom: 4 }}
                          >
                            <Input placeholder="2203254-ОТ" />
                          </Form.Item>
                        </Col>
                        <Col span={2} style={{ textAlign: 'right', paddingTop: 22 }}>
                          <Button
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                            size="small"
                          />
                        </Col>
                      </Row>
                      <Row gutter={8}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'checkReason']}
                            label="Причина проверки"
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Плановая, внеплановая..." />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'registryNumber']}
                            label="Рег. номер в реестре"
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="№ записи" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, 'signed']}
                            valuePropName="checked"
                            label="Подпись"
                            style={{ marginBottom: 0 }}
                          >
                            <Checkbox />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        fullName: '',
                        profession: '',
                        workplace: '',
                        result: 'удовлетворительно',
                        certificateNumber: '',
                        checkReason: '',
                        registryNumber: '',
                        signed: false,
                      })
                    }
                    block
                    icon={<PlusOutlined />}
                  >
                    Добавить работника
                  </Button>
                </>
              )}
            </Form.List>
          </Card>

          {/* ========== БЛОК 4: ДОПОЛНИТЕЛЬНО ========== */}
          <Card size="small" title="Дополнительные сведения" style={{ marginBottom: 16 }}>
            <Form.Item name="notes" label="Примечания">
              <TextArea rows={3} placeholder="Любые дополнительные сведения..." />
            </Form.Item>
            <Form.Item name="status" label="Статус" initialValue="draft">
              <Select style={{ width: 200 }}>
                <Option value="draft">Черновик</Option>
                <Option value="signed">Подписан</Option>
                <Option value="archived">Архив</Option>
              </Select>
            </Form.Item>
          </Card>
        </Form>
      </div>

      {/* Модалка выбора программы */}
      <Modal
        title="Выбор программы обучения"
        open={programSelectorVisible}
        onCancel={() => {
          setProgramSelectorVisible(false);
          setSearchProgram('');
        }}
        footer={null}
        width={700}
      >
        <Input
          placeholder="Поиск программы..."
          prefix={<SearchOutlined />}
          value={searchProgram}
          onChange={(e) => setSearchProgram(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <List
          bordered
          dataSource={filteredPrograms}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: 'pointer' }}
              onClick={() => handleSelectProgram(item)}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {item.value}
            </List.Item>
          )}
          locale={{ emptyText: 'Программы не найдены' }}
        />
      </Modal>
    </Modal>
  );
};

export default observer(ProtocolModal);