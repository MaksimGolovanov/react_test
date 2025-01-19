import React, { useState } from 'react';
import styles from './SearchBar.module.css'; // Импорт CSS модуля

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value);
    };

    return (
        <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
        />
    );
};

export default SearchBar;