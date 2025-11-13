import React, { useState, useEffect } from 'react'
import UsbStore from '../store/UsbStore'
import { observer } from 'mobx-react-lite'
import { Container, Table, Card, Button, Modal, Form, Alert, Spinner, FormCheck, ProgressBar } from 'react-bootstrap'
import { IoCreateOutline } from 'react-icons/io5'
import { RiFileEditLine } from 'react-icons/ri'
import { FaPaperPlane, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
import SearchInput from '../../ius-pt/components/SearchInput/SearchInput'
import styles from './style.module.css'

const UsbAddress = observer(() => {
     const [searchTerm, setSearchTerm] = useState('')
     const [selectedIds, setSelectedIds] = useState([])
     const [showModal, setShowModal] = useState(false)
     const [currentUsb, setCurrentUsb] = useState(null)
     const [showInWorkOnly, setShowInWorkOnly] = useState(true)
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
     const [sortConfig, setSortConfig] = useState({
          key: null,
          direction: 'ascending',
     })
     // Состояния для статус бара
     const [sendingProgress, setSendingProgress] = useState({
          show: false,
          total: 0,
          sent: 0,
          failed: 0,
          currentEmail: '',
          status: 'idle', // 'idle' | 'sending' | 'completed' | 'error'
     })

     useEffect(() => {
          UsbStore.fetchUsbAll()
          UsbStore.fetchStaffAll()
     }, [])

     const findStaffByFio = (fio) => {
          if (!fio || !UsbStore.staff) return null
          return UsbStore.staff.find((staff) => staff.fio?.toLowerCase() === fio.toLowerCase())
     }

     const handleFioChange = (e) => {
          const fio = e.target.value
          setFormData((prev) => ({ ...prev, fio }))

          // Автоматически заполняем email и службу при выборе ФИО
          const staffMember = findStaffByFio(fio)
          if (staffMember) {
               // Убираем первые 13 символов из названия службы
               const department = staffMember.department ? staffMember.department.substring(13) : ''

               setFormData((prev) => ({
                    ...prev,
                    fio,
                    email: staffMember.email || '',
                    department: department,
               }))
          }
     }

     const formatDate = (date) => {
          if (!date) return '-'
          const d = new Date(date)
          if (isNaN(d.getTime())) return '-'

          return d.toLocaleDateString('ru-RU', {
               day: '2-digit',
               month: '2-digit',
               year: 'numeric',
          })
     }

     const formatDateForInput = (dateString) => {
          if (!dateString) return ''
          const date = new Date(dateString)
          if (isNaN(date.getTime())) return ''

          const year = date.getFullYear()
          const month = (date.getMonth() + 1).toString().padStart(2, '0')
          const day = date.getDate().toString().padStart(2, '0')

          return `${year}-${month}-${day}`
     }

     const getNextCheckDate = (dateString) => {
          if (!dateString) return null

          const date = new Date(dateString)
          if (isNaN(date.getTime())) return null

          date.setDate(date.getDate() + 90)
          return date
     }

     const handleCheckboxChange = (id) => {
          setSelectedIds((prev) => (prev.includes(id) ? [] : [id]))
     }

     const handleInputChange = (e) => {
          const { name, value } = e.target
          if (name === 'fio') {
               handleFioChange(e)
          } else {
               setFormData((prev) => ({ ...prev, [name]: value }))
          }
          console.log(`Field changed: ${name}, value: ${value}`)
     }

     const handleAddNew = () => {
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
     }

     const handleEdit = () => {
          if (selectedIds.length === 0) return
          const usb = UsbStore.usb.find((u) => u.id === selectedIds[0])
          if (!usb) return

          setCurrentUsb(usb)
          setFormData({
               num_form: usb.num_form || '',
               ser_num: usb.ser_num || '',
               volume: usb.volume || '',
               data_uch: formatDateForInput(usb.data_uch) || '',
               email: usb.email || '',
               fio: usb.fio || '',
               department: usb.department || '',
               data_prov: formatDateForInput(usb.data_prov) || '',
               log: usb.log || 'Да',
          })
          setShowModal(true)
     }

     const handleSubmit = async (e) => {
          e.preventDefault()
          try {
               if (currentUsb) {
                    await UsbStore.updateUsb(currentUsb.id, formData)
               } else {
                    await UsbStore.createUsb(formData)
               }
               setShowModal(false)
               setSelectedIds([])
               UsbStore.fetchUsbAll()
          } catch (error) {
               console.error('Ошибка при сохранении:', error)
          }
     }

     const requestSort = (key) => {
          let direction = 'ascending'
          if (sortConfig.key === key && sortConfig.direction === 'ascending') {
               direction = 'descending'
          }
          setSortConfig({ key, direction })
     }

     const getSortIcon = (key) => {
          if (sortConfig.key !== key) return <FaSort />
          return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />
     }

     const getFioSuggestions = () => {
          if (!UsbStore.staff) return []
          return UsbStore.staff
               .map((staff) => staff.fio)
               .filter(Boolean)
               .sort((a, b) => a.localeCompare(b, 'ru')) // Сортировка по алфавиту
     }

     const sortedItems = () => {
          const filtered =
               UsbStore.usb?.filter(
                    (usb) =>
                         ((usb.num_form && usb.num_form.includes(searchTerm)) ||
                              (usb.ser_num && usb.ser_num.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              (usb.fio && usb.fio.toLowerCase().includes(searchTerm.toLowerCase()))) &&
                         (!showInWorkOnly || (usb.log && usb.log.toLowerCase() === 'да'))
               ) || []

          if (!sortConfig.key) return filtered

          return [...filtered].sort((a, b) => {
               if (sortConfig.key === 'num_form') {
                    const numA = parseInt(a.num_form) || 0
                    const numB = parseInt(b.num_form) || 0
                    return sortConfig.direction === 'ascending' ? numA - numB : numB - numA
               }

               if (sortConfig.key === 'volume') {
                    const numA = parseFloat(a[sortConfig.key]) || 0
                    const numB = parseFloat(b[sortConfig.key]) || 0
                    return sortConfig.direction === 'ascending' ? numA - numB : numB - numA
               }

               if (sortConfig.key.includes('data')) {
                    const dateA = new Date(a[sortConfig.key])
                    const dateB = new Date(b[sortConfig.key])
                    if (isNaN(dateA.getTime())) return sortConfig.direction === 'ascending' ? -1 : 1
                    if (isNaN(dateB.getTime())) return sortConfig.direction === 'ascending' ? 1 : -1
                    return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA
               }

               const valueA = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : ''
               const valueB = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : ''

               if (valueA < valueB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1
               }
               if (valueA > valueB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1
               }
               return 0
          })
     }

     // Функция отправки уведомлений - ВЫНЕСЕНА ИЗ РЕНДЕРА
     const sendReminders = async () => {
          console.log('🔴 Функция sendReminders вызвана!')

          try {
               console.log('🟡 Начинаем процесс отправки уведомлений...')

               // Получаем количество USB для уведомления
               const usbsToNotify =
                    UsbStore.usb?.filter((usb) => {
                         if (!usb.data_prov || !usb.email || (usb.log && usb.log.toLowerCase() === 'нет')) {
                              console.log(
                                   'USB исключен:',
                                   usb.id,
                                   'data_prov:',
                                   usb.data_prov,
                                   'email:',
                                   usb.email,
                                   'log:',
                                   usb.log
                              )
                              return false
                         }
                         const nextCheckDate = new Date(usb.data_prov)
                         nextCheckDate.setDate(nextCheckDate.getDate() + 90)
                         const now = new Date()
                         const daysDiff = Math.floor((nextCheckDate - now) / (1000 * 60 * 60 * 24))
                         console.log('USB проверка:', usb.id, 'daysDiff:', daysDiff)
                         return daysDiff <= 7
                    }) || []

               console.log('Найдено USB для уведомления:', usbsToNotify.length)
               console.log(
                    'Список USB для уведомления:',
                    usbsToNotify.map((u) => ({ id: u.id, email: u.email, fio: u.fio }))
               )

               if (usbsToNotify.length === 0) {
                    alert('Нет USB-накопителей, требующих уведомления')
                    console.log('🟠 Нет USB для уведомления')
                    return
               }

               // Показываем статус бар с реальным количеством
               setSendingProgress({
                    show: true,
                    total: usbsToNotify.length,
                    sent: 0,
                    failed: 0,
                    currentEmail: 'Начинаем отправку...',
                    status: 'sending',
               })

               //console.log('🟢 Вызываем UsbStore.sendReminders()')

               try {
                    // Вызываем отправку уведомлений
                    const result = await UsbStore.sendReminders()
                    // console.log('✅ Результат отправки:', result)

                    // ДЕТАЛЬНАЯ ИНФОРМАЦИЯ ОБ ОШИБКАХ
                    if (result.details?.failedEmails && result.details.failedEmails.length > 0) {
                         //console.log('❌ Ошибки отправки для email:', result.details.failedEmails)

                         // Попробуем получить больше информации об ошибках
                         const failedUsbs = usbsToNotify.filter((u) => result.details.failedEmails.includes(u.email))
                         console.log('❌ Подробности об ошибках:', {
                              failedEmails: result.details.failedEmails,
                              failedUsbs: failedUsbs.map((u) => ({
                                   id: u.id,
                                   email: u.email,
                                   fio: u.fio,
                                   department: u.department,
                              })),
                              totalFailed: result.details.failed,
                         })
                    }

                    // Обновляем статус бар с реальными результатами
                    setSendingProgress({
                         show: true,
                         total: result.details?.total || usbsToNotify.length,
                         sent: result.details?.successful || 0,
                         failed: result.details?.failed || 0,
                         currentEmail: 'Завершено',
                         status: 'completed',
                    })

                    // БОЛЕЕ ИНФОРМАТИВНОЕ СООБЩЕНИЕ
                    let message = result.message || 'Уведомления отправлены'
                    if (result.details?.failed > 0) {
                         message += `\n\nУспешно отправлено: ${result.details.successful}`
                         message += `\nНе удалось отправить: ${result.details.failed}`

                         if (result.details.failedEmails && result.details.failedEmails.length > 0) {
                              message += `\n\nПроблемные адреса:\n${result.details.failedEmails.join('\n')}`
                         }
                    }

                    alert(message)
               } catch (error) {
                    console.error('❌ Ошибка при вызове sendReminders:', error)

                    // ДЕТАЛЬНАЯ ИНФОРМАЦИЯ ОБ ОШИБКЕ
                    console.error('Детали ошибки:', {
                         message: error.message,
                         response: error.response,
                         status: error.response?.status,
                         data: error.response?.data,
                         config: error.config,
                    })

                    setSendingProgress((prev) => ({
                         ...prev,
                         status: 'error',
                         currentEmail: 'Ошибка отправки',
                    }))

                    // БОЛЕЕ ИНФОРМАТИВНОЕ СООБЩЕНИЕ ОБ ОШИБКЕ
                    let errorMessage = 'Произошла ошибка при отправке уведомлений'
                    if (error.response?.data?.message) {
                         errorMessage = error.response.data.message
                    } else if (error.message) {
                         errorMessage = error.message
                    }

                    alert(`❌ ${errorMessage}`)
                    throw error
               }
          } catch (error) {
               const errorMsg = error.response?.data?.message || 'Произошла ошибка при отправке уведомлений'
               console.error('❌ Ошибка в компоненте:', errorMsg, error)
               alert(`❌ ${errorMsg}`)
          }
     }

     const closeProgressBar = () => {
          setSendingProgress({
               show: false,
               total: 0,
               sent: 0,
               failed: 0,
               currentEmail: '',
               status: 'idle',
          })
     }

     const hasUsbsToNotify = UsbStore.usb?.some((usb) => {
          if (!usb.data_prov || !usb.email || (usb.log && usb.log.toLowerCase() === 'нет')) return false

          const nextCheckDate = new Date(usb.data_prov)
          nextCheckDate.setDate(nextCheckDate.getDate() + 90)
          const now = new Date()
          const daysDiff = Math.floor((nextCheckDate - now) / (1000 * 60 * 60 * 24))
          return daysDiff <= 7
     })

     // Правильное условие для блокировки кнопки
     const isSendButtonDisabled = !hasUsbsToNotify || sendingProgress.status === 'sending' || UsbStore.isSending

     console.log('📊 Состояние кнопки отправки:', {
          hasUsbsToNotify,
          sendingStatus: sendingProgress.status,
          isSending: UsbStore.isSending,
          isDisabled: isSendButtonDisabled,
     })

     if (UsbStore.error) {
          return (
               <Container className={styles.errorContainer}>
                    <Alert variant="danger">
                         <Alert.Heading>Ошибка загрузки данных</Alert.Heading>
                         <p>{UsbStore.error.message}</p>
                    </Alert>
               </Container>
          )
     }

     if (UsbStore.isLoading) {
          return (
               <Container className={styles.loadingContainer}>
                    <Spinner animation="border" role="status" />
                    <p className={styles.loadingText}>Загрузка данных о USB-накопителях...</p>
               </Container>
          )
     }

     return (
          <Container className={styles.containerGrid}>
               {/* Статус бар для отправки уведомлений */}
               {sendingProgress.show && (
                    <Card className={`mb-3 border-primary ${styles.statusContainer}`}>
                         <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                              <span>
                                   <FaPaperPlane className="me-2" />
                                   Отправка уведомлений
                              </span>
                              {sendingProgress.status === 'completed' && (
                                   <Button variant="light" size="sm" onClick={closeProgressBar}>
                                        Закрыть
                                   </Button>
                              )}
                         </Card.Header>
                         <Card.Body>
                              <div className="mb-3">
                                   <div className="d-flex justify-content-between mb-2">
                                        <span>
                                             {sendingProgress.status === 'sending'
                                                  ? 'Отправка...'
                                                  : sendingProgress.status === 'completed'
                                                  ? 'Завершено'
                                                  : sendingProgress.status === 'error'
                                                  ? 'Ошибка'
                                                  : 'Подготовка...'}
                                        </span>
                                        <span>
                                             {sendingProgress.sent + sendingProgress.failed} / {sendingProgress.total}
                                        </span>
                                   </div>
                                   <ProgressBar>
                                        <ProgressBar
                                             variant="success"
                                             now={(sendingProgress.sent / sendingProgress.total) * 100}
                                             key={1}
                                        />
                                        <ProgressBar
                                             variant="danger"
                                             now={(sendingProgress.failed / sendingProgress.total) * 100}
                                             key={2}
                                        />
                                   </ProgressBar>
                              </div>

                              <div className="row text-center">
                                   <div className="col-md-4">
                                        <div className="text-success">
                                             <strong>{sendingProgress.sent}</strong>
                                             <div className="small">Успешно</div>
                                        </div>
                                   </div>
                                   <div className="col-md-4">
                                        <div className="text-danger">
                                             <strong>{sendingProgress.failed}</strong>
                                             <div className="small">Ошибки</div>
                                        </div>
                                   </div>
                                   <div className="col-md-4">
                                        <div className="text-primary">
                                             <strong>
                                                  {sendingProgress.total -
                                                       sendingProgress.sent -
                                                       sendingProgress.failed}
                                             </strong>
                                             <div className="small">Осталось</div>
                                        </div>
                                   </div>
                              </div>

                              {sendingProgress.currentEmail && (
                                   <div className="mt-2 text-muted small">
                                        <em>{sendingProgress.currentEmail}</em>
                                   </div>
                              )}

                              {sendingProgress.status === 'completed' && sendingProgress.failed === 0 && (
                                   <Alert variant="success" className="mt-2 mb-0">
                                        Все уведомления успешно отправлены!
                                   </Alert>
                              )}

                              {sendingProgress.status === 'completed' && sendingProgress.failed > 0 && (
                                   <Alert variant="warning" className="mt-2 mb-0">
                                        Отправлено {sendingProgress.sent} из {sendingProgress.total} уведомлений. Не
                                        удалось отправить: {sendingProgress.failed}
                                   </Alert>
                              )}

                              {sendingProgress.status === 'error' && (
                                   <Alert variant="danger" className="mt-2 mb-0">
                                        Произошла ошибка при отправке уведомлений
                                   </Alert>
                              )}
                         </Card.Body>
                    </Card>
               )}

               <Card>
                    <Card.Header className={styles.header}>
                         <div className="d-flex align-items-center w-100">
                              {/* Кнопки слева */}
                              <div className="d-flex gap-2">
                                   <Button variant="primary" size="sm" onClick={handleAddNew}>
                                        <IoCreateOutline className="me-2" />
                                        Создать
                                   </Button>

                                   <Button
                                        variant="primary"
                                        size="sm"
                                        disabled={selectedIds.length === 0}
                                        onClick={handleEdit}
                                   >
                                        <RiFileEditLine className="me-2" />
                                        Редактировать
                                   </Button>

                                   <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={sendReminders}
                                        disabled={isSendButtonDisabled}
                                   >
                                        {sendingProgress.status === 'sending' || UsbStore.isSending ? (
                                             <>
                                                  <Spinner as="span" size="sm" animation="border" role="status" />
                                                  <span className="ms-2">Отправка...</span>
                                             </>
                                        ) : (
                                             <>
                                                  <FaPaperPlane className="me-2" />
                                                  Отправить напоминания
                                             </>
                                        )}
                                   </Button>
                              </div>

                              {/* Переключатель справа с автоматическим отступом */}
                              <div className="ms-auto">
                                   <FormCheck
                                        type="switch"
                                        id="showInWorkOnly"
                                        label="Показывать только USB-накопители в работе"
                                        checked={showInWorkOnly}
                                        onChange={(e) => setShowInWorkOnly(e.target.checked)}
                                   />
                              </div>
                         </div>

                         {/* Строка поиска под всем */}
                         <div className="mt-1">
                              <SearchInput
                                   value={searchTerm}
                                   onChange={(value) => setSearchTerm(value)}
                                   placeholder="Поиск пользователей..."
                              />
                         </div>
                    </Card.Header>

                    <Card.Body style={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                         <div className={styles.tableContainerGrid}>
                              <Table striped bordered hover className={styles.table}>
                                   <thead className="table-light">
                                        <tr className="table-primary">
                                             <th></th>
                                             <th onClick={() => requestSort('num_form')} style={{ cursor: 'pointer' }}>
                                                  Рег. номер {getSortIcon('num_form')}
                                             </th>
                                             <th onClick={() => requestSort('ser_num')} style={{ cursor: 'pointer' }}>
                                                  Серийный номер {getSortIcon('ser_num')}
                                             </th>
                                             <th onClick={() => requestSort('volume')} style={{ cursor: 'pointer' }}>
                                                  Объем {getSortIcon('volume')}
                                             </th>
                                             <th onClick={() => requestSort('data_uch')} style={{ cursor: 'pointer' }}>
                                                  Дата регистрации {getSortIcon('data_uch')}
                                             </th>
                                             <th onClick={() => requestSort('email')} style={{ cursor: 'pointer' }}>
                                                  Электронная почта {getSortIcon('email')}
                                             </th>
                                             <th onClick={() => requestSort('fio')} style={{ cursor: 'pointer' }}>
                                                  ФИО {getSortIcon('fio')}
                                             </th>
                                             <th
                                                  onClick={() => requestSort('department')}
                                                  style={{ cursor: 'pointer' }}
                                             >
                                                  Служба {getSortIcon('department')}
                                             </th>
                                             <th onClick={() => requestSort('data_prov')} style={{ cursor: 'pointer' }}>
                                                  Дата проверки {getSortIcon('data_prov')}
                                             </th>
                                             <th>Дата следующей проверки</th>
                                             <th onClick={() => requestSort('log')} style={{ cursor: 'pointer' }}>
                                                  В работе Да/Нет {getSortIcon('log')}
                                             </th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {sortedItems().map((usb) => {
                                             const nextCheckDate = getNextCheckDate(usb.data_prov)
                                             const isExpired = nextCheckDate && nextCheckDate < new Date()
                                             const isNotInWork = usb.log && usb.log.toLowerCase().trim() === 'нет'

                                             return (
                                                  <tr
                                                       key={usb.id}
                                                       className={
                                                            isExpired
                                                                 ? 'table-danger'
                                                                 : isNotInWork
                                                                 ? 'table-warning'
                                                                 : ''
                                                       }
                                                  >
                                                       <td>
                                                            <input
                                                                 className="form-check-input"
                                                                 type="checkbox"
                                                                 checked={selectedIds.includes(usb.id)}
                                                                 onChange={() => handleCheckboxChange(usb.id)}
                                                            />
                                                       </td>
                                                       <td>{usb.num_form || '-'}</td>
                                                       <td>{usb.ser_num || '-'}</td>
                                                       <td>{usb.volume || '-'}</td>
                                                       <td>{formatDate(usb.data_uch) || '-'}</td>
                                                       <td>{usb.email || '-'}</td>
                                                       <td>{usb.fio || '-'}</td>
                                                       <td>{usb.department || '-'}</td>
                                                       <td>{formatDate(usb.data_prov) || '-'}</td>
                                                       <td>
                                                            {usb.data_prov
                                                                 ? formatDate(getNextCheckDate(usb.data_prov))
                                                                 : '-'}
                                                       </td>
                                                       <td>{usb.log || '-'}</td>
                                                  </tr>
                                             )
                                        })}
                                   </tbody>
                              </Table>
                         </div>
                    </Card.Body>
               </Card>

               <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                         <Modal.Title>
                              {currentUsb ? 'Редактирование USB-накопителя' : 'Добавление нового USB-накопителя'}
                         </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                         <Modal.Body>
                              <div className="row">
                                   <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                             <Form.Label>Рег. номер</Form.Label>
                                             <Form.Control
                                                  type="text"
                                                  name="num_form"
                                                  value={formData.num_form}
                                                  onChange={handleInputChange}
                                                  required
                                             />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                             <Form.Label>Серийный номер</Form.Label>
                                             <Form.Control
                                                  type="text"
                                                  name="ser_num"
                                                  value={formData.ser_num}
                                                  onChange={handleInputChange}
                                                  required
                                             />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                             <Form.Label>Объем</Form.Label>
                                             <Form.Control
                                                  type="text"
                                                  name="volume"
                                                  value={formData.volume}
                                                  onChange={handleInputChange}
                                             />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                             <Form.Label>Дата регистрации</Form.Label>
                                             <Form.Control
                                                  type="date"
                                                  name="data_uch"
                                                  value={formData.data_uch}
                                                  onChange={handleInputChange}
                                             />
                                        </Form.Group>
                                   </div>

                                   <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                             <Form.Label>ФИО *</Form.Label>
                                             <Form.Control
                                                  type="text"
                                                  name="fio"
                                                  value={formData.fio}
                                                  onChange={handleInputChange}
                                                  list="fio-suggestions"
                                                  placeholder="Начните вводить ФИО..."
                                                  required
                                             />
                                             <datalist id="fio-suggestions">
                                                  {getFioSuggestions().map((fio, index) => (
                                                       <option key={index} value={fio} />
                                                  ))}
                                             </datalist>
                                             <Form.Text className="text-muted">
                                                  Начните вводить ФИО для поиска, при выборе автоматически заполнятся
                                                  email и служба
                                             </Form.Text>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                             <Form.Label>Электронная почта</Form.Label>
                                             <Form.Control
                                                  type="email"
                                                  name="email"
                                                  value={formData.email}
                                                  onChange={handleInputChange}
                                                  readOnly
                                             />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                             <Form.Label>Служба</Form.Label>
                                             <Form.Control
                                                  type="text"
                                                  name="department"
                                                  value={formData.department}
                                                  onChange={handleInputChange}
                                                  readOnly
                                             />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                             <Form.Label>Дата проверки</Form.Label>
                                             <Form.Control
                                                  type="date"
                                                  name="data_prov"
                                                  value={formData.data_prov}
                                                  onChange={handleInputChange}
                                             />
                                        </Form.Group>
                                   </div>
                              </div>

                              <Form.Group className="mb-3">
                                   <Form.Label>В работе (Да/Нет)</Form.Label>
                                   <Form.Control
                                        as="select"
                                        name="log"
                                        value={formData.log}
                                        onChange={handleInputChange}
                                   >
                                        <option value="Да">Да</option>
                                        <option value="Нет">Нет</option>
                                   </Form.Control>
                              </Form.Group>
                         </Modal.Body>
                         <Modal.Footer>
                              <Button variant="secondary" onClick={() => setShowModal(false)}>
                                   Отмена
                              </Button>
                              <Button variant="primary" type="submit">
                                   Сохранить
                              </Button>
                         </Modal.Footer>
                    </Form>
               </Modal>
          </Container>
     )
})

export default UsbAddress
