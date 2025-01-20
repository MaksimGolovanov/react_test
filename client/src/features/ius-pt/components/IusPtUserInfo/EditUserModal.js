import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import styles from './style.module.css';

const EditUserModal = ({ show, handleClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        fio: user.fio || '',
        email: user.email || '',
        department: user.department.slice(13) || '',
        post: user.post || '',
        tab_num: user.tab_num || '',
        contractDetails: user.contractDetails || '',
        location: user.location || '',
        computerName: user.computerName || '',
        telephone: user.telephone || '',
        ip: user.ip || '',
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
                        <Form.Label className={styles.formlabel}>Имя пользователя</Form.Label>
                        <Form.Control
                            className={styles.formcontrol}
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formFio">
                        <Form.Label className={styles.formlabel}>Фамилия Имя Отчество</Form.Label>
                        <Form.Control
                        className={styles.formcontrol}
                            type="text"
                            name="fio"
                            value={formData.fio}
                            onChange={handleChange}
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                        <Form.Label className={styles.formlabel}>Электронная почта</Form.Label>
                        <Form.Control
                        className={styles.formcontrol}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="formDepartment">
                        <Form.Label className={styles.formlabel}>Подразделение</Form.Label>
                        <Form.Control
                        className={styles.formcontrol}
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="formPost">
                        <Form.Label className={styles.formlabel}>Должность</Form.Label>
                        <Form.Control
                        className={styles.formcontrol}
                            type="text"
                            name="post"
                            value={formData.post}
                            onChange={handleChange}
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="formEmployeeNumber">
                        <Form.Label className={styles.formlabel}>Табельный номер</Form.Label>
                        <Form.Control
                        className={styles.formcontrol}
                            type="text"
                            name="tab_num"
                            value={formData.tab_num}
                            onChange={handleChange}
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="formContractDetails">
                        <Form.Label className={styles.formlabel}>Реквизиты договора о конфиденциальности</Form.Label>
                        <Form.Control
                        className={styles.formcontrol}
                            type="text"
                            name="contractDetails"
                            value={formData.contractDetails}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formLocation">
                        <Form.Label className={styles.formlabel}>Расположение (город, адрес)</Form.Label>
                        <Form.Control
                        className={styles.formcontrol}
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="formComputerName">
                        <Form.Label className={styles.formlabel}>Имя компьютера</Form.Label>
                        <Form.Control
                        className={styles.formcontrol}
                            type="text"
                            name="computerName"
                            value={formData.computerName}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formPhone">
                        <Form.Label className={styles.formlabel}>Контактный телефон</Form.Label>
                        <Form.Control
                        className={styles.formcontrol}
                            type="text"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleChange}
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="formIpAddress">
                        <Form.Label className={styles.formlabel}>IP адрес</Form.Label>
                        <Form.Control
                        className={styles.formcontrol}
                            type="text"
                            name="ip"
                            value={formData.ip}
                            onChange={handleChange}
                            readOnly
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