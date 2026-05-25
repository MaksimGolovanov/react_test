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

// ========== ОПИСАНИЕ КОНФИГУРАЦИИ ДЛЯ КАЖДОЙ СУЩНОСТИ ==========
const entityConfigs = {
  departments: {
    title: 'Службы',
    storeKey: 'departments',
    createMethod: 'createDepartment',
    updateMethod: 'updateDepartment',
    deleteMethod: 'deleteDepartment',
    fields: [
      {
        name: 'name',
        label: 'Название службы',
        required: true,
        placeholder: 'Введите название службы',
      },
      { name: 'head_name', label: 'Начальник', placeholder: 'ФИО начальника' },
      {
        name: 'email',
        label: 'Email',
        placeholder: 'email@example.com',
        rules: [{ type: 'email', message: 'Введите корректный email' }],
      },
      { name: 'phone', label: 'Телефон', placeholder: '+7 (XXX) XXX-XX-XX' },
    ],
    getEmptyRecord: () => ({ name: '', head_name: '', email: '', phone: '' }),
  },
  vehicleTypes: {
    title: 'Типы транспорта',
    storeKey: 'vehicleTypes',
    createMethod: 'createVehicleType',
    updateMethod: 'updateVehicleType',
    deleteMethod: 'deleteVehicleType',
    fields: [
      {
        name: 'name',
        label: 'Название типа',
        required: true,
        placeholder: 'Например: Легковой',
      },
      {
        name: 'sort_order',
        label: 'Порядок сортировки',
        inputType: 'number',
        placeholder: '0',
      },
    ],
    getEmptyRecord: () => ({ name: '', sort_order: 0 }),
  },
  vehicleSubtypes: {
    title: 'Подтипы транспорта',
    storeKey: 'vehicleSubtypes',
    createMethod: 'createVehicleSubtype',
    updateMethod: 'updateVehicleSubtype',
    deleteMethod: 'deleteVehicleSubtype',
    fields: [
      {
        name: 'vehicle_type_id',
        label: 'Тип транспорта',
        required: true,
        renderSelect: (store) => (
          <Select placeholder="Выберите тип">
            {store.vehicleTypes.map((type) => (
              <Select.Option key={type.id} value={type.id}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        name: 'name',
        label: 'Название подтипа',
        required: true,
        placeholder: 'Например: Седан',
      },
      {
        name: 'sort_order',
        label: 'Порядок сортировки',
        inputType: 'number',
        placeholder: '0',
      },
    ],
    getEmptyRecord: (store) => ({
      vehicle_type_id: store.vehicleTypes[0]?.id || '',
      name: '',
      sort_order: 0,
    }),
    getDisplayValue: (record, store) => {
      const vehicleType = store.vehicleTypes.find(
        (t) => t.id === record.vehicle_type_id
      );
      return vehicleType?.name || record.vehicle_type_name || '—';
    },
  },
};

// ========== УНИВЕРСАЛЬНЫЙ КОМПОНЕНТ ТАБЛИЦЫ С РЕДАКТИРОВАНИЕМ ==========
const EditableTable = ({ entityKey, data, loading, onRefresh }) => {
  const { transportStore } = useRootStore();
  const config = entityConfigs[entityKey];
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const handleAdd = () => {
    const emptyRecord = config.getEmptyRecord(transportStore);
    const tempId = `new_${Date.now()}`;
    const newRecord = { ...emptyRecord, id: tempId };

    setEditingId(tempId);
    setIsNewRecord(true);
    form.setFieldsValue(newRecord);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setIsNewRecord(false);
    form.setFieldsValue(record);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsNewRecord(false);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (isNewRecord) {
        await transportStore[config.createMethod](values);
        message.success(
          `${config.title.slice(0, -1)} добавлен${config.title === 'Службы' ? 'а' : ''}`
        );
      } else {
        await transportStore[config.updateMethod](editingId, values);
        message.success(
          `${config.title.slice(0, -1)} обновлён${config.title === 'Службы' ? 'а' : ''}`
        );
      }
      onRefresh(); // обновляем данные в сторе
      setEditingId(null);
      setIsNewRecord(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Ошибка при сохранении');
    }
  };

  const handleDelete = async (id) => {
    try {
      await transportStore[config.deleteMethod](id);
      message.success(
        `${config.title.slice(0, -1)} удалён${config.title === 'Службы' ? 'а' : ''}`
      );
      onRefresh();
    } catch (error) {
      console.error('Delete error:', error);
      message.error(error.response?.data?.message || 'Ошибка при удалении');
    }
  };

  // Формируем dataSource: добавляем новую запись, если она есть (editingId начинается с new_)
  const dataSource = [...data];
  if (
    isNewRecord &&
    editingId &&
    !dataSource.find((item) => item.id === editingId)
  ) {
    // Временная запись ещё не сохранена, добавляем её в начало
    const tempRecord = {
      ...config.getEmptyRecord(transportStore),
      id: editingId,
    };
    dataSource.unshift(tempRecord);
  }

  const columns = [
    ...config.fields.map((field) => ({
      title: field.label,
      dataIndex: field.name,
      key: field.name,
      render: (text, record) => {
        const isEditing = editingId === record.id;
        if (isEditing) {
          if (field.renderSelect) {
            return (
              <Form.Item
                name={field.name}
                rules={field.required ? [{ required: true }] : []}
                style={{ margin: 0 }}
              >
                {field.renderSelect(transportStore)}
              </Form.Item>
            );
          }
          const inputProps = {
            autoFocus: true,
            placeholder: field.placeholder,
          };
          if (field.inputType === 'number') {
            inputProps.type = 'number';
          }
          return (
            <Form.Item
              name={field.name}
              rules={field.required ? [{ required: true }] : field.rules || []}
              style={{ margin: 0 }}
            >
              <Input {...inputProps} />
            </Form.Item>
          );
        }
        // Отображение значения (для подтипов с select может понадобиться преобразование)
        if (config.getDisplayValue && field.name === 'vehicle_type_id') {
          return config.getDisplayValue(record, transportStore);
        }
        return text || '—';
      },
    })),
    {
      title: 'Действия',
      key: 'action',
      width: 120,
      render: (_, record) => {
        const isEditing = editingId === record.id;
        const isNewTemp = record.id?.toString().startsWith('new_');
        if (isEditing) {
          return (
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="small"
                onClick={handleSave}
              />
              <Button
                icon={<CloseOutlined />}
                size="small"
                onClick={handleCancelEdit}
              />
            </Space>
          );
        }
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
              disabled={isNewTemp}
            />
            <Popconfirm
              title={`Удалить ${config.title.slice(0, -1)}?`}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                disabled={isNewTemp}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Добавить {config.title.slice(0, -1).toLowerCase()}
      </Button>
      <Form form={form} component={false}>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={false}
          bordered
          loading={loading}
          size="small"
        />
      </Form>
    </>
  );
};

// ========== ОСНОВНОЙ КОМПОНЕНТ ==========
const DirectoryEditor = observer(({ visible, onClose }) => {
  const { transportStore } = useRootStore();
  const [activeTab, setActiveTab] = useState('departments');

  const refreshData = async () => {
    switch (activeTab) {
      case 'departments':
        await transportStore.fetchDepartments();
        break;
      case 'vehicleTypes':
        await transportStore.fetchVehicleTypes();
        break;
      case 'vehicleSubtypes':
        // Подтипы зависят от типов, подгружаем оба
        await Promise.all([
          transportStore.fetchVehicleTypes(),
          transportStore.fetchVehicleSubtypes(),
        ]);
        break;
      default:
        // Ничего не делаем для других вкладок (если они появятся)
        break;
    }
  };

  return (
    <Modal
      title="Редактирование справочников"
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={null}
      destroyOnClose
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Службы" key="departments">
          <EditableTable
            entityKey="departments"
            data={transportStore.departments}
            loading={transportStore.departmentsLoading}
            onRefresh={refreshData}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Типы транспорта" key="vehicleTypes">
          <EditableTable
            entityKey="vehicleTypes"
            data={transportStore.vehicleTypes}
            loading={
              transportStore.vehicleTypes?.length === 0 &&
              transportStore.vehiclesLoading
            }
            onRefresh={refreshData}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Подтипы транспорта" key="vehicleSubtypes">
          <EditableTable
            entityKey="vehicleSubtypes"
            data={transportStore.vehicleSubtypes}
            loading={
              transportStore.vehicleSubtypes?.length === 0 &&
              transportStore.vehiclesLoading
            }
            onRefresh={refreshData}
          />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
});

export default DirectoryEditor;
