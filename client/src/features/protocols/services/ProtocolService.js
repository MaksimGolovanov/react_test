// src/features/protocols/services/ProtocolService.js
const STORAGE_KEY = 'protocols';

class ProtocolService {
  static _getProtocols() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static _saveProtocols(protocols) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(protocols));
  }

  static async fetchProtocols() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this._getProtocols()), 200);
    });
  }

  static async createProtocol(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const protocols = this._getProtocols();
        const newProtocol = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        protocols.unshift(newProtocol);
        this._saveProtocols(protocols);
        resolve(newProtocol);
      }, 200);
    });
  }

  static async updateProtocol(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const protocols = this._getProtocols();
        const index = protocols.findIndex((p) => p.id === id);
        if (index === -1) return reject(new Error('Протокол не найден'));
        const updated = {
          ...protocols[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        protocols[index] = updated;
        this._saveProtocols(protocols);
        resolve(updated);
      }, 200);
    });
  }

  static async deleteProtocol(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let protocols = this._getProtocols();
        protocols = protocols.filter((p) => p.id !== id);
        this._saveProtocols(protocols);
        resolve({ success: true });
      }, 200);
    });
  }
}

export default ProtocolService;
