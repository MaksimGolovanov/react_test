import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  List,
  Card,
  Typography,
  Space,
  message,
  Upload,
  Form,
  Input,
  Switch,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import BackgroundService from '../services/BackgroundService';
import styles from '../styles/Gramota.module.css';

const { Text } = Typography;

const BackgroundManagerModal = ({ visible, onClose, onSelect, selectedId }) => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentBackground, setCurrentBackground] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [uploadLoading, setUploadLoading] = useState(false);

  const loadBackgrounds = async () => {
    setLoading(true);
    try {
      const data = await BackgroundService.fetchAll();
      setBackgrounds(data);
    } catch {
      message.error('Ошибка загрузки фонов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadBackgrounds();
    }
  }, [visible]);

  const handleUpload = async (values) => {
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('background', values.file.file);
      formData.append('name', values.name);
      formData.append('description', values.description || '');
      formData.append('isActive', values.isActive ? 'true' : 'false');

      await BackgroundService.upload(formData);
      message.success('Фон загружен');
      setUploadModalVisible(false);
      form.resetFields();
      loadBackgrounds();
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка загрузки');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleEdit = async (values) => {
    try {
      await BackgroundService.update(currentBackground.id, values);
      message.success('Фон обновлён');
      setEditModalVisible(false);
      editForm.resetFields();
      loadBackgrounds();
    } catch {
      message.error('Ошибка обновления');
    }
  };

  const handleDelete = async (id) => {
    try {
      await BackgroundService.delete(id);
      message.success('Фон удалён');
      loadBackgrounds();
    } catch {
      message.error('Ошибка удаления');
    }
  };

  const openEditModal = (bg) => {
    setCurrentBackground(bg);
    editForm.setFieldsValue({
      name: bg.name,
      description: bg.description,
      isActive: bg.isActive,
    });
    setEditModalVisible(true);
  };

  const handleSelect = (bg) => {
    onSelect(bg);
    onClose();
  };

  const renderItem = (bg) => {
    const isActive = bg.isActive;
    const isSelected = selectedId === bg.id;
    const imageUrl = `${process.env.REACT_APP_API_URL}static/backgrounds/${bg.filename}`;

    return (
      <Card
        hoverable
        className={styles.bgCardCompact}
        style={{
          border: isSelected ? '2px solid #1890ff' : '1px solid #e8e8e8',
          borderRadius: 6,
        }}
        onClick={() => handleSelect(bg)}
        cover={
          <div className={styles.bgImageWrapperCompact}>
            <img alt={bg.name} src={imageUrl} className={styles.bgImageCompact} />
          </div>
        }
        bodyStyle={{ padding: '8px 10px' }}
      >
        <div className={styles.bgCardContentCompact}>
          <Text strong className={styles.bgCardTitleCompact}>
            {bg.name}
          </Text>
          <Text type="secondary" className={styles.bgCardDescCompact}>
            {bg.description || 'Без описания'}
          </Text>
          <div className={styles.bgCardActionsCompact}>
            {isActive && <CheckOutlined style={{ color: '#52c41a', fontSize: 12 }} />}
            <Space size={2}>
              <Button
                size="small"
                icon={<EditOutlined style={{ fontSize: 12 }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(bg);
                }}
                style={{ padding: '0 4px', height: 22 }}
              />
              <Popconfirm
                title="Удалить фон?"
                onConfirm={(e) => {
                  e.stopPropagation();
                  handleDelete(bg.id);
                }}
                onCancel={(e) => e.stopPropagation()}
                okText="Да"
                cancelText="Нет"
              >
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined style={{ fontSize: 12 }} />}
                  onClick={(e) => e.stopPropagation()}
                  style={{ padding: '0 4px', height: 22 }}
                />
              </Popconfirm>
            </Space>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <Modal
        title="Управление фонами"
        open={visible}
        onCancel={onClose}
        footer={null}
        width="92%"
        style={{ maxWidth: 1300 }}
        styles={{
          body: {
            maxHeight: '80vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '12px 16px',
          },
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setUploadModalVisible(true)}
            size="small"
          >
            Загрузить новый фон
          </Button>
        </div>
        <List
          grid={{
            gutter: 12,
            xs: 2,
            sm: 3,
            md: 4,
            lg: 5,
            xl: 6,
            xxl: 7,
          }}
          dataSource={backgrounds}
          loading={loading}
          renderItem={renderItem}
        />
      </Modal>

      {/* Модалка загрузки – без изменений */}
      <Modal
        title="Загрузка нового фона"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Активный" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            label="Файл"
            name="file"
            rules={[{ required: true, message: 'Выберите изображение' }]}
          >
            <Upload beforeUpload={() => false} accept="image/*" maxCount={1}>
              <Button icon={<UploadOutlined />}>Выбрать файл</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={uploadLoading}>
              Загрузить
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Модалка редактирования */}
      <Modal
        title="Редактирование фона"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEdit}>
          <Form.Item label="Название" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Активный" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BackgroundManagerModal;