import * as XLSX from 'xlsx'

/**
 * Функция для экспорта сотрудников в Excel
 * @param {Array} staff - Массив сотрудников для экспорта
 * @param {Array} excludedDepartments - Массив исключенных отделов (опционально)
 * @returns {Object} Объект с workbook и именем файла
 */
export const exportStaffToExcel = (staff, excludedDepartments = []) => {
     // Подготовка данных для экспорта
     const dataToExport = staff.map((staffMember) => ({
          ID: '',
          ФИО: staffMember.fio || '',
          Служба: staffMember.department || '',
          'Название службы': staffMember.departmentName || '',
          Должность: staffMember.post || '',
          УчетнаяЗ: staffMember.email || '',
          Телефон: staffMember.telephone || '',
          Email: staffMember.email || '',
          'Табельный номер': staffMember.tabNumber || '',
          Логин: staffMember.login || '',
          IP: staffMember.ip || '',
          Статус: staffMember.isDeleted ? 'Уволен' : 'Активен',
          'Есть фото': staffMember.hasPhoto ? 'Да' : 'Нет',
          'Тип пользователя': staffMember.isExcludedDepartment ? 'Сторонний' : 'Основной',
          Примечание: excludedDepartments.includes(staffMember.departmentName) ? 'Исключенный отдел' : '',
     }))

     // Создание книги Excel
     const wb = XLSX.utils.book_new()
     const ws = XLSX.utils.json_to_sheet(dataToExport)

     // Настройка ширины колонок
     const columnWidths = [
          { wch: 10 }, // ID
          { wch: 30 }, // ФИО
          { wch: 15 }, // Служба
          { wch: 25 }, // Название службы
          { wch: 25 }, // Должность
          { wch: 20 }, // УчетнаяЗ
          { wch: 15 }, // Телефон
          { wch: 25 }, // Email
          { wch: 15 }, // Табельный номер
          { wch: 12 }, // Логин
          { wch: 10 }, // IP
          { wch: 10 }, // Статус
          { wch: 15 }, // Есть фото
          { wch: 15 }, // Тип пользователя
          { wch: 20 }, // Примечание
     ]
     ws['!cols'] = columnWidths

     // Добавление листа в книгу
     XLSX.utils.book_append_sheet(wb, ws, 'Сотрудники')

     // Генерация имени файла с датой
     const date = new Date()
     const dateStr = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}.${date.getFullYear()}`
     const fileName = `Сотрудники_${dateStr}.xlsx`

     return {
          workbook: wb,
          fileName,
          data: dataToExport,
     }
}

/**
 * Функция для скачивания Excel файла
 * @param {Object} workbook - Workbook из XLSX
 * @param {String} fileName - Имя файла
 */
export const downloadExcelFile = (workbook, fileName) => {
     XLSX.writeFile(workbook, fileName)
}

/**
 * Функция для экспорта в CSV
 * @param {Array} staff - Массив сотрудников
 * @returns {String} CSV строка
 */
export const exportToCSV = (staff) => {
     if (!staff || staff.length === 0) return ''

     const headers = ['ФИО', 'Должность', 'Служба', 'Табельный номер', 'Логин', 'IP', 'Телефон', 'Email', 'Статус']

     // Создаем строку заголовков
     let csv = headers.join(';') + '\n'

     // Добавляем данные
     staff.forEach((employee) => {
          const row = [
               `"${employee.fio || ''}"`,
               `"${employee.post || ''}"`,
               `"${employee.departmentName || ''}"`,
               employee.tabNumber || '',
               employee.login || '',
               employee.ip || '',
               employee.telephone || '',
               employee.email || '',
               employee.isDeleted ? 'Уволен' : 'Активен',
          ]
          csv += row.join(';') + '\n'
     })

     return csv
}

/**
 * Функция для скачивания CSV файла
 * @param {String} csvContent - CSV контент
 * @param {String} fileName - Имя файла
 */
export const downloadCSVFile = (csvContent, fileName = 'сотрудники.csv') => {
     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
     const link = document.createElement('a')

     if (navigator.msSaveBlob) {
          // IE 10+
          navigator.msSaveBlob(blob, fileName)
     } else {
          link.href = URL.createObjectURL(blob)
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
     }
}

/**
 * Функция для фильтрации данных перед экспортом
 * @param {Array} staff - Исходный массив сотрудников
 * @param {Object} options - Опции фильтрации
 * @returns {Array} Отфильтрованный массив
 */
export const filterStaffForExport = (staff, options = {}) => {
     const { includeDeleted = false, includeExcluded = true, includeWithPhotoOnly = false, searchQuery = '' } = options

     let filtered = [...staff]

     // Фильтр по статусу увольнения
     if (!includeDeleted) {
          filtered = filtered.filter((user) => !user.isDeleted)
     }

     // Фильтр по исключенным отделам
     if (!includeExcluded) {
          filtered = filtered.filter((user) => !user.isExcludedDepartment)
     }

     // Фильтр по наличию фото
     if (includeWithPhotoOnly) {
          filtered = filtered.filter((user) => user.hasPhoto)
     }

     // Фильтр по поисковому запросу
     if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim()
          filtered = filtered.filter((user) => {
               const fields = [user.fio, user.post, user.departmentName, user.login, user.tabNumber, user.ip]
               return fields.some((field) => field && field.toString().toLowerCase().includes(query))
          })
     }

     return filtered
}
