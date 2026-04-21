import React from 'react';
import { Space, Button, Badge, Tooltip, Tag } from 'antd';
import dayjs from 'dayjs';
import {
  UserOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

export const getBookingTableColumns = ({
  selectedDate,
  bookings,
  filterDepartment,
  handleCancelBooking,
  handleBookVehicle,
  getVehicleBookingsForDate,
  getCellColor,
  TIME_SLOTS,
  departments,
}) => {
  const renderBookingsCell = (_, record) => {
    const date = selectedDate.format('YYYY-MM-DD');
    let vehicleBookings = bookings.filter(
      (b) =>
        b.vehicle_id === record.id &&
        b.booking_date === date &&
        b.status === 'active'
    );

    if (filterDepartment !== 'all') {
      vehicleBookings = vehicleBookings.filter(
        (b) => b.department_id === filterDepartment
      );
    }

    if (vehicleBookings.length === 0) {
      return <Badge status="default" text="Свободно" />;
    }

    const slotsMap = new Map();
    vehicleBookings.forEach((booking) => {
      const timeSlot = TIME_SLOTS.find(
        (slot) => slot.id === booking.time_slot_id
      );
      if (timeSlot) {
        if (!slotsMap.has(timeSlot.id)) {
          slotsMap.set(timeSlot.id, {
            slot: timeSlot,
            bookings: [],
          });
        }
        slotsMap.get(timeSlot.id).bookings.push(booking);
      }
    });

    const sortedSlots = Array.from(slotsMap.values()).sort(
      (a, b) => a.slot.sort_order - b.slot.sort_order
    );

    return (
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {sortedSlots.map(({ slot, bookings: slotBookings }) => (
          <Tooltip
            key={slot.id}
            title={slotBookings
              .map((b) => {
                const deptName =
                  b.department?.name ||
                  b.department_name ||
                  'Неизвестный отдел';
                return `${deptName}: ${b.purpose || 'Цель не указана'}`;
              })
              .join('\n')}
            placement="topLeft"
          >
            <Tag
              color="blue"
              closable={slotBookings.length === 1}
              onClose={(e) => {
                e.preventDefault();
                if (slotBookings.length === 1) {
                  handleCancelBooking(slotBookings[0].id);
                }
              }}
              style={{
                margin: '2px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                flexWrap: 'wrap',
                padding: '4px 8px',
                fontSize: '12px',
              }}
            >
              <Space size={4}>
                <ClockCircleOutlined style={{ fontSize: '12px' }} />
                <strong style={{ fontSize: '12px' }}>{slot.label}:</strong>
              </Space>
              <Space size={4} wrap>
                {slotBookings.map((booking) => {
                  const deptName =
                    booking.department?.name ||
                    booking.department_name ||
                    'Неизвестный отдел';
                  return (
                    <span
                      key={booking.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: '12px',
                      }}
                    >
                      {deptName}
                      {slotBookings.length > 1 && (
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelBooking(booking.id);
                          }}
                          style={{
                            marginLeft: 2,
                            padding: '0 2px',
                            height: 'auto',
                            minWidth: 'auto',
                          }}
                        />
                      )}
                    </span>
                  );
                })}
              </Space>
            </Tag>
          </Tooltip>
        ))}
      </Space>
    );
  };

  const renderDriverCell = (_, record) => {
    const date = selectedDate.format('YYYY-MM-DD');
    let vehicleBookings = bookings.filter(
      (b) =>
        b.vehicle_id === record.id &&
        b.booking_date === date &&
        b.status === 'active'
    );

    if (filterDepartment !== 'all') {
      vehicleBookings = vehicleBookings.filter(
        (b) => b.department_id === filterDepartment
      );
    }

    if (vehicleBookings.length === 0) {
      return (
        <Space size={4}>
          <UserOutlined style={{ fontSize: '12px', color: '#d9d9d9' }} />
          <span style={{ fontSize: '12px', color: '#d9d9d9' }}>—</span>
        </Space>
      );
    }

    const slotsMap = new Map();
    vehicleBookings.forEach((booking) => {
      const timeSlot = TIME_SLOTS.find(
        (slot) => slot.id === booking.time_slot_id
      );
      if (timeSlot) {
        if (!slotsMap.has(timeSlot.id)) {
          slotsMap.set(timeSlot.id, {
            slot: timeSlot,
            driver: booking.driver_full_name,
          });
        }
      }
    });

    const sortedSlots = Array.from(slotsMap.values()).sort(
      (a, b) => a.slot.sort_order - b.slot.sort_order
    );

    return (
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {sortedSlots.map(({ slot, driver }) => (
          <div
            key={slot.id}
            style={{
              margin: '2px 0',
              padding: '4px 8px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Space size={4}>
              <UserOutlined style={{ fontSize: '12px', color: '#1890ff' }} />
              <span style={{ fontSize: '12px' }}>{driver || '—'}</span>
            </Space>
          </div>
        ))}
      </Space>
    );
  };

  const renderActionCell = (_, record) => {
    const date = selectedDate.format('YYYY-MM-DD');
    const today = dayjs().startOf('day');
    const isPastDate = selectedDate.isBefore(today, 'day');

    const currentBookings = getVehicleBookingsForDate(record.id, date);
    const bookedSlots = currentBookings.map((b) => b.time_slot_id);
    const availableSlots = TIME_SLOTS.filter(
      (slot) => !bookedSlots.includes(slot.id)
    );
    const isFullyBooked = availableSlots.length === 0;

    if (record.technical_condition !== 'исправен') {
      return (
        <Tooltip title="Автомобиль неисправен">
          <Button type="primary" size="small" disabled>
            Недоступен
          </Button>
        </Tooltip>
      );
    }

    if (isPastDate) {
      return (
        <Tooltip title="Нельзя бронировать на прошедшую дату">
          <Button type="primary" size="small" disabled>
            Просмотр
          </Button>
        </Tooltip>
      );
    }

    if (isFullyBooked) {
      return (
        <Tooltip title="Все временные слоты заняты">
          <Button type="primary" size="small" disabled>
            Все слоты заняты
          </Button>
        </Tooltip>
      );
    }

    return (
      <Space direction="vertical" size={4}>
        <Button
          type="primary"
          size="small"
          onClick={() => handleBookVehicle(record)}
          style={{ fontSize: '12px' }}
        >
          Забронировать
        </Button>
      </Space>
    );
  };

  return [
    {
      title: 'Модель',
      dataIndex: 'vehicle_brand',
      key: 'model',
      width: 100,
      fixed: 'left',
      onCell: (record) => ({ className: getCellColor(record, 'model') }),
      sorter: (a, b) => a.vehicle_brand?.localeCompare(b.vehicle_brand),
      showSorterTooltip: false,
      ellipsis: true,
    },
    {
      title: 'Госномер',
      dataIndex: 'state_number',
      key: 'stateNumber',
      width: 90,
      onCell: (record) => ({ className: getCellColor(record, 'stateNumber') }),
      sorter: (a, b) => a.state_number?.localeCompare(b.state_number),
      showSorterTooltip: false,
      ellipsis: true,
    },
    {
      title: 'Тип',
      dataIndex: 'vehicle_type',
      key: 'type',
      width: 80,
      onCell: (record) => ({ className: getCellColor(record, 'type') }),
      sorter: (a, b) => a.vehicle_type?.localeCompare(b.vehicle_type),
      showSorterTooltip: false,
      ellipsis: true,
    },
    {
      title: 'Подтип',
      dataIndex: 'vehicle_subtype',
      key: 'subtype',
      width: 90,
      onCell: (record) => ({ className: getCellColor(record, 'subtype') }),
      sorter: (a, b) => a.vehicle_subtype?.localeCompare(b.vehicle_subtype),
      showSorterTooltip: false,
      ellipsis: true,
    },
    {
      title: 'Принадлежность',
      dataIndex: 'company_affiliation',
      key: 'affiliation',
      width: 110,
      onCell: (record) => ({ className: getCellColor(record, 'affiliation') }),
      sorter: (a, b) =>
        a.company_affiliation?.localeCompare(b.company_affiliation),
      showSorterTooltip: false,
      ellipsis: true,
    },
    {
      title: 'Бронирования',
      key: 'bookings',
      width: 280,
      render: renderBookingsCell,
      onCell: (record) => ({ className: getCellColor(record, 'bookings') }),
    },
    {
      title: 'Водитель',
      key: 'driver',
      width: 150,
      render: renderDriverCell,
      onCell: (record) => ({ className: getCellColor(record, 'driver') }),
    },
    {
      title: 'Действия',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: renderActionCell,
      onCell: (record) => ({ className: getCellColor(record, 'action') }),
    },
  ];
};