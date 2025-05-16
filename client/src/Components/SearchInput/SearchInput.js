import React from 'react';
import styles from './style.module.css'; // Импорт CSS модуля
import { FaSearch, FaTimes } from 'react-icons/fa'; // Импорт иконки лупы и крестика

const SearchInput = ({ value, onChange, placeholder = 'Поиск...' }) => {
    const handleClearInput = () => {
        onChange(''); // Очищаем поле ввода
    };

    return (
        <div className={styles.searchContainer}>
            {/* Иконка лупы */}
            <span className={styles.searchIcon}>
                <FaSearch />
            </span>
            {/* Поле ввода */}
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={styles.searchInput}
            />
            {/* Иконка крестика для очистки поля */}

            <span className={styles.clearIcon} onClick={handleClearInput}>
                <FaTimes />
            </span>

        </div>
    );
};

export default SearchInput;