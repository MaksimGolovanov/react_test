import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Input,
  Collapse,
  message,
  Space,
  theme,
  Popconfirm,
  Modal,
  Form,
} from 'antd';
import {
  PlusOutlined,
  FileExcelOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import iusPtStore from '../../store/IusPtStore';
import AddRoleModal from './AddRoleModal';
import * as XLSX from 'xlsx';

const { useToken } = theme;
const { Panel } = Collapse;

const SpravRole = () => {
  const [activeKeys, setActiveKeys] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);
  const { token } = useToken();

  // Загрузка ролей
  const loadRoles = async () => {
    await iusPtStore.fetchRoles();
    setRoles(iusPtStore.roles);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  // Группировка и фильтрация (без изменений)
  const groupedData = roles.reduce((acc, role) => {
    const key = role.typename;
    if (!acc[key]) acc[key] = [];
    acc[key].push(role);
    return acc;
  }, {});

  const filteredGroupedData = Object.keys(groupedData).reduce(
    (acc, typename) => {
      const filtered = groupedData[typename].filter(
        (role) =>
          role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (role.typename || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (role.type || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length) acc[typename] = filtered;
      return acc;
    },
    {}
  );

  // Добавление роли
  const handleSaveRole = async (newRole) => {
    try {
      await iusPtStore.createRole(newRole);
      await loadRoles();
      message.success('Роль добавлена');
    } catch (error) {
      console.error(error);
      message.error('Ошибка добавления роли');
    }
  };

  // Импорт из Excel
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const rolesImport = json
        .slice(1)
        .filter((row) => row.some((cell) => cell))
        .map((row) => ({
          typename: row[0],
          type: row[1],
          name: row[2],
          code: row[3],
          mandat: row[4],
          business_process: row[5],
        }));
      if (rolesImport.length) {
        try {
          await iusPtStore.bulkCreateRoles(rolesImport);
          await loadRoles();
          message.success(`Импортировано ${rolesImport.length} ролей`);
        } catch (error) {
          console.error(error);
          message.error('Ошибка импорта');
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Редактирование
  const handleEdit = (role) => {
    setEditingRole(role);
    form.setFieldsValue({
      typename: role.typename,
      type: role.type,
      name: role.name,
      code: role.code,
      mandat: role.mandat,
      business_process: role.business_process,
    });
    setEditModalVisible(true);
  };

  const handleUpdateRole = async (values) => {
    try {
      await iusPtStore.updateRole({ id: editingRole.id, ...values });
      await loadRoles();
      message.success('Роль обновлена');
      setEditModalVisible(false);
      setEditingRole(null);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Ошибка обновления роли');
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingRole(null);
    form.resetFields();
  };

  // Удаление
  const handleDelete = async (roleId) => {
    try {
      await iusPtStore.deleteRole(roleId);
      await loadRoles();
      message.success('Роль удалена');
    } catch (error) {
      console.error(error);
      message.error('Ошибка удаления роли');
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowModal(true)}
        >
          Добавить роль
        </Button>
        <Button
          icon={<FileExcelOutlined />}
          onClick={() => fileInputRef.current.click()}
        >
          Добавить роли из Excel
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
          accept=".xlsx, .xls"
        />
      </Space>

      <Input.Search
        placeholder="Поиск ролей..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />

      <Collapse accordion activeKey={activeKeys} onChange={setActiveKeys}>
        {Object.entries(filteredGroupedData).map(([typename, rolesList]) => (
          <Panel
            header={`${typename} (${rolesList.length} элементов)`}
            key={typename}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  display: 'flex',
                  fontWeight: 'bold',
                  paddingBottom: 8,
                  borderBottom: `1px solid ${token.colorBorder}`,
                  color: token.colorText,
                }}
              >
                <div style={{ width: '10%' }}>Тип</div>
                <div style={{ width: '10%' }}>SID</div>
                <div style={{ width: '35%' }}>
                  Функциональная роль/Бизнес-роль
                </div>
                <div style={{ width: '15%' }}>Код роли</div>
                <div style={{ width: '10%' }}>Мандат</div>
                <div style={{ width: '10%' }}>Бизнес процесс</div>
                <div style={{ width: '10%', textAlign: 'center' }}>
                  Действия
                </div>
              </div>
              {rolesList.map((role, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    padding: '4px 0',
                    color: token.colorText,
                    alignItems: 'center',
                  }}
                >
                  <div style={{ width: '10%' }}>{role.typename}</div>
                  <div style={{ width: '10%' }}>{role.type}</div>
                  <div style={{ width: '35%' }}>{role.name}</div>
                  <div style={{ width: '15%' }}>{role.code}</div>
                  <div style={{ width: '10%' }}>{role.mandat}</div>
                  <div style={{ width: '10%' }}>{role.business_process}</div>
                  <div
                    style={{
                      width: '10%',
                      display: 'flex',
                      gap: 4,
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(role)}
                      size="small"
                    />
                    <Popconfirm
                      title="Удалить роль?"
                      onConfirm={() => handleDelete(role.id)}
                      okText="Да"
                      cancelText="Нет"
                    >
                      <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                      />
                    </Popconfirm>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </Collapse>

      {/* Модалка добавления */}
      <AddRoleModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onSave={handleSaveRole}
      />

      {/* Модалка редактирования */}
      <Modal
        title="Редактирование роли"
        open={editModalVisible}
        onCancel={handleCancelEdit}
        footer={[
          <Button key="cancel" onClick={handleCancelEdit}>
            Отмена
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Сохранить
          </Button>,
        ]}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateRole}>
          <Form.Item
            name="typename"
            label="Тип"
            rules={[{ required: true, message: 'Введите тип' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="SID"
            rules={[{ required: true, message: 'Введите SID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Функциональная роль/Бизнес-роль"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Код роли"
            rules={[{ required: true, message: 'Введите код' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="mandat" label="Мандат">
            <Input />
          </Form.Item>
          <Form.Item name="business_process" label="Бизнес процесс">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SpravRole;
