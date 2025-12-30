import React, { useState, useEffect } from 'react'
import { useLocation, Routes, Route, Navigate } from 'react-router-dom'
import Clock from '../Components/Clock'
import NavBar from '../Components/NavBar/NavBar'
import PrivateRoute from '../shared/PrivateRoute'
import { Prints } from '../features/prints'
import { NotesRoutes } from '../features/notes'
import { IusPtRoutes } from '../features/ius-pt'
import { StaffRoutes } from '../features/staff'
import { AdminRoutes } from '../features/admin'
import { IpRoutes } from '../features/ip'
import { BadgesRoutes } from '../features/badges'
import { UsbRoutes } from '../features/usb'
import { CardRoutes } from '../features/card'
import { SecurityTrainingRoutes } from '../features/security-training/routes'
import LoginPage from '../features/admin/pages/LoginPage'
import Json from '../features/json/pages/JsonViewer'
import './App.css'
import userStore from '../features/admin/store/UserStore'
import { observer } from 'mobx-react-lite'

// Компонент для определения первой доступной страницы
const FirstAvailablePage = observer(() => {
     const userRoles = userStore.userRolesAuth || []

     // Порядок проверки маршрутов (от более приоритетных к менее)
     const routesPriority = [
          { path: '/staff', roles: ['ADMIN', 'USER'] },
          { path: '/ipaddress', roles: ['ADMIN', 'IP'] },
          { path: '/prints', roles: ['ADMIN', 'PRINT'] },
          { path: '/badges', roles: ['ADMIN', 'BADGES'] },
          { path: '/usb', roles: ['ADMIN', 'USB'] },
          { path: '/card', roles: ['ADMIN', 'CARD'] },
          { path: '/notes', roles: ['ADMIN', 'NOTES'] },
          { path: '/iuspt', roles: ['ADMIN', 'IUSPT'] },
          { path: '/admin', roles: ['ADMIN'] },
          { path: '/json', roles: ['ADMIN'] },
          { path: '/security-training', roles: ['ADMIN', 'ST','ST-ADMIN'] },
     ]

     // Находим первую доступную страницу
     const getFirstAvailablePath = () => {
          console.log('Available roles:', userRoles)

          for (const route of routesPriority) {
               console.log(`Checking route: ${route.path}, required roles: ${route.roles}`)
               if (route.roles.some((role) => userRoles.includes(role))) {
                    console.log(`First available page: ${route.path}`)
                    return route.path
               }
          }
          console.log('No available pages found')
          return '/login'
     }

     const firstPath = getFirstAvailablePath()

     return <Navigate to={firstPath} replace />
})

function App() {
     const location = useLocation()
     const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

     useEffect(() => {
          userStore.fetchUsers()
     }, [])

     // Определяем заголовок страницы
     const getPageTitle = () => {
          switch (true) {
               case location.pathname === '/' || location.pathname === '/staff':
                    return 'ПОЛЬЗОВАТЕЛИ'
               case location.pathname.startsWith('/staff/'):
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
               case location.pathname.startsWith('/security-training'):
                    return 'Информационная безопасность'
               default:
                    return 'ГЛАВНАЯ'
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
                              {/* Основной маршрут / - всегда редиректит на первую доступную страницу */}
                              <Route
                                   path="/"
                                   element={
                                        <PrivateRoute
                                             requiredRole={[
                                                  'ADMIN',
                                                  'USER',
                                                  'IP',
                                                  'PRINT',
                                                  'BADGES',
                                                  'USB',
                                                  'CARD',
                                                  'NOTES',
                                                  'IUSPT',
                                                  'ST',
                                                  'ST-ADMIN'
                                             ]}
                                        >
                                             <FirstAvailablePage />
                                        </PrivateRoute>
                                   }
                              />

                              {/* Маршрут /staff должен быть доступен только для ADMIN и USER */}
                              <Route
                                   path="/staff/*"
                                   element={
                                        <PrivateRoute requiredRole={['ADMIN', 'USER']}>
                                             <StaffRoutes />
                                        </PrivateRoute>
                                   }
                              />

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
                              <Route
                                   path="/security-training/*"
                                   element={
                                        <PrivateRoute requiredRole={['ADMIN', 'ST', 'ST-ADMIN']}>
                                             <SecurityTrainingRoutes />
                                        </PrivateRoute>
                                   }
                              />
                              {/* Редирект для несуществующих маршрутов */}
                              <Route
                                   path="*"
                                   element={
                                        <PrivateRoute
                                             requiredRole={[
                                                  'ADMIN',
                                                  'USER',
                                                  'IP',
                                                  'PRINT',
                                                  'BADGES',
                                                  'USB',
                                                  'CARD',
                                                  'NOTES',
                                                  'IUSPT',
                                                  'ST',
                                                  'ST-ADMIN'
                                             ]}
                                        >
                                             <Navigate to="/" replace />
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
