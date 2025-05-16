import React, { useState } from 'react';
import Modal from 'react-modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { VscSaveAs } from "react-icons/vsc";
import { CgCloseO } from "react-icons/cg";
import StaffService from '../services/StaffService';

const customStyles = {
    content: {
        width: '600px',
        height: '730px',
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

export default function StaffCreateModal({ isOpen, onRequestClose, fetchData }) {
    const [fio, setFio] = useState('');
    const [login, setLogin] = useState('');
    const [post, setPost] = useState('');
    const [department, setDepartment] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [ip, setIp] = useState('');
    const [tabNumber, setTabNumber] = useState('');

    const handleSave = async (event) => {
        event.preventDefault();

        const newUser = {
            fio,
            login,
            post,
            department,
            telephone,
            email,
            ip,
            tabNumber
        };

        try {
            await StaffService.createStaff(newUser);
            onRequestClose();
            fetchData();
            // Очищаем форму после успешного создания
            setFio('');
            setLogin('');
            setPost('');
            setDepartment('');
            setTelephone('');
            setEmail('');
            setIp('');
            setTabNumber('');
        } catch (error) {
            console.error("Ошибка при создании пользователя:", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Создание сотрудника">
            <CgCloseO className="close-icon" size={28} onClick={onRequestClose} style={{ position: 'absolute', top: '16px', right: '16px', cursor: 'pointer' }} />
            <h2>Создание нового сотрудника</h2>
            
            <Form onSubmit={handleSave}>
                <label htmlFor="data-input" className='textModal'>Фамилия Имя Отчество</label>
                <Form.Control type="text" value={fio} onChange={(e) => setFio(e.target.value)} placeholder="ФИО" style={{ width: '500px' }} required />
                
                <label htmlFor="data-input" className='textModal'>Логин</label>
                <Form.Control type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Логин" style={{ width: '500px' }} required />
                
                <label htmlFor="data-input" className='textModal'>Должность</label>
                <Form.Control type="text" value={post} onChange={(e) => setPost(e.target.value)} placeholder="Должность" style={{ width: '500px' }} required />
                
                <label htmlFor="data-input" className='textModal'>Служба</label>
                <Form.Control type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Служба" style={{ width: '500px' }} required />
                
                <label htmlFor="data-input" className='textModal'>Телефон</label>
                <Form.Control type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Телефон" style={{ width: '500px' }} />
                
                <label htmlFor="data-input" className='textModal'>Email</label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: '500px' }} />
                
                <label htmlFor="data-input" className='textModal'>IP</label>
                <Form.Control type="text" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="IP" style={{ width: '500px' }} />

                <label htmlFor="data-input" className='textModal'>Табельный номер</label>
                <Form.Control 
                    type="text"
                    value={tabNumber}
                    onChange={(e) => setTabNumber(e.target.value)}
                    placeholder="Табельный номер"
                    required
                    style={{ width: '500px' }}
                />

                <Button type='submit' className='button-next ml-2' style={{ width: '500px', marginTop: '50px' }}>
                    <VscSaveAs className='icon-staff' size={20} style={{ marginRight: '8px' }} /> СОЗДАТЬ
                </Button>
            </Form>
        </Modal>
    );
}