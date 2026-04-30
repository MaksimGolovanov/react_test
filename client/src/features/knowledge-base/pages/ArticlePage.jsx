// src/pages/ArticlePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Spin,
  message,
  Typography,
  Tag,
  Space,
  Breadcrumb,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  CalendarOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import KnowledgeStore from '../store/KnowledgeStore';
import styles from './ArticlePage.module.css';

const { Title, Text } = Typography;

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await KnowledgeStore.fetchArticle(id);
        setArticle(data);
      } catch (error) {
        message.error('Статья не найдена');
        navigate('/knowledge');
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id, navigate]);

  if (loading) return <Spin size="large" className={styles.spinner} />;
  if (!article) return null;

  // Формируем цепочку категорий
  const categoryChain = [];
  const cat = article.category || article.klm_category;
  if (cat) {
    if (cat.parent) categoryChain.push(cat.parent.name);
    categoryChain.push(cat.name);
  }
  const categoryPath = categoryChain.join(' / ') || 'Без категории';

  // Для тега используем только конечную категорию
  const leafCategory = cat?.name || 'Без категории';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/knowledge')}>
          Назад
        </Button>
        <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/knowledge/edit/${article.id}`)}>
          Редактировать
        </Button>
      </div>

      <div className={styles.content}>
        <Breadcrumb
          items={[
            { title: 'База знаний' },
            ...categoryChain.map(catName => ({ title: catName }))
          ]}
        />

        <Title level={1} className={styles.title}>
          {article.title}
        </Title>

        <div className={styles.meta}>
          <Space size="middle">
            <Space size="small">
              <CalendarOutlined />
              <Text type="secondary">
                {format(new Date(article.created_at), 'dd MMMM yyyy', { locale: ru })}
              </Text>
            </Space>
            {cat && (
              <Space size="small">
                <FolderOutlined />
                <Tag color="blue">{leafCategory}</Tag>
              </Space>
            )}
          </Space>
          <div className={styles.tags}>
            {article.tags?.map((tag) => (
              <Tag key={tag} color="geekblue">
                {tag}
              </Tag>
            ))}
          </div>
        </div>

        <div className={styles.body} dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </div>
  );
};

export default ArticlePage;