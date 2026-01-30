import { makeObservable, observable, action, runInAction } from 'mobx';
import { BaseStore } from '../base/BaseStore';
import { IusPtService } from '../../services';

export class StaffStore extends BaseStore {
  staffWithUsers = [];
  staffWithIusUsers = [];
  staffWithIusUsersSimple = [];
  staffWithIusUsersSimpleOver = [];

  constructor() {
    super();

    makeObservable(this, {
      staffWithIusUsers: observable,
      staffWithIusUsersSimple: observable,
      staffWithIusUsersSimpleOver: observable,
      fetchWithUsers: observable,
      fetchStaffWithIusUsers: action,
      fetchStaffWithIusUserSimple: action,
      fetchStaffWithIusUserSimpleOver: action,
      fetchStaffByTabNumber: action,
    });
  }

  // 📌 Основные методы

  fetchWithUsers = async () => {
    try {
      const response = await super.fetchData(
        IusPtService.fetchStaffWithUser,
        'staffWithUsers'
      );
      runInAction(() => {
        this.staffWithIusUsers = response;
      });
    } catch (error) {
      console.error('Ошибка при получении сотрудников:', error);
      throw error;
    }
  };

  fetchStaffWithIusUsers = async () => {
    try {
      const response = await super.fetchData(
        IusPtService.fetchStaffWithIusUser,
        'staffWithIusUsers'
      );
      runInAction(() => {
        this.staffWithIusUsers = response;
      });
    } catch (error) {
      console.error('Ошибка при получении сотрудников:', error);
      throw error;
    }
  };

  fetchStaffWithIusUserSimple = async () => {
    try {
      const response = await super.fetchData(
        IusPtService.fetchStaffWithIusUserSimple,
        'staffWithIusUsersSimple'
      );
      runInAction(() => {
        this.staffWithIusUsersSimple = response;
      });
    } catch (error) {
      console.error(
        'Ошибка при получении упрощенных данных сотрудников:',
        error
      );
      throw error;
    }
  };

  fetchStaffWithIusUserSimpleOver = async () => {
    try {
      const response = await super.fetchData(
        IusPtService.fetchStaffWithIusUserSimpleOver,
        'staffWithIusUsersSimpleOver'
      );
      runInAction(() => {
        this.staffWithIusUsersSimpleOver = response;
      });
    } catch (error) {
      console.error(
        'Ошибка при получении расширенных данных сотрудников:',
        error
      );
      throw error;
    }
  };

  // 📌 Специальный метод для поиска по табельному номеру
  fetchStaffByTabNumber = async (tabNumber) => {
    try {
      const response = await IusPtService.fetchStaffByTabNumber(tabNumber);

      // Обработка ответа (может быть объект или массив)
      const resultData = Array.isArray(response)
        ? response
        : [response].filter(Boolean);

      runInAction(() => {
        this.staffWithIusUsers = resultData;
      });

      return resultData[0] || null;
    } catch (error) {
      console.error('Ошибка при получении сотрудника:', error);
      throw error;
    }
  };
}
