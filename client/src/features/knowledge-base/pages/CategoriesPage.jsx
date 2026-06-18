import React, { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Typography,
  theme,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import KnowledgeStore from '../store/KnowledgeStore';
import styles from './CategoriesPage.module.css';

const { Title } = Typography;
const { Option } = Select;
const { useToken } = theme;

const CategoriesPage = observer(() => {
  const { token } = useToken();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    await KnowledgeStore.fetchCategories();
    setCategories(KnowledgeStore.categories || []);
    setLoading(false);
  };

  const filteredCategories = useMemo(() => {
    if (!searchText) return categories;
    const lower = searchText.toLowerCase();
    return categories.filter((cat) => cat.name.toLowerCase().includes(lower));
  }, [categories, searchText]);

  const getTreeData = (items, parentId = null) => {
    return items
      .filter((item) => item.parent_id === parentId)
      .map((item) => ({
        ...item,
        key: item.id,
        children: getTreeData(items, item.id),
      }));
  };

  const treeData = useMemo(
    () => getTreeData(filteredCategories, null),
    [filteredCategories]
  );

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
      parent_id: record.parent_id,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await KnowledgeStore.deleteCategory(id);
      message.success('Категория удалена');
      loadCategories();
    } catch (error) {
      message.error('Ошибка удаления');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await KnowledgeStore.updateCategory(editingCategory.id, values);
        message.success('Категория обновлена');
      } else {
        await KnowledgeStore.createCategory(values);
        message.success('Категория создана');
      }
      setModalVisible(false);
      loadCategories();
    } catch (error) {
      message.error('Ошибка сохранения');
    }
  };

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className={styles.categoryName}>
          <span>{text}</span>
          {record.parent_id === null && (
            <span className={styles.rootBadge} style={{ background: token.colorPrimaryBg, color: token.colorPrimary }}>
              Корневая
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Родительская категория',
      dataIndex: 'parent_id',
      key: 'parent_id',
      render: (parentId) => {
        if (!parentId) return <span className={styles.noParent} style={{ color: token.colorTextSecondary }}>—</span>;
        const parent = categories.find((c) => c.id === parentId);
        return parent?.name || '—';
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Удалить категорию?" onConfirm={() => handleDelete(record.id)} okText="Да" cancelText="Нет">
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container} style={{ backgroundColor: token.colorBgLayout }}>
      <div className={styles.card} style={{ background: token.colorBgContainer, boxShadow: token.boxShadow }}>
        <div className={styles.header}>
          <div className={styles.leftGroup}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/knowledge')}>
              Назад к статьям
            </Button>
            <Title level={3} className={styles.title} style={{ color: token.colorText }}>
              Управление категориями
            </Title>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Добавить категорию
          </Button>
        </div>

        <div className={styles.searchBar}>
          <Input
            placeholder="Поиск категорий..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={treeData}
          loading={loading}
          rowKey="id"
          expandable={{
            childrenColumnName: 'children',
            expandRowByClick: true,
          }}
          pagination={false}
          className={styles.table}
        />
      </div>

      <Modal
        title={editingCategory ? 'Редактировать категорию' : 'Новая категория'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="Сохранить"
        cancelText="Отмена"
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input placeholder="Например, Frontend" autoFocus />
          </Form.Item>
          <Form.Item name="parent_id" label="Родительская категория">
            <Select allowClear placeholder="Нет (корневая)">
              {categories
                .filter((cat) => cat.id !== editingCategory?.id)
                .map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default CategoriesPage;