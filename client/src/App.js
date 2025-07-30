import React from 'react'

import { Container } from 'react-bootstrap'
import { useLocation, Routes, Route } from 'react-router-dom'
import Clock from './Components/Clock'
import NavBar from './Components/NavBar/NavBar'
import PrivateRoute from './shared/PrivateRoute'
import { Prints } from './features/prints'
import { NotesRoutes } from './features/notes'
import { IusPtRoutes } from './features/ius-pt'
import { StaffRoutes } from './features/staff'
import { AdminRoutes } from './features/admin'
import { IpRoutes } from './features/ip'
import { BadgesRoutes } from './features/badges'
import { UsbRoutes } from './features/usb'


import { Staff } from './features/staff'
import LoginPage from './features/admin/pages/LoginPage'
import ButtonLogout from './Components/button/buttonLogout'

import Json from './features/json/pages/json'

function App() {
     const location = useLocation()
     let pageTitle

     switch (true) {
          case location.pathname.startsWith('/staff'):
               pageTitle = 'ПОЛЬЗОВАТЕЛИ'
               break
          case location.pathname.startsWith('/ipaddress'):
               pageTitle = 'УЧЁТ IP'
               break
          case location.pathname.startsWith('/prints'):
               pageTitle = 'УЧЁТ ПРИНТЕРОВ'
               break
          case location.pathname.startsWith('/badges'):
               pageTitle = 'БЭЙДЖИК'
               break
       
          case location.pathname.startsWith('/usb'):
               pageTitle = 'УЧЕТ USB'
               break
          case location.pathname.startsWith('/notes'):
               pageTitle = 'ЗАПИСНАЯ КНИЖКА'
               break
          case location.pathname.startsWith('/create-post'):
               pageTitle = 'СОЗДАНИЕ ЗАПИСИ'
               break
          case location.pathname.startsWith('/edit-post/'):
               pageTitle = 'РЕДАКТИРОВАНИЕ ЗАПИСИ'
               break
          case location.pathname.startsWith('/admin'):
               pageTitle = 'АДМИНИСТРИРОВАНИЕ'
               break
          case location.pathname.startsWith('/iuspt'):
               pageTitle = 'ИУС П Т'
               break

          case location.pathname.startsWith('/json'):
               pageTitle = 'JSON Viewer'
               break

          default:
               pageTitle = ''
     }

     return (
          <Container fluid className="d-flex flex-row h-100 m-0 p-0">
               <div>
                    <NavBar />
               </div>
               <div className="flex-fill ">
                    <div className="d-flex flex-fill align-items-center justify-content-between head sticky-header">
                         <div>
                              <p
                                   className="m-2"
                                   style={{ fontWeight: 'bold', color: '#707070', fontSize: '36px', lineHeight: '1.0' }}
                              >
                                   {pageTitle}
                              </p>
                         </div>
                         <div className="m-2 d-flex align-items-center">
                              <Clock />
                              <ButtonLogout className="ml-3" />
                         </div>
                    </div>

                    <div className="content p-2">
                         <Routes>
                              <Route
                                   path="/"
                                   element={
                                        <PrivateRoute requiredRole={['ADMIN', 'USER']}>
                                             <Staff />
                                        </PrivateRoute>
                                   }
                              />
                              <Route path="/staff/*" element={<StaffRoutes />} />
                              <Route
                                   path="/ipaddress"
                                   element={
                                        <PrivateRoute requiredRole={['ADMIN', 'IP']}>
                                             <IpRoutes />
                                        </PrivateRoute>
                                   }
                              />
                              <Route
                                   path="/prints"
                                   element={
                                        <PrivateRoute requiredRole={['ADMIN', 'PRINT']}>
                                             <Prints />
                                        </PrivateRoute>
                                   }
                              />
                              <Route
                                   path="/usb"
                                   element={
                                        <PrivateRoute requiredRole={['ADMIN', 'USB']}>
                                             <UsbRoutes />
                                        </PrivateRoute>
                                   }
                              />
                        
                              <Route
                                   path="/badges"
                                   element={
                                        <PrivateRoute requiredRole={['ADMIN', 'BADGES']}>
                                             <BadgesRoutes />
                                        </PrivateRoute>
                                   }
                              />

                              <Route
                                   path="/notes/*"
                                   element={
                                        <PrivateRoute requiredRole={['ADMIN', 'NOTES']}>
                                             <NotesRoutes />
                                        </PrivateRoute>
                                   }
                              />
                              <Route
                                   path="/admin/*"
                                   element={
                                        <PrivateRoute requiredRole={['ADMIN']}>
                                             <AdminRoutes />
                                        </PrivateRoute>
                                   }
                              />

                              <Route
                                   path="/iuspt/*"
                                   element={
                                        <PrivateRoute requiredRole={['ADMIN', 'IUSPT']}>
                                             <IusPtRoutes />
                                        </PrivateRoute>
                                   }
                              />
                              <Route path="/login" element={<LoginPage />} />
                              <Route
                                   path="/json"
                                   element={
                                        <PrivateRoute requiredRole={['ADMIN']}>
                                             <Json />
                                        </PrivateRoute>
                                   }
                              />
                         </Routes>
                    </div>
               </div>
          </Container>
     )
}

export default App
