// components/StaffSprav/VacationPDFDocument.jsx
import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Svg,
  Line,
  Rect,
} from '@react-pdf/renderer';
import dayjs from 'dayjs';

// Регистрируем шрифты Times New Roman (поддержка кириллицы)
Font.register({
  family: 'TimesNewRoman',
  src: '/fonts/TNR/times.ttf',
});
Font.register({
  family: 'TimesNewRoman-Bold',
  src: '/fonts/TNR/timesbd.ttf',
});

const MM = 2.83465;
const PAGE_WIDTH_MM = 297;
const PAGE_HEIGHT_MM = 210;
const MARGIN_MM = 15;
const PAGE_WIDTH = PAGE_WIDTH_MM * MM;
const PAGE_HEIGHT = PAGE_HEIGHT_MM * MM;
const MARGIN = MARGIN_MM * MM;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

const styles = StyleSheet.create({
  page: {
    padding: MARGIN,
    backgroundColor: '#ffffff',
    fontFamily: 'TimesNewRoman',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  headerText: {
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 25,
    fontFamily: 'TimesNewRoman-Bold',
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
    border: '1px solid #000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  tableCell: {
    padding: 4,
    fontSize: 8,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRight: '1px solid #000',
  },
  tableCellLast: {
    borderRight: 'none',
  },
  tableHeader: {
    backgroundColor: '#d0d0d0',
    fontWeight: 'bold',
    fontSize: 9,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
  },
});

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
const getPosition = (date, year) => {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  const totalMs = yearEnd.getTime() - yearStart.getTime();
  const ms = new Date(date).getTime() - yearStart.getTime();
  return (ms / totalMs) * 100;
};

const isDateInRange = (dateStr, start, end) => {
  if (!dateStr || !start || !end) return false;
  const d = dayjs(dateStr);
  return d.isBetween(start, end, 'day', '[]');
};

// ========== КОМПОНЕНТ ТАБЛИЦЫ ==========
const VacationTable = ({ data, year, today }) => {
  const sorted = [...data].sort((a, b) =>
    (a.fio || '').localeCompare(b.fio || '')
  );

  const colWidths = [90, 80, 60, 60, 60, 48, 60, 60, 48, 60, 60, 48, 55];
  const rowHeight = 20;

  const headerRow1 = [
    { text: 'Ф.И.О.', cols: 1 },
    { text: 'Должность', cols: 1 },
    { text: 'Дней всего', cols: 1 },
    { text: 'Отпуск по плану 1 часть', cols: 3 },
    { text: 'Отпуск по плану 2 часть', cols: 3 },
    { text: 'Отпуск по плану 3 часть', cols: 3 },
    { text: 'Дельта', cols: 1 },
  ];

  const headerRow2 = [
    { text: '', cols: 1 },
    { text: '', cols: 1 },
    { text: '', cols: 1 },
    { text: 'Начало', cols: 1 },
    { text: 'Окончание', cols: 1 },
    { text: 'Дней', cols: 1 },
    { text: 'Начало', cols: 1 },
    { text: 'Окончание', cols: 1 },
    { text: 'Дней', cols: 1 },
    { text: 'Начало', cols: 1 },
    { text: 'Окончание', cols: 1 },
    { text: 'Дней', cols: 1 },
    { text: '', cols: 1 },
  ];

  // Строим строку заголовка с сохранением начального и конечного индекса колонок
  const buildHeaderRow = (headerData) => {
    const cells = [];
    let colIndex = 0;
    headerData.forEach((item) => {
      const span = item.cols || 1;
      const width = colWidths
        .slice(colIndex, colIndex + span)
        .reduce((a, b) => a + b, 0);
      cells.push({
        text: item.text,
        width,
        isHeader: true,
        bgColor: '#d0d0d0',
        startCol: colIndex,
        endCol: colIndex + span - 1,
      });
      colIndex += span;
    });
    return cells;
  };

  // Формируем строки данных
  const dataRows = sorted.map((item, idx) => {
    const parts = item.parts || [];
    const rowData = [
      item.fio || '-',
      item.position || '-',
      String(item.totalDays || 0),
      parts[0]?.start ? dayjs(parts[0].start).format('DD.MM.YYYY') : '-',
      parts[0]?.end ? dayjs(parts[0].end).format('DD.MM.YYYY') : '-',
      String(parts[0]?.days || 0),
      parts[1]?.start ? dayjs(parts[1].start).format('DD.MM.YYYY') : '-',
      parts[1]?.end ? dayjs(parts[1].end).format('DD.MM.YYYY') : '-',
      String(parts[1]?.days || 0),
      parts[2]?.start ? dayjs(parts[2].start).format('DD.MM.YYYY') : '-',
      parts[2]?.end ? dayjs(parts[2].end).format('DD.MM.YYYY') : '-',
      String(parts[2]?.days || 0),
      String(item.delta || 0),
    ];

    const styles = rowData.map((cell, colIdx) => {
      let bgColor = idx % 2 === 0 ? '#f9f9f9' : '#ffffff';
      let textColor = '#000000';

      if (colIdx === 5 && parts[0]?.isMatPomosh) {
        bgColor = '#1890ff';
        textColor = '#ffffff';
      } else if (colIdx === 8 && parts[1]?.isMatPomosh) {
        bgColor = '#1890ff';
        textColor = '#ffffff';
      } else if (colIdx === 11 && parts[2]?.isMatPomosh) {
        bgColor = '#1890ff';
        textColor = '#ffffff';
      }

      const isStart = colIdx === 3 || colIdx === 6 || colIdx === 9;
      const isEnd = colIdx === 4 || colIdx === 7 || colIdx === 10;
      if ((isStart || isEnd) && today && cell !== '-') {
        const partIdx =
          colIdx === 3 || colIdx === 4
            ? 0
            : colIdx === 6 || colIdx === 7
              ? 1
              : 2;
        const part = parts[partIdx];
        if (part && part.start && part.end) {
          const inRange = isDateInRange(today, part.start, part.end);
          if (inRange) {
            bgColor = '#d4edda';
          }
        }
      }

      return { bgColor, textColor };
    });

    return { rowData, styles };
  });

  // Собираем все строки
  const allRows = [];
  // Первая строка заголовка
  allRows.push(buildHeaderRow(headerRow1));
  // Вторая строка заголовка
  allRows.push(buildHeaderRow(headerRow2));
  // Строки данных (каждая ячейка занимает одну колонку)
  dataRows.forEach(({ rowData, styles }) => {
    const cells = rowData.map((text, idx) => ({
      text,
      width: colWidths[idx],
      bgColor: styles[idx].bgColor,
      textColor: styles[idx].textColor,
      isHeader: false,
      startCol: idx,
      endCol: idx,
    }));
    allRows.push(cells);
  });

  return (
    <View style={styles.table}>
      {allRows.map((rowCells, rowIndex) => {
        const isLastRow = rowIndex === allRows.length - 1;
        const isFirstRow = rowIndex === 0;
        return (
          <View
            key={rowIndex}
            style={[
              styles.tableRow,
              { borderBottom: 'none' }, // убираем общую границу, будем задавать у ячеек
            ]}
          >
            {rowCells.map((cell, colIndex) => {
              let borderBottom = '1px solid #000';
              if (isLastRow) borderBottom = 'none';

              // Для первой строки убираем нижнюю границу у ячеек, покрывающих только колонки 0, 1, 2 или 12
              if (isFirstRow) {
                const start = cell.startCol;
                const end = cell.endCol;
                if (
                  (start === 0 && end === 0) || // Ф.И.О.
                  (start === 1 && end === 1) || // Должность
                  (start === 2 && end === 2) || // Дней всего
                  (start === 12 && end === 12) // Дельта
                ) {
                  borderBottom = 'none';
                }
              }

              return (
                <View
                  key={colIndex}
                  style={[
                    styles.tableCell,
                    {
                      width: cell.width,
                      backgroundColor: cell.bgColor,
                      borderBottom: borderBottom,
                    },
                    colIndex === rowCells.length - 1 && styles.tableCellLast,
                    cell.isHeader && styles.tableHeader,
                  ]}
                >
                  <Text
                    style={{
                      fontSize: cell.isHeader ? 9 : 8,
                      fontWeight: cell.isHeader ? 'bold' : 'normal',
                      color: cell.textColor || '#000',
                      fontFamily: 'TimesNewRoman',
                    }}
                  >
                    {cell.text}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

// ========== ГРАФИК ГАНТА (ВЕКТОРНЫЙ SVG) ==========
const GanttChart = ({ data, year, width }) => {
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
  const partColors = ['#1890ff', '#52c41a', '#faad14'];

  const filtered = data.filter((item) =>
    item.parts.some((p) => p.start && p.end)
  );
  if (!filtered.length) return null;

  const rowHeight = 16; // увеличено для лучшей читаемости
  const labelWidth = 140; // ширина для ФИО (отступ слева)
  const chartWidth = width - labelWidth - 10; // оставляем место для ФИО
  const chartHeight = filtered.length * rowHeight + 30;
  const yStart = 22;

  const monthPositions = months.map((_, idx) => {
    const date = new Date(year, idx, 1);
    return getPosition(date, year);
  });
  monthPositions.push(100);

  return (
    <View style={{ marginTop: 10, marginBottom: 10 }}>
      <Svg
        viewBox={`0 0 ${width} ${chartHeight}`}
        width={width}
        height={chartHeight}
      >
        {/* Линии месяцев */}
        {monthPositions.slice(0, -1).map((pos, idx) => (
          <Line
            key={`month-line-${idx}`}
            x1={labelWidth + (pos * chartWidth) / 100}
            y1={0}
            x2={labelWidth + (pos * chartWidth) / 100}
            y2={chartHeight}
            stroke="#cccccc"
            strokeWidth={0.5}
          />
        ))}
        {/* Подписи месяцев */}
        {monthPositions.slice(0, -1).map((pos, idx) => (
          <Text
            key={`month-label-${idx}`}
            x={labelWidth + (pos * chartWidth) / 100 + 2}
            y={10}
            fontSize={6}
            fill="#666"
            fontFamily="TimesNewRoman"
          >
            {months[idx]}
          </Text>
        ))}

        {/* Горизонтальные разделительные линии между сотрудниками */}
        {filtered.map((_, rowIdx) => {
          const y = yStart + rowIdx * rowHeight;
          return (
            <Line
              key={`hline-${rowIdx}`}
              x1={labelWidth}
              y1={y + rowHeight}
              x2={width}
              y2={y + rowHeight}
              stroke="#e0e0e0"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Полосы отпусков и ФИО */}
        {filtered.map((item, rowIdx) => {
          const y = yStart + rowIdx * rowHeight;
          const parts = item.parts.filter((p) => p.start && p.end);
          return (
            <React.Fragment key={item.id}>
              {/* ФИО сотрудника */}
              <Text
                x={2}
                y={y + 10}
                fontSize={9}
                fill="#000"
                fontFamily="TimesNewRoman"
              >
                {item.fio}
              </Text>
              {/* Полосы отпусков */}
              {parts.map((part, partIdx) => {
                const left =
                  labelWidth +
                  (getPosition(part.start, year) * chartWidth) / 100;
                const right =
                  labelWidth + (getPosition(part.end, year) * chartWidth) / 100;
                const widthBar = right - left;
                const color = partColors[partIdx % partColors.length];
                return widthBar > 0 ? (
                  <Rect
                    key={`bar-${item.id}-${partIdx}`}
                    x={left}
                    y={y + 1}
                    width={widthBar}
                    height={rowHeight - 2}
                    fill={color}
                    opacity={0.8}
                    rx={2}
                  />
                ) : null;
              })}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

// ========== ОСНОВНОЙ ДОКУМЕНТ ==========
const VacationPDFDocument = ({
  data,
  holidays = [],
  year = 2026,
  today = null,
  approver = { position: 'Начальник Вуктыльского ЛПУМГ', name: 'А.В. Кукин' },
  signer = { position: 'Ведущий инженер АСУ ПХД', name: 'М.А. Голованов' },
}) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Шапка с утверждающим */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text
              style={{
                alignItems: 'flex-end',
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'TimesNewRoman-Bold',
              }}
            >
              Утверждаю
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginTop: 4,
                fontFamily: 'TimesNewRoman',
              }}
            >
              {approver.position}
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginTop: 14,
                fontFamily: 'TimesNewRoman',
              }}
            >
              __________________{approver.name}
            </Text>
          </View>
        </View>

        {/* Заголовок */}
        <Text style={styles.title}>
          График отпусков группы АСУ ПХД на {year} год.
        </Text>

        {/* Таблица */}
        <VacationTable data={data} year={year} today={today} />

        {/* График Ганта (векторный SVG) */}
        <GanttChart data={data} year={year} width={CONTENT_WIDTH} />

        {/* Подпись с подписывающим */}
        <View style={styles.footer}>
          <Text style={{ fontSize: 12, fontFamily: 'TimesNewRoman' }}>
            {signer.position}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              fontFamily: 'TimesNewRoman-Bold',
            }}
          >
            __________________{signer.name}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default VacationPDFDocument;
