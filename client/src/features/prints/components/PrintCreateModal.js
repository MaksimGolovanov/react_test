import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { VscSaveAs } from "react-icons/vsc";
import { CgCloseO } from "react-icons/cg";
import PrintsService from '../services/PrintsService';

const customStyles = {
    content: {
        width: '600px',
        height: '760px',
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

export default function PrintCreateModal({ isOpen, onRequestClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        logical_name: '',
        ip: '',
        url: '',
        department: '',
        location: '',
        serial_number: '',
        description: '',
        model_id: '' // ID выбранной модели принтера
    });

    const [printModels, setPrintModels] = useState([]);
    const [departmens, setDepartmens] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Загрузка списка моделей принтеров при открытии модального окна
    useEffect(() => {
        if (isOpen) {
            fetchPrintModels();
            fetchDepartmens();
            fetchLocations()
        }
    }, [isOpen]);

    const fetchPrintModels = async () => {
        try {
            const models = await PrintsService.fetchPrintModel();
            setPrintModels(models);
        } catch (error) {
            console.error('Ошибка при загрузке моделей принтеров:', error);
            setError('Не удалось загрузить список моделей принтеров');
        }
    };
    const fetchDepartmens = async () => {
        try {
            const deparmensAll = await PrintsService.fetchDepartmens();
            setDepartmens(deparmensAll);
        } catch (error) {
            console.error('Ошибка при загрузке моделей принтеров:', error);
            setError('Не удалось загрузить список моделей принтеров');
        }
    };

    const fetchLocations = async () => {
        try {
            const locationsAll = await PrintsService.fetchLocation();
            setLocations(locationsAll);
        } catch (error) {
            console.error('Ошибка при загрузке моделей принтеров:', error);
            setError('Не удалось загрузить список моделей принтеров');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Если изменилась модель принтера, устанавливаем имя
        if (name === 'model_id') {
            const selectedModel = printModels.find(model => model.id === parseInt(value));
            if (selectedModel) {
                setFormData(prev => ({
                    ...prev,
                    model_id: value,
                    name: selectedModel.name // Устанавливаем имя из выбранной модели
                }));
            }
        }
    };

   

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            console.log('Отправляемые данные:', formData); // Логируем данные перед отправкой

            if (!formData.model_id || !formData.ip || !formData.department) {
                throw new Error('Заполните все обязательные поля');
            }

            await PrintsService.createPrint({
                print_model: parseInt(formData.model_id), // Убедитесь, что ID передается как число
                logical_name: formData.logical_name,
                ip: formData.ip,
                url: formData.url,
                department: formData.department,
                location: formData.location,
                serial_number: formData.serial_number,
                status: Number(formData.status),
                description: formData.description,
            });

            onSuccess?.();
            onRequestClose();

            resetForm();
        } catch (error) {
            console.error('Ошибка при создании принтера:', error);
            setError(error.response?.data?.message || error.message || 'Произошла ошибка при создании принтера');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            logical_name: '',
            ip: '',
            url: '',
            department: '',
            location: '',
            serial_number: '',
            model_id: '',
            status: '',
            description: ''


        });
        setError(null);
    };

    // Очищаем форму при закрытии
    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel="Создание принтера"
        >
            <CgCloseO
                className="close-icon"
                size={28}
                onClick={onRequestClose}
                style={{ position: 'absolute', top: '16px', right: '16px', cursor: 'pointer' }}
            />
            <h3>Добавление принтера</h3>

            {error && <div className="error-message mt-2">{error}</div>}

            <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                <Form.Group>
                    <Form.Label className='textModal'>Модель принтера*</Form.Label>
                    <Form.Select
                        name="model_id"
                        value={formData.model_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Выберите модель</option>
                        {printModels.sort((a, b) => a.name.localeCompare(b.name)).map(model => (
                            <option key={model.id} value={model.id}>
                                {model.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group>
                    <Form.Label className='textModal'>Логическое имя</Form.Label>
                    <Form.Control
                        type="text"
                        name="logical_name"
                        value={formData.logical_name}
                        onChange={handleInputChange}
                        placeholder="Введите логическое имя"
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label className='textModal'>IP-адрес*</Form.Label>
                    <Form.Control
                        type="text"
                        name="ip"
                        value={formData.ip}
                        onChange={handleInputChange}
                        placeholder="Введите IP-адрес"
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label className='textModal'>URL</Form.Label>
                    <Form.Select
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Выберите URL</option>
                        <option >http://</option>
                        <option >https://</option>

                    </Form.Select>

                </Form.Group>

                <Form.Group>
                    <Form.Label className='textModal'>Отдел*</Form.Label>
                    <Form.Select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Выберите Отдел</option>
                        {departmens.sort((a, b) => a.short_name.localeCompare(b.short_name)).map(model => (
                            <option key={model.id} value={model.short_name}>
                                {model.short_name}
                            </option>
                        ))}
                    </Form.Select>

                </Form.Group>

                <Form.Group>
                    <Form.Label className='textModal'>Расположение</Form.Label>
                    <Form.Select
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Выберите расположение</option>
                        {locations.sort((a, b) => a.location.localeCompare(b.location)).map(model => (
                            <option key={model.id} value={model.location}>
                                {model.location}
                            </option>
                        ))}
                    </Form.Select>




                </Form.Group>

                <Form.Group>
                    <Form.Label className='textModal'>Примечание</Form.Label>
                    <Form.Control
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Введите примечание"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label className='textModal'>Серийный номер</Form.Label>
                    <Form.Control
                        type="text"
                        name="serial_number"
                        value={formData.serial_number}
                        onChange={handleInputChange}
                        placeholder="Введите серийный номер"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label className='textModal'>Статус</Form.Label>
                    <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Выберите статус</option>
                        <option value={1}>В работе</option>
                        <option value={0}>В ремонте</option>

                    </Form.Select>

                </Form.Group>

                <Button
                    type="submit"
                    className='button-next w-100 mt-2'
                    disabled={isLoading}
                >
                    <VscSaveAs className={'icon-staff'} size={20} style={{ marginRight: '8px' }} />
                    {isLoading ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
                </Button>
            </Form>
        </Modal>
    );
}