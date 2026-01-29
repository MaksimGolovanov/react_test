import React from 'react';
import { Button, Input, Space, message, Modal } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
} from '@ant-design/icons';
import KnowledgeStore from '../../store/MockKnowledgeStore';
import styles from './KnowledgeHeader.module.css';

const KnowledgeHeader = ({
  searchTerm,
  onSearchChange,
  onAddNew,
  selectedRow,
  onEdit,
  onDelete,
}) => {
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

  const handleToggleFeatured = async () => {
    if (selectedRow) {
      try {
        await KnowledgeStore.updateArticle(selectedRow.id, {
          ...selectedRow,
          featured: !selectedRow.featured,
        });
        message.success(
          `Статья ${selectedRow.featured ? 'убрана из ' : 'добавлена в'} избранные`
        );
      } catch (error) {
        message.error('Ошибка при обновлении статьи');
      }
    }
  };

  return (
    <div className={styles.header}>
      <Space>
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
          icon={<StarOutlined />}
          onClick={handleToggleFeatured}
          disabled={!selectedRow}
          type={selectedRow?.featured ? 'primary' : 'default'}
        >
          {selectedRow?.featured ? 'Убрать из избранного' : 'В избранное'}
        </Button>

        <Input
          placeholder="Поиск по статьям..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </Space>
    </div>
  );
};

export default KnowledgeHeader;
