import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Select,
  TimePicker,
  Button,
  message,
  Input,
  Form,
  Tag,
  Popconfirm,
  Space,
  theme,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../hooks/useStores';
import TransportService from '../../services/TransportService';
import usersStore from '../../../admin/store/UserStore';
import WeekDayPicker from './WeekDayPicker';

dayjs.locale('ru');

const VehicleWeek = observer(() => {
  const { transportStore, userStore } = useRootStore();
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf('day'));
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [staff, setStaff] = useState(null);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [myDepartmentShortName, setMyDepartmentShortName] = useState(null);
  const [myDepartmentUuid, setMyDepartmentUuid] = useState(null);
  const [selectedVehicleTypeId, setSelectedVehicleTypeId] = useState(null);
  const { useToken } = theme;
  const { token } = useToken();
  // Загрузка справочников
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const depts = await TransportService.fetchAllDepartments();
        setDepartments(depts);
        const staffData = await TransportService.fetchStaffOne(
          usersStore.tabNumber
        );
        setStaff(staffData);
        if (!transportStore.vehicleTypes.length)
          await transportStore.fetchVehicleTypes();
        if (!transportStore.vehicles.length)
          await transportStore.fetchVehicles(); // загружаем автомобили
      } catch (error) {
        console.error(error);
        message.error('Ошибка загрузки справочников');
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchInitialData();
  }, []);

  const getRowStyle = (record) => {
    if (record.status === 'cancelled') {
      return { backgroundColor: token.colorErrorBg };
    }
    return {};
  };

  useEffect(() => {
    if (staff && departments.length) {
      const departmentCode = String(staff.department).split(' ')[0];
      const found = departments.find(
        (d) => d.code === departmentCode || d.code === staff.department
      );
      setMyDepartmentShortName(found?.short_name || null);
      setMyDepartmentUuid(found?.id || null);
    }
  }, [staff, departments]);

  const loadRequests = useCallback(
    async (date, showMessage = false) => {
      if (!myDepartmentShortName && !myDepartmentUuid) {
        if (showMessage) message.warning('Не определён отдел пользователя');
        return;
      }
      try {
        if (showMessage) setRefreshing(true);
        await transportStore.fetchRequests({ date: date.format('YYYY-MM-DD') });
      } catch (error) {
        console.error(error);
        if (showMessage) message.error('Ошибка загрузки заявок');
      } finally {
        if (showMessage) setRefreshing(false);
      }
    },
    [myDepartmentShortName, myDepartmentUuid, transportStore]
  );

  useEffect(() => {
    if ((myDepartmentShortName || myDepartmentUuid) && !loadingStaff) {
      loadRequests(selectedDate);
    }
  }, [
    selectedDate,
    myDepartmentShortName,
    myDepartmentUuid,
    loadingStaff,
    loadRequests,
  ]);

  const handleRefresh = () => loadRequests(selectedDate, true);

  const filteredRequests = transportStore.requests.filter((req) => {
    if (req.request_date !== selectedDate.format('YYYY-MM-DD')) return false;
    return (
      req.department_id === myDepartmentShortName ||
      req.department_id === myDepartmentUuid
    );
  });

  const handleVehicleTypeChange = (value) => {
    setSelectedVehicleTypeId(value);
    form.setFieldsValue({ assigned_vehicle_id: null });
  };

  const handleAddRequest = async () => {
    try {
      const values = await form.validateFields();
      if (!myDepartmentShortName) throw new Error('Отдел не определён');

      if (!values.start_time.isBefore(values.end_time)) {
        message.warning('Время начала должно быть раньше времени окончания');
        return;
      }

      const payload = {
        department_id: myDepartmentShortName,
        vehicle_type_id: values.vehicle_type_id,
        assigned_vehicle_id: values.assigned_vehicle_id || null,
        start_time: values.start_time.format('HH:mm:ss'),
        end_time: values.end_time.format('HH:mm:ss'),
        request_date: selectedDate.format('YYYY-MM-DD'),
        work_place: values.work_place,
        purpose: values.purpose || '',
        created_by: userStore.card?.tabNumber || 'system',
      };

      await TransportService.createRequest(payload);
      message.success('Заявка добавлена');
      form.resetFields([
        'vehicle_type_id',
        'assigned_vehicle_id',
        'start_time',
        'end_time',
        'work_place',
        'purpose',
      ]);
      setSelectedVehicleTypeId(null);
      await loadRequests(selectedDate);
    } catch (error) {
      message.error(
        error.response?.data?.message || 'Ошибка при создании заявки'
      );
    }
  };

  const setQuickTime = (start, end) => {
    form.setFieldsValue({
      start_time: dayjs(start, 'HH:mm'),
      end_time: dayjs(end, 'HH:mm'),
    });
  };

  const handleCancelRequest = async (id) => {
    try {
      await TransportService.cancelRequest(
        id,
        'Отменено пользователем',
        userStore.card?.tabNumber
      );
      message.success('Заявка отменена');
      await loadRequests(selectedDate);
    } catch (error) {
      message.error('Ошибка отмены заявки');
    }
  };

  const getVehicleInfo = (vehicleId) => {
    if (!vehicleId) return '—';
    const vehicle = transportStore.vehicles.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.vehicle_brand} (${vehicle.state_number})` : '—';
  };

  const getDriverName = (driverId) => {
    if (!driverId) return '—';
    const driver = transportStore.drivers.find((d) => d.id === driverId);
    return driver ? driver.fio : '—';
  };

  const columns = [
    {
      title: 'Тип транспорта',
      dataIndex: 'vehicle_type_id',
      render: (id) =>
        transportStore.vehicleTypes.find((t) => t.id === id)?.name || '—',
    },
    {
      title: 'Время',
      render: (_, rec) => `${rec.start_time} – ${rec.end_time}`,
    },
    { title: 'Место работ', dataIndex: 'work_place' },
    { title: 'Цель', dataIndex: 'purpose', ellipsis: true },
    {
      title: 'Автомобиль',
      render: (_, rec) => getVehicleInfo(rec.assigned_vehicle_id),
    },
    {
      title: 'Водитель',
      render: (_, rec) => getDriverName(rec.assigned_driver_id),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (status) => {
        const map = {
          pending: { color: 'gold', text: 'Ожидает' },
          confirmed: { color: 'green', text: 'Подтверждено' },
          cancelled: { color: 'red', text: 'Отменено' },
          rejected: { color: 'red', text: 'Отказ' },
          rescheduled: { color: 'blue', text: 'Перенос' },
        };
        const { color, text } = map[status] || {
          color: 'default',
          text: status,
        };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Действия',
      render: (_, rec) => {
        if (rec.status === 'pending' || rec.status === 'confirmed') {
          return (
            <Popconfirm
              title="Отменить заявку?"
              onConfirm={() => handleCancelRequest(rec.id)}
            >
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          );
        }
        return null;
      },
    },
  ];

  if (loadingStaff) return <div>Загрузка...</div>;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <WeekDayPicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <Button
          size="small"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={refreshing}
        >
          Обновить
        </Button>
      </div>
      <div
        style={{
          padding: 16,
          border: `1px solid ${token.colorBorder}`,
          borderRadius: 8,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
          Заявки на {selectedDate.format('DD.MM.YYYY')}
        </div>
        <div style={{ marginBottom: 16, color: '#666', fontSize: 12 }}>
          Служба: {myDepartmentShortName || 'Не определена'}
        </div>

        <Form form={form} layout="vertical" style={{ marginBottom: 16 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              alignItems: 'flex-end',
            }}
          >
            <Form.Item
              name="vehicle_type_id"
              rules={[{ required: true }]}
              style={{ flex: 1, minWidth: 150 }}
            >
              <Select
                placeholder="Тип транспорта"
                loading={!transportStore.vehicleTypes.length}
                onChange={handleVehicleTypeChange}
              >
                {transportStore.vehicleTypes.map((type) => (
                  <Select.Option key={type.id} value={type.id}>
                    {type.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="assigned_vehicle_id"
              label="Автомобиль"
              style={{ minWidth: 250 }}
            >
              <Select
                placeholder="Выберите автомобиль (опционально)"
                allowClear
                showSearch
                optionFilterProp="children"
                disabled={!selectedVehicleTypeId}
                optionLabelProp="label"
              >
                {transportStore.vehicles
                  .filter((v) => {
                    if (!selectedVehicleTypeId) return false;
                    const selectedType = transportStore.vehicleTypes.find(
                      (t) => t.id === selectedVehicleTypeId
                    );
                    return v.vehicle_type === selectedType?.name;
                  })
                  .map((vehicle) => {
                    const isAvailable =
                      vehicle.technical_condition === 'исправен';
                    return (
                      <Select.Option
                        key={vehicle.id}
                        value={vehicle.id}
                        disabled={!isAvailable}
                        label={`${vehicle.vehicle_brand} (${vehicle.state_number})${!isAvailable ? ' — неисправен' : ''}`}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '4px 0',
                          }}
                        >
                          <CarOutlined
                            style={{
                              color: isAvailable ? '#1890ff' : '#ff4d4f',
                              fontSize: 16,
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500, fontSize: 13 }}>
                              {vehicle.vehicle_brand} • {vehicle.state_number}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: '#8c8c8c',
                                marginTop: 2,
                              }}
                            >
                              {vehicle.vehicle_subtype || vehicle.vehicle_type}
                              {!isAvailable && (
                                <span
                                  style={{ color: '#ff4d4f', marginLeft: 8 }}
                                >
                                  (неисправен)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>

            <Form.Item
              name="start_time"
              rules={[{ required: true }]}
              label="Начало"
              style={{ minWidth: 120 }}
            >
              <TimePicker format="HH:mm" placeholder="Начало" minuteStep={15} />
            </Form.Item>

            <Form.Item
              name="end_time"
              rules={[{ required: true }]}
              label="Окончание"
              style={{ minWidth: 120 }}
            >
              <TimePicker format="HH:mm" placeholder="Конец" minuteStep={15} />
            </Form.Item>

            <Form.Item
              name="work_place"
              rules={[{ required: true }]}
              style={{ flex: 2, minWidth: 200 }}
            >
              <Input placeholder="Место работ" />
            </Form.Item>

            <Form.Item name="purpose" style={{ flex: 2, minWidth: 200 }}>
              <Input placeholder="Цель (необязательно)" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={handleAddRequest}
                icon={<PlusOutlined />}
              >
                Добавить заявку
              </Button>
            </Form.Item>
          </div>

          <Space size="small" style={{ marginTop: 8 }}>
            <Button size="small" onClick={() => setQuickTime('08:00', '12:00')}>
              08:00–12:00
            </Button>
            <Button size="small" onClick={() => setQuickTime('13:00', '17:00')}>
              13:00–17:00
            </Button>
            <Button size="small" onClick={() => setQuickTime('08:00', '17:00')}>
              08:00–17:00
            </Button>
            <Button size="small" onClick={() => setQuickTime('08:00', '20:00')}>
              08:00–20:00
            </Button>
          </Space>
        </Form>

        {filteredRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32, color: '#999' }}>
            Нет заявок
          </div>
        ) : (
          <Table
            dataSource={filteredRequests}
            columns={columns}
            rowKey="id"
            loading={transportStore.requestsLoading || refreshing}
            pagination={false}
            bordered
            size="small"
            onRow={(record) => ({ style: getRowStyle(record) })}
          />
        )}
      </div>
    </div>
  );
});

export default VehicleWeek;
