import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Input,
  Table,
  Row,
  Col,
  Image,
  Space,
  Skeleton,
  Card,
  Typography 
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ChromeOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import PrintsService from '../services/PrintsService';
import PrintCreateModal from './PrintCreateModal';
import PrintEditModal from './PrintEditModal';
import PrintChart from './PrintChart';
import '../pages/Prints.css';

const { Search } = Input;

const { Text } = Typography;

function PrintAll() {
  const [prints, setPrints] = useState([]);
  const [printModels, setPrintModels] = useState([]);
  const [printsEdit, setPrintsEdit] = useState([]);
  const [selectedPrint, setSelectedPrint] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPrints, setFilteredPrints] = useState([]);

  const API_BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:5000/';

  const openModal = useCallback(() => {
    if (!modalIsOpen) setModalIsOpen(true);
  }, [modalIsOpen]);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
  }, []);

  const handleCreateClick = useCallback(() => {
    openModal();
  }, [openModal]);

  const openModalEdit = useCallback(() => {
    if (!modalIsOpenEdit) setModalIsOpenEdit(true);
  }, [modalIsOpenEdit]);

  const closeModalEdit = useCallback(() => {
    setModalIsOpenEdit(false);
  }, []);

  const handleCreateClickEdit = useCallback(
    (id) => {
      setPrintsEdit(id);
      openModalEdit();
    },
    [openModalEdit]
  );

  const fetchPrints = async () => {
    try {
      const response = await PrintsService.fetchPrints();
      setPrints(response);
      setFilteredPrints(response);
    } catch (error) {
      console.error('Ошибка при загрузке принтеров:', error);
    }
  };

  const fetchPrintModels = async () => {
    try {
      const response = await PrintsService.fetchPrintModel();
      setPrintModels(response);
    } catch (error) {
      console.error('Ошибка при загрузке моделей принтеров:', error);
    }
  };

  const getModelInfoById = (modelId) => {
    const foundModel = printModels.find(
      (model) => model.id === Number(modelId)
    );
    return foundModel || null;
  };

  const handleRowClick = (print) => {
    setSelectedPrint(print);
  };

  useEffect(() => {
    fetchPrints();
    fetchPrintModels();
  }, []);

  const deletePrint = useCallback(
    async (id) => {
      try {
        await PrintsService.deletePrint(id);
        const updatedPrints = prints.filter((print) => print.id !== id);
        setPrints(updatedPrints);
        setFilteredPrints(updatedPrints);
      } catch (error) {
        console.error('Ошибка при удалении локации:', error);
      }
    },
    [prints]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (!query) {
      setFilteredPrints(prints);
      return;
    }
    const filtered = prints.filter((print) => {
      const modelInfo = getModelInfoById(print.print_model);
      return (
        (print.department && print.department.toLowerCase().includes(query)) ||
        (print.location && print.location.toLowerCase().includes(query)) ||
        (print.ip && print.ip.toLowerCase().includes(query)) ||
        (print.logical_name &&
          print.logical_name.toLowerCase().includes(query)) ||
        (print.serial_number &&
          print.serial_number.toLowerCase().includes(query)) ||
        (print.url && print.url.toLowerCase().includes(query)) ||
        (modelInfo?.name && modelInfo.name.toLowerCase().includes(query)) ||
        (modelInfo?.cartridge &&
          modelInfo.cartridge.toLowerCase().includes(query))
      );
    });
    setFilteredPrints(filtered);
  };

  const columns = [
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <span className={status === 1 ? 'green-circle' : 'red-circle'} />
      ),
      sorter: (a, b) => a.status - b.status,
    },
    {
      title: 'Отдел',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => (a.department || '').localeCompare(b.department || ''),
    },
    {
      title: 'Расположение',
      dataIndex: 'location',
      key: 'location',
      sorter: (a, b) => (a.location || '').localeCompare(b.location || ''),
    },
    {
      title: 'Принтер',
      dataIndex: 'print_model',
      key: 'print_model',
      render: (modelId) => getModelInfoById(modelId)?.name || 'Не найдено',
      sorter: (a, b) => {
        const modelA = getModelInfoById(a.print_model)?.name || '';
        const modelB = getModelInfoById(b.print_model)?.name || '';
        return modelA.localeCompare(modelB);
      },
    },
    {
      title: 'Примечание',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) =>
        (a.description || '-').localeCompare(b.description || '-'),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined style={{ fontSize: '12px' }} />}
            onClick={() => handleCreateClickEdit(record.id)}
            className="edit-button"
          />
          <Button
            type="text"
            icon={<DeleteOutlined style={{ fontSize: '12px' }} />}
            onClick={() => deletePrint(record.id)}
            className="delete-button"
            danger
          />
        </Space>
      ),
    },
  ];

  const rowClassName = (record) => {
    return selectedPrint?.id === record.id ? 'table-row-selected' : '';
  };

  // Улучшенный скелетон, точно соответствующий структуре реального контента
  const SkeletonPanel = () => (
    <Card
      style={{
        borderRadius: 24,
        border: '1px solid #f0f0f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        background: '#fafafa',
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            <Skeleton.Avatar
              active
              size={150}
              shape="square"
              style={{ borderRadius: 16, marginBottom: 16 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Skeleton.Avatar
              active
              size={100}
              shape="square"
              style={{ borderRadius: 12 }}
            />
            <Skeleton.Avatar
              active
              size={100}
              shape="square"
              style={{ borderRadius: 12 }}
            />
          </div>
        </Col>
        <Col span={16}>
          <div style={{ marginBottom: 24 }}>
            <Skeleton.Input
              active
              block
              size="large"
              style={{ width: '60%', marginBottom: 16 }}
            />
            <Row gutter={16}>
              <Col span={12}>
                {Array(10)
                  .fill()
                  .map((_, i) => (
                    <Skeleton.Input
                      key={i}
                      active
                      size="small"
                      style={{ width: '70%', marginBottom: 12 }}
                    />
                  ))}
              </Col>
              <Col span={12}>
                {Array(10)
                  .fill()
                  .map((_, i) => (
                    <Skeleton.Input
                      key={i}
                      active
                      size="small"
                      style={{ width: '85%', marginBottom: 12 }}
                    />
                  ))}
              </Col>
            </Row>
          </div>
          <Skeleton.Button
            active
            size="large"
            block
            style={{ height: 40, borderRadius: 8 }}
          />
        </Col>
      </Row>
      <div
        style={{
          marginTop: 32,
          textAlign: 'center',
          fontSize: 14,
          borderTop: '1px solid #f0f0f0',
          paddingTop: 24,
        }}
      >
        <PrinterOutlined
          style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}
        />
        <Text type="secondary">
          Выберите принтер из списка, чтобы увидеть детали
        </Text>
      </div>
    </Card>
  );

  return (
    <div style={{ height: 'calc(100vh - 220px)' }}>
      <Row gutter={16}>
        <Col span={10}>
          <div className="d-flex mb-2">
            <Search
              placeholder="Поиск по всем полям..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ width: '100%' }}
              allowClear
            />
          </div>
          <Table
            columns={columns}
            dataSource={filteredPrints}
            rowKey="id"
            pagination={false}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            rowClassName={rowClassName}
            className="table-prints"
            size="small"
          />
        </Col>
        <Col span={14}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 16,
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateClick}
              className="button-next"
            >
              Создать
            </Button>
          </div>
          {selectedPrint ? (
            <div>
              <Row gutter={16} className="mt-5">
                <Col span={8}>
                  <h3 style={{ textAlign: 'center', fontSize: '1rem' }}>
                    {getModelInfoById(selectedPrint.print_model)?.name ||
                      'Выберите принтер'}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      src={
                        getModelInfoById(selectedPrint.print_model)?.img1
                          ? `${API_BASE_URL}static/${getModelInfoById(selectedPrint.print_model)?.img1}`
                          : null
                      }
                      width={150}
                      style={{ objectFit: 'cover', marginBottom: 8 }}
                      alt="Внешний вид принтера"
                      fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23ccc'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3C/svg%3E"
                    />
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        src={
                          getModelInfoById(selectedPrint.print_model)?.img2
                            ? `${API_BASE_URL}static/${getModelInfoById(selectedPrint.print_model)?.img2}`
                            : null
                        }
                        width={100}
                        style={{ objectFit: 'cover' }}
                        alt="Картридж"
                        fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23ccc'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3C/svg%3E"
                      />
                      <Image
                        src={
                          getModelInfoById(selectedPrint.print_model)?.img3
                            ? `${API_BASE_URL}static/${getModelInfoById(selectedPrint.print_model)?.img3}`
                            : null
                        }
                        width={100}
                        style={{ objectFit: 'cover' }}
                        alt="Блок"
                        fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23ccc'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3C/svg%3E"
                      />
                    </div>
                  </div>
                </Col>
                <Col span={16}>
                  <Row>
                    <Col span={12} className="leftProperty">
                      <p>МОДЕЛЬ:</p>
                      <p>ЛОГИЧЕСКОЕ ИМЯ:</p>
                      <p>КАРТРИДЖ:</p>
                      <p>ФОРМАТ:</p>
                      <p>ТИП СКАНЕРА:</p>
                      <p>ОТДЕЛ:</p>
                      <p>МЕСТО РАСПОЛОЖЕНИЯ:</p>
                      <p>IP:</p>
                      <p>URL:</p>
                      <p>СЕРИЙНЫЙ №</p>
                    </Col>
                    <Col span={12} className="rightProperty">
                      <p>
                        {getModelInfoById(selectedPrint.print_model)?.name ||
                          '-'}
                      </p>
                      <p>{selectedPrint?.logical_name || '-'}</p>
                      <p>
                        {getModelInfoById(selectedPrint.print_model)
                          ?.cartridge || '-'}
                      </p>
                      <p>
                        {getModelInfoById(selectedPrint.print_model)
                          ?.paper_size || '-'}
                      </p>
                      <p>
                        {getModelInfoById(selectedPrint.print_model)?.scanner ||
                          '-'}
                      </p>
                      <p>{selectedPrint?.department || '-'}</p>
                      <p>{selectedPrint?.location || '-'}</p>
                      <p>{selectedPrint?.ip || '-'}</p>
                      <p>{selectedPrint?.url || '-'}</p>
                      <p>{selectedPrint?.serial_number || '-'}</p>
                    </Col>
                  </Row>
                  <Button
                    type="primary"
                    icon={<ChromeOutlined />}
                    href={`${selectedPrint.url}${selectedPrint.ip}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '100%', marginTop: 16 }}
                  >
                    Перейти по адресу
                  </Button>
                </Col>
              </Row>
              <Row className="mt-4">
                {selectedPrint?.serial_number && (
                  <PrintChart itemid={selectedPrint.serial_number} />
                )}
              </Row>
            </div>
          ) : (
            <SkeletonPanel />
          )}
        </Col>
      </Row>

      <PrintCreateModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        onSuccess={fetchPrints}
      />
      <PrintEditModal
        isOpen={modalIsOpenEdit}
        onRequestClose={closeModalEdit}
        onSuccess={fetchPrints}
        PrintsId={printsEdit}
      />
    </div>
  );
}

export default PrintAll;
