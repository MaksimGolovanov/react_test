import { useContext } from 'react'
import { MobXProviderContext } from 'mobx-react'
import rootStore from '../stores'

export const useStores = () => {
    const stores = useContext(MobXProviderContext)
    if (!stores) {
        throw new Error('useStores must be used within MobXProvider')
    }
    return stores
}

export const useRootStore = () => rootStore