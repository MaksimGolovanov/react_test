import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { autorun } from 'mobx'; // Импортируем autorun из MobX
import carStore from '../../Store/CarStore';
import { Table, Spinner, Alert } from 'react-bootstrap';

const CarsList = observer(() => {
    useEffect(() => {
        carStore.fetchCars(); // Загружаем автомобили при монтировании компонента

        // Создаём реакцию на изменение массива cars
        const disposer = autorun(() => {
            // При изменении массива cars, перерисовывается компонент
            
        });

        return () => {
            // Отключаем реакцию при размонтировании компонента
            disposer();
        };
    }, []);

    if (carStore.isLoading) {
        return <Spinner animation="border" variant="primary" />;
    }

    if (carStore.hasError) {
        return <Alert variant="danger">{carStore.error}</Alert>;
    }

    return (
        <Table striped bordered hover variant="white" className='table-staff'>
            <thead>
                <tr>
                    <th style={{ width: '300px' }}>Модель</th>
                    <th>Номер</th>
                </tr>
            </thead>
            <tbody>
                {carStore.cars.length > 0 ? (
                    carStore.cars.map(car => (
                        <tr key={car.id}>
                            <td>{car.model}</td>
                            <td>{car.number}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="2" className="text-center">Нет автомобилей для отображения</td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
});

export default CarsList;