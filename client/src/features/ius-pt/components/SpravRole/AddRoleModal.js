import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const AddRoleModal = ({ show, onHide, onSave }) => {
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
        onSave(newRole); // Передаем данные новой роли в родительский компонент
        onHide(); // Закрываем модальное окно
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Добавить новую роль</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Тип</Form.Label>
                        <Form.Control
                            type="text"
                            name="typename"
                            value={newRole.typename}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>SID</Form.Label>
                        <Form.Control
                            type="text"
                            name="type"
                            value={newRole.type}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Функциональная роль/Бизнес-роль</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={newRole.name}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Код роли</Form.Label>
                        <Form.Control
                            type="text"
                            name="code"
                            value={newRole.code}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Мандат</Form.Label>
                        <Form.Control
                            type="text"
                            name="mandat"
                            value={newRole.mandat}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Бизнес процесс</Form.Label>
                        <Form.Control
                            type="text"
                            name="business_process"
                            value={newRole.business_process}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Сохранить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddRoleModal;