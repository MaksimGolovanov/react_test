import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'; // Импортируем библиотеку для создания модальных окон
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { VscSaveAs } from "react-icons/vsc";
import { CgCloseO } from "react-icons/cg";
import StaffService from '../services/StaffService';

const customStyles = {
    content: {
        width: '600px', // Ширина окна
        height: '730px', // Высота окна
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        padding: '20px',
        borderLeft: '4px solid #fa922f',
        borderTop: '6px solid #2F3436',
        borderRight: '6px solid #2F3436',
        borderBottom: '6px solid #2F3436',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
    overlay: {
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Прозрачность фона
    },
};

// Устанавливаем стили для модального окна
Modal.setAppElement('#root');

export default function StaffEditModal({ isOpen, onRequestClose, fetchData, selectedData }) {

    const [fio, setFio] = useState('');
    const [login, setLogin] = useState('');
    const [post, setPost] = useState('');
    const [department, setDepartment] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [ip, setIp] = useState('');
    const [tabNumber, setTabNumber] = useState(''); // Изменено на tabNumber
   

    useEffect(() => {
        if (selectedData) {
            setFio(selectedData.fio || '');
            setLogin(selectedData.login || '');
            setPost(selectedData.post || '');
            setDepartment(selectedData.department || '');
            setTelephone(selectedData.telephone || '');
            setEmail(selectedData.email || '');
            setIp(selectedData.ip || '');
            setTabNumber(selectedData.tabNumber || ''); // Изменено на tabNumber
            
        }
    }, [selectedData]);

    // Обработчики изменений в полях формы
    const handleFioChange = (event) => setFio(event.target.value);
    const handleLoginChange = (event) => setLogin(event.target.value);
    const handlePostChange = (event) => setPost(event.target.value);
    const handleDepartmentChange = (event) => setDepartment(event.target.value);
    const handleTelephoneChange = (event) => setTelephone(event.target.value);
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handleIpChange = (event) => setIp(event.target.value);
    
   // Обработчик сохранения данных
   const handleSave = async (event) => {
       event.preventDefault();

       console.log("Сохранение данных:", { tabNumber});

       const updatedUser = {
           fio,
           login,
           post,
           department,
           telephone,
           email,
           ip,
           tabNumber // Изменено на tabNumber
       };

       try {
           await StaffService.updateStaff(updatedUser); // Обновляем пользователя
           onRequestClose();
           fetchData();
       } catch (error) {
           console.error("Ошибка при изменении пользователя:", error);
       }
   };

   return (
       <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Пример модального окна">
           <CgCloseO className="close-icon" size={28} onClick={onRequestClose} style={{ position:'absolute', top:'16px', right:'16px', cursor:'pointer' }} />
           <h2>Редактирование сотрудника</h2>
           
          <Form onSubmit={handleSave}>
               <label htmlFor="data-input" className='textModal'>Фамилия Имя Отчество</label>
               <Form.Control type="text" value={fio} onChange={handleFioChange} placeholder="ФИО" style={{ width:'500px' }} />
               
               <label htmlFor="data-input" className='textModal'>Логин</label>
               <Form.Control type="text" value={login} onChange={handleLoginChange} placeholder="Логин" style={{ width:'500px' }} />
               
               <label htmlFor="data-input" className='textModal'>Должность</label>
               <Form.Control type="text" value={post} onChange={handlePostChange} placeholder="Должность" style={{ width:'500px' }} />
               
               <label htmlFor="data-input" className='textModal'>Служба</label>
               <Form.Control type="text" value={department} onChange={handleDepartmentChange} placeholder="Служба" style={{ width:'500px' }} />
               
               <label htmlFor="data-input" className='textModal'>Телефон</label>
               <Form.Control type="text" value={telephone} onChange={handleTelephoneChange} placeholder="Телефон" style={{ width:'500px' }} />
               
               <label htmlFor="data-input" className='textModal'>Email</label>
               <Form.Control type="email" value={email} onChange={handleEmailChange} placeholder="Email" style={{ width:'500px' }} />
               
               <label htmlFor="data-input" className='textModal'>IP</label>
               <Form.Control type="text" value={ip} onChange={handleIpChange} placeholder="IP" style={{ width:'500px' }} />

              {/* Исправлено на tabNumber */}
              <label htmlFor="data-input"className='textModal'>Табельный номер</label> 
              {/* Используйте правильное имя поля */}
              {/* Теперь здесь используется значение из состояния tabNumber */}
              {/* Добавлена проверка для предотвращения передачи пустого значения */}
              {/* Если табельный номер не установлен - будет передано пустое значение */}
              {/* Вы можете настроить это поведение по своему усмотрению */}
              <Form.Control 
                  type="text"
                  value={!tabNumber ? '' : tabNumber}
                  onBlur={(e)=>setTabNumber(e.target.value)}
                  placeholder={"Табельный номер"}
                  required 
                  minLength={"1"}  
                  maxLength={"10"}  
                  pattern="[A-Za-z0-9]+" 
                  title={"Табельный номер должен содержать только буквы и цифры."}
                  style={{width:"500"}} />

                {/* Кнопка сохранения */}
                {/* Стиль кнопки можно изменить по вашему усмотрению */}
                {/* Добавлены отступы и ширина кнопки*/}
                {/* Также добавлен класс для стилей*/}
                {/* Для большей доступности добавлен атрибут aria-label*/}
                {/* При необходимости добавьте дополнительные атрибуты или стили */}
                <Button type='submit' className='button-next ml-2' style={{width:"500", marginTop:"50"}} aria-label={'Сохранить изменения'}>
                    <VscSaveAs className={'icon-staff'} size={'20'} style={{marginRight:"8"}} /> СОХРАНИТЬ 
                </Button>

          </Form>

      </Modal>
   );
}