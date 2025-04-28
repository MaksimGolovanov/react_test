import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './style.module.css';
import iusPtStore from "../../store/IusPtStore";
import { useNavigate } from 'react-router-dom';

const RoleSelectionModal = memo(({ show, onHide, roles, userRoles, stopRoles, userInfo, selectedUser }) => {
    const [selectedRoles, setSelectedRoles] = useState([]);
    const navigate = useNavigate();

    // Мемоизированные функции проверки ролей
    const hasRole = useCallback((role) => {
        return userRoles.some(
            (userRole) => userRole.IusSpravRole?.id === role.IusSpravRole?.id
        );
    }, [userRoles]);

    const findStopRole = useCallback((role) => {
        return stopRoles.find(
            (stopRole) => stopRole.CodName.trim() === role.IusSpravRole?.code.trim()
        );
    }, [stopRoles]);

    const isStopRole = useCallback((role) => {
        return !!findStopRole(role);
    }, [findStopRole]);

    // Инициализация selectedRoles
    useEffect(() => {
        const initialSelectedRoles = roles
            .filter(role => !hasRole(role) && !isStopRole(role))
            .map(role => role.IusSpravRole?.id);
        setSelectedRoles(initialSelectedRoles);
    }, [roles, hasRole, isStopRole]);

    // Мемоизированный обработчик изменения чекбокса
    const handleCheckboxChange = useCallback((role) => {
        if (hasRole(role)) return;

        setSelectedRoles(prev => {
            const roleId = role.IusSpravRole?.id;
            return prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId];
        });
    }, [hasRole]);

    // Мемоизированная функция сохранения
    const saveSelectedRoles = useCallback(async () => {
        const tabNumber = selectedUser.tabNumber;
        
        if (!tabNumber) {
            console.error("Ошибка: табельный номер не указан.");
            alert("Ошибка: табельный номер не указан.");
            return;
        }

        try {
            await iusPtStore.addRolesToUser(tabNumber, selectedRoles);
            alert("Роли успешно сохранены!");
            onHide();
            navigate(`/iuspt/user/${tabNumber}`);
        } catch (error) {
            console.error("Ошибка при сохранении ролей:", error);
            alert("Ошибка при сохранении ролей.");
        }
    }, [selectedRoles, selectedUser, onHide, navigate]);

    // Мемоизированное вычисление классов строк
    const getRowClass = useCallback((role) => {
        if (isStopRole(role)) return styles.stopRoleRow;
        if (hasRole(role)) return styles.disabledRow;
        return '';
    }, [isStopRole, hasRole]);

    // Мемоизированный рендеринг строк таблицы
    const renderRoleRow = useCallback((role) => {
        const stopRole = findStopRole(role);
        const isRoleSelected = selectedRoles.includes(role.IusSpravRole?.id);
        const isDisabled = hasRole(role);
        const isStopRoleActive = isStopRole(role);

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
                    {isStopRoleActive ? 'Запрещено' : ''}
                </td>
                <td>
                    {stopRole ? stopRole.CanDoWithoutApproval : ''}
                </td>
                <td>
                    <input
                        type="checkbox"
                        checked={isRoleSelected}
                        disabled={isDisabled}
                        onChange={() => handleCheckboxChange(role)}
                    />
                </td>
            </tr>
        );
    }, [selectedRoles, findStopRole, hasRole, isStopRole, getRowClass, handleCheckboxChange]);

    // Мемоизированный список ролей
    const roleRows = useMemo(() => {
        return roles.map(role => renderRoleRow(role));
    }, [roles, renderRoleRow]);

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
                            {roleRows}
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
});

export default RoleSelectionModal;