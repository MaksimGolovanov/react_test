import React, { useState, useEffect, useMemo } from 'react';
import { Button, Table, Form, Card, CardHeader, CardBody } from 'react-bootstrap';
import IusPtStore from '../../store/IusPtStore';
import styles from './style.module.css'; // Импорт CSS модуля
import { VscSaveAs, VscEdit } from "react-icons/vsc";
import { useObserver } from 'mobx-react-lite';

const IusPtAdmin = () => {
    const [newAdm, setNewAdm] = useState({ iusadm: '', description: '' });
    const [editAdm, setEditAdm] = useState(null); // Состояние для редактирования

    useEffect(() => {
        IusPtStore.fetchAdmin();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editAdm) {
            setEditAdm(prevState => ({ ...prevState, [name]: value }));
        } else {
            setNewAdm(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editAdm) {
            await IusPtStore.updateAdm(editAdm);
            setEditAdm(null);
        } else {
            await IusPtStore.createAdm(newAdm);
            setNewAdm({ iusadm: '', description: '' });
        }
    };

    const handleEdit = (admin) => {
        setEditAdm(admin);
    };

    return useObserver(() => (
        <>
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                <Card style={{ width: '500px', padding: '10px' }}>
                    <CardHeader>
                        <h3>Список Администраторов</h3>
                    </CardHeader>
                    <Table striped bordered hover variant="white" className={styles.tableadm}>
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>ID</th>
                                <th style={{ width: '100px' }}>И.О. Фамилия</th>
                                <th>Описание</th>
                                <th style={{ width: '50px' }}>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {IusPtStore.admin.map(admin => (
                                <tr key={admin.id}>
                                    <td>{admin.id}</td>
                                    <td>{admin.iusadm}</td>
                                    <td>{admin.description}</td>
                                    <td>
                                        <Button variant="link" onClick={() => handleEdit(admin)}>
                                            <VscEdit size={20} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>

                <Card style={{ width: '500px', height: '300px', padding: '10px' }}>
                    <CardHeader>
                        <h3>{editAdm ? 'Редактирование Администратора' : 'Добавление Администратора'}</h3>
                    </CardHeader>
                    <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                        <Form.Group>
                            <Form.Label className='textModal'>И.О. Фамилия*</Form.Label>
                            <Form.Control
                                type="text"
                                name="iusadm"
                                value={editAdm ? editAdm.iusadm : newAdm.iusadm}
                                onChange={handleInputChange}
                                placeholder="И.О. Фамилия"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='textModal'>Описание*</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={editAdm ? editAdm.description : newAdm.description}
                                onChange={handleInputChange}
                                placeholder="Введите описание"
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            className='button-next w-100 mt-2'
                        >
                            <VscSaveAs className={'icon-staff'} size={20} style={{ marginRight: '8px' }} />
                            {editAdm ? 'ОБНОВИТЬ' : 'СОХРАНИТЬ'}
                        </Button>

                    </Form>
                </Card>
            </div>
        </>
    ));
};

export default IusPtAdmin;