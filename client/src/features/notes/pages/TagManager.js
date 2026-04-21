import React, { useState } from 'react';
import { Tag, Input, Tooltip, Space, Button, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const TagManager = ({ tags, onAddTag, onRemoveTag, onEditTag }) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleAddTag = () => {
    if (inputValue && !tags.includes(inputValue)) {
      onAddTag(inputValue);
      setInputVisible(false);
      setInputValue('');
      message.success(`Тег "${inputValue}" добавлен`);
    } else if (tags.includes(inputValue)) {
      message.warning('Такой тег уже существует');
    }
  };

  const handleDeleteTag = (tag) => {
    onRemoveTag(tag);
    message.success(`Тег "${tag}" удален`);
  };

  const handleEditTag = (oldTag, newTag) => {
    if (newTag && !tags.includes(newTag)) {
      onEditTag(oldTag, newTag);
      setEditIndex(null);
      message.success(`Тег изменен на "${newTag}"`);
    }
  };

  return (
    <Space wrap size="small">
      {tags.map((tag, index) => (
        <Tooltip key={tag} title="Нажмите для редактирования">
          {editIndex === index ? (
            <Input
              autoFocus
              size="small"
              defaultValue={tag}
              onBlur={(e) => handleEditTag(tag, e.target.value)}
              onPressEnter={(e) => handleEditTag(tag, e.target.value)}
              style={{ width: 100 }}
            />
          ) : (
            <Tag
              closable
              onClose={() => handleDeleteTag(tag)}
              onClick={() => setEditIndex(index)}
              style={{ cursor: 'pointer' }}
            >
              {tag}
            </Tag>
          )}
        </Tooltip>
      ))}
      {inputVisible ? (
        <Input
          autoFocus
          size="small"
          placeholder="Новый тег"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleAddTag}
          onPressEnter={handleAddTag}
          style={{ width: 100 }}
        />
      ) : (
        <Tag
          onClick={() => setInputVisible(true)}
          style={{ cursor: 'pointer', borderStyle: 'dashed' }}
        >
          <PlusOutlined /> Добавить тег
        </Tag>
      )}
    </Space>
  );
};

export default TagManager;