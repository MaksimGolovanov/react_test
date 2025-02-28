import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './style.module.css';
import iusPtStore from "../../store/IusPtStore";
import { useNavigate } from 'react-router-dom';

const RoleSelectionModal = ({ show, onHide, roles, userRoles, stopRoles, userInfo, selectedUser }) => {
    const [selectedRoles, setSelectedRoles] = useState([]);
    const navigate = useNavigate();
    // Инициализация selectedRoles при монтировании компонента
    useEffect(() => {
        const initialSelectedRoles = roles
            .filter(role => !hasRole(role) && !isStopRole(role)) // Исключаем роли, которые уже есть у пользователя, и стоп-роли
            .map(role => role.IusSpravRole?.id);
        setSelectedRoles(initialSelectedRoles);
    }, [roles, userRoles, stopRoles]);

    // Функция для проверки наличия роли у пользователя
    const hasRole = (role) => {
        return userRoles.some(
            (userRole) => userRole.IusSpravRole?.id === role.IusSpravRole?.id
        );
    };

    // Функция для поиска стоп-роли
    const findStopRole = (role) => {
        return stopRoles.find(
            (stopRole) => stopRole.CodName.trim() === role.IusSpravRole?.code.trim()
        );
    };

    // Функция для проверки, является ли роль стоп-ролью
    const isStopRole = (role) => {
        return !!findStopRole(role);
    };

    // Функция для определения классов строки таблицы
    const getRowClass = (role) => {
        if (isStopRole(role)) return styles.stopRoleRow;
        if (hasRole(role)) return styles.disabledRow;
        return '';
    };

    // Обработчик изменения состояния чекбокса
    const handleCheckboxChange = (role) => {
        if (hasRole(role)) return; // Отключаем выбор, если роль уже есть у пользователя

        const isSelected = selectedRoles.includes(role.IusSpravRole?.id);
        if (isSelected) {
            setSelectedRoles(selectedRoles.filter(id => id !== role.IusSpravRole?.id));
        } else {
            setSelectedRoles([...selectedRoles, role.IusSpravRole?.id]);
        }
    };

    // Функция для сохранения выбранных ролей
    const saveSelectedRoles = async () => {
        const tabNumber = selectedUser.tabNumber;
        console.log(tabNumber)
        if (!tabNumber) {
            console.error("Ошибка: табельный номер не указан.");
            alert("Ошибка: табельный номер не указан.");
            return;
        }

        try {
            await iusPtStore.addRolesToUser(tabNumber, selectedRoles);
            alert("Роли успешно сохранены!");
            onHide(); // Закрываем модальное окно после успешного сохранения
            navigate(`/iuspt/user/${tabNumber}`);
        } catch (error) {
            console.error("Ошибка при сохранении ролей:", error);
            alert("Ошибка при сохранении ролей.");
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton className={styles.modalHeader}>
                <Modal.Title className={styles.modalTitle}>Выбранные роли</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={styles.tablehead}>
                    <p className={styles.tableheadfio}>Код</p>
                    <p className={styles.tableheadname}>Система</p>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <tbody>
                            {roles.map((role) => {
                                const stopRole = findStopRole(role); // Находим стоп-роль
                                const isRoleSelected = selectedRoles.includes(role.IusSpravRole?.id);
                                const isDisabled = hasRole(role); // Чекбокс отключен, если роль уже есть у пользователя
                                const isStopRoleActive = isStopRole(role); // Проверяем, является ли роль стоп-ролью

                                return (
                                    <tr
                                        key={role.IusSpravRole?.id || role.code}
                                        className={`${styles.bodyTableTr} ${getRowClass(role)}`}
                                    >
                                        <td className={styles.code}>
                                            <p>{role.IusSpravRole?.code || 'Нет названия'}</p>
                                        </td>
                                        <td className={styles.typename}>
                                            {role.IusSpravRole?.typename || 'Нет типа'}
                                        </td>
                                        <td>
                                            {isStopRole(role) ? 'Запрещено' : ''}
                                        </td>
                                        <td>
                                            {stopRole ? stopRole.CanDoWithoutApproval : ''}
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={isRoleSelected} // Галочка ставится, если роль выбрана
                                                disabled={isDisabled} // Отключаем, если роль уже есть у пользователя
                                                onChange={() => handleCheckboxChange(role)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer className={styles.modalFooter}>
                <Button variant="secondary" onClick={onHide} className={styles.buttonSecondary}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={saveSelectedRoles} className={styles.buttonPrimary}>
                    Подтвердить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RoleSelectionModal;