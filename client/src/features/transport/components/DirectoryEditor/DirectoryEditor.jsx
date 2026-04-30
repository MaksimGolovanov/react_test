import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Modal,
  Tabs,
  Table,
  Button,
  Space,
  Form,
  Input,
  Popconfirm,
  message,
  Select,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useRootStore } from '../../hooks/useStores';

const DirectoryEditor = observer(({ visible, onClose }) => {
  const { transportStore } = useRootStore();
  const [activeTab, setActiveTab] = useState('departments');

  // ========== ОТДЕЛЫ ==========
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState(null);
  const [departmentForm] = Form.useForm();

  // ========== ТИПЫ ТРАНСПОРТА ==========
  const [editingVehicleType, setEditingVehicleType] = useState(null);
  const [newVehicleType, setNewVehicleType] = useState(null);
  const [vehicleTypeForm] = Form.useForm();

  // ========== ПОДТИПЫ ТРАНСПОРТА ==========
  const [editingVehicleSubtype, setEditingVehicleSubtype] = useState(null);
  const [newVehicleSubtype, setNewVehicleSubtype] = useState(null);
  const [vehicleSubtypeForm] = Form.useForm();

  // ========== ВРЕМЕННЫЕ СЛОТЫ ==========
  const [editingTimeSlot, setEditingTimeSlot] = useState(null);
  const [newTimeSlot, setNewTimeSlot] = useState(null);
  const [timeSlotForm] = Form.useForm();

  // ========== ВОДИТЕЛИ ==========
  const [editingDriver, setEditingDriver] = useState(null);
  const [newDriver, setNewDriver] = useState(null);
  const [driverForm] = Form.useForm();
  const [isCustomDepartment, setIsCustomDepartment] = useState(false);
  const [customDepartment, setCustomDepartment] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, at_work, on_vacation, on_sick_leave, on_study

  // Локализация статусов
  const statusLabels = {
    at_work: 'На работе',
    on_vacation: 'В отпуске',
    on_sick_leave: 'На больничном',
    on_study: 'На учёбе',
  };

  const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({
    value,
    label,
  }));

  // ==================== ОТДЕЛЫ ====================
  const handleAddDepartment = () => {
    const tempId = `new_${Date.now()}`;
    const tempRecord = {
      id: tempId,
      name: '',
      head_name: '',
      email: '',
      phone: '',
    };
    setNewDepartment(tempRecord);
    setEditingDepartment(tempRecord);
    departmentForm.setFieldsValue(tempRecord);
  };

  const handleEditDepartment = (record) => {
    setEditingDepartment(record);
    departmentForm.setFieldsValue(record);
  };

  const handleSaveDepartment = async () => {
    try {
      const values = await departmentForm.validateFields();
      if (editingDepartment) {
        if (editingDepartment.id.toString().startsWith('new_')) {
          await transportStore.createDepartment(values);
          message.success('Служба добавлена');
          setNewDepartment(null);
        } else {
          await transportStore.updateDepartment(editingDepartment.id, values);
          message.success('Служба обновлена');
        }
        setEditingDepartment(null);
        departmentForm.resetFields();
      }
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Ошибка при сохранении');
    }
  };

  const handleCancelEditDepartment = () => {
    setEditingDepartment(null);
    setNewDepartment(null);
    departmentForm.resetFields();
  };

  const handleDeleteDepartment = async (id) => {
    await transportStore.deleteDepartment(id);
    message.success('Служба удалена');
  };

  const getDepartmentsDataSource = () => {
    const data = [...transportStore.departments];
    if (newDepartment) data.unshift(newDepartment);
    return data;
  };

  const departmentColumns = [
    {
      title: 'Название службы',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) =>
        editingDepartment?.id === record.id ? (
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Введите название' }]}
            style={{ margin: 0 }}
          >
            <Input autoFocus placeholder="Введите название службы" />
          </Form.Item>
        ) : (
          text || '—'
        ),
    },
    {
      title: 'Начальник',
      dataIndex: 'head_name',
      key: 'headName',
      render: (text, record) =>
        editingDepartment?.id === record.id ? (
          <Form.Item name="head_name" style={{ margin: 0 }}>
            <Input placeholder="ФИО начальника" />
          </Form.Item>
        ) : (
          text || '—'
        ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) =>
        editingDepartment?.id === record.id ? (
          <Form.Item
            name="email"
            rules={[{ type: 'email', message: 'Введите корректный email' }]}
            style={{ margin: 0 }}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>
        ) : (
          text || '—'
        ),
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
      render: (text, record) =>
        editingDepartment?.id === record.id ? (
          <Form.Item name="phone" style={{ margin: 0 }}>
            <Input placeholder="+7 (XXX) XXX-XX-XX" />
          </Form.Item>
        ) : (
          text || '—'
        ),
    },
    {
      title: 'Действия',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          {editingDepartment?.id === record.id ? (
            <>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="small"
                onClick={handleSaveDepartment}
              />
              <Button
                icon={<CloseOutlined />}
                size="small"
                onClick={handleCancelEditDepartment}
              />
            </>
          ) : (
            <>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEditDepartment(record)}
                disabled={record.id?.toString().startsWith('new_')}
              />
              <Popconfirm
                title="Удалить службу?"
                onConfirm={() => handleDeleteDepartment(record.id)}
                okText="Да"
                cancelText="Нет"
                disabled={record.id?.toString().startsWith('new_')}
              >
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  disabled={record.id?.toString().startsWith('new_')}
                />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  // ==================== ТИПЫ ТРАНСПОРТА ====================
  const handleAddVehicleType = () => {
    const tempId = `new_${Date.now()}`;
    const tempRecord = { id: tempId, name: '', sort_order: 0 };
    setNewVehicleType(tempRecord);
    setEditingVehicleType(tempRecord);
    vehicleTypeForm.setFieldsValue(tempRecord);
  };

  const handleEditVehicleType = (record) => {
    setEditingVehicleType(record);
    vehicleTypeForm.setFieldsValue(record);
  };

  const handleSaveVehicleType = async () => {
    try {
      const values = await vehicleTypeForm.validateFields();
      if (editingVehicleType) {
        if (editingVehicleType.id.toString().startsWith('new_')) {
          await transportStore.createVehicleType(values);
          message.success('Тип транспорта добавлен');
          setNewVehicleType(null);
        } else {
          await transportStore.updateVehicleType(editingVehicleType.id, values);
          message.success('Тип транспорта обновлен');
        }
        setEditingVehicleType(null);
        vehicleTypeForm.resetFields();
      }
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Ошибка при сохранении');
    }
  };

  const handleCancelVehicleTypeEdit = () => {
    setEditingVehicleType(null);
    setNewVehicleType(null);
    vehicleTypeForm.resetFields();
  };

  const handleDeleteVehicleType = async (id) => {
    await transportStore.deleteVehicleType(id);
    message.success('Тип транспорта удален');
  };

  const getVehicleTypesDataSource = () => {
    const data = [...transportStore.vehicleTypes];
    if (newVehicleType) data.unshift(newVehicleType);
    return data;
  };

  const vehicleTypeColumns = [
    {
      title: 'Название типа',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) =>
        editingVehicleType?.id === record.id ? (
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Введите название типа' }]}
            style={{ margin: 0 }}
          >
            <Input autoFocus placeholder="Например: Легковой" />
          </Form.Item>
        ) : (
          text
        ),
    },
    {
      title: 'Порядок сортировки',
      dataIndex: 'sort_order',
      key: 'sort_order',
      render: (text, record) =>
        editingVehicleType?.id === record.id ? (
          <Form.Item name="sort_order" style={{ margin: 0 }}>
            <Input type="number" placeholder="0" />
          </Form.Item>
        ) : (
          text || 0
        ),
    },
    {
      title: 'Действия',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          {editingVehicleType?.id === record.id ? (
            <>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="small"
                onClick={handleSaveVehicleType}
              />
              <Button
                icon={<CloseOutlined />}
                size="small"
                onClick={handleCancelVehicleTypeEdit}
              />
            </>
          ) : (
            <>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEditVehicleType(record)}
                disabled={record.id?.toString().startsWith('new_')}
              />
              <Popconfirm
                title="Удалить тип?"
                onConfirm={() => handleDeleteVehicleType(record.id)}
                okText="Да"
                cancelText="Нет"
              >
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  disabled={record.id?.toString().startsWith('new_')}
                />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  // ==================== ПОДТИПЫ ТРАНСПОРТА ====================
  const handleAddVehicleSubtype = () => {
    const tempId = `new_${Date.now()}`;
    const defaultTypeId = transportStore.vehicleTypes[0]?.id || '';
    const tempRecord = {
      id: tempId,
      vehicle_type_id: defaultTypeId,
      name: '',
      sort_order: 0,
    };
    setNewVehicleSubtype(tempRecord);
    setEditingVehicleSubtype(tempRecord);
    vehicleSubtypeForm.setFieldsValue(tempRecord);
  };

  const handleEditVehicleSubtype = (record) => {
    setEditingVehicleSubtype(record);
    vehicleSubtypeForm.setFieldsValue({
      vehicle_type_id: record.vehicle_type_id,
      name: record.name,
      sort_order: record.sort_order,
    });
  };

  const handleSaveVehicleSubtype = async () => {
    try {
      const values = await vehicleSubtypeForm.validateFields();
      if (editingVehicleSubtype) {
        if (editingVehicleSubtype.id.toString().startsWith('new_')) {
          await transportStore.createVehicleSubtype(values);
          message.success('Подтип транспорта добавлен');
          setNewVehicleSubtype(null);
        } else {
          await transportStore.updateVehicleSubtype(
            editingVehicleSubtype.id,
            values
          );
          message.success('Подтип транспорта обновлен');
        }
        setEditingVehicleSubtype(null);
        vehicleSubtypeForm.resetFields();
      }
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Ошибка при сохранении');
    }
  };

  const handleCancelVehicleSubtypeEdit = () => {
    setEditingVehicleSubtype(null);
    setNewVehicleSubtype(null);
    vehicleSubtypeForm.resetFields();
  };

  const handleDeleteVehicleSubtype = async (id) => {
    await transportStore.deleteVehicleSubtype(id);
    message.success('Подтип транспорта удален');
  };

  const getVehicleSubtypesDataSource = () => {
    const data = [...transportStore.vehicleSubtypes];
    if (newVehicleSubtype) data.unshift(newVehicleSubtype);
    return data;
  };

  const vehicleSubtypeColumns = [
    {
      title: 'Тип транспорта',
      dataIndex: 'vehicle_type_id',
      key: 'vehicle_type_id',
      render: (text, record) => {
        if (editingVehicleSubtype?.id === record.id) {
          return (
            <Form.Item
              name="vehicle_type_id"
              rules={[{ required: true }]}
              style={{ margin: 0 }}
            >
              <Select placeholder="Выберите тип">
                {transportStore.vehicleTypes.map((type) => (
                  <Select.Option key={type.id} value={type.id}>
                    {type.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          );
        }
        const vehicleType = transportStore.vehicleTypes.find(
          (t) => t.id === text || t.id === record.vehicle_type_id
        );
        return vehicleType?.name || record.vehicle_type_name || '—';
      },
    },
    {
      title: 'Название подтипа',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) =>
        editingVehicleSubtype?.id === record.id ? (
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Введите название подтипа' }]}
            style={{ margin: 0 }}
          >
            <Input autoFocus placeholder="Например: Седан" />
          </Form.Item>
        ) : (
          text
        ),
    },
    {
      title: 'Порядок сортировки',
      dataIndex: 'sort_order',
      key: 'sort_order',
      render: (text, record) =>
        editingVehicleSubtype?.id === record.id ? (
          <Form.Item name="sort_order" style={{ margin: 0 }}>
            <Input type="number" placeholder="0" />
          </Form.Item>
        ) : (
          text || 0
        ),
    },
    {
      title: 'Действия',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          {editingVehicleSubtype?.id === record.id ? (
            <>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="small"
                onClick={handleSaveVehicleSubtype}
              />
              <Button
                icon={<CloseOutlined />}
                size="small"
                onClick={handleCancelVehicleSubtypeEdit}
              />
            </>
          ) : (
            <>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEditVehicleSubtype(record)}
                disabled={record.id?.toString().startsWith('new_')}
              />
              <Popconfirm
                title="Удалить подтип?"
                onConfirm={() => handleDeleteVehicleSubtype(record.id)}
                okText="Да"
                cancelText="Нет"
              >
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  disabled={record.id?.toString().startsWith('new_')}
                />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  // ==================== ВРЕМЕННЫЕ СЛОТЫ ====================
  const handleAddTimeSlot = () => {
    const tempId = `new_${Date.now()}`;
    const tempRecord = {
      id: tempId,
      slot_key: '',
      label: '',
      start_time: '',
      end_time: '',
      sort_order: 0,
    };
    setNewTimeSlot(tempRecord);
    setEditingTimeSlot(tempRecord);
    timeSlotForm.setFieldsValue(tempRecord);
  };

  const handleEditTimeSlot = (record) => {
    setEditingTimeSlot(record);
    timeSlotForm.setFieldsValue({
      slot_key: record.slot_key,
      label: record.label,
      start_time: record.start_time,
      end_time: record.end_time,
      sort_order: record.sort_order,
    });
  };

  const handleSaveTimeSlot = async () => {
    try {
      const values = await timeSlotForm.validateFields();
      if (editingTimeSlot) {
        if (editingTimeSlot.id.toString().startsWith('new_')) {
          await transportStore.createTimeSlot(values);
          message.success('Временной слот добавлен');
          setNewTimeSlot(null);
        } else {
          await transportStore.updateTimeSlot(editingTimeSlot.id, values);
          message.success('Временной слот обновлен');
        }
        setEditingTimeSlot(null);
        timeSlotForm.resetFields();
      }
    } catch (error) {
      console.error('Validation failed:', error);
      if (error.response?.data?.message)
        message.error(error.response.data.message);
      else message.error('Ошибка при сохранении');
    }
  };

  const handleCancelTimeSlotEdit = () => {
    setEditingTimeSlot(null);
    setNewTimeSlot(null);
    timeSlotForm.resetFields();
  };

  const handleDeleteTimeSlot = async (id) => {
    try {
      await transportStore.deleteTimeSlot(id);
      message.success('Временной слот удален');
    } catch (error) {
      console.error('Delete error:', error);
      if (error.response?.data?.message)
        message.error(error.response.data.message);
      else message.error('Ошибка при удалении');
    }
  };

  const getTimeSlotsDataSource = () => {
    const data = [...transportStore.timeSlots];
    if (newTimeSlot) data.unshift(newTimeSlot);
    return data;
  };

  const timeSlotColumns = [
    {
      title: 'Ключ',
      dataIndex: 'slot_key',
      key: 'slot_key',
      render: (text, record) =>
        editingTimeSlot?.id === record.id ? (
          <Form.Item
            name="slot_key"
            rules={[
              { required: true, message: 'Введите ключ' },
              {
                pattern: /^[A-Z0-9_]+$/,
                message: 'Только заглавные буквы, цифры и underscore',
              },
            ]}
            style={{ margin: 0 }}
          >
            <Input autoFocus placeholder="Например: MORNING" />
          </Form.Item>
        ) : (
          text || '—'
        ),
    },
    {
      title: 'Интервал',
      dataIndex: 'label',
      key: 'label',
      render: (text, record) =>
        editingTimeSlot?.id === record.id ? (
          <Form.Item
            name="label"
            rules={[{ required: true, message: 'Введите название интервала' }]}
            style={{ margin: 0 }}
          >
            <Input placeholder="Например: Утро (09:00-12:00)" />
          </Form.Item>
        ) : (
          text || '—'
        ),
    },
    {
      title: 'Начало',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (text, record) =>
        editingTimeSlot?.id === record.id ? (
          <Form.Item
            name="start_time"
            rules={[{ required: true, message: 'Введите время начала' }]}
            style={{ margin: 0 }}
          >
            <Input type="time" placeholder="09:00" />
          </Form.Item>
        ) : (
          text || '—'
        ),
    },
    {
      title: 'Конец',
      dataIndex: 'end_time',
      key: 'end_time',
      render: (text, record) =>
        editingTimeSlot?.id === record.id ? (
          <Form.Item
            name="end_time"
            rules={[{ required: true, message: 'Введите время окончания' }]}
            style={{ margin: 0 }}
          >
            <Input type="time" placeholder="12:00" />
          </Form.Item>
        ) : (
          text || '—'
        ),
    },
    {
      title: 'Порядок сортировки',
      dataIndex: 'sort_order',
      key: 'sort_order',
      render: (text, record) =>
        editingTimeSlot?.id === record.id ? (
          <Form.Item name="sort_order" style={{ margin: 0 }}>
            <Input type="number" placeholder="0" />
          </Form.Item>
        ) : (
          text || 0
        ),
    },
    {
      title: 'Действия',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          {editingTimeSlot?.id === record.id ? (
            <>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="small"
                onClick={handleSaveTimeSlot}
              />
              <Button
                icon={<CloseOutlined />}
                size="small"
                onClick={handleCancelTimeSlotEdit}
              />
            </>
          ) : (
            <>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEditTimeSlot(record)}
                disabled={record.id?.toString().startsWith('new_')}
              />
              <Popconfirm
                title="Удалить временной слот?"
                onConfirm={() => handleDeleteTimeSlot(record.id)}
                okText="Да"
                cancelText="Нет"
              >
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  disabled={record.id?.toString().startsWith('new_')}
                />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  // ==================== ВОДИТЕЛИ ====================
  const handleAddDriver = () => {
    const tempId = `new_${Date.now()}`;
    const tempRecord = {
      id: tempId,
      fio: '',
      post: 'Водитель',
      department: '',
      sort_order: 0,
      is_active: 'at_work', // было status: 'at_work'
    };
    setNewDriver(tempRecord);
    setEditingDriver(tempRecord);
    driverForm.setFieldsValue(tempRecord);
    setIsCustomDepartment(false);
    setCustomDepartment('');
  };

  const handleEditDriver = (record) => {
    setEditingDriver(record);
    driverForm.setFieldsValue({
      fio: record.fio,
      post: record.post,
      department: record.department,
      sort_order: record.sort_order,
      is_active: record.is_active || 'at_work', // было status: ...
    });
    // Проверка, выбран ли вариант "Другое"
    const predefined = ['Вуктыльское ЛПУМГ', 'УТТиСТ', 'УАВР'];
    if (record.department && !predefined.includes(record.department)) {
      setIsCustomDepartment(true);
      setCustomDepartment(record.department);
    } else {
      setIsCustomDepartment(false);
      setCustomDepartment('');
    }
  };

  const handleSaveDriver = async () => {
    try {
      const values = await driverForm.validateFields();
      if (editingDriver) {
        if (editingDriver.id.toString().startsWith('new_')) {
          await transportStore.createDriver(values);
          message.success('Водитель добавлен');
          setNewDriver(null);
        } else {
          await transportStore.updateDriver(editingDriver.id, values);
          message.success('Водитель обновлен');
        }
        setEditingDriver(null);
        driverForm.resetFields();
        setIsCustomDepartment(false);
        setCustomDepartment('');
      }
    } catch (error) {
      console.error('Validation failed:', error);
      if (error.response?.data?.message)
        message.error(error.response.data.message);
      else message.error('Ошибка при сохранении');
    }
  };

  const handleCancelDriverEdit = () => {
    setEditingDriver(null);
    setNewDriver(null);
    driverForm.resetFields();
    setIsCustomDepartment(false);
    setCustomDepartment('');
  };

  const handleDeleteDriver = async (id) => {
    try {
      await transportStore.deleteDriver(id);
      message.success('Водитель удален');
    } catch (error) {
      console.error('Delete error:', error);
      if (error.response?.data?.message)
        message.error(error.response.data.message);
      else message.error('Ошибка при удалении');
    }
  };

  const getDriversDataSource = () => {
    let data = [...transportStore.drivers];
    if (statusFilter !== 'all') {
      data = data.filter((driver) => driver.is_active === statusFilter); // было driver.status
    }
    if (newDriver) data.unshift(newDriver);
    return data;
  };

  const driverColumns = [
    {
      title: 'ФИО',
      dataIndex: 'fio',
      key: 'fio',
      width: 200,
      sorter: (a, b) => a.fio?.localeCompare(b.fio),
      render: (text, record) =>
        editingDriver?.id === record.id ? (
          <Form.Item
            name="fio"
            rules={[{ required: true, message: 'Введите ФИО' }]}
            style={{ margin: 0 }}
          >
            <Input autoFocus placeholder="Иванов Иван Иванович" />
          </Form.Item>
        ) : (
          text || '—'
        ),
    },
    {
      title: 'Должность',
      dataIndex: 'post',
      key: 'post',
      width: 150,
      render: (text, record) =>
        editingDriver?.id === record.id ? (
          <Form.Item
            name="post"
            rules={[{ required: true, message: 'Введите должность' }]}
            style={{ margin: 0 }}
          >
            <Input placeholder="Водитель" />
          </Form.Item>
        ) : (
          text || '—'
        ),
    },
    {
      title: 'Принадлежность',
      dataIndex: 'department',
      key: 'department',
      width: 200,
      render: (text, record) => {
        if (editingDriver?.id === record.id) {
          return (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item
                name="department"
                rules={[
                  {
                    required: true,
                    message: 'Выберите или введите принадлежность',
                  },
                ]}
                style={{ margin: 0 }}
              >
                <Select
                  placeholder="Выберите принадлежность"
                  allowClear
                  showSearch
                  onChange={(value) => {
                    if (value === 'other') {
                      setIsCustomDepartment(true);
                      driverForm.setFieldsValue({ department: undefined });
                    } else {
                      setIsCustomDepartment(false);
                      setCustomDepartment('');
                      driverForm.setFieldsValue({ department: value });
                    }
                  }}
                  options={[
                    { label: 'Вуктыльское ЛПУМГ', value: 'Вуктыльское ЛПУМГ' },
                    { label: 'УТТиСТ', value: 'УТТиСТ' },
                    { label: 'УАВР', value: 'УАВР' },
                    { label: '✏️ Другое (ручной ввод)', value: 'other' },
                  ]}
                />
              </Form.Item>
              {isCustomDepartment && (
                <Form.Item
                  name="department"
                  rules={[
                    { required: true, message: 'Введите принадлежность' },
                  ]}
                  style={{ margin: 0 }}
                >
                  <Input
                    placeholder="Введите название подразделения"
                    value={customDepartment}
                    onChange={(e) => setCustomDepartment(e.target.value)}
                    onBlur={() => {
                      if (customDepartment)
                        driverForm.setFieldsValue({
                          department: customDepartment,
                        });
                    }}
                  />
                </Form.Item>
              )}
            </Space>
          );
        }
        return text || '—';
      },
    },
    {
      title: 'Статус',
      dataIndex: 'is_active', // было 'status'
      key: 'is_active',
      width: 130,
      render: (is_active, record) =>
        editingDriver?.id === record.id ? (
          <Form.Item
            name="is_active"
            rules={[{ required: true, message: 'Выберите статус' }]}
            style={{ margin: 0 }}
          >
            <Select options={statusOptions} placeholder="Статус" />
          </Form.Item>
        ) : (
          statusLabels[is_active] || statusLabels.at_work
        ),
    },
    {
      title: 'Порядок сортировки',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 120,
      render: (text, record) =>
        editingDriver?.id === record.id ? (
          <Form.Item name="sort_order" style={{ margin: 0 }}>
            <Input type="number" placeholder="0" />
          </Form.Item>
        ) : (
          text || 0
        ),
    },
    {
      title: 'Действия',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          {editingDriver?.id === record.id ? (
            <>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="small"
                onClick={handleSaveDriver}
              />
              <Button
                icon={<CloseOutlined />}
                size="small"
                onClick={handleCancelDriverEdit}
              />
            </>
          ) : (
            <>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEditDriver(record)}
                disabled={record.id?.toString().startsWith('new_')}
              />
              <Popconfirm
                title="Удалить водителя?"
                onConfirm={() => handleDeleteDriver(record.id)}
                okText="Да"
                cancelText="Нет"
              >
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  disabled={record.id?.toString().startsWith('new_')}
                />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  // ==================== ОТРИСОВКА ====================
  return (
    <Modal
      title="Редактирование справочников"
      open={visible}
      onCancel={onClose}
      width={1200}
      footer={null}
      destroyOnClose
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Службы" key="departments">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddDepartment}
            style={{ marginBottom: 16 }}
          >
            Добавить службу
          </Button>
          <Form form={departmentForm} component={false}>
            <Table
              columns={departmentColumns}
              dataSource={getDepartmentsDataSource()}
              rowKey="id"
              pagination={false}
              bordered
            />
          </Form>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Типы транспорта" key="vehicleTypes">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddVehicleType}
            style={{ marginBottom: 16 }}
          >
            Добавить тип
          </Button>
          <Form form={vehicleTypeForm} component={false}>
            <Table
              columns={vehicleTypeColumns}
              dataSource={getVehicleTypesDataSource()}
              rowKey="id"
              pagination={false}
              bordered
            />
          </Form>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Подтипы транспорта" key="vehicleSubtypes">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddVehicleSubtype}
            style={{ marginBottom: 16 }}
          >
            Добавить подтип
          </Button>
          <Form form={vehicleSubtypeForm} component={false}>
            <Table
              columns={vehicleSubtypeColumns}
              dataSource={getVehicleSubtypesDataSource()}
              rowKey="id"
              pagination={false}
              bordered
            />
          </Form>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Временные слоты" key="timeSlots">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTimeSlot}
            style={{ marginBottom: 16 }}
          >
            Добавить временной слот
          </Button>
          <Form form={timeSlotForm} component={false}>
            <Table
              columns={timeSlotColumns}
              dataSource={getTimeSlotsDataSource()}
              rowKey="id"
              pagination={false}
              bordered
            />
          </Form>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Водители" key="drivers">
          <div
            style={{
              marginBottom: 16,
              display: 'flex',
              gap: '8px',
              justifyContent: 'space-between',
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddDriver}
            >
              Добавить водителя
            </Button>
            <Select
              placeholder="Фильтр по статусу"
              style={{ width: 200 }}
              value={statusFilter}
              onChange={setStatusFilter}
              options={[{ value: 'all', label: 'Все' }, ...statusOptions]}
            />
          </div>
          <Form form={driverForm} component={false}>
            <Table
              columns={driverColumns}
              dataSource={getDriversDataSource()}
              rowKey="id"
              pagination={{ pageSize: 10, showSizeChanger: true }}
              bordered
              scroll={{ x: 1000 }}
              rowClassName={(record) => {
                switch (record.is_active) {
                  case 'at_work':
                    return 'driver-status-at-work';
                  case 'on_sick_leave':
                    return 'driver-status-sick';
                  case 'on_vacation':
                    return 'driver-status-vacation';
                  case 'on_study':
                    return 'driver-status-study';
                  default:
                    return '';
                }
              }}
            />
            <style>{`
  .driver-status-at-work {
    background-color: #f0f9f0 !important; /* светло-зеленый */
  }
  .driver-status-at-work:hover {
    background-color: #e0f5e0 !important;
  }
  .driver-status-sick {
    background-color: #fffbe6 !important; /* светло-желтый */
  }
  .driver-status-sick:hover {
    background-color: #fff3cf !important;
  }
  .driver-status-vacation {
    background-color: #fff1f0 !important; /* светлокрасный */
  }
  .driver-status-vacation:hover {
    background-color: #ffe7e5 !important;
  }
  .driver-status-study {
    background-color: #fff7e6 !important; /* светло-оранжевый */
  }
  .driver-status-study:hover {
    background-color: #ffefcc !important;
  }
`}</style>
          </Form>
          <style>
            {`
              .inactive-row {
                background-color: #fff1f0;
                opacity: 0.7;
              }
              .inactive-row:hover {
                background-color: #ffe7e5 !important;
              }
            `}
          </style>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
});

export default DirectoryEditor;
