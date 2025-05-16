import React, { useEffect, useState, useMemo, useRef } from 'react'
import ClipboardJS from 'clipboard'
import StaffService from '../services/StaffService'
import { BiDownload } from 'react-icons/bi'
import { FaRegCopy } from 'react-icons/fa'
import { RiFileEditLine } from 'react-icons/ri'
import { MdDeleteForever } from 'react-icons/md'
import StaffEditModal from './StaffEditModal'
import StaffImportModal from './StaffImportModal'
import StaffCreateModal from './StaffCreateModal'
import Spinner from 'react-bootstrap/Spinner'
import ButtonAll from '../../ius-pt/components/ButtonAll/ButtonAll'
import Circle from '../../../Components/circle/Circle'
import SearchInput from '../../ius-pt/components/SearchInput/SearchInput'
import styles from './style.module.css'
import { IoCreateOutline } from 'react-icons/io5'
import { TbManualGearbox } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

function Staff() {
     const [staff, setStaff] = useState([])
     const [filteredStaff, setFilteredStaff] = useState([])
     const [searchQuery, setSearchQuery] = useState('')
     const [modalIsOpen, setModalIsOpen] = useState(false)
     const [createModalIsOpen, setCreateModalIsOpen] = useState(false)
     const [selectedData, setSelectedData] = useState('')
     const [modalShow, setModalShow] = useState(false)
     const [sortConfig, setSortConfig] = useState(null)
     const [departmens, setDepatmens] = useState([])
     const [isLoading, setIsLoading] = useState(true)
     const navigate = useNavigate()

     const copyButtonsRef = useRef([])

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
          const departmentCode = String(id).split(' ')[0]
          const foundDepartment = departmens.find((department) => department.code === departmentCode)
          return foundDepartment ? foundDepartment.description : null
     }

     const fetchData = async () => {
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

     const requestSort = (key) => {
          let direction = 'ascending'
          if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
               direction = 'descending'
          }
          setSortConfig({ key, direction })
     }

     const sortedStaff = useMemo(() => {
          let sortedData = [...filteredStaff]
          if (sortConfig !== null) {
               sortedData.sort((a, b) => {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                         return sortConfig.direction === 'ascending' ? -1 : 1
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                         return sortConfig.direction === 'ascending' ? 1 : -1
                    }
                    return 0
               })
          }
          return sortedData
     }, [filteredStaff, sortConfig])

     const handleSpravClick = () => navigate('/staff/sprav')

     const handleDelete = async (tabNumber) => {
          if (!window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) return

          try {
               await StaffService.deleteStaff(tabNumber)
               const updatedStaff = staff.filter((member) => member.tabNumber !== tabNumber)
               setStaff(updatedStaff)
               setFilteredStaff(updatedStaff)
          } catch (error) {
               console.error('Ошибка при удалении:', error)
               alert('Не удалось удалить сотрудника')
          }
     }

     if (isLoading) {
          return (
               <div className={styles.loadingContainer}>
                    <Spinner animation="border" role="status" className={styles.spinner}>
                         <span className="visually-hidden">Загрузка...</span>
                    </Spinner>
               </div>
          )
     }

     return (
          <div>
               <div className={styles.buttonsContainer}>
                    <ButtonAll text="Импорт" icon={BiDownload} onClick={() => setModalShow(true)} />
                    <ButtonAll text="Создать" icon={IoCreateOutline} onClick={openCreateModal} />
                    <ButtonAll text="Справочник" icon={TbManualGearbox} onClick={handleSpravClick} />
               </div>
               <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Поиск пользователей..." />

               <div className={styles.tableContainer}>
                    <table className={styles.table}>
                         <thead className={styles.headTable}>
                              <tr>
                                   <th style={{ width: '45px' }}></th>
                                   <th onClick={() => requestSort('fio')}>
                                        Фамилия Имя Отчество
                                        {sortConfig?.key === 'fio' &&
                                             (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓')}
                                   </th>
                                   <th style={{ width: '120px' }}>Логин</th>
                                   <th onClick={() => requestSort('post')}>
                                        Должность
                                        {sortConfig?.key === 'post' &&
                                             (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓')}
                                   </th>
                                   <th onClick={() => requestSort('department')}>
                                        Служба
                                        {sortConfig?.key === 'department' &&
                                             (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓')}
                                   </th>
                                   <th style={{ width: '80px' }}>Телефон</th>
                                   <th>Email</th>
                                   <th style={{ width: '120px' }}>IP</th>
                                   <th style={{ width: '90px' }}>Табельный номер</th>
                                   <th style={{ width: '80px' }}></th>
                              </tr>
                         </thead>
                         <tbody className={styles.bodyTable}>
                              {sortedStaff.map((staffMember, index) => (
                                   <tr
                                        key={staffMember.id}
                                        className={String(staffMember.del) === '1' ? styles.tableRowDeleted : ''}
                                   >
                                        <td>
                                             <div>
                                                  <Circle fullName={staffMember.fio} size={30} />
                                             </div>
                                        </td>
                                        <td>{staffMember.fio}</td>
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
                                                            ref={(el) => (copyButtonsRef.current[index] = el)}
                                                       >
                                                            <FaRegCopy size={13} className={styles.copyIcon} />
                                                       </button>
                                                  </>
                                             )}
                                        </td>
                                        <td>{staffMember.tabNumber}</td>
                                        <td>
                                             <button
                                                  className={styles.editButton}
                                                  onClick={() => handleEditClick(staffMember)}
                                             >
                                                  <RiFileEditLine size={20} />
                                             </button>
                                             <button
                                                  className={styles.deleteButton}
                                                  onClick={() => handleDelete(staffMember.tabNumber)}
                                             >
                                                  <MdDeleteForever size={24} className={styles.deleteIcon} />
                                             </button>
                                             <button
                                                  onClick={() => navigate('badge', { state: { staffMember } })}
                                                  className={styles.badgeButton}
                                             >
                                                  Бейджик
                                             </button>
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
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
