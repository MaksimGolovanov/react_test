// src/features/security-training/components/admin/UserModal.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  message,
  AutoComplete,
} from 'antd';
import { observer } from 'mobx-react-lite';
import securityTrainingStore from '../../../store/SecurityTrainingStore';
import userStore from '../../../store/UserStore';

const { Option } = Select;
const { TextArea } = Input;


const ROLE_OPTIONS = [
  { value: 'ST', label: 'ST (Обучающийся)' },
  { value: 'ST-ADMIN', label: 'ST-ADMIN (Администратор обучения)' },
];

const UserModal = observer(({ 
  visible, 
  mode, 
  currentUser, 
  loading, 
  onCancel, 
  onSubmitSuccess 
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Подготовка данных для поиска сотрудников
  const staffOptions = useMemo(() => 
    userStore.staff
      .filter(staff => staff.fio)
      .map(staff => ({
        value: staff.fio,
        label: `${staff.fio} (${staff.tabNumber})`,
        staffData: staff,
      }))
  , [userStore.staff]);

  // Обработчик выбора сотрудника
  const handleStaffSelect = useCallback((value, option) => {
    const { staffData } = option;
    form.setFieldsValue({
      tabNumber: staffData.tabNumber,
      login: staffData.login || '',
    });
    setSearchQuery(staffData.fio);
  }, [form]);

  // Сброс формы при открытии/закрытии модалки
  useEffect(() => {
    if (!visible) return;

    if (mode === 'edit' && currentUser) {
      form.setFieldsValue({
        login: currentUser.login,
        tabNumber: currentUser.tabNumber,
        description: currentUser.description,
        roles: currentUser.roles || ['ST'],
        password: '',
        passwordConfirm: '',
        staffSearch: '',
      });
    } else if (mode === 'create') {
      form.resetFields();
      setSearchQuery('');
      form.setFieldsValue({
        roles: ['ST'],
        staffSearch: '',
      });
    }
  }, [visible, mode, currentUser, form]);

  // Основная функция сохранения
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (mode === 'create' && values.password !== values.passwordConfirm) {
        message.error('Пароли не совпадают');
        return;
      }

      setSubmitting(true);
      await saveUserData(values);
      onSubmitSuccess();
    } catch (error) {
      handleSubmissionError(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Логика сохранения данных пользователя
  const saveUserData = async (values) => {
    const userData = prepareUserData(values);

    if (mode === 'create') {
      await createUser(userData);
    } else if (mode === 'edit' && currentUser) {
      await updateUser(userData);
    }
  };

  // Подготовка данных пользователя
  const prepareUserData = (values) => ({
    login: values.login.trim(),
    tabNumber: values.tabNumber.trim(),
    description: values.description?.trim() || '',
    roles: values.roles || ['ST'],
    ...(mode === 'create' && { password: values.password }),
    ...(mode === 'edit' && 
      values.password?.trim() && { password: values.password }),
  });

  // Создание пользователя
  const createUser = async (userData) => {
    try {
      await securityTrainingStore.createSTUser(userData);
      message.success('Пользователь успешно создан/обновлен');
    } catch (error) {
      if (isUserAlreadyExistsError(error)) {
        message.info('Пользователь был добавлен в систему обучения');
      } else {
        throw error;
      }
    }
  };

  // Обновление пользователя
  const updateUser = async (userData) => {
    await securityTrainingStore.updateSTUser(currentUser.id, userData);
    message.success('Пользователь успешно обновлен');
  };

  // Проверка на ошибку существующего пользователя
  const isUserAlreadyExistsError = (error) =>
    error.response?.status === 400 &&
    error.response?.data?.message?.includes('уже существует');

  // Обработка ошибок
  const handleSubmissionError = (error) => {
    console.error('Ошибка при сохранении пользователя:', error);
    
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Ошибка при сохранении пользователя';
    
    message.error(errorMessage);
  };

  // Правила валидации
  const validationRules = {
    login: [
      { required: true, message: 'Введите логин пользователя' },
      { min: 3, message: 'Логин должен содержать минимум 3 символа' },
    ],
    tabNumber: [
      { required: true, message: 'Введите табельный номер' },
    ],
    roles: [
      { required: true, message: 'Выберите роли пользователя' },
    ],
    password: [
      { required: mode === 'create', message: 'Введите пароль' },
      { min: 6, message: 'Пароль должен содержать минимум 6 символов' },
    ],
    passwordConfirm: [
      { required: mode === 'create', message: 'Подтвердите пароль' },
    ],
  };

  // Фильтрация опций для автокомплита
  const filterOptions = (inputValue, option) =>
    option.value.toLowerCase().includes(inputValue.toLowerCase()) ||
    option.staffData.tabNumber?.toString().includes(inputValue);

  // Рендер поиска сотрудников
  const renderStaffSearch = mode === 'create' && (
    <Form.Item label="Поиск сотрудника по ФИО" name="staffSearch">
      <AutoComplete
        options={staffOptions}
        value={searchQuery}
        onChange={setSearchQuery}
        onSelect={handleStaffSelect}
        placeholder="Введите ФИО сотрудника"
        style={{ width: '100%' }}
        filterOption={filterOptions}
      >
        <Input placeholder="Введите ФИО сотрудника" />
      </AutoComplete>
    </Form.Item>
  );

  // Рендер полей с паролями
  const renderPasswordFields = (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Пароль" name="password" rules={validationRules.password}>
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item 
          label="Подтверждение пароля" 
          name="passwordConfirm" 
          rules={validationRules.passwordConfirm}
        >
          <Input.Password placeholder="Подтвердите пароль" />
        </Form.Item>
      </Col>
    </Row>
  );

  // Рендер основных полей
  const renderMainFields = (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Логин" name="login" rules={validationRules.login}>
          <Input placeholder="Введите логин" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Табельный номер" name="tabNumber" rules={validationRules.tabNumber}>
          <Input placeholder="Введите табельный номер" />
        </Form.Item>
      </Col>
    </Row>
  );

  return (
    <Modal
      title={mode === 'create' ? 'Создание пользователя' : 'Редактирование пользователя'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={700}
      confirmLoading={submitting}
      okText={mode === 'create' ? 'Создать' : 'Сохранить'}
      cancelText="Отмена"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          roles: ['ST'],
          staffSearch: '',
        }}
      >
        {renderStaffSearch}
        {renderMainFields}

        <Form.Item label="Описание" name="description">
          <TextArea rows={2} placeholder="Введите описание пользователя" />
        </Form.Item>

        <Form.Item label="Роли" name="roles" rules={validationRules.roles}>
          <Select mode="multiple" placeholder="Выберите роли" allowClear>
            {ROLE_OPTIONS.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {renderPasswordFields}
      </Form>
    </Modal>
  );
});

export default UserModal;