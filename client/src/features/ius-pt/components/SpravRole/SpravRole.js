import React, { useEffect, useState } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa'; // Иконки для раскрытия/сворачивания
import iusPtStore from '../../store/IusPtStore';
import styles from './style.module.css'; // Импорт стилей
import SearchInput from '../SearchInput/SearchInput';
import ButtonAll from '../ButtonAll/ButtonAll'
import { IoCreateOutline } from "react-icons/io5";
import AddRoleModal from './AddRoleModal'; // Импортируем модальное окно

const SpravRole = () => {
    const [expandedGroups, setExpandedGroups] = useState({}); // Состояние для отслеживания раскрытых групп
    const [roles, setRoles] = useState([]); // Локальное состояние для хранения ролей
    const [searchQuery, setSearchQuery] = useState(''); // Состояние для поискового запроса
    const [showModal, setShowModal] = useState(false); // Состояние для отображения модального окна

    // Загрузка данных при монтировании компонента
    useEffect(() => {
        iusPtStore.fetchRoles().then(() => {
            setRoles(iusPtStore.roles); // Обновляем локальное состояние после загрузки данных
        });
    }, []);

    // Группировка данных по `typename`
    const groupedData = roles.reduce((acc, role) => {
        const key = role.typename;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(role);
        return acc;
    }, {});

    // Фильтрация данных по поисковому запросу
    const filteredGroupedData = Object.keys(groupedData).reduce((acc, typename) => {
        const filteredRoles = groupedData[typename].filter((role) =>
            role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            role.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            role.typename.toLowerCase().includes(searchQuery.toLowerCase()) ||
            role.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filteredRoles.length > 0) {
            acc[typename] = filteredRoles;
        }
        return acc;
    }, {});

    // Обработчик для сворачивания/разворачивания групп
    const toggleGroup = (typename) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [typename]: !prev[typename], // Инвертируем текущее состояние группы
        }));
    };
    const handleSaveRole = async (newRole) => {
        try {
            await iusPtStore.createRole(newRole); // Отправляем данные на сервер
            setRoles([...roles, newRole]); // Обновляем локальное состояние
        } catch (error) {
            console.error('Ошибка при добавлении роли:', error);
        }
    };

    return (
        <>
            <ButtonAll icon={IoCreateOutline} text="Добавить роль" onClick={() => setShowModal(true)} />
            {/* Поле поиска */}
            <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Поиск ролей..."
                styles className={styles.search}
            />

            {/* Таблица с данными */}
            <div className={styles.container}>
                {/* Заголовок */}
                <div className={styles.header}>
                    <div >Тип</div>
                    <div>SID</div>
                    <div>Функциональная роль/Бизнес-роль </div>
                    <div>Код роли</div>
                    <div>Мандат</div>
                    <div>Бизнес процесс</div>
                </div>

                {/* Группы */}
                <div className={styles.tableBody}>
                    {Object.keys(filteredGroupedData).map((typename) => (
                        <div key={typename} className={styles.group}>
                            {/* Родительская строка для группы */}
                            <div className={styles.groupHeader}>
                                <Button
                                    variant="link"
                                    onClick={() => toggleGroup(typename)}
                                    aria-controls={`group-${typename}`}
                                    aria-expanded={expandedGroups[typename]}
                                    className={styles.toggleButton}
                                >
                                    <span className={styles.icon}>
                                        {expandedGroups[typename] ? <FaAngleDown /> : <FaAngleRight />}
                                    </span>
                                    {typename} ({filteredGroupedData[typename].length} элементов)
                                </Button>
                            </div>

                            {/* Дочерние строки группы */}
                            <Collapse in={expandedGroups[typename]}>
                                <div id={`group-${typename}`} className={styles.groupContent}>
                                    {filteredGroupedData[typename].map((role, index) => (
                                        <div key={`${typename}-${index}`} className={styles.row}>
                                            <div>{role.typename}</div>
                                            <div>{role.type}</div>
                                            <div>{role.name}</div>
                                            <div>{role.code}</div>
                                            <div>{role.mandat}</div>
                                            <div>{role.business_process}</div>
                                        </div>
                                    ))}
                                </div>
                            </Collapse>
                        </div>
                    ))}
                </div>
            </div>
            <AddRoleModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSave={handleSaveRole}
            />
        </>
    );
};


export default SpravRole;