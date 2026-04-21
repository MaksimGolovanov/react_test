import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button, Form, Input, message, Spin, Card, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import NoteService from '../services/NoteService';
import './Notes.css';

export default function NotesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        const response = await NoteService.fetchPost(id);
        
        setTitle(response.title);
        form.setFieldsValue({ title: response.title });
        
        let contentState;
        try {
          if (response.body && typeof response.body === 'string' && response.body.trim() !== '') {
            const parsedBody = JSON.parse(response.body);
            if (parsedBody && parsedBody.blocks && Array.isArray(parsedBody.blocks)) {
              contentState = convertFromRaw(parsedBody);
            } else {
              contentState = convertFromRaw({ blocks: [], entityMap: {} });
            }
          } else {
            contentState = convertFromRaw({ blocks: [], entityMap: {} });
          }
        } catch (parseError) {
          console.error('Error parsing content:', parseError);
          contentState = convertFromRaw({ blocks: [], entityMap: {} });
        }
        
        setEditorState(EditorState.createWithContent(contentState));
      } catch (err) {
        console.error('Error fetching post:', err);
        message.error(err.message || 'Ошибка при загрузке заметки');
        navigate('/notes');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate, form]);

  const getContentAsString = () => {
    try {
      const contentState = editorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      if (!rawContent || !rawContent.blocks || rawContent.blocks.length === 0) {
        return JSON.stringify({ blocks: [], entityMap: {} });
      }
      return JSON.stringify(rawContent);
    } catch (error) {
      console.error('Error converting content:', error);
      return JSON.stringify({ blocks: [], entityMap: {} });
    }
  };

  const onEditorStateChange = (newState) => {
    setEditorState(newState);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!title.trim()) {
        message.error('Пожалуйста, введите заголовок');
        return;
      }

      const content = getContentAsString();
      
      await NoteService.updatePost(id, { title, body: content });
      message.success('Заметка успешно обновлена');
      navigate('/notes');
    } catch (err) {
      console.error('Error updating post:', err);
      message.error(err.message || 'Ошибка при обновлении заметки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Spin spinning={initialLoading}>
        <Card 
          title="Редактирование заметки"
          extra={
            <Space>
              <Button onClick={() => navigate('/notes')}>
                Отмена
              </Button>
              <Button 
                type="primary" 
                onClick={handleSubmit}
                loading={loading}
                icon={<SaveOutlined />}
              >
                Сохранить изменения
              </Button>
            </Space>
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
                  image: { uploadCallback: (file) => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({ data: { link: reader.result } });
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                  })},
                }}
              />
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}