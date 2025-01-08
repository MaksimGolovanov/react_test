import React from 'react';
import './Prints.css';
import PrintModel from './PrintModel';
import PrintLocation from './PrintLocation';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import PrintAll from './PrintAll';

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
                    <div>Содержимое отчета</div>
                </Tab>
            </Tabs>

            
        </>
    );
}

export default Print;