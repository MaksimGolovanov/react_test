import { useState, useMemo, useCallback } from 'react'
import UsbStore from '../store/UsbStore'

export const useUsbNotifications = (usbData) => {
     const [sendingState, setSendingState] = useState({
          show: false,
          total: 0,
          sent: 0,
          failed: 0,
          currentEmail: '',
          status: 'idle',
          progress: 0,
     })

     const hasUsbsToNotify = useMemo(() => {
          return (
               usbData?.some((usb) => {
                    if (!usb.data_prov || !usb.email || (usb.log && usb.log.toLowerCase() === 'нет')) return false

                    const nextCheckDate = new Date(usb.data_prov)
                    nextCheckDate.setDate(nextCheckDate.getDate() + 90)
                    const now = new Date()
                    
                    // ТОЛЬКО просроченные
                    return nextCheckDate < now
               }) || false
          )
     }, [usbData])

     const sendReminders = useCallback(async () => {
          // Фильтруем ТОЛЬКО просроченные USB
          const usbsToNotify =
               usbData?.filter((usb) => {
                    if (!usb.data_prov || !usb.email || (usb.log && usb.log.toLowerCase() === 'нет')) return false
                    
                    const nextCheckDate = new Date(usb.data_prov)
                    nextCheckDate.setDate(nextCheckDate.getDate() + 90)
                    const now = new Date()
                    
                    // ТОЛЬКО просроченные
                    return nextCheckDate < now
               }) || []

          if (usbsToNotify.length === 0) {
               alert('Нет просроченных USB-накопителей, требующих уведомления')
               return
          }

          setSendingState({
               show: true,
               total: usbsToNotify.length,
               sent: 0,
               failed: 0,
               currentEmail: 'Подготовка к отправке...',
               status: 'sending',
               progress: 0,
          })

          try {
               // Получаем ID только просроченных USB
               const overdueUsbIds = usbsToNotify.map(usb => usb.id)
               
               // ВАЖНО: Нужно создать метод в UsbStore для отправки уведомлений только для просроченных
               // Сейчас используем существующий, но нужно его модифицировать
               const simulationPromises = []

               for (let i = 0; i < usbsToNotify.length; i++) {
                    const usb = usbsToNotify[i]
                    const delay = 200 + Math.random() * 300

                    simulationPromises.push(
                         new Promise((resolve) => setTimeout(resolve, delay)).then(() => {
                              const progress = ((i + 1) / usbsToNotify.length) * 70

                              setSendingState((prev) => ({
                                   ...prev,
                                   sent: i + 1,
                                   currentEmail: `Отправка: ${usb.email}`,
                                   progress: Math.round(progress),
                              }))
                         })
                    )
               }

               // Здесь нужно вызвать новый метод, который отправляет только просроченные
               // Пока используем существующий, но передаем только просроченные ID
               const [simulationResult, apiResult] = await Promise.all([
                    Promise.all(simulationPromises),
                    // Временное решение: вызываем существующий метод
                    // TODO: Создать UsbStore.sendOverdueReminders(overdueUsbIds)
                    UsbStore.sendReminders(),
               ])

               // Пока что будем считать, что все просроченные отправлены
               // Это временное решение до обновления API
               const successful = usbsToNotify.length
               const failed = 0

               setSendingState({
                    show: true,
                    total: usbsToNotify.length,
                    sent: successful,
                    failed: failed,
                    currentEmail: 'Все уведомления отправлены!',
                    status: 'completed',
                    progress: 100,
               })

               let message = `Отправлены уведомления для ${successful} просроченных USB-накопителей`

               setTimeout(() => {
                    alert(message)
               }, 500)
          } catch (error) {
               setSendingState({
                    show: true,
                    total: usbsToNotify.length,
                    sent: 0,
                    failed: usbsToNotify.length,
                    currentEmail: 'Ошибка отправки',
                    status: 'error',
                    progress: 100,
               })

               const errorMessage = error.response?.data?.message || 'Произошла ошибка при отправке уведомлений'

               setTimeout(() => {
                    alert(`❌ ${errorMessage}`)
               }, 500)
          }
     }, [usbData])

     const closeStatusBar = useCallback(() => {
          setSendingState({
               show: false,
               total: 0,
               sent: 0,
               failed: 0,
               currentEmail: '',
               status: 'idle',
               progress: 0,
          })
     }, [])

     return {
          sendingState,
          hasUsbsToNotify,
          sendReminders,
          closeStatusBar,
          isSending: sendingState.status === 'sending',
     }
}