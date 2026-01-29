import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Typography,
  Tag,
  Space,
  Button,
  Card,
  Row,
  Col,
  Avatar,
  Divider,
  Breadcrumb,
  Statistic,
  Tooltip,
  Alert,
  Tabs,
  Input,
  Rate,
  message,
} from 'antd';
import {
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  TagOutlined,
  FolderOutlined,
  EditOutlined,
  LikeOutlined,
  DislikeOutlined,
  StarOutlined,
  MessageOutlined,
  ShareAltOutlined,
  BookOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CopyOutlined,
  LikeFilled,
  DislikeFilled,
  CloseOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './KnowledgeViewer.module.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

// Кастомный компонент комментария
const CustomComment = ({
  author,
  avatar,
  content,
  datetime,
  likes,
  onLike,
}) => (
  <div className={styles.commentItem}>
    <div className={styles.commentHeader}>
      <Avatar size="small">{avatar}</Avatar>
      <div className={styles.commentMeta}>
        <Text strong>{author}</Text>
        <Text type="secondary">{datetime}</Text>
      </div>
    </div>
    <div className={styles.commentContent}>
      <Paragraph>{content}</Paragraph>
    </div>
    <div className={styles.commentActions}>
      <Button type="text" size="small" icon={<LikeOutlined />} onClick={onLike}>
        {likes}
      </Button>
      <Button type="text" size="small" icon={<MessageOutlined />}>
        Ответить
      </Button>
    </div>
  </div>
);

const KnowledgeViewer = ({
  article,
  visible,
  onClose,
  onEdit,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const contentRef = useRef(null);
  const commentsRef = useRef(null);

  useEffect(() => {
    if (article) {
      loadComments();
      loadUserRating();
    }
  }, [article]);

  useEffect(() => {
    // Сброс прокрутки при смене вкладки
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    if (commentsRef.current) {
      commentsRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const loadComments = () => {
    const mockComments = [
      {
        id: 1,
        author: 'Алексей Петров',
        avatar: 'AP',
        content:
          'Отличная статья! Очень подробно и понятно объяснены основы React.',
        datetime: '2 дня назад',
        likes: 5,
      },
      {
        id: 2,
        author: 'Мария Иванова',
        avatar: 'МИ',
        content:
          'Спасибо за статью! Есть вопрос по использованию useCallback в больших проектах.',
        datetime: '3 дня назад',
        likes: 3,
      },
      {
        id: 3,
        author: 'Сергей Смирнов',
        avatar: 'СС',
        content:
          'Не согласен с пунктом про использование useMemo, в большинстве случаев он не нужен.',
        datetime: 'неделю назад',
        likes: 1,
      },
    ];
    setComments(mockComments);
  };

  const loadUserRating = () => {
    setRating(article?.rating || 0);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: comments.length + 1,
      author: 'Текущий пользователь',
      avatar: 'ВЫ',
      content: newComment,
      datetime: 'только что',
      likes: 0,
    };

    setComments([newCommentObj, ...comments]);
    setNewComment('');
  };

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
    } else {
      setIsLiked(true);
      setIsDisliked(false);
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);
      setIsLiked(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/knowledge-base/article/${article?.slug || article?.id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopySuccess('Ссылка скопирована!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch((err) => {
        setCopySuccess('Ошибка копирования');
        console.error('Ошибка копирования:', err);
      });
  };

  const handleCopyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        message.success('Код скопирован');
      })
      .catch((err) => {
        console.error('Ошибка копирования:', err);
        message.error('Не удалось скопировать код');
      });
  };

  const renderMarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');

      if (!inline && match) {
        const codeString = String(children).replace(/\n$/, '');
        return (
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span>{match[1]}</span>
              <Button
                size="small"
                type="text"
                icon={<CopyOutlined />}
                onClick={() => handleCopyCode(codeString)}
              >
                Копировать
              </Button>
            </div>
            <pre className={styles.codeContent}>
              <code className={`language-${match[1]}`}>{children}</code>
            </pre>
          </div>
        );
      }

      return (
        <code className={styles.inlineCode} {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <Title level={2} className={styles.markdownHeading}>
        {children}
      </Title>
    ),
    h2: ({ children }) => (
      <Title level={3} className={styles.markdownHeading}>
        {children}
      </Title>
    ),
    h3: ({ children }) => (
      <Title level={4} className={styles.markdownHeading}>
        {children}
      </Title>
    ),
    blockquote: ({ children }) => (
      <blockquote className={styles.blockquote}>{children}</blockquote>
    ),
    table: ({ children }) => (
      <div className={styles.tableWrapper}>
        <table className={styles.table}>{children}</table>
      </div>
    ),
    ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
    ol: ({ children }) => <ol className={styles.list}>{children}</ol>,
    img: ({ src, alt }) => (
      <div className={styles.imageContainer}>
        <img src={src} alt={alt} className={styles.markdownImage} />
        {alt && <div className={styles.imageCaption}>{alt}</div>}
      </div>
    ),
  };

  if (!article) return null;

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      width="90%"
      style={{ top: 20 }}
      footer={null}
      className={styles.viewerModal}
      destroyOnClose
      closeIcon={<CloseOutlined />}
      styles={{
        body: {
          padding: 0,
          overflow: 'hidden',
        },
        content: {
          padding: 0,
        },
      }}
    >
      <div className={styles.viewerContainer}>
        {/* Навигация */}
        <div className={styles.navigation}>
          <div className={styles.navLeft}>
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={onPrevious}
                disabled={!hasPrevious}
                size="middle"
              >
                Предыдущая
              </Button>
              <Button
                icon={<ArrowRightOutlined />}
                onClick={onNext}
                disabled={!hasNext}
                size="middle"
              >
                Следующая
              </Button>
            </Space>
          </div>

          <div className={styles.navRight}>
            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={() => onEdit(article)}
                size="middle"
              >
                Редактировать
              </Button>
              <Button
                icon={<ShareAltOutlined />}
                onClick={handleCopyLink}
                size="middle"
                className={styles.shareButton}
              >
                Поделиться
              </Button>
              {copySuccess && (
                <Alert
                  message={copySuccess}
                  type="success"
                  showIcon
                  banner
                  className={styles.copyAlert}
                />
              )}
            </Space>
          </div>
        </div>

        {/* Заголовок и метаданные */}
        <Card className={styles.headerCard}>
          <Breadcrumb
            items={[
              { title: 'База знаний' },
              { title: article.category?.name || 'Без категории' },
              { title: article.title },
            ]}
            className={styles.breadcrumb}
          />

          <Title level={1} className={styles.articleTitle}>
            {article.title}
            {article.featured && (
              <Tooltip title="Рекомендованная статья">
                <StarOutlined className={styles.featuredIcon} />
              </Tooltip>
            )}
          </Title>

          <div className={styles.metaInfo}>
            <Space size="large" wrap>
              <Space className={styles.metaItem}>
                <Avatar size="small" icon={<UserOutlined />} />
                <Text strong>{article.author || 'Неизвестный автор'}</Text>
              </Space>

              <Space className={styles.metaItem}>
                <CalendarOutlined />
                <Text>
                  {format(new Date(article.created_at), 'dd MMMM yyyy', {
                    locale: ru,
                  })}
                </Text>
              </Space>

              <Space className={styles.metaItem}>
                <EyeOutlined />
                <Text>{article.views || 0} просмотров</Text>
              </Space>

              {article.category && (
                <Space className={styles.metaItem}>
                  <FolderOutlined />
                  <Tag color="blue">{article.category.name}</Tag>
                </Space>
              )}
            </Space>
          </div>

          <div className={styles.tagsSection}>
            <Space wrap>
              {article.tags?.map((tag, index) => (
                <Tag
                  key={index}
                  icon={<TagOutlined />}
                  color="geekblue"
                  className={styles.tag}
                >
                  {tag}
                </Tag>
              ))}
            </Space>
          </div>

          {article.description && (
            <Alert
              message={article.description}
              type="info"
              showIcon
              className={styles.descriptionAlert}
            />
          )}
        </Card>

        {/* Основной контент */}
        <div className={styles.scrollContent}>
          <div className={styles.tabsContainer}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className={styles.contentTabs}
              tabBarStyle={{ margin: 0 }}
            >
              <TabPane tab="Содержание" key="content">
                <div className={styles.tabContent}>
                  <Card className={styles.contentCard}>
                    <div className={styles.markdownContent} ref={contentRef}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={renderMarkdownComponents}
                      >
                        {article.content}
                      </ReactMarkdown>
                    </div>

                    <Divider className={styles.contentDivider} />

                    {/* Действия */}
                    <div className={styles.actions}>
                      <Space wrap>
                        <Button
                          type={isLiked ? 'primary' : 'default'}
                          icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
                          onClick={handleLike}
                          size="middle"
                        >
                          Полезно ({article.likes || 0})
                        </Button>
                        <Button
                          type={isDisliked ? 'primary' : 'default'}
                          icon={
                            isDisliked ? <DislikeFilled /> : <DislikeOutlined />
                          }
                          onClick={handleDislike}
                          size="middle"
                        >
                          Не полезно
                        </Button>
                        <Rate
                          value={rating}
                          onChange={setRating}
                          character={<StarOutlined />}
                          style={{ marginLeft: '8px' }}
                        />
                        <Text>{article.rating?.toFixed(1) || '0.0'}</Text>
                      </Space>
                    </div>
                  </Card>
                </div>
              </TabPane>

              <TabPane tab="Комментарии" key="comments">
                <div className={styles.tabContent}>
                  <Card className={styles.commentsCard}>
                    <div className={styles.newComment}>
                      <Avatar
                        size="large"
                        icon={<UserOutlined />}
                        className={styles.commentAvatar}
                      />
                      <div className={styles.commentInput}>
                        <TextArea
                          rows={3}
                          placeholder="Оставьте ваш комментарий..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className={styles.commentTextarea}
                        />
                        <Button
                          type="primary"
                          onClick={handleAddComment}
                          className={styles.commentSubmit}
                        >
                          Отправить
                        </Button>
                      </div>
                    </div>

                    <Divider className={styles.commentsDivider} />

                    <div className={styles.commentsHeader}>
                      <Title level={4}>{comments.length} комментариев</Title>
                    </div>

                    <div className={styles.commentsList} ref={commentsRef}>
                      {comments.map((comment) => (
                        <CustomComment
                          key={comment.id}
                          author={comment.author}
                          avatar={comment.avatar}
                          content={comment.content}
                          datetime={comment.datetime}
                          likes={comment.likes}
                          onLike={() => console.log('Like comment', comment.id)}
                        />
                      ))}
                    </div>
                  </Card>
                </div>
              </TabPane>

              <TabPane tab="Информация" key="info">
                <div className={styles.tabContent}>
                  <Row gutter={[16, 16]} className={styles.infoRow}>
                    <Col xs={24} sm={12}>
                      <Card
                        title="Статистика"
                        size="small"
                        className={styles.infoCard}
                      >
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Statistic
                            title="Просмотры"
                            value={article.views || 0}
                            prefix={<EyeOutlined />}
                            className={styles.statistic}
                          />
                          <Statistic
                            title="Рейтинг"
                            value={article.rating?.toFixed(1) || '0.0'}
                            prefix={<StarOutlined />}
                            suffix="/ 5"
                            className={styles.statistic}
                          />
                          <Statistic
                            title="Комментарии"
                            value={comments.length}
                            prefix={<MessageOutlined />}
                            className={styles.statistic}
                          />
                        </Space>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Card
                        title="Метаданные"
                        size="small"
                        className={styles.infoCard}
                      >
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div className={styles.metadataItem}>
                            <Text strong>Статус: </Text>
                            <Tag
                              color={
                                article.status === 'published'
                                  ? 'green'
                                  : article.status === 'draft'
                                    ? 'orange'
                                    : 'gray'
                              }
                            >
                              {article.status === 'published'
                                ? 'Опубликовано'
                                : article.status === 'draft'
                                  ? 'Черновик'
                                  : 'Архив'}
                            </Tag>
                          </div>
                          <div className={styles.metadataItem}>
                            <Text strong>Тип: </Text>
                            <Tag>{article.content_type}</Tag>
                          </div>
                          <div className={styles.metadataItem}>
                            <Text strong>Создано: </Text>
                            <Text className={styles.dateText}>
                              {format(new Date(article.created_at), 'PPpp', {
                                locale: ru,
                              })}
                            </Text>
                          </div>
                          <div className={styles.metadataItem}>
                            <Text strong>Обновлено: </Text>
                            <Text className={styles.dateText}>
                              {format(new Date(article.updated_at), 'PPpp', {
                                locale: ru,
                              })}
                            </Text>
                          </div>
                        </Space>
                      </Card>
                    </Col>

                    {(article.meta_title ||
                      article.meta_description ||
                      article.meta_keywords) && (
                      <Col span={24}>
                        <Card
                          title="SEO информация"
                          size="small"
                          className={styles.seoCard}
                        >
                          <Space direction="vertical" style={{ width: '100%' }}>
                            {article.meta_title && (
                              <div className={styles.seoItem}>
                                <Text strong>Title: </Text>
                                <Text className={styles.seoText}>
                                  {article.meta_title}
                                </Text>
                              </div>
                            )}
                            {article.meta_description && (
                              <div className={styles.seoItem}>
                                <Text strong>Description: </Text>
                                <Text className={styles.seoText}>
                                  {article.meta_description}
                                </Text>
                              </div>
                            )}
                            {article.meta_keywords && (
                              <div className={styles.seoItem}>
                                <Text strong>Keywords: </Text>
                                <Text className={styles.seoText}>
                                  {article.meta_keywords}
                                </Text>
                              </div>
                            )}
                          </Space>
                        </Card>
                      </Col>
                    )}
                  </Row>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>

        {/* Навигация внизу */}
        <div className={styles.bottomNavigation}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              {hasPrevious && (
                <Card
                  size="small"
                  hoverable
                  onClick={onPrevious}
                  className={styles.navCard}
                >
                  <Space direction="vertical" size={0}>
                    <Text type="secondary" strong>
                      Предыдущая статья
                    </Text>
                    <Text ellipsis className={styles.navText}>
                      ← Назад
                    </Text>
                  </Space>
                </Card>
              )}
            </Col>
            <Col xs={24} sm={12}>
              {hasNext && (
                <Card
                  size="small"
                  hoverable
                  onClick={onNext}
                  className={styles.navCard}
                >
                  <Space
                    direction="vertical"
                    size={0}
                    className={styles.navRight}
                  >
                    <Text type="secondary" strong>
                      Следующая статья
                    </Text>
                    <Text ellipsis className={styles.navText}>
                      Вперед →
                    </Text>
                  </Space>
                </Card>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default KnowledgeViewer;
