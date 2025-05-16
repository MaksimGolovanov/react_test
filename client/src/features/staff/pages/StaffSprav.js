import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import styles from './style.module.css'
import StaffSpravDepartmens from './StaffSpravDepartments'
import ButtonAll from '../../ius-pt/components/ButtonAll/ButtonAll'
import { IoArrowBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom' // Импорт useNavigate

function StaffSprav() {
     const navigate = useNavigate() // Использование useNavigate
     return (
          <div>
               <ButtonAll icon={IoArrowBack} text="Назад" onClick={() => navigate('/staff')} />
               <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className={styles.customtabs}>
                    <Tab eventKey="home" title="Справочник служб">
                         <StaffSpravDepartmens />
                    </Tab>
               </Tabs>
          </div>
     )
}

export default StaffSprav
