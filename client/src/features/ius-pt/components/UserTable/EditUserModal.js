import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Dropdown } from 'react-bootstrap';
import styles from './style.module.css';
import IusPtService from '../../services/IusPtService'; // Импорт сервиса для работы с API

const EditUserModal = ({ show, handleClose, user, onSave, isLoading, error }) => {
    const [formData, setFormData] = useState({
        name: user.IusUser ? user.IusUser.name : '-',
        fio: user.fio || '-',
        email: user.email || '-',
        department: user.department?.slice(13) || '-',
        post: user.post || '-',
        tabNumber: user.tabNumber || '-',
        contractDetails: user.IusUser ? user.IusUser.contractDetails : '-',
        location: user.IusUser ? user.IusUser.location : '-',
        computerName: user.IusUser ? user.IusUser.computerName : '-',
        telephone: user.telephone || '-',
        ip: user.ip || '-',
        manager: user.IusUser ? user.IusUser.manager : '-',
        managerEmail: user.IusUser ? user.IusUser.managerEmail : '-',
    });

    const [staffList, setStaffList] = useState([]); // Список сотрудников для выбора руководителя
    const [searchQuery, setSearchQuery] = useState(''); // Поисковый запрос
    const [isSearching, setIsSearching] = useState(false); // Состояние загрузки поиска

    // Загрузка списка сотрудников при открытии модального окна
    useEffect(() => {
        if (show) {
            fetchStaff();
        }
    }, [show]);

    // Загрузка списка сотрудников
    const fetchStaff = async () => {
        setIsSearching(true);
        try {
            const response = await IusPtService.fetchStaffWithIusUsers(); // Загрузка сотрудников
            setStaffList(response);
        } catch (error) {
            console.error('Ошибка при загрузке сотрудников:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // Обработчик изменения поискового запроса
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Обработчик выбора руководителя
    const handleManagerSelect = (staffUser) => {
        setFormData((prev) => ({
            ...prev,
            manager: staffUser.fio,
            managerEmail: staffUser.email,
        }));
    };

    // Фильтрация списка сотрудников по поисковому запросу
    const filteredStaff = staffList.filter((staffUser) =>
        staffUser.fio.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Остальные обработчики и поля формы
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const fields = [
        { id: 'name', label: 'Имя пользователя', type: 'text', readOnly: false },
        { id: 'fio', label: 'Фамилия Имя Отчество', type: 'text', readOnly: true },
        { id: 'email', label: 'Электронная почта', type: 'email', readOnly: true },
        { id: 'department', label: 'Подразделение', type: 'text', readOnly: true },
        { id: 'post', label: 'Должность', type: 'text', readOnly: true },
        { id: 'tabNumber', label: 'Табельный номер', type: 'text', readOnly: true },
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
                                disabled={isLoading}
                            />
                        </Form.Group>
                    ))}

                    {/* Поле для выбора руководителя */}
                    <Form.Group controlId="formManager">
                        <Form.Label className={styles.formlabel}>Ф.И.О. руководителя</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-manager" className={styles.formcontrol}>
                                {formData.manager || 'Выберите руководителя'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ width: '100%' }}>
                                <Form.Control
                                    type="text"
                                    placeholder="Поиск руководителя..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="mb-2"
                                />
                                {isSearching ? (
                                    <Dropdown.Item>Загрузка...</Dropdown.Item>
                                ) : (
                                    filteredStaff.map((staffUser) => (
                                        <Dropdown.Item
                                            key={staffUser.tabNumber}
                                            onClick={() => handleManagerSelect(staffUser)}
                                        >
                                            {staffUser.fio} ({staffUser.email})
                                        </Dropdown.Item>
                                    ))
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>

                    {/* Поле для email руководителя */}
                    <Form.Group controlId="formManagerEmail">
                        <Form.Label className={styles.formlabel}>E-mail руководителя</Form.Label>
                        <Form.Control
                            className={styles.formcontrol}
                            type="text"
                            name="managerEmail"
                            value={formData.managerEmail}
                            readOnly
                        />
                    </Form.Group>

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