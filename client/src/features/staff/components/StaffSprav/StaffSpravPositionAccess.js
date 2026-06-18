import React, { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Alert,
  Input,
  Row,
  Col,
  Typography,
  Badge,
  message,
  theme,
  Select,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import StaffService from '../../services/StaffService';
import ConfidentialService from '../../services/ConfidentialService';
import PositionAccessService from '../../services/PositionAccessService';
import styles from './style.module.css';

const { Search } = Input;
const { Text } = Typography;
const { useToken } = theme;
const { Option } = Select;

const StaffSpravPositionAccess = observer(() => {
  const { token } = useToken();
  const [records, setRecords] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [confidentialItems, setConfidentialItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [sortConfig, setSortConfig] = useState({
    key: 'department.description',
    direction: 'asc',
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [access, depts, pos, conf] = await Promise.all([
        PositionAccessService.fetchAll(),
        StaffService.fetchAllDepartments(),
        StaffService.fetchAllDolgnost(),
        ConfidentialService.fetchAll(),
      ]);
      setRecords(Array.isArray(access) ? access : []);
      setDepartments(Array.isArray(depts) ? depts : []);
      setPositions(Array.isArray(pos) ? pos : []);
      const items = (Array.isArray(conf) ? conf : [])
        .filter((item) => item.item_number && item.item_number.trim())
        .sort((a, b) =>
          a.item_number.localeCompare(b.item_number, undefined, {
            numeric: true,
          })
        );
      setConfidentialItems(items);
    } catch (error) {
      message.error('Ошибка загрузки данных');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentRecord(null);
    form.resetFields();
    setShowModal(true);
  };

  const handleEdit = () => {
    if (selectedRowKeys.length !== 1) return;
    const record = records.find((r) => r.id === selectedRowKeys[0]);
    if (!record) return;
    setCurrentRecord(record);
    const pointsArray = record.confidential_points
      ? record.confidential_points
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s)
      : [];
    form.setFieldsValue({
      department_id: record.department_id,
      dolgnost_id: record.dolgnost_id,
      confidential_points: pointsArray,
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
        await PositionAccessService.delete(id);
      }
      setSelectedRowKeys([]);
      setShowDeleteModal(false);
      loadAll();
      message.success('Записи удалены');
    } catch {
      message.error('Ошибка при удалении');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setConfirmLoading(true);
    try {
      const payload = {
        department_id: values.department_id,
        dolgnost_id: values.dolgnost_id,
        confidential_points:
          values.confidential_points && values.confidential_points.length > 0
            ? values.confidential_points.join(', ')
            : '',
      };
      if (currentRecord) {
        await PositionAccessService.update(currentRecord.id, payload);
        message.success('Запись обновлена');
      } else {
        await PositionAccessService.create(payload);
        message.success('Запись создана');
      }
      setShowModal(false);
      loadAll();
      setSelectedRowKeys([]);
    } catch (error) {
      if (error.response?.data?.message)
        message.error(error.response.data.message);
      else message.error('Ошибка при сохранении');
    } finally {
      setConfirmLoading(false);
    }
  };

  const requestSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <SortAscendingOutlined style={{ marginLeft: 8 }} />
    ) : (
      <SortDescendingOutlined style={{ marginLeft: 8 }} />
    );
  };

  const sortedItems = useMemo(() => {
    if (!records.length) return [];
    const filtered = records.filter((rec) => {
      const deptName = rec.department?.description || '';
      const posName = rec.dolgnost?.dolgn || '';
      const points = rec.confidential_points || '';
      const search = searchTerm.toLowerCase();
      return (
        deptName.toLowerCase().includes(search) ||
        posName.toLowerCase().includes(search) ||
        points.toLowerCase().includes(search)
      );
    });
    if (!sortConfig.key) return filtered;
    return [...filtered].sort((a, b) => {
      let aVal = '',
        bVal = '';
      if (sortConfig.key === 'department.description') {
        aVal = a.department?.description || '';
        bVal = b.department?.description || '';
      } else if (sortConfig.key === 'dolgnost.dolgn') {
        aVal = a.dolgnost?.dolgn || '';
        bVal = b.dolgnost?.dolgn || '';
      } else {
        aVal = a[sortConfig.key] || '';
        bVal = b[sortConfig.key] || '';
      }
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();
      const comparison = aVal.localeCompare(bVal, 'ru', {
        sensitivity: 'base',
      });
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [records, searchTerm, sortConfig]);

  const columns = [
    {
      title: (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => requestSort('department.description')}
        >
          Отдел {getSortIcon('department.description')}
        </div>
      ),
      dataIndex: ['department', 'description'],
      key: 'department.description',
      width: '30%',
      render: (text, record) => record.department?.description || '-',
    },
    {
      title: (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => requestSort('dolgnost.dolgn')}
        >
          Должность {getSortIcon('dolgnost.dolgn')}
        </div>
      ),
      dataIndex: ['dolgnost', 'dolgn'],
      key: 'dolgnost.dolgn',
      width: '30%',
      render: (text, record) => record.dolgnost?.dolgn || '-',
    },
    {
      title: 'Пункты КТ',
      dataIndex: 'confidential_points',
      key: 'confidential_points',
      width: '40%',
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
          <Col style={{ display: 'flex', gap: 8 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
            >
              Добавить
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={handleEdit}
              disabled={selectedRowKeys.length !== 1}
            >
              Редактировать
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              disabled={selectedRowKeys.length === 0}
            >
              Удалить
            </Button>
          </Col>
          <Col flex="auto">
            <Search
              placeholder="Поиск по отделу, должности, пунктам"
              allowClear
              enterButton
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={setSearchTerm}
            />
          </Col>
          <Col>
            <Badge
              count={sortedItems.length}
              showZero
              style={{ backgroundColor: token.colorPrimary }}
            />
            <Text style={{ marginLeft: 8, color: token.colorTextSecondary }}>
              из {records.length}
            </Text>
          </Col>
        </Row>
      </Card>

      <Card className={styles.tableCard}>
        <div className={styles.userListScroll}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={sortedItems.map((item) => ({ ...item, key: item.id }))}
            loading={isLoading}
            pagination={false}
            size="middle"
          />
        </div>
      </Card>

      <Modal
        title={currentRecord ? 'Редактирование доступа' : 'Новый доступ'}
        open={showModal}
        onCancel={() => !confirmLoading && setShowModal(false)}
        footer={null}
        destroyOnClose
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Отдел"
            name="department_id"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Выберите отдел"
              disabled={confirmLoading}
              showSearch
              filterOption={(input, opt) => {
                const label = opt.props.children;
                const text =
                  typeof label === 'string' ? label : label?.toString() || '';
                return text.toLowerCase().includes(input.toLowerCase());
              }}
            >
              {departments.map((d) => (
                <Option key={d.id} value={d.id}>
                  {d.description} ({d.code})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Должность"
            name="dolgnost_id"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Выберите должность"
              disabled={confirmLoading}
              showSearch
              filterOption={(input, opt) => {
                const label = opt.props.children;
                const text =
                  typeof label === 'string' ? label : label?.toString() || '';
                return text.toLowerCase().includes(input.toLowerCase());
              }}
            >
              {positions.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.dolgn} ({p.dolgn_s})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Пункты конфиденциальной информации"
            name="confidential_points"
            tooltip="Выберите пункты из справочника"
          >
            <Select
              mode="multiple"
              placeholder="Выберите пункты КТ"
              disabled={confirmLoading}
              showSearch
              filterOption={(input, option) =>
                option?.label
                  ?.toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={confidentialItems.map((item) => ({
                value: item.item_number,
                label: `${item.item_number} - ${item.information_description?.substring(0, 80)}${item.information_description?.length > 80 ? '...' : ''}`,
              }))}
              style={{ width: '100%' }}
              maxTagCount="responsive"
            />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button
                onClick={() => setShowModal(false)}
                disabled={confirmLoading}
              >
                Отмена
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={confirmLoading}
                style={{ marginLeft: 8 }}
              >
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
        <p>Вы действительно хотите удалить выбранную запись?</p>
        <Alert
          message="Внимание!"
          description="Это действие нельзя отменить."
          type="warning"
          showIcon
        />
      </Modal>
    </div>
  );
});

export default StaffSpravPositionAccess;
