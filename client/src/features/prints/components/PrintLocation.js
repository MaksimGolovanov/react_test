// src/features/prints/components/PrintLocation.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, message, Modal, theme } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import PrintsService from '../services/PrintsService';
import PrintEditLocationModal from './PrinteEditLocationModal';

const { useToken } = theme;

const PrintLocation = () => {
  const { token } = useToken();
  const [locations, setLocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await PrintsService.fetchLocation();
      setLocations(data);
    } catch (error) { message.error('Ошибка загрузки зданий'); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const deleteLocation = async (id) => {
    try {
      await PrintsService.deleteLocation(id);
      fetchData();
      message.success('Здание удалено');
    } catch (error) { message.error('Ошибка удаления'); }
  };

  const columns = [
    { title: 'Расположение', dataIndex: 'location', key: 'location' },
    { title: '', key: 'action', width: 50, render: (_, r) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteLocation(r.id)} size="small" /> }
  ];

  return (
    <div style={{ height: 'calc(100vh - 250px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 12, flexShrink: 0 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)} size="small">Создать</Button>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table
          columns={columns}
          dataSource={locations}
          rowKey="id"
          bordered
          size="small"
          style={{ width: 400 }}
          pagination={false}
          scroll={{ y: 'calc(100vh - 330px)' }}
        />
      </div>
      <PrintEditLocationModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} onSuccess={fetchData} />
    </div>
  );
};

export default PrintLocation;