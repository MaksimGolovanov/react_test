// components/StaffSprav/StaffSpravConfidential.js
import React, { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Typography,
  Badge,
  message,
  theme,
  Select,
  Alert,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import ConfidentialService from '../../services/ConfidentialService';
import styles from './style.module.css';

const { Search } = Input;
const { TextArea } = Input;
const { Text } = Typography;
const { useToken } = theme;
const { Option } = Select;

const StaffSpravConfidential = observer(() => {
  const { token } = useToken();
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [sortConfig, setSortConfig] = useState({
    key: 'item_number',
    direction: 'asc',
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await ConfidentialService.fetchAll();
      setRecords(Array.isArray(data) ? data : []);
    } catch {
      message.error('Ошибка при загрузке конфиденциальной информации');
      setRecords([]);
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
    form.setFieldsValue({
      section_letter: record.section_letter || '',
      section_title: record.section_title || '',
      subsection_number: record.subsection_number,
      subsection_title: record.subsection_title || '',
      item_number: record.item_number || '',
      information_description: record.information_description || '',
      confidentiality_mark: record.confidentiality_mark || '',
      access_period: record.access_period || '',
      notes: record.notes || '',
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
        await ConfidentialService.delete(id);
      }
      setSelectedRowKeys([]);
      setShowDeleteModal(false);
      loadRecords();
      message.success('Записи успешно удалены');
    } catch {
      message.error('Ошибка при удалении записей');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setConfirmLoading(true);
    try {
      if (currentRecord) {
        await ConfidentialService.update(currentRecord.id, values);
        message.success('Запись успешно обновлена');
      } else {
        await ConfidentialService.create(values);
        message.success('Запись успешно создана');
      }
      setShowModal(false);
      loadRecords();
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
    if (!Array.isArray(records) || records.length === 0) return [];
    const filtered = records.filter(
      (rec) =>
        (rec.item_number &&
          rec.item_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rec.information_description &&
          rec.information_description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (rec.confidentiality_mark &&
          rec.confidentiality_mark
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (rec.access_period &&
          rec.access_period.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    if (!sortConfig.key) return filtered;
    return [...filtered].sort((a, b) => {
      const valueA = a[sortConfig.key]
        ? a[sortConfig.key].toString().toLowerCase()
        : '';
      const valueB = b[sortConfig.key]
        ? b[sortConfig.key].toString().toLowerCase()
        : '';
      const comparison = valueA.localeCompare(valueB, 'ru', {
        numeric: true,
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
          onClick={() => requestSort('item_number')}
        >
          № пункта {getSortIcon('item_number')}
        </div>
      ),
      dataIndex: 'item_number',
      key: 'item_number',
      width: '10%',
      render: (text) => text || '-',
    },
    {
      title: (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => requestSort('information_description')}
        >
          Описание информации {getSortIcon('information_description')}
        </div>
      ),
      dataIndex: 'information_description',
      key: 'information_description',
      width: '40%',
      render: (text) => text || '-',
    },
    {
      title: (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => requestSort('confidentiality_mark')}
        >
          Гриф {getSortIcon('confidentiality_mark')}
        </div>
      ),
      dataIndex: 'confidentiality_mark',
      key: 'confidentiality_mark',
      width: '15%',
      render: (text) => text || '-',
    },
    {
      title: (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => requestSort('access_period')}
        >
          Срок доступа {getSortIcon('access_period')}
        </div>
      ),
      dataIndex: 'access_period',
      key: 'access_period',
      width: '15%',
      render: (text) => text || '-',
    },
    {
      title: 'Примечание',
      dataIndex: 'notes',
      key: 'notes',
      width: '20%',
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              style={{ height: 32 }}
            >
              Добавить
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={handleEdit}
              disabled={selectedRowKeys.length !== 1}
              style={{ height: 32 }}
            >
              Редактировать
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              disabled={selectedRowKeys.length === 0}
              style={{ height: 32 }}
            >
              Удалить
            </Button>
          </Col>
          <Col flex="auto">
            <Search
              placeholder="Поиск по номеру пункта, описанию, грифу..."
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
              style={{
                backgroundColor: token.colorPrimary,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
            <Text
              style={{
                marginLeft: 8,
                display: 'inline-flex',
                alignItems: 'center',
                color: token.colorTextSecondary,
              }}
            >
              из {records.length}
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
            locale={{
              emptyText: searchTerm ? 'Ничего не найдено' : 'Нет данных',
            }}
            pagination={false}
            style={{ width: '100%' }}
            rowClassName={styles.tableRow}
          />
        </div>
      </Card>

      <Modal
        title={
          currentRecord ? 'Редактирование записи' : 'Добавление новой записи'
        }
        open={showModal}
        onCancel={() => !confirmLoading && setShowModal(false)}
        footer={null}
        destroyOnClose
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Буква раздела" name="section_letter">
                <Input
                  placeholder="A, Б"
                  disabled={confirmLoading}
                  maxLength={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Номер подраздела" name="subsection_number">
                <Input
                  type="number"
                  placeholder="1, 2, 3..."
                  disabled={confirmLoading}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Название раздела" name="section_title">
                <Input
                  placeholder="Информация, составляющая коммерческую тайну"
                  disabled={confirmLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Название подраздела" name="subsection_title">
                <Input
                  placeholder="Производственно-экономическая информация"
                  disabled={confirmLoading}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="№ пункта"
                name="item_number"
                rules={[{ required: true, message: 'Введите номер пункта' }]}
              >
                <Input placeholder="1.1, 2.3..." disabled={confirmLoading} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Гриф конфиденциальности"
                name="confidentiality_mark"
                rules={[{ required: true }]}
              >
                <Select placeholder="Выберите гриф" disabled={confirmLoading}>
                  <Option value="-">-</Option>
                  <Option value="коммерческая тайна">коммерческая тайна</Option>
                  <Option value="конфиденциально">конфиденциально</Option>
                  <Option value="для служебного пользования">
                    для служебного пользования
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Описание информации"
            name="information_description"
            rules={[{ required: true }]}
          >
            <TextArea
              rows={3}
              placeholder="Подробное описание..."
              disabled={confirmLoading}
            />
          </Form.Item>
          <Form.Item
            label="Срок действия ограничения"
            name="access_period"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="постоянно, 1 год, 5 лет, до даты..."
              disabled={confirmLoading}
            />
          </Form.Item>
          <Form.Item label="Примечание" name="notes">
            <TextArea
              rows={2}
              placeholder="Дополнительная информация..."
              disabled={confirmLoading}
            />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button
                onClick={() => setShowModal(false)}
                disabled={confirmLoading}
                style={{ marginRight: 8 }}
              >
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
          <p>Вы действительно хотите удалить выбранную запись?</p>
        ) : (
          <p>
            Вы действительно хотите удалить выбранные записи (
            {selectedRowKeys.length} шт.)?
          </p>
        )}
        <Alert
          message="Внимание!"
          description="Это действие нельзя отменить."
          type="warning"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Modal>
    </div>
  );
});

export default StaffSpravConfidential;
