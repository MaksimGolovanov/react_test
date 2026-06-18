// src/features/usb/ui/UsbModal/UsbModal.jsx
import { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Row, Col, Alert, Typography } from 'antd';
import { UserOutlined, MailOutlined, NumberOutlined, DatabaseOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';

dayjs.locale('ru');

const { Option } = Select;
const { Text } = Typography;

const UsbModal = ({ show, onHide, onSubmit, currentUsb, staff, getFioSuggestions }) => {
  const [form] = Form.useForm();
  const [fioOptions, setFioOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(false);

  // Заполнение формы при открытии (создание или редактирование)
  useEffect(() => {
    if (show) {
      if (currentUsb) {
        // Принудительная установка значений с небольшой задержкой для гарантии
        setTimeout(() => {
          form.setFieldsValue({
            num_form: currentUsb.num_form || '',
            ser_num: currentUsb.ser_num || '',
            volume: currentUsb.volume || '',
            data_uch: currentUsb.data_uch ? dayjs(currentUsb.data_uch) : null,
            fio: currentUsb.fio || '',
            email: currentUsb.email || '',
            department: currentUsb.department || '',
            data_prov: currentUsb.data_prov ? dayjs(currentUsb.data_prov) : null,
            log: currentUsb.log || 'Да',
          });
        }, 0);
      } else {
        form.resetFields();
      }
    }
  }, [show, currentUsb, form]);

  // Поиск сотрудников
  const handleFioSearch = (value) => {
    if (!value) {
      setFioOptions([]);
      return;
    }
    const suggestions = getFioSuggestions();
    const filtered = suggestions
      .filter(fio => fio.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 20); // ограничиваем количество
    setFioOptions(filtered);
  };

  const handleFioSelect = (value) => {
    const staffMember = staff?.find(s => s.fio === value);
    if (staffMember) {
      const department = staffMember.department ? staffMember.department.substring(13) : '';
      form.setFieldsValue({
        fio: value,
        email: staffMember.email || '',
        department: department,
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const submitData = {
        ...values,
        data_uch: values.data_uch ? values.data_uch.format('YYYY-MM-DD') : '',
        data_prov: values.data_prov ? values.data_prov.format('YYYY-MM-DD') : '',
      };
      await onSubmit(submitData, currentUsb);
      form.resetFields();
      setFioOptions([]);
      onHide();
    } catch (error) {
      console.error('Ошибка валидации:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFioOptions([]);
    onHide();
  };

  return (
    <Modal
      title={
        <span>
          <DatabaseOutlined style={{ marginRight: 8 }} />
          {currentUsb ? 'Редактирование USB-накопителя' : 'Добавление нового USB-накопителя'}
        </span>
      }
      open={show}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel}>Отмена</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>Сохранить</Button>,
      ]}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="num_form" label="Регистрационный номер" rules={[{ required: true, message: 'Введите номер' }, { pattern: /^[0-9]+$/, message: 'Только цифры' }]}>
              <Input placeholder="Введите регистрационный номер" prefix={<NumberOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="ser_num" label="Серийный номер" rules={[{ required: true, message: 'Введите серийный номер' }]}>
              <Input placeholder="Введите серийный номер" prefix={<NumberOutlined />} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="volume" label="Объем памяти (ГБ)">
              <Input placeholder="Введите объем памяти" suffix="ГБ" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="data_uch" label="Дата регистрации">
              <DatePicker style={{ width: '100%' }} placeholder="Выберите дату" format="DD.MM.YYYY" locale={locale} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="fio" label="ФИО сотрудника" rules={[{ required: true, message: 'Выберите сотрудника' }]}>
              <Select
                showSearch
                placeholder="Начните вводить ФИО для поиска"
                options={fioOptions.map(fio => ({ value: fio, label: fio }))}
                onSearch={handleFioSearch}
                onSelect={handleFioSelect}
                filterOption={false}
                allowClear
              />
              <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Начните вводить ФИО для поиска, при выборе автоматически заполнятся email и служба
              </Text>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="email" label="Электронная почта">
              <Input placeholder="Email будет заполнен автоматически" prefix={<MailOutlined />} readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="department" label="Служба">
              <Input placeholder="Служба будет заполнена автоматически" prefix={<TeamOutlined />} readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="data_prov" label="Дата последней проверки">
              <DatePicker style={{ width: '100%' }} placeholder="Выберите дату" format="DD.MM.YYYY" locale={locale} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="log" label="Статус работы" rules={[{ required: true, message: 'Выберите статус' }]}>
              <Select placeholder="Выберите статус">
                <Option value="Да">В работе</Option>
                <Option value="Нет">Не в работе</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {currentUsb && (
          <Alert message="Информация" description="Вы редактируете существующий USB-накопитель. Все изменения будут сохранены после нажатия кнопки 'Сохранить'." type="info" showIcon style={{ marginBottom: 16 }} />
        )}
      </Form>
    </Modal>
  );
};

export default UsbModal;