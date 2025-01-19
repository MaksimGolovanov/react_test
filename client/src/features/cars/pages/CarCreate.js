import React from 'react';
import { Card, CardHeader, CardBody } from 'react-bootstrap';
import CarsList from '../components/CarsList'; // Импортируем новый компонент списка автомобилей
import AddCarForm from '../components/AddCarForm'; // Импортируем новую форму для добавления автомобиля

const CarCreate = () => {
    return (
        <div style={{ display: 'flex', gap: '20px' }}>
            <Card style={{ width: '500px', padding: '10px' }}>
                <CardHeader>
                    <h3>Список автомобилей</h3>
                </CardHeader>
                <CarsList /> {/* Вставляем компонент списка автомобилей */}
            </Card>
            <Card style={{ width: '500px', height: '300px', padding: '10px' }}>
                <CardHeader>
                    <h3>Добавление автомобиля</h3>
                </CardHeader>
                <CardBody>
                    <AddCarForm /> {/* Вставляем компонент формы добавления автомобиля */}
                </CardBody>
            </Card>
        </div>
    );
};

export default CarCreate;