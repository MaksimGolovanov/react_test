import React from 'react';
import { pdf, Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import Roboto from '../fonts/Roboto.ttf';

Font.register({ family: 'Roboto', src: Roboto });

const styles = StyleSheet.create({
  page: { padding: 15, fontFamily: 'Roboto', fontSize: 12 },
  header: { marginBottom: 10, textAlign: 'center' },
  title: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  dateText: { fontSize: 12, marginBottom: 3 },
  totalText: { fontSize: 12, marginBottom: 12 },
  departmentSection: { marginBottom: 12 },
  departmentTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  departmentHead: { fontSize: 12, marginBottom: 5 },
  table: { borderStyle: 'solid', borderWidth: 1, marginTop: 4 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, minHeight: 22 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#ffffff', minHeight: 26, borderBottomWidth: 1, borderBottomColor: '#000' },
  tableCol: { flex: 1, padding: 3, borderRightWidth: 1 },
  tableColLast: { flex: 1, padding: 3 },
  tableHeaderText: { fontWeight: 'bold', fontSize: 12 },
  tableCellText: { fontSize: 12 },
  footer: { marginTop: 20, textAlign: 'right' },
  watermark: { position: 'absolute', bottom: 20, right: 20, fontSize: 8, color: '#ccc' },
});

const TransportTable = ({ data, columns }) => (
  <View style={styles.table}>
    <View style={styles.tableHeader}>
      {columns.map((col, i) => (
        <View key={i} style={i === columns.length - 1 ? styles.tableColLast : styles.tableCol}>
          <Text style={styles.tableHeaderText}>{col}</Text>
        </View>
      ))}
    </View>
    {data.map((row, i) => (
      <View key={i} style={styles.tableRow}>
        {row.map((cell, j) => (
          <View key={j} style={j === row.length - 1 ? styles.tableColLast : styles.tableCol}>
            <Text style={styles.tableCellText}>{cell || '-'}</Text>
          </View>
        ))}
      </View>
    ))}
  </View>
);

const TransportSchedulePDF = ({ bookings, date }) => {
  // Группировка по department_name
  const bookingsByDepartment = bookings.reduce((acc, b) => {
    const key = b.department_name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  const columns = ['Тип', 'Модель', 'Госномер', 'Водитель', 'Время', 'Цель'];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>График распределения автотранспорта</Text>
          <Text style={styles.dateText}>Дата: {date}</Text>
          <Text style={styles.totalText}>Всего бронирований: {bookings.length}</Text>
        </View>

        {Object.entries(bookingsByDepartment).map(([deptName, deptBookings]) => {
          // Берём начальника из первого бронирования (они одинаковы для всей группы)
          const headName = deptBookings[0]?.department_head || 'Не указан';
          const tableData = deptBookings.map((b) => [
            b.vehicle?.vehicle_type || '-',
            b.vehicle?.vehicle_brand || '-',
            b.vehicle?.state_number || '-',
            b.driver_full_name || '-',
            b.time_slot_label || b.start_time && b.end_time ? `${b.start_time}–${b.end_time}` : '-',
            b.purpose || '-',
          ]);
          return (
            <View key={deptName} style={styles.departmentSection}>
              <Text style={styles.departmentTitle}>{deptName}</Text>
              <Text style={styles.departmentHead}>Начальник: {headName}</Text>
              <TransportTable data={tableData} columns={columns} />
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text>Заместитель начальника Вуктыльского ЛПУМГ: _______________ И.В. Зубахин</Text>
        </View>
        <Text style={styles.watermark}>Сформировано: {new Date().toLocaleString('ru-RU')}</Text>
      </Page>
    </Document>
  );
};

export const generateTransportPDF = async (bookings, date) => {
  if (!bookings?.length) return alert('Нет данных для формирования PDF');
  try {
    const blob = await pdf(<TransportSchedulePDF bookings={bookings} date={date} />).toBlob();
    saveAs(blob, `График_распределения_ТС_${date}.pdf`);
  } catch (err) {
    console.error(err);
    alert('Ошибка при формировании PDF');
  }
};