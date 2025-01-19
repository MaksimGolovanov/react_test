import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button, Form, FormControl, Spinner } from 'react-bootstrap';
import './Notes.css'
import NoteService from '../services/NoteService';
import { useNavigate } from 'react-router-dom'; 

const imageUploadCallback = file => new Promise(
  (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ data: { link: reader.result } });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  },
);

export default function NotesCreate() {
    // Сохраняем состояние редактора и заголовок
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [title, setTitle] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 

    // Обработчик изменения состояния редактора
    const onEditorStateChange = (newState) => {
        setEditorState(newState);
    };

    // Получаем содержимое редактора в формате JSON
    const getContentAsString = () => {
        try {
            const contentState = editorState.getCurrentContent();
            const rawContent = convertToRaw(contentState);
            return JSON.stringify(rawContent); // Преобразуем JSON в строку
        } catch (error) {
            console.error('Error converting content:', error);
            return '';
        }
    };

    // Отправка формы
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            setLoading(true);
            const content = getContentAsString(); // Получаем содержимое в формате строки
    
            if (content !== '') {
                await NoteService.createPost({ title, body: content }); // Сохраняем строку в БД
                console.log(`Заголовок: ${title}`);
                console.log(`Содержание:`, content);
                navigate('/notes');
            } else {
                throw new Error('Пожалуйста, заполните содержание.');
            }
        } catch (err) {
            if (err instanceof Error) {
                if (err.message.includes('Network')) {
                    setError('Ошибка сети. Попробуйте позже.');
                } else {
                    setError(err.message);
                }
            } else {
                setError('Неизвестная ошибка. Пожалуйста, попробуйте снова.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? <Spinner animation="border" /> : null}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="postTitle" className='mb-3'>
                    <Form.Label>Название поста</Form.Label>
                    <FormControl
                        type="text"
                        placeholder="Введите название поста"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
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
                <Button type="submit">Отправить</Button>
            </Form>
        </div>
    );
};