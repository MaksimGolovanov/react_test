import axios from 'axios';

export class ApiClient {
    constructor(baseURL, timeout = 5000) {
        this.instance = axios.create({
            baseURL,
            timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        // Добавляем интерсепторы при необходимости
        this.instance.interceptors.response.use(
            (response) => response.data,
            (error) => {
                console.error('API Error:', error);
                throw error;
            }
        );
    }

    async get(url, params = {}) {
        return this.instance.get(url, { params });
    }

    async post(url, data) {
        return this.instance.post(url, data);
    }

    async put(url, data) {
        return this.instance.put(url, data);
    }

    async delete(url) {
        return this.instance.delete(url);
    }

    async patch(url, data) {
        return this.instance.patch(url, data);
    }
}