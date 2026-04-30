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

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const handleCreateClick = () => openModal();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await PrintsService.fetchPrintModel();
      if (!Array.isArray(response))
        throw new Error('Ответ сервера не является массивом');
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
            background: '#f5f5f5',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#bfbfbf',
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
      render: (text) => <Text strong>{text}</Text>,
      ellipsis: true,
    },
    {
      title: <span style={{ fontWeight: 600 }}>🖨️ Картридж</span>,
      dataIndex: 'cartridge',
      key: 'cartridge',
      ellipsis: true,
    },
    {
      title: <span style={{ fontWeight: 600 }}>📐 Формат печати</span>,
      dataIndex: 'paper_size',
      key: 'paper_size',
      ellipsis: true,
    },
    {
      title: <span style={{ fontWeight: 600 }}>🔍 Сканирование</span>,
      dataIndex: 'scanner',
      key: 'scanner',
      ellipsis: true,
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
              style={{ color: '#1890ff' }}
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
    return index % 2 === 0 ? 'table-row-light' : 'table-row-dark';
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
            <Title level={3} style={{ margin: 0, fontWeight: 600 }}>
              Справочник моделей принтеров
            </Title>
            <Text type="secondary">Всего моделей: {printsModels.length}</Text>
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
          .ant-table-thead > tr > th {
            background-color: #f8f9fc !important;
            font-weight: 600;
            font-size: 14px;
            border-bottom: 2px solid #e8eef4;
          }
          .ant-table-tbody > tr:hover > td {
            background-color: #f0f7ff !important;
          }
          /* Принудительно скрываем горизонтальную прокрутку */
          .ant-table-wrapper .ant-table-content {
            overflow-x: hidden !important;
          }
          .ant-table {
            width: 100% !important;
          }
          .ant-table-tbody > tr > td {
            word-break: break-word;
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
          style={{ borderRadius: '16px', overflow: 'hidden' }}
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