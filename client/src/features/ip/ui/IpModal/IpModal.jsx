import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import { DEVICE_TYPES, SWITCH_TYPES } from '../../lib/constants'
import IpStore from '../../store/IpStore'

const { TextArea } = Input

const IpModal = ({ visible, currentIp, onCancel, onSuccess }) => {
    const [form] = Form.useForm()

    useEffect(() => {
        if (visible) {
            if (currentIp) {
                form.setFieldsValue({
                    ip: currentIp.ip,
                    subnet_mask: currentIp.subnet_mask || '',
                    device_type: currentIp.device_type || undefined,
                    switch: currentIp.switch || undefined,
                    switch_port: currentIp.switch_port || '',
                    network_segment: currentIp.network_segment || '',
                    description: currentIp.description || '',
                })
            } else {
                form.setFieldsValue({
                    ip: '',
                    subnet_mask: '',
                    device_type: undefined,
                    switch: undefined,
                    switch_port: '',
                    network_segment: '',
                    description: '',
                })
            }
        }
    }, [visible, currentIp, form])

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            if (currentIp) {
                await IpStore.updateIp(currentIp.id, values)
                message.success('IP-адрес обновлен')
            } else {
                await IpStore.createIp(values)
                message.success('IP-адрес добавлен')
            }
            onSuccess()
            form.resetFields()
        } catch (error) {
            console.error('Ошибка при сохранении:', error)
            message.error('Ошибка при сохранении')
        }
    }

    return (
        <Modal
            title={currentIp ? 'Редактирование IP-адреса' : 'Добавление нового IP-адреса'}
            open={visible}
            onOk={handleSubmit}
            onCancel={() => {
                onCancel()
                form.resetFields()
            }}
            width={600}
            okText="Сохранить"
            cancelText="Отмена"
            destroyOnClose
        >
            <Form form={form} layout="vertical" preserve={false}>
                <Form.Item
                    label="IP-адрес"
                    name="ip"
                    rules={[
                        { required: true, message: 'Пожалуйста, введите IP-адрес' },
                        { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'Неверный формат IP-адреса' },
                    ]}
                >
                    <Input placeholder="Например: 192.168.1.1" />
                </Form.Item>

                <Form.Item label="Маска подсети" name="subnet_mask">
                    <Input placeholder="Например: 255.255.255.0" />
                </Form.Item>

                <Form.Item label="Тип устройства" name="device_type">
                    <Select placeholder="Выберите тип устройства" allowClear>
                        {DEVICE_TYPES.map((type) => (
                            <Select.Option key={type} value={type}>
                                {type}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Коммутатор" name="switch">
                    <Select placeholder="Выберите коммутатор" allowClear>
                        {SWITCH_TYPES.map((type) => (
                            <Select.Option key={type} value={type}>
                                {type}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Порт" name="switch_port">
                    <Input placeholder="Например: GigabitEthernet0/1" />
                </Form.Item>

                <Form.Item label="Сегмент сети" name="network_segment">
                    <Input placeholder="Например: VLAN 10" />
                </Form.Item>

                <Form.Item label="Описание" name="description">
                    <TextArea rows={3} placeholder="Введите описание устройства или назначение IP-адреса" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default IpModal