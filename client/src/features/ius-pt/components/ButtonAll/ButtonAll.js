import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';

const ButtonAll = ({ icon: Icon, text, path, onClick, disabled = false }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (disabled) return; // Если кнопка неактивна, ничего не делаем

        if (path) {
            navigate(path); // Переход на другую страницу, если передан path
        } else if (onClick) {
            onClick(); // Вызов функции, если передан onClick
        }
    };

    return ( 
        <div className={styles.headerbtn}>
            <button 
                className={`${styles.configbtn} ${disabled ? styles.disabled : ''}`} 
                onClick={handleClick}
                disabled={disabled} // Отключаем кнопку, если disabled=true
            >
                
                {text}
            </button>
        </div>
    );
};

export default ButtonAll;