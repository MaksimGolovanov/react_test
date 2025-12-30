// src/features/security-training/components/EditorComponent.jsx
import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Upload, Button, Tooltip, Space, message, Modal } from 'antd';
import {
  UploadOutlined,
  PictureOutlined,
  LinkOutlined,
  CodeOutlined,
  TableOutlined,
  HighlightOutlined,
  FontSizeOutlined,
  FormOutlined
} from '@ant-design/icons';

const EditorComponent = ({ 
  value, 
  onChange, 
  placeholder = "Введите текст урока...",
  height = 400
}) => {
  const [uploading, setUploading] = useState(false);

  // Обработчик загрузки изображений
  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      setUploading(true);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        // В реальном приложении здесь будет загрузка на сервер
        // и получение URL изображения
        const imageUrl = e.target.result;
        resolve(imageUrl);
        setUploading(false);
        message.success('Изображение загружено');
      };
      
      reader.onerror = (error) => {
        setUploading(false);
        reject(error);
        message.error('Ошибка загрузки изображения');
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Дополнительные команды для тулбара
  const extraCommands = (
    <Space size="small" style={{ marginLeft: 8 }}>
      <Tooltip title="Вставить изображение">
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={(file) => {
            handleImageUpload(file).then(url => {
              const markdownImage = `![Описание изображения](${url})`;
              const currentValue = value || '';
              onChange(currentValue + '\n\n' + markdownImage);
            });
            return false; // Предотвращаем автоматическую загрузку
          }}
        >
          <Button 
            size="small" 
            icon={<PictureOutlined />} 
            loading={uploading}
            type="text"
            style={{ padding: '4px 8px' }}
          >
            Изображение
          </Button>
        </Upload>
      </Tooltip>

      <Tooltip title="Вставить ссылку">
        <Button 
          size="small" 
          icon={<LinkOutlined />}
          type="text"
          style={{ padding: '4px 8px' }}
          onClick={() => {
            const currentValue = value || '';
            const markdownLink = '[Текст ссылки](https://example.com)';
            onChange(currentValue + (currentValue ? '\n' : '') + markdownLink);
          }}
        >
          Ссылка
        </Button>
      </Tooltip>

      <Tooltip title="Вставить таблицу">
        <Button 
          size="small" 
          icon={<TableOutlined />}
          type="text"
          style={{ padding: '4px 8px' }}
          onClick={() => {
            const currentValue = value || '';
            const table = `
| Заголовок 1 | Заголовок 2 | Заголовок 3 |
|-------------|-------------|-------------|
| Ячейка 1    | Ячейка 2    | Ячейка 3    |
| Ячейка 4    | Ячейка 5    | Ячейка 6    |
`;
            onChange(currentValue + (currentValue ? '\n\n' : '') + table);
          }}
        >
          Таблица
        </Button>
      </Tooltip>
    </Space>
  );

  // Кастомные тулбары
  const customToolbar = [
    'bold', 'italic', 'underline', 'strikethrough',
    '-', // разделитель
    'title', 'list', 'unordered-list', 'ordered-list',
    'link', 'image', 'code', 'code-block',
    '-',
    'table', 'quote', 'comment'
  ];

  return (
    <div style={{ width: '100%' }}>
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        placeholder={placeholder}
        preview="edit"
        extraCommands={extraCommands}
        textareaProps={{
          placeholder: placeholder,
          style: {
            fontSize: '16px',
            lineHeight: '1.6'
          }
        }}
        style={{
          borderRadius: '4px',
          border: '1px solid #d9d9d9',
          overflow: 'hidden'
        }}
      />
      
      {/* Шпаргалка по Markdown */}
      <div style={{ 
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '8px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          <FormOutlined style={{ marginRight: '8px' }} />
          <span>Шпаргалка по Markdown:</span>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '8px',
          fontSize: '13px'
        }}>
          <div>
            <code># Заголовок 1</code>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              Большой заголовок
            </div>
          </div>
          
          <div>
            <code>## Заголовок 2</code>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              Средний заголовок
            </div>
          </div>
          
          <div>
            <code>**жирный текст**</code>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              Жирное начертание
            </div>
          </div>
          
          <div>
            <code>*курсив*</code>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              Курсивное начертание
            </div>
          </div>
          
          <div>
            <code>`встроенный код`</code>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              Код в строке
            </div>
          </div>
          
          <div>
            <code>```js\nкод\n```</code>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              Блок кода
            </div>
          </div>
          
          <div>
            <code>[ссылка](http://example.com)</code>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              Гиперссылка
            </div>
          </div>
          
          <div>
            <code>![alt](image.jpg)</code>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              Изображение
            </div>
          </div>
          
          <div>
            <code>- элемент списка</code>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              Маркированный список
            </div>
          </div>
          
          <div>
            <code>1. элемент списка</code>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              Нумерованный список
            </div>
          </div>
          
          <div>
            <code>&gt; цитата</code>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              Цитата
            </div>
          </div>
          
          <div>
            <code>---</code>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              Горизонтальная линия
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorComponent;