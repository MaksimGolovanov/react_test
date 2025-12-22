import React, { useState, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Table, Card, Button, Modal, Form, Alert, Input, Row, Col, Typography, Badge, message } from 'antd'
import {
     SearchOutlined,
     PlusOutlined,
     EditOutlined,
     DeleteOutlined,
     ReloadOutlined,
     SortAscendingOutlined,
     SortDescendingOutlined,
} from '@ant-design/icons'
import StaffService from '../../services/StaffService'
import styles from './style.module.css'

const { Search } = Input
const { Text } = Typography

const StaffSpravDolgnost = observer(() => {
     const [positions, setPositions] = useState([])
     const [searchTerm, setSearchTerm] = useState('')
     const [selectedRowKeys, setSelectedRowKeys] = useState([])
     const [showModal, setShowModal] = useState(false)
     const [showDeleteModal, setShowDeleteModal] = useState(false)
     const [currentPosition, setCurrentPosition] = useState(null)
     const [isLoading, setIsLoading] = useState(false)
     const [confirmLoading, setConfirmLoading] = useState(false)
     const [form] = Form.useForm()

     const [sortConfig, setSortConfig] = useState({
          key: 'dolgn',
          direction: 'asc',
     })

     useEffect(() => {
          loadPositions()
     }, [])

     const loadPositions = async () => {
          setIsLoading(true)
          try {
               const data = await StaffService.fetchAllDolgnost()
               setPositions(data)
          } catch (err) {
               message.error('Ошибка при загрузке должностей')
               console.error(err)
          } finally {
               setIsLoading(false)
          }
     }

     const handleAddNew = () => {
          setCurrentPosition(null)
          form.resetFields()
          setShowModal(true)
     }

     const handleEdit = () => {
          if (selectedRowKeys.length !== 1) return
          const position = positions.find((p) => p.id === selectedRowKeys[0])
          if (!position) return

          setCurrentPosition(position)
          form.setFieldsValue({
               dolgn: position.dolgn || '',
               dolgn_s: position.dolgn_s || '',
          })
          setShowModal(true)
     }

     const handleDelete = () => {
          if (selectedRowKeys.length === 0) return
          setShowDeleteModal(true)
     }

     const confirmDelete = async () => {
          setConfirmLoading(true)
          try {
               for (const id of selectedRowKeys) {
                    await StaffService.deleteDolgnost(id)
               }
               setSelectedRowKeys([])
               setShowDeleteModal(false)
               loadPositions()
               message.success('Должности успешно удалены')
          } catch (err) {
               message.error('Ошибка при удалении должностей')
               console.error(err)
          } finally {
               setConfirmLoading(false)
          }
     }

     const handleSubmit = async (values) => {
          setConfirmLoading(true)
          try {
               if (currentPosition) {
                    await StaffService.updateDolgnost(currentPosition.id, values)
                    message.success('Должность успешно обновлена')
               } else {
                    await StaffService.createDolgnost(values)
                    message.success('Должность успешно создана')
               }
               setShowModal(false)
               loadPositions()
               setSelectedRowKeys([])
          } catch (err) {
               message.error('Ошибка при сохранении данных')
               console.error(err)
          } finally {
               setConfirmLoading(false)
          }
     }

     const requestSort = (key) => {
          setSortConfig({
               key,
               direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
          })
     }

     const getSortIcon = (key) => {
          if (sortConfig.key !== key) return null
          return sortConfig.direction === 'asc' ? (
               <SortAscendingOutlined style={{ marginLeft: 8 }} />
          ) : (
               <SortDescendingOutlined style={{ marginLeft: 8 }} />
          )
     }

     const sortedItems = useMemo(() => {
          const filtered = positions.filter(
               (pos) =>
                    pos.dolgn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pos.dolgn_s?.toLowerCase().includes(searchTerm.toLowerCase())
          )

          if (!sortConfig.key) return filtered

          return [...filtered].sort((a, b) => {
               const valueA = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : ''
               const valueB = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : ''

               const comparison = valueA.localeCompare(valueB, 'ru', {
                    numeric: true,
                    sensitivity: 'base',
               })

               return sortConfig.direction === 'asc' ? comparison : -comparison
          })
     }, [positions, searchTerm, sortConfig])

     const columns = [
          {
               title: (
                    <div style={{ cursor: 'pointer' }} onClick={() => requestSort('dolgn')}>
                         Название должности {getSortIcon('dolgn')}
                    </div>
               ),
               dataIndex: 'dolgn',
               key: 'dolgn',
               width: '70%', // Фиксированная ширина 70%
               render: (text) => text || '-',
          },
          {
               title: (
                    <div style={{ cursor: 'pointer' }} onClick={() => requestSort('dolgn_s')}>
                         Сокращение {getSortIcon('dolgn_s')}
                    </div>
               ),
               dataIndex: 'dolgn_s',
               key: 'dolgn_s',
               width: '30%', // Фиксированная ширина 30%
               render: (text) => text || '-',
          },
     ]

     const rowSelection = {
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          type: 'radio',
          columnWidth: 60,
     }

     return (
          <div className={styles.spravContent}>
               {/* Панель инструментов */}
               <Card className={styles.toolbarCard}>
                    <Row gutter={16} align="middle">
                         <Col style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Button
                                   type="primary"
                                   icon={<PlusOutlined />}
                                   onClick={handleAddNew}
                                   style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        verticalAlign: 'middle',
                                        height: '32px',
                                   }}
                              >
                                   Добавить
                              </Button>
                              <Button
                                   icon={<EditOutlined />}
                                   onClick={handleEdit}
                                   disabled={selectedRowKeys.length !== 1}
                                   style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        verticalAlign: 'middle',
                                        height: '32px',
                                   }}
                              >
                                   Редактировать
                              </Button>
                              <Button
                                   danger
                                   icon={<DeleteOutlined />}
                                   onClick={handleDelete}
                                   disabled={selectedRowKeys.length === 0}
                                   style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        verticalAlign: 'middle',
                                        height: '32px',
                                   }}
                              >
                                   Удалить
                              </Button>
                         </Col>

                         <Col flex="auto">
                              <Search
                                   placeholder="Поиск по названию должности..."
                                   allowClear
                                   enterButton
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                                   onSearch={setSearchTerm}
                                   className={styles.searchInput}
                              />
                         </Col>

                         <Col>
                              <Badge
                                   count={sortedItems.length}
                                   showZero
                                   style={{
                                        backgroundColor: '#1890ff',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                   }}
                              />
                              <Text
                                   type="secondary"
                                   style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center' }}
                              >
                                   из {positions.length}
                              </Text>
                         </Col>
                    </Row>
               </Card>

               {/* Таблица без пагинации */}
               <Card className={styles.tableCard}>
                    <div className={styles.userListScroll}>
                         <Table
                              size="middle"
                              rowSelection={rowSelection}
                              columns={columns}
                              dataSource={sortedItems.map((item) => ({ ...item, key: item.id }))}
                              loading={isLoading}
                              locale={{ emptyText: searchTerm ? 'Ничего не найдено' : 'Нет данных' }}
                              pagination={false}
                              style={{ width: '100%' }}
                              rowClassName={styles.tableRow}
                         />
                    </div>
               </Card>
               {/* Модальное окно для редактирования/создания */}
               <Modal
                    title={currentPosition ? 'Редактирование должности' : 'Добавление новой должности'}
                    open={showModal}
                    onCancel={() => !confirmLoading && setShowModal(false)}
                    footer={null}
                    destroyOnClose
               >
                    <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                         <Form.Item
                              label="Название должности"
                              name="dolgn"
                              rules={[{ required: true, message: 'Пожалуйста, введите название должности' }]}
                         >
                              <Input placeholder="Введите полное название должности" disabled={confirmLoading} />
                         </Form.Item>

                         <Form.Item
                              label="Сокращенное название"
                              name="dolgn_s"
                              rules={[{ required: true, message: 'Пожалуйста, введите сокращенное название' }]}
                         >
                              <Input placeholder="Введите сокращенное название" disabled={confirmLoading} />
                         </Form.Item>

                         <Form.Item>
                              <div style={{ textAlign: 'right' }}>
                                   <Button
                                        onClick={() => setShowModal(false)}
                                        disabled={confirmLoading}
                                        style={{ marginRight: 8 }}
                                   >
                                        Отмена
                                   </Button>
                                   <Button type="primary" htmlType="submit" loading={confirmLoading}>
                                        Сохранить
                                   </Button>
                              </div>
                         </Form.Item>
                    </Form>
               </Modal>

               {/* Модальное окно для подтверждения удаления */}
               <Modal
                    title="Подтверждение удаления"
                    open={showDeleteModal}
                    onCancel={() => setShowDeleteModal(false)}
                    onOk={confirmDelete}
                    confirmLoading={confirmLoading}
                    okText="Удалить"
                    cancelText="Отмена"
                    okButtonProps={{ danger: true }}
               >
                    {selectedRowKeys.length === 1 ? (
                         <p>Вы действительно хотите удалить выбранную должность?</p>
                    ) : (
                         <p>Вы действительно хотите удалить выбранные должности ({selectedRowKeys.length} шт.)?</p>
                    )}
                    <Alert
                         message="Внимание!"
                         description="Это действие нельзя отменить."
                         type="warning"
                         showIcon
                         style={{ marginTop: 16 }}
                    />
               </Modal>
          </div>
     )
})

export default StaffSpravDolgnost
