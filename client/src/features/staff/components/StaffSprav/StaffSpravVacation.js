// components/StaffSprav/StaffSpravVacation.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Typography,
  Badge,
  message,
  theme,
  DatePicker,
  InputNumber,
  Alert,
  AutoComplete,
  Checkbox,
  Select,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  CalendarOutlined,
  FilePdfOutlined,
  SettingOutlined, // <--- добавлено
} from '@ant-design/icons';

import { pdf } from '@react-pdf/renderer';
import { exportVacationToExcel } from '../../utils/exportVacationToExcel';
import VacationPDFDocument from './VacationPDFDocument';
import VacationService from '../../services/VacationService';
import HolidayService from '../../services/HolidayService';
import StaffService from '../../services/StaffService';
import HolidayModal from './HolidayModal';
import styles from './style.module.css';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;
const { useToken } = theme;

// --- Утилиты для работы с датами и праздниками ---
const countWorkingDays = (start, end, holidays) => {
  if (!start || !end) return 0;
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  if (startDate.isAfter(endDate)) return 0;
  let days = 0;
  let current = startDate;
  while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
    const dateStr = current.format('YYYY-MM-DD');
    if (!holidays.some((h) => h.date === dateStr)) {
      days++;
    }
    current = current.add(1, 'day');
  }
  return days;
};

const addWorkingDays = (start, days, holidays) => {
  if (!start || days <= 0) return start;
  let current = dayjs(start);
  let added = 0;
  while (added < days) {
    current = current.add(1, 'day');
    const dateStr = current.format('YYYY-MM-DD');
    if (!holidays.some((h) => h.date === dateStr)) {
      added++;
    }
  }
  return current.format('YYYY-MM-DD');
};

// --- Компонент диаграммы Ганта ---
const VacationGantt = ({ data, holidays, year }) => {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  const months = [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ];

  const filtered = data.filter((item) =>
    item.parts.some((p) => p.start && p.end)
  );

  if (filtered.length === 0) {
    return (
      <Alert
        message="Нет данных для отображения графика"
        description="Добавьте записи с указанием дат начала и окончания отпуска."
        type="info"
        showIcon
        style={{ marginTop: 16 }}
      />
    );
  }

  const totalMs = yearEnd.getTime() - yearStart.getTime();

  const monthPositions = months.map((_, idx) => {
    const date = new Date(year, idx, 1);
    const ms = date.getTime() - yearStart.getTime();
    return (ms / totalMs) * 100;
  });
  monthPositions.push(100);

  const yearHolidays = holidays.filter((h) => dayjs(h.date).year() === year);

  const getBarStyle = (startDate, endDate) => {
    if (!startDate || !endDate) return { left: 0, width: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    let left = ((start.getTime() - yearStart.getTime()) / totalMs) * 100;
    let width = ((end.getTime() - start.getTime()) / totalMs) * 100;
    left = Math.max(0, Math.min(100, left));
    width = Math.max(0, Math.min(100 - left, width));
    return { left, width };
  };

  const partColors = ['#1890ff', '#52c41a', '#faad14'];

  return (
    <div id="vacation-gantt" className={styles.ganttContainerCompact}>
      <div className={styles.ganttHeaderCompact}>
        <div className={styles.ganttLabelCompact}>Сотрудник</div>
        <div className={styles.ganttTimelineCompact}>
          {months.map((m, idx) => (
            <div key={idx} className={styles.ganttMonthCompact}>
              {m}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.ganttBodyCompact}>
        {filtered.map((item) => {
          const parts = item.parts.filter((p) => p.start && p.end);
          if (parts.length === 0) return null;
          return (
            <div key={item.id} className={styles.ganttRowCompact}>
              <div className={styles.ganttLabelCompact} title={item.fio}>
                {item.fio}
              </div>
              <div className={styles.ganttBarsCompact}>
                {monthPositions.slice(0, -1).map((pos, idx) => (
                  <div
                    key={`month-line-${idx}`}
                    style={{
                      position: 'absolute',
                      left: pos + '%',
                      top: 0,
                      height: '100%',
                      width: '1px',
                      backgroundColor: '#cccccc',
                      opacity: 0.5,
                      zIndex: 0,
                      pointerEvents: 'none',
                    }}
                  />
                ))}
                {parts.map((part, idx) => {
                  const style = getBarStyle(part.start, part.end);
                  const color = partColors[idx % partColors.length];
                  const holidayCount = yearHolidays.filter((h) =>
                    dayjs(h.date).isBetween(part.start, part.end, 'day', '[]')
                  ).length;
                  return (
                    <div
                      key={idx}
                      className={styles.ganttBarCompact}
                      style={{
                        left: style.left + '%',
                        width: style.width + '%',
                        backgroundColor: color,
                        zIndex: 1,
                      }}
                      title={`${item.fio}: ${dayjs(part.start).format('DD.MM.YYYY')} – ${dayjs(part.end).format('DD.MM.YYYY')} (${part.days} дн., праздников: ${holidayCount})`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Основной компонент ---
const StaffSpravVacation = () => {
  const { token } = useToken();
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [sortConfig, setSortConfig] = useState({
    key: 'fio',
    direction: 'asc',
  });
  const [holidayModalVisible, setHolidayModalVisible] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [staffOptions, setStaffOptions] = useState([]);
  const [staffMap, setStaffMap] = useState({});
  const today = dayjs();

  // --- Состояния для подписей ---
  const [approver, setApprover] = useState(() => {
    const saved = localStorage.getItem('vacationApprover');
    return saved ? JSON.parse(saved) : { position: 'Начальник Вуктыльского ЛПУМГ', name: 'А.В. Кукин' };
  });
  const [signer, setSigner] = useState(() => {
    const saved = localStorage.getItem('vacationSigner');
    return saved ? JSON.parse(saved) : { position: 'Ведущий инженер АСУ ПХД', name: 'М.А. Голованов' };
  });
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [signatureForm] = Form.useForm();

  const loadHolidays = useCallback(async () => {
    try {
      const data = await HolidayService.fetchAll();
      setHolidays(data);
    } catch {
      message.error('Не удалось загрузить праздничные дни');
    }
  }, []);

  const loadStaffList = useCallback(async () => {
    try {
      const data = await StaffService.fetchStaff();
      const options = data.map((item) => ({
        value: item.fio,
        label: item.fio,
      }));
      options.sort((a, b) => a.value.localeCompare(b.value));
      setStaffOptions(options);
      const map = {};
      data.forEach((item) => {
        map[item.fio] = item.post || '';
      });
      setStaffMap(map);
    } catch (error) {
      console.error('Ошибка загрузки сотрудников:', error);
    }
  }, []);

  const loadRecords = useCallback(async (year) => {
    setIsLoading(true);
    try {
      const data = await VacationService.fetchAll(year);
      setRecords(Array.isArray(data) ? data : []);
    } catch {
      message.error('Ошибка при загрузке графика отпусков');
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHolidays();
    loadRecords(selectedYear);
    loadStaffList();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadRecords(selectedYear);
  }, [selectedYear, loadRecords]);

  const handleAddNew = () => {
    setCurrentRecord(null);
    form.resetFields();
    form.setFieldsValue({ delta: 0 });
    setShowModal(true);
  };

  const handleFioSelect = (value) => {
    if (value && staffMap[value]) {
      form.setFieldsValue({ position: staffMap[value] });
    }
  };

  const handleEdit = () => {
    if (selectedRowKeys.length !== 1) return;
    const record = records.find((r) => r.id === selectedRowKeys[0]);
    if (!record) return;
    setCurrentRecord(record);

    form.setFieldsValue({
      fio: record.fio,
      position: record.position,
      totalDays: record.totalDays,
      part1_start: record.parts[0]?.start ? dayjs(record.parts[0].start) : null,
      part1_end: record.parts[0]?.end ? dayjs(record.parts[0].end) : null,
      part1_days: record.parts[0]?.days || 0,
      part1_isMatPomosh: record.parts[0]?.isMatPomosh || false,
      part2_start: record.parts[1]?.start ? dayjs(record.parts[1].start) : null,
      part2_end: record.parts[1]?.end ? dayjs(record.parts[1].end) : null,
      part2_days: record.parts[1]?.days || 0,
      part2_isMatPomosh: record.parts[1]?.isMatPomosh || false,
      part3_start: record.parts[2]?.start ? dayjs(record.parts[2].start) : null,
      part3_end: record.parts[2]?.end ? dayjs(record.parts[2].end) : null,
      part3_days: record.parts[2]?.days || 0,
      part3_isMatPomosh: record.parts[2]?.isMatPomosh || false,
      delta: record.delta || 0,
    });

    if (record.fio && staffMap[record.fio]) {
      form.setFieldsValue({ position: staffMap[record.fio] });
    }

    setTimeout(() => {
      const formValues = form.getFieldsValue();
      [1, 2, 3].forEach((partIndex) => {
        const startKey = `part${partIndex}_start`;
        const endKey = `part${partIndex}_end`;
        const daysKey = `part${partIndex}_days`;
        const start = formValues[startKey];
        const end = formValues[endKey];
        if (start && end) {
          const days = countWorkingDays(start, end, holidays);
          form.setFieldsValue({ [daysKey]: days });
        }
      });
      recalcDelta();
    }, 0);

    setShowModal(true);
  };

  const recalcDays = useCallback(
    (start, end) => countWorkingDays(start, end, holidays),
    [holidays]
  );

  const recalcEndDate = useCallback(
    (start, days) => addWorkingDays(start, days, holidays),
    [holidays]
  );

  const handlePartDateChange = useCallback(
    (partIndex, field, value) => {
      const formValues = form.getFieldsValue();
      const startKey = `part${partIndex}_start`;
      const endKey = `part${partIndex}_end`;
      const daysKey = `part${partIndex}_days`;

      if (field === 'start') {
        const end = formValues[endKey];
        if (end) {
          const days = recalcDays(value, end);
          form.setFieldsValue({ [daysKey]: days });
        }
      } else if (field === 'end') {
        const start = formValues[startKey];
        if (start) {
          const days = recalcDays(start, value);
          form.setFieldsValue({ [daysKey]: days });
        }
      }
      recalcDelta();
    },
    [form, recalcDays]
  );

  const handleDaysChange = useCallback(
    (partIndex, value) => {
      const formValues = form.getFieldsValue();
      const startKey = `part${partIndex}_start`;
      const endKey = `part${partIndex}_end`;
      const start = formValues[startKey];
      if (start && value >= 0) {
        const newEnd = recalcEndDate(start, value);
        form.setFieldsValue({ [endKey]: newEnd ? dayjs(newEnd) : null });
      }
      recalcDelta();
    },
    [form, recalcEndDate]
  );

  const recalcDelta = useCallback(() => {
    const formValues = form.getFieldsValue();
    const totalDays = formValues.totalDays || 0;
    const part1Days = formValues.part1_days || 0;
    const part2Days = formValues.part2_days || 0;
    const part3Days = formValues.part3_days || 0;
    const delta = totalDays - part1Days - part2Days - part3Days;
    form.setFieldsValue({ delta: delta });
  }, [form]);

  const handleTotalDaysChange = useCallback(() => {
    recalcDelta();
  }, [recalcDelta]);

  const handleMatPomoshChange = (partIndex, checked) => {
    if (checked) {
      const updates = {};
      for (let i = 1; i <= 3; i++) {
        updates[`part${i}_isMatPomosh`] = i === partIndex;
      }
      form.setFieldsValue(updates);
    } else {
      form.setFieldsValue({ [`part${partIndex}_isMatPomosh`]: false });
    }
  };

  const handleDelete = () => {
    if (selectedRowKeys.length === 0) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setConfirmLoading(true);
    try {
      for (const id of selectedRowKeys) {
        await VacationService.delete(id);
      }
      setSelectedRowKeys([]);
      setShowDeleteModal(false);
      loadRecords(selectedYear);
      message.success('Записи успешно удалены');
    } catch {
      message.error('Ошибка при удалении записей');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setConfirmLoading(true);
    try {
      const payload = {
        fio: values.fio,
        position: values.position,
        totalDays: values.totalDays,
        parts: [
          {
            start: values.part1_start
              ? values.part1_start.format('YYYY-MM-DD')
              : '',
            end: values.part1_end ? values.part1_end.format('YYYY-MM-DD') : '',
            days: values.part1_days || 0,
            isMatPomosh: values.part1_isMatPomosh || false,
          },
          {
            start: values.part2_start
              ? values.part2_start.format('YYYY-MM-DD')
              : '',
            end: values.part2_end ? values.part2_end.format('YYYY-MM-DD') : '',
            days: values.part2_days || 0,
            isMatPomosh: values.part2_isMatPomosh || false,
          },
          {
            start: values.part3_start
              ? values.part3_start.format('YYYY-MM-DD')
              : '',
            end: values.part3_end ? values.part3_end.format('YYYY-MM-DD') : '',
            days: values.part3_days || 0,
            isMatPomosh: values.part3_isMatPomosh || false,
          },
        ],
        delta: values.delta || 0,
        year: selectedYear,
      };

      if (currentRecord) {
        await VacationService.update(currentRecord.id, payload);
        message.success('Запись обновлена');
      } else {
        await VacationService.create(payload);
        message.success('Запись создана');
      }
      setShowModal(false);
      loadRecords(selectedYear);
      setSelectedRowKeys([]);
    } catch {
      message.error('Ошибка при сохранении данных');
    } finally {
      setConfirmLoading(false);
    }
  };

  // --- Обработчик сохранения подписей ---
  const handleSaveSignature = (values) => {
    const newApprover = { position: values.approverPosition, name: values.approverName };
    const newSigner = { position: values.signerPosition, name: values.signerName };
    setApprover(newApprover);
    setSigner(newSigner);
    localStorage.setItem('vacationApprover', JSON.stringify(newApprover));
    localStorage.setItem('vacationSigner', JSON.stringify(newSigner));
    setSignatureModalVisible(false);
    message.success('Настройки подписей сохранены');
  };

  // --- Экспорт в PDF ---
  const handleExportPDF = async () => {
    setPdfLoading(true);
    try {
      const doc = (
        <VacationPDFDocument
          data={sortedItems}
          holidays={holidays}
          year={selectedYear}
          today={dayjs().format('YYYY-MM-DD')}
          approver={approver}
          signer={signer}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `График_отпусков_${selectedYear}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      message.success('PDF успешно создан');
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      message.error('Ошибка при создании PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  const requestSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <SortAscendingOutlined style={{ marginLeft: 8 }} />
    ) : (
      <SortDescendingOutlined style={{ marginLeft: 8 }} />
    );
  };

  const sortedItems = useMemo(() => {
    if (!Array.isArray(records) || records.length === 0) return [];
    const filtered = records.filter(
      (rec) =>
        (rec.fio && rec.fio.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rec.position &&
          rec.position.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    if (!sortConfig.key) return filtered;
    return [...filtered].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal === undefined) aVal = '';
      if (bVal === undefined) bVal = '';
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [records, searchTerm, sortConfig]);

  const columns = [
    {
      title: (
        <div style={{ cursor: 'pointer' }} onClick={() => requestSort('fio')}>
          Ф.И.О. {getSortIcon('fio')}
        </div>
      ),
      dataIndex: 'fio',
      key: 'fio',
      width: '18%',
      render: (text) => text || '-',
    },
    {
      title: (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => requestSort('position')}
        >
          Должность {getSortIcon('position')}
        </div>
      ),
      dataIndex: 'position',
      key: 'position',
      width: '14%',
      render: (text) => text || '-',
    },
    {
      title: 'Дней всего',
      dataIndex: 'totalDays',
      key: 'totalDays',
      width: '8%',
      align: 'center',
      render: (text) => text || 0,
    },
    {
      title: 'Отпуск по плану 1 часть',
      children: [
        {
          title: 'Начало',
          dataIndex: ['parts', 0, 'start'],
          key: 'part1_start',
          width: '10%',
          render: (text) => (text ? dayjs(text).format('DD.MM.YYYY') : '-'),
          onCell: (record) => {
            const start = record.parts[0]?.start;
            const end = record.parts[0]?.end;
            const isInRange =
              start && end && today.isBetween(start, end, 'day', '[]');
            return {
              style: { backgroundColor: isInRange ? '#d4edda' : 'transparent' },
            };
          },
        },
        {
          title: 'Окончание',
          dataIndex: ['parts', 0, 'end'],
          key: 'part1_end',
          width: '10%',
          render: (text) => (text ? dayjs(text).format('DD.MM.YYYY') : '-'),
          onCell: (record) => {
            const start = record.parts[0]?.start;
            const end = record.parts[0]?.end;
            const isInRange =
              start && end && today.isBetween(start, end, 'day', '[]');
            return {
              style: { backgroundColor: isInRange ? '#d4edda' : 'transparent' },
            };
          },
        },
        {
          title: 'Дней',
          dataIndex: ['parts', 0, 'days'],
          key: 'part1_days',
          width: '6%',
          align: 'center',
          render: (text) => text || 0,
          onCell: (record) => {
            const isMatPomosh = record.parts?.[0]?.isMatPomosh;
            return {
              style: {
                backgroundColor: isMatPomosh ? '#1890ff' : 'transparent',
                color: isMatPomosh ? '#fff' : 'inherit',
              },
            };
          },
        },
      ],
    },
    {
      title: 'Отпуск по плану 2 часть',
      children: [
        {
          title: 'Начало',
          dataIndex: ['parts', 1, 'start'],
          key: 'part2_start',
          width: '10%',
          render: (text) => (text ? dayjs(text).format('DD.MM.YYYY') : '-'),
          onCell: (record) => {
            const start = record.parts[1]?.start;
            const end = record.parts[1]?.end;
            const isInRange =
              start && end && today.isBetween(start, end, 'day', '[]');
            return {
              style: { backgroundColor: isInRange ? '#d4edda' : 'transparent' },
            };
          },
        },
        {
          title: 'Окончание',
          dataIndex: ['parts', 1, 'end'],
          key: 'part2_end',
          width: '10%',
          render: (text) => (text ? dayjs(text).format('DD.MM.YYYY') : '-'),
          onCell: (record) => {
            const start = record.parts[1]?.start;
            const end = record.parts[1]?.end;
            const isInRange =
              start && end && today.isBetween(start, end, 'day', '[]');
            return {
              style: { backgroundColor: isInRange ? '#d4edda' : 'transparent' },
            };
          },
        },
        {
          title: 'Дней',
          dataIndex: ['parts', 1, 'days'],
          key: 'part2_days',
          width: '6%',
          align: 'center',
          render: (text) => text || 0,
          onCell: (record) => {
            const isMatPomosh = record.parts?.[1]?.isMatPomosh;
            return {
              style: {
                backgroundColor: isMatPomosh ? '#1890ff' : 'transparent',
                color: isMatPomosh ? '#fff' : 'inherit',
              },
            };
          },
        },
      ],
    },
    {
      title: 'Отпуск по плану 3 часть',
      children: [
        {
          title: 'Начало',
          dataIndex: ['parts', 2, 'start'],
          key: 'part3_start',
          width: '10%',
          render: (text) => (text ? dayjs(text).format('DD.MM.YYYY') : '-'),
          onCell: (record) => {
            const start = record.parts[2]?.start;
            const end = record.parts[2]?.end;
            const isInRange =
              start && end && today.isBetween(start, end, 'day', '[]');
            return {
              style: { backgroundColor: isInRange ? '#d4edda' : 'transparent' },
            };
          },
        },
        {
          title: 'Окончание',
          dataIndex: ['parts', 2, 'end'],
          key: 'part3_end',
          width: '10%',
          render: (text) => (text ? dayjs(text).format('DD.MM.YYYY') : '-'),
          onCell: (record) => {
            const start = record.parts[2]?.start;
            const end = record.parts[2]?.end;
            const isInRange =
              start && end && today.isBetween(start, end, 'day', '[]');
            return {
              style: { backgroundColor: isInRange ? '#d4edda' : 'transparent' },
            };
          },
        },
        {
          title: 'Дней',
          dataIndex: ['parts', 2, 'days'],
          key: 'part3_days',
          width: '6%',
          align: 'center',
          render: (text) => text || 0,
          onCell: (record) => {
            const isMatPomosh = record.parts?.[2]?.isMatPomosh;
            return {
              style: {
                backgroundColor: isMatPomosh ? '#1890ff' : 'transparent',
                color: isMatPomosh ? '#fff' : 'inherit',
              },
            };
          },
        },
      ],
    },
    {
      title: 'Дельта',
      dataIndex: 'delta',
      key: 'delta',
      width: '6%',
      align: 'center',
      render: (text) => text || 0,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    type: 'radio',
    columnWidth: 60,
  };

  const getDateRender = (partIndex) => {
    return (current) => {
      const formValues = form.getFieldsValue();
      const startKey = `part${partIndex}_start`;
      const endKey = `part${partIndex}_end`;
      const start = formValues[startKey];
      const end = formValues[endKey];
      const cur = dayjs(current);
      const isHoliday = holidays.some(
        (h) => h.date === cur.format('YYYY-MM-DD')
      );
      const isInRange = start && end && cur.isBetween(start, end, 'day', '[]');
      const isStart = start && cur.isSame(start, 'day');
      const isEnd = end && cur.isSame(end, 'day');

      let style = {
        border: 'none',
        borderRadius: '2px',
        background: 'transparent',
        fontWeight: 'normal',
      };

      if (isStart || isEnd) {
        style.border = '2px solid #1890ff';
        style.background = '#e6f7ff';
      } else if (isInRange) {
        style.background = '#e6f7ff';
        style.fontWeight = 'bold';
      }

      if (isHoliday && !isStart && !isEnd) {
        style.border = '2px solid #ff4d4f';
        style.background = '#fff1f0';
      }

      return (
        <div className="ant-picker-cell-inner" style={style}>
          {cur.date()}
        </div>
      );
    };
  };

  return (
    <div className={styles.spravContent}>
      <Card className={styles.toolbarCard}>
        <Row gutter={16} align="middle">
          <Col style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              style={{ height: 32 }}
            >
              Добавить
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={handleEdit}
              disabled={selectedRowKeys.length !== 1}
              style={{ height: 32 }}
            >
              Редактировать
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              disabled={selectedRowKeys.length === 0}
              style={{ height: 32 }}
            >
              Удалить
            </Button>
            <Button
              icon={<CalendarOutlined />}
              onClick={() => setHolidayModalVisible(true)}
              style={{ height: 32 }}
            >
              Праздничные дни
            </Button>
            <Button
              icon={<FilePdfOutlined />}
              onClick={handleExportPDF}
              loading={pdfLoading}
              style={{ height: 32 }}
            >
              PDF
            </Button>
            {/* Новая кнопка настройки подписей */}
            <Button
              icon={<SettingOutlined />}
              onClick={() => {
                signatureForm.setFieldsValue({
                  approverPosition: approver.position,
                  approverName: approver.name,
                  signerPosition: signer.position,
                  signerName: signer.name,
                });
                setSignatureModalVisible(true);
              }}
              style={{ height: 32 }}
            >
              Настройки подписи
            </Button>
            <Select
              value={selectedYear}
              onChange={setSelectedYear}
              style={{ width: 100 }}
              options={[2024, 2025, 2026, 2027, 2028].map((y) => ({
                value: y,
                label: y,
              }))}
            />
          </Col>
          <Col flex="auto">
            <Search
              placeholder="Поиск по ФИО или должности..."
              allowClear
              enterButton
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={setSearchTerm}
              className={styles.searchInput}
            />
          </Col>
          <Col>
            <Badge
              count={sortedItems.length}
              showZero
              style={{
                backgroundColor: token.colorPrimary,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
            <Text
              style={{
                marginLeft: 8,
                display: 'inline-flex',
                alignItems: 'center',
                color: token.colorTextSecondary,
              }}
            >
              из {records.length}
            </Text>
          </Col>
        </Row>
      </Card>

      <Card id="vacation-table" className={styles.tableCard}>
        <div className={styles.userListScroll}>
          <Table
            size="middle"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={sortedItems.map((item) => ({ ...item, key: item.id }))}
            loading={isLoading}
            locale={{
              emptyText: searchTerm ? 'Ничего не найдено' : 'Нет данных',
            }}
            pagination={false}
            style={{ width: '100%' }}
            rowClassName={styles.tableRow}
            bordered
            scroll={{ x: 1200 }}
          />
        </div>
      </Card>

      <Card title="Визуализация графика отпусков" className={styles.ganttCard}>
        <VacationGantt
          data={sortedItems}
          holidays={holidays}
          year={selectedYear}
        />
      </Card>

    

      <HolidayModal
        visible={holidayModalVisible}
        onClose={() => setHolidayModalVisible(false)}
        onUpdate={loadHolidays}
      />

      <Modal
        title={currentRecord ? 'Редактирование записи' : 'Добавление записи'}
        open={showModal}
        onCancel={() => !confirmLoading && setShowModal(false)}
        footer={null}
        destroyOnClose
        width={900}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ф.И.О."
                name="fio"
                rules={[{ required: true, message: 'Введите ФИО' }]}
              >
                <AutoComplete
                  options={staffOptions}
                  placeholder="Введите или выберите ФИО"
                  allowClear
                  filterOption={(inputValue, option) =>
                    option.value
                      .toLowerCase()
                      .indexOf(inputValue.toLowerCase()) !== -1
                  }
                  onSelect={handleFioSelect}
                  disabled={confirmLoading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Должность"
                name="position"
                rules={[{ required: true, message: 'Введите должность' }]}
              >
                <Input
                  placeholder="Ведущий инженер"
                  disabled={confirmLoading}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Дней отпуска всего"
                name="totalDays"
                rules={[
                  { required: true, message: 'Введите общее количество дней' },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  disabled={confirmLoading}
                  onChange={handleTotalDaysChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Дельта" name="delta">
                <InputNumber min={0} style={{ width: '100%' }} disabled />
              </Form.Item>
            </Col>
          </Row>

          {/* Часть 1 */}
          <div style={{ marginTop: 16, marginBottom: 8 }}>
            <Text strong>Часть 1</Text>
          </div>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Начало" name="part1_start">
                <DatePicker
                  style={{ width: '100%' }}
                  disabled={confirmLoading}
                  onChange={(value) => handlePartDateChange(1, 'start', value)}
                  dateRender={getDateRender(1)}
                  format="DD.MM.YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Окончание" name="part1_end">
                <DatePicker
                  style={{ width: '100%' }}
                  disabled={confirmLoading}
                  onChange={(value) => handlePartDateChange(1, 'end', value)}
                  dateRender={getDateRender(1)}
                  format="DD.MM.YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Дней" name="part1_days">
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  disabled={confirmLoading}
                  onChange={(value) => handleDaysChange(1, value)}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="МП"
                name="part1_isMatPomosh"
                valuePropName="checked"
              >
                <Checkbox
                  disabled={confirmLoading}
                  onChange={(e) => handleMatPomoshChange(1, e.target.checked)}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Часть 2 */}
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <Text strong>Часть 2</Text>
          </div>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Начало" name="part2_start">
                <DatePicker
                  style={{ width: '100%' }}
                  disabled={confirmLoading}
                  onChange={(value) => handlePartDateChange(2, 'start', value)}
                  dateRender={getDateRender(2)}
                  format="DD.MM.YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Окончание" name="part2_end">
                <DatePicker
                  style={{ width: '100%' }}
                  disabled={confirmLoading}
                  onChange={(value) => handlePartDateChange(2, 'end', value)}
                  dateRender={getDateRender(2)}
                  format="DD.MM.YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Дней" name="part2_days">
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  disabled={confirmLoading}
                  onChange={(value) => handleDaysChange(2, value)}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="МП"
                name="part2_isMatPomosh"
                valuePropName="checked"
              >
                <Checkbox
                  disabled={confirmLoading}
                  onChange={(e) => handleMatPomoshChange(2, e.target.checked)}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Часть 3 */}
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <Text strong>Часть 3</Text>
          </div>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Начало" name="part3_start">
                <DatePicker
                  style={{ width: '100%' }}
                  disabled={confirmLoading}
                  onChange={(value) => handlePartDateChange(3, 'start', value)}
                  dateRender={getDateRender(3)}
                  format="DD.MM.YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Окончание" name="part3_end">
                <DatePicker
                  style={{ width: '100%' }}
                  disabled={confirmLoading}
                  onChange={(value) => handlePartDateChange(3, 'end', value)}
                  dateRender={getDateRender(3)}
                  format="DD.MM.YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Дней" name="part3_days">
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  disabled={confirmLoading}
                  onChange={(value) => handleDaysChange(3, value)}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="МП"
                name="part3_isMatPomosh"
                valuePropName="checked"
              >
                <Checkbox
                  disabled={confirmLoading}
                  onChange={(e) => handleMatPomoshChange(3, e.target.checked)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button
                onClick={() => setShowModal(false)}
                disabled={confirmLoading}
                style={{ marginRight: 8 }}
              >
                Отмена
              </Button>
              <Button type="primary" htmlType="submit" loading={confirmLoading}>
                Сохранить
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Подтверждение удаления"
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onOk={confirmDelete}
        confirmLoading={confirmLoading}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
      >
        {selectedRowKeys.length === 1 ? (
          <p>Вы действительно хотите удалить выбранную запись?</p>
        ) : (
          <p>
            Вы действительно хотите удалить выбранные записи (
            {selectedRowKeys.length} шт.)?
          </p>
        )}
        <Alert
          message="Внимание!"
          description="Это действие нельзя отменить."
          type="warning"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Modal>

      {/* Модальное окно настройки подписей */}
      <Modal
        title="Настройка подписей"
        open={signatureModalVisible}
        onCancel={() => setSignatureModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={signatureForm}
          layout="vertical"
          onFinish={handleSaveSignature}
          initialValues={{
            approverPosition: approver.position,
            approverName: approver.name,
            signerPosition: signer.position,
            signerName: signer.name,
          }}
        >
          <Form.Item
            label="Утверждающий — должность"
            name="approverPosition"
            rules={[{ required: true, message: 'Введите должность утверждающего' }]}
          >
            <Input placeholder="Начальник Вуктыльского ЛПУМГ" />
          </Form.Item>
          <Form.Item
            label="Утверждающий — ФИО"
            name="approverName"
            rules={[{ required: true, message: 'Введите ФИО утверждающего' }]}
          >
            <Input placeholder="А.В. Кукин" />
          </Form.Item>
          <Form.Item
            label="Подписывающий — должность"
            name="signerPosition"
            rules={[{ required: true, message: 'Введите должность подписывающего' }]}
          >
            <Input placeholder="Ведущий инженер АСУ ПХД" />
          </Form.Item>
          <Form.Item
            label="Подписывающий — ФИО"
            name="signerName"
            rules={[{ required: true, message: 'Введите ФИО подписывающего' }]}
          >
            <Input placeholder="М.А. Голованов" />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button
                onClick={() => setSignatureModalVisible(false)}
                style={{ marginRight: 8 }}
              >
                Отмена
              </Button>
              <Button type="primary" htmlType="submit">
                Сохранить
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffSpravVacation;