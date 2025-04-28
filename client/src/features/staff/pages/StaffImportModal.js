import React, { useState, useEffect } from 'react';
import { Button, Form, ProgressBar } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import './Staff.css';
import Modal from 'react-modal';
import { CgCloseO } from "react-icons/cg";
import { VscSaveAs } from "react-icons/vsc";
import StaffService from '../services/StaffService';

const customStyles = {
    content: {
        width: '670px',
        height: '380px',
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
};

Modal.setAppElement('#root');

export default function StaffImportModal({ isOpen, onRequestClose }) {
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState('');

    // Сброс состояния при закрытии модального окна
    useEffect(() => {
        if (!isOpen) {
            resetState();
        }
    }, [isOpen]);

    const resetState = () => {
        setFile(null);
        setErrorMessage('');
        setIsLoading(false);
        setProgress(0);
        setProgressText('');
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setErrorMessage('');
        setProgress(0);
        setProgressText('');
    };

    const handleClose = () => {
        if (!isLoading) {
            resetState();
            onRequestClose();
        }
    };

    const importFile = async () => {
        if (!file) {
            setErrorMessage("Выберите файл.");
            return;
        }
        
        setIsLoading(true);
        setErrorMessage('');
        setProgress(0);
        setProgressText('Начало обработки файла...');

        try {
            const reader = new FileReader();
            
            reader.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentLoaded = Math.round((event.loaded / event.total) * 50);
                    setProgress(percentLoaded);
                    setProgressText(`Чтение файла: ${percentLoaded}%`);
                }
            };

            reader.onload = async (event) => {
                try {
                    setProgress(50);
                    setProgressText('Обработка данных...');
                    
                    const bstr = event.target.result;
                    const wb = XLSX.read(bstr, { type:'binary' });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

                    setProgress(70);
                    setProgressText('Форматирование данных...');

                    const formattedData = data.slice(1)
                        .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
                        .map(row => ({
                            login: row[8]?.split('@')[0] || '', 
                            fio: row[1] || '', 
                            tabNumber: row[7] || '',
                            post: row[3] || '', 
                            department: row[2] || '', 
                            email: row[6] || '', 
                            telephone: row[5] || '', 
                            del: '0' 
                        }));

                    setProgress(80);
                    setProgressText('Отправка данных на сервер...');

                    await StaffService.importStaffData(formattedData, (progressEvent) => {
                        const percentUploaded = 80 + Math.round((progressEvent.loaded / progressEvent.total) * 20);
                        setProgress(percentUploaded);
                        setProgressText(`Отправка данных: ${percentUploaded}%`);
                    });

                    setProgress(100);
                    setProgressText('Завершено!');
                    
                    setTimeout(() => {
                        alert('Данные успешно импортированы!');
                        resetState();
                        onRequestClose();
                    }, 500);
                } catch (error) {
                    setErrorMessage(`Ошибка при обработке данных: ${error.message}`);
                    setIsLoading(false);
                }
            };
            
            reader.onerror = () => {
                setErrorMessage('Ошибка чтения файла');
                setIsLoading(false);
            };
            
            reader.readAsBinaryString(file);
        } catch (err) {
            console.error(err);
            setErrorMessage(`Ошибка при обработке файла: ${err.message}`);
            setIsLoading(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={handleClose} 
            style={customStyles} 
            contentLabel="Импорт сотрудников"
        >
            <CgCloseO 
                className="close-icon" 
                size={28} 
                onClick={handleClose}
                style={{ 
                    position:'absolute', 
                    top:'16px', 
                    right:'16px', 
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1
                }} 
            />
            <h2>Импорт данных из Excel</h2>
            <Form controlId="formFile">
                <Form.Label>Выберите Excel-файл:</Form.Label>
                <br />
                <Form.Control 
                    type="file" 
                    accept=".xls,.xlsx" 
                    onChange={handleFileChange} 
                    style={{width:'600px'}}
                    disabled={isLoading}
                />
                <div style={{ 
                    fontSize: '12px', 
                    color: '#666', 
                    marginTop: '10px',
                    backgroundColor: '#f8f9fa',
                    padding: '8px',
                    borderRadius: '4px',
                    width: '600px'
                }}>
                    <strong>Структура файла (столбцы по порядку):</strong><br />
                    0: ID (не используется) | 1: ФИО | 2: Подразделение | 3: Должность | 
                    4: ? | 5: Телефон | 6: Email | 7: Табельный номер | 8: Логин (из email)
                </div>
                <Button 
                    className='button-next ml-2' 
                    style={{ width:'600px', marginTop:'15px' }} 
                    onClick={importFile}
                    disabled={isLoading}
                >
                    <VscSaveAs className={'icon-staff'} size={20} style={{ marginRight:'8px' }} />
                    {isLoading ? `ИМПОРТ (${progress}%)` : 'СОХРАНИТЬ'}
                </Button>
                {errorMessage && <div className="text-danger" style={{ marginTop: '10px' }}>{errorMessage}</div>}
                
                {isLoading && (
                    <div style={{ width: '100%', margin: '15px 0' }}>
                        <ProgressBar 
                            now={progress} 
                            label={`${progress}%`}
                            animated 
                            variant="success"
                            style={{ height: '25px' }}
                        />
                        <div style={{ 
                            textAlign: 'center', 
                            marginTop: '5px',
                            fontSize: '13px',
                            color: '#555'
                        }}>
                            {progressText}
                        </div>
                    </div>
                )}

                
            </Form>
        </Modal>
    );
}