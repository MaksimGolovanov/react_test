export class BaseService {
    constructor(apiClient) {
        if (!apiClient) {
            throw new Error('ApiClient is required');
        }
        this.apiClient = apiClient;
    }

    async get(url, params) {
        return this.apiClient.get(url, params);
    }

    async post(url, data) {
        return this.apiClient.post(url, data);
    }

    async put(url, data) {
        return this.apiClient.put(url, data);
    }

    async deleteRequest(url) {
        return this.apiClient.delete(url);
    }

    async patch(url, data) {
        return this.apiClient.patch(url, data);
    }
}