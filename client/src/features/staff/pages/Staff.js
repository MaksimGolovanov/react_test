import React, { useEffect, useState, useMemo } from 'react'
import { Table, Spinner, Card } from 'react-bootstrap'
import ClipboardJS from 'clipboard'
import StaffService from '../services/StaffService'
import { FaRegCopy } from 'react-icons/fa'
import { RiFileEditLine } from 'react-icons/ri'
import { MdDeleteForever } from 'react-icons/md'
import StaffEditModal from './StaffEditModal'
import StaffImportModal from './StaffImportModal'
import StaffCreateModal from './StaffCreateModal'
import ButtonAll from '../../ius-pt/components/ButtonAll/ButtonAll'
import Circle from '../../../Components/circle/Circle'
import SearchInput from '../../ius-pt/components/SearchInput/SearchInput'
import styles from './style.module.css'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import IconBtn from '../../../Components/IconBtn/IconBtn'

function Staff() {
     const [staff, setStaff] = useState([])
     const [filteredStaff, setFilteredStaff] = useState([])
     const [searchQuery, setSearchQuery] = useState('')
     const [modalIsOpen, setModalIsOpen] = useState(false)
     const [createModalIsOpen, setCreateModalIsOpen] = useState(false)
     const [selectedData, setSelectedData] = useState('')
     const [modalShow, setModalShow] = useState(false)
     const [sortConfig, setSortConfig] = useState({ key: 'fio', direction: 'asc' })
     const [departmens, setDepatmens] = useState([])
     const [isLoading, setIsLoading] = useState(true)
     const navigate = useNavigate()

     const openModal = () => setModalIsOpen(true)
     const closeModal = () => setModalIsOpen(false)
     const openCreateModal = () => setCreateModalIsOpen(true)
     const closeCreateModal = () => setCreateModalIsOpen(false)
     const closeModalImport = () => setModalShow(false)

     const handleEditClick = (data) => {
          setSelectedData(data)
          openModal()
     }

     useEffect(() => {
          async function departmensGet() {
               try {
                    const departments = await StaffService.fetchAllDepartments()
                    setDepatmens(departments)
               } catch (error) {
                    console.error(error)
               }
          }
          departmensGet()
     }, [])

     useEffect(() => {
          const clipboard = new ClipboardJS(`.${styles.copyButton}`, {
               text: (trigger) => trigger.getAttribute('data-clipboard-text'),
          })

          clipboard.on('success', (e) => console.log('Текст скопирован:', e.text))
          clipboard.on('error', (e) => console.error('Ошибка при копировании:', e.action))

          return () => clipboard.destroy()
     }, [filteredStaff])

     const getDepartmentById = (id) => {
          if (id === null || id === undefined) return null

          const departmentCode = String(id).split(' ')[0]
          const foundDepartment =
               departmens.find((d) => d.code === departmentCode) || departmens.find((d) => d.code === id)

          return foundDepartment ? foundDepartment.description : null
     }

     const fetchData = async () => {
          setIsLoading(true)
          try {
               const fetchedStaff = await StaffService.fetchStaff()
               setStaff(fetchedStaff)
               setFilteredStaff(fetchedStaff)
          } catch (error) {
               console.error(error)
          } finally {
               setIsLoading(false)
          }
     }

     useEffect(() => {
          fetchData()
     }, [])

     useEffect(() => {
          if (!searchQuery) {
               setFilteredStaff(staff)
          } else {
               const filteredList = staff.filter(
                    (member) =>
                         (member.fio && member.fio.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (member.login && member.login.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (member.post && member.post.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (member.department && member.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (member.telephone && member.telephone.includes(searchQuery)) ||
                         (member.ip && member.ip.includes(searchQuery)) ||
                         (member.tabNumber && member.tabNumber.includes(searchQuery))
               )
               setFilteredStaff(filteredList)
          }
     }, [searchQuery, staff])

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

     const sortedStaff = useMemo(() => {
          const sortableItems = [...filteredStaff]
          if (sortConfig.key) {
               sortableItems.sort((a, b) => {
                    const aValue = a[sortConfig.key]?.toLowerCase() || ''
                    const bValue = b[sortConfig.key]?.toLowerCase() || ''

                    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
                    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
                    return 0
               })
          }
          return sortableItems
     }, [filteredStaff, sortConfig])

     const handleSpravClick = () => navigate('/staff/sprav')
     const handlePSW = () => navigate('/staff/PSW')
     const handleUserClick = (staffMember) => () => {
          navigate('/staff/user', { state: { staffMember } })
     }

     const handleDelete = async (tabNumber) => {
          if (!window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) return

          setIsLoading(true)
          try {
               await StaffService.deleteStaff(tabNumber)
               fetchData()
          } catch (error) {
               console.error('Ошибка при удалении:', error)
               alert('Не удалось удалить сотрудника')
          } finally {
               setIsLoading(false)
          }
     }

     const exportToExcel = () => {
          const dataToExport = filteredStaff.map((staffMember) => ({
               ФИО: staffMember.fio || '',
               Логин: staffMember.login || '',
               Должность: staffMember.post || '',
               Служба: getDepartmentById(staffMember.department) || '',
               Телефон: staffMember.telephone || '',
               Email: staffMember.email || '',
               IP: staffMember.ip || '',
               'Табельный номер': staffMember.tabNumber || '',
          }))

          const wb = XLSX.utils.book_new()
          const ws = XLSX.utils.json_to_sheet(dataToExport)

          const columnWidths = [
               { wch: 37 },
               { wch: 15 },
               { wch: 65 },
               { wch: 42 },
               { wch: 8 },
               { wch: 29 },
               { wch: 13 },
               { wch: 16 },
          ]

          ws['!cols'] = columnWidths
          XLSX.utils.book_append_sheet(wb, ws, 'Сотрудники')
          XLSX.writeFile(wb, 'Сотрудники.xlsx')
     }

     if (isLoading && staff.length === 0) {
          return (
               <div className={styles.loadingContainer}>
                    <Spinner animation="border" role="status" className={styles.spinner}>
                         <span className="visually-hidden">Загрузка...</span>
                    </Spinner>
               </div>
          )
     }

     return (
          <div className={styles.container}>
               <div className={styles.buttonsContainer}>
                    <ButtonAll text="Импорт" onClick={() => setModalShow(true)} />
                    <ButtonAll text="Создать" onClick={openCreateModal} />
                    <ButtonAll text="Справочник" onClick={handleSpravClick} />
                    <ButtonAll text="Экспорт" onClick={exportToExcel} />
                    <ButtonAll text="Генератор пароля" onClick={handlePSW} />
                    <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Поиск пользователей..." />
               </div>

               <div className={styles.tableContainer}>
                    {isLoading ? (
                         <div>Загрузка данных...</div>
                    ) : (
                         <div >
                              {sortedStaff.map((staffMember, index) => (
                                   <Card className={styles.cardWidth}>
                                        <div class="row g-0">
                                             <div class="col-md-2 card-header">
                                                  <Circle
                                                       fullName={staffMember.fio}
                                                       employeeId={staffMember.tabNumber}
                                                       size={60}
                                                  />
                                             </div>
                                             <div class="col-md-10">
                                                  <div class="card-body">
                                                       <h5 class="card-title" className={styles.cardWidthFio} >{staffMember.fio}</h5>
                                                       <p class="card-text" className={styles.cardWidthDep}>{getDepartmentById(staffMember.department)}</p>
                                                       <p class="card-text" className={styles.cardWidthDep}>{staffMember.post}</p>
                                                       
                                                  </div>
                                             </div>
                                        </div>
                                   </Card>
                              ))}

                              {/*  <Table striped className={styles.stickyTable}>
                                   <thead> 
                                        <tr className={styles.sortableHeader}>
                                             <th style={{ width: '55px' }}></th>
                                             <th
                                                  onClick={() => handleSort('fio')}
                                                  className={styles.sortableHeader}
                                                  style={{ width: '220px' }}
                                             >
                                                  Ф.И.О.{getSortIndicator('fio')}
                                             </th>
                                             <th style={{ width: '120px' }}>Логин</th>
                                             <th onClick={() => handleSort('post')} className={styles.sortableHeader}>
                                                  Должность{getSortIndicator('post')}
                                             </th>
                                             <th
                                                  onClick={() => handleSort('department')}
                                                  className={styles.sortableHeader}
                                             >
                                                  Служба{getSortIndicator('department')}
                                             </th>
                                             <th style={{ width: '80px' }}>Телефон</th>
                                             <th>Email</th>
                                             <th style={{ width: '120px' }}>IP</th>
                                             <th style={{ width: '90px' }}>Таб №</th>
                                             <th style={{ width: '80px' }}>Действия</th>
                                        </tr>
                                   </thead>
                                   <tbody className={styles.sortableHeader2}>
                                        {sortedStaff.map((staffMember, index) => (
                                             <tr
                                                  key={staffMember.id}
                                                  className={
                                                       String(staffMember.del) === '1' ? styles.tableRowDeleted : ''
                                                  }
                                             >
                                                  <td>
                                                       <Circle
                                                            fullName={staffMember.fio}
                                                            employeeId={staffMember.tabNumber}
                                                            size={45}
                                                       />
                                                  </td>
                                                  <td onClick={handleUserClick(staffMember)} className={styles.fioLink}>
                                                       {staffMember.fio}
                                                  </td>
                                                  <td>{staffMember.login}</td>
                                                  <td>{staffMember.post}</td>
                                                  <td>{getDepartmentById(staffMember.department)}</td>
                                                  <td>{staffMember.telephone}</td>
                                                  <td>{staffMember.email}</td>
                                                  <td>
                                                       {staffMember.ip !== '' && staffMember.ip !== '-' && (
                                                            <>
                                                                 {staffMember.ip}
                                                                 <button
                                                                      className={styles.copyButton}
                                                                      data-clipboard-text={staffMember.ip}
                                                                 >
                                                                      <FaRegCopy
                                                                           size={13}
                                                                           className={styles.copyIcon}
                                                                      />
                                                                 </button>
                                                            </>
                                                       )}
                                                  </td>
                                                  <td>{staffMember.tabNumber}</td>
                                                  <td className={styles.actionsCell}>
                                                       <div className={styles.actionsContainer}>
                                                            <IconBtn
                                                                 icon={RiFileEditLine}
                                                                 onClick={() => handleEditClick(staffMember)}
                                                            />
                                                            <IconBtn
                                                                 icon={MdDeleteForever}
                                                                 onClick={() => handleDelete(staffMember.tabNumber)}
                                                            />
                                                       </div>
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </Table> */}
                         </div>
                    )}
               </div>
               <StaffEditModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    fetchData={fetchData}
                    selectedData={selectedData}
               />
               <StaffCreateModal isOpen={createModalIsOpen} onRequestClose={closeCreateModal} fetchData={fetchData} />
               <StaffImportModal isOpen={modalShow} onRequestClose={closeModalImport} />
          </div>
     )
}

export default Staff
