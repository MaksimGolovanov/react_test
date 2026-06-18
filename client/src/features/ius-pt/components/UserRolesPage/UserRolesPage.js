import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Table,
  Input,
  Button,
  Space,
  Upload,
  message,
  Card,
  Row,
  Col,
  theme,
  List,
  Typography,
} from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import iusPtStore from '../../store/IusPtStore';

const { useToken } = theme;
const { Title } = Typography;

const UserRolesPage = observer(({ info }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { token } = useToken();

  useEffect(() => {
    iusPtStore.fetchRoles();
  }, []);

  // Фильтрация ролей по выбранному типу и поисковому запросу
  const filteredRoles = selectedType
    ? iusPtStore.roles
        .filter(
          (role) =>
            role.typename === selectedType &&
            (role.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
              role.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => a.code.localeCompare(b.code))
    : [];

  // Выбрать все / снять все на текущей странице
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const currentPageIds = filteredRoles.map((role) => role.id);
    if (checked) {
      setSelectedRoles((prev) => [...new Set([...prev, ...currentPageIds])]);
    } else {
      setSelectedRoles((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    }
  };

  const isAllSelected =
    filteredRoles.length > 0 &&
    filteredRoles.every((role) => selectedRoles.includes(role.id));
  const isIndeterminate =
    filteredRoles.some((role) => selectedRoles.includes(role.id)) && !isAllSelected;

  const handleRoleSelect = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  // Сохранение выбранных ролей
  const saveSelectedRoles = async () => {
    const tabNumber = info.IusUser?.tabNumber;
    if (!tabNumber) {
      message.error('Табельный номер не указан.');
      return;
    }
    try {
      await iusPtStore.addRolesToUser(tabNumber, selectedRoles);
      message.success('Роли успешно сохранены!');
    } catch (error) {
      console.error(error);
      message.error('Ошибка при сохранении ролей.');
    }
  };

  // Загрузка ролей из Excel
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        const codesFromExcel = json.map((row) => {
          const firstKey = Object.keys(row)[0];
          return String(row[firstKey]).trim();
        });

        const matchedRoles = iusPtStore.roles
          .filter((role) => codesFromExcel.includes(String(role.code).trim()))
          .map((role) => role.id);

        setSelectedRoles(matchedRoles);
        message.success(`Загружено ${matchedRoles.length} ролей из файла!`);
      } catch (error) {
        console.error(error);
        message.error(
          'Ошибка при обработке файла. Убедитесь, что файл содержит коды ролей в первом столбце.'
        );
      }
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  // Колонки таблицы – чекбокс слева
  const columns = [
    {
      title: (
        <input
          type="checkbox"
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={handleSelectAll}
          style={{ cursor: 'pointer' }}
        />
      ),
      key: 'select',
      width: 50,
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedRoles.includes(record.id)}
          onChange={() => handleRoleSelect(record.id)}
          style={{ cursor: 'pointer' }}
        />
      ),
    },
    {
      title: 'Код',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Выбор ИУС" size="small" style={{ height: '100%' }}>
            <div style={{ maxHeight: 500, overflowY: 'auto' }}>
              <List
                dataSource={iusPtStore.rolesTypes}
                renderItem={(type) => (
                  <List.Item
                    onClick={() => setSelectedType(type)}
                    style={{
                      cursor: 'pointer',
                      padding: '10px 16px',
                      margin: '4px 0',
                      borderRadius: 6,
                      background:
                        selectedType === type
                          ? token.colorPrimaryBg
                          : 'transparent',
                      borderLeft:
                        selectedType === type
                          ? `3px solid ${token.colorPrimary}`
                          : 'none',
                      transition: 'all 0.2s',
                      color: token.colorText,
                    }}
                  >
                    <Typography.Text
                      strong={selectedType === type}
                      style={{
                        color:
                          selectedType === type
                            ? token.colorPrimary
                            : token.colorText,
                      }}
                    >
                      {type}
                    </Typography.Text>
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>
        <Col span={16}>
          <Card title="Роли" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <Input.Search
                  placeholder="Поиск по коду или названию"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: 300 }}
                  allowClear
                />
                <Upload
                  beforeUpload={handleFileUpload}
                  accept=".xlsx, .xls"
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Загрузить из Excel</Button>
                </Upload>
              </Space>
              {selectedType ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: token.colorText,
                    }}
                  >
                    <span>
                      <strong>Роли для ИУС: {selectedType}</strong>
                    </span>
                    <span>Выбрано ролей: {selectedRoles.length}</span>
                  </div>
                  <Table
                    columns={columns}
                    dataSource={filteredRoles}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    size="small"
                    scroll={{ y: 370 }}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      onClick={saveSelectedRoles}
                    >
                      Сохранить выбранные роли
                    </Button>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 32,
                    color: token.colorTextDisabled,
                  }}
                >
                  Выберите систему слева
                </div>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
});

export default UserRolesPage;