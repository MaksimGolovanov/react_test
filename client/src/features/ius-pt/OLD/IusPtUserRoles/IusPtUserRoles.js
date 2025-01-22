import React, { useEffect, useState } from 'react';
import iusPtStore from '../../store/IusPtStore';

const UserTable = ({ info }) => {
    const tab = info.tab_num;
    const [userRoles, setUserRoles] = useState([]);
    const [rolesData, setRolesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedGroups, setExpandedGroups] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                // Загружаем данные из хранилища
                await Promise.all([
                    iusPtStore.fetchUsersRoles(),
                    iusPtStore.fetchRole(),
                ]);

                // Получаем данные из хранилища
                const usersRoles = iusPtStore.usersroles;
                const roles = iusPtStore.roles;

                // Фильтруем роли пользователя по табельному номеру
                const foundUserRoles = usersRoles.filter(user => user.tabNumber === tab);

                // Соединяем данные из IusUserRole и roles
                const joinedData = foundUserRoles.map(userRole => {
                    const roleInfo = roles.find(role => role.id === userRole.cod);
                    return {
                        ...userRole,
                        ...roleInfo, // Добавляем данные из roles
                    };
                });
                console.log(joinedData)
                setUserRoles(joinedData);
                setRolesData(roles); // Сохраняем данные roles для группировки
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [tab]);

    // Группировка ролей по полю `typename`
    const groupedRoles = userRoles.reduce((acc, role) => {
        const groupKey = role.typename || 'Без категории'; // Группируем по `typename`
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(role);
        return acc;
    }, {});

    // Функция для сворачивания/разворачивания групп
    const toggleGroup = (groupName) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupName]: !prev[groupName],
        }));
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    }

    return (
        <div>
            <h1>Табельный номер: {tab}</h1>
            {Object.keys(groupedRoles).length === 0 ? (
                <p>Роли для данного пользователя не найдены.</p>
            ) : (
                <table border="1" cellPadding="10" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>Категория (typename)</th>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Mandat</th>
                            <th>Business Process</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedRoles).map(([groupName, roles]) => (
                            <React.Fragment key={groupName}>
                                <tr onClick={() => toggleGroup(groupName)} style={{ cursor: 'pointer' }}>
                                    <td colSpan="6">
                                        {groupName} ({roles.length}) {expandedGroups[groupName] ? '▼' : '▶'}
                                    </td>
                                </tr>
                                {expandedGroups[groupName] &&
                                    roles.map((role, index) => (
                                        <tr key={index}>
                                            <td></td>
                                            <td>{role.type}</td>
                                            <td>{role.name}</td>
                                            <td>{role.code}</td>
                                            <td>{role.mandat}</td>
                                            <td>{role.business_process}</td>
                                        </tr>
                                    ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserTable;