import React, { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Table, Tabs, Tag, Space, Tooltip, Select, Row, Col } from 'antd';
import { CarOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useRootStore } from '../../hooks/useStores';
import WeekDayPicker from '../VehicleWeek/WeekDayPicker';

dayjs.locale('ru');

const { TabPane } = Tabs;
const { Option } = Select;

// --- Вспомогательные функции и константы ---
const driverStatusLabels = {
  at_work: { text: 'На работе', color: 'green' },
  on_vacation: { text: 'В отпуске', color: 'orange' },
  on_sick_leave: { text: 'На больничном', color: 'red' },
  on_study: { text: 'На учёбе', color: 'blue' },
  deactivated: { text: 'Деактивирован', color: 'default' },
};

const getDriverStatusInfo = (driver) => {
  const info = driverStatusLabels[driver.is_active] || {
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
      <span style={{ fontSize: '12px', color: '#666' }}>
        {from} – {to}
      </span>
    </Space>
  );
};

const getDriverRowClassName = (record) => {
  switch (record.is_active) {
    case 'at_work':
      return 'report-driver-row-at-work';
    case 'on_vacation':
      return 'report-driver-row-on-vacation';
    case 'on_sick_leave':
      return 'report-driver-row-on-sick-leave';
    case 'on_study':
      return 'report-driver-row-on-study';
    case 'deactivated':
      return 'report-driver-row-deactivated';
    default:
      return '';
  }
};

const getVehicleRowClassName = (record) => {
  if (record.technical_condition === 'исправен')
    return 'report-vehicle-row-good';
  if (record.technical_condition === 'в ремонте')
    return 'report-vehicle-row-repair';
  return 'report-vehicle-row-bad';
};

// Стили для строк (добавляются в head)
const injectRowStyles = () => {
  if (document.getElementById('report-row-styles')) return;
  const style = document.createElement('style');
  style.id = 'report-row-styles';
  style.textContent = `
    .report-driver-row-at-work { background-color: #ffff !important; }
    .report-driver-row-at-work:hover > td { background-color: #d9f7be !important; }
    
    .report-driver-row-on-vacation { background-color: #fff7e6 !important; }
    .report-driver-row-on-vacation:hover > td { background-color: #ffe7ba !important; }
    
    .report-driver-row-on-sick-leave { background-color: #fff1f0 !important; }
    .report-driver-row-on-sick-leave:hover > td { background-color: #ffccc7 !important; }
    
    .report-driver-row-on-study { background-color: #e6f7ff !important; }
    .report-driver-row-on-study:hover > td { background-color: #bae7ff !important; }
    
    .report-driver-row-deactivated { background-color: #fafafa !important; color: #bfbfbf !important; }
    .report-driver-row-deactivated:hover > td { background-color: #f0f0f0 !important; }
    
    .report-vehicle-row-good { background-color: #f6ffed !important; }
    .report-vehicle-row-good:hover > td { background-color: #d9f7be !important; }
    
    .report-vehicle-row-repair { background-color: #fff7e6 !important; }
    .report-vehicle-row-repair:hover > td { background-color: #ffe7ba !important; }
    
    .report-vehicle-row-bad { background-color: #fff1f0 !important; }
    .report-vehicle-row-bad:hover > td { background-color: #ffccc7 !important; }
  `;
  document.head.appendChild(style);
};

// --- Отчёт по водителям ---
const DriversReport = observer(({ selectedDate }) => {
  const { transportStore } = useRootStore();

  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    injectRowStyles();
  }, []);

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
      showSorterTooltip: false,
      width: 200,
    },
    {
      title: 'Должность',
      dataIndex: 'post',
      sorter: (a, b) => a.post.localeCompare(b.post),
      showSorterTooltip: false,
      width: 150,
    },
    {
      title: 'Принадлежность',
      dataIndex: 'department',
      sorter: (a, b) => a.department.localeCompare(b.department),
      showSorterTooltip: false,
      width: 200,
    },
    {
      title: 'Статус',
      key: 'status',
      width: 160,
      render: (_, record) => getDriverStatusInfo(record),
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
            <div style={{ fontSize: 12, color: '#888' }}>
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
            style={{ width: 150 }}
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
            style={{ width: 200 }}
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
      <Table
        dataSource={filteredDrivers}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered
        size="small"
        scroll={{ y: 'calc(100vh - 400px)' }}
        rowClassName={getDriverRowClassName}
      />
    </div>
  );
});

// --- Отчёт по автомобилям ---
const VehiclesReport = observer(({ selectedDate }) => {
  const { transportStore } = useRootStore();

  const [conditionFilter, setConditionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    injectRowStyles();
  }, []);

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
      showSorterTooltip: false,
      width: 180,
    },
    {
      title: 'Госномер',
      dataIndex: 'state_number',
      sorter: (a, b) => a.state_number.localeCompare(b.state_number),
      showSorterTooltip: false,
      width: 120,
    },
    {
      title: 'Тип',
      dataIndex: 'vehicle_type',
      sorter: (a, b) => a.vehicle_type.localeCompare(b.vehicle_type),
      showSorterTooltip: false,
      width: 120,
    },
    {
      title: 'Тех. состояние',
      dataIndex: 'technical_condition',
      width: 130,
      render: (status) => (
        <Tag
          color={
            status === 'исправен'
              ? 'green'
              : status === 'в ремонте'
                ? 'orange'
                : 'red'
          }
        >
          {status}
        </Tag>
      ),
      sorter: (a, b) =>
        a.technical_condition.localeCompare(b.technical_condition),
      showSorterTooltip: false,
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
            <div style={{ fontSize: 12, color: '#888' }}>
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
            style={{ width: 150 }}
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
            style={{ width: 150 }}
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
        scroll={{ y: 'calc(100vh - 400px)' }}
        rowClassName={getVehicleRowClassName}
      />
    </div>
  );
});

// --- Главный компонент вкладки Отчёт ---
const ReportsTab = observer(() => {
  const { transportStore, filterStore } = useRootStore();

  // Загружаем справочники при монтировании
  useEffect(() => {
    if (!transportStore.drivers.length) transportStore.fetchDrivers();
    if (!transportStore.vehicles.length) transportStore.fetchVehicles();
  }, [transportStore]);

  // При изменении глобальной даты загружаем заявки за этот день
  useEffect(() => {
    if (filterStore.selectedDate) {
      transportStore.fetchRequests({
        date: filterStore.selectedDate.format('YYYY-MM-DD'),
      });
    }
  }, [filterStore.selectedDate, transportStore]);

  return (
    <div style={{ padding: '8px', background: '#fff' }}>
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
