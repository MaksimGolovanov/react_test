import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import PrintsService from '../services/PrintsService';
import PrintEditLocationModal from './PrinteEditLocationModal';

const PrintLocation = () => {
    const [locations, setLocations] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

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

    const columns = [
        {
            title: 'Расположение',
            dataIndex: 'location',
            key: 'location',
            render: (text) => <span style={{ fontSize: '13px' }}>{text}</span>,
        },
        {
            title: '',
            key: 'action',
            width: 40,
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteLocation(record.id)}
                    style={{ padding: 0, fontSize: '14px' }}
                    size="small"
                />
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 12, textAlign: 'left' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateClick}
                    size="small"
                >
                    Создать
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={locations}
                rowKey="id"
                bordered
                size="small"
                style={{ width: '300px' }}
                pagination={false}
                className="compact-table"
            />
            <style jsx>{`
                .compact-table .ant-table-cell {
                    padding: 4px 8px !important;
                    font-size: 13px;
                }
                .compact-table .ant-table-thead > tr > th {
                    padding: 6px 8px !important;
                    font-size: 13px;
                }
                .compact-table .ant-table-tbody > tr > td {
                    padding: 4px 8px !important;
                }
            `}</style>

            <PrintEditLocationModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                onSuccess={fetchData}
            />
        </div>
    );
};

export default PrintLocation;