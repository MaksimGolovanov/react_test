// src/features/prints/components/PrintModel.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Image, Modal, Space, Typography, Tooltip, theme } from 'antd';
import { PlusOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';
import PrintsService from '../services/PrintsService';
import PrintModelCreateModal from './PrintModelCreateModal';

const { Title, Text } = Typography;
const { useToken } = theme;

function PrintModel() {
  const { token } = useToken();
  const [models, setModels] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await PrintsService.fetchPrintModel();
      setModels(Array.isArray(data) ? data : []);
    } catch (error) {
      Modal.error({ title: 'Ошибка', content: 'Не удалось загрузить список моделей' });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = (id, name) => {
    Modal.confirm({
      title: 'Удаление модели',
      content: `Удалить модель "${name}"?`,
      okText: 'Да',
      cancelText: 'Отмена',
      okType: 'danger',
      onOk: async () => {
        try {
          await PrintsService.deletePrintModel(id);
          fetchData();
        } catch { Modal.error({ content: 'Не удалось удалить модель' }); }
      }
    });
  };

  const renderImage = (src, alt) => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {src ? (
        <Image width={80} height={80} src={`${process.env.REACT_APP_API_URL}static/${src}`} alt={alt}
               preview={{ mask: <PictureOutlined style={{ fontSize: 20 }} /> }}
               style={{ objectFit: 'cover', borderRadius: token.borderRadius, cursor: 'pointer' }} />
      ) : (
        <div style={{ width: 80, height: 80, background: token.colorBgLayout, borderRadius: token.borderRadius,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: token.colorTextDisabled }}>
          <PictureOutlined style={{ fontSize: 24 }} />
        </div>
      )}
    </div>
  );

  const columns = [
    { title: 'Модель принтера', dataIndex: 'name', key: 'name', render: text => <Text strong style={{ color: token.colorText }}>{text}</Text> },
    { title: 'Картридж', dataIndex: 'cartridge', key: 'cartridge', render: text => text || '-' },
    { title: 'Формат печати', dataIndex: 'paper_size', key: 'paper_size', render: text => text || '-' },
    { title: 'Сканирование', dataIndex: 'scanner', key: 'scanner', render: text => text || '-' },
    { title: 'Внешний вид', key: 'img1', align: 'center', render: (_, r) => renderImage(r.img1, 'Внешний вид') },
    { title: 'Картридж', key: 'img2', align: 'center', render: (_, r) => renderImage(r.img2, 'Картридж') },
    { title: 'Блок', key: 'img3', align: 'center', render: (_, r) => renderImage(r.img3, 'Блок') },
    { title: 'Действия', key: 'action', align: 'center',
      render: (_, r) => (
        <Tooltip title="Удалить"><Button type="text" danger icon={<DeleteOutlined style={{ fontSize: 18 }} />} onClick={() => handleDelete(r.id, r.name)} /></Tooltip>
      )
    }
  ];

  return (
    <div style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexShrink: 0 }}>
        <div>
          <Title level={3} style={{ color: token.colorText, margin: 0 }}>Справочник моделей принтеров</Title>
          <Text type="secondary">Всего моделей: {models.length}</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>Создать модель</Button>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table
          columns={columns}
          dataSource={models}
          rowKey="id"
          loading={loading}
          pagination={false}
          rowClassName={(_, idx) => idx % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
          scroll={{ y: 'calc(100vh - 320px)' }}
        />
      </div>
      <PrintModelCreateModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} onSuccess={fetchData} />
    </div>
  );
}

export default PrintModel;