import React from 'react';
import carStore from '../Store/CarStore'

const CarCreate = () => {
    return (
        <div>
            {carStore.cars.map((car, index) => {
                <p key={index}>{car.model}</p>
            })}
        </div>
    );
};

export default CarCreate;