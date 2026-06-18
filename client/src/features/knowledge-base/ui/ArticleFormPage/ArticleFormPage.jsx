import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Row,
  Col,
  Space,
  Spin,
  theme,
} from 'antd';
import {
  SaveOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import QuillField from '../QuillField';
import KnowledgeStore from '../../store/KnowledgeStore';
import { CONTENT_TYPES } from '../../constants';
import styles from './ArticleFormPage.module.css';

const { TextArea } = Input;
const { Option } = Select;
const { useToken } = theme;

const ArticleFormPage = () => {
  const { token } = useToken();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allTagsList, setAllTagsList] = useState([]);

  const isEdit = !!id;

  const loadCategories = useCallback(async () => {
    try {
      await KnowledgeStore.fetchCategories();
      setCategories(KnowledgeStore.categories || []);
    } catch (error) {
      console.error('Ошибка загрузки категорий', error);
      setCategories([]);
    }
  }, []);

  const loadArticle = useCallback(async () => {
    setLoading(true);
    try {
      const article = await KnowledgeStore.fetchArticle(id);
      form.setFieldsValue({
        title: article.title,
        description: article.description,
        category_id: article.category_id,
        content_type: article.content_type,
        content: article.content,
        tags: article.tags || [],
      });
    } catch (error) {
      message.error('Ошибка загрузки статьи');
    } finally {
      setLoading(false);
    }
  }, [id, form]);

  useEffect(() => {
    loadCategories();
    if (isEdit) {
      loadArticle();
    }
  }, [isEdit, loadCategories, loadArticle]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        await KnowledgeStore.fetchAllTags();
        setAllTagsList(KnowledgeStore.allTags || []);
      } catch (error) {
        console.error('Ошибка загрузки тегов:', error);
      }
    };
    loadTags();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await KnowledgeStore.updateArticle(id, values);
        message.success('Статья обновлена');
      } else {
        await KnowledgeStore.createArticle(values);
        message.success('Статья создана');
      }
      navigate('/knowledge');
    } catch (error) {
      if (error.response?.status === 400) {
        const msg = error.response?.data?.message || error.message;
        message.error(msg);
      } else {
        message.error('Ошибка сохранения');
      }
    }
  };

  if (loading) return <Spin size="large" className={styles.spinner} />;

  return (
    <div className={styles.container} style={{ backgroundColor: token.colorBgLayout }}>
      <div className={styles.card} style={{ background: token.colorBgContainer }}>
        <div className={styles.cardHeader} style={{ borderBottomColor: token.colorBorder }}>
          <div className={styles.cardTitle} style={{ color: token.colorText }}>
            {isEdit ? 'Редактирование статьи' : 'Создание новой статьи'}
          </div>
          <Space>
            <Button icon={<RollbackOutlined />} onClick={() => navigate('/knowledge')}>
              Отмена
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()}>
              Сохранить
            </Button>
          </Space>
        </div>
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={handleSubmit}
          className={styles.horizontalForm}
        >
          <Form.Item
            label="Заголовок"
            name="title"
            rules={[{ required: true, message: 'Введите заголовок' }]}
            className={styles.formItemCompact}
          >
            <Input placeholder="Заголовок статьи" />
          </Form.Item>

          <Form.Item label="Категория / Тип" className={styles.formItemCompact}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="category_id" noStyle>
                  <Select placeholder="Выберите категорию" allowClear>
                    {categories.map((cat) => (
                      <Option key={cat.id} value={cat.id}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="content_type" noStyle>
                  <Select>
                    {CONTENT_TYPES.map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label="Описание"
            name="description"
            className={styles.formItemCompact}
          >
            <TextArea
              rows={2}
              placeholder="Краткое описание статьи"
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Теги"
            name="tags"
            className={styles.formItemCompact}
          >
            <Select
              mode="tags"
              placeholder="Выберите или введите теги"
              options={allTagsList.map((tag) => ({
                label: tag.name,
                value: tag.name,
              }))}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Содержание"
            name="content"
            className={styles.editorItem}
          >
            <QuillField
              name="content"
              required={false}
              initialValue={form.getFieldValue('content')}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ArticleFormPage;