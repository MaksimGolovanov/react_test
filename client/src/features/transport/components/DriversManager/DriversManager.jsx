import React from 'react';
import { observer } from 'mobx-react-lite';
import { Table, Button, Space, Popconfirm, message, Row, Col, Input, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDriversManager } from './hooks/useDriversManager';
import DriverFormModal from './DriverFormModal';
import { DRIVER_STATUSES, getRowClassNameByStatus } from './constants/driverStatuses';
import './DriversManager.css';

const { Option } = Select;

const DriversManager = observer(() => {
  const {
    drivers,
    loading,
    modalVisible,
    editingDriver,
    searchText,
    statusFilter,
    openAddModal,
    openEditModal,
    closeModal,
    saveDriver,
    deleteDriver,
    setSearchText,
    setStatusFilter,
  } = useDriversManager();

  const columns = [
    {
      title: 'ФИО',
      dataIndex: 'fio',
      key: 'fio',
      sorter: (a, b) => a.fio?.localeCompare(b.fio),
      width: 200,
    },
    {
      title: 'Должность',
      dataIndex: 'post',
      key: 'post',
      width: 150,
    },
    {
      title: 'Принадлежность',
      dataIndex: 'department',
      key: 'department',
      width: 200,
    },
    {
      title: 'Статус',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 200,
      render: (status, record) => {
        const info = DRIVER_STATUSES[status] || { text: status, color: 'default' };
        if (status === 'at_work') {
          return <Tag color={info.color}>{info.text}</Tag>;
        }
        const from = record.date_from ? dayjs(record.date_from).format('DD.MM.YYYY') : '—';
        const to = record.date_to ? dayjs(record.date_to).format('DD.MM.YYYY') : '—';
        return (
          <Space direction="vertical" size={0}>
            <Tag color={info.color}>{info.text}</Tag>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {from} – {to}
            </span>
          </Space>
        );
      },
    },
    {
      title: 'Действия',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEditModal(record)} />
          <Popconfirm title="Удалить водителя?" onConfirm={() => deleteDriver(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Space>
            <Input
              placeholder="Поиск по ФИО, должности, отделу..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              placeholder="Статус"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="all">Все</Option>
              <Option value="at_work">На работе</Option>
              <Option value="on_vacation">В отпуске</Option>
              <Option value="on_sick_leave">На больничном</Option>
              <Option value="on_study">На учёбе</Option>
            </Select>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Добавить водителя
          </Button>
        </Col>
      </Row>

      <Table
        size="small"
        columns={columns}
        dataSource={drivers}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ y: 'calc(100vh - 300px)' }}
        bordered
        rowClassName={(record) => getRowClassNameByStatus(record.is_active)}
      />

      <DriverFormModal
        visible={modalVisible}
        editingDriver={editingDriver}
        onSave={saveDriver}
        onCancel={closeModal}
      />
    </div>
  );
});

export default DriversManager;