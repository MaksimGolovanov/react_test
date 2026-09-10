// utils/exportVacationToExcel.js
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

/**
 * Экспорт графика отпусков в Excel с визуализацией Ганта
 * @param {Array} data - массив записей (sortedItems)
 * @param {number} year - год
 * @param {string} today - текущая дата в формате YYYY-MM-DD
 */
export const exportVacationToExcel = async (data, year, today) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'АСУ ПХД';
  workbook.created = new Date();

  // ========== ЛИСТ 1: ТАБЛИЦА ==========
  const ws = workbook.addWorksheet('График отпусков', {
    properties: { tabColor: { argb: 'FF1890FF' } },
    pageSetup: { orientation: 'landscape', fitToPage: true, margins: { left: 0.7, right: 0.7, top: 0.7, bottom: 0.7 } },
  });

  // Заголовки (с группировкой)
  const headers = [
    { text: 'Ф.И.О.', colspan: 1 },
    { text: 'Должность', colspan: 1 },
    { text: 'Дней всего', colspan: 1 },
    { text: 'Отпуск по плану 1 часть', colspan: 3 },
    { text: 'Отпуск по плану 2 часть', colspan: 3 },
    { text: 'Отпуск по плану 3 часть', colspan: 3 },
    { text: 'Дельта', colspan: 1 },
  ];

  // Заголовок: первая строка
  const headerRow1 = ws.addRow([]);
  let colIndex = 1;
  headers.forEach(h => {
    const cell = headerRow1.getCell(colIndex);
    cell.value = h.text;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.font = { bold: true, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD0D0D0' } };
    ws.mergeCells(1, colIndex, 1, colIndex + h.colspan - 1);
    colIndex += h.colspan;
  });

  // Заголовок: вторая строка (подзаголовки)
  const subHeaders = ['', '', '', 'Начало', 'Окончание', 'Дней', 'Начало', 'Окончание', 'Дней', 'Начало', 'Окончание', 'Дней', ''];
  const headerRow2 = ws.addRow(subHeaders);
  headerRow2.eachCell(cell => {
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.font = { bold: true, size: 10 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD0D0D0' } };
  });

  // Данные
  const sorted = [...data].sort((a, b) => (a.fio || '').localeCompare(b.fio || ''));
  sorted.forEach((item, idx) => {
    const parts = item.parts || [];
    const row = [
      item.fio || '-',
      item.position || '-',
      item.totalDays || 0,
      parts[0]?.start ? dayjs(parts[0].start).format('DD.MM.YYYY') : '-',
      parts[0]?.end ? dayjs(parts[0].end).format('DD.MM.YYYY') : '-',
      parts[0]?.days || 0,
      parts[1]?.start ? dayjs(parts[1].start).format('DD.MM.YYYY') : '-',
      parts[1]?.end ? dayjs(parts[1].end).format('DD.MM.YYYY') : '-',
      parts[1]?.days || 0,
      parts[2]?.start ? dayjs(parts[2].start).format('DD.MM.YYYY') : '-',
      parts[2]?.end ? dayjs(parts[2].end).format('DD.MM.YYYY') : '-',
      parts[2]?.days || 0,
      item.delta || 0,
    ];
    const rowObj = ws.addRow(row);
    rowObj.eachCell((cell, colNumber) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = { size: 10 };
      // Цвет фона для МП (колонки 6, 9, 12)
      if (colNumber === 6 && parts[0]?.isMatPomosh) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1890FF' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      }
      if (colNumber === 9 && parts[1]?.isMatPomosh) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1890FF' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      }
      if (colNumber === 12 && parts[2]?.isMatPomosh) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1890FF' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      }
      // Зелёный фон для дат в диапазоне сегодня (колонки 4,5,7,8,10,11)
      if ((colNumber === 4 || colNumber === 5 || colNumber === 7 || colNumber === 8 || colNumber === 10 || colNumber === 11) && cell.value !== '-') {
        const partIdx = (colNumber === 4 || colNumber === 5) ? 0 : (colNumber === 7 || colNumber === 8) ? 1 : 2;
        const part = parts[partIdx];
        if (part && part.start && part.end && today) {
          const d = dayjs(today);
          if (d.isBetween(part.start, part.end, 'day', '[]')) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD4EDDA' } };
          }
        }
      }
    });
    // Чередование строк
    if (idx % 2 === 1) {
      rowObj.eachCell(cell => {
        if (!cell.fill) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9F9F9' } };
        }
      });
    }
  });

  // Настройка ширины колонок
  const colWidths = [30, 25, 12, 15, 15, 10, 15, 15, 10, 15, 15, 10, 12];
  colWidths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });

  // Границы
  ws.eachRow(row => {
    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      };
    });
  });

  // ========== ЛИСТ 2: ДИАГРАММА ГАНТА (визуализация заливкой) ==========
  const wsGantt = workbook.addWorksheet('Диаграмма Ганта', {
    properties: { tabColor: { argb: 'FF52C41A' } },
    pageSetup: { orientation: 'landscape', fitToPage: true },
  });

  const months = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
  const monthHeader = ['Сотрудник', ...months];
  const ganttHeader = wsGantt.addRow(monthHeader);
  ganttHeader.eachCell(cell => {
    cell.font = { bold: true, size: 11 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD0D0D0' } };
  });

  const partColors = ['FF1890FF', 'FF52C41A', 'FFFAAD14'];
  sorted.forEach((item, idx) => {
    const parts = item.parts.filter(p => p.start && p.end);
    const rowData = [item.fio];
    for (let m = 0; m < 12; m++) {
      let hasVacation = false;
      let partIdx = 0;
      for (const part of parts) {
        const start = dayjs(part.start);
        const end = dayjs(part.end);
        const monthStart = dayjs(`${year}-${String(m+1).padStart(2,'0')}-01`);
        const monthEnd = monthStart.endOf('month');
        if (start.isBefore(monthEnd) && end.isAfter(monthStart)) {
          hasVacation = true;
          partIdx = parts.indexOf(part);
          break;
        }
      }
      rowData.push(hasVacation ? `Часть ${partIdx+1}` : '');
    }
    const row = wsGantt.addRow(rowData);
    row.eachCell((cell, colNumber) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = { size: 10 };
      if (colNumber > 1 && cell.value) {
        const part = cell.value.split(' ')[1];
        const color = partColors[parseInt(part)-1] || 'FF999999';
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      }
    });
    if (idx % 2 === 1) {
      row.eachCell(cell => {
        if (!cell.fill) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9F9F9' } };
        }
      });
    }
  });

  wsGantt.getColumn(1).width = 30;
  for (let i = 2; i <= 13; i++) {
    wsGantt.getColumn(i).width = 12;
  }

  wsGantt.eachRow(row => {
    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      };
    });
  });

  // ========== СОХРАНЕНИЕ ==========
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `График_отпусков_${year}.xlsx`);
};