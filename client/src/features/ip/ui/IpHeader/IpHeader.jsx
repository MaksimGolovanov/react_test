import React from 'react'
import { Button, Input, Space, message, Modal } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import IpStore from '../../store/IpStore'
import styles from './IpHeader.module.css'

const IpHeader = ({ searchTerm, onSearchChange, onAddNew, selectedRow, onEdit, onDelete }) => {
    const handleDelete = async () => {
        if (selectedRow) {
            Modal.confirm({
                title: 'Удаление IP-адреса',
                content: `Вы уверены, что хотите удалить IP-адрес ${selectedRow.ip}?`,
                okText: 'Удалить',
                okType: 'danger',
                cancelText: 'Отмена',
                onOk: async () => {
                    try {
                        await IpStore.deleteIp(selectedRow.id)
                        message.success('IP-адрес успешно удален')
                        onDelete()
                    } catch (error) {
                        message.error('Ошибка при удалении IP-адреса')
                    }
                },
            })
        } else {
            message.warning('Выберите IP-адрес для удаления')
        }
    }

    return (
        <div className={styles.header}>
            <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
                    Добавить
                </Button>

                <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                        if (selectedRow) {
                            onEdit(selectedRow)
                        } else {
                            message.warning('Выберите IP-адрес для редактирования')
                        }
                    }}
                    type="primary"
                    disabled={!selectedRow}
                >
                    Редактировать
                </Button>
                
                <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleDelete}
                    disabled={!selectedRow}
                >
                    Удалить
                </Button>
                
                <Input
                    placeholder="Поиск IP-адресов..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{ width: 250 }}
                />
            </Space>
        </div>
    )
}

export default IpHeader