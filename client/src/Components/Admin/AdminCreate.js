import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '../Store/UserStore';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminCreate = observer(() => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        description: '',
        roles: []
    });

    useEffect(() => {
        userStore.fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRoleChange = (role) => {
        setFormData(prev => {
            const newRoles = prev.roles.includes(role)
                ? prev.roles.filter(r => r !== role)
                : [...prev.roles, role];
            return {
                ...prev,
                roles: newRoles
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting user data:', formData);

        const selectedRoleIds = userStore.roles
            .filter(role => formData.roles.includes(role.role))
            .map(role => role.id);

        try {
            const success = await userStore.createUser(
                formData.login,
                formData.password,
                selectedRoleIds,
                formData.description
            );

            if (success) {
                navigate('/admin');
            }
        } catch (error) {
            console.error('Error in handleCreateUser:', error);
        }
    };

    return (
        <div className="d-flex justify-content-start">
            <Card style={{ width: '600px', padding: '20px', margin: '20px' }}>
                <Card.Title className="mb-4">Создание пользователя</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Логин</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="login"
                                    value={formData.login}
                                    onChange={handleInputChange}
                                    placeholder="Введите логин"
                                />
                            </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Введите пароль"
                                    autoComplete="new-password"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Введите описание"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Роли</Form.Label>
                        <div className="d-flex flex-wrap gap-2">
                            {userStore.roles.map(role => (
                                <Form.Check
                                    key={role.id}
                                    type="checkbox"
                                    label={role.role}
                                    checked={formData.roles.includes(role.role)}
                                    onChange={() => handleRoleChange(role.role)}
                                    className="me-3"
                                />
                            ))}
                        </div>
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button 
                            variant="secondary" 
                            onClick={() => navigate('/admin')}
                        >
                            Отмена
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit"
                            disabled={!formData.login || !formData.password || formData.roles.length === 0}
                        >
                            Создать
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
});

export default AdminCreate;