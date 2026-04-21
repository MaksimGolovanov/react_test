import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteService from '../services/NoteService';
import draftToHtml from 'draftjs-to-html';
import {
  Button,
  Space,
  Typography,
  Modal,
  Empty,
  Spin,
  Row,
  Col,
  Tooltip,
  message,
  Alert,
  Avatar,
  Pagination,
  Input,
  List,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import './Notes.css';

const { Text } = Typography;
const { Search } = Input;

// Генерация цвета для аватара
const getAvatarColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 85%)`;
};

const getTextColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 80%, 35%)`;
};

function Notes() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // по умолчанию 9, кратно 9
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchText, posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await NoteService.fetchPosts();

      const postsData = response.map((post) => {
        let parsedBody;
        try {
          if (
            post.body &&
            typeof post.body === 'string' &&
            post.body.trim() !== ''
          ) {
            parsedBody = JSON.parse(post.body);
            if (!parsedBody.blocks || !Array.isArray(parsedBody.blocks)) {
              parsedBody = { blocks: [], entityMap: {} };
            }
          } else {
            parsedBody = { blocks: [], entityMap: {} };
          }
        } catch (parseError) {
          console.error('Error parsing body for post:', post.id, parseError);
          parsedBody = { blocks: [], entityMap: {} };
        }

        return {
          ...post,
          body: parsedBody,
        };
      });

      setPosts(postsData);
      setFilteredPosts(postsData);
    } catch (error) {
      console.error('Ошибка при загрузке заметок:', error);
      setError(error.message || 'Не удалось загрузить заметки');
      message.error('Ошибка при загрузке заметок');
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    if (!searchText.trim()) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.title?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (selectedPostId) {
      try {
        await NoteService.deletePost(selectedPostId);
        const updatedPosts = posts.filter((p) => p.id !== selectedPostId);
        setPosts(updatedPosts);
        message.success('Заметка удалена');
        setDeleteModalVisible(false);
        setSelectedPostId(null);
      } catch (error) {
        console.error('Error deleting post:', error);
        message.error('Ошибка при удалении заметки');
      }
    }
  };

  const handleViewPost = (id) => {
    navigate(`/notes/view/${id}`);
  };

  const handleEditPost = (id, e) => {
    e.stopPropagation();
    navigate(`/notes/edit-post/${id}`);
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setSelectedPostId(id);
    setDeleteModalVisible(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    } catch (e) {
      return null;
    }
  };

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Варианты размера страницы, кратные 9
  const pageSizeOptions = ['9', '18', '27', '36'];

  return (
    <div style={{ padding: '16px 12px',  minHeight: 'calc(100vh-350px)' }}>
      {/* Верхняя панель */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <Space size="large">
          <Search
            placeholder="Поиск по заголовку..."
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={filterPosts}
            style={{ width: '400px' }}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchPosts}>
            Обновить
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/notes/create-post')}
            style={{ borderRadius: '20px' }}
          >
            Создать заметку
          </Button>
        </Space>
      </div>

      <Spin spinning={loading}>
        {error ? (
          <Alert
            message="Ошибка загрузки"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" type="primary" onClick={fetchPosts}>
                Повторить
              </Button>
            }
          />
        ) : filteredPosts.length === 0 ? (
          <Empty
            description={searchText ? 'Заметки не найдены' : 'Нет заметок'}
          >
            {!searchText && (
              <Button
                type="primary"
                onClick={() => navigate('/notes/create-post')}
              >
                Создать первую заметку
              </Button>
            )}
          </Empty>
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={paginatedPosts}
              renderItem={(post) => {
                const dateCreated = formatDate(post.created_at);
                const title = post.title || 'Без названия';
                const avatarColor = getAvatarColor(title);
                const textColor = getTextColor(title);
                return (
                  <List.Item
                    style={{
                      background: '#fff',
                      borderRadius: '16px',
                      marginBottom: '12px',
                      padding: '12px 20px',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                    onClick={() => handleViewPost(post.id)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size={44}
                          style={{
                            backgroundColor: avatarColor,
                            color: textColor,
                            fontSize: '20px',
                            fontWeight: 600,
                          }}
                        >
                          {title[0]?.toUpperCase() || 'З'}
                        </Avatar>
                      }
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <Text strong style={{ fontSize: '16px' }}>
                            {title}
                          </Text>
                          {dateCreated && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FileTextOutlined style={{ fontSize: '12px', color: '#94a3b8' }} />
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {dateCreated}
                              </Text>
                            </div>
                          )}
                        </div>
                      }
                      description={null}
                    />
                    <div onClick={(e) => e.stopPropagation()}>
                      <Space>
                        <Tooltip title="Редактировать">
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={(e) => handleEditPost(post.id, e)}
                            style={{ borderRadius: '30px', color: '#3b82f6' }}
                          />
                        </Tooltip>
                        <Tooltip title="Удалить">
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => handleDeleteClick(post.id, e)}
                            style={{ borderRadius: '30px' }}
                          />
                        </Tooltip>
                      </Space>
                    </div>
                  </List.Item>
                );
              }}
            />

            {filteredPosts.length > pageSize && (
              <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredPosts.length}
                  onChange={setCurrentPage}
                  showSizeChanger
                  pageSizeOptions={pageSizeOptions} // только кратные 9
                  onShowSizeChange={(current, size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  size="default"
                  showTotal={(total) => `Всего ${total} заметок`}
                  style={{ background: '#fff', padding: '8px 20px', borderRadius: '40px', display: 'inline-block' }}
                />
              </div>
            )}
          </>
        )}
      </Spin>

      <Modal
        title="Подтверждение удаления"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedPostId(null);
        }}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
        width={400}
      >
        <p>Вы уверены, что хотите удалить эту заметку?</p>
      </Modal>
    </div>
  );
}

export default Notes;