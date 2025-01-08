import React, { useState, useEffect } from 'react';
import { useObserver } from 'mobx-react-lite';
import userStore from '../Store/UserStore';
import { Button, Table, Form, Card, CardHeader, CardBody } from 'react-bootstrap';

import { VscSaveAs } from "react-icons/vsc";

const RoleSprav = () => {
    
    const [newRole, setNewRole] = useState({ role: '', description: '' });

    useEffect(() => {
        userStore.fetchRoles();
    }, []);

    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRole(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await userStore.createRole(newRole);
        
        setNewRole({ role: '', description: '' });
    };

    return useObserver(() => (
        <>
            <div style={{ display: 'flex', gap: '20px' }}>
                <Card style={{ width: '500px', padding: '10px' }}>
                    <CardHeader>
                        <h3>Список ролей</h3>
                    </CardHeader>
                    <Table striped bordered hover variant="white" className='table-staff'>
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>ID</th>
                                <th style={{ width: '100px' }}>Название роли</th>
                                <th >Описание</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userStore.roles.map(role => (
                                <tr key={role.id}>
                                    <td>{role.id}</td>
                                    <td>{role.role}</td>
                                    <td>{role.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>

                <Card style={{ width: '500px', height:'300px', padding: '10px' }}>
                    <CardHeader>
                        <h3>Создание роли</h3>
                    </CardHeader>
                    <CardBody>
                        <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                            <Form.Group>
                                <Form.Label className='textModal'>Название роли*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="role"
                                    value={newRole.role}
                                    onChange={handleInputChange}
                                    placeholder="Введите название роли"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='textModal'>Описание роли*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={newRole.description}
                                    onChange={handleInputChange}
                                    placeholder="Введите описание роли"
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
                    </CardBody>
                </Card>
            </div>
           
        </>
    ));
};

export default RoleSprav;