import React from 'react';
import { useNavigate } from 'react-router-dom';
import userStore from '../../features/admin/store/UserStore'; // Укажите путь к вашему хранилищу
import { FaSignOutAlt } from 'react-icons/fa'; // Импортируем иконку
import { Button } from 'react-bootstrap';
import styles from './style.module.css';

const ButtonLogout = () => {
    const navigate = useNavigate();
    

    const handleLogout = () => {
        userStore.logout(); // Вызов метода logout из вашего хранилища
        navigate('/login'); // Перенаправление на страницу входа
    };

    return (
        <Button title='Выход' onClick={handleLogout} className={styles.logoutButton}>
            <FaSignOutAlt  />
        </Button>
    );
};

export default ButtonLogout;