import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';

const ButtonAll = ({ icon: Icon, text, path }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(path);
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