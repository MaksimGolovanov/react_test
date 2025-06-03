import React, { useState, useRef } from 'react'
import { Card, Row, Col, Image, ListGroup, Badge, Button, Form, Modal } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { FaPhone, FaEnvelope, FaIdBadge, FaBuilding, FaUserTie, FaCamera } from 'react-icons/fa'
import { MdEmail, MdPhone, MdWork } from 'react-icons/md'
import styles from './style.module.css'
import StaffService from '../services/StaffService'
import ButtonAll from '../../ius-pt/components/ButtonAll/ButtonAll'
import { useNavigate } from 'react-router-dom' // Импорт useNavigate
import { IoArrowBack } from 'react-icons/io5'
const API_URL = process.env.REACT_APP_API_URL

function StaffUser() {
     const location = useLocation()
     const staffMember = location.state?.staffMember
     const [selectedFile, setSelectedFile] = useState(null)
     const [previewImage, setPreviewImage] = useState(null)
     const [showModal, setShowModal] = useState(false)
     const fileInputRef = useRef(null)
     const navigate = useNavigate()
     if (!staffMember) {
          return <div className="text-center py-5">Данные сотрудника не найдены</div>
     }

     const handleFileChange = (e) => {
          const file = e.target.files[0]
          if (!file) return

          // Validate file type
          if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
               alert('Please select a JPEG or PNG image')
               return
          }

          // Validate file size
          if (file.size > 5 * 1024 * 1024) {
               alert('File is too large. Maximum size is 5MB')
               return
          }

          setSelectedFile(file)
          const reader = new FileReader()
          reader.onloadend = () => {
               setPreviewImage(reader.result)
          }
          reader.readAsDataURL(file)
     }

     // StaffUser.js
     const handleUploadPhoto = async () => {
          if (!selectedFile) {
               alert('Выберите файл для загрузки')
               return
          }

          try {
               // Валидация файла перед отправкой
               if (!selectedFile.type.match(/image\/(jpeg|png|jpg)/)) {
                    throw new Error('Допустимы только JPG/JPEG и PNG изображения')
               }

               if (selectedFile.size > 5 * 1024 * 1024) {
                    throw new Error('Файл слишком большой. Максимальный размер - 5MB')
               }

               const response = await StaffService.uploadPhoto(staffMember.tabNumber, selectedFile)

               // Принудительно обновляем изображение, добавляя параметр запроса с timestamp
               const newImageUrl = `${API_URL}static/photo/${staffMember.tabNumber}.jpg?t=${Date.now()}`

               // Обновляем превью
               setPreviewImage(newImageUrl)

               // Сбрасываем состояние
               setSelectedFile(null)
               setShowModal(false)

               // Очищаем input file
               if (fileInputRef.current) {
                    fileInputRef.current.value = ''
               }

               alert('Фото успешно обновлено!')
          } catch (error) {
               console.error('Ошибка загрузки фото:', error)
               let errorMessage = 'Ошибка при загрузке фото'
               if (error.message.includes('Network Error')) {
                    errorMessage = 'Проблемы с соединением. Проверьте интернет'
               } else if (error.response?.status === 413) {
                    errorMessage = 'Файл слишком большой'
               } else if (error.message) {
                    errorMessage = error.message
               }
               alert(errorMessage)
          }
     }

     const handleCloseModal = () => {
          setShowModal(false)
          setSelectedFile(null)
          setPreviewImage(null)
          // Clear the file input
          if (document.getElementById('formFile')) {
               document.getElementById('formFile').value = ''
          }
     }

     return (
          <div className={styles.staffUserContainer}>
               <ButtonAll icon={IoArrowBack} text="Назад" onClick={() => navigate('/staff')} />
               <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                         <Card className={styles.userCard}>
                              <Card.Body>
                                   <Row>
                                        {/* Аватар */}
                                        <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                                             <div className={styles.avatarWrapper}>
                                                  <Badge
                                                       pill
                                                       bg="light"
                                                       className={styles.editPhotoBadge}
                                                       onClick={() => setShowModal(true)}
                                                       style={{ cursor: 'pointer' }}
                                                  >
                                                       <FaCamera className={styles.cameraIcon} />
                                                  </Badge>
                                                  <Image
                                                       src={
                                                            previewImage ||
                                                            `${API_URL}static/photo/${
                                                                 staffMember.tabNumber
                                                            }.jpg?t=${new Date().getTime()}`
                                                       }
                                                       className={styles.userImg}
                                                       roundedCircle
                                                       thumbnail
                                                       onError={(e) => {
                                                            e.target.src = `${API_URL}static/photo/no.jpg`
                                                       }}
                                                  />
                                             </div>
                                             <h4 className="mt-3">{staffMember.fio}</h4>
                                             <p className="text-muted">{staffMember.post}</p>
                                        </Col>

                                        {/* Информация */}
                                        <Col xs={12} md={8}>
                                             <ListGroup variant="flush">
                                                  <ListGroup.Item className="d-flex align-items-center">
                                                       <FaIdBadge className="me-3 text-primary" />
                                                       <div>
                                                            <small className="text-muted">Табельный номер</small>
                                                            <h6 className="mb-0">{staffMember.tabNumber}</h6>
                                                       </div>
                                                  </ListGroup.Item>

                                                  <ListGroup.Item className="d-flex align-items-center">
                                                       <FaBuilding className="me-3 text-primary" />
                                                       <div>
                                                            <small className="text-muted">Подразделение</small>
                                                            <h6 className="mb-0">{staffMember.department}</h6>
                                                       </div>
                                                  </ListGroup.Item>

                                                  <ListGroup.Item className="d-flex align-items-center">
                                                       <MdWork className="me-3 text-primary" />
                                                       <div>
                                                            <small className="text-muted">Должность</small>
                                                            <h6 className="mb-0">{staffMember.post}</h6>
                                                       </div>
                                                  </ListGroup.Item>

                                                  {staffMember.telephone && (
                                                       <ListGroup.Item className="d-flex align-items-center">
                                                            <MdPhone className="me-3 text-primary" />
                                                            <div>
                                                                 <small className="text-muted">Телефон</small>
                                                                 <h6 className="mb-0">
                                                                      <a href={`tel:${staffMember.telephone}`}>
                                                                           {staffMember.telephone}
                                                                      </a>
                                                                 </h6>
                                                            </div>
                                                       </ListGroup.Item>
                                                  )}

                                                  {staffMember.email && (
                                                       <ListGroup.Item className="d-flex align-items-center">
                                                            <MdEmail className="me-3 text-primary" />
                                                            <div>
                                                                 <small className="text-muted">Email</small>
                                                                 <h6 className="mb-0">
                                                                      <a href={`mailto:${staffMember.email}`}>
                                                                           {staffMember.email}
                                                                      </a>
                                                                 </h6>
                                                            </div>
                                                       </ListGroup.Item>
                                                  )}

                                                  {staffMember.ip && staffMember.ip !== '-' && (
                                                       <ListGroup.Item className="d-flex align-items-center">
                                                            <FaUserTie className="me-3 text-primary" />
                                                            <div>
                                                                 <small className="text-muted">IP адрес</small>
                                                                 <h6 className="mb-0">{staffMember.ip}</h6>
                                                            </div>
                                                       </ListGroup.Item>
                                                  )}
                                             </ListGroup>
                                        </Col>
                                   </Row>
                              </Card.Body>
                         </Card>
                    </Col>
               </Row>

               {/* Модальное окно для загрузки фото */}
               <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                         <Modal.Title>Изменение фотографии</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                         <Form.Group controlId="formFile" className="mb-3">
                              <Form.Label>Выберите новое фото</Form.Label>
                              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                         </Form.Group>

                         {previewImage && (
                              <div className="text-center mt-3">
                                   <h6>Предпросмотр:</h6>
                                   <Image src={previewImage} thumbnail style={{ maxWidth: '320px' }} />
                              </div>
                         )}
                    </Modal.Body>
                    <Modal.Footer>
                         <Button variant="secondary" onClick={handleCloseModal}>
                              Отмена
                         </Button>
                         <Button variant="primary" onClick={handleUploadPhoto} disabled={!selectedFile}>
                              Сохранить фото
                         </Button>
                    </Modal.Footer>
               </Modal>
          </div>
     )
}

export default StaffUser
