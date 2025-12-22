import React, { useState, useEffect } from 'react'
import { Modal, Progress, Alert, Button, Card, Row, Col, Tag, Space, message } from 'antd'
import { CloseOutlined, UploadOutlined, SaveOutlined, InfoCircleOutlined, FileExcelOutlined } from '@ant-design/icons'
import * as XLSX from 'xlsx'
import StaffService from '../services/StaffService'

export default function StaffImportModal({ isOpen, onRequestClose }) {
     const [file, setFile] = useState(null)
     const [errorMessage, setErrorMessage] = useState('')
     const [isLoading, setIsLoading] = useState(false)
     const [progress, setProgress] = useState(0)
     const [progressText, setProgressText] = useState('')
     const [fileName, setFileName] = useState('')

     useEffect(() => {
          if (!isOpen) {
               resetState()
          }
     }, [isOpen])

     const resetState = () => {
          setFile(null)
          setFileName('')
          setErrorMessage('')
          setIsLoading(false)
          setProgress(0)
          setProgressText('')
     }

     const handleFileChange = (e) => {
          const selectedFile = e.target.files[0]
          if (selectedFile) {
               // Проверяем расширение файла
               const fileExtension = selectedFile.name.split('.').pop().toLowerCase()
               const allowedExtensions = ['xls', 'xlsx', 'csv']

               if (!allowedExtensions.includes(fileExtension)) {
                    message.error('Недопустимый формат файла. Разрешены только .xls, .xlsx, .csv')
                    return
               }

               setFile(selectedFile)
               setFileName(selectedFile.name)
               setErrorMessage('')
               setProgress(0)
               setProgressText('')
          }
     }

     const handleClose = () => {
          if (!isLoading) {
               resetState()
               onRequestClose()
          }
     }

     const importFile = async () => {
          if (!file) {
               setErrorMessage('Выберите файл для импорта.')
               return
          }

          setIsLoading(true)
          setErrorMessage('')
          setProgress(0)
          setProgressText('Начало обработки файла...')

          try {
               const reader = new FileReader()

               reader.onprogress = (event) => {
                    if (event.lengthComputable) {
                         const percentLoaded = Math.round((event.loaded / event.total) * 50)
                         setProgress(percentLoaded)
                         setProgressText(`Чтение файла: ${percentLoaded}%`)
                    }
               }

               reader.onload = async (event) => {
                    try {
                         setProgress(50)
                         setProgressText('Обработка данных...')

                         const bstr = event.target.result
                         const wb = XLSX.read(bstr, { type: 'binary' })
                         const wsname = wb.SheetNames[0]
                         const ws = wb.Sheets[wsname]

                         const data = XLSX.utils.sheet_to_json(ws, { header: 1 })

                         // Проверяем, что файл не пустой
                         if (data.length <= 1) {
                              throw new Error('Файл не содержит данных или имеет неверный формат')
                         }

                         setProgress(70)
                         setProgressText('Форматирование данных...')

                         const formattedData = data
                              .slice(1)
                              .filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== ''))
                              .map((row) => ({
                                   login: row[8]?.split('@')[0] || '',
                                   fio: row[1] || '',
                                   tabNumber: row[7] || '',
                                   post: row[3] || '',
                                   department: row[2] || '',
                                   email: row[6] || '',
                                   telephone: row[5] || '',
                                   del: '0',
                              }))

                         // Проверяем, что есть данные для импорта
                         if (formattedData.length === 0) {
                              throw new Error('Нет данных для импорта. Проверьте структуру файла.')
                         }

                         setProgress(80)
                         setProgressText('Отправка данных на сервер...')

                         await StaffService.importStaffData(formattedData, (progressEvent) => {
                              const percentUploaded = 80 + Math.round((progressEvent.loaded / progressEvent.total) * 20)
                              setProgress(percentUploaded)
                              setProgressText(`Отправка данных: ${percentUploaded}%`)
                         })

                         setProgress(100)
                         setProgressText('Завершено!')

                         setTimeout(() => {
                              Modal.success({
                                   title: 'Успешно',
                                   content: `Данные успешно импортированы! Добавлено ${formattedData.length} записей.`,
                                   onOk: () => {
                                        resetState()
                                        onRequestClose()
                                   },
                              })
                         }, 500)
                    } catch (error) {
                         console.error('Ошибка обработки:', error)
                         setErrorMessage(`Ошибка при обработке данных: ${error.message}`)
                         setIsLoading(false)
                    }
               }

               reader.onerror = (error) => {
                    console.error('Ошибка чтения:', error)
                    setErrorMessage('Ошибка чтения файла. Файл может быть поврежден.')
                    setIsLoading(false)
               }

               reader.readAsBinaryString(file)
          } catch (err) {
               console.error('Ошибка импорта:', err)
               setErrorMessage(`Ошибка при обработке файла: ${err.message}`)
               setIsLoading(false)
          }
     }

     const removeFile = () => {
          setFile(null)
          setFileName('')
          setErrorMessage('')
     }

     return (
          <Modal
               open={isOpen}
               onCancel={handleClose}
               centered
               width={700}
               footer={null}
               closeIcon={isLoading ? null : <CloseOutlined />}
               maskClosable={!isLoading}
               closable={!isLoading}
               title={
                    <Space>
                         <span>Импорт сотрудников</span>
                         <Tag color="blue" icon={<FileExcelOutlined />}>
                              Excel
                         </Tag>
                    </Space>
               }
          >
               <div style={{ padding: '4px 0' }}>
                    {/* Загрузка файла */}
                    <div style={{ marginBottom: 24 }}>
                         <div style={{ marginBottom: 8, fontWeight: 500 }}>Выберите файл Excel</div>

                         <div style={{ marginBottom: 8 }}>
                              <input
                                   type="file"
                                   id="fileInput"
                                   accept=".xls,.xlsx,.csv"
                                   onChange={handleFileChange}
                                   disabled={isLoading}
                                   style={{ display: 'none' }}
                              />

                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                   <Button
                                        icon={<UploadOutlined />}
                                        onClick={() => document.getElementById('fileInput').click()}
                                        disabled={isLoading}
                                   >
                                        Выбрать файл
                                   </Button>

                                   {fileName && (
                                        <Tag
                                             color="green"
                                             closable
                                             onClose={removeFile}
                                             style={{ fontSize: '14px', padding: '4px 8px' }}
                                        >
                                             {fileName.length > 30 ? `${fileName.substring(0, 30)}...` : fileName}
                                        </Tag>
                                   )}
                              </div>
                         </div>

                         <div style={{ fontSize: '12px', color: '#666' }}>
                              Поддерживаемые форматы: .xls, .xlsx, .csv
                         </div>
                    </div>

                    {/* Информация о структуре */}
                    <Card
                         size="small"
                         title={
                              <Space>
                                   <InfoCircleOutlined />
                                   <span>Структура файла</span>
                              </Space>
                         }
                         style={{ marginBottom: 24 }}
                    >
                         <Row gutter={[16, 8]}>
                              <Col span={12}>
                                   <div style={{ marginBottom: 4 }}>
                                        <strong style={{ marginRight: 8 }}>0:</strong>
                                        <span style={{ color: '#666' }}>ID (не используется)</span>
                                   </div>
                                   <div style={{ marginBottom: 4 }}>
                                        <strong style={{ marginRight: 8 }}>1:</strong>
                                        <span>ФИО</span>
                                   </div>
                                   <div style={{ marginBottom: 4 }}>
                                        <strong style={{ marginRight: 8 }}>2:</strong>
                                        <span>Подразделение</span>
                                   </div>
                                   <div style={{ marginBottom: 4 }}>
                                        <strong style={{ marginRight: 8 }}>3:</strong>
                                        <span>Должность</span>
                                   </div>
                                   <div style={{ marginBottom: 4 }}>
                                        <strong style={{ marginRight: 8 }}>4:</strong>
                                        <span>Учетная запись</span>
                                   </div>
                              </Col>
                              <Col span={12}>
                                   
                                   <div style={{ marginBottom: 4 }}>
                                        <strong style={{ marginRight: 8 }}>5:</strong>
                                        <span>Телефон</span>
                                   </div>
                                   <div style={{ marginBottom: 4 }}>
                                        <strong style={{ marginRight: 8 }}>6:</strong>
                                        <span>Email</span>
                                   </div>
                                   <div style={{ marginBottom: 4 }}>
                                        <strong style={{ marginRight: 8 }}>7:</strong>
                                        <span>Табельный номер</span>
                                   </div>
                                   <div style={{ marginBottom: 4 }}>
                                        <strong style={{ marginRight: 8 }}>8:</strong>
                                        <span>Логин (из email)</span>
                                   </div>
                              </Col>
                         </Row>
                    </Card>

                    {/* Прогресс бар */}
                    {isLoading && (
                         <div style={{ marginBottom: 24 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                   <span>{progressText}</span>
                                   <span style={{ fontWeight: 500 }}>{progress}%</span>
                              </div>
                              <Progress
                                   percent={progress}
                                   status={progress < 100 ? 'active' : 'success'}
                                   strokeColor={{
                                        '0%': '#108ee9',
                                        '100%': '#87d068',
                                   }}
                              />
                         </div>
                    )}

                    {/* Сообщение об ошибке */}
                    {errorMessage && (
                         <Alert
                              message="Ошибка"
                              description={errorMessage}
                              type="error"
                              showIcon
                              style={{ marginBottom: 16 }}
                              closable
                              onClose={() => setErrorMessage('')}
                         />
                    )}

                    {/* Футер с кнопками */}
                    <div
                         style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              paddingTop: 16,
                              borderTop: '1px solid #f0f0f0',
                         }}
                    >
                         <div style={{ color: '#666', fontSize: '14px' }}>
                              <InfoCircleOutlined style={{ marginRight: 4 }} />
                              Первая строка файла должна содержать заголовки
                         </div>
                         <Space>
                              <Button onClick={handleClose} disabled={isLoading}>
                                   Отмена
                              </Button>
                              <Button
                                   type="primary"
                                   onClick={importFile}
                                   icon={<SaveOutlined />}
                                   loading={isLoading}
                                   disabled={!file || isLoading}
                              >
                                   Импортировать
                              </Button>
                         </Space>
                    </div>
               </div>
          </Modal>
     )
}
