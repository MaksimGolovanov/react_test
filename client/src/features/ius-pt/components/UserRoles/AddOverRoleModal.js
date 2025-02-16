import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import styles from './style.module.css'; // Импорт стилей

const AddOverRoleModal = ({ show, onHide }) => {
    const [newRole, setNewRole] = useState({
        typename: '',
        type: '',
        name: '',
        code: '',
        mandat: '',
        business_process: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRole((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        // Передаем данные новой роли в родительский компонент
        onHide(); // Закрываем модальное окно
    };

    return (
        <Modal show={show} onHide={onHide} className={styles.modalAll} >
            <Modal.Header closeButton className={styles.modalHeader}>
                <Modal.Title className={styles.modalTitle}>Добавить новую роль</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className={styles.formLabel}>Тип</Form.Label>
                        <Form.Control
                            type="text"
                            name="typename"
                            value={newRole.typename}
                            onChange={handleInputChange}
                            className={styles.formControl}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer className={styles.modalFooter}>
                <Button variant="secondary" onClick={onHide} className={styles.buttonSecondary}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={handleSubmit} className={styles.buttonPrimary}>
                    Сохранить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddOverRoleModal;