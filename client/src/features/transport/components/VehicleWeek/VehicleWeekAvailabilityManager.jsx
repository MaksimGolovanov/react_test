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
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
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
  const [departments, setDepartments] = useState([]); // локальные отделы (с code, short_name)
  const [staff, setStaff] = useState(null);
  const [loadingStaff, setLoadingStaff] = useState(true);

  // Загрузка справочников при монтировании
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Загружаем отделы из API (там есть code и short_name)
        const depts = await TransportService.fetchAllDepartments();
        setDepartments(depts);
        // Загружаем данные сотрудника
        const staffData = await TransportService.fetchStaffOne(
          usersStore.tabNumber
        );
        setStaff(staffData);
        // Загружаем типы транспорта в store, если их нет
        if (!transportStore.vehicleTypes.length)
          await transportStore.fetchVehicleTypes();
        if (!transportStore.departments.length)
          await transportStore.fetchDepartments();
      } catch (error) {
        console.error(error);
        message.error('Ошибка загрузки справочников');
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchInitialData();
  }, []);

  // Название службы пользователя (как в вашем коде)

  const getDepartmentName = useCallback(() => {
    if (!staff?.department) return null;
    const departmentCode = String(staff.department).split(' ')[0];
    const found = departments.find(
      (d) => d.code === departmentCode || d.code === staff.department
    );
    return found?.short_name || null; // возвращаем short_name
  }, [staff, departments]);


  // Получение UUID отдела пользователя для отправки в API

  // Загрузка заявок для выбранной даты
  const loadRequestsForDate = useCallback(
    async (date) => {
      const deptUuid = getDepartmentName(); // ✅ теперь UUID
      if (!deptUuid) {
        message.warning('Не определён отдел пользователя');
        return;
      }
      try {
        await transportStore.fetchRequests({
          date: date.format('YYYY-MM-DD'),
          department_id: deptUuid,
        });
      } catch (error) {
        message.error('Ошибка загрузки заявок');
        console.error(error);
      }
    },
    [getDepartmentName, transportStore]
  );

  // При изменении даты или загрузке сотрудника обновляем заявки
  useEffect(() => {
    if (staff && !loadingStaff) {
      loadRequestsForDate(selectedDate);
    }
  }, [selectedDate, staff, loadingStaff]);

  // Создание заявки
  const handleAddRequest = async () => {
    try {
      const values = await form.validateFields();
      const deptUuid = getDepartmentName(); // ✅ UUID
      if (!deptUuid) {
        message.error('Не удалось определить отдел пользователя');
        return;
      }
      await transportStore.createRequest({
        department_id: deptUuid,
        vehicle_type_id: values.vehicle_type_id,
        start_time: values.start_time.format('HH:mm:ss'),
        end_time: values.end_time.format('HH:mm:ss'),
        request_date: selectedDate.format('YYYY-MM-DD'),
        work_place: values.work_place,
        purpose: values.purpose || '',
        created_by: userStore.card?.tabNumber || 'system',
      });
      message.success('Заявка добавлена');
      form.resetFields([
        'vehicle_type_id',
        'start_time',
        'end_time',
        'work_place',
        'purpose',
      ]);
      await loadRequestsForDate(selectedDate);
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        message.error(`Ошибка: ${error.response.data.message}`);
      } else {
        message.error('Ошибка при создании заявки');
      }
    }
  };

  // Удаление заявки
  const handleDeleteRequest = async (id) => {
    try {
      await transportStore.deleteRequest(id);
      message.success('Заявка удалена');
      await loadRequestsForDate(selectedDate);
    } catch (error) {
      console.error(error);
      message.error('Ошибка удаления заявки');
    }
  };

  const requests = transportStore.requests;

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
      render: (_, rec) =>
        rec.status === 'pending' && (
          <Popconfirm
            title="Удалить заявку?"
            onConfirm={() => handleDeleteRequest(rec.id)}
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        ),
    },
  ];

  if (loadingStaff) return <div>Загрузка...</div>;

  return (
    <div>
      <WeekDayPicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <div
        style={{
          padding: 16,
          background: '#fff',
          border: '1px solid #f0f0f0',
          borderRadius: 8,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
          Заявки на {selectedDate.format('DD.MM.YYYY')}
        </div>
        <div style={{ marginBottom: 16, color: '#666', fontSize: 12 }}>
          Служба: {getDepartmentName()}
        </div>

        <Form form={form} layout="vertical" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Form.Item
              name="vehicle_type_id"
              rules={[{ required: true }]}
              style={{ flex: 1, minWidth: 150 }}
            >
              <Select
                placeholder="Тип транспорта"
                loading={!transportStore.vehicleTypes.length}
              >
                {transportStore.vehicleTypes.map((type) => (
                  <Select.Option key={type.id} value={type.id}>
                    {type.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="start_time" rules={[{ required: true }]}>
              <TimePicker format="HH:mm" placeholder="Начало" />
            </Form.Item>
            <Form.Item name="end_time" rules={[{ required: true }]}>
              <TimePicker format="HH:mm" placeholder="Конец" />
            </Form.Item>
            <Form.Item
              name="work_place"
              rules={[{ required: true }]}
              style={{ flex: 1, minWidth: 200 }}
            >
              <Input placeholder="Место работ" />
            </Form.Item>
            <Form.Item name="purpose" style={{ flex: 1, minWidth: 200 }}>
              <Input placeholder="Цель (необязательно)" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddRequest}
              >
                Добавить заявку
              </Button>
            </Form.Item>
          </div>
        </Form>

        {requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32, color: '#999' }}>
            Нет заявок
          </div>
        ) : (
          <Table
            dataSource={requests}
            columns={columns}
            rowKey="id"
            loading={transportStore.requestsLoading}
            pagination={false}
            bordered
            size="small"
          />
        )}
      </div>
    </div>
  );
});

export default VehicleWeek;
