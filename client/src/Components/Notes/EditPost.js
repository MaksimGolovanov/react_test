// Импортируем необходимые модули
import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromRaw, convertToRaw   } from 'draft-js';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button, Form, FormControl, Spinner } from 'react-bootstrap';
import '../Notes/Notes.css'
import NoteService from './NoteService';
import { useParams, useNavigate } from 'react-router-dom'; 

export default function NotesEdit() {
    // Используем useParams для получения параметра id из URL
    const { id } = useParams();
    const navigate = useNavigate(); 

    // Сохраняем состояние редактора и заголовок
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [title, setTitle] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Загружаем запись при монтировании компонента
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await NoteService.fetchPost(id);
                
                setTitle(response.title);
                const contentState = convertFromRaw(JSON.parse(response.body));
                setEditorState(EditorState.createWithContent(contentState));
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
        
        fetchData();
    }, [id]);

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

    // Обработчик изменения состояния редактора
    const onEditorStateChange = (newState) => {
        setEditorState(newState);
    };

    // Отправка формы
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            setLoading(true);
            const content = getContentAsString(); // Получаем содержимое в формате строки
    
            if (content !== '') {
                await NoteService.updatePost(id, { title, body: content });
                console.log(`Обновлено: ${title}`);
                console.log(`Содержание:`, content);
                navigate('/notes'); // Перенаправляем на список заметок
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
                />
                <Button type="submit">Сохранить изменения</Button>
            </Form>
        </div>
    );
};