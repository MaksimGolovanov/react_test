import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Table } from 'react-bootstrap'
import StaffService from '../services/StaffService'
import styles from './style.module.css'
import ButtonAll from '../../ius-pt/components/ButtonAll/ButtonAll'
import IconBtn from '../../../Components/IconBtn/IconBtn'
import { IoCreateOutline } from 'react-icons/io5'
import { MdDeleteForever } from 'react-icons/md'

function StaffSpravDolgnost() {
     const [Dolgnost, setDolgnost] = useState([])
     const [showModal, setShowModal] = useState(false)
     const [currentdolgnost, setCurrentdolgnost] = useState(null)
     const [formData, setFormData] = useState({
          dolgn: '',
          dolgn_s: '',
     })
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
          } catch (err) {
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
               
                    <ButtonAll text="Добавить должность" icon={IoCreateOutline} onClick={() => handleCreate()} />
               

               <div className={styles.tableContainer}>
                    {isLoading ? (
                         <div className={styles.loadingContainer}>
                              <div>Загрузка данных...</div>
                         </div>
                    ) : (
                         <div className={styles.tableWrapper}>
                              <Table striped bordered hover className={styles.stickyTable}>
                                   <thead>
                                        <tr>
                                             <th onClick={() => handleSort('dolgn')} className={styles.sortableHeader}>
                                                  Название{getSortIndicator('dolgn')}
                                             </th>
                                             <th
                                                  onClick={() => handleSort('dolgn_s')}
                                                  className={styles.sortableHeader}
                                             >
                                                  Короткое название{getSortIndicator('dolgn_s')}
                                             </th>
                                             <th className={styles.sortableHeader}>Действия</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {sortedDolgnost.map((dolgnost) => (
                                             <tr key={dolgnost.id}>
                                                  <td>{dolgnost.dolgn}</td>
                                                  <td>{dolgnost.dolgn_s}</td>
                                                  <td className="d-flex">
                                                       <IconBtn
                                                            icon={IoCreateOutline}
                                                            onClick={() => handleEdit(dolgnost)}
                                                       />
                                                       <IconBtn
                                                            icon={MdDeleteForever}
                                                            onClick={() => handleDelete(dolgnost.id)}
                                                       />
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </Table>
                         </div>
                    )}
               </div>

               <Modal show={showModal} onHide={() => !isLoading && setShowModal(false)}>
                    <Modal.Header closeButton>
                         <Modal.Title>{currentdolgnost ? 'Редактирование должности' : 'Новая должность'}</Modal.Title>
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
