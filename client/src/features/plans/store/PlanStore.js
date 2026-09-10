// src/features/plans/store/PlanStore.js
import { makeAutoObservable, action } from 'mobx';
import PlanService from '../services/PlanService';

class PlanStore {
  plans = null;
  error = null;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.fetchPlansAll();
  }

  setLoading = action((state) => {
    this.isLoading = state;
  });

  fetchPlansAll = action(async () => {
    this.setLoading(true);
    try {
      const response = await PlanService.fetchPlans();
      this.plans = response;
      this.error = null;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при загрузке Планов:', error);
    } finally {
      this.setLoading(false);
    }
  });

  createPlan = action(async (data) => {
    try {
      await PlanService.createPlan(data);
      await this.fetchPlansAll();
      return true;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при создании Плана:', error);
      return false;
    }
  });

  updatePlan = action(async (id, data) => {
    try {
      await PlanService.updatePlan(id, data);
      await this.fetchPlansAll();
      return true;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при обновлении Плана:', error);
      return false;
    }
  });

  deletePlan = action(async (id) => {
    try {
      await PlanService.deletePlan(id);
      await this.fetchPlansAll();
      return true;
    } catch (error) {
      this.error = error;
      console.error('Ошибка при удалении Плана:', error);
      return false;
    }
  });
}

const planStore = new PlanStore();
export default planStore;
