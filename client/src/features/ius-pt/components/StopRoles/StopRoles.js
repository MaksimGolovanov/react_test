import React, { useEffect, useState, useMemo } from 'react'
import iusPtStore from '../../store/IusPtStore'
import { observer } from 'mobx-react-lite'
import styles from './style.module.css'
import SearchInput from '../SearchInput/SearchInput'
import ButtonAll from '../ButtonAll/ButtonAll'
import { IoCreateOutline } from 'react-icons/io5'

const StopRoles = observer(() => {
     const [searchQuery, setSearchQuery] = useState('')
     const [isLoading, setIsLoading] = useState(true)
     const [error, setError] = useState(null)
     const [editingId, setEditingId] = useState(null)
     const [isCreating, setIsCreating] = useState(false)
     const [editForm, setEditForm] = useState({
          CodName: '',
          Description: '',
          CanDoWithoutApproval: '',
          Owner: '',
          Note: '',
          Approvers: '',
     })

     useEffect(() => {
          const fetchData = async () => {
               try {
                    await iusPtStore.fetchStopRoles()
               } catch (err) {
                    setError(err)
               } finally {
                    setIsLoading(false)
               }
          }

          fetchData()
     }, [])

     const filteredStopRoles = useMemo(() => {
          return iusPtStore.stopRoles.filter((stoproles) => {
               const searchLower = searchQuery.toLowerCase()
               return (
                    stoproles.CodName.toLowerCase().includes(searchLower) ||
                    stoproles.Description.toLowerCase().includes(searchLower) ||
                    (stoproles.CanDoWithoutApproval &&
                         stoproles.CanDoWithoutApproval.toLowerCase().includes(searchLower)) ||
                    (stoproles.Owner && stoproles.Owner.toLowerCase().includes(searchLower)) ||
                    (stoproles.Note && stoproles.Note.toLowerCase().includes(searchLower)) ||
                    (stoproles.Approvers && stoproles.Approvers.toLowerCase().includes(searchLower))
               )
          })
     }, [searchQuery, iusPtStore.stopRoles])

     const sortedStopRoles = useMemo(() => {
          return [...filteredStopRoles].sort((a, b) => {
               if (a.CodName < b.CodName) return -1
               if (a.CodName > b.CodName) return 1
               return 0
          })
     }, [filteredStopRoles])

     const handleEdit = (stopRole) => {
          setIsCreating(false)
          setEditingId(stopRole.id)
          setEditForm({
               CodName: stopRole.CodName,
               Description: stopRole.Description,
               CanDoWithoutApproval: stopRole.CanDoWithoutApproval || '',
               Owner: stopRole.Owner || '',
               Note: stopRole.Note || '',
               Approvers: stopRole.Approvers || '',
          })
     }

     const handleCreateNew = () => {
          setEditingId(null)
          setIsCreating(true)
          setEditForm({
               CodName: '',
               Description: '',
               CanDoWithoutApproval: '',
               Owner: '',
               Note: '',
               Approvers: '',
          })
     }

     const handleCancel = () => {
          setEditingId(null)
          setIsCreating(false)
     }

     const handleSave = async () => {
          try {
               if (editingId) {
                    await iusPtStore.updateStopRole(editingId, editForm)
               } else {
                    await iusPtStore.createStopRole(editForm)
               }
               setEditingId(null)
               setIsCreating(false)
          } catch (err) {
               setError(err)
          }
     }

     const handleDelete = async (id) => {
          if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
               try {
                    await iusPtStore.deleteStopRole(id)
               } catch (err) {
                    setError(err)
               }
          }
     }

     const handleInputChange = (e) => {
          const { name, value } = e.target
          setEditForm((prev) => ({
               ...prev,
               [name]: value,
          }))
     }

     if (isLoading) {
          return <div>Загрузка...</div>
     }

     if (error) {
          return <div>Ошибка: {error.message}</div>
     }

     return (
          <>
               <ButtonAll icon={IoCreateOutline} text="Добавить Стоп-роль" onClick={() => handleCreateNew()} />
               <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Поиск Стоп-Ролей..." />

               <div className={styles.tableContainer}>
                    <table className={styles.table}>
                         <thead className={styles.headTable}>
                              <tr>
                                   <th>Роль</th>
                                   <th>Краткое описание роли</th>
                                   <th>Кому можно без согласования</th>
                                   <th>Владелец</th>
                                   <th>Примечание</th>
                                   <th>Согласующие</th>
                                   <th>Действия</th>
                              </tr>
                         </thead>
                         <tbody className={styles.bodyTable}>
                              {/* Форма создания новой записи */}
                              {isCreating && (
                                   <tr className={styles.editingRow}>
                                        <td>
                                             <input
                                                  name="CodName"
                                                  value={editForm.CodName}
                                                  onChange={handleInputChange}
                                                  className={styles.editInput}
                                             />
                                        </td>
                                        <td>
                                             <input
                                                  name="Description"
                                                  value={editForm.Description}
                                                  onChange={handleInputChange}
                                                  className={styles.editInput}
                                             />
                                        </td>
                                        <td>
                                             <input
                                                  name="CanDoWithoutApproval"
                                                  value={editForm.CanDoWithoutApproval}
                                                  onChange={handleInputChange}
                                                  className={styles.editInput}
                                             />
                                        </td>
                                        <td>
                                             <input
                                                  name="Owner"
                                                  value={editForm.Owner}
                                                  onChange={handleInputChange}
                                                  className={styles.editInput}
                                             />
                                        </td>
                                        <td>
                                             <input
                                                  name="Note"
                                                  value={editForm.Note}
                                                  onChange={handleInputChange}
                                                  className={styles.editInput}
                                             />
                                        </td>
                                        <td>
                                             <input
                                                  name="Approvers"
                                                  value={editForm.Approvers}
                                                  onChange={handleInputChange}
                                                  className={styles.editInput}
                                             />
                                        </td>
                                        <td>
                                             <button onClick={handleSave} className={styles.saveBtn}>
                                                  Сохранить
                                             </button>
                                             <button onClick={handleCancel} className={styles.cancelBtn}>
                                                  Отмена
                                             </button>
                                        </td>
                                   </tr>
                              )}

                              {/* Список существующих записей */}
                              {sortedStopRoles.map((stopRole) => (
                                   <tr key={stopRole.id}>
                                        {editingId === stopRole.id ? (
                                             <>
                                                  <td>
                                                       <input
                                                            name="CodName"
                                                            value={editForm.CodName}
                                                            onChange={handleInputChange}
                                                            className={styles.editInput}
                                                       />
                                                  </td>
                                                  <td>
                                                       <input
                                                            name="Description"
                                                            value={editForm.Description}
                                                            onChange={handleInputChange}
                                                            className={styles.editInput}
                                                       />
                                                  </td>
                                                  <td>
                                                       <input
                                                            name="CanDoWithoutApproval"
                                                            value={editForm.CanDoWithoutApproval}
                                                            onChange={handleInputChange}
                                                            className={styles.editInput}
                                                       />
                                                  </td>
                                                  <td>
                                                       <input
                                                            name="Owner"
                                                            value={editForm.Owner}
                                                            onChange={handleInputChange}
                                                            className={styles.editInput}
                                                       />
                                                  </td>
                                                  <td>
                                                       <input
                                                            name="Note"
                                                            value={editForm.Note}
                                                            onChange={handleInputChange}
                                                            className={styles.editInput}
                                                       />
                                                  </td>
                                                  <td>
                                                       <input
                                                            name="Approvers"
                                                            value={editForm.Approvers}
                                                            onChange={handleInputChange}
                                                            className={styles.editInput}
                                                       />
                                                  </td>
                                                  <td>
                                                       <button onClick={handleSave} className={styles.saveBtn}>
                                                            Сохранить
                                                       </button>
                                                       <button onClick={handleCancel} className={styles.cancelBtn}>
                                                            Отмена
                                                       </button>
                                                  </td>
                                             </>
                                        ) : (
                                             <>
                                                  <td>{stopRole.CodName}</td>
                                                  <td>{stopRole.Description}</td>
                                                  <td>{stopRole.CanDoWithoutApproval || '-'}</td>
                                                  <td>{stopRole.Owner || '-'}</td>
                                                  <td>{stopRole.Note || '-'}</td>
                                                  <td>{stopRole.Approvers || '-'}</td>
                                                  <td>
                                                       <button
                                                            onClick={() => handleEdit(stopRole)}
                                                            className={styles.editBtn}
                                                       >
                                                            Редактировать
                                                       </button>
                                                       <button
                                                            onClick={() => handleDelete(stopRole.id)}
                                                            className={styles.deleteBtn}
                                                       >
                                                            Удалить
                                                       </button>
                                                  </td>
                                             </>
                                        )}
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               </div>
          </>
     )
})

export default StopRoles
