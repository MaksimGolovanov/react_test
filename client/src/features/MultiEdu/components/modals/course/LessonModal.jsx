import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Row,
  Col,
  InputNumber,
  Button,
  Alert,
  Tooltip,
  message,
} from 'antd';
import {
  SaveOutlined,
  QuestionCircleOutlined,
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

// Конфигурация Quill редактора
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strikethrough'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'color',
  'background',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'blockquote',
  'code-block',
  'align',
];

const LessonModal = ({ visible, editingLesson, onClose, onSave, saving }) => {
  const quillRef = useRef(null);
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState('');
  const [contentType, setContentType] = useState('text');
  const [nonTextContent, setNonTextContent] = useState('');
  const [isContentValid, setIsContentValid] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Валидация контента
  const validateContent = useCallback(() => {
    let isValid = false;

    if (contentType === 'text') {
      isValid =
        editorContent &&
        editorContent !== '<p><br></p>' &&
        editorContent.trim() !== '';
    } else {
      isValid = nonTextContent && nonTextContent.trim() !== '';
    }

    setIsContentValid(isValid);
    return isValid;
  }, [contentType, editorContent, nonTextContent]);

  // Инициализация формы
  useEffect(() => {
    if (visible && !isInitialized) {
      if (editingLesson) {
        const contentValue = editingLesson.content || '';
        const contentTypeValue = editingLesson.content_type || 'text';

        // Устанавливаем все значения формы
        form.setFieldsValue({
          title: editingLesson.title,
          content_type: contentTypeValue,
          video_url: editingLesson.video_url || '',
          presentation_url: editingLesson.presentation_url || '',
          duration: editingLesson.duration || 15,
          order_index: editingLesson.order_index || 0,
          is_active:
            editingLesson.is_active !== undefined
              ? editingLesson.is_active
              : true,
        });

        // Устанавливаем контент
        if (contentTypeValue === 'text') {
          setEditorContent(contentValue);
        } else {
          setNonTextContent(contentValue);
        }

        setContentType(contentTypeValue);
        validateContent();
      } else {
        // Сбрасываем форму для нового урока
        form.resetFields();
        form.setFieldsValue({
          content_type: 'text',
          duration: 15,
          order_index: 0,
          is_active: true,
        });

        setEditorContent('');
        setNonTextContent('');
        setContentType('text');
        setIsContentValid(false);
      }
      setIsInitialized(true);
    }

    if (!visible) {
      setIsInitialized(false);
    }
  }, [visible, editingLesson, form, validateContent, isInitialized]);

  // Обработчик изменения типа контента
  const handleContentTypeChange = (value) => {
    setContentType(value);
    form.setFieldsValue({ content_type: value });
    validateContent();
  };

  // Обработчик изменения контента в Quill
  const handleEditorChange = (content) => {
    setEditorContent(content);
    validateContent();
  };

  // Обработчик изменения текста для не-текстовых типов
  const handleNonTextContentChange = (e) => {
    setNonTextContent(e.target.value);
    validateContent();
  };

  // Функция для загрузки изображений
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file && quillRef.current) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range.index, 'image', e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  // Кастомные обработчики для панели инструментов
  const customModules = useMemo(
    () => ({
      ...modules,
      toolbar: {
        container: modules.toolbar,
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  // Обработчик сохранения
  const handleSave = () => {
    console.log('Saving lesson...');

    // Получаем значения формы
    form
      .validateFields()
      .then((values) => {
        console.log('Form values:', values);

        // Валидируем контент
        if (!validateContent()) {
          message.error('Заполните содержание урока');
          return;
        }

        // Получаем контент в зависимости от типа
        const content = contentType === 'text' ? editorContent : nonTextContent;

        // Формируем финальные данные - ВАЖНО: убедитесь, что структура соответствует ожидаемой API
        const finalValues = {
          title: values.title || '',
          content_type: values.content_type || 'text',
          video_url: values.video_url || '',
          presentation_url: values.presentation_url || '',
          duration: values.duration || 15,
          order_index: values.order_index || 0,
          is_active: values.is_active !== undefined ? values.is_active : true,
          content: content || '',
        };

        console.log('Saving lesson with data:', finalValues);

        // Вызываем onSave с данными урока и текущим уроком для редактирования
        onSave(finalValues, editingLesson);
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
        message.error('Заполните все обязательные поля');
      });
  };

  // Обработчик закрытия модального окна
  const handleClose = () => {
    form.resetFields();
    setEditorContent('');
    setNonTextContent('');
    setContentType('text');
    setIsContentValid(false);
    setIsInitialized(false);
    onClose();
  };

  return (
    <Modal
      title={editingLesson ? 'Редактирование урока' : 'Создание урока'}
      open={visible}
      onCancel={handleClose}
      width={900}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Отмена
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          loading={saving}
          icon={<SaveOutlined />}
          disabled={!isContentValid}
        >
          Сохранить
        </Button>,
      ]}
      destroyOnClose={true}
      afterClose={handleClose}
    >
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Название урока"
              rules={[
                {
                  required: true,
                  message: 'Введите название урока',
                  whitespace: true,
                },
                {
                  max: 255,
                  message: 'Название не должно превышать 255 символов',
                },
              ]}
            >
              <Input
                placeholder="Введение в информационную безопасность"
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="content_type"
              label="Тип контента"
              rules={[{ required: true, message: 'Выберите тип контента' }]}
            >
              <Select
                placeholder="Выберите тип контента"
                onChange={handleContentTypeChange}
              >
                <Option value="text">Текстовый урок</Option>
                <Option value="video">Видеоурок</Option>
                <Option value="presentation">Презентация</Option>
                <Option value="interactive">Интерактивный урок</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {contentType === 'text' && (
          <Form.Item
            label={
              <span>
                Содержание урока
                <Tooltip title="Используйте редактор для форматирования текста">
                  <QuestionCircleOutlined
                    style={{ marginLeft: 8, color: '#999' }}
                  />
                </Tooltip>
              </span>
            }
            required
            validateStatus={!isContentValid ? 'error' : ''}
            help={!isContentValid ? 'Введите содержание урока' : null}
          >
            <div
              style={{
                border: !isContentValid
                  ? '1px solid #ff4d4f'
                  : '1px solid #d9d9d9',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={editorContent}
                onChange={handleEditorChange}
                modules={customModules}
                formats={formats}
                placeholder="Начните вводить содержание урока..."
                style={{ height: 350 }}
                preserveWhitespace={true}
              />
            </div>

            <Alert
              message="Быстрые подсказки"
              description={
                <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <p>
                        <BoldOutlined /> <strong>Жирный текст</strong>: Ctrl+B
                      </p>
                      <p>
                        <ItalicOutlined /> <em>Курсив</em>: Ctrl+I
                      </p>
                      <p>
                        <LinkOutlined /> <u>Ссылка</u>: Ctrl+K
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        <UnorderedListOutlined /> Список: Ctrl+Shift+8
                      </p>
                      <p>
                        <OrderedListOutlined /> Нумер. список: Ctrl+Shift+7
                      </p>
                      <p>
                        <PictureOutlined /> Изображение: загрузите файл
                      </p>
                    </Col>
                  </Row>
                </div>
              }
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          </Form.Item>
        )}

        {contentType === 'video' && (
          <>
            <Form.Item
              label="Ссылка на видео"
              required
              validateStatus={!isContentValid ? 'error' : ''}
              help={!isContentValid ? 'Введите ссылку на видео' : null}
            >
              <Input
                placeholder="https://youtube.com/watch?v=..."
                prefix={<VideoCameraOutlined />}
                value={nonTextContent}
                onChange={handleNonTextContentChange}
              />
            </Form.Item>
            <Form.Item name="video_url" label="URL видео (дополнительный)">
              <Input placeholder="https://vimeo.com/..." />
            </Form.Item>
          </>
        )}

        {contentType === 'presentation' && (
          <>
            <Form.Item
              label="Ссылка на презентацию"
              required
              validateStatus={!isContentValid ? 'error' : ''}
              help={!isContentValid ? 'Введите ссылку на презентацию' : null}
            >
              <Input
                placeholder="https://docs.google.com/presentation/d/..."
                value={nonTextContent}
                onChange={handleNonTextContentChange}
              />
            </Form.Item>
            <Form.Item
              name="presentation_url"
              label="URL презентации (дополнительный)"
            >
              <Input placeholder="https://slideshare.net/..." />
            </Form.Item>
          </>
        )}

        {contentType === 'interactive' && (
          <Form.Item
            label="Содержание интерактивного урока"
            required
            validateStatus={!isContentValid ? 'error' : ''}
            help={
              !isContentValid ? 'Введите содержание интерактивного урока' : null
            }
          >
            <TextArea
              rows={8}
              placeholder="Введите содержание интерактивного урока..."
              value={nonTextContent}
              onChange={handleNonTextContentChange}
            />
          </Form.Item>
        )}

        {contentType !== 'video' && contentType !== 'presentation' && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="video_url" label="URL видео (если применимо)">
                <Input placeholder="https://youtube.com/..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="presentation_url"
                label="URL презентации (если применимо)"
              >
                <Input placeholder="https://docs.google.com/..." />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="duration"
              label="Длительность (минуты)"
              rules={[
                {
                  required: true,
                  message: 'Введите длительность',
                  type: 'number',
                  min: 1,
                  max: 480,
                },
              ]}
            >
              <InputNumber
                min={1}
                max={480}
                style={{ width: '100%' }}
                placeholder="15"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="order_index"
              label="Порядок в курсе"
              rules={[
                {
                  required: true,
                  message: 'Введите порядок в курсе',
                  type: 'number',
                  min: 0,
                },
              ]}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="is_active"
              label="Активен"
              valuePropName="checked"
              style={{ marginTop: 30 }}
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <style>
        {`
          .ql-container {
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
          }
          
          .ql-editor {
            min-height: 300px;
            line-height: 1.6;
          }
          
          .ql-editor.ql-blank::before {
            color: #999;
            font-style: normal;
            left: 15px;
          }
          
          .ql-toolbar.ql-snow {
            border: none;
            border-bottom: 1px solid #d9d9d9;
            padding: 8px;
          }
          
          .ql-container.ql-snow {
            border: none;
          }
          
          .ql-toolbar.ql-snow .ql-formats {
            margin-right: 15px;
          }
          
          .ql-toolbar.ql-snow button:hover {
            color: #1890ff;
          }
        `}
      </style>
    </Modal>
  );
};

export default LessonModal;
