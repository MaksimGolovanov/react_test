import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Card, CardHeader, Row, Col } from 'react-bootstrap';
import IusPtStore from '../../store/IusPtStore';
import styles from './style.module.css';
import { VscSaveAs, VscEdit } from "react-icons/vsc";
import { useObserver } from 'mobx-react-lite';
import FileUploader from './FileUploader'; // Импортируем новый компонент

const IusPtRole = () => {
    const [newRole, setNewRole] = useState({ typename: '', type: '', name: '', code: '', mandat: '' });
    const [editRole, setEditRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');

    useEffect(() => {
        IusPtStore.fetchRole();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editRole) {
            setEditRole(prevState => ({ ...prevState, [name]: value }));
        } else {
            setNewRole(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isCodeExists = IusPtStore.roles.some(role => role.code === (editRole ? editRole.code : newRole.code));
        if (isCodeExists && !editRole) {
            alert('Запись с таким кодом уже существует!');
            return;
        }

        if (editRole) {
            await IusPtStore.updateRole(editRole);
            setEditRole(null);
        } else {
            await IusPtStore.createRole(newRole);
            setNewRole({ typename: '', type: '', name: '', code: '', mandat: '' });
        }
    };

    const handleEdit = (role) => {
        setEditRole(role);
    };

    const handleUploadComplete = () => {
        IusPtStore.fetchRole(); // Обновляем список ролей после загрузки
    };

    const filteredRoles = IusPtStore.roles.filter(role => {
        // Поиск по полю typename (если searchQuery не пустой)
        const matchesSearchQuery = searchQuery
            ? role.typename.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
    
        // Фильтрация по типу (если filterType не пустой)
        const matchesFilterType = filterType
            ? role.typename.trim().toLowerCase() === filterType.trim().toLowerCase()
            : true;
    
        return matchesSearchQuery && matchesFilterType;
    });


    return useObserver(() => (
        <>
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                <Card style={{ width: '700px', padding: '10px' }}>
                    <CardHeader className='p-0 pb-2'>
                        <h4>Список ролей ИУС</h4>
                        <Form>
                            <Row className="g-0" style={{ display: 'flex', alignItems: 'center' }}>
                                <Col style={{ flex: 1, marginRight: '10px' }}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Поиск по всем полям"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                                <Col style={{ flex: '0 0 150px' }}>
                                    <Form.Select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="">Все типы</option>
                                        {Array.from(new Set(IusPtStore.roles.map(role => role.typename))).map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Form>
                    </CardHeader>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <Table striped bordered hover variant="white" className={styles.tabletype}>
                            <thead>
                                <tr>
                                    <th style={{ width: '40px' }}>ID</th>
                                    <th style={{ width: '80px' }}>Название типа роли</th>
                                    <th style={{ width: '80px' }}>тип роли</th>
                                    <th style={{ width: '200px' }}>Описание</th>
                                    <th style={{ width: '200px' }}>Код Роли</th>
                                    <th style={{ width: '50px' }}>Мандант</th>
                                    <th style={{ width: '50px' }}>Действие</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRoles.map(role => (
                                    <tr key={role.id}>
                                        <td>{role.id}</td>
                                        <td>{role.typename}</td>
                                        <td>{role.type}</td>
                                        <td>{role.name}</td>
                                        <td>{role.code}</td>
                                        <td>{role.mandat}</td>
                                        <td>
                                            <Button variant="link" onClick={() => handleEdit(role)}>
                                                <VscEdit size={20} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>

                <Card style={{ width: '500px', height: '600px', padding: '10px' }}>
                    <CardHeader>
                        <h4>{editRole ? 'Редактирование роли ИУС' : 'Добавление роли ИУС'}</h4>
                    </CardHeader>
                    <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                        <Form.Group>
                            <Form.Label className='textModal'>Название ИУС*</Form.Label>
                            <Form.Select
                                name="typename"
                                value={editRole ? editRole.typename : newRole.typename}
                                onChange={handleInputChange}
                            >
                                <option value="">Выберите название типа роли</option>
                                {IusPtStore.types.map(option => (
                                    <option key={option.name} value={option.name}>
                                        {option.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='textModal'>Тип роли*</Form.Label>
                            <Form.Select
                                name="type"
                                value={editRole ? editRole.type : newRole.type}
                                onChange={handleInputChange}
                            >
                                <option value="">Выберите тип роли</option>
                                {IusPtStore.types.map(option => (
                                    <option key={option.type} value={option.type}>
                                        {option.type}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='textModal'>Описание роли*</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editRole ? editRole.name : newRole.name}
                                onChange={handleInputChange}
                                placeholder="Введите название роли"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='textModal'>Код роли*</Form.Label>
                            <Form.Control
                                type="text"
                                name="code"
                                value={editRole ? editRole.code : newRole.code}
                                onChange={handleInputChange}
                                placeholder="Введите код роли"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='textModal'>Мандант*</Form.Label>
                            <Form.Control 
                                type="text"
                                name="mandat"
                                value={editRole ? editRole.mandat : newRole.mandat}
                                onChange={handleInputChange}
                                placeholder="Введите мандат"
                            />
                        </Form.Group>

                        <Button type="submit" className='button-next w-100 mt-2'>
                            <VscSaveAs className={'icon-staff'} size={20} style={{ marginRight: '8px' }} />
                            {editRole ? 'ОБНОВИТЬ' : 'СОХРАНИТЬ'}
                        </Button>

                        <FileUploader onUploadComplete={handleUploadComplete} />
                    </Form>
                </Card>
            </div>
        </>
    ));
};

export default IusPtRole;