// src/features/plans/services/PlanService.js

const STORAGE_KEY = 'plans';

class PlanService {
  // Вспомогательные методы для работы с localStorage
  static _getPlans() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static _savePlans(plans) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }

  // Получение списка всех планов (с эмуляцией задержки)
  static async fetchPlans() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this._getPlans());
      }, 200); // Имитация сетевого запроса
    });
  }

  // Создание нового плана
  static async createPlan(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plans = this._getPlans();
        const newPlan = {
          ...data,
          id: Date.now().toString(), // Генерация уникального ID
          created_at: new Date().toISOString(), // Дата создания
          status: data.status || 'draft', // Если статус не передан, ставим "Черновик"
        };
        plans.unshift(newPlan); // Добавляем новый план в начало списка
        this._savePlans(plans);
        resolve(newPlan);
      }, 200);
    });
  }

  // Обновление существующего плана
  static async updatePlan(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const plans = this._getPlans();
        const index = plans.findIndex(p => p.id === id);
        
        if (index === -1) {
          reject(new Error('План не найден'));
          return;
        }

        // Обновляем поля, но сохраняем изначальный id и дату создания
        const updatedPlan = {
          ...plans[index],
          ...data,
          id: plans[index].id,
          created_at: plans[index].created_at,
        };
        
        plans[index] = updatedPlan;
        this._savePlans(plans);
        resolve(updatedPlan);
      }, 200);
    });
  }

  // Удаление плана
  static async deletePlan(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let plans = this._getPlans();
        plans = plans.filter(p => p.id !== id);
        this._savePlans(plans);
        resolve({ success: true });
      }, 200);
    });
  }
}

export default PlanService;