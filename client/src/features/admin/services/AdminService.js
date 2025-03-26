import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
 
class AdminService {
    static async fetchUser() {
        try {
            const response = await axios.get(`${API_URL}api/user/user`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async fetchRoleUser() {
        try {
            const response = await axios.get(`${API_URL}api/user/userrouter`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async fetchRole() {
        try {
            const response = await axios.get(`${API_URL}api/user/role`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async createRole(role) {
        try {
            const response = await axios.post(`${API_URL}api/user/role`, role);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async registration(data) {
        try {
            console.log('Sending registration data:', data);
            const response = await axios.post(`${API_URL}api/user/registration`, data);
            console.log('Registration response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            throw error;
        }
    }

    static async login(credentials) {
        try {
            const response = await axios.post(`${API_URL}api/user/login`, credentials);
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteUser(id) {
        try {
            await axios.delete(`${API_URL}api/user/${id}`);
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
            throw error;
        }
    }

    static async removeRoleFromUser(userId, roleId) {
        console.log(userId + ' ' + roleId);
        try {
            await axios.delete(`${API_URL}api/user/${userId}/roles/${roleId}`);
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
            throw error;
        }
    }

    static async updateUser(userId, userData) {
        try {
            console.log('Updating user with data:', userData);
            const response = await axios.put(`${API_URL}api/user/${userId}`, userData);
            return response.data;
        } catch (error) {
            console.error('Update error:', error.response?.data || error.message);
            throw error;
        }
    }
}

export default AdminService;