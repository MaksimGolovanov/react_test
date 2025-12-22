import React, { useState, useEffect } from 'react'
import CardStore from '../store/CardStore'
import { observer } from 'mobx-react-lite'
import { Container, Table, Card, Button, Modal, Form, Alert, Spinner, FormCheck } from 'react-bootstrap'
import { IoCreateOutline } from 'react-icons/io5'
import { RiFileEditLine } from 'react-icons/ri'
import { FaTrashAlt, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
import SearchInput from '../../ius-pt/components/SearchInput/SearchInput'
import styles from './style.module.css'

const CardUch = observer(() => {
     const [searchTerm, setSearchTerm] = useState('')
     const [selectedIds, setSelectedIds] = useState([])
     const [showModal, setShowModal] = useState(false)
     const [showDeleteModal, setShowDeleteModal] = useState(false)
     const [currentCard, setCurrentCard] = useState(null)
     const [showInWorkOnly, setShowInWorkOnly] = useState(false)
     const [showNotInWorkOnly, setShowNotInWorkOnly] = useState(false)

     const [formData, setFormData] = useState({
          ser_num: '',
          type: '',
          description: '',
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
          CardStore.fetchCardAll()
          CardStore.fetchStaffAll()
     }, [])
     useEffect(() => {
          if (showInWorkOnly && showNotInWorkOnly) {
               setShowNotInWorkOnly(false)
          }
     }, [showInWorkOnly])

     useEffect(() => {
          if (showNotInWorkOnly && showInWorkOnly) {
               setShowInWorkOnly(false)
          }
     }, [showNotInWorkOnly])

     const findStaffByFio = (fio) => {
          if (!fio || !CardStore.staff) return null
          return CardStore.staff.find((staff) => staff.fio?.toLowerCase() === fio.toLowerCase())
     }

     const handleFioChange = (e) => {
          const fio = e.target.value
          setFormData((prev) => ({ ...prev, fio }))

          const staffMember = findStaffByFio(fio)
          if (staffMember) {
               const department = staffMember.department ? staffMember.department.substring(13) : ''
               setFormData((prev) => ({
                    ...prev,
                    fio,
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

          date.setDate(date.getDate() + 730)

          // Обнуляем время для корректного сравнения
          date.setHours(0, 0, 0, 0)
          return date
     }

     const getCellColorClass = (card) => {
          // Если карта не в работе, не подсвечиваем даты
          if (card.log && card.log.toLowerCase().trim() === 'нет') {
               return ''
          }

          const nextCheckDate = getNextCheckDate(card.data_prov)
          if (!nextCheckDate) return ''

          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const nextCheckDateOnly = new Date(nextCheckDate)
          nextCheckDateOnly.setHours(0, 0, 0, 0)

          const warningDate = new Date(nextCheckDateOnly)
          warningDate.setDate(warningDate.getDate() - 30)

          if (nextCheckDateOnly < today) return styles.expiredCell
          if (warningDate <= today) return styles.warningCell

          return ''
     }

     const getRowColorClass = (card) => {
          // Если карта не в работе - желтая строка
          if (card.log && card.log.toLowerCase().trim() === 'нет') {
               return 'table-warning'
          }
          return ''
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
     }

     const handleAddNew = () => {
          setCurrentCard(null)
          setFormData({
               ser_num: '',
               type: '',
               description: '',
               fio: '',
               department: '',
               data_prov: '',
               log: 'Да',
          })
          setShowModal(true)
     }

     const handleEdit = () => {
          if (selectedIds.length === 0) return
          const card = CardStore.card.find((u) => u.id === selectedIds[0])
          if (!card) return

          setCurrentCard(card)
          setFormData({
               ser_num: card.ser_num || '',
               type: card.type || '',
               description: card.description || '',
               fio: card.fio || '',
               department: card.department || '',
               data_prov: formatDateForInput(card.data_prov) || '',
               log: card.log || 'Да',
          })
          setShowModal(true)
     }

     const handleDelete = () => {
          if (selectedIds.length === 0) return
          setShowDeleteModal(true)
     }

     const confirmDelete = async () => {
          try {
               // Удаляем все выбранные записи
               for (const id of selectedIds) {
                    await CardStore.deleteCard(id)
               }

               // Сброс выбора и закрытие модального окна
               setSelectedIds([])
               setShowDeleteModal(false)
          } catch (error) {
               console.error('Ошибка при удалении:', error)
               // Можно добавить уведомление об ошибке
          }
     }

     const handleSubmit = async (e) => {
          e.preventDefault()
          try {
               if (currentCard) {
                    await CardStore.updateCard(currentCard.id, formData)
               } else {
                    await CardStore.createCard(formData)
               }
               setShowModal(false)
               setSelectedIds([])
               // Не нужно вызывать fetchCardAll() - он уже вызывается в методах store
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
          if (!CardStore.staff) return []
          return CardStore.staff
               .map((staff) => staff.fio)
               .filter(Boolean)
               .sort((a, b) => a.localeCompare(b, 'ru'))
     }

     const sortedItems = () => {
          const filtered =
               CardStore.card?.filter(
                    (card) =>
                         ((card.ser_num && card.ser_num.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              (card.fio && card.fio.toLowerCase().includes(searchTerm.toLowerCase()))) &&
                         (!showInWorkOnly || (card.log && card.log.toLowerCase() === 'да')) &&
                         (!showNotInWorkOnly || (card.log && card.log.toLowerCase() === 'нет'))
               ) || []

          if (!sortConfig.key) return filtered

          return [...filtered].sort((a, b) => {
               const valueA = a[sortConfig.key] ? a[sortConfig.key].toString() : ''
               const valueB = b[sortConfig.key] ? b[sortConfig.key].toString() : ''

               const comparison = valueA.localeCompare(valueB, 'ru', {
                    numeric: true,
                    sensitivity: 'base',
               })

               return sortConfig.direction === 'ascending' ? comparison : -comparison
          })
     }

     const getCardStatistics = () => {
          if (!CardStore.card) return { total: 0, inWork: 0, notInWork: 0 }

          const cards = CardStore.card
          const total = cards.length
          const inWork = cards.filter((card) => card.log && card.log.toLowerCase().trim() === 'да').length
          const notInWork = cards.filter((card) => card.log && card.log.toLowerCase().trim() === 'нет').length

          return { total, inWork, notInWork }
     }

     const getSelectedCardsInfo = () => {
          return CardStore.card?.filter((card) => selectedIds.includes(card.id)) || []
     }

     if (CardStore.error) {
          return (
               <Container className={styles.errorContainer}>
                    <Alert variant="danger">
                         <Alert.Heading>Ошибка загрузки данных</Alert.Heading>
                         <p>{CardStore.error.message}</p>
                    </Alert>
               </Container>
          )
     }

     if (CardStore.isLoading) {
          return (
               <Container className={styles.loadingContainer}>
                    <Spinner animation="border" role="status" />
                    <p className={styles.loadingText}>Загрузка данных о картах доступа...</p>
               </Container>
          )
     }

     return (
          <Container className={styles.containerGrid}>
               <Card>
                    <Card.Header className={styles.header}>
                         <div className="d-flex align-items-center w-100">
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
                                        variant="danger"
                                        size="sm"
                                        disabled={selectedIds.length === 0}
                                        onClick={handleDelete}
                                   >
                                        <FaTrashAlt className="me-2" />
                                        Удалить
                                   </Button>
                              </div>

                              <div className="ms-auto d-flex flex-column gap-1">
                                   <FormCheck
                                        type="switch"
                                        id="showInWorkOnly"
                                        label="Показывать только карты в работе"
                                        checked={showInWorkOnly}
                                        onChange={(e) => setShowInWorkOnly(e.target.checked)}
                                        className="mb-0"
                                   />
                                   <FormCheck
                                        type="switch"
                                        id="showNotInWorkOnly"
                                        label="Показывать только карты не в работе"
                                        checked={showNotInWorkOnly}
                                        onChange={(e) => setShowNotInWorkOnly(e.target.checked)}
                                        className="mb-0"
                                   />
                              </div>
                         </div>

                         <div className="d-flex align-items-center justify-content-between">
                              <div style={{ width: '600px' }}>
                                   <SearchInput
                                        value={searchTerm}
                                        onChange={(value) => setSearchTerm(value)}
                                        placeholder="Поиск по серийному номеру или ФИО..."
                                        size="sm"
                                   />
                              </div>

                              <div className="d-flex gap-3">
                                   <small className="text-muted">
                                        Всего: <strong>{getCardStatistics().total}</strong>
                                   </small>
                                   <small className="text-success">
                                        В работе: <strong>{getCardStatistics().inWork}</strong>
                                   </small>
                                   <small className="text-warning">
                                        Не в работе: <strong>{getCardStatistics().notInWork}</strong>
                                   </small>
                                   <small className="text-info">
                                        Отображается: <strong>{sortedItems().length}</strong>
                                   </small>
                              </div>
                         </div>
                    </Card.Header>

                    <Card.Body
                         style={{
                              padding: 0,
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              overflow: 'hidden',
                         }}
                    >
                         <div className={styles.tableContainerGrid}>
                              <Table striped bordered hover className={styles.table}>
                                   <thead className="table-light">
                                        <tr className="table-primary">
                                             <th style={{ width: '20px' }} className="border-end"></th>

                                             <th
                                                  onClick={() => requestSort('ser_num')}
                                                  style={{ cursor: 'pointer', width: '50px' }}
                                                  className=" align-middle border-end"
                                             >
                                                  S/N {getSortIcon('ser_num')}
                                             </th>
                                             <th
                                                  onClick={() => requestSort('type')}
                                                  style={{ cursor: 'pointer', width: '50px' }}
                                                  className=" align-middle border-end"
                                             >
                                                  Тип {getSortIcon('type')}
                                             </th>
                                             <th
                                                  onClick={() => requestSort('description')}
                                                  style={{ cursor: 'pointer', width: '100px' }}
                                                  className=" align-middle border-end"
                                             >
                                                  Описание {getSortIcon('description')}
                                             </th>
                                             <th
                                                  onClick={() => requestSort('fio')}
                                                  style={{ cursor: 'pointer', width: '130px' }}
                                                  className=" align-middle border-end"
                                             >
                                                  ФИО {getSortIcon('fio')}
                                             </th>
                                             <th
                                                  onClick={() => requestSort('department')}
                                                  style={{ cursor: 'pointer', width: '280px' }}
                                                  className=" align-middle border-end"
                                             >
                                                  Служба {getSortIcon('department')}
                                             </th>
                                             <th
                                                  onClick={() => requestSort('data_prov')}
                                                  style={{ cursor: 'pointer', width: '60px' }}
                                                  className=" align-middle border-end"
                                             >
                                                  Дата проверки {getSortIcon('data_prov')}
                                             </th>
                                             <th
                                                  style={{ width: '60px' }}
                                                  className="text-center align-middle border-end"
                                             >
                                                  Дата следующей проверки
                                             </th>
                                             <th
                                                  onClick={() => requestSort('log')}
                                                  style={{ cursor: 'pointer', width: '50px' }}
                                                  className=" align-middle"
                                             >
                                                  В работе {getSortIcon('log')}
                                             </th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {sortedItems().map((card) => {
                                             const cellColorClass = getCellColorClass(card)
                                             const rowColorClass = getRowColorClass(card)
                                             return (
                                                  <tr key={card.id} className={rowColorClass}>
                                                       <td>
                                                            <input
                                                                 className="form-check-input"
                                                                 type="checkbox"
                                                                 checked={selectedIds.includes(card.id)}
                                                                 onChange={() => handleCheckboxChange(card.id)}
                                                            />
                                                       </td>
                                                       <td>{card.ser_num || '-'}</td>
                                                       <td>{card.type || '-'}</td>
                                                       <td>{card.description || '-'}</td>
                                                       <td>{card.fio || '-'}</td>
                                                       <td>{card.department || '-'}</td>
                                                       <td>{formatDate(card.data_prov) || '-'}</td>
                                                       <td className={cellColorClass}>
                                                            {card.data_prov
                                                                 ? formatDate(getNextCheckDate(card.data_prov))
                                                                 : '-'}
                                                       </td>
                                                       <td>{card.log || '-'}</td>
                                                  </tr>
                                             )
                                        })}
                                   </tbody>
                              </Table>
                         </div>
                    </Card.Body>
               </Card>

               {/* Модальное окно для редактирования/создания */}
               <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                         <Modal.Title>
                              {currentCard ? 'Редактирование карты доступа' : 'Добавление новой карты доступа'}
                         </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                         <Modal.Body>
                              <div className="row">
                                   <div className="col-md-6">
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
                                             <Form.Label>Тип</Form.Label>
                                             <Form.Control
                                                  as="select"
                                                  name="type"
                                                  value={formData.type}
                                                  onChange={handleInputChange}
                                             >
                                                  <option value=""></option>
                                                  <option value="eToken PRO">eToken PRO</option>
                                                  <option value="JaCarta PRO">JaCarta PRO</option>
                                             </Form.Control>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                             <Form.Label>Описание</Form.Label>
                                             <Form.Control
                                                  as="select"
                                                  name="description"
                                                  value={formData.description}
                                                  onChange={handleInputChange}
                                             >
                                                  <option value=""></option>
                                                  <option value="Шаблон SEVZ">Шаблон SEVZ</option>
                                                  <option value="Шаблон CNTR">Шаблон CNTR</option>
                                                  <option value="ЭЦП">ЭЦП</option>
                                                  <option value="ЭЦП ФЛ">ЭЦП ФЛ</option>
                                                  <option value="ЭЦП ФЛ Контур">ЭЦП ФЛ "Контур"</option>
                                                  <option value="ЭЦП ФЛ Directum RX">ЭЦП ФЛ "Directum RX"</option>
                                                  <option value="ЭЦП ФЛ Резерв">ЭЦП ФЛ "Резерв"</option>
                                                  <option value="ЭЦП ФЛ ГПБ">ЭЦП ФЛ "ГПБ"</option>
                                             </Form.Control>
                                        </Form.Group>
                                   </div>

                                   <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                             <div className="d-flex justify-content-between align-items-center mb-2">
                                                  <Form.Label className="mb-0">ФИО</Form.Label>
                                                  <Button
                                                       variant="outline-secondary"
                                                       size="sm"
                                                       onClick={() => {
                                                            setFormData((prev) => ({
                                                                 ...prev,
                                                                 fio: '',
                                                                 department: '',
                                                            }))
                                                       }}
                                                       disabled={!formData.fio && !formData.department}
                                                       title="Очистить ФИО и службу"
                                                  >
                                                       Очистить
                                                  </Button>
                                             </div>
                                             <Form.Control
                                                  type="text"
                                                  name="fio"
                                                  value={formData.fio}
                                                  onChange={handleInputChange}
                                                  list="fio-suggestions"
                                                  placeholder="Начните вводить ФИО..."
                                             />
                                             <datalist id="fio-suggestions">
                                                  {getFioSuggestions().map((fio, index) => (
                                                       <option key={index} value={fio} />
                                                  ))}
                                             </datalist>
                                             <Form.Text className="text-muted">
                                                  Начните вводить ФИО для поиска, при выборе автоматически заполнятся
                                                  служба
                                             </Form.Text>
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

               {/* Модальное окно для подтверждения удаления */}
               <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                    <Modal.Header closeButton>
                         <Modal.Title>Подтверждение удаления</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                         {selectedIds.length === 1 ? (
                              <>
                                   <p>Вы действительно хотите удалить выбранную запись?</p>
                                   {getSelectedCardsInfo().map((card) => (
                                        <div key={card.id} className="mb-2 p-2 border rounded">
                                             <strong>Серийный номер:</strong> {card.ser_num || '-'}
                                             <br />
                                             <strong>ФИО:</strong> {card.fio || '-'}
                                             <br />
                                             <strong>Тип:</strong> {card.type || '-'}
                                        </div>
                                   ))}
                              </>
                         ) : (
                              <>
                                   <p>Вы действительно хотите удалить выбранные записи ({selectedIds.length} шт.)?</p>
                                   <ul className="list-unstyled">
                                        {getSelectedCardsInfo()
                                             .slice(0, 5)
                                             .map((card) => (
                                                  <li key={card.id} className="mb-1">
                                                       • {card.ser_num || 'Без номера'} - {card.fio || 'Без ФИО'}
                                                  </li>
                                             ))}
                                        {selectedIds.length > 5 && <li>... и еще {selectedIds.length - 5} записей</li>}
                                   </ul>
                              </>
                         )}
                         <Alert variant="warning" className="mt-3">
                              <strong>Внимание!</strong> Это действие нельзя отменить.
                         </Alert>
                    </Modal.Body>
                    <Modal.Footer>
                         <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                              Отмена
                         </Button>
                         <Button variant="danger" onClick={confirmDelete}>
                              Удалить
                         </Button>
                    </Modal.Footer>
               </Modal>
          </Container>
     )
})

export default CardUch
