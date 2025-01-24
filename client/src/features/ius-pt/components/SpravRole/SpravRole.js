import React, { useEffect, useState } from 'react';
import { Table, Button, Collapse } from 'react-bootstrap';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa'; // Иконки для раскрытия/сворачивания
import iusPtStore from '../../store/IusPtStore';
import styles from './style.module.css'; // Импорт стилей

const SpravRole = () => {
    const [expandedGroups, setExpandedGroups] = useState({}); // Состояние для отслеживания раскрытых групп
    const [roles, setRoles] = useState([]); // Локальное состояние для хранения ролей

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

    // Обработчик для сворачивания/разворачивания групп
    const toggleGroup = (typename) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [typename]: !prev[typename], // Инвертируем текущее состояние группы
        }));
    };

    return (
        <Table striped bordered hover className={styles.table}>
            <thead>
                <tr className={styles.header}>
                    <th>Type Name</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Mandat</th>
                    <th>Business Process</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(groupedData).map((typename) => (
                    <React.Fragment key={typename}>
                        {/* Родительская строка для группы */}
                        <tr className={styles.row}>
                            <td colSpan={6}>
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
                                    {typename} ({groupedData[typename].length} элементов)
                                </Button>
                            </td>
                        </tr>
                        {/* Дочерние строки группы */}
                        <Collapse in={expandedGroups[typename]}>
                            <tbody>
                                {groupedData[typename].map((role, index) => (
                                    <tr key={`${typename}-${index}`} className={styles.childRow}>
                                        <td>{role.typename}</td>
                                        <td>{role.type}</td>
                                        <td>{role.name}</td>
                                        <td>{role.code}</td>
                                        <td>{role.mandat}</td>
                                        <td>{role.business_process}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Collapse>
                    </React.Fragment>
                ))}
            </tbody>
        </Table>
    );
};

export default SpravRole;