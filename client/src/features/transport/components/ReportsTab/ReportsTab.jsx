// src/features/transport/components/ReportsTab/ReportsTab.jsx (фрагмент)
import React, { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Table,
  Tabs,
  Tag,
  Space,
  Tooltip,
  Select,
  Row,
  Col,
  theme,
} from 'antd';
import { CarOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useRootStore } from '../../hooks/useStores';
import WeekDayPicker from '../VehicleWeek/WeekDayPicker';
import styles from './ReportsTab.module.css';
dayjs.locale('ru');
const { TabPane } = Tabs;
const { Option } = Select;
const { useToken } = theme;

const driverStatusLabels = (token) => ({
  at_work: { text: 'На работе', color: token.colorSuccess },
  on_vacation: { text: 'В отпуске', color: token.colorWarning },
  on_sick_leave: { text: 'На больничном', color: token.colorError },
  on_study: { text: 'На учёбе', color: token.colorPrimary },
  deactivated: { text: 'Деактивирован', color: token.colorTextDisabled },
});

const getDriverStatusInfo = (driver, token) => {
  const labels = driverStatusLabels(token);
  const info = labels[driver.is_active] || {
    text: driver.is_active,
    color: 'default',
  };
  if (driver.is_active === 'at_work') {
    return <Tag color={info.color}>{info.text}</Tag>;
  }
  const from = driver.date_from
    ? dayjs(driver.date_from).format('DD.MM.YYYY')
    : '—';
  const to = driver.date_to ? dayjs(driver.date_to).format('DD.MM.YYYY') : '—';
  return (
    <Space direction="vertical" size={0}>
      <Tag color={info.color}>{info.text}</Tag>
      <span style={{ fontSize: '12px', color: token.colorTextSecondary }}>
        {from} – {to}
      </span>
    </Space>
  );
};

const getDriverRowStyle = (record, token) => {
  switch (record.is_active) {
    case 'at_work':
      return { backgroundColor: token.colorSuccessBg };
    case 'on_vacation':
      return { backgroundColor: token.colorWarningBg };
    case 'on_sick_leave':
      return { backgroundColor: token.colorErrorBg };
    case 'on_study':
      return { backgroundColor: token.colorPrimaryBg };
    case 'deactivated':
      return { backgroundColor: token.colorBgLayout, opacity: 0.7 };
    default:
      return {};
  }
};

const getVehicleRowStyle = (record, token) => {
  if (record.technical_condition === 'исправен')
    return { backgroundColor: token.colorSuccessBg };
  if (record.technical_condition === 'в ремонте')
    return { backgroundColor: token.colorWarningBg };
  return { backgroundColor: token.colorErrorBg };
};

// === Отчёт по водителям ===
const DriversReport = observer(({ selectedDate }) => {
  const { token } = useToken();
  const { transportStore } = useRootStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const confirmedRequests = useMemo(
    () =>
      transportStore.requests.filter(
        (req) =>
          req.request_date === selectedDate.format('YYYY-MM-DD') &&
          req.status === 'confirmed' &&
          req.assigned_driver_id
      ),
    [transportStore.requests, selectedDate]
  );

  const driverToRequestMap = useMemo(() => {
    return confirmedRequests.reduce((map, req) => {
      if (req.assigned_driver_id) map[req.assigned_driver_id] = req;
      return map;
    }, {});
  }, [confirmedRequests]);

  let filteredDrivers = transportStore.drivers;
  if (statusFilter !== 'all') {
    filteredDrivers = filteredDrivers.filter(
      (d) => d.is_active === statusFilter
    );
  }
  if (departmentFilter !== 'all') {
    filteredDrivers = filteredDrivers.filter(
      (d) => d.department === departmentFilter
    );
  }

  const uniqueDepartments = [
    ...new Set(transportStore.drivers.map((d) => d.department).filter(Boolean)),
  ];

  const columns = [
    {
      title: 'ФИО',
      dataIndex: 'fio',
      sorter: (a, b) => a.fio.localeCompare(b.fio),
    },
    {
      title: 'Должность',
      dataIndex: 'post',
    },
    {
      title: 'Принадлежность',
      dataIndex: 'department',
    },
    {
      title: 'Статус',
      key: 'status',
      render: (_, record) => getDriverStatusInfo(record, token),
    },
    {
      title: 'Задействован',
      key: 'assigned',
      render: (_, record) => {
        const request = driverToRequestMap[record.id];
        if (!request) return <Tag>Нет</Tag>;
        const vehicle = transportStore.vehicles.find(
          (v) => v.id === request.assigned_vehicle_id
        );
        return (
          <Space direction="vertical" size={2}>
            <Tooltip title="Автомобиль">
              <span>
                <CarOutlined />{' '}
                {vehicle
                  ? `${vehicle.vehicle_brand} (${vehicle.state_number})`
                  : '—'}
              </span>
            </Tooltip>
            <Tooltip title="Время">
              <span>
                <CalendarOutlined /> {request.start_time} – {request.end_time}
              </span>
            </Tooltip>
            <div style={{ fontSize: 12, color: token.colorTextSecondary }}>
              Место: {request.work_place}
            </div>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Select
            placeholder="Статус водителя"
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Option value="all">Все</Option>
            <Option value="at_work">На работе</Option>
            <Option value="on_vacation">В отпуске</Option>
            <Option value="on_sick_leave">На больничном</Option>
            <Option value="on_study">На учёбе</Option>
            <Option value="deactivated">Деактивирован</Option>
          </Select>
        </Col>
        <Col>
          <Select
            placeholder="Принадлежность"
            value={departmentFilter}
            onChange={setDepartmentFilter}
          >
            <Option value="all">Все</Option>
            {uniqueDepartments.map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <div className={styles.userListScroll}>
        <Table
          dataSource={filteredDrivers}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered
          size="small"
          onRow={(record) => ({ style: getDriverRowStyle(record, token) })}
        />
      </div>
    </div>
  );
});

// === Отчёт по автомобилям ===
const VehiclesReport = observer(({ selectedDate }) => {
  const { token } = useToken();
  const { transportStore } = useRootStore();
  const [conditionFilter, setConditionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const confirmedRequests = useMemo(
    () =>
      transportStore.requests.filter(
        (req) =>
          req.request_date === selectedDate.format('YYYY-MM-DD') &&
          req.status === 'confirmed' &&
          req.assigned_vehicle_id
      ),
    [transportStore.requests, selectedDate]
  );

  const vehicleToRequestMap = useMemo(() => {
    return confirmedRequests.reduce((map, req) => {
      if (req.assigned_vehicle_id) map[req.assigned_vehicle_id] = req;
      return map;
    }, {});
  }, [confirmedRequests]);

  let filteredVehicles = transportStore.vehicles;
  if (conditionFilter !== 'all') {
    filteredVehicles = filteredVehicles.filter(
      (v) => v.technical_condition === conditionFilter
    );
  }
  if (typeFilter !== 'all') {
    filteredVehicles = filteredVehicles.filter(
      (v) => v.vehicle_type === typeFilter
    );
  }

  const uniqueTypes = [
    ...new Set(
      transportStore.vehicles.map((v) => v.vehicle_type).filter(Boolean)
    ),
  ];

  const columns = [
    {
      title: 'Модель',
      dataIndex: 'vehicle_brand',
      sorter: (a, b) => a.vehicle_brand.localeCompare(b.vehicle_brand),
    },
    { title: 'Госномер', dataIndex: 'state_number' },
    { title: 'Тип', dataIndex: 'vehicle_type' },
    {
      title: 'Тех. состояние',
      dataIndex: 'technical_condition',
      render: (status) => (
        <Tag
          color={
            status === 'исправен'
              ? 'success'
              : status === 'в ремонте'
                ? 'warning'
                : 'error'
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Задействован',
      key: 'assigned',
      render: (_, record) => {
        const request = vehicleToRequestMap[record.id];
        if (!request) return <Tag>Нет</Tag>;
        const driver = transportStore.drivers.find(
          (d) => d.id === request.assigned_driver_id
        );
        return (
          <Space direction="vertical" size={2}>
            <Tooltip title="Водитель">
              <span>
                <UserOutlined /> {driver ? driver.fio : '—'}
              </span>
            </Tooltip>
            <Tooltip title="Время">
              <span>
                <CalendarOutlined /> {request.start_time} – {request.end_time}
              </span>
            </Tooltip>
            <div style={{ fontSize: 12, color: token.colorTextSecondary }}>
              Место: {request.work_place}
            </div>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Select
            placeholder="Тех. состояние"
            value={conditionFilter}
            onChange={setConditionFilter}
          >
            <Option value="all">Все</Option>
            <Option value="исправен">Исправен</Option>
            <Option value="в ремонте">В ремонте</Option>
            <Option value="не исправен">Не исправен</Option>
          </Select>
        </Col>
        <Col>
          <Select
            placeholder="Тип ТС"
            value={typeFilter}
            onChange={setTypeFilter}
          >
            <Option value="all">Все типы</Option>
            {uniqueTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Table
        dataSource={filteredVehicles}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered
        size="small"
        onRow={(record) => ({ style: getVehicleRowStyle(record, token) })}
      />
    </div>
  );
});

// === Главный компонент вкладки Отчёт ===
const ReportsTab = observer(() => {
  const { transportStore, filterStore } = useRootStore();

  useEffect(() => {
    if (!transportStore.drivers.length) transportStore.fetchDrivers();
    if (!transportStore.vehicles.length) transportStore.fetchVehicles();
  }, [transportStore]);

  useEffect(() => {
    if (filterStore.selectedDate) {
      transportStore.fetchRequests({
        date: filterStore.selectedDate.format('YYYY-MM-DD'),
      });
    }
  }, [filterStore.selectedDate, transportStore]);

  return (
    <div style={{ padding: '8px' }}>
      <div style={{ marginBottom: 16 }}>
        <WeekDayPicker
          selectedDate={filterStore.selectedDate}
          setSelectedDate={filterStore.setSelectedDate.bind(filterStore)}
        />
      </div>
      <Tabs defaultActiveKey="drivers">
        <TabPane tab="Водители" key="drivers">
          <DriversReport selectedDate={filterStore.selectedDate} />
        </TabPane>
        <TabPane tab="Автомобили" key="vehicles">
          <VehiclesReport selectedDate={filterStore.selectedDate} />
        </TabPane>
      </Tabs>
    </div>
  );
});

export default ReportsTab;
