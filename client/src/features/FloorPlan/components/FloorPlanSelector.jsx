import React from 'react';
import { Select, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const FloorPlanSelector = ({ plans, selectedId, onSelect, onAdd }) => {
  return (
    <Space>
      <Select
        placeholder="Выберите план этажа"
        style={{ width: 250 }}
        value={selectedId}
        onChange={onSelect}
        options={plans.map((p) => ({
          value: p.id,
          label: `${p.buildingName} (эт. ${p.floor})`,
        }))}
      />
      <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
        Создать план
      </Button>
    </Space>
  );
};

export default FloorPlanSelector;