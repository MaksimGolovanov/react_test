import React, { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import './style.css'
import SearchBar from './SearchBar/SearchBar'; // Импорт компонента SearchBar
import UserTable from './UserTable/TableUser';  // Импорт компонента UserTable
import iusPtStore from '../Store/IusPtStore';


const IusPt = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // Добавили состояние для отслеживания статуса загрузки
    const [error, setError] = useState(null);

    const filteredUsers = useMemo(() => {
        return iusPtStore.users.filter(user => {
            return user.fio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   user.email.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [iusPtStore.users, searchTerm]);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                await iusPtStore.fetchUsers();
            } catch (error) {
                console.error("Ошибка при загрузке пользователей:", error);
                setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    

    if (loading) {
        return <div>Загрузка...</div>; // Показываем индикатор загрузки
    }

    return (
        <>
            <h1 className="page-header">Пользователи</h1>
            <SearchBar onSearch={handleSearch} />
            <UserTable users={filteredUsers} />
        </>
    );
}

export default observer(IusPt);