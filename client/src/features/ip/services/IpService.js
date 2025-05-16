import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL

class IpService {
    static async fetchIp() {
        try {
            const response = await axios.get(`${API_URL}api/ipaddress`)
            return response.data
        } catch (error) {
            console.error('Ошибка при получении IP-адресов:', error)
            throw error
        }
    }

    static async createIp(data) {
        try {
            const response = await axios.post(`${API_URL}api/ipaddress`, data)
            return response.data
        } catch (error) {
            console.error('Ошибка при создании IP-адреса:', error)
            throw error
        }
    }

    static async updateIp(id, data) {
        try {
            const response = await axios.put(`${API_URL}api/ipaddress/${id}`, data)
            return response.data
        } catch (error) {
            console.error('Ошибка при обновлении IP-адреса:', error)
            throw error
        }
    }

    static async deleteIp(id) {
        try {
            const response = await axios.delete(`${API_URL}api/ipaddress/${id}`)
            return response.data
        } catch (error) {
            console.error('Ошибка при удалении IP-адреса:', error)
            throw error
        }
    }
}

export default IpService