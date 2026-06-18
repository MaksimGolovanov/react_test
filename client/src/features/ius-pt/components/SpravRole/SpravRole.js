import React, { useEffect, useState, useRef } from 'react';
import { Button, Input, Collapse, message, Space, theme } from 'antd';
import {
  PlusOutlined,
  FileExcelOutlined,
  SearchOutlined,
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
  const fileInputRef = useRef(null);
  const { token } = useToken();

  useEffect(() => {
    iusPtStore.fetchRoles().then(() => {
      setRoles(iusPtStore.roles);
    });
  }, []);

  // Группировка данных по typename
  const groupedData = roles.reduce((acc, role) => {
    const key = role.typename;
    if (!acc[key]) acc[key] = [];
    acc[key].push(role);
    return acc;
  }, {});

  // Фильтрация по поисковому запросу
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

  const handleSaveRole = async (newRole) => {
    try {
      await iusPtStore.createRole(newRole);
      setRoles([...roles, newRole]);
      message.success('Роль добавлена');
    } catch (error) {
      console.error(error);
      message.error('Ошибка добавления роли');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
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
      if (rolesImport.length) handleBulkSaveRoles(rolesImport);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleBulkSaveRoles = async (rolesImport) => {
    try {
      await iusPtStore.bulkCreateRoles(rolesImport);
      setRoles([...roles, ...rolesImport]);
      message.success(`Импортировано ${rolesImport.length} ролей`);
    } catch (error) {
      console.error(error);
      message.error('Ошибка импорта');
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
                <div style={{ width: '40%' }}>
                  Функциональная роль/Бизнес-роль
                </div>
                <div style={{ width: '20%' }}>Код роли</div>
                <div style={{ width: '10%' }}>Мандат</div>
                <div style={{ width: '10%' }}>Бизнес процесс</div>
              </div>
              {rolesList.map((role, idx) => (
                <div
                  key={idx}
                  style={{ display: 'flex', padding: '4px 0', color: token.colorText }}
                >
                  <div style={{ width: '10%' }}>{role.typename}</div>
                  <div style={{ width: '10%' }}>{role.type}</div>
                  <div style={{ width: '40%' }}>{role.name}</div>
                  <div style={{ width: '20%' }}>{role.code}</div>
                  <div style={{ width: '10%' }}>{role.mandat}</div>
                  <div style={{ width: '10%' }}>{role.business_process}</div>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </Collapse>

      <AddRoleModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onSave={handleSaveRole}
      />
    </div>
  );
};

export default SpravRole;