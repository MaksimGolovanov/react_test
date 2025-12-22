import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Button, Row, Col } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'
import StaffService from '../services/StaffService'

export default function StaffEditModal({ isOpen, onRequestClose, fetchData, selectedData }) {
     const [form] = Form.useForm()
     const [loading, setLoading] = useState(false)

     useEffect(() => {
          if (selectedData && isOpen) {
               form.setFieldsValue({
                    fio: selectedData.fio || '',
                    login: selectedData.login || '',
                    post: selectedData.post || '',
                    department: selectedData.department || '',
                    telephone: selectedData.telephone || '',
                    email: selectedData.email || '',
                    ip: selectedData.ip || '',
                    tabNumber: selectedData.tabNumber || '',
               })
          }
     }, [selectedData, isOpen, form])

     const handleSave = async (values) => {
          setLoading(true)
          try {
               // Добавляем поле del, если оно есть в исходных данных
               const dataToUpdate = {
                    ...values,
                    del: selectedData?.del || 0, // Сохраняем исходное значение или 0
               }

               await StaffService.updateStaff(dataToUpdate)
               onRequestClose()
               fetchData()
               
          } catch (error) {
               console.error('Ошибка при изменении пользователя:', error)
               
          } finally {
               setLoading(false)
          }
     }

     const handleClose = () => {
          form.resetFields()
          onRequestClose()
     }

     return (
          <Modal
               open={isOpen}
               onCancel={handleClose}
               footer={null}
               centered
               width={600}
               closable={false}
               className="staff-edit-modal"
               destroyOnClose
          >
               {/* Заголовок */}
               <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                    <h6 className="mb-0 fw-semibold">Редактирование сотрудника</h6>
                    <Button
                         type="text"
                         onClick={handleClose}
                         icon={<CloseOutlined className="text-muted" />}
                         size="small"
                         className="p-0"
                         style={{ minWidth: '24px' }}
                    />
               </div>

               {/* Форма */}
               <Form form={form} layout="vertical" onFinish={handleSave} size="small" requiredMark="optional">
                    <Row gutter={[12, 8]}>
                         {/* ФИО */}
                         <Col span={24}>
                              <Form.Item
                                   name="fio"
                                   label="ФИО"
                                   rules={[{ required: true, message: 'Введите ФИО сотрудника' }]}
                              >
                                   <Input placeholder="Иванов Иван Иванович" size="small" />
                              </Form.Item>
                         </Col>

                         {/* Логин и Табельный номер */}
                         <Col span={12}>
                              <Form.Item
                                   name="login"
                                   label="Логин"
                                   rules={[{ required: true, message: 'Введите логин' }]}
                              >
                                   <Input placeholder="i.ivanov" size="small" />
                              </Form.Item>
                         </Col>

                         <Col span={12}>
                              <Form.Item
                                   name="tabNumber"
                                   label="Табельный номер"
                                   rules={[
                                        { required: true, message: 'Введите табельный номер' },
                                        { pattern: /^[0-9]+$/, message: 'Только цифры' },
                                   ]}
                              >
                                   <Input placeholder="001234" size="small" />
                              </Form.Item>
                         </Col>

                         {/* Должность и Подразделение */}
                         <Col span={12}>
                              <Form.Item
                                   name="post"
                                   label="Должность"
                                   rules={[{ required: true, message: 'Введите должность' }]}
                              >
                                   <Input placeholder="Специалист" size="small" />
                              </Form.Item>
                         </Col>

                         <Col span={12}>
                              <Form.Item
                                   name="department"
                                   label="Подразделение"
                                   rules={[{ required: true, message: 'Введите подразделение' }]}
                              >
                                   <Input placeholder="Отдел ИТ" size="small" />
                              </Form.Item>
                         </Col>

                         {/* Телефон и Email */}
                         <Col span={12}>
                              <Form.Item name="telephone" label="Телефон">
                                   <Input placeholder="6-31-00" size="small" />
                              </Form.Item>
                         </Col>

                         <Col span={12}>
                              <Form.Item
                                   name="email"
                                   label="Email"
                                   rules={[{ type: 'email', message: 'Введите корректный email' }]}
                              >
                                   <Input placeholder="email@sgp.gazprom.ru" size="small" />
                              </Form.Item>
                         </Col>

                         {/* IP адрес */}
                         <Col span={24}>
                              <Form.Item name="ip" label="IP адрес">
                                   <Input placeholder="10.32.10.100" size="small" />
                              </Form.Item>
                         </Col>
                    </Row>

                    {/* Футер с кнопками */}
                    <div className="d-flex align-items-center justify-content-between mt-4 pt-3 border-top">
                         <div className="text-muted small">
                              <span className="text-danger me-1">*</span> Обязательные поля
                         </div>
                         <div className="d-flex gap-2">
                              <Button onClick={handleClose} size="small" className="px-3">
                                   Отмена
                              </Button>
                              <Button
                                   type="primary"
                                   htmlType="submit"
                                   size="small"
                                   className="px-3 d-flex align-items-center gap-2"
                                   loading={loading}
                              >
                                   <SaveOutlined />
                                   Сохранить
                              </Button>
                         </div>
                    </div>
               </Form>
          </Modal>
     )
}
