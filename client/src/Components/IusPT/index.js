// IusPt.js
import React, { useState, useEffect } from 'react';
import { useObserver } from 'mobx-react-lite';
import './style.css'
import SearchBar from './SearchBar/SearchBar'; // Импорт компонента SearchBar
import UserTable from './UserTable/TableUser';  // Импорт компонента UserTable
import iusPtStore from '../Store/IusPtStore';

const IusPt = () => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        iusPtStore.fetchUsers();
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredUsers = iusPtStore.users.filter(user => {
        return user.fio.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return useObserver(() => (
        <>
            <h1 className="page-header">Пользователи</h1>
            <SearchBar onSearch={handleSearch} />
            <UserTable users={filteredUsers} />
        </>
    ));
}

export default IusPt;