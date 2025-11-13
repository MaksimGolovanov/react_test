import React from 'react'

import { Routes, Route } from 'react-router-dom'
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

import './App.css' // Убедитесь, что импортируете стили

function App() {
     
     

    

     return (
          <div className="app-container">
               <NavBar />
               <div className="main-content">
                    <div className="d-flex align-items-center justify-content-between head sticky-header">
                         <div>
                              
                         </div>
                         <div className=" d-flex align-items-center clock-bg">
                              <Clock />
                              <ButtonLogout className="ml-3" />
                         </div>
                    </div>

                    <div className="content-wrapper px-2">
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
