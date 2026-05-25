import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Select,
  Modal,
  DatePicker,
  TimePicker,
  Form,
  Input,
  message,
  Tooltip,
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  SwapOutlined,
  CarOutlined,
  UserOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { BookingTableFilters } from './BookingTableFilters';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

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
  handleAssignVehicleAndDriver,
  handleConfirmRequest,
  handleCancelRequest,
  handleRescheduleRequest,
  handleUpdateBooking,
  uniqueTypes,
  vehicleTypes,
  timeSlots,
  loading,
  onCreateRequest, // новый пропс – функция создания заявки
  currentUserTabNumber, // табельный номер текущего пользователя (диспетчера)
}) => {
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [rescheduleForm] = Form.useForm();

  // Состояния для модального окна создания заявки
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [creating, setCreating] = useState(false);

  // Вспомогательная функция для получения доступных автомобилей
  const getAvailableVehicles = (request) => {
    if (!request) return vehicles;
    let filtered = vehicles;
    if (request.vehicle_type_id) {
      const requiredType = vehicleTypes.find(
        (t) => t.id === request.vehicle_type_id
      );
      if (requiredType) {
        filtered = filtered.filter((v) => v.vehicle_type === requiredType.name);
      }
    }
    filtered = filtered.filter((v) => v.technical_condition === 'исправен');
    return filtered;
  };

  // Все водители с флагом доступности
  const getAllDriversWithAvailability = () => {
    return drivers.map((driver) => ({
      ...driver,
      isAvailable: driver.is_active === 'at_work',
    }));
  };

  // Функция для получения списка водителей с учётом доступности на конкретную дату
  const getAllDriversWithAvailabilityForDate = (date) => {
    if (!date)
      return drivers.map((d) => ({
        ...d,
        isAvailable: false,
        availabilityReason: '',
      }));
    const dateStr = date.format('YYYY-MM-DD');
    return drivers.map((driver) => {
      let isAvailable = false;
      let availabilityReason = '';

      // Если статус "На работе" – доступен всегда
      if (driver.is_active === 'at_work') {
        isAvailable = true;
      } else if (driver.is_active === 'deactivated') {
        isAvailable = false;
        availabilityReason = 'Деактивирован';
      } else {
        // Для отпуска, больничного, учёбы проверяем период
        const from = driver.date_from ? dayjs(driver.date_from) : null;
        const to = driver.date_to ? dayjs(driver.date_to) : null;
        if (from && to) {
          if (dayjs(dateStr).isBetween(from, to, 'day', '[]')) {
            isAvailable = false;
            const statusText = getDriverStatusText(driver.is_active);
            availabilityReason = `${statusText} (${from.format('DD.MM')}–${to.format('DD.MM')})`;
          } else {
            isAvailable = true;
          }
        } else {
          // Если статус не "На работе", но периоды не заданы – считаем недоступным
          isAvailable = false;
          availabilityReason = getDriverStatusText(driver.is_active);
        }
      }
      return { ...driver, isAvailable, availabilityReason };
    });
  };

  const getDriverStatusText = (status) => {
    const statusMap = {
      at_work: 'На работе',
      on_vacation: 'Отпуск',
      on_sick_leave: 'Больничный',
      on_study: 'Учеба',
      deactivated: 'Уволен',
    };
    return statusMap[status] || status;
  };

  const handleVehicleChange = (record, vehicleId) => {
    if (record.status === 'pending') {
      handleAssignVehicleAndDriver(
        record.id,
        vehicleId,
        record.assigned_driver_id
      );
    } else if (record.status === 'confirmed') {
      handleUpdateBooking(record.id, vehicleId, record.assigned_driver_id);
    } else if (record.status === 'rescheduled') {
      // Для перенесённой заявки тоже можно назначать авто/водителя
      handleAssignVehicleAndDriver(
        record.id,
        vehicleId,
        record.assigned_driver_id
      );
    }
  };

  const handleDriverChange = (record, driverId) => {
    if (record.status === 'pending') {
      handleAssignVehicleAndDriver(
        record.id,
        record.assigned_vehicle_id,
        driverId
      );
    } else if (record.status === 'confirmed') {
      handleUpdateBooking(record.id, record.assigned_vehicle_id, driverId);
    } else if (record.status === 'rescheduled') {
      // Для перенесённой заявки
      handleAssignVehicleAndDriver(
        record.id,
        record.assigned_vehicle_id,
        driverId
      );
    }
  };

  const statusLabels = {
    at_work: { text: 'На работе', color: 'green' },
    on_vacation: { text: 'Отпуск', color: 'orange' },
    on_sick_leave: { text: 'Больничный', color: 'red' },
    on_study: { text: 'Учеба', color: 'blue' },
    deactivated: { text: 'Уволен', color: 'default' },
  };

  // Колонки таблицы заявок
  const columns = [
    {
      title: 'Служба',
      key: 'department',
      width: 150,
      render: (_, record) => {
        if (record.department_name) return record.department_name;
        const dept = departments.find((d) => d.id === record.department_id);
        return dept?.short_name || dept?.name || record.department_id || '—';
      },
    },
    {
      title: 'Тип транспорта',
      key: 'vehicleType',
      width: 120,
      render: (_, record) => record.vehicleType?.name || '—',
    },
    {
      title: 'Время',
      key: 'time',
      width: 120,
      render: (_, record) => `${record.start_time} – ${record.end_time}`,
    },
    {
      title: 'Место работ',
      dataIndex: 'work_place',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Назначенный автомобиль',
      key: 'assignedVehicle',
      width: 200,
      render: (_, record) => {
        const availableVehicles = getAvailableVehicles(record);
        const canEdit =
          record.status === 'pending' ||
          record.status === 'confirmed' ||
          record.status === 'rescheduled';
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
            {availableVehicles.map((v) => (
              <Option key={v.id} value={v.id}>
                <CarOutlined /> {v.vehicle_brand} ({v.state_number})
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Водитель',
      key: 'assignedDriver',
      width: 280,
      render: (_, record) => {
        const allDrivers = getAllDriversWithAvailabilityForDate(selectedDate);
        const canEdit =
          record.status === 'pending' ||
          record.status === 'confirmed' ||
          record.status === 'rescheduled';
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
            optionLabelProp="label"
          >
            {allDrivers.map((d) => {
              const isAvailable = d.isAvailable;
              const tooltipTitle = !isAvailable
                ? `Недоступен: ${d.availabilityReason}`
                : '';
              // Краткое отображение в выбранном поле
              const shortLabel =
                `${d.fio} (${d.post})` +
                (isAvailable ? '' : ` — ${d.availabilityReason}`);
              return (
                <Option
                  key={d.id}
                  value={d.id}
                  disabled={!isAvailable}
                  title={tooltipTitle}
                  label={shortLabel}
                >
                  <Space direction="vertical" size={0}>
                    <Space>
                      <UserOutlined />
                      <strong>{d.fio}</strong>
                      {!isAvailable && (
                        <Tag
                          color={statusLabels[d.is_active]?.color || 'default'}
                          size="small"
                        >
                          {d.availabilityReason}
                        </Tag>
                      )}
                    </Space>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {d.post} | {d.department}
                    </div>
                   
                  </Space>
                </Option>
              );
            })}
          </Select>
        );
      },
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
          rescheduled: { color: 'blue', text: 'Перенос' },
        };
        const { color, text } = statusMap[status] || {
          color: 'default',
          text: status,
        };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 200,
      render: (_, record) => {
        const canConfirm =
          (record.status === 'pending' || record.status === 'rescheduled') &&
          record.assigned_vehicle_id &&
          record.assigned_driver_id;
        const canCancel =
          record.status === 'pending' ||
          record.status === 'confirmed' ||
          record.status === 'rescheduled';
        const canReschedule =
          record.status === 'pending' || record.status === 'rescheduled';
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
                      notes: '',
                    });
                    setRescheduleModalVisible(true);
                  }}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  // Фильтрация заявок для отображения в таблице
  const filteredRequests = requests.filter((req) => {
    if (selectedDate && req.request_date !== selectedDate.format('YYYY-MM-DD'))
      return false;
    if (
      filters.filterStatus &&
      filters.filterStatus !== 'all' &&
      req.status !== filters.filterStatus
    )
      return false;
    if (
      filters.filterDepartment !== 'all' &&
      req.department_id !== filters.filterDepartment
    )
      return false;
    if (
      filters.filterType &&
      filters.filterType !== 'all' &&
      req.vehicleType?.name !== filters.filterType
    )
      return false;
    return true;
  });

  // Обработчик переноса
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

  // Обработчик создания заявки диспетчером
  const handleCreateRequest = async (values) => {
    const today = dayjs().startOf('day');
    if (values.request_date.isBefore(today, 'day')) {
      message.warning('Нельзя создать заявку на прошедшую дату');
      return;
    }
    if (!values.start_time.isBefore(values.end_time)) {
      message.warning('Время начала должно быть раньше времени окончания');
      return;
    }

    setCreating(true);
    try {
      await onCreateRequest({
        department_id: values.department_id,
        vehicle_type_id: values.vehicle_type_id,
        request_date: values.request_date.format('YYYY-MM-DD'),
        start_time: values.start_time.format('HH:mm:ss'),
        end_time: values.end_time.format('HH:mm:ss'),
        work_place: values.work_place,
        purpose: values.purpose || '',
        created_by: currentUserTabNumber || 'dispatcher',
      });
      setCreateModalVisible(false);
      createForm.resetFields();
      handleRefreshData(); // обновить таблицу заявок
    } catch (error) {
      // ошибка уже обработана в пропсе
    } finally {
      setCreating(false);
    }
  };

  // Заголовок таблицы с фильтрами и кнопкой создания заявки
  const tableTitle = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
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
        departmentsList={departments} // передаём список отделов для правильного отображения фильтра
        searchText={''}
        setSearchText={() => {}}
        showStatusFilter={true}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setCreateModalVisible(true)}
      >
        Создать заявку
      </Button>
    </div>
  );

  return (
    <>
      <Table
        columns={columns}
        dataSource={filteredRequests}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1150 }}
        pagination={false}
        size="small"
        bordered
        title={tableTitle}
      />

      {/* Модальное окно переноса заявки (уже существовало) */}
      <Modal
        title="Перенос заявки"
        open={rescheduleModalVisible}
        onCancel={() => setRescheduleModalVisible(false)}
        onOk={handleRescheduleSubmit}
        okText="Перенести"
        cancelText="Отмена"
      >
        <Form form={rescheduleForm} layout="vertical">
          <Form.Item
            name="new_date"
            label="Новая дата"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="new_start_time"
            label="Время начала"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="new_end_time"
            label="Время окончания"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="notes" label="Причина переноса">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Новое модальное окно создания заявки диспетчером */}
      <Modal
        title="Создание новой заявки"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        onOk={() => createForm.submit()}
        okText="Создать"
        cancelText="Отмена"
        confirmLoading={creating}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateRequest}
          initialValues={{
            request_date: selectedDate,
          }}
        >
          <Form.Item
            name="request_date"
            label="Дата заявки"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={(current) =>
                current && current < dayjs().startOf('day')
              }
            />
          </Form.Item>

          <Form.Item
            name="department_id"
            label="Служба"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Выберите службу"
              showSearch
              optionFilterProp="children"
            >
              {departments.map((dept) => (
                <Option key={dept.id} value={dept.short_name || dept.name}>
                  {dept.short_name || dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="vehicle_type_id"
            label="Тип транспорта"
            rules={[{ required: true, message: 'Выберите тип транспорта' }]}
          >
            <Select placeholder="Выберите тип">
              {vehicleTypes.map((type) => (
                <Option key={type.id} value={type.id}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="start_time"
            label="Начало"
            rules={[{ required: true, message: 'Укажите время начала' }]}
          >
            <TimePicker
              format="HH:mm"
              placeholder="Начало"
              minuteStep={15}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="end_time"
            label="Окончание"
            rules={[{ required: true, message: 'Укажите время окончания' }]}
          >
            <TimePicker
              format="HH:mm"
              placeholder="Конец"
              minuteStep={15}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="work_place"
            label="Место работ"
            rules={[{ required: true, message: 'Укажите место работ' }]}
          >
            <Input placeholder="Например: КС-3, ДЭС-1" />
          </Form.Item>

          <Form.Item name="purpose" label="Цель">
            <Input.TextArea rows={3} placeholder="Необязательно" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
