import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ButtonAll from '../components/ButtonAll/ButtonAll';
import { IoArrowBack } from 'react-icons/io5';
import styles from './style.module.css'; // Импорт CSS модуля
import iusPtStore from '../store/IusPtStore';
import Circle from '../../../Components/circle/Circle';

const IusUserApplication = observer(() => {
    const { tabNumber } = useParams(); // Получаем ID пользователя из URL
    const navigate = useNavigate(); // Использование useNavigate
    const [user, setUser] = useState(null); // Состояние для хранения данных пользователя
    const [isLoading, setIsLoading] = useState(true); // Состояние для отображения загрузки
    const [error, setError] = useState(null); // Состояние для хранения ошибок

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Загружаем данные о сотрудниках и их связях с пользователями ИУС
                await iusPtStore.fetchStaffWithIusUsers();

                // Ищем пользователя по ID
                const foundUser = iusPtStore.staffWithIusUsers.find(
                    (staffUser) => staffUser.tabNumber === tabNumber // прямое сравнение строк
                );
                console.log(foundUser);
                if (foundUser) {
                    setUser(foundUser);
                } else {
                    setError('Пользователь не найден');
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Ошибка при загрузке данных');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [tabNumber]);

    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return <div>Данные не найдены</div>;

    // Группировка ролей по sid и дате из промежуточной таблицы IusUserRoles
    const groupedRoles = user.IusUser?.IusUserRoles?.reduce((acc, userRole) => {
        const role = userRole.IusSpravRoles; // Роль из связанной таблицы
        const key = `${role.type}-${userRole.createdAt}`; // Уникальный ключ для группировки
        if (!acc[key]) {
            acc[key] = {
                type: role.type,
                createdAt: userRole.createdAt,
                roles: [],
            };
        }
        acc[key].roles.push(role.name);
        return acc;
    }, {});
    console.log(groupedRoles)
    const groupedRolesArray = Object.values(groupedRoles || {});

    return (
        <>
            <div className={styles.header}>
                <span className={styles.pageHeader}>Заявки</span>
            </div>
            <ButtonAll icon={IoArrowBack} text="Назад" onClick={() => navigate('/iuspt')} />
            <div className={styles.userContainer}>
                <div>
                    <Circle fullName={user.fio} size={80} />
                </div>
                <div className={styles.userDetails}>
                    <p className={styles.fio}>{user.fio}</p>
                    <p className={styles.name}>{user.IusUser ? user.IusUser.name : '-'}</p>
                    <p className={styles.department}>
                        {user.department && user.department.length > 13
                            ? user.department.slice(13)
                            : user.department || '-'}
                    </p>
                </div>
            </div>

            {/* Таблица с ролями */}
            <div className={styles.tableContainer}>
                <h2>Роли пользователя</h2>
                <table className={styles.rolesTable}>
                    <thead>
                        <tr>
                            <th>Тип роли (SID)</th>
                            <th>Дата присвоения</th>
                            <th>Роли</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedRolesArray.map((group, index) => (
                            <tr key={index}>
                                <td>{group.type}</td>
                                <td>{new Date(group.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <ul>
                                        {group.roles.map((role, idx) => (
                                            <li key={idx}>{role}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
});

export default IusUserApplication;