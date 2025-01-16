import React, { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './style.module.css'; // Импорт CSS модуля
import SearchBar from './SearchBar/SearchBar'; // Импорт компонента SearchBar
import UserTable from './UserTable/TableUser';  // Импорт компонента UserTable
import iusPtStore from '../Store/IusPtStore';

const IusPt = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
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
        return <div className={styles.errorMessage}>{error}</div>;
    }

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <>
            <h1 className={styles.pageHeader}>Пользователи</h1>
            <SearchBar onSearch={handleSearch} />
            <UserTable users={filteredUsers} />
        </>
    );
}

export default observer(IusPt);