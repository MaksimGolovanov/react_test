import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Spin, message, Typography, Space, Divider, Row, Col, Tooltip, Modal } from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CalendarOutlined,

} from '@ant-design/icons';
import draftToHtml from 'draftjs-to-html';
import NoteService from '../services/NoteService';
import './Notes.css';

const { Title, Text } = Typography;

export default function ViewPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  console.log('ViewPost component mounted, id:', id); // Отладка

  useEffect(() => {
    if (id) {
      fetchPost();
    } else {
      console.error('No id provided');
      setError('ID заметки не указан');
      setLoading(false);
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching post with id:', id);
      
      const response = await NoteService.fetchPost(id);
      console.log('Response received:', response);
      
      let parsedBody;
      try {
        if (response.body && typeof response.body === 'string' && response.body.trim() !== '') {
          parsedBody = JSON.parse(response.body);
          if (!parsedBody.blocks || !Array.isArray(parsedBody.blocks)) {
            parsedBody = { blocks: [], entityMap: {} };
          }
        } else {
          parsedBody = { blocks: [], entityMap: {} };
        }
      } catch (parseError) {
        console.error('Error parsing body:', parseError);
        parsedBody = { blocks: [], entityMap: {} };
      }
      
      setPost({
        ...response,
        body: parsedBody,
        tags: response.tags || []
      });
    } catch (err) {
      console.error('Error fetching post:', err);
      setError(err.message || 'Не удалось загрузить заметку');
      message.error('Ошибка при загрузке заметки');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await NoteService.deletePost(id);
      message.success('Заметка удалена');
      navigate('/notes');
    } catch (error) {
      console.error('Error deleting post:', error);
      message.error('Ошибка при удалении');
    }
  };

  const renderContent = () => {
    if (!post || !post.body || !post.body.blocks || post.body.blocks.length === 0) {
      return <Text type="secondary">Нет содержимого</Text>;
    }
    
    try {
      const html = draftToHtml(post.body);
      if (!html || html.trim() === '') {
        return <Text type="secondary">Нет содержимого</Text>;
      }
      return <div dangerouslySetInnerHTML={{ __html: html }} className="post-content-full" />;
    } catch (error) {
      console.error('Error rendering content:', error);
      return <Text type="danger">Ошибка отображения содержимого</Text>;
    }
  };



  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Загрузка заметки..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Title level={3}>Ошибка</Title>
        <Text>{error || 'Заметка не найдена'}</Text>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => navigate('/notes')}>
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', minHeight: 'calc(100vh-300)' }}>
      <Row justify="center">
        <Col xs={24} lg={18} xl={16}>
          <Card>
            {/* Верхняя панель с кнопками */}
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/notes')}>
                Назад к списку
              </Button>
              <Space wrap>
                <Tooltip title="Редактировать">
                  <Button icon={<EditOutlined />} onClick={() => navigate(`/notes/edit-post/${id}`)}>
                    Редактировать
                  </Button>
                </Tooltip>
                
                <Tooltip title="Удалить">
                  <Button danger icon={<DeleteOutlined />} onClick={() => setDeleteModalVisible(true)}>
                    Удалить
                  </Button>
                </Tooltip>
              </Space>
            </div>

            {/* Заголовок и мета-информация */}
            <div style={{ marginBottom: 24 }}>
              <Title level={2} style={{ margin: 0, wordBreak: 'break-word' }}>
                {post.title || 'Без названия'}
              </Title>
              <Space split={<Divider type="vertical" />} wrap style={{ marginTop: 12 }}>
                <Space>
                  <CalendarOutlined />
                  <Text type="secondary">
                    Создано: {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Дата неизвестна'}
                  </Text>
                </Space>
                {post.updatedAt && post.updatedAt !== post.createdAt && (
                  <Space>
                    <CalendarOutlined />
                    <Text type="secondary">
                      Обновлено: {new Date(post.updatedAt).toLocaleString()}
                    </Text>
                  </Space>
                )}
              </Space>
            </div>

            <Divider />

            {/* Содержимое заметки */}
            <div className="post-content-full">
              {renderContent()}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Модальное окно подтверждения удаления */}
      <Modal
        title="Подтверждение удаления"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
      >
        <p>Вы уверены, что хотите удалить эту заметку?</p>
        <p style={{ color: '#ff4d4f' }}>Это действие нельзя отменить.</p>
      </Modal>
    </div>
  );
}