import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';

const ButtonAll = ({ 
    icon: Icon, 
    text, 
    path, 
    onClick, 
    disabled = false,
    margin, // Новый проп для отступов
    padding // Новый проп для внутренних отступов
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (disabled) return;

        if (path) {
            navigate(path);
        } else if (onClick) {
            onClick();
        }
    };

    // Стили по умолчанию из CSS модуля
  

    return ( 
        <div className={styles.headerbtn} style={{ margin: margin }}>
            <button 
                className={`${styles.configbtn} ${disabled ? styles.disabled : ''}`} 
                onClick={handleClick}
                disabled={disabled}
                style={{ padding: padding }}
            >
                {Icon && <Icon size={20} className={styles.iconbtn} />}
                {text}
            </button>
        </div>
    );
};

ButtonAll.defaultProps = {
    margin: '16px 0 16px 8px', // Ваши текущие отступы из CSS
    padding: '4px 8px' // Ваши текущие внутренние отступы из CSS
};

export default ButtonAll;