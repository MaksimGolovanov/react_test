import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class AdminService {
    // Основные методы пользователей (изменены для поддержки ST пользователей)
    static async fetchUser() {
        try {
            const response = await axios.get(`${API_URL}api/user/user`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async fetchUserWithRoles() {
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
            console.error("Ошибка при удалении роли у пользователя:", error);
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

    // Методы для ST пользователей (обучение)
    static async fetchSTUsers() {
        try {
            const response = await axios.get(`${API_URL}api/st`);
            return response.data;
        } catch (error) {
            console.error('Error fetching ST users:', error);
            throw error;
        }
    }

    static async fetchSTUser(id) {
        try {
            const response = await axios.get(`${API_URL}api/st/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching ST user:', error);
            throw error;
        }
    }

    static async createSTUser(userData) {
        try {
            console.log('Creating ST user with data:', userData);
            const response = await axios.post(`${API_URL}api/st/create`, userData);
            console.log('ST user creation response:', response.data);
            return response.data;
        } catch (error) {
            console.error('ST user creation error:', error.response?.data || error.message);
            throw error;
        }
    }

    static async updateSTUser(id, userData) {
        try {
            console.log('Updating ST user with data:', userData);
            const response = await axios.put(`${API_URL}api/st/update/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error('ST user update error:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteSTUser(id) {
        try {
            await axios.delete(`${API_URL}api/st/delete/${id}`);
        } catch (error) {
            console.error("Ошибка при удалении ST пользователя:", error);
            throw error;
        }
    }

    static async updateSTUserStats(id, statsData) {
        try {
            console.log('Updating ST user stats:', statsData);
            const response = await axios.put(`${API_URL}api/st/stats/${id}`, statsData);
            return response.data;
        } catch (error) {
            console.error('ST stats update error:', error.response?.data || error.message);
            throw error;
        }
    }

    // Комбинированные методы для управления пользователями обучения
    static async getCombinedUsers() {
        try {
            // Получаем обычных пользователей
            const regularUsers = await this.fetchUserWithRoles();
            
            // Получаем ST пользователей
            const stUsers = await this.fetchSTUsers();
            
            // Объединяем данные
            const combinedUsers = regularUsers.map(user => {
                // Ищем соответствующего ST пользователя по табельному номеру
                const stUser = stUsers.find(st => st.tabNumber === user.tabNumber);
                
                return {
                    ...user,
                    isSTUser: !!stUser,
                    stData: stUser || null
                };
            });

            return combinedUsers;
        } catch (error) {
            console.error('Error getting combined users:', error);
            throw error;
        }
    }

    // Проверка, является ли пользователь ST пользователем
    static async isSTUser(userId) {
        try {
            const users = await this.getCombinedUsers();
            const user = users.find(u => u.id === userId);
            return user ? user.isSTUser : false;
        } catch (error) {
            console.error('Error checking if user is ST user:', error);
            return false;
        }
    }

    // Создание пользователя с автоматическим определением типа
    static async createUserWithType(userData) {
        try {
            // Проверяем, есть ли ST роли
            const hasSTRole = userData.roles && Array.isArray(userData.roles) && 
                userData.roles.some(role => 
                    role === 'ST' || role === 'ST-ADMIN' || 
                    (typeof role === 'object' && (role.role === 'ST' || role.role === 'ST-ADMIN'))
                );

            if (hasSTRole) {
                // Если есть ST роль, создаем через ST контроллер
                return await this.createSTUser(userData);
            } else {
                // Иначе создаем обычного пользователя
                return await this.registration(userData);
            }
        } catch (error) {
            console.error('Error creating user with type:', error);
            throw error;
        }
    }

    // Обновление пользователя с учетом типа
    static async updateUserWithType(userId, userData) {
        try {
            // Сначала получаем текущие данные пользователя
            const users = await this.getCombinedUsers();
            const currentUser = users.find(u => u.id === userId);
            
            if (!currentUser) {
                throw new Error('Пользователь не найден');
            }

            // Проверяем, меняется ли тип пользователя
            const currentIsST = currentUser.isSTUser;
            const newIsST = userData.roles && Array.isArray(userData.roles) && 
                userData.roles.some(role => 
                    role === 'ST' || role === 'ST-ADMIN' || 
                    (typeof role === 'object' && (role.role === 'ST' || role.role === 'ST-ADMIN'))
                );

            if (currentIsST && newIsST) {
                // Остается ST пользователем - обновляем через ST
                return await this.updateSTUser(currentUser.stData?.id || userId, userData);
            } else if (!currentIsST && newIsST) {
                // Становится ST пользователем - создаем ST запись
                const regularUpdate = await this.updateUser(userId, userData);
                const stUser = await this.createSTUser({
                    ...userData,
                    tabNumber: userData.tabNumber || currentUser.tabNumber
                });
                return { ...regularUpdate, stUser };
            } else if (currentIsST && !newIsST) {
                // Перестает быть ST пользователем - удаляем ST запись
                const stId = currentUser.stData?.id;
                if (stId) {
                    await this.deleteSTUser(stId);
                }
                return await this.updateUser(userId, userData);
            } else {
                // Остается обычным пользователем
                return await this.updateUser(userId, userData);
            }
        } catch (error) {
            console.error('Error updating user with type:', error);
            throw error;
        }
    }

    // Удаление пользователя с учетом типа
    static async deleteUserWithType(userId) {
        try {
            // Получаем данные пользователя
            const users = await this.getCombinedUsers();
            const user = users.find(u => u.id === userId);
            
            if (!user) {
                throw new Error('Пользователь не найден');
            }

            if (user.isSTUser && user.stData) {
                // Удаляем ST пользователя (это также удалит основного пользователя)
                await this.deleteSTUser(user.stData.id);
            } else {
                // Удаляем обычного пользователя
                await this.deleteUser(userId);
            }
        } catch (error) {
            console.error('Error deleting user with type:', error);
            throw error;
        }
    }
}

export default AdminService;