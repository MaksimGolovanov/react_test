import React from 'react';

import { IoArrowBack } from "react-icons/io5";
import ButtonAll from './ButtonAll/ButtonAll'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import IusPtAdmin from './IusPtAdmin/IusPtAdmin';
import PrivateRoute from '../Admin/PrivateRoute'
import IusPtType from './IusPtType/IusPtType';

const IusPtSettings = () => {

    return (
        <>
            <div style={{ marginBottom: '16px' }}>
                <ButtonAll icon={IoArrowBack} text="Назад" path="/iuspt" />
            </div>

            <Tabs>
                <Tab eventKey="Admin" title="Администраторы" >
                    <PrivateRoute requiredRole={['ADMIN']}>
                        <IusPtAdmin />
                    </PrivateRoute>
                </Tab>
                <Tab eventKey="IusPtMandat" title="Справочник мандат" >
                    <PrivateRoute requiredRole={['ADMIN']}>
                        <IusPtType />
                    </PrivateRoute>
                </Tab>
            </Tabs>

        </>
    )
}

export default IusPtSettings