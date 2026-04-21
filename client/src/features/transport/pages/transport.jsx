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
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { generateTransportPDF } from '../components/PdfGenerator';
import DirectoryEditor from '../components/DirectoryEditor/DirectoryEditor';
import VehicleManager from '../components/VehicleManager/VehicleManager';
import { BookingTableTab } from '../components/BookingTableTab/BookingTableTab';
import StatisticsBar from '../components/StatisticsBar';
import { useRootStore } from '../hooks/useStores';
import styles from './VehicleBooking.module.css';

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

  useEffect(() => {
    if (isBookingModalVisible) {
      loadDrivers();
    }
  }, [isBookingModalVisible]);

  // Функция загрузки водителей
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
  // Инициализация даты
  useEffect(() => {
    if (!filterStore.selectedDate) {
      filterStore.setSelectedDate(dayjs().startOf('day'));
    }
  }, []);

  useEffect(() => {
    // Статистика пересчитается автоматически при изменении зависимостей
  }, [
    filterStore.selectedDate,
    transportStore.vehicles,
    transportStore.bookings,
  ]);

  const handleBookVehicle = (vehicle) => {
    const today = dayjs().startOf('day');
    const selectedDate = filterStore.selectedDate;

    // Проверяем, что выбранная дата не прошедшая
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

    // Находим выбранного водителя
    const selectedDriver = drivers.find((d) => d.id === values.driver_id);

    if (!selectedDriver) {
      message.error('Пожалуйста, выберите водителя');
      return;
    }

    // Двойная проверка доступности слота
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

    console.log('Creating booking with data:', bookingData);

    try {
      await transportStore.createBooking(bookingData);
      setIsBookingModalVisible(false);
      form.resetFields();
      setDrivers([]);
      message.success('Автомобиль успешно забронирован');
      // Обновляем данные после бронирования
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
          // Отменяем бронирование
          await transportStore.cancelBooking(
            bookingId,
            userStore.card?.tabNumber
          );

          // Принудительно обновляем список бронирований
          await transportStore.fetchBookings();

          // Обновляем также список автомобилей (на всякий случай)
          await transportStore.fetchVehicles();

          message.success('Бронирование успешно отменено');

          // Принудительно обновляем компонент
          setForceUpdate((prev) => prev + 1);
        } catch (error) {
          console.error('Error canceling booking:', error);
          message.error('Ошибка при отмене бронирования');
        }
      },
    });
  };

  const handleGeneratePDF = () => {
    const dateStr = filterStore.selectedDate.format('DD.MM.YYYY');
    const date = filterStore.selectedDate.format('YYYY-MM-DD');

    const bookingsWithVehiclesAndSlots = transportStore
      .getBookingsForDate(date)
      .map((booking) => ({
        ...booking,
        vehicle: transportStore.vehicles.find(
          (v) => v.id === booking.vehicle_id
        ),
        time_slot_label:
          transportStore.timeSlots.find(
            (slot) => slot.id === booking.time_slot_id
          )?.label || booking.time_slot_id,
      }));

    generateTransportPDF(
      bookingsWithVehiclesAndSlots,
      transportStore.departments,
      dateStr
    );
  };

  const handleRefreshData = async () => {
    await Promise.all([
      transportStore.fetchVehicles(),
      transportStore.fetchBookings(),
      transportStore.fetchDepartments(),
    ]);
    message.success('Данные обновлены');
  };

  const getCellColor = (record, columnKey) => {
    const date = filterStore.selectedDate.format('YYYY-MM-DD');
    const hasBooking = transportStore.bookings.some(
      (b) =>
        b.vehicle_id === record.id &&
        b.booking_date === date &&
        b.status === 'active'
    );

    if (record.technical_condition !== 'исправен') {
      return styles.cellOverdue;
    }
    if (hasBooking) {
      return styles.cellBooked;
    }
    return styles.cellAvailable;
  };

  const getStatisticsForDate = () => {
    const date =
      filterStore.selectedDate?.format('YYYY-MM-DD') ||
      dayjs().format('YYYY-MM-DD');
    const vehicles = transportStore.vehicles;
    const bookings = transportStore.bookings.filter(
      (b) => b.booking_date === date && b.status === 'active'
    );

    // Количество забронированных уникальных автомобилей
    const bookedVehicleIds = new Set(bookings.map((b) => b.vehicle_id));
    const booked = bookedVehicleIds.size;

    // Статистика по состоянию автомобилей
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
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
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
              key={forceUpdate}
              vehicles={transportStore.vehicles}
              bookings={transportStore.bookings}
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
              handleResetTypeFilter={filterStore.resetTypeFilter.bind(
                filterStore
              )}
              handleResetDepartmentFilter={filterStore.resetDepartmentFilter.bind(
                filterStore
              )}
              handleResetAllFilters={filterStore.resetAllFilters.bind(
                filterStore
              )}
              handleBookVehicle={handleBookVehicle}
              handleCancelBooking={handleCancelBooking}
              getVehicleBookingsForDate={transportStore.getVehicleBookingsForDate.bind(
                transportStore
              )}
              getCellColor={getCellColor}
              uniqueTypes={transportStore.uniqueVehicleTypes}
              filteredVehicles={filterStore.filteredVehicles}
              timeSlots={transportStore.timeSlots}
            />
          </TabPane>

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
        </Tabs>
      </Content>

      {/* Модальное окно бронирования */}
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
                const isAvailable =
                  selectedVehicle &&
                  transportStore.isTimeSlotAvailable(
                    selectedVehicle.id,
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
