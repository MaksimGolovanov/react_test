import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button, Form, Input, message, Spin, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import NoteService from '../services/NoteService';
import './Notes.css';

const imageUploadCallback = file => new Promise(
  (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ data: { link: reader.result } });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  },
);

export default function NotesCreate() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onEditorStateChange = (newState) => {
    setEditorState(newState);
  };

  const getContentAsString = () => {
    try {
      const contentState = editorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      // Проверяем, что контент не пустой
      if (!rawContent || !rawContent.blocks || rawContent.blocks.length === 0) {
        return JSON.stringify({ blocks: [], entityMap: {} });
      }
      return JSON.stringify(rawContent);
    } catch (error) {
      console.error('Error converting content:', error);
      return JSON.stringify({ blocks: [], entityMap: {} });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!title.trim()) {
        message.error('Пожалуйста, введите заголовок');
        return;
      }

      const content = getContentAsString();
      
      // Проверяем, что контент валидный
      if (content === JSON.stringify({ blocks: [], entityMap: {} })) {
        message.warning('Заметка будет создана без содержимого');
      }

      await NoteService.createPost({ title, body: content });
      message.success('Заметка успешно создана');
      navigate('/notes');
    } catch (err) {
      console.error('Error:', err);
      message.error(err.message || 'Ошибка при создании заметки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Spin spinning={loading}>
        <Card 
          title="Создание новой заметки"
          extra={
            <Button 
              type="primary" 
              onClick={handleSubmit}
              icon={<PlusOutlined />}
            >
              Опубликовать
            </Button>
          }
        >
          <Form form={form} layout="vertical">
            <Form.Item 
              label="Название поста" 
              required
              rules={[{ required: true, message: 'Введите название поста' }]}
            >
              <Input
                placeholder="Введите название поста"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size="large"
              />
            </Form.Item>

            <Form.Item label="Содержание">
              <Editor
                editorState={editorState}
                wrapperClassName="rich-text-editor"
                editorClassName="rich-text-editor__content"
                toolbarClassName="rich-text-editor__toolbar"
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                  options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image'],
                  inline: { inDropdown: true },
                  list: { inDropdown: true },
                  textAlign: { inDropdown: true },
                  link: { inDropdown: true },
                  history: { inDropdown: true },
                  image: { uploadCallback: imageUploadCallback, alt: { present: true, mandatory: false }, previewImage: true },
                }}
              />
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}