import React, { useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'

const { Option } = Select

export const VehicleModal = ({ visible, editingVehicle, onSave, onCancel, vehicleTypes }) => {
    const [form] = Form.useForm()

    useEffect(() => {
        if (visible && editingVehicle) {
            form.setFieldsValue(editingVehicle)
        } else if (visible && !editingVehicle) {
            form.resetFields()
            form.setFieldsValue({ technical_condition: 'исправен' })
        }
    }, [visible, editingVehicle, form])

    const handleOk = async () => {
        try {
            const values = await form.validateFields()
            onSave(values)
            form.resetFields()
        } catch (error) {
            console.error('Validation failed:', error)
        }
    }

    return (
        <Modal
            title={editingVehicle ? "Редактирование автомобиля" : "Добавление автомобиля"}
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Сохранить"
            cancelText="Отмена"
            width={600}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="vehicle_brand"
                    label="Модель"
                    rules={[{ required: true, message: 'Введите модель автомобиля' }]}
                >
                    <Input placeholder="Например: Toyota Camry" />
                </Form.Item>

                <Form.Item
                    name="state_number"
                    label="Госномер"
                    rules={[{ required: true, message: 'Введите государственный номер' }]}
                >
                    <Input placeholder="Например: А123ВС77" />
                </Form.Item>

                <Form.Item
                    name="vehicle_type"
                    label="Тип транспорта"
                    rules={[{ required: true, message: 'Выберите тип транспорта' }]}
                >
                    <Select placeholder="Выберите тип транспорта" showSearch>
                        {vehicleTypes.map(type => (
                            <Option key={type.id} value={type.name}>{type.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="vehicle_subtype" label="Подтип">
                    <Input placeholder="Например: Седан, Универсал, Кран" />
                </Form.Item>

                <Form.Item
                    name="driver_full_name"
                    label="Водитель (таб.№)"
                    rules={[{ required: true, message: 'Введите табельный номер водителя' }]}
                >
                    <Input placeholder="Например: 02100035" />
                </Form.Item>

                <Form.Item
                    name="technical_condition"
                    label="Техническое состояние"
                    rules={[{ required: true, message: 'Выберите техническое состояние' }]}
                >
                    <Select>
                        <Option value="исправен">Исправен</Option>
                        <Option value="не исправен">Не исправен</Option>
                        <Option value="в ремонте">В ремонте</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="company_affiliation"
                    label="Принадлежность"
                    rules={[{ required: true, message: 'Введите принадлежность' }]}
                >
                    <Input placeholder="Например: Вуктыльское ЛПУМГ" />
                </Form.Item>

                <Form.Item name="vin" label="VIN номер">
                    <Input placeholder="VIN номер автомобиля" />
                </Form.Item>

                <Form.Item name="current_location" label="Текущее местоположение">
                    <Input placeholder="Например: КС-3" />
                </Form.Item>
            </Form>
        </Modal>
    )
}