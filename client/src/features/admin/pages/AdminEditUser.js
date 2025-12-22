import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import userStore from '../store/UserStore'
import { useObserver } from 'mobx-react-lite'
import { Form, Button, Card, Row, Col, Alert, Modal } from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'

const modalStyles = {
     modal: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
     },
     dialog: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          margin: '0',
     },
     content: {
          position: 'relative',
          width: '400px', // или другая желаемая ширина
          margin: 'auto',
     },
}

const AdminEditUser = () => {
     const { id } = useParams()
     const navigate = useNavigate()

     const [formData, setFormData] = useState({
          login: '',
          description: '',
          password: '',
          tabNumber: '',
          roles: [],
     })

     const [error, setError] = useState('')
     const [showDeleteModal, setShowDeleteModal] = useState(false)

     useEffect(() => {
          userStore.fetchUsers()
     }, [])

     useEffect(() => {
          const user = userStore.userRoles.find((u) => u.id === parseInt(id))
          if (user) {
               setFormData({
                    login: user.login,
                    description: user.description || '',
                    password: '',
                    roles: user.roles.map((role) => role.role),
                    tabNumber: user.tabNumber || '',
               })
          }
     }, [id])

     const handleInputChange = (e) => {
          const { name, value } = e.target
          setFormData((prev) => ({
               ...prev,
               [name]: value,
          }))
     }

     const handleRoleChange = (role) => {
          setFormData((prev) => {
               const newRoles = prev.roles.includes(role) ? prev.roles.filter((r) => r !== role) : [...prev.roles, role]
               return {
                    ...prev,
                    roles: newRoles,
               }
          })
     }

     const handleSubmit = async (e) => {
          e.preventDefault()
          const selectedRoleIds = userStore.roles
               .filter((role) => formData.roles.includes(role.role))
               .map((role) => role.id)

          const success = await userStore.updateUser(id, {
               login: formData.login,
               password: formData.password,
               description: formData.description,
               tabNumber: formData.tabNumber,
               roles: selectedRoleIds,
          })

          if (success) {
               navigate('/admin')
          }
     }

     const handleDelete = async () => {
          try {
               await userStore.deleteUser(id)
               setShowDeleteModal(false)
               navigate('/admin')
          } catch (err) {
               setError('Ошибка при удалении пользователя')
          }
     }

     return useObserver(() => (
          <div className="d-flex justify-content-start">
               <Card style={{ width: '600px', padding: '20px', margin: '20px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                         <Card.Title>Редактирование пользователя</Card.Title>
                         <Button
                              variant="danger"
                              onClick={() => setShowDeleteModal(true)}
                              className="d-flex align-items-center gap-2"
                         >
                              <FaTrash /> Удалить
                         </Button>
                    </div>

                    {error && (
                         <Alert variant="danger" className="mb-3">
                              {error}
                         </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                         <Row>
                              <Col md={6}>
                                   <Form.Group className="mb-3">
                                        <Form.Label>Логин</Form.Label>
                                        <Form.Control
                                             type="text"
                                             name="login"
                                             value={formData.login}
                                             onChange={handleInputChange}
                                        />
                                   </Form.Group>
                              </Col>

                              <Col md={6}>
                                   <Form.Group className="mb-3">
                                        <Form.Label>Новый пароль</Form.Label>
                                        <Form.Control
                                             type="password"
                                             name="password"
                                             value={formData.password}
                                             onChange={handleInputChange}
                                             placeholder="Оставьте пустым, если не меняете"
                                             autoComplete="new-password"
                                        />
                                   </Form.Group>
                              </Col>
                         </Row>

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
                         <Form.Group className="mb-3">
                              <Form.Label>Таб №</Form.Label>
                              <Form.Control
                                   type="text"
                                   name="tabNumber"
                                   value={formData.tabNumber}
                                   onChange={handleInputChange}
                              />
                         </Form.Group>

                         <Form.Group className="mb-3">
                              <Form.Label>Роли</Form.Label>
                              <div className="d-flex flex-wrap gap-2">
                                   {userStore.roles.map((role) => (
                                        <Form.Check
                                             key={role.id}
                                             type="checkbox"
                                             label={role.role}
                                             checked={formData.roles.includes(role.role)}
                                             onChange={() => handleRoleChange(role.role)}
                                             className="me-3"
                                        />
                                   ))}
                              </div>
                         </Form.Group>

                         <div className="d-flex justify-content-end gap-2">
                              <Button variant="secondary" onClick={() => navigate('/admin')}>
                                   Отмена
                              </Button>
                              <Button variant="primary" type="submit">
                                   Сохранить
                              </Button>
                         </div>
                    </Form>
               </Card>

               {/* Модальное окно подтверждения удаления */}
               <Modal
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    backdrop="static"
                    centered
                    contentClassName="shadow"
                    style={modalStyles.modal}
                    dialogClassName="modal-90w"
               >
                    <Modal.Header closeButton>
                         <Modal.Title>Подтверждение удаления</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Вы действительно хотите удалить пользователя "{formData.login}"?</Modal.Body>
                    <Modal.Footer>
                         <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                              Отмена
                         </Button>
                         <Button variant="danger" onClick={handleDelete}>
                              Удалить
                         </Button>
                    </Modal.Footer>
               </Modal>
          </div>
     ))
}

export default AdminEditUser
