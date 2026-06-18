import React, { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Table, Card, Button, Modal, Form, Alert, Input, Row, Col, Typography, Badge, message, theme } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import StaffService from '../../services/StaffService';
import styles from './style.module.css';

const { Search } = Input;
const { Text } = Typography;
const { useToken } = theme;

const StaffSpravDepartments = observer(() => {
  const { token } = useToken();
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [sortConfig, setSortConfig] = useState({ key: 'code', direction: 'asc' });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await StaffService.fetchAllDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch {
      message.error('Ошибка при загрузке отделов');
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentDepartment(null);
    form.resetFields();
    setShowModal(true);
  };

  const handleEdit = () => {
    if (selectedRowKeys.length !== 1) return;
    const department = departments.find((d) => d.id === selectedRowKeys[0]);
    if (!department) return;
    setCurrentDepartment(department);
    form.setFieldsValue({
      code: department.code || '',
      description: department.description || '',
      short_name: department.short_name || '',
    });
    setShowModal(true);
  };

  const handleDelete = () => {
    if (selectedRowKeys.length === 0) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setConfirmLoading(true);
    try {
      for (const id of selectedRowKeys) {
        await StaffService.deleteDepartment(id);
      }
      setSelectedRowKeys([]);
      setShowDeleteModal(false);
      loadDepartments();
      message.success('Отделы успешно удалены');
    } catch {
      message.error('Ошибка при удалении отделов');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setConfirmLoading(true);
    try {
      if (currentDepartment) {
        await StaffService.updateDepartment(currentDepartment.id, values);
        message.success('Отдел успешно обновлен');
      } else {
        await StaffService.createDepartment(values);
        message.success('Отдел успешно создан');
      }
      setShowModal(false);
      loadDepartments();
      setSelectedRowKeys([]);
    } catch {
      message.error('Ошибка при сохранении данных');
    } finally {
      setConfirmLoading(false);
    }
  };

  const requestSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <SortAscendingOutlined style={{ marginLeft: 8 }} /> : <SortDescendingOutlined style={{ marginLeft: 8 }} />;
  };

  const sortedItems = useMemo(() => {
    if (!Array.isArray(departments) || departments.length === 0) return [];
    const filtered = departments.filter(
      (dept) =>
        dept.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.short_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (!sortConfig.key) return filtered;
    return [...filtered].sort((a, b) => {
      const valueA = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : '';
      const valueB = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : '';
      const comparison = valueA.localeCompare(valueB, 'ru', { numeric: true, sensitivity: 'base' });
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [departments, searchTerm, sortConfig]);

  const columns = [
    {
      title: (
        <div style={{ cursor: 'pointer' }} onClick={() => requestSort('code')}>
          Код отдела {getSortIcon('code')}
        </div>
      ),
      dataIndex: 'code',
      key: 'code',
      width: '20%',
      render: (text) => text || '-',
    },
    {
      title: (
        <div style={{ cursor: 'pointer' }} onClick={() => requestSort('description')}>
          Наименование {getSortIcon('description')}
        </div>
      ),
      dataIndex: 'description',
      key: 'description',
      width: '50%',
      render: (text) => text || '-',
    },
    {
      title: (
        <div style={{ cursor: 'pointer' }} onClick={() => requestSort('short_name')}>
          Короткое название {getSortIcon('short_name')}
        </div>
      ),
      dataIndex: 'short_name',
      key: 'short_name',
      width: '30%',
      render: (text) => text || '-',
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    type: 'radio',
    columnWidth: 60,
  };

  return (
    <div className={styles.spravContent}>
      <Card className={styles.toolbarCard}>
        <Row gutter={16} align="middle">
          <Col style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew} style={{ height: 32 }}>
              Добавить
            </Button>
            <Button icon={<EditOutlined />} onClick={handleEdit} disabled={selectedRowKeys.length !== 1} style={{ height: 32 }}>
              Редактировать
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete} disabled={selectedRowKeys.length === 0} style={{ height: 32 }}>
              Удалить
            </Button>
          </Col>
          <Col flex="auto">
            <Search
              placeholder="Поиск по коду, названию..."
              allowClear
              enterButton
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={setSearchTerm}
              className={styles.searchInput}
            />
          </Col>
          <Col>
            <Badge
              count={sortedItems.length}
              showZero
              style={{ backgroundColor: token.colorPrimary, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            />
            <Text style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', color: token.colorTextSecondary }}>
              из {departments.length}
            </Text>
          </Col>
        </Row>
      </Card>

      <Card className={styles.tableCard}>
        <div className={styles.userListScroll}>
          <Table
            size="middle"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={sortedItems.map((item) => ({ ...item, key: item.id }))}
            loading={isLoading}
            locale={{ emptyText: searchTerm ? 'Ничего не найдено' : 'Нет данных' }}
            pagination={false}
            style={{ width: '100%' }}
            rowClassName={styles.tableRow}
          />
        </div>
      </Card>

      <Modal
        title={currentDepartment ? 'Редактирование отдела' : 'Добавление нового отдела'}
        open={showModal}
        onCancel={() => !confirmLoading && setShowModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item label="Код отдела" name="code" rules={[{ required: true, message: 'Пожалуйста, введите код отдела' }]}>
            <Input placeholder="Например: IT-001" disabled={confirmLoading} />
          </Form.Item>
          <Form.Item label="Полное наименование" name="description" rules={[{ required: true, message: 'Пожалуйста, введите название отдела' }]}>
            <Input placeholder="Введите полное название отдела" disabled={confirmLoading} />
          </Form.Item>
          <Form.Item label="Короткое наименование" name="short_name" rules={[{ required: true, message: 'Пожалуйста, введите сокращенное название' }]}>
            <Input placeholder="Введите сокращенное название" disabled={confirmLoading} />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button onClick={() => setShowModal(false)} disabled={confirmLoading} style={{ marginRight: 8 }}>
                Отмена
              </Button>
              <Button type="primary" htmlType="submit" loading={confirmLoading}>
                Сохранить
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Подтверждение удаления"
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onOk={confirmDelete}
        confirmLoading={confirmLoading}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
      >
        {selectedRowKeys.length === 1 ? (
          <p>Вы действительно хотите удалить выбранный отдел?</p>
        ) : (
          <p>Вы действительно хотите удалить выбранные отделы ({selectedRowKeys.length} шт.)?</p>
        )}
        <Alert message="Внимание!" description="Это действие нельзя отменить." type="warning" showIcon style={{ marginTop: 16 }} />
      </Modal>
    </div>
  );
});

export default StaffSpravDepartments;