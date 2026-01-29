import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { VscSaveAs, VscEdit, VscTrash } from "react-icons/vsc";
import { Button, Table, Form, Card, CardHeader, CardBody } from 'react-bootstrap';
import IusPtStore from '../../store/IusPtStore';

const IusAdm = observer(() => {
    const [newSignature, setNewSignature] = useState({ iusadm: '', description: '', email: '', cod: '' });
    const [editingSignature, setEditingSignature] = useState(null);

    useEffect(() => {
        // Используем правильный метод для загрузки подписей
        IusPtStore.fetchSignatures();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingSignature) {
            setEditingSignature(prevState => ({ ...prevState, [name]: value }));
        } else {
            setNewSignature(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingSignature) {
            await IusPtStore.updateSignature(editingSignature);
            setEditingSignature(null);
        } else {
            await IusPtStore.createSignature(newSignature);
            setNewSignature({ iusadm: '', description: '', email: '', cod: '' });
        }
    };

    const handleEdit = (signature) => {
        setEditingSignature(signature);
    };

    const handleDelete = async (id) => {
        await IusPtStore.deleteSignature(id);
    };

    // Получаем подписи из стора
    const signatures = IusPtStore.signatures || [];

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
                                <th style={{ width: '100px' }}>И.О. Фамилия</th>
                                <th>Должность</th>
                                <th>Email</th>
                                <th>Cod</th>
                                <th style={{ width: '100px' }}>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {signatures.map(signature => (
                                <tr key={signature.id}>
                                    <td>{signature.iusadm}</td>
                                    <td>{signature.description}</td>
                                    <td>{signature.email}</td>
                                    <td>{signature.cod}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => handleEdit(signature)}>
                                            <VscEdit size={10} />
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDelete(signature.id)} style={{ marginLeft: '8px' }}>
                                            <VscTrash size={10} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>

                <Card style={{ width: '500px', height: '450px', padding: '10px' }}>
                    <CardHeader>
                        <h3>{editingSignature ? 'Редактирование подписанта' : 'Создание подписанта'}</h3>
                    </CardHeader>
                    <CardBody>
                        <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                            <Form.Group>
                                <Form.Label className='textModal'>И.О. Фамилия*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="iusadm"
                                    value={editingSignature ? editingSignature.iusadm : newSignature.iusadm}
                                    onChange={handleInputChange}
                                    placeholder="Введите И.О. Фамилия"
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='textModal'>Должность*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={editingSignature ? editingSignature.description : newSignature.description}
                                    onChange={handleInputChange}
                                    placeholder="Введите должность"
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='textModal'>E-mail*</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={editingSignature ? editingSignature.email : newSignature.email}
                                    onChange={handleInputChange}
                                    placeholder="Введите Email"
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='textModal'>Cod*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cod"
                                    value={editingSignature ? editingSignature.cod : newSignature.cod}
                                    onChange={handleInputChange}
                                    placeholder="Введите Cod"
                                    required
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                className='button-next w-100 mt-2'
                                disabled={!newSignature.iusadm && !editingSignature}
                            >
                                <VscSaveAs className={'icon-staff'} size={20} style={{ marginRight: '8px' }} />
                                {editingSignature ? 'ОБНОВИТЬ' : 'СОХРАНИТЬ'}
                            </Button>
                            
                            {editingSignature && (
                                <Button
                                    variant="secondary"
                                    className='w-100 mt-2'
                                    onClick={() => setEditingSignature(null)}
                                >
                                    ОТМЕНИТЬ РЕДАКТИРОВАНИЕ
                                </Button>
                            )}
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </>
    );
});

export default IusAdm;