import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import styles from './style.module.css';

const EditUserModal = ({ show, handleClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        fio: user.fio || '',
        email: user.email || '',
        department: user.department || '',
        post: user.post || '',
        employeeNumber: user.employeeNumber || '',
        contractDetails: user.contractDetails || '',
        location: user.location || '',
        computerName: user.computerName || '',
        phone: user.phone || '',
        ipAddress: user.ipAddress || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); // Передаем обновленные данные в родительский компонент
        handleClose(); // Закрываем модальное окно
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" backdropClassName={styles.backdrop}>
            <Modal.Header closeButton>
                <Modal.Title>Редактирование данных пользователя</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Имя пользователя</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formFio">
                        <Form.Label>Фамилия Имя Отчество</Form.Label>
                        <Form.Control
                            type="text"
                            name="fio"
                            value={formData.fio}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                        <Form.Label>Электронная почта</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formDepartment">
                        <Form.Label>Подразделение</Form.Label>
                        <Form.Control
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formPost">
                        <Form.Label>Должность</Form.Label>
                        <Form.Control
                            type="text"
                            name="post"
                            value={formData.post}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formEmployeeNumber">
                        <Form.Label>Табельный номер</Form.Label>
                        <Form.Control
                            type="text"
                            name="employeeNumber"
                            value={formData.employeeNumber}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formContractDetails">
                        <Form.Label>Реквизиты договора о конфиденциальности</Form.Label>
                        <Form.Control
                            type="text"
                            name="contractDetails"
                            value={formData.contractDetails}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formLocation">
                        <Form.Label>Расположение (город, адрес)</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formComputerName">
                        <Form.Label>Имя компьютера</Form.Label>
                        <Form.Control
                            type="text"
                            name="computerName"
                            value={formData.computerName}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formPhone">
                        <Form.Label>Контактный телефон</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formIpAddress">
                        <Form.Label>IP адрес</Form.Label>
                        <Form.Control
                            type="text"
                            name="ipAddress"
                            value={formData.ipAddress}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Закрыть
                        </Button>
                        <Button variant="primary" type="submit">
                            Сохранить изменения
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditUserModal;