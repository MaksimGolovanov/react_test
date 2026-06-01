import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Image,
  Modal,
  Space,
  Typography,
  Empty,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import PrintsService from '../services/PrintsService';
import PrintModelCreateModal from './PrintModelCreateModal';

const { Title, Text } = Typography;

function PrintModel() {
  const [printsModels, setPrintsModels] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Определение текущей темы
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkTheme(document.body.classList.contains('dark-theme'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const handleCreateClick = () => openModal();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await PrintsService.fetchPrintModel();
      if (!Array.isArray(response)) throw new Error('Ответ сервера не является массивом');
      setPrintsModels(response);
    } catch (error) {
      console.error(error);
      Modal.error({
        title: 'Ошибка загрузки',
        content: 'Не удалось загрузить список моделей принтеров',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id, name) => {
    Modal.confirm({
      title: 'Удаление модели',
      content: `Вы действительно хотите удалить модель "${name}"?`,
      okText: 'Да, удалить',
      cancelText: 'Отмена',
      okType: 'danger',
      icon: <DeleteOutlined />,
      onOk: async () => {
        try {
          await PrintsService.deletePrintModel(id);
          fetchData();
        } catch (error) {
          Modal.error({
            title: 'Ошибка',
            content: 'Не удалось удалить модель принтера',
          });
        }
      },
    });
  };

  const renderImage = (src, alt) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {src ? (
        <Image
          width={80}
          height={80}
          src={`${process.env.REACT_APP_API_URL}static/${src}`}
          alt={alt}
          preview={{ mask: <PictureOutlined style={{ fontSize: 20 }} /> }}
          style={{
            objectFit: 'cover',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        />
      ) : (
        <div
          style={{
            width: 80,
            height: 80,
            background: isDarkTheme ? 'rgba(255,255,255,0.1)' : '#f5f5f5',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDarkTheme ? '#aaa' : '#bfbfbf',
          }}
        >
          <PictureOutlined style={{ fontSize: 24 }} />
        </div>
      )}
    </div>
  );

  const columns = [
    {
      title: <span style={{ fontWeight: 600 }}>📄 Модель принтера</span>,
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text style={{ color: isDarkTheme ? '#f0f0f0' : undefined }} strong>{text}</Text>,
      ellipsis: true,
    },
    {
      title: <span style={{ fontWeight: 600 }}>🖨️ Картридж</span>,
      dataIndex: 'cartridge',
      key: 'cartridge',
      ellipsis: true,
      render: (text) => <span style={{ color: isDarkTheme ? '#ddd' : undefined }}>{text || '-'}</span>,
    },
    {
      title: <span style={{ fontWeight: 600 }}>📐 Формат печати</span>,
      dataIndex: 'paper_size',
      key: 'paper_size',
      ellipsis: true,
      render: (text) => <span style={{ color: isDarkTheme ? '#ddd' : undefined }}>{text || '-'}</span>,
    },
    {
      title: <span style={{ fontWeight: 600 }}>🔍 Сканирование</span>,
      dataIndex: 'scanner',
      key: 'scanner',
      ellipsis: true,
      render: (text) => <span style={{ color: isDarkTheme ? '#ddd' : undefined }}>{text || '-'}</span>,
    },
    {
      title: <span style={{ fontWeight: 600 }}>🖼️ Внешний вид</span>,
      key: 'img1',
      align: 'center',
      render: (_, record) => renderImage(record.img1, 'Внешний вид'),
    },
    {
      title: <span style={{ fontWeight: 600 }}>🎨 Картридж/Тонер</span>,
      key: 'img2',
      align: 'center',
      render: (_, record) => renderImage(record.img2, 'Картридж'),
    },
    {
      title: <span style={{ fontWeight: 600 }}>🧩 Блок</span>,
      key: 'img3',
      align: 'center',
      render: (_, record) => renderImage(record.img3, 'Блок'),
    },
    {
      title: <span style={{ fontWeight: 600 }}>⚙️ Действия</span>,
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Редактировать (в разработке)">
            <Button
              type="text"
              icon={<EditOutlined style={{ fontSize: 18 }} />}
              style={{ color: isDarkTheme ? '#69c0ff' : '#1890ff' }}
              onClick={() => {}}
            />
          </Tooltip>
          <Tooltip title="Удалить модель">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined style={{ fontSize: 18 }} />}
              onClick={() => handleDelete(record.id, record.name)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getRowClassName = (_, index) => {
    if (isDarkTheme) {
      return index % 2 === 0 ? 'table-row-dark-even' : 'table-row-dark-odd';
    }
    return index % 2 === 0 ? 'table-row-light' : 'table-row-dark';
  };

  // Динамические стили в зависимости от темы
  const tableStyle = {
    borderRadius: '16px',
    overflow: 'hidden',
  };

  const titleStyle = {
    margin: 0,
    fontWeight: 600,
    color: isDarkTheme ? '#f0f0f0' : '#1a1a1a',
  };

  const subtitleStyle = {
    color: isDarkTheme ? '#aaa' : '#666',
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 220px)' }}>
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}
        >
          <div>
            <Title level={3} style={titleStyle}>Справочник моделей принтеров</Title>
            <Text type="secondary" style={subtitleStyle}>Всего моделей: {printsModels.length}</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateClick}
            size="small"
            style={{ height: '34px' }}
          >
            Создать модель
          </Button>
        </div>

        <style>{`
          .table-row-light { background-color: #ffffff; }
          .table-row-dark { background-color: #fafafa; }
          .table-row-dark-even { background-color: rgba(30, 35, 45, 0.6); }
          .table-row-dark-odd { background-color: rgba(40, 45, 55, 0.6); }
          .ant-table-thead > tr > th {
            background-color: ${isDarkTheme ? 'rgba(0,0,0,0.4)' : '#f8f9fc'} !important;
            font-weight: 600;
            font-size: 14px;
            border-bottom: 2px solid ${isDarkTheme ? 'rgba(255,255,255,0.1)' : '#e8eef4'};
            color: ${isDarkTheme ? '#f0f0f0' : '#333'};
          }
          .ant-table-tbody > tr:hover > td {
            background-color: ${isDarkTheme ? 'rgba(24,144,255,0.15)' : '#f0f7ff'} !important;
          }
          .ant-table-wrapper .ant-table-content {
            overflow-x: hidden !important;
          }
          .ant-table {
            width: 100% !important;
          }
          .ant-table-tbody > tr > td {
            word-break: break-word;
            background: ${isDarkTheme ? 'transparent' : 'inherit'};
            color: ${isDarkTheme ? '#e0e0e0' : 'inherit'};
          }
        `}</style>

        <Table
          columns={columns}
          dataSource={printsModels}
          rowKey="id"
          loading={loading}
          bordered={false}
          pagination={false}
          locale={{
            emptyText: <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
          style={tableStyle}
          rowClassName={getRowClassName}
        />
      </div>

      <PrintModelCreateModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        onSuccess={fetchData}
      />
    </div>
  );
}

export default PrintModel;