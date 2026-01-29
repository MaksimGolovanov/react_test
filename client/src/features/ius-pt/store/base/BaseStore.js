// Простой базовый класс без MobX декораторов
export class BaseStore {
    // 1️⃣ Общий метод для загрузки данных
    async fetchData(fetchFunction, stateProperty, ...args) {
        try {
            return await fetchFunction(...args)
        } catch (error) {
            console.error(`Ошибка при получении данных (${stateProperty}):`, error)
            throw error
        }
    }

    // 2️⃣ Общий метод для создания/обновления
    async createOrUpdateData(serviceFunction, fetchFunction, stateProperty, data) {
        try {
            await serviceFunction(data)
            return await this.fetchData(fetchFunction, stateProperty)
        } catch (error) {
            console.error(`Ошибка при создании/обновлении данных (${stateProperty}):`, error)
            throw error
        }
    }

    // 3️⃣ Общий метод для удаления
    async deleteData(serviceFunction, fetchFunction, stateProperty, id, ...args) {
        try {
            await serviceFunction(id, ...args)
            return await this.fetchData(fetchFunction, stateProperty)
        } catch (error) {
            console.error(`Ошибка при удалении данных (${stateProperty}):`, error)
            throw error
        }
    }
}