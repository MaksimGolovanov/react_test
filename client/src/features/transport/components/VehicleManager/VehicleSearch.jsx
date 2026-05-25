import React from 'react'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export const VehicleSearch = ({ value, onChange }) => {
    return (
        <Input
            placeholder="Поиск по модели, госномеру,  состоянию, типу ТС или принадлежности..."
            prefix={<SearchOutlined />}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: '500px' }}
            size="middle"
            
        />
    )
}