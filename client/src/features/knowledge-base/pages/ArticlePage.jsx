// src/features/knowledge-base/pages/ArticlePage.jsx
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
  theme,
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
const { useToken } = theme;

const ArticlePage = () => {
  const { token } = useToken();
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функция для очистки HTML от inline-стилей цвета
  const sanitizeHtmlContent = (html) => {
    if (!html) return '';
    // Удаляем атрибуты style, содержащие color или background-color
    // Или заменяем только нужные свойства
    return html.replace(/style="([^"]*?)"/gi, (match, styles) => {
      // Удаляем свойства color и background-color
      const cleaned = styles
        .replace(/(color|background-color):\s*[^;]+;?/gi, '')
        .trim();
      if (cleaned === '') return '';
      return `style="${cleaned}"`;
    });
  };

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

  const categoryChain = [];
  const cat = article.category || article.klm_category;
  if (cat) {
    if (cat.parent) categoryChain.push(cat.parent.name);
    categoryChain.push(cat.name);
  }
  const leafCategory = cat?.name || 'Без категории';

  const cleanContent = sanitizeHtmlContent(article.content);

  return (
    <div className={styles.container} >
      <div className={styles.header}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/knowledge')}>
          Назад
        </Button>
        <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/knowledge/edit/${article.id}`)}>
          Редактировать
        </Button>
      </div>

      <div className={styles.content} style={{ background: token.colorBgContainer, borderColor: token.colorBorder }}>
        <Breadcrumb
          items={[
            { title: 'База знаний' },
            ...categoryChain.map(catName => ({ title: catName }))
          ]}
        />

        <Title level={1} className={styles.title} style={{ color: token.colorText }}>
          {article.title}
        </Title>

        <div className={styles.meta} style={{ borderBottomColor: token.colorBorder }}>
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

        {/* Контент статьи с очищенными стилями цвета */}
        <div 
          className={styles.body} 
          style={{ color: token.colorText }}
          dangerouslySetInnerHTML={{ __html: cleanContent }} 
        />
      </div>
    </div>
  );
};

export default ArticlePage;