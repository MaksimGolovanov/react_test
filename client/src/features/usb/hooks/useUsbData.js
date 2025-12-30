import { useState, useEffect, useCallback, useMemo } from 'react'
import UsbStore from '../store/UsbStore'

export const useUsbData = () => {
    const [usbData, setUsbData] = useState([])
    const [staffData, setStaffData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                await Promise.all([
                    UsbStore.fetchUsbAll(),
                    UsbStore.fetchStaffAll()
                ])
                setUsbData(UsbStore.usb || [])
                setStaffData(UsbStore.staff || [])
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const refetchUsbData = useCallback(async () => {
        await UsbStore.fetchUsbAll()
        setUsbData(UsbStore.usb || [])
    }, [])

    return {
        usbData,
        staffData,
        loading,
        error,
        refetchUsbData
    }
}