// src/features/ius-pt/utils/exportIusApplication.js
import * as ExcelJS from 'exceljs';

export const generateIusApplicationExcel = async (
  user,
  selectedGroup,
  checkboxes,
  admins
) => {
  // Получаем нужных администраторов
  const iusadm = admins.find((admin) => admin.cod === 'admarm')?.iusadm || '';
  const iusadmemail =
    admins.find((admin) => admin.cod === 'admarm')?.email || '';
  const iusib = admins.find((admin) => admin.cod === 'admib')?.iusadm || '';
  const iusibemail = admins.find((admin) => admin.cod === 'admib')?.email || '';
  const cps = admins.find((admin) => admin.cod === 'cps')?.iusadm || '';
  const gd = admins.find((admin) => admin.cod === 'gd')?.iusadm || '';

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  const formatDate = (date) => {
    const isoDate = date.toISOString();
    const parts = isoDate.split('T')[0].split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };
  const currentDate = formatDate(new Date());
  const parts = user.fio.split(' ');
  worksheet.columns = Array(47).fill({ width: 2 });

  // Добавление пустых строк
  worksheet.addRow(Array(47).fill(''));
  worksheet.addRow(Array(47).fill(''));
  worksheet.addRow(Array(47).fill(''));

  // Объединение ячеек (заголовки)
  const merges = [
    'A2:AU2',
    'A4:W4',
    'X4:AU4',
    'A5:AU5',
    'A6:W6',
    'X6:AU6',
    'A7:W7',
    'X7:AU7',
    'A8:W8',
    'X8:AU8',
    'A9:W9',
    'X9:AU9',
    'A10:AU10',
    'A11:W11',
    'X11:AU11',
    'A12:W12',
    'X12:AU12',
    'A13:W13',
    'X13:AU13',
    'A14:W14',
    'X14:AU14',
    'A15:AU15',
    'A16:W16',
    'X16:AU16',
    'A17:W17',
    'X17:AU17',
    'A18:C18',
    'D18:G18',
    'H18:M18',
    'N18:Y18',
    'Z18:AL18',
    'AM18:AU18',
  ];
  merges.forEach((m) => worksheet.mergeCells(m));

  // Данные для объединённых ячеек (текст, стили)
  const mergedCellsData = [
    {
      cell: 'A2',
      text: `Индивидуальная заявка на доступ пользователя к ИР ${selectedGroup.systemType}`,
      size: 12,
      horizontal: 'center',
      bold: true,
    },
    {
      cell: 'A4',
      text: '№ заявки',
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'X4',
      text: `Дата заполнения заявки:  ${currentDate}`,
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'A5',
      text: 'Раздел 1. Данные пользователя',
      size: 9,
      horizontal: 'left',
      hasBorder: true,
      bold: true,
    },
    {
      cell: 'A6',
      text: 'Организация:           ООО "Газпром трансгаз Ухта"',
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'X6',
      text: `Фамилия:  ${parts[0]}`,
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'A7',
      text: 'Подразделение:       Вуктыльское ЛПУМГ',
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'X7',
      text: `Имя:        ${parts[1]}`,
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'A8',
      text: `Должность:  ${user.post}`,
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'X8',
      text: `Отчество: ${parts[2]}`,
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'A9',
      text: `E-mail:  ${user.email}`,
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'X9',
      text: `Телефон: ${user.telephone}`,
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'A10',
      text: 'Адрес: 169570, Российская Федерация, Республика Коми, г. Вуктыл',
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'A11',
      text: `Имя компьютера:  ${user.IusUser.computerName}`,
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    { cell: 'X11', text: '', size: 9, horizontal: 'left', hasBorder: true },
    {
      cell: 'A12',
      text: `IP адрес рабочего места:  ${user.ip}`,
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    { cell: 'X12', text: '', size: 9, horizontal: 'left', hasBorder: true },
    {
      cell: 'A13',
      text: 'e-mail непосредственного руководителя пользователя:',
      size: 9,
      horizontal: 'left',
      borders: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
    },
    {
      cell: 'X13',
      text: 'Ф.И.О. непосредственного руководителя пользователя:',
      size: 9,
      horizontal: 'left',
      borders: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
    },
    {
      cell: 'A14',
      text: `${user.IusUser.managerEmail}`,
      size: 9,
      horizontal: 'left',
      borders: {
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
    },
    {
      cell: 'X14',
      text: `${user.IusUser.manager}`,
      size: 9,
      horizontal: 'left',
      borders: {
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
    },
    {
      cell: 'A15',
      text: 'Раздел 2. Системные реквизиты',
      size: 9,
      horizontal: 'left',
      hasBorder: true,
      bold: true,
    },
    {
      cell: 'A16',
      text: 'Новый пользователь: ☐',
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'X16',
      text: 'Установка клиентской части: ☐',
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'A17',
      text: 'Зона тестирования: ☐',
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'X17',
      text: 'Зона постоянной эксплуатации: ☑',
      size: 9,
      horizontal: 'left',
      hasBorder: true,
    },
    {
      cell: 'A18',
      text: '№ п/п',
      size: 8,
      horizontal: 'center',
      hasBorder: true,
    },
    {
      cell: 'D18',
      text: 'Добавить/Удалить',
      size: 8,
      horizontal: 'center',
      hasBorder: true,
      wrapText: true,
    },
    {
      cell: 'H18',
      text: 'SID / Мандант',
      size: 8,
      horizontal: 'center',
      hasBorder: true,
    },
    {
      cell: 'N18',
      text: 'Функциональная роль/Бизнес-роль',
      size: 8,
      horizontal: 'center',
      hasBorder: true,
      wrapText: true,
    },
    {
      cell: 'Z18',
      text: 'Код роли',
      size: 8,
      horizontal: 'center',
      hasBorder: true,
    },
    {
      cell: 'AM18',
      text: 'Организационная роль/Объект полномочий',
      size: 8,
      horizontal: 'center',
      hasBorder: true,
    },
  ];

  const row18 = worksheet.getRow(18);
  row18.height = 24;

  mergedCellsData.forEach(
    ({ cell, text, size, horizontal, hasBorder, borders, bold, wrapText }) => {
      const targetCell = worksheet.getCell(cell);
      targetCell.value = text;
      targetCell.font = { name: 'Times New Roman', size, bold: !!bold };
      targetCell.alignment = {
        horizontal,
        vertical: 'middle',
        wrapText: !!wrapText,
      };
      if (borders) targetCell.border = borders;
      else if (hasBorder)
        targetCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      else targetCell.border = undefined;
    }
  );

  // Данные ролей
  selectedGroup.roles
    .sort((a, b) => a.code.localeCompare(b.code))
    .forEach((role, index) => {
      const rowNum = index + 19;
      worksheet.addRow(['', '', '', '', '', '']);
      worksheet.mergeCells(`A${rowNum}:C${rowNum}`);
      worksheet.mergeCells(`D${rowNum}:G${rowNum}`);
      worksheet.mergeCells(`H${rowNum}:M${rowNum}`);
      worksheet.mergeCells(`N${rowNum}:Y${rowNum}`);
      worksheet.mergeCells(`Z${rowNum}:AL${rowNum}`);
      worksheet.mergeCells(`AM${rowNum}:AU${rowNum}`);

      worksheet.getCell(`A${rowNum}`).value = index + 1;
      worksheet.getCell(`A${rowNum}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      worksheet.getCell(`D${rowNum}`).value = 'Добавить';
      worksheet.getCell(`D${rowNum}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      worksheet.getCell(`H${rowNum}`).value = role.type + '/' + role.mandat;
      worksheet.getCell(`H${rowNum}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      worksheet.getCell(`N${rowNum}`).value = role.name;
      worksheet.getCell(`N${rowNum}`).alignment = {
        horizontal: 'left',
        vertical: 'middle',
        wrapText: true,
      };
      worksheet.getCell(`Z${rowNum}`).value = role.code;
      worksheet.getCell(`Z${rowNum}`).alignment = {
        horizontal: 'left',
        vertical: 'middle',
        wrapText: true,
      };
      worksheet.getCell(`AU${rowNum}`).value = '';

      const cellsToFormat = [
        `A${rowNum}`,
        `D${rowNum}`,
        `H${rowNum}`,
        `N${rowNum}`,
        `Z${rowNum}`,
        `AU${rowNum}`,
      ];
      cellsToFormat.forEach((cellAddress) => {
        const cell = worksheet.getCell(cellAddress);
        cell.font = { name: 'Times New Roman', size: 8 };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
      const linesName = Math.ceil(role.name.length / 32);
      const linesCode = Math.ceil(role.code.length / 32);
      worksheet.getRow(rowNum).height = Math.max(linesName, linesCode) * 12;
    });

  const lastRowIndex = 19 + selectedGroup.roles.length;

  // Footer – объединения ячеек (полный набор из оригинального кода)
  const footerMerges = [
    `A${lastRowIndex}:AU${lastRowIndex}`,
    `A${lastRowIndex + 1}:AU${lastRowIndex + 1}`,
    `A${lastRowIndex + 2}:P${lastRowIndex + 2}`,
    `Q${lastRowIndex + 2}:AE${lastRowIndex + 2}`,
    `AF${lastRowIndex + 2}:AU${lastRowIndex + 2}`,
    `A${lastRowIndex + 3}:P${lastRowIndex + 3}`,
    `Q${lastRowIndex + 3}:W${lastRowIndex + 3}`,
    `X${lastRowIndex + 3}:AE${lastRowIndex + 3}`,
    `AF${lastRowIndex + 3}:AU${lastRowIndex + 3}`,
    `A${lastRowIndex + 4}:AU${lastRowIndex + 4}`,
    `A${lastRowIndex + 5}:M${lastRowIndex + 5}`,
    `N${lastRowIndex + 5}:AB${lastRowIndex + 5}`,
    `AC${lastRowIndex + 5}:AL${lastRowIndex + 5}`,
    `AM${lastRowIndex + 5}:AU${lastRowIndex + 5}`,
    `A${lastRowIndex + 6}:M${lastRowIndex + 6}`,
    `N${lastRowIndex + 6}:AB${lastRowIndex + 6}`,
    `AC${lastRowIndex + 6}:AL${lastRowIndex + 6}`,
    `AM${lastRowIndex + 6}:AU${lastRowIndex + 6}`,
    `A${lastRowIndex + 7}:AU${lastRowIndex + 7}`,
    `A${lastRowIndex + 8}:AU${lastRowIndex + 8}`,
    `A${lastRowIndex + 9}:AU${lastRowIndex + 9}`,
    `A${lastRowIndex + 10}:AE${lastRowIndex + 10}`,
    `AF${lastRowIndex + 10}:AL${lastRowIndex + 10}`,
    `AM${lastRowIndex + 10}:AU${lastRowIndex + 10}`,
    `A${lastRowIndex + 11}:AE${lastRowIndex + 11}`,
    `AF${lastRowIndex + 11}:AU${lastRowIndex + 11}`,
    `A${lastRowIndex + 12}:AE${lastRowIndex + 12}`,
    `AF${lastRowIndex + 12}:AL${lastRowIndex + 12}`,
    `AM${lastRowIndex + 12}:AU${lastRowIndex + 12}`,
    `A${lastRowIndex + 13}:AE${lastRowIndex + 13}`,
    `AF${lastRowIndex + 13}:AL${lastRowIndex + 13}`,
    `AM${lastRowIndex + 13}:AU${lastRowIndex + 13}`,
    `A${lastRowIndex + 14}:AU${lastRowIndex + 14}`,
    `A${lastRowIndex + 15}:AU${lastRowIndex + 15}`,
    `A${lastRowIndex + 16}:T${lastRowIndex + 16}`,
    `U${lastRowIndex + 16}:AL${lastRowIndex + 16}`,
    `AM${lastRowIndex + 16}:AU${lastRowIndex + 16}`,
    `A${lastRowIndex + 17}:AU${lastRowIndex + 17}`,
    `A${lastRowIndex + 18}:T${lastRowIndex + 19}`,
    `U${lastRowIndex + 18}:AU${lastRowIndex + 19}`,
    `A${lastRowIndex + 20}:T${lastRowIndex + 20}`,
    `A${lastRowIndex + 21}:T${lastRowIndex + 21}`,
    `U${lastRowIndex + 20}:AU${lastRowIndex + 21}`,
  ];
  if (
    selectedGroup.systemType === 'ИУС П Т' ||
    selectedGroup.systemType === 'ИУС НК'
  ) {
    footerMerges.push(
      `A${lastRowIndex + 22}:T${lastRowIndex + 24}`,
      `U${lastRowIndex + 22}:AU${lastRowIndex + 22}`,
      `U${lastRowIndex + 23}:AU${lastRowIndex + 23}`,
      `U${lastRowIndex + 24}:AU${lastRowIndex + 24}`
    );
  } else {
    footerMerges.push(
      `A${lastRowIndex + 22}:T${lastRowIndex + 23}`,
      `U${lastRowIndex + 22}:AU${lastRowIndex + 23}`
    );
  }
  footerMerges.forEach((m) => worksheet.mergeCells(m));

  // Данные footer (полный массив из исходного кода)
  const footer = [
    {
      cell: `A${lastRowIndex}`,
      text: `Дополнительные параметры: табельный номер АСУП - ${user.IusUser.tabNumber}`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: false,
    },
    {
      cell: `A${lastRowIndex + 1}`,
      text: `Раздел 3. Подключение рабочего места`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: true,
    },
    {
      cell: `A${lastRowIndex + 2}`,
      text: `Подключение нового АРМ ${checkboxes.newArmVariable ? '☑' : '☐'}`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: false,
    },
    {
      cell: `Q${lastRowIndex + 2}`,
      text: `Отключение АРМ ${checkboxes.disableArm ? '☑' : '☐'}`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: false,
    },
    {
      cell: `AF${lastRowIndex + 2}`,
      text: `Изменение условий подключения АРМ ${checkboxes.conditionsChange ? '☑' : '☐'}`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: false,
    },
    {
      cell: `A${lastRowIndex + 3}`,
      text: `Расположение рабочего места:`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: false,
    },
    {
      cell: `Q${lastRowIndex + 3}`,
      text: `ИВС ${checkboxes.ivs ? '☑' : '☐'}`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: false,
    },
    {
      cell: `X${lastRowIndex + 3}`,
      text: `ЕВСПД ${checkboxes.evspd ? '☑' : '☐'}`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: false,
    },
    {
      cell: `AF${lastRowIndex + 3}`,
      text: `Интернет ${checkboxes.internet ? '☑' : '☐'}`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: false,
    },
    {
      cell: `A${lastRowIndex + 4}`,
      text: `Рабочее место соответствует Требованиям по настройкам и мерам защиты рабочих мест, сетевой доступ предоставлен`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: false,
    },
    {
      cell: `A${lastRowIndex + 5}`,
      text: `Администратор АРМ`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: false,
    },
    {
      cell: `N${lastRowIndex + 5}`,
      text: `${iusadmemail}`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: false,
    },
    {
      cell: `AC${lastRowIndex + 5}`,
      text: `${currentDate}`,
      size: '9',
      horizontal: 'left',
      bold: false,
      borders: {
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        top: { style: 'thin' },
      },
    },
    {
      cell: `AM${lastRowIndex + 5}`,
      text: `${iusadm}`,
      size: '9',
      horizontal: 'right',
      bold: false,
      borders: {
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
      },
    },
    {
      cell: `A${lastRowIndex + 6}`,
      text: `Администратор ИБ`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: false,
    },
    {
      cell: `N${lastRowIndex + 6}`,
      text: `${iusibemail}`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: false,
    },
    {
      cell: `AC${lastRowIndex + 6}`,
      text: `${currentDate}`,
      size: '9',
      horizontal: 'left',
      bold: false,
      borders: {
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        top: { style: 'thin' },
      },
    },
    {
      cell: `AM${lastRowIndex + 6}`,
      text: `${iusib}`,
      size: '9',
      horizontal: 'right',
      bold: false,
      borders: {
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
      },
    },
    {
      cell: `A${lastRowIndex + 7}`,
      text: `С перечнем информации, составляющей коммерческую тайну, и иной конфиденциальной информации, установленными в Обществе`,
      size: '8',
      horizontal: 'left',
      bold: false,
      borders: {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
      },
    },
    {
      cell: `A${lastRowIndex + 8}`,
      text: `режимом коммерческой тайны и порядком обработки персональных данных, Памяткой пользователя ИУС по обеспечению`,
      size: '8',
      horizontal: 'left',
      bold: false,
      borders: { left: { style: 'thin' }, right: { style: 'thin' } },
    },
    {
      cell: `A${lastRowIndex + 9}`,
      text: `информационной безопасности ИУС ПАО «Газпром», а также с мерами ответственности за нарушение режима коммерческой тайны и`,
      size: '8',
      horizontal: 'left',
      bold: false,
      borders: { left: { style: 'thin' }, right: { style: 'thin' } },
    },
    {
      cell: `A${lastRowIndex + 10}`,
      text: `действия в отношении обрабатываемых персональных данных пользователи ознакомлены.`,
      size: '8',
      horizontal: 'left',
      bold: false,
      borders: { left: { style: 'thin' } },
    },
    {
      cell: `AF${lastRowIndex + 10}`,
      text: ``,
      size: '8',
      horizontal: 'left',
      bold: false,
      borders: { bottom: { style: 'thin' } },
    },
    {
      cell: `AM${lastRowIndex + 10}`,
      text: `( ${parts[1][0]}.${parts[2][0]}. ${parts[0]} )`,
      size: '9',
      horizontal: 'right',
      bold: false,
      borders: { right: { style: 'thin' } },
    },
    {
      cell: `A${lastRowIndex + 11}`,
      text: `«Договор (Соглашение) о конфиденциальности с ПАО «Газпром» (ОГГ) заключен: `,
      size: '8',
      horizontal: 'left',
      bold: false,
      borders: { left: { style: 'thin' } },
    },
    {
      cell: `AF${lastRowIndex + 11}`,
      text: `${user.IusUser.contractDetails}`,
      size: '9',
      horizontal: 'left',
      bold: false,
      borders: { bottom: { style: 'thin' }, right: { style: 'thin' } },
    },
    {
      cell: `A${lastRowIndex + 12}`,
      text: `Предоставлен ли доступ к персональным данным, обрабатываемым в ИСПД:`,
      size: '8',
      horizontal: 'left',
      bold: false,
      borders: { left: { style: 'thin' } },
    },
    {
      cell: `AF${lastRowIndex + 12}`,
      text: `Да`,
      size: '8',
      horizontal: 'center',
      bold: false,
      borders: { bottom: { style: 'thin' } },
    },
    {
      cell: `AM${lastRowIndex + 12}`,
      text: ``,
      size: '9',
      horizontal: 'right',
      bold: false,
      borders: { right: { style: 'thin' } },
    },
    {
      cell: `A${lastRowIndex + 13}`,
      text: `Руководитель подразделения корпоративной защиты ООО «Газпром трансгаз Ухта»:`,
      size: '8',
      horizontal: 'left',
      bold: false,
      borders: { left: { style: 'thin' } },
    },
    {
      cell: `AF${lastRowIndex + 13}`,
      text: ``,
      size: '8',
      horizontal: 'center',
      bold: false,
      borders: { bottom: { style: 'thin' } },
    },
    {
      cell: `AM${lastRowIndex + 13}`,
      text: `( ${cps} )`,
      size: '9',
      horizontal: 'right',
      bold: false,
      borders: { right: { style: 'thin' } },
    },
    {
      cell: `A${lastRowIndex + 14}`,
      text: `Согласие субъекта персональных данных (пользователя) на обработку (в том числе передачу третьей стороне) его персональных данных`,
      size: '8',
      horizontal: 'left',
      bold: false,
      borders: { left: { style: 'thin' }, right: { style: 'thin' } },
    },
    {
      cell: `A${lastRowIndex + 15}`,
      text: `имеется.`,
      size: '8',
      horizontal: 'left',
      bold: false,
      borders: { left: { style: 'thin' }, right: { style: 'thin' } },
    },
    {
      cell: `A${lastRowIndex + 16}`,
      text: `Генеральный директор ООО «Газпром трансгаз Ухта»`,
      size: '9',
      horizontal: 'left',
      bold: false,
      borders: { left: { style: 'thin' } },
    },
    {
      cell: `U${lastRowIndex + 16}`,
      text: ``,
      size: '8',
      horizontal: 'center',
      bold: false,
      borders: { bottom: { style: 'thin' } },
    },
    {
      cell: `AM${lastRowIndex + 16}`,
      text: `( ${gd} )`,
      size: '9',
      horizontal: 'right',
      bold: false,
      borders: { right: { style: 'thin' } },
    },
    {
      cell: `A${lastRowIndex + 17}`,
      text: `СОГЛАСОВАНО:`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: true,
    },
    {
      cell: `A${lastRowIndex + 18}`,
      text: `Контакт-центр ООО «Газпром информ»`,
      size: '9',
      horizontal: 'left',
      hasBorder: true,
      bold: true,
    },
    {
      cell: `U${lastRowIndex + 18}`,
      text: `(дата, подпись) (ФИО)`,
      size: '9',
      horizontal: 'right',
      hasBorder: true,
      bold: false,
    },
    {
      cell: `A${lastRowIndex + 20}`,
      text: `Центр кибербезопасности`,
      size: '9',
      horizontal: 'left',
      bold: true,
      borders: {
        left: { style: 'thin' },
        top: { style: 'thin' },
        right: { style: 'thin' },
      },
    },
    {
      cell: `A${lastRowIndex + 21}`,
      text: `Службы корпоративной защиты ПАО «Газпром»`,
      size: '9',
      horizontal: 'left',
      bold: true,
      borders: {
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    },
    {
      cell: `U${lastRowIndex + 20}`,
      text: `(дата, подпись) (ФИО)`,
      size: '9',
      horizontal: 'right',
      hasBorder: true,
      bold: false,
    },
  ];

  // Добавляем дополнительные строки в зависимости от системы
  if (
    selectedGroup.systemType === 'ИУС П Т' ||
    selectedGroup.systemType === 'ИУС НК'
  ) {
    footer.push(
      {
        cell: `A${lastRowIndex + 22}`,
        text: `Владелец информационного ресурса`,
        size: '9',
        horizontal: 'left',
        bold: true,
        hasBorder: true,
      },
      {
        cell: `U${lastRowIndex + 22}`,
        text: `Генеральный директор`,
        size: '9',
        horizontal: 'left',
        bold: false,
        borders: {
          left: { style: 'thin' },
          top: { style: 'thin' },
          right: { style: 'thin' },
        },
      },
      {
        cell: `U${lastRowIndex + 23}`,
        text: `ООО «Газпром трансгаз Ухта» _____________________  (${gd})`,
        size: '9',
        horizontal: 'right',
        bold: false,
        borders: { left: { style: 'thin' }, right: { style: 'thin' } },
      },
      {
        cell: `U${lastRowIndex + 24}`,
        text: `                                        (дата, подпись) (ФИО)`,
        size: '7',
        horizontal: 'center',
        bold: false,
        borders: {
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        },
      }
    );
  } else {
    footer.push(
      {
        cell: `A${lastRowIndex + 22}`,
        text: `Владелец информационного ресурса`,
        size: '9',
        horizontal: 'left',
        bold: true,
        hasBorder: true,
      },
      {
        cell: `U${lastRowIndex + 22}`,
        text: `(дата, подпись) (ФИО)`,
        size: '9',
        horizontal: 'right',
        bold: false,
        hasBorder: true,
      }
    );
  }

  footer.forEach(
    ({ cell, text, size, horizontal, hasBorder, borders, bold }) => {
      const targetCell = worksheet.getCell(cell);
      targetCell.value = text;
      targetCell.font = {
        name: 'Times New Roman',
        size: parseInt(size),
        bold: bold,
      };
      targetCell.alignment = { horizontal, vertical: 'middle', wrapText: true };
      if (borders) targetCell.border = borders;
      else if (hasBorder)
        targetCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      else targetCell.border = undefined;
    }
  );

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${selectedGroup.systemType} ${user.fio} ${selectedGroup.date}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
