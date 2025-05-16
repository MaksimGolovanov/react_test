import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Alert } from 'react-bootstrap';
import StaffService from '../services/StaffService';
import styles from './style.module.css';

function StaffSpravDepartmens() {
    const [departments, setDepartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        short_name: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState({ 
        key: null, 
        direction: 'asc' 
    });

    useEffect(() => {
        loadDepartments();
    }, []);

    const sortedDepartments = React.useMemo(() => {
        const sortableItems = [...departments];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key].toLowerCase();
                const bValue = b[sortConfig.key].toLowerCase();
                
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [departments, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
        }
        return '';
    };

    const loadDepartments = async () => {
        setIsLoading(true);
        try {
            const data = await StaffService.fetchAllDepartments();
            setDepartments(data);
            setError(null);
        } catch (err) {
            setError('Ошибка при загрузке данных отделов');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreate = () => {
        setCurrentDepartment(null);
        setFormData({
            code: '',
            description: '',
            short_name: ''
        });
        setShowModal(true);
    };

    const handleEdit = (department) => {
        setCurrentDepartment(department);
        setFormData({
            code: department.code,
            description: department.description,
            short_name: department.short_name
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (currentDepartment) {
                await StaffService.updateDepartment(currentDepartment.id, formData);
                setSuccess('Отдел успешно обновлен');
            } else {
                await StaffService.createDepartment(formData);
                setSuccess('Отдел успешно создан');
            }
            setShowModal(false);
            loadDepartments();
        } catch (err) {
            setError('Ошибка при сохранении данных');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот отдел?')) {
            setIsLoading(true);
            try {
                await StaffService.deleteDepartment(id);
                setSuccess('Отдел успешно удален');
                loadDepartments();
            } catch (err) {
                setError('Ошибка при удалении отдела');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className={styles.container}>
            <h2>Справочник производственных отделов</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

            <Button 
                variant="primary" 
                onClick={handleCreate} 
                className="mb-3"
                disabled={isLoading}
            >
                {isLoading ? 'Загрузка...' : 'Добавить отдел'}
            </Button>

            {isLoading ? (
                <div>Загрузка данных...</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <Table striped bordered hover className={styles.stickyTable}>
                        <thead>
                            <tr>
                                <th 
                                    onClick={() => handleSort('code')} 
                                    className={styles.sortableHeader}
                                >
                                    Код{getSortIndicator('code')}
                                </th>
                                <th 
                                    onClick={() => handleSort('description')} 
                                    className={styles.sortableHeader}
                                >
                                    Наименование{getSortIndicator('description')}
                                </th>
                                <th 
                                    onClick={() => handleSort('short_name')} 
                                    className={styles.sortableHeader}
                                >
                                    Короткое название{getSortIndicator('short_name')}
                                </th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDepartments.map(department => (
                                <tr key={department.id}>
                                    <td>{department.code}</td>
                                    <td>{department.description}</td>
                                    <td>{department.short_name}</td>
                                    <td>
                                        <Button 
                                            variant="warning" 
                                            size="sm" 
                                            onClick={() => handleEdit(department)}
                                            className="me-2"
                                            disabled={isLoading}
                                        >
                                            Изменить
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={() => handleDelete(department.id)}
                                            disabled={isLoading}
                                        >
                                            Удалить
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <Modal show={showModal} onHide={() => !isLoading && setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {currentDepartment ? 'Редактирование отдела' : 'Новый отдел'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Код отдела</Form.Label>
                            <Form.Control
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Полное наименование</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Короткое наименование</Form.Label>
                            <Form.Control
                                type="text"
                                name="short_name"
                                value={formData.short_name}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button 
                                variant="secondary" 
                                onClick={() => setShowModal(false)} 
                                className="me-2"
                                disabled={isLoading}
                            >
                                Отмена
                            </Button>
                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Сохранение...' : 'Сохранить'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default StaffSpravDepartmens;