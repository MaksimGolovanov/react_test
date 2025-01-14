import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value); // Передача значения поиска родительскому компоненту
    };

    return (
        <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginBottom: '10px', width: '100%' }}
        />
    );
};

export default SearchBar;