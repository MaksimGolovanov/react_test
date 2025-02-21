import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './style.module.css';

const RoleSelectionModal = ({ show, onHide, roles, userRoles, stopRoles }) => {
    // Функция для проверки наличия роли у пользователя
    console.log(stopRoles)
    const hasRole = (role) => {
        return userRoles.some(
            (userRole) => userRole.IusSpravRole?.id === role.IusSpravRole?.id
        );
    };

    // Функция для проверки, является ли роль стоп-ролью
    const isStopRole = (role) => {
        return stopRoles.some(
            (stopRole) => stopRole.CodName.trim() === role.IusSpravRole?.code.trim()
        );
    };

    return (
        <Modal show={show} onHide={onHide} className={styles.modalAll2}>
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
                            {roles.map((role, index) => (
                                <tr
                                    key={index}
                                    className={`${styles.bodyTableTr} ${isStopRole(role) ? styles.stopRoleRow : hasRole(role) ? styles.disabledRow : ''}`}
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer className={styles.modalFooter}>
                <Button variant="secondary" onClick={onHide} className={styles.buttonSecondary}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={onHide} className={styles.buttonPrimary}>
                    Подтвердить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RoleSelectionModal;