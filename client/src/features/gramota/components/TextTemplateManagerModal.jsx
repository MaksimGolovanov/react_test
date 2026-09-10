import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  List,
  Card,
  Typography,
  Space,
  message,
  Form,
  Input,
  Switch,
  Popconfirm,
  Tag,
  Select,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import GramotaTextService from '../services/GramotaTemplateService';
import TemplateBuilder from './TemplateBuilder';
import styles from '../styles/Gramota.module.css';

const { Text } = Typography;
const { TextArea } = Input;

const GRAMOTA_TYPES = [
  'ГРАМОТА',
  'ПОЧЕТНАЯ ГРАМОТА',
  'БЛАГОДАРНОСТЬ',
  'БЛАГОДАРСТВЕННОЕ ПИСЬМО',
];

const TextTemplateManagerModal = ({
  visible,
  onClose,
  onSelect,
  selectedId,
  onUpdate,
  backgroundImage,
  onLayoutSaved,
  approver,
  signer,
}) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [builderVisible, setBuilderVisible] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await GramotaTextService.fetchAll();
      setTemplates(data);
    } catch {
      message.error('Ошибка загрузки шаблонов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) loadTemplates();
  }, [visible]);

  const handleCreate = async (values) => {
    const payload = {
      name: values.name.trim(),
      description: values.description ? values.description.trim() : '',
      text: values.text.trim(),
      isActive: values.isActive || false,
      layout: values.layout || null,
      gramotaType: values.gramotaType || 'ПОЧЕТНАЯ ГРАМОТА',
    };
    if (!payload.name || !payload.text) {
      message.error('Имя и текст шаблона обязательны');
      return;
    }
    setSubmitLoading(true);
    try {
      await GramotaTextService.create(payload);
      message.success('Шаблон создан');
      setModalVisible(false);
      form.resetFields();
      loadTemplates();
      if (onUpdate) onUpdate();
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка создания');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = async (values) => {
    const payload = {
      name: values.name.trim(),
      description: values.description ? values.description.trim() : '',
      text: values.text.trim(),
      isActive: values.isActive || false,
      layout: values.layout || null, // <-- добавлено
      gramotaType: values.gramotaType || 'ПОЧЕТНАЯ ГРАМОТА',
    };
    if (!payload.name || !payload.text) {
      message.error('Имя и текст шаблона обязательны');
      return;
    }
    setSubmitLoading(true);
    try {
      await GramotaTextService.update(currentTemplate.id, payload);
      message.success('Шаблон обновлён');
      setEditModalVisible(false);
      editForm.resetFields();
      loadTemplates();
      if (onUpdate) onUpdate();
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка обновления');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await GramotaTextService.delete(id);
      message.success('Шаблон удалён');
      loadTemplates();
      if (onUpdate) onUpdate();
    } catch {
      message.error('Ошибка удаления');
    }
  };

  const openEditModal = (template) => {
    setCurrentTemplate(template);
    editForm.setFieldsValue({
      name: template.name,
      description: template.description,
      text: template.text,
      isActive: template.isActive,
      gramotaType: template.gramotaType || 'ПОЧЕТНАЯ ГРАМОТА',
      layout: template.layout || null, // <-- добавлено
    });
    setEditModalVisible(true);
  };

  const handleSelect = (template) => {
    onSelect(template);
    onClose();
  };

  const openBuilder = (template) => {
    setCurrentTemplate(template);
    setBuilderVisible(true);
  };

  const saveLayout = (layout) => {
    if (currentTemplate) {
      GramotaTextService.update(currentTemplate.id, {
        layout,
        gramotaType: currentTemplate.gramotaType || 'ПОЧЕТНАЯ ГРАМОТА',
      })
        .then(() => {
          message.success('Макет сохранён');
          loadTemplates();
          if (onUpdate) onUpdate();
          if (onLayoutSaved) onLayoutSaved(currentTemplate.id, layout);
          // Обновить форму редактирования, если она открыта
          if (editModalVisible) {
            editForm.setFieldsValue({ layout });
          }
        })
        .catch(() => message.error('Ошибка сохранения макета'));
    } else {
      form.setFieldsValue({ layout });
      message.success('Макет добавлен к шаблону');
    }
    setBuilderVisible(false);
  };

  const renderItem = (template) => {
    const isActive = template.isActive;
    const isSelected = selectedId === template.id;

    return (
      <Card
        hoverable
        className={styles.templateCardCompact}
        style={{
          border: isSelected ? '2px solid #1890ff' : '1px solid #e8e8e8',
          borderRadius: 6,
        }}
        onClick={() => handleSelect(template)}
      >
        <div className={styles.templateContentCompact}>
          <div className={styles.templateHeaderCompact}>
            <Text strong className={styles.templateTitleCompact}>
              {template.name}
            </Text>
            {isActive && <Tag color="green">Активен</Tag>}
          </div>
          <Text type="secondary" className={styles.templateDescCompact}>
            {template.description || 'Без описания'}
          </Text>
          <div className={styles.templatePreviewCompact}>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {template.text && template.text.length > 100
                ? template.text.substring(0, 100) + '...'
                : template.text}
            </Text>
          </div>
          <div style={{ marginTop: 4 }}>
            <Tag color="blue">{template.gramotaType || 'ПОЧЕТНАЯ ГРАМОТА'}</Tag>
          </div>
          <div className={styles.templateActionsCompact}>
            <Space size={4}>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(template);
                }}
              >
                Редактировать
              </Button>
              <Button
                size="small"
                icon={<AppstoreOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  openBuilder(template);
                }}
              >
                Макет
              </Button>
              <Popconfirm
                title="Удалить шаблон?"
                onConfirm={(e) => {
                  e.stopPropagation();
                  handleDelete(template.id);
                }}
                onCancel={(e) => e.stopPropagation()}
                okText="Да"
                cancelText="Нет"
              >
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => e.stopPropagation()}
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
        title="Управление шаблонами текстов"
        open={visible}
        onCancel={onClose}
        footer={null}
        width="80%"
        style={{ maxWidth: 900 }}
        styles={{
          body: {
            maxHeight: '80vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '16px 24px',
          },
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Создать шаблон
          </Button>
        </div>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
          }}
          dataSource={templates}
          loading={loading}
          renderItem={renderItem}
        />
      </Modal>

      <Modal
        title="Создание шаблона"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          validateTrigger="onSubmit"
        >
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: 'Введите название шаблона' }]}
          >
            <Input placeholder="Например: Грамота за I место" />
          </Form.Item>
          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={2} placeholder="Необязательное описание" />
          </Form.Item>
          <Form.Item
            label="Текст шаблона"
            name="text"
            rules={[{ required: true, message: 'Введите текст шаблона' }]}
          >
            <TextArea rows={4} placeholder="Введите текст с переменными..." />
          </Form.Item>
          <Form.Item
            label="Тип грамоты"
            name="gramotaType"
            initialValue="ПОЧЕТНАЯ ГРАМОТА"
          >
            <Select>
              {GRAMOTA_TYPES.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Активный" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Макет (необязательно)" name="layout">
            <Button
              icon={<AppstoreOutlined />}
              onClick={() => {
                setCurrentTemplate(null);
                setBuilderVisible(true);
              }}
            >
              Открыть конструктор макета
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Создать
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Редактирование шаблона"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEdit}
          validateTrigger="onSubmit"
        >
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: 'Введите название шаблона' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            label="Текст шаблона"
            name="text"
            rules={[{ required: true, message: 'Введите текст шаблона' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Тип грамоты" name="gramotaType">
            <Select>
              {GRAMOTA_TYPES.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Активный" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>

          {/* ДОБАВЛЕНЫ ПОЛЯ ДЛЯ МАКЕТА */}
          <Form.Item label="Макет" name="layout" hidden>
            <Input />
          </Form.Item>
          <Form.Item label=" ">
            <Button
              icon={<AppstoreOutlined />}
              onClick={() => {
                // Открываем конструктор с текущим шаблоном
                setCurrentTemplate({
                  ...currentTemplate,
                  layout: editForm.getFieldValue('layout') || currentTemplate?.layout,
                });
                setBuilderVisible(true);
              }}
            >
              Открыть конструктор макета
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <TemplateBuilder
        visible={builderVisible}
        onClose={() => setBuilderVisible(false)}
        initialLayout={
          currentTemplate?.layout || form.getFieldValue('layout') || null
        }
        onSave={saveLayout}
        backgroundImage={backgroundImage}
        previewText={currentTemplate?.text || form.getFieldValue('text') || ''}
        approver={approver}
        signer={signer}
        gramotaType={
          currentTemplate?.gramotaType ||
          form.getFieldValue('gramotaType') ||
          'ПОЧЕТНАЯ ГРАМОТА'
        }
      />
    </>
  );
};

export default TextTemplateManagerModal;