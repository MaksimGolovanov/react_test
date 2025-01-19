import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { VscSaveAs } from "react-icons/vsc";
import carStore from '../store/CarStore';

const AddCarForm = () => {
    const [newCar, setNewCar] = useState({ model: '', number: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCar(prevState => ({ ...prevState, [name]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await carStore.createCar(newCar); // Предполагаю, что createCar возвращает промис
            setNewCar({ model: '', number: '' }); // Очищаем поля после успешного создания
        } catch (error) {
            console.error('Ошибка при создании автомобиля:', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label className='textModal'>модель автомобиля*</Form.Label>
                <Form.Control
                    type="text"
                    name="model"
                    value={newCar.model}
                    onChange={handleChange}
                    placeholder="Введите модель автомобиля"
                />
            </Form.Group>
            <Form.Group>
                <Form.Label className='textModal'>номер автомобиля*</Form.Label>
                <Form.Control
                    type="text"
                    name="number"
                    value={newCar.number}
                    onChange={handleChange}
                    placeholder="Введите номер автомобиля"
                />
            </Form.Group>
            <Button
                type="submit"
                className='button-next w-100 mt-2'
            >
                <VscSaveAs className={'icon-staff'} size={20} style={{ marginRight: '8px' }} />
                СОХРАНИТЬ
            </Button>
        </Form>
    );
};

export default AddCarForm;