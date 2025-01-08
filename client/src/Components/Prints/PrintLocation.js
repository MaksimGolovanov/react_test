import React, { useEffect, useState, useCallback } from 'react';
import PrintsService from './PrintsService';
import {  Table } from 'react-bootstrap';

import { MdDeleteForever } from "react-icons/md";
import Button from 'react-bootstrap/Button';
import { IoIosCreate } from "react-icons/io";
import PrintEditLocationModal from './PrinteEditLocationModal';

const PrintLocation = () => {
    const [locations, setLocations] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    

    // Используем useCallback для создания функции открытия модального окна
    const openModal = useCallback(() => {
        if (!modalIsOpen) {
            setModalIsOpen(true);
        }
    }, [modalIsOpen]);

    const closeModal = useCallback(() => {
        setModalIsOpen(false);
        fetchData();
    }, []);

    const handleCreateClick = useCallback(() => {
        openModal();
    }, [openModal]);

    const fetchData = useCallback(async () => {
        try {
            const locations = await PrintsService.fetchLocation();
            setLocations(locations);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const deleteLocation = useCallback(async (id) => {
        try {
            await PrintsService.deleteLocation(id);
            const updatedLocations = locations.filter((location) => location.id !== id);
            setLocations(updatedLocations);
        } catch (error) {
            console.error('Ошибка при удалении локации:', error);
        }
    }, [locations]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div>
            <Button
                className='button-next float-end ms-auto mb-1'
                onClick={handleCreateClick}>
                <IoIosCreate
                    className={'icon-staff'}
                    size={20}
                    style={{ marginRight: '8px' }}
                />
                Создать
            </Button>
            <Table style={{ width: '300px' }} striped bordered hover className='table-prints'>
                <thead className="fixed-header">
                    <tr>
                        
                        <th>Расположение</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map((location) => (
                        <tr key={location.id}>
                            
                            <td>{location.location}</td>
                            <td style={{ width: '30px' }}>
                               
                                <button className="delete-button" onClick={() => deleteLocation(location.id)}>
                                    <MdDeleteForever size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <PrintEditLocationModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                onSuccess={fetchData}
            />
        </div>
    );
};

export default PrintLocation;