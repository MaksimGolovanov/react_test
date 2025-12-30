import React from 'react'
import { Modal, Button, Alert, List, Typography, Space } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

const DeleteModal = ({ 
    show, 
    onHide, 
    selectedIds, 
    selectedCardsInfo, 
    onConfirm 
}) => {
    return (
        <Modal
            title={
                <Space>
                    <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                    <span>Подтверждение удаления</span>
                </Space>
            }
            open={show}
            onCancel={onHide}
            footer={[
                <Button key="cancel" onClick={onHide}>
                    Отмена
                </Button>,
                <Button key="delete" type="primary" danger onClick={onConfirm}>
                    Удалить
                </Button>,
            ]}
            width={500}
        >
            {selectedIds.length === 1 ? (
                <>
                    <p>Вы действительно хотите удалить выбранную запись?</p>
                    {selectedCardsInfo.map((card) => (
                        <div key={card.id} style={{ marginBottom: '8px', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                            <Text strong>Серийный номер:</Text> {card.ser_num || '-'}
                            <br />
                            <Text strong>ФИО:</Text> {card.fio || '-'}
                            <br />
                            <Text strong>Тип:</Text> {card.type || '-'}
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <p>Вы действительно хотите удалить выбранные записи ({selectedIds.length} шт.)?</p>
                    <List
                        size="small"
                        dataSource={selectedCardsInfo.slice(0, 5)}
                        renderItem={(card) => (
                            <List.Item>
                                • {card.ser_num || 'Без номера'} - {card.fio || 'Без ФИО'}
                            </List.Item>
                        )}
                    />
                    {selectedIds.length > 5 && (
                        <p style={{ marginTop: '8px' }}>
                            ... и еще {selectedIds.length - 5} записей
                        </p>
                    )}
                </>
            )}
            <Alert
                message="Внимание!"
                description="Это действие нельзя отменить."
                type="warning"
                showIcon
                style={{ marginTop: '16px' }}
            />
        </Modal>
    )
}

export default DeleteModal