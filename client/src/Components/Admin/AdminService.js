import axios from 'axios';

class AdminService {
    static async fetchUser() {
        try {
            const response = await axios.get('http://localhost:5000/api/user/user');
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    static async fetchRoleUser() {
        try {
            const response = await axios.get('http://localhost:5000/api/user/userrouter');

            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    static async fetchRole() {
        try {
            const response = await axios.get('http://localhost:5000/api/user/role');
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async createRole(role) {
        try {
            const response = await axios.post('http://localhost:5000/api/user/role', role);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async registration(data) {
        try {
            console.log('Sending registration data:', data);
            const response = await axios.post('http://localhost:5000/api/user/registration', data);
            console.log('Registration response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            throw error;
        }
    }
    static async login(credentials) {
        try {
            
            const response = await axios.post('http://localhost:5000/api/user/login', credentials); // Предполагается, что ваш API ожидает POST-запрос на этот маршрут
            
            return response.data; // Здесь вы можете вернуть токен, права доступа и т. д.
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error; // Пробрасываем ошибку дальше, чтобы её можно было обработать в компоненте
        }
    }
    static async deleteUser(id) {
        try {
            await axios.delete(`http://localhost:5000/api/user/${id}`);
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
            throw error;
        }
    }
    static async removeRoleFromUser(userId, roleId) {
        console.log(userId + ' ' + roleId)
        try {
            await axios.delete(`http://localhost:5000/api/user/${userId}/roles/${roleId}`);
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
            throw error;
        }
    }
    static async updateUser(userId, userData) {
        try {
            console.log('Updating user with data:', userData);
            const response = await axios.put(`http://localhost:5000/api/user/${userId}`, userData);
            return response.data;
        } catch (error) {
            console.error('Update error:', error.response?.data || error.message);
            throw error;
        }
    }

}

export default AdminService;