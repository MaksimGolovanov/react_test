import React, { useState } from 'react'
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
import { CardRoutes } from './features/card'
import { Staff } from './features/staff'
import LoginPage from './features/admin/pages/LoginPage'
import Json from './features/json/pages/json'
import './App.css'

function App() {
     const location = useLocation()
     const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
     
     // Определяем заголовок страницы
     const getPageTitle = () => {
          switch (true) {
               case location.pathname.startsWith('/staff'):
                    return 'ПОЛЬЗОВАТЕЛИ'
               case location.pathname.startsWith('/ipaddress'):
                    return 'УЧЁТ IP'
               case location.pathname.startsWith('/prints'):
                    return 'УЧЁТ ПРИНТЕРОВ'
               case location.pathname.startsWith('/badges'):
                    return 'БЭЙДЖИКИ'
               case location.pathname.startsWith('/usb'):
                    return 'УЧЕТ USB'
               case location.pathname.startsWith('/card'):
                    return 'УЧЕТ КАРТ ДОСТУПА'
               case location.pathname.startsWith('/notes'):
                    return 'ЗАПИСНАЯ КНИЖКА'
               case location.pathname.startsWith('/create-post'):
                    return 'СОЗДАНИЕ ЗАПИСИ'
               case location.pathname.startsWith('/edit-post/'):
                    return 'РЕДАКТИРОВАНИЕ ЗАПИСИ'
               case location.pathname.startsWith('/admin'):
                    return 'АДМИНИСТРИРОВАНИЕ'
               case location.pathname.startsWith('/iuspt'):
                    return 'ИУС П Т'
               case location.pathname.startsWith('/json'):
                    return 'JSON Viewer'
               default:
                    return ''
          }
     }

     return (
          <div className="app-container">
               <NavBar onCollapseChange={setSidebarCollapsed} />
               <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
                    {/* Шапка с заголовком и часами */}
                    <div className="page-header sticky-header">
                         <div className="header-content">
                              <h1 className="page-title">{getPageTitle()}</h1>
                              <div className="header-clock">
                                   <Clock />
                              </div>
                         </div>
                    </div>

                    {/* Основное содержимое страницы */}
                    <div className="content-container">
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
                                   path="/ipaddress/*"
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
                                   path="/usb/*"
                                   element={
                                        <PrivateRoute requiredRole={['ADMIN', 'USB']}>
                                             <UsbRoutes />
                                        </PrivateRoute>
                                   }
                              />
                              <Route
                                   path="/card/*"
                                   element={
                                        <PrivateRoute requiredRole={['ADMIN', 'CARD']}>
                                             <CardRoutes />
                                        </PrivateRoute>
                                   }
                              />
                              <Route
                                   path="/badges/*"
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
          </div>
     )
}

export default App