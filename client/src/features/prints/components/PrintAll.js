// src/features/prints/components/PrintAll.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Table, Row, Col, Image, Space, Skeleton, Card, Typography, theme } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ChromeOutlined, PrinterOutlined } from '@ant-design/icons';
import PrintsService from '../services/PrintsService';
import PrintCreateModal from './PrintCreateModal';
import PrintEditModal from './PrintEditModal';
import PrintChart from './PrintChart';
import styles from './PrintAll.module.css';

const { Search } = Input;
const { Text } = Typography;
const { useToken } = theme;

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23ccc'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3C/svg%3E";

function PrintAll() {
  const { token } = useToken();
  const [prints, setPrints] = useState([]);
  const [printModels, setPrintModels] = useState([]);
  const [printsEdit, setPrintsEdit] = useState(null);
  const [selectedPrint, setSelectedPrint] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPrints, setFilteredPrints] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const openModalEdit = () => setModalIsOpenEdit(true);
  const closeModalEdit = () => setModalIsOpenEdit(false);
  const handleCreateClick = () => openModal();
  const handleCreateClickEdit = (id) => { setPrintsEdit(id); openModalEdit(); };

  const fetchPrints = async () => {
    try {
      const response = await PrintsService.fetchPrints();
      setPrints(response);
      setFilteredPrints(response);
    } catch (error) { console.error('Ошибка при загрузке принтеров:', error); }
  };

  const fetchPrintModels = async () => {
    try { setPrintModels(await PrintsService.fetchPrintModel()); } 
    catch (error) { console.error('Ошибка при загрузке моделей:', error); }
  };

  const getModelInfoById = (modelId) => printModels.find(model => model.id === Number(modelId)) || null;

  const deletePrint = useCallback(async (id) => {
    try {
      await PrintsService.deletePrint(id);
      const updated = prints.filter(p => p.id !== id);
      setPrints(updated);
      setFilteredPrints(updated);
    } catch (error) { console.error('Ошибка при удалении:', error); }
  }, [prints]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (!query) { setFilteredPrints(prints); return; }
    const filtered = prints.filter(print => {
      const modelInfo = getModelInfoById(print.print_model);
      return (
        (print.department?.toLowerCase().includes(query)) ||
        (print.location?.toLowerCase().includes(query)) ||
        (print.ip?.toLowerCase().includes(query)) ||
        (print.logical_name?.toLowerCase().includes(query)) ||
        (print.serial_number?.toLowerCase().includes(query)) ||
        (print.url?.toLowerCase().includes(query)) ||
        (modelInfo?.name?.toLowerCase().includes(query)) ||
        (modelInfo?.cartridge?.toLowerCase().includes(query))
      );
    });
    setFilteredPrints(filtered);
  };

  useEffect(() => { fetchPrints(); fetchPrintModels(); }, []);

  const columns = [
    { title: 'Статус', dataIndex: 'status', key: 'status', width: 80,
      render: (status) => <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: status === 1 ? token.colorSuccess : token.colorError }} />,
      sorter: (a,b) => a.status - b.status },
    { title: 'Отдел', dataIndex: 'department', key: 'department', sorter: (a,b) => (a.department || '').localeCompare(b.department || '') },
    { title: 'Расположение', dataIndex: 'location', key: 'location', sorter: (a,b) => (a.location || '').localeCompare(b.location || '') },
    { title: 'Принтер', dataIndex: 'print_model', key: 'print_model', render: (modelId) => getModelInfoById(modelId)?.name || 'Не найдено',
      sorter: (a,b) => (getModelInfoById(a.print_model)?.name || '').localeCompare(getModelInfoById(b.print_model)?.name || '') },
    { title: 'Примечание', dataIndex: 'description', key: 'description', sorter: (a,b) => (a.description || '-').localeCompare(b.description || '-') },
    { title: 'Действия', key: 'actions', width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined style={{ fontSize: 12 }} />} onClick={() => handleCreateClickEdit(record.id)} />
          <Button type="text" icon={<DeleteOutlined style={{ fontSize: 12 }} />} onClick={() => deletePrint(record.id)} danger />
        </Space>
      )
    }
  ];

  const rowClassName = (record) => (selectedPrint?.id === record.id ? 'table-row-selected' : '');

  const SkeletonPanel = () => (
    <Card style={{ borderRadius: token.borderRadius, border: `1px solid ${token.colorBorder}`, background: token.colorBgContainer }}>
      <Row gutter={[24,24]}>
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            <Skeleton.Avatar active size={150} shape="square" style={{ borderRadius: token.borderRadius, marginBottom: 16 }} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Skeleton.Avatar active size={100} shape="square" style={{ borderRadius: token.borderRadius }} />
            <Skeleton.Avatar active size={100} shape="square" style={{ borderRadius: token.borderRadius }} />
          </div>
        </Col>
        <Col span={16}>
          <div style={{ marginBottom: 24 }}>
            <Skeleton.Input active block size="large" style={{ width: '60%', marginBottom: 16 }} />
            <Row gutter={16}>
              <Col span={12}>
                {[...Array(10)].map((_, i) => (
                  <Skeleton.Input key={i} active size="small" style={{ width: '70%', marginBottom: 12 }} />
                ))}
              </Col>
              <Col span={12}>
                {[...Array(10)].map((_, i) => (
                  <Skeleton.Input key={i} active size="small" style={{ width: '85%', marginBottom: 12 }} />
                ))}
              </Col>
            </Row>
          </div>
          <Skeleton.Button active size="large" block style={{ height: 40, borderRadius: token.borderRadius }} />
        </Col>
      </Row>
      <div style={{ marginTop: 32, textAlign: 'center', fontSize: 14, borderTop: `1px solid ${token.colorBorder}`, paddingTop: 24 }}>
        <PrinterOutlined style={{ fontSize: 32, marginBottom: 8, opacity: 0.5, color: token.colorTextSecondary }} />
        <Text type="secondary">Выберите принтер из списка, чтобы увидеть детали</Text>
      </div>
    </Card>
  );

  return (
    <div style={{ height: 'calc(100vh - 220px)' }}>
      <Row gutter={16}>
        <Col span={10} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ marginBottom: 16 }}>
            <Search placeholder="Поиск по всем полям..." value={searchQuery} onChange={handleSearchChange} allowClear />
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Table
              columns={columns}
              dataSource={filteredPrints}
              rowKey="id"
              pagination={false}
              onRow={(record) => ({ onClick: () => setSelectedPrint(record) })}
              rowClassName={rowClassName}
              size="small"
              scroll={{ y: 'calc(100vh - 310px)' }}
              sticky
            />
          </div>
        </Col>
        <Col span={14}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateClick}>Создать</Button>
          </div>
          {selectedPrint ? (
            <div className={styles.printDetails}>
              <Row gutter={16}>
                <Col span={8}>
                  <h3 style={{ textAlign: 'center', fontSize: '1rem', color: token.colorText }}>
                    {getModelInfoById(selectedPrint.print_model)?.name || 'Выберите принтер'}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Image
                      src={getModelInfoById(selectedPrint.print_model)?.img1 ? `${API_BASE_URL}static/${getModelInfoById(selectedPrint.print_model).img1}` : null}
                      width={150}
                      style={{ objectFit: 'cover', marginBottom: 8 }}
                      fallback={FALLBACK_IMAGE}
                    />
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <Image
                        width={100}
                        src={getModelInfoById(selectedPrint.print_model)?.img2 ? `${API_BASE_URL}static/${getModelInfoById(selectedPrint.print_model).img2}` : null}
                        fallback={FALLBACK_IMAGE}
                      />
                      <Image
                        width={100}
                        src={getModelInfoById(selectedPrint.print_model)?.img3 ? `${API_BASE_URL}static/${getModelInfoById(selectedPrint.print_model).img3}` : null}
                        fallback={FALLBACK_IMAGE}
                      />
                    </div>
                  </div>
                </Col>
                <Col span={16}>
                  <Row>
                    <Col span={12} style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: 8 }}>
                      <p>МОДЕЛЬ:</p><p>ЛОГИЧЕСКОЕ ИМЯ:</p><p>КАРТРИДЖ:</p><p>ФОРМАТ:</p><p>ТИП СКАНЕРА:</p>
                      <p>ОТДЕЛ:</p><p>МЕСТО РАСПОЛОЖЕНИЯ:</p><p>IP:</p><p>URL:</p><p>СЕРИЙНЫЙ №</p>
                    </Col>
                    <Col span={12} style={{ textAlign: 'left', paddingLeft: 8 }}>
                      <p>{getModelInfoById(selectedPrint.print_model)?.name || '-'}</p>
                      <p>{selectedPrint?.logical_name || '-'}</p>
                      <p>{getModelInfoById(selectedPrint.print_model)?.cartridge || '-'}</p>
                      <p>{getModelInfoById(selectedPrint.print_model)?.paper_size || '-'}</p>
                      <p>{getModelInfoById(selectedPrint.print_model)?.scanner || '-'}</p>
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
                    style={{ width: '100%', marginTop: 16 }}
                  >
                    Перейти по адресу
                  </Button>
                </Col>
              </Row>
              <Row style={{ marginTop: 24 }}>
                {selectedPrint?.serial_number && <PrintChart serialNumber={selectedPrint.serial_number} />}
              </Row>
            </div>
          ) : <SkeletonPanel />}
        </Col>
      </Row>
      <PrintCreateModal isOpen={modalIsOpen} onRequestClose={closeModal} onSuccess={fetchPrints} />
      <PrintEditModal isOpen={modalIsOpenEdit} onRequestClose={closeModalEdit} onSuccess={fetchPrints} printsId={printsEdit} />
    </div>
  );
}

export default PrintAll;