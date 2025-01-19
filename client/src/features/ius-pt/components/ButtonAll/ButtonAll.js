import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';

const ButtonAll = ({ icon: Icon, text, path, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (path) {
            navigate(path); // Переход на другую страницу, если передан path
        } else if (onClick) {
            onClick(); // Вызов функции, если передан onClick
        }
    };

    return (
        <div className={styles.headerbtn}>
            <button className={styles.configbtn} onClick={handleClick}>
                {Icon && <Icon size={20} />}
                {text}
            </button>
        </div>
    );
};

export default ButtonAll;