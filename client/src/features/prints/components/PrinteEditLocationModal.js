import React, { useState } from 'react';
import Modal from 'react-modal';
import { CgCloseO } from "react-icons/cg";
import { VscSaveAs } from "react-icons/vsc";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PrintsService from '../services/PrintsService';

const customStyles = {
    content: {
        width: '600px',
        height: '220px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        padding: '20px',
        borderLeft: '4px solid #fa922f',
        borderTop: '6px solid #2F3436',
        borderRight: '6px solid #2F3436',
        borderBottom: '6px solid #2F3436',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
    overlay: {
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
};



Modal.setAppElement('#root');
export default function PrintEditLocationModal({ isOpen, onRequestClose, onSuccess }) {
    const [location, setLocation] = useState('')


    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = { location };

        try {
            await PrintsService.createLocation(formData);
            onRequestClose();
            onSuccess();
        } catch (error) {
            console.error('Ошибка создания локации:', error);
        } finally {
            // Убедимся, что модальное окно закроется даже в случае ошибки
            onRequestClose();
        }
    };


    return (

        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel="Создание локации"
        >
            <CgCloseO
                className="close-icon"
                size={28}
                onClick={onRequestClose}
                style={{ position: 'absolute', top: '16px', right: '16px', cursor: 'pointer' }}
            />
            <h3>Добавление здания</h3>
            <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                <Form.Group>
                    <Form.Label className='textModal'>Модель принтера*</Form.Label>
                    <Form.Control
                        type="text"
                        name="logical_name"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)} // Обновляем state при изменении значения
                        placeholder="Введите место расположения"
                    />
                </Form.Group>
                <Button
                    type="submit"
                    className='button-next w-100 mt-2'

                >
                    <VscSaveAs className={'icon-staff'} size={20} style={{ marginRight: '8px' }} />
                    СОХРАНИТЬ
                </Button>
            </Form>

        </Modal>
    )


}