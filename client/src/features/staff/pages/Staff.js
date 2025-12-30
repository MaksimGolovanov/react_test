import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Row, Col, Spin, Typography, Modal, Button, message } from 'antd'
import StaffService from '../services/StaffService'
import StaffCreateModal from '../modal/StaffCreateModal'
import StaffEditModal from '../modal/StaffEditModal'
import StaffImportModal from '../modal/StaffImportModal'
import UserProfilePanel from '../components/UserProfilePanel/UserProfilePanel'
import TopActionsPanel from '../components/TopActionsPanel/TopActionsPanel'
import StaffListPanel from '../components/StaffListPanel/StaffListPanel'
import styles from './style.module.css'
import { useNavigate } from 'react-router-dom'
import passwordGenerator from '../utils/passwordGenerator'
import { checkPhotosBatch, clearPhotoCache } from '../utils/photoChecker'
import { exportStaffToExcel, downloadExcelFile } from '../utils/exportUtils'

const { Text } = Typography

function Staff() {
     const [staff, setStaff] = useState([])
     const [searchQuery, setSearchQuery] = useState('')
     const [selectedUser, setSelectedUser] = useState(null)
     const [isLoading, setIsLoading] = useState(true)
     const [createModalOpen, setCreateModalOpen] = useState(false)
     const [editModalOpen, setEditModalOpen] = useState(false)
     const [importModalOpen, setImportModalOpen] = useState(false)
     const [departments, setDepartments] = useState([])
     const [deleteModalVisible, setDeleteModalVisible] = useState(false)
     const [showDeleted, setShowDeleted] = useState(false)
     const [showNoPhoto, setShowNoPhoto] = useState(false)
     const [exportLoading, setExportLoading] = useState(false)
     const [generatedPassword, setGeneratedPassword] = useState('')
     const [passwordCopied, setPasswordCopied] = useState(false)
     const [showPasswordField, setShowPasswordField] = useState(false)
     const [dataVersion, setDataVersion] = useState(0)

     const navigate = useNavigate()

     const EXCLUDED_DEPARTMENTS = [
          'Бюро пропусков Вуктыльского ЛПУМГ',
          'ППО "Газпром трансгаз Ухта профсоюз - Вуктыльское ЛПУМГ"',
          'Техническая группа (Вуктыльское ЛПУМГ)',
          'Вуктыльское отделение',
          'Врачебный здравпункт Вуктыльского ЛПУМГ',
          'Служба строительного контроля',
     ]

     // Функция стабильной сортировки сотрудников
     // Функция стабильной сортировки сотрудников
     // Функция стабильной сортировки сотрудников
     const sortStaff = useCallback((staffArray) => {
          if (!Array.isArray(staffArray)) return []

          return [...staffArray].sort((a, b) => {
               // Сортируем только по алфавиту по ФИО, игнорируя все остальные статусы
               return (a.fio || '').localeCompare(b.fio || '')
          })
     }, [])

     useEffect(() => {
          const loadAllData = async () => {
               setIsLoading(true)
               try {
                    const deptData = await StaffService.fetchAllDepartments()
                    setDepartments(deptData)

                    await fetchDataWithDepartments(deptData)
                    setDataVersion((prev) => prev + 1)
               } catch (error) {
                    console.error('Ошибка при загрузке данных:', error)
                    message.error('Ошибка при загрузке данных')
               } finally {
                    setIsLoading(false)
               }
          }

          loadAllData()
     }, [])

     const getDepartmentName = useCallback((departmentCode, departmentsList) => {
          if (!departmentCode) return 'Не указано'
          if (!departmentsList || departmentsList.length === 0) return 'Загрузка...'

          const codeToFind = String(departmentCode).trim().split(' ')[0]
          const dept = departmentsList.find((d) => d.code === codeToFind || d.code === String(departmentCode).trim())

          return dept ? dept.description.trim() : `Неизвестный отдел (${departmentCode})`
     }, [])

     // Функция загрузки данных с проверкой фото
     // Функция загрузки данных с проверкой фото
     // Функция загрузки данных с проверкой фото
     const fetchDataWithDepartments = useCallback(
          async (deptData) => {
               try {
                    console.log('Начало загрузки сотрудников...')
                    const fetchedStaff = await StaffService.fetchStaff()
                    console.log('Загружено сотрудников из API:', fetchedStaff.length)

                    // Получаем массив табельных номеров для проверки фото
                    const tabNumbers = fetchedStaff
                         .map((item) => item.tabNumber)
                         .filter((tabNumber) => tabNumber && tabNumber.trim() !== '')

                    console.log('Табельных номеров для проверки фото:', tabNumbers.length)

                    // Проверяем фото пакетно
                    let photoResults = {}
                    try {
                         console.log('Начинаем проверку фото...')
                         photoResults = await checkPhotosBatch(tabNumbers)
                    } catch (photoError) {
                         console.error('Ошибка при проверке фото:', photoError)
                    }

                    // Добавляем departmentName, isExcludedDepartment и hasPhoto
                    const staffWithDepartmentInfo = fetchedStaff.map((item) => {
                         // Определяем статус увольнения из поля del
                         const delValue = item.del
                         let isDeleted = false

                         if (delValue === true || delValue === 1 || delValue === '1') {
                              isDeleted = true
                         }

                         const hasPhoto = !!photoResults[item.tabNumber]
                         const departmentName = getDepartmentName(item.department, deptData)
                         const isExcludedDepartment = EXCLUDED_DEPARTMENTS.includes(departmentName)

                         return {
                              ...item,
                              departmentName: departmentName,
                              isExcludedDepartment: isExcludedDepartment,
                              hasPhoto: hasPhoto,
                              isDeleted: isDeleted,
                         }
                    })

                    // Используем стабильную сортировку - по умолчанию показываем всех вместе
                    const sortedStaff = sortStaff(staffWithDepartmentInfo, true) // true = сортировать всех вместе
                    setStaff(sortedStaff)

                    // Устанавливаем первого пользователя по умолчанию
                    const firstUser = sortedStaff.find((u) => !u.isExcludedDepartment && !u.isDeleted)
                    if (firstUser) {
                         setSelectedUser(firstUser)
                    }
               } catch (error) {
                    console.error('Ошибка при загрузке сотрудников:', error)
                    message.error('Ошибка при загрузке данных')
               }
          },
          [sortStaff, getDepartmentName]
     )

     const fetchData = useCallback(async () => {
          await fetchDataWithDepartments(departments)
          setDataVersion((prev) => prev + 1)
     }, [departments, fetchDataWithDepartments])

     // Счетчики для панели
     const { activeCount, deletedCount, noPhotoCount, excludedCount } = useMemo(() => {
          // Основные пользователи (не исключенные отделы)
          const mainStaff = staff.filter((user) => !user.isExcludedDepartment)

          // Активные пользователи (не уволенные)
          const active = mainStaff.filter((user) => !user.isDeleted)

          // Уволенные пользователи
          const deleted = mainStaff.filter((user) => user.isDeleted)

          // ВСЕ пользователи без фото (включая уволенных и исключенных) - ИЗМЕНЕНО
          const noPhoto = staff.filter(
               (user) =>
                    !user.hasPhoto && // нет фото
                    !user.isDeleted // не уволен
          )

          // Исключенные пользователи (сторонние)
          const excluded = staff.filter((user) => user.isExcludedDepartment)

          return {
               activeCount: active.length,
               deletedCount: deleted.length,
               noPhotoCount: noPhoto.length, // Теперь включает ВСЕХ без фото
               excludedCount: excluded.length,
          }
     }, [staff])

     const filteredStaff = useMemo(() => {
          if (!Array.isArray(staff) || staff.length === 0) {
               console.log('filteredStaff: staff пустой')
               return []
          }

          let result = [...staff]

          // 1. Фильтр по статусу увольнения
          if (!showDeleted) {
               result = result.filter((user) => !user.isDeleted || user.isExcludedDepartment)
               console.log('После фильтра уволенных (оставляем только активных):', result.length)
          } else {
               // Когда показываем уволенных, показываем всех (и активных, и уволенных)
               const activeCount = result.filter((u) => !u.isDeleted).length
               const deletedCount = result.filter((u) => u.isDeleted).length
               console.log(`При показе уволенных: активных=${activeCount}, уволенных=${deletedCount}`)
          }

          // 2. Фильтр по наличию фото
          if (showNoPhoto) {
               result = result.filter((user) => !user.hasPhoto)
               console.log('После фильтра без фото:', result.length)
          }

          // 3. Поиск по всем полям
          if (searchQuery.trim()) {
               const query = searchQuery.toLowerCase().trim()
               result = result.filter((user) => {
                    const fields = [user.fio, user.post, user.departmentName, user.login, user.tabNumber, user.ip]
                    return fields.some((field) => field && field.toString().toLowerCase().includes(query))
               })
               console.log('После поиска:', result.length)
          }

          // 4. Всегда сортируем результат
          const sortedResult = sortStaff(result, showDeleted)

          const excludedInResult = sortedResult.filter((u) => u.isExcludedDepartment).length
          const activeInResult = sortedResult.filter((u) => !u.isDeleted && !u.isExcludedDepartment).length
          const deletedInResult = sortedResult.filter((u) => u.isDeleted && !u.isExcludedDepartment).length
          const withPhotoCount = sortedResult.filter((u) => u.hasPhoto).length
          const withoutPhotoCount = sortedResult.filter((u) => !u.hasPhoto).length

          console.log('=== Результат фильтрации ===')
          console.log(`Всего: ${sortedResult.length}`)
          console.log(`Сторонние: ${excludedInResult}`)
          console.log(`Активные основные: ${activeInResult}`)
          console.log(`Уволенные основные: ${deletedInResult}`)
          console.log(`С фото: ${withPhotoCount}`)
          console.log(`Без фото: ${withoutPhotoCount}`)

          return sortedResult
     }, [staff, searchQuery, showNoPhoto, showDeleted, sortStaff, dataVersion])

     // Эффект для автоматического выбора пользователя
     useEffect(() => {
          console.log('Эффект выбора пользователя. filteredStaff.length:', filteredStaff.length)

          if (filteredStaff.length > 0) {
               // Если есть выбранный пользователь и он есть в отфильтрованном списке - оставляем его
               if (selectedUser && filteredStaff.find((u) => u.tabNumber === selectedUser.tabNumber)) {
                    console.log(
                         'Выбранный пользователь остаётся:',
                         selectedUser.fio,
                         'isDeleted:',
                         selectedUser.isDeleted,
                         'del:',
                         selectedUser.del
                    )
                    return
               }

               // Иначе выбираем первого из отфильтрованного списка
               const newSelectedUser = filteredStaff[0]
               console.log(
                    'Новый выбранный пользователь:',
                    newSelectedUser?.fio || 'нет',
                    'isDeleted:',
                    newSelectedUser?.isDeleted,
                    'del:',
                    newSelectedUser?.del
               )
               setSelectedUser(newSelectedUser)
          } else {
               // Если список пуст, сбрасываем выбранного пользователя
               console.log('Список пуст, сбрасываем выбранного пользователя')
               setSelectedUser(null)
          }
     }, [filteredStaff])

     const handleGeneratePassword = useCallback(() => {
          if (!showPasswordField) {
               setShowPasswordField(true)
          }
          const result = passwordGenerator.generatePassword(15)
          setGeneratedPassword(result.password)
          setPasswordCopied(false)

          if (!result.password) {
               message.error('Не удалось сгенерировать пароль. Попробуйте еще раз.')
          } else {
               message.success('Пароль сгенерирован')
          }
     }, [showPasswordField])

     const handleCopyPassword = useCallback(async () => {
          if (!generatedPassword) return
          try {
               await navigator.clipboard.writeText(generatedPassword)
               setPasswordCopied(true)
               setTimeout(() => setPasswordCopied(false), 2000)
          } catch (err) {
               console.error('Ошибка копирования:', err)
               message.error('Не удалось скопировать пароль')
          }
     }, [generatedPassword])

     const handleCreateUser = () => setCreateModalOpen(true)
     const handleEditUser = () => {
          if (selectedUser) {
               setEditModalOpen(true)
          }
     }
     const handleImportUsers = () => setImportModalOpen(true)

     const handleSpravClick = () => navigate('/staff/sprav')
     const handlePSW = () => navigate('/staff/psw')

     const handleExportClick = useCallback(async () => {
          setExportLoading(true)
          try {
               // Используем функцию экспорта из утилит
               const exportResult = exportStaffToExcel(filteredStaff, EXCLUDED_DEPARTMENTS)

               // Скачиваем файл
               downloadExcelFile(exportResult.workbook, exportResult.fileName)

               message.success('Экспорт успешно завершен')
          } catch (error) {
               console.error('Ошибка при экспорте:', error)
               message.error('Ошибка при экспорте файла')
          } finally {
               setExportLoading(false)
          }
     }, [filteredStaff])

     const handleDeleteUser = useCallback(async () => {
          if (!selectedUser || selectedUser.isDeleted) return

          try {
               await StaffService.deleteStaff(selectedUser.tabNumber)
               await fetchData()
               setDeleteModalVisible(false)
               message.success('Сотрудник успешно удален')
          } catch (error) {
               console.error('Ошибка при удалении:', error)
               message.error('Ошибка при удалении сотрудника')
          }
     }, [selectedUser, fetchData])

     const handleToggleDeleted = useCallback(
          (checked) => {
               console.log('Переключение showDeleted:', checked)
               setShowDeleted(checked)

               // Если включаем показ уволенных и нет выбранного пользователя
               if (checked && !selectedUser && filteredStaff.length > 0) {
                    setSelectedUser(filteredStaff[0])
               }
               // Если выключаем показ уволенных и выбран уволенный
               else if (!checked && selectedUser?.isDeleted) {
                    const firstActive = staff.find((u) => !u.isExcludedDepartment && !u.isDeleted)
                    setSelectedUser(firstActive || null)
               }
          },
          [selectedUser, filteredStaff, staff]
     )

     const handleToggleNoPhoto = useCallback(
          (checked) => {
               console.log('Переключение showNoPhoto:', checked)
               setShowNoPhoto(checked)

               // Если включаем показ без фото и нет выбранного пользователя
               if (checked && !selectedUser && filteredStaff.length > 0) {
                    setSelectedUser(filteredStaff[0])
               }
          },
          [selectedUser, filteredStaff]
     )

     // Обработка обновления фото при редактировании
     const handleUserUpdate = useCallback(async () => {
          console.log('Обновление данных...')

          // Очищаем кэш фото для обновленного пользователя
          if (selectedUser?.tabNumber) {
               clearPhotoCache()
          }

          await fetchData()
     }, [selectedUser, fetchData])

     const handleClearSearch = useCallback(() => {
          console.log('Очистка поиска')
          setSearchQuery('')
     }, [])

     // Функция для получения названия отдела
     const getDepartmentNameForComponent = useCallback(
          (departmentCode) => {
               return getDepartmentName(departmentCode, departments)
          },
          [departments, getDepartmentName]
     )

     if (isLoading) {
          return (
               <div className={styles.loadingContainer}>
                    <Spin size="large" tip="Загрузка сотрудников..." />
               </div>
          )
     }

     return (
          <div className={styles.staffContainer}>
               <TopActionsPanel
                    onCreate={handleCreateUser}
                    onEdit={handleEditUser}
                    onDelete={setDeleteModalVisible}
                    onImport={handleImportUsers}
                    onExport={handleExportClick}
                    onSprav={handleSpravClick}
                    onPsw={handlePSW}
                    onToggleDeleted={handleToggleDeleted}
                    onToggleNoPhoto={handleToggleNoPhoto}
                    selectedUser={selectedUser}
                    showDeleted={showDeleted}
                    showNoPhoto={showNoPhoto}
                    exportLoading={exportLoading}
                    className={styles.topPanel}
                    generatedPassword={generatedPassword}
                    onGeneratePassword={handleGeneratePassword}
                    onCopyPassword={handleCopyPassword}
                    passwordCopied={passwordCopied}
                    showPasswordField={showPasswordField}
                    noPhotoCount={noPhotoCount}
                    staff={staff}
                    excludedCount={excludedCount}
                    onClearSearch={handleClearSearch} // Добавьте эту строку
               />

               <Row gutter={16} className={styles.mainContent}>
                    <Col xs={24} md={10} className={styles.userListPanel}>
                         <StaffListPanel
                              staff={filteredStaff}
                              selectedUser={selectedUser}
                              searchQuery={searchQuery}
                              onSearchChange={setSearchQuery}
                              onUserSelect={setSelectedUser}
                              getDepartmentName={getDepartmentNameForComponent}
                              totalCount={staff.filter((u) => !u.isExcludedDepartment).length}
                              activeCount={activeCount}
                              deletedCount={deletedCount}
                              noPhotoCount={noPhotoCount}
                              excludedCount={excludedCount}
                              showDeleted={showDeleted}
                              showNoPhoto={showNoPhoto}
                              dataVersion={dataVersion}
                         />
                    </Col>

                    <Col xs={24} md={14} className={styles.profilePanel}>
                         <UserProfilePanel
                              key={`profile-${selectedUser?.tabNumber || 'empty'}-${dataVersion}`}
                              user={selectedUser || null}
                              departments={departments}
                              onUpdate={handleUserUpdate}
                              onEdit={
                                   selectedUser ? handleEditUser : null // Редактирование для всех активных
                              }
                              onDelete={
                                   selectedUser ? () => setDeleteModalVisible(true) : null // Удаление для всех активных
                              }
                         />
                    </Col>
               </Row>

               <StaffCreateModal
                    isOpen={createModalOpen}
                    onRequestClose={() => setCreateModalOpen(false)}
                    fetchData={handleUserUpdate}
               />

               {selectedUser && (
                    <StaffEditModal
                         isOpen={editModalOpen}
                         onRequestClose={() => setEditModalOpen(false)}
                         selectedData={selectedUser}
                         fetchData={handleUserUpdate}
                         isExcludedUser={selectedUser?.isExcludedDepartment || false} // Добавьте этот проп
                    />
               )}

               <StaffImportModal
                    isOpen={importModalOpen}
                    onRequestClose={() => setImportModalOpen(false)}
                    onSuccess={handleUserUpdate}
               />

               <Modal
                    title="Удаление сотрудника"
                    open={deleteModalVisible}
                    onCancel={() => setDeleteModalVisible(false)}
                    footer={[
                         <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
                              Отмена
                         </Button>,
                         <Button key="delete" type="primary" danger onClick={handleDeleteUser}>
                              Удалить
                         </Button>,
                    ]}
               >
                    <p>
                         Вы уверены, что хотите {selectedUser?.isDeleted ? 'окончательно удалить' : 'удалить'}{' '}
                         сотрудника <strong>{selectedUser?.fio}</strong>?
                    </p>
                    {selectedUser?.isDeleted && (
                         <Text type="danger">
                              ВНИМАНИЕ: Этот сотрудник уже отмечен как уволенный. Удаление будет окончательным!
                         </Text>
                    )}
                    <Text type="secondary">Это действие нельзя отменить.</Text>
               </Modal>
          </div>
     )
}

export default Staff
