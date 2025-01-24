import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import styles from './style.module.css';

const EditUserModal = ({ show, handleClose, user, onSave, isLoading, error }) => {
    // Инициализация состояния формы
    const [formData, setFormData] = useState({
        name: user.IusUser ? user.IusUser.name : '-',
        fio: user.fio || '-',
        email: user.email || '-',
        department: user.department?.slice(13) || '-',
        post: user.post || '-',
        tab_num: user.tab_num || '-',
        contractDetails: user.IusUser ? user.IusUser.contractDetails : '-',
        location: user.location || '-',
        computerName: user.IusUser ? user.IusUser.computerName : '-',
        telephone: user.telephone || '-',
        ip: user.ip || '-',
    });

    // Обработчик изменения значений полей
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); // Передача обновленных данных
        
    };

    // Массив с описанием полей формы
    const fields = [
        { id: 'name', label: 'Имя пользователя', type: 'text', readOnly: false },
        { id: 'fio', label: 'Фамилия Имя Отчество', type: 'text', readOnly: true },
        { id: 'email', label: 'Электронная почта', type: 'email', readOnly: true },
        { id: 'department', label: 'Подразделение', type: 'text', readOnly: true },
        { id: 'post', label: 'Должность', type: 'text', readOnly: true },
        { id: 'tab_num', label: 'Табельный номер', type: 'text', readOnly: true },
        { id: 'contractDetails', label: 'Реквизиты договора о конфиденциальности', type: 'text', readOnly: false },
        { id: 'location', label: 'Расположение (город, адрес)', type: 'text', readOnly: false },
        { id: 'computerName', label: 'Имя компьютера', type: 'text', readOnly: false },
        { id: 'telephone', label: 'Контактный телефон', type: 'text', readOnly: true },
        { id: 'ip', label: 'IP адрес', type: 'text', readOnly: true },
    ];

    return (
        <Modal show={show} onHide={handleClose} size="lg" backdropClassName={styles.backdrop}>
            <Modal.Header closeButton>
                <Modal.Title>Редактирование данных пользователя</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Динамическое создание полей формы */}
                    {fields.map((field) => (
                        <Form.Group controlId={`form${field.id}`} key={field.id}>
                            <Form.Label className={styles.formlabel}>{field.label}</Form.Label>
                            <Form.Control
                                className={styles.formcontrol}
                                type={field.type}
                                name={field.id}
                                value={formData[field.id]}
                                onChange={handleChange}
                                readOnly={field.readOnly}
                                disabled={isLoading} // Отключаем поля при загрузке
                            />
                        </Form.Group>
                    ))}

                    {/* Отображение ошибки */}
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                            Закрыть
                        </Button>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditUserModal;