// services/HolidayService.js
// Заглушка для справочника праздничных дней

let mockHolidays = [
  { id: 1, date: '2026-01-01', name: 'Новый год' },
  { id: 2, date: '2026-01-02', name: 'Новый год' },
  { id: 3, date: '2026-01-07', name: 'Рождество Христово' },
  { id: 4, date: '2026-02-23', name: 'День защитника Отечества' },
  { id: 5, date: '2026-03-08', name: 'Международный женский день' },
  { id: 6, date: '2026-05-01', name: 'Праздник Весны и Труда' },
  { id: 7, date: '2026-05-09', name: 'День Победы' },
  { id: 8, date: '2026-06-12', name: 'День России' },
  { id: 9, date: '2026-11-04', name: 'День народного единства' },
];
let nextId = 10;

class HolidayService {
  static async fetchAll() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...mockHolidays];
  }

  static async create(data) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const newItem = { id: nextId++, ...data };
    mockHolidays.push(newItem);
    return newItem;
  }

  static async update(id, data) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = mockHolidays.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Праздник не найден');
    mockHolidays[index] = { ...mockHolidays[index], ...data };
    return mockHolidays[index];
  }

  static async delete(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockHolidays = mockHolidays.filter((item) => item.id !== id);
    return true;
  }
}

export default HolidayService;
