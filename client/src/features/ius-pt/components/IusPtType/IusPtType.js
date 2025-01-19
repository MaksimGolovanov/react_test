import React, { useState, useEffect, useMemo } from 'react';
import { Button, Table, Form, Card, CardHeader, CardBody } from 'react-bootstrap';
import IusPtStore from '../../store/IusPtStore';
import styles from './style.module.css'; // Импорт CSS модуля
import { VscSaveAs, VscEdit } from "react-icons/vsc";
import { useObserver } from 'mobx-react-lite';

const IusPtType = () => {
    const [newType, setNewType] = useState({ type:'',name: '', description: '' });
    const [editType, setEditType] = useState(null); // Состояние для редактирования

    useEffect(() => {
        IusPtStore.fetchType();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editType) {
            setEditType(prevState => ({ ...prevState, [name]: value }));
        } else {
            setNewType(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editType) {
            await IusPtStore.updateType(editType);
            setEditType(null);
        } else {
            await IusPtStore.createType(newType);
            setNewType({ type: '',name: '', description: '' });
        }
    };

    const handleEdit = (type) => {
        setEditType(type);
    };

    return useObserver(() => (
        <>
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                <Card style={{ width: '500px', padding: '10px' }}>
                    <CardHeader>
                        <h4>Список типов ролей</h4>
                    </CardHeader>
                    <Table striped bordered hover variant="white" className={styles.tabletype}>
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>ID</th>
                                <th style={{ width: '40px' }}>Тип роли</th>
                                <th style={{ width: '100px' }}>Название ИУС</th>
                                <th>Описание</th>
                                <th style={{ width: '50px' }}>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {IusPtStore.types.map(type => (
                                <tr key={type.id}>
                                    <td>{type.id}</td>
                                    <td>{type.type}</td>
                                    <td>{type.name}</td>
                                    <td>{type.description}</td>
                                    <td>
                                        <Button variant="link" onClick={() => handleEdit(type)}>
                                            <VscEdit size={20} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>

                <Card style={{ width: '500px', height: '350px', padding: '10px' }}>
                    <CardHeader>
                        <h4>{editType ? 'Редактирование типа рлей' : 'Добавление типа рлей'}</h4>
                    </CardHeader>
                    <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                        <Form.Group>
                            <Form.Label className='textModal'>Название ИУС*</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editType ? editType.name : newType.name}
                                onChange={handleInputChange}
                                placeholder="Название ИУС"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='textModal'>Тип роли*</Form.Label>
                            <Form.Control
                                type="text"
                                name="type"
                                value={editType ? editType.type : newType.type}
                                onChange={handleInputChange}
                                placeholder="Тип роли"
                            />
                        </Form.Group>
                        <Form.Group> 
                            <Form.Label className='textModal'>Описание роли*</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={editType ? editType.description : newType.description}
                                onChange={handleInputChange}
                                placeholder="Введите описание"
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            className='button-next w-100 mt-2'
                        >
                            <VscSaveAs className={'icon-staff'} size={20} style={{ marginRight: '8px' }} />
                            {editType ? 'ОБНОВИТЬ' : 'СОХРАНИТЬ'}
                        </Button>

                    </Form>
                </Card>
            </div>
        </>
    ));
};

export default IusPtType;