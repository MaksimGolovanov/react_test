import React, { useState } from 'react';
import { Table, Button, Space, Tag, Select, Modal, DatePicker, TimePicker, Form, Input, message, Tooltip } from 'antd';
import { CheckOutlined, CloseOutlined, SwapOutlined, CarOutlined, UserOutlined } from '@ant-design/icons';
import { BookingTableFilters } from './BookingTableFilters';
import dayjs from 'dayjs';

const { Option } = Select;

export const BookingTableTab = ({
    requests,
    vehicles,
    drivers,
    departments,
    selectedDate,
    setSelectedDate,
    filters,
    setFilterStatus,
    setFilterType,
    setFilterDepartment,
    handleRefreshData,
    handleResetAllFilters,
    handleAssignVehicleAndDriver,    // для статуса pending
    handleConfirmRequest,
    handleCancelRequest,
    handleRescheduleRequest,
    handleUpdateBooking,              // для статуса confirmed (редактирование)
    uniqueTypes,
    timeSlots,
    loading
}) => {
    const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);
    const [rescheduleForm] = Form.useForm();

    // Получение доступных автомобилей (фильтр по типу и техническому состоянию)
    const getAvailableVehicles = (request) => {
        if (!request) return vehicles;
        let filtered = vehicles;
        // Фильтр по требуемому типу транспорта
        if (request.vehicle_type_id) {
            const requiredType = uniqueTypes.find(t => t.id === request.vehicle_type_id);
            if (requiredType) {
                filtered = filtered.filter(v => v.vehicle_type === requiredType.name);
            }
        }
        // Только исправные автомобили
        filtered = filtered.filter(v => v.technical_condition === 'исправен');
        return filtered;
    };

    // Доступные водители (только работающие)
    const getAvailableDrivers = () => {
        return drivers.filter(d => d.is_active === 'at_work');
    };

    // Обработчики выбора авто/водителя в зависимости от статуса
    const handleVehicleChange = (record, vehicleId) => {
        if (record.status === 'pending') {
            handleAssignVehicleAndDriver(record.id, vehicleId, record.assigned_driver_id);
        } else if (record.status === 'confirmed') {
            handleUpdateBooking(record.id, vehicleId, record.assigned_driver_id);
        }
    };

    const handleDriverChange = (record, driverId) => {
        if (record.status === 'pending') {
            handleAssignVehicleAndDriver(record.id, record.assigned_vehicle_id, driverId);
        } else if (record.status === 'confirmed') {
            handleUpdateBooking(record.id, record.assigned_vehicle_id, driverId);
        }
    };

    const columns = [
        {
            title: 'Служба',
            key: 'department',
            width: 150,
            render: (_, record) => record.department_id || '—'
        },
        {
            title: 'Тип транспорта',
            key: 'vehicleType',
            width: 120,
            render: (_, record) => record.vehicleType?.name || '—'
        },
        {
            title: 'Время',
            key: 'time',
            width: 120,
            render: (_, record) => `${record.start_time} – ${record.end_time}`
        },
        {
            title: 'Место работ',
            dataIndex: 'work_place',
            width: 150,
            ellipsis: true
        },
        {
            title: 'Назначенный автомобиль',
            key: 'assignedVehicle',
            width: 200,
            render: (_, record) => {
                const availableVehicles = getAvailableVehicles(record);
                const canEdit = record.status === 'pending' || record.status === 'confirmed';
                return (
                    <Select
                        value={record.assigned_vehicle_id}
                        style={{ width: '100%' }}
                        placeholder="Выберите авто"
                        onChange={(val) => handleVehicleChange(record, val)}
                        disabled={!canEdit}
                        showSearch
                        optionFilterProp="children"
                        allowClear
                    >
                        {availableVehicles.map(v => (
                            <Option key={v.id} value={v.id}>
                                <CarOutlined /> {v.vehicle_brand} ({v.state_number})
                            </Option>
                        ))}
                    </Select>
                );
            }
        },
        {
            title: 'Водитель',
            key: 'assignedDriver',
            width: 200,
            render: (_, record) => {
                const availableDrivers = getAvailableDrivers();
                const canEdit = record.status === 'pending' || record.status === 'confirmed';
                return (
                    <Select
                        value={record.assigned_driver_id}
                        style={{ width: '100%' }}
                        placeholder="Выберите водителя"
                        onChange={(val) => handleDriverChange(record, val)}
                        disabled={!canEdit}
                        showSearch
                        optionFilterProp="children"
                        allowClear
                    >
                        {availableDrivers.map(d => (
                            <Option key={d.id} value={d.id}>
                                <UserOutlined /> {d.fio} | {d.department}
                            </Option>
                        ))}
                    </Select>
                );
            }
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            width: 100,
            render: (status) => {
                const statusMap = {
                    pending: { color: 'gold', text: 'Ожидает' },
                    confirmed: { color: 'green', text: 'Подтверждено' },
                    cancelled: { color: 'red', text: 'Отменено' },
                    rejected: { color: 'red', text: 'Отказ' },
                    rescheduled: { color: 'blue', text: 'Перенос' }
                };
                const { color, text } = statusMap[status] || { color: 'default', text: status };
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 200,
            render: (_, record) => {
                const canConfirm = record.status === 'pending' && record.assigned_vehicle_id && record.assigned_driver_id;
                const canCancel = record.status === 'pending' || record.status === 'confirmed';
                const canReschedule = record.status === 'pending';
                return (
                    <Space size="small">
                        {canConfirm && (
                            <Tooltip title="Подтвердить бронирование">
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<CheckOutlined />}
                                    onClick={() => handleConfirmRequest(record.id)}
                                />
                            </Tooltip>
                        )}
                        {canCancel && (
                            <Tooltip title="Отменить заявку">
                                <Button
                                    danger
                                    size="small"
                                    icon={<CloseOutlined />}
                                    onClick={() => handleCancelRequest(record.id)}
                                />
                            </Tooltip>
                        )}
                        {canReschedule && (
                            <Tooltip title="Перенести на другую дату">
                                <Button
                                    size="small"
                                    icon={<SwapOutlined />}
                                    onClick={() => {
                                        setCurrentRequest(record);
                                        rescheduleForm.setFieldsValue({
                                            new_date: dayjs(record.request_date),
                                            new_start_time: dayjs(record.start_time, 'HH:mm'),
                                            new_end_time: dayjs(record.end_time, 'HH:mm'),
                                            notes: ''
                                        });
                                        setRescheduleModalVisible(true);
                                    }}
                                />
                            </Tooltip>
                        )}
                    </Space>
                );
            }
        }
    ];

    // Фильтрация заявок по выбранной дате, статусу и отделу
    const filteredRequests = requests.filter(req => {
        if (selectedDate && req.request_date !== selectedDate.format('YYYY-MM-DD')) return false;
        if (filters.filterStatus && filters.filterStatus !== 'all' && req.status !== filters.filterStatus) return false;
        if (filters.filterDepartment && filters.filterDepartment !== 'all' && req.department_id !== filters.filterDepartment) return false;
        return true;
    });

    const handleRescheduleSubmit = async () => {
        try {
            const values = await rescheduleForm.validateFields();
            await handleRescheduleRequest(
                currentRequest.id,
                values.new_date.format('YYYY-MM-DD'),
                values.new_start_time.format('HH:mm'),
                values.new_end_time.format('HH:mm'),
                values.notes
            );
            setRescheduleModalVisible(false);
            message.success('Заявка перенесена');
        } catch (error) {
            message.error('Ошибка при переносе');
        }
    };

    return (
        <>
            <Table
                columns={columns}
                dataSource={filteredRequests}
                rowKey="id"
                loading={loading}
                scroll={{ y: 'calc(100vh - 300px)' }}
                pagination={false}
                size="small"
                bordered
                title={() => (
                    <BookingTableFilters
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        filters={filters}
                        setFilterStatus={setFilterStatus}
                        setFilterType={setFilterType}
                        setFilterDepartment={setFilterDepartment}
                        handleRefreshData={handleRefreshData}
                        handleResetAllFilters={handleResetAllFilters}
                        uniqueTypes={uniqueTypes}
                        departments={departments}
                        showStatusFilter={true}
                    />
                )}
            />

            <Modal
                title="Перенос заявки"
                open={rescheduleModalVisible}
                onCancel={() => setRescheduleModalVisible(false)}
                onOk={handleRescheduleSubmit}
                okText="Перенести"
                cancelText="Отмена"
            >
                <Form form={rescheduleForm} layout="vertical">
                    <Form.Item name="new_date" label="Новая дата" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="new_start_time" label="Время начала" rules={[{ required: true }]}>
                        <TimePicker format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="new_end_time" label="Время окончания" rules={[{ required: true }]}>
                        <TimePicker format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="notes" label="Причина переноса">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};