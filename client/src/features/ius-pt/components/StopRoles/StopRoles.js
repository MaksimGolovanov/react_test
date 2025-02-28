import React, { useEffect, useState, useMemo } from 'react';
import iusPtStore from '../../store/IusPtStore';
import { observer } from 'mobx-react-lite';
import styles from './style.module.css'; // Импорт CSS модуля
import SearchInput from '../SearchInput/SearchInput';


const StopRoles = observer(() => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await iusPtStore.fetchStopRoles();
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredStopRoles = useMemo(() => {
        return iusPtStore.stopRoles.filter((stoproles) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                stoproles.CodName.toLowerCase().includes(searchLower) ||
                stoproles.Description.toLowerCase().includes(searchLower) ||
                stoproles.CanDoWithoutApproval.toLowerCase().includes(searchLower) ||
                stoproles.Owner.toLowerCase().includes(searchLower) ||
                stoproles.Note.toLowerCase().includes(searchLower) ||
                stoproles.Approvers.toLowerCase().includes(searchLower)
            );
        });
    }, [searchQuery]); 

    const sortedStopRoles = useMemo(() => {
        return [...filteredStopRoles].sort((a, b) => {
            if (a.CodName < b.CodName) return -1;
            if (a.CodName > b.CodName) return 1;
            return 0;
        });
    }, [filteredStopRoles]);
    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    }

    return (
        <>
            <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Поиск Стоп-Ролей..."
            />
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.headTable}>
                        <tr>
                            <th>Роль</th>
                            <th>Краткое описание роли</th>
                            <th>Кому можно без согласования</th>
                            <th>Владелец</th>
                            <th>Примечание</th>
                            <th>Согласующие</th>
                        </tr>
                    </thead>
                    <tbody className={styles.bodyTable}>
                        {sortedStopRoles.map((stoproles) => (
                            <tr key={`${stoproles.CodName}-${stoproles.Description}`}> {/* Уникальный ключ */}
                                <td>{stoproles.CodName}</td>
                                <td>{stoproles.Description}</td>
                                <td>{stoproles.CanDoWithoutApproval}</td>
                                <td>{stoproles.Owner}</td>
                                <td>{stoproles.Note}</td> 
                                <td>{stoproles.Approvers}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


        </>
    )

})

export default StopRoles