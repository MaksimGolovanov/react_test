import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ButtonAll from '../components/ButtonAll/ButtonAll';
import { IoArrowBack } from 'react-icons/io5';
import { FaFileExport } from "react-icons/fa";
import styles from './style.module.css';
import iusPtStore from '../store/IusPtStore';
import Circle from '../../../Components/circle/Circle';
import * as ExcelJS from 'exceljs';



const IusUserApplication = observer(() => {
    const { tabNumber } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [checkboxes, setCheckboxes] = useState({
        internet: false, // Значение по умолчанию
        ivs: false,
        evspd: true,
        newArmVariable: false,
        disableArm: false,
        conditionsChange: false,
    });

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckboxes((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                await iusPtStore.fetchStaffWithIusUsers();
                await iusPtStore.fetchAdmins();
                const foundUser = iusPtStore.staffWithIusUsers.find(
                    (staffUser) => staffUser.tabNumber === tabNumber
                );

                if (foundUser) {
                    setUser(foundUser);
                } else {
                    setError('Пользователь не найден');
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Ошибка при загрузке данных');
            } finally {
                setIsLoading(false);
            }
        };
        console.log('admins:', iusPtStore.admins);
        fetchUser();
    }, [tabNumber]);
    const iusadm = (iusPtStore.admins.find((admin) => admin.cod === 'admarm').iusadm)
    const iusadmemail = (iusPtStore.admins.find((admin) => admin.cod === 'admarm').email)
    const iusib = (iusPtStore.admins.find((admin) => admin.cod === 'admib').iusadm)
    const iusibemail = (iusPtStore.admins.find((admin) => admin.cod === 'admib').email)
    const cps = (iusPtStore.admins.find((admin) => admin.cod === 'cps').iusadm)
    const gd = (iusPtStore.admins.find((admin) => admin.cod === 'gd').iusadm)
    // Новая группировка данных
    const groupedRoles = () => {
        const roles = user?.IusUser?.IusSpravRoles || [];
        const groups = {};

        roles.forEach(role => {
            const systemType = `${role.typename || 'Без системы'}`;
            const createdAt = new Date(role.IusUserRoles.createdAt);
            const date = createdAt.toLocaleDateString('ru-RU');
            const key = `${systemType}|${date}`;

            if (!groups[key]) {
                groups[key] = {
                    key, // Добавляем ключ
                    systemType,
                    date,
                    createdAt,
                    roles: []
                };
            }
            groups[key].roles.push(role);
        });

        return Object.values(groups).sort((a, b) => b.createdAt - a.createdAt);
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        const date = new Date()
        const formatDate = (date) => {
            const isoDate = date.toISOString();
            const parts = isoDate.split('T')[0].split('-'); // Разделяем ISO-строку на части
            const formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
            return formattedDate;
        }
        const currentDate = formatDate(date);
        const parts = user.fio.split(' ')
        // Установка ширины колонок
        worksheet.columns = Array(47).fill({ width: 2 }); // Увеличиваем ширину колонок для видимости текста

        // Добавление строк
        worksheet.addRow(Array(47).fill('')); // Пустая строка

        worksheet.addRow(Array(47).fill('')); // Пустая строка

        const row4 = Array(47).fill('');

        worksheet.addRow(row4);

        // Объединение ячеек (для заголовков)
        worksheet.mergeCells('A2:AU2');
        worksheet.mergeCells('A4:W4');
        worksheet.mergeCells('X4:AU4');
        worksheet.mergeCells('A5:AU5');
        worksheet.mergeCells('A6:W6');
        worksheet.mergeCells('X6:AU6');
        worksheet.mergeCells('A7:W7');
        worksheet.mergeCells('X7:AU7');
        worksheet.mergeCells('A8:W8');
        worksheet.mergeCells('X8:AU8');
        worksheet.mergeCells('A9:W9');
        worksheet.mergeCells('X9:AU9');
        worksheet.mergeCells('A10:AU10');
        worksheet.mergeCells('A11:W11');
        worksheet.mergeCells('X11:AU11');
        worksheet.mergeCells('A12:W12');
        worksheet.mergeCells('X12:AU12');
        worksheet.mergeCells('A13:W13');
        worksheet.mergeCells('X13:AU13');
        worksheet.mergeCells('A14:W14');
        worksheet.mergeCells('X14:AU14');
        worksheet.mergeCells('A15:AU15');
        worksheet.mergeCells('A16:W16');
        worksheet.mergeCells('X16:AU16');
        worksheet.mergeCells('A17:W17');
        worksheet.mergeCells('X17:AU17');
        worksheet.mergeCells('A18:C18');
        worksheet.mergeCells('D18:G18');
        worksheet.mergeCells('H18:M18');
        worksheet.mergeCells('N18:Y18');
        worksheet.mergeCells('Z18:AL18');
        worksheet.mergeCells('AM18:AU18');

        // Применение стилей к объединённым областям и добавление текста
        const mergedCellsData = [
            { cell: 'A2', text: `Индивидуальная заявка на доступ пользователя к ИР ${selectedGroup.systemType}`, size: '12', horizontal: 'center', hasBorder: false, bold: true },
            { cell: 'A4', text: '№ заявки', size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'X4', text: `Дата заполнения заявки:  ${currentDate}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'A5', text: `Раздел 1. Данные пользователя`, size: '9', horizontal: 'left', hasBorder: true, bold: true },
            { cell: 'A6', text: `Организация:           ООО "Газпром трансгаз Ухта"`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'X6', text: `Фамилия:  ${parts[0]}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'A7', text: `Подразделение:       Вуктыльское ЛПУМГ`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'X7', text: `Имя:        ${parts[1]}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'A8', text: `Должность:  ${user.post}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'X8', text: `Отчество: ${parts[2]}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'A9', text: `E-mail:  ${user.email}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'X9', text: `Телефон: ${user.telephone}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'A10', text: `Адрес: 169570, Российская Федерация, Республика Коми, г. Вуктыл`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'A11', text: `Имя компьютера:  ${user.IusUser.computerName}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'X11', text: ``, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'A12', text: `IP адрес рабочего места:  ${user.ip}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'X12', text: ``, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'A13', text: `e-mail непосредственного руководителя пользователя:`, size: '9', horizontal: 'left', bold: false, borders: { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } } },
            { cell: 'X13', text: `Ф.И.О. непосредственного руководителя пользователя:`, size: '9', horizontal: 'left', bold: false, borders: { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } } },
            { cell: 'A14', text: `${user.IusUser.managerEmail}`, size: '9', horizontal: 'left', bold: false, borders: { bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } } },
            { cell: 'X14', text: `${user.IusUser.manager}`, size: '9', horizontal: 'left', bold: false, borders: { bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } } },
            { cell: 'A15', text: `Раздел 2. Системные реквизиты`, size: '9', horizontal: 'left', hasBorder: true, bold: true },
            { cell: 'A16', text: `Новый пользователь: ☐`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'X16', text: `Установка клиентской части: ☐`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'A17', text: `Зона тестирования: ☐`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'X17', text: `Зона постоянной эксплуатации: ☑`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: 'A18', text: `№ п/п`, size: '8', horizontal: 'center', hasBorder: true, bold: false },
            { cell: 'D18', text: `Добавить/Удалить`, size: '8', horizontal: 'center', hasBorder: true, bold: false, wrapText: true },
            { cell: 'H18', text: `SID / Мандант`, size: '8', horizontal: 'center', hasBorder: true, bold: false },
            { cell: 'N18', text: `Функциональная роль/Бизнес-роль`, size: '8', horizontal: 'center', hasBorder: true, bold: false, wrapText: true },
            { cell: 'Z18', text: `Код роли`, size: '8', horizontal: 'center', hasBorder: true, bold: false },
            { cell: 'AM18', text: `Организационная роль/Объект полномочий`, size: '8', horizontal: 'center', hasBorder: true, bold: false },
        ];

        const row = worksheet.getRow(18); // Получаем строку с номером 5
        row.height = 24; // Устанавливаем высоту строки в 30 пунктов


        mergedCellsData.forEach(({ cell, text, size, horizontal, hasBorder, borders, bold }) => {
            const targetCell = worksheet.getCell(cell);
            targetCell.value = text;
            targetCell.font = { name: 'Times New Roman', size: size, bold: bold };
            targetCell.alignment = { horizontal: horizontal, vertical: 'middle', wrapText: true };

            // Настройка границ
            if (borders) {
                // Используем пользовательские настройки границ, если они заданы
                targetCell.border = borders;
            } else if (hasBorder) {
                // Стандартные тонкие границы со всех сторон, если hasBorder = true
                targetCell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            } else {
                // Убираем границы, если не задано иное
                targetCell.border = undefined;
            }



            // const row = worksheet.getRow(targetCell.row);
            // const lineHeight = 12; // Высота одной строки текста (например, 12 пунктов)
            // const lines = Math.ceil(text.length / 30); // Оцениваем количество строк (30 символов на строку)
            // row.height = lines * lineHeight; // Устанавливаем высоту строки

        });

        selectedGroup.roles.forEach((role, index) => {
            worksheet.addRow(['', '', '', '', '', ''])
            worksheet.mergeCells(`A${index + 19}:C${index + 19}`);
            worksheet.mergeCells(`D${index + 19}:G${index + 19}`);
            worksheet.mergeCells(`H${index + 19}:M${index + 19}`);
            worksheet.mergeCells(`N${index + 19}:Y${index + 19}`);
            worksheet.mergeCells(`Z${index + 19}:AL${index + 19}`);
            worksheet.mergeCells(`AM${index + 19}:AU${index + 19}`);
            worksheet.getCell(`A${index + 19}`).value = index + 1
            worksheet.getCell(`A${index + 19}`).alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.getCell(`D${index + 19}`).value = 'Добавить'
            worksheet.getCell(`D${index + 19}`).alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.getCell(`H${index + 19}`).value = role.type + '/' + role.mandat
            worksheet.getCell(`H${index + 19}`).alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.getCell(`N${index + 19}`).value = role.name
            worksheet.getCell(`N${index + 19}`).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
            worksheet.getCell(`Z${index + 19}`).value = role.code
            worksheet.getCell(`Z${index + 19}`).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
            worksheet.getCell(`AU${index + 19}`).value = ''
            const cellsToFormat = [`A${index + 19}`, `D${index + 19}`, `H${index + 19}`, `N${index + 19}`, `Z${index + 19}`, `AU${index + 19}`];
            cellsToFormat.forEach(cellAddress => {
                const cell = worksheet.getCell(cellAddress);
                cell.font = { name: 'Times New Roman', size: 8 };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            const row = worksheet.getRow(index + 19); // Получаем строку
            const lineHeight = 12; // Высота одной строки текста в пунктах

            const linesName = Math.ceil(role.name.length / 32); // Количество строк
            const linesCode = Math.ceil(role.code.length / 32); // Количество строк
            const lines = Math.max(linesName, linesCode);

            row.height = lines * lineHeight; // Устанавливаем высоту строки
        })
        const lastRowIndex = 19 + selectedGroup.roles.length;

        const footer = [
            { cell: `A${lastRowIndex}`, text: `Дополнительные параметры: табельный номер АСУП - ${user.IusUser.tabNumber}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: `A${lastRowIndex + 1}`, text: `Раздел 3. Подключение рабочего места`, size: '9', horizontal: 'left', hasBorder: true, bold: true },
            { cell: `A${lastRowIndex + 2}`, text: `Подключение нового АРМ ${checkboxes.newArmVariable ? '☑' : '☐'}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: `Q${lastRowIndex + 2}`, text: `Отключение АРМ ${checkboxes.disableArm ? '☑' : '☐'}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: `AF${lastRowIndex + 2}`, text: `Изменение условий подключения АРМ ${checkboxes.conditionsChange ? '☑' : '☐'}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: `A${lastRowIndex + 3}`, text: `Расположение рабочего места:`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: `Q${lastRowIndex + 3}`, text: `ИВС ${checkboxes.ivs ? '☑' : '☐'}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: `X${lastRowIndex + 3}`, text: `ЕВСПД ${checkboxes.evspd ? '☑' : '☐'}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: `AF${lastRowIndex + 3}`, text: `Интернет ${checkboxes.internet ? '☑' : '☐'}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: `A${lastRowIndex + 4}`, text: `Рабочее место соответствует Требованиям по настройкам и мерам защиты рабочих мест, сетевой доступ предоставлен`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: `A${lastRowIndex + 5}`, text: `Администратор АРМ`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: `N${lastRowIndex + 5}`, text: `${iusadmemail}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: `AC${lastRowIndex + 5}`, text: `${currentDate}`, size: '9', horizontal: 'left', bold: false, borders: { bottom: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } } },
            { cell: `AM${lastRowIndex + 5}`, text: `${iusadm}`, size: '9', horizontal: 'right', bold: false, borders: { bottom: { style: 'thin' }, right: { style: 'thin' }, top: { style: 'thin' } } },
            { cell: `A${lastRowIndex + 6}`, text: `Администратор ИБ`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: `N${lastRowIndex + 6}`, text: `${iusibemail}`, size: '9', horizontal: 'left', hasBorder: true, bold: false },
            { cell: `AC${lastRowIndex + 6}`, text: `${currentDate}`, size: '9', horizontal: 'left', bold: false, borders: { bottom: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } } },
            { cell: `AM${lastRowIndex + 6}`, text: `${iusib}`, size: '9', horizontal: 'right', bold: false, borders: { bottom: { style: 'thin' }, right: { style: 'thin' }, top: { style: 'thin' } } },
            { cell: `A${lastRowIndex + 7}`, text: `С перечнем информации, составляющей коммерческую тайну, и иной конфиденциальной информации, установленными в Обществе`, size: '8', horizontal: 'left', bold: false, borders: { left: { style: 'thin' }, right: { style: 'thin' }, top: { style: 'thin' } } },
            { cell: `A${lastRowIndex + 8}`, text: `режимом коммерческой тайны и порядком обработки персональных данных, Памяткой пользователя ИУС по обеспечению`, size: '8', horizontal: 'left', bold: false, borders: { left: { style: 'thin' }, right: { style: 'thin' } } },
            { cell: `A${lastRowIndex + 9}`, text: `информационной безопасности ИУС ПАО «Газпром», а также с мерами ответственности за нарушение режима коммерческой тайны и`, size: '8', horizontal: 'left', bold: false, borders: { left: { style: 'thin' }, right: { style: 'thin' } } },
            { cell: `A${lastRowIndex + 10}`, text: `действия в отношении обрабатываемых персональных данных пользователи ознакомлены.`, size: '8', horizontal: 'left', bold: false, borders: { left: { style: 'thin' } } },
            { cell: `AF${lastRowIndex + 10}`, text: ``, size: '8', horizontal: 'left', bold: false, borders: { bottom: { style: 'thin' } } },
            { cell: `AM${lastRowIndex + 10}`, text: `( ${parts[1][0]}.${parts[2][0]}. ${parts[0]} )`, size: '9', horizontal: 'right', bold: false, borders: { right: { style: 'thin' } } },
            { cell: `A${lastRowIndex + 11}`, text: `«Договор (Соглашение) о конфиденциальности с ПАО «Газпром» (ОГГ) заключен: `, size: '8', horizontal: 'left', bold: false, borders: { left: { style: 'thin' } } },
            { cell: `AF${lastRowIndex + 11}`, text: `${user.IusUser.contractDetails}`, size: '9', horizontal: 'left', bold: false, borders: { bottom: { style: 'thin' }, right: { style: 'thin' } } },
            { cell: `A${lastRowIndex + 12}`, text: `Предоставлен ли доступ к персональным данным, обрабатываемым в ИСПД:`, size: '8', horizontal: 'left', bold: false, borders: { left: { style: 'thin' } } },
            { cell: `AF${lastRowIndex + 12}`, text: `Да`, size: '8', horizontal: 'center', bold: false, borders: { bottom: { style: 'thin' } } },
            { cell: `AM${lastRowIndex + 12}`, text: ``, size: '9', horizontal: 'right', bold: false, borders: { right: { style: 'thin' } } },
            { cell: `A${lastRowIndex + 13}`, text: `Руководитель подразделения корпоративной защиты ООО «Газпром трансгаз Ухта»:`, size: '8', horizontal: 'left', bold: false, borders: { left: { style: 'thin' } } },
            { cell: `AF${lastRowIndex + 13}`, text: ``, size: '8', horizontal: 'center', bold: false, borders: { bottom: { style: 'thin' } } },
            { cell: `AM${lastRowIndex + 13}`, text: `( ${cps} )`, size: '9', horizontal: 'right', bold: false, borders: { right: { style: 'thin' } } },
            { cell: `A${lastRowIndex + 14}`, text: `Согласие субъекта персональных данных (пользователя) на обработку (в том числе передачу третьей стороне) его персональных данных`, size: '8', horizontal: 'left', bold: false, borders: { left: { style: 'thin' }, right: { style: 'thin' } } },
            { cell: `A${lastRowIndex + 15}`, text: `имеется.`, size: '8', horizontal: 'left', bold: false, borders: { left: { style: 'thin' }, right: { style: 'thin' } } },
            { cell: `A${lastRowIndex + 16}`, text: `Генеральный директор ООО «Газпром трансгаз Ухта»`, size: '9', horizontal: 'left', bold: false, borders: { left: { style: 'thin' } } },
            { cell: `U${lastRowIndex + 16}`, text: ``, size: '8', horizontal: 'center', bold: false, borders: { bottom: { style: 'thin' } } },
            { cell: `AM${lastRowIndex + 16}`, text: `( ${gd} )`, size: '9', horizontal: 'right', bold: false, borders: { right: { style: 'thin' } } },
            { cell: `A${lastRowIndex + 17}`, text: `СОГЛАСОВАНО:`, size: '9', horizontal: 'left', hasBorder: true, bold: true },
            { cell: `A${lastRowIndex + 18}`, text: `Контакт-центр ООО «Газпром информ»`, size: '9', horizontal: 'left', hasBorder: true, bold: true },
            { cell: `U${lastRowIndex + 18}`, text: `(дата, подпись) (ФИО)`, size: '9', horizontal: 'right', hasBorder: true, bold: false },
            { cell: `A${lastRowIndex + 20}`, text: `Центр кибербезопасности`, size: '9', horizontal: 'left', bold: true, borders: { left: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' }, } },
            { cell: `A${lastRowIndex + 21}`, text: `Службы корпоративной защиты ПАО «Газпром»`, size: '9', horizontal: 'left', bold: true, borders: { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }, } },
            { cell: `U${lastRowIndex + 20}`, text: `(дата, подпись) (ФИО)`, size: '9', horizontal: 'right', hasBorder: true, bold: false },

            ...(selectedGroup.systemType === 'ИУС П Т' || selectedGroup.systemType === 'ИУС НК') ?
                [
                    { cell: `A${lastRowIndex + 22}`, text: `Владелец информационного ресурса`, size: '9', horizontal: 'left', bold: true, hasBorder: true },
                    { cell: `U${lastRowIndex + 22}`, text: `Генеральный директор`, size: '9', horizontal: 'left', bold: false, borders: { left: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' }, } },
                    { cell: `U${lastRowIndex + 23}`, text: `ООО «Газпром трансгаз Ухта» _____________________  (${gd})`, size: '9', horizontal: 'right', bold: false, borders: { left: { style: 'thin' }, right: { style: 'thin' }, } },
                    { cell: `U${lastRowIndex + 24}`, text: `                                        (дата, подпись) (ФИО)`, size: '7', horizontal: 'center', bold: false, borders: { left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }, } },
                ] : [
                    { cell: `A${lastRowIndex + 22}`, text: `Владелец информационного ресурса`, size: '9', horizontal: 'left', bold: true, hasBorder: true },
                    { cell: `U${lastRowIndex + 22}`, text: `(дата, подпись) (ФИО)`, size: '9', horizontal: 'right', bold: false, hasBorder: true },
                ]



        ];
        worksheet.mergeCells(`A${lastRowIndex}:AU${lastRowIndex}`);
        worksheet.mergeCells(`A${lastRowIndex + 1}:AU${lastRowIndex + 1}`);
        worksheet.mergeCells(`A${lastRowIndex + 2}:P${lastRowIndex + 2}`);
        worksheet.mergeCells(`Q${lastRowIndex + 2}:AE${lastRowIndex + 2}`);
        worksheet.mergeCells(`AF${lastRowIndex + 2}:AU${lastRowIndex + 2}`);
        worksheet.mergeCells(`A${lastRowIndex + 3}:P${lastRowIndex + 3}`);
        worksheet.mergeCells(`Q${lastRowIndex + 3}:W${lastRowIndex + 3}`);
        worksheet.mergeCells(`X${lastRowIndex + 3}:AE${lastRowIndex + 3}`);
        worksheet.mergeCells(`AF${lastRowIndex + 3}:AU${lastRowIndex + 3}`);
        worksheet.mergeCells(`A${lastRowIndex + 4}:AU${lastRowIndex + 4}`);
        worksheet.mergeCells(`A${lastRowIndex + 5}:M${lastRowIndex + 5}`);
        worksheet.mergeCells(`N${lastRowIndex + 5}:AB${lastRowIndex + 5}`);
        worksheet.mergeCells(`AC${lastRowIndex + 5}:AL${lastRowIndex + 5}`);
        worksheet.mergeCells(`AM${lastRowIndex + 5}:AU${lastRowIndex + 5}`);
        worksheet.mergeCells(`A${lastRowIndex + 6}:M${lastRowIndex + 6}`);
        worksheet.mergeCells(`N${lastRowIndex + 6}:AB${lastRowIndex + 6}`);
        worksheet.mergeCells(`AC${lastRowIndex + 6}:AL${lastRowIndex + 6}`);
        worksheet.mergeCells(`AM${lastRowIndex + 6}:AU${lastRowIndex + 6}`);
        worksheet.mergeCells(`A${lastRowIndex + 7}:AU${lastRowIndex + 7}`);
        worksheet.mergeCells(`A${lastRowIndex + 8}:AU${lastRowIndex + 8}`);
        worksheet.mergeCells(`A${lastRowIndex + 9}:AU${lastRowIndex + 9}`);
        worksheet.mergeCells(`A${lastRowIndex + 10}:AE${lastRowIndex + 10}`);
        worksheet.mergeCells(`AF${lastRowIndex + 10}:AL${lastRowIndex + 10}`);
        worksheet.mergeCells(`AM${lastRowIndex + 10}:AU${lastRowIndex + 10}`);
        worksheet.mergeCells(`A${lastRowIndex + 11}:AE${lastRowIndex + 11}`);
        worksheet.mergeCells(`AF${lastRowIndex + 11}:AU${lastRowIndex + 11}`);
        worksheet.mergeCells(`A${lastRowIndex + 12}:AE${lastRowIndex + 12}`);
        worksheet.mergeCells(`AF${lastRowIndex + 12}:AL${lastRowIndex + 12}`);
        worksheet.mergeCells(`AM${lastRowIndex + 12}:AU${lastRowIndex + 12}`);
        worksheet.mergeCells(`A${lastRowIndex + 13}:AE${lastRowIndex + 13}`);
        worksheet.mergeCells(`AF${lastRowIndex + 13}:AL${lastRowIndex + 13}`);
        worksheet.mergeCells(`AM${lastRowIndex + 13}:AU${lastRowIndex + 13}`);
        worksheet.mergeCells(`A${lastRowIndex + 14}:AU${lastRowIndex + 14}`);
        worksheet.mergeCells(`A${lastRowIndex + 15}:AU${lastRowIndex + 15}`);
        worksheet.mergeCells(`A${lastRowIndex + 16}:T${lastRowIndex + 16}`);
        worksheet.mergeCells(`U${lastRowIndex + 16}:AL${lastRowIndex + 16}`);
        worksheet.mergeCells(`AM${lastRowIndex + 16}:AU${lastRowIndex + 16}`);
        worksheet.mergeCells(`A${lastRowIndex + 17}:AU${lastRowIndex + 17}`);
        worksheet.mergeCells(`A${lastRowIndex + 18}:T${lastRowIndex + 19}`);
        worksheet.mergeCells(`U${lastRowIndex + 18}:AU${lastRowIndex + 19}`);
        worksheet.mergeCells(`A${lastRowIndex + 20}:T${lastRowIndex + 20}`);
        worksheet.mergeCells(`A${lastRowIndex + 21}:T${lastRowIndex + 21}`);
        worksheet.mergeCells(`U${lastRowIndex + 20}:AU${lastRowIndex + 21}`);
        if (selectedGroup.systemType === 'ИУС П Т' || selectedGroup.systemType === 'ИУС НК') {
            worksheet.mergeCells(`A${lastRowIndex + 22}:T${lastRowIndex + 24}`);
            worksheet.mergeCells(`U${lastRowIndex + 22}:AU${lastRowIndex + 22}`);
            worksheet.mergeCells(`U${lastRowIndex + 23}:AU${lastRowIndex + 23}`);
            worksheet.mergeCells(`U${lastRowIndex + 24}:AU${lastRowIndex + 24}`);

        } else {
            worksheet.mergeCells(`A${lastRowIndex + 22}:T${lastRowIndex + 23}`);
            worksheet.mergeCells(`U${lastRowIndex + 22}:AU${lastRowIndex + 23}`);
        }





        footer.forEach(({ cell, text, size, horizontal, hasBorder, borders, bold }) => {
            const targetCell = worksheet.getCell(cell);
            targetCell.value = text;
            targetCell.font = { name: 'Times New Roman', size: size, bold: bold };
            targetCell.alignment = { horizontal: horizontal, vertical: 'middle', wrapText: true };

            // Настройка границ
            if (borders) {
                // Используем пользовательские настройки границ, если они заданы
                targetCell.border = borders;
            } else if (hasBorder) {
                // Стандартные тонкие границы со всех сторон, если hasBorder = true
                targetCell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            } else {
                // Убираем границы, если не задано иное
                targetCell.border = undefined;
            }
        });
        // Автоматически подстраиваем высоту каждой строки под её содержимое

        try {
            // Генерация файла как Blob
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });

            // Создание ссылки для скачивания файла
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${selectedGroup.systemType} ${user.fio} ${selectedGroup.date}.xlsx`;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link); // Удаляем ссылку после скачивания
            console.log("Файл успешно создан!");

        } catch (error) {
            console.error("Ошибка при создании Excel-файла:", error);
        }
    };
    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return <div>Данные не найдены</div>;



    return (
        <>
            <div className={styles.header}>
                <span className={styles.pageHeader}>Заявки</span>
            </div>
            <ButtonAll
                icon={IoArrowBack}
                text="Назад"
                onClick={() => navigate(`/iuspt/user/${tabNumber}`)}
            />

            <div className={styles.userContainer }>
                <div>
                    <Circle fullName={user.fio} size={80} />
                </div>
                <div className={styles.userDetails}>
                    <p className={styles.fio}>{user.fio}</p>
                    <p className={styles.name}>{user.IusUser?.name || '-'}</p>
                    <p className={styles.department}>
                        {user.department?.slice(13) || '-'}
                    </p>
                </div>
            </div>

            <div className={styles.twoColumnLayout}>
                {/* Левая колонка с группами */}
                <div className={styles.groupsColumn}>
                    <h3>Группы ролей</h3>
                    {groupedRoles().map((group) => (
                        <div
                            key={group.key} // Используем group.key как уникальный ключ
                            className={`${styles.groupItem} ${selectedGroup?.key === group.key ? styles.selected : ''}`}
                            onClick={() => setSelectedGroup(group)}
                        >
                            <div className={styles.groupHeader}>
                                <span className={styles.systemType}>{group.systemType}</span>
                                <span className={styles.date}>{group.date}</span>
                            </div>
                            <div className={styles.rolesCount}>
                                {group.roles.length} ролей
                            </div>
                        </div>
                    ))}
                </div>

                {/* Правая колонка с деталями */}
                <div className={styles.detailsColumn}>
                    {selectedGroup ? (
                        <>

                            <div className={styles.GroupInfoBlock}>
                                <div className={styles.selectedGroupInfo}>
                                    <h3>Детали ролей</h3>
                                    <p>Система: {selectedGroup.systemType}</p>
                                    <p>Дата назначения: {selectedGroup.date}</p>
                                </div>
                                <div>
                                    <h3>Дополнительные параметры</h3>
                                    <div className={styles.InfoBlock}>
                                        <div className={styles.selectedGroupInfoBlock}>

                                            <div className={styles.selectionItem}>
                                                <label>Подключение нового АРМ: </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="newArmVariable"
                                                        checked={checkboxes.newArmVariable}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                </label>
                                            </div>

                                            <div className={styles.selectionItem}>
                                                <label>ИВС: </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="ivs"
                                                        checked={checkboxes.ivs}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                </label>
                                            </div>

                                        </div>
                                        <div className={styles.selectedGroupInfoBlock}>
                                            <div className={styles.selectionItem}>
                                                <label>Отключение АРМ: </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="disableArm"
                                                        checked={checkboxes.disableArm}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                </label>
                                            </div>
                                            <div className={styles.selectionItem}>
                                                <label>ЕВСПД: </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="evspd"
                                                        checked={checkboxes.evspd}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className={styles.selectedGroupInfoBlock}>
                                            <div className={styles.selectionItem}>
                                                <label>Изменение условий подключения: </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="conditionsChange"
                                                        checked={checkboxes.conditionsChange}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                </label>
                                            </div>
                                            <div className={styles.selectionItem}>
                                                <label>Интернет: </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="internet"
                                                        checked={checkboxes.internet}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className={styles.rolesList}>
                                {selectedGroup.roles.map((role, index) => (
                                    <div key={index} className={styles.roleItem}>
                                        <p>
                                            <strong>Мандант:</strong> {role.mandat || 'Не указан'}
                                            <strong>   Код:</strong> {role.code}
                                        </p>
                                        <p><strong>Название:</strong> {role.name}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className={styles.placeholder}>Выберите группу слева для просмотра деталей</div>
                    )}
                    <ButtonAll
                        icon={FaFileExport}
                        text="Выгрузка"
                        onClick={exportToExcel}
                    />
                </div>
            </div >
        </>
    );
});

export default IusUserApplication;