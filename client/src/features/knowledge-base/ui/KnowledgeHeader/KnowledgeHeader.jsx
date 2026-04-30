import React from 'react';
import { Button, Input, Space, message, Modal, Select } from 'antd'; // добавлен Select
import { useNavigate } from 'react-router-dom';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import KnowledgeStore from '../../store/KnowledgeStore';
import styles from './KnowledgeHeader.module.css';

const { Option } = Select;

const KnowledgeHeader = ({
  searchTerm,
  onSearchChange,
  onAddNew,
  selectedRow,
  onEdit,
  onDelete,
  selectedTag, // текущий выбранный тег
  onTagChange, // колбэк при смене тега
  allTags,
  
}) => {
  const navigate = useNavigate();
  const handleDelete = async () => {
    
    if (selectedRow) {
      Modal.confirm({
        title: 'Удаление статьи',
        content: `Вы уверены, что хотите удалить статью "${selectedRow.title}"?`,
        okText: 'Удалить',
        okType: 'danger',
        cancelText: 'Отмена',
        onOk: async () => {
          try {
            await KnowledgeStore.deleteArticle(selectedRow.id);
            message.success('Статья успешно удалена');
            onDelete();
          } catch (error) {
            message.error('Ошибка при удалении статьи');
          }
        },
      });
    } else {
      message.warning('Выберите статью для удаления');
    }
  };

  return (
    <div className={styles.header}>
      <Space wrap>
        {' '}
        {/* wrap для переноса на маленьких экранах */}
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
          Добавить статью
        </Button>
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (selectedRow) {
              onEdit(selectedRow);
            } else {
              message.warning('Выберите статью для редактирования');
            }
          }}
          type="primary"
          disabled={!selectedRow}
        >
          Редактировать
        </Button>
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={handleDelete}
          disabled={!selectedRow}
        >
          Удалить
        </Button>
        <Button
          icon={<SettingOutlined />}
          onClick={() => navigate('/knowledge/categories')}
        >
          Категории
        </Button>
        <Input
          placeholder="Поиск по статьям..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
        <Select
          placeholder="Фильтр по тегу"
          allowClear
          style={{ width: 180 }}
          value={selectedTag}
          onChange={onTagChange}
        >
          {allTags.map((tag) => (
            <Option key={tag} value={tag}>
              {tag}
            </Option>
          ))}
        </Select>
      </Space>
    </div>
  );
};

export default KnowledgeHeader;
