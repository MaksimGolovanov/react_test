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
                
                await iusPtStore.fetchStaffWithIusUserSimple();
                
            } catch (err) { 
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        
    }, []);
    
    const filteredUsers = useMemo(() => {
        return iusPtStore.staffWithIusUsersSimple.filter((staffUser) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                staffUser.tabNumber.toLowerCase().includes(searchLower) ||
                staffUser.fio.toLowerCase().includes(searchLower) ||
                staffUser.post.toLowerCase().includes(searchLower) ||
                staffUser.department.toLowerCase().includes(searchLower) ||
                staffUser.email.toLowerCase().includes(searchLower) ||
                (staffUser.IusUser && staffUser.IusUser.name.toLowerCase().includes(searchLower))
            );
        });
    }, [iusPtStore.staffWithIusUsersSimple, searchQuery]);

    const sortedUsers = useMemo(() => {
        return [...filteredUsers].sort((a, b) => {
            if (a.fio < b.fio) return -1;
            if (a.fio > b.fio) return 1;
            return 0;
        });
    }, [filteredUsers]);

    const handleUserClick = (tabNumber) => {
        navigate(`/iuspt/user/${tabNumber}`);
    };

    const handleSpravClick = () => {
        navigate(`/iuspt/sprav`);
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error?.message || 'Неизвестная ошибка'}</div>
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
            <div className={styles.tablehead}>
                <p style={{width: '45px'}}></p>
                <p style={{width: '250px'}}>ФИО</p>
                <p style={{width: '150px'}}>Имя для входа</p>
                <p style={{width: '250px'}}>Электронная почта</p>
                <p style={{width: '120px'}}>Табельный номер</p>
                <p style={{width: '300px'}}>Должность</p>
                <p>Подразделение</p>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                   
                    <tbody className={styles.bodyTable}>
                        {sortedUsers.map((staffUser, index) => (
                            <tr key={index}>
                                <td style={{width: '45px'}}>
                                    <Circle fullName={staffUser.fio} size={30} />
                                </td>
                                <td style={{width: '250px'}} className={styles.fioLink} onClick={() => handleUserClick(staffUser.tabNumber)}>{staffUser.fio}</td>
                                <td style={{width: '150px'}}>{staffUser.IusUser ? staffUser.IusUser.name : ''}</td>
                                <td style={{width: '250px'}}>{staffUser.email}</td>
                                <td style={{width: '120px'}}>{staffUser.tabNumber}</td>
                                <td style={{width: '300px'}}>{staffUser.post}</td>
                                <td >{staffUser.department?.length >= 13 ? staffUser.department.slice(13) : staffUser.department}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
});

export default IusPt;