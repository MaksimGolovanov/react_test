import { useState, useCallback } from 'react'
import UsbStore from '../store/UsbStore'
export const useUsbForm = (staffData, onUsbUpdated) => {
    const [showModal, setShowModal] = useState(false)
    const [currentUsb, setCurrentUsb] = useState(null)
    const [selectedIds, setSelectedIds] = useState([])
    const [formData, setFormData] = useState({
        num_form: '',
        ser_num: '',
        volume: '',
        data_uch: '',
        email: '',
        fio: '',
        department: '',
        data_prov: '',
        log: 'Да',
    })

    const handleCheckboxChange = useCallback((id) => {
        setSelectedIds((prev) => (prev.includes(id) ? [] : [id]))
    }, [])

    const handleAddNew = useCallback(() => {
        setCurrentUsb(null)
        setFormData({
            num_form: '',
            ser_num: '',
            volume: '',
            data_uch: '',
            email: '',
            fio: '',
            department: '',
            data_prov: '',
            log: 'Да',
        })
        setShowModal(true)
    }, [])

    const handleEdit = useCallback((id, usbData) => {
        const usb = usbData.find((u) => u.id === id)
        if (!usb) return

        setCurrentUsb(usb)
        setFormData({
            num_form: usb.num_form || '',
            ser_num: usb.ser_num || '',
            volume: usb.volume || '',
            data_uch: usb.data_uch ? usb.data_uch.split('T')[0] : '',
            email: usb.email || '',
            fio: usb.fio || '',
            department: usb.department || '',
            data_prov: usb.data_prov ? usb.data_prov.split('T')[0] : '',
            log: usb.log || 'Да',
        })
        setShowModal(true)
    }, [])

    const getFioSuggestions = useCallback(() => {
        if (!staffData) return []
        return staffData
            .map((staff) => staff.fio)
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b, 'ru'))
    }, [staffData])

    const handleSubmit = useCallback(async (formData, currentUsb) => {
        try {
            if (currentUsb) {
                await UsbStore.updateUsb(currentUsb.id, formData)
            } else {
                await UsbStore.createUsb(formData)
            }
            setShowModal(false)
            setSelectedIds([])
            onUsbUpdated()
        } catch (error) {
            console.error('Ошибка при сохранении:', error)
            throw error
        }
    }, [onUsbUpdated])

    return {
        showModal,
        currentUsb,
        selectedIds,
        formData,
        setShowModal,
        setFormData,
        handleCheckboxChange,
        handleAddNew,
        handleEdit,
        handleSubmit,
        getFioSuggestions,
    }
}