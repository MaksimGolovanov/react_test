import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { IoIosCreate } from 'react-icons/io'
import NoteService from '../services/NoteService'
import { FaEdit, FaTrashAlt } from 'react-icons/fa' // Импортируем иконки редактирования и удаления
import draftToHtml from 'draftjs-to-html'
import ClipboardJS from 'clipboard'

import { Button, Card, Container, FormControl, InputGroup, Row } from 'react-bootstrap'
import './Notes.css'
function Notes() {
     const [posts, setPosts] = useState([])
     const [searchTerm, setSearchTerm] = useState('') // Состояние для хранения значения поиска
     const [filteredPosts, setFilteredPosts] = useState([]) // Посты после фильтрации
     const navigate = useNavigate()
     useEffect(() => {
          const fetchPosts = async () => {
               try {
                    const response = await NoteService.fetchPosts()
                    const postsData = response.map((post) => ({
                         ...post,
                         body: JSON.parse(post.body),
                    }))

                    setPosts(postsData)
                    setFilteredPosts(postsData) // Изначально отфильтрованные посты равны всем постам
               } catch (error) {
                    console.log(error)
               }
          }
          fetchPosts()
     }, [])

     const handleSearchChange = (event) => {
          setSearchTerm(event.target.value)
          filterPosts(event.target.value)
     }

     // Функция фильтрации постов
     const filterPosts = (searchValue) => {
          if (!searchValue || searchValue.trim().length === 0) {
               setFilteredPosts(posts) // Если поиск пустой, показываем все посты
          } else {
               const filtered = posts.filter((post) => post.title.toLowerCase().includes(searchValue.toLowerCase()))
               setFilteredPosts(filtered)
          }
     }

     useEffect(() => {
          const clipboard = new ClipboardJS('.copy-button', {
               target: function (trigger) {
                    return trigger.nextElementSibling // Получение следующего элемента (<pre>)
               },
          })

          return () => {
               clipboard.destroy() // Очистка ресурсов при размонтаже компонента
          }
     }, [])

     // Метод для редактирования заметки
     const editPost = (id) => {
          console.log(`Редактируем заметку с ID: ${id}`)
          navigate(`/notes/edit-post/${id}`) // Переход на страницу редактирования
     }

     // Метод для удаления заметки
     const deletePost = async (id) => {
          if (window.confirm('Вы уверены, что хотите удалить эту заметку?')) {
               try {
                    await NoteService.deletePost(id)
                    const updatedPosts = posts.filter((post) => post.id !== id)
                    setPosts(updatedPosts)
                    setFilteredPosts(updatedPosts)
               } catch (error) {
                    console.error('Ошибка при удалении заметки:', error)
               }
          }
     }

     return (
          <Container>
               <Row>
                    <NavLink to="/notes/create-post">
                         <Button className="button-next float-end ms-auto mb-3">
                              <IoIosCreate className="icon-staff" size={20} style={{ marginRight: '8px' }} />
                              Создать
                         </Button>
                    </NavLink>
               </Row>
               <InputGroup className="mb-3">
                    <FormControl placeholder="Поиск по заголовку..." value={searchTerm} onChange={handleSearchChange} />
               </InputGroup>
               <Row>
                    <div className="card-container" style={{ maxHeight: '710px', overflowY: 'auto' }}>
                         {filteredPosts.map((post) => (
                              <Card className="mb-3">
                                   <Card.Body>
                                        <Card.Title>
                                             {post.title}
                                             <div style={{ float: 'right' }}>
                                                  <FaEdit
                                                       className="edit-icon mr-2 "
                                                       size={14}
                                                       title="Редактировать"
                                                       onClick={() => editPost(post.id)}
                                                  />
                                                  <FaTrashAlt
                                                       className="delete-icon ml-2"
                                                       size={14}
                                                       title="Удалить"
                                                       onClick={() => deletePost(post.id)}
                                                  />
                                             </div>
                                        </Card.Title>
                                        <Card.Text
                                             dangerouslySetInnerHTML={{
                                                  __html: draftToHtml(post.body).replace(
                                                       /(<pre>)/g,
                                                       `<span class="code-block">$1<span class="copy-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></span></span>`
                                                  ),
                                             }}
                                        ></Card.Text>
                                   </Card.Body>
                              </Card>
                         ))}
                    </div>
               </Row>
          </Container>
     )
}

export default Notes
