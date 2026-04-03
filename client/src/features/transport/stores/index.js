// stores/index.js - исправленный
import { makeAutoObservable } from 'mobx'
import transportStoreInstance from './TransportStore'  // импортируем экземпляр
import FilterStore from './FilterStore'

class UserStoreStub {
    user = null
    card = { tabNumber: 'system' }
    
    constructor() {
        makeAutoObservable(this)
    }
}

class RootStore {
    userStore = null
    transportStore = null
    filterStore = null

    constructor() {
        makeAutoObservable(this)
        
        this.userStore = new UserStoreStub()
        this.transportStore = transportStoreInstance  // используем экземпляр
        this.filterStore = new FilterStore(this)
    }
}

const rootStore = new RootStore()
export default rootStore

export const transportStore = rootStore.transportStore
export const filterStore = rootStore.filterStore
export const userStore = rootStore.userStore