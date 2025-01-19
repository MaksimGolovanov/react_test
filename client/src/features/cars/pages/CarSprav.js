import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import CarCreate from './CarCreate';


const CarSprav = () => {
    return (
        <>
           <Tabs defaultActiveKey="Car" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="Car" title="Автомобили">
                    <CarCreate/>
                </Tab>
                <Tab eventKey="Car_driver" title="Водители">
                    Car driver
                </Tab>
                <Tab eventKey="car_class" title="Классы">
                    Car class
                </Tab>
                <Tab eventKey="car_subclass" title="Подкласс">
                    Car subclass
                </Tab>
                <Tab eventKey="organization" title="Организация">
                    Организации
                </Tab>
            </Tabs>
        </>
    );
};

export default CarSprav;