import React from 'react';

import { observer } from 'mobx-react-lite';
import styles from './style.module.css'; // Импорт CSS модуля
import ButtonAll from '../components/ButtonAll/ButtonAll';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom'; // Импорт useNavigate
import { Tabs, Tab } from 'react-bootstrap';
import SpravRole from '../components/SpravRole/SpravRole';
import Table from '../../../Components/Table/Table'
const IusSprav = observer(() => {
    const navigate = useNavigate(); // Использование useNavigate

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Имя' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Роль' },
    ];

    const data = [
        { id: 1, name: 'Иван Иванов', email: 'ivan@example.com', role: 'Admin' },
        { id: 2, name: 'Петр Петров', email: 'petr@example.com', role: 'User' },
        { id: 3, name: 'Анна Сидорова', email: 'anna@example.com', role: 'Editor' },
        // ... другие данные
    ];




    return (
        <>
            <div className={styles.header}>
                <span className={styles.pageHeader}>Cправочники</span>
            </div>
            <ButtonAll icon={IoArrowBack} text="Назад" onClick={() => navigate('/iuspt')} />

            <Tabs
                defaultActiveKey="home"
                id="uncontrolled-tab-example"
                className={styles.customtabs}
            >
                <Tab eventKey="home" title="Справочник ролей">
                    <SpravRole />
                </Tab>
                <Tab eventKey="role" title="Роли">
                    <div>Информация о ролях пользователя</div>
                </Tab>
                <Tab eventKey="contact" title="Contact">
                    <div>
                        <h1>Пользователи</h1>
                        <Table data={data} columns={columns} />
                    </div>
                </Tab>
            </Tabs>



        </>
    )


})

export default IusSprav