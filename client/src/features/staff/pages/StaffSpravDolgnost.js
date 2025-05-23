import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Table, Alert } from 'react-bootstrap'
import StaffService from '../services/StaffService'
import styles from './style.module.css'

function StaffSpravDolgnost() {
     const [Dolgnost, setDolgnost] = useState([])
     const [showModal, setShowModal] = useState(false)
     const [currentdolgnost, setCurrentdolgnost] = useState(null)
     const [formData, setFormData] = useState({
          dolgn: '',
          dolgn_s: '',
     })
     const [error, setError] = useState(null)
     const [success, setSuccess] = useState(null)
     const [isLoading, setIsLoading] = useState(false)
     const [sortConfig, setSortConfig] = useState({
          key: null,
          direction: 'asc',
     })

     useEffect(() => {
          loadDolgnost()
     }, [])

     const sortedDolgnost = React.useMemo(() => {
          const sortableItems = [...Dolgnost]
          if (sortConfig.key) {
               sortableItems.sort((a, b) => {
                    const aValue = a[sortConfig.key].toLowerCase()
                    const bValue = b[sortConfig.key].toLowerCase()

                    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
                    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
                    return 0
               })
          }
          return sortableItems
     }, [Dolgnost, sortConfig])

     const handleSort = (key) => {
          let direction = 'asc'
          if (sortConfig.key === key && sortConfig.direction === 'asc') {
               direction = 'desc'
          }
          setSortConfig({ key, direction })
     }

     const getSortIndicator = (key) => {
          if (sortConfig.key === key) {
               return sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
          }
          return ''
     }

     const loadDolgnost = async () => {
          setIsLoading(true)
          try {
               const data = await StaffService.fetchAllDolgnost()
               setDolgnost(data)
               setError(null)
          } catch (err) {
               setError('Ошибка при загрузке данных отделов')
               console.error(err)
          } finally {
               setIsLoading(false)
          }
     }

     const handleInputChange = (e) => {
          const { name, value } = e.target
          setFormData((prev) => ({
               ...prev,
               [name]: value,
          }))
     }

     const handleCreate = () => {
          setCurrentdolgnost(null)
          setFormData({
               dolgn: '',
               dolgn_s: '',
          })
          setShowModal(true)
     }

     const handleEdit = (dolgnost) => {
          setCurrentdolgnost(dolgnost)
          setFormData({
               dolgn: dolgnost.dolgn,
               dolgn_s: dolgnost.dolgn_s,
          })
          setShowModal(true)
     }

     const handleSubmit = async (e) => {
          e.preventDefault()
          setIsLoading(true)
          try {
               if (currentdolgnost) {
                    await StaffService.updateDolgnost(currentdolgnost.id, formData)
               } else {
                    await StaffService.createDolgnost(formData)
               }
               setShowModal(false)
               loadDolgnost()
          } catch (err) {
               setError('Ошибка при сохранении данных')
               console.error(err)
          } finally {
               setIsLoading(false)
          }
     }

     const handleDelete = async (id) => {
          if (window.confirm('Вы уверены, что хотите удалить этот отдел?')) {
               setIsLoading(true)
               try {
                    await StaffService.deleteDolgnost(id)

                    loadDolgnost()
               } catch (err) {
                    console.error(err)
               } finally {
                    setIsLoading(false)
               }
          }
     }

     return (
          <div className={styles.container}>
               <h2>Справочник должностей</h2>
               {error && <Alert variant="danger">{error}</Alert>}
               {success && (
                    <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                         {success}
                    </Alert>
               )}

               <Button variant="primary" onClick={handleCreate} className="mb-3" disabled={isLoading}>
                    {isLoading ? 'Загрузка...' : 'Добавить должность'}
               </Button>

               {isLoading ? (
                    <div>Загрузка данных...</div>
               ) : (
                    <div className={styles.tableWrapper}>
                         <Table striped bordered hover className={styles.stickyTable}>
                              <thead>
                                   <tr>
                                        <th onClick={() => handleSort('dolgn')} className={styles.sortableHeader}>
                                             Название{getSortIndicator('dolgn')}
                                        </th>
                                        <th onClick={() => handleSort('dolgn_s')} className={styles.sortableHeader}>
                                             Короткое название{getSortIndicator('dolgn_s')}
                                        </th>

                                        <th>Действия</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {sortedDolgnost.map((dolgnost) => (
                                        <tr key={dolgnost.id}>
                                             <td>{dolgnost.dolgn}</td>
                                             <td>{dolgnost.dolgn_s}</td>

                                             <td>
                                                  <Button
                                                       variant="warning"
                                                       size="sm"
                                                       onClick={() => handleEdit(dolgnost)}
                                                       className="me-2"
                                                       disabled={isLoading}
                                                  >
                                                       Изменить
                                                  </Button>
                                                  <Button
                                                       variant="danger"
                                                       size="sm"
                                                       onClick={() => handleDelete(dolgnost.id)}
                                                       disabled={isLoading}
                                                  >
                                                       Удалить
                                                  </Button>
                                             </td>
                                        </tr>
                                   ))}
                              </tbody>
                         </Table>
                    </div>
               )}

               <Modal show={showModal} onHide={() => !isLoading && setShowModal(false)}>
                    <Modal.Header closeButton>
                         <Modal.Title>{currentdolgnost ? 'Редактирование отдела' : 'Новый отдел'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                         <Form onSubmit={handleSubmit}>
                              <Form.Group className="mb-3">
                                   <Form.Label>Название</Form.Label>
                                   <Form.Control
                                        type="text"
                                        name="dolgn"
                                        value={formData.dolgn}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isLoading}
                                   />
                              </Form.Group>

                              <Form.Group className="mb-3">
                                   <Form.Label>Короткое название</Form.Label>
                                   <Form.Control
                                        type="text"
                                        name="dolgn_s"
                                        value={formData.dolgn_s}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isLoading}
                                   />
                              </Form.Group>

                              <div className="d-flex justify-content-end">
                                   <Button
                                        variant="secondary"
                                        onClick={() => setShowModal(false)}
                                        className="me-2"
                                        disabled={isLoading}
                                   >
                                        Отмена
                                   </Button>
                                   <Button variant="primary" type="submit" disabled={isLoading}>
                                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                                   </Button>
                              </div>
                         </Form>
                    </Modal.Body>
               </Modal>
          </div>
     )
}

export default StaffSpravDolgnost
