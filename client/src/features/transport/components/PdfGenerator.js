import React from 'react';
import {
  pdf,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import Roboto from '../fonts/Roboto.ttf';

Font.register({ family: 'Roboto', src: Roboto });

const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontFamily: 'Roboto',
    fontSize: 12,
  },
  header: {
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 12,
    marginBottom: 3,
  },
  totalText: {
    fontSize: 12,
    marginBottom: 12,
  },
  departmentSection: {
    marginBottom: 12,
  },
  departmentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#000000',
  },
  departmentHead: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    minHeight: 22,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    minHeight: 26,
    // ✅ Добавляем линию под шапкой
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableCol: {
    flex: 1,
    padding: 3,
    borderRightWidth: 1,
  },
  tableColLast: {
    flex: 1,
    padding: 3,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#000000',
    fontSize: 12,
  },
  tableCellText: {
    fontSize: 12,
  },
  footer: {
    marginTop: 20,
    textAlign: 'right',
  },
  watermark: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 8,
    color: '#cccccc',
  },
});

const TransportTable = ({ data, columns }) => (
  <View style={styles.table}>
    <View style={styles.tableHeader}>
      {columns.map((col, i) => (
        <View
          key={i}
          style={
            i === columns.length - 1 ? styles.tableColLast : styles.tableCol
          }
        >
          <Text style={styles.tableHeaderText}>{col}</Text>
        </View>
      ))}
    </View>
    {data.map((row, i) => (
      <View key={i} style={styles.tableRow}>
        {row.map((cell, j) => (
          <View
            key={j}
            style={j === row.length - 1 ? styles.tableColLast : styles.tableCol}
          >
            <Text style={styles.tableCellText}>{cell || '-'}</Text>
          </View>
        ))}
      </View>
    ))}
  </View>
);

const TransportSchedulePDF = ({ bookings, departments, date }) => {
  const bookingsByDepartment = bookings.reduce((acc, b) => {
    const dept = b.department_id;
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(b);
    return acc;
  }, {});

  const columns = ['Тип', 'Модель', 'Госномер', 'Водитель', 'Время', 'Цель'];

  // Функция для получения ФИО водителя из разных возможных полей
  const getDriverName = (booking) => {
    // Пробуем взять из vehicle.driver_full_name
    if (booking.vehicle?.driver_full_name) return booking.vehicle.driver_full_name;
    // Если нет – возможно, поле driver_full_name лежит прямо в бронировании
    if (booking.driver_full_name) return booking.driver_full_name;
    // Или driver_name
    if (booking.driver_name) return booking.driver_name;
    // Иначе прочерк
    return '-';
  };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>График распределения автотранспорта</Text>
          <Text style={styles.dateText}>Дата: {date}</Text>
          <Text style={styles.totalText}>
            Всего бронирований: {bookings.length}
          </Text>
        </View>

        {Object.entries(bookingsByDepartment).map(([deptId, deptBookings]) => {
          const dept = departments.find((d) => d.id === deptId);
          const tableData = deptBookings.map((b) => [
            b.vehicle?.vehicle_type || '-',
            b.vehicle?.vehicle_brand || '-',
            b.vehicle?.state_number || '-',
            getDriverName(b), // ✅ используем улучшенную функцию
            b.time_slot_label || b.time_slot_id,
            b.purpose || '-',
          ]);
          return (
            <View key={deptId} style={styles.departmentSection}>
              <Text style={styles.departmentTitle}>
                {dept?.name || 'Неизвестная служба'}
              </Text>
              <Text style={styles.departmentHead}>
                Начальник: {dept?.head_name || 'Не указан'}
              </Text>
              <TransportTable data={tableData} columns={columns} />
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text>
            Заместитель начальника Вуктыльского ЛПУМГ: _______________ И.В.
            Зубахин
          </Text>
        </View>
        <Text style={styles.watermark}>
          Сформировано: {new Date().toLocaleString('ru-RU')}
        </Text>
      </Page>
    </Document>
  );
};

export const generateTransportPDF = async (bookings, departments, date) => {
  if (!bookings?.length) return alert('Нет данных для формирования PDF');
  try {
    const blob = await pdf(
      <TransportSchedulePDF {...{ bookings, departments, date }} />
    ).toBlob();
    saveAs(blob, `График_распределения_ТС_${date}.pdf`);
  } catch (err) {
    console.error(err);
    alert('Ошибка при формировании PDF');
  }
};