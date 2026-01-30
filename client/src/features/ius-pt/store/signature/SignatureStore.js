import { makeObservable, observable, action, runInAction } from 'mobx'
import { BaseStore } from '../base/BaseStore'
import { IusPtService } from '../../services'

export class SignatureStore extends BaseStore {
    signatures = []

    constructor() {
        super()
        
        makeObservable(this, {
            signatures: observable,
            fetchSignatures: action,
            createSignature: action,
            updateSignature: action,
            deleteSignature: action,
        })
        
        this.fetchSignatures()
    }

    fetchSignatures = async () => {
        try {
            const response = await super.fetchData(IusPtService.fetchSignatures, 'signatures')
            runInAction(() => {
                this.signatures = response
            })
        } catch (error) {
            console.error('Ошибка при получении подписей:', error)
            throw error
        }
    }

    createSignature = async (newSignature) => {
        try {
            const response = await super.createOrUpdateData(
                IusPtService.createSignature,
                IusPtService.fetchSignatures,
                'signatures',
                newSignature
            )
            runInAction(() => {
                this.signatures = response
            })
        } catch (error) {
            console.error('Ошибка при создании подписи:', error)
            throw error
        }
    }

    updateSignature = async (updatedSignature) => {
        try {
            const response = await super.createOrUpdateData(
                IusPtService.updateSignature,
                IusPtService.fetchSignatures,
                'signatures',
                updatedSignature
            )
            runInAction(() => {
                this.signatures = response
            })
        } catch (error) {
            console.error('Ошибка при обновлении подписи:', error)
            throw error
        }
    }

    deleteSignature = async (id) => {
        try {
            const response = await super.deleteData(
                IusPtService.deleteSignature,
                IusPtService.fetchSignatures,
                'signatures',
                id
            )
            runInAction(() => {
                this.signatures = response
            })
        } catch (error) {
            console.error('Ошибка при удалении подписи:', error)
            throw error
        }
    }
}