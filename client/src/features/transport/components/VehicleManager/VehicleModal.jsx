import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, AutoComplete } from 'antd';
import { toJS } from 'mobx';

import { useRootStore } from '../../hooks/useStores';

const { Option } = Select;

export const VehicleModal = ({ visible, editingVehicle, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const { transportStore } = useRootStore();
  const [availableSubtypes, setAvailableSubtypes] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicleSubtypes, setVehicleSubtypes] = useState([]);

  const [loading, setLoading] = useState(false);

  // Загрузка данных при открытии
  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Загружаем типы
      let types = transportStore.vehicleTypes;
      if (types.length === 0) {
        await transportStore.fetchVehicleTypes();
        types = transportStore.vehicleTypes;
      }
      setVehicleTypes([...types]);

      // Загружаем подтипы
      let subtypes = transportStore.vehicleSubtypes;
      if (subtypes.length === 0) {
        await transportStore.fetchVehicleSubtypes();
        subtypes = transportStore.vehicleSubtypes;
      }
      setVehicleSubtypes([...subtypes]);

      // Загружаем водителей
      let driversList = transportStore.drivers;
      if (driversList.length === 0) {
        await transportStore.fetchDrivers();
        driversList = transportStore.drivers;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Установка значений формы при редактировании
  // Установка значений формы при редактировании
  useEffect(() => {
    if (
      visible &&
      editingVehicle &&
      vehicleTypes.length > 0 &&
      vehicleSubtypes.length > 0
    ) {
      const rawVehicle = toJS(editingVehicle);

      // Находим ID типа по названию
      const typeObj = vehicleTypes.find(
        (t) => t.name?.toLowerCase() === rawVehicle.vehicle_type?.toLowerCase()
      );
      const typeId = typeObj?.id;

      if (typeId) {
        // Фильтруем подтипы для выбранного типа
        const filtered = vehicleSubtypes.filter(
          (s) => s.vehicle_type_id === typeId
        );
        setAvailableSubtypes(filtered);

        // Находим ID подтипа
        const subtypeObj = filtered.find(
          (s) =>
            s.name?.toLowerCase() === rawVehicle.vehicle_subtype?.toLowerCase()
        );
        const subtypeId = subtypeObj?.id;

        // Сначала устанавливаем тип
        form.setFieldsValue({
          vehicle_brand: rawVehicle.vehicle_brand,
          state_number: rawVehicle.state_number,
          technical_condition: rawVehicle.technical_condition || 'исправен',
          company_affiliation: rawVehicle.company_affiliation,
          vin: rawVehicle.vin,
          current_location: rawVehicle.current_location,
          vehicle_type_id: typeId,
        });

        // Небольшая задержка для установки подтипа, чтобы Select успел обновиться
        setTimeout(() => {
          if (subtypeId) {
            form.setFieldValue('vehicle_subtype_id', subtypeId);
            console.log('Set subtype value:', subtypeId);
          }
        }, 50);
      }
    } else if (visible && !editingVehicle) {
      form.resetFields();
      setAvailableSubtypes([]);
      form.setFieldValue('technical_condition', 'исправен');
    }
  }, [visible, editingVehicle, vehicleTypes, vehicleSubtypes, form]);

  // Отслеживаем изменение типа в форме
  const watchVehicleType = Form.useWatch('vehicle_type_id', form);

  // Обновляем подтипы при изменении типа
  useEffect(() => {
    if (watchVehicleType) {
      const filtered = vehicleSubtypes.filter(
        (s) => s.vehicle_type_id === watchVehicleType
      );
      setAvailableSubtypes(filtered);
      // Очищаем выбранный подтип
      form.setFieldValue('vehicle_subtype_id', undefined);
    } else {
      setAvailableSubtypes([]);
    }
  }, [watchVehicleType, vehicleSubtypes, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      console.log('Form values:', values);

      if (!values.vehicle_type_id) {
        message.error('Пожалуйста, выберите тип транспорта');
        return;
      }

      const vehicleData = {
        vehicle_brand: values.vehicle_brand,
        state_number: values.state_number,
        vehicle_type_id: values.vehicle_type_id,
        vehicle_subtype_id: values.vehicle_subtype_id || null,
        driver_id: values.driver_id,

        technical_condition: values.technical_condition,
        company_affiliation: values.company_affiliation,
        vin: values.vin || null,
        current_location: values.current_location || null,
      };

      console.log('Sending vehicle data:', vehicleData);
      await onSave(vehicleData);
      form.resetFields();
      setAvailableSubtypes([]);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setAvailableSubtypes([]);
    onCancel();
  };

  const affiliationOptions = [
    { label: 'Вуктыльское ЛПУМГ', value: 'Вуктыльское ЛПУМГ' },
    { label: 'УТТиСТ', value: 'УТТиСТ' },
    { label: 'УАВР', value: 'УАВР' },
  ];

  return (
    <Modal
      title={
        editingVehicle ? 'Редактирование автомобиля' : 'Добавление автомобиля'
      }
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Сохранить"
      cancelText="Отмена"
      width={600}
    >
      <Form form={form} layout="vertical" size="small">
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
          name="vehicle_type_id"
          label="Тип транспорта"
          rules={[{ required: true, message: 'Выберите тип транспорта' }]}
        >
          <Select placeholder="Выберите тип" loading={loading}>
            {vehicleTypes.map((type) => (
              <Option key={type.id} value={type.id}>
                {type.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="vehicle_subtype_id" label="Подтип транспорта">
          <Select
            placeholder={
              watchVehicleType ? 'Выберите подтип' : 'Сначала выберите тип'
            }
            disabled={!watchVehicleType}
            loading={loading}
            
          >
            {availableSubtypes.map((subtype) => (
              <Option key={subtype.id} value={subtype.id}>
                {subtype.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="technical_condition"
          label="Техническое состояние"
          rules={[
            { required: true, message: 'Выберите техническое состояние' },
          ]}
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
          rules={[
            { required: true, message: 'Выберите или введите принадлежность' },
          ]}
        >
          <AutoComplete
            placeholder="Выберите или введите принадлежность"
            options={affiliationOptions}
            filterOption={(inputValue, option) =>
              option?.value?.toLowerCase().includes(inputValue.toLowerCase())
            }
            
          />
        </Form.Item>

        <Form.Item name="vin" label="VIN номер">
          <Input placeholder="VIN номер автомобиля" />
        </Form.Item>

        <Form.Item name="current_location" label="Текущее местоположение">
          <Input placeholder="Например: КС-3" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
