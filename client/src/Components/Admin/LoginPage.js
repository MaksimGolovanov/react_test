import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import userStore from '../Store/UserStore'; // Убедитесь, что путь правильный

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Получаем функцию навигации

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const success = await userStore.login(login, password);
            if (success) {
                navigate('/'); // Перенаправление на главную страницу или панель управления
            } else {
                setErrorMessage('Неверные учетные данные. Пожалуйста, попробуйте еще раз.');
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            setErrorMessage('Произошла ошибка при входе. Попробуйте еще раз позже.');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Body>
                    <Card.Title className="text-center">Вход</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formLogin">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control
                                type="text"
                                name="login"
                                placeholder="Введите логин"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                autoComplete="username"
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Введите пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password" 
                            />
                        </Form.Group>

                        {errorMessage && (
                            <div className="text-danger mt-2">{errorMessage}</div>
                        )}

                        <Button variant="primary" type="submit" className="w-100 mt-4">
                            Войти
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default LoginPage;