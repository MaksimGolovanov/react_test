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
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editingVehicleType, setEditingVehicleType] = useState(null);
  const [editingVehicleSubtype, setEditingVehicleSubtype] = useState(null);
  const [departmentForm] = Form.useForm();
  const [vehicleTypeForm] = Form.useForm();
  const [vehicleSubtypeForm] = Form.useForm();

  // Состояние для новой записи (временная строка)
  const [newDepartment, setNewDepartment] = useState(null);
  const [newVehicleType, setNewVehicleType] = useState(null);
  const [newVehicleSubtype, setNewVehicleSubtype] = useState(null);

  // ========== ОТДЕЛЫ ==========
  const handleAddDepartment = () => {
    // Создаем временную запись для новой службы
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
        const values = await departmentForm.validateFields()
        if (editingDepartment) {
            if (editingDepartment.id.toString().startsWith('new_')) {
                // Добавление нового отдела
                await transportStore.createDepartment(values)
                message.success('Служба добавлена')
                // Очищаем временную запись
                setNewDepartment(null)
            } else {
                // Обновление существующего
                await transportStore.updateDepartment(editingDepartment.id, values)
                message.success('Служба обновлена')
            }
            setEditingDepartment(null)
            departmentForm.resetFields()
        }
    } catch (error) {
        console.error('Validation failed:', error)
        message.error('Ошибка при сохранении')
    }
}

  const handleCancelEdit = () => {
    setEditingDepartment(null);
    setNewDepartment(null);
    departmentForm.resetFields();
  };

  const handleDeleteDepartment = async (id) => {
    await transportStore.deleteDepartment(id);
    message.success('Служба удалена');
  };

  // Объединяем существующие данные с новой записью
  const getDepartmentsDataSource = () => {
    const data = [...transportStore.departments];
    if (newDepartment) {
      data.unshift(newDepartment); // Добавляем новую запись в начало
    }
    return data;
  };

  const departmentColumns = [
    {
      title: 'Название службы',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        if (editingDepartment?.id === record.id) {
          return (
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Введите название' }]}
              style={{ margin: 0 }}
            >
              <Input autoFocus placeholder="Введите название службы" />
            </Form.Item>
          );
        }
        return text || '—';
      },
    },
    {
      title: 'Начальник',
      dataIndex: 'head_name',
      key: 'headName',
      render: (text, record) => {
        if (editingDepartment?.id === record.id) {
          return (
            <Form.Item name="head_name" style={{ margin: 0 }}>
              <Input placeholder="ФИО начальника" />
            </Form.Item>
          );
        }
        return text || '—';
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => {
        if (editingDepartment?.id === record.id) {
          return (
            <Form.Item
              name="email"
              rules={[{ type: 'email', message: 'Введите корректный email' }]}
              style={{ margin: 0 }}
            >
              <Input placeholder="email@example.com" />
            </Form.Item>
          );
        }
        return text || '—';
      },
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
      render: (text, record) => {
        if (editingDepartment?.id === record.id) {
          return (
            <Form.Item name="phone" style={{ margin: 0 }}>
              <Input placeholder="+7 (XXX) XXX-XX-XX" />
            </Form.Item>
          );
        }
        return text || '—';
      },
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
                onClick={handleCancelEdit}
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

  // ========== ТИПЫ ТРАНСПОРТА ==========
  const handleAddVehicleType = () => {
    const tempId = `new_${Date.now()}`;
    const tempRecord = {
      id: tempId,
      name: '',
      sort_order: 0,
    };
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
        const values = await vehicleTypeForm.validateFields()
        if (editingVehicleType) {
            if (editingVehicleType.id.toString().startsWith('new_')) {
                await transportStore.createVehicleType(values)
                message.success('Тип транспорта добавлен')
                setNewVehicleType(null)
            } else {
                await transportStore.updateVehicleType(editingVehicleType.id, values)
                message.success('Тип транспорта обновлен')
            }
            setEditingVehicleType(null)
            vehicleTypeForm.resetFields()
        }
    } catch (error) {
        console.error('Validation failed:', error)
        message.error('Ошибка при сохранении')
    }
}

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
    if (newVehicleType) {
      data.unshift(newVehicleType);
    }
    return data;
  };

  const vehicleTypeColumns = [
    {
      title: 'Название типа',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        if (editingVehicleType?.id === record.id) {
          return (
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Введите название типа' }]}
              style={{ margin: 0 }}
            >
              <Input autoFocus placeholder="Например: Легковой" />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: 'Порядок сортировки',
      dataIndex: 'sort_order',
      key: 'sort_order',
      render: (text, record) => {
        if (editingVehicleType?.id === record.id) {
          return (
            <Form.Item name="sort_order" style={{ margin: 0 }}>
              <Input type="number" placeholder="0" />
            </Form.Item>
          );
        }
        return text || 0;
      },
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

  // ========== ПОДТИПЫ ТРАНСПОРТА ==========
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
        const values = await vehicleSubtypeForm.validateFields()
        if (editingVehicleSubtype) {
            if (editingVehicleSubtype.id.toString().startsWith('new_')) {
                await transportStore.createVehicleSubtype(values)
                message.success('Подтип транспорта добавлен')
                setNewVehicleSubtype(null)
            } else {
                await transportStore.updateVehicleSubtype(editingVehicleSubtype.id, values)
                message.success('Подтип транспорта обновлен')
            }
            setEditingVehicleSubtype(null)
            vehicleSubtypeForm.resetFields()
        }
    } catch (error) {
        console.error('Validation failed:', error)
        message.error('Ошибка при сохранении')
    }
}

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
    if (newVehicleSubtype) {
      data.unshift(newVehicleSubtype);
    }
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
          (t) => t.id === text
        );
        return vehicleType?.name || '—';
      },
    },
    {
      title: 'Название подтипа',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        if (editingVehicleSubtype?.id === record.id) {
          return (
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Введите название подтипа' }]}
              style={{ margin: 0 }}
            >
              <Input autoFocus placeholder="Например: Седан" />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: 'Порядок сортировки',
      dataIndex: 'sort_order',
      key: 'sort_order',
      render: (text, record) => {
        if (editingVehicleSubtype?.id === record.id) {
          return (
            <Form.Item name="sort_order" style={{ margin: 0 }}>
              <Input type="number" placeholder="0" />
            </Form.Item>
          );
        }
        return text || 0;
      },
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

  // Данные для временных слотов
  const timeSlotColumns = [
    { title: 'Ключ', dataIndex: 'slot_key', key: 'slot_key' },
    { title: 'Интервал', dataIndex: 'label', key: 'label' },
    { title: 'Начало', dataIndex: 'start_time', key: 'start_time' },
    { title: 'Конец', dataIndex: 'end_time', key: 'end_time' },
  ];

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
          <Table
            columns={timeSlotColumns}
            dataSource={transportStore.timeSlots}
            rowKey="id"
            pagination={false}
            bordered
          />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
});

export default DirectoryEditor;
