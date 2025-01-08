import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'; // Импортируем библиотеку для создания модальных окон
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { VscSaveAs } from "react-icons/vsc";
import { CgCloseO } from "react-icons/cg";
import { Image } from 'react-bootstrap';
import plug from '../../Image/plug1.jpg'
import plug2 from '../../Image/plug2.jpg'
import PrintsService from './PrintsService';

const customStyles = {
    content: {
        width: '640px', // Ширина окна
        height: '585px', // Высота окна
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

export default function PrintCreateModal({ isOpen, onRequestClose, onSuccess }) {
    const [selectedFiles, setSelectedFiles] = useState({ externalView: null, cartridgeView: null, blockView: null });
    const [previewsUrls, setPreviewsUrls] = useState({ externalView: plug, cartridgeView: plug2, blockView: plug2 });
    const [formData, setFormData] = useState({ model: '', cartridge: '', paperFormat: '', scannerType: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileInputChange = (field, event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFiles(prevState => ({
                ...prevState,
                [field]: file,
            }));
            setPreviewsUrls(prevState => ({
                ...prevState,
                [field]: URL.createObjectURL(file),
            }));
        }
    };

    // Этот эффект выполнится при каждом изменении состояния isOpen
    useEffect(() => {
        if (!isOpen) {
            setSelectedFiles({
                externalView: null,
                cartridgeView: null,
                blockView: null,
            });
            setPreviewsUrls({
                externalView: plug,
                cartridgeView: plug,
                blockView: plug,
            });
        }
    }, [isOpen]);

    const handleCreate = async (event) => {
        event.preventDefault()
        try {
            if (!formData.model || !formData.cartridge || !formData.paperFormat || !formData.scannerType) {
                throw new Error('Заполните все обязательные поля');
            }

            if (!selectedFiles.externalView || !selectedFiles.cartridgeView || !selectedFiles.blockView) {
                throw new Error('Загрузите все необходимые изображения');
            }
            // Создаем объект FormData для отправки файлов
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.model);
            formDataToSend.append('cartridge', formData.cartridge);
            formDataToSend.append('paper_size', formData.paperFormat);
            formDataToSend.append('scanner', formData.scannerType);
            formDataToSend.append('img1', selectedFiles.externalView);
            formDataToSend.append('img2', selectedFiles.cartridgeView);
            formDataToSend.append('img3', selectedFiles.blockView);

            // Отправляем запрос на сервер
            await PrintsService.createPrintModel(formDataToSend);
            if (onSuccess) {
                onSuccess();
            }
            
            onRequestClose();
        } catch (error) {
            console.error('Ошибка при создании модели принтера:', error);
            alert('Произошла ошибка при создании модели принтера');
        }
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Пример модального окна">
            <CgCloseO className="close-icon" size={28} onClick={onRequestClose} style={{ position: 'absolute', top: '16px', right: '16px', cursor: 'pointer' }} />
            <h3>Добавление модели принтера</h3>
            <Form onSubmit={handleCreate}>
                <label htmlFor="model" className='textModal' >Модель принтера</label>
                <Form.Control
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Модель принтера"
                    style={{ width: '500px' }}
                />
                <label htmlFor="cartridge" className='textModal' >Тип картриджа/тонера</label>
                <Form.Control
                    type="text"
                    name="cartridge"
                    value={formData.cartridge}
                    onChange={handleInputChange}
                    placeholder="Тип картриджа/тонера"
                    style={{ width: '500px' }}
                />
                <label htmlFor="paperFormat" className='textModal' >Максимальный формат печати</label>
                <Form.Control
                    type="text"
                    name="paperFormat"
                    value={formData.paperFormat}
                    onChange={handleInputChange}
                    placeholder="Максимальный формат печати"
                    style={{ width: '500px' }}
                />
                <label htmlFor="scannerType" className='textModal' >Сканирование чб/цв</label>
                <Form.Control 
                  type="text"
                  name="scannerType"
                  value={formData.scannerType}
                  onChange={handleInputChange}
                  placeholder="Сканирование чб/цв"
                  style={{ width: '500px' }}
                />
                <label htmlFor="data-input" className='textModal' >Внешний вид</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Form.Control type="file" placeholder="Внешний вид" style={{ width: '500px' }} onChange={(e) => handleFileInputChange('externalView', e)} />
                    {previewsUrls.externalView && (
                        <Image src={previewsUrls.externalView} alt="External View Preview" style={{ height: '40px' }}></Image>
                    )}
                </div>
                <label htmlFor="data-input" className='textModal' >Вид тонера/картриджа</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Form.Control type="file" placeholder="Вид тонера/картриджа" style={{ width: '500px' }} onChange={(e) => handleFileInputChange('cartridgeView', e)} />
                    {previewsUrls.cartridgeView && (
                        <Image src={previewsUrls.cartridgeView} alt="Cartridge View Preview" style={{ height: '40px' }}></Image>
                    )}
                </div>
                <label htmlFor="data-input" className='textModal' >Вид блока</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Form.Control type="file" placeholder="Вид блока" style={{ width: '500px' }} onChange={(e) => handleFileInputChange('blockView', e)} />
                    {previewsUrls.blockView && (
                        <Image src={previewsUrls.blockView} alt="Block View Preview" style={{ height: '40px' }}></Image>
                    )}
                </div>
                <Button
                    type="submit"
                    className='button-next ml-2'
                    style={{ width: '500px', marginTop: '10px' }}

                >
                    <VscSaveAs
                        className={'icon-staff'}
                        size={20}
                        style={{ marginRight: '8px' }}
                    />
                    СОХРАНИТЬ
                </Button>

            </Form>
        </Modal>
    );
}