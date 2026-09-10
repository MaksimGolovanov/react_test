// src/features/protocols/store/DictionaryStore.js
import { makeAutoObservable, action } from 'mobx';
import DictionaryService from '../services/DictionaryService';

class DictionaryStore {
  dictionaries = {
    organizations: [],
    trainingCenters: [],
    programs: [],
    positions: [],
  };
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
    this.loadAllDictionaries();
  }

  setLoading = action((state) => {
    this.isLoading = state;
  });

  loadAllDictionaries = action(async () => {
    this.setLoading(true);
    try {
      const names = [
        'organizations',
        'trainingCenters',
        'programs',
        'positions',
      ];
      const results = await Promise.all(
        names.map((name) => DictionaryService.fetchDictionary(name))
      );
      names.forEach((name, index) => {
        this.dictionaries[name] = results[index];
      });
      this.error = null;
    } catch (error) {
      this.error = error;
      console.error('Ошибка загрузки справочников:', error);
    } finally {
      this.setLoading(false);
    }
  });

  addItem = action(async (name, value) => {
    try {
      const newItem = await DictionaryService.addDictionaryItem(name, value);
      this.dictionaries[name].push(newItem);
      return newItem;
    } catch (error) {
      this.error = error;
      return null;
    }
  });

  removeItem = action(async (name, id) => {
    try {
      await DictionaryService.removeDictionaryItem(name, id);
      this.dictionaries[name] = this.dictionaries[name].filter(
        (item) => item.id !== id
      );
      return true;
    } catch (error) {
      this.error = error;
      return false;
    }
  });
}

const dictionaryStore = new DictionaryStore();
export default dictionaryStore;
