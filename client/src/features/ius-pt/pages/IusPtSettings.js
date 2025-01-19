import React from 'react';

import { IoArrowBack } from "react-icons/io5";
import ButtonAll from '../components/ButtonAll/ButtonAll'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import IusPtAdmin from '../components/IusPtAdmin/IusPtAdmin';
import PrivateRoute from '../../../shared/PrivateRoute'
import IusPtType from '../components/IusPtType/IusPtType';
import styles from './style.module.css'; // Импорт CSS модуля
import IusPtRole from '../components/IusPtRole/IusPtRole';

const IusPtSettings = () => {

    return (
        <>
            <div style={{ marginBottom: '16px' }}>
                <ButtonAll icon={IoArrowBack} text="Назад" path="/iuspt" />
            </div>

            <Tabs>
                <Tab eventKey="Admin" title="Администраторы" className={styles.customTab}>
                    <PrivateRoute requiredRole={['ADMIN']}>
                        <IusPtAdmin />
                    </PrivateRoute>
                </Tab>
                <Tab eventKey="IusPtTypes" title="Типы ИУС" className={styles.customTab}>
                    <PrivateRoute requiredRole={['ADMIN']}>
                        <IusPtType />
                    </PrivateRoute>
                </Tab>
                <Tab eventKey="IusPtRoles" title="Роли ИУС" className={styles.customTab}>
                    <PrivateRoute requiredRole={['ADMIN']}>
                    <IusPtRole />
                    </PrivateRoute>
                </Tab>
            </Tabs>

        </>
    )
}

export default IusPtSettings