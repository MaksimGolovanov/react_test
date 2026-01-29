import  { useState, useEffect } from 'react'
import { Modal, Form, Input, DatePicker, Select, Button, Row, Col, Alert, AutoComplete, Typography } from 'antd'
import { UserOutlined, MailOutlined, NumberOutlined, DatabaseOutlined, TeamOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import locale from 'antd/es/date-picker/locale/ru_RU'

dayjs.locale('ru')

const { Option } = Select

const { Text } = Typography

const UsbModal = ({ show, onHide, onSubmit, formData, onInputChange, currentUsb, staff, getFioSuggestions }) => {
     const [form] = Form.useForm()
     const [fioOptions, setFioOptions] = useState([])
     const [loading, setLoading] = useState(false)

     // Инициализация формы при изменении formData или show
     useEffect(() => {
          if (show && formData) {
               form.setFieldsValue({
                    num_form: formData.num_form || '',
                    ser_num: formData.ser_num || '',
                    volume: formData.volume || '',
                    data_uch: formData.data_uch ? dayjs(formData.data_uch) : null,
                    fio: formData.fio || '',
                    email: formData.email || '',
                    department: formData.department || '',
                    data_prov: formData.data_prov ? dayjs(formData.data_prov) : null,
                    log: formData.log || 'Да',
               })
          }
     }, [show, formData, form])

     // Обновление опций автодополнения при изменении ввода ФИО
     const handleFioSearch = (value) => {
          if (!value) {
               setFioOptions([])
               return
          }

          const suggestions = getFioSuggestions()
          const filteredOptions = suggestions
               .filter((fio) => fio.toLowerCase().includes(value.toLowerCase()))
               .map((fio) => ({
                    value: fio,
                    label: fio,
               }))

          setFioOptions(filteredOptions)
     }
     useEffect(() => {
          return () => {
               // Сброс состояния при закрытии
               setFioOptions([])
               form.resetFields()
          }
     }, [form])

     // Обработка выбора ФИО из автодополнения
     const handleFioSelect = (value) => {
          // Находим сотрудника по ФИО
          const staffMember = staff?.find((s) => s.fio === value)

          if (staffMember) {
               // Убираем первые 13 символов из названия службы
               const department = staffMember.department ? staffMember.department.substring(13) : ''

               // Обновляем поля формы
               form.setFieldsValue({
                    fio: value,
                    email: staffMember.email || '',
                    department: department,
               })

               // Вызываем колбэк родительского компонента
               onInputChange('fio', value)
               onInputChange('email', staffMember.email || '')
               onInputChange('department', department)
          }
     }

     // Обработка изменения полей формы
     const handleValuesChange = (changedValues, allValues) => {
          Object.keys(changedValues).forEach((key) => {
               const value = changedValues[key]

               if (key === 'data_uch' || key === 'data_prov') {
                    // Преобразуем dayjs объект в строку формата YYYY-MM-DD
                    const dateString = value ? value.format('YYYY-MM-DD') : ''
                    onInputChange(key, dateString)
               } else if (key === 'fio') {
                    // Для ФИО специальная обработка через handleFioChange
                    onInputChange(key, value)
               } else {
                    onInputChange(key, value)
               }
          })
     }

     const handleSubmit = async () => {
          try {
               setLoading(true)

               // Валидация формы
               const values = await form.validateFields()

               // Преобразование дат в строковый формат
               const submitData = {
                    ...values,
                    data_uch: values.data_uch ? values.data_uch.format('YYYY-MM-DD') : '',
                    data_prov: values.data_prov ? values.data_prov.format('YYYY-MM-DD') : '',
               }

               // Вызов родительского обработчика
               await onSubmit(submitData)

               // Сброс формы после успешного сохранения
               form.resetFields()
               setFioOptions([])
          } catch (error) {
               console.error('Ошибка валидации формы:', error)
               // Ant Design автоматически покажет ошибки валидации
          } finally {
               setLoading(false)
          }
     }

     const handleCancel = () => {
          form.resetFields()
          setFioOptions([])
          onHide()
     }

     return (
          <Modal
               title={
                    <span>
                         <DatabaseOutlined style={{ marginRight: 8 }} />
                         {currentUsb ? 'Редактирование USB-накопителя' : 'Добавление нового USB-накопителя'}
                    </span>
               }
               open={show}
               onCancel={handleCancel}
               width={800}
               footer={[
                    <Button key="cancel" onClick={handleCancel}>
                         Отмена
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                         Сохранить
                    </Button>,
               ]}
               destroyOnClose
          >
               <Form form={form} layout="vertical" onValuesChange={handleValuesChange} preserve={false}>
                    <Row gutter={16}>
                         <Col span={12}>
                              <Form.Item
                                   name="num_form"
                                   label="Регистрационный номер"
                                   rules={[
                                        { required: true, message: 'Пожалуйста, введите регистрационный номер' },
                                        { pattern: /^[0-9]+$/, message: 'Допустимы только цифры' },
                                   ]}
                              >
                                   <Input placeholder="Введите регистрационный номер" prefix={<NumberOutlined />} />
                              </Form.Item>
                         </Col>
                         <Col span={12}>
                              <Form.Item
                                   name="ser_num"
                                   label="Серийный номер"
                                   rules={[{ required: true, message: 'Пожалуйста, введите серийный номер' }]}
                              >
                                   <Input placeholder="Введите серийный номер" prefix={<NumberOutlined />} />
                              </Form.Item>
                         </Col>
                    </Row>

                    <Row gutter={16}>
                         <Col span={12}>
                              <Form.Item
                                   name="volume"
                                   label="Объем памяти (ГБ)"
                                   
                              >
                                   <Input placeholder="Введите объем памяти" suffix="ГБ" />
                              </Form.Item>
                         </Col>
                         <Col span={12}>
                              <Form.Item name="data_uch" label="Дата регистрации">
                                   <DatePicker
                                        style={{ width: '100%' }}
                                        placeholder="Выберите дату"
                                        format="DD.MM.YYYY"
                                        locale={locale}
                                   />
                              </Form.Item>
                         </Col>
                    </Row>

                    <Row gutter={16}>
                         <Col span={12}>
                              <Form.Item
                                   name="fio"
                                   label="ФИО сотрудника"
                                   rules={[{ required: true, message: 'Пожалуйста, выберите сотрудника' }]}
                              >
                                   <AutoComplete
                                        options={fioOptions}
                                        onSearch={handleFioSearch}
                                        onSelect={handleFioSelect}
                                        placeholder="Начните вводить ФИО..."
                                   >
                                        <Input prefix={<UserOutlined />} />
                                   </AutoComplete>
                                   <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}>
                                        Начните вводить ФИО для поиска, при выборе автоматически заполнятся email и
                                        служба
                                   </Text>
                              </Form.Item>
                         </Col>
                         <Col span={12}>
                              <Form.Item name="email" label="Электронная почта">
                                   <Input
                                        placeholder="Email будет заполнен автоматически"
                                        prefix={<MailOutlined />}
                                        readOnly
                                   />
                              </Form.Item>
                         </Col>
                    </Row>

                    <Row gutter={16}>
                         <Col span={12}>
                              <Form.Item name="department" label="Служба">
                                   <Input
                                        placeholder="Служба будет заполнена автоматически"
                                        prefix={<TeamOutlined />}
                                        readOnly
                                   />
                              </Form.Item>
                         </Col>
                         <Col span={12}>
                              <Form.Item name="data_prov" label="Дата последней проверки">
                                   <DatePicker
                                        style={{ width: '100%' }}
                                        placeholder="Выберите дату"
                                        format="DD.MM.YYYY"
                                        locale={locale}
                                   />
                              </Form.Item>
                         </Col>
                    </Row>

                    <Row gutter={16}>
                         <Col span={12}>
                              <Form.Item
                                   name="log"
                                   label="Статус работы"
                                   rules={[{ required: true, message: 'Пожалуйста, выберите статус' }]}
                              >
                                   <Select placeholder="Выберите статус">
                                        <Option value="Да">В работе</Option>
                                        <Option value="Нет">Не в работе</Option>
                                   </Select>
                              </Form.Item>
                         </Col>
                    </Row>

                    {currentUsb && (
                         <Alert
                              message="Информация"
                              description="Вы редактируете существующий USB-накопитель. Все изменения будут сохранены после нажатия кнопки 'Сохранить'."
                              type="info"
                              showIcon
                              style={{ marginBottom: 16 }}
                         />
                    )}
               </Form>
          </Modal>
     )
}

export default UsbModal
