import React, { useState, useMemo } from 'react'
import IpStore from '../store/IpStore'
import { observer } from 'mobx-react-lite'
import SearchInput from '../../../Components/SearchInput/SearchInput'
import ButtonAll from '../../../Components/ButtonAll/ButtonAll'
import { IoCreateOutline } from 'react-icons/io5'
import { RiFileEditLine } from 'react-icons/ri'
import { Container, Table, Card, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap'

import styles from './style.module.css'

const ipToNumber = (ip) => {
     if (!ip) return 0
     return ip.split('.').reduce((acc, octet, index) => {
          return acc + parseInt(octet, 10) * Math.pow(256, 3 - index)
     }, 0)
}

// Список типов устройств
const DEVICE_TYPES = ['Компьютер', 'Сервер', 'Принтер', 'Коммутатор', 'Маршрутизатор', 'Другое']
const SWITCH_TYPES = [
     'swks3-core',
     'swks3-srv',
     'swks3-agg',
     'swks3-agg2',
     'swks3-esn',
     'swks3-nsklad',
     'swks3-vpch',
     'swks3-les',
     'swks3-2u',
     'swks3-2u-rad',
     'swks3-3u-rdp',
     'swks3-4u',
     'swks3-tvs',
     'swks3-csklad',
     'swks3-seb',
     'swks3-a2',
     'swks3-a3',
     'swks3-a4',
     'swks3-disp-new',
     'swks3-5u-peb',
     'Другое',
]

const IpAddress = observer(() => {
     const [searchTerm, setSearchTerm] = useState('')
     const [sortConfig, setSortConfig] = useState({
          key: 'ip',
          direction: 'ascending',
     })
     const [showModal, setShowModal] = useState(false)
     const [currentIp, setCurrentIp] = useState(null)
     const [formData, setFormData] = useState({
          ip: '',
          subnet_mask: '',
          device_type: '',
          switch: '',
          switch_port: '',
          network_segment: '',
          description: '',
     })

     const handleInputChange = (e) => {
          const { name, value } = e.target
          setFormData((prev) => ({
               ...prev,
               [name]: value,
          }))
     }

     const handleAddNew = () => {
          setCurrentIp(null)
          setFormData({
               ip: '',
               subnet_mask: '',
               device_type: '',
               switch: '',
               switch_port: '',
               network_segment: '',
               description: '',
          })
          setShowModal(true)
     }

     const handleEdit = (ip) => {
          setCurrentIp(ip)
          setFormData({
               ip: ip.ip,
               subnet_mask: ip.subnet_mask || '',
               device_type: ip.device_type || '',
               switch: ip.switch || '',
               switch_port: ip.switch_port || '',
               network_segment: ip.network_segment || '',
               description: ip.description || '',
          })
          setShowModal(true)
     }

     const handleSubmit = async (e) => {
          e.preventDefault()
          try {
               if (currentIp) {
                    // Редактирование существующей записи
                    await IpStore.updateIp(currentIp.id, formData)
               } else {
                    // Добавление новой записи
                    await IpStore.createIp(formData)
               }
               setShowModal(false)
          } catch (error) {
               console.error('Ошибка при сохранении:', error)
          }
     }



     const filteredIps = useMemo(() => {
          if (!IpStore.ipaddress) return []
          return IpStore.ipaddress.filter(
               (ip) =>
                    ip.ip.includes(searchTerm) ||
                    (ip.description && ip.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (ip.device_type && ip.device_type.toLowerCase().includes(searchTerm.toLowerCase()))
          )
     }, [searchTerm])

     const sortedIps = useMemo(() => {
          if (!filteredIps) return []
          let sortableItems = [...filteredIps]

          if (sortConfig.key) {
               sortableItems.sort((a, b) => {
                    if (sortConfig.key === 'ip') {
                         const aValue = ipToNumber(a.ip)
                         const bValue = ipToNumber(b.ip)
                         return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue
                    }

                    const aValue = a[sortConfig.key] || ''
                    const bValue = b[sortConfig.key] || ''

                    if (aValue < bValue) {
                         return sortConfig.direction === 'ascending' ? -1 : 1
                    }
                    if (aValue > bValue) {
                         return sortConfig.direction === 'ascending' ? 1 : -1
                    }
                    return 0
               })
          }
          return sortableItems
     }, [filteredIps, sortConfig])

     const requestSort = (key) => {
          let direction = 'ascending'
          if (sortConfig.key === key && sortConfig.direction === 'ascending') {
               direction = 'descending'
          }
          setSortConfig({ key, direction })
     }

     const getSortIcon = (key) => {
          if (sortConfig.key !== key) return null
          return sortConfig.direction === 'ascending' ? '↑' : '↓'
     }

     if (IpStore.error) {
          return (
               <Container className={styles.errorContainer}>
                    <Alert variant="danger">
                         <Alert.Heading>Ошибка загрузки данных</Alert.Heading>
                         <p>{IpStore.error.message}</p>
                    </Alert>
               </Container>
          )
     }

     if (IpStore.isLoading) {
          return (
               <Container className={styles.loadingContainer}>
                    <Spinner animation="border" role="status" />
                    <p className={styles.loadingText}>Загрузка данных об IP-адресах...</p>
               </Container>
          )
     }

     return (
          <Container className={styles.container}>
               <Card>
                    <Card.Header className={styles.header}>
                         <ButtonAll text="Добавить IP-адрес" icon={IoCreateOutline} onClick={handleAddNew} />
                         <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Поиск IP-адресов..." />
                    </Card.Header>
                    <Card.Body>
                         <div className={styles.tableContainer}>
                              <Table striped bordered hover className={styles.table}>
                                   <thead>
                                        <tr>
                                             <th onClick={() => requestSort('ip')}>
                                                  IP-адрес <span className={styles.sortIcon}>{getSortIcon('ip')}</span>
                                             </th>
                                             <th onClick={() => requestSort('subnet_mask')}>
                                                  Маска подсети{' '}
                                                  <span className={styles.sortIcon}>{getSortIcon('subnet_mask')}</span>
                                             </th>
                                             <th onClick={() => requestSort('device_type')}>
                                                  Тип устройства{' '}
                                                  <span className={styles.sortIcon}>{getSortIcon('device_type')}</span>
                                             </th>
                                             <th onClick={() => requestSort('switch')}>
                                                  Коммутатор{' '}
                                                  <span className={styles.sortIcon}>{getSortIcon('switch')}</span>
                                             </th>
                                             <th onClick={() => requestSort('switch_port')}>
                                                  Порт{' '}
                                                  <span className={styles.sortIcon}>{getSortIcon('switch_port')}</span>
                                             </th>
                                             <th onClick={() => requestSort('network_segment')}>
                                                  Сегмент сети{' '}
                                                  <span className={styles.sortIcon}>
                                                       {getSortIcon('network_segment')}
                                                  </span>
                                             </th>
                                             <th onClick={() => requestSort('description')}>
                                                  Описание{' '}
                                                  <span className={styles.sortIcon}>{getSortIcon('description')}</span>
                                             </th>
                                             <th>Действия</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {sortedIps.map((ip) => (
                                             <tr key={ip.id}>
                                                  <td className={styles.ipCell}>{ip.ip}</td>
                                                  <td>
                                                       {ip.subnet_mask || (
                                                            <span className={styles.emptyCell}>не указано</span>
                                                       )}
                                                  </td>
                                                  <td>
                                                       {ip.device_type || (
                                                            <span className={styles.emptyCell}>не указано</span>
                                                       )}
                                                  </td>
                                                  <td>
                                                       {ip.switch || (
                                                            <span className={styles.emptyCell}>не указано</span>
                                                       )}
                                                  </td>
                                                  <td>
                                                       {ip.switch_port || (
                                                            <span className={styles.emptyCell}>не указано</span>
                                                       )}
                                                  </td>
                                                  <td>
                                                       {ip.network_segment || (
                                                            <span className={styles.emptyCell}>не указано</span>
                                                       )}
                                                  </td>
                                                  <td>
                                                       {ip.description || (
                                                            <span className={styles.emptyCell}>нет описания</span>
                                                       )}
                                                  </td>
                                                  <td>
                                                       <ButtonAll
                                                            text="Изменить"
                                                            icon={RiFileEditLine}
                                                            onClick={() => handleEdit(ip)}
                                                            margin="0px"
                                                       />
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </Table>
                         </div>
                    </Card.Body>
               </Card>

               {/* Модальное окно для добавления/редактирования */}
               <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                         <Modal.Title>
                              {currentIp ? 'Редактирование IP-адреса' : 'Добавление нового IP-адреса'}
                         </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                         <Modal.Body>
                              <Form.Group className="mb-3">
                                   <Form.Label>IP-адрес</Form.Label>
                                   <Form.Control
                                        type="text"
                                        name="ip"
                                        value={formData.ip}
                                        onChange={handleInputChange}
                                        required
                                   />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                   <Form.Label>Маска подсети</Form.Label>
                                   <Form.Control
                                        type="text"
                                        name="subnet_mask"
                                        value={formData.subnet_mask}
                                        onChange={handleInputChange}
                                   />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                   <Form.Label>Тип устройства</Form.Label>
                                   <Form.Select
                                        name="device_type"
                                        value={formData.device_type}
                                        onChange={handleInputChange}
                                   >
                                        <option value="">Выберите тип устройства</option>
                                        {DEVICE_TYPES.map((type) => (
                                             <option key={type} value={type}>
                                                  {type}
                                             </option>
                                        ))}
                                   </Form.Select>
                              </Form.Group>
                              <Form.Group className="mb-3">
                                   <Form.Label>Коммутатор</Form.Label>
                                   <Form.Select name="switch" value={formData.switch} onChange={handleInputChange}>
                                        <option value="">Выберите коммутатор</option>
                                        {SWITCH_TYPES.map((type) => (
                                             <option key={type} value={type}>
                                                  {type}
                                             </option>
                                        ))}
                                   </Form.Select>
                              </Form.Group>
                              <Form.Group className="mb-3">
                                   <Form.Label>Порт</Form.Label>
                                   <Form.Control
                                        type="text"
                                        name="switch_port"
                                        value={formData.switch_port}
                                        onChange={handleInputChange}
                                   />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                   <Form.Label>Сегмент сети</Form.Label>
                                   <Form.Control
                                        type="text"
                                        name="network_segment"
                                        value={formData.network_segment}
                                        onChange={handleInputChange}
                                   />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                   <Form.Label>Описание</Form.Label>
                                   <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                   />
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

export default IpAddress
