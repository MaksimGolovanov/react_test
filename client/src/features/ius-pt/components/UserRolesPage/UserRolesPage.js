import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react-lite';
import iusPtStore from "../../store/IusPtStore";
import styles from './style.module.css'; // Импорт стилей
import SearchInput from '../SearchInput/SearchInput'; // Исправлено название компонента

const UserRolesPage = observer(({ info }) => {
    const [selectedType, setSelectedType] = useState(null); // Состояние для выбранного типа ИУС
    const [selectedRoles, setSelectedRoles] = useState([]); // Состояние для выбранных ролей
    const [searchQuery, setSearchQuery] = useState(""); // Состояние для поискового запроса

    useEffect(() => {
        iusPtStore.fetchRoles(); // Загружаем роли при монтировании компонента
    }, []);
    
    // Фильтруем роли по выбранному типу и поисковому запросу
    const filteredRoles = selectedType
        ? iusPtStore.roles
              .filter(
                  (role) =>
                      role.typename === selectedType &&
                      (role.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       role.name.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .sort((a, b) => a.code.localeCompare(b.code)) // Сортировка по полю code
        : [];

    // Обработчик изменения состояния выбора роли
    const handleRoleSelect = (roleId) => {
        setSelectedRoles((prevSelectedRoles) => {
            if (prevSelectedRoles.includes(roleId)) {
                // Если роль уже выбрана, удаляем её из списка
                return prevSelectedRoles.filter((id) => id !== roleId);
            } else {
                // Если роль не выбрана, добавляем её в список
                return [...prevSelectedRoles, roleId];
            }
        });
    };

    // Обработчик сохранения выбранных ролей
    const saveSelectedRoles = async () => {
        const tabNumber = info.IusUser?.tabNumber;
        if (!tabNumber) {
            console.error("Ошибка: табельный номер не указан.");
            alert("Ошибка: табельный номер не указан.");
            return;
        }
    
        try {
            await iusPtStore.addRolesToUser(tabNumber, selectedRoles);
            alert("Роли успешно сохранены!");
        } catch (error) {
            console.error("Ошибка при сохранении ролей:", error);
            alert("Ошибка при сохранении ролей.");
        }
    };

    return (
        <div className={styles.container}>
            <h5>Выбор ИУС</h5>

            <div className={styles.layout}>
                {/* Список типов ИУС слева */}
                <div className={styles.types}>
                    {iusPtStore.rolesTypes.map((type, index) => (
                        <div
                            key={index}
                            className={`${styles.row} ${selectedType === type ? styles.selected : ''}`}
                            onClick={() => setSelectedType(type)} // Выбираем тип при клике
                        >
                            {type}
                        </div>
                    ))}
                </div>

                {/* Список ролей справа */}
                <div className={styles.roles}>
                    {/* Компонент поиска */}
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Поиск ролей..."
                    />
                    {selectedType && (
                        <>
                            <div className={styles.headerRow}>
                                <h6>Роли для ИУС: {selectedType}</h6>
                                <div className={styles.selectedCount}>
                                    Выбрано ролей: {selectedRoles.length}
                                </div>
                            </div>
                            <div className={styles.rolesList}>
                                {filteredRoles.map((role, index) => (
                                    <div key={index} className={styles.row}>
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.includes(role.id)} // Проверяем, выбрана ли роль
                                            onChange={() => handleRoleSelect(role.id)} // Обрабатываем выбор роли
                                            className={styles.checkbox}
                                        />
                                        <div className={styles.roleDetails}>
                                            <div className={styles.rolecode}>{role.code}</div>
                                            <div className={styles.rolename}>{role.name}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Кнопка для сохранения выбранных ролей */}
                            <button onClick={saveSelectedRoles} className={styles.saveButton}>
                                Сохранить выбранные роли
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

export default UserRolesPage;