import React from 'react';

import { observer } from 'mobx-react-lite';
import styles from './style.module.css'; // Импорт CSS модуля
import ButtonAll from '../components/ButtonAll/ButtonAll';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom'; // Импорт useNavigate
import { Tabs, Tab } from 'react-bootstrap';
import SpravRole from '../components/SpravRole/SpravRole';
import IusAdm from '../components/IusAdm/IusAdm'
import StopRoles from '../components/StopRoles/StopRoles';



const IusSprav = observer(() => {
    const navigate = useNavigate(); // Использование useNavigate



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
                <Tab eventKey="role" title="Справочник подписантов">
                    <IusAdm />
                </Tab>
                <Tab eventKey="stoprole" title="Стоп-Роли">
                    <StopRoles />
                </Tab>
            </Tabs>



        </>
    )


})

export default IusSprav