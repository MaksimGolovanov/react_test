import React, { useEffect, useState } from 'react';
import { 
    Modal, Form, Input, Select, message, 
    Tabs, Switch, Tag, Space, Button,
    Upload, Row, Col, Tooltip
} from 'antd';
import { 
    UploadOutlined, PlusOutlined, DeleteOutlined,
    BoldOutlined, ItalicOutlined, LinkOutlined,
    OrderedListOutlined, PictureOutlined
} from '@ant-design/icons';
import { ARTICLE_STATUSES, ARTICLE_TAGS, CONTENT_TYPES } from '../../constants';
import KnowledgeStore from '../../store/MockKnowledgeStore';
import KnowledgeService from '../../api/MockKnowledgeService';
import styles from './KnowledgeModal.module.css';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const KnowledgeModal = ({ visible, currentArticle, categories, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('content');
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [uploading, setUploading] = useState(false);
    const [content, setContent] = useState('');

    useEffect(() => {
        if (visible) {
            if (currentArticle) {
                form.setFieldsValue({
                    title: currentArticle.title,
                    description: currentArticle.description || '',
                    category_id: currentArticle.category_id || undefined,
                    status: currentArticle.status || 'draft',
                    content_type: currentArticle.content_type || 'Статья',
                    author: currentArticle.author || '',
                    featured: currentArticle.featured || false,
                    meta_title: currentArticle.meta_title || '',
                    meta_description: currentArticle.meta_description || '',
                    meta_keywords: currentArticle.meta_keywords || '',
                });
                setTags(currentArticle.tags || []);
                setContent(currentArticle.content || '');
            } else {
                form.setFieldsValue({
                    title: '',
                    description: '',
                    category_id: undefined,
                    status: 'draft',
                    content_type: 'Статья',
                    author: '',
                    featured: false,
                    meta_title: '',
                    meta_description: '',
                    meta_keywords: '',
                });
                setTags([]);
                setContent('');
            }
        }
    }, [visible, currentArticle, form]);

    const handleAddTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleFileUpload = async (file) => {
        setUploading(true);
        try {
            const response = await KnowledgeService.uploadFile(file);
            setContent(prev => `${prev}\n![${file.name}](${response.url})\n`);
            message.success('Файл успешно загружен');
        } catch (error) {
            message.error('Ошибка при загрузке файла');
        } finally {
            setUploading(false);
        }
        return false; // Предотвращаем автоматическую загрузку
    };

    const insertFormatting = (format) => {
        const textarea = document.querySelector(`#content-editor`);
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        let formattedText = '';
        let newCursorPos = 0;

        switch (format) {
            case 'bold':
                formattedText = `**${selectedText}**`;
                newCursorPos = start + 2;
                break;
            case 'italic':
                formattedText = `*${selectedText}*`;
                newCursorPos = start + 1;
                break;
            case 'link':
                formattedText = `[${selectedText || 'текст'}](url)`;
                newCursorPos = start + (selectedText ? selectedText.length + 3 : 1);
                break;
            case 'list':
                formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
                newCursorPos = start + 2;
                break;
            default:
                formattedText = selectedText;
        }

        const newContent = content.substring(0, start) + formattedText + content.substring(end);
        setContent(newContent);

        // Восстанавливаем позицию курсора
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            
            const articleData = {
                ...values,
                content,
                tags,
                meta_keywords: values.meta_keywords?.split(',').map(k => k.trim()),
            };

            if (currentArticle) {
                await KnowledgeStore.updateArticle(currentArticle.id, articleData);
                message.success('Статья обновлена');
            } else {
                await KnowledgeStore.createArticle(articleData);
                message.success('Статья создана');
            }
            
            onSuccess();
            form.resetFields();
            setTags([]);
            setContent('');
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
            message.error('Ошибка при сохранении статьи');
        }
    };

    return (
        <Modal
            title={currentArticle ? 'Редактирование статьи' : 'Создание новой статьи'}
            open={visible}
            onOk={handleSubmit}
            onCancel={() => {
                onCancel();
                form.resetFields();
                setTags([]);
                setContent('');
            }}
            width={800}
            okText="Сохранить"
            cancelText="Отмена"
            destroyOnClose
            className={styles.modal}
        >
            <Form form={form} layout="vertical" preserve={false}>
                <Tabs activeKey={activeTab} onChange={setActiveTab} className={styles.tabs}>
                    <TabPane tab="Контент" key="content">
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="Заголовок"
                                    name="title"
                                    rules={[{ required: true, message: 'Введите заголовок статьи' }]}
                                >
                                    <Input placeholder="Введите заголовок статьи" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Категория" name="category_id">
                                    <Select placeholder="Выберите категорию" allowClear>
                                        {categories.map(category => (
                                            <Option key={category.id} value={category.id}>
                                                {category.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Тип контента" name="content_type">
                                    <Select>
                                        {CONTENT_TYPES.map(type => (
                                            <Option key={type} value={type}>{type}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item label="Краткое описание" name="description">
                                    <TextArea 
                                        rows={3} 
                                        placeholder="Введите краткое описание статьи"
                                        maxLength={200}
                                        showCount
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item label="Содержание">
                                    <div className={styles.editorToolbar}>
                                        <Space>
                                            <Tooltip title="Жирный">
                                                <Button 
                                                    size="small" 
                                                    icon={<BoldOutlined />}
                                                    onClick={() => insertFormatting('bold')}
                                                />
                                            </Tooltip>
                                            <Tooltip title="Курсив">
                                                <Button 
                                                    size="small" 
                                                    icon={<ItalicOutlined />}
                                                    onClick={() => insertFormatting('italic')}
                                                />
                                            </Tooltip>
                                            <Tooltip title="Ссылка">
                                                <Button 
                                                    size="small" 
                                                    icon={<LinkOutlined />}
                                                    onClick={() => insertFormatting('link')}
                                                />
                                            </Tooltip>
                                            <Tooltip title="Список">
                                                <Button 
                                                    size="small" 
                                                    icon={<OrderedListOutlined />}
                                                    onClick={() => insertFormatting('list')}
                                                />
                                            </Tooltip>
                                            <Upload
                                                accept="image/*"
                                                showUploadList={false}
                                                beforeUpload={handleFileUpload}
                                            >
                                                <Tooltip title="Вставить изображение">
                                                    <Button 
                                                        size="small" 
                                                        icon={<PictureOutlined />}
                                                        loading={uploading}
                                                    />
                                                </Tooltip>
                                            </Upload>
                                        </Space>
                                    </div>
                                    <TextArea
                                        id="content-editor"
                                        rows={10}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Начните писать статью..."
                                        className={styles.contentEditor}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </TabPane>

                    <TabPane tab="Настройки" key="settings">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Статус" name="status">
                                    <Select>
                                        {ARTICLE_STATUSES.map(status => (
                                            <Option key={status.value} value={status.value}>
                                                <Tag color={status.color}>{status.label}</Tag>
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Автор" name="author">
                                    <Input placeholder="Введите имя автора" />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item label="Теги">
                                    <div className={styles.tagsContainer}>
                                        <Space wrap style={{ marginBottom: 8 }}>
                                            {tags.map(tag => (
                                                <Tag 
                                                    key={tag} 
                                                    closable
                                                    onClose={() => handleRemoveTag(tag)}
                                                >
                                                    {tag}
                                                </Tag>
                                            ))}
                                        </Space>
                                        <Space.Compact style={{ width: '100%' }}>
                                            <Select
                                                placeholder="Выберите или введите тег"
                                                value={newTag}
                                                onChange={setNewTag}
                                                style={{ width: '100%' }}
                                                mode="tags"
                                                options={ARTICLE_TAGS.map(tag => ({ value: tag, label: tag }))}
                                            />
                                            <Button 
                                                icon={<PlusOutlined />}
                                                onClick={handleAddTag}
                                                type="primary"
                                            />
                                        </Space.Compact>
                                    </div>
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item name="featured" valuePropName="checked">
                                    <Switch />
                                    <span style={{ marginLeft: 8 }}>Рекомендованная статья</span>
                                </Form.Item>
                            </Col>
                        </Row>
                    </TabPane>

                    <TabPane tab="SEO" key="seo">
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Meta Title" name="meta_title">
                                    <Input placeholder="Заголовок для поисковых систем" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Meta Description" name="meta_description">
                                    <TextArea 
                                        rows={3}
                                        placeholder="Описание для поисковых систем"
                                        maxLength={160}
                                        showCount
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Meta Keywords" name="meta_keywords">
                                    <Input placeholder="Ключевые слова через запятую" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Form>
        </Modal>
    );
};

export default KnowledgeModal;