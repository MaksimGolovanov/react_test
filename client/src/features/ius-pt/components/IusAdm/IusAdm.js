import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { VscSaveAs, VscEdit, VscTrash } from "react-icons/vsc";
import { Button, Table, Form, Card, CardHeader, CardBody } from 'react-bootstrap';
import IusPtStore from '../../store/IusPtStore';

const IusAdm = observer(() => {
    const [newAdm, setNewAdm] = useState({ iusadm: '', description: '', email: '' });
    const [editingAdm, setEditingAdm] = useState(null);

    useEffect(() => {
        IusPtStore.fetchAdmins();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingAdm) {
            setEditingAdm(prevState => ({ ...prevState, [name]: value }));
        } else {
            setNewAdm(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingAdm) {
            await IusPtStore.updateAdmin(editingAdm);
            setEditingAdm(null);
        } else {
            await IusPtStore.createAdmin(newAdm);
            setNewAdm({ iusadm: '', description: '', email: '' });
        }
    };

    const handleEdit = (adm) => {
        setEditingAdm(adm);
    };

    const handleDelete = async (id) => {
        await IusPtStore.deleteAdmin(id);
    };

    return (
        <>
            <div style={{ display: 'flex', gap: '20px' }}>
                <Card style={{ width: '600px', padding: '10px' }}>
                    <CardHeader>
                        <h3>Список подписантов</h3>
                    </CardHeader>
                    <Table striped bordered hover variant="white" className='table-staff'>
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>ID</th>
                                <th style={{ width: '100px' }}>И.О. Фамилия</th>
                                <th>Должность</th>
                                <th>Email</th>
                                <th style={{ width: '100px' }}>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {IusPtStore.admins.map(adm => (
                                <tr key={adm.id}>
                                    <td>{adm.id}</td>
                                    <td>{adm.iusadm}</td>
                                    <td>{adm.description}</td>
                                    <td>{adm.email}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => handleEdit(adm)}>
                                            <VscEdit size={10} />
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDelete(adm.id)} style={{ marginLeft: '8px' }}>
                                            <VscTrash size={10} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>

                <Card style={{ width: '500px', height: '400px', padding: '10px' }}>
                    <CardHeader>
                        <h3>{editingAdm ? 'Редактирование подписанта' : 'Создание подписанта'}</h3>
                    </CardHeader>
                    <CardBody>
                        <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                            <Form.Group>
                                <Form.Label className='textModal'>И.О. Фамилия*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="iusadm"
                                    value={editingAdm ? editingAdm.iusadm : newAdm.iusadm}
                                    onChange={handleInputChange}
                                    placeholder="Введите И.О. Фамилия"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='textModal'>Должность*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={editingAdm ? editingAdm.description : newAdm.description}
                                    onChange={handleInputChange}
                                    placeholder="Введите должность"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='textModal'>E-mail*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    value={editingAdm ? editingAdm.email : newAdm.email}
                                    onChange={handleInputChange}
                                    placeholder="Введите Email"
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                className='button-next w-100 mt-2'
                            >
                                <VscSaveAs className={'icon-staff'} size={20} style={{ marginRight: '8px' }} />
                                {editingAdm ? 'ОБНОВИТЬ' : 'СОХРАНИТЬ'}
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </>
    );
});

export default IusAdm;