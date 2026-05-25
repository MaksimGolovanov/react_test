import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Layout,
  Button,
  Space,
  Modal,
  Form,
  Select,
  Input,
  Tabs,
  message,
} from 'antd';
import {
  CarOutlined,
  CalendarOutlined,
  FilePdfOutlined,
  SettingOutlined,
  UserOutlined,
  TruckOutlined,
  IdcardOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { generateTransportPDF } from '../components/PdfGenerator';
import DirectoryEditor from '../components/DirectoryEditor/DirectoryEditor';
import VehicleManager from '../components/VehicleManager/VehicleManager';
import VehicleWeek from '../components/VehicleWeek/VehicleWeekAvailabilityManager';
import ReportsTab from '../components/ReportsTab/ReportsTab'
import { BookingTableTab } from '../components/BookingTableTab/BookingTableTab';
import DriversManager from '../components/DriversManager/DriversManager';
import StatisticsBar from '../components/StatisticsBar';
import { useRootStore } from '../hooks/useStores';
import styles from './VehicleBooking.module.css';
import usersStore from '../../admin/store/UserStore';

const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

dayjs.locale('ru');

const VehicleBookingPage = observer(() => {
  const { transportStore, filterStore, userStore } = useRootStore();
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [isDirectoryEditorVisible, setIsDirectoryEditorVisible] =
    useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [form] = Form.useForm();
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [activeTabKey, setActiveTabKey] = useState('1');

  const hasAccess = (role) => {
    return (
      usersStore.userRolesAuth.includes(role) ||
      usersStore.userRolesAuth.includes('ADMIN')
    );
  };

  // Обновление всех данных
  const handleRefreshData = async () => {
    await Promise.all([
      transportStore.fetchVehicles(),
      transportStore.fetchBookings(),
      transportStore.fetchDepartments(),
      transportStore.fetchRequests(),
    ]);
    message.success('Данные обновлены');
  };

  useEffect(() => {
    handleRefreshData();
  }, []);

  // Обработчики заявок
  const handleAssignVehicleAndDriver = async (
    requestId,
    vehicleId,
    driverId
  ) => {
    try {
      await transportStore.assignVehicleAndDriver(
        requestId,
        vehicleId,
        driverId
      );
      await transportStore.fetchRequests();
      message.success('Назначено');
    } catch (error) {
      message.error('Ошибка назначения');
    }
  };

  const handleConfirmRequest = async (requestId) => {
    try {
      await transportStore.confirmRequest(requestId);
      await transportStore.fetchRequests();
      await transportStore.fetchBookings();
      message.success('Бронирование подтверждено');
    } catch (error) {
      message.error('Ошибка подтверждения');
    }
  };

  const handleCancelRequest = async (requestId) => {
    Modal.confirm({
      title: 'Отмена заявки',
      content: 'Вы уверены?',
      onOk: async () => {
        try {
          await transportStore.cancelRequest(
            requestId,
            'Отменено диспетчером',
            userStore.card?.tabNumber
          );
          await transportStore.fetchRequests();
          message.success('Заявка отменена');
        } catch (error) {
          message.error('Ошибка отмены');
        }
      },
    });
  };

  const handleRescheduleRequest = async (
    requestId,
    newDate,
    newStart,
    newEnd,
    notes
  ) => {
    try {
      await transportStore.rescheduleRequest(
        requestId,
        newDate,
        newStart,
        newEnd,
        notes
      );
      await transportStore.fetchRequests();
      message.success('Заявка перенесена');
    } catch (error) {
      message.error('Ошибка переноса');
    }
  };

  const handleUpdateBooking = async (requestId, vehicleId, driverId) => {
    try {
      await transportStore.updateBooking(requestId, vehicleId, driverId);
      await transportStore.fetchRequests();
      await transportStore.fetchBookings();
      message.success('Назначение обновлено');
    } catch (error) {
      console.error('Update booking error:', error);
      message.error('Ошибка обновления назначения');
    }
  };

  // Новая функция для создания заявки диспетчером
  const handleCreateRequestForDispatcher = async (requestData) => {
    try {
      await transportStore.createRequest(requestData);
      await transportStore.fetchRequests();
      message.success('Заявка успешно создана');
    } catch (error) {
      console.error('Create request error:', error);
      message.error(
        error.response?.data?.message || 'Ошибка при создании заявки'
      );
    }
  };

  // Загрузка водителей для прямого бронирования (старый функционал)
  const loadDrivers = async () => {
    setLoadingDrivers(true);
    try {
      let driversList = transportStore.drivers;
      if (driversList.length === 0) {
        await transportStore.fetchDrivers();
        driversList = transportStore.drivers;
      }
      setDrivers(driversList.filter((d) => d.is_active !== false));
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setLoadingDrivers(false);
    }
  };

  useEffect(() => {
    if (isBookingModalVisible) {
      loadDrivers();
    }
  }, [isBookingModalVisible]);

  useEffect(() => {
    if (!filterStore.selectedDate) {
      filterStore.setSelectedDate(dayjs().startOf('day'));
    }
  }, []);

  // Прямое бронирование автомобиля (старый функционал)
  const handleBookVehicle = (vehicle) => {
    const today = dayjs().startOf('day');
    const selectedDate = filterStore.selectedDate;
    if (selectedDate && selectedDate.isBefore(today, 'day')) {
      message.warning('Нельзя бронировать автомобиль на прошедшую дату');
      return;
    }
    setSelectedVehicle(vehicle);
    setIsBookingModalVisible(true);
    form.resetFields();
  };

  const handleBookingSubmit = async (values) => {
    if (!selectedVehicle) return;
    const date = filterStore.selectedDate.format('YYYY-MM-DD');
    const selectedDriver = drivers.find((d) => d.id === values.driver_id);
    if (!selectedDriver) {
      message.error('Пожалуйста, выберите водителя');
      return;
    }
    const isAvailable = transportStore.isTimeSlotAvailable(
      selectedVehicle.id,
      date,
      values.timeSlotId
    );
    if (!isAvailable) {
      message.error(
        'Этот временной слот уже занят. Пожалуйста, выберите другой слот.'
      );
      return;
    }
    const bookingData = {
      vehicle_id: selectedVehicle.id,
      department_id: values.departmentId,
      time_slot_id: values.timeSlotId,
      booking_date: date,
      purpose: values.purpose,
      driver_full_name: selectedDriver.fio,
      created_by: userStore.card?.tabNumber,
    };
    try {
      await transportStore.createBooking(bookingData);
      setIsBookingModalVisible(false);
      form.resetFields();
      setDrivers([]);
      message.success('Автомобиль успешно забронирован');
      await transportStore.fetchBookings();
    } catch (error) {
      console.error('Booking error:', error);
      if (error.response?.status === 500) {
        message.error('Этот временной слот уже занят. Выберите другое время.');
      } else {
        message.error('Ошибка при бронировании. Попробуйте еще раз.');
      }
    }
  };

  const handleCancelBooking = async (bookingId) => {
    Modal.confirm({
      title: 'Отмена бронирования',
      content: 'Вы уверены, что хотите отменить это бронирование?',
      onOk: async () => {
        try {
          await transportStore.cancelBooking(
            bookingId,
            userStore.card?.tabNumber
          );
          await transportStore.fetchBookings();
          await transportStore.fetchVehicles();
          message.success('Бронирование успешно отменено');
          setForceUpdate((prev) => prev + 1);
        } catch (error) {
          console.error('Error canceling booking:', error);
          message.error('Ошибка при отмене бронирования');
        }
      },
    });
  };

  // PDF
  const handleGeneratePDF = () => {
    const dateStr = filterStore.selectedDate.format('DD.MM.YYYY');
    const date = filterStore.selectedDate.format('YYYY-MM-DD');

    const bookingsWithDetails = transportStore
      .getBookingsForDate(date)
      .map((booking) => {
        // Поиск отдела: совпадение по id, short_name или name
        const dept = transportStore.departments.find(
          (d) =>
            d.id === booking.department_id ||
            d.short_name === booking.department_id ||
            d.name === booking.department_id
        );
        const timeSlot = transportStore.timeSlots.find(
          (slot) => slot.id === booking.time_slot_id
        );
        const driver = transportStore.drivers.find(
          (d) => d.id === booking.driver_id
        );

        // Формируем метку времени
        let timeLabel = timeSlot?.label;
        if (!timeLabel && booking.start_time && booking.end_time) {
          timeLabel = `${booking.start_time} – ${booking.end_time}`;
        }
        if (!timeLabel) timeLabel = booking.time_slot_id || '—';

        return {
          ...booking,
          vehicle: transportStore.vehicles.find(
            (v) => v.id === booking.vehicle_id
          ),
          time_slot_label: timeLabel,
          driver_full_name: driver?.fio || booking.driver_full_name || '—',
          department_name: dept?.name || booking.department_id,
          department_head: dept?.head_name || 'Не указан', // ← берём из справочника
        };
      });

    generateTransportPDF(bookingsWithDetails, dateStr);
  };

  const getStatisticsForDate = () => {
    const date =
      filterStore.selectedDate?.format('YYYY-MM-DD') ||
      dayjs().format('YYYY-MM-DD');
    const vehicles = transportStore.vehicles;
    const bookings = transportStore.bookings.filter(
      (b) => b.booking_date === date && b.status === 'active'
    );
    const bookedVehicleIds = new Set(bookings.map((b) => b.vehicle_id));
    const booked = bookedVehicleIds.size;
    const available = vehicles.filter(
      (v) => v.technical_condition === 'исправен'
    ).length;
    const unavailable = vehicles.filter(
      (v) => v.technical_condition !== 'исправен'
    ).length;
    const total = vehicles.length;
    return { total, available, unavailable, booked };
  };

  return (
    <Layout style={{ height: 'calc(100vh - 180px)' }}>
      <Header
        style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
          height: 48,
        }}
      >
        <StatisticsBar
          statistics={getStatisticsForDate()}
          selectedDate={filterStore.selectedDate}
        />
        {hasAccess('TRANSPORT') && (
          <Space size="small">
            <Button
              size="small"
              icon={<FilePdfOutlined />}
              onClick={handleGeneratePDF}
            >
              PDF
            </Button>
            <Button
              size="small"
              icon={<SettingOutlined />}
              onClick={() => setIsDirectoryEditorVisible(true)}
            >
              Справочники
            </Button>
          </Space>
        )}
      </Header>

      <Content
        style={{
          padding: '8px',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Tabs
          defaultActiveKey="1"
          onChange={(key) => {
            if (key !== '4') {
              // 4 – ключ вкладки "Заказ"
              handleRefreshData();
            }
          }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {hasAccess('TRANSPORT') && (
            <TabPane
              tab={
                <span>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  Таблица бронирования
                </span>
              }
              key="1"
            >
              <BookingTableTab
                requests={transportStore.requests}
                vehicles={transportStore.vehicles}
                drivers={transportStore.drivers}
                departments={transportStore.departments}
                selectedDate={filterStore.selectedDate}
                setSelectedDate={filterStore.setSelectedDate.bind(filterStore)}
                filters={{
                  filterStatus: filterStore.filterStatus,
                  filterType: filterStore.filterType,
                  filterDepartment: filterStore.filterDepartment,
                }}
                setFilterStatus={filterStore.setFilterStatus.bind(filterStore)}
                setFilterType={filterStore.setFilterType.bind(filterStore)}
                setFilterDepartment={filterStore.setFilterDepartment.bind(
                  filterStore
                )}
                handleRefreshData={handleRefreshData}
                handleResetAllFilters={filterStore.resetAllFilters.bind(
                  filterStore
                )}
                handleAssignVehicleAndDriver={handleAssignVehicleAndDriver}
                handleConfirmRequest={handleConfirmRequest}
                handleCancelRequest={handleCancelRequest}
                handleRescheduleRequest={handleRescheduleRequest}
                handleUpdateBooking={handleUpdateBooking}
                uniqueTypes={transportStore.uniqueVehicleTypes}
                vehicleTypes={transportStore.vehicleTypes}
                timeSlots={transportStore.timeSlots}
                loading={transportStore.requestsLoading}
                onCreateRequest={handleCreateRequestForDispatcher}
                currentUserTabNumber={userStore.card?.tabNumber}
              />
            </TabPane>
          )}

          {hasAccess('TRANSPORT') && (
            <TabPane
              tab={
                <span>
                  <CarOutlined style={{ marginRight: 8 }} />
                  Автотранспорт
                </span>
              }
              key="2"
            >
              <VehicleManager />
            </TabPane>
          )}

          {hasAccess('TRANSPORT') && (
            <TabPane
              tab={
                <span>
                  <IdcardOutlined style={{ marginRight: 8 }} />
                  Водители
                </span>
              }
              key="3"
            >
              <DriversManager />
            </TabPane>
          )}

          <TabPane
            tab={
              <span>
                <TruckOutlined style={{ marginRight: 8 }} />
                Заказ
              </span>
            }
            key="4"
          >
            <VehicleWeek />
          </TabPane>
          <TabPane
            tab={
              <span>
                <FileTextOutlined style={{ marginRight: 8 }} />
                Отчёт
              </span>
            }
            key="5"
          >
            <ReportsTab />
          </TabPane>
        </Tabs>
      </Content>

      {/* Модальное окно прямого бронирования (старый функционал) */}
      <Modal
        title={`Бронирование: ${selectedVehicle?.vehicle_brand} (${selectedVehicle?.state_number})`}
        open={isBookingModalVisible}
        onCancel={() => {
          setIsBookingModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleBookingSubmit} layout="vertical">
          <Form.Item
            name="timeSlotId"
            label="Временной слот"
            rules={[{ required: true, message: 'Выберите временной слот' }]}
          >
            <Select>
              {transportStore.timeSlots.map((slot) => {
                const isAvailable = transportStore.isTimeSlotAvailable(
                  selectedVehicle?.id,
                  filterStore.selectedDate?.format('YYYY-MM-DD'),
                  slot.id
                );
                return (
                  <Option key={slot.id} value={slot.id} disabled={!isAvailable}>
                    {slot.label} {!isAvailable && '(занято)'}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="departmentId"
            label="Служба"
            rules={[{ required: true, message: 'Выберите службу' }]}
          >
            <Select>
              {transportStore.departments.map((dept) => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="driver_id"
            label="Водитель"
            rules={[{ required: true, message: 'Выберите водителя' }]}
          >
            <Select
              placeholder="Выберите водителя"
              loading={loadingDrivers}
              showSearch
              optionFilterProp="children"
              allowClear
            >
              {drivers.map((driver) => (
                <Option key={driver.id} value={driver.id}>
                  <UserOutlined style={{ marginRight: 8 }} />
                  {driver.fio} | {driver.post} | {driver.department}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="purpose"
            label="Цель использования"
            rules={[{ required: true, message: 'Укажите цель использования' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Например: поездка в аэропорт, встреча делегации и т.д."
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Забронировать
              </Button>
              <Button
                onClick={() => {
                  setIsBookingModalVisible(false);
                  form.resetFields();
                }}
              >
                Отмена
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <DirectoryEditor
        visible={isDirectoryEditorVisible}
        onClose={() => setIsDirectoryEditorVisible(false)}
      />
    </Layout>
  );
});

export default VehicleBookingPage;
