import React from 'react';
import './Prints.css';
import PrintModel from '../components/PrintModel';
import PrintLocation from '../components/PrintLocation';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import PrintAll from '../components/PrintAll';

import PrintReport from '../components/PrintReport'

function Print() {


    return (
        <>
            <Tabs defaultActiveKey="Prints" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="Prints" title="Принтеры">
                    <PrintAll />
                </Tab>

                <Tab eventKey="print_model" title="Справочник принтеров">
                    <PrintModel />
                </Tab>
                <Tab eventKey="location" title="Справочник зданий">
                    <PrintLocation />
                </Tab>
                <Tab eventKey="print_statistic" title="Отчет">
                    <PrintReport />
                </Tab>
            </Tabs>

            
        </>
    );
}

export default Print;