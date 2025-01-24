import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './style.module.css'; // Импорт CSS модуля
import iusPtStore from '../store/IusPtStore';
import SearchInput from '../components/SearchInput/SearchInput';
import Circle from '../../../../src/Components/circle/Circle';
import ButtonAll from '../components/ButtonAll/ButtonAll';
import { IoMdSettings } from 'react-icons/io';
import { useNavigate } from 'react-router-dom'; // Импорт useNavigate

const IusPt = observer(() => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate(); // Использование useNavigate

    // Загрузка данных о сотрудниках и их связях с пользователями ИУС
    useEffect(() => {
        iusPtStore.fetchStaffWithIusUsers();
    }, []);

    // Фильтрация пользователей по поисковому запросу
    const filteredUsers = iusPtStore.staffWithIusUsers.filter((staffUser) => {
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

    // Сортировка пользователей по ФИО
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (a.fio < b.fio) return -1;
        if (a.fio > b.fio) return 1;
        return 0;
    });

    // Обработчик клика по пользователю
    const handleUserClick = (id) => {
        navigate(`/iuspt/user/${id}`); // Переход на страницу пользователя
    };
    const handleSpravClick = () => {
        navigate(`/iuspt/sprav`); // Переход на страницу пользователя
    };
    return (
        <>
            <div className={styles.header}>
                <h1 className={styles.pageHeader}>Пользователи</h1>
            </div>
            <ButtonAll icon={IoMdSettings} text="Справочники" onClick={() => handleSpravClick()} />
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