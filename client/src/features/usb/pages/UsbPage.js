import React, { useState, useEffect } from 'react'
import UsbStore from '../store/UsbStore'
import { observer } from 'mobx-react-lite'
import { Container, Table, Card, Button, Modal, Form, Alert, Spinner, FormCheck } from 'react-bootstrap'
import { IoCreateOutline } from 'react-icons/io5'
import { RiFileEditLine } from 'react-icons/ri'
import { FaPaperPlane, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
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

     useEffect(() => {
          UsbStore.fetchUsbAll()
     }, [])

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
          if (!dateString) return null // Возвращаем null вместо пустой строки

          const date = new Date(dateString)
          if (isNaN(date.getTime())) return null

          date.setDate(date.getDate() + 90)
          return date // Возвращаем объект Date вместо строки
     }

     const handleCheckboxChange = (id) => {
          setSelectedIds((prev) => (prev.includes(id) ? [] : [id]))
     }

     const handleInputChange = (e) => {
          const { name, value } = e.target
          setFormData((prev) => ({ ...prev, [name]: value }))
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
               // Специальная обработка для num_form (сортировка как числа)
               if (sortConfig.key === 'num_form') {
                    const numA = parseInt(a.num_form) || 0
                    const numB = parseInt(b.num_form) || 0
                    return sortConfig.direction === 'ascending' ? numA - numB : numB - numA
               }

               // Для числовых полей
               if (sortConfig.key === 'volume') {
                    const numA = parseFloat(a[sortConfig.key]) || 0
                    const numB = parseFloat(b[sortConfig.key]) || 0
                    return sortConfig.direction === 'ascending' ? numA - numB : numB - numA
               }

               // Для дат
               if (sortConfig.key.includes('data')) {
                    const dateA = new Date(a[sortConfig.key])
                    const dateB = new Date(b[sortConfig.key])
                    if (isNaN(dateA.getTime())) return sortConfig.direction === 'ascending' ? -1 : 1
                    if (isNaN(dateB.getTime())) return sortConfig.direction === 'ascending' ? 1 : -1
                    return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA
               }

               // Для строк
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

     const sendReminders = async () => {
          try {
               const confirmSend = window.confirm(
                    'Вы уверены, что хотите отправить уведомления о проверке USB-накопителей?'
               )
               if (!confirmSend) return

               console.log('Инициация отправки уведомлений...', {
                    time: new Date().toISOString(),
                    user: 'current_user', // Здесь можно добавить информацию о текущем пользователе
               })

               const result = await UsbStore.sendReminders()

               // Логирование успешной отправки в UI
               console.log('Результат отправки уведомлений:', {
                    total: result.details?.total || 0,
                    successful: result.details?.successful || 0,
                    failed: result.details?.failed || 0,
               })

               alert(result.message || 'Уведомления отправлены')

               if (result.details?.failed > 0) {
                    alert(`Не удалось отправить ${result.details.failed} уведомлений.`)
                    console.warn('Неудачные отправки:', {
                         emails: result.details.failedEmails || [],
                    })
               }
          } catch (error) {
               const errorMsg = error.response?.data?.message || 'Произошла ошибка при отправке уведомлений'
               console.error('Ошибка в компоненте:', errorMsg, error)
               alert(errorMsg)
          }
     }
     const hasUsbsToNotify = UsbStore.usb?.some((usb) => {
          if (!usb.data_prov || !usb.email || (usb.log && usb.log.toLowerCase() === 'нет')) return false

          const nextCheckDate = new Date(usb.data_prov)
          nextCheckDate.setDate(nextCheckDate.getDate() + 90)
          const now = new Date()
          const daysDiff = Math.floor((nextCheckDate - now) / (1000 * 60 * 60 * 24))
          return daysDiff <= 7
     })

     return (
          <Container className={styles.container}>
               <Card>
                    <Card.Header className={styles.header}>
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
                                   disabled={!hasUsbsToNotify || UsbStore.isLoading}
                              >
                                   {UsbStore.isLoading ? (
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

                         <div className="my-3 bg-light rounded-3">
                              <input
                                   type="search"
                                   className="form-control"
                                   placeholder="Поиск"
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                              />
                         </div>

                         <FormCheck
                              type="switch"
                              id="showInWorkOnly"
                              label="Показывать только USB-накопители в работе"
                              checked={showInWorkOnly}
                              onChange={(e) => setShowInWorkOnly(e.target.checked)}
                         />
                    </Card.Header>

                    <Card.Body>
                         <div className={styles.tableContainer}>
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
                                             const isNotInWork = usb.log && usb.log.toLowerCase() === 'нет'

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
                                             <Form.Label>Электронная почта</Form.Label>
                                             <Form.Control
                                                  type="email"
                                                  name="email"
                                                  value={formData.email}
                                                  onChange={handleInputChange}
                                             />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                             <Form.Label>ФИО</Form.Label>
                                             <Form.Control
                                                  type="text"
                                                  name="fio"
                                                  value={formData.fio}
                                                  onChange={handleInputChange}
                                             />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                             <Form.Label>Служба</Form.Label>
                                             <Form.Control
                                                  type="text"
                                                  name="department"
                                                  value={formData.department}
                                                  onChange={handleInputChange}
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
