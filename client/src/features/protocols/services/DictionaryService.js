// src/features/protocols/services/DictionaryService.js
const STORAGE_KEY_PREFIX = 'protocols_dict_';

class DictionaryService {
  static _getKey(name) {
    return `${STORAGE_KEY_PREFIX}${name}`;
  }

  static _getData(name) {
    const key = this._getKey(name);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  static _saveData(name, data) {
    const key = this._getKey(name);
    localStorage.setItem(key, JSON.stringify(data));
  }

  static async fetchDictionary(name) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this._getData(name)), 100);
    });
  }

  static async addDictionaryItem(name, value) {
    return new Promise((resolve) => {
      const items = this._getData(name);
      const newItem = { id: Date.now().toString(), value };
      items.push(newItem);
      this._saveData(name, items);
      resolve(newItem);
    });
  }

  static async removeDictionaryItem(name, id) {
    return new Promise((resolve) => {
      let items = this._getData(name);
      items = items.filter((item) => item.id !== id);
      this._saveData(name, items);
      resolve({ success: true });
    });
  }
}

export default DictionaryService;
