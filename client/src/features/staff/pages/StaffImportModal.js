import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import './Staff.css'; // Для стилей
import Modal from 'react-modal';
import { CgCloseO } from "react-icons/cg";
import { VscSaveAs } from "react-icons/vsc";
import StaffService from '../services/StaffService';

const customStyles = {
    content: {
        width: '600px', // Ширина окна
        height: '230px', // Высота окна
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

Modal.setAppElement('#root');

export default function StaffImportModal({ isOpen, onRequestClose }) {
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setErrorMessage(''); // Сбрасываем сообщение об ошибке при выборе нового файла
    };

    const importFile = async () => {
        if (!file) {
            setErrorMessage("Выберите файл.");
            return;
        }
    
       try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const bstr = event.target.result;
                const wb = XLSX.read(bstr, { type:'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                
                // Используем header :1 для получения массива массивов
                const data = XLSX.utils.sheet_to_json(ws,{ header :1 });

                // Пропускаем заголовок (первую строку) и преобразуем данные
                const formattedData = data.slice(1).filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== '')).map(row => ({
                    login : row[8].split('@')[0] || '', 
                    fio : row[1] || '', 
                    tabNumber : row[7] || '', // Изменено на tabNumber
                    post : row[3] || '', 
                    department : row[2] || '', 
                    email : row[6] || '', 
                    telephone : row[5] || '', 
                    del : '0' 
                }));

                console.log('Форматированные данные:', formattedData);

               try {
                   await StaffService.importStaffData(formattedData);
                   alert('Данные успешно импортированы!');
                   onRequestClose();
               } catch (error) {
                   setErrorMessage(`Ошибка при импорте данных:${error.message}`);
               }
           };
           reader.readAsBinaryString(file);
       } catch (err) {
           console.error(err);
           setErrorMessage(`Ошибка при обработке файла:${err.message}`);
       }
   };

   return (
       <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Пример модального окна">
           <CgCloseO className="close-icon" size={28} onClick={onRequestClose} style={{ position:'absolute', top:'16px', right:'16px', cursor:'pointer' }} />
           <h2>Импорт данных из Excel</h2>
           <Form controlId="formFile">
               <Form.Label>Выберите Excel-файл:</Form.Label>
               <br />
               <Form.Control type="file" accept=".xls,.xlsx" onChange={handleFileChange} style={{width:'500px'}}/>
               {errorMessage && <div className="text-danger">{errorMessage}</div>} {/* Отображение сообщения об ошибке */}
               <Button className='button-next ml-2' style={{ width:'500px', marginTop:'23px' }} onClick={() => importFile()}>
                   <VscSaveAs className={'icon-staff'} size={20} style={{ marginRight:'8px' }} />СОХРАНИТЬ
               </Button>
           </Form>
       </Modal>
   );
}