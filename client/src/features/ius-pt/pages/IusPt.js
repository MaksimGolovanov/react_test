import React, { useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './style.module.css';
import iusPtStore from '../store/IusPtStore';
import SearchInput from '../components/SearchInput/SearchInput';
import Circle from '../../../../src/Components/circle/Circle';
import ButtonAll from '../components/ButtonAll/ButtonAll';
import { IoMdSettings } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const IusPt = observer(() => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await iusPtStore.fetchStaffWithIusUsers();
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredUsers = useMemo(() => {
        return iusPtStore.staffWithIusUsers.filter((staffUser) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                staffUser.tab_num.toLowerCase().includes(searchLower) ||
                staffUser.fio.toLowerCase().includes(searchLower) ||
                staffUser.post.toLowerCase().includes(searchLower) ||
                staffUser.organization.toLowerCase().includes(searchLower) ||
                staffUser.department.toLowerCase().includes(searchLower) ||
                staffUser.email.toLowerCase().includes(searchLower) ||
                staffUser.telephone.toLowerCase().includes(searchLower) ||
                staffUser.ip.toLowerCase().includes(searchLower) ||
                (staffUser.IusUser && staffUser.IusUser.name.toLowerCase().includes(searchLower)) ||
                (staffUser.IusUser && staffUser.IusUser.contractDetails.toLowerCase().includes(searchLower)) ||
                (staffUser.IusUser && staffUser.IusUser.computerName.toLowerCase().includes(searchLower))
            );
        });
    }, [iusPtStore.staffWithIusUsers, searchQuery]);

    const sortedUsers = useMemo(() => {
        return [...filteredUsers].sort((a, b) => {
            if (a.fio < b.fio) return -1;
            if (a.fio > b.fio) return 1;
            return 0;
        });
    }, [filteredUsers]);

    const handleUserClick = (id) => {
        navigate(`/iuspt/user/${id}`);
    };

    const handleSpravClick = () => {
        navigate(`/iuspt/sprav`);
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    }

    return (
        <>
            <div className={styles.header}>
                <h1 className={styles.pageHeader}>Пользователи</h1>
            </div>
            <ButtonAll icon={IoMdSettings} text="Справочники" onClick={handleSpravClick} />
            <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Поиск пользователей..."
            />

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.headTable}>
                        <tr>
                            <th style={{ width: '45px' }}></th>
                            <th>ФИО</th>
                            <th>Имя для входа</th>
                            <th>Электронная почта</th>
                            <th>Табельный номер</th>
                            <th>Должность</th>
                            <th>Подразделение</th>
                        </tr>
                    </thead>
                    <tbody className={styles.bodyTable}>
                        {sortedUsers.map((staffUser, index) => (
                            <tr key={index}>
                                <td>
                                    <Circle fullName={staffUser.fio} size={30} />
                                </td>
                                <td style={{ color: '#117aa8' }} onClick={() => handleUserClick(staffUser.id)}>
                                    {staffUser.fio}
                                </td>
                                <td>{staffUser.IusUser ? staffUser.IusUser.name : ''}</td>
                                <td>{staffUser.email}</td>
                                <td>{staffUser.tab_num}</td>
                                <td>{staffUser.post}</td>
                                <td>{staffUser.department.slice(13)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
});

export default IusPt;